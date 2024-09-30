import Link from "next/link";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { HeadSection } from "../../../components";
import ActiveCurrency from "../../../components/ActiveCurrency";
import Loader from "../../../components/Loader";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
    const {
        permission,
        query,
        accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.invtr" });
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
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/dashboard`, {
                action: "inventoryDashbord",
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

            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: 'getAllItems' });


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
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Item Code',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Unit Cost',
            selector: row => <> <ActiveCurrency></ActiveCurrency> {row.unit_cost}</>,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.qty,
            sortable: true,
        },


    ];

    return (
        <div className="container-fluid">
            {/* Start Row */}
            <HeadSection title="Inventory Dashbord" />
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
                                    <h6 className="text-muted mt-2 mb-0">Total Stock Items</h6>
                                    <h2>{cardValues?.categories}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Items </h6>
                                    <h2>{cardValues?.totalItems}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Items Unit Cost</h6>
                                    <h2>{cardValues?.totalItemsUnitCost}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Items Unit Cost</h6>
                                    <h2>{cardValues?.a}</h2>
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
                                        Latest STOCK ITEMS
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
                                        subHeader
                                        striped

                                    />

                                    <div className="custom-container">
                                        <Link href={`/modules/inventory/items`}>
                                            <a className="custom-link">View All Items</a>
                                        </Link>
                                    </div>
                                </>
                            )
                            }
                        </div>
                        {/* <div className="ms-auto flex-shrink-0 mb-2 mr-2">
                            <Link href="/modules/inventory/items" passHref>
                                <Button
                                    className="shadow rounded btn-sm"
                                    variant="primary"
                                    type="button"
                                    block
                                >
                                    View All
                                </Button>
                            </Link>
                        </div> */}
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