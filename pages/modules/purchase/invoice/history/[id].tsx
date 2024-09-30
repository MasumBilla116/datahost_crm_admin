import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import easyinvoice from 'easyinvoice';
import converter from 'number-to-words';
import * as moment from 'moment';
import { Button } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import { FaPhone, FaEdit, FaFilePdf } from 'react-icons/fa';

import PropagateLoading from '../../../../../components/PropagateLoading';
import Axios from '../../../../../utils/axios';

function InvoiceHistory() {

    // Router setup
    const { isReady, query: { id } } = useRouter();

    const { http } = Axios();

    //state declaration
    const [invoices, setInvoices] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [supplierID, setSupplierID] = useState<number>();
    const [initialLoading, setInitialLoading] = useState<boolean>(true)
    const [editHistories, setEditHistories] = useState<any[]>([]);
    const [supplierInfo, setSupplierInfo] = useState<{ name: string; address: string; contact_number: number; email: string }>({
        name: "",
        address: "",
        contact_number: 0,
        email: "",
    })


    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getInvoiceDetails = async () => {
            let body: any = {}
            body = {
                action: "getInvoiceDetails",
                supplier_invoice_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
                body
            ).then(res => {
                setSupplierID(res?.data?.data[0]?.supplier_id)
                setInvoices(res?.data?.data || []);
                let totalamount = 0;
                res?.data?.data.map((invoice: any) => {
                    totalamount += invoice.unitPrice * invoice.item_qty
                })
                setTotalAmount(totalamount);
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }
        isReady && getInvoiceDetails()

        return () => controller.abort();
    }, [id, isReady])

    useEffect(() => {
        const controller = new AbortController();

        //fetching supplier info
        const getSupplierInfo = async () => {
            if (supplierID) {
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, { action: "getSupplierByID", id: supplierID })
                    .then((res) => {
                        setSupplierInfo({
                            ...supplierInfo, name: res?.data?.data[0]?.name,
                            address: res?.data?.data[0]?.address,
                            contact_number: res?.data?.data[0]?.contact_number,
                            email: res?.data?.data[0]?.email
                        })
                        setInitialLoading(false)
                    })
                    .catch((err) => {
                        console.log('Something went wrong !' + <br /> + err)
                    });
            }
        }
        getSupplierInfo()

        return () => controller.abort();
    }, [supplierID])

    useEffect(() => {
        const controller = new AbortController();

        //fetching supplier info
        const getInvoiceHistory = async () => {
            if (supplierID) {
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, { action: "editHistory", supplier_invoice_id: id })
                    .then((res) => {
                        setEditHistories(res?.data?.data)
                    })
                    .catch((err) => {
                        console.log('Something went wrong !' + <br /> + err)
                    });
            }
        }
        getInvoiceHistory()

        return () => controller.abort();
    }, [supplierID])

    //table data 1
    const columnData: any = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: (row: any, index: number) => index + 1,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Product</span>,
            selector: (row: { itemName: string; }) => row?.itemName,
            width: "40%"
        },
        {
            name: <span className='fw-bold' >Remarks</span>,
            selector: (row: { item_remarks: string; }) => row?.item_remarks,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Cost</span>,
            selector: (row: { unitPrice: number; }) => row?.unitPrice,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Qty</span>,
            selector: (row: { item_qty: number; }) => row?.item_qty,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Unit Type</span>,
            selector: (row: { piece: string; }) => row?.piece.slice(0, 1) + "(s)",
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Total</span>,
            selector: (row: { item_qty: number, unitPrice: number; }) => (row?.item_qty * row?.unitPrice).toFixed(2),
            width: "10%"
        },
    ];
    const rowData = invoices;

    //table data 2
    const historyColumnData: any = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: (row: any, index: number) => index + 1,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Product</span>,
            selector: (row: { itemName: string; }) => row?.itemName,
            width: "40%"
        },
        {
            name: <span className='fw-bold' >old_qty</span>,
            selector: (row: { old_qty: number; }) => row?.old_qty,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >new_qty</span>,
            selector: (row: { new_qty: number; }) => row?.new_qty,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >affected_qty</span>,
            selector: (row: { affected_qty: number; }) => row?.affected_qty,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >old_price</span>,
            selector: (row: { old_price: string; }) => row?.old_price,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >new_price</span>,
            selector: (row: { new_price: number }) => row?.new_price,
            width: "10%"
        },
    ];

    return (
        <div>
            <div className='card shadow p-5 m-4'>
                <div className='mb-5'>
                    <div className='text-center fs-3'>
                        <h1 className='mb-3'>(Company Logo)</h1>
                        <p className='m-0'>Gonoeshtola, Modern More, Dinajpur-500, Bangladesh</p>
                        <p><span style={{ fontSize: "14px", marginRight: "2px" }} ><FaPhone /></span>017xxxxxx, 017xxxxxx-Al-Amin, 017xxxxxx-Russel, <span style={{ fontSize: "14px", marginRight: "2px" }} ><FaPhone /></span>info@siliconbd.com www.siliconbd.com</p>
                    </div>
                    {initialLoading
                        ?
                        <div className="my-5 mx-3 text-center">
                            <PropagateLoading />
                        </div>
                        :
                        <div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>
                                    <div>{supplierInfo?.name}</div>
                                    <strong>{supplierInfo?.address} </strong>
                                    {!!supplierInfo?.contact_number && <div className='mt-1'>Phone:  {supplierInfo?.contact_number}</div>}
                                    {supplierInfo?.email && <div>Email: {supplierInfo?.email}</div>}
                                </div>
                            </div>
                            <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>
                                    <strong>Invoice# </strong>
                                    <span>{invoices.length && invoices[0]?.local_invoice}</span>
                                </div>
                                <div>(Bar Code)</div>
                            </div>
                            <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <div><strong>Supplier Invoice:</strong><span>{invoices.length && invoices[0]?.supplier_invoice_id}</span></div>
                                    <div><strong>Local Invoice:</strong><span>{invoices.length && invoices[0]?.local_invoice}</span></div>
                                    <div className='mt-2'><strong>Total Amount:</strong><span>{totalAmount} Tk</span></div>
                                    <div><strong>Invoice Date:</strong><span>{invoices.length && invoices[0]?.invoice_date}</span></div>
                                    <div><strong>Create Date-Time:</strong><span>{invoices.length && invoices[0]?.created_at}</span></div>
                                    <div><strong>Remarks:</strong><span>{invoices.length && invoices[0]?.common_remarks}</span></div>
                                </div>
                            </div>
                        </div>
                    }

                    {!initialLoading &&
                        <div>
                            <h4 className='text-center my-3'>Invoice Edit History</h4>
                            <DataTable
                                columns={columnData}
                                data={rowData}
                                striped
                            />
                            <div className='text-end pe-5'>
                                <div className='pe-3 fw-bolder'>Total: <span>{totalAmount.toFixed(2)} Tk</span></div>
                            </div>
                        </div>}
                </div>
                <div>
                    {!!editHistories.length && editHistories.map((history: any) => {
                        return (
                            <>
                                <div className='d-flex justify-content-between '>
                                    <div >{history[0]?.edit_attempt ? <h5>Edit History : {history[0]?.edit_attempt}</h5> : <h5>Initial State</h5>}</div>
                                    <div className='small' >{history[0]?.name ? <div><span className='fw-bolder'>Action by</span> : {history[0]?.name}</div> : <div>Admin</div>}</div>
                                </div>
                                <div className='text-end small'>
                                    {history[0]?.created_at && <span><span className='fw-bolder'>Created at :</span>  {moment(history[0]?.created_at).format('YYYY-MM-DD ') + moment(history[0]?.created_at).format('hh:mm A')}</span>}
                                </div>
                                <div className='mb-5'>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr className='text-center'>
                                                <th className='fw-bolder'>#</th>
                                                <th className='fw-bolder'>Product</th>
                                                <th className='fw-bolder'>Old price</th>
                                                <th className='fw-bolder'>New Price</th>
                                                <th className='fw-bolder'>Old Qty</th>
                                                <th className='fw-bolder'>New Qty</th>
                                                <th className='fw-bolder'>Affected Qty</th>
                                                <th className='fw-bolder'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!!history.length && history.map((each: any, index: number) => {
                                                return (
                                                    <tr className='text-center'>
                                                        <td>{index + 1}</td>
                                                        <td>{each?.itemName}</td>
                                                        <td>{each?.old_price}</td>
                                                        <td>{each?.new_price}</td>
                                                        <td>{each?.old_qty}</td>
                                                        <td>{each?.new_qty}</td>
                                                        <td>{each?.affected_qty}</td>
                                                        <td>{each?.note}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

export default InvoiceHistory
