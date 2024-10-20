import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select2 from "../../../../components/elements/Select2";

import {
  faBangladeshiTakaSign,
  faCircleExclamation,
  faCreditCard,
  faHand,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import { Button, Form, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaFilePdf } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { DeleteIcon, HeadSection } from "../../../../components";
import RestaurantINV from "../../../../components/RestaurantINV";
import themeContext from "../../../../components/context/themeContext";
import Select from "../../../../components/elements/Select";
import ItemSubCat from "../../../../components/inventory_category/ItemSubCat";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rstrnt.crt_odr",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

//Create due Component
const CreateDueForm = ({ onSubmit, loading, validated, loader }) => {
  const [reference, setReference] = useState("");

  const handleChange = (e) => {
    setReference((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Form validated={validated}>
      <div className="row">
        <div className="col-md-12">
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="fal warning-icon"
            />
          </div>
          <h2 className="swal-title">
            Are you want to due ? Same Reference will replace the old list if
            exist!!
          </h2>
          <Form.Group>
            <Form.Label>Reference:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setReference(e.target.value)}
              name="reference"
              placeholder="Enter Reference"
            />
          </Form.Group>
        </div>
      </div>
      <Button
        variant="primary"
        className="shadow rounded mb-3 mt-3"
        disabled={loading}
        type="button"
        onClick={() => onSubmit(reference, "due")}
        block
      >
        {/* {loader && <Loader />} */}
        Create
      </Button>
    </Form>
  );
};

//Create Component
const CreateHoldForm = ({ onSubmit, loading, validated, loader }) => {
  const [reference, setReference] = useState("");

  const handleChange = (e) => {
    setReference((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Form validated={validated}>
      <div className="row">
        <div className="col-md-12">
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="fal warning-icon"
            />
          </div>
          <h2 className="swal-title">
            Hold Invoice ? Same Reference will replace the old list if exist!!
          </h2>
          <Form.Group>
            <Form.Label>Reference:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setReference(e.target.value)}
              name="reference"
              placeholder="Enter Reference"
            />
          </Form.Group>
        </div>
      </div>
      <Button
        variant="primary"
        className="shadow rounded mb-3  mt-3"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(reference, "hold")}
        block
      >
        {/* {loader && <Loader />} */}
        Create
      </Button>
    </Form>
  );
};

//payment component
const CreatePaymentForm = ({
  onSubmit,
  loading,
  validated,
  totalQty,
  netTotal,
  grandTotalAmount,
  deliveryCharge,
}) => {
  const { http } = Axios();
  const [accountList, setAccountList] = useState("");
  const accounts_options = accountList?.data;
  const { notify } = MyToast();
  const [totalAmount, setTotalAmount] = useState(null);
  const [payment, setPayment] = useState({
    paid_amount: grandTotalAmount,
    payment_type: "",
    payment_note: "",
    discount: null,
    payableAmount: grandTotalAmount,
    discountAmount: 0,
    subtotal: parseFloat(grandTotalAmount) ,
  });

  let dataset = { ...payment, totalAmount };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name == "discount") {
      const discount = e.target.value;
      if (parseFloat(discount) > grandTotalAmount) {
        notify("error", `Discount can not be Bigger then main`);
      }
      setTotalAmount(grandTotalAmount - parseFloat(discount));
      const discountAmount = (grandTotalAmount * discount) / 100;

      setPayment({
        ...payment,
        payableAmount: grandTotalAmount - discountAmount,
        discountAmount: discountAmount,
        discount: discount,
      });
    } else {
      setPayment({
        ...payment,
        [name]: value,
      });
    }
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

  return (
    <Form validated={validated}>
      <div className="row">
        <div className="col-md-6">
          <div className="from_area container">
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Total Amount: </Form.Label>
                  <Form.Control
                    type="number"
                    onChange={handleChange}
                    name="paid_amount"
                    value={grandTotalAmount}
                    placeholder="Amount"
                    disabled
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Discount (%)"
                    name="discount"
                    defaultValue={payment.discount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group className="mt-2" controlId="validationCustom02">
                <Form.Label>Payment Type</Form.Label>
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
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a mobile number.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>note:</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  onChange={handleChange}
                  name="payment_note"
                  value={payment.payment_note}
                  placeholder="Something else to noted"
                />
              </Form.Group>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="container payment-container">
            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Items</p>
              </div>

              <div className="col-md-4">
                <p>({totalQty})</p>
              </div>
            </div>
            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Discount</p>
              </div>

              <div className="col-md-4">
                <p>{payment?.discount ?? "--"}</p>
              </div>
            </div>

            <div
              className="row justify-content-center payment-details "
              style={{
                backgroundColor: "rgba(255,0,0,0.8);",
                color: "#ffffff",
              }}
            >
              <div className="col-md-8">
                <p>Total Amount</p>
              </div>

              <div className="col-md-4">
                <p>{netTotal}</p>
              </div>
            </div> 

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Delivery Charge</p>
              </div>
              <div className="col-md-4">
                <p>{deliveryCharge}</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details  bg-warning">
              <div className="col-md-8">
                <p>Subtotal</p>
              </div>

              <div className="col-md-4">
                <p>{payment.subtotal}</p>
              </div>
            </div>
            
            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Discount Amount</p>
              </div>

              <div className="col-md-4">
                <p>{payment.discountAmount}</p>
              </div>
            </div>

            

            <div className="row justify-content-center payment-details  bg-danger">
              <div className="col-md-8">
                <p>Payable Amount</p>
              </div>

              <div className="col-md-4">
                <p>{payment.payableAmount}</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Total Balance</p>
              </div>

              <div className="col-md-4">
                <p>00</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>change Return</p>
              </div>

              <div className="col-md-4">
                <p>00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        className="shadow rounded mt-3 mb-3"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Create
      </Button>
    </Form>
  );
};

//grand total component
const CreateNetTotalForm = ({ onSubmit, loading, validated }) => {
  const [reference, setReference] = useState("");

  const handleChange = (e) => {
    setReference((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // let dataset = { reference: holdData.reference }

  return (
    <Form validated={validated}>
      <div className="row">
        <div className="col-md-12">
          {/* <i className="fa-solid faCircleExclamation"></i> */}
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="fal warning-icon"
            />
          </div>
          <h2 className="swal-title">
            Hold Invoice ? Same Reference will replace the old list if exist!!
          </h2>
          <Form.Group>
            {/* <Form.Label>Reference:</Form.Label> */}
            <Form.Control
              type="text"
              onChange={(e) => setReference(e.target.value)}
              name="reference"
              placeholder="Please Enter Reference Number"
            />
          </Form.Group>
        </div>
      </div>
      <Button
        variant="primary"
        className="shadow rounded mb-3"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(reference)}
        block
      >
        Create
      </Button>
    </Form>
  );
};

//Create Component
const CreateGuestForm = ({ onSubmit, loading, validated }) => {
  const [reference, setReference] = useState("");

  const handleChange = (e) => {
    setReference((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // let dataset = { reference: holdData.reference }

  return (
    <Form validated={validated}>
      <div className="row">
        <div className="col-md-12">
          {/* <i className="fa-solid faCircleExclamation"></i> */}
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="fal warning-icon"
            />
          </div>
          <h2 className="swal-title">
            Hold Invoice ? Same Reference will replace the old list if exist!!
          </h2>
          <Form.Group className="mt-2">
            {/* <Form.Label>Reference:</Form.Label> */}
            <Form.Control
              type="text"
              onChange={(e) => setReference(e.target.value)}
              name="reference"
              placeholder="Please Enter Reference Number"
            />
          </Form.Group>
        </div>
      </div>

      <Button
        variant="primary"
        className="shadow rounded mb-3 float-right mt-4"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(reference)}
        block
      >
        Create
      </Button>
    </Form>
  );
};

const CreateInvoice = () => {
  // use context
  const context = useContext(themeContext);
  const {
    setHoldDataNotification,
    holdDataNotification,
    fetchHoldDataList,
    golbalCurrency,
  } = context;

  //end context

  const { notify } = MyToast();
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [openDate, setOpenDate] = useState(false);
  const [itemsArr, setItemsArr] = useState([]);
  const [item_idsArr, setItemIdsArr] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [netTotal, setNetTotal] = useState(null);
  const [grandTotalAmount, setGrandTotalAmount] = useState(null);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);

  const [totalCalulation, setTotalCalulation] = useState(null);

  const [tables, setTables] = useState([]);
  const [totalQty, setTotalQty] = useState(null);
  //get all hotel customers
  const [customers, setCustomers] = useState();
  const [activeBooking, setActiveBooking] = useState([]);
  const [activeCstmrRm, setActiveCstmrRm] = useState([]);

  const [invoice, setInvoice] = useState({
    inv_date: format(new Date(), "yyyy-MM-dd"),
    customer_id: null,
    deliveryCharge: deliveryCharge,
  });

  const getAllCustomer = useCallback(async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomer",
      })
      .then((res) => {
        console.log("🚀 ~ .then ~ res?.data?.data:", res?.data?.data);
        setCustomers(res?.data?.data);
      });
  }, []);

  useEffect(() => {
    getAllCustomer();
  }, [getAllCustomer]);

  //fetching all filtered food item, bydefault all
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [catLoading, setCatLoading] = useState(false);
  const [fetchItems, setFetchItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFilteredItems = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/pos`, {
        action: "getAllItems",
        category_id: categoryId,
        search: search,
      })
      .then((res) => {
        if (fetchItems?.length == 0) {
          setFetchItems(res?.data?.data);
        }
        setFilteredData(res?.data?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchFilteredItems();
  }, [categoryId, search]);

  const categoryList = useCallback(async () => {
    setCatLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`, {
        action: "getSubCategories",
      })
      .then((res) => {
        setCategories(res?.data?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
    setCatLoading(false);
  }, []);

  useEffect(() => {
    categoryList();
  }, [categoryList]);

  //handle change
  const handleChange = (e) => {
    console.log("🚀 ~ handleChange ~ e.target:", e?.target?.name)
    if (e.target) {
      if (e.target.name === "deliveryCharge") {
        setDeliveryCharge( e?.target?.value);
      }
       
        setInvoice((prev) => ({
          ...prev,
          [e?.target?.name]: e?.target?.value,
        }));
      
    } else if (e.name === "customer_id") {
      setInvoice((prev) => ({
        ...prev,
        customer_id:  e.value,
      }));
    } 
  };

  const storeItems = (item) => {
    if (!item_idsArr.includes(item.id)) {
      const id = item?.id;
      const tax_head = item?.tax_head;
      const tax_head_tax = item?.tax_head?.tax;
      const sales_price = item?.sales_price;
      const stock = item?.stock;
      const item_name = item?.item_name;

      setItemIdsArr((prev) => [...prev, item.id]);
      let tax = 0;
      if (tax_head == null) {
        tax = parseFloat(0);
      } else {
        if (typeof tax_head_tax == "undefined") {
          tax = parseFloat(0);
        } else {
          tax = parseFloat(tax_head_tax);
        }
      }

      let qty = parseFloat(1);
      let unit_price = parseFloat(sales_price);
      let price = parseFloat(qty * unit_price);
      let taxCalculate = parseFloat((price * tax) / 100);
      let subtotal = price + taxCalculate;

      const prev_tax_amt = parseFloat(totalTaxAmount);
      const sum_of_tax = parseFloat(prev_tax_amt + qty * taxCalculate);
      setTotalTaxAmount(sum_of_tax);

      setItemsArr((prev) => [
        ...prev,
        {
          id: id,
          unit_price: unit_price,
          qty: parseFloat(1),
          stock: item.stock,
          price: price,
          tax: taxCalculate,
          taxCalculate: taxCalculate,
          total_price: subtotal,
          item_name: item_name,
        },
      ]);
    }
  };

  //update qty and price

  const changeItemQty = (e, editId) => {
    var _sum_of_tax = 0;
    const newState = itemsArr.map((obj) => {
      if (isNaN(e.target.value)) {
        e.target.value = 0;
      }
      if (e.target.value == "") {
        e.target.value = 0;
      }

      if (obj.id === editId) {
        let qty = parseInt(e.target.value);
        let unit_price = parseFloat(obj.unit_price);
        let price = parseFloat(qty * unit_price);

        let taxCalculate = parseFloat(qty * obj.tax);

        let subtotal = parseFloat(price + obj.tax * qty);
        _sum_of_tax += parseFloat(obj.tax * qty);

        return {
          ...obj,
          qty: qty,
          price: price,
          total_price: subtotal,
          taxCalculate: taxCalculate,
        };
      } else {
        _sum_of_tax += parseFloat(obj.tax) * parseFloat(obj.qty);
      }
      return obj;
    });
    setTotalTaxAmount(_sum_of_tax);
    setItemsArr(newState);
  };

  //remove items
  const removeObjectFromArray = (itemId) => {
    setItemsArr((current) =>
      current.filter((obj) => {
        if (obj.id === itemId) {
          var _sum_of_tax = parseFloat(totalTaxAmount);
          let qty = parseInt(obj.qty);
          _sum_of_tax -= parseFloat(obj.tax * qty);
          setTotalTaxAmount(_sum_of_tax);
        }
        return obj.id !== itemId;
      })
    );
    const filteredArray = item_idsArr.filter((item) => {
      return item !== itemId;
    });
    setItemIdsArr(filteredArray);
  };

  //update Grand Total
  useEffect(() => {
    let priceArr = [];
    let qtyArr = [];
    const updateGrand = itemsArr.map((obj) => {
      priceArr.push(obj.total_price);
    });
    const updateTotalQty = itemsArr.map((obj) => {
      qtyArr.push(obj.qty);
    });

    const totalPrice = priceArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    const totalQuantity = qtyArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    // const geand_total_price = totalPrice + parseFloat(invoice?.deliveryCharge)
    setNetTotal(totalPrice);
    setTotalQty(totalQuantity);

    setGrandTotalAmount(
      deliveryCharge ? totalPrice + parseFloat(deliveryCharge) : totalPrice
    );

    // let totalCalulation = totalPrice + parseFloat(deliveryCharge);
    // setGrandTotalAmount(totalCalulation);
  }, [itemsArr, deliveryCharge]);

  // hold-data notification msg context
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHoldDataList();
    });
    return () => clearTimeout(timeout);
  }, []);

  // end hold-data notification msg
  const [loader, setLoader] = useState(false);

  const submitForm = async (reference, type) => {
    setLoader(true);
    const body = {
      action: "createHoldFoodOrder",
      ...invoice,
      items: itemsArr,
      netTotal,
      reference,
      grandTotalAmount,
      deliveryCharge,
      craetionType: type,
    };

    if (invoice.invoice_type == "Dine In" && invoice.table == null) {
      notify("error", `Select the table no`);
      handleClose();
    } else if (
      invoice.invoice_type == "Delivery" &&
      invoice.deliveryCharge == null
    ) {
      notify("error", `Enter the delivery Charge`);
      handleClose();
    } else if (
      invoice.customer_type == "hotel-customer" &&
      invoice.customer_id == null
    ) {
      notify("error", `Select the Customer`);
      handleClose();
    } else if (invoice.customer_type == "walk-in-customer" && type === "hold") {
      notify("error", `Hold is only for Hotel Customers`);
      handleClose();
    } else if (itemsArr.length == 0) {
      notify("error", `Please select the items`);
      handleClose();
    } else {
      // await http
      //   .post(
      //     `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
      //     body
      //   )
      //   .then((res) => {
      //     notify("success", "successfully Added!");
      //     // fetchHoldDataList();
      //     handleClose();
      //     setLoader(false);
      //     router.push(`/modules/restaurant/manage-order`);
      //   })
      //   .catch((e) => {
      //     setLoader(false);
      //     const msg = e.response?.data?.response;
      //     if (typeof msg == "string") {
      //       notify("error", `${msg}`);
      //     }
      //     // if (typeof (e.response?.data?.response) == 'string') {
      //     //   notify("error", `${e.response.data.response}`);
      //     // }
      //     else {
      //       if (msg?.invoice_type) {
      //         notify("error", `${msg.invoice_type.Invoice_type}`);
      //       }
      //     }
      //   });
    }
  };

  const submitPaymentForm = async (payment) => {
    const body = {
     
      ...invoice,
      ...payment,
      items: itemsArr,
      grandTotalAmount,
      action: "addSales",
      craetionType: "payment",
    }; 
    console.log("🚀 ~ submitPaymentForm ~ body:", body)
    
    if (!payment?.account) {
      notify("error", `Please Select the account`);
    } else if (itemsArr.length == 0) {
      notify("error", `Please select the items`);
      handleClose();
    } else {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/pos`,
          body
        )
        .then((res) => {
          console.log("🚀 ~ .then ~ res:", res)
          notify("success", "successfully Added!");
          handleClose();
          // router.push(`/modules/restaurant/manage-order`);
        })
        .catch((e) => {
          const msg = e.response?.data?.response;
          if (typeof e.response?.data?.response == "string") {
            notify("error", `${e.response.data.response}`);
          }
        });
    }
  };

  const [invoiceId, setInvoiceId] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const submitNetTotal = async () => {
    // const body = {
    //   ...invoice, ...netTotal
    // }

    const body = {
      ...invoice,
      account: 3,
      paid_amount: grandTotalAmount,
      items: itemsArr,
      grandTotalAmount,
      action: "createFoodOrder",
      craetionType: "payment",
    };

    // await http
    //   .post(
    //     `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
    //     body
    //   )
    //   .then((res) => {
    //     setInvoiceId(res?.data?.data);
    //     notify("success", "successfully Added!");
    //     handleClose();
    //     router.push(`/modules/restaurant/manage-order`);
    //   })
    //   .catch((e) => {
    //     const msg = e.response?.data?.response;

    //     if (typeof e.response?.data?.response == "string") {
    //       notify("error", `${e.response.data.response}`);
    //     }
    //   });
  };

  // useEffect(() => {
  //   if (invoiceId !== null) {
  //     const controller = new AbortController();

  //     // Fetching invoice items
  //     const getVoucherDetails = async () => {
  //       setLoading(true);
  //       let body = {
  //         action: "getInvoiceInfo",
  //         invoice_id: invoiceId,
  //       };
  //       try {
  //         const response = await http.post(
  //           `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
  //           body
  //         );
  //         const data = response?.data?.data;
  //         setInvoices(data);
  //         setLoading(false);

  //         // Once data is available, trigger the print action
  //         handlePrint();
  //       } catch (error) {
  //         console.log(error + <br /> + "Something went wrong!");
  //       }
  //     };

  //     getVoucherDetails();

  //     return () => controller.abort();
  //   }
  // }, [invoiceId]);

  const submitGuset = async (guest) => {
    const body = {
      ...invoice,
      ...guest,
    };
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Restaurant Invoices", link: "/modules/restaurant/food-order" },
    {
      text: "Create Invoice",
      link: "/modules/restaurant/food-order/create-inv",
    },
  ];

  /*** on Hold creation start */
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*** on Hold creation end */
  const [dueShow, setDueShow] = useState(false);
  // const [validated, setValidated] = useState(false);

  const handleDueClose = () => setDueShow(false);
  const handleDueShow = () => setDueShow(true);
  /*** on Hold creation end */
  /**on payment method */
  const [showPayment, setShowPayment] = useState(false);
  const handlePaymentClose = () => setShowPayment(false);
  const handlePaymentShow = () => setShowPayment(true);

  /*** on handleNetTotalShow method */
  const [showNetTotal, setShowNetTotal] = useState(false);
  const handleNetTotalClose = () => setShowNetTotal(false);
  const handleNetTotalShow = () => setShowNetTotal(true);

  /*** on handle Guest Show method */
  const [showGuest, setShowGuest] = useState(false);
  const handleGuestClose = () => setShowGuest(false);
  const handleGuestShow = () => setShowGuest(true);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      // Change visibility to 'visible' before printing
      componentRef.current.style.visibility = "visible";
    },
    onAfterPrint: () => {
      // Reset visibility to 'hidden' after printing
      componentRef.current.style.visibility = "hidden";
    },
  });

  const qtyStyle = {
    position: "relative",
    top: "-18px",
    height: "17px",
    backgroundColor: "#3c8dbc",
    // width: '80%',
    fontSize: "11px",
    textAlign: "start",
    padding: "0 5px",
    borderRadius: "5px",
    color: "aliceblue",
  };

  return (
    <>
      <div
        className="container-fluid "
        style={
          pathname === "/modules/restaurant/food-order/create-inv"
            ? { marginTop: "70px !important" }
            : {}
        }
      >
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <HeadSection title="Create-Invoice" />
        <div className="row">
          <div className="col-md-8 p-xs-2">
            <div className="card shadow ">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className="fw-bolder">Add new sales</strong>
                </h4>
              </div>
              <div className="card-body">
                <Form>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-1 row mt-2 ">
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Customer</Form.Label>
                            <Select2
                              options={customers?.map(
                                ({ id, first_name, last_name, mobile }) => ({
                                  value: id,
                                  label: `${first_name} ${last_name} - $${mobile}`,
                                  name: "customer_id",
                                })
                              )}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Sales Date</Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                open={openDate}
                                onClose={() => setOpenDate(false)}
                                value={selectedDate}
                                inputFormat="yyyy-MM-dd"
                                onChange={(event) => {
                                  setSelectedDate(
                                    format(new Date(event), "yyyy-MM-dd")
                                  );
                                  setInvoice((prev) => ({
                                    ...prev,
                                    inv_date: format(
                                      new Date(event),
                                      "yyyy-MM-dd"
                                    ),
                                  }));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    onClick={() => setOpenDate(true)}
                                    fullWidth={true}
                                    size="small"
                                    {...params}
                                    required
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Delivery Charge:</Form.Label>
                            <Form.Control
                              type="number"
                              name="deliveryCharge"
                              onChange={handleChange}
                              placeholder="Enter Amount"
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2 mb-3">
                    <Form.Group>
                      <hr />
                      <Form.Label>Select item</Form.Label>
                      <>
                        <Select2
                          options={fetchItems.map(
                            ({ id, item_name, sales_price, stock }) => ({
                              value: id,
                              id: id,
                              label: `${item_name} - $${sales_price} stock: [${stock}]`,
                              item_name: item_name,
                              sales_price: sales_price,
                              tax: 0,
                              taxCalculate: 0,
                              stock: stock,
                              name: "item_id",
                            })
                          )}
                          onChange={storeItems}
                        />
                      </>
                    </Form.Group>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 mt-3 table-responsive">
                      <Table striped bordered hover>
                        <thead
                          className="border-0"
                          style={{
                            backgroundColor: "#337AB7",
                            color: "#ffffff",
                          }}
                        >
                          <tr className="text-center">
                            <th className="fw-bolder p-0">Item Name</th>
                            <th className="fw-bolder p-0">Price</th>
                            <th className="fw-bolder p-0">Quantity</th>
                            <th className="fw-bolder p-0">Tax</th>
                            <th className="fw-bolder p-0">Subtotal</th>
                            <th className="fw-bolder p-0">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsArr.map((item) => (
                            <tr className="text-center">
                              <td className="p-2">{item?.item_name}</td>
                              <td className="p-2 text-end">
                                {item?.unit_price}
                              </td>
                              <td className="p-2" style={{ width: "100px" }}>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.qty}
                                    max={item?.stock ?? 1}
                                    className="form-control p-0 m-0 text-center"
                                    onChange={(e) => changeItemQty(e, item.id)}
                                    style={{
                                      padding: "0px !important",
                                      margin: "0px !important",
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="p-2 text-end">{item.tax}</td>
                              <td className="p-2 text-end">
                                {item?.total_price}
                              </td>
                              {/* <td className='p-1'>{item.remarks}</td> */}
                              <td className="p-2 text-center">
                                <Link href="#">
                                  <a
                                    onClick={() => {
                                      removeObjectFromArray(item.id);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </a>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Form>

                <div
                  className="mt-3"
                  style={{ backgroundColor: "#d2d6de", padding: "10px" }}
                >
                  <div className="row mt-2">
                    <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                      <p className="mb-3" style={{ fontWeight: "bold" }}>
                        Quantity:
                        <span
                          className="mb-2"
                          style={{ color: "#023763", fontWeight: "bold" }}
                        >
                          {" "}
                          {totalQty}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                      <p className="mb-3" style={{ fontWeight: "bold" }}>
                        Total Tax:
                        <span
                          className="mb-2"
                          style={{ color: "#023763", fontWeight: "bold" }}
                        >
                          {" "}
                          <span>
                            <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                          </span>{" "}
                          {totalTaxAmount}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                      <p className="mb-3" style={{ fontWeight: "bold" }}>
                        Net Total:
                        <span
                          className="mb-2"
                          style={{ color: "#023763", fontWeight: "bold" }}
                        >
                          {" "}
                          <span>
                            <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                          </span>{" "}
                          {netTotal && Number(netTotal).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-4">
                      <Button
                        onClick={handleShow}
                        style={{
                          width: "100%",
                          backgroundColor: "#d81b60",
                          borderColor: "#d81b60",
                        }}
                      >
                        <span className="mr-2">
                          {" "}
                          <FontAwesomeIcon icon={faHand} />{" "}
                        </span>{" "}
                        Hold
                      </Button>
                    </div>

                    <div className="col-md-4">
                      <Button
                        onClick={handlePaymentShow}
                        variant="success"
                        style={{
                          width: "100%",
                          backgroundColor: "#3c8dbc",
                          borderColor: "#367fa9",
                        }}
                      >
                        <span className="mr-2">
                          <FontAwesomeIcon icon={faCreditCard} />
                        </span>{" "}
                        Payment
                      </Button>
                    </div>
                    {/* submitNetTotal */}
                    <div className="col-md-4 d-none">
                      <Button
                        // onClick={handleNetTotalShow}
                        // onClick={handleNetTotalShow}
                        onClick={submitNetTotal}
                        // onClick={handlePrint}
                        variant="success"
                        style={{
                          width: "100%",
                          backgroundColor: "#605ca8",
                          borderColor: "#605ca8",
                        }}
                      >
                        <span className="mr-2">
                          {" "}
                          <FaFilePdf />
                        </span>
                        Net Total Amount
                        {/* <RestaurantINV ref={componentRef} id = {invoiceId} invoices={invoices} /> */}
                        <div
                          style={{
                            visibility: "hidden",
                            position: "absolute",
                            top: "-9999px",
                          }}
                        >
                          {invoiceId && (
                            <RestaurantINV
                              ref={componentRef}
                              id={invoiceId}
                              invoices={invoices}
                            />
                          )}
                        </div>
                      </Button>
                    </div>

                    <div className="col-md-4">
                      {/* <p className='mb-3' style={{ fontWeight: 'bold' }}>Grant Total:</p>
                        <p className='mb-2' style={{ color: '#023763', fontWeight: 'bold' }}> <span><FontAwesomeIcon icon={faBangladeshiTakaSign} /></span> {grandTotalAmount ? Number(grandTotalAmount).toFixed(2) : 0.00}</p> */}
                      <Button
                        onClick={handleDueShow}
                        variant="success"
                        style={{
                          width: "100%",
                          backgroundColor: "#605ca8",
                          borderColor: "#605ca8",
                        }}
                      >
                        <FontAwesomeIcon icon={faMoneyBill} /> Due
                      </Button>
                    </div>
                  </div>

                  {/* modal start */}

                  {/* Create Hold Modal Form */}
                  <Modal
                    dialogClassName=""
                    show={dueShow}
                    onHide={handleDueClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add Reference</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateDueForm
                        onSubmit={submitForm}
                        loading={loading}
                        validated={validated}
                        loader={loader}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Hold Modal Form */}

                  {/* Create Hold Modal Form */}
                  <Modal dialogClassName="" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Reference</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateHoldForm
                        onSubmit={submitForm}
                        loading={loading}
                        validated={validated}
                        loader={loader}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Hold Modal Form */}

                  {/* Create Payment Modal Form */}
                  <Modal
                    show={showPayment}
                    onHide={handlePaymentClose}
                    dialogClassName="custom-modal"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreatePaymentForm
                        onSubmit={submitPaymentForm}
                        loading={loading}
                        validated={validated}
                        totalQty={totalQty}
                        netTotal={Number(netTotal).toFixed(2)}
                        deliveryCharge={deliveryCharge}
                        grandTotalAmount={grandTotalAmount}
                      />
                    </Modal.Body>
                  </Modal>

                  {/* End Payment Modal Form */}

                  {/* Create grand total Modal Form */}
                  <Modal
                    dialogClassName=""
                    show={showNetTotal}
                    onHide={handleNetTotalClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Grand Total</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateNetTotalForm
                        onSubmit={submitNetTotal}
                        loading={loading}
                        validated={validated}
                      />
                    </Modal.Body>
                  </Modal>

                  {/* End grand total Modal Form */}

                  {/* Create CreateGuestForm Modal Form */}
                  <Modal
                    dialogClassName=""
                    show={showGuest}
                    onHide={handleGuestClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add Guest Bill</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateGuestForm
                        onSubmit={submitGuset}
                        loading={loading}
                        validated={validated}
                      />
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          {/* Select Item Section Right */}
          <div className="col-md-4 p-xs-2">
            <div className="card shadow">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className="fw-bolder">Items</strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <Form.Group className="col-md-6">
                    <Form.Label>Categories</Form.Label>
                    {catLoading ? (
                      <Select>
                        <option value="">loading...</option>
                      </Select>
                    ) : (
                      <Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        name="category_id"
                      >
                        <option value="">Select Category</option>
                        {categories &&
                          categories?.map((cat, ind) => (
                            <>
                              {cat?.children_recursive?.length != 0 ? (
                                <option value={cat.id}>{cat.name}</option>
                              ) : (
                                <option value={cat.id}>{cat.name}</option>
                              )}

                              {cat?.children_recursive?.length != 0 && (
                                <ItemSubCat cat={cat} dot="----" />
                              )}
                            </>
                          ))}
                      </Select>
                    )}
                  </Form.Group>
                  <Form.Group className="col-md-6">
                    <Form.Label>Filter</Form.Label>
                    <Form.Control
                      type="text"
                      name="search_item"
                      value={search}
                      onChange={(e) => {
                        e.preventDefault();
                        setSearch(e.target.value);
                      }}
                      placeholder="Search Name"
                    />
                  </Form.Group>
                </div>

                <div className="item-box-container ">
                  {filteredData.map((item, index) => (
                    <Fragment key={index}>
                      <div
                        className={`box-item position-relative ${
                          item_idsArr.includes(item.id)
                            ? "border-dark-info"
                            : ""
                        } `}
                        onClick={() => storeItems(item)}
                      >
                        <div style={qtyStyle}>
                          <b>Qty: {item?.stock}</b>
                        </div>
                        {item.item_image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${item.file_path}`}
                            alt="responsive"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="80px"
                            height="80px"
                            fill="none"
                          >
                            <rect width="24" height="24" fill="#f0f0f0" />
                            <path
                              d="M3 3H21V21H3V3Z"
                              stroke="#ccc"
                              stroke-width="2"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="4"
                              stroke="#ccc"
                              stroke-width="2"
                            />
                          </svg>
                        )}

                        <p>{item.item_name}</p>
                        <p>${item.sales_price}</p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInvoice;
