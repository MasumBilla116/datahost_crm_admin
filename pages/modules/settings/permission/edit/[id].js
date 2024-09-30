import { useEffect, useState,useCallback } from "react";
import { useRouter } from "next/router";
import Textarea from "react-expanding-textarea";
import Switch from "react-switch";
import { Button } from "../../../../../components";
import { Form, Label, Select2, TextInput } from "../../../../../components/";
import Axios from "../../../../../utils/axios";
import TreeViewData from "../../../../../utils/TreeViewJsonData";
import MyToast from "@mdrakibul8001/toastify";


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
  const [module_value, setModuleValue] = useState("");
  const [permission_status, setStatus] = useState(false);
  const [head, setHead] = useState(false);
  const [disableList, setDisableList] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permissionInfo,setPermissionInfo]=useState({});

  let objLength = Object.keys(permissionInfo).length;


  const { http } = Axios();
  const {notify} = MyToast();

  const router = useRouter();
  const {
    isReady,
    query: {
      id,
    }
  } = router;


const getPermissionInfo=useCallback(async()=>{
    if(!isReady){
      console.log('fetching...')
      return;
    }

    let isSubscribed = true;

    const body = {
        action: "AccessPermissionInfo",
        permission_id:id
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
          body
        )
        .then((result) => {
          if(isSubscribed){
  
              let res = result.data.data;
              setPermissionInfo(result.data.data);
              setValue((prev)=>({
                  ...prev,
                  title:res?.title,
                  access_code:res?.access_code,
                  module_id:res?.module,
                  access_id:res?.parent_id,
                  description:res?.description,
  
              }))
              if(result.data.data.parent_id === null){
                  setHead(true);
              }
              else{
                  setHead(false);
              }
          }
          
        }).catch((e)=>console.log(e));

    return ()=> isSubscribed=false;

  },[isReady,id]);

  useEffect(()=>{
    getPermissionInfo();
  },[getPermissionInfo])


useEffect(()=>{
  const getPermissions = async () => {
    const body = {
      action: "getPermissionsTreeList",
      module_id:value?.module_id
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
        body
      )
      .then((result) => {
        // setPermissions(result.data.data);
        treeFilterData(result.data.data);
        
      })
      .catch((e)=>console.log(e));
  }
  getPermissions();
},[value?.module_id]);


const changeHandleSelectBox = () => {
    setDisableList(!disableList);
    setHead(!head);
  };

  const changeHandler = (e) => {
      setValue({ ...value, [e.target?.name]: e.target?.value });
  };

  const [selected_module, setSelectedModule] = useState({});
  let selected_module_length = Object.values(selected_module).length;
//   console.log(selected_module_length);

  useEffect(()=>{
    objLength !== 0 && module_options && module_options.map((moduleVal,index)=>{
     
        if(permissionInfo?.module?.toLowerCase() === moduleVal.value){

            setSelectedModule((prev)=>({
                ...prev,
              value:moduleVal.value ,
              label:moduleVal.label 
            }));
        }
         
      })
  },[objLength]);


  const [option,setOption] = useState([]);
  const [selected_option,setSelectedOption] = useState({});
  let selected_obj_length = Object.values(selected_option).length;

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

    option.length && option.map((permission,index)=>{
     
        if(permissionInfo?.parent_id === permission.value){

            setSelectedOption((prev)=>({
                ...prev,
              value:permission.value ,
              label:permission.label 
            }));
        }
         
      })

  },[option.length]);



  async function submitForm(e) {
    e.preventDefault();
    //console.dir(value)
    let body= {};
    if (head) {
      body = {
        action: "editAccessPermission",
        permission_id:id,
        title: value.title,
        access_code: value.access_code,
        module: value.module_id,
        description: value.description,
        parent_id: null
      };
    } else {
      body = {
        action: "editAccessPermission",
        permission_id:id,
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
      getPermissionInfo();
      notify('success','Permission has been updated !');
      router.push(`/modules/settings/permission`);
    }).catch((e)=>{
    //   console.log(e)
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





  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Update Permission</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <TextInput
                    label="Access Title"
                    placeholder="Access Title"
                    onChange={changeHandler}
                    name="title"
                    defaultValue={permissionInfo?.title}
                    type="text"
                  />
                  <TextInput
                    label="Access Code"
                    placeholder="Access Title"
                    onChange={changeHandler}
                    name="access_code"
                    defaultValue={permissionInfo?.access_code}
                    type="text"
                  />
                  <div className="mb-3 row">
                    <Label text="Module" />
                    <div className="col-sm-10">
                        {selected_module_length === 0 && (<>
                            <Select2
                                maxMenuHeight={200}
                                options={module_options}
                                onChange={(e)=>{
                                setValue((prev)=>({...prev, module_id:e.value}));
                                setOption([]);
                        
                                }}
                                name="module_id"
                            />
                        </>)}

                        {selected_module_length !== 0 && (<>
                            <Select2
                                maxMenuHeight={200}
                                options={module_options}
                                defaultValue={selected_module}
                                onChange={(e)=>{
                                setValue((prev)=>({...prev, module_id:e.value}));
                                setOption([]);
                        
                                }}
                                name="module_id"
                            />
                        </>)}
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
                        {selected_obj_length === 0  && (<>
                            <Select2
                                isDisabled={head}
                                options={option}
                                onChange={(e)=>setValue((prev)=>({...prev, access_id:e.value}))}
                                name="access_id"
                                maxMenuHeight={150}
                            />
                        </>)
                        }

                        {selected_obj_length !== 0 && (<>
                            <Select2
                                isDisabled={head}
                                options={option}
                                defaultValue={selected_option}
                                onChange={(e)=>setValue((prev)=>({...prev, access_id:e.value}))}
                                name="access_id"
                                maxMenuHeight={150}
                            />
                        </>)
                        }
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <Label text="Description" />
                    <div className="col-sm-10">
                      <Textarea
                        className="textarea form-control"
                        defaultValue={permissionInfo?.description}
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
