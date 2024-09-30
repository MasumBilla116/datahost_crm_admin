import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import Textarea from "react-expanding-textarea";
import { Button, Form, Label, TextInput } from "../../../../components";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";
export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.mng_rl" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const AddRole = ({accessPermissions}) => {
  const [permissions, setPermissions] = useState([]); 
  /**For Tree Operation State */
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);


  /**For Tree Operation State */

  //const {http} = getToken();
  const {notify} = MyToast();
  const { http } = Axios();
  const router = useRouter();

  const [role,setRole] = useState({
    title:"",
    description:"",
  })

  /**Permission Form Submission */
  async function submitFormPermission(e) {
    e.preventDefault();
    // console.log("checked: ",checked);
    // return;
    const res = await http.post(
      `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,{
        ...role,
        action: "createRolePermission",
        permission_ids:checked
      }).then((res)=>{ 
          notify("success","Role has been Created Successfully!");
          router.push('/modules/settings/role/all-roles');
          
      }).catch((e) =>{
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        } else {
          if (msg?.title) {
            notify("error", `Role title should not empty !`);
          }
          if (msg?.permission_ids) {
            notify("error", `Check permissions !`);
          }
      }});
  }

  /**Getting Permissions */
  const getPermissions = async () => {
    // await http
    //   .post(
    //     `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,{action: "getAllPermissions",})
    //   .then((result) => {
    //     console.log("result",result);
    //     setPermissions(result.data);
    //   });
    await http
    .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {action: "getAllPermissionNew",})
    .then((result) => {
        if (result.data.status === 'success') {
            const resData = result.data.data;
            const accessPermissions = resData['accessPermissions'];

            const pmsList = accessPermissions.map((item, index) => {
                item['children'] = JSON.parse(item['children'])
                return item;
            })
            setPermissions(pmsList);
        }


    });
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getPermissions();
    }
    return () => {
      isMount = false;
    };
    //console.log(permissions);
  }, []);

  //console.log(rolelist);

  const changeHandler = (e) => {
    setRole((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const treenode = listToTree(permissions?.data);
 

  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card">
              <div className="card-body border-bottom">
                {accessPermissions.createAndUpdate &&<h4 className="card-title">Add Role</h4>}
              </div>

              <Form onSubmit={submitFormPermission}>
                <div className="card-body">
                  <TextInput
                    label="Title"
                    placeholder="Title"
                    onChange={changeHandler}
                    name="title"
                    type="text"
                  />

                  <div className="mb-3 row">
                    <Label text="Description" />
                    <div className="col-md-10">
                      <Textarea
                        className="textarea form-control"
                        // defaultValue="Write Descriptions..."
                        rows="3"
                        id="my-textarea"
                        onChange={changeHandler}
                        placeholder="Enter additional notes..."
                        name="description"
                      />
                    </div>
                  </div>


                  <div className="mb-3 row">
                    <Label text="Set Permissions" />
                    <div className="col-md-10 col-lg-3 col-sm-6">
                      <CheckboxTree
                        iconsClass="fa5"
                        nodes={permissions}
                        checked={checked}
                        expanded={expanded}
                        onCheck={(checked) => setChecked(checked)}
                        onExpand={(expanded) => setExpanded(expanded)}
                        checkModel={`all`}
                        noCascade={true}
                      />
                    </div>
                  </div>

                  <div className="p-3 border-top"></div>
                  <div className="text-end">
                    <Button className="btn-info">Save</Button>

                    <Button className="btn-dark">Cancel</Button>
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

export default AddRole;
