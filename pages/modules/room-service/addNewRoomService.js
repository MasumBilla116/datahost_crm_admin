import MyToast from '@mdrakibul8001/toastify';
import format from 'date-fns/format';
import Link from "next/link";
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { DeleteIcon, HeadSection } from "../../../components";
import Select2 from '../../../components/elements/Select2';
import Axios from '../../../utils/axios';
import ActiveCurrency from '../../../components/ActiveCurrency';


const addNewRoomService = () => {
  const { http } = Axios();
  const { notify } = MyToast();
  const router = useRouter();
  const { pathname } = router;
  const [item_idsArr, setItemIdsArr] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [mobile, setMobile] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [grandTotal, setGrandTotal] = useState(null);
  const [customerId, setCustomerId] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    mobile: '',
    first_name: '',
    last_name: '',
    cust_id: '',
    room_id: '',
    room_number: ''
  });

  //Fetch all Customers
  const [allCustomers, setAllCustomers] = useState([]);


  const AllCustomers = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomerNew"
        // action: "getAllcheckinCustomer"
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
          action: "getRoomInfoByCustomerId", cust_id: customerInfo?.cust_id
        })
        .then((res) => {
          if (isSubscribed) {
            let result = res.data?.data;
            setCustomerInfo(prev => ({ ...prev, room_id: result?.room_id, room_number: result?.room_no }));
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });

    })();

    return () => isSubscribed = false;
  }, [customerInfo?.cust_id]);

  //get all food items categories
  const [getItemCategories, setItemCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [getAllItems, setAllItems] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [foodItemInfo, setFoodItemInfo] = useState({});//single food item info by item id

  const [foodItemsArr, setFoodItemsArr] = useState([]); //array of food items

  //sum all items total price

  if (foodItemsArr?.length > 0) {

    var sumPrice = foodItemsArr.reduce(
      (sum, item) => sum + item.totalPrice, 0);
  }

  const [selectedCategory, setSelectedCategory] = useState({ value: "", label: "Select..." });
  const [selectedItem, setSelectedItem] = useState({ value: "", label: "Select..." });

  //get all food items
  const [allFoodItems, setAllFoodItems] = useState([]);


  const fetchAllFoods = useCallback(async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { action: "getAllFoodItems", get_for: "room_service" })
      .then((res) => {
        setAllFoodItems(res?.data?.data);
      })
  }, [])

  useEffect(() => {
    fetchAllFoods();
  }, [fetchAllFoods])

  //Add FoodItem into Array
  const [indexNumber, setIndexNumber] = useState(null);

  const storeFoodItems = (e) => {
    if (!item_idsArr.includes(e.value)) {
      setItemIdsArr(prev => [...prev, e.value]);
      let quantity = parseInt(1);
      let price = parseInt(e.price);
      let totalprice = parseInt((quantity * price));

      setFoodItemsArr((prev) => [...prev, {
        id: e.value,
        price: price,
        quantity: parseInt(1),
        // tax:tax,
        // taxCalculate:taxCalculate,
        totalPrice: totalprice,
        food_name: e.foodName,
      }])
    }
  }



  const changeItemQty = (e, editId) => {
    const newState = foodItemsArr.map(obj => {

      if (isNaN(e.target.value)) {
        e.target.value = 0;
      }
      if (e.target.value == "") {
        e.target.value = 0;
      }

      if (obj.id === editId) {

        let quantity = parseInt(e.target.value);
        let price = parseInt(obj.price);
        let totalprice = parseInt((quantity * price));
        return { ...obj, quantity: quantity, totalPrice: totalprice };


      }
      return obj;
    });

    setFoodItemsArr(newState);

  }

  const NoDataFound = () => (
    <tr className="no-data text-center">
      <td colSpan="6">No data Found</td>
    </tr>
  );


  //remove item from array list
  const removeItem = (removeItemId) => {
    const result = foodItemsArr?.filter((item) => {
      return item?.id !== removeItemId
    });

    setFoodItemsArr(result);
  }


  //update Grand Total
  useEffect(() => {
    let priceArr = [];
    const updateGrand = foodItemsArr.map(obj => {
      priceArr.push(obj.totalPrice);
    });

    const totalPrice = priceArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    setGrandTotal(totalPrice);

  }, [foodItemsArr]);

  //Save and redirect to invoice page
  const onSave = async () => {
    let isSubscribed = true;
    let body = {
      action: "createRoomService",
      foodItemsArr: foodItemsArr,
      customerInfo: customerInfo,
      sumPrice: sumPrice
    }

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service`, body)
      .then(res => {
        if (isSubscribed) {
          notify('success', 'room service created successfully !');
          router.push('/modules/room-service/list');
        }
      })
      .catch(e => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });

    return () => isSubscribed = false;
  }


  const inlineStyle = {
    zIndex: 100,        // Adjust the z-index as needed
    position: 'relative',
    top: '10px',        // Adjust the top position as needed
  };



  return (
    <>
      <div className="container-fluid ">
      <HeadSection title="New Room Services" />

        <div className="row">
          <div className="col-md-12">
            <div className="card shadow p-3">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className='fw-bolder'>
                    Create New Room Services
                  </strong>
                </h4>

              </div>
              <div className="card-body">
                <Form>
                  <div className='row'  >

                    <div className='mb-2 row'>
                      <Form.Group className='col-md-6'>
                        <Form.Label>Phone Number</Form.Label>

                        <Select2
                          // value={customerInfo?.mobile}
                          style={inlineStyle}
                          // className="select-bg"
                          options={allCustomers.map(({ cust_id, first_name, last_name, mobile }) => ({ cust_id: cust_id, first_name: first_name, last_name: last_name, value: mobile, label: `${first_name} - ${last_name}-${mobile}` }))}
                          // options={allCustomers.map(({ cust_id, first_name, last_name, mobile, room_no }) => ({ cust_id: cust_id, first_name: first_name, last_name: last_name, value: mobile, label: `${first_name} - ${last_name}-${mobile} - ${room_no}` }))}
                          onChange={(event, value) => {
                            setCustomerId(event.value)
                            setCustomerInfo(prev => ({
                              ...prev, mobile: event?.value, cust_id: event?.cust_id, first_name: event?.first_name, last_name: event?.last_name
                            }));
                          }}
                        />
                        {customerInfo.room_number &&
                          <div className='mt-2'>

                            <><strong>Customer Name:</strong> {customerInfo?.first_name} {customerInfo?.last_name}, <strong>Room No:</strong> {customerInfo?.room_number}</>
                          </div>
                        }
                      </Form.Group>

                      <Form.Group className='col-md-6'>
                        <Form.Label>Item Select</Form.Label>
                        <>
                          <Select2
                            style={inlineStyle}
                            //  className="select-bg"
                            options={allFoodItems.map(({ id, name, price, tax_head }) => ({ value: id, label: `${name} - ${price}`, foodName: name, price: price, tax: tax_head?.tax, name: 'food_id' }))}
                            onChange={storeFoodItems}
                          />
                        </>
                      </Form.Group>


                    </div>




                  </div>
                  {/* <div className="row mt-2 mb-3">
                
                  </div> */}
                  <div className="row" style={{ marginLeft: "1px", marginRight: "26px" }}>
                    <Table striped bordered hover>
                      <thead className='border-0' style={{ backgroundColor: "#337AB7", color: "#ffffff" }}>
                        <tr className='text-center'>
                          <th className='fw-bolder'>Item Name</th>
                          <th className='fw-bolder'>Price</th>
                          <th className='fw-bolder'>Quantity</th>
                          {/* <th className='fw-bolder'>Tax</th> */}
                          <th className='fw-bolder'>Subtotal</th>
                          {/* <th className='fw-bolder'>Remarks</th> */}
                          <th className='fw-bolder'>x</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foodItemsArr.map(item => (

                          <tr className='text-center' >
                            <td>{item?.food_name}</td>
                            <td><ActiveCurrency />{item?.price}</td>
                            <td style={{ width: "100px" }}>
                              <div className='input-group'>
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  className="form-control no-padding text-center"
                                  onChange={(e) => changeItemQty(e, item.id)}

                                />
                              </div>
                            </td>
                            <td><ActiveCurrency />{item?.totalPrice}</td>
                            <td>
                              {/* <ul className="action"> */}

                              {/* <li> */}
                              <Link href='#'>
                                <a onClick={() => { removeItem(item.id) }}>
                                  <DeleteIcon />
                                </a>
                              </Link>
                              {/* </li> */}
                              {/* </ul> */}
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </Table>

                    {!!grandTotal && <div className='text-end fw-bold mb-3 me-2'>Total Amount: <span><ActiveCurrency />{grandTotal && Number(grandTotal).toFixed(2)}</span></div>}
                    <div className="text-end">
                      <Button variant="primary" style={{ float: 'right' }} onClick={onSave}>
                        Create Invoice
                      </Button>
                    </div>

                  </div>


                </Form>
              </div>
            </div>
          </div>


        </div>
      </div >
    </>


  )
}

export default addNewRoomService;
