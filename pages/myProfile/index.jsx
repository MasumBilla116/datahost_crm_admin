import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Axios from "../../utils/axios";
import moment from 'moment';    

const ProfileComponent = () => {
    const { http, token, user } = Axios();
    const [isLoading, setIsLoading] = useState(true);
    const[userInfo,setUserInfo] = useState()


    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController();
        const sectorList = async () => {
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/users`,
            { action: "getUserInfo" }
          ).then((res) => {
            setUserInfo(res.data.data[0]);
            setIsLoading(false);
          }).catch((error) => {
            console.log('fetching sector list error', error);
          });
        };
        sectorList()
        return () => controller.abort();
      }, [user?.id]);

    return (
        <div className="container-fluid ">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="basicInfo row mb-4">
                                        <div className="d-flex justify-content-center" >
                                            <div className="" style={{
                                                height: "150px",
                                                width: "180px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                boxShadow: "0 0 5px #ddd",
                                                // background: "#f8f8f8",
                                                padding: "0",
                                                textAlign: "center",
                                            }}>

                                                <img
                                                    src="https://www.shutterstock.com/image-vector/logo-hotel-vector-260nw-1353597998.jpg"
                                                    alt="Hotel Logo"
                                                    style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                    }}
                                                />

                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <h4>Hotel Admin</h4>
                                </div>
                            </div>

                            <div className="container mt-4 mb-4">
                                <div className="d-md-flex justify-content-center">
                                    <div className="col-lg-6 col-md-12 col-sm-12 mb-4">
                                        <h3 className="box-title ">Basic info</h3>
                                        <div className="table-responsive shadow-sm">
                                            <table className="table">
                                                <tbody>
                                                <tr>
                                                        <td className="font-weight-bold">Name</td>
                                                        <td>{userInfo?.name ? userInfo?.name : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width={200} className="font-weight-bold">
                                                            Email
                                                        </td>
                                                        <td>{userInfo?.email ? userInfo?.email : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">Mobile</td>
                                                        <td>{userInfo?.phone ? userInfo?.phone : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">Gender</td>
                                                        <td className="text-capitalize">{userInfo?.gender ? userInfo?.gender : "-"}</td>
                                                    </tr>
                                               
                                                    <tr>
                                                        <td className="font-weight-bold">
                                                        Nationality
                                                        </td>
                                                        <td className="text-capitalize">{userInfo?.nationality ? userInfo?.nationality : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">
                                                            Country
                                                        </td>
                                                        <td>{userInfo?.country_name ? userInfo?.country_name : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">
                                                        City
                                                        </td>
                                                        <td>{userInfo?.city_name ? userInfo?.city_name : "-"}</td>
                                                    </tr>
                                    
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <h3 className="box-title ">Others info</h3>
                                        <div className="table-responsive shadow-sm">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                    <td className="font-weight-bold">
                                                        Role
                                                        </td>
                                                        <td className="text-capitalize">{userInfo?.role ? userInfo?.role : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">Status</td>
                                                        <td>{userInfo?.status === 1  ? "Active" : "Inactive"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">Creation</td>
                                                        <td> {moment(userInfo?.created_at).format('DD MMMM YYYY')}  </td>   
                                                        {/* {moment(userInfo?.created_at).format('DD/MM/YYYY')}                                                    </tr> */}
                                               </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">Company</td>
                                                        <td className="text-capitalize">{userInfo?.company  ? userInfo?.company : "Not added  yet"}</td>
                                                    </tr>
                                                    {/* <tr>
                                                        <td className="font-weight-bold">
                                                            Service Address
                                                        </td>
                                                        <td>Service Address</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">
                                                            Commission Type
                                                        </td>
                                                        <td>Commission Type</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-weight-bold">
                                                            Commission Rate
                                                        </td>
                                                        <td>Commission Rate</td>
                                                    </tr> */}
           
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;
