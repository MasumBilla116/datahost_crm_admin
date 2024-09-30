import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import toast from '../../../../../components/Toast';
import ViewIcon from '../../../../../components/elements/ViewIcon';
import Axios from '../../../../../utils/axios';
import { FaMoneyBillWave } from 'react-icons/fa';
import Select2 from "../../../../../components/elements/Select2";
import * as moment from 'moment';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
const ApproveApplication = ({ onSubmit }) => {

    const { http } = Axios();
    const router = useRouter();
    const { id } = router.query;

    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    let formData = new FormData();

    formData.append('action', "loanApplicationApproval");
    formData.append('loan_status', "Approved");
    formData.append('loan_id', id);
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

            <Button variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={() => onSubmit(formData)} block>
                Approve
            </Button>
        </Form>
    );
};


const RejectApplication = ({ onSubmit }) => {

    const { http } = Axios();
    const router = useRouter();
    const { id } = router.query;

    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    let formData = new FormData();

    formData.append('action', "loanApplicationApproval");
    formData.append('loan_status', "Rejected");
    formData.append('loan_id', id);
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

            <Button variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={() => onSubmit(formData)} block>
                Reject
            </Button>
        </Form>
    );
};





//Create New Payment
const PaymentCollectionForm = ({ onSubmit, loanId, employee_id }) => {
    const { http } = Axios();

    const [payment, setPayment] = useState({
        loan_id: loanId,
        employee_id: employee_id
    });


    const handleChange = (e) => {
        setPayment(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }
    //Fetch all Accounts
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        let isSubscribed = true;
        const fetchAllAccounts = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
                action: "listAccounts"
            })
                .then((res) => {
                    if (isSubscribed) {
                        setAccounts(res.data?.data)
                    }
                })
                .catch((err) => console.log(err))
        }
        fetchAllAccounts();
        return () => isSubscribed = false;
    }, []);

    let dataset = { ...payment, action: "payLoanInstallment" }

    return (<>
        <Form>
            <div className="row">
                <Form.Group className="mb-2 col-6">
                    <Form.Label>Payment Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Payment Amount"
                        name="amount"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                    <Form.Label>Payment Account</Form.Label>
                    <Select2
                        maxMenuHeight={140}
                        options={accounts.map(
                            ({ id, account_name }) => ({ value: id, label: account_name })
                        )}

                        onChange={(e) =>
                            setPayment((prev) => ({
                                ...prev,
                                account_id: e.value,
                            }))
                        }

                    />
                </Form.Group>
            </div>

            <Form.Group className="mb-2">
                <Form.Label>Payment Reference</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Payment Reference"
                    name="reference"
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-2">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="Enter Comments..."
                    name="remark"
                    onChange={handleChange}
                />
            </Form.Group>

            <div className="row">
                <div className="col-md-12 " >
                    {/* <Button variant="contained" color="success" className="shadow rounded ms-auto" style={{ marginTop: "5px" }} onClick={() => onSubmit(dataset)} block="true" >Collect Payment</Button> */}
                    <Button style={{ marginLeft: '80%' }} className='bg-success text-white' onClick={() => onSubmit(dataset)} variant="contained" color="secondary">Collect Payment</Button>
                </div>
            </div>
        </Form>
    </>);
};



