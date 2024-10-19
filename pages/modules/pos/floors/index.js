import Link from 'next/link';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select from '../../../../components/elements/Select';
import Select2 from "../../../../components/elements/Select2";
import ItemSubCat from '../../../../components/inventory_category/ItemSubCat';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import ViewIcon from '../../../../components/elements/ViewIcon';
import MyToast from "@mdrakibul8001/toastify"

//Create Component
const CreateForm = ({ onSubmit,loading,validated }) => {

  const {http} = Axios();

  const notify = React.useCallback((type, message) => {
      toast({ type, message });
    }, []);

  const [floor, setFloor] = useState({
    name:"",
    description:"",
  })

  const handleChange =(e)=>{
    setFloor(prev=>({
      ...prev, [e.target.name]:e.target.value
    }))
  }

  let dataset = {...floor, action:"createFloor"}

  return (

    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Floor Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Floor name"
          name='name'
          onChange={handleChange}
          required
        />
      </Form.Group>

    <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5} 
        placeholder="Enter Description"
        name='description'
        onChange={handleChange}
        />
    </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={()=>onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit,floorId, pending, validated }) => {

    const {http} = Axios();
  
    const [loading, setLoading] = useState(true);

    const [floor, setFloor] = useState({
        name:"",
        description:"",
        floor_id: floorId
      })
  
    const handleChange =(e)=>{
      setFloor(prev=>({
        ...prev, [e.target.name]:e.target.value
      }))
    }

    const fetchFloorData = useCallback(async ()=>{
      let isSubscribed = true;
      setLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`,{action: "getFloorInfo", floor_id:floorId })
      .then((res)=>{
         if(isSubscribed){
            setFloor(prev=>({
            ...prev, 
            name:res.data.data.name,
            description:res.data.data.description,
          }));
          setLoading(false)
         }
      })
      .catch((err)=>{
        console.log('Something went wrong !')
        setLoading(false)
      });
  
      return ()=> isSubscribed=false;
  
    },[floorId]);
  
    useEffect(()=>{
        fetchFloorData();
    },[fetchFloorData])
    

    let dataset = {...floor, action:"editFloor"}
  
    return (

      <Form >

        <Form.Group controlId="formBasicEmail">
        <Form.Label>Floor Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Floor Name"
          name='name'
          defaultValue={floor.name}
          onChange={handleChange}
          required
        />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5} 
            placeholder="Enter Description"
            name='description'
            defaultValue={floor.description}
            onChange={handleChange}
          />
         </Form.Group>

  
        <Button variant="primary" className="shadow rounded" 
          disabled={pending || loading} style={{ marginTop: "5px" }}  
          onClick={()=>onSubmit(dataset)} 
        >
          {pending?'updating...':'update'}
        </Button>
      </Form>
    );
  };

//Delete component
const DeleteComponent = ({ onSubmit, floorId, pending }) => {

    const {http} = Axios();
  
    const [loading, setLoading] = useState(true);
    const [floor, setFloor] = useState({
      floor_id: floorId
    })

    let dataset = {...floor, action:"deleteFloor"}

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

export default function ListView() {

    const {http} = Axios();

    // const notify = React.useCallback((type, message) => {
    //     toast({ type, message });
    //   }, []);

    const {notify} = MyToast();


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm=async(items)=> {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`,items)
    .then((res)=>{
      if(isSubscribed){
        notify("success", "successfully Added!");
        handleClose();
        setLoading(false);
      }

    })
    .catch((e)=>{
      const msg = e.response?.data?.response;

       if(typeof(msg) == 'string'){
        notify("error", `${msg}`);
       }
       else{
        if(msg?.name){
          notify("error", `${msg.name.Name}`);
        }
       }
       setLoading(false);
    });

    fetchItemList();

    return ()=>isSubscribed=false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [floorId, setFloorId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (floor_id) =>{
    setShowUpdateModal(true);
    setFloorId(floor_id);
  } 


    //Update floor form
    const updateForm=async(formData)=> {
      let isSubscribed = true;
      setPending(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`,formData)
      .then((res)=>{
        if(isSubscribed){
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
        }
  
      })
      .catch((e)=>{
        const msg = e.response?.data?.response;
  
         if(typeof(msg) == 'string'){
          notify("error", `${msg}`);
         }
         else{
          if(msg?.name){
            notify("error", `${msg.name.Name}`);
          }
         }
         setPending(false);
      });
  
      fetchItemList();
  
      return ()=>isSubscribed=false;
    }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (floor_id) =>{
    setShowDeleteModal(true);
    setFloorId(floor_id);
  } 


    //Delete Tower form
    const handleDelete=async(formData)=> {
      let isSubscribed = true;
      setPending(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`,formData)
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

    //Tower Floor Rooms data list
  const [floorList, setFloorList] = useState([]);
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
const data = floorList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`,{
      action: "getAllFloors",
    })
    .then((res)=>{
      if(isSubscribed){
        setFloorList(res?.data);
        setFilteredData(res.data?.data);
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
    return item.name.toLowerCase().match(search.toLocaleLowerCase())
  });

  setFilteredData(result);
  return ()=> controller.abort();
},[search])





const actionButton=(floorId)=>{
    return <>
        <ul className="action ">
            
            <li>
                <Link href={`/modules/restaurant/floors/details/${floorId}`}>
                    <a>
                        <ViewIcon />
                    </a>
                </Link>
            </li>

            <li>
                <Link href="#">
                    <a onClick={()=>handleOpen(floorId)}>
                        <EditIcon />
                    </a>
                </Link>
            </li>
            <li>
                <Link href="#">
                    <a onClick={()=>handleOpenDelete(floorId)}>
                        <DeleteIcon />
                    </a>
                </Link>
            </li>

            </ul>
    </>
}


const columns = [

    {
        name: 'Name',
        selector: row =>row.name,
        sortable: true,
    },
    {
        name: 'Total Table',
        selector: row =>row.restaurant_tables_count,
        sortable: true,
    },
    {
        name: 'Description',
        selector: row =>row.description,
        sortable: true,
    },
    {
        name: 'Action',
        selector: row => actionButton(row.id),
        width: "100px",                       // added line here

    },
  
];



  return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="card shadow">

                  <div className="d-flex border-bottom title-part-padding align-items-center">
                    <div>
                      <h4 className="card-title mb-0">All Floors</h4>
                    </div>
                    <div className="ms-auto flex-shrink-0">
                      <Button
                        className="shadow rounded"
                        variant="primary"
                        type="button"
                        onClick={handleShow}
                        block
                      >
                        Create Floor
                      </Button>



                      {/* Create Modal Form */}
                      <Modal dialogClassName="modal-lg"  show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create Floor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <CreateForm onSubmit={submitForm} loading={loading}/>
                        </Modal.Body>
                      </Modal>
                      {/* End Create Modal Form */}

                      {/* Update Modal Form */}
                      <Modal dialogClassName="modal-lg" show={showUpdateModal} onHide={handleExit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Floor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <EditForm onSubmit={updateForm} floorId={floorId} pending={pending}
                            />
                        </Modal.Body>
                      </Modal>
                      {/* End Update Modal Form */}
                      {/* Delete Modal Form */}
                      <Modal show={showDeleteModal} onHide={handleExitDelete}>
                        <Modal.Header closeButton></Modal.Header>
                        <DeleteComponent onSubmit={handleDelete} floorId={floorId} pending={pending}/>
                      </Modal>

                    </div>
                  </div>


                  <div className="card-body">
                      <div className="">

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
    </div>
  )
}