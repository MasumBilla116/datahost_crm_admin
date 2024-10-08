import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { HeadSection } from '../../../components';
import toast from "../../../components/Toast/index";
import DeleteIcon from '../../../components/elements/DeleteIcon';
import EditIcon from '../../../components/elements/EditIcon';
import Axios from '../../../utils/axios';
import { getSSRProps } from "../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.invtr.ctgry" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};


//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [itemType, setitemType] = useState({
    name: "",
    status: false, 
  })

  const [itemTypeList, setitemTypeList] = useState("");


  const handleChange = (e) => {
    setitemType(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }
  

  const handleChangeSwitch = (e) => {
    const { name, type, checked, value } = e.target;
    setitemType((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  let dataset = { ...itemType, action: "createItemType" }

  return (

    <Form validated={validated}>

      <Form.Group controlId="formBasicEmail">
        <Form.Label><span className="text-danger">*</span>Item Type Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter item type Name"
          name="name"
          onChange={handleChange}
        />
      </Form.Group> 

      <Form.Group controlId="itemTypeStatus" className="ml-2 mt-4"> 
        <Form.Check
            type="switch"
            id="custom-switch"
            label={"Enabled"} 
            name="status"  
            checked={itemType?.status}
            onChange={handleChangeSwitch}  
        />
      </Form.Group> 
      <Button variant="primary" className="shadow rounded mb-3 mt-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, pending, validated,itemType }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(false);
 

  const [itemTypeObj, setitemTypeObj] = useState({
    name: itemType?.item_type_name,  
    status:  itemType?.status,
    id:  itemType?.id,    
  }) 

  const handleChange = (e) => {
    setitemTypeObj(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }  

  const handleChangeSwitch = (e) => {
    const { name, type, checked, value } = e.target;
    setitemTypeObj((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };


  let dataset = { ...itemTypeObj, action: "editItemType" }

  return (

    <Form >

      <Form.Group controlId="formBasicEmail">
        <Form.Label><span className="text-danger">*</span>Unit Type Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter unit type name"
          name='name'
          defaultValue={itemTypeObj.name}
          onChange={handleChange}
        />
      </Form.Group> 

      <Form.Group controlId="itemTypeStatus" className="ml-2 mt-2 mb-2" > 
        <Form.Check
            type="switch"
            id="custom-switch"
            label={"Enabled"} 
            name="status"  
            checked={itemTypeObj?.status}
            onChange={handleChangeSwitch}  
        />
      </Form.Group> 

      <Button variant="primary" className="shadow rounded"
        disabled={pending || loading} style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? 'updating...' : 'update'}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, itemTypeId, pending }) => {
 
console.log("itemTypeId: ",itemTypeId)
  const { http } = Axios();
  const [loading, setLoading] = useState(true);
  

  let dataset = { id: itemTypeId, action: "deleteItemType" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {

  const { http } = Axios();

  const router = useRouter();
  const { pathname } = router;
  // const notify = React.useCallback((type, message) => {
  //     toast({ type, message });
  //   }, []);

  const { notify } = MyToast();


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form 
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);  
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`, items)
      .then((res) => {
        if (isSubscribed) {
        console.log("res: ",res)
        const resData = res?.data?.data;
        setFilteredData(prev=>[resData,...prev]);
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setValidated(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });
 

    return () => isSubscribed = false;
  }


  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [itemType, setItemType] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (itemType) => {
    setShowUpdateModal(true);
    setItemType(itemType);
  }


  //Update floor form
  const updateForm = async (formData) => { 
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          const resData = res?.data?.data;

            const newListData = filteredData?.map((item) => {
            if (item?.id === resData?.id) {
                return resData; 
            }
            return item; 
            });

          setFilteredData(newListData);
          handleExit();
          setPending(false);
          setValidated(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
        }
        setPending(false);
        setValidated(true);
      }); 
    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [itemTypeId,setItemTypeId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);

  const handleOpenDelete = (itemType_id) => {
    setShowDeleteModal(true);
    setItemTypeId(itemType_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => { 
   
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`, formData)
      .then((res) => {
        if (isSubscribed) {
            console.log("resdata: ",res)
            const unitId = res?.data?.data;
            const newListData = filteredData?.filter((item) => { 
              return item?.id !== unitId;
            });
            setFilteredData(newListData); 
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }

      })
      .catch((e) => {
        console.log('error delete !')
        setPending(false);
      });
 

    return () => isSubscribed = false;
  }

  //Tower Floor Rooms data list
  const [itemTypeList, setitemTypeList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = itemTypeList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`, {
      action: "getAllItemTypes",
    })
      .then((res) => { 
        if (isSubscribed) {
          setitemTypeList(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase()) ||
   item.parent?.name.toLowerCase().match(search.toLocaleLowerCase());
     
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])


  const actionButton = (itemType) => {
    return <>
      <ul className="action ">
        {accessPermissions.createAndUpdate &&<li>
          <Link href="#">
            <a onClick={() => handleOpen(itemType)}>
              <EditIcon />
            </a>
          </Link>
        </li>}
       { accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(itemType?.id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }


  const columns = [

    {
      name: 'Item Type',
      selector: row => row?.item_type_name,
      sortable: true,
    },
    {
        name: 'Status',
        selector: row => row?.status == 1 ? <span className="text-success">Active</span> : <span className="text-danger">Disable</span>,
        sortable: true,
      },       
    {
      name: 'Action',
      selector: row => actionButton(row),
      width: "150px",                        
    },

  ];
 
  return (

    <>

      <HeadSection title="All Item Types" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2 ">
            <div className="card shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0"> All Item Types  </h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate &&<Button
                    className="rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Add Item Type
                  </Button>}



                  {/* Create Modal Form */}
                  <Modal dialogClassName="" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Item type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Item Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm onSubmit={updateForm} itemType={itemType} pending={pending} validated={validated}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent onSubmit={handleDelete} itemTypeId={itemTypeId}  pending={pending} />
                  </Modal>

                </div>
              </div>


              <div className="card-body">
                <div className="custom-data-table">

                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                      <input
                        type="text"
                        placeholder="search..."
                        className="w-25 form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      </div>
                    }
                    striped
                  />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}