const index = () => {


    const router = useRouter();
    const { pathname } = router;
    const { http } = Axios();
    const { id } = router.query

    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);


    const [details, setDetails] = useState('');
    const [detailsByEmp, setDetailsByEmp] = useState('');
    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);
    const [reject, setReject] = useState(false);
    const [approve, setApprove] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [employeeId, setEmployeeId] = useState(null);
    const handleRejectClose = () => setReject(false);
    const handleReject = () => setReject(true);
    const [empLoanHistory, seEmptLoanHistory] = useState({})
    const [installmentHistory, seInstallmentHistory] = useState([]);
    const [loanInfoById, setLoanInfoById] = useState(false);


    useEffect(() => {
        router.isReady && applicationDetails()
        loanHistory();
        applicationDetailsByEmp();
        installment_History();
    }, [id, employeeId])

    const applicationDetails = () => {
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getLoanDetails", loan_id: id })
            .then((res) => {

                setDetails(res?.data?.data);
                setLoading(false);
                setEmployeeId(res?.data?.data?.employee_id)
                // employee_id

            });
    }


    const loanHistory = () => {
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getLoanHistory", employee_id: employeeId, loan_id: id })
            .then((res) => {
                seEmptLoanHistory(res?.data?.data);
            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof e.response?.data?.response == "string") {
                    notify("error", `${e.response.data.response}`);
                }
                else {
                    notify("error", `Something went wrong !`);
                }
            });
    }


    const installment_History = () => {
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getLoanInstallmentHistory", loan_id: id })
            .then((res) => {
                seInstallmentHistory(res?.data?.data);
            });

    }


    const applicationDetailsByEmp = (id) => {
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getLoanHistoryByEmployee", loan_id: id })
            .then((res) => {
                setDetailsByEmp(res?.data?.data);
            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof e.response?.data?.response == "string") {
                    notify("error", `${e.response.data.response}`);
                }
                else {
                    notify("error", `Something went wrong !`);
                }
            });
    }

    const handleApprove = async (items) => {
        let isSubscribed = true;

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, items)
            .then((res) => {
                if (isSubscribed) {
                    applicationDetails()
                    notify("success", "successfully Approved!");
                    handleClose();
                    handleRejectClose();
                    loanHistory();
                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof e.response?.data?.response == "string") {
                    notify("error", `${e.response.data.response}`);
                }
                else {
                    notify("error", `Something went wrong !`);
                }
            });


        return () => isSubscribed = false;
    }




    const handleEmpLoanInfo = (loanId) => {
        setLoanInfoById(true)
        applicationDetailsByEmp(loanId);
    }

    //table loan data
    const columnData = [
        {
            name: <span className='fw-bold' >Subject</span>,
            selector: row => row?.subject
        },
        {
            name: <span className='fw-bold' >Loan Category</span>,
            selector: row => row?.loan_category
        },
        {
            name: <span className='fw-bold' >Amount</span>,
            selector: row => row?.amount
        },
        {
            name: <span className='fw-bold' >loan Status</span>,
            selector: row => row?.loan_status
        },

        {
            name: <span className='fw-bold' >Date</span>,
            selector: row => row?.date
            // selector: row => {moment(row?.created_at).format('DD-MM-YYYY')}
        },

        {
            name: 'Action',
            selector: row => actionButton(row.id),
        },
    ];




    const actionButton = (id) => {
        return <>
            <ul className="action">

                <li>
                    <Link href="#">
                        <a onClick={() => handleEmpLoanInfo(id)}>
                            <ViewIcon />
                        </a>
                    </Link>

                </li>

            </ul>
        </>
    }



    //Payment Collection Modal Action
    const [showPayment, setShowPayment] = useState(false);
    const handleClosePaymentModal = () => setShowPayment(false);
    const handleOpenPaymentModal = () => setShowPayment(true);

    const paymentForm = async (formData) => {
        let isSubscribed = true;

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", `${res?.data?.response}`);
                    handleClosePaymentModal();
                }
            })
            .catch((e) => {
                console.log(e);

            });

        return () => isSubscribed = false;
    }

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Loan-Applications', link: '/modules/hr/loanApplications' },
        { text: 'View Loan-Applications', link: '/modules/hr/loanApplications/details/[id]' },

    ];


    return (
        <>
            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            {!loanInfoById ? (

                                <div className="border-bottom title-part-padding">
                                    <h4 className="card-title mb-0">Loan Application-Details</h4>
                                </div>
                            ) : (

                                <div className="border-bottom title-part-padding">
                                    <h4 className="card-title mb-0">Loan Application-Details By Employee</h4>
                                </div>
                            )

                            }

                            <div className="card-body">

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div>
                                            {!loanInfoById ? (
                                                <>
                                                    <div style={{ marginLeft: '80%', marginBottom: '1%' }}>
                                                        {
                                                            details.loan_status == 'Pending' &&

                                                            <div className="row">
                                                                <div className="col-md-6 col-sm-6">
                                                                    <button onClick={handleShow} className="btn btn-success text-white"> Approve </button>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6">
                                                                    <button onClick={handleReject} className="btn btn-danger">Reject</button>
                                                                </div>
                                                            </div>}
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

                                                    {/* Payment Collection Modal Form */}
                                                    <Modal dialogClassName="modal-sm" show={showPayment} onHide={handleClosePaymentModal}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>New payment collection</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <PaymentCollectionForm onSubmit={paymentForm} loanId={details?.id} employee_id={details?.employee_id} />
                                                        </Modal.Body>
                                                    </Modal>
                                                    {/* End Payment collection Modal Form */}
                                                    {/* <h3 className="box-title mt-5">Application Basic Info</h3> */}
                                                    <div className="table-responsive ">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td width={390}>Employee Name</td>
                                                                    <td>{details?.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Subject</td>
                                                                    <td>
                                                                        {details?.subject}
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>Subject</td>
                                                                    <td>
                                                                        {details?.amount}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Loan Category</td>
                                                                    <td>
                                                                        {details?.loan_category}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Date</td>
                                                                    <td>
                                                                        {details?.date}
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>Description</td>
                                                                    <td>
                                                                        {details?.description}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Loan Status</td>
                                                                    <td>
                                                                        {details.loan_status == 'Pending' ?
                                                                            <span className="text-danger">Pending</span> :
                                                                            <span className="text-success">{details?.loan_status}</span>
                                                                        }
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="box-title mt-5">Employee Loan Info</h3>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td width={390}>Employee Name</td>
                                                                    <td>{detailsByEmp?.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Subject</td>
                                                                    <td>
                                                                        {detailsByEmp?.subject}
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>Subject</td>
                                                                    <td>
                                                                        {detailsByEmp?.amount}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Loan Category</td>
                                                                    <td>
                                                                        {detailsByEmp?.loan_category}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Date</td>
                                                                    <td>
                                                                        {detailsByEmp?.date}
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>Description</td>
                                                                    <td>
                                                                        {detailsByEmp?.description}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Loan Status</td>
                                                                    <td>
                                                                        {detailsByEmp?.loan_status == 'Pending' ?
                                                                            <span className="text-danger">Pending</span> :
                                                                            <span className="text-success">{detailsByEmp?.loan_status}</span>
                                                                        }
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )
                                            }

                                        </div>


                                        {details.loan_status != 'Pending' &&
                                            <div className='row m-5'>
                                                <div className='col-md-4 col-lg-4'>
                                                </div>
                                                <div className='col-md-4 col-lg-4'>

                                                    <div style={{ marginLeft: '100%' }}>
                                                        <Button className='bg-info text-white' onClick={handleOpenPaymentModal} variant="contained" color="secondary"><span className='mx-2'><FaMoneyBillWave /></span>Payment Collection</Button>
                                                    </div>
                                                </div>

                                            </div>
                                        }

                                        <h5 className='mb-2'><u>Installment History</u></h5>

                                        <table className="table table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th scope="col">SL.</th>
                                                    <th scope="col">Installment Date</th>
                                                    <th scope="col">Installment Method</th>
                                                    <th scope="col">Installment Amount</th>
                                                    <th scope="col">Installment Slip</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {installmentHistory && installmentHistory.map((installment, index) => (
                                                    <Fragment key={index}>
                                                        <tr>
                                                            <td scope="row">{index + 1}</td>
                                                            <td>{moment(installment?.created_at).format('DD-MM-YYYY')}</td>
                                                            <td>{installment?.account_name}</td>
                                                            <td>{installment?.amount}</td>
                                                            <td>{installment?.reference}</td>
                                                        </tr>
                                                    </Fragment>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="border-bottom title-part-padding">
                                <h4 className="card-title mb-0">Application-History</h4>
                            </div>
                            <div className="card-body">
                                <h4> Loan history</h4>
                                <div className='border my-3 mb-3'>
                                    <DataTable
                                        columns={columnData}
                                        data={empLoanHistory}
                                        striped
                                    // theme={"solarized"}
                                    />
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
