import React, { useEffect, useState } from 'react'
import Axios from '../../../../../utils/axios';
import { useRouter } from 'next/router';
import * as moment from 'moment';
import DataTable from 'react-data-table-component';
import Link from 'next/link';

import { ViewIcon, EditIcon, DeleteIcon } from '../../../../../components';

function invoicesByItems() {
    const { http } = Axios();
    const { isReady, query: { id } } = useRouter();

    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        const controller = new AbortController()

        //fetch all suppliers
        const getSuppliers = async () => {
            let body: any = {}
            body = {
                action: "getItemInvoiceByID",
                itemID: 1
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
                body
            ).then(result => {
                setFilteredData(result?.data?.data);
            });
        }

        getSuppliers()


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
            name: <span className='fw-bold' >qty</span>,
            selector: row => row?.qty,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Unit Price</span>,
            selector: row => row.unit_price,
            width: "15%",
            sortable: true,
        },
        {
            name: <span className='fw-bold ' >remarks</span>,
            selector: row => row.remarks,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Total Item Quantity</span>,
            selector: row => row.total_item_qty,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Updated At</span>,
            selector: row => moment(row.updated_at).format('DD/MM/YYYY'),
            width: "20%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Created At</span>,
            selector: row => moment(row.created_at).format('DD/MM/YYYY'),
            width: "20%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Action</span>,
            selector: row => actionButton(row.id),
            width: "15%",
        },
    ];

    console.log(filteredData);
    return (
        <div className="card-body">
            
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    subHeader
                    // subHeaderComponent={
                    //   <input
                    //     type="text"
                    //     placeholder="search..."
                    //     className="w-25 form-control"
                    //     value={search}
                    //     onChange={(e) => setSearch(e.target.value)}
                    //   />
                    // }
                    striped
                />
            
        </div>
    )
}

export default invoicesByItems