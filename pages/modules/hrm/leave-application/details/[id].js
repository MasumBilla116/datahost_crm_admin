import { useRouter } from 'next/router';
import React,{ useEffect, useState } from 'react';
import Axios from '../../../../../utils/axios';
import HeadSection from '../../../../../components/HeadSection';
import moment from 'moment';
import MyLoader from '../../../../../components/placeholder/MyLoader';
import toast from "../../../../../components/Toast/index";
import { Modal, Button, Form } from "react-bootstrap";

const ApproveApplication = ({ onSubmit }) => {

    const {http} = Axios();
    const router = useRouter();
    const {id} = router.query;

    const [note, setNote] = useState("");
    const [loading,setLoading] = useState(true);
  
    let formData = new FormData(); 
  
    formData.append('action', "leaveApplicationApproval");
    formData.append('leave_status', "Approved");
    formData.append('application_id', id);
    formData.append('admin_note', note)
  
  
    return (
      <Form >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Admin Note</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Admin Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
  
        <Button variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={()=>onSubmit(formData)} block>
          Approve
        </Button>
      </Form>
    );
  };

  const RejectApplication = ({ onSubmit }) => {

    const {http} = Axios();
    const router = useRouter();
    const {id} = router.query;

    const [note, setNote] = useState("");
    const [loading,setLoading] = useState(true);
  
    let formData = new FormData(); 
  
    formData.append('action', "leaveApplicationApproval");
    formData.append('leave_status', "Rejected");
    formData.append('application_id', id);
    formData.append('admin_note', note)
  
  
    return (
      <Form >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Admin Note</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Admin Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
  
        <Button variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={()=>onSubmit(formData)} block>
          Reject
        </Button>
      </Form>
    );
  };

export default function ApplicationDetails() {
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
      }, []);

    const [details, setDetails] = useState('')
    const [loading,setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const [reject, setReject] = useState(false);
    const [approve, setApprove] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRejectClose = () => setReject(false);
    const handleReject = () => setReject(true);

    const router = useRouter();
    const {http} = Axios();
    const {id} = router.query


    useEffect(() => {
        router.isReady && applicationDetails()
    },[id])

    const applicationDetails = () =>{
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`,{action: "getLeaveApplicationInfo",application_id: id})
        .then((res) =>{
          setDetails(res.data);
          setLoading(false);
        });
    }


    const handleApprove=async(items)=> {
        let isSubscribed = true;
        
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`,items)
        .then((res)=>{
          if(isSubscribed){
            applicationDetails()
            notify("success", "successfully Approved!");
            handleClose();
            handleRejectClose();
          }
    
        })
    
        return ()=>isSubscribed=false;
      }


    if (loading)
    return (
    <>
        <HeadSection title="Application-Details" />
        <MyLoader loading={loading}>
            <div className="container-fluid vh-100">
                <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="border-bottom title-part-padding">
                                <h4 className="card-title mb-0">Application Info</h4>
                            </div>
                            <div className="card-body">

                            <p>Processing...</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyLoader>
        
    </>
    );
    
    
return(
    <>
    <HeadSection title="Application-Details" />

    <div className="container-fluid ">
        <div className="row">
           
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body">
            
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                            <div style={{marginLeft: '80%'}}>
                                <div className="row">
                                    <div className="col-md-6 col-sm-6">
                                        {(details.data.leave_status != 'Pending') ? <button className="btn btn-success">Approve</button> : (<a onClick={handleShow} className="btn btn-danger">Approve</a>) }
                                    </div>
                                    <div className="col-md-6 col-sm-6">
                                        {(details.data.leave_status != 'Pending') ? <button className="btn btn-success">Reject</button> : (<a onClick={handleReject} className="btn btn-danger">Reject</a>) }
                                    </div>
                                </div>
                            </div>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Approve Application</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ApproveApplication onSubmit={handleApprove} />
                                    </Modal.Body>
                                </Modal>

                                <Modal show={reject} onHide={handleRejectClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Reject Application</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <RejectApplication onSubmit={handleApprove} />
                                    </Modal.Body>
                                </Modal>
                            
                            <h3 className="box-title mt-5">Application Basic Info</h3>
                            <div className="table-responsive">
                                <table className="table">
                                <tbody>
                                    <tr>
                                        <td width={390}>Employee Name</td>
                                        <td>{details.data?.employee?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Subject</td>
                                        <td>
                                            {details.data.subject}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Leave Category</td>
                                        <td>
                                            {details.data.leave_category.title}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Date</td>
                                        <td>
                                            {details.data.date}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Leave Type</td>
                                        <td>
                                            {details.data.isHalfday == 1 ? 'Half-Day' : 'Full-Day'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            {details.data.description}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Leave Status</td>
                                        <td>
                                            {details.data.leave_status == 'Pending' ? 
                                            <button className="btn btn-danger">Pending</button> :
                                            <button className="btn btn-success">{details.data.leave_status}</button>
                                            } 
                                        </td>
                                    </tr>
                                    
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                            <h3 className="box-title mt-5">Creation/updation related info</h3>
                            <div className="table-responsive">
                                <table className="table">
                                <tbody>
                                    <tr>
                                        <td width={390}>Created By</td>
                                        <td>{details.data?.creator?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Created At</td>
                                        <td>{moment(details.data?.created_at).format('DD-MM-YYYY')}</td>
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
    </div>
    </>
);
}