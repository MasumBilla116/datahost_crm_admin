import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";
import { FaPhone, FaEdit, FaFilePdf, FaHandPointLeft, FaHandPointRight } from 'react-icons/fa';
import Axios from '../../../../../utils/axios';
import toast from "../../../../../components/Toast/index";
import index from '../index';
import PropagateLoading from '../../../../../components/PropagateLoading';
import Breadcrumbs from '../../../../../components/Breadcrumbs';


function ReturnDetails() {

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
    const [totalAmount, setTotalAmount] = useState(0);
    const [supplierID, setSupplierID] = useState();
    const [checkreturn, setCheckreturn] = useState();
    const [invoiceID, setInvoiceid] = useState();
    const [loading, setLoading] = useState(true);


    const [supplierInfo, setSupplierInfo] = useState({
        name: "",
        address: "",
        contact_number: 0,
        email: "",
    })

    const [supplierInvoiceinfo, setsupplierInvoiceinfo] = useState({
        return_type: "",
        is_returned: 0,
        return_amount: 0

    })

    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getInvoiceDetails = async () => {
            let body = {}
            body = {
                action: "getReturnInvoiceDetails",
                supplier_invoice_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
                body
            ).then(res => {
                setSupplierID(res?.data?.data[0]?.supplier_id)


                setInvoices(res?.data?.data || []);
                let totalamount = 0;

                res?.data?.data.map((invoice) => {
                    totalamount += invoice.unitPrice * invoice.item_qty
                })

            }).catch((err) => {
                console.log(err + <br /> + 'Something went wrong !')
            });
        }

        isReady && getInvoiceDetails()

        // getItemQty();

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
                            ...supplierInfo,
                            name: res?.data?.data[0]?.name,
                            address: res?.data?.data[0]?.address,
                            contact_number: res?.data?.data[0]?.contact_number,
                            email: res?.data?.data[0]?.email
                        })
                        setLoading(false)
                    })
                    .catch((err) => {
                        console.log(err + <br /> + 'Something went wrong !')
                    });
            }
        }
        getSupplierInfo()

        return () => controller.abort();
    }, [supplierID])

    useEffect(() => {
        const controller = new AbortController();

        //fetching supplier info
        const getSupplierInvoice = async () => {
            if (supplierID) {
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, { action: "getInvoiceByID", id: id })
                    .then((res) => {
                        setCheckreturn(res?.data?.data[0]?.is_returned)
                        setsupplierInvoiceinfo({
                            ...supplierInvoiceinfo,
                            return_type: res?.data?.data[0]?.return_type,
                            is_returned: res?.data?.data[0]?.is_returned,
                            return_amount: res?.data?.data[0]?.return_amount
                        })
                        setTotalAmount(res?.data?.data[0]?.return_amount);
                    })
                    .catch((err) => {
                        console.log(err + <br /> + 'Something went wrong !')
                    });
            }
        }
        getSupplierInvoice()

        return () => controller.abort();
    }, [supplierID])







    async function cancelPurchaseReturn() {

        if (invoices?.length) {
            invoices?.map(async (item) => {

                setInvoiceid(item?.supplier_invoice_id)

                let body = {
                    action: "cancelReturnSupplierInvoice",
                    return_qty: item?.return_qty,
                    invoiceitemId: item?.id,
                    itemId: item?.itemId,
                    invoiceId: item?.supplier_invoice_id,
                    unitPrice: item?.unitPrice,
                    itemName: item?.itemName,
                    supplierID: supplierID,
                    totalRetAmmount: item?.return_qty * item?.unitPrice,
                    itemStatuscode: 0
                }

                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, body)
                    .then((res) => {
                        notify("success", item?.itemName + " " + "Purchase Return Successfully Cancel!");

                        router.push(`/modules/purchase/return/`)
                    }).catch((err) => {
                        console.log(err + <br /> + 'Something went wrong !')
                    });

                setTotalAmount(0);
            })

        }
    }
    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Return Invoice', link: '/modules/purchase/return' },
        { text: 'View Invoice', link: '/modules/purchase/return/details/[id]' },
    ];


    return (
        <div>
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow p-5 m-4'>
                <div className='mb-5'>

                    <div className='text-left'>
                        <h2 className='mb-3' style={{ color: 'red' }}>Return Purchase Invoice</h2>
                    </div>
                    {loading ?

                        <div className="my-5 mx-3 text-center">
                            <PropagateLoading />
                        </div>
                        :

                        <><div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>
                                    <div>Supplier</div>
                                    <strong>{supplierInfo?.name}</strong>
                                    <strong>{supplierInfo?.address} </strong>
                                    {!!supplierInfo?.contact_number && <div className='mt-1'>Phone: {supplierInfo?.contact_number}</div>}
                                    {supplierInfo?.email && <div>Email: {supplierInfo?.email}</div>}

                                </div>
                            </div>

                            <div className='row col-sm-4 col-lg-8 col-md-8 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <div><strong>Supplier Invoice:</strong><span>{invoices.length && invoices[0]?.supplier_invoice_id}</span></div>
                                    <div><strong>Local Invoice:</strong><span>{invoices.length && invoices[0]?.local_invoice}</span></div>
                                    <div className='mt-2'><strong>Total Amount:</strong><span>{totalAmount} Tk</span></div>
                                    <div><strong>Invoice Date:</strong><span>{invoices.length && invoices[0]?.invoice_date}</span></div>
                                    <div><strong>Create Date-Time:</strong><span>{invoices.length && invoices[0]?.created_at}</span></div>
                                    <div><strong>Remarks:</strong><span>{invoices.length && invoices[0]?.common_remarks}</span></div>
                                </div>
                            </div>
                        </div><div className='row small my-2'>
                                <div className='row-sm-4 row-lg-4 row-md-4 my-2'>
                                    <strong style={{ fontSize: '18px' }}>Return Type: <span style={{ color: 'red' }}>{supplierInvoiceinfo?.return_type}</span></strong>
                                    <div className='mt-1'>Return Amount: <span style={{ color: 'red' }}>{totalAmount}</span> TK</div>
                                </div>
                            </div><div className='row small my-2'>
                                <div className='row-sm-4 row-lg-4 row-md-4 my-2'>
                                    <div className='mt-1'>Invoice Items:</div>

                                </div>
                            </div><div className='row small my-2'>
                                {/* <div className='row small my-2' style={{ overflow: 'scroll', height: '15em' }}> */}
                                <div className='row small my-2' style={{height: '15em' }}>
                                    {invoices?.filter(inv => inv.return !== 0).map((item, index) => {


                                        return (
                                            <div className='col-sm-4 col-lg-4 col-md-4' key={index}>
                                                <p className='mt-1'>Item-{++index}.<strong style={{ color: 'red' }}>{item.itemName.toUpperCase()}</strong></p>
                                                <p className='my-1'>Purchades Qty: {item.item_qty}</p>
                                                <p className='my-1'>Purchades Rate: {item.unitPrice}</p>
                                                <p className='my-1'><strong style={{ color: 'red' }}>Returned Qty: {item.return_qty}</strong></p>
                                                <p className='my-1'><strong style={{ color: 'red' }}>Returned Amount (for {item.return_qty} pcs): {(item.return_qty * item.unitPrice).toFixed(2)}</strong></p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className='row m-0'>
                                    <div className='col-md-12 col-lg-12 text-end'>
                                        <Button variant='success' className='' onClick={cancelPurchaseReturn}><span className='fs-5 me-1'><FaHandPointRight /></span>Cancel Return Puchase</Button>
                                    </div>
                                </div>
                            </div></>
                    }
                </div>

            </div>
        </div>
    )
}
export default ReturnDetails
