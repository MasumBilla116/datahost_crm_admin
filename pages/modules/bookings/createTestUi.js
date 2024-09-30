import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { Collapse, Form, Modal } from "react-bootstrap";
// import { Button, Collapse } from 'react-bootstrap';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyToast from "@mdrakibul8001/toastify";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import * as moment from 'moment';
import HeadSection from "../../../components/HeadSection";
import Select2 from "../../../components/elements/Select2";
import Axios from "../../../utils/axios";
import RadioButton from "../../../components/elements/RadioButton";
export default function create() {
  const { notify } = MyToast();

  const router = useRouter();

  const { http } = Axios();
  const [dobOpen, setDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);
  const [corporatePay, setCorporatePay] = useState(false);
  const totalAdtionalGuest = 2;
  const [open, setOpen] = useState(false);
  const [openGuest, setOpenGuest] = useState(null);
  const [hoveredGuest, setHoveredGuest] = useState(null);

  const [corporatePaymentModal, setCorporatePaymentModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [taxInfo, setTaxInfo] = useState();

  const [allCustomer, setAllCustomer] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [ind, setInd] = useState(1);
  const [roomNo, setRoomNo] = useState(1);

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
    const[account_id,setAccountId]= useState();

  const [validated, setValidated] = useState(false);



  const [customer, setCustomer] = useState({
    mobile: null,
    contact_type: "home",
    title: "",
    fName: "",
    lName: "",
    gender: "male",
    id_type: "",
    personal_id: "",
    birth_date: null,
    anniversary_date: null,
    nationality: "",

    country_id: null,
    country_name: null,
    state_id: null,
    state_name: null,
    city_id: null,
    city_name: null,

    pin_code: "",
    arrival_from: "",
    address: "",
    status: 1,
    newCustomer: false,
  });

  const getCustomerNumberList = async (e) => {
    e.preventDefault();
    const keyword = e.target.value;

    if (keyword != null && keyword.length > 3) {
      setAllCustomer([]);
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
          action: "getCustomerNumberList",
          keyword: e.target.value,
        })
        .then((res) => {
          if (res.status) {
            const result = res?.data?.data;
            setAllCustomer(result);
          }
        })
        .catch((err) => {
          console.log("Error", err.toString());
        });
    }
  };


  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAllAccounts = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
          action: "listAccounts",
        })
        .then((res) => {
          if (isSubscribed) {
            setAccounts(res.data?.data);
          }
        })
        .catch((err) => console.log(err));
    };
    fetchAllAccounts();
    return () => (isSubscribed = false);
  }, []);


  //Fetch all promo offers
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAllOffers = async () => {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`,
          {
            action: "getAllPromos",
          }
        )
        .then((res) => {
          if (isSubscribed) {
            setOffers(res.data?.data);
          }
        })
        .catch((err) => console.log(err));
    };
    fetchAllOffers();
    return () => (isSubscribed = false);
  }, []);


  /****fetching room type and categor start */
  const [roomTypes, setRoomTypes] = useState([]);
  const fetchAllRoomTypes = async () => {
    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`,
        {
          action: "allRoomTypes",
        }
      )
      .then((res) => {
        if (isSubscribed) {

          

          setRoomTypes(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (isSubscribed = false);
  };


  const [roomCategories, setRoomCategories] = useState([]);
  const RoomCategories = async () => {
    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomCategory`,
        {
          action: "allRoomCategories",
        }
      )
      .then((res) => {
        if (isSubscribed) {
          setRoomCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAllRoomTypes();
      RoomCategories();
    });
    return () => clearTimeout(timeout);
  }, []);

  /****fetching room type and categor end */

  /** Set Customer start*/
  const handleChange = (e) => {
    setCustomer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  /** Set Customer end*/

  /** Corporate Pay Start*/
  const handleCorporatePay = () => {
    setCorporatePay(true);
    setBookingGrp((prev) => ({
      ...prev,
      promo_id: null,
      promo_discount: 0,
      additional_discount: 0,
    }));
    setPromoInfo({});
    setCorporatePaymentModal(false);
  };

  const handleIndividualPay = () => {
    setCorporatePay(false);
    setCorporatePaymentModal(false);
  };
  /** Corporate Pay end*/

  /**fetching existing customer info start */

  const fetchCustomerInfo = async (mobile) => {
    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        {
          action: "customerInfo",
          mobile: mobile,
        }
      )
      .then((res) => {

        if (isSubscribed) {
          if (res.data?.data?.customer_type === 1) {
            setCorporatePaymentModal(true);
          } else {
            setCorporatePay(false);
          }

          setCustomer((prev) => ({
            ...prev,
            mobile: mobile,
            contact_type: res.data.data?.contact_type,
            title: res.data.data?.title,
            fName: res.data.data?.first_name,
            lName: res.data.data?.last_name,
            gender: res.data.data?.gender,
            id_type: res.data.data?.id_type,
            personal_id: res.data.data?.personal_id,
            birth_date: res.data.data?.dob,
            anniversary_date: res.data.data?.anniversary_date,
            nationality: res.data.data?.nationality,
            pin_code: res.data.data?.pin_code,
            arrival_from: res.data.data?.arrival_from,
            address: res.data.data?.address,
            status: res.data.data?.status,

            country_id: res.data.data?.country_id,
            country_name: res.data.data?.country_name,
            state_id: res.data.data?.state_id,
            state_name: res.data.data?.state_name,
            city_id: res.data.data?.city_id,
            city_name: res.data.data?.city_name,
          }));
        }
      })
      .catch((err) => {
        console.log("Customer fetch error: ", err.toString());
      });

    return () => (isSubscribed = false);
  };

  const setCustomerInfo = (e, value) => {
    fetchCustomerInfo(value?.value);
  };



  /****Date picker theme start */
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });
  /****Date picker theme end */

  /*** all country state city start */
  const getAllContries = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "allCountries",
      })
      .then((res) => {
        if (isSubscribed) {
          setCountryData(res.data.data);
        }
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getAllContries();
  }, []);

  const changeState = (e) => {
    if (e.value) {
      getStateList(e.value);

      setCustomer((prev) => ({
        ...prev,
        country_id: e.value,
        country_name: e.label,
      }));
    }
  };

  const getStateList = async (country_id) => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "getState",
        country_id: country_id,
      })
      .then((res) => {
        if (isSubscribed) {
          setStateData(res.data.data);
        }
      })
      .catch((err) => console.log(err));
    return () => (isSubscribed = false);
  };

  const changeCity = (e) => {
    if (e.value) {
      setCustomer((prev) => ({
        ...prev,
        state_id: e.value,
        state_name: e.label,
      }));

      // Load city as state id
      getCityList(e.value);
    }
  };

  const getCityList = async (state_id) => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "getCity",
        state_id: state_id,
      })
      .then((res) => {
        if (isSubscribed) {
          setCityData(res.data.data);
        }
      })
      .catch((err) => console.log(err));
    return () => (isSubscribed = false);
  };



  const reservationBaseData = {
    checkout_type: "24hrs",
    date_from: new Date(),
    date_to: new Date(),
    room_type_id: null,
    room_category_id: null,
    room_id: null,
    total_amount: null,
    promo_id: null,
    promo_discount: 0,
    discount_percentage: null,
    additional_discount: 0,
    total_paid: 0,
    total_tax: 20,
    net_amount: null,
    adults: 2,
    childrens: 0,
    hourly_slot_id: null,
    room_type_name: null,
  };

  const [reservationList, setReservationList] = useState([]);
  const [reservationModal, setReservationModal] = useState({ status: false, index: null, data: null });
  

  const addNewReservation = (event) => {
    event.preventDefault();
    const indx = reservationList.length;
    const newData = {
      status: true,
      index: indx + 1,
      data: indx === 0 ? reservationBaseData : (reservationList[reservationList.length - 1])
    }
    setReservationModal(newData)
  };


  const updateReservation = (e, resv, index) => {
    e.preventDefault();



    const newData = {
      status: true,
      index: index,
      data: reservationList[index]
    }
    setReservationModal(newData)
  };


  //Fetch all rooms by room types or room category
  const [allRooms, setAllRooms] = useState([])



  const getCategoryWiseRoomsList = async (categoryId) => {

    try {
      const dateFrom = reservationModal?.data?.date_from;
      const dateTo = reservationModal?.data?.date_to;

      // Check if date strings are valid
      const formattedDateFrom = dateFrom ? format(new Date(dateFrom), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const formattedDateTo = dateTo ? format(new Date(dateTo), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/tower`, {
        action: "roomsByTypesOrCategoryNew",
        room_type_id: reservationModal?.data?.room_type_id,
        room_category_id: categoryId,
        date_from: formattedDateFrom,
        date_to: formattedDateTo,
      });

      if (res.data?.data.length > 0) {
        setAllRooms(res.data?.data);
      }
    } catch (err) {
      console.log("Error fetching rooms:", err);
    }

  };


  const closeReservationModal = (event) => {
    // event.preventDefault();
    setReservationModal({ status: false, index: null, data: null })
  };



  const StoreReservationData = (e) => {
    e.preventDefault();
    const roomBookingId = reservationList.map(reservation => reservation.room_id);
    const newReservationData = reservationModal.data;

    if (roomBookingId.includes(newReservationData.room_id)) {
      notify("error", "Cannot add the same room!");
    }

    setReservationList(prevReservationList => [
      ...prevReservationList,
      newReservationData
    ]);
    closeReservationModal(e);
  };


  const handleRoomTypeChange = async (items) => {

    const dateFrom = reservationModal?.data?.date_from;
    const dateTo = reservationModal?.data?.date_to;
    const roomPriceResp = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice`, {
      action: "basePriceDetails",
      room_type_id: items.value,
      date_from: dateFrom,
      date_to: dateTo,
      checkout_type: reservationModal?.data?.checkout_type,
      hourly_slot_id: reservationModal?.data?.hourly_slot_id,
    });


    const updatedReservationModal = { ...reservationModal }; // Create a copy of the existing reservationModal

    updatedReservationModal.data = {
      ...updatedReservationModal.data,
      total_amount: roomPriceResp?.data?.data?.basePrice,
      room_type_id: items.value,
      adults: items.adults,
      childrens: items.childrens,
      room_type_name: items.label
    };

    if (items.value) {
      try {
        const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
          action: "roomTypeDetails",
          room_type_id: items.value,
        });

        const totalAmount = parseFloat(updatedReservationModal.data.total_amount); // Access total_amount from updatedReservationModal.data
        const taxPercentage = Number(res.data?.data?.tax_info?.tax);
        const tax = (totalAmount * taxPercentage) / 100;
        const total_paid = totalAmount + tax;

        updatedReservationModal.data.total_tax = tax;
        updatedReservationModal.data.total_paid = total_paid;

      } catch (err) {
        console.log("Something went wrong !");
      }
    }

    // Update the reservationModal state with the updatedReservationModal
    setReservationModal(updatedReservationModal);
  };


  const [totalAmount, setTotalAmount] = useState(0);
  const [BaseAmount, setBaseAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totaladditionalGuest, setTotaladditionalGuest] = useState(0)
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [discount, setDiscount] = useState();
  const [additionalDiscount, setAdditionalDiscount] = useState(0)
  const [totalAdultAmount, setTotalAdultAmount] = useState(0);
  const [totalChildAmount, setTotalChildAmount] = useState(0);

  // Function to calculate totals and update state
  const calculateTotals = () => {

    let totalAmountValue = 0;
    let totalTaxValue = 0;
    let adultsCount = 0;
    let childrenCount = 0;

    // Calculate total adults and children
    reservationList.forEach(reservation => {
      adultsCount += reservation.adults;
      childrenCount += reservation.childrens;

      totalAmountValue += parseFloat(reservation.total_amount);
      totalTaxValue += parseFloat(reservation.total_tax);
    });

    setTotalAdultAmount(adultsCount);
    setTotalChildAmount(childrenCount);


    // Update state with the totals
    setTotalAmount(totalAmountValue)
    setBaseAmount(totalAmountValue);
    setTotalTax(totalTaxValue);
    setGrandTotal(totalAmountValue + totalTaxValue)
    setTotaladditionalGuest(adultsCount + childrenCount - 1)
  };

  useEffect(() => {
    calculateTotals();
  }, [reservationList]);




  const handlePromoDiscount = async (promo) => {


    http.post(
      `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`,
      {
        action: "getPromoInfo",
        promo_id: promo.value,
      }
    )
      .then((res) => {

        if (res.data?.data?.promo_type === "Percentage") {
          const discountAmount = res.data?.data?.amount;
          let promoDiscountAmount = (BaseAmount * res.data?.data?.amount) / 100;
          const subTotal = BaseAmount - promoDiscountAmount;
          const grandTotal = subTotal + totalTax;

          setPromoDiscount(promoDiscountAmount)
          setDiscount(discountAmount);
          setTotalAmount(subTotal)
          setGrandTotal(grandTotal);
        }
        //calculate for flat rate
        if (res.data?.data?.promo_type === "Flat") {
          let promo_discount = 0;
          promo_discount = res.data?.data?.amount;
          setPromoDiscount(promo_discount)
          setDiscount(res.data?.data?.amount);
          setTotalAmount(totalAmount - promo_discount)
          setGrandTotal((((totalAmount - promo_discount)) + totalTax));
        }



      })
      .catch((err) => console.log(err));


  }


  // handleadditionalDiscount


  const handleadditionalDiscount = (e) => {
    let totat_discount = Number(promoDiscount) + Number(e.target.value);
    setAdditionalDiscount(Number(e.target.value))
    setTotalAmount(BaseAmount - totat_discount)
    setGrandTotal((((BaseAmount - totat_discount)) + totalTax));
  };


  const [customerGuestInfo, setCustomerGuestInfo] = useState(
    Array.from({ length: totaladditionalGuest }, () => ({
      title: "Mr",
      fName: "",
      lName: "",
      gender: "male",
      id_type: "",
      personal_id: "",
      address: "",
      birth_date: null,
    }))
  );


  // const [guestDobOpen, setGuestDobOpen] = useState(Array(totaladditionalGuest).fill(false));

  const handleChangesGuest = (index, field, value) => {
    setCustomerGuestInfo(prev => {
      const updatedGuests = [...prev];
      updatedGuests[index] = { ...updatedGuests[index], [field]: value };
      return updatedGuests;
    });
  };

  // const handleDateOfBirthChange = (index, date) => {
  //   handleChangesGuest(index, 'birth_date', date);
  //   setGuestDobOpen(prevState => {
  //     const updatedState = [...prevState];
  //     updatedState[index] = false;
  //     return updatedState;
  //   });
  // };


  async function submitForm(e) {
    e.preventDefault();
    let body = {
      ...customer,
      reservationList:reservationList,
      adults: totalChildAmount || '0',
      childs: totalChildAmount || '0',
      action: "createCustomer",
      totalAdultAmount: totalAdultAmount,
      totalChildAmount: totalChildAmount,
      corporatePay: corporatePay,
      account_id:account_id,
      total_amount:grandTotal,
      promo_discount:promoDiscount,
      additional_discount:additionalDiscount,
      total_tax:totalTax
    }


    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        body
      )
      .then((res) => {


        if (isSubscribed) {
          notify("success", `${res.data.response}`);
          document.querySelector("#customerForm").reset();
          setCorporatePay(false);
          setValidated(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        } else {
          if (msg?.mobile) {
            notify("error", `Mobile number must not be empty !`);
          }
          if (msg?.birth_date) {
            notify("error", `Please Enter Date of Birth !`);
          }

          if (msg?.country_id) {
            notify("error", `Country must not be empty!`);
          }
          if (msg?.state_id) {
            notify("error", `State must not be empty!`);
          }
          if (msg?.city_id) {
            notify("error", `City must not be empty!`);
          }
        }

        setValidated(true);
      });

  }

  return (
    <>
      <HeadSection title="Add New Booking" />

      <div className="container-fluid ">
        <Form id="customerForm" noValidate onSubmit={submitForm}>
          <h4>Add New Booking</h4>

          <div className="row">
            <div className="col-12 col-md-7">
              {/* customer info start */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <div className="d-flex border-bottom align-items-center justify-content-between mb-2">
                        <div>
                          <h4 className="card-title mb-0">Customer Info</h4>
                        </div>
                        {/* Corporate payment or individual confirmation */}
                        <Modal show={corporatePaymentModal}>
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <p>
                              How do you like to pay? <strong>Corporate</strong>{" "}
                              -or- <strong>Individual</strong>
                            </p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="outlined"
                              color="error"
                              className="shadow rounded"
                              onClick={handleCorporatePay}
                            >
                              Corporate
                            </Button>
                            <Button
                              variant="outlined"
                              color="info"
                              className="shadow rounded"
                              onClick={handleIndividualPay}
                            >
                              Individual
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        {/* Corporate payment or individual confirmation */}
                      </div>

                      <div className="row mb-2">
                        <Form.Group className="mb-2 col-4">
                          <Form.Label>
                            Mobile Number <span className="text-danger">*</span>
                          </Form.Label>

                          <Autocomplete
                            id="mobile_number"
                            freeSolo
                            value={customer?.mobile || null}
                            onChange={(e, value) => setCustomerInfo(e, value)}
                            options={allCustomer.map(
                              ({ mobile, first_name }) => ({
                                value: mobile,
                                label: `${mobile} - ${first_name}`,
                              })
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth={true}
                                size="small"
                                onChange={getCustomerNumberList}
                                required
                              />
                            )}
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-2">
                          <Form.Label>
                            Title <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="title"
                            value={customer?.title}
                            onChange={handleChange}
                            required
                          >
                            <option disabled value="">
                              Select Title
                            </option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="others">Others</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2 col-3">
                          <Form.Label>
                            First Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter First Name"
                            name="fName"
                            value={customer?.fName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-3">
                          <Form.Label>
                            Last Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Last Name"
                            name="lName"
                            value={customer?.lName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </div>

                      <div className="row mb-2">
                        <Form.Group className="col-4">
                          <div>
                            Gender <span className="text-danger">*</span>
                          </div>
                          <Form.Select
                            name="title"
                            value={customer?.gender}
                            onChange={handleChange}
                            required
                          >
                            <option disabled value="">
                              Select Title
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2 col-4">
                          <div>
                            Date of Birth <span className="text-danger">*</span>
                          </div>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              size={1}
                              label="Date of Birth"
                              open={dobOpen}
                              onClose={() => setDobOpen(false)}
                              value={customer?.birth_date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                setCustomer((prev) => ({
                                  ...prev,
                                  birth_date: event,
                                }));
                              }}
                              renderInput={(params) => (
                                <ThemeProvider theme={theme}>
                                  <TextField
                                    onClick={() => setDobOpen(true)}
                                    fullWidth={true}
                                    size="small"
                                    {...params}
                                    required
                                  />
                                </ThemeProvider>
                              )}
                            />
                          </LocalizationProvider>
                        </Form.Group>

                        <Form.Group className="mb-2 col-4">
                          <div>Anniversary Date</div>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Anniversary Date"
                              open={anniversaryOpen}
                              onClose={() => setAnniversaryOpen(false)}
                              value={customer?.anniversary_date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                setCustomer((prev) => ({
                                  ...prev,
                                  anniversary_date: event,
                                }));
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onClick={() => setAnniversaryOpen(true)}
                                  fullWidth={true}
                                  size="small"
                                  {...params}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Form.Group>
                      </div>

                      <div className="row mb-2">
                        <Form.Group className="mb-2 col-4">
                          <div>
                            Nationality <span className="text-danger">*</span>
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Enter Nationality"
                            name="nationality"
                            value={customer?.nationality}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="col-4">
                          <div>
                            ID Type <span className="text-danger">*</span>
                          </div>
                          <Form.Select
                            name="id_type"
                            value={customer?.id_type}
                            onChange={handleChange}
                            required
                          >
                            <option disabled value="">
                              Choose Option
                            </option>
                            <option value="NID">NID</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving Licence">
                              Driving Licence
                            </option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="col-4">
                          <div>
                            ID <span className="text-danger">*</span>
                          </div>
                          <Form.Control
                            type="text"
                            placeholder={
                              customer.id_type
                                ? `Enter your ${customer.id_type} number`
                                : ``
                            }
                            name="personal_id"
                            value={customer?.personal_id}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </div>

                      <div className="row mb-2">
                        <Form.Group className="mb-2 col-3">
                          <div>
                            Country <span className="text-danger">*</span>
                          </div>
                          {customer?.country_id !== null && (
                            <>
                              <Select2
                                className="select-bg"
                                options={countryData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{
                                  label: customer?.country_name,
                                  value: customer?.country_id,
                                }}
                                onChange={changeState}
                              />
                            </>
                          )}
                          {customer?.country_id === null && (
                            <>
                              <Select2
                                className="select-bg"
                                options={countryData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{ label: "Select", value: "" }}
                                onChange={changeState}
                              />
                            </>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2 col-3">
                          <div>
                            State <span className="text-danger">*</span>
                          </div>
                          {customer?.state_id !== null && (
                            <>
                              <Select2
                                options={stateData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{
                                  label: customer?.state_name,
                                  value: customer?.state_id,
                                }}
                                onChange={changeCity}
                              />
                            </>
                          )}
                          {customer?.state_id === null && (
                            <>
                              <Select2
                                options={stateData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{ label: "Select", value: "" }}
                                onChange={changeCity}
                              />
                            </>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2 col-3">
                          <div>
                            City <span className="text-danger">*</span>
                          </div>
                          {customer?.city_id !== null && (
                            <>
                              <Select2
                                options={cityData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{
                                  label: customer?.city_name,
                                  value: customer?.city_id,
                                }}
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                    city_name: e.label,
                                  }))
                                }
                              />
                            </>
                          )}

                          {customer?.city_id === null && (
                            <>
                              <Select2
                                options={cityData.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                defaultValue={{ label: "Select", value: "" }}
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                    city_name: e.label,
                                  }))
                                }
                              />
                            </>
                          )}
                        </Form.Group>
                        <Form.Group className="mb-2 col-3">
                          <div>
                            Zip Code <span className="text-danger">*</span>
                          </div>
                          <Form.Control
                            type="number"
                            placeholder="Zip Code"
                            name="pin_code"
                            value={customer?.pin_code}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </div>

                      <div className="row mb-2">
                        <Form.Group className="col-9 mb-2">
                          <Form.Label>
                            Address <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Full Address"
                            name="address"
                            value={customer?.address}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter full address.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-2 col-3">
                          <Form.Label>
                            Arrival From <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Where did come from?"
                            name="arrival_from"
                            value={customer?.arrival_from}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* customer info end */}

              {totaladditionalGuest > 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="card shadow">
                      <div className="card-body">
                        <h4 className="card-title border-bottom">
                          ADDITIONAL GUEST INFO
                        </h4>

                        {Array.from(
                          { length: totaladditionalGuest },
                          (_, index) => (
                            <div key={index}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  borderTop:
                                    index !== 0
                                      ? "1px solid rgba(128, 128, 128, 0.5)"
                                      : "none",
                                  marginTop: index !== 0 ? "4px" : "0",
                                  cursor: "pointer",
                                  // border: '1px solid #ccc',
                                  // borderRadius: '8px',
                                  backgroundColor: "#f9f9f9",
                                }}
                                onClick={() =>
                                  setOpenGuest(
                                    openGuest === index ? null : index
                                  )
                                }
                                onMouseEnter={() => setHoveredGuest(index)}
                                onMouseLeave={() => setHoveredGuest(null)}
                              >
                                <h5
                                  style={{
                                    margin: 0,
                                    marginTop: "5px",
                                    padding: "5px",
                                  }}
                                >
                                  Guest {index + 1}
                                </h5>
                                {/* <FontAwesomeIcon icon={faArrowDown} /> */}
                                <FontAwesomeIcon icon={faAngleDown} />
                              </div>

                              <Collapse in={openGuest === index}>
                                <div
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "15px",
                                    marginTop: "5px",
                                    backgroundColor: "#f9f9f9",
                                  }}
                                >
                                  <div className="row">
                                    <Form.Group className="mb-2 col-4">
                                      <Form.Label>Title</Form.Label>
                                      <Form.Select
                                        name="title"
                                        value={customerGuestInfo?.title}
                                        onChange={(e) => handleChangesGuest(index, 'title', e.target.value)}
                                        required>
                                        <option disabled value="">
                                          Select Title
                                        </option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="others">Others</option>
                                      </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-2 col-4">
                                      <Form.Label>First Name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        name="fName"
                                        value={customerGuestInfo?.fName}
                                        onChange={(e) => handleChangesGuest(index, 'fName', e.target.value)}

                                        required
                                      />
                                    </Form.Group>

                                    <Form.Group className="mb-2 col-4">
                                      <Form.Label>Last Name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        name="lName"
                                        value={customerGuestInfo?.lName}
                                        onChange={(e) => handleChangesGuest(index, 'lName', e.target.value)}

                                        required
                                      />
                                    </Form.Group>
                                  </div>

                                  <div className="row mb-3">
                                    <Form.Group className="col-6">
                                      <Form.Label>Gender </Form.Label>
                                      <div className="row">
                                        <div className="flex-gap align-items-center">
                                          <RadioButton
                                            id={`male${index}`}
                                            label="Male"
                                            name={`gender${index}`}
                                            value="male"
                                            checked={customerGuestInfo[index]?.gender === "male"}
                                            onChange={(e) => handleChangesGuest(index, 'gender', e.target.value)}
                                          />

                                          <RadioButton
                                            id={`female${index}`}
                                            label="Female"
                                            name={`gender${index}`}
                                            value="female"
                                            checked={customerGuestInfo[index]?.gender === "female"}
                                            onChange={(e) => handleChangesGuest(index, 'gender', e.target.value)}
                                          />

                                          <RadioButton
                                            id={`other${index}`}
                                            label="Other"
                                            name={`gender${index}`}
                                            value="other"
                                            checked={customerGuestInfo[index]?.gender === "other"}
                                            onChange={(e) => handleChangesGuest(index, 'gender', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    </Form.Group>
                                  </div>

                                  <div className="row">
                                    <Form.Group className="mb-2 col-6">
                                      <Form.Label>ID Type</Form.Label>
                                      <Form.Select
                                        name="id_type"
                                        required
                                        value={customerGuestInfo?.id_type}
                                        onChange={(e) => handleChangesGuest(index, 'id_type', e.target.value)}

                                      >
                                        <option disabled value="">
                                          Choose Option
                                        </option>
                                        <option value="NID">NID</option>
                                        <option value="Passport">
                                          Passport
                                        </option>
                                        <option value="Driving Licence">
                                          Driving Licence
                                        </option>
                                      </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-2 col-6">
                                      <Form.Label>ID</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="personal_id"
                                        value={customerGuestInfo?.personal_id}
                                        onChange={(e) => handleChangesGuest(index, 'personal_id', e.target.value)}

                                        required
                                      />
                                    </Form.Group>
                                  </div>
                                </div>
                              </Collapse>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-5">
              {/* ROOM DETAILS start */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="d-flex border-bottom title-part-padding align-items-center ">
                      <h4 className="card-title mb-0">
                        Check-in/Check-out Info
                      </h4>

                      {/* <button className="btn btn-primary" onClick={handleAddRoomClick}>Add Room</button> */}
                      <div className="ms-auto flex-shrink-0">
                        <button
                          className="btn btn-primary"
                          onClick={addNewReservation}
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem", marginBottom: '5px' }}
                        >Add Room
                        </button>
                      </div>

                    </div>
                    <div className="py-2 px-3">

                      {/* Your other content goes here */}


                      {reservationList && reservationList.map((reservation, index) => (
                        <Fragment key={index}>

                          <div className="mb-2 pb-2 border-bottom">
                            <table className="w-100">
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="font-weight-bold text-uppercase mb-1" style={{fontSize: '13px'}}>{reservation?.room_type_name}</div>
                                    <div className="d-flex">
                                      <div className="mr-3">
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '12px', fontWeight: 'bold' }}>From</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{moment(reservation?.date_from).format('DD-MM-YYYY')}</div>
                                      </div>
                                      <div className="">
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '12px', fontWeight: 'bold' }}>To</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{moment(reservation?.date_to).format('DD-MM-YYYY')}</div>
                                      </div>
                                      <div className="mx-3" style={{ height: '25px', width: '1px', background: '#999' }}></div>
                                      <div className="mr-3">
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '12px', fontWeight: 'bold' }}>Base Price</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{reservation?.total_amount}</div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '12px', fontWeight: 'bold' }}>Tax</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{reservation?.total_tax}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ width: '100px' }}>
                                    <div>
                                      <div className="w-100"><button onClick={e => updateReservation(e, reservation, index)} style={{ padding: '2px 5px', background: '#ddd', width: '100%', fontSize: '12px', border: 'none', fontWeight: 'bold' }}>Update</button></div>
                                      <div className="w-100"><button style={{ padding: '2px 5px', background: '#ff9696', width: '100%', fontSize: '12px', border: 'none' }}>Delete</button></div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Fragment>
                      ))}

                      <Modal
                        show={reservationModal.status}
                        onHide={closeReservationModal}
                        backdrop="static"
                        keyboard={false}
                        size="sm"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            CHECK-IN/CHECK-OUT AND ROOM INFO
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <>
                            <div className="row">
                              <Form.Group className="mb-2 col-4">
                                <div className="font-weight-bold text-uppercase">
                                  Checking System{" "}
                                  <span className="text-danger">*</span>
                                </div>
                                <Form.Select
                                  name="checkout_type"
                                  onChange={(e) =>
                                    setReservationModal(prev => ({ ...prev, data: { ...prev['data'], checkout_type: e.target.value } }))
                                  }
                                  required
                                  // isDisabled={reservationModal?.checkout_type}
                                  disabled
                                >
                                  <option disabled value="">
                                    Select Check-Out Time
                                  </option>
                                  <option value="24hrs">24 Hours</option>
                                  <option value="12pm">
                                    Fixed time (12PM)
                                  </option>
                                  <option value="hourly">Hourly</option>
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-2 col-4">
                                <div className="font-weight-bold text-uppercase">Check-IN <span className="text-danger">*</span></div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DatePicker
                                    open={checkinOpen}
                                    onClose={() => setCheckinOpen(false)}
                                    value={reservationModal?.data?.date_from}
                                    inputFormat="yyyy-MM-dd"
                                    onChange={(e) => {
                                      setReservationModal(prev => ({ ...prev, data: { ...prev['data'], date_from: e } }))
                                    }}
                                    renderInput={(params) => (
                                      <ThemeProvider theme={theme}>
                                        <TextField
                                          onClick={() => setCheckinOpen(true)}
                                          fullWidth={true}
                                          size="small"
                                          {...params}
                                          required
                                        />
                                      </ThemeProvider>
                                    )}
                                  />
                                </LocalizationProvider>
                              </Form.Group>

                              {reservationList.checkout_type !== "hourly" && (
                                <>
                                  <Form.Group className="mb-2 col-4">
                                    <div className="font-weight-bold text-uppercase">
                                      Check-Out{" "}
                                      <span className="text-danger">*</span>
                                    </div>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DatePicker
                                        open={checkoutOpen}
                                        onClose={() => setCheckoutOpen(false)}
                                        value={reservationModal?.data?.date_to}
                                        inputFormat="yyyy-MM-dd"
                                        onChange={(e) => {
                                          setReservationModal(prev => ({ ...prev, data: { ...prev['data'], date_to: e } }))
                                        }}
                                        renderInput={(params) => (
                                          <ThemeProvider theme={theme}>
                                            <TextField
                                              onClick={() =>
                                                setCheckoutOpen(true)
                                              }
                                              fullWidth={true}
                                              size="small"
                                              {...params}
                                              required
                                            />
                                          </ThemeProvider>
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </Form.Group>
                                </>
                              )}
                            </div>

                            <div className="">
                              <h6 className="border-bottom mt-3 font-weight-bold text-uppercase pb-1">Room Details</h6>
                              <div className="row">
                                <Form.Group className="mb-2 col-4">
                                  <div>
                                    Select Room Type{" "}
                                    <span className="text-danger">*</span>
                                  </div>

                                  <Select2
                                    options={roomTypes.map(
                                      (items) => ({
                                        value: items?.id,
                                        label: items?.name,
                                        adults: items?.adults,
                                        childrens: items?.childrens,
                                      })
                                    )}

                                    onChange={(items) => {
                                      // setReservationModal(prev => ({...prev, data: {...prev['data'], room_type_id: e.value, adults: e.adults, childrens: e.childrens}}));
                                      handleRoomTypeChange(items)
                                    }}
                                    required={true}
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2 col-4">
                                  <div>
                                    Select Room Category{" "}
                                    <span className="text-danger">*</span>
                                  </div>
                                  <Select2
                                    options={roomCategories.map(
                                      ({ id, name }) => ({
                                        value: id,
                                        label: name,
                                      })
                                    )}
                                    onChange={(e) => {
                                      setReservationModal(prev => ({ ...prev, data: { ...prev['data'], room_category_id: e.value } }));
                                      getCategoryWiseRoomsList(e.value)
                                    }}
                                    required={true}
                                    isDisabled={
                                      !reservationModal ||
                                      !reservationModal?.data?.room_type_id
                                    }
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2 col-4">
                                  <Form.Label style={{ marginBottom: 0 }}>
                                    Select Room Number{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  {reservationList.optionShow && (
                                    <>
                                      <Select2
                                        options={allRooms.map(
                                          ({ id, room_no }) => ({
                                            value: id,
                                            label: room_no,
                                          })
                                        )}

                                        onChange={(e) => {
                                          setReservationModal(prev => ({ ...prev, data: { ...prev['data'], room_id: e.value } }))
                                        }}
                                        isDisabled={
                                          !reservationModal ||
                                          !reservationModal?.data?.room_type_id ||
                                          !reservationModal?.data?.room_category_id
                                        }
                                        required={true}
                                        maxMenuHeight={200}
                                      />
                                    </>
                                  )}

                                  {!reservationList.optionShow && (
                                    <>
                                      <Select2
                                        options={allRooms?.map(
                                          ({ id, room_no }) => ({
                                            value: id,
                                            label: room_no,
                                          })
                                        )}
                                        onChange={(e) => {
                                          setReservationModal(prev => ({ ...prev, data: { ...prev['data'], room_id: e.value } }))
                                        }}
                                        isDisabled={
                                          !reservationModal ||
                                          !reservationModal?.data?.room_type_id ||
                                          !reservationModal?.data?.room_category_id
                                        }
                                        required={true}
                                      />
                                    </>
                                  )}
                                </Form.Group>
                              </div>
                            </div>


                            <div className="d-flex justify-content-between border-bottom mt-3 mb-2">
                              <div><h6 className="font-weight-bold mb-0 text-uppercase pb-1">Occupancy Details</h6></div>
                              <div>(Adult: {reservationModal?.data?.adults || 0}, Children: {reservationModal?.data?.childrens || 0})</div>
                            </div>
                            <div className="row">
                              <Form.Group className="mb-2 col-6">
                                <div>
                                  Number of Adults{" "}
                                  <span className="text-danger">*</span>
                                </div>
                                <Form.Control
                                  type="number"
                                  name="adults"
                                  min="0"
                                  placeholder="Enter number of adults"
                                  onChange={(e) => {
                                    setReservationModal(prev => ({ ...prev, data: { ...prev['data'], adults: e.target.value } }))
                                  }}
                                  value={reservationModal?.data?.adults}
                                  required
                                />
                              </Form.Group>

                              <Form.Group className="mb-3 col-6">
                                <div>
                                  Number of Childrens{" "}
                                  <span className="text-danger">*</span>
                                </div>
                                <Form.Control
                                  type="number"
                                  name="childs"
                                  onChange={(e) => {
                                    setReservationModal(prev => ({ ...prev, data: { ...prev['data'], childrens: e.target.value } }))
                                  }}
                                  min="0"
                                  placeholder="Enter Number of childrens"
                                  value={reservationModal?.data?.childrens}
                                  required
                                />
                              </Form.Group>
                            </div>
                          </>
                        </Modal.Body>
                        <Modal.Footer>
                          <button
                            className="btn btn-primary"
                            onClick={StoreReservationData}
                          >
                            Save Room
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>


              {/* Price Details start  */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h4 className="card-title border-bottom">Payment details</h4>

                      {corporatePay === false && (<div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>Select Discount</Form.Label>
                          <Select2
                              maxMenuHeight={175}
                              options={offers.map(({ id, name }) => ({
                                value: id,
                                label: name,
                              }))}
                              // onChange={(e) =>
                              //   setBookingGrp((prev) => ({
                              //     ...prev,
                              //     promo_id: e.value,
                              //   }))
                              // }


                              onChange={(items) => {
                                // setReservationModal(prev => ({...prev, data: {...prev['data'], room_type_id: e.value, adults: e.adults, childrens: e.childrens}}));
                                handlePromoDiscount(items)
                              }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-6">
                          <Form.Label>Additional Discount</Form.Label>
                          <Form.Control
                              type="number"
                              placeholder="Enter additional discount Amount"
                              name="additional_discount"
                              onChange={handleadditionalDiscount}
                          />
                        </Form.Group>
                      </div>)}

                      <div className="row">
                        <div className="col-md-12">
                          <div className='float-right'>
                            <div style={{ paddingRight: "20px" }}>
                              <table className='table table-price-details'>
                                <tbody>
                                  <tr style={{ borderTop: 'hidden' }}>
                                    <td>Base Price </td>
                                    <td>:</td>
                                    <td>{BaseAmount}</td>
                                  </tr>
                                  <tr style={{ borderBottom: '1px solid black', borderTop: 'hidden' }}>
                                    <td>Discount ({discount ? discount : 0}%) - (${promoDiscount} + {additionalDiscount}) </td>
                                    <td>:</td>
                                    <td>{promoDiscount + additionalDiscount}</td>
                                  </tr>

                                  <tr>
                                    <td>Sub Total</td>
                                    <td>:</td>
                                    <td>{totalAmount}</td>
                                  </tr>
                                  <tr style={{ borderTop: 'hidden', borderBottom: '1px solid black' }}>
                                    <td>Tax </td>
                                    <td>:</td>
                                    <td>{totalTax}</td>
                                  </tr>
                                  <tr>
                                    <td>Total Payable</td>
                                    <td>:</td>
                                    <td>{grandTotal}</td>
                                  </tr>

                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {corporatePay === false && (
                          <>
                            <div className="row">
                              <Form.Group className="mb-2 col-6">
                                <Form.Label>Received Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Payment Amount"
                                    name="total_paid"
                                />
                              </Form.Group>

                              <Form.Group className="mb-2 col-6">
                                <Form.Label>
                                  Deposit Account{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>

                                <Select2
                                    maxMenuHeight={140}
                                    options={accounts.map(
                                        ({ id, account_name }) => ({
                                          value: id,
                                          label: account_name,
                                        })
                                    )}
                                    onChange={(e) =>setAccountId(e.value)
                                    }

                                />

                              </Form.Group>
                            </div>
                            <div className="row">
                              <Form.Group className="mb-2 col-4">
                                <Form.Label>Reference</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Payment Reference"
                                    name="reference"
                                />
                              </Form.Group>

                              <Form.Group className="mb-2 col-8 ">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter notes..."
                                    name="remark"
                                />
                              </Form.Group>
                            </div>
                          </>
                      )}


                    </div>
                  </div>
                </div>
              </div>
              {/* Price Details end */}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="text-end ">
                <Button type="submit" variant="contained" color="primary">
                  Create New Booking
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
