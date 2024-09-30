import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaEdit, FaFilePdf, FaUnlock } from "react-icons/fa";

/**pdf generator package*/
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import BarcodeGenerator from "../../../../../components/Barcode";
import toast from "../../../../../components/Toast/index";
import HotelLogo from "../../../../../components/hotelLogo";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.lckr.asgn_lckr",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

function index({ accessPermissions }) {
  // Router setup
  const { http } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  const [locker, setLocker] = useState([]);
  const [luggage, setLuggage] = useState([]);
  const [guestID, setGuestID] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestNumber, setGuestNumber] = useState("");

  // Toastify setup
  const notify = React.useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    //fetch locker By
    const getindexLockerByID = async () => {
      let body: any = {};
      body = {
        action: "lockerEntryInfoByID",
        id,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/entry`, body)
        .then((res: any) => {
          const locker = res?.data?.data;
          setLuggage(locker?.luggages);
          !!!locker?.length ? setLocker([locker]) : setLocker(locker);
          setGuestID(locker?.guest_id);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    isReady && getindexLockerByID();

    return () => controller.abort();
  }, [isReady, id]);

  useEffect(() => {
    const controller = new AbortController();

    //fetch locker By
    const customerInfoByID = async () => {
      let body: any = {};
      body = {
        action: "customerInfoByID",
        id: guestID,
      };

      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
        .then((res: any) => {
          const customer = res?.data?.data;
          !!customer?.length &&
            customer.map((customer: any) => {
              setGuestName(
                GenerateName(
                  customer?.title,
                  customer?.first_name,
                  customer?.last_name
                )
              );
              setGuestNumber(customer?.mobile);
            });
          // console.log(customer);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    guestID && customerInfoByID();

    return () => controller.abort();
  }, [guestID]);

  const GenerateName = (title: any, middle: any, last: any) => {
    if (title && middle && last) {
      return title + " " + middle + " " + last;
    } else if (middle && last) {
      return middle + " " + last;
    } else if (title && middle) {
      return title + " " + middle;
    } else if (middle) {
      return "Mr " + middle;
    }
  };

  const columns: any = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row: any, index: number) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: <span className="fw-bold">Item name</span>,
      selector: (row: { item_name: any }) => row?.item_name,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Size</span>,
      selector: (row: { size: any }) => row?.size,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Type</span>,
      selector: (row: { type: any }) => row?.type,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Description</span>,
      selector: (row: { description: any }) =>
        row?.description || "sample locker",
      sortable: true,
    },
  ];

  const handleDownloadPdf = async () => {
    notify("success", `printing locker of ${guestName && guestName}`);
    const element = document.getElementById("printME");
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, "PNG", 0, marginTop, pdfWidth, pdfHeight);
    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Locker Entry", link: "/modules/locker/entry" },
    { text: "View Entry", link: "/modules/locker/entry/details/[id]" },
  ];

  return (
    <div>
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="card shadow pb-5 m-4">
        <div className="mb-5">
          <div></div>

          <>
            <div className="p-3" id="printME">
              <div className="text-center fs-3">
                <HotelLogo id={id} invoiceName="Locker Invoice" />
              </div>
              {locker.map((lock, index) => {
                return (
                  <div key={index} className="p-3">
                    <div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <div>
                            <span className="fw-bolder">Guest name : </span>
                            {guestName && guestName}
                          </div>
                          <div>
                            <span className="fw-bolder">Guest number : </span>
                            {guestNumber && guestNumber}
                          </div>
                          <div>
                            <span className="fw-bolder">Locker(s) : </span>
                            {!!lock?.lockers.length &&
                              lock?.lockers.map((locker: any, index: any) => {
                                return (
                                  <span className="text-info" key={index}>
                                    {locker?.serial}
                                    {lock?.lockers.length - 1 !== index && " ,"}
                                  </span>
                                );
                              })}
                          </div>
                          <div>
                            <span className="fw-bolder">Token : </span>
                            {lock?.token}
                          </div>
                        </div>
                        <BarcodeGenerator value={lock?.token} />
                        <div>
                          <div>
                            <span className="fw-bolder">Pick up time : </span>
                            {moment(lock?.time).format("h:mm a")}
                          </div>
                          <div>
                            <span className="fw-bolder">Pick up date : </span>
                            {moment(lock?.pickup_date).format("DD/MM/YYYY")}
                          </div>
                          <div>
                            <span className="fw-bolder">Remarks : </span>
                            {lock?.remarks}
                          </div>
                          <div>
                            <span className="fw-bolder">Created at : </span>
                            {moment(lock?.created_at).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </div>
                      <p className="fw-bolder mt-4">Locker Items:</p>
                      <DataTable
                        className="mt-0 pt-0"
                        columns={columns}
                        data={luggage}
                        highlightOnHover
                        subHeader
                        striped
                      />
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between my-4">
                <div className="w-25 mt-5">
                  <div>
                    <hr />
                  </div>
                  <div className="text-center fw-bolder">
                    Reciever's signature{" "}
                  </div>
                </div>

                <div className="w-25 mt-5">
                  <div>
                    <hr />
                  </div>
                  <div className="text-center fw-bolder">
                    For managebeds computer
                  </div>
                </div>
              </div>
            </div>

            <div className="row m-0">
              <div className="col-md-6 col-lg-6">
                <div>
                  <Button variant="warning">
                    {" "}
                    <span className="fs-5">
                      <FaUnlock />
                    </span>{" "}
                    Release Locker
                  </Button>
                  {accessPermissions.createAndUpdate && (
                    <Link href={`/modules/locker/entry/update/${id}`}>
                      <Button variant="info my-2 mx-2">
                        {" "}
                        <span className="fs-5 mx-2">
                          <FaEdit />
                        </span>
                        Edit Locker{" "}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-lg-6 text-end">
                <Button variant="success" onClick={handleDownloadPdf}>
                  <span className="fs-5 me-1">
                    <FaFilePdf />
                  </span>
                  Print Consignment
                </Button>
              </div>
            </div>
          </>

          {/* {!!locker.length && guestName ? (

          ) : (
            <>
              <div style={{ height: "100px" }}>
                <div className="text-center">
                  <PropagateLoading />
                </div>
              </div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}
export default index;
