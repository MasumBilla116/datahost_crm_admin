import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";

import { Select2, Label } from "../../../../components";
import Axios from '../../../../utils/axios';

function supplier() {
    const { http } = Axios();

    const router = useRouter();

    const [supplierID, setSupplierID] = useState("")
    const [supplier, setSupplier] = useState([])
    const [items, setItems] = useState([])
    const [itemID, setItemID] = useState("")
    const [catID, setCatID] = useState("")
    const [value, setValue] = useState(0)
    const [itemCatagories, setItemCategories] = useState([])

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


    console.log(itemCatagories)
    return (
        <div className='m-5 shadow' style={{ height: "500px" }}>
            <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                    <h4 className="card-box p-3 mb-0">Purchase report</h4>
                </div>
            </div>

            <div className="row pt-4 w-75 m-auto">
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
                                    setCatID(e.value);
                                }}

                            />
                        </div>
                        <Button className="shadow rounded col-sm-2 col-lg-2 col-md-2"
                            variant="info"
                            disabled={!catID}
                            onClick={() => {
                                router.push(`/modules/purchase/reports/catagory/${catID}`)

                            }}
                        >View Repots</Button>
                    </div>
                    : value == 3 ? <div className="row pt-4 w-75 m-auto">
                        <Label className="col-sm-2 col-lg-2 col-md-2" text="Item Name:" />
                        <div className="col-sm-4 col-lg-4 col-md-4">
                            <Select2
                                options={items?.map(({ id, name }) => ({ value: id, label: name }))}
                                onChange={(e: any) => {
                                    setItemID(e.value);
                                }}
                            />
                        </div>
                        <Button className="shadow rounded col-sm-2 col-lg-2 col-md-2"
                            variant="info"
                            onClick={() => {
                                router.push(`/modules/purchase/reports/items/${itemID}`)

                            }}
                            disabled={!itemID}
                        >View Repots</Button>
                    </div>
                        : value == 4 && <div className="row pt-4 w-75 m-auto">
                            <Label className="col-sm-2 col-lg-2 col-md-2" text="Select Date:" />
                            <div className="col-sm-4 col-lg-4 col-md-4">
                                <input type="date" name="inv_date" onChange={(e) => console.log(e.target.value)} className="form-control" id="date" />
                            </div>
                            <Button className="shadow rounded col-sm-2 col-lg-2 col-md-2"
                                variant="info"
                                onClick={showReports}
                                disabled={!supplierID}
                            >View Repots</Button>
                        </div>}

        </div>
    )
}

export default supplier