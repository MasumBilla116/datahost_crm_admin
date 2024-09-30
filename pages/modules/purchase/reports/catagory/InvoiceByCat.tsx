import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import * as moment from 'moment';
import { Button } from "react-bootstrap";

import { FaFilePdf } from 'react-icons/fa';

/**pdf generator package*/
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { EditIcon } from '../../../../../components';
import { DeleteIcon } from '../../../../../components';
import { ViewIcon } from '../../../../../components';
import toast from "../../../../../components/Toast/index";
import PropagateLoading from '../../../../../components/PropagateLoading';

import Axios from '../../../../../utils/axios';
import PrintButton from '../../../../../components/elements/PrintButton';

function InvoiceByCat({ catID }) {

    const notify = React.useCallback((type: any, message: string) => {
        toast({ type, message });
    }, []);
    const { http } = Axios();


    const [filteredData, setFilteredData] = useState([])

    catID = [...new Set(catID)];
    console.log(catID);

    useEffect(() => {
        const controller = new AbortController()
        const getInvoices = async () => {
            let body: any = {}
            body = {
                action: "getCatInvoiceByID",
                catID,
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
                body
            ).then(result => {
                // console.log(result?.data?.data);
                setFilteredData(result?.data?.data);
            });
        }

        getInvoices()

        return () => controller.abort();
    }, []);

    const actionButton = (supplier_Id) => {
        return <>
            <ul className="action">
                <li>
                    <Link href={`/modules/purchase/invoice/details/${supplier_Id}`}>
                        <a >
                            <ViewIcon />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={`/modules/purchase/invoice/update/${supplier_Id}`}>
                        <a>
                            <EditIcon />
                        </a>
                    </Link>
                </li>
            </ul>
        </>
    }
    const columns = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: (row, index) => index +1,
            width: "5%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >name</span>,
            selector: row => row?.name,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Unit Price</span>,
            selector: row => row.unit_cost,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold ' >qty</span>,
            selector: row => row.qty,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Description</span>,
            selector: row => row.description,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >unit type</span>,
            selector: row => row.unit_type,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Updated At</span>,
            selector: row => moment(row.updated_at).format('DD/MM/YYYY'),
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Created At</span>,
            selector: row => moment(row.created_at).format('DD/MM/YYYY'),
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Action</span>,
            selector: row => actionButton(row.id),
            width: "10%",
        },
    ];

    const handleDownloadPdf = async () => {
        const element = document.getElementById('printME');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        notify("success", "printing purchase reports of catagory")
        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };

    console.log(filteredData)
    return (
        <>
            {!!filteredData.length ? <>
                <div className="card shadow p-3" id="printME" >
                    <div className="d-flex border-bottom title-part-padding align-items-center">
                        <div>
                            <h4 className="card-box p-3 mb-0">Purchase report by category</h4>
                        </div>
                    </div>
                    {filteredData.map((data, index) => {
                        console.log(data?.supplier_invoice_items);
                        return (
                            <>
                                <div className=''>
                                    <h6 className='card-box p-3 mb-0 text-center'>{"Category name :" + data?.name.toUpperCase()}</h6>
                                </div>

                                {
                                    data && !!data?.supplier_invoice_items.length ?
                                        <DataTable
                                            columns={columns}
                                            data={data?.supplier_invoice_items}
                                            pagination
                                            highlightOnHover
                                            subHeader
                                            // subHeaderComponent={
                                            //     <input
                                            //         type="text"
                                            //         placeholder="search..."
                                            //         className="w-25 form-control"
                                            //         value={search}
                                            //         onChange={(e) => setSearch(e.target.value)}
                                            //     />
                                            // }
                                            striped
                                        />
                                        :
                                        <div className='text-center'>No invoices found</div>

                                }
                            </>
                        )
                    })}
                </div>
                <div className='my-3 pe-5 pb-5 text-end'>
                    <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print report</Button>
                    {/* <PrintButton contentId="printME" /> */}

                </div>
            </>
                :
                <div className='my-5 text-center'>
                    <PropagateLoading />
                </div>}

        </>
    )
}

export default InvoiceByCat