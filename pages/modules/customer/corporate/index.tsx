import MyToast from "@mdrakibul8001/toastify";
import Button from "@mui/material/Button";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Textarea from "react-expanding-textarea";
import {
  DeleteIcon,
  EditIcon,
  Form,
  HeadSection,
  Select2,
  ViewIcon,
} from "../../../../components";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.cstmr.crprt",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

function ClientList({ permission, query, accessPermissions }) {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();

  //Sate declaration
  const [clients, setClients] = useState([]);
  const [clientsSearch, setClientsSearch] = useState([]);
  const [serial, setSerial] = useState("");
  const [id, setID] = useState(0);
  const [clientStatus, setClientStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [search, setSearch] = useState("");

  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageShow, setPerPageShow] = useState(15);
  const [tblLoader, setTblLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
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
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "getAllClientList", filterValue: filterValue }
        )
        .then((res) => {
          if (isSubscribed) {
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
        const clients = res?.data?.data;
        !!clients.length &&
          setClients(
            clients.filter((client: { status: number }) => client?.status === 1)
          );
        !!clients.length &&
          setClientsSearch(
            clients.filter((client: { status: number }) => client?.status === 1)
          );
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const deleteClient = async () => {
    setID &&
      (await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`,
          { action: "deleteClient", id, clientStatus }
        )
        .then((res: any) => {
          const clients = res?.data?.data;
          !!clients.length &&
            setClients(clients.filter((client) => client?.status === 1));
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
          setOpen(false);
          notify("success", "Client " + serial + " removed successfully");
        })
        .catch((err: any) => {
          console.log(err);
        }));
  };

  useEffect(() => {
    const controller = new AbortController();
    getallClients();

    return () => controller.abort();
  }, []);

  const actionButton = (serial: any, id: number, status: number) => {
    return (
      <ul className="action mt-3">
        {accessPermissions.listAndDetails && (
          <li>
            <Link href={`/modules/customer/corporate/details/${id}`}>
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
                  setClientStatus(status);
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

  const columns: any = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      width: "75px",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row: { name: any }) => (
        <span className="text-capitalize">{row?.name}</span>
      ),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Opening balance</span>,
      selector: (row: { opening_balance: any }) =>
        row?.opening_balance ? row?.opening_balance : "-",
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold ">Balance</span>,
      selector: (row: { balance: any }) => (row?.balance ? row?.balance : "-"),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Credit limit</span>,
      selector: (row: { credit_limit: any }) =>
        row?.credit_limit ? (
          row?.credit_limit >= 0 ? (
            <span>{row?.credit_limit}</span>
          ) : (
            <span className="text-danger"> {row?.credit_limit}</span>
          )
        ) : (
          "-"
        ),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Type</span>,
      selector: (row: { type: any }) => (
        <span className="text-capitalize"> {row?.type ? row?.type : "_"} </span>
      ),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Description</span>,
      selector: (row: { description: any }) => (
        <span className="text-capitalize">
          {row?.description ? row?.description : "-"}{" "}
        </span>
      ),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Created At</span>,
      selector: (row: { created_at: any }) =>
        moment(row.created_at).format("DD/MM/YYYY"),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Updated At</span>,
      selector: (row: { updated_at: any }) =>
        moment(row.updated_at).format("DD/MM/YYYY"),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Action</span>,
      selector: (row: { name: any; id: number }) =>
        actionButton(row.name, row.id, row.status),
      width: "15%",
    },
  ];

  useEffect(() => {
    let controller = new AbortController();

    const result = clientsSearch?.filter((client) => {
      return (
        client?.name.toLowerCase().match(search.toLocaleLowerCase()) ||
        client?.type.toLowerCase().match(search.toLocaleLowerCase()) ||
        client?.description.toLowerCase().match(search.toLocaleLowerCase())
      );
    });

    setClients(result);
    return () => controller.abort();
  }, [search]);

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Corporate Clients", link: "/modules/customer/client" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <HeadSection title="All Corporate Clients" />
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center justify-content-between">
                <div>
                  <h4 className="card-title pt-3 ps-3 fw-bolder">
                    All Corporate Clients
                  </h4>
                </div>
                <div>
                  <Link href="#">
                    <Button
                      variant="contained"
                      className="btn-sm"
                      color="primary"
                      onClick={() => setOpenView(true)}
                    >
                      Add Co. Client
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Name / Email"
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
            Are you sure to remove client{" "}
            <span className="fw-bolder">{serial}</span> ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpen(false)}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!serial}
            onClick={deleteClient}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={openView}
        onHide={() => setOpenView(false)}
      >
        <Modal.Header closeButton>
          <h5 className="pt-3 ps-3 fw-bolder">Add Corporate Client</h5>{" "}
        </Modal.Header>
        <Modal.Body>
          <CreateClient
            setOpenView={setOpenView}
            getallClients={getallClients}
            setFilterValue={setFilterValue}
          />
        </Modal.Body>
      </Modal>

      {/* //Update Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={openUpdate}
        onHide={() => setOpenUpdate(false)}
      >
        <Modal.Header closeButton>
          <h5 className="pt-3 ps-3 fw-bolder">Update Corporate Client</h5>{" "}
        </Modal.Header>
        <Modal.Body>
          <UpdateClient
            setOpenUpdate={setOpenUpdate}
            id={id}
            getallClients={getallClients}
            setFilterValue={setFilterValue}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ClientList;

function CreateClient({ setOpenView, getallClients, setFilterValue }) {
  const [value, setValue]: any = useState([]);
  const [countries, setCountries] = useState([]);

  const { http } = Axios();
  const { notify } = MyToast();

  const client_type = [
    { value: "regular", label: "Regular", name: "type" },
    { value: "company", label: "Company", name: "type" },
    { value: "temporary", label: "Temporary", name: "type" },
  ];

  const submitForm = async (e: any) => {
    e.preventDefault();
    if (!value?.type) {
      notify("error", "type is empty");
    } else if (!value?.country_id) {
      notify("error", "country is empty");
    } else {
      let body: any = {};
      body = {
        ...value,
        action: "createClient",
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`,
          body
        )
        .then((res: any) => {
          notify("success", res?.data?.response);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));

          getallClients();
          setOpenView(false);
        })
        .catch((e: any) => {
          const msg = e.response?.data?.response;
          notify("error", msg);
        });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const getCountries = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "allCountries",
        })
        .then((res: any) => {
          setCountries(res?.data?.data);
        })
        .catch((err: any) => console.log(err));
    };

    getCountries();
    return () => controller.abort();
  }, []);

  const changeHandler = (e: any) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <>
      <HeadSection title="Create Client" />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-12 col-lg-12 m-auto">
            <div className="">
              <div className="">
                <Form onSubmit={submitForm}>
                  <div className="card-body px-2">
                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Name<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Client Name"
                              onChange={changeHandler}
                              name="name"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Mobile<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Phone number"
                              onChange={changeHandler}
                              name="contact_number"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Email<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Email adress"
                              onChange={changeHandler}
                              name="email"
                              type="email"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Type <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <Select2
                              options={client_type}
                              onChange={(e) =>
                                setValue({ ...value, type: e.value })
                              }
                              required
                              name="type"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">Address </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Client Address"
                              onChange={changeHandler}
                              name="address"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Country <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <Select2
                              options={
                                countries?.length &&
                                countries.map(({ id, name }) => ({
                                  value: id,
                                  label: name,
                                }))
                              }
                              onChange={(e: { value: any }) =>
                                setValue({ ...value, country_id: e?.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Bank Name <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="i.e: American Bank LTD."
                              onChange={changeHandler}
                              name="bank_name"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Bank Acc No <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="i.e: AMX-355-222-111"
                              onChange={changeHandler}
                              name="bank_acc_number"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Opening Balance
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Opening Balance"
                              onChange={changeHandler}
                              name="opening_balance"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Credit Limit<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Credit Limit"
                              onChange={changeHandler}
                              name="credit_limit"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">Description</label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <Textarea
                              className="textarea form-control"
                              rows={2}
                              // defaultValue="Write Descriptions..."
                              id="my-textarea"
                              onChange={changeHandler}
                              placeholder="Enter additional notes..."
                              name="description"
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6 col-lg-6"></div> */}
                    </div>

                    <div className="p-3">
                      <div className="text-end">
                        <Button
                          variant="contained"
                          color="primary"
                          className="px-5 btn-sm"
                          type="submit"
                        >
                          Add
                        </Button>
                        {/* 
                                            <Button className="btn-dark">
                                                Cancel
                                            </Button> */}
                      </div>
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
}

function UpdateClient({ setOpenUpdate, getallClients, id, setFilterValue }) {
  const [value, setValue]: any = useState({});
  const [countries, setCountries] = useState([]);

  const { http } = Axios();
  const router = useRouter();
  const { notify } = MyToast();

  const client_type = [
    { value: "regular", label: "Regular", name: "type" },
    { value: "company", label: "Company", name: "type" },
    { value: "temporary", label: "Temporary", name: "type" },
  ];

  const submitForm = async (e: any) => {
    e.preventDefault();
    let body: any = {};
    body = {
      ...value,
      action: "updateClientByID",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`,
        body
      )
      .then((res: any) => {
        notify("success", res?.data?.response);
        getallClients();
        setFilterValue((prev) => ({
          ...prev,
          filter: true,
        }));
        setOpenUpdate(false);
      })
      .catch((e: any) => {
        const msg = e.response?.data?.response;
        notify("error", msg);
      });
  };

  //get client
  const getClientByID = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`, {
        action: "getClientByID",
        id,
      })
      .then((res: any) => {
        let data = res?.data?.data;
        !!data?.length && setValue(data[0]);
      })
      .catch((err: any) => console.log(err));
  };

  //get country
  const getCountries = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "allCountries",
      })
      .then((res: any) => {
        setCountries(res?.data?.data);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    const controller = new AbortController();

    id && getClientByID();
    id && getCountries();

    return () => controller.abort();
  }, [id]);

  const changeHandler = (e: any) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };



  return (
    <>
      <HeadSection title="Create Client" />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-12 col-lg-12 m-auto">
            <div className="">
              <div className="">
                <Form onSubmit={submitForm}>
                  <div className="card-body px-2">
                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Name<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Client Name"
                              value={
                                !!Object.keys(value).length
                                  ? value?.name
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="name"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Mobile<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Phone number"
                              value={
                                !!Object.keys(value).length
                                  ? value?.contact_number
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="contact_number"
                              type={value?.contact_number && `number`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row ">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Email<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Email adress"
                              value={
                                !!Object.keys(value).length
                                  ? value?.email
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="email"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Type <span className="text-danger">*</span>
                            </label>
                          </div>
                          {value?.type && (
                            <div className="col-md-9 col-lg-9">
                              <Select2
                                options={client_type}
                                defaultValue={{ value: "", label: value?.type }}
                                onChange={(e) =>
                                  setValue({ ...value, type: e.value })
                                }
                                name="type"
                              />
                            </div>
                          )}
                          {!value?.type && (
                            <div className="col-md-9 col-lg-9">
                              <Select2
                                defaultValue={{ value: "", label: "loading.." }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">Address </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Client Address"
                              value={
                                !!Object.keys(value).length
                                  ? value?.address
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="address"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Country <span className="text-danger">*</span>
                            </label>
                          </div>
                          {value?.country &&
                            countries?.filter(
                              (each) => each?.id === value?.country
                            )[0]?.name && (
                              <div className="col-md-9 col-lg-9">
                                <Select2
                                  options={
                                    countries?.length &&
                                    countries.map(({ id, name }) => ({
                                      value: id,
                                      label: name,
                                    }))
                                  }
                                  defaultValue={{
                                    value: "",
                                    label: countries?.filter(
                                      (each) => each?.id === value?.country
                                    )[0]?.name,
                                  }}
                                  onChange={(e: { value: any }) =>
                                    setValue({ ...value, country: e?.value })
                                  }
                                />
                              </div>
                            )}
                          {!value?.country &&
                            !countries?.filter(
                              (each) => each?.id === value?.country
                            )[0]?.name && (
                              <div className="col-md-9 col-lg-9">
                                <Select2
                                  defaultValue={{
                                    value: "",
                                    label: "loading..",
                                  }}
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Bank Name <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="i.e: American Bank LTD."
                              value={
                                !!Object.keys(value).length
                                  ? value?.bank_name
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="bank_name"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Bank Acc No <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="i.e: AMX-355-222-111"
                              value={
                                !!Object.keys(value).length
                                  ? value?.bank_acc_number
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="bank_acc_number"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Opening Balance
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Opening Balance"
                              value={
                                !!Object.keys(value).length
                                  ? value?.opening_balance
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="opening_balance"
                              type={value?.opening_balance && `number`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">
                              Credit Limit<span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <input
                              className="form-control"
                              required
                              placeholder="Credit Limit"
                              value={
                                !!Object.keys(value).length
                                  ? value?.credit_limit
                                  : "loading..."
                              }
                              onChange={changeHandler}
                              name="credit_limit"
                              type={value?.credit_limit && `number`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div className="row">
                          <div className="col-md-3 col-lg-3">
                            <label className="fs-4">Description</label>
                          </div>
                          <div className="col-md-9 col-lg-9">
                            <Textarea
                              className="textarea form-control"
                              rows={2}
                              value={
                                !!Object.keys(value).length
                                  ? value?.description
                                  : "loading..."
                              }
                              id="my-textarea"
                              onChange={changeHandler}
                              placeholder="Enter additional notes..."
                              name="description"
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6 col-lg-6"></div> */}
                    </div>

                    <div className="p-3">
                      <div className="text-end">
                        <Button
                          color="warning"
                          className="mx-2 btn "
                          onClick={getClientByID}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className="px-5 btn-sm"
                          type="submit"
                        >
                          Update
                        </Button>
                      </div>
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
}
