import Switch from "@mui/material/Switch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import MyToast from "@mdrakibul8001/toastify";
import Axios from "../../../../utils/axios";

//mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useRouter } from "next/router";
import RadioButton from "../../../../components/elements/RadioButton";
import Select2 from "../../../../components/elements/Select2";
import HeadSection from "../../../../components/HeadSection";
import { AddNewClient } from "../corporate/details/[id]";

const CreateCustomer = () => {
  const { notify } = MyToast();
  const router = useRouter();

  const { http } = Axios();

  //calender open
  const [dobOpen, setDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [corporateID, setCorporateID] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsSearch, setClientsSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const [customer, setCustomer] = useState({
    mobile: "",
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
    countryData: [],
    stateData: [],
    cityData: [],

    pin_code: "",
    arrival_from: "",
    address: "",
    status: 1,
  });

  //Set Customer
  const handleChange = (e) => {
    setCustomer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  //fetch all clients
  const getallClients = async () => {
    let body = {};
    body = {
      action: "getAllClients",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`,
        body
      )
      .then((res) => {
        const clients = res?.data?.data; 
        
        if(clients.length > 0)
        {
            setClients(
                clients.filter((client) => client?.status === 1)
              );
              setClientsSearch(
                clients.filter((client) => client?.status === 1)
              );
        }
        
          
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllContries();
     getallClients();
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

  const formRef = useRef(null);
  

  async function submitForm(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    e.preventDefault();

    let body = {
      ...customer,
      action: "createIndividualCustomer",
    };

    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        body
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res.data.response}`);
          if(active)
          {
            router.push("/modules/customer/corporate");
          }
          router.push("/modules/customer/general");
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
          setOpenView(false);
          setValidated(false);
         
           
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        } else {
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 ">
          <div className="card">
            <div className="card-body">
              <div className="container-fluid ">
                <HeadSection title="Add New Customer" />
                <div className="w-100 d-flex justify-content-between">
                  <h3 className="card-title fw-bold fs-6 pt-3 ps-3">
                    {active
                      ? " Add Corporate Customer"
                      : "Add General Customer"}
                  </h3>
                  <div className="text-end  pt-3 pe-3">
                    <span className="fw-bold">Activate Client </span>{" "}
                    <Switch onClick={(e) => setActive(!active)} />
                  </div> 
                </div>
                <div className="row">
                    <div className="col-md-12 ps-4 pe-4">
                    <hr/>
                    </div>
                </div>
               
                {!active ? (
                  <Form
                    onSubmit={submitForm}
                    id="customerForm"
                    noValidate
                    validated={validated}
                    ref={formRef}
                  >
                    <div className="row">
                      <div className="col-12 col-md-12 m-auto">
                        <div className="card-body">
                          <div className="row">
                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Mobile Number{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                placeholder="Enter Mobile Number"
                                name="mobile"
                                value={customer?.mobile}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-2 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Contact Type{" "}
                                <span className="text-danger">*</span>
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
                            <Form.Group className=" col-md-4 col-lg-4">
                              <Form.Label className="">
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

                            <Form.Group className=" col-md-4 col-lg-4">
                              <Form.Label className="">
                                First Name{" "}
                                <span className="text-danger">*</span>
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

                            <Form.Group className=" col-md-4 col-lg-4">
                              <Form.Label className="">
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

                          <Form.Group className="mb-4 mt-3 row">
                            <div className="col-md-6 col-lg-6">
                              <Form.Label className=" m-0">
                                Gender <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="row m-0 ">
                                <div className="col-12">
                                  <div className=" align-content-start flex-gap">
                                    <div>
                                      <RadioButton
                                        id="male"
                                        label="Male"
                                        name="gender"
                                        value="male"
                                        checked={customer?.gender == "male"}
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div>
                                      <RadioButton
                                        id="female"
                                        label="Female"
                                        name="gender"
                                        value="female"
                                        checked={customer?.gender == "female"}
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div>
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
                                </div>
                              </div>
                            </div>
                          </Form.Group>

                          <div className="row mb-2">
                            <Form.Group className="mb-2 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Date of Birth{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  // size={1}
                                  // label="Date of Birth"
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

                            <Form.Group className="mb-2 col-md-6 col-lg-6">
                              <Form.Label>Anniversary Date</Form.Label>

                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  disabled={active}
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
                                      onClick={() =>
                                        !active && setAnniversaryOpen(true)
                                      }
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
                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Nationality{" "}
                                <span className="text-danger">*</span>
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
                            <Form.Group className="mb-2 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Country <span className="text-danger">*</span>
                              </Form.Label>

                              <Select2
                                options={customer.countryData.map(
                                  ({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  })
                                )}
                                onChange={changeState}
                              />
                            </Form.Group>
                          </div>

                          {/* show state city or selected */}
                          <div className="row">
                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                State <span className="text-danger">*</span>
                              </Form.Label>

                              <Select2
                                options={customer.stateData.map(
                                  ({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  })
                                )}
                                onChange={changeCity}
                              />
                            </Form.Group>

                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                City <span className="text-danger">*</span>
                              </Form.Label>

                              <Select2
                                options={customer.cityData.map(
                                  ({ id, name }) => ({
                                    value: id,
                                    label: name,
                                  })
                                )}
                                onChange={(e) =>
                                  setCustomer((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </div>

                          <div className="row">
                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Post Code <span className="text-danger">*</span>
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

                            <Form.Group className="mb-3 col-md-6 col-lg-6">
                              <Form.Label className="">
                                Arrival From{" "}
                                <span className="text-danger">*</span>
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

                          <Form.Group className="mb-3">
                            <Form.Label className="">
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

                          <div className="row">
                            <div className="col-12">
                              <div className="text-end ">
                                <Button
                                  type="submit"
                                  variant="primary"
                                  className="btn-sm"
                                >
                                  Add New Customer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                ) : (
                  <>
                    <div className="col-md-4 col-lg-4 ms-auto">
                      <Form.Label className="">
                        Select Corporate <span className="text-danger">*</span>
                      </Form.Label>
                      {clients?.length > 0 ? 
                      <Select2
                        options={
                          clients?.length > 0 &&
                          clients?.map(({ id, name }) => ({
                            value: id,
                            label: name,
                          }))
                        }
                        onChange={(e) => setCorporateID(e?.value)}
                        required
                      />
                      : 
                      <Select2 
                        onChange={(e) => setCorporateID(e?.value)}
                        required
                      />
                      
                      
                      }
                    </div>
                    <AddNewClient
                      id={corporateID}
                      setOpen={setOpenView}
                      updateID={false}
                      getAllCorporateClientsByID={() => console.log("")}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;
