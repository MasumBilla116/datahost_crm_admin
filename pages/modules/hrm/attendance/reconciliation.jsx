import React, { useEffect, useState } from 'react'
import Axios from '../../../../utils/axios';
import DataTable from 'react-data-table-component';
import { ViewIcon } from '../../../../components';
import Link from 'next/link';
import { Button, Form, Modal } from "react-bootstrap";
import MyToast from '@mdrakibul8001/toastify';


const ApproveComponent = ({ onSubmit, pending, editData }) => {

    let dataset = {
        action: "updateReconciliation",
        id: editData?.id,
        status: "approve",
    };
    return (
        <>
            <Modal.Body>
                <Modal.Title>Are you sure to Approve </Modal.Title>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="success"
                    disabled={pending}
                    onClick={() => onSubmit(dataset)}
                >
                    Approve
                </Button>
            </Modal.Footer>
        </>
    );

}



const RejectComponent = ({ onSubmit, pending, editData }) => {

    let dataset = {
        action: "updateReconciliation",
        id: editData?.id,
        status: "reject",
    };
    return (
        <>
            <Modal.Body>
                <Modal.Title>Are you sure to Rejected </Modal.Title>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="danger"
                    disabled={pending}
                    onClick={() => onSubmit(dataset)}
                >
                    Reject
                </Button>
            </Modal.Footer>
        </>
    );

}

const ViewComponent = ({ onSubmit, pending, editData }) => {
    let dataset = {
        action: "updateReconciliation",
        id: editData?.id,
        status: "approve",
    };

    
    return (
        <>
            <Modal.Body>
                {/* <Modal.Title>Are you sure to View </Modal.Title> */}
                <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr style={{ borderTop: 'hidden' }}>
                          <td >Employee Name</td>
                          <td>{editData?.name}</td>
                        </tr>
                        <tr>
                          <td>Department</td>
                          <td>{editData?.department_name}</td>
                        </tr>
                        <tr>
                          <td>Type</td>
                          <td className="text-capitalize">{editData?.type}</td>
                        </tr>
                        <tr>
                          <td>Date</td>
                          <td>{editData?.date}</td>
                        </tr>
                        <tr>
                          <td>Time</td>
                          <td>{editData?.time}</td>
                        </tr>
                        <tr style={{ borderBottom: 'hidden' }}>
                          <td>Reason</td>
                          <td>{editData?.reason}</td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </div>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button
                    variant="success"
                    disabled={pending}
                    onClick={() => onSubmit(dataset)}
                >
                    View
                </Button>
            </Modal.Footer> */}
        </>
    );
}



const Reconciliation = () => {
    const { http } = Axios();
    const [isLoading, setIsLoading] = useState(true);
    const [reconciliationData, setReconciliationData] = useState([]);
    const [pending, setPending] = useState(false);
    const { notify } = MyToast();
    const fetchReconciliationList = async () => {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
            { action: "getAllReconcilation" }
        ).then((res) => {
            setReconciliationData(res.data.data);
        }).catch((error) => {
            console.log('fetching attendence list error', error);
        });
    };


    useEffect(() => {
        fetchReconciliationList();
    }, []);


    const columns = [

        {
            name: 'SL',
            selector: (row, index) => index + 1,
            sortable: true,
            width: "75px",
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            // width: "75px",
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
            width: "100px",
        },
        {
            name: 'Time',
            selector: row => row.time,
            sortable: true,
            // width: "75px",
        },
        {
            name: "Action",
            selector: (row) => action(row),
            center: true,
            width: "250px",
        },


    ];

    const smallBtnStyle = {
        padding: '0.2rem 0.5rem',
        fontSize: '0.8rem',
        lineHeight: '1',
        height: '22px',
        width: '65px',
    };
    const action = (row) => {

        return (
            <>
                <ul className="action">
                    {/* <li>
                        <Link href={`/modules/bookings/invoice/frontDesk/${row?.id}`}>
                            <a><ViewIcon /></a>
                        </Link>
                    </li> */}
                    <li>
                        <Link href="#">
                            <a
                                className="btn btn-success "
                                onClick={() => handleOpenApprove(row)}
                                style={smallBtnStyle}
                            >
                                Approve
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <a
                                className="btn btn-primary "
                                onClick={() => handleOpenView(row)}
                                style={smallBtnStyle}
                            >
                                View
                            </a>
                        </Link>
                    </li>

                    <li>
                        <Link href="#">
                            <a
                                className="btn btn-danger "
                                onClick={() => handleOpenRejected(row)}
                                style={smallBtnStyle}
                            >
                                Reject
                            </a>
                        </Link>
                    </li>

                </ul>
            </>
        );
    };

    //Approve  Modal
    const [showApproveModal, setShowApproveModal] = useState(false);
    const handleExitApprove = () => setShowApproveModal(false);
    const [editData, setEditData] = useState({});

    const handleOpenApprove = (row) => {
        setShowApproveModal(true);
        setEditData(row);
    };


    //Delete laundry form
    const handleApprove = async (formData) => {

        let isSubscribed = true;
        setPending(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Approve!");
                    fetchReconciliationList();
                    handleExitApprove();
                    setPending(false);

                }
            })
            .catch((e) => {
                setPending(false);
            });

        return () => (isSubscribed = false);
    };



    //Rejecte  Modal
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const handleExitRejected = () => setShowRejectedModal(false);


    const handleOpenRejected = (row) => {
        setShowRejectedModal(true);
        setEditData(row);
    };


    //Delete laundry form
    const handleRejected = async (formData) => {

        let isSubscribed = true;
        setPending(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Rejected!");
                    fetchReconciliationList();
                    handleExitRejected();
                    setPending(false);

                }
            })
            .catch((e) => {
                setPending(false);
            });

        return () => (isSubscribed = false);
    };



    //view  Modal
    const [showViewModal, setShowViewModal] = useState(false);
    const handleExitView = () => setShowViewModal(false);


    const handleOpenView = (row) => {
        setShowViewModal(true);
        setEditData(row);
    };

    const handleView = async (formData) => {

    }

    return (
        <div className="">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">



                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">Reconciliation List</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                {/* Approve Modal Form */}
                                <Modal show={showApproveModal} onHide={handleExitApprove}>
                                    <Modal.Header closeButton>Approve Reconciliation</Modal.Header>
                                    <ApproveComponent
                                        onSubmit={handleApprove}
                                        editData={editData}
                                        pending={pending}
                                    />
                                </Modal>
                                {/* End Approve Modal Form */}

                                {/* Reject Modal Form */}
                                <Modal show={showRejectedModal} onHide={handleExitRejected}>
                                    <Modal.Header closeButton>Reject Reconciliation</Modal.Header>
                                    <RejectComponent
                                        onSubmit={handleRejected}
                                        editData={editData}
                                        pending={pending}
                                    />
                                </Modal>

                                {/* End Reject Modal Form */}

                                {/* Reject Modal Form */}
                                <Modal show={showViewModal} onHide={handleExitView}>
                                    <Modal.Header closeButton>View The Reason</Modal.Header>
                                    <ViewComponent
                                        onSubmit={handleView}
                                        editData={editData}
                                        pending={pending}
                                    />
                                </Modal>

                                {/* End Reject Modal Form */}

                            </div>
                        </div>


                        <div className="card-body">
                            <DataTable
                                columns={columns}
                                data={reconciliationData}
                                pagination
                                highlightOnHover
                                subHeader
                                striped
                            />
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reconciliation

