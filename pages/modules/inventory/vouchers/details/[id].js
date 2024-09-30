import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { FaEdit } from 'react-icons/fa';

import BarcodeGenerator from '../../../../../components/Barcode';
import toast from "../../../../../components/Toast/index";
import PrintButton from '../../../../../components/elements/PrintButton';
import HotelLogo from '../../../../../components/hotelLogo';
import Axios from '../../../../../utils/axios';

function VoucherDetails() {

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
    const [totalQuantity,setTotalQuantity] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getVoucherDetails = async () => {
            let body = {}
            body = {
                action: "getVoucherInfo",
                voucher_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,
                body
            ).then(res => {
                var total_qnt =0;
                const data = res?.data?.data || [];
                setInvoices(data);
                data?.voucher_list.map((row)=>{
                    total_qnt += parseFloat(row?.item_qty);
                });
                setTotalQuantity(total_qnt);
                console.log("data: ",data);

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
    

    //table data
    const columnData = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: row => row.id,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Product</span>,
            selector: row => row?.itemName,
            width: "60%"
        },
        {
            name: <span className='fw-bold' >remarks</span>,
            selector: row => row?.remarks || "-",
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Qty</span>,
            selector: row =>  row?.item_qty,
            width: "10%"
        }
    ];
    const rowData = invoices?.voucher_list;
  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Consumption Vouchers', link: '/modules/inventory/vouchers' },
    { text: 'View Voucher', link: '/modules/inventory/vouchers/details/[id]' },
  ]
    return (
        <div>
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow pb-5 m-4'>
                <div id="printME" className='p-5'>
                <div>
                    <div className='text-center fs-3'>
                        {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                        <HotelLogo id={id} invoiceName="Inventory Vouchers"/>
                       
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
                            <div className="col-md-7 text-end">
                            <b>Total Quantity:</b>
                            </div>
                            <div className="col-md-5">
                              {
                                totalQuantity
                              }
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between my-4'>
                        <div className='w-25 mt-5'>
                            <div><hr /></div>
                            <div className='text-center fw-bolder'>Reciever's signature </div>
                        </div>
                        <div className='w-25 text-center pt-5 mt-5'>
                            (company logo)
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
                            <div>
                                <Link href={`/modules/inventory/vouchers/edit-history/${id}`}><Button variant='info' > <span className='fs-5'><FaEdit /></span>View Edit History</Button></Link>
                            </div>
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