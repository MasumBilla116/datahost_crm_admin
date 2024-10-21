import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Axios from "../utils/axios";

const HotelLogo = ({ id, invoiceBarcode, customerInfo,salesInfo }) => {
  const { http, token, user } = Axios();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [logoDetails, setLogoDetails] = useState();

  // const fetchLogoImages = useCallback(async () => {
  //     try {
  //         setLoading(true);
  //         const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "hotelLogo" });

  //         setLogoDetails(res.data?.data);
  //         setLoading(false);
  //     } catch (err) {
  //         setLoading(false);
  //     }
  // }, [http]);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         await fetchLogoImages();
  //     };
  //     fetchData();
  // }, [id]);

  const fetchLogoImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,
        { action: "darklLogo" }
      );

      setLogoDetails(res.data?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLogoImages();
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/users`, {
          action: "getUserInfo",
        })
        .then((res) => {
          setUserInfo(res.data.data[0]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("fetching sector list error", error);
        });
    };
    sectorList();
    return () => controller.abort();
  }, [user?.id]);

  return (
    <>
      {logoDetails && (
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-left">
            <img
              src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${logoDetails}`}
              alt="Logo"
              style={{ width: "138px", height: "63px" }}
            />

            <div className="d-flex flex-column" style={{ fontSize: "12px" }}>
              <small className={`text-uppercase font-weight-bold fs-5`}>
                {userInfo?.company}
              </small>
              <p className="m-0">
                {userInfo?.city_name} {userInfo?.country_name}{" "}
              </p>
              <p>
                <span style={{ fontSize: "14px" }}>
                  <FaPhone />
                </span>{" "}
                {userInfo?.phone}{" "}
                <span style={{ fontSize: "14px" }}>
                  {" "}
                  <MdEmail />
                </span>
                {userInfo?.email}
              </p>
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th style={{ width: "105px" }}>Customer</th>
                  <th style={{ width: "10px" }}>:</th>
                  <td>
                    {customerInfo?.first_name + " " + customerInfo?.last_name}
                  </td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <th>:</th>
                  <td> {customerInfo?.mobile || "NA"}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <th>:</th>
                  <td> {customerInfo?.address || "NA"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
          <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "110px" }}>Sales Invoice</th>
                        <th style={{ width: "10px" }}>:</th>
                        <td>{salesInfo?.sales_invoice}</td>
                      </tr>
                      <tr>
                        <th style={{ width: "110px" }}>Date</th>
                        <th style={{ width: "10px" }}>:</th>
                        <td>
                          {moment(salesInfo?.created_at).format("DD-MM-YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <th>Payment Status</th>
                        <th>:</th>
                        <td>
                          {salesInfo?.payment_status == 1 ? "Paid" : "Due"}
                        </td>
                      </tr>
                    </tbody>
                    </table> 
          </div>
        </div>
      )}
      <hr />
    </>
  );
};

export default HotelLogo;
