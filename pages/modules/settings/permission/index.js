import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import EditIcon from '../../../../components/elements/EditIcon';
import Axios from '../../../../utils/axios';
import { getSSRProps } from "../../../../utils/getSSRProps";



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.mng_prmsn" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Delete component
const DeleteComponent = ({ onSubmit,roleId}) => {

  const {http} = Axios();

  let myFormData = {action:"deletePermissionByRoleID", role_id:roleId}

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete this role?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" onClick={()=>onSubmit(myFormData)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};



export default function AllRoles({accessPermissions}) {

    const {http} = Axios();
    const {notify} = MyToast();

//Tower Floor Rooms data list
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
          fetchItemList();
    });
    return () => clearTimeout(timeout);
}, []);


//Fetch List Data for datatable

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,{
      action: "getAllPermissions",
    })
    .then((res)=>{
      if(isSubscribed){
        setItemList(res?.data?.data);
        setFilteredData(res?.data?.data);
      }
    })
    .catch((err)=>{
      console.log("Server Error ~!")
    });
    
    return ()=> isSubscribed=false;
  };

useEffect(()=>{
  let controller = new AbortController();
  const result = itemList?.filter((item)=>{
    return item?.title?.toLowerCase().match(search.toLocaleLowerCase())
  });

  setFilteredData(result);
  return ()=> controller.abort();
},[search])

const [roleId,setRoleId]=useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const handleExitDelete = () => setShowDeleteModal(false);

const handleOpenDelete = (Id) =>{
  setShowDeleteModal(true);
  setRoleId(Id);
} 

  //Delete role form
  const handleDelete=async(formData)=> {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`,formData)
    .then((res)=>{
      if(isSubscribed){
        notify("success", "successfully deleted!");
        handleExitDelete();
      }

    })
    .catch((e)=>{
      console.log('error delete !')
    });

    fetchItemList();

    return ()=>isSubscribed=false;
  }


const actionButton=(Id)=>{
    return <>
        <ul className="action ">

      {accessPermissions.createAndUpdate &&  <li>
              <Link href={`/modules/settings/permission/edit/${Id}`}>
                  <a>
                      <EditIcon />
                  </a>
              </Link>
            </li>}
            {/* <li>
              <a href="#" onClick={(e)=>{e.preventDefault(); handleOpenDelete(Id)}}>
                  <DeleteIcon />
              </a>
            </li> */}

            </ul>
    </>
}

const columns = [

    {
        name: 'Permission',
        selector: row =>row.title,
        sortable: true,

    },
    {
        name: 'Access Code',
        selector: row => row.access_code,
        sortable: true,
    },
    {
        name: 'Action',
        selector: row => actionButton(row.id), 
        width:"100px"

    }
  
];



  return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-12 p-xs-2">
                <div className="card shadow">

                  <div className="d-flex border-bottom title-part-padding align-items-center">
                    <div>
                      <h4 className="card-title mb-0">All Permissions</h4>
                    </div>
                    <div className="ms-auto flex-shrink-0">
                    {accessPermissions.createAndUpdate &&<Link href="/modules/settings/permission/create">
                      <a
                        className="shadow rounded btn btn-primary btn-sm"

                      >
                        Create New Permission
                      </a>
                    </Link>}

                    {/* Delete Modal Form */}
                    <Modal show={showDeleteModal} onHide={handleExitDelete}>
                      <Modal.Header closeButton></Modal.Header>
                      <DeleteComponent onSubmit={handleDelete} roleId={roleId} />
                    </Modal>

                    </div>
                  </div>


                  <div className="card-body">
                     

                          <DataTable
                              columns={columns} 
                              data={filteredData} 
                              pagination  
                              highlightOnHover
                              subHeader
                              subHeaderComponent={
                                  <input 
                                  type="text" 
                                  placeholder="search..." 
                                  className="w-25 form-control" 
                                  value={search} 
                                  onChange={(e)=>setSearch(e.target.value)}
                                  />
                              }
                              striped
                          />

                     
                  </div>

                </div>
            </div>
        </div>
    </div>
  )
}
