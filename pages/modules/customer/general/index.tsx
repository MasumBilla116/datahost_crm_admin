import Switch from "@mui/material/Switch";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import MyToast from "@mdrakibul8001/toastify";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../components";
import Axios from "../../../../utils/axios";

//mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import RadioButton from "../../../../components/elements/RadioButton";
import Select2 from "../../../../components/elements/Select2";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import HeadSection from "../../../../components/HeadSection";
import { getSSRProps } from "../../../../utils/getSSRProps";
import { AddNewClient } from "../corporate/details/[id]";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.cstmr.gnrl",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

function CustomerList({ permission, query, accessPermissions }) {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();

  //Sate declaration
  const [clients, setClients] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customersSearch, setCustomersSearch] = useState([]);
  const [serial, setSerial] = useState("");
  const [id, setID] = useState(0);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [active, setActive] = useState(false);

  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageShow, setPerPageShow] = useState(15);
  const [tblLoader, setTblLoader] = useState(true);
  const [filterValue, setFilterValue] = useState({
    status: "all",
    yearMonth: `${y}-${m}`,
    search: null,
    filter: false,
    paginate: true,
  });

  // for data table chagne
  const handleChangeFilter = (e) => {
    setFilterValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true,
    }));
    setSearch("");
  };

  /**** Table  */

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "getAllCustomerList", filterValue: filterValue }
        )
        .then((res) => {
          if (isSubscribed) {
            // setFilteredData(res.data?.data);
            setFilteredData((prev) => ({
              ...prev,
              total: res.data?.data?.total || prev.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage],
            }));
          }
        });
      setFilterValue((prev) => ({
        ...prev,
        filter: false,
        search: null,
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => (isSubscribed = false);
  };

  //fetch all customers
  const getAllCustomer = async () => {
    let body: any = {};
    body = {
      action: "getAllCustomer",
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
      .then((res: any) => {
        const data = res?.data?.data;
        !!data?.length &&
          setCustomers(data.filter((customer) => customer?.status === 1));
        !!data?.length &&
          setCustomersSearch(data.filter((customer) => customer?.status === 1));
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  //fetch all clients
  const getallClients = async () => {
    let body: any = {};
    body = {
      action: "getAllClients",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`,
        body
      )
      .then((res: any) => {
        const data = res?.data?.data;
        !!data?.length &&
          setClients(
            data?.filter((client: { status: number }) => client?.status === 1)
          );
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    getAllCustomer();
    getallClients();

    return () => controller.abort();
  }, []);

  const deleteCustomerByID = async () => {
    setID &&
      (await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, {
          action: "deleteCustomerByID",
          id,
        })
        .then((res: any) => {
          const data = res?.data?.data;
          !!data?.length &&
            setCustomers(data?.filter((data) => data?.status === 1));
          setOpen(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
          notify("success", "Customer " + serial + " deleted successfully");
        })
        .catch((err: any) => {
          console.log(err);
        }));
  };

  const actionButton = (serial: any, id: number) => {
    return (
      <ul className="action mt-3">
        {accessPermissions.listAndDetails && (
          <li>
            <Link href={`/modules/customer/general/details/${id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>
        )}
        {accessPermissions.createAndUpdate && (
          <li>
            <Link href={`#`}>
              <a
                onClick={() => {
                  setOpenUpdate(true);
                  setActive(false);
                  setID(id);
                }}
              >
                <EditIcon />
              </a>
            </Link>
          </li>
        )}
        {accessPermissions.delete && (
          <li>
            <Link href="#">
              <a
                onClick={() => {
                  setOpen(true);
                  setSerial(serial);
                  setID(id);
                }}
              >
                <DeleteIcon />
              </a>
            </Link>
          </li>
        )}
      </ul>
    );
  };

  const GenerateName = (title: any, middle: any, last: any) => {
    if (title && middle && last) {
      return title + " " + middle + " " + last;
    } else if (middle && last) {
      return middle + " " + last;
    } else if (title && middle) {
      return title + " " + middle;
    } else if (middle) {
      return "Mr " + middle;
    }
  };

  const columns: any = [
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row: { title: string; first_name: any; last_name: any }) =>
        GenerateName(row?.title, row?.first_name, row?.last_name),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Mobile</span>,
      selector: (row: { mobile: any }) => (row?.mobile ? row?.mobile : "-"),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Gender</span>,
      selector: (row: { gender: any }) => (
        <span className="text-capitalize">
          {row?.gender ? row?.gender : "-"}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="fw-bold ">Birthday</span>,
      selector: (row: { dob: any }) =>
        row.dob ? moment(row.dob).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    // {
    //   name: <span className="fw-bold">Arrival From</span>,
    //   selector: (row: { arrival_from: any }) =>
    //     row?.arrival_from ? row?.arrival_from : "-",
    //   sortable: true,
    // },

    {
      name: <span className="fw-bold">Balance</span>,
      selector: (row: { balance: any }) =>
        row?.balance ? row?.balance : "-",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Nationality</span>,
      selector: (row: { nationality: any }) =>
        row?.nationality ? row?.nationality : "-",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Address</span>,
      selector: (row: { address: any }) => (row?.address ? row?.address : "-"),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Created At</span>,
      selector: (row: { created_at: any }) =>
        row.created_at ? moment(row.created_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    // {
    //   name: <span className="fw-bold">Updated At</span>,
    //   selector: (row: { updated_at: any }) =>
    //     row.updated_at ? moment(row.updated_at).format("DD/MM/YYYY") : "-",
    //   sortable: true,
    // },
    {
      name: <span className="fw-bold">Action</span>,
      selector: (row: {
        last_name(
          title: (title: any, first_name: any, last_name: any) => any,
          first_name: (
            title: (title: any, first_name: any, last_name: any) => any,
            first_name: any,
            last_name: any
          ) => any,
          last_name: any
        ): any;
        first_name(
          title: (title: any, first_name: any, last_name: any) => any,
          first_name: any,
          last_name: any
        ): any;
        title(title: any, first_name: any, last_name: any): any;
        name: any;
        id: number;
      }) =>
        actionButton(
          GenerateName(row?.title, row?.first_name, row?.last_name),
          row.id
        ),
    },
  ];

  useEffect(() => {
    let controller = new AbortController();
    const result = customersSearch?.filter((customer) => {
      return (
        customer?.first_name?.toLowerCase().match(search.toLocaleLowerCase()) ||
        customer?.last_name?.toLowerCase().match(search.toLocaleLowerCase()) ||
        customer?.address?.toLowerCase().match(search.toLocaleLowerCase())
      );
    });

    setCustomers(result);
    return () => controller.abort();
  }, [search]);

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <HeadSection title="All Customers" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center justify-content-between">
                <div>
                  <h4 className="card-title mb-0 fw-bolder">All Customers</h4>
                </div>
                {accessPermissions.createAndUpdate && (
                  <div>
                    <Button
                      variant="primary"
                      className="btn-sm"
                      onClick={() => {
                        setOpenView(true);
                        setActive(false);
                        setID(0);
                      }}
                    >
                      Add Customer
                    </Button>
                  </div>
                )}
              </div>
              <div className="card-body">
                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                />
                <FilterDatatable
                  tblLoader={tblLoader}
                  columns={columns}
                  setFilterValue={setFilterValue}
                  filteredData={filteredData}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPageShow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* //Delete Modal// */}
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Modal.Title className="fs-5">
            Are you sure to Delete customer{" "}
            <span className="fw-bolder">{serial}</span> ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button
            variant="danger"
            disabled={!serial}
            onClick={deleteCustomerByID}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={openView}
        onHide={() => {
          setOpenView(false);
        }}
      >
        <Modal.Header closeButton>
          <div className="w-100 d-flex justify-content-between">
            <h3 className="card-title fw-bold fs-6 pt-3 ps-3">
              {active ? " Add New Corporate Customer" : "Add New Customer"}
            </h3>
            <div className="text-end  pt-3 pe-3">
              <span className="fw-bold">Activate Client </span>{" "}
              <Switch onClick={(e) => setActive(!active)} />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <CreateCustomer
            active={active}
            clients={clients}
            setOpenView={setOpenView}
            getAllCustomer={getAllCustomer}
            setFilterValue={setFilterValue}
          />
        </Modal.Body>
      </Modal>

      {/* //Update Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={openUpdate}
        onHide={() => {
          setOpenUpdate(false);
        }}
      >
        <Modal.Header closeButton>
          <div className="w-100 d-flex justify-content-between">
            <h3 className="card-title fw-bold fs-6 pt-3 ps-3">
              {active ? "Migrate to Corporate Customer" : "Update Customer"}
            </h3>
            <div className="text-end  pt-3 pe-3">
              <span className="fw-bold">Activate Client </span>{" "}
              <Switch onClick={(e) => setActive(!active)} />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <UpdateCustomer
            active={active}
            clients={clients}
            setOpenView={setOpenUpdate}
            id={id}
            getAllCustomer={getAllCustomer}
            setFilterValue={setFilterValue}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomerList;

//component
const CreateCustomer = ({
  active,
  setOpenView,
  clients,
  getAllCustomer,
  setFilterValue,
}) => {
  const { notify } = MyToast();

  const { http } = Axios();

  //calender open
  const [dobOpen, setDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);

  const [corporateID, setCorporateID] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const [customer, setCustomer]: any = useState({
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
    <>
      <HeadSection title="Add New Customer" />

      <div className="container-fluid ">
        {!active ? (
          <Form
            onSubmit={submitForm}
            id="customerForm"
            noValidate
            validated={validated}
          >
            <div className="row">
              <div className="col-12 col-md-12 m-auto">
                <div className="row">
                  <div className="col-md-12">
                    <div className="">
                      <div className="card-body p-md-5">
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
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

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                          <Form.Group className="mb-2 col-md-6 col-lg-6">
                            <Form.Label className="">
                              Country <span className="text-danger">*</span>
                            </Form.Label>

                            <Select2
                              options={customer?.countryData?.map(
                                ({ id, name }) => ({ value: id, label: name })
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
                                ({ id, name }) => ({ value: id, label: name })
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
                                ({ id, name }) => ({ value: id, label: name })
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
              <Select2
                options={
                  !!clients?.length &&
                  clients?.map(({ id, name }) => ({ value: id, label: name }))
                }
                onChange={(e: any) => setCorporateID(e?.value)}
                required
              />
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
    </>
  );
};

const UpdateCustomer = ({
  active,
  setOpenView,
  id,
  clients,
  getAllCustomer,
  permission,
  query,
  setFilterValue,
}) => {
  const { notify } = MyToast();

  const { http } = Axios();

  //calender open
  const [dobOpen, setDobOpen] = useState(false);
  const [anniversaryOpen, setAnniversaryOpen] = useState(false);

  const [corporateID, setCorporateID] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const [customer, setCustomer]: any = useState({
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

    custInfo: {},
  });

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
          customer_id: id,
        }
      )
      .then((res) => {
        if (isSubscribed) {
          setCustomer((prev) => ({
            ...prev,
            custInfo: res.data?.data,
            mobile: res.data.data?.mobile,
            contact_type: res.data.data?.contact_type,
            title: res.data.data?.title,
            fName: res.data.data?.first_name,
            lName: res.data.data?.last_name,
            gender: res.data.data?.gender,
            birth_date: res.data.data?.dob,
            anniversary_date: res.data.data?.anniversary_date,
            nationality: res.data.data?.nationality,
            pin_code: res.data.data?.pin_code,
            arrival_from: res.data.data?.arrival_from,
            address: res.data.data?.address,
            status: res.data.data?.status,

            country_id: res.data.data?.country_id,
            state_id: res.data.data?.state_id,
            city_id: res.data.data?.city_id,
          }));
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [id]);

  useEffect(() => {
    fetchCustomerInfo();
  }, [fetchCustomerInfo]);

  async function submitForm(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    e.preventDefault();

    let body = {
      ...customer,
      action: "updateIndividualCustomer",
      customer_id: id,
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
    <>
      <HeadSection title="Update Customer" />

      <div className="container-fluid ">
        {!active ? (
          <Form
            onSubmit={submitForm}
            id="customerForm"
            noValidate
            validated={validated}
          >
            <div className="row">
              <div className="col-12 col-md-12 m-auto">
                <div className="row">
                  <div className="col-md-12">
                    <div className="">
                      <div className="card-body p-md-5">
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
                                      id="male1"
                                      label="Male"
                                      name="gender"
                                      value="male"
                                      checked={customer?.gender == "male"}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div>
                                    <RadioButton
                                      id="female1"
                                      label="Female"
                                      name="gender"
                                      value="female"
                                      checked={customer?.gender == "female"}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div>
                                    <RadioButton
                                      id="other1"
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
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

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                // label="Anniversary Date"
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
                                  <ThemeProvider theme={theme}>
                                    <TextField
                                      onClick={() =>
                                        !active && setAnniversaryOpen(true)
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
                        </div>

                        <div className="row">
                          <Form.Group className="mb-3 col-md-6 col-lg-6">
                            <Form.Label className="">
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
                          <Form.Group className="mb-2 col-md-6 col-lg-6">
                            <Form.Label className="">
                              Country <span className="text-danger">*</span>
                            </Form.Label>
                            {customer?.custInfo?.country?.id !== undefined && (
                              <>
                                <Select2
                                  options={customer.countryData.map(
                                    ({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    })
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
                                    ({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    })
                                  )}
                                  onChange={changeState}
                                />
                              </>
                            )}
                          </Form.Group>
                        </div>

                        {/* show state city or selected */}
                        <div className="row">
                          <Form.Group className="mb-3 col-md-6 col-lg-6">
                            <Form.Label className="">
                              State <span className="text-danger">*</span>
                            </Form.Label>
                            {customer?.custInfo?.state?.id && (
                              <>
                                <Select2
                                  options={customer.stateData.map(
                                    ({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    })
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
                                    ({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    })
                                  )}
                                  onChange={changeCity}
                                />
                              </>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3 col-md-6 col-lg-6">
                            <Form.Label className="">
                              City <span className="text-danger">*</span>
                            </Form.Label>
                            {customer?.custInfo?.city?.id && (
                              <>
                                <Select2
                                  options={customer.cityData.map(
                                    ({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    })
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
                              </>
                            )}
                          </Form.Group>
                        </div>

                        <div className="row">
                          <Form.Group className="mb-3 col-md-6 col-lg-6">
                            <Form.Label className="">
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
                              <Button type="submit" variant="success">
                                Update Customer
                              </Button>
                            </div>
                          </div>
                        </div>
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
              <Select2
                options={
                  !!clients?.length &&
                  clients?.map(({ id, name }) => ({ value: id, label: name }))
                }
                onChange={(e: any) => setCorporateID(e?.value)}
                required
              />
            </div>
            <AddNewClient
              id={corporateID}
              setOpen={setOpenView}
              updateID={id}
              getAllCorporateClientsByID={getAllCustomer}
            />
          </>
        )}
      </div>
    </>
  );
};
