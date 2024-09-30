import * as moment from "moment";
import { useRouter } from "next/router";
import converter from "number-to-words";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaFilePdf, FaPhone } from "react-icons/fa";

/**pdf generator package*/
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import BarcodeGenerator from "../../../../../components/Barcode";
import PropagateLoading from "../../../../../components/PropagateLoading";
import toast from "../../../../../components/Toast/index";
import HotelLogo from "../../../../../components/hotelLogo";
import Axios from "../../../../../utils/axios";
import PrintButton from "../../../../../components/elements/PrintButton";

export default function Details() {
  // Router setup
  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  const { http } = Axios();

  // Toastify setup
  const notify = React.useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);

  //state declaration
  const [aft, setAft] = useState<any[]>([]);
  const [adjustment, setAdjustment] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [editAttempt, setEditAttempt] = useState<boolean>(false);
  const [supplierInfo, setSupplierInfo] = useState<{
    name: string;
    address: string;
    contact_number: number;
    email: string;
  }>({
    name: "",
    address: "",
    contact_number: 0,
    email: "",
  });
  const [barcode, setBarcode]: any = useState("");

  useEffect(() => {
    const controller = new AbortController();

    //fetching invoice items
    const getAftDetails = async () => {
      let body: any = {};
      body = {
        action: "adjustmentDetails",
        id: id,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res) => {
          setAdjustment(res.data.data);
          setAft(res?.data?.data || []);
          setTotalAmount(res?.data?.data?.new_balance);
          setBarcode(res?.data?.data?.slip_num);
          setInitialLoading(false);
        })
        .catch((err) => {
          console.log("Something went wrong !" + <br /> + err);
        });
    };
    isReady && getAftDetails();

    return () => controller.abort();
  }, [id, isReady]);

  //pascal case converter
  function getPascalCase(string: String) {
    var splitStr = string.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  let items: {
    quantity: number;
    description: string;
    price: number;
    "tax-rate": number;
  }[] = [];

  if (aft?.length) {
    aft?.map((invoice) => {
      items.push({
        quantity: invoice?.item_qty,
        description: invoice?.itemName,
        "tax-rate": 0,
        price: invoice?.unitPrice,
      });
    });
  }

  const print = async () => {
    const element = document.getElementById("printME");
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    notify("success", "printing....");
    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, "PNG", 0, marginTop, pdfWidth, pdfHeight);

    pdf.save("print.pdf");
  };

  //table data
  const columnData: any = [
    {
      name: <span className="fw-bold">From</span>,
      selector: (row: { from: string }) => row?.from,
      width: "40%",
    },
    {
      name: <span className="fw-bold">To</span>,
      selector: (row: { to: string }) => row?.to,
      width: "50%",
    },
    {
      name: <span className="fw-bold">Amount</span>,
      selector: (row: { amount: string }) => row?.amount,
      width: "10%",
    },
  ];
  const rowData = aft;

  return (
    <div>
      <div className="card shadow p-1 ml-3 mr-3" style={{ marginTop: "-6px" }}>
        {!initialLoading ? (
          <div className="p-4" id="printME">
            <div className="mb-5">
              <div className="text-center fs-3">
                {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                <HotelLogo id={id} invoiceName=""/>

              </div>

              <div className="row small my-2">
                <div className="col-sm-4 col-lg-4 col-md-4 mt-2">
                  <div className="pt-5">
                    <div>
                      <strong>Account To:</strong>
                    </div>
                    <div>
                      <strong>Account Name: </strong>
                      <span>{adjustment?.account?.account_name}</span>
                    </div>
                    <div>
                      <strong>Type: </strong>
                      <span>{adjustment?.account?.type}</span>
                    </div>
                    <div>
                      <strong>Account Number: </strong>
                      <span>{adjustment?.account?.account_no}</span>
                    </div>
                    <div>
                      <strong>Branch Name: </strong>
                      <span>{adjustment?.account?.branch}</span>
                    </div>
                    <div>
                      <strong>Account Type: </strong>
                      <span>{adjustment?.account?.account_type}</span>
                    </div>
                    <div>
                      <strong>Current Balance: </strong>
                      <span>{adjustment?.account?.balance}</span>
                    </div>
                    <div>
                      <strong>Remarks: </strong>
                      <span>{adjustment?.remarks}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center col-sm-4 col-lg-4 col-md-4 my-2">
                  <h2 className="fs-xs-16 fw-xs-bold">
                    Account Balance Adjustment Slip
                  </h2>
                  <div className="barcode">
                    <BarcodeGenerator value={adjustment?.slip_num} />
                  </div>
                </div>
                <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                  <div className="ms-auto col-sm-8 col-lg-8 col-md-8 pt-5">
                    <div>
                      <strong>Date: </strong>
                      <span>
                        {moment(adjustment?.created_at).format(
                          "DD/MM/YYYY h:mm:ss a"
                        )}
                      </span>
                    </div>
                    <div>
                      <strong>Created By: </strong>
                      <span>{adjustment?.creator?.name}</span>
                    </div>
                    <div className="pt-3">
                      <div>
                        <strong>Adjustment Amount: </strong>
                        <span>{adjustment?.amount}</span>
                      </div>
                      <div>
                        <strong>Balance Before: </strong>
                        <span>{adjustment?.old_balance}</span>
                      </div>
                      <div>
                        <strong>New Balance: </strong>
                        <span>{adjustment?.new_balance}</span>
                      </div>
                      <div>
                        <strong>Adjustment Type: </strong>
                        <span>{adjustment?.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 pt-4 row border-top">
              <div className="col-sm-12 col-lg-6 col-md-12">
                <div>
                  <span className="fw-bold"> In Word: </span>
                  <span>
                    {" "}
                    {getPascalCase(converter.toWords(totalAmount)) +
                      " TAKA Only"}{" "}
                  </span>
                </div>
              </div>
              <div className="col-sm-12 col-lg-6 col-md-12 cust-text-end text-xs-start">
                <div>
                  <span className="fw-bold">Total Amount:</span>{" "}
                  <span>{totalAmount} Tk</span>
                </div>
              </div>
            </div>
            <div className="row my-4">
              <div className="col-lg-4 col-md-12 col-sm-12 mt-5">
                <div>
                  <hr />
                </div>
                <div className="text-center fw-bolder">
                  Reciever's signature{" "}
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 pt-5 mt-5 text-center d-xs-none cust-d-block">
                (company logo)
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 mt-5">
                <div>
                  <hr />
                </div>
                <div className="text-center fw-bolder">
                  For managebeds computer
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 pt-5 mt-5 text-center d-xs-block cust-d-none">
                (company logo)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center my-5">
            <PropagateLoading />
          </div>
        )}
        {!initialLoading && (
          <div className="row m-0">
            <div className="col-md-6 col-lg-6">

            </div>
            <div className="col-md-6 col-lg-6 text-end">
            <PrintButton contentId="printME" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
