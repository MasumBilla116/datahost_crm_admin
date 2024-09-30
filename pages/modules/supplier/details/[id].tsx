import easyinvoice from "easyinvoice";
import * as moment from "moment";
import { useRouter } from "next/router";
import converter from "number-to-words";
import { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaPhone } from "react-icons/fa";

import BarcodeGenerator from "../../../../components/Barcode";
import HeadSection from "../../../../components/HeadSection";
import PropagateLoading from "../../../../components/PropagateLoading";
import toast from "../../../../components/Toast/index";
import HotelLogo from "../../../../components/hotelLogo";
import Axios from "../../../../utils/axios";

export default function EmployeeDetails() {
  //state declaration
  const [invoices, setInvoices] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [supplierID, setSupplierID] = useState<number>();
  const [items, setItems] = useState();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(false);
  const [supplierInvID, setSupplierInvID] = useState(false);

  const { http } = Axios();

  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  const { pathname } = router;
  useEffect(() => {
    let isSubscribed = true;

    if (!isReady) {
      return;
    }
    setLoading(true);
    http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, {
        action: "getSupplierByID",
        id: id,
      })
      .then((res) => {
        if (isSubscribed) {
          setDetails(res?.data?.data[0]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [id, isReady]);

  useEffect(() => {
    const controller = new AbortController();

    //fetching invoice items
    const getInvoiceDetails = async () => {
      let body: any = {};
      body = {
        action: "getInvoiceDetailsBySupplierID",
        supplier_id: id,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((res) => {
          setSupplierID(res?.data?.data[0]?.supplier_id);
          setInvoices(res?.data?.data);
          let totalamount = 0;
          res?.data?.data.map((invoice: any) => {
            totalamount += invoice.unitPrice * invoice.item_qty;
          });
          setTotalAmount(totalamount);
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
    { text: "All Supplier", link: "/modules/purchase/supplier" },
    { text: "View Supplier", link: "/modules/purchase/supplier/details/[id]" },
  ];

  return (
    <>
      <HeadSection title="Supplier Details" />
      <div className="container-fluid p-3 pt-0" style={{ marginTop: "-30px" }}>
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          {/* Column */}
          <div className="row">
            <div className="row bg-white p-3 m-3 shadow">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <h4 className="box-title mt-1">Supplier Details</h4>
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="p-2" width={390}>
                          Supplier Name
                        </td>
                        <td className="p-2">{details && details?.name}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Address</td>
                        <td className="p-2">{details && details?.address}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Country</td>
                        <td className="p-2">{details && details?.country}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Contact Info</td>
                        <td className="p-2">
                          {details && details?.contact_number}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Email</td>
                        <td className="p-2">{details && details?.email}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Description</td>
                        <td className="p-2">
                          {details && details?.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Type</td>
                        <td className="p-2">{details && details?.type}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Bank Name</td>
                        <td className="p-2">{details && details?.bank_name}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Bank Acc Number</td>
                        <td className="p-2">
                          {details && details?.bank_acc_number}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Opening Balance</td>
                        <td className="p-2">
                          {details && details?.opening_balance}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Status</td>
                        <td className="p-2">
                          {details && details?.status ? "Active" : "In-Active"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <h4 className="box-title mt-1">Balance Info</h4>
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="p-2" width={390}>
                          Opening Balance
                        </td>
                        <td className="p-2">{details && details?.name}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Balance</td>
                        <td className="p-2">{details && details?.balance}</td>
                      </tr>
                      <tr>
                        <td className="p-2">Total Purchase Amount</td>
                        <td className="p-2">
                          {details && details?.total_purchase_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h4 className="box-title mt-5">Create & Update Info</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="p-2" width={390}>
                            Created By
                          </td>
                          <td className="p-2">
                            {details && details?.created_by
                              ? moment(details?.created_by).format("DD-MM-YYYY")
                              : "Not-Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2">Created At</td>
                          <td className="p-2">
                            {details && details?.created_at
                              ? moment(details?.created_at).format("DD-MM-YYYY")
                              : "Not-Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2">Updated By</td>
                          <td className="p-2">
                            {details && details?.updated_by
                              ? ""
                              : "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2">Updated At</td>
                          <td className="p-2">
                            {details && details?.updated_at
                              ? ""
                              : "Not Available"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-auto p-0">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="card shadow p-3">
                <div className="border-bottom title-part-padding">
                  <h4 className="box-title mb-0">Invoice List</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table
                      id="multi_col_order"
                      className="table table-striped table-bordered display"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>Invoice No</th>
                          <th>Supplier invoice</th>
                          <th>Total Items</th>
                          <th>Total Qty</th>
                          <th>Total amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!!invoices.length &&
                          invoices.map((invoice) => {
                            return (
                              <tr>
                                {/* <td><Link href="#">{invoice?.local_invoice}</Link></td> */}
                                <td
                                  className="text-primary p-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setOpenView(true);
                                    setSupplierInvID(
                                      invoice?.supplier_invoice_id
                                    );
                                  }}
                                >
                                  {invoice?.local_invoice}
                                </td>
                                <td className="p-2">
                                  {invoice?.supplier_invoice}
                                </td>
                                <td className="p-2">{invoice?.total_item}</td>
                                <td className="p-2">
                                  {invoice?.total_item_qty}
                                </td>
                                <td className="p-2">{invoice?.total_amount}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    {!!!invoices.length && (
                      <p className="text-center my-2">No data found!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Column */}
        </div>
      </div>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={openView}
        onHide={() => setOpenView(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <View supplierInvID={supplierInvID} />
        </Modal.Body>
      </Modal>
    </>
  );
}

const View = ({ supplierInvID }) => {
  const { http } = Axios();

  // Toastify setup
  const notify = useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);

  //state declaration
  const [invoices, setInvoices] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [supplierID, setSupplierID] = useState<number>();
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

  useEffect(() => {
    const controller = new AbortController();

    //fetching invoice items
    const getInvoiceDetails = async () => {
      let body: any = {};
      body = {
        action: "getInvoiceDetails",
        supplier_invoice_id: supplierInvID,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((res) => {
          setSupplierID(res?.data?.data[0]?.supplier_id);
          !!res?.data?.data.length &&
            setEditAttempt(res?.data?.data[0]?.edit_attempt);
          setInvoices(res?.data?.data || []);
          let totalamount = 0;
          res?.data?.data.map((invoice: any) => {
            totalamount += invoice.unitPrice * invoice.item_qty;
          });
          setTotalAmount(totalamount);
        })
        .catch((err) => {
          console.log("Something went wrong !" + <br /> + err);
        });
    };
    supplierInvID && getInvoiceDetails();

    return () => controller.abort();
  }, [supplierInvID]);

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
            setInitialLoading(false);
          })
          .catch((err) => {
            console.log("Something went wrong !" + <br /> + err);
          });
      }
    };
    getSupplierInfo();

    return () => controller.abort();
  }, [supplierID]);

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

  if (invoices?.length) {
    invoices?.map((invoice) => {
      items.push({
        quantity: invoice?.item_qty,
        description: invoice?.itemName,
        "tax-rate": 0,
        price: invoice?.unitPrice,
      });
    });
  }

  //print data
  const pdfData: any = {
    products: items,
    images: {
      // The logo on top of your invoice
      logo: "https://res.cloudinary.com/duvqwdyz6/image/upload/v1661764156/cover_wusqku.png",
      // The invoice background
      // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
    },
    // Your own data
    sender: {
      company: supplierInfo?.name,
      address: supplierInfo?.address,
      zip: "1234 AB",
      city: "Sampletown",
      country: "Samplecountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    // Your recipient
    client: {
      company: "Managebeds",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      // "custom1": "custom value 1",
      // "custom2": "custom value 2",
      // "custom3": "custom value 3"
    },
    information: {
      // Invoice number
      number: "2021.0001",
      // Invoice data
      date: "12-12-2021",
      // Invoice due date
      "due-date": "31-12-2021",
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    // Settings to customize your invoice
    settings: {
      currency: "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
      // "tax-notation": "gst", // Defaults to 'vat'
      // "margin-top": 25, // Defaults to '25'
      // "margin-right": 25, // Defaults to '25'
      // "margin-left": 25, // Defaults to '25'
      // "margin-bottom": 25, // Defaults to '25'
      // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
      // "height": "1000px", // allowed units: mm, cm, in, px
      // "width": "500px", // allowed units: mm, cm, in, px
      // "orientation": "landscape", // portrait or landscape, defaults to portrait
    },
    // Translate your invoice to your preferred language
    translate: {
      // "invoice": "FACTUUR",  // Default to 'INVOICE'
      // "number": "Nummer", // Defaults to 'Number'
      // "date": "Datum", // Default to 'Date'
      // "due-date": "Verloopdatum", // Defaults to 'Due Date'
      // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
      // "products": "Producten", // Defaults to 'Products'
      // "quantity": "Aantal", // Default to 'Quantity'
      // "price": "Prijs", // Defaults to 'Price'
      // "product-total": "Totaal", // Defaults to 'Total'
      // "total": "Totaal" // Defaults to 'Total'
    },
  };

  //print pdf
  const printInvoice = async () => {
    easyinvoice.createInvoice(pdfData, function (result) {
      easyinvoice.download("myInvoice.pdf", result.pdf);
    });
    notify("success", "Invoice printing!");
  };

  //table data
  const columnData: any = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row: any, index: number) => index + 1,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Product</span>,
      selector: (row: { itemName: string }) => row?.itemName,
      width: "40%",
    },
    {
      name: <span className="fw-bold">Remarks</span>,
      selector: (row: { item_remarks: string }) => row?.item_remarks,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Cost</span>,
      selector: (row: { unitPrice: number }) => row?.unitPrice,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Qty</span>,
      selector: (row: { item_qty: number }) => row?.item_qty,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Unit Type</span>,
      selector: (row: { piece: string }) => row?.piece.slice(0, 1) + "(s)",
      width: "10%",
    },
    {
      name: <span className="fw-bold">Total</span>,
      selector: (row: { item_qty: number; unitPrice: number }) =>
        (row?.item_qty * row?.unitPrice).toFixed(2),
      width: "10%",
    },
  ];
  const rowData = invoices;

  const [loading, setLoading] = useState(true);
  const [logoDetails, setLogoDetails] = useState([]);
  const fetchLogoImages = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "hotelLogo",
      })
      .then((res) => {
        if (isSubscribed) {
          setLogoDetails(res.data?.data);
          setLoading(false);
        }
      })

      .catch((err) => {
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    fetchLogoImages();
  }, [fetchLogoImages]);

  return (
    <div>
      <div className="pb-5 m-4">
        <div className="mb-5">
          <div className="text-center fs-3">
            {logoDetails?.uploadsData?.length > 0 && <HotelLogo id={id} invoiceName=""/>}
  
          </div>
          {initialLoading ? (
            <div className="my-5 mx-3 text-center">
              <PropagateLoading />
            </div>
          ) : (
            <div className="row small my-2">
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
              <div className="text-center col-sm-4 col-lg-4 col-md-4 my-2">
                <div>
                  <strong>Invoice# </strong>
                  {/* <span>{invoices.length && invoices[0]?.local_invoice}</span> */}
                  <BarcodeGenerator
                    value={invoices.length && invoices[0]?.local_invoice}
                  />
                </div>
                {/* <div>(Bar Code)</div> */}
              </div>
              <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                <div className="ms-auto col-sm-8 col-lg-8 col-md-8">
                  <div>
                    <strong>Supplier Invoice:</strong>
                    <span>
                      {invoices.length && invoices[0]?.supplier_invoice_id}
                    </span>
                  </div>
                  <div>
                    <strong>Local Invoice:</strong>
                    <span>{invoices.length && invoices[0]?.local_invoice}</span>
                  </div>
                  <div className="mt-2">
                    <strong>Total Amount:</strong>
                    <span>{totalAmount} Tk</span>
                  </div>
                  <div>
                    <strong>Invoice Date:</strong>
                    <span>{invoices.length && invoices[0]?.invoice_date}</span>
                  </div>
                  <div>
                    <strong>Create Date-Time:</strong>
                    <span>{invoices.length && invoices[0]?.created_at}</span>
                  </div>
                  <div>
                    <strong>Remarks:</strong>
                    <span>
                      {invoices.length && invoices[0]?.common_remarks}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!initialLoading && (
          <div>
            <DataTable columns={columnData} data={rowData} striped />
            <div className="mb-2 pt-4 row border-top">
              <div className="col-sm-12 col-lg-8 col-md-8">
                <div>
                  <span className="fw-bold">
                    In Word:{" "}
                    {getPascalCase(converter.toWords(totalAmount)) +
                      " TAKA Only"}
                  </span>
                </div>
              </div>
              <div className="row text-end col-sm-12 col-lg-4 col-md-4">
                <div className="row col-sm-6 col-lg-6 col-md-6">
                  <div>
                    <span className="fw-bold">Total Amount:</span>
                  </div>
                </div>
                <div className="row col-sm-12 col-lg-6 col-md-6">
                  <div>
                    <span>{totalAmount.toFixed(2)} Tk</span>
                  </div>
                </div>
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
              <div className="w-25 text-center pt-5 mt-5">(company logo)</div>
              <div className="w-25 mt-5">
                <div>
                  <hr />
                </div>
                <div className="text-center fw-bolder">
                  For managebeds computer
                </div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-md-6 col-lg-6">
                {/* <div>
                                    <Button variant='danger'>  <span className='fs-5'><FaEdit /></span> Return Purchase</Button>
                                    <Link href={`/modules/purchase/invoice/update/${id}`}><Button variant='info my-2 mx-2'> <span className='fs-5 mx-2'><FaEdit /></span>Edit Invoice </Button></Link>
                                    {!!editAttempt && <Link href={`/modules/purchase/invoice/history/${id}`}><Button variant='info my-2 mx-2'> <span className='fs-5 mx-2'><FaEdit /></span>Edit History </Button></Link>}
                                </div> */}
              </div>
              <div className="col-md-6 col-lg-6 text-end">
                <Button variant="success" className="" onClick={printInvoice}>
                  <span className="fs-5 me-1">
                    <FaFilePdf />
                  </span>
                  Print Consignment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
