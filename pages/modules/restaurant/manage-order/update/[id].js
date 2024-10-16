import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select2 from "../../../../../components/elements/Select2";

import {
  faBangladeshiTakaSign,
  faCircleExclamation,
  faCreditCard,
  faHand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import { Button, Form, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { DeleteIcon, HeadSection } from "../../../../../components";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";



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


//Create Component
const CreateHoldForm = ({ onSubmit, loading, validated, id }) => {
  const [reference, setReference] = useState("");
  const { notify } = MyToast();
  const { http } = Axios();

  const basePriceInfo = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        {
          action: "getHoldDataInfo",
          id: id,
        }
      )
      .then((res) => {
        if (isSubscribed) {
          setReference(res.data?.data?.reference);
        }
      })
      .catch((err) => console.log(err));

    return () => (isSubscribed = false);
  }, [id]);

  useEffect(() => {
    basePriceInfo();
  }, [basePriceInfo]);

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
            <Form.Label>Reference:</Form.Label>
            <Form.Control
              defaultValue={reference}
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

//payment component
const CreatePaymentForm = ({
  onSubmit,
  loading,
  validated,
  totalQty,
  netTotal,
  grandTotalAmount,
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
    // totalAmount:totalAmount,
  });

  let dataset = { ...payment, totalAmount };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name == "discount") {
      if (parseFloat(e.target.value) > grandTotalAmount) {
        notify("error", `Discount can not be Bigger then main`);
      }
      setTotalAmount(grandTotalAmount - parseFloat(e.target.value));
    }
    setPayment({
      ...payment,
      [name]: value,
    });
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
                  <Form.Label>Amount:</Form.Label>
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
                <Form.Group md="10" controlId="validationCustom02">
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
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ color: "red" }}
                  >
                    Please provide a mobile number.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group>
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
              <Form.Group>
                <Form.Label>Payment note:</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  onChange={handleChange}
                  name="payment_note"
                  value={payment.payment_note}
                  placeholder="Enter Reference"
                />
              </Form.Group>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="container payment-container">
            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Total Quantity</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">{totalQty}</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Total Discount</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">{payment?.discount ?? 0.0}</p>
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
                <p>Payable</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">{netTotal}</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Total Paying</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">00</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>Total Balance</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">00</p>
              </div>
            </div>

            <div className="row justify-content-center payment-details ">
              <div className="col-md-8">
                <p>change Return</p>
              </div>

              <div className="col-md-4">
                <p className="text-end">00</p>
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
  const { notify } = MyToast();

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const [selectedOption, setSelectedOption] = useState({
    value: "hotel-customer",
    label: "Hotel Customer",
  });

  const customerType = [
    { value: "hotel-customer", label: "Hotel Customer", name: "customer_type" },
    {
      value: "walk-in-customer",
      label: "Walk In Customer",
      name: "customer_type",
    },
  ];

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [openDate, setOpenDate] = useState(false);

  const [invoice, setInvoice] = useState({
    customer_type: "hotel-customer",
    inv_date: format(new Date(), "yyyy-MM-dd"),
    customer_id: null,
    table_no: null,
    seat_capacity: null,
    customer_mobile: null,
    // customer_name: "",
    // customer_mobile: "",
    // net_total: 0,
  });

  const [tables, setTables] = useState([]);
  const [itemsArr, setItemsArr] = useState([]);
  const [item_idsArr, setItemIdsArr] = useState([]);
  const [grandTotalAmount, setGrandTotalAmount] = useState(null);
  const [totalQty, setTotalQty] = useState(null);
  const [netTotal, setNetTotal] = useState(null);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(null);

  //get all hotel customers
  const [customers, setCustomers] = useState([]);

  const getAllCustomer = useCallback(async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomer",
      })
      .then((res) => {
        setCustomers(res?.data?.data);
      });
  }, []);

  useEffect(() => {
    getAllCustomer();
  }, [getAllCustomer]);

  const getAllTables = useCallback(async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, {
        action: "getAllTables",
      })
      .then((res) => {
        setTables(res?.data?.data);
      });
  }, []);

  useEffect(() => {
    getAllTables();
  }, [getAllTables]);

  //get all food items
  const [allFoodItems, setAllFoodItems] = useState([]);

  const fetchAllFoods = useCallback(async () => {
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        { action: "getAllFoodItems" }
      )
      .then((res) => {
        setAllFoodItems(res?.data?.data);
      });
  }, []);

  useEffect(() => {
    fetchAllFoods();
  }, [fetchAllFoods]);

  //fetching all filtered food item, bydefault all
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [fetchItems, setFetchItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function getVoucherInfo() {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
          { action: "getInvoiceInfo", invoice_id: id }
        )
        .then((res) => {
          // setItemsArr(res?.data?.data?.invoice_list)
          var sum_of_tax = 0;
          var orderItemList = res?.data?.data?.invoice_list?.map(
            (row, index) => {
              const price = parseFloat(row.tax) + parseFloat(row.total_price);
              sum_of_tax += row.tax;
              return {
                ...row,
                total_price: price,
                taxCalculate: row?.tax,
              };
            }
          );
          setTotalTaxAmount(sum_of_tax);
          setItemsArr(orderItemList);
          setDeliveryCharge(res.data.data?.delivery_charge);
          setInvoice({
            ...invoice,
            table_no: res?.data?.data?.table_no,
            seat_capacity: res?.data?.data?.invoice_list[0]?.seat_capacity,
            customer_type: res.data.data?.customer_type,
            inv_date: res.data.data?.invoice_date,
            customer_id: res.data.data?.customer_id,
            customer_title: res.data.data?.customer?.title,
            customer_first_name: res.data.data?.customer?.first_name,
            customer_last_name: res.data.data?.customer?.last_name,
            customer_mobile: res.data.data?.customer?.mobile,
            invoice_type: res.data.data?.invoice_type,
            due_amount: res.data.data?.due_amount
              ? parseFloat(res.data.data.due_amount, 10)
              : null,
            deliveryCharge: res.data.data?.delivery_charge,
          });
        })
        .catch((error) => {});
    }

    getVoucherInfo();

    return () => controller.abort();
  }, [id]);

  const fetchFilteredFoods = useCallback(async () => {
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        { action: "getAllFoodItems" }
      )
      .then((res) => {
        setFetchItems(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    fetchFilteredFoods();
  }, [fetchFilteredFoods]);

  useEffect(() => {
    let controller = new AbortController();
    const result = fetchItems?.filter((item) => {
      return item?.name.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  useEffect(() => {
    let controller = new AbortController();
    const result = fetchItems?.filter((item) => {
      return item?.restaurant_category_id == categoryId;
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [categoryId]);

  const categoryList = useCallback(async () => {
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,
        { action: "getAllCategories" }
      )
      .then((res) => {
        setCategories(res?.data?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    categoryList();
  }, [categoryList]);

  //handle change
  const handleChange = (e) => {
    if (e.name === "customer_type") {
      setInvoice((prev) => ({
        ...prev,
        customer_type: e.value,
      }));

      setSelectedOption({ value: e.value, label: e.label });
    } else if (e.name === "table") {
      setInvoice((prev) => ({
        ...prev,
        table: e.value,
      }));
    } else if (e.name === "customer_id") {
      setInvoice((prev) => ({
        ...prev,
        customer_id: e.value,
      }));
    } else if (e.name === "category_id") {
      setCategoryId(e.value);
    } else if (e.target.name === "invoice_type") {
      setInvoice((prev) => ({
        ...prev,
        invoice_type: e.target.value,
      }));
    } else if (e.target.name === "deliveryCharge") {
      setDeliveryCharge(e.target.value);
    } else {
      setInvoice((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const storeFoodItems = (e) => {
    if (!item_idsArr.includes(e.value)) {
      setItemIdsArr((prev) => [...prev, e.value]);

      if (typeof e.tax == "undefined") {
        e.tax = 0;
      }

      let qty = parseFloat(1);
      let unit_price = parseFloat(e.price);
      let price = parseFloat(qty * unit_price);
      let tax = parseFloat(e.tax);
      let taxCalculate = parseFloat((price * parseFloat(e.tax)) / 100);
      let subtotal = price + taxCalculate;
      const prev_tax_amt = parseFloat(totalTaxAmount);
      const sum_of_tax = parseFloat(prev_tax_amt + qty * taxCalculate);

      setTotalTaxAmount(sum_of_tax);

      setItemsArr((prev) => [
        ...prev,
        {
          id: e.value,
          unit_price: unit_price,
          qty: parseFloat(1),
          price: price,
          tax: taxCalculate,
          taxCalculate: taxCalculate,
          total_price: subtotal,
          food_name: e.foodName,
        },
      ]);
    }
  };

  const storeItems = (item) => {
    if (!item_idsArr.includes(item.id)) {
      setItemIdsArr((prev) => [...prev, item.id]);
      let tax = 0;
      if (item?.tax_head == null) {
        tax = parseFloat(0);
      } else {
        if (typeof item?.tax_head?.tax == "undefined") {
          tax = parseFloat(0);
        } else {
          tax = parseFloat(item?.tax_head?.tax);
        }
      }

      let qty = parseFloat(1);
      let unit_price = parseFloat(item.price);
      let price = parseFloat(qty * unit_price);
      let taxCalculate = parseFloat((price * tax) / 100);
      let subtotal = price + taxCalculate;

      const prev_tax_amt = parseFloat(totalTaxAmount);
      const sum_of_tax = parseFloat(prev_tax_amt + qty * taxCalculate);
      setTotalTaxAmount(sum_of_tax);

      setItemsArr((prev) => [
        ...prev,
        {
          id: item.id,
          unit_price: unit_price,
          qty: parseFloat(1),
          price: price,
          tax: taxCalculate,
          taxCalculate: taxCalculate,
          total_price: subtotal,
          food_name: item.name,
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
      return parseFloat(accumulator) + parseFloat(currentValue);
    }, 0);
    const totalQuantity = qtyArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    setNetTotal(totalPrice);
    setTotalQty(totalQuantity);

    setGrandTotalAmount(
      deliveryCharge ? totalPrice + parseFloat(deliveryCharge) : totalPrice
    );
  }, [itemsArr, deliveryCharge]);

  useEffect(() => {
    itemsArr.map((item) => {
      item_idsArr.push(item.id);
    });
    // setInvItemIds(oldItem);
  }, [itemsArr]);

  async function submitForm(reference) {
    // e.preventDefault();

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        {
          action: "updateFoodOrder",
          invoice_id: id,
          ...invoice,
          deliveryCharge,
          reference,
          items: itemsArr,
          grandTotalAmount,
          craetionType: "hold",
        }
      )
      .then((res) => {
        notify("success", "successfully Added!");
        handleClose();
        router.push(`/modules/restaurant/manage-order`);
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });
  }

  const submitPaymentForm = async (payment) => {
    const body = {
      ...invoice,
      ...payment,
      items: itemsArr,
      grandTotalAmount,
      action: "updateFoodOrder",
      invoice_id: id,
      craetionType: "payment",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        body
      )
      .then((res) => {
        notify("success", "successfully Added!");
        handleClose();
        router.push(`/modules/restaurant/manage-order`);
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });
  };

  const submitNetTotal = async (netTotal) => {
    const body = {
      ...invoice,
      ...netTotal,
    };
  };

  const submitGuset = async (guest) => {
    const body = {
      ...invoice,
      ...guest,
    };
  };

  //breadcrumbs
  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Restaurant Invoices", link: "/modules/restaurant/food-order" },
    {
      text: "Update Invoice",
      link: "/modules/restaurant/food-order/update/[id]",
    },
  ];

  // const defaultCustomer = { value: invoice?.customer_id, label: invoice?.customer_title+ " " + invoice?.customer_first_name+ " " + invoice?.customer_last_name   };

  /*** on Hold creation start */
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  return (
    <>
      <HeadSection title="Update Purchase Invoice" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-8 ">
            <div className="card shadow p-3">
              <div className="ps-2 border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className="fw-bolder">Update Purchase Invoice</strong>
                </h4>
              </div>
              <div className="card-body">
                <Form>
                  <div
                    className="row"
                    style={{ borderBottom: "2px solid gray" }}
                  >
                    <div className="col-md-12 mb-3 p-0">
                      <div className="row">
                        <div className="col-md-7">
                          <Form.Group>
                            {/* <Form.Label>Gender <span className="text-danger">*</span></Form.Label> */}
                            <Form.Label>
                              Sales Invoice{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>

                            <div className="row">
                              <div>
                                <input
                                  type="radio"
                                  id="dineIn"
                                  name="invoice_type"
                                  checked={invoice.invoice_type === "Dine In"}
                                  onChange={handleChange}
                                  value="Dine In"
                                />
                                <label
                                  for="dineIn"
                                  className="custom-radio-label"
                                >
                                  Dine In
                                </label>

                                <input
                                  type="radio"
                                  id="takewayRadio"
                                  name="invoice_type"
                                  checked={invoice.invoice_type === "Takeway"}
                                  onChange={handleChange}
                                  value="Takeway"
                                />
                                <label
                                  for="takewayRadio"
                                  className="custom-radio-label"
                                >
                                  Takeway
                                </label>

                                <input
                                  type="radio"
                                  id="delivery"
                                  name="invoice_type"
                                  checked={invoice.invoice_type === "Delivery"}
                                  onChange={handleChange}
                                  value="Delivery"
                                />
                                <label
                                  for="delivery"
                                  className="custom-radio-label"
                                >
                                  Delivery
                                </label>
                              </div>
                            </div>
                          </Form.Group>
                        </div>

                        <div className="col-md-5">
                          {invoice.invoice_type === "Delivery" && (
                            <Form.Group>
                              <Form.Label>Delivery Charge:</Form.Label>
                              <Form.Control
                                defaultValue={invoice.deliveryCharge}
                                type="number"
                                name="deliveryCharge"
                                onChange={handleChange}
                                placeholder="Enter Amount"
                              />
                            </Form.Group>
                          )}

                          {invoice.invoice_type === "Dine In" && (
                            <Form.Group>
                              <Form.Label>Select Table: </Form.Label>
                              <Select2
                                options={tables.map(
                                  ({ id, table_no, seat_capacity }) => ({
                                    value: id,
                                    label: `Table No: ${table_no} - Seat Capacity ${seat_capacity} `,
                                    name: "table",
                                  })
                                )}
                                onChange={handleChange}
                                defaultValue={{
                                  value: invoice.table_no,
                                  label: `Table No: ${invoice.table_no} - Seat Capacity ${invoice.seat_capacity} `,
                                  name: "table",
                                }}
                              />
                            </Form.Group>
                          )}
                        </div>
                      </div>
                      <div className="row mt-2">
                        <Form.Group className="col-md-4">
                          <Form.Label>Customer Type:</Form.Label>

                          <Select2
                            options={customerType}
                            value={selectedOption}
                            onChange={handleChange}
                            isDisabled={true}
                          />
                        </Form.Group>

                        <Form.Group className="col-md-4">
                          <Form.Label>Date</Form.Label>
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
                        {invoice?.customer_type == "hotel-customer" ? (
                          <>
                            {invoice?.customer_id && (
                              <Form.Group className="col-md-4">
                                <Form.Label>Customer:</Form.Label>
                                <Select2
                                  isDisabled={true}
                                  options={customers.map(
                                    ({
                                      id,
                                      first_name,
                                      last_name,
                                      mobile,
                                    }) => ({
                                      value: id,
                                      label: `${first_name} ${last_name} - ${mobile}`,
                                      name: "customer_id",
                                    })
                                  )}
                                  onChange={handleChange}
                                  defaultValue={{
                                    value: invoice?.customer_id,
                                    label: `${invoice?.customer_first_name} ${invoice?.customer_last_name} - ${invoice?.customer_mobile}`,
                                    name: "customer_id",
                                  }}
                                  // disable
                                  // value= {invoice?.customer_id}
                                />
                              </Form.Group>
                            )}
                          </>
                        ) : (
                          <>
                            <Form.Group className="col-md-6">
                              <Form.Label>Customer:</Form.Label>
                              <Form.Control
                                type="text"
                                name="customer_name"
                                onChange={handleChange}
                                placeholder="Enter Customer Name"
                              />
                            </Form.Group>
                            <Form.Group className="col-md-6">
                              <Form.Label>Mobile Number:</Form.Label>
                              <Form.Control
                                type="number"
                                name="customer_mobile"
                                onChange={handleChange}
                                placeholder="Enter mobile number"
                              />
                            </Form.Group>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2 mb-3">
                    <Form.Group className="p-0">
                      <Form.Label>Item Select</Form.Label>
                      <>
                        <Select2
                          options={allFoodItems.map(
                            ({ id, name, price, tax_head }) => ({
                              value: id,
                              label: `${name} - $${price}`,
                              foodName: name,
                              price: price,
                              tax: tax_head?.tax,
                              name: "food_id",
                            })
                          )}
                          onChange={storeFoodItems}
                        />
                      </>
                    </Form.Group>
                  </div>
                  <div className="row">
                    <Table striped bordered hover>
                      <thead
                        className="border-0"
                        style={{ backgroundColor: "#337AB7", color: "#ffffff" }}
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
                            <td className="p-2">{item?.food_name}</td>
                            <td className="p-2 text-end">{item?.unit_price}</td>
                            <td className="p-2" style={{ width: "100px" }}>
                              <div className="input-group">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.qty}
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
                            <td className="p-2">
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
                </Form>
                <div
                  className="mt-3 row"
                  style={{ backgroundColor: "#d2d6de", padding: "10px" }}
                >
                  <div className="col-lg-4 col-xl-4 col-md-4-col-sm-12">
                    <p className="mb-3" style={{ fontWeight: "bold" }}>
                      Quantity: <span
                      className="mb-2"
                      style={{ color: "#023763", fontWeight: "bold" }}
                    >
                      {" "}
                      {totalQty}
                    </span>
                    </p>
                   
                  </div>
                  <div className="col-lg-4 col-xl-4 col-md-4-col-sm-12">
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
                        {Number(totalTaxAmount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="col-lg-4 col-xl-4 col-md-4-col-sm-12">
                    <p className="mb-3">
                      <b>Net Total:</b>{" "}
                      <span style={{ color: "#023763", fontWeight: "bold" }}>
                        <span>
                          <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                        </span>
                        {"  "}
                        {grandTotalAmount
                          ? Number(grandTotalAmount).toFixed(2)
                          : 0.0}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <Button
                      disabled={invoice?.due_amount <= 0}
                      onClick={handleShow}
                      style={{
                        width: "100%",
                        backgroundColor: "#d81b60",
                        borderColor: "#d81b60",
                      }}
                    >
                      <span className="mr-2">
                        <FontAwesomeIcon icon={faHand} />
                      </span>{" "}
                      Hold
                    </Button>
                  </div>

                  <div className="col-md-6">
                    <Button
                      disabled={invoice?.due_amount <= 0}
                      onClick={handlePaymentShow}
                      variant="success"
                      style={{
                        width: "100%",
                        backgroundColor: "#3c8dbc",
                        borderColor: "#367fa9",
                      }}
                    >
                      {/* <FontAwesomeIcon icon={faCreditCard} />Payment */}
                      <span className="mr-2">
                        {" "}
                        <FontAwesomeIcon icon={faCreditCard} />
                      </span>
                      {invoice?.due_amount <= 0 ? "Already paid" : "Payment"}
                    </Button>
                  </div>

                  <div className="col-md-4 d-none">
                    {/* <Button
                      disabled={invoice?.due_amount <= 0}
                      onClick={handleNetTotalShow}
                      variant="success"
                      style={{
                        width: "100%",
                        backgroundColor: "#605ca8",
                        borderColor: "#605ca8",
                      }}
                    >
                      <span className="mr-2">
                        <FontAwesomeIcon icon={faMoneyBill} />
                      </span>
                      Net Total Amount
                    </Button> */}
                  </div>
                  {/* modal start */}
                  {/* Create Hold Modal Form */}
                  <Modal dialogClassName="" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Reference</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateHoldForm
                        id={id}
                        onSubmit={submitForm}
                        loading={loading}
                        validated={validated}
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
          <div className="col-md-4">
            <div className="card shadow">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className="fw-bolder">Food Items</strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <Form.Group className="col-md-6">
                    <Form.Label>Categories</Form.Label>
                    <Select2
                      options={categories.map(({ id, name }) => ({
                        value: id,
                        label: name,
                        name: "category_id",
                      }))}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="col-md-6">
                    <Form.Label>Filter</Form.Label>
                    <Form.Control
                      type="text"
                      name="search_item"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Name"
                    />
                  </Form.Group>
                </div>

                <div className="item-box-container ">
                  {filteredData.map((item, index) => (
                    <Fragment key={index}>
                      <div
                        className="box-item"
                        onClick={() => storeItems(item)}
                      >
                        <img
                          src="http://hotel.api/uploads/195581-download_(4).jpeg"
                          alt="responsive"
                        />
                        <p>{item.name}</p>
                        <p>${item.price}</p>
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
