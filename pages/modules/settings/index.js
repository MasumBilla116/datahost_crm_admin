import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/Dashboard";
import Axios from "../../../utils/axios";
import DataTable from "react-data-table-component";
import * as moment from "moment";
import { Button, Form, Modal } from "react-bootstrap";
import Link from "next/link";
import Select from "../../../components/elements/Select";
import HotelInfo from "./hotel-info";
import { getSSRProps } from "../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.stng" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };

const SettingsDashboard = () => {
    const { http, token, user } = Axios();
    const [channelListData, setChannelListData] = useState([]);
    const [channelTotal, setChannelTotal] = useState([]);
    const[cardValues,setCardValues] = useState({});

    const fetchItemList = async () => {
        let isSubscribed = true;
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/dashboard`, {
            action: "settingsDashbord",
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


    return (
        <div className="container-fluid">
            {/* Start Row */}
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
                                    <h6 className="text-muted mt-2 mb-0">Total Role</h6>
                                    <h2>{cardValues?.totalRoles}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Currency</h6>
                                    <h2>{cardValues?.totalCurrencies}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Promo Offere</h6>
                                    <h2>{cardValues?.totalpromo_offers}</h2>
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
                                    <h6 className="text-muted mt-2 mb-0">Total Tax</h6>
                                    <h2>{cardValues?.taxes}</h2>
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
                <HotelInfo/>
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

export default SettingsDashboard;