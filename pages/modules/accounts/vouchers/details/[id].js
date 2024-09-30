import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Button, Form, Modal } from "react-bootstrap";
import { FaPhone, FaEdit, FaFilePdf } from 'react-icons/fa';
import Link from 'next/link';
import easyinvoice from 'easyinvoice';
import converter from 'number-to-words';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Select2 from "../../../../../components/elements/Select2";

import Axios from '../../../../../utils/axios';
import toast from "../../../../../components/Toast/index";
import HotelLogo from '../../../../../components/hotelLogo';
import BarcodeGenerator from '../../../../../components/Barcode';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import { HeadSection } from '../../../../../components';
import PrintButton from '../../../../../components/elements/PrintButton';

//Create Component
const CreateForm = ({ onSubmit, invoiceId, loading }) => {

    const { http } = Axios();

    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const [payment, setPayment] = useState({
        discount: null,
        paid_amount: null,
        account: null,
        customer: null,
        invoice_id: null
    })

    const [invoiceInfo, setInvoiceInfo] = useState("");
    const [totalAmount, setTotalAmount] = useState();
    const [totalAmountTemp, setTotalAmountTemp] = useState();

    const [accountList, setAccountList] = useState("");
    const accounts_options = accountList?.data;

    const [accountBalance, setAccountBalance] = useState(null);

    const [pending, setPending] = useState(true);

    const handleChange = (e) => {
        if (e.target.name == 'discount') {

            setTotalAmount(Number(totalAmountTemp) - Number(e.target.value))

        }
        setPayment(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        const controller = new AbortController();
        async function getAllAccounts() {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "listAccounts", })
                .then((res) => {
                    setAccountList(res?.data);
                });
        }
        getAllAccounts()
        return () => controller.abort();

    }, [])

    useEffect(() => {
        const controller = new AbortController();
        async function getAccountBalance() {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "getAccountInfo", id: payment.account })
                .then((res) => {
                    setAccountBalance(res?.data?.data?.balance);
                });
        }
        getAccountBalance()
        return () => controller.abort();

    }, [payment.account])

    const fetchInvoiceData = useCallback(async () => {
        let isSubscribed = true;
        setPending(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { action: "getInvoiceInfo", invoice_id: invoiceId })
            .then((res) => {
                if (isSubscribed) {
                    setInvoiceInfo(res.data.data)
                    setPayment(prev => ({
                        ...prev,
                        discount: res.data.data.discount,
                        customer: res.data.data.customer?.id,
                        invoice_id: res.data.data.id
                    }));
                    setTotalAmount(res?.data?.data?.total_amount)
                    setTotalAmountTemp(Number(res?.data?.data?.total_amount) + Number(res?.data?.data?.discount))
                    setPending(false)
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setPending(false)
            });

        return () => isSubscribed = false;

    }, [invoiceId]);

    useEffect(() => {
        fetchInvoiceData();
    }, [fetchInvoiceData])

    let dataset = { ...payment, totalAmount, action: "makeRestaurantPayments" }




    return (

        <Form>

            <div className="row" style={{ padding: "20px" }}>
                <div className="col-md-4">
                    <div><strong>Customer : </strong><span>{invoiceInfo.customer ? invoiceInfo.customer?.first_name + " " + invoiceInfo.customer?.last_name : invoiceInfo.guest_customer}</span></div>
                    <div><strong>Address : </strong><span>{invoiceInfo.customer?.address || "NA"}</span></div>
                    <div><strong>phone : </strong><span>{invoiceInfo.customer?.mobile || "NA"}</span></div>
                    <div><strong>Customer Type : </strong><span>{invoiceInfo.customer ? 'Hotel Customer' : 'Walk In Customer'}</span></div>
                    <div><strong>Balance : </strong><span>{invoiceInfo.customer?.balance || "NA"}</span></div>
                    {/* <div><strong>Credit Limit : </strong><span></span></div>
                <div><strong>Available Credit : </strong><span></span></div> */}
                </div>
                <div className="col-md-4">
                    <div><strong>Invoice Payment</strong><span></span></div>
                    <div><strong>{invoiceInfo?.invoice_number}</strong><span></span></div>
                </div>
                <div className="col-md-4">
                    <div><strong>Invoicd Amount : </strong><span>{invoiceInfo?.total_amount}</span></div>
                    <div><strong>date : </strong><span>{moment(invoiceInfo?.created_at).format('DD/MM/YYYY')}</span></div>
                    <div><strong>Created By : </strong><span>{invoiceInfo?.creator?.name}</span></div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Final Discount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Final discount"
                            name='discount'
                            defaultValue={payment.discount}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Paid Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Paid Amount"
                            name='paid_amount'
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Select Accounts</Form.Label>
                        <Select2
                            options={accounts_options?.map(({ id, account_name }) => ({ value: id, label: account_name }))}
                            onChange={(e) => setPayment(prev => ({
                                ...prev, account: e?.value
                            }))}
                            name="account"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                        />
                    </Form.Group>
                    <p> Balance: {accountBalance}</p>
                </div>
                <div className="col-md-6">
                    <div><strong>Final Amount to Pay : </strong><span>{totalAmount}</span></div>
                    <div><strong>Paid Amount : </strong><span>{invoiceInfo?.paid_amount}</span></div>
                    <div><strong>Due Amount : </strong><span>{invoiceInfo?.due_amount}</span></div>
                </div>
            </div>


            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Payment
            </Button>
        </Form>
    );
};

