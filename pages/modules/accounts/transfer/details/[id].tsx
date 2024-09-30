import Link from 'next/link';
import { useRouter } from 'next/router';
import converter from 'number-to-words';
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { FaEdit, FaFilePdf, FaPhone } from 'react-icons/fa';
import HotelLogo from "../../../../../components/hotelLogo";
/**pdf generator package*/
import BarcodeGenerator from "../../../../../components/Barcode";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import PropagateLoading from '../../../../../components/PropagateLoading';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';
import Breadcrumbs from '../../../../../components/Breadcrumbs';

export default function Details() {
    // Router setup
    const router = useRouter();
    const { isReady, query: { id } } = router;
    const { pathname } = router;
    const { http } = Axios();

    // Toastify setup
    const notify = React.useCallback((type: any, message: any) => {
        toast({ type, message });
    }, []);

    //state declaration
    const [aft, setAft] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [initialLoading, setInitialLoading] = useState<boolean>(true)
    const [editAttempt, setEditAttempt] = useState<boolean>(false)
    const [supplierInfo, setSupplierInfo] = useState<{ name: string; address: string; contact_number: number; email: string }>({
        name: "",
        address: "",
        contact_number: 0,
        email: "",
    });
    const [barcode, setBarcode]: any = useState("");


    useEffect(() => {
        const controller = new AbortController();


        //fetching invoice items
        const getAftDetails = async () => {
            let body: any = {}
            body = {
                action: "aftListById",
                id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
                body
            ).then(res => {
                setAft(res?.data?.data || []);
                setTotalAmount(res?.data?.data[0]?.amount);
                setBarcode(res?.data?.data[0]?.slip_num);
                setInitialLoading(false);
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }
        isReady && getAftDetails()

        return () => controller.abort();
    }, [id, isReady])


    //pascal case converter
    function getPascalCase(string: String) {
        var splitStr = string.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    let items: { quantity: number, description: string, price: number, "tax-rate": number }[] = [];

    if (aft?.length) {
        aft?.map((invoice) => {
            items.push({
                quantity: invoice?.item_qty,
                description: invoice?.itemName,
                "tax-rate": 0,
                price: invoice?.unitPrice
            })
        })
    }

    const print = async () => {
        const element = document.getElementById('printME');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        notify("success", "printing....")
        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };

    //table data
    const columnData: any = [
        {
            name: <span className='fw-bold' >From</span>,
            selector: (row: { from: string; }) => row?.from,
            width: "40%"
        },
        {
            name: <span className='fw-bold' >To</span>,
            selector: (row: { to: string; }) => row?.to,
            width: "50%"
        },
        {
            name: <span className='fw-bold' >Amount</span>,
            selector: (row: { amount: string; }) => row?.amount,
            width: "10%"
        },
    ];
    const rowData = aft;

      //breadcrumbs
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Balance Transfer List', link: '/modules/accounts/transfer/list' },
        { text: 'All Balance Transfer List', link: '/modules/accounts/transfer/details/[id]' },
    ]
    return (
        <div>
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow pb-5 m-4'>
                {!initialLoading ? <div className='p-4' id='printME'>
                    <div className='mb-5'>
                        <div className='text-center fs-3'>
                            {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                            <HotelLogo id={id} invoiceName=""/>
                            
                        </div>


                        <div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>

                                </div>
                            </div>
                            <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                {/* <div>
                                    <strong>Invoice# </strong>
                                    <span>{aft.length && aft[0]?.slip_num}</span>
                                </div>
                                <div>(Bar Code)</div> */}
                                 <BarcodeGenerator value={aft.length && aft[0]?.slip_num} />
                            </div>
                            <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <div><strong>Create Date-Time:</strong><span>{aft.length && aft[0]?.created_at}</span></div>
                                    <div><strong>Remarks:</strong><span>{aft.length && aft[0]?.remarks}</span></div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <DataTable
                        columns={columnData}
                        data={rowData}
                        striped
                    />
                    <div className='mb-2 pt-4 row border-top'>
                        <div className='col-sm-12 col-lg-8 col-md-8'>
                            <div><span className='fw-bold' >In Word: {getPascalCase(converter.toWords(totalAmount)) + " TAKA Only"}</span></div>
                        </div>
                        <div className='row text-end col-sm-12 col-lg-4 col-md-4'>
                            <div className='row col-sm-6 col-lg-6 col-md-6'>
                                <div><span className='fw-bold' >Total Amount:</span></div>
                            </div>
                            <div className='row col-sm-12 col-lg-6 col-md-6'>
                                <div><span>{totalAmount} Tk</span></div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between my-4'>
                        <div className='w-25 mt-5'>
                            <div><hr /></div>
                            <div className='text-center fw-bolder'>Reciever's signature </div>
                        </div>
                        <div className='w-25 text-center pt-5 mt-5'>
                            {/* (company logo) */}
                        </div>
                        <div className='w-25 mt-5'>
                            <div ><hr /></div>
                            <div className='text-center fw-bolder'>For managebeds computer</div>
                        </div>
                    </div>
                </div> : <div className='text-center my-5'><PropagateLoading/></div>}
                {!initialLoading && <div className='row m-0'>
                    <div className='col-md-6 col-lg-6'>
                        {/* <div>
                            <Link href={`/modules/purchase/return/${id}`}><Button variant='danger'>  <span className='fs-5'><FaEdit /></span> Cancel Transfer</Button></Link>
                            <Link href={`/modules/purchase/invoice/update/${id}`}><Button variant='info my-2 mx-2'> <span className='fs-5 mx-2'><FaEdit /></span>Edit Transfer </Button></Link>
                            {!!editAttempt && <Link href={`/modules/purchase/invoice/history/${id}`}><Button variant='info my-2 mx-2'> <span className='fs-5 mx-2'><FaEdit /></span>Edit History </Button></Link>}
                        </div> */}
                    </div>
                    <div className='col-md-6 col-lg-6 text-end'>
                        <Button variant='success' className='' onClick={print} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button>
                    </div>
                </div>}

            </div>

        </div>
    )
}

