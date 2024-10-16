import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select2 from "../../../../../components/elements/Select2";

import BarcodeGenerator from "../../../../../components/Barcode";
import toast from "../../../../../components/Toast/index";
import PrintButton from "../../../../../components/elements/PrintButton";
import HotelLogo from "../../../../../components/hotelLogo";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";
import themeContext from "../../../../../components/context/themeContext";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.lndr",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, invoiceId, loading }) => {
  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [payment, setPayment] = useState({
    discount: null,
    paid_amount: parseFloat(totalAmount),
    account: null,
    customer: null,
    invoice_id: null,
  });

  const [invoiceInfo, setInvoiceInfo] = useState("");
  const [totalAmount, setTotalAmount] = useState();
  const [totalAmountTemp, setTotalAmountTemp] = useState();

  const [accountList, setAccountList] = useState("");
  const accounts_options = accountList?.data;

  const [accountBalance, setAccountBalance] = useState(null);

  const [pending, setPending] = useState(true);

  const handleChange = (e) => {
    if (e.target.name == "discount") {
      setTotalAmount(Number(totalAmountTemp) - Number(e.target.value));
    }
    setPayment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();
    async function getAllAccounts() {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
          action: "listAccounts",
        })
        .then((res) => {
          setAccountList(res?.data);
        });
    }
    getAllAccounts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function getAccountBalance() {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
          action: "getAccountInfo",
          id: payment.account,
        })
        .then((res) => {
          setAccountBalance(res?.data?.data?.balance);
        });
    }
    getAccountBalance();
    return () => controller.abort();
  }, [payment.account]);

  const fetchInvoiceData = useCallback(async () => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        { action: "getInvoiceInfo", invoice_id: invoiceId }
      )
      .then((res) => {
        if (isSubscribed) {
          setInvoiceInfo(res.data.data);
          setPayment((prev) => ({
            ...prev,
            discount: res.data.data.discount,
            customer: res.data.data.customer?.id,
            customer_type: res.data.data?.customer_type,
            invoice_id: res.data.data.id,
          }));
          setTotalAmount(res?.data?.data?.total_amount);
          // setPayment(payment.paid_amount=res?.data?.data?.total_amount)
          setPayment((prev) => ({
            ...prev,
            paid_amount: res?.data?.data?.total_amountgit,
          }));
          setTotalAmountTemp(
            Number(res?.data?.data?.total_amount) +
              Number(res?.data?.data?.discount)
          );
          setPending(false);
        }
      })
      .catch((e) => {
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoiceData();
  }, [fetchInvoiceData]);

  let dataset = {
    ...payment,
    paid_amount: parseFloat(totalAmount),
    totalAmount,
    action: "makeRestaurantPayments",
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <Form>
      <div className="row ps-0" style={{ padding: "20px" }}>
        <div className="col-md-4 text-capitalize">
          <div>
            <strong>Customer : </strong>
            <span>
              {invoiceInfo.customer
                ? invoiceInfo.customer?.first_name +
                  " " +
                  invoiceInfo.customer?.last_name
                : invoiceInfo.guest_customer}
            </span>
          </div>
          <div>
            <strong>Address : </strong>
            <span>{invoiceInfo.customer?.address || "NA"}</span>
          </div>
          <div>
            <strong>phone : </strong>
            <span>{invoiceInfo.customer?.mobile || "NA"}</span>
          </div>
          <div>
            <strong>Customer Type : </strong>
            <span>
              {invoiceInfo.customer ? "Hotel Customer" : "Walk In Customer"}
            </span>
          </div>
          <div>
            <strong>Balance : </strong>
            <span>{invoiceInfo.customer?.balance || "NA"}</span>
          </div>
          {/* <div><strong>Credit Limit : </strong><span></span></div>
                <div><strong>Available Credit : </strong><span></span></div> */}
        </div>
        <div className="col-md-4">
          <div>
            <strong>Invoice Payment</strong>
            <span></span>
          </div>
          <div>
            <strong>{invoiceInfo?.invoice_number}</strong>
            <span></span>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <strong>Invoicd Amount : </strong>
            <span>{invoiceInfo?.total_amount}</span>
          </div>
          <div>
            <strong>date : </strong>
            <span>{moment(invoiceInfo?.created_at).format("DD/MM/YYYY")}</span>
          </div>
          <div>
            <strong>Created By : </strong>
            <span>{invoiceInfo?.creator?.name}</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Final Discount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Final discount"
              name="discount"
              defaultValue={payment.discount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Paid Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Paid Amount"
              name="paid_amount"
              onChange={handleChange}
              // defaultValue={payment.paid_amount}
              defaultValue={totalAmount}
              // required
              disabled
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Select Accounts</Form.Label>
            <Select2
              options={accounts_options?.map(({ id, account_name }) => ({
                value: id,
                label: account_name,
              }))}
              onChange={(e) =>
                setPayment((prev) => ({
                  ...prev,
                  account: e?.value,
                }))
              }
              name="account"
              className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={true}
            />
          </Form.Group>
          <p> Balance: {accountBalance}</p>
        </div>
        <div className="col-md-6 text-center">
          <div>
            <strong>Final Amount to Pay : </strong>
            <span>{totalAmount}</span>
          </div>
          <div>
            <strong>Paid Amount : </strong>
            <span>{invoiceInfo?.paid_amount}</span>
          </div>
          <div>
            <strong>Due Amount : </strong>
            <span>{invoiceInfo?.due_amount}</span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => {
          onSubmit(dataset);
        }}
        block
      >
        Payment
      </Button>
    </Form>
  );
};

