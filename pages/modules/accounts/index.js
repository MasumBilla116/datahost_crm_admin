import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/Dashboard";
import Axios from "../../../utils/axios";
import DataTable from "react-data-table-component";
import * as moment from "moment";
import { Button, Form, Modal } from "react-bootstrap";
import Link from "next/link";
import Select from "../../../components/elements/Select";
import Loader from "../../../components/Loader";
import { getSSRProps } from "../../../utils/getSSRProps";
import { HeadSection } from "../../../components";


export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.acnt" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };
  

const AccountsDashboard = () => {
    const { http, token, user } = Axios();
    const [loading, setLoading] = useState(false);
    const [cardValues, setCardValues] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [itemList, setItemList] = useState([]);


    const fetchItem = async () => {
        let isSubscribed = true;
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/dashboard`, {
                action: "accountsDashbord",
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
            fetchItem();
        });
        return () => clearTimeout(timeout);
    }, []);




    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);



    const fetchItemList = async () => {
        try {
            setLoading(true);
            const res = await http.post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher`,
                {
                    action: "getAllPaymentVouchers",
                }
            );

            const itemListData = res?.data?.data;

            // Set the full data to state
            setItemList(itemListData);

            // Filter and set the first 10 items to state
            const first10Items = itemListData.slice(0, 10);
            setFilteredData(first10Items);
        } catch (err) {
            console.log("Server Error ~!");
        } finally {
            setLoading(false);
        }
    };



    const columns = [
        {
            name: "Voucher No",
            selector: (row) => row.voucher_no,
            sortable: true,
        },
        {
            name: "Voucher Type",
            selector: (row) => row.voucher_type,
            sortable: true,
        },
        {
            name: "Payment Type",
            selector: (row) => row.payment_type,
            sortable: true,
        },

        {
            name: "From",
            selector: (row) => row.from_account,
            sortable: true,
        },
        {
            name: "To",
            selector: (row) => row.to_account,
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true,
        },
        {
            name: "Voucher Date",
            selector: (row) => row.date,
            sortable: true,
        },

        // {
        //   name: "Action",
        //   selector: (row) => actionButton(row.id),
        // },
    ];

    return (
        <div className="container-fluid">
            {/* Start Row */}
            <HeadSection title="Accounts Dashbord" />

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
                                    <h6 className="text-muted mt-2 mb-0">Total Account</h6>
                                    <h2>{cardValues?.totalAccounts}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Account Sector</h6>
                                    <h2>{cardValues?.totalAccount_sectors}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Balance</h6>
                                    <h2>{cardValues?.totalBalance}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Pay</h6>
                                    <h2>{cardValues?.payment_vouchers}</h2>
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
                                        Latest Payemnt Voucher
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
                                        striped />
                                    <div className="custom-container">
                                        <Link href={`/modules/accounts/payment/voucher`}>
                                            <a className="custom-link">View All Voucher</a>
                                        </Link>
                                    </div>
                                </>
                            )


                            }

                        </div>

                    </div>

                </div>


                {/* End Delete Modal Form */}
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

export default AccountsDashboard;