function VoucherDetails() {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Router setup
    const { http } = Axios();
    const router = useRouter();
    const { pathname } = router;
    const {
        isReady,
        query: {
            id,
        }
    } = router;

    // Toastify setup;
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    //state declaration
    const [invoices, setInvoices] = useState([]);
    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getVoucherDetails = async () => {
            let body = {}
            body = {
                action: "getInvoiceInfo",
                invoice_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`,
                body
            ).then(res => {
                setInvoices(res?.data?.data || []);
            }).catch((err) => {
                console.log(err + <br /> + 'Something went wrong !')
            });
        }

        isReady && getVoucherDetails()

        return () => controller.abort();
    }, [id, isReady])


    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/`, items)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    handleClose();
                    setLoading(false);
                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                else {
                    if (msg?.account) {
                        notify("error", `${msg.account.Account}`);
                    }
                    if (msg?.price) {
                        notify("error", `${msg.price.Price}`);
                    }
                    if (msg?.foods) {
                        notify("error", `please select atleast one food!`);
                    }
                }
                setLoading(false);
            });

        return () => isSubscribed = false;
    }


    const handleDownloadPdf = async () => {
        const element = document.getElementById('printME');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        // notify("success", "printing invoice of " + supplierInfo?.name)
        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };

    //table data
    const columnData = [

        {
            name: <span className='fw-bold' >Sector Name</span>,
            selector: row => row?.sectorName,
            // width: "60%"
        },
        {
            name: <span className='fw-bold' >Remarks</span>,
            selector: row => row?.remarks,
            // width: "60%"
        },
        {
            name: <span className='fw-bold' >Debit</span>,
            selector: row => row?.debit,
            // width: "10%"
        },
        {
            name: <span className='fw-bold' >Credit</span>,
            selector: row => row?.credit,
            // width: "10%"
        },
    ];
    const rowData = invoices?.invoice_list;

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Accounts Vouchers', link: '/modules/accounts/vouchers' },
        { text: 'View Vouchers', link: '/modules/accounts/vouchers/details/[id]' },
    ]

    return (
        <div>
            <HeadSection title="View Vouchers" />
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow pb-5 m-4'>
                <div id="printME" className='p-5'>
                    <div >
                        <div className='text-center fs-3'>
                            {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                            <HotelLogo id={id} invoiceName=""/>
                            
                        </div>
                        <div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                {/* <div>
                                <strong>Voucher Remarks: {invoices?.remarks} </strong>
                            </div> */}
                            </div>
                            <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                {/* <div>
                                <strong>Voucher Number:  </strong>
                                <strong>{invoices?.voucher_number}</strong>
                            </div>
                            <div>(Bar Code)</div> */}
                                <BarcodeGenerator value={invoices?.voucher_number} />
                            </div>
                            <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <div><strong>Date : </strong><span>{moment(invoices?.created_at).format('DD-MM-YYYY')}</span></div>
                                    <div><strong>Created By : </strong><span>{invoices?.creator?.name}</span></div>
                                    <div><strong>Remarks : </strong><span>{invoices?.remarks}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <DataTable
                            columns={columnData}
                            data={rowData}
                            striped
                        />
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        Total Debit:
                                    </div>
                                    <div className="col-md-6">
                                        {invoices.total_debit}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        Total Credit:
                                    </div>
                                    <div className="col-md-6">
                                        {invoices.total_credit}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <hr />
                    <div className="row">
                        <div className="col-md-6">
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                            <div className="col-md-7">
                            Grand Total:
                            </div>
                            <div className="col-md-5">
                              {invoices.total_amount}
                            </div>
                            </div>
                        </div>
                    </div> */}

                        <div className='d-flex justify-content-between my-4'>
                            <div className='w-25 mt-5'>
                                <div><hr /></div>
                                <div className='text-center fw-bolder'>Reciever's signature </div>
                            </div>

                            <div className='w-25 mt-5'>
                                <div ><hr /></div>
                                <div className='text-center fw-bolder'>For managebeds computer</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row m-0'>
                    <div className='col-md-6 col-lg-6'>
                        {/* {invoices.is_paid == 0 &&
                            <div>
                                <Button variant='info' onClick={handleShow} > <span className='fs-5'></span>Payment</Button>
                            </div>}

                            <Modal dialogClassName="modal-lg"  show={show} onHide={handleClose}>
                              <Modal.Header closeButton>
                                <Modal.Title>Create Payment</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <CreateForm onSubmit={submitForm} invoiceId={id} loading={loading} />
                              </Modal.Body>
                            </Modal> */}

                    </div>
                    <div className='col-md-6 col-lg-6 text-end'>
                        {/* <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
                        <PrintButton contentId="printME" />

                    </div>
                </div>

            </div>

        </div>
    )
}
export default VoucherDetails