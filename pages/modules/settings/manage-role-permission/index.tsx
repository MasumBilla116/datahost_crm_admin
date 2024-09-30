import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { DeleteIcon, EditIcon, HeadSection } from "../../../../components";
import Axios from "../../../../utils/axios";

const index = () => {
  const { http } = Axios();
  const notify = (msg: any) => toast(msg);

  const [rolepermission, setRolepermission]:any = useState(); //const entries = Object.entries(person); convert object to array
  const getRolePermissionList = async () => {
    const body: any = {
      action: "getAllRolePermission",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
        body
      )
      .then((result) => {
        setRolepermission(result.data);
      });
  };
  const [roleID, setroleID]:any = useState({
    role_id: [],
    title: [],
  });

  const handleDelete = (r_id: any) => {
    const body: any = {
      action: "deletePermissionByRoleID",
      role_id: r_id,
    };
    const res = http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
        body
      )
      .then(() => notify("Permissions Created Successfully!"));
  };
  const getTitleById = (role_id: any) => {
    //return roleID  //Get Title By ID
  };
  const setTitle = () => {
    //console.log(rolepermission);
    // rolepermission && rolepermission.map((key:any, index: any) => {
    //   console.log(key);
    // })
    rolepermission &&
      Promise.all(
        Object.keys(rolepermission?.data).map((key: any, index: any) => {
          const body: any = {
            action: "getRoleById",
            role_id: key,
          };
          try {
            http
              .post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,
                body
              )
              .then((result) => {
                setroleID({ ...roleID, role_id: key });
                setroleID({ ...roleID, title: result.data.data.title });
                // setroleID([{[role_id]: result.data.data.title}]);
                //console.log(roleID)
                //console.log(role_id);
                //return roleID
              })
              .catch(() => {
                setroleID({ ...roleID, title: "No Title" });
                //console.log("No title Found!")
              });
          } catch (error) {
            //console.log(error);
          }
          //console.log(key);
        })
      );
  };
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getRolePermissionList();
    }
    //console.log(roleID);
    return () => {
      isMount = false;
    };
  }, []);
  // setTitle();

  //  console.log(roleID);
  //rolepermission?.data && console.log(rolepermission?.data);
  // rolepermission && rolepermission.data?.map((item:any, index:any) => {
  // rolepermission && console.log(rolepermission)
  //// <Link href={{pathname: `/admin/manage-role-permission/edit/${key}` query: rolepermission.data[key][0].title}}>
  return (
    <>
      <ToastContainer position="top-center" draggable closeOnClick />
      <HeadSection title="Manage Role-Permission" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">Manage Role-Permissions</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="multi_col_order"
                    className="table table-striped table-bordered display"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>SL. NO.</th>
                        <th>Role Title</th>
                        <th>Total Permissions</th>
                        <th>Status</th>
                        <th>Operation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {rolepermission.data && rolepermission.data.map((key:any, index:any) => ( */}
                      {rolepermission &&
                        Object.keys(rolepermission.data).map(
                          (key: any, index: any) => (
                            <tr key={index}>
                              <td>{index}</td>
                              <td>{rolepermission.data[key][0].title}</td>
                              <td>{rolepermission.data[key].length}</td>
                              <td>{rolepermission.data[key][0].status}</td>
                              <td>
                                <ul className="action">
                                  <li>
                                    <Link
                                      href={`/admin/manage-role-permission/edit/${key}`}
                                    >
                                      <a>
                                        <EditIcon />
                                      </a>
                                    </Link>
                                  </li>

                                  <li>
                                    <Link href="#">
                                      <a onClick={() => handleDelete(key)}>
                                        <DeleteIcon />
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
