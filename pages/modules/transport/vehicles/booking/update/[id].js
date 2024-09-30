import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from "react-bootstrap/Table";
import toast from "../../../../../../components/Toast/index";
import {
    DeleteIcon,
    EditIcon,
    HeadSection,
    Select2
} from "../../../../../../components/index";
import Axios from '../../../../../../utils/axios';
import { Form, Modal } from "react-bootstrap";
const index = () => {

    const { http } = Axios();
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);
    const router = useRouter();
    const { pathname } = router;
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const [customer_type, setCustomer_type] = useState("")
    const [vehicleListt, setVehicleListt] = useState("");
    const [customerListt, setCustomerListt] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [bookingType, setBookingType] = useState("");
    const [date, setDate] = useState("");
    const [customer_id, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [booking_charge, setBooking_charge] = useState("");
    const [objedit, setObjEdit] = useState(false);
    const [show, setShow] = React.useState(true);
    const [ind, setInd] = useState(1)
    const [customerInfo, setCustomerInfo] = useState([]);
    const [modelName, setModelName] = useState([]);
    const [vehicleBookingInfo, setVehicleBookingInfo] = useState([]);
    const [selected_customer, setSelectedCustomer] = useState({});
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, { action: "getAllVehicle" })
            .then((res) => {

                if (isSubscribed) {
                    setVehicleListt(res.data)
                }
            });
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
        setBooking_charge("");
        setCustomerId("");
    };

    const StoringData = (e) => {
        e.preventDefault();
        setInd(() => ind + 1)
        var vBookingId = [];


        {
            customerInfo.map(booking => {
                vBookingId.push(booking.customer_id);
            })
        }

        if (vBookingId.includes(customer_id)) {
            notify("error", "can not add same customer!");
        }

        else {
            setCustomerInfo([...customerInfo,
            {
                id: ind,
                customer_id: customer_id,
                customerName: customerName,
                booking_charge: booking_charge,
            }
            ])

        }
        // setObjEdit(false);
        // setSelectedCustomer({});

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

        setCustomerInfo([])
        const newState = customerInfo.map((obj) => {
            if (obj.customer_id === editId) {
                return { ...obj, customer_id: customer_id, customerName: customerName, booking_charge: booking_charge };
            }
            return obj;
        });
        setCustomerInfo(newState);
        setObjEdit(false);
    }

    const disableOnclick = (e) => {
        setShow(!show)
        e.target.disabled = true;
    }


    function handledisableInputs() {
        setDisabled(!disabled);
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
            getAllCustomer();
            getAllVehicles();
        });
        return () => clearTimeout(timeout);
    }, []);


    useEffect(() => {
        const controller = new AbortController();
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`, {
            action: "getVehicleBookingInfo",
            vehicleBookingId: id,
        })
            .then((res) => {
                setCustomerInfo(res?.data?.data?.vehicleBookDetails);
                setModelName(res?.data?.data?.vehicleBookDetails[0].vehicle_name);
                setVehicleBookingInfo(res?.data?.data);
            });
    }, [id])



    const totalCharge = customerInfo.reduce((total, item) => {
        return total + parseInt(item.booking_charge)
    }, 0)



    async function submitForm(e) {
        e.preventDefault();
        const body = {
            customerInfo,
            totalCharge,
            vehicleBookingId: id
        }

        setLoading(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`, {
                action: "updateVehicleBooking",
                customerInfo,
                totalCharge,
                vehicleBookingId: id
            })
            .then((res) => {
                setLoading(false);
                notify("success", "successfully Updated!");
                setCustomerInfo([]);
                router.push(`/modules/transport/vehicles/booking`);
            })
            .catch((e) => {
                // console.log(e);
                // const msg = e.response?.data?.response;
                // if (typeof msg == "string") {
                //   notify("error", `${msg}`);
                // } else {
                //   if (msg?.date) {
                //     notify("error", `${msg.date.Date}`);
                //   }
                // }
                setLoading(false);
            });

    }

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Booking', link: '/modules/transport/vehiclesBooking/manageVehiclesBooking' },
        { text: 'Update Booking', link: '/modules/transport/vehiclesBooking/manageVehiclesBooking/update/[id]' },
    ]



    return (
        <>
            <HeadSection title="Update Booking" />
            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <h4 className="card-title">Update Vehicle Booking </h4>
                            </div>

                            <div className="card-body">
                                <>



                                    <div className="mb-1 mt-2 row">
                                        <Form.Group className="mb-1 col-6">
                                            <Form.Label>
                                                Customer Type: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input className="form-control" type="text" name="" id="" defaultValue={vehicleBookingInfo.customer_type} disabled />

                                        </Form.Group>

                                        <Form.Group className="mb-1 col-6">
                                            <Form.Label>
                                                Booking Type: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input className="form-control" type="text" name="" id="" defaultValue={vehicleBookingInfo.booking_type} disabled />

                                        </Form.Group>

                                    </div>


                                    <div className="mb-1 mt-2 row">
                                        <Form.Group className="mb-1 col-4">
                                            <Form.Label>
                                                Booking Date: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input

                                                type="date"
                                                placeholder="Invoice Date:"
                                                className="form-control"
                                                // value={date}
                                                required
                                                onChange={(e) => { setDate(e.target.value); }}
                                                id="date"
                                                defaultValue={vehicleBookingInfo.booking_date}
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-1 col-4">
                                            <Form.Label>
                                                Start Time: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input className="form-control" type="text" name="" id="" defaultValue={vehicleBookingInfo.booking_time} disabled />

                                        </Form.Group>

                                        <Form.Group className="mb-1 col-4">
                                            <Form.Label>
                                                End Time: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input className="form-control" type="text" name="" id="" defaultValue={vehicleBookingInfo.booking_end_time} disabled />


                                        </Form.Group>

                                    </div>




                                    <div className="mb-1 mt-2 row">
                                        <Form.Group className="mb-1 col-6">
                                            <Form.Label>
                                                Vehicle: <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input className="form-control" type="text" name="" id="" defaultValue={modelName} disabled />

                                        </Form.Group>
                                    </div>


                                    {/* </form>  */}
                                </>
                            </div>
                        </div>
                        <div className="card">
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
                                                    <span className="text-danger">*</span>  Customer:
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
                                                    <span className="text-danger">*</span> Booking Charge
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
                                                    isDisabled={vehicleBookingInfo.customer_type === 'single' ? true : false}
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
                                                    onChange={(e) => { setBooking_charge(e.target.value) }}
                                                    disabled={vehicleBookingInfo.customer_type === 'single' ? true : false}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="text-center">
                                                {
                                                    show &&
                                                    <Button
                                                        style={{ float: "right" }}
                                                        variant="primary"
                                                        type="submit"
                                                        onClick={StoringData}

                                                        disabled={vehicleBookingInfo.customer_type === 'single' ? true : false}
                                                    >
                                                        Add to Receive
                                                    </Button>
                                                }
                                            </div>
                                        </div>

                                    </>
                                )}


                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
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
                                                    <th className="fw-bolder">Customer Name</th>
                                                    {/* <th className="fw-bolder">Vehicle Name</th> */}
                                                    <th className="fw-bolder">Booking Type</th>
                                                    <th className="fw-bolder">Booking Charge</th>
                                                    <th className="fw-bolder">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {!!(customerInfo.length) && customerInfo?.map((bookings, index) => (
                                                    <>
                                                        <tr className="text-center" key={index}>

                                                            <td>{vehicleBookingInfo.customer_type}</td>
                                                            <td>{bookings.customerName}</td>
                                                            <td>{vehicleBookingInfo.booking_type}</td>

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
                                        </div>)}

                                        <div className="text-end">
                                            <Button
                                                variant="success"
                                                style={{ float: "right" }}
                                                onClick={submitForm}
                                            >
                                                Update Invoice
                                            </Button>
                                        </div>

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
