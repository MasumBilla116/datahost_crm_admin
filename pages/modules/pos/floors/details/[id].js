import * as moment from 'moment';
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
//import Button from '../../../../../components/elements/Button';
//import Form from '../../../../../components/elements/Form';
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import EditIcon from "../../../../../components/elements/EditIcon";
import ViewIcon from "../../../../../components/elements/ViewIcon";
import toast from "../../../../../components/Toast/index";
import Axios from "../../../../../utils/axios";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';

const AddTableForm = ({ onSubmit,floorId, loading, validated }) => {

  const {http} = Axios();

  const [table, setTable]= useState({
    restaurant_floor_id: floorId,
    table_no: null,
    table_capacity: null,
  })

  const handleChange =(e)=>{
    setTable(prev=>({
      ...prev, [e.target.name]:e.target.value
    }))
  }

  let dataset = {...table, action:"createTable"}

  return (
    <Form validated={validated}>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Table No</Form.Label>
        <Form.Control
          type="number"
          placeholder="Table No"
          name="table_no"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Table Capacity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Table Capacity"
          name="table_capacity"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded" 
        disabled={loading} style={{ marginTop: "5px" }} 
        type="button" onClick={()=>onSubmit(dataset)} block
      >
        Create
      </Button>
    </Form>
  );
};

