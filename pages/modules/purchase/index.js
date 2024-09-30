import * as moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Loader from "../../../components/Loader";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
import { HeadSection } from "../../../components";


export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.prchs" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };

const PurchaseDashboard = () => {
    const { http, token, user } = Axios();
    const [channelListData, setChannelListData] = useState([]);
    const [channelTotal, setChannelTotal] = useState([]);
    const [cardValues, setCardValues] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchItemList = async () => {
        let isSubscribed = true;
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/supplier/dashboard`, {
                action: "purchaseDashbord",
            })
            .then((res) => {
                if (isSubscribed) {

                    setCardValues(res.data?.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!");
            });

        return () => (isSubscribed = false);
    };


    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);



    const getPayslipList = async () => {
        try {
            setLoading(true); // Set loading to true before fetching data

            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, { action: 'getAllSupplierReturnInvoice' });


            const itemListData = res?.data?.data;
            const first10Items = itemListData.slice(0, 10);
            setFilteredData(first10Items);

        } catch (err) {
            console.log('Server Error ~!');
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };


    /**Getting Supplier List */
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            getPayslipList();
        });
        return () => clearTimeout(timeout);
    }, []);


    const columns = [

        {
            name: <span className="fw-bold">Supplier Name</span>,
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: <span className="fw-bold">Local Invoice</span>,
            selector: (row) => row.local_invoice,
            sortable: true,
        },
        {
            name: <span className="fw-bold">Supplier Invoice</span>,
            selector: (row) => row.supplier_invoice,
            sortable: true,
        },
        {
            name: <span className="fw-bold">Total Item Quantity</span>,
            selector: (row) => row.total_item_qty,
            // width: "10%",
            sortable: true,
        },
        {
            name: <span className="fw-bold">Total amount</span>,
            selector: (row) => row.total_amount,
            // width: "10%",
            sortable: true,
        },
        {
            name: <span className="fw-bold">Created At</span>,
            selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
            // width: "10%",
            sortable: true,
        }
    ];

    return (
        <div className="container-fluid">
            {/* Start Row */}
            <HeadSection title="Purchase Dashbord" />
            <div className="row">
                <div className="col-lg-4 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/income.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Invoice</h6>
                                    <h2>{cardValues?.getAllInvoice}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/expense.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Purchase Amount </h6>
                                    <h2>{cardValues?.PurchaseTotalAmount}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/assets.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Pay bills</h6>
                                    <h2>{cardValues?.getAllReturnInvoice}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-lg-3 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/staff.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Return Invoice</h6>
                                    <h2>{cardValues?.getAllReturnInvoice}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* End Row */}
            {/* Start row */}
            <div className="row">
                <div className="col-lg-9 p-xs-2 d-flex align-items-stretch">
                    <div className="card mb-xs-2 w-100">
                        <div className="card-body">
                            <div className="d-md-flex">
                                <div>
                                    <h3 className="card-title mb-1 text-uppercase font-weight-bold">
                                        <span className="lstick d-inline-block align-middle " />
                                        Latest SUPPLIER RETURN INVOICE
                                    </h3>
                                    {/* <h5 style={{ color: "gray" }}>Channel List</h5> */}
                                </div>

                            </div>
                       
                        
                            {loading ? (
                                <Loader />
                            ) : (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={filteredData}
                                        highlightOnHover
                                        striped
                                    />

                                    {filteredData?.length > 0 && <div className="custom-container">
                                        <Link href={`/modules/purchase/return`}>
                                            <a className="custom-link">View All Return Items</a>
                                        </Link>
                                    </div>}

                                </>

                            )}
                        
                        </div>
                    </div>
                </div>


                {/* -------------------------------------------------------------- */}
                {/* visit charts*/}
                {/* -------------------------------------------------------------- */}
                <div className="col-lg-3 p-xs-2 d-flex align-items-stretch">
                    <div className="card mb-xs-2 w-100">
                        <div className="card-body">
                            {/*<h4 className="card-title">*/}
                            {/*    <span className="lstick" />*/}
                            {/*    Block Title*/}
                            {/*</h4>*/}
                            {/*<h5 style={{ color: "gray" }}> Channel List</h5>*/}
                            {/*<div*/}
                            {/*    id="Visit-Separation"*/}
                            {/*    style={{ height: "290px", width: "100%" }}*/}
                            {/*    className="d-flex justify-content-center align-items-center"*/}
                            {/*/>*/}

                        </div>
                    </div>
                </div>
            </div>
            {/* End Row */}
        </div>
    );

}

export default PurchaseDashboard;