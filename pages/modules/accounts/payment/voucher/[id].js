import React, { useCallback, useEffect, useState, Fragment } from 'react'
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
import PrintButton from '../../../../../components/elements/PrintButton';



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
    const [invoices, setInvoices] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getVoucherDetails = async () => {
            let body = {}
            body = {
                action: "getPaymentVoucherInfo",
                payment_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher`,
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


        //breadcrumbs
        const breadcrumbs = [
            { text: 'Dashboard', link: '/dashboard' },
            { text: 'All Payment Vouchers', link: '/modules/accounts/payment/voucher' },
            { text: 'View Payment Vouchers', link: '/modules/accounts/payment/voucher/[id]' },
        ]
    return (
        <div className='container'>
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow pb-5 m-4'>
                <div id="printME" className='px-5'>
                    <div>
                        <div className='text-center fs-3'>
                            {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                            <HotelLogo id={id} invoiceName=""/>
                            <p className='m-0'>Gonoeshtola, Modern More, Dinajpur-500, Bangladesh</p>
                            <p><span style={{ fontSize: "14px", marginRight: "2px" }} ><FaPhone /></span>017xxxxxx, 017xxxxxx-Al-Amin, 017xxxxxx-Russel, <span style={{ fontSize: "14px", marginRight: "2px" }} ><FaPhone /></span>info@siliconbd.com www.siliconbd.com</p>
                        </div>
                        <div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>
                                    <strong>Voucher Type: {invoices?.voucher_type}</strong>
                                </div>
                                <div>
                                    <strong>Voucher No: {invoices?.voucher_no}</strong>
                                </div>
                                <div>
                                    <strong>Payment Type: {invoices?.payment_type}</strong>
                                </div>
                            </div>
                            <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                            <strong>Payment Voucher</strong>
                                <BarcodeGenerator value={invoices?.voucher_no} />
                            </div>
                            <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <div><strong>Date : <span>{moment(invoices?.created_at).format('DD-MM-YYYY')}</span></strong></div>
                                    {/* <div><strong>Created By : {invoices?.creator?.name}</strong></div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <div>

                            {invoices?.payment_type !== "cash" ? <div>
                                <strong>Bank Name</strong>:  <u className='dotted-underline '  >{invoices?.bank_name}</u> <strong>Cheque No</strong>: <u className='dotted-underline ' >{invoices?.cheque_no}</u>    <strong>Cheque Date</strong>:  <u className='dotted-underline ' >{invoices?.cheque_date} </u>
                            </div> : ""}


                            <div style={{ marginTop: "20px" }}>
                                <strong>Ledger Type From</strong>:  <u className='dotted-underline ' >{invoices?.ledger_type_from}</u>    <strong>Ledger Type To</strong>: <u className='dotted-underline ' >{invoices?.ledger_type_to} </u>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <strong>From (Ledger)</strong>: <u className='dotted-underline ' >{invoices?.from_account}</u>     <strong>To (Ledger)</strong>:<u className='dotted-underline ' >{invoices?.to_account}</u>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <strong>Amount</strong>:   <u className='dotted-underline ' >{invoices?.amount}</u>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <strong>Amount in words</strong>: <u className='dotted-underline ' >{invoices?.amount_word} </u>
                            </div>
                        </div>



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


                    </div>
                    <div className='col-md-6 col-lg-6 text-end'>
                        {/* <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Voucher</Button> */}
                        <PrintButton contentId="printME" />

                    </div>
                </div>

            </div>

        </div>
    )
}
export default VoucherDetails