//Update component
const UpdateTableForm = ({ onSubmit, floorId, tableId, pending, validated }) => {

  const {http} = Axios();

  const [table, setTable]= useState({
    name: "",
    restaurant_floor_id: floorId,
    table_no: null,
    table_capacity: null,
    table_id:tableId,
  })

  const [loading, setLoading] = useState(true);

  const handleChange =(e)=>{
    setTable(prev=>({
      ...prev, [e.target.name]:e.target.value
    }))
  }

  const fetchTableInfo = useCallback(async ()=>{
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/tables`,{action: "getTableInfo", floor_id:floorId, table_id:tableId })
    .then((res)=>{
       if(isSubscribed){
        setTable(prev=>({
          ...prev, 
          name:res.data.data.name,
          table_no:res.data.data.table_no,
          table_capacity:res.data.data.table_capacity
        }))

        setLoading(false)
       }
    })
    .catch((err)=>{
      console.log('Something went wrong !')
      setLoading(false)
    });

    return ()=> isSubscribed=false;

  },[tableId,floorId]);

  useEffect(()=>{
    fetchTableInfo();
  },[fetchTableInfo])

  let dataset = {...table, action:"editTable"}

  return (
    <Form validated={validated}>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Table No</Form.Label>
        <Form.Control
          type="number"
          placeholder="Table No"
          name="table_no"
          onChange={handleChange}
          required
          defaultValue={table.table_no}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Table Capacity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Table Capacity"
          name="table_capacity"
          onChange={handleChange}
          required
          defaultValue={table.table_capacity}
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded" disabled={pending || loading} 
        style={{ marginTop: "5px" }} type="button" 
        onClick={()=>onSubmit(dataset)} block>
          Update
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, tableId, pending }) => {

    const {http} = Axios();
  
    const [loading, setLoading] = useState(true);
    const [table, setTable] = useState({
      table_id: tableId
    })

    let dataset = {...table, action:"deleteTable"}

    return (
      <>
        <Modal.Body>
          <Modal.Title>Are you sure to delete ?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="danger"  disabled={pending} onClick={()=>onSubmit(dataset)}>
            Confirm
          </Button>
        </Modal.Footer>
      </>
    );
  };

export default function View() {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();

  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  const [floor, setFloorData] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const fetchFloor = useCallback(async () => {
    if (!isReady) {
      console.log("fetching...");
      return;
    }

    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`, {
        action: "getFloorInfo",
        floor_id: id,
      })
      .then((res) => {
        if (isSubscribed) {
            setFloorData(res.data.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [id, isReady]);

  useEffect(() => {
    fetchFloor();
  }, [fetchFloor]);

  //create floor form
  const submitForm=async(items)=> {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/tables`,items)
    .then((res)=>{
      if(isSubscribed){
        notify("success", "successfully Added!");
        handleClose();
        setLoading(false);
        setValidated(false);
      }

    })
    .catch((e)=>{
      const msg = e.response?.data?.response;

       if(typeof(msg) == 'string'){
        notify("error", `${msg}`);
       }
       else{
        if(msg?.table_no){
          notify("error", `Table number must no be empty`);
        }
        if(msg?.table_capacity){
          notify("error", `Table capacity must not be empty`);
        }

       }
       setValidated(true);
       setLoading(false);
    });

    fetchItemList();

    return ()=>isSubscribed=false;
  }


  //Update floor Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [tableId,setTableId] = useState('');

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (id) =>{
    setShowUpdateModal(true);
    setTableId(id);
  } 


    //Update floor form
    const updateForm=async(fdata)=> {
      let isSubscribed = true;
      setPending(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/tables`,fdata)
      .then((res)=>{
        if(isSubscribed){
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setValidated(false);
        }
  
      })
      .catch((e)=>{
        const msg = e.response?.data?.response;
  
         if(typeof(msg) == 'string'){
          notify("error", `${msg}`);
         }
         else{
            if(msg?.table_no){
                notify("error", `Table number must no be empty`);
            }
            if(msg?.table_capacity){
            notify("error", `Table capacity must not be empty`);
            }
  
         }
         setValidated(true);
         setPending(false);
      });
  
      fetchItemList();
  
      return ()=>isSubscribed=false;
    }


    //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (table_id) =>{
    setShowDeleteModal(true);
    setTableId(table_id);
  } 


    //Delete Tower form
    const handleDelete=async(formData)=> {
      let isSubscribed = true;
      setPending(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/tables`,formData)
      .then((res)=>{
        if(isSubscribed){
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
  
      })
      .catch((e)=>{
        console.log('error delete !')
        setPending(false);
      });
  
      fetchItemList();
  
      return ()=>isSubscribed=false;
    }


  //Tower Floor Data
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  React.useEffect(() => {
    const timeout = setTimeout(() => {
          fetchItemList();
    });
    return () => clearTimeout(timeout);
}, [id,isReady]);


const actionButton=(table_id)=>{
    return <>
        <ul className="action">
            <li>
              <Link href="#" >
                <a onClick={()=>handleOpen(table_id)} >
                    <EditIcon />
                </a>
              </Link>
   
            </li>

            <li>
              <Link href="#" >
                <a  onClick={()=>handleOpenDelete(table_id)}>
                  <DeleteIcon/>
                </a>
              </Link>
            </li>
            </ul>
    </>
}



const columns = [

    {
        name: 'Floor',
        selector: row =>row.restaurant_floor.name,
        sortable: true,

    },
    {
        name: 'Total No',
        selector: row => row.table_no,
        sortable: true,
    },
    {
        name: 'Table Capacity',
        selector: row => row.table_capacity,
        sortable: true,
    },
    {
        name: 'Action',
        selector: row => actionButton(row.id),
    },
  
];


const data = itemList?.data;

  const fetchItemList = async () => {

    if (!isReady) {
        return;
    }

    setLoading(true);
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/tables`,{
      action: "getAllTables",
      floor_id:id,
    })
    .then((res)=>{
      if(isSubscribed){
        setItemList(res?.data);
        setFilteredData(res.data?.data);
        setLoading(false);
      }
    })
    .catch((err)=>{
      console.log("Server Error ~!")
    });
    
    return ()=> isSubscribed=false;
  };

useEffect(()=>{
  let controller = new AbortController();
  const result = data?.filter((item)=>{
    return item.table_no.toLowerCase().match(search.toLocaleLowerCase())
  });

  setFilteredData(result);
  return ()=> controller.abort();
},[search])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-12">
              <div className="card shadow">
                <div className="border-bottom title-part-padding">
                  <h4 className="card-title mb-0">
                    Floor info
                  </h4>
                </div>
                <div className="card-body">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td width={390}>Name</td>
                            <td>{floor && floor.name}</td>
                          </tr>
                          <tr>
                            <td>Description</td>
                            <td>{floor && floor.description}</td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>{floor && floor.status==1? 'Active':'Inactive'}</td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card shadow">
            <div className="border-bottom title-part-padding">
              <h4 className="card-title mb-0">
                Creation/updating related info
              </h4>
            </div>
            <div className="card-body">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>Created At</td>
                        <td>{floor && moment(floor.created_at).format('DD/MM/YYYY')}</td>
                      </tr>
                      <tr>
                        <td>Updated At</td>
                        <td>{floor && moment(floor.updated_at).format('DD/MM/YYYY')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">

          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">Table Info</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Button
                  className="shadow rounded"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Table
                </Button>
                {/* Create Modal Form */}
                <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Table</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddTableForm onSubmit={submitForm} floorId={floor?.id} loading={loading} validated={validated}/>
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-lg" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Table</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <UpdateTableForm onSubmit={updateForm} floorId={floor?.id}
                      tableId={tableId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} tableId={tableId} pending={pending}/>
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
  );
}
