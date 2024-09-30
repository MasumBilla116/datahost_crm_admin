import * as CryptoJS from "crypto-js";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { HeadSection, ViewIcon } from "../../../components";
import Loader from "../../../components/Loader";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
import DataTable from "react-data-table-component";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.bkng",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const BookingDashboard = ({ accessPermissions }) => {
  const { http } = Axios();
  const [loading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const [allRefundable, setAllRefundable] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({
    total: 0,
    hotel: 0,
    web: 0,
    channel: 0,
  });
  const fetchBookingDashboard = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/dashboard`, {
        action: "getBookingCounts",
      })
      .then((res) => {
        if (isSubscribed) {
          setBookingCounts(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);



  const fetchLatestBookingList = useCallback(async () => {
    setLoading(true);

    try {
      let isSubscribed = true;
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/dashboard`,
        {
          action: "getLatestBookingList",
        }
      );

      if (isSubscribed) {
        setBookingList(res?.data?.data);
      }
    } catch (err) {
      console.error("Something went wrong!", err);
    } finally {
      setLoading(false);
    }

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    fetchBookingDashboard();
    fetchLatestBookingList();
  }, []);



  const FetchAllRefundable = async () => {
    setLoading(true);
    try {
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
        {
          action: "getAllRefundFrDashbord",
        }
      );
      const refundableData = res.data?.data?.filter(item => item.status === 1);


      // Set the filtered data in the state
      setAllRefundable(refundableData);
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchAllRefundable();
  }, []);
  const salesColumns = [
    {
        name: "SL",
        selector: (row, index) => 1 + index,
        sortable: true,
    },
    // {
    //     name: "booking Id",
    //     selector: (row) => row.booking_id,
    //     sortable: true,
    // },
    {
        name: "Customer",
        selector: (row) => row.first_name,
        sortable: true,
    },

    {
        name: "Status",
        selector: (row) => (
            <span className={row.status === 2 ? "text-success" : "text-orange"}>
                {row.status === 2 ? "Success" : "Processing"}
            </span>
        ),
        sortable: true,
    }

];

  const actionButton = (inv_id, booking_id, platform) => {
    const key = "123";
    const passphrase = `${booking_id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();
    const bookingId = encrypted.replace(/\//g, "--");


    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (
            <li>
              <Link
                href={`/modules/bookings/invoice/${platform === "FrontDesk" || platform === null
                    ? "frontDesk"
                    : "others"
                  }/${bookingId}`}
              >
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

  return (
    <div className="container-fluid">
      <HeadSection title="Booking Dashbord" />
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
                  <h2>{bookingCounts["total"]}</h2>
                  <h6 className="text-muted mt-2 mb-0">
                    Monthly Total Booking
                  </h6>
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
                  <h2>{bookingCounts["hotel"]}</h2>
                  <h6 className="text-muted mt-2 mb-0">
                    Monthly Hotel Booking
                  </h6>
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
                  <h2>{bookingCounts["web"]}</h2>
                  <h6 className="text-muted mt-2 mb-0">Monthly Web Booking</h6>
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
                  <h2>{bookingCounts["channel"]}</h2>
                  <h6 className="text-muted mt-2 mb-0">
                    Monthly Channel Booking
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start row */}
      <div className="row">
        <div className="col-lg-8 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <h3 className="card-title mb-1">
                <span className="lstick d-inline-block align-middle" />
                Latest Booking List
              </h3>
              <div className="">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {bookingList?.length > 0 && <><table className={`w-100`}>
                      <thead
                        className={``}
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr className={`border-bottom border-top`}>
                          <th
                            className={`border-right text-uppercase`}
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              width: "70px",
                            }}
                          >
                            SL
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                            Customer
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                            Room Type
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                            Check In
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                            Check Out
                          </th>
                          {accessPermissions.listAndDetails && (
                            <th className={`text-center text-uppercase p-2`}>
                              Details
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {bookingList.map((item, indx) => (
                          <tr
                            key={indx}
                            style={{ borderBottom: "1px solid #e7e7e7" }}
                          >
                            <td
                              style={{
                                padding: "10px 0",
                                textAlign: "center",
                                width: "70px",
                              }}
                            >
                              {indx + 1}
                            </td>
                            <td>
                              {item["first_name"]} {item["last_name"] || ""}
                            </td>
                            <td>{item["room_type_name"]}</td>
                            <td>{item["checkin_at"]}</td>
                            <td>{item["checkout_at"] || "-"}</td>
                            {accessPermissions.listAndDetails && (
                              <td style={{ textAlign: "center" }}>
                                {actionButton(
                                  item["invoice_id"],
                                  item["id"],
                                  item["platform"]
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                      <div
                        style={{ backgroundColor: "#f9f9f9", marginTop: "10px" }}
                      >
                        <Link href={`/modules/bookings/list`}>
                          <a
                            style={{
                              padding: "10px",
                              display: "block",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            View All Bookings
                          </a>
                        </Link>
                      </div> </>}

                  </>
                )}
              </div>
            </div>
            <div className="card-body">
              <div
                id="Sales-Overview"
                className="position-relative"
                style={{ height: "360px" }}
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------- */}
        {/* visit charts*/}
        {/* -------------------------------------------------------------- */}
        <div className="col-lg-4 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              {/*<h4 className="card-title">*/}
              {/*    <span className="lstick"/>*/}
              {/*    Block Title*/}
              {/*</h4>*/}
              {/*<h5 style={{color: "gray"}}>On Development</h5>*/}
              {/*<div*/}
              {/*    id="Visit-Separation"*/}
              {/*    style={{height: "290px", width: "100%"}}*/}
              {/*    className="d-flex justify-content-center align-items-center"*/}
              {/*/>*/}
              {/* <DataTable
                columns={salesColumns}
                data={allRefundable}
                pagination
                highlightOnHover
                subHeader

                striped
              /> */}

<div className="">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {allRefundable?.length > 0 && <><table className={`w-100`}>
                      <thead
                        className={``}
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr className={`border-bottom border-top`}>
                          <th
                            className={`border-right text-uppercase`}
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              width: "70px",
                            }}
                          >
                            SL
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                            Customer
                          </th>
                          <th className={`border-right text-uppercase p-2`}>
                          Status
                          </th>
                          
                        
                        </tr>
                      </thead>

                      <tbody>
                        {allRefundable.map((item, indx) => (
                          <tr
                            key={indx}
                            style={{ borderBottom: "1px solid #e7e7e7" }}
                          >
                            <td
                              style={{
                                padding: "10px 0",
                                textAlign: "center",
                                width: "70px",
                              }}
                            >
                              {indx + 1}
                            </td>
                            <td>
                              {item.first_name}
                            </td>
                            <td className={item.status === 2 ? "text-success" : "text-orange"}>
                            {item.status === 2 ? "Success" : "Processing"}
                              
                              </td>
                          
                          </tr>
                        ))}
                      </tbody>
                    </table>
                      <div
                        style={{ backgroundColor: "#f9f9f9", marginTop: "10px" }}
                      >
                        <Link href={`/modules/bookings/refund/manageRefund`}>
                          <a
                            style={{
                              padding: "10px",
                              display: "block",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            View All Refundable List
                          </a>
                        </Link>
                      </div> </>}

                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
    </div>
  );
};

export default BookingDashboard;
