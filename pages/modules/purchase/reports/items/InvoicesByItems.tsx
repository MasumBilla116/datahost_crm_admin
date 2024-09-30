import React, { useEffect, useState } from 'react'
import Axios from '../../../../../utils/axios';
import * as moment from 'moment';
import DataTable from 'react-data-table-component';
import Link from 'next/link';

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

function InvoicesByItems({ itemID }) {
    const { http } = Axios();

    console.log(itemID)
    const notify = React.useCallback((type: any, message: string) => {
        toast({ type, message });
    }, []);


    // itemID = [...new Set(itemID)];

    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState([]);

    useEffect(() => {
        const controller = new AbortController()

        //fetch all suppliers
        const getSuppliers = async () => {
            let body: any = {}
            body = {
                action: "getItemInvoiceByID",
                itemID
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
                body
            ).then(result => {
                console.log(result?.data?.data);
                setFilteredData(result?.data?.data);
            });
        }

        getSuppliers()


        return () => controller.abort();
    }, []);


    const actionButton = (id) => {
        return <>
            <ul className="action">
                <li>
                    <Link href={`/modules/purchase/invoice/details/${id}`}>
                        <a >
                            <ViewIcon />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={`/modules/purchase/invoice/update/${id}`}>
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
            name: <span className='fw-bold' >supplier invoice id</span>,
            selector: row => row?.supplier_invoice_id,
            width: "20%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Unit Price</span>,
            selector: row => row.unit_price,
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
            name: <span className='fw-bold' >Remarks</span>,
            selector: row => row.remarks,
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

        notify("success", "printing purchase reports of items")
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
                            <h4 className="card-box p-3 mb-0">Purchase report by items</h4>
                        </div>
                    </div>
                    {filteredData.map((data, index) => {
                        return (
                            <>
                                {!!data.length &&
                                    <>
                                        <h6 className='card-box p-3 mb-0 text-center'>{"Purchase Reports Of " + data[0]?.name}</h6>
                                        <DataTable
                                            columns={columns}
                                            data={data}
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
                                        {filteredData.length - 1 !== index && < hr />}
                                    </>
                                }
                            </>
                        )
                    })}
                </div>
                <div className='my-3 pe-5 pb-5 text-end'>
                    <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print report</Button>
                </div>
            </>
                :
                <div className='my-5 text-center'>
                    <PropagateLoading />
                </div>}

        </>
    )
}

export default InvoicesByItems