import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaFilePdf } from "react-icons/fa";

/**pdf generator package*/
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
/**pdf generator package*/
import { format } from "date-fns";
import { HeadSection, Label, Select2 } from "../../../../components";
import toast from "../../../../components/Toast/index";
import Axios from "../../../../utils/axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSSRProps } from "../../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.splr.splr_ldgr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

function index({accessPermissions}) {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const notify = React.useCallback((type: any, message: string) => {
    toast({ type, message });
  }, []);

  //state declaration
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [show, setShow] = useState(false);
  const [supplier, setSupplier] = useState([]);

  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const [supplierID, setSupplierID] = useState("");
  const [supplierInvoiceID, setSupplierInvoiceID] = useState("");

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

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    //fetch all suppliers
    const getSuppliers = async () => {
      let body: any = {};
      body = {
        action: "getAllSupplier",
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
          body
        )
        .then((result) => {
          setSupplier(result?.data?.data);
        });
    };
    getSuppliers();

    //set date
    const now: any = new Date();
    const prevMonth = (dateObj: any) => {
      const tempDateObj: any = new Date(dateObj);

      if (tempDateObj.getMonth) {
        tempDateObj.setMonth(tempDateObj?.getMonth() - 1);
      } else {
        tempDateObj?.setYear(tempDateObj?.getYear() - 1);
        tempDateObj?.setMonth(12);
      }

      return tempDateObj;
    };

    setToDate(moment(now)?.format("YYYY-MM-DD"));
    setFromDate(moment(prevMonth(now))?.format("YYYY-MM-DD"));
    return () => controller.abort();
  }, []);

  const getSupplierLedger = async (e: any) => {
    e.preventDefault();
    if (fromDate && toDate && supplierID) {
      let body = {
        action: "viewSupplierLedger",
        supplier_id: supplierID,
        date_from: fromDate,
        date_to: toDate,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((result) => {
          setFilteredData(result?.data?.data);
          // let BalanceTotal = 0;
          let DebitTotal = 0;
          let CreditTotal = 0;
          if (result?.data?.data?.length) {
            result?.data?.data.map((item: any) => {
              // BalanceTotal += Number(item?.balance);
              DebitTotal += Number(item?.debit);
              CreditTotal += Number(item?.credit);
            });
            // setTotalBalance(BalanceTotal);
            setTotalDebit(DebitTotal);
            setTotalCredit(CreditTotal);

            setSupplierInvoiceID(result?.data?.data[0]?.invoice_id);
            setShow(true);
          } else {
            setShow(false);
            notify("error", "no ledger found");
          }
        });
    } else {
      setShow(false);
      notify("error", "fields must not be empty");
    }
  };

  const showInvoiceDetails = async (type: any) => {
    const getSuppliersInvoiceID = async () => {
      let body: any = {};
      body = {
        action: "getInvDetailsBySupplierId",
        supplier_invoice_id: type,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((result) => {
          result?.data?.data?.length &&
          result?.data?.data[0]?.supplier_invoice_id
            ? router.push(
                `/modules/purchase/invoice/details/${result?.data?.data[0]?.supplier_invoice_id}`
              )
            : notify("error", "details not found");
        });
    };
    type ? getSuppliersInvoiceID() : notify("error", "details not found");
  };

  useEffect(() => {
    const controller = new AbortController();
    //fetching supplier info
    const getSupplierInfo = async () => {
      if (supplierID) {
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
            { action: "getSupplierByID", id: supplierID }
          )
          .then((res) => {
            setSupplierInfo({
              ...supplierInfo,
              name: res?.data?.data[0]?.name,
              address: res?.data?.data[0]?.address,
              contact_number: res?.data?.data[0]?.contact_number,
              email: res?.data?.data[0]?.email,
            });
          })
          .catch((err) => {
            console.log("Something went wrong !" + <br /> + err);
          });
      }
    };
    getSupplierInfo();

    return () => controller.abort();
  }, [supplierID]);

  let balance: any = 0;

  const printRef = React.useRef();

  const handleDownloadPdf = async () => {
    const element = document.getElementById("printME");
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    notify("success", "printing invoice of " + supplierInfo?.name);
    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, "PNG", 0, marginTop, pdfWidth, pdfHeight);

    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  const [startDate, setStartDate] = useState(new Date());
  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Supplier Ledger", link: "/modules/purchase/supplier/ledger" },
  ];

  return (
    <>
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <HeadSection title="Supplier Ledger" />
        <div className="shadow" style={{ height: "auto" }}>
          {!show ? (
            <>
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-box mb-0">Supplier Ledger</h4>
                </div>
              </div>
              <div className="row pt-4 p-3">
                <Label className=" col-lg-12" text="Supplier Name:" />
                <div className="col-sm-3 col-lg-3 col-md-3">
                  <Select2
                    options={supplier?.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    }))}
                    onChange={(e: any) => {
                      setSupplierID(e.value);
                    }}
                  />
                </div>
              </div>
              <div className="row  p-3">
                <Label className="col-lg-12" text="Date from" />
                <div className="col-sm-6 col-lg-6 col-md-6">
                  <DatePicker
                    className="form-control  "
                    value={format(new Date(fromDate), "yyyy/MM/dd")}
                    required
                    onChange={(date) =>
                      setFromDate(format(new Date(date), "yyyy/MM/dd"))
                    }
                  />
                  {/* <input className="form-control form-control" type="date" value={fromDate} required onChange={(e) => setFromDate(e.target.value)} id="date" /> */}
                </div>
              </div>
              <div className="row  p-3">
                <Label className=" " text="Date to" />
                <div className="col-sm-6 col-lg-6 col-md-6">
                  <DatePicker
                    className="form-control  "
                    value={format(new Date(toDate), "yyyy/MM/dd")}
                    required
                    onChange={(date) =>
                      setToDate(format(new Date(date), "yyyy/MM/dd"))
                    }
                  />
                  {/* <input className="form-control form-control" type="date" value={toDate} required onChange={(e) => setToDate(e.target.value)} id="date" /> */}
                </div>
              </div>
              <div className="row  p-3">
                <div className="col-sm-8 col-lg-8 col-md-8">
                  <div className="col-sm-6 col-lg-6 col-md-6 ms-auto">
                   {accessPermissions.listAndDetails &&<Button
                      className="shadow rounded"
                      variant="info"
                      onClick={getSupplierLedger}
                    >
                      View Ledger
                    </Button>}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div className="card-box p-3 mb-0">
                  <span
                    className="text-primary text-underline text-decoration-underline"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShow(false)}
                  >
                    Supplier Ledger
                  </span>
                </div>
              </div>
              <div id="printME" className="p-3">
                <div className="d-flex justify-content-between small my-2">
                  <div className="col-sm-4 col-lg-4 col-md-4 my-2">
                    <div>
                      <div>{supplierInfo?.name}</div>
                      <strong>{supplierInfo?.address} </strong>
                      {!!supplierInfo?.contact_number && (
                        <div className="mt-1">
                          Phone: {supplierInfo?.contact_number}
                        </div>
                      )}
                      {supplierInfo?.email && (
                        <div>Email: {supplierInfo?.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                    <div className="ms-auto col-sm-8 col-lg-8 col-md-8">
                      <div>
                        Supplier Ledger From {fromDate} to {toDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {show && (
                    <Table striped bordered hover>
                      <thead className="bg-light border-0">
                        <tr className="text-center">
                          <th className="fw-bolder">Date</th>
                          <th className="fw-bolder">Particulars</th>
                          <th className="fw-bolder">Reference</th>
                          <th className="fw-bolder">Debit</th>
                          <th className="fw-bolder">Credit</th>
                          <th className="fw-bolder">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData?.map((item, index) => (
                          <>
                            {item.itemId !== null && (
                              <tr
                                className="text-center"
                                style={{ cursor: "pointer" }}
                                key={index}
                              >
                                <td>
                                  {moment(item.created_at).format("YYYY-MM-DD")}
                                </td>
                                <td>{item.inv_type}</td>
                                <td
                                  onClick={() =>
                                    showInvoiceDetails(item.invoice_id)
                                  }
                                >
                                  {item?.invoice_id ? (
                                    <span className="text-primary">
                                      {item?.invoice_id}
                                    </span>
                                  ) : (
                                    <span className="text-dark">
                                      no invoice yet
                                    </span>
                                  )}
                                </td>
                                <td>{item?.debit}</td>
                                <td>{item?.credit}</td>
                                <td>
                                  {
                                    (balance = (
                                      balance +
                                      Number(item.debit) -
                                      Number(item?.credit)
                                    ).toFixed(2))
                                  }
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>

                      {show && (
                        <tr className="border-none">
                          <td></td>
                          <td></td>
                          <td></td>
                          <td
                            className="text-center fw-bolder"
                            style={{ borderTopWidth: 2 }}
                          >
                            {totalDebit.toFixed(2)}
                          </td>
                          <td
                            className="text-center fw-bolder"
                            style={{ borderTopWidth: 2 }}
                          >
                            {totalCredit.toFixed(2)}
                          </td>
                          <td
                            className="text-center fw-bolder"
                            style={{ borderTopWidth: 2 }}
                          >
                            {balance}
                          </td>
                        </tr>
                      )}
                    </Table>
                  )}
                </div>
              </div>

              <div className="my-2 pe-5 text-end ">
                <Button
                  variant="success"
                  className="mb-3"
                  onClick={handleDownloadPdf}
                >
                  <span className="fs-5 me-1">
                    <FaFilePdf />
                  </span>
                  Print Ladger
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default index;
