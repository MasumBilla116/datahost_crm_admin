import Link from "next/link";
import React, { useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Table from "react-bootstrap/Table";
import toast from "../../../../../components/Toast/index";
import Select from '../../../../../components/elements/Select';
import {
  DeleteIcon,
  EditIcon,
  HeadSection,
  Select2
} from "../../../../../components/index";
import Axios from '../../../../../utils/axios';
// import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";


const index = () => {

  const { http } = Axios();
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const router = useRouter();
  const { pathname } = router;
  const [loading, setLoading] = useState(false);
  const [customer_type, setCustomer_type] = useState("")
  const [vehicleListt, setVehicleListt] = useState("");
  const [customerListt, setCustomerListt] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [endtime, setEndTime] = useState(null);
  const [customer_id, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [booking_charge, setBooking_charge] = useState(0);
  const [objedit, setObjEdit] = useState(false);
  const [show, setShow] = React.useState(true);
  const [ind, setInd] = useState(1);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [selected_customer, setSelectedCustomer] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [disabled2, setDisabled2] = useState(true);
  const [pickupOpen, setPickupOpen] = useState(false)
  const [pickup2Open, setPickup2Open] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const vehicle_options = vehicleListt.data;
  const customer_options = customerListt.data;
  const handleTotal = (e) => {
    if (e.target.name == "booking_charge") {
      setTotal(parseInt(e.target.value))
    } else {

      setTotal(parseInt(e.target.value));
    }
  };


  const getAllCustomer = async () => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, { action: "getAllcheckinCustomer" })
      .then((res) => {
        if (isSubscribed) {
          setCustomerListt(res.data)
        }
      });
    return () => isSubscribed = false;
  }



  const getAllVehicles = async () => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, { action: "getAllVehicleBydate", date, time, endtime, })
      .then((res) => {

        if (isSubscribed) {
          setVehicleListt(res.data)
        }
      }).catch(error=>{});
    return () => isSubscribed = false;
  }


  const onSelectCustomers = (e) => {
    setCustomers([])
    e.map((x) => {
      setCustomers(customer => [
        ...customer,
        {
          customer_id: x.value,
        }
      ])
    })

  }

  const reset = () => {

    setCustomerName("");
    setBooking_charge(0);
  };

  const StoringData = (e) => {
    //  e.preventDefault();
    setInd(() => ind + 1);
    var vBookingId = [];


    {
      customerInfo.map(booking => {
        vBookingId.push(booking.customer_id);
      })
    }

    if (vBookingId.includes(customer_id)) {
      notify("error", "can not add same customer!");
    }
    else if (booking_charge == 0) {
      notify("error", "Please Enter the booking charge");
    }

    else if (customerName == "") {
      notify("error", "Please Enter the Customer");
    }

    else {
      setCustomerInfo([...customerInfo,
      {
        id: ind,
        customer_id: customer_id,
        customerName: customerName,
        booking_charge: booking_charge,
        customer_type: customer_type,
        booking_type: bookingType,
        vehicle_name: vehicleModel

      }
      ])

    }
    // reset();

  }

  const [editId, setEditId] = useState('');


  function editobj(index, editId) {

    setObjEdit(true)
    setEditId(editId)
    setCustomerId(customerInfo[index]?.customer_id)
    setCustomerName(customerInfo[index]?.customerName)
    setBooking_charge(customerInfo[index]?.booking_charge)
    setSelectedCustomer({ value: customerInfo[index]?.customer_id, label: customerInfo[index]?.customerName });

  }


  const UpdateData = (e) => {

    e.preventDefault();
    const newState = customerInfo.map(obj => {
      if (obj.customer_id === editId) {
        return { ...obj, customer_id: customer_id, customerName: customerName, booking_charge: booking_charge };
      }

      return obj;
    });

    setCustomerInfo(newState);
    setObjEdit(false)
  }


  const disableOnclick = (e) => {
    setShow(!show)
    e.target.disabled = true;
  }


  function handledisableInputs() {
    // setDisabled(!disabled);

    if (customer_type != "" && bookingType != "" && vehicleId != "") {
      setDisabled(true);
    }
    else {
      notify("error", "Please Enter the Basic feel!");

    }
  }



  async function removeObjectFromArray(id) {
    setCustomerInfo((current) =>
      current.filter((obj) => {
        return obj.customer_id !== id;
      })
    );
  }


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // getAllCustomer();
      getAllVehicles();
    });
    return () => clearTimeout(timeout);
  }, [date, time, endtime]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getAllCustomer();
      // getAllVehicles();
    });
    return () => clearTimeout(timeout);
  }, []);




  const totalCharge = customerInfo.reduce((total, item) => {
    return total + parseInt(item.booking_charge)
  }, 0)



  async function submitForm(e) {
    e.preventDefault();


    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`, {
        action: "createVehicleBooking",
        customer_type,
        bookingType,
        vehicleId,
        date,
        time,
        endtime,
        customerInfo,
        totalCharge,

      })
      .then((res) => {
        let bookingId = res.data.data;
        setLoading(false);
        notify("success", "successfully Added!");
        setCustomerInfo([]);
        router.push(`/modules/transport/vehicles/booking`);
      })
      .catch((e) => {
        console.log(e)
        setLoading(false);
        const msg = e.response?.data?.response;
        notify("error", `${msg}`);
      });

  }

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleEndTimeChange = (selectedTime) => {
    setEndTime(selectedTime);
  };



  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Booking', link: '/modules/transport/vehiclesBooking/manageVehiclesBooking' },
    { text: 'Create Booking', link: '/modules/transport/vehiclesBooking/createVehiclesBooking' },
  ]
  return (
    <>
      <HeadSection title="Create Vehicle Booking" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-6 p-xs-2">
            <div className="card  ">
              <div className="card-body border-bottom">
                <h4 className="card-title">Create Vehicle Booking </h4>
              </div>

              <div className="card-body">
                <>

                  <form >
                    <div className="mb-1 mt-2 row">
                      <Form.Group className="mb-1 col-6">
                        <Form.Label>
                          Customer Type: <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          defaultValue=""
                          name="customer_type"
                          onChange={(e) => setCustomer_type(e.target.value)}
                          value={customer_type}
                          required
                          disabled={disabled}
                        >
                          <option value="" disabled>
                            Select...
                          </option>
                          <option value="single">Single Customer</option>
                          <option value="multiple">Multiple Customer</option>
                        </Select>
                      </Form.Group>

                      <Form.Group className="mb-1 col-6">
                        <Form.Label>
                          Booking Type: <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          defaultValue=""
                          name="booking_type"
                          onChange={(e) => { setBookingType(e.target.value); }}
                          required
                          disabled={disabled}

                        >
                          <option value="" disabled>
                            Select...
                          </option>
                          <option value="pick_up">Pick Up</option>
                          <option value="drop_off">Drop Off</option>
                          <option value="round_trip">Round Trip</option>
                          <option value="day_long_trip">Day Long Trip</option>
                        </Select>
                      </Form.Group>

                    </div>


                    <div className="mb-1 mt-2 row">
                      <Form.Group className="mb-1 col-4">
                        <Form.Label>
                          Booking Date: <span className="text-danger">*</span>
                        </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                          <DatePicker

                            open={pickupOpen}
                            onClose={() => setPickupOpen(false)}
                            label="Pick up date"
                            inputFormat="yyyy-MM-dd"
                            value={date}
                            onChange={(event) => setDate(event)}
                            renderInput={(params) =>
                              <TextField onClick={() => setPickupOpen(true)} fullWidth={true} size='small' {...params} required />
                            }
                          />

                        </LocalizationProvider>
                      </Form.Group>
                      <Form.Group className="mb-1 col-4">
                        <Form.Label>
                          Start Time: <span className="text-danger">*</span>
                        </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <TimePicker
                              open={pickup2Open}
                              onClose={() => setPickup2Open(false)}
                              label="Start time"
                              value={time || null}
                              onChange={(newValue) => {
                                setTime(newValue)
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onClick={() => setPickup2Open(true)}
                                  size='small'
                                  {...params}
                                  required
                                  InputProps={{
                                    style: { fontSize: 16, width: '225px' } // Adjust the fontSize and width as per your requirement
                                  }}
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>

                      </Form.Group>

                      <Form.Group className="mb-1 col-4">
                        <Form.Label>
                          End Time: <span className="text-danger">*</span>
                        </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <TimePicker
                              open={endTimeOpen}
                              onClose={() => setEndTimeOpen(false)}
                              label="End time"
                              value={endtime || null}
                              onChange={(newValue) => {
                                setEndTime(newValue)
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onClick={() => setEndTimeOpen(true)}
                                  size='small'
                                  {...params}
                                  required
                                  InputProps={{
                                    style: { fontSize: 16, width: '225px' } // Adjust the fontSize and width as per your requirement
                                  }}
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>

                      </Form.Group>

                    </div>

                    <div className="mb-1 mt-2 row">
                      <Form.Group className="mb-1 col-6">
                        <Form.Label>
                          Vehicle: <span className="text-danger">*</span>
                        </Form.Label>
                        <Select2
                          className='select-bg'
                          placeholder="Select Vehicle"
                          options={vehicle_options?.map(({ id, model }) => ({
                            value: id,
                            label: model,
                          }))}
                          onChange={(e) => { setVehicleId(e.value); setVehicleModel(e.label) }}
                          isDisabled={!date || !time || !endtime} // Corrected isDisabled prop
                          required
                        />
                      </Form.Group>
                    </div>
                  </form>

                </>
              </div>
            </div>
            <div className="card mb-xs-2">
              <div className="card-body border-bottom">



                {!objedit ? (
                  <h4 className="card-title">Add Vehicle Invoice</h4>
                ) : (
                  <h5 className="text-info">Update Customer Info</h5>
                )}

              </div>

              <div className="card-body">




                {objedit ? (

                  <>
                    <div className="">




                      <div className="mb-1 mt-4 row">
                        <label
                          className="col-sm-3 col-lg-3 col-md-3 fw-bolder"
                        >
                          <span className="text-danger">*</span>Customer:
                        </label>
                        <div className="col-sm-8 col-lg-8 col-md-8 ml-2">

                          {
                            !!selected_customer?.value === true &&
                            <Select2
                              placeholder="Select  Customer"
                              options={customer_options?.map(({ id, title, first_name, last_name }) => ({
                                value: id,
                                label: title + " " + first_name + " " + last_name,
                              }))}
                              onChange={(e) => { setCustomerId(e.value); setCustomerName(e.label) }}
                              defaultValue={selected_customer}

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
                              onChange={(e) => { setCustomerId(e.value); setCustomerName(e.label) }}
                            />
                          }
                        </div>

                      </div>
                      <div className="mb-1 mt-4 row">
                        <label
                          className="col-sm-3 col-lg-3 col-md-3 fw-bolder"

                        >
                          <span className="text-danger">*</span>Booking Charge
                        </label>
                        <div className="col-sm-8 col-lg-8 col-md-8 ml-2">

                          <input
                            type="number"
                            name="booking_charge"
                            placeholder="Unit Price"
                            className="form-control"
                            defaultValue={booking_charge}
                            onChange={(e) => { setBooking_charge(e.target.value) }}
                            required
                          />

                        </div>

                      </div>

                      <div className="p-3">
                        <div className="text-center" style={{ display: "flex", justifyContent: "flex-end" }}>
                          <>
                            <div style={{ marginRight: "8px" }}>
                              <Button
                                variant="primary"
                                type="submit"
                                onClick={UpdateData}
                              >
                                Update
                              </Button>
                            </div>
                            <div>
                              <Button
                                onClick={() => {
                                  setObjEdit(false);
                                  // reset();
                                }}
                                variant="danger"
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        </div>
                      </div>
                    </div>

                  </>
                ) : (

                  <>

                    <div className="mb-1 mt-4 row">
                      <label
                        className="col-sm-3 col-lg-3 col-md-3 fw-bolder"

                      >
                        <span className="text-danger">*</span>Customer:
                      </label>
                      <div className="col-sm-8 col-lg-8 col-md-8 ml-2">

                        <Select2
                          placeholder="Select  Customer"
                          options={customer_options?.map(({ id, title, first_name, last_name }) => ({
                            value: id,
                            label: title + " " + first_name + " " + last_name,
                          }))}
                          onChange={(e) => { setCustomerId(e.value); setCustomerName(e.label) }}
                        // isDisabled={disabled2}
                        />

                      </div>

                    </div>
                    <div className="mb-1 mt-4 row">
                      <label
                        className="col-sm-3 col-lg-3 col-md-3 fw-bolder"
                      >
                        <span className="text-danger">*</span>Booking Charge
                      </label>
                      <div className="col-sm-8 col-lg-8 col-md-8 ml-2">

                        <input
                          type="number"
                          name="booking_charge"
                          placeholder="Unit Price"
                          className="form-control"
                          defaultValue=""
                          // disabled={disabled2}
                          onChange={(e) => { setBooking_charge(e.target.value) }}
                          required
                        />

                      </div>

                    </div>
                    {customer_type === "single" ?
                      <>


                        <div className="p-3">
                          <div className="text-center">
                            {
                              show &&
                              <Button
                                style={{ float: "right" }}
                                variant="primary"
                                type="submit"
                                onClick={(e) => { disableOnclick(e); StoringData(); handledisableInputs() }}
                              // disabled={disabled2}
                              >
                                Add To Receive
                              </Button>
                            }
                          </div>
                        </div>

                      </>

                      :
                      <>

                        <div className="p-3">
                          <div className="text-center">
                            <Button
                              style={{ float: "right" }}
                              variant="primary"
                              type="submit"
                              onClick={(e) => { StoringData(); handledisableInputs(); }}
                            // disabled={disabled2}
                            >
                              Add to Receive
                            </Button>
                          </div>
                        </div>
                      </>

                    }


                  </>
                )}


              </div>
            </div>
          </div>
          <div className="col-lg--6 col-md-6 col-sm-12 p-xs-2">
            <div className="card mb-xs-2">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Booking</h4>
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <div className="p-3">
                    <Table striped bordered hover>
                      <thead className="bg-light border-0">
                        <tr className="text-center">
                          <th className="fw-bolder">Customer Type</th>
                          <th className="fw-bolder">Customer Id</th>
                          <th className="fw-bolder">Vehicle Id</th>
                          <th className="fw-bolder">Booking Type</th>
                          <th className="fw-bolder">Booking Charge</th>
                          <th className="fw-bolder">Action</th>


                        </tr>
                      </thead>
                      <tbody>

                        {!!(customerInfo.length) && customerInfo?.map((bookings, index) => (
                          <>


                            <tr className="text-center" key={index}>

                              <td>{bookings.customer_type}</td>
                              <td>{bookings.customerName}</td>
                              <td>{bookings.vehicle_name}</td>
                              <td>{bookings.booking_type}</td>

                              <td>{bookings.booking_charge}</td>
                              <td>
                                <ul className="action">


                                  <li>
                                    <Link href="#">
                                      <a
                                        onClick={() =>
                                          editobj(index, bookings.customer_id)
                                        }
                                      >
                                        <EditIcon />
                                      </a>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <a
                                        onClick={() => {
                                          removeObjectFromArray(bookings.customer_id);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </a>
                                    </Link>
                                  </li>

                                </ul>
                              </td>

                            </tr>
                          </>

                        ))}
                      </tbody>
                    </Table>


                    {!!totalCharge && (<div className="text-end fw-bold mb-3 me-2">
                      Total Amount:{" "}
                      <span>
                        {totalCharge.toFixed(2)}
                      </span>



                      <div className="text-end">
                        <Button
                          variant="success"
                          style={{ float: "right" }}
                          onClick={submitForm}
                        >
                          Create Invoice
                        </Button>
                      </div>
                    </div>)}


                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default index;
