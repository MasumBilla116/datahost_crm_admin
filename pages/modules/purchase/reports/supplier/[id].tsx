import React, { useState, useEffect } from 'react'
import * as moment from 'moment';
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";

import { FaFilePdf } from 'react-icons/fa';

/**pdf generator package*/
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { EditIcon } from '../../../../../components';
import { DeleteIcon } from '../../../../../components';
import { ViewIcon } from '../../../../../components';
import Axios from '../../../../../utils/axios';
import toast from "../../../../../components/Toast/index";

function reportsBySupplier() {
    const { http } = Axios();
    const { isReady, query: { id } } = useRouter();

    const notify = React.useCallback((type: any, message: string) => {
        toast({ type, message });
    }, []);

    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState([]);

    const fetchItemList = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, {
            action: "getInvoiceBySupplierId",
            id: id
        })
            .then((res: any) => {
                if (isSubscribed) {
                    !!res?.data?.data.length &&
                        setFilteredData(res?.data?.data);
                }
            })
            .catch((err: any) => {
                console.log("Server Error ~!" + err)
            });
        return () => isSubscribed = false;
    };

    useEffect(() => {
        fetchItemList()
    }, [isReady, id])

    const actionButton = (id: any) => {
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
            name: <span className='fw-bold' >Local Invoice</span>,
            selector: row => row.local_invoice,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Supplier Invoice</span>,
            selector: row => row.supplier_invoice,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Total Item Quantity</span>,
            selector: row => row.total_item_qty,
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
            name: <span className='fw-bold' >Total amount</span>,
            selector: row => row.total_amount,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Created At</span>,
            selector: row => moment(row.created_at).format('DD/MM/YYYY'),
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >invoice_date</span>,
            selector: row => moment(row.invoice_date).format('DD/MM/YYYY'),
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Action</span>,
            selector: row => actionButton(row.id),
            width: "15%",
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

        notify("success", "printing purchase reports of supplier")
        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };
    console.log(filteredData);
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div id='printME'>
                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-box p-3 mb-0">Purchase report by supplier</h4>
                                </div>
                            </div>
                            <DataTable
                                columns={columns}
                                data={filteredData}
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
                        </div>
                        {!!filteredData.length && <div className='my-3 pe-5 pb-5 text-end'>
                            <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print report</Button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default reportsBySupplier