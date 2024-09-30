import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { DeleteIcon } from "../../../../components";
import HeadSection from "../../../../components/HeadSection";
import Select2 from "../../../../components/elements/Select2";
import { decrypt } from "../../../../components/helpers/helper";
import Axios from "../../../../utils/axios";

const addNewRoomService = () => {
  const { http } = Axios();
  const { notify } = MyToast();
  const router = useRouter();
  const { pathname } = router;
  const [grandTotal, setGrandTotal] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [item_idsArr, setItemIdsArr] = useState([]);
  const {
    isReady,
    query: { id },
  } = router;

  //set params id
  const [invoiceId, setInvoiceId] = useState(null);
  useEffect(() => {
    if (!isReady) {
      console.log("preccessing...");
      return;
    }

    // invoiceId = decrypt(id);
    setInvoiceId(decrypt(id));
  }, [isReady]);

  const [isEdited, setIsEdited] = useState(false);
  const [mobile, setMobile] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    mobile: "",
    first_name: "",
    last_name: "",
    cust_id: "",
    room_id: "",
    room_no: "",
  });

  //Fetch all Customers
  const [allCustomers, setAllCustomers] = useState([]);

  const AllCustomers = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomerNew",
      })
      .then((res) => {
        if (isSubscribed) {
          setAllCustomers(res.data.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    AllCustomers();
  }, [AllCustomers]);

  //fetch room information
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
          action: "getRoomInfoByCustomerId",
          cust_id: customerInfo?.cust_id,
        })
        .then((res) => {
          if (isSubscribed) {
            let result = res.data?.data;
            setCustomerInfo((prev) => ({
              ...prev,
              room_id: result?.room_id,
              room_number: result?.room_no,
            }));
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    })();

    return () => (isSubscribed = false);
  }, [customerInfo?.cust_id]);

  //get all food items categories
  const [getItemCategories, setItemCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [getAllItems, setAllItems] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [foodItemInfo, setFoodItemInfo] = useState({}); //single food item info by item id

  const [foodItemsArr, setFoodItemsArr] = useState([]); //array of food items
  //fetch invoice info and items array

 
  const fetchSingleServiceInfo = useCallback(async () => {
    if (!isReady) {
      console.log("preccessing...");
      return;
    }

    const params = decrypt(id);

    let isSubscribed = true;
    let body = {
      action: "getSingleRoomServiceUpdateInfo",
      inv_id: invoiceId,
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service`,
        body
      )
      .then((res) => {
        if (isSubscribed) {
          setFoodItemsArr(res.data?.data?.inv_items_arr);
          setCustomerInfo(res.data?.data?.inv_info);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });

    return () => (isSubscribed = false);
  }, [invoiceId, isReady]);

  useEffect(() => {
    fetchSingleServiceInfo();
  }, [fetchSingleServiceInfo]);

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

  //sum all items total price

  if (foodItemsArr?.length > 0) {
    var sumPrice = foodItemsArr.reduce(
      (sum, item) => parseInt(sum) + parseInt(item.price),
      0
    );
  }

  const [selectedCategory, setSelectedCategory] = useState({
    value: "",
    label: "Select...",
  });
  const [selectedItem, setSelectedItem] = useState({
    value: "",
    label: "Select...",
  });

  //Add FoodItem into Array
  const [indexNumber, setIndexNumber] = useState(null);

  const storeFoodItems = (e) => {
    if (!item_idsArr.includes(e.value)) {
      setItemIdsArr((prev) => [...prev, e.value]);

      // if(typeof(e.tax) == 'undefined'){
      //   e.tax = 0;
      // }

      let quantity = parseInt(1);
      let price = parseInt(e.price);
      let totalprice = parseInt(quantity * price);

      setFoodItemsArr((prev) => [
        ...prev,
        {
          id: e.value,
          price: parseInt(price),
          quantity: parseInt(1),
          totalPrice: parseInt(totalprice),
          name: e.foodName,
        },
      ]);
    }
  };

  const changeItemQty = (e, editId) => {
    const newState = foodItemsArr.map((obj) => {
      if (isNaN(e.target.value)) {
        e.target.value = 0;
      }
      if (e.target.value == "") {
        e.target.value = 0;
      }

      if (obj.id === editId) {
        let quantity = parseInt(e.target.value);
        let price = parseInt(obj.price);
        let totalprice = parseInt(quantity * price);
        return { ...obj, quantity: quantity, totalPrice: totalprice };
      }
      return obj;
    });
  
    setFoodItemsArr(newState);
  };

  const NoDataFound = () => (
    <tr className="no-data text-center">
      <td colSpan="6">No data Found</td>
    </tr>
  );

  //remove item from array list
  const removeItem = (removeItemId) => {
    const result = foodItemsArr?.filter((item) => {
      return item?.id !== removeItemId;
    });

    setFoodItemsArr(result);
  };

  //update Grand Total
  useEffect(() => {
    let priceArr = [];
    const updateGrand = foodItemsArr.map((obj) => {
      priceArr.push(obj.totalPrice);
    });

    const totalPrice = priceArr.reduce((accumulator, currentValue) => {
      return parseInt(accumulator) + parseInt(currentValue);
    }, 0);

    setGrandTotal(totalPrice);
  }, [foodItemsArr]);

  useEffect(() => {
    foodItemsArr.map((item) => {
      item_idsArr.push(item.id);
    });
  }, [foodItemsArr]);

  //Save and redirect to invoice page
  const onSave = async () => {
    let isSubscribed = true;
    let body = {
      action: "updateRoomServiceNew",
      inv_id: invoiceId,
      foodItemsArr: foodItemsArr,
      customerInfo: customerInfo,
      sumPrice: sumPrice,
      grandTotal,
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service`,
        body
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "room service updated successfully !");
          router.push("/modules/room-service/list");
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });

    return () => (isSubscribed = false);
  };

  const inlineStyle = {
    zIndex: 100, // Adjust the z-index as needed
    position: "relative",
    top: "10px", // Adjust the top position as needed
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    {
      text: "All Room Services",
      link: "/modules/bookings/room-service/view-all-inv",
    },
    {
      text: "Update New Room Services",
      link: "/modules/bookings/room-service/edit/[id]",
    },
  ]; 

  return (
    <>
      <HeadSection title="Add New Room Service Invoice" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow p-3">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className="fw-bolder">Update Room Services</strong>
                </h4>
              </div>
              <div className="card-body">
                <Form>
                  <div
                    className="row" 
                  >
                    <div className="col-md-12">
                      <div className="mb-1 row">
                        <Form.Group className="col-md-6">
                          
                            {customerInfo &&<>
                              <Form.Label className="font-weight-bold">Phone Number</Form.Label>                          
                            
                             <Select2
                              value={{
                                "cust_id":customerInfo?.customer_id,
                                "first_name":  customerInfo?.first_name,
                                "last_name": customerInfo?.last_name,
                                "value": customerInfo?.mobile,
                                "label": `${customerInfo?.first_name} - ${customerInfo?.first_name}-${customerInfo?.mobile} - ${customerInfo?.room_no}`
                            }}
                              style={inlineStyle}
                              options={allCustomers.map(
                                ({
                                  cust_id,
                                  first_name,
                                  last_name,
                                  mobile,
                                  room_no,
                                }) => ({
                                  cust_id: cust_id,
                                  first_name: first_name,
                                  last_name: last_name,
                                  value: mobile,
                                  label: `${first_name} - ${last_name}-${mobile} - ${room_no}`,
                                })
                              )}
                              onChange={(event, value) => {
                                setCustomerId(event.value);
                                setCustomerInfo((prev) => ({
                                  ...prev,
                                  mobile: event?.value,
                                  cust_id: event?.cust_id,
                                  first_name: event?.first_name,
                                  last_name: event?.last_name,
                                }));
                              }}
                            /> </>}

                          {customerInfo && (
                            <p className="text-secondary" style={{fontSize:"small"}}>
                              <strong>Full Name:</strong>{" "}
                              {customerInfo?.first_name}{" "}
                              {customerInfo?.last_name}, <strong>Room:</strong>{" "}
                              {customerInfo?.room_no} ----
                              {customerInfo?.customer_id}
                            </p>
                          )}
                        </Form.Group>
                      </div>
                    </div>
                    
                  </div>
                  <div className="row mt-2 mb-3">
                    <Form.Group>
                    <hr className="mt-0"/>
                      <Form.Label className="font-weight-bold">Item Select</Form.Label>
                      <>
                        <Select2
                          style={inlineStyle}
                          options={allFoodItems?.map(
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
                          <th className="fw-bolder">Item Name</th>
                          <th className="fw-bolder">Price</th>
                          <th className="fw-bolder">Quantity</th>
                          <th className="fw-bolder">Subtotal</th>
                          <th className="fw-bolder">x</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foodItemsArr.map((item) => (
                          <tr className="text-center">
                            <td>{item?.name}</td>
                            <td>{item?.price}</td>
                            <td style={{ width: "100px" }}>
                              <div className="input-group">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  className="form-control no-padding text-center"
                                  onChange={(e) => changeItemQty(e, item.id)}
                                />
                              </div>
                            </td>
                            <td>{item?.totalPrice}</td>
                            <td>
                              <ul className="action">
                                <li>
                                  <Link href="#">
                                    <a
                                      onClick={() => {
                                        removeItem(item.id);
                                      }}
                                    >
                                      <DeleteIcon />
                                    </a>
                                  </Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {!!grandTotal && (
                      <div className="text-end fw-bold mb-3 me-2">
                        Total Amount:{" "}
                        <span>
                          {grandTotal && Number(grandTotal).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="text-end">
                      <Button
                        variant="success"
                        style={{ float: "right" }}
                        onClick={onSave}
                      >
                        Update Invoice
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default addNewRoomService;
