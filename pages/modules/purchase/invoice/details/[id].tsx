import easyinvoice from "easyinvoice";
import Link from "next/link";
import { useRouter } from "next/router";
import converter from "number-to-words";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";

import BarcodeGenerator from "../../../../../components/Barcode";
import PrintButton from "../../../../../components/elements/PrintButton";
import HotelLogo from "../../../../../components/hotelLogo";
import PropagateLoading from "../../../../../components/PropagateLoading";
import toast from "../../../../../components/Toast/index";
import Axios from "../../../../../utils/axios";

function InvoiceDetails() {
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
  const [invoices, setInvoices] = useState<any[]>([]);
  console.log("🚀 ~ InvoiceDetails ~ invoices:", invoices);
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
        supplier_invoice_id: id,
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
            totalamount += invoice.unit_price * invoice.stock;
          });
          setTotalAmount(totalamount);
        })
        .catch((err) => {
          console.log("Something went wrong !" + <br /> + err);
        });

      setInitialLoading(false);
    };
    isReady && getInvoiceDetails();

    return () => controller.abort();
  }, [id, isReady]);

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
    },
    {
      name: <span className="fw-bold">Item</span>,
      selector: (row: { item_name: string }) => row?.item_name,
    },
    {
      name: <span className="fw-bold">Item Type</span>,
      selector: (row: { item_type_name: string }) => row?.item_type_name,
    },
    {
      name: <span className="fw-bold">Unit Price</span>,
      selector: (row: { unit_price: number }) => row?.unit_price,
    },
    {
      name: <span className="fw-bold">Purchase Qty</span>,
      selector: (row: { quantity: number }) => row?.quantity,
    },
    {
      name: <span className="fw-bold">Availabel Qty</span>,
      selector: (row: { stock: number }) => row?.stock,
    },

    {
      name: <span className="fw-bold">Total</span>,
      selector: (row: { stock: number; unit_price: number }) =>
        (row?.stock * row?.unit_price).toFixed(2),
    },
  ];
  const rowData = invoices;
  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Supplier ", link: "/modules/purchase/invoice" },
    { text: "View Supplier ", link: "/modules/purchase/invoice/details/[id]" },
  ];

  return (
    <div>
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="card shadow pb-5 m-4 ">
        <div className="p-3" id="printME">
          <div className="mb-5">
            <div className="text-center fs-3">
              {/* <h1 className='mb-3'>(Company Logo)</h1> */}
              <HotelLogo id={id} />
            </div>
            {initialLoading ? (
              <div className="my-5 mx-3 text-center">
                <PropagateLoading />
              </div>
            ) : (
              <div className="row small" style={{ padding: "20px" }}>
                <div className="col-sm-4 col-lg-4 col-md-4">
                  {invoices && (
                    <div>
                      <div>{invoices[0]?.supplier_name}</div>
                      <strong>{invoices[0]?.address} </strong>
                      <div className="mt-1">
                        Phone: {invoices[0]?.contact_number}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center col-sm-4 col-lg-4 col-md-4 ">
                  {/* <div>
                                    <strong>Invoice# </strong>
                                    <span>{invoices.length && invoices[0]?.local_invoice}</span>
                                </div>
                                <div>(Bar Code)</div> */}
                  <BarcodeGenerator
                    value={invoices.length && invoices[0]?.local_invoice}
                  />
                </div>
                <div className="row col-sm-4 col-lg-4 col-md-4 ">
                  {invoices && (
                    <div className="ms-auto col-sm-8 col-lg-8 col-md-8 ">
                      <div>
                        <strong>Purchase Invoice: </strong>
                        <span>{invoices[0]?.purchase_invoice}</span>
                      </div>
                      <div className="mt-2">
                        <strong>Total Amount: </strong>
                        <span>{totalAmount} Tk</span>
                      </div>
                      <div>
                        <strong>Invoice Date: </strong>
                        <span>{invoices[0]?.purchase_date}</span>
                      </div>
                    </div>
                  )}
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
            </div>
          )}
        </div>

        <div className="row m-0">
          <div className="col-md-6 col-lg-6">
            <div>
              <Link href={`/modules/purchase/return/${id}`}>
                <Button variant="danger">
                  {" "}
                  <span className="fs-5">
                    <FaEdit />
                  </span>{" "}
                  Return Purchase
                </Button>
              </Link>
              <Link href={`/modules/purchase/invoice/update/${id}`}>
                <Button variant="info my-2 mx-2">
                  {" "}
                  <span className="fs-5 mx-2">
                    <FaEdit />
                  </span>
                  Edit Invoice{" "}
                </Button>
              </Link>
              {!!editAttempt && (
                <Link href={`/modules/purchase/invoice/history/${id}`}>
                  <Button variant="info my-2 mx-2">
                    {" "}
                    <span className="fs-5 mx-2">
                      <FaEdit />
                    </span>
                    Edit History{" "}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="col-md-6 col-lg-6 text-end">
            {/* <Button variant='success' className='' onClick={printInvoice} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
            <PrintButton contentId="printME" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default InvoiceDetails;
