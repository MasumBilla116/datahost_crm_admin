import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { EditIcon, HeadSection } from "../../../../components";
import toast from "../../../../components/Toast/index";
import Select from '../../../../components/elements/Select';
import Axios from '../../../../utils/axios';
import { getSSRProps } from "../../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.srvs_crg" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};



const CreateTaxForm = ({ onSubmit }) => {

  const {http} = Axios();

  const notify = React.useCallback((type, message) => {
      toast({ type, message });
    }, []);

  const [service, setService] = useState({
    type:"booking_cancelation_charge",
    amount:null,
    description:"",
    calculation_type:'auto_calculation'
  })

  const [loading, setLoading] = useState(false)

  const handleChange =(e)=>{
    setService(prev=>({
      ...prev, [e.target.name]:e.target.value
    }))
  }

  useEffect(()=>{
      const controller = new AbortController();
      setLoading(true)
        async function getServiceInfo(){
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,{action: "getServiceInfo",})
            .then((res)=>{
              setService(prev=>({
                ...prev, 
                type: res?.data?.data?.type,
                amount: res?.data?.data?.amount,
                calculation_type: res?.data?.data?.calculation_type,
                description: res?.data?.data?.description
              }))
            });
          }
          getServiceInfo()
          setLoading(false)
          return ()=> controller.abort();
    },[])

  let dataset = {...service, action:"editService"}

  return (

    <Form>

      <div className="row">


      <Form.Group className="mb-3 col-6" controlId="formBasicDesc" >
        <Form.Label>Select Service Type</Form.Label>
        {loading ? (
          <Select>
            <option value="">loading...</option>
          </Select>
        ) : (
          <Select value={service.type} name="type" onChange={handleChange}>
          {/* <option value="0">none</option> */}
          <option value="booking_cancelation_charge">Booking Cancelation Charge</option>
          {/* <option value="always-apply">Always Apply</option> */}
          {/* <option value="do-not-apply">Do Not Apply</option>
          <option value="flexible">Flexible</option> */}
        </Select>
        )}
      </Form.Group>

      <Form.Group className="mb-3 col-6" controlId="formBasicDesc" >
        <Form.Label>Select Service Type</Form.Label>
        {loading ? (
          <Select>
            <option value="">loading...</option>
          </Select>
        ) : (
          <Select value={service.calculation_type} name="calculation_type" onChange={handleChange}>
          <option value="always_calculate">Auto Calculate</option>
          <option value="custom_calculate">Custom Calculate</option>
        </Select>
        )}
      </Form.Group>
      </div>


      <Form.Group controlId="formBasicEmail">
      <Form.Label>Service amount(%)</Form.Label>
      <Form.Control
        type="number"
        placeholder="Enter service Amount"
        name='amount'
        onChange={handleChange}
        required
        defaultValue={service.amount}
      />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5} 
            placeholder="Enter Description"
            name='description'
            onChange={handleChange}
            defaultValue={service.description}
          />
      </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={()=>onSubmit(dataset)} block="true">
        Update
      </Button>
    </Form>
  );
};


export default function ListView({accessPermissions}) {

    const {http} = Axios();

    const {notify} = MyToast();


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create tax form
  const submitServiceForm=async(items)=> {
    let isSubscribed = true;
    // setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,items)
    .then((res)=>{
      if(isSubscribed){
        notify("success", "successfully Added!");
        handleClose();
        setValidated(false);
      }
    })
    .catch((e)=>{
      const msg = e.response?.data?.response;

       if(typeof(msg) == 'string'){
        notify("error", `${msg}`);
       }
       else{
        if(msg?.type){
          notify("error", `${msg.type.Type}`);
        }
        if(msg?.amount){
            notify("error", `${msg.amount.Amount}`);
        }
       }
       setLoading(false);
       setValidated(true);
    });

    fetchItemList();

    return ()=>isSubscribed=false;
  }

  const [pending, setPending] = useState(false);





  const [service, setService] = useState([]);

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
const data = service?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,{
      action: "getAllService",
    })
    .then((res)=>{
      if(isSubscribed){
        setService(res?.data);
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
    return item.type.toLowerCase().match(search.toLocaleLowerCase())
  });

  setFilteredData(result);
  return ()=> controller.abort();
},[search])

const actionButton = (laundry_id) => {
  return (
    <>
      <ul className="action">
        {accessPermissions.createAndUpdate &&<li>
          <Link href="">
            <a onClick={handleShow}>
              <EditIcon />
            </a>
          </Link>
        </li>}
      </ul>
    </>
  );
};


const columns = [
    {
        name: 'Charge Type',
        selector: row =>row.type.toString().replace(/_/g, " "),
        sortable: true,
    },
    {
      name: 'Calc. Type',
      selector: row =>row.calculation_type.toString().replace(/_/g, " "),
      sortable: true,
  },
    {
        name: 'Amount(%)',
        selector: row => row.amount,
        sortable: true,
    },
    {
        name: 'Description',
        selector: row => row.description,
        sortable: true,
    },
    {
        name: 'Action',
        selector: (row) => actionButton(),
    }
];

const [charge,setCharge] = useState(null);

useEffect(()=>{
  let controller = new AbortController();
  (async ()=>{
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,{
      action: "chargeInfo",
    })
    .then((res)=> setCharge(res?.data?.data?.charge))
    .catch((err)=> console.log(err));
  })();
  return ()=> controller.abort();
},[]);

const submitCancelationForm=async(e)=>{
  e.preventDefault();
  let isSubscribed = true;
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,{
    action: "updateOrCreateCancelationCharge",
    charge:charge
  })
  .then((res)=>{
    if(isSubscribed){
      notify("success", "successfully Added!");
    }
  })
  .catch((e)=>{
    const msg = e.response?.data?.response;
    if(typeof(msg) =='string'){
      notify("error", `${msg}`);
    }
  });

  return ()=>isSubscribed=false;
}


  return (
    <div className="container-fluid">
             <HeadSection title="Service Charge" />

        <div className="row">
            <div className="col-md-7 p-xs-2">
                <div className="card shadow m-xs-2">

                  <div className="d-flex border-bottom title-part-padding align-items-center">
                    <div>
                      <h4 className="card-title mb-0">Manage Service Charge</h4>
                    </div>
                    


                      {/* {/ Create Modal Form /} */}
                      <Modal dialogClassName="modal-md"  show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Update Service Charge</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <CreateTaxForm onSubmit={submitServiceForm}/>
                        </Modal.Body>
                      </Modal>
                      {/* {/ End Create Modal Form /} */}

                   
                  </div>


                  <div className="card-body">
                      <div className="">
                          <DataTable
                              columns={columns} 
                              data={filteredData} 
                              // pagination  
                              highlightOnHover
                              subHeader
                              striped
                          />

                      </div>
                  </div>

                </div>
            </div>
            <div className="col-md-5">
                {/* <div className="card shadow">

                  <div className="d-flex border-bottom title-part-padding align-items-center">
                    <div>
                      <h4 className="card-title mb-0">Manage Cancelation Charge</h4>
                    </div>
                  </div>

                    <div className="card-body">
                      <Form onSubmit={submitCancelationForm}>
                        <Row>
                          <Col md={9} className='mb-2'>
                            <Form.Group >
                              <Form.Control
                                type='number'
                                placeholder="Enter Cancelation Charge %"
                                name='charge'
                                onChange={e=>setCharge(e.target.value)}
                                defaultValue={charge}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Group>
                              <Button variant='primary' className="shadow rounded w-xs-100" type="submit">
                                Save
                              </Button>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </div>

                </div> */}
            </div>
        </div>

    </div>
  )
}