import Link from "next/link";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Loader from "../../../components/Loader";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
import { HeadSection } from "../../../components";

// import HotelInfo from "./hotel-info";


export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.splr" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };


const SupplierDashboard = () => {
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
                action: "supplierDashbord",
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

            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: 'getPaySlip' });


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
            name: 'Slip',
            selector: row => row.slip,
            sortable: true,

        },
        {
            name: 'Payee',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Acmount',
            selector: row => row.amount,
            sortable: true,
        },
        {
            name: 'Payment Type ',
            selector: row => row.payment_type,
            sortable: true,
        },
        {
            name: 'Pay Type',
            selector: row => row.pay_type,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.payment_date,
            sortable: true,
        },
        {
            name: 'Active',
            selector: row => row.is_cancelled == 1 ? "Inactive" : "Active"
        }, 

    ];

    return (
        <div className="container-fluid">
            {/* Start Row */}
            <HeadSection title="Supplier Dashbord" />
            <div className="row">
                <div className="col-lg-3 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/income.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Supplier</h6>
                                    <h2>{cardValues?.totalSupplier}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/expense.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Supplier Salary</h6>
                                    <h2>{cardValues?.totalSupplierBalance}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/assets.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Pay bills</h6>
                                    <h2>{cardValues?.totalSupplierpays}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 p-xs-2">
                    <div className="card mb-xs-1">
                        <div className="card-body">
                            <div className="d-flex no-block">
                                <div className="me-3 align-self-center">
                                    <span className="lstick d-inline-block align-middle" />
                                    <img src="/assets/images/icon/staff.png" alt="Income" />
                                </div>
                                <div className="align-self-center">
                                    <h6 className="text-muted mt-2 mb-0">Total Payment Number</h6>
                                    <h2>{cardValues?.totalPayment}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        Latest Payemnt Slips
                                    </h3>
                                    {/* <h5 style={{ color: "gray" }}>Channel List</h5> */}
                                </div>
                            </div>
                            {loading ? (
                                <Loader /> // Show the loader when loading is true
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
                                        {filteredData.length > 0 &&
                                        <Link href={`/modules/supplier/payment`}>
                                            <a className="custom-link">View All Payment</a>
                                        </Link>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div> 
            </div>
            {/* End Row */}
        </div>
    );

}

export default SupplierDashboard;