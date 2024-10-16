import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import toast from "../../../../components/Toast/index";
import Button from '../../../../components/elements/Button';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Label from '../../../../components/elements/Label';
import Select from '../../../../components/elements/Select';
import Select2 from '../../../../components/elements/Select2';
import TextInput from '../../../../components/elements/TextInput';
import Axios from '../../../../utils/axios';
import RadioButton from '../../../../components/elements/RadioButton';
import { Form } from 'react-bootstrap';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { TextField } from '@mui/material';
import Breadcrumbs from '../../../../components/Breadcrumbs';

const CreateVoucher = () => {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [vouchers, setVourchers] = useState([]);

  const [categoryItemData, setCategoryItemData] = useState();

  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [getFloors, setFloors] = useState();

  const [invoice, setInvoice] = useState({
    customer_type: "",
    food_type: "",
    customer_id: null,
    guest_customer: "",
    restaurant_food_id: null,
    restaurant_setmenu_id: null,
    food_name: "",
    qty: null,
    unit_price: null,
    total_price: null,
    food_vat: null,
    total_vat: null,
    vat_name: "",
    vat_cal: null,
    food_promo: null,
    total_promo: null,
    promo_name: "",
    promo_type: "",
    promo_cal: null,
    promo_start: "",
    promo_end: "",
    sub_total: null,
    net_total: null,
    net_vat: null,
    net_promo: null,
    remarks: "",
    floor_id: null,
    restaurant_table_id: null,
    invoice_remarks: "",
    service_type: "",
    service_charge: null,
    total_service_charge: null,
    discount: null,
  })
  const [invoice_date, set_invoice_date] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [tempServiceCharge, setTempServiceCharge] = useState(null);

  const [isService, setIsService] = useState(false);

  const [subTotal, setSubTotal] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");


  const [foods, setFoods] = useState([]);
  const [foodNameSearch, setFoodNameSearch] = useState("");

  const [setmenuNameSarch, setSetmenuNameSearch] = useState("");
  const [setmenuItemData, setSetmenuItemData] = useState();

  const [tableList, setTableList] = useState(null);
  const customer_options = customers.data;

  const handleChange = (e) => {
    setInvoice(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
    if (e.target.name == 'qty') {
      setInvoice(prev => ({
        ...prev, total_price: (Number(e.target.value) * Number(invoice.unit_price)),
        total_vat: (Number(e.target.value) * Number(invoice.vat_cal)),
        total_promo: (Number(e.target.value) * Number(invoice.promo_cal)),
      }))
    }
    if (e.target.name == 'food_type') {
      if (e.target.value == 'add-food') {
        setInvoice(prev => ({
          ...prev, restaurant_setmenu_id: null, qty: null, unit_price: null, total_price: null, remarks: ""
        }))
      }
      if (e.target.value == 'add-setmenu') {
        setInvoice(prev => ({
          ...prev, restaurant_food_id: null, qty: null, unit_price: null, total_price: null, remarks: ""
        }))
      }
    }

    if (e.target.name == "discount") {
      setInvoice(prev => ({
        ...prev, sub_total: subTotal - e.target.value
      }))
    }
  }

  const handleItemSelectChange = (e) => {
    setInvoice(prev => ({
      ...prev, restaurant_food_id: e?.value, unit_price: e?.price, food_name: e?.label, food_vat: e?.vat,
      qty: 1, total_price: e?.price, total_vat: e?.vat, food_promo: e?.promo, promo_type: e?.promoType,
      promo_start: e?.promoStart, promo_end: e?.promoEnd
    }))

    if (e?.promoType == 'Percentage') {
      setInvoice(prev => ({
        ...prev, food_promo: e?.promoPercentage
      }))
    }
  }
  useEffect(() => {
    if (invoice?.food_promo) {

      if (invoice?.promo_type == 'Flat') {
        setInvoice(prev => ({
          ...prev,
          promo_cal: Number(invoice.food_promo),
          total_promo: Number(invoice.food_promo),
        }))
      }
      else if (invoice?.promo_type == 'Percentage') {

        setInvoice(prev => ({
          ...prev,
          promo_cal: (Number(invoice.unit_price) * Number(invoice.food_promo)) / 100,
          total_promo: (Number(invoice.unit_price) * Number(invoice.food_promo)) / 100,
        }))
      }
    }

    if (invoice?.food_vat) {
      setInvoice(prev => ({
        ...prev,
        vat_cal: (Number(invoice.unit_price) * Number(invoice.food_vat)) / 100,
        total_vat: ((Number(invoice.unit_price) * Number(invoice.food_vat)) / 100),
      }))

    }
  }, [invoice?.food_promo, invoice?.food_vat])

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  
  const [getItemCategories, setItemCategories] = useState("");
  const categories_options = getItemCategories.data;

  const [itemLoading, setItemLoading] = useState(true)

  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pending, setPending] = useState(false)
  const [pendingCat, setPendingCat] = useState(false)

  useEffect(() => {
    const controller = new AbortController();




    const getAllCustomer = async () => {
      setIsLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, { action: "getAllCustomer" })
        .then((res) => {
          setCustomers(res?.data);
          setIsLoading(false)
        })
    }

    async function getAllFloors() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/floors`, { action: "getAllFloors", })
        .then((res) => {
          setFloors(res?.data?.data);
        });
    }

    const categoryList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, { action: "getAllCategories" })
        .then((res) => {
          setItemCategories(res.data);
        });
    };

    const setmenuList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, { action: "getAllSetmenus" })
        .then((res) => {
          setSetmenuItemData(res.data.data);
        });
    };

    const serviceInfo = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`, { action: "getServiceInfo" })
        .then((res) => {
          if (res.data.data.type == 'always-apply') {
            setInvoice(prev => ({
              ...prev, service_type: res.data.data.type,
              service_charge: res.data.data.amount,
            }))
          }
          else if (res.data.data.type == 'flexible') {
            setTempServiceCharge(res.data.data.amount)
            setInvoice(prev => ({
              ...prev, service_type: res.data.data.type,
            }))
          }
          else {
            setInvoice(prev => ({
              ...prev, service_type: res.data.data.type,
              service_charge: 0,
            }))
          }
        });
    };

    getAllCustomer()
    getItemByCategory()
    getAllFloors();
    categoryList();
    setmenuList();
    serviceInfo();
    return () => controller.abort();

  }, [categoryId, customerName])

  useEffect(() => {
    if (isService == true) {
      setInvoice(prev => ({
        ...prev, service_charge: tempServiceCharge, total_service_charge: (Number(invoice.net_total) * Number(tempServiceCharge)) / 100,
        sub_total: ((Number(invoice.net_total) - Number(invoice.net_promo)) + Number(invoice.net_vat) + Number((Number(invoice.net_total) * Number(tempServiceCharge)) / 100)) - invoice.discount
      }))
      setSubTotal(((Number(invoice.net_total) - Number(invoice.net_promo)) + Number(invoice.net_vat) + Number((Number(invoice.net_total) * Number(tempServiceCharge)) / 100)))
    }
    else {
      setInvoice(prev => ({
        ...prev, service_charge: 0, total_service_charge: 0,
        sub_total: ((Number(invoice.net_total) - Number(invoice.net_promo)) + Number(invoice.net_vat)) - invoice.discount
      }))
      setSubTotal(((Number(invoice.net_total) - Number(invoice.net_promo)) + Number(invoice.net_vat)))
    }
  }, [isService])

  const getAllFood = useCallback(async () => {
    let isSubscribed = true;
    setIsLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { foodName: foodNameSearch, action: "foodSearch" })
      .then((res) => {
        setCategoryItemData(res?.data?.data);
        setIsLoading(false)
      })

    return () => isSubscribed = false;

  }, [foodNameSearch]);

  const getAllSetmenu = useCallback(async () => {
    let isSubscribed = true;
    setIsLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { setmenuName: setmenuNameSarch, action: "setmenuSearch" })
      .then((res) => {
        setSetmenuItemData(res?.data?.data);
        setIsLoading(false)
      })

    return () => isSubscribed = false;

  }, [setmenuNameSarch]);

  const getAllTable = useCallback(async () => {
    let isSubscribed = true;
    setIsLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { id: invoice.floor_id, action: "getTableByFloor" })
      .then((res) => {
        setTableList(res?.data?.data);
        setIsLoading(false)
      })

    return () => isSubscribed = false;

  }, [invoice.floor_id]);




  useEffect(() => {
    getAllFood();
    getAllSetmenu();
    getAllTable();
  }, [getAllFood, getAllSetmenu, getAllTable])


  const [ind, setInd] = useState(1)

  const StoringData = (e) => {
    e.preventDefault();
    // e.target.reset();
    setInvoice(prev => ({
      ...prev, restaurant_setmenu_id: null, restaurant_food_id: null, qty: null, unit_price: null, total_price: null, remarks: "",
      food_vat: 0, total_vat: 0, vat_cal: 0, food_promo: 0, total_promo: 0, promo_cal: 0
    }))
    setCategoryId(null)
    setInd(() => ind + 1)

    var voucherItemId = [];
    var voucherFoodType = [];

    {
      vouchers.map(item => {
        voucherItemId.push(item.itemId);
        voucherFoodType.push(item.foodType);
      })
    }

    if (voucherItemId.includes(invoice.restaurant_food_id) && voucherFoodType.includes('add-food')) {
      notify("error", "can not add same item!");
    }
    else if (voucherItemId.includes(invoice.restaurant_setmenu_id) && voucherFoodType.includes('add-setmenu')) {
      notify("error", "can not add same setmenu!");
    }
    else {
      setVourchers([...vouchers,
      {
        id: ind,
        foodType: invoice.food_type,
        catId: categoryId,
        itemId: (invoice.food_type == 'add-food' ? invoice.restaurant_food_id : invoice.restaurant_setmenu_id),
        itemName: invoice.food_name,
        remarks: invoice.remarks,
        unitPrice: invoice.unit_price,
        item_qty: invoice.qty,
        totalPrice: invoice.total_price,
        foodVat: invoice.food_vat,
        vatCal: invoice.vat_cal,
        totalVat: invoice.total_vat,
        foodPromo: invoice.food_promo,
        totalPromo: invoice.total_promo,
        promoCal: invoice.promo_cal,
      }
      ])

      setInvoice(prev => ({
        ...prev, net_total: (Number(invoice.net_total) + Number(invoice.total_price))
      }))
      setInvoice(prev => ({
        ...prev, net_vat: (Number(invoice.net_vat) + Number(invoice.total_vat))
      }))
      setInvoice(prev => ({
        ...prev, net_promo: (Number(invoice.net_promo) + Number(invoice.total_promo))
      }))
      setInvoice(prev => ({
        ...prev, total_service_charge: ((Number(invoice.net_total) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100,
      }))

      setInvoice(prev => ({
        ...prev, sub_total: ((Number(invoice.sub_total) - Number(invoice.total_service_charge) + Number(invoice.total_price) - Number(invoice.total_promo)) + Number(invoice.total_vat) + ((Number(invoice.net_total) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100)
      }))
      setSubTotal((((Number(invoice.sub_total) - Number(invoice.total_service_charge) + Number(invoice.total_price) - Number(invoice.total_promo)) + Number(invoice.total_vat)) + Number(invoice.discount)) + ((Number(invoice.net_total) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100)

    }

  }

  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState('');

  const [tempTotal, setTempTotal] = useState(0);
  const [tempVat, setTempVat] = useState(0);
  const [tempPromo, setTempPromo] = useState(0);
  const [tempService, setTempService] = useState(0);

  function editobj(index, editId, foodType) {

    setObjEdit(true)
    setArrayIndex(index)
    setEditId(editId)

    setInvoice(prev => ({
      ...prev, qty: vouchers[index]?.item_qty, food_type: vouchers[index]?.foodType,
      restaurant_food_id: vouchers[index].itemId, food_name: vouchers[index].itemName,
      restaurant_setmenu_id: vouchers[index].itemId, unit_price: vouchers[index].unitPrice,
      total_price: vouchers[index].totalPrice, remarks: vouchers[index].remarks, total_vat: vouchers[index].totalVat, vat_cal: vouchers[index].vatCal,
      promo_cal: vouchers[index].promoCal, total_promo: vouchers[index].totalPromo
    }))
    setTempTotal(vouchers[index].totalPrice);
    setTempVat(vouchers[index].totalVat);
    setTempPromo(vouchers[index].totalPromo);
    setTempService(invoice.total_service_charge);
    setCategoryId(vouchers[index]?.catId)
  }


  const UpdateData = (e) => {
    e.preventDefault();

    const newState = vouchers.map(obj => {
      if (obj.id === editId) {

        return {
          ...obj, foodType: invoice.food_type, itemId: (invoice.food_type == 'add-food' ? invoice.restaurant_food_id : invoice.restaurant_setmenu_id),
          itemName: invoice.food_name, catId: categoryId, remarks: invoice.remarks,
          unitPrice: invoice.unit_price, item_qty: invoice.qty, totalPrice: invoice.total_price,
          foodVat: invoice.food_vat, totalVat: invoice.total_vat, foodPromo: invoice.food_promo, totalPromo: invoice.total_promo
        };

      }
      return obj;
    });

    setVourchers(newState);
    e.target.reset();

    setInvoice(prev => ({
      ...prev, total_service_charge: (((Number(invoice.net_total) - Number(tempTotal)) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100,
    }))

    setSubTotal(Number(subTotal) - Number(tempService) - Number(tempTotal) - Number(tempVat) + (((Number(invoice.net_total) - Number(tempTotal) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100) + Number(invoice.total_price) + Number(invoice.total_vat))

    setInvoice(prev => ({
      ...prev, restaurant_setmenu_id: null, restaurant_food_id: null, food_type: "", qty: null, unit_price: null, total_price: null, remarks: "", food_vat: null, total_vat: null, vat_cal: null, food_promo: null, total_promo: null, promo_cal: null
    }))
    setCategoryId(null)
    setObjEdit(false)

    setInvoice(prev => ({
      ...prev, sub_total: ((Number(invoice.sub_total) - Number(tempService) - Number(tempTotal) - Number(tempVat)) + Number(tempPromo) + Number(invoice.total_price) + Number(invoice.total_vat) + (((Number(invoice.net_total) - Number(tempTotal) + Number(invoice.total_price)) * Number(invoice.service_charge)) / 100) - Number(invoice.total_promo)),
      net_total: (Number(invoice.net_total) - Number(tempTotal)) + Number(invoice.total_price),
      net_vat: (Number(invoice.net_vat) - Number(tempVat)) + Number(invoice.total_vat),
      net_promo: (Number(invoice.net_promo) - Number(tempPromo)) + Number(invoice.total_promo),
    }))

  }

  const [deleteId, setDeleteId] = useState(null);
  async function removeObjectFromArray(id, index) {

    setDeleteId(id)

    setInvoice(prev => ({
      ...prev,
      total_price: vouchers[index].totalPrice, total_vat: vouchers[index].totalVat,
      total_promo: vouchers[index].totalPromo
    }))
    setTempService(invoice.total_service_charge);

    setVourchers(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
  };

  useEffect(() => {

    if (deleteId != null) {

      setInvoice(prev => ({
        ...prev, total_service_charge: ((Number(invoice.net_total) - Number(invoice.total_price)) * Number(invoice.service_charge)) / 100,
      }))

      setSubTotal((Number(subTotal) - ((Number(invoice.total_price) * Number(invoice.service_charge)) / 100) - Number(invoice.total_price) - Number(invoice.total_vat)) + Number(invoice.total_promo))

      setInvoice(prev => ({
        ...prev, sub_total: (Number(invoice.sub_total) - ((Number(invoice.total_price) * Number(invoice.service_charge)) / 100) - Number(invoice.total_price) - Number(invoice.total_vat)) + Number(invoice.total_promo),
        net_total: (Number(invoice.net_total) - Number(invoice.total_price)),
        net_vat: (Number(invoice.net_vat) - Number(invoice.total_vat)),
        net_promo: (Number(invoice.net_promo) - Number(invoice.total_promo)),
      }))

    }
  }, [deleteId])

  const changeCategory = (e) => {
    if (e.value) {
      setCategoryId(e.value);
      setCategoryName(e.label);
    }
  }

  const getItemByCategory = async () => {
    let isSubscribed = true;
    if (categoryId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { action: "getItemByCategory", id: categoryId })
        .then((res) => {
          if (isSubscribed) {
            setCategoryItemData(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  console.log('vouchers list', vouchers);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`, { action: "createInvoice", ...invoice,invoice_date,vouchers })
      .then((res) => {
        setLoading(false)
        notify("success", "successfully Added!");
        router.push(`/modules/restaurant/food-order/details/${res.data.data}`);
        setVourchers([])
        e.target.reset();
      })
      .catch((e) => {
        setLoading(false)
        const msg = e.response?.data?.response;

        if (typeof (e.response?.data?.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg?.invoice_date) {
            notify("error", `Invoice date must not be empty`);
          }
          if (msg?.customer_type) {
            notify("error", `Customer type must not be empty`);
          }
        }
      });
  }



  const [prevRoom, setPrevRoom] = useState('');
  const [updatedRoomtxt, setUpdatedRmTxt] = useState('');
  const [selected_customer, setSelectedCustomer] = useState({});
  const [disabled2, setDisabled2] = useState(true);
  const [rmNmbrField, setRmNmbrField] = useState(false);
  const [show, setShow] = React.useState(true);




  const customerSelection = async () => {
    const controller = new AbortController();
    setIsLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`, { action: "customSearchByRoomno", room_no: updatedRoomtxt })
      .then((res) => {
        setSelectedCustomer({ value: res?.data?.data?.customer_id, label: res?.data?.data?.title + " " + res?.data?.data?.first_name + " " + res?.data?.data?.last_name });
      })


      .catch((e) => {

        let msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
          setShow(!show)
        }

        setLoading(false);
      });

  }


  const handleChangeRoom = (event) => {
    setPrevRoom(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      setDisabled2(!disabled2);
      setRmNmbrField(!rmNmbrField);
      customerSelection();

      // if (!!selected_customer?.value === false) {
      //   setShow(!show)
      // }

    }


  };


  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })



    //breadcrumbs
    const breadcrumbs = [
      { text: 'Dashboard', link: '/dashboard' },
      { text: 'Restaurant Invoices', link: '/modules/restaurant/food-order' },
    ];



  return (

    <>
      <div className="container-fluid ">
      <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} />
        <div className="row">
          <div className="col-md-6">


            <div className="card">

              <div className="card-body border-bottom">
                <h4 className="card-title">Restaurant Invoice</h4>
              </div>

              <div className="card-body border-bottom">
                <Form.Group >
                  <div className="mb-3 row">
                    <Label text="Customer type" />
                    {/* <Form.Label>Customer type <span className="text-danger"></span></Form.Label> */}
                    <div className="col-sm-10">


                      <div className="row">
                        <div className="flex-gap align-items-center">

                          <RadioButton
                            label="Hotel Customer"
                            name="customer_type"
                            id="Hotel Customer"
                            value="hotel-customer"
                            checked={invoice.customer_type == "hotel-customer"}
                            onChange={handleChange}
                          />


                          <RadioButton
                            label="Walk In Customer"
                            name="customer_type"
                            id="Walk In Customer"
                            value="walk-in-customer"
                            checked={invoice.customer_type == "walk-in-customer"}
                            onChange={handleChange}
                          />

                        </div>
                      </div>

                    </div>
                  </div>
                </Form.Group>
                <div className={`${(invoice.customer_type == 'hotel-customer') ? '' : 'd-none'}`}>
                  <div className="mb-3 row">

                    {
                      show &&
                      <TextInput label="Room number"
                        placeholder="Enter the room number"
                        // value={prevRoom}
                        className="form-control"
                        onChange={(e) => setUpdatedRmTxt(e.target.value)}
                        onKeyDown={handleKeyDown}
                      // disabled={rmNmbrField}

                      />

                    }


                    <Label text="Customer Name" />
                    <div className="col-sm-10">
                      {

                        !!selected_customer?.value === true &&
                        <Select2
                          placeholder="Select  Customer"
                          options={customer_options?.map(({ id, title, first_name, last_name }) => ({
                            value: id,
                            label: title + " " + first_name + " " + last_name,
                          }))}
                          onChange={(e) => { setInvoice(prev => ({ ...prev, customer_id: e?.value })); setCustomerName(e) }}

                          defaultValue={selected_customer}
                        // isDisabled={disabled2}

                        />
                      }

                      {

                        !!selected_customer?.value === false &&
                        <Select2
                          placeholder="Select  Customer"
                          options={customer_options?.map(({ id, title, first_name, last_name }) => ({
                            value: id,
                            label: title + " " + first_name + " " + last_name,
                          }))}
                          onChange={(e) => { setInvoice(prev => ({ ...prev, customer_id: e?.value })); setCustomerName(e) }}
                          isLoading={isLoading}
                          isClearable={true}
                        // isDisabled={disabled2}
                        />

                      }
                    </div>

                  </div>
                </div>

                <div className={`${(invoice.customer_type == 'walk-in-customer') ? '' : 'd-none'}`}>

                  <TextInput label="Guest Customer" name="guest_customer" placeholder="Enter The Guest Name" onChange={handleChange} />

                </div>

                <div className="mb-3 row">
                  <Label text="Select Floor" />
                  <div className="col-sm-10">
                    <Select name="floor_id" value={invoice.floor_id} onChange={handleChange} >
                      <option value="">Select Floor</option>
                      {getFloors &&
                        getFloors?.map((floor, ind) => (
                          <>
                            <option value={floor.id}>{floor.name}</option>
                          </>
                        ))
                      }
                    </Select>
                  </div>
                </div>

                <div className={`${(invoice.floor_id != null) ? '' : 'd-none'}`}>
                  <div className="mb-3 row">
                    <Label text="Select Table" />
                    <div className="col-sm-10">
                      <Select name="restaurant_table_id" value={invoice.restaurant_table_id} onChange={handleChange} >
                        <option value="">Select Table</option>
                        {tableList &&
                          tableList?.map((table, ind) => (
                            <>
                              <option value={table.id}>{table.table_no}</option>
                            </>
                          ))
                        }
                      </Select>
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {objedit ? (
              <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Update Voucher</h4>
                </div>
                <form onSubmit={UpdateData}>
                  <div className="card-body">
                    <Form.Group >
                      <div className="mb-3 row">
                        <Label text="Select Food type" />
                        <div className="col-sm-10">
                          {/* <Select value={invoice.food_type} name="food_type" onChange={handleChange}>
                          <option value="">Select...</option>
                          <option value="add-food">Add food</option>
                          <option value="add-setmenu">Add Setmenu</option>
                        </Select> */}


                          <div className="row">
                            <div className="flex-gap align-items-center">

                              <RadioButton
                                label="Add food"
                                id="Add food"
                                name="food_type"
                                value="add-food"
                                checked={invoice.food_type == "add-food"}
                                onChange={handleChange}
                              />


                              <RadioButton
                                label="Add Setmenu"
                                id="Add Setmenu"
                                name="food_type"
                                value="add-setmenu"
                                checked={invoice.food_type == "add-setmenu"}
                                onChange={handleChange}

                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form.Group>





                    <div className={`${(invoice.food_type == 'add-food') ? '' : 'd-none'}`}>
                      <div className="mb-3 row">
                        <Label text="Select Category" />
                        <div className="col-sm-10">
                          {categoryId === null &&
                            <Select2
                              options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={changeCategory}
                            />
                          }
                          {categoryId !== null &&
                            <Select2
                              options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={changeCategory}
                              value={{ value: categoryId, label: categoryName }}
                            />
                          }
                        </div>
                      </div>

                      {pending &&
                        <div className="mb-3 row">
                          <Label text="Select Item" />
                          <div className="col-sm-10">
                            <Select2
                              options={categoryItemData?.map(({ id, name }) => ({ value: id, label: name }))}
                              defaultValue={{ value: "", label: "loading..." }}
                            />
                          </div>
                        </div>
                      }

                      {!pending &&
                        <div className="mb-3 row">
                          <Label text="Select Item" />
                          <div className="col-sm-10">
                            {invoice?.restaurant_food_id === null &&
                              <Select2
                                options={categoryItemData?.map(({ id, name, price, tax_head, restaurant_promo_offer }) => ({
                                  value: id, label: name, price: price,
                                  vat: tax_head?.tax || 0, promo: restaurant_promo_offer?.discount_amount, promoPercentage: restaurant_promo_offer?.discount_percentage, promoType: restaurant_promo_offer?.promo_type,
                                  promoStart: restaurant_promo_offer?.start_date, promoEnd: restaurant_promo_offer?.end_date,
                                }))}
                                onChange={handleItemSelectChange}
                                onInputChange={(e) => setFoodNameSearch(e)}
                                isLoading={isLoading}
                                isClearable={true}
                              />
                            }

                            {invoice?.restaurant_food_id !== null &&
                              <Select2
                                options={categoryItemData?.map(({ id, name, price, tax_head, restaurant_promo_offer }) => ({
                                  value: id, label: name, price: price,
                                  vat: tax_head?.tax || 0, promo: restaurant_promo_offer?.discount_amount, promoPercentage: restaurant_promo_offer?.discount_percentage, promoType: restaurant_promo_offer?.promo_type,
                                  promoStart: restaurant_promo_offer?.start_date, promoEnd: restaurant_promo_offer?.end_date,
                                }))}
                                onChange={handleItemSelectChange}
                                onInputChange={(e) => setFoodNameSearch(e)}
                                isLoading={isLoading}
                                isClearable={true}
                                value={{ value: invoice.restaurant_food_id, label: invoice.food_name }}
                              />
                            }
                          </div>
                        </div>
                      }
                    </div>

                    <div className={`${(invoice.food_type == 'add-setmenu') ? '' : 'd-none'}`}>
                      <div className="mb-3 row">
                        <Label text="Select Setmenu" />
                        <div className="col-sm-10">
                          {invoice?.restaurant_setmenu_id === null &&
                            <Select2
                              options={setmenuItemData?.map(({ id, name, price }) => ({ value: id, label: name, price: price }))}
                              onInputChange={(e) => setSetmenuNameSearch(e)}
                              onChange={(e) => setInvoice(prev => ({
                                ...prev, restaurant_setmenu_id: e?.value, unit_price: e?.price, food_name: e?.label, qty: 1, total_price: e?.price, total_vat: 0
                              }))}
                              isLoading={isLoading}
                              isClearable={true}
                            />
                          }
                          {invoice?.restaurant_setmenu_id !== null &&
                            <Select2
                              options={setmenuItemData?.map(({ id, name, price }) => ({ value: id, label: name, price: price }))}
                              onInputChange={(e) => setSetmenuNameSearch(e)}
                              onChange={(e) => setInvoice(prev => ({
                                ...prev, restaurant_setmenu_id: e?.value, unit_price: e?.price, food_name: e?.label, qty: 1, total_price: e?.price, total_vat: 0
                              }))}
                              isLoading={isLoading}
                              isClearable={true}
                              value={{ value: invoice.restaurant_setmenu_id, label: invoice.food_name }}
                            />
                          }
                        </div>
                      </div>
                    </div>

                    <TextInput type="text" defaultValue={invoice.unit_price} readOnly={true} label="Price" placeholder="item Price" required />

                    <TextInput label="Qty" type="number" name="qty" value={invoice.qty} onChange={handleChange} />

                    <TextInput type="text" value={invoice.total_price} readOnly={true} label="Total Price" placeholder="Total Price" required />

                    <TextInput type="text" value={invoice.total_vat} readOnly={true} label="Vat" placeholder="item vat" required />

                    <TextInput type="text" value={invoice.total_promo} readOnly={true} label="Promo" placeholder="item promo" required />

                    <TextInput label="Remarks" name="remarks" placeholder="Remarks" value={invoice.remarks} onChange={handleChange} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <button className="btn-info">
                        Update
                      </button>
                      <button onClick={() => setObjEdit(false)} className="btn-dark">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Create Voucher</h4>
                </div>

                <form onSubmit={StoringData}>
                  <div className="card-body">
                    <Form.Group >
                      <div className="mb-3 row">
                        <Label text="Select Food type" />
                        <div className="col-sm-10">
                          {/* <Select name="food_type" onChange={handleChange}>
                          <option value="">Select...</option>
                          <option value="add-food">Add food</option>
                          <option value="add-setmenu">Add Setmenu</option>
                        </Select> */}

                          <div className="row">
                            <div className="flex-gap align-items-center">
                              <RadioButton
                                label="Add food"
                                name="food_type"
                                value="add-food"
                                id="Add food"
                                checked={invoice.food_type == "add-food"}
                                onChange={handleChange}
                              />

                              <RadioButton
                                label="Add Setmenu"
                                id="Add Setmenu"  
                                name="food_type"
                                value="add-setmenu"
                                checked={invoice.food_type == "add-setmenu"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form.Group>
                    <div className={`${(invoice.food_type == 'add-food') ? '' : 'd-none'}`}>
                      <div className="mb-3 row">
                        <Label text="Select Category" />
                        <div className="col-sm-10">
                          {categoryId === null &&
                            <Select2
                              options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={changeCategory}
                            />
                          }
                          {categoryId !== null &&
                            <Select2
                              options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={changeCategory}
                              defaultValue={{ value: categoryId, label: categoryName }}
                            />
                          }
                        </div>
                      </div>


                      {pending &&
                        <div className="mb-3 row">
                          <Label text="Select Item" />
                          <div className="col-sm-10">
                            <Select2
                              options={categoryItemData?.map(({ id, name }) => ({ value: id, label: name }))}
                              defaultValue={{ value: "", label: "loading..." }}
                            />
                          </div>
                        </div>
                      }

                      {!pending &&
                        <div className="mb-3 row">
                          <Label text="Select Item" />
                          <div className="col-sm-10">
                            {invoice?.restaurant_food_id === null &&
                              <Select2
                                options={categoryItemData?.map(({ id, name, price, tax_head, restaurant_promo_offer }) => ({
                                  value: id, label: name, price: price,
                                  vat: tax_head?.tax || 0, promo: restaurant_promo_offer?.discount_amount, promoPercentage: restaurant_promo_offer?.discount_percentage, promoType: restaurant_promo_offer?.promo_type,
                                  promoStart: restaurant_promo_offer?.start_date, promoEnd: restaurant_promo_offer?.end_date,
                                }))}

                                onChange={handleItemSelectChange}
                                onInputChange={(e) => setFoodNameSearch(e)}
                                isLoading={isLoading}
                                isClearable={true}
                              />
                            }

                            {invoice?.restaurant_food_id !== null &&
                              <Select2
                                options={categoryItemData?.map(({ id, name, price, tax_head, restaurant_promo_offer }) => ({
                                  value: id, label: name, price: price, vat: tax_head?.tax,
                                  promo: restaurant_promo_offer?.discount_amount, promoPercentage: restaurant_promo_offer?.discount_percentage, promoType: restaurant_promo_offer?.promo_type,
                                  promoStart: restaurant_promo_offer?.start_date, promoEnd: restaurant_promo_offer?.end_date,
                                }))}

                                onChange={handleItemSelectChange}
                                onInputChange={(e) => setFoodNameSearch(e)}
                                isLoading={isLoading}
                                isClearable={true}
                                defaultValue={{ value: invoice.restaurant_food_id, label: invoice.food_name }}
                              />
                            }
                          </div>
                        </div>
                      }
                    </div>

                    <div className={`${(invoice.food_type == 'add-setmenu') ? '' : 'd-none'}`}>
                      <div className="mb-3 row">
                        <Label text="Select Setmenu" />
                        <div className="col-sm-10">
                          {invoice?.restaurant_setmenu_id === null &&
                            <Select2
                              options={setmenuItemData?.map(({ id, name, price }) => ({ value: id, label: name, price: price }))}
                              onInputChange={(e) => setSetmenuNameSearch(e)}
                              onChange={(e) => setInvoice(prev => ({
                                ...prev, restaurant_setmenu_id: e?.value, unit_price: e?.price, food_name: e?.label, qty: 1, total_price: e?.price
                              }))}
                              isLoading={isLoading}
                              isClearable={true}
                            />
                          }
                          {invoice?.restaurant_setmenu_id !== null &&
                            <Select2
                              options={setmenuItemData?.map(({ id, name, price }) => ({ value: id, label: name, price: price }))}
                              onInputChange={(e) => setSetmenuNameSearch(e)}
                              onChange={(e) => setInvoice(prev => ({
                                ...prev, restaurant_setmenu_id: e?.value, unit_price: e?.price, food_name: e?.label, qty: 1, total_price: e?.price
                              }))}
                              isLoading={isLoading}
                              isClearable={true}
                              defaultValue={{ value: invoice.restaurant_setmenu_id, label: invoice.food_name }}
                            />
                          }
                        </div>
                      </div>
                    </div>

                    <TextInput type="text" defaultValue={invoice.unit_price} readOnly={true} label="Price" placeholder="item Price" required />

                    <TextInput type="number" min="1" defaultValue={invoice.qty} name="qty" label="Qty" placeholder="item qty" onChange={handleChange} />

                    <TextInput type="text" defaultValue={invoice.total_price} readOnly={true} label="Total Price" placeholder="Total Price" required />

                    <TextInput type="text" defaultValue={invoice.total_vat} readOnly={true} label="Vat" placeholder="item vat" required />

                    <TextInput type="text" defaultValue={invoice.total_promo} readOnly={true} label="Promo" placeholder="item promo offer" required />


                    <TextInput label="Remarks" name="remarks" placeholder="Remarks" onChange={handleChange} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button className="btn-info">
                        Add to Voucher
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}


          </div>

          <div className="col-6">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Items</h4>
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
                        <th>Sl</th>
                        <th>Item Name</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Total Vat</th>
                        <th>Total Promo</th>
                        <th>Total Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers?.map((item, index) => (
                        <>
                          {item.itemId !== null && (
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td>{item.itemName}</td>
                              <td>{item.unitPrice}</td>
                              <td>{item.item_qty}</td>
                              <td>{item.totalVat}</td>
                              <td>{item.totalPromo}</td>
                              <td>{item.totalPrice}</td>
                              <td>
                                <ul className="action">
                                  <li>
                                    <Link href="#">
                                      <a onClick={() => editobj(index, item.id, item.foodType)}>
                                        <EditIcon />
                                      </a>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href='#'>
                                      <a onClick={() => removeObjectFromArray(item.id, index)}>
                                        <DeleteIcon />
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}

                    </tbody>
                    {invoice.net_total != 0 &&
                      <tr style={{ background: 'pink' }}>
                        <td colspan="4" style={{ textAlign: 'right' }}>Vat: </td>
                        <td>{invoice.net_vat}</td>
                        <td>{invoice.net_promo}</td>
                        <td colspan="2" style={{ textAlign: 'left' }}>Total: {invoice.net_total}</td>
                      </tr>
                    }
                  </table>
                  {!!invoice.net_vat && <div className='text-end fw-bold mb-3 me-2'>Total Vat (%): <span>{invoice.net_vat && Number(invoice.net_vat).toFixed(2)}</span></div>}
                  {!!invoice.net_promo && <div className='text-end fw-bold mb-3 me-2'>Total Promo(-): <span>{invoice.net_promo && Number(invoice.net_promo).toFixed(2)}</span></div>}
                  {!!invoice.total_service_charge && <div className='text-end fw-bold mb-3 me-2'>Total Service of ({invoice.service_charge}%): <span>{invoice.total_service_charge && Number(invoice.total_service_charge).toFixed(2)}</span></div>}
                  {!!invoice.discount && <div className='text-end fw-bold mb-3 me-2'>Discount(-): <span>{invoice.discount && Number(invoice.discount).toFixed(2)}</span></div>}
                  <hr />
                  {!!invoice.sub_total && <div className='text-end fw-bold mb-3 me-2'>Total Amount: <span>{invoice.sub_total && Number(invoice.sub_total).toFixed(2)}</span></div>}

                  <form onSubmit={submitForm}>

                    <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Remarks:</label>
                      <div className="col-md-5">
                        <input type="text" name="invoice_remarks" placeholder="Voucher Remarks" className="form-control" onChange={handleChange} />
                      </div>
                    </div>

                    {(invoice.service_type == 'always-apply') &&
                      <>
                        <div className="mb-3 row col-md-12">
                          <label className="col-md-3 col-form-label ">Service Charge (%):</label>
                          <div className="col-md-5 form-check form-switch" style={{ fontSize: '150%' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked={true}
                              disabled
                            />
                          </div>
                        </div>
                      </>
                    }

                    {(invoice.service_type == 'flexible') &&
                      <>
                        <div className="mb-3 row col-md-12">
                          <label className="col-md-3 col-form-label ">Service Charge (%):</label>
                          <div className="col-md-5 form-check form-switch" style={{ fontSize: '150%' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              name="service_charge"
                              onChange={() => setIsService(!isService)}
                              checked={isService}
                            />
                          </div>
                        </div>
                      </>
                    }

                    <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Discount:</label>
                      <div className="col-md-5">
                        <input type="number" name="discount" placeholder="Discount" className="form-control" onChange={handleChange} />
                      </div>
                    </div>

                    <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Date:</label>
                      <div className="col-sm-5">
                        {/* <input type="date" name="invoice_date" onChange={handleChange} className="form-control" id="date" /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker

                              size={1}
                              label="Enter the date"
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={invoice_date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                set_invoice_date(format(new Date(event), 'yyyy-MM-dd'));
                              }}

                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setOpenDate(true)} fullWidth={true} size='small' {...params}  required/>
                                </ThemeProvider>
                              }
                            />
                          </LocalizationProvider>
                      </div>
                    </div>
                    {loading ?
                      <button disabled={loading} className="btn-danger rounded" style={{ float: 'right' }}>
                        Processing...
                      </button>
                      :
                      <button disabled={loading} className="btn-info rounded" style={{ float: 'right' }}>
                        Create Voucher
                      </button>
                    }
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default CreateVoucher; 
