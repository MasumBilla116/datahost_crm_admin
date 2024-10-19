import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PropagateLoading from '../../../../../components/PropagateLoading';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';


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
                return_invoice_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase-product`,
                body
            ).then(res => { 
                setInvoices(res?.data?.data || []);
                let totalamount = 0;

                res?.data?.data.map((invoice) => {
                    totalamount += invoice.unit_price * invoice.return_quantity
                })
                setTotalAmount(totalamount);
            }).catch((err) => {
                console.log(err + <br /> + 'Something went wrong !')
            });
            setLoading(false);
        }

        isReady && getInvoiceDetails()

        // getItemQty();

        return () => controller.abort();
    }, [id, isReady])


 


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
                        <h2 className='mb-3' >Return Purchase Invoice</h2>
                    </div>
                    {loading ?

                        <div className="my-5 mx-3 text-center">
                            <PropagateLoading />
                        </div>
                        :

                        <><div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>

                               {invoices && <div>
                                    <div>Supplier</div>
                                    <strong>{invoices[0]?.supplier_name}</strong>
                                     <div>{invoices[0]?.supplier_contact_number}</div>
                                    <strong>{invoices[0]?.supplier_address} </strong> 

                                </div>}
                            </div>

                            <div className='row col-sm-4 col-lg-8 col-md-8 my-2'>
                                {invoices && <div className='ms-auto col-sm-8 col-lg-8 col-md-8'> 
                                    <div><strong>Invoice: </strong><span>{invoices[0]?.purchase_return_invoice}</span></div>
                                    <div className='mt-2'><strong>Total Amount: </strong><span>{totalAmount} Tk</span></div> 
                                    <div><strong>Create Date-Time: </strong><span>{ invoices[0]?.created_at}</span></div> 
                                </div>}
                            </div>
                        </div>  
                            <div className='row   my-2'> 
                                <div className='row   my-2' style={{height: '15em' }}>
                                    {invoices?.map((item, index) => { 
                                        return (
                                            <div className='col-sm-4 col-lg-4 col-md-4' key={index}>
                                                <p className='mt-1'>Item-{++index}: <strong >{item.item_name.toUpperCase()} {item.item_type_name} </strong></p>
                                                <p className='my-1'>Return Qty: {item.return_quantity}</p>
                                                <p className='my-1'>Unit Price: {item.unit_price}</p> 
                                                <p className='my-1'><strong >Total Amount (for {item.return_quantity} pcs): {(item.return_quantity * item.unit_price).toFixed(2)}</strong></p>
                                            </div>
                                        );
                                    })}
                                </div> 
                            </div></>
                    }
                </div>

            </div>
        </div>
    )
}
export default ReturnDetails
