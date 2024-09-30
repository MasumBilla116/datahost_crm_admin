import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Collapse, Form, Modal } from "react-bootstrap";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyToast from "@mdrakibul8001/toastify";
import HeadSection from "../../../components/HeadSection";
import RadioButton from "../../../components/elements/RadioButton";
import Select2 from "../../../components/elements/Select2";
import { decrypt } from "../../../components/helpers/helper";
import Axios from "../../../utils/axios";

export const getServerSideProps = async (context) => {
  const query = context.query;
  return { props: { query } };
}



function updateBooking({ query }) {

  const { notify } = MyToast();
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { isReady } = router;
  const [totalMember, setTotalMember] = useState(null);
  const [guestDobOpen, setGuestDobOpen] = useState([]);
  //decrypt booking id
  const [bookingId, setBookingId] = useState(null);
  const { id } = query;

  useEffect(() => {
    if (!isReady) {
      return;
    }
    setBookingId(decrypt(id));

  }, [isReady, id]);
  //end decrypt id


  // const [customerGuestInfo, setCustomerGuestInfo] = useState(
  //   Array.from({ length: totalMember }, () => ({
  //     title: "Mr",
  //     fName: "",
  //     lName: "",
  //     gender: "male",
  //     id_type: "",
  //     personal_id: "",
  //     address: "",
  //     birth_date: null,
  //   }))
  // ); 


  const [customerGuestInfo, setCustomerGuestInfo] = useState([]);



  //calender open
  const [openGuest, setOpenGuest] = useState(null);
  const [hoveredGuest, setHoveredGuest] = useState(null);
  const [reservationModal, setReservationModal] = useState(false);

  const [dobOpen, setDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [total_paid, setTotalPaid] = useState(0);
  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })

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
    newCustomer: false
  });


  const [bookingInfo, setBookingInfo] = useState({});
  const defaultRoomType = { value: bookingInfo?.room_type_id, label: bookingInfo?.room_type_name };
  const defaultRoomCategory = { value: bookingInfo?.room_category_id, label: bookingInfo?.room_category_name };
  const defaultRoom = { value: bookingInfo?.room_id, label: bookingInfo?.room_no };



  const [bookingGrp, setBookingGrp] = useState({
    checkout_type: "",
    hourly_slot_id: null,
    date_from: null,
    date_to: null,
    booking_grp_status: 1,

    total_amount: null,
    promo_id: null,
    promo_discount: 0,
    discount_percentage: null,
    additional_discount: 0,
    total_paid: 0,
    total_due: 0,
    total_tax: 0,
    net_amount: null,
    room_booking_status:1,
    payment_status:1
  });





  const [customerBooking, setCustomerBooking] = useState({
    optionShow: true,
    room_type_id: null,
    room_category_id: null,
    room_id: "",
    adults: "",
    childs: "",
    allRooms: [],
  });
  console.log(customerBooking)
  const [taxInfo, setTaxInfo] = useState();

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

  //Set Customer booking group
  // const ChangeCustBookingGrp = (e) => {
  //   setBookingGrp((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const ChangeCustBookingGrp = (e) => {

    const field_name = e.target.name;
    var field_value = field_name === "payment_status" ? parseInt(e.target.value) : e.target.value;
    
    console.log("field_name: ",field_name);
    console.log("field_value: ",field_value);


    if(field_name === "total_paid"){
      const payment_status = bookingGrp?.payment_status; 
      const net_amt = parseFloat(bookingGrp?.net_amount);
      field_value = parseFloat(field_value); 

      if((field_value > net_amt) && (payment_status === 2)){
        notify("warning","Partial amount dosn't grater than payable amount"); 
      }else{ 
        setBookingGrp((prev) => ({
          ...prev,
          [field_name]: parseInt(field_value),
        }));
      }
    }else if( field_name === "payment_status" && field_value === 1){
      const payable_amt = bookingGrp?.net_amount - bookingGrp?.partial_paid;
      setBookingGrp((prev) => ({
        ...prev,
        [field_name]:  field_value,
        ['total_paid']:  payable_amt,
      }));

    }
    else if( field_name === "payment_status" && field_value === 2){
      setBookingGrp((prev) => ({
        ...prev,
        [field_name]:  field_value,
        ['total_paid']:  "",
      }));

    } 
    else{
      setBookingGrp((prev) => ({
        ...prev,
        [field_name]: field_value,
      }));
    } 
  };


  console.log("bookingbgrpu: ",bookingGrp)



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
  }

  const [corporatePay, setCorporatePay] = useState(false);

  const handleCorporatePay = () => {
    setCorporatePay(true);
    //set empty Booking Group
    setBookingGrp((prev) => ({
      ...prev,
      promo_id: null,
      promo_discount: 0,
      additional_discount: 0
    }));
    setPromoInfo({});
    handleClose();
  }

  const handleIndividualPay = () => {
    setCorporatePay(false);
    handleClose();
  }
  //End Modal

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed && taxInfo) {
      //modify tax calculation
      let tax;
      if (corporatePay === false) {
        // tax = ((bookingGrp?.total_amount - (Number(bookingGrp?.promo_discount) + Number(bookingGrp?.additional_discount))) * Number(taxInfo?.tax)) / 100;
        tax = (bookingGrp?.total_amount * Number(taxInfo?.tax)) / 100;

      } else {
        tax = (bookingGrp?.total_amount * Number(taxInfo?.tax)) / 100;
      }
      setBookingGrp((prev) => ({ ...prev, total_tax: tax.toFixed(2) }));

    }

    return () => isSubscribed = false;
  }, [bookingGrp?.total_amount, taxInfo?.tax, bookingGrp?.promo_discount, bookingGrp?.additional_discount, corporatePay])

  //Base Price Sum
  const [basePrice, setBasePrice] = useState(null);
  const basePriceInfo = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice`, {
        action: "basePriceDetails",
        room_type_id: customerBooking?.room_type_id,
        date_from: bookingGrp?.date_from,
        date_to: bookingGrp?.date_to,
        checkout_type: bookingGrp?.checkout_type,
        hourly_slot_id: bookingGrp?.hourly_slot_id
      })
      .then((res) => {
        if (isSubscribed) {
          setBasePrice(res.data?.data)
        }
      })
      .catch((err) => console.log(err));


    return () => (isSubscribed = false);
  }, [customerBooking?.room_type_id, bookingGrp?.date_from, bookingGrp?.date_to, bookingGrp?.checkout_type, bookingGrp?.hourly_slot_id, id]);

  useEffect(() => {
    basePriceInfo();
  }, [basePriceInfo]);


  //Additional Price list
  const [priceDetailsList, setPriceDetailsList] = useState([]);
  const [totalAdultAmount, setTotalAdultAmount] = useState([]);
  const [totalChildAmount, setTotalChildAmount] = useState([]);



  const additionalPriceDetails = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice`, {
        action: "additionalPriceDetails",
        room_type_id: customerBooking?.room_type_id,
        date_from: bookingGrp?.date_from,
        date_to: bookingGrp?.date_to,
        adults: customerBooking?.adults,
        childs: customerBooking?.childs,
      })
      .then((res) => {
        let result = res.data?.data;
        if (isSubscribed) {
          setPriceDetailsList(res.data?.data?.priceArrayList);

          if (
            res.data?.data?.adult_amount_arr &&
            Object.values(res.data?.data?.adult_amount_arr).every(amount => amount === 0)
          ) {
            setTotalAdultAmount(0);
          }
          if (
            res.data?.data?.child_amount_arr &&
            Object.values(res.data?.data?.child_amount_arr).every(amount => amount === 0)
          ) {
            setTotalChildAmount(0);
          }


          // setTotalAdultAmount(customerBooking?.adults);
          // setTotalChildAmount(customerBooking?.childs);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
        // else {
        //   notify("error", `Something went wrong !`);
        // }
      });

    return () => (isSubscribed = false);
  }, [customerBooking?.room_type_id, customerBooking?.adults, customerBooking?.childs, bookingGrp?.date_from, bookingGrp?.date_to]);

  useEffect(() => {
    additionalPriceDetails();
  }, [additionalPriceDetails]);

  //

  //Offer Info , discount type, amount etc
  const [promoInfo, setPromoInfo] = useState({});


  useEffect(() => {
    let isSubscribed = true;
    const fetchPromoInfo = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, {
        action: "getPromoInfo", promo_id: bookingGrp?.promo_id
      })
        .then((res) => {
          if (isSubscribed) {
            
            setPromoInfo(res.data?.data);

            setBookingGrp(prev => ({ ...prev, discount_percentage: res.data?.data?.amount }))
          }
        })
        .catch((err) => console.log(err))
    }

    if (bookingGrp?.promo_id) {
      fetchPromoInfo();
    }

    return () => isSubscribed = false;
  }, [bookingGrp?.promo_id]);

  const[totalPaidValue,setTotalPaidValue]= useState(bookingGrp?.total_paid)
  useEffect(()=>{
    setTotalPaidValue(bookingGrp?.total_paid)
  },[bookingGrp?.date_to,bookingGrp?.date_from])
  //End offer info


  //Total Price Calculate
  // const [total_amount,setTotalPrice] = useState();

  useEffect(() => {
    if (basePrice?.basePrice) {
      let mainPrice = Number(basePrice?.basePrice);

      if (priceDetailsList?.length) {
        priceDetailsList && priceDetailsList.map((price, index) => {
          mainPrice = mainPrice + Number(price?.addition_price);
        });

        setBookingGrp((prev) => ({ ...prev, total_amount: mainPrice.toFixed(2) }))
      }
      else {

        setBookingGrp((prev) => ({ ...prev, total_amount: Number(basePrice?.basePrice).toFixed(2) }))
      }

    }
  }, [basePrice?.basePrice, priceDetailsList]);



  useEffect(() => {
    //calculate discount amount for percentage
    if (promoInfo?.promo_type === "Percentage") {
      let promo_discount = 0;
      promo_discount = (bookingGrp?.total_amount * bookingGrp?.discount_percentage) / 100; //later deduct additional discount
      setBookingGrp((prev) => ({ ...prev, promo_discount: promo_discount }));
    }
    //calculate for flat rate
    if (promoInfo?.promo_type === "Flat") {
      let promo_discount = 0;
      promo_discount = promoInfo?.amount;
      setBookingGrp((prev) => ({ ...prev, promo_discount: promo_discount }));
    }


  }, [promoInfo?.promo_type, bookingGrp?.total_amount, bookingGrp?.discount_percentage]);


  //Total payable Net Amount
  useEffect(() => {
    let isSubscribed = true;
    let payable_net_amount;

    if (corporatePay === false) {
      payable_net_amount = (Number(bookingGrp?.total_amount) + Number(bookingGrp?.total_tax)) - (Number(bookingGrp?.promo_discount) + Number(bookingGrp?.additional_discount));
    } else {
      payable_net_amount = (Number(bookingGrp?.total_amount) + Number(bookingGrp?.total_tax));
    }

    if (isSubscribed) {
      // corporatePay === false ? setBookingGrp((prev) => ({ ...prev, total_paid: payable_net_amount.toFixed(2), net_amount: payable_net_amount.toFixed(2) })) :
      corporatePay === false ? setBookingGrp((prev) => ({ ...prev, net_amount: payable_net_amount.toFixed(2) })) :
        setBookingGrp((prev) => ({ ...prev, net_amount: payable_net_amount.toFixed(2) }));
    }

    return () => isSubscribed = false;
  }, [bookingGrp?.total_amount, bookingGrp?.total_tax, bookingGrp?.promo_discount, bookingGrp?.additional_discount]);

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



  //All Room Types
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchAllRoomTypes = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
        action: "allRoomTypes",
      })
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

  //Fetch room type details
  const [roomTypeDetails, setRoomTypeDetails] = useState({});

  const fetchRoomTypeDetails = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
        action: "roomTypeDetails",
        room_type_id: customerBooking?.room_type_id,
      })
      .then((res) => {
        if (isSubscribed) {
          setRoomTypeDetails(res.data?.data);
          setTaxInfo(res.data?.data?.tax_info);
          const total = res.data?.data?.adults + res.data?.data?.childrens - 1;
          setTotalMember(total);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [customerBooking?.room_type_id]);

  useEffect(() => {
    fetchRoomTypeDetails();
  }, [fetchRoomTypeDetails]);

  //All Room Categories
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

  //Fetch all rooms by room types or room category
  const AllRoomsData = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/tower`, {
        action: "roomsByTypesOrCategory",
        room_type_id: customerBooking?.room_type_id,
        room_category_id: customerBooking?.room_category_id,
      })
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

    return () => (isSubscribed = false);
  }, [customerBooking?.room_type_id, customerBooking?.room_category_id]);

  useEffect(() => {
    AllRoomsData();
  }, [AllRoomsData]);

  //Fetch all Customers whose customer_type 0 

  const AllCustomers = useCallback(async () => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
        action: "getAllCustomer"
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
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/roomPrice/hourly`, {
        action: "allSlotsView"
      })
        .then((res) => {
          if (isSubscribed) {
            setSlots(res.data?.data)
          }
        })
        .catch((err) => console.log(err))
    }
    fetchAllSlots();
    return () => isSubscribed = false;
  }, []);

  //Fetch all promo offers
  const [offers, setOffers] = useState([]);


  useEffect(() => {
    let isSubscribed = true;
    const fetchAllOffers = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, {
        action: "getAllPromos"
      })
        .then((res) => {
          if (isSubscribed) {
            setOffers(res.data?.data)
          }
        })
        .catch((err) => console.log(err))
    }
    fetchAllOffers();
    return () => isSubscribed = false;
  }, []);




  //Fetch all Accounts
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    let isSubscribed = true;
    const fetchAllAccounts = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
        action: "listAccounts"
      })
        .then((res) => {
          if (isSubscribed) {
            setAccounts(res.data?.data)
          }
        })
        .catch((err) => console.log(err))
    }
    fetchAllAccounts();
    return () => isSubscribed = false;
  }, []);


  const [selectedPromoOption, setSelectedPromoOption] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  //Fetch booking Info
  const fetchBookinInfo = useCallback(async () => {
    if (!isReady) {
      return;
    }

    let param = decrypt(id);
    let isSubscribed = true;
    try {


      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, { action: "bookingInfo", booking_id: param });
      if (isSubscribed) {

        const result = res.data?.data?.bookingInfo;
console.log('result',result)
// setCustomerBooking
        setBookingInfo(result);
        setTotalPaid(parseFloat(result?.total_paid));
        setCustomerBooking((prev) => ({
          ...prev,
          room_type_id: result?.room_type_id,
          room_category_id: result?.room_category_id,
          room_id: result?.room_id,
          adults: result?.room_type_adults,
          childs: result?.room_type_childs,
          account_id:parseInt(result?.payment_accounts_id)
        }));

        setBookingGrp((prev) => ({
          ...prev,
          checkout_type: result?.checkout_type,
          date_from: result?.date_from,
          date_to: result?.date_to,
          additional_discount: result?.additional_discount,
          promo_offer_name: result?.promo_offer_name,
          promo_id: result?.promo_id,
          payment_accounts_id: result?.payment_accounts_id,
          accounts_name: result?.accounts_name,
          room_booking_status:result?.booking_status,
          payment_status: result?.payment_status, 
          pre_payment_status: result?.payment_status,
          total_due: parseFloat( result?.total_due),
          total_paid: parseFloat( result?.total_paid),
          partial_paid: parseFloat( result?.total_paid),

        }));
        setSelectedPromoOption(result?.promo_id)

        setSelectedPayment(result?.payment_accounts_id)
        fetchCustomerInfo(result?.customer_id)
      }
    } catch (err) {
      console.log("Server Error ~!");
    }

    return () => (isSubscribed = false);
  }, [id, isReady]);



  useEffect(() => {
    let isSubscribed = true;
    let param = decrypt(id);
    const fetchAllGuest = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, { action: "bookingGuestInfo", booking_id: param })
        .then((res) => {
          if (isSubscribed) {
            const guestData = res.data?.data || []; 
            setTotalMember(guestData.length); 
            setCustomerGuestInfo(guestData.map(guest => ({
              title: guest.title || "Mr",
              fName: guest.first_name || "",
              lName: guest.last_name || "",
              gender: guest.gender || "male",
              id_type: guest.id_type || "",
              personal_id: guest.personal_id || "",
              address: guest.address || "",
              birth_date: guest.dob ? new Date(guest.dob) : null,
            })));
          }
        })
        .catch((err) => console.log(err))
    }
    fetchAllGuest();
    return () => isSubscribed = false;
  }, [id]);


  useEffect(() => {
    fetchBookinInfo();
  }, [id]);





  // const selected_promo_options = {
  //   value: bookingGrp?.promo_id || "",
  //   label: bookingGrp?.promo_offer_name || "select...",
  // };


  const selected_bank_options = {
    value: bookingGrp?.payment_accounts_id || "",
    label: bookingGrp?.accounts_name || "select...",
  };



  // useEffect(() => {
  //   // Check if bookingInfo and customer_id are defined before setting customerId
  //   // if (bookingInfo && bookingInfo.customer_id !== undefined) {
  //   //   setCustomerId(bookingInfo.customer_id);
  //   // }
  // }, [bookingInfo, bookingInfo?.customer_id]); // Include bookingInfo in the dependency array

  // ... rest of your component code



  //fetching existing customer info
  const fetchCustomerInfo = async (customerId) => {
    let isSubscribed = true;


    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`, {
      action: "customerInfoOld",
      customer_id: customerId,
    })
      .then((res) => {
        if (isSubscribed) {
          if (res.data?.data?.customer_type === 1) {
            handleOpen();
          }
          else {
            setCorporatePay(false);
          }
          if (res.data.data?.country_id != null) {
            setCustomer((prev) => ({
              ...prev,
              custInfo: res.data?.data,
              mobile: res.data?.data?.mobile,
              contact_type: res.data.data?.contact_type,
              title: res.data.data?.title,
              fName: res.data.data?.first_name,
              lName: res.data.data?.last_name,
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

  };








  //Guest System
  const handleChangesGuest = (index, field, value) => {
    setCustomerGuestInfo(prev => {
      const updatedGuests = [...prev];
      updatedGuests[index] = { ...updatedGuests[index], [field]: value }; 
      return updatedGuests; 
    });
  };


  //Update booking request
  async function submitForm(e) {

    e.preventDefault();
    

    let body = {
      ...customer,
      ...bookingGrp,
      ...customerBooking,
      customerGuestInfo,
      action: "updateBooking",
      booking_master_id: bookingId,
      totalAdultAmount: totalAdultAmount,
      totalChildAmount: totalChildAmount,
      corporatePay: corporatePay,
      tax_id: taxInfo?.id

    };
    console.log(body);
    // return;
    let optionShow = true;
    let isSubscribed = true;
  
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
          body
        )
        .then((res) => {
          if (isSubscribed) {
            // notify("success", `${res.data.response}`);
            notify("success", `Update Successfully`);
            router.push('/modules/bookings/list');

          }
        })
        .catch((e) => {

          const msg = e.response?.data?.response;

        });
    // }

    return () => (isSubscribed = false);
  }

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All-Booking', link: '/modules/bookings/all-booking' },
    { text: 'Update-Booking', link: '/modules/bookings/[id]' },

  ];





  return (
    <>
      <HeadSection title="Edit Booking" />

      <div className="container-fluid ">

        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <Form onSubmit={submitForm} id="customerForm" >
          <h4>Edit Booking</h4>
          <div className="row">
            {/* @TODO:Customer info and payment section */}
            <div className="col-12 col-md-7">
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
                            <p>How do you like to pay? <strong>Corporate</strong> -or- <strong>Individual</strong></p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="outlined" color="error" className="shadow rounded" onClick={handleCorporatePay}>
                              Corporate
                            </Button>
                            <Button variant="outlined" color="info" className="shadow rounded" onClick={handleIndividualPay}>
                              Individual
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        {/* Corporate payment or individual confirmation */}


                      </div>

                      <div className="row">


                        <Form.Group className="mb-2 col-6">
                          <Form.Label >Mobile Number <span className="text-danger">*</span></Form.Label>

                          <Autocomplete
                            freeSolo
                            value={customer?.mobile}
                            onChange={(event, value) => {
                              setCustomer(prev => ({ ...prev, mobile: value?.value }));
                            }}
                            options={customer?.allCustomer.map(
                              ({ mobile, first_name }) => ({ value: mobile, label: `${mobile} - ${first_name}` })
                            )}

                            renderInput={(params) => <TextField {...params} fullWidth={true} size='small' required />}
                          />

                        </Form.Group>

                        <Form.Group className="mb-2 col-6">
                          <Form.Label>Contact Type <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>Title <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter First Name"
                            name="fName"
                            defaultValue={customer?.fName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-2 col-4">
                          <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                          <div className="row">
                            <div className="flex-gap align-items-center">

                              {/* <RadioButton
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
                              /> */}
                               <Form.Select
                            name="gender"
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

                            </div>
                          </div>
                        </Form.Group>

                        <Form.Group className="col-4">
                          <Form.Label>ID Type <span className="text-danger">*</span></Form.Label>
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
                            <option value="Driving Licence">Driving Licence</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="col-4">
                          <Form.Label>ID <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={customer.id_type ? `Enter your ${customer.id_type} number` : ``}
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
                                setCustomer(prev => ({ ...prev, birth_date: event }));
                              }}
                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                                </ThemeProvider>
                              }
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
                                setCustomer(prev => ({ ...prev, anniversary_date: event }));
                              }}
                              renderInput={(params) =>

                                <TextField onClick={() => setAnniversaryOpen(true)} fullWidth={true} size='small' {...params} />

                              }
                            />
                          </LocalizationProvider>
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>Nationality <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                          {customer?.custInfo?.country?.id !== undefined && (
                            <>
                              <Select2
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
                          <Form.Label>State <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>City <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>Pin Code <span className="text-danger">*</span></Form.Label>
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
                          <Form.Label>Arrival From <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label>Address <span className="text-danger">*</span></Form.Label>
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
              <div className="row">

                {totalMember > 0 && <div className="col-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h4 className="card-title border-bottom">
                        ADDITIONAL GUEST INFO
                      </h4>
                      {customerGuestInfo.map((guest, index) => (

                        <>
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

                          <div key={index} className="guest-container" style={{ borderTop: index !== 0 ? '1px solid rgba(128, 128, 128, 0.5)' : 'none', marginTop: index !== 0 ? '4px' : '0' }}>


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
                                    <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                      name="title"
                                      value={guest.title}
                                      onChange={(e) => handleChangesGuest(index, 'title', e.target.value)}

                                    >
                                      <option disabled value="">Select Title</option>
                                      <option value="Mr.">Mr.</option>
                                      <option value="Ms.">Ms.</option>
                                      <option value="Mrs.">Mrs.</option>
                                      <option value="others">Others</option>
                                    </Form.Select>
                                  </Form.Group>

                                  <Form.Group className="mb-2 col-4">
                                    <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter First Name"
                                      name="fName"
                                      value={guest.fName}
                                      onChange={(e) => handleChangesGuest(index, 'fName', e.target.value)}

                                    />
                                  </Form.Group>

                                  <Form.Group className="mb-2 col-4">
                                    <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Last Name"
                                      name="lName"
                                      value={guest.lName}
                                      onChange={(e) => handleChangesGuest(index, 'lName', e.target.value)}

                                    />
                                  </Form.Group>
                                </div>

                                <div className="row mb-3">
                                  <Form.Group className="col-6">
                                    <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                                    <div className="row">
                                      <div className="flex-gap align-items-center">
                                        <RadioButton
                                          id={`male${index}`}
                                          label="Male"
                                          name='gender'
                                          value="male"
                                          checked={guest?.gender === "male"}
                                          onChange={(e) => handleChangesGuest(index, 'gender', e.target.value)}
                                        />

                                        <RadioButton
                                          id={`female${index}`}
                                          label="Female"
                                          name='gender'
                                          value="female"
                                          checked={guest?.gender === "female"}
                                          onChange={(e) => handleChangesGuest(index, 'gender', e.target.value)}
                                        />

                                        <RadioButton
                                          id={`other${index}`}
                                          label="Other"
                                          name='gender'
                                          value="other"
                                          checked={guest?.gender === "other"}
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
                                        value={guest[index]?.birth_date}
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
                                      value={guest?.id_type}
                                      // onChange={handleChangesGuest}
                                      onChange={(e) => handleChangesGuest(index, 'id_type', e.target.value)}

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
                                        guest.id_type
                                          ? `Enter your ${guest.id_type} number`
                                          : ``
                                      }
                                      name="personal_id"
                                      value={guest?.personal_id}
                                      // onChange={handleChangesGuest}
                                      onChange={(e) => handleChangesGuest(index, 'personal_id', e.target.value)}

                                    />
                                  </Form.Group>
                                </div>

                              </div>
                            </Collapse>
                          </div>
                        </>


                      ))}

                    </div>
                  </div>
                </div>
                }
              </div>

            </div>
            {/* @TODO:Customer info and payment section */}



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
                      <div className="row">
                        <Form.Group className="mb-3 col-4">
                          <Form.Label>
                            <span style={{ fontSize: '13px' }}> Checking System</span>

                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={bookingGrp.checkout_type}
                            name="checkout_type"
                            onChange={ChangeCustBookingGrp}
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
                        {bookingGrp.checkout_type &&
                          bookingGrp.checkout_type === "hourly" ? (
                          <>
                            <Form.Group className="mb-3 col-4">
                              <Form.Label>
                                Set Hours <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                defaultValue=""
                                name="hourly_slot_id"
                                onChange={ChangeCustBookingGrp}
                                required
                              >
                                <option disabled value="">
                                  Select Check-Out Time
                                </option>
                                {slots && slots.map((slot, index) => (
                                  <Fragment key={index}>
                                    <option value={slot?.id}>{slot?.hour}</option>
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
                            <span style={{ fontSize: '13px' }}>  Check-IN-Time</span>
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Check-in"
                              open={checkinOpen}
                              onClose={() => setCheckinOpen(false)}
                              value={bookingGrp?.date_from}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                setBookingGrp(prev => ({ ...prev, date_from: event }));
                              }}
                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setCheckinOpen(true)} fullWidth={true} size='small' {...params} required />
                                </ThemeProvider>
                              }
                            />
                          </LocalizationProvider>
                        </Form.Group>

                        {bookingGrp.checkout_type !== "hourly" && (
                          <>
                            <Form.Group className="mb-2 col-4">
                              <Form.Label>
                                <span style={{ fontSize: '13px' }}>Check-Out-Time</span>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  label="Check-Out"
                                  open={checkoutOpen}
                                  onClose={() => setCheckoutOpen(false)}
                                  value={bookingGrp?.date_to}
                                  inputFormat="yyyy-MM-dd"
                                  onChange={(event) => {
                                    setBookingGrp(prev => ({ ...prev, date_to: event }));
                                  }}
                                  renderInput={(params) =>
                                    <ThemeProvider theme={theme}>
                                      <TextField onClick={() => setCheckoutOpen(true)} fullWidth={true} size='small' {...params} required />
                                    </ThemeProvider>
                                  }
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
                              Select Room Type{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            {!!bookingInfo?.room_type_id === false &&
                              <>
                                <Select2
                                  options={roomTypes.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  }))}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_type_id: e.value,
                                    }))
                                  }
                                  required={true}
                                />
                              </>
                            }

                            {!!bookingInfo?.room_type_id === true &&
                              <>
                                <Select2
                                  options={roomTypes.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  }))}
                                  defaultValue={defaultRoomType}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_type_id: e.value,
                                    }))
                                  }
                                  required={true}
                                />
                              </>
                            }
                          </Form.Group>

                          <Form.Group className="mb-2 col-4">
                            <Form.Label>
                              Select Room Category{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            {!!bookingInfo?.room_category_id === false &&
                              <>
                                <Select2
                                  options={roomCategories.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  }))}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_category_id: e.value,
                                    }))
                                  }
                                  required={true}
                                />
                              </>

                            }
                            {!!bookingInfo?.room_category_id === true &&
                              <>
                                <Select2
                                  options={roomCategories.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  }))}
                                  defaultValue={defaultRoomCategory}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_category_id: e.value,
                                    }))
                                  }
                                  required={true}
                                />
                              </>

                            }
                          </Form.Group>

                          <Form.Group className="mb-2 col-4">
                            <Form.Label>
                              Select Room Number{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            {!!bookingInfo?.room_id === false &&
                              <>
                                <Select2
                                  options={customerBooking?.allRooms?.map(
                                    ({ id, room_no }) => ({ value: id, label: room_no })
                                  )}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_id: e.value,
                                    }))
                                  }
                                  required={true}
                                  maxMenuHeight={200}
                                />
                              </>
                            }

                            {!!bookingInfo?.room_id === true &&
                              <>
                                <Select2
                                  options={customerBooking?.allRooms?.map(
                                    ({ id, room_no }) => ({ value: id, label: room_no })
                                  )}
                                  defaultValue={defaultRoom}
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      room_id: e.value,
                                    }))
                                  }
                                  required={true}
                                />
                              </>
                            }
                          </Form.Group>
                        </div>
                      </div>

                      <h4 className="card-title border-bottom mt-2">
                        Guest Info
                      </h4>
                      <div className="row">
                        <Form.Group className="mb-2 col-6">
                          <Form.Label>

                            <span style={{ fontSize: '12px' }}>Number of Adults</span>
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="adults"
                            min="0"
                            // defaultValue={customerBooking?.adults}
                            defaultValue={roomTypeDetails?.adults}
                            placeholder="Enter number of adults"
                            onChange={ChangeCustBooking}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6">
                          <Form.Label>

                            <span style={{ fontSize: '12px' }}>Number of Childrens</span>
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="childs"
                            min="0"
                            // defaultValue={customerBooking?.childs}
                            defaultValue={roomTypeDetails?.childrens}
                            placeholder="Enter Number of childrens"
                            onChange={ChangeCustBooking}
                            required
                          />
                        </Form.Group>
                        <p>
                          {roomTypeDetails
                            ? `Guests included in base price: Adult-${roomTypeDetails.adults}, Child-${roomTypeDetails.childrens}`
                            : ``}
                        </p>
                      </div>
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


                              {/* {selectedPromoOption?.value !== null && ( */}
                                <select
                                className="form-control"
                                  onChange={(e) =>
                                    setBookingGrp((prev) => ({
                                      ...prev,
                                      promo_id: e.value,
                                    }))
                                  }
                                  value={selectedPromoOption}
                                >
                                  <option value=''>None</option>
                                  {offers.map((item) => (<option value={item.id}>{item.name}</option>))}
                                </select>
                              {/* )} */}
                            </Form.Group>

                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Additional Discount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter additional discount Amount"
                                name="additional_discount"
                                value={parseFloat(bookingGrp?.additional_discount)}
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <div className='float-right'>
                                <div style={{ paddingRight: "20px" }}>
                                  <table className='table table-price-details'>
                                    <tbody>
                                      <tr style={{ borderTop: 'hidden' }}>
                                        <td>Base Price </td>
                                        <td>:</td>
                                        <td>{basePrice?.basePrice ?? 0}</td>
                                        {/* <td>00</td> */}
                                      </tr>
                                      <tr style={{ borderBottom: '1px solid black', borderTop: 'hidden' }}>
                                        {/* <td>Discount ({discount ? discount : 0}%) - (${promoDiscount} + {additionalDiscount}) </td> */}
                                        <td>Discount ({promoInfo?.amount ?? 0} + {bookingGrp?.additional_discount})</td>
                                        <td>:</td>
                                        {/* <td>{parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount)}</td> */}
                                        <td>{isNaN(parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount)) ? 0 : parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount)}</td>

                                      </tr>

                                      <tr>
                                        <td>Sub Total</td>
                                        <td>:</td>
                                        {/* <td>${bookingGrp?.total_amount - (parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount))}</td> */}
                                        <td>${isNaN(bookingGrp?.total_amount - (parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount))) ? 0 : bookingGrp?.total_amount - (parseFloat(promoInfo?.amount) + parseFloat(bookingGrp?.additional_discount))}</td>

                                      </tr>
                                      <tr style={{ borderTop: 'hidden', borderBottom: '1px solid black' }}>
                                        <td>Tax({taxInfo?.tax ?? 0})% </td>
                                        <td>:</td>
                                        <td>${bookingGrp?.total_tax}</td>
                                      </tr>
                                     
                                      { bookingGrp?.pre_payment_status === 2 && <> 
                                        <tr>
                                        <td>Grand Total</td>
                                        <td>:</td>
                                        <td>${bookingGrp?.net_amount}</td>
                                      </tr>
                                        <tr>
                                            <td>Partial Paid</td>
                                            <td>:</td>
                                            <td>${bookingGrp?.partial_paid}</td>
                                          </tr> 
                                      </> 
                                      }
                                      
                                      <tr style={{   borderTop: '1px solid black' }}>
                                        <td>Total Payable</td>
                                        <td>:</td>
                                        <td>${
                                          bookingGrp?.pre_payment_status === 2 ?( bookingGrp?.net_amount - bookingGrp?.partial_paid).toFixed(2) :
                                        bookingGrp?.net_amount}</td>
                                      </tr>
                                      

                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-4">


                          <Form.Group className="mb-2 col-6">
                              <h4 className="card-title border-bottom">Booking Status</h4>
                              <div className="row">
                                <div className="col-md-6 mb-2 mt-2">
                                  <Form.Check
                                    type="radio"
                                    label="Check-in"
                                    id="room_booking_status_1"
                                    value={1} // Value to be used when this radio button is selected
                                    name="room_booking_status"
                                    onChange={ChangeCustBookingGrp}
                                    checked={parseInt(bookingGrp.room_booking_status) === 1} // Check if this is the selected value
                                  />
                                </div>
                                <div className="col-md-6 mb-2 mt-2">
                                  <Form.Check
                                    type="radio"
                                    label="Booked"
                                    id="room_booking_status_2"
                                    value={2} // Value to be used when this radio button is selected
                                    name="room_booking_status"
                                    onChange={ChangeCustBookingGrp}
                                    checked={parseInt(bookingGrp.room_booking_status) === 2} // Check if this is the selected value
                                  />
                                </div>
                              </div>
                            </Form.Group>


                            <Form.Group className="mb-4 col-6">  
                              <h4 className="card-title border-bottom">
                                Payment Type
                              </h4>
                              <div className="row"> 
                                 <div className="col-md-4   mt-2">
                                  <Form.Check
                                    type="radio"
                                    label="Full"
                                    value={1}
                                    id="payment_status_1"
                                    name="payment_status"
                                    onChange={ChangeCustBookingGrp}
                                    checked={parseInt(bookingGrp.payment_status) === 1} // Check if this is the selected value 
                                  />
                                </div> 
                               
                                <div className="col-md-4   mt-2">
                                  <Form.Check
                                    type="radio"
                                    label="Partial"
                                    value={2}
                                    id="payment_status_2"
                                    name="payment_status"
                                    onChange={ChangeCustBookingGrp}
                                    checked={parseInt(bookingGrp.payment_status) === 2} // Check if this is the selected value 
                                  />
                                </div>
                                <div className="col-md-4   mt-2">
                                  <Form.Check
                                    type="radio"
                                    label="Later"
                                    id="payment_status_3"
                                    value={3}
                                    name="payment_status"
                                    onChange={ChangeCustBookingGrp}
                                    checked={parseInt(bookingGrp.payment_status) === 3} // Check if this is the selected value

                                  />
                                </div>
                              </div> 
                            </Form.Group>

                            <div className="col-12">
                              <hr />
                            </div>


                            { bookingGrp?.payment_status !== 3 && <>

                              <Form.Group className="mb-2 col-6">
                              <Form.Label>Payment Account <span className="text-danger">*</span></Form.Label>
                              
                              <select
                                className="form-control"
                                  onChange={(e) =>
                                    setCustomerBooking((prev) => ({
                                      ...prev,
                                      account_id: e.target.value,
                                    }))
                                  }
                                  value={selectedPayment}
                                >
                                  <option value=''>None</option>
                                  {accounts.map((item) => (<option value={item.id}>{item.account_name}</option>))}
                                </select>


                            </Form.Group>

                            <Form.Group className="mb-2 col-6">
                              <Form.Label>Payment Amount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter Payment Amount"
                                // value={totalPaidValue}
                                value={bookingGrp?.total_paid}
                                name="total_paid"
                                onChange={ChangeCustBookingGrp}
                                // disabled={bookingGrp?.payment_status === 1}
                              />
                            </Form.Group>


                            
                            </>}
                          </div>
                          <div className="row">
                            
                              
                          <Form.Group className={`mb-2 ${(parseInt(bookingGrp?.payment_status) === 1 && total_paid === 0) ? "col-4" : "d-none"}`}>
                          <Form.Label>Reference</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Payment Reference"
                                name="reference"
                                onChange={ChangeCustBookingGrp}
                              />
                            </Form.Group>
                              
                             
                            

                            <Form.Group className={`mb-2 ${(parseInt(bookingGrp?.payment_status) === 1 && total_paid === 0) ? "col-8" : "col-12"}`}>
                            {/* <Form.Group className={`mb-2 ${total_paid > 0 ? "col-8" : "col-12"}`}> */}
                              <Form.Label>Remarks</Form.Label>
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




              {/* Price Details end */}

              <div className="row">
                <div className="col-12">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: '100%' }}
                  >
                    Update Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>


        </Form>
      </div>
    </>
  )
}

export default updateBooking;