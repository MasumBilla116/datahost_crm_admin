import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import MyToast from "@mdrakibul8001/toastify";
import { format } from "date-fns";
import HeadSection from "../../../components/HeadSection";
import RadioButton from "../../../components/elements/RadioButton";
import Select2 from "../../../components/elements/Select2";
import Axios from "../../../utils/axios";

export default function create() {
  const { notify } = MyToast();

  const router = useRouter();

  const { http } = Axios();

  //calender open
  const [dobOpen, setDobOpen] = useState(false);
  // const [guestDobOpen, setGuestDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const [customer, setCustomer] = useState({
    mobile: "",
    contact_type: "",
    title: "",
    fName: "",
    lName: "",
    gender: "male",
    id_type: "",
    personal_id: "",
    birth_date: null,
    anniversary_date: null,
    nationality: "",

    country_id: "",
    state_id: "",
    city_id: "",
    countryData: [],
    stateData: [],
    cityData: [],

    pin_code: "",
    arrival_from: "",
    address: "",
    status: 1,

    custInfo: {},
    allCustomer: [],
    newCustomer: false,
  });


  const [customerGuestInfo, setCustomerGuestInfo] = useState(
    Array.from({ length: totalMember }, () => ({
      title: "Mr",
      fName: "",
      lName: "",
      gender: "male",
      id_type: "",
      personal_id: "",
      address: "",
      birth_date: null,
      age:0
    }))
  );
  // const [bookingGrp, setBookingGrp] = useState({
  //   checkout_type: "",
  //   hourly_slot_id: null,
  //   date_from: null,
  //   date_to: null,
  //   booking_grp_status: 1,

  //   total_amount: null,
  //   promo_id: null,
  //   promo_discount: 0,
  //   discount_percentage: null,
  //   additional_discount: 0,
  //   total_paid: 0,
  //   total_tax: 0,
  //   net_amount: null,
  // });

  const [bookingGrps1, setBookingGrps1] = useState([
    {
      checkout_type: "",
      date_from: null,
      date_to: null,
      room_type_id: null,
      room_category_id: null,
      room_id: null,
      total_amount: null,
      promo_id: null,
      promo_discount: 0,
      discount_percentage: null,
      additional_discount: 0,
      total_paid: 0,
      total_tax: 0,
      net_amount: null,
    }
  ]);

  const [customerBooking, setCustomerBooking] = useState({
    optionShow: true,
    room_type_id: null,
    room_category_id: null,
    room_id: "",
    adults: null,
    childs: null,
    allRooms: [],
  });

  //Fetch room tax info from tax_heads
  const [taxInfo, setTaxInfo] = useState();
  const [taxInfo1, setTaxInfo1] = useState();

  const selected_country_options = {
    value: customer?.custInfo?.country?.id || "",
    label: customer?.custInfo?.country?.name || "select...",
  };
  const selected_state_options = {
    value: customer?.custInfo?.state?.id || "",
    label: customer?.custInfo?.state?.name || "select...",
  };
  const selected_city_options = {
    value: customer?.custInfo?.city?.id || "",
    label: customer?.custInfo?.city?.name || "select...",
  };

  //Set Customer
  const handleChange = (e) => {
    setCustomer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };



  const [guestDobOpen, setGuestDobOpen] = useState(Array(totalMember).fill(false));

  // Function to handle changes for date of birth
  const handleDateOfBirthChange = (index, date) => {
    handleChangesGuest(index, 'birth_date', date);
    // Close the date picker after selecting a date
    setGuestDobOpen(prevState => {
      const updatedState = [...prevState];
      updatedState[index] = false;
      return updatedState;
    });
  };

  //Set Guest Customer
  // const handleChangesGuest = (e) => {
  //   setCustomerGuestInfo((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleChangesGuest = (index, field, value) => {
    setCustomerGuestInfo(prev => {
      const updatedGuests = [...prev];
      updatedGuests[index] = { ...updatedGuests[index], [field]: value }; 
      return updatedGuests; 
    });
  };

  //Set Customer booking group
  const ChangeCustBookingGrp = (e) => {
    // setBookingGrp((prev) => ({
    //   ...prev,
    //   [e.target.name]: e.target.value,
    // }));
  };

  //Set Customer booking days
  const ChangeCustBooking = (e) => {
    setCustomerBooking((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //Modal Open // corporate pay or not
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => {
    setShow(true);
  };

  const [corporatePay, setCorporatePay] = useState(false);

  const handleCorporatePay = () => {
    setCorporatePay(true);
    // //set empty Booking Group
    // setBookingGrp((prev) => ({
    //   ...prev,
    //   promo_id: null,
    //   promo_discount: 0,
    //   additional_discount: 0,
    // }));
    // setPromoInfo({});
    handleClose();
  };

  const handleIndividualPay = () => {
    setCorporatePay(false);
    handleClose();
  };
  //End Modal









  /********try for total start */


  /********try for total end */



  //Base Price Sum
  const [basePrice, setBasePrice] = useState(null);




  /****base price try start  */



  const [basePrices, setBasePrices] = useState({});
  const [totalBasePrice, setTotalBasePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [basePricesArray, setBasePricesArray] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);





  const totalBasePrices = basePricesArray.reduce((total, { basePrice }) => total + parseFloat(basePrice), 0);
  const aggregatedBasePrices = basePricesArray.reduce((acc, { room_type_id, basePrice, room_count }) => {
    if (!acc[room_type_id]) {
      acc[room_type_id] = { basePrice: 0, count: 0 };
    }
    acc[room_type_id].basePrice += parseFloat(basePrice);
    acc[room_type_id].count += 1;
    return acc;
  }, {});

  /****base price try end  */




  //Additional Price list
  const [priceDetailsList, setPriceDetailsList] = useState([]);
  const [totalAdultAmount, setTotalAdultAmount] = useState([]);
  const [totalChildAmount, setTotalChildAmount] = useState([]);

  //get All countries data
  const getAllContries = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "allCountries",
      })
      .then((res) => {
        if (isSubscribed) {
          setCustomer((prev) => ({
            ...prev,
            countryData: res.data.data,
          }));
        }
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getAllContries();
  }, []);

  const changeState = (e) => {
    if (e.value) {
      setCustomer((prev) => ({
        ...prev,
        country_id: e.value,
      }));
    }
  };

  const getStateById = useCallback(async () => {
    let isSubscribed = true;
    if (customer?.country_id) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getState",
          country_id: customer?.country_id,
        })
        .then((res) => {
          if (isSubscribed) {
            setCustomer((prev) => ({
              ...prev,
              stateData: res.data.data,
            }));
          }
        })
        .catch((err) => console.log(err));
    }

    return () => (isSubscribed = false);
  }, [customer?.country_id]);

  useEffect(() => {
    getStateById();
  }, [getStateById]);

  const changeCity = (e) => {
    if (e.value) {
      setCustomer((prev) => ({
        ...prev,
        state_id: e.value,
      }));
    }
  };

  const getCityById = useCallback(async () => {
    let isSubscribed = true;
    if (customer?.state_id) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getCity",
          state_id: customer?.state_id,
        })
        .then((res) => {
          if (isSubscribed) {
            setCustomer((prev) => ({
              ...prev,
              cityData: res.data.data,
            }));
          }
        })
        .catch((err) => console.log(err));
    }

    return () => (isSubscribed = false);
  }, [customer?.state_id]);

  useEffect(() => {
    getCityById();
  }, [getCityById]);

  //fetching existing customer info
  const fetchCustomerInfo = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        {
          action: "customerInfo",
          mobile: customer?.mobile,
        }
      )
      .then((res) => {
        if (isSubscribed) {
          if (res.data?.data?.customer_type === 1) {
            handleOpen();
          } else {
            setCorporatePay(false);
          }
          if (res.data.data?.country_id != null) {
            setCustomer((prev) => ({
              ...prev,
              custInfo: res.data?.data,

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
              gender: res.data.data?.gender,
              status: res.data.data?.status,

              country_id: res.data.data?.country_id,
              state_id: res.data.data?.state_id,
              city_id: res.data.data?.city_id,
            }));
          } else {
            setCustomer((prev) => ({
              ...prev,
              custInfo: {},
            }));
          }
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [customer?.mobile]);

  useEffect(() => {
    fetchCustomerInfo();
  }, [fetchCustomerInfo]);

  //All Room Types
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

  //Fetch room type details
  const [roomTypeDetails, setRoomTypeDetails] = useState({});
  const [totalMember, setTotalMember] = useState(null);

  const fetchRoomTypeDetails = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`,
        {
          action: "roomTypeDetails",
          room_type_id: customerBooking?.room_type_id,
        }
      )
      .then((res) => {
        if (isSubscribed) {
          setRoomTypeDetails(res.data?.data);
          setTaxInfo(res.data?.data?.tax_info);
          const total = res.data?.data?.adults + res.data?.data?.childrens;
          setTotalMember(total);


        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [customerBooking?.room_type_id]);

  // useEffect(() => {
  //   fetchRoomTypeDetails();
  // }, [fetchRoomTypeDetails]);

  //All Room Categories




  //Fetch all rooms by room types or room category
  const AllRoomsData = useCallback(async () => {
    let isSubscribed = true;

    // Loop through each item in bookingGrps1 array
    for (const bookingGrpItem of bookingGrps1) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/tower`,
          {
            action: "roomsByTypesOrCategoryNew",
            room_type_id: bookingGrpItem.room_type_id,
            room_category_id: bookingGrpItem.room_category_id,
            date_from: format(new Date(bookingGrpItem.date_from), "yyyy-MM-dd"),
            date_to: format(new Date(bookingGrpItem.date_to), "yyyy-MM-dd"),
          }
        )
        .then((res) => {
          if (isSubscribed) {
            setCustomerBooking((prev) => ({
              ...prev,
              allRooms: res.data?.data,
            }));
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    }

    return () => (isSubscribed = false);
  }, [bookingGrps1, setCustomerBooking]);

  useEffect(() => {
    AllRoomsData();
  }, [AllRoomsData]);


  //Fetch all Customers whose customer_type 0

  const AllCustomers = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomer",
      })
      .then((res) => {
        if (isSubscribed) {
          setCustomer((prev) => ({
            ...prev,
            allCustomer: res.data.data,
          }));
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

  //view all active hourly slots
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAllSlots = async () => {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice/hourly`,
          {
            action: "allSlotsView",
          }
        )
        .then((res) => {
          if (isSubscribed) {
            setSlots(res.data?.data);
          }
        })
        .catch((err) => console.log(err));
    };
    fetchAllSlots();
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

  //Fetch all Accounts
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

  async function submitForm(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    e.preventDefault();

    let body = {
      ...customer,
      ...bookingGrps1,
      ...customerBooking,
      customerGuestInfo,
      adults: customerBooking.adults || '0',
      childs: customerBooking.childs || '0',
      action: "createCustomer",
      totalAdultAmount: totalAdultAmount,
      totalChildAmount: totalChildAmount,
      corporatePay: corporatePay,
      tax_id: taxInfo?.id,
    };
    // return;
    let optionShow = true;
    let isSubscribed = true;
    // return;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        body
      )
      .then((res) => {
        // return;
        if (isSubscribed) {
          notify("success", `${res.data.response}`);
          // router.push('/modules/bookings/list');
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
          if (msg?.room_category_id) {
            notify("error", `Room category not be empty!`);
          }
          if (msg?.room_id) {
            notify("error", `Select room number!`);
          }
          if (msg?.hourly_slot_id) {
            notify("error", `Enter Check-out hour !`);
          }
          if (msg?.adults) {
            notify("error", `Enter no.of adults !`);
          }
          if (msg?.childs) {
            notify("error", `Enter no.of childs !`);
          }

          if (msg?.date_from) {
            notify("error", `Please enter Check-in date !`);
          }
          if (msg?.account_id) {
            notify("error", `Please Enter Payment Account !`);
          }

          // account_id
        }

        setValidated(true);
      });

    return () => (isSubscribed = false);
  }

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  const clearForm = () => {
    setCustomer((prev) => ({
      ...prev,

      contact_type: "",
      title: "",
      fName: "",
      lName: "",
      gender: "male",
      birth_date: null,
      anniversary_date: null,
      nationality: "",

      country_id: "",
      state_id: "",
      city_id: "",

      pin_code: "",
      arrival_from: "",
      address: "",
      status: 1,

      custInfo: {},
      newCustomer: true,
    }));
  };



  // const [checkinOpen1, setCheckinOpen1] = useState(Array(bookingGrps1.length).fill(false));
  const [checkinOpen1, setCheckinOpen1] = useState(Array.from({ length: bookingGrps1.length }).fill(false));
  const [checkoutOpen1, setCheckoutOpen1] = useState(Array.from({ length: bookingGrps1.length }).fill(false));

  const addRow = () => {
    setBookingGrps1([
      ...bookingGrps1,
      { ...bookingGrps1[0] }
    ]);
  };

  const removeRow = (index) => {
    const updatedBookingGrps = [...bookingGrps1];
    updatedBookingGrps.splice(index, 1);
    setBookingGrps1(updatedBookingGrps);
  };





  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedBookingGrps = [...bookingGrps1];
    if (name === 'room_type_id' || name === 'room_category_id' || name === 'room_id') {
      if (value !== null && name === 'room_id' && updatedBookingGrps.some(booking => booking.room_id === value && booking !== updatedBookingGrps[index])) {
        notify("error", `Same room already assigned`);
        return;
      }
      updatedBookingGrps[index][name] = value;
    } else {
      updatedBookingGrps[index][name] = value;
    }
    setBookingGrps1(updatedBookingGrps);
  };


  const handleRoomTypeChange = async (roomTypeId, index) => {


    const dateFrom = bookingGrps1[index].date_from;
    const dateTo = bookingGrps1[index].date_to;


    const roomPriceResp = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice`, {
      action: "basePriceDetails",
      room_type_id: roomTypeId,
      date_from: dateFrom,
      date_to: dateTo,
      checkout_type: bookingGrps1[index].checkout_type,
      hourly_slot_id: bookingGrps1[index].hourly_slot_id,
    });

    bookingGrps1[index]['total_amount'] = roomPriceResp?.data?.data.basePrice;
    bookingGrps1[index]['room_type_id'] = roomTypeId;
    if (roomTypeId) {
      try {
        const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
          action: "roomTypeDetails",
          room_type_id: roomTypeId,
        });
        const totalAmount = parseFloat(bookingGrps1[index]['total_amount']);
        const taxPercentage = Number(res.data?.data?.tax_info?.tax);
        const tax = (totalAmount * taxPercentage) / 100;
        const total_paid = totalAmount + tax;
        bookingGrps1[index]['total_tax'] = tax;
        bookingGrps1[index]['total_paid'] = total_paid;
      } catch (err) {
        console.log("Something went wrong !");
      }

    }
  }


  const handleDateChange = (date, index, field) => {

    const updatedBookingGrps = [...bookingGrps1];
    updatedBookingGrps[index][field] = date.toISOString();
    setBookingGrps1(updatedBookingGrps);
  };





  /************************try for total number adult and child*************** */
  //Fetch room type details
  const [roomTypeDetails1, setRoomTypeDetails1] = useState({});
  const [totalAdults, setTotalAdults] = useState(0);
  const [totalChildrens, setTotalChildrens] = useState(0);
  const [totalAdtionalGuest, setTotalAdtionalGuest] = useState(0);
  const [total_tax_cal, setTotal_tax_cal] = useState(0);


  const fetchRoomTypeDetails1 = useCallback(async (roomTypeId) => {
    if (!roomTypeId) return;

    try {
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
        action: "roomTypeDetails",
        room_type_id: roomTypeId,
      });



      setRoomTypeDetails1(prevRoomTypeDetails => ({
        ...prevRoomTypeDetails,
        [roomTypeId]: res.data?.data,
      }));
      // const taxInfoArray = Object.values(roomTypeDetails1).map(room => room.tax_info);

      // console.log(taxInfoArray);
    } catch (err) {
      console.log("Something went wrong !");
    }
  }, [bookingGrps1]);


  useEffect(() => {
    if (bookingGrps1.length > 0) {
      bookingGrps1.forEach((bookingGrp) => {
        fetchRoomTypeDetails1(bookingGrp.room_type_id);
      });
    }
  }, [bookingGrps1, fetchRoomTypeDetails1]);


  const [totalRoomType, setTotalRoomType] = useState([]);
  useEffect(() => {
    if (bookingGrps1.length > 0) {
      // Count occurrences of each room_type_id
      const roomTypeCount = bookingGrps1.reduce((acc, booking) => {
        acc[booking.room_type_id] = (acc[booking.room_type_id] || 0) + 1;
        return acc;
      }, {});

      // Create an array to store room type details based on bookingGrps1
      const totalRoomTypeArray = [];
      Object.entries(roomTypeCount).forEach(([roomTypeId, count]) => {
        // Find room type details from roomTypeDetails1
        const roomTypeDetail = roomTypeDetails1[roomTypeId];
        if (roomTypeDetail) {
          // Push room type details according to count
          for (let i = 0; i < count; i++) {
            totalRoomTypeArray.push(roomTypeDetail);
          }
        }
      });
      setTotalRoomType(totalRoomTypeArray);
    }
  }, [bookingGrps1, roomTypeDetails1]);




  useEffect(() => {
    // Calculate total adults and childrens
    let totalAdultsCount = 0;
    let totalChildrensCount = 0;
    let totalTaxValue = 0;

    totalRoomType.forEach((roomType) => {
      totalAdultsCount += roomType.adults || 0;
      totalChildrensCount += roomType.childrens || 0;
      totalTaxValue += roomType.tax_info.tax || 0;
    });

    // Update state with total counts
    setTotalAdults(totalAdultsCount);
    setTotalChildrens(totalChildrensCount);
    setTotalAdtionalGuest(totalAdultsCount + totalChildrensCount - 1);
    setTotal_tax_cal(totalTaxValue);
  }, [totalRoomType]);






  // Add dependencies here








  /************************try for total number adult and child*************** */

  return (
    <>
      <HeadSection title="Add New Booking" />

      <div className="container-fluid ">
        <Form
          onSubmit={submitForm}
          id="customerForm"
          noValidate
          validated={validated}
        >
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
                        <Modal show={show} onHide={handleClose}>
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

                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            Mobile Number <span className="text-danger">*</span>
                          </Form.Label>

                          <Autocomplete
                            id="mobile_number"
                            freeSolo
                            value={customer?.mobile || null}
                            onChange={(event, value) => {
                              setCustomer((prev) => ({
                                ...prev,
                                mobile: value?.value,
                              }));
                            }}
                            options={customer?.allCustomer.map(
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
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    mobile: e.target.value,
                                  }))
                                }
                                required
                              />
                            )}
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            Contact Type <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="contact_type"
                            value={customer?.contact_type}
                            onChange={handleChange}
                            required
                          >
                            <option disabled value="">
                              Select Contact Type
                            </option>
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group className="mb-2 col-4">
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

                        <Form.Group className="mb-2 col-4">
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

                        <Form.Group className="mb-2 col-4">
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

                      <div className="row mb-3">
                        <Form.Group className="col-4">
                          <Form.Label>
                            Gender <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="row">
                            <div className="flex-gap align-items-center">
                              <RadioButton
                                id="male"
                                label="Male"
                                name="gender"
                                value="male"
                                checked={customer?.gender == "male"}
                                onChange={handleChange}
                              />

                              <RadioButton
                                id="female"
                                label="Female"
                                name="gender"
                                value="female"
                                checked={customer?.gender == "female"}
                                onChange={handleChange}
                              />

                              <RadioButton
                                id="other"
                                label="Other"
                                name="gender"
                                value="other"
                                checked={customer?.gender == "other"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </Form.Group>

                        <Form.Group className="col-4">
                          <Form.Label>
                            ID Type <span className="text-danger">*</span>
                          </Form.Label>
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
                          <Form.Label>
                            ID <span className="text-danger">*</span>
                          </Form.Label>
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
                        <Form.Group className="mb-2 col-6">
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

                        <Form.Group className="mb-2 col-6">
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

                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            Nationality <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Nationality"
                            name="nationality"
                            value={customer?.nationality}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        {/* Show country or selected country */}
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            Country <span className="text-danger">*</span>
                          </Form.Label>
                          {customer?.custInfo?.country?.id !== undefined && (
                            <>
                              <Select2
                                className="select-bg"
                                options={customer.countryData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                defaultValue={selected_country_options}
                                onChange={changeState}
                              />
                            </>
                          )}
                          {customer?.custInfo?.country?.id === undefined && (
                            <>
                              <Select2
                                className="select-bg"
                                options={customer.countryData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeState}
                              />
                            </>
                          )}
                        </Form.Group>
                      </div>

                      {/* show state city or selected */}
                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            State <span className="text-danger">*</span>
                          </Form.Label>
                          {customer?.custInfo?.state?.id && (
                            <>
                              <Select2
                                options={customer.stateData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                defaultValue={selected_state_options}
                                onChange={changeCity}
                              />
                            </>
                          )}
                          {customer?.custInfo?.state?.id === undefined && (
                            <>
                              <Select2
                                options={customer.stateData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeCity}
                              />
                            </>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            City <span className="text-danger">*</span>
                          </Form.Label>
                          {customer?.custInfo?.city?.id && (
                            <>
                              <Select2
                                options={customer.cityData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                defaultValue={selected_city_options}
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                  }))
                                }
                              />
                            </>
                          )}

                          {customer?.custInfo?.city?.id === undefined && (
                            <>
                              <Select2
                                options={customer.cityData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                  }))
                                }
                              />
                            </>
                          )}
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>
                            Pin Code <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Pin Code"
                            name="pin_code"
                            value={customer?.pin_code}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-6">
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

                      <Form.Group className="mb-2">
                        <Form.Label>
                          Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
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
                    </div>
                  </div>
                </div>
              </div>
              {/* customer info end */}

              {totalAdtionalGuest > 0 && <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h4 className="card-title border-bottom">
                        ADDITIONAL GUEST INFO
                      </h4>

                      {Array.from({ length: totalAdtionalGuest }, (_, index) => (

                        <div key={index} >
                          <div key={index} className="guest-container" style={{ borderTop: index !== 0 ? '1px solid rgba(128, 128, 128, 0.5)' : 'none', marginTop: index !== 0 ? '4px' : '0' }}>

                            <h3>Guest {index + 1}</h3>
                            <div className="row">
                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  Title <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                  name="title"
                                  value={customerGuestInfo?.title}
                                  // onChange={handleChangesGuest}
                                  onChange={(e) => handleChangesGuest(index, 'title', e.target.value)}
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

                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  First Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter First Name"
                                  name="fName"
                                  value={customerGuestInfo?.fName}
                                  // onChange={handleChangesGuest}
                                  onChange={(e) => handleChangesGuest(index, 'fName', e.target.value)}
                                  required
                                />
                              </Form.Group>

                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  Last Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Last Name"
                                  name="lName"
                                  value={customerGuestInfo?.lName}
                                  // onChange={handleChangesGuest}
                                  onChange={(e) => handleChangesGuest(index, 'lName', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </div>
                          </div>


                          <div className="row mb-3">
                            <Form.Group className="col-6">
                              <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
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

                            <Form.Group className="col-6">
                              <Form.Label>Date of Birth<span className="text-danger">*</span></Form.Label>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  size={1}
                                  label="Date of Birth"
                                  open={guestDobOpen[index]}
                                  onClose={() => setGuestDobOpen(prevState => {
                                    const updatedState = [...prevState];
                                    updatedState[index] = false;
                                    return updatedState;
                                  })}
                                  value={customerGuestInfo[index]?.birth_date}
                                  inputFormat="yyyy-MM-dd"
                                  onChange={(date) => handleDateOfBirthChange(index, date)}
                                  renderInput={(params) => (
                                    <ThemeProvider theme={theme}>
                                      <TextField
                                        onClick={() => setGuestDobOpen(prevState => {
                                          const updatedState = [...prevState];
                                          updatedState[index] = true;
                                          return updatedState;
                                        })}
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


                          </div>

                          <div className="row">
                            <Form.Group className="mb-2 col-6">
                              <Form.Label>
                                ID Type <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                name="id_type"
                                value={customerGuestInfo?.id_type}
                                // onChange={handleChangesGuest}
                                onChange={(e) => handleChangesGuest(index, 'id_type', e.target.value)}
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

                            <Form.Group className="mb-2 col-6">
                              <Form.Label>
                                ID <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={
                                  customerGuestInfo.id_type
                                    ? `Enter your ${customerGuestInfo.id_type} number`
                                    : ``
                                }
                                name="personal_id"
                                value={customerGuestInfo?.personal_id}
                                // onChange={handleChangesGuest}
                                onChange={(e) => handleChangesGuest(index, 'personal_id', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>



                      ))}
                    </div>
                  </div>
                </div>
              </div>}



            </div>
            <div className="col-12 col-md-5">
              {/* ROOM DETAILS start */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <div className="mt-1">
                        <h4 className="card-title border-bottom">
                          Check-in/Check-out Info
                        </h4>
                      </div>
                      {bookingGrps1.map((bookingGrp, index) => (
                        <>
                          {index > 0 && ( // Conditionally render remove button for index > 0
                            <h4 className="card-title border-bottom">
                              Room - {index + 1}
                            </h4>
                          )}
                          <div className="row">
                            <Form.Group className="mb-3 col-4">
                              <Form.Label>
                                Checking System{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                value={bookingGrps1[index].checkout_type}
                                name="checkout_type"
                                onChange={(event) => handleInputChange(event, index)}
                                required
                              >
                                <option disabled value="">
                                  Select Check-Out Time
                                </option>
                                <option value="24hrs">24 Hours</option>
                                <option value="12pm">Fixed time (12PM)</option>
                                <option value="hourly">Hourly</option>
                              </Form.Select>
                            </Form.Group>
                            {bookingGrps1[index].checkout_type &&
                              bookingGrps1[index].checkout_type === "hourly" ? (
                              <>
                                <Form.Group className="mb-3 col-4">
                                  <Form.Label>
                                    Set Hours <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Select
                                    value={bookingGrps1[index].hourly_slot_id}
                                    name="hourly_slot_id"
                                    onChange={(event) => handleInputChange(event, index)}
                                    required
                                  >
                                    <option disabled value="">
                                      Select Check-Out Time
                                    </option>
                                    {slots &&
                                      slots.map((slot, index) => (
                                        <Fragment key={index}>
                                          <option value={slot?.id}>
                                            {slot?.hour}
                                          </option>
                                        </Fragment>
                                      ))}
                                  </Form.Select>
                                </Form.Group>
                              </>
                            ) : (
                              <></>
                            )}
                            <Form.Group className="mb-2 col-4">
                              <Form.Label>
                                Check-IN-Time <span className="text-danger">*</span>
                              </Form.Label>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  label="Check-in"
                                  open={checkinOpen1[index]}
                                  onClose={() => setCheckinOpen1(openStates => openStates.map((openState, idx) => idx === index ? false : openState))}
                                  onOpen={() => setCheckinOpen1(openStates => openStates.map((openState, idx) => idx === index ? true : openState))}
                                  // value={bookingGrp?.date_from}
                                  value={bookingGrps1[index].date_from}
                                  inputFormat="yyyy-MM-dd"
                                  // onChange={(date) => handleDateChange(date, index)}
                                  onChange={(date) => handleDateChange(date, index, 'date_from')}

                                  renderInput={(params) => (
                                    <ThemeProvider theme={theme}>
                                      <TextField
                                        onClick={() => setCheckinOpen1(openStates => openStates.map((openState, idx) => idx === index ? true : openState))}
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

                            {bookingGrps1[index].checkout_type !== "hourly" && (
                              <>
                                {/* <Form.Group className="mb-2 col-4">
                                  <Form.Label>
                                    Check-Out-Time{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DatePicker
                                      label="Check-Out"
                                      open={checkoutOpen}
                                      onClose={() => setCheckoutOpen(false)}
                                      value={bookingGrp?.date_to}
                                      inputFormat="yyyy-MM-dd"
                                      onChange={(event) => {
                                        setBookingGrp((prev) => ({
                                          ...prev,
                                          date_to: event,
                                        }));
                                      }}
                                      renderInput={(params) => (
                                        <ThemeProvider theme={theme}>
                                          <TextField
                                            onClick={() => setCheckoutOpen(true)}
                                            fullWidth={true}
                                            size="small"
                                            {...params}
                                            required
                                          />
                                        </ThemeProvider>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Form.Group> */}


                                <Form.Group className="mb-2 col-4">
                                  <Form.Label>
                                    Check-OUT-Time <span className="text-danger">*</span>
                                  </Form.Label>
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                      label="Check-Out"
                                      open={checkoutOpen1[index]}
                                      onClose={() => setCheckoutOpen1(openStates => openStates.map((openState, idx) => idx === index ? false : openState))}
                                      onOpen={() => setCheckoutOpen1(openStates => openStates.map((openState, idx) => idx === index ? true : openState))}
                                      // value={bookingGrp?.date_from}
                                      value={bookingGrps1[index].date_to}
                                      inputFormat="yyyy-MM-dd"
                                      // onChange={(date) => handleDateChange(date, index)}
                                      onChange={(date) => handleDateChange(date, index, 'date_to')}
                                      renderInput={(params) => (
                                        <ThemeProvider theme={theme}>
                                          <TextField
                                            onClick={() => setCheckoutOpen1(openStates => openStates.map((openState, idx) => idx === index ? true : openState))}
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
                            <h4 className="card-title border-bottom">
                              Room Details
                            </h4>
                            <div className="row">
                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  Select Room Type <span className="text-danger">*</span>
                                </Form.Label>
                                {customerBooking.optionShow &&
                                  <Select2
                                    options={roomTypes.map(({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    }))}
                                    onChange={(e) =>
                                      handleRoomTypeChange(e.value, index)
                                    }
                                    isDisabled={
                                      !bookingGrp ||
                                      !bookingGrp.date_from ||
                                      !bookingGrp.date_to
                                    }
                                    required={true}
                                  />}

                                {!customerBooking.optionShow && (
                                  <>
                                    <Select2
                                      options={roomTypes.map(({ id, name }) => ({
                                        value: id,
                                        label: name,
                                      }))}
                                      onChange={(e) =>
                                        handleRoomTypeChange(e.value, index)
                                      }
                                      required={true}
                                      isDisabled={
                                        !bookingGrp ||
                                        !bookingGrp.date_from ||
                                        !bookingGrp.date_to
                                      }
                                    />
                                  </>
                                )}
                              </Form.Group>

                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  Select Room Category <span className="text-danger">*</span>
                                </Form.Label>
                                {customerBooking.optionShow ? (
                                  <Select2
                                    options={roomCategories.map(({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    }))}
                                    onChange={(e) =>
                                      handleInputChange(
                                        { target: { name: "room_category_id", value: e.value } },
                                        index
                                      )
                                    }
                                    required={true}
                                    isDisabled={
                                      !bookingGrp ||
                                      !bookingGrp.date_from ||
                                      !bookingGrp.date_to
                                    }
                                  />
                                ) : (
                                  <Select2
                                    options={roomCategories.map(({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    }))}
                                    onChange={(e) =>
                                      handleInputChange(
                                        { target: { name: "room_category_id", value: e.value } },
                                        index
                                      )
                                    }
                                    required={true}
                                    isDisabled={
                                      !bookingGrp ||
                                      !bookingGrp.date_from ||
                                      !bookingGrp.date_to
                                    }
                                  />
                                )}
                              </Form.Group>


                              <Form.Group className="mb-2 col-4">
                                <Form.Label>
                                  Select Room Number{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                {customerBooking.optionShow && (
                                  <>
                                    <Select2
                                      options={customerBooking?.allRooms?.map(
                                        ({ id, room_no }) => ({
                                          value: id,
                                          label: room_no,
                                        })
                                      )}
                                      onChange={(e) =>
                                        handleInputChange(
                                          { target: { name: "room_id", value: e.value } },
                                          index
                                        )
                                      }
                                      isDisabled={
                                        !bookingGrp ||
                                        !bookingGrp.date_from ||
                                        !bookingGrp.date_to
                                      }
                                      required={true}
                                      maxMenuHeight={200}
                                    />
                                  </>
                                )}


                                {!customerBooking.optionShow && (
                                  <>
                                    <Select2
                                      options={customerBooking?.allRooms?.map(
                                        ({ id, room_no }) => ({
                                          value: id,
                                          label: room_no,
                                        })
                                      )}
                                      onChange={(e) =>
                                        handleInputChange(
                                          { target: { name: "room_id", value: e.value } },
                                          index
                                        )
                                      }
                                      isDisabled={
                                        !bookingGrp ||
                                        !bookingGrp.date_from ||
                                        !bookingGrp.date_to
                                      }
                                      required={true}
                                    />
                                  </>
                                )}

                              </Form.Group>
                            </div>
                          </div>

                          <h4 className="card-title border-bottom mt-2">
                            Guest Info
                          </h4>
                          <div className="row">
                            <Form.Group className="mb-2 col-6">
                              <Form.Label>
                                Number of Adults{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name="adults"
                                min="0"
                                value={customerBooking?.adults}
                                placeholder="Enter number of adults"
                                onChange={(event) => handleInputChange(event, index)}
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3 col-6">
                              <Form.Label>
                                Number of Childrens{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name="childs"
                                min="0"
                                value={customerBooking?.childs}
                                placeholder="Enter Number of childrens"
                                onChange={(event) => handleInputChange(event, index)}
                                required
                              />
                            </Form.Group>

                            <p>
                              {roomTypeDetails1[bookingGrp.room_type_id] && roomTypeDetails1[bookingGrp.room_type_id].adults !== undefined && roomTypeDetails1[bookingGrp.room_type_id].childrens !== undefined
                                ? `Guests included in base price: Adult-${roomTypeDetails1[bookingGrp.room_type_id].adults}, Child-${roomTypeDetails1[bookingGrp.room_type_id].childrens}`
                                : 'Loading...'}
                            </p>
                          </div>
                          {/* <button className="btn btn-danger" onClick={() => removeRow(index)}>
                            Remove Row
                          </button> */}

                          {/* {index > 0 && ( 
                            <button className="btn btn-danger" onClick={() => removeRow(index)}>
                              Remove
                            </button>
                          )} */}
                          <button className="btn btn-danger" onClick={() => removeRow(index)}>
                            Remove
                          </button>
                        </>

                      ))}

                      <button className="btn btn-primary" onClick={addRow}>
                        Add More
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Info Start */}
              {corporatePay === false && (
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="card shadow">
                        <div className="card-body">
                          <h4 className="card-title border-bottom">
                            Payment Info
                          </h4>

                          <div className="row">
                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Select Discount</Form.Label>
                              <Select2
                                maxMenuHeight={175}
                                options={offers.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))}
                                onChange={(e) =>
                                  setBookingGrp((prev) => ({
                                    ...prev,
                                    promo_id: e.value,
                                  }))
                                }
                              />
                            </Form.Group>

                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Additional Discount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter additional discount Amount"
                                name="additional_discount"
                                // defaultValue={bookingGrp?.additional_discount}
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>
                          </div>

                          <div className="row">
                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Payment Amount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter Payment Amount"
                                // value={bookingGrp?.total_paid}
                                name="total_paid"
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>

                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Payment Account <span className="text-danger">*</span></Form.Label>

                              <Select2
                                maxMenuHeight={140}
                                options={accounts.map(
                                  ({ id, account_name }) => ({
                                    value: id,
                                    label: account_name,
                                  })
                                )}
                                onChange={(e) =>
                                  setCustomerBooking((prev) => ({
                                    ...prev,
                                    account_id: e.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </div>
                          <div className="row">
                            <Form.Group className="mb-2 col-4">
                              <Form.Label>Payment Reference</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Payment Reference"
                                name="reference"
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>

                            <Form.Group className="mb-2 col-8 ">
                              <Form.Label>Payment Remarks</Form.Label>
                              <Form.Control
                                type="text"
                                // rows="3"
                                placeholder="Enter Comments..."
                                name="remark"
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}


              {/* <div className="col-12 col-md-7"></div> */}

              {/* Price Details start  */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h4 className="card-title border-bottom">
                        Price details
                      </h4>

                      <table className="table table-bordered">
                        <tbody>
                          {Object.entries(aggregatedBasePrices).map(([room_type_id, { basePrice, count }]) => {
                            const roomBasePrice = basePricesArray.find(item => item.room_type_id === room_type_id)?.basePrice;
                            return (
                              <tr key={room_type_id}>
                                <td>Room Type-{room_type_id} - Main Base Price: ${roomBasePrice}</td>
                                {/* <td>{`${count} room${count > 1 ? 's' : ''}`}</td> */}
                                <td>${basePrice.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td>Total Base Price</td>
                            <td colSpan="1">${totalBasePrices.toFixed(2)}</td>
                          </tr>
                          {priceDetailsList?.map((price, index) => (
                            <tr key={index}>
                              <td>
                                {price.guest_type == 1
                                  ? `Price for adult no.of ${price.guest_num}`
                                  : `Price for child no.of ${price.guest_num}`}
                              </td>
                              <td>${price.addition_price}</td>
                            </tr>
                          ))}

                          <tr>
                            <td>
                              <strong>Sub Total</strong>
                            </td>
                            <td>
                              {/* <strong>${bookingGrp?.total_amount}</strong> */}
                            </td>
                          </tr>

                          {/* {promoInfo &&
                            promoInfo?.applicable_for === "room_price" &&
                            promoInfo?.promo_type === "Percentage" && ( */}
                          <tr>
                            <td>
                              <strong>Discount</strong>
                            </td>
                            <td>
                              {/* <strong>{promoInfo?.amount}%</strong> */}
                            </td>
                          </tr>
                          {/* )} */}

                          {corporatePay === false && (
                            <>
                              <tr>
                                <td>
                                  <strong>Discount Amount</strong>
                                </td>
                                <td>
                                  {/* <strong>${bookingGrp?.promo_discount}</strong> */}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Additional Discount</strong>
                                </td>
                                <td>
                                  <strong>
                                    {/* ${bookingGrp?.additional_discount} */}
                                  </strong>
                                </td>
                              </tr>
                            </>
                          )}

                          <tr>
                            <td>
                              <strong>Tax</strong>
                            </td>
                            <td>
                              {/* <strong>${bookingGrp?.total_tax}</strong> */}
                              <strong>${total_tax_cal}</strong>


                            </td>
                          </tr>

                          <tr>
                            <td>
                              <strong>Grand Total</strong>
                            </td>
                            <td>
                              {/* <strong>${bookingGrp?.net_amount}</strong> */}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
