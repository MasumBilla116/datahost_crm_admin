import React, { useState, useEffect } from 'react'
import * as moment from 'moment';
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EditIcon } from '../../../../../components';
import { DeleteIcon } from '../../../../../components';
import { ViewIcon } from '../../../../../components';
import Axios from '../../../../../utils/axios';

function reportsBySupplier() {
    const { http } = Axios();
    const { isReady, query: { id } } = useRouter();
    const [filteredData, setFilteredData] = useState([]);

    const fetchItemList = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, {
            action: "getInvoiceBySupplierId",
            id: id
        })
            .then((res) => {
                if (isSubscribed) {
                    !!res?.data?.data.length &&
                        setFilteredData(res?.data?.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });
        return () => isSubscribed = false;
    };

    useEffect(() => {
        fetchItemList()
    }, [isReady, id])

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
            name: <span className='fw-bold ' >Total Item</span>,
            selector: row => row.total_item,
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
            name: <span className='fw-bold' >Total amount</span>,
            selector: row => row.total_amount,
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Created At</span>,
            selector: row => moment(row.created_at).format('DD/MM/YYYY'),
            width: "10%",
            sortable: true,
        },
        {
            name: <span className='fw-bold' >Action</span>,
            selector: row => actionButton(row.id),
            width: "15%",
        },
    ];

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

export default reportsBySupplier