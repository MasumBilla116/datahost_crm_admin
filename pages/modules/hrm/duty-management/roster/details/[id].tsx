import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HeadSection from "../../../../../../components/HeadSection";
import Axios from "../../../../../../utils/axios";
// import Breadcrumbs from '../../../../../components/Breadcrumbs';

export default function EmployeeDetails() {
  const { http } = Axios();
  const [infoData, setInfoData] = useState<any>([]);
  const router = useRouter();

  const { pathname } = router;
  const {
    isReady,
    query: { id },
  } = router;

  useEffect(() => {
    const controller = new AbortController();

    const getInvoiceDetails = async () => {
      let body: any = {};
      body = {
        action: "rosterInfo",
        id: id,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`,
          body
        )
        .then((res) => {
          setInfoData(res.data.data);
        })
        .catch((err) => {
          console.log(err + <br /> + "Something went wrong !");
        });
    };

    isReady && getInvoiceDetails();

    return () => controller.abort();
  }, [id, isReady]);

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Roster", link: "/modules/dutyManagement/roster" },
    {
      text: "Roster View",
      link: "/modules/dutyManagement/roster/details/[id]",
    },
  ];

  return (
    <>
      <HeadSection title="Supplier Details" />
      <div className="container-fluid ">
        <div className="row">
          <div className="row">
            <div className="row bg-white p-5 m-3 shadow">
              <h3 className="box-title mt-1">Roster Dertails</h3>
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <td style={{ width: "40px",fontWeight:"bold" }}>Name</td>
                      <td style={{ width: "10px" }}>:</td>
                      <td>{infoData?.name ?? "---"}</td>
                    </tr>
                    <tr>
                      <td  style={{fontWeight:"bold" }}>Duty Shift</td>
                      <td>:</td>
                      <td>
                        {infoData.duty_shift
                          ? infoData?.duty_shift.name
                          : "---"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:"bold" }}>Start Date</td>
                      <td>:</td>
                      <td>{infoData?.start_date ?? "---"}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:"bold" }}>End Date</td>
                      <td>:</td>
                      <td>{infoData?.end_date ?? "---"}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:"bold" }}>Description</td>
                      <td>:</td>
                      <td>{infoData?.description ?? "---"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
