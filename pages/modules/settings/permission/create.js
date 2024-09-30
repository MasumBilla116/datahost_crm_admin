import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Textarea from "react-expanding-textarea";
import Switch from "react-switch";
import { Button, Form, Label, Select2, TextInput } from "../../../../components";
import Axios from "../../../../utils/axios";


const module_options = [
  { value: "hrm", label: "HRM", name: "module_id" },
  { value: "account", label: "ACCOUNTS", name: "module_id" },
  { value: "inv", label: "INVENTORY", name: "module_id" },
  { value: "booking", label: "BOOKING", name: "module_id" },
  { value: "customer", label: "CUSTOMERS", name: "module_id" },
  { value: "rbm", label: "MANAGE ROOM", name: "module_id" },
  { value: "pms", label: "PURCHASE", name: "module_id" },
  { value: "psm", label: "PAYMENT", name: "module_id" },
  { value: "lms", label: "MANAGE LOCKER", name: "module_id" },  
  { value: "tms", label: "MANAGE TRANSPORT", name: "module_id" },
  { value: "rms", label: "MANAGE RESTAURANT", name: "module_id" },
  { value: "drm", label: "DUTY ROSTER", name: "module_id" },
  { value: "rsm", label: "MANAGE RESERVATION", name: "module_id" },
  { value: "hkm", label: "MANAGE HOUSEKEEPING", name: "module_id" },
  { value: "setting", label: "SETTINGS", name: "module_id" },
];

const AddPermission = () => {
  const [value, setValue] = useState({});
  const [head, setHead] = useState(false);
  const [disableList, setDisableList] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const router = useRouter();
  let selected_obj_length = Object.values(value).length;

  const { http } = Axios();
  const {notify} = MyToast();


  const [option,setOption] = useState([]);

  const treeFilterData = function (jsonData,level="") {

    for (const parent of jsonData) {
       if (parent.children) {
        setOption((prev)=>([...prev,{
          value:parent.id,
          label:level+parent.title
        }]));
     
        treeFilterData(parent.children,level+"--");
      } else {
        setOption((prev)=>([...prev,{value:parent.id, label:level+parent.title}]));

      }
    }

  }


useEffect(()=>{

  let isSubscribed = true;
  const getPermissions = async () => {
    const body= {
      action: "getPermissionsTreeList",
      module_id:value?.module_id
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
        body
      )
      .then((result) => {
        if(isSubscribed){
          
          // setPermissions(result.data.data);
          treeFilterData(result.data.data);
        }
       
      })
      .catch((e)=>console.log(e));
  }

  getPermissions();
  return ()=>isSubscribed = false;
},[value?.module_id])


  async function submitForm(e) {
    e.preventDefault();
    //console.dir(value)
    let body = {};
    if (head) {
      body = {
        action: "createAccessPermission",
        title: value.title,
        access_code: value.access_code,
        module: value.module_id,
        description: value.description,
        parent_id: null
      };
    } else {
      body = {
        action: "createAccessPermission",
        title: value.title,
        access_code: value.access_code,
        module: value.module_id,
        description: value.description,
        parent_id: value.access_id
      };
    }

    await http.post(
      `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
      body
    ).then((res)=>{
      e.target.reset();
      setOption([]);
      setValue({});
      setHead(false);
      notify("success","New permission has been created !");
      router.push(`/modules/settings/permission`);
    }).catch((e)=>{
        const msg = e.response?.data?.response;
  
        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        } else {
          if (msg?.title) {
            notify("error", `permission title should not be empty !`);
          }
      }
       
      });
  }

  const changeHandleSelectBox = () => {
    setDisableList(!disableList);
    setHead(!head);
  };

  const changeHandler = (e) => {
      setValue({ ...value, [e.target?.name]: e.target?.value });
  };


  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-8 offset-md-2 p-xs-2" >
            <div className="card m-xs-2">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Permission</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <TextInput
                    label="Access Title"
                    placeholder="Access Title"
                    onChange={changeHandler}
                    name="title"
                    type="text"
                  />
                  <TextInput
                    label="Access Code"
                    placeholder="Access Title"
                    onChange={changeHandler}
                    name="access_code"
                    type="text"
                  />
                  <div className="mb-3 row">
                    <Label text="Module" />
                    <div className="col-sm-10">
                  
                      <Select2
                        maxMenuHeight={200}
                        options={module_options}
                        onChange={(e)=>{
                          setValue((prev)=>({...prev, module_id:e.value}));
                          setOption([]);
                
                        }}
                        name="module_id"
                      />
              
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <Label text="Head" />
                    <div className="col-sm-10">
                      <Switch
                        onChange={changeHandleSelectBox}
                        checked={head}
                        name="parent_node"
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <Label text="Access" />
                    <div className="col-sm-10">
                  
                      <Select2
                        isDisabled={disableList}
                        options={ option && option.map(
                          ({ value, label }) => ({ value: value, label: label })
                        )}
                        onChange={(e)=>setValue((prev)=>({...prev, access_id:e.value}))}
                        name="access_id"
                        maxMenuHeight={150}
                      />
               
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <Label text="Description" />
                    <div className="col-sm-10">
                      <Textarea
                        className="textarea form-control"
                        // defaultValue="Write Descriptions..."
                        id="my-textarea"
                        onChange={changeHandler}
                        placeholder="Enter additional notes..."
                        name="description"
                      />
                    </div>
                  </div>
               
                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-info">Save</Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPermission;