function VoucherDetails({ accessPermissions }) {
  const context = useContext(themeContext);
  const {golbalCurrency} = context;

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Router setup
  const { http } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: { id, holddata },
  } = router;

  // Toastify setup;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  //state declaration
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    const controller = new AbortController();

    //fetching invoice items
    const getVoucherDetails = async () => {
      let body = {};
      body = {
        action: "getInvoiceInfo",
        invoice_id: id,
        holddata: holddata || false,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
          body
        )
        .then((res) => {
          setInvoices(res?.data?.data || []);
        })
        .catch((err) => {
          console.log(err + <br /> + "Something went wrong !");
        });
    };

    isReady && getVoucherDetails();

    return () => controller.abort();
  }, [id, isReady]);

  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        items
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.account) {
            notify("error", `${msg.account.Account}`);
          }
          if (msg?.price) {
            notify("error", `${msg.price.Price}`);
          }
          if (msg?.foods) {
            notify("error", `please select atleast one food!`);
          }
        }
        setLoading(false);
      });

    return () => (isSubscribed = false);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById("printME");
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // notify("success", "printing invoice of " + supplierInfo?.name)
    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, "PNG", 0, marginTop, pdfWidth, pdfHeight);

    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  //table data
  const columnData = [
    {
      name: <span className="fw-bold">Food Name</span>,
      selector: (row) =>
        <span className="text-capitalize">{row?.food_name}</span> || (
          <span className="text-capitalize">{row?.setmenuName}</span>
        ),
    },
    {
      name: <span className="fw-bold">Unit Price</span>,
      selector: (row) => (
        <div
          className="text-capitalize"
          style={{ textAlign: "right", width: "80px" }}
        >
          {golbalCurrency[0]?.symbol}{row?.unit_price}{" "}
        </div>
      ),
      // width: "60%"
    },
    {
      name: <span className="fw-bold">Qty</span>,
      selector: (row) => row?.qty,
      // width: "10%"
    },
    {
      name: <span className="fw-bold">remarks</span>,
      selector: (row) => (
        <span className="text-capitalize">{row?.remarks}</span>
      ),
      // width: "10%"
    },
    {
      name: <span className="fw-bold">Total Price</span>,
      selector: (row) => (
        <div className="text-end" style={{ textAlign: "right", width: "80px" }}>
           {golbalCurrency[0]?.symbol}{row?.total_price}
        </div>
      ),
      //   width: "60%"
    },
  ];
  const rowData = invoices?.invoice_list;

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div>
      <div className="card shadow pb-5 m-4">
        <div id="printME" className="p-5">
          <div>
            <div className="text-center fs-3">
              {/* <h1 className='mb-3'>(Company Logo)</h1> */}
              <HotelLogo id={id} invoiceName="Restaurant Invoice" />
            </div>
            <div className="row small my-2">
              <div className="col-sm-4 col-lg-4 col-md-4 my-2 text-capitalize">
                <table className="">
                  <tbody>
                    <tr>
                      <th style={{width:'105px'}}>Customer</th>
                      <th style={{width:"10px"}}>:</th>
                      <td>
                        {invoices?.customer?.first_name == null &&
                        invoices?.customer?.last_name == null ? (
                          "NA"
                        ) : (
                          <>
                            {" "}
                            {invoices?.customer?.first_name +
                              " " +
                              invoices?.customer?.last_name}
                          </>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <th>:</th>
                      <td> {invoices.customer?.mobile || "NA"}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <th>:</th>
                      <td> {invoices.customer?.address || "NA"}</td>
                    </tr>
                    <tr>
                      <th>Customer Type </th>
                      <th>:</th>
                      <td> {invoices.customer ? "Hotel Customer" : "Walk In Customer"} </td>
                    </tr>
                  </tbody>
                </table>  
                
                {/* <div><strong>Balance : </strong><span>{invoices.customer?.balance || "NA"}</span></div>  */}
              </div>
              <div className="text-center col-sm-4 col-lg-4 col-md-4 my-2">
                {/* <div>
                                    <strong>Voucher Number:  </strong>
                                    <strong>{invoices?.voucher_number}</strong>
                                </div>
                                <div>(Bar Code)</div> */}
                <BarcodeGenerator value={invoices?.invoice_number} />
              </div>
              <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                <div className="ms-auto col-sm-8 col-lg-8 col-md-8 text-capitalize">
                  <table>
                    <tbody>
                      <tr>
                        <th style={{width:"110px"}}>Date</th>
                        <th style={{width:"10px"}}>:</th>
                        <td>{moment(invoices?.created_at).format("DD-MM-YYYY")}</td> 
                      </tr>
                      <tr>
                        <th>Created By </th>
                        <th>:</th>
                        <td>{invoices?.creator?.name}</td> 
                      </tr>
                      <tr>
                        <th>Remarks</th>
                        <th>:</th>
                        <td>{invoices?.remarks}</td> 
                      </tr>
                      <tr>
                        <th>Payment Status</th>
                        <th>:</th>
                        <td>{invoices?.is_paid == 1 || invoices?.paid_amount > 0
                        ? "Payment Completed"
                        : "Pending"}</td> 
                      </tr>

                    </tbody>
                  </table> 
                </div>
              </div>
            </div>
          </div>

          <div>
            <DataTable columns={columnData} data={rowData} striped />
            <div className="row">
              <div className="col-lg-8"></div>
              <div className="table-responsive mt-4 col-lg-4 d-flex justify-content-end">
                <table className="">
                  <tbody>
                    <tr>
                      <th style={{ width: "180px" }}>Sub-total</th>
                      <th>:</th>
                      <td style={{ width: "80px" }} className="text-end">
                      {golbalCurrency[0]?.symbol}{invoices.net_total}
                      </td>
                    </tr>
                    {/* <tr>
                      <th>Service Charge (%)</th>
                      <th>:</th>
                      <td className="text-end" >{invoices.service_charge}</td>
                    </tr> */}
                    <tr>
                      <th>Total Tax (%)</th>
                      <th>:</th>
                      <td className="text-end">{golbalCurrency[0]?.symbol}{invoices.net_vat}</td>
                    </tr>
                    {/* <tr>
                      <th>Promo</th>
                      <th>:</th>
                      <td className="text-end" > {invoices.net_promo}</td>
                    </tr>
                    <tr>
                      <th>Discount</th>
                      <th>:</th>
                      <td className="text-end" >{invoices.discount ? invoices.discount : "0.00"}</td>
                    </tr> */}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={3}>
                        <hr className="m-0" />
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={1} className="">
                        Payable Amount
                      </th>
                      <th colSpan={1} className="">
                        :
                      </th>
                      <th className="text-end">{golbalCurrency[0]?.symbol}{invoices.total_amount}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

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
                  For management signature
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0">
          <div className="col-md-6 col-lg-6">
            {accessPermissions.createAndUpdate && invoices.is_paid === 0 && (
              <div>
                <Button variant="info" onClick={handleShow}>
                  <span className="fs-5">Payment</span>
                </Button>
              </div>
            )}

            {/* Create Modal Form */}
            <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create Payment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CreateForm
                  onSubmit={submitForm}
                  invoiceId={id}
                  loading={loading}
                />
              </Modal.Body>
            </Modal>
            {/* End Create Modal Form */}
          </div>
          <div className="col-md-6 col-lg-6 text-end">
            {/* <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
            <PrintButton contentId="printME" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default VoucherDetails;
