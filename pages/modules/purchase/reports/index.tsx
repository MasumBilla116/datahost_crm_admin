import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";

import { Select2, Label } from "../../../../components";
import Axios from '../../../../utils/axios';
import InvoiceByCat from './catagory/InvoiceByCat';
import InvoicesByItems from './items/InvoicesByItems';
import InvoiceByDate from './date/InvoiceByDate';

function supplier() {
    const { http } = Axios();

    const router = useRouter();

    const [supplierID, setSupplierID] = useState("")
    const [supplier, setSupplier] = useState([])
    const [items, setItems] = useState([])
    const [itemID, setItemID] = useState([])
    const [catID, setCatID] = useState<any[]>([])
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [itemCatagories, setItemCategories] = useState([])

    const [showReportsCat, setShowReportsCat] = useState(true)

    const [value, setValue] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        //fetch all suppliers
        const getSuppliers = async () => {
            let body: any = {}
            body = {
                action: "getAllSupplier",
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
                body
            ).then(result => {
                setSupplier(result?.data?.data);
            });
        }

        //fetch all catagories
        const categoryList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`, { action: "getAllCategories" })
                .then((res) => {
                    setItemCategories(res?.data?.data);
                });
        };

        //fetch all items
        async function getAllItems() {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: "getAllItems", })
                .then((res) => {
                    setItems(res?.data?.data);
                });
        }
        getSuppliers()
        categoryList()
        getAllItems()

        return () => controller.abort();
    }, []);


    const showReports = (e: any) => {
        e.preventDefault();
        router.push(`/modules/purchase/reports/supplier/${supplierID}`)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className={showReportsCat ? 'card shadow' : ''} style={{ minHeight: "520px" }}>
                        {showReportsCat &&
                            <div className="">

                                <div className="d-flex border-bottom title-part-padding align-items-center">
                                    <div>
                                        <h4 className="card-box p-3 mb-0">Purchase report</h4>
                                    </div>
                                </div>
                                <div className="row w-75 m-auto pt-3">
                                    <Label className="col-sm-2 col-lg-2 col-md-2" text="View Reports by:" />
                                    <div className="col-sm-6 col-lg-6 col-md-6">
                                        <Select2
                                            options={[{ value: '1', label: 'Supplier Name' },
                                            { value: '2', label: 'Catagory Name' },
                                            { value: '3', label: 'Item Name' },
                                            { value: '4', label: 'Date' },
                                            ]}
                                            onChange={(e: any) => {
                                                setValue(e.value);
                                            }}
                                        />
                                    </div>
                                </div>

                                {value == 1
                                    ?
                                    <div className="row pt-4 w-75 m-auto">
                                        <Label className="col-sm-2 col-lg-2 col-md-2" text="Supplier Name:" />
                                        <div className="col-sm-4 col-lg-4 col-md-4">
                                            <Select2
                                                options={supplier?.map(({ id, name }) => ({ value: id, label: name }))}
                                                onChange={(e: any) => {
                                                    setSupplierID(e.value);
                                                }}
                                            />
                                        </div>
                                        <Button className="shadow rounded col-sm-2 col-lg-2 col-md-2"
                                            variant="info"
                                            onClick={showReports}
                                            disabled={!supplierID}
                                        >View Repots</Button>
                                    </div>
                                    :
                                    value == 2
                                        ?
                                        <div className="row pt-4 w-75 m-auto">
                                            <Label className="col-sm-2 col-lg-2 col-md-2" text="Catagory Name:" />
                                            <div className="col-sm-4 col-lg-4 col-md-4">
                                                <Select2
                                                    options={itemCatagories?.map(({ id, name }) => ({ value: id, label: name }))}
                                                    onChange={(e: any) => {
                                                        let ids = [];
                                                        !!e.length && e.map((id: any) => { return (ids.push(id?.value)) })
                                                        setCatID(ids)
                                                    }}
                                                    isMulti
                                                />
                                            </div>
                                            <div className='col-sm-2 col-lg-2 col-md-2'>
                                                <Button className="shadow rounded"
                                                    variant="info"
                                                    disabled={!catID?.length}
                                                    onClick={() => setShowReportsCat(false)}
                                                >View Repots</Button>
                                            </div>
                                        </div>
                                        : value == 3 ? <div className="row pt-4 w-75 m-auto">
                                            <Label className="col-sm-2 col-lg-2 col-md-2" text="Item Name:" />
                                            <div className="col-sm-4 col-lg-4 col-md-4">
                                                <Select2
                                                    options={items?.map(({ id, name }) => ({ value: id, label: name }))}
                                                    onChange={(e: any) => {
                                                        let ids = [];
                                                        !!e.length && e.map((id: any) => { return (ids.push(id?.value)) })
                                                        setItemID(ids)
                                                    }}
                                                    // onChange={(e: any) => {
                                                    //     setItemID([...itemID, e[e?.length - 1]?.value])
                                                    // }}
                                                    isMulti
                                                />
                                            </div>
                                            <div className='col-sm-2 col-lg-2 col-md-2'>
                                                <Button className="shadow rounded"
                                                    variant="info"
                                                    onClick={() => setShowReportsCat(false)}
                                                // disabled={!itemID}
                                                >View Repots</Button>
                                            </div>
                                        </div>
                                            : value == 4 &&
                                            <>
                                                <div className="row pt-4 w-75 m-auto">
                                                    <Label className="col-sm-2 col-lg-2 col-md-2" text="From Date:" />
                                                    <div className="col-sm-4 col-lg-4 col-md-4">
                                                        <input type="date" name="inv_date" onChange={(e) => setFrom(e.target.value)} className="form-control" id="date" />
                                                    </div>
                                                </div>
                                                <div className="row pt-4 w-75 m-auto">
                                                    <Label className="col-sm-2 col-lg-2 col-md-2" text="To Date:" />
                                                    <div className="col-sm-4 col-lg-4 col-md-4">
                                                        <input type="date" name="inv_date" onChange={(e) => setTo(e.target.value)} className="form-control" id="date" />
                                                    </div>
                                                </div>
                                                <div className="row pt-4 w-75 m-auto">
                                                    <Label className="col-sm-2 col-lg-2 col-md-2" text="" />
                                                    <div className="col-sm-4 col-lg-4 col-md-4">
                                                        <Button className="shadow rounded"
                                                            variant="info"
                                                            onClick={() => setShowReportsCat(false)}
                                                            disabled={!from || !to}
                                                        >View Repots</Button>
                                                    </div>
                                                </div>
                                            </>
                                }
                            </div>

                        }
                        {!showReportsCat &&
                            <>
                                {!!catID.length && <InvoiceByCat catID={catID} />}
                                {!!itemID.length && <InvoicesByItems itemID={itemID} />}
                                {from && to && <InvoiceByDate from={from} to={to} />}
                            </>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default supplier;

