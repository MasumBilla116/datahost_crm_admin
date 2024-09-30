import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";

//mui
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  DeleteIcon,
  EditIcon,
  HeadSection,
  RadioButton,
  Select2,
} from "../../../../../components";
import Axios from "../../../../../utils/axios";

function DetailsOfClient() {
  const [value, setValue]: any = useState([]);
  const [countries, setCountries] = useState([]);
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateID, setUpdateID] = useState(0);
  const [deleteID, setDeleteID] = useState(0);
  const [deleteClient, setDeleteClient] = useState("");

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();
  const {
    isReady,
    query: { id },
  } = router;

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

  const getAllCorporateClientsByID = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/clients`, {
        action: "getAllCorporateClientsByID",
        id,
      })
      .then((res: any) => {
        setClients(res?.data?.data);
      })
      .catch((err: any) => console.log(err));
  };

  const deleteCorporateCustomerByID = async (clientID) => {
    let body: any = {
      id: clientID,
      corporate_client_id: id,
      action: "deleteCorporateCustomerByID",
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
      .then((res: any) => {
        setClients(res?.data?.data);
        notify("success", res?.data?.response);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    const controller = new AbortController();

    isReady && getCountries();
    isReady && getClientByID();
    isReady && getAllCorporateClientsByID();

    return () => controller.abort();
  }, [isReady, id]);

  const actionButton = (name: any, id: number) => {
    return (
      <ul className="action mt-3">
        <li>
          <Link href={`#`}>
            <a
              onClick={() => {
                setOpen(true);
                setUpdateID(id);
              }}
            >
              <EditIcon />
            </a>
          </Link>
        </li>
        <li>
          <Link href="#">
            <a
              onClick={() => {
                setDeleteClient(name);
                setDeleteID(id);
                setDeleteModal(true);
              }}
            >
              <DeleteIcon />
            </a>
          </Link>
        </li>
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
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row: { title: string; first_name: any; last_name: any }) =>
        GenerateName(row?.title, row?.first_name, row?.last_name),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Conatct</span>,
      selector: (row: { mobile: any }) => row?.mobile,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Gender</span>,
      selector: (row: { gender: any }) => row?.gender,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Arrival From</span>,
      selector: (row: { arrival_from: any }) => row?.arrival_from,
      sortable: true,
    },
    {
      name: <span className="fw-bold ">Nationality</span>,
      selector: (row: { nationality: any }) => row?.nationality,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Action</span>,
      selector: (row: {
        title: string;
        first_name: any;
        last_name: any;
        id: number;
      }) =>
        actionButton(
          GenerateName(row?.title, row?.first_name, row?.last_name),
          row.id
        ),
    },
  ];



  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Corporate Clients", link: "/modules/customer/client" },
    {
      text: "Corporate Client info",
      link: `/modules/customer/client/details/[id]`,
    },
  ];

  return (
    <>
      <HeadSection title="Corporate Client" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-6 col-lg-6">
            <div className="card shadow">
              <div className="p-3 ">
                <div className="border-bottom">
                  <h4 className="card-title fw-bolder">
                    Corporate Client's Basic Info
                  </h4>
                </div>

                <div className="card-body ">
                  {!!!Object.keys(value).length && (
                    <div className="text-center position-absolute top-50 start-50 translate-middle">
                      <Spinner animation="border" variant="info" />
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-12 table-responsive p-0">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th style={{ width: "30px" }}>Name</th>
                            <td style={{ width: "10px" }}>:</td>
                            <td>{value?.name ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Mobile</th>
                            <td>:</td>
                            <td>{value?.contact_number ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>:</td>
                            <td>{value?.email ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Type</th>
                            <td>:</td>
                            <td>{value?.type ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Country</th>
                            <td>:</td>
                            <td>
                              {value?.country &&
                                countries?.filter(
                                  (each) => each?.id === value?.country
                                )[0]?.name}
                            </td>
                          </tr>
                          <tr>
                            <th>Address</th>
                            <td>:</td>
                            <td>{value?.address ?? "---"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-6">
            <div className="card shadow">
              <div className="p-3 ">
                <div className="border-bottom">
                  <h4 className="card-title fw-bolder">
                    Corporate Client's Account Info
                  </h4>
                </div>

                <div className="card-body px-4">
                  {!!!Object.keys(value).length && (
                    <div className="text-center position-absolute top-50 start-50 translate-middle">
                      <Spinner animation="border" variant="info" />
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-12 table-responsive p-0">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th style={{ width: "147px" }}>Opening Balance</th>
                            <td style={{ width: "10px" }}>:</td>
                            <td>{value?.opening_balance ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Balance</th>
                            <td>:</td>
                            <td>{value?.balance ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Credit Limit</th>
                            <td>:</td>
                            <td>{value?.credit_limit ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Bank Name</th>
                            <td>:</td>
                            <td>{value?.type ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Bank AC/No</th>
                            <td>:</td>
                            <td>{value?.bank_acc_number ?? "---"}</td>
                          </tr>
                          <tr>
                            <th>Description</th>
                            <td>:</td>
                            <td>{value?.description ?? "---"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 m-auto">
            <div className="card shadow">
              <div className="p-3 ">
                <div className="border-bottom">
                  <div className="d-flex justify-content-between">
                    <h4 className="card-title fw-bolder">
                      Add Person Under{" "}
                      <span className="text-info fw-bold">{value?.name}</span>{" "}
                    </h4>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpen(true);
                          setUpdateID(0);
                        }}
                      >
                        + Add new customer
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={clients}
                    pagination
                    highlightOnHover
                    subHeader
                    striped
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-lg"
        show={open}
        onHide={() => setOpen(false)}
      >
        <Modal.Header closeButton>
          <div className="p-2 d-flex justify-content-between w-100 pt-3">
            <h5 className="fw-bolder">
              {updateID ? "Update Corporate Client" : "New Corporate Client"}
            </h5>
            <h5>
              <span className="text-info fw-bold pe-4">{value?.name}</span>
            </h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <AddNewClient
            id={id}
            setOpen={setOpen}
            updateID={updateID}
            getAllCorporateClientsByID={getAllCorporateClientsByID}
          />
        </Modal.Body>
      </Modal>

      {/* //Delete Modal// */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Modal.Title className="fs-5">
            Are you sure to Delete client{" "}
            <span className="fw-bolder">{deleteClient}</span> ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="success"
            onClick={() => setDeleteModal(false)}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!deleteID}
            onClick={() => {
              deleteCorporateCustomerByID(deleteID);
              setDeleteModal(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DetailsOfClient;

export const AddNewClient = ({
  id,
  setOpen,
  updateID,
  getAllCorporateClientsByID,
}) => {
  const { http } = Axios();
  const { notify } = MyToast();

  const router = useRouter();
  const { pathname } = router;

  const [newClient, setNewClient]: any = useState({});
  const [dobOpen, setDobOpen] = useState(false);

  const submit = async (e: any) => {
    e?.preventDefault();

    if (updateID) {
      const updateCorporateCustomerByID = async () => {
        let body: any = {
          ...newClient,
          corporate_client_id: id,
          id: updateID,
          action: "updateCorporateCustomerByID",
        };
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
          .then((res: any) => {
            notify("success", res?.data?.response);
            getAllCorporateClientsByID();
            setNewClient({});
            e.target.reset();
            setOpen(false);
          })
          .catch((e: any) => {
            const msg = e.response?.data?.response;
            notify("error", msg);
          });
      };
      id
        ? updateCorporateCustomerByID()
        : notify("error", "Corporate client is empty");
    } else {
      let body: any = {
        ...newClient,
        corporate_client_id: id,
        action: "createCorporateCustomer",
      };

      const saveCorporateClient = async () => {
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
          .then((res: any) => {
            notify("success", res?.data?.response);
            getAllCorporateClientsByID();
            setNewClient({});
            e.target.reset();
            setOpen(false);
          })
          .catch((e: any) => {
            const msg = e.response?.data?.response;
            notify("error", msg);
          });
      };
      saveCorporateClient();
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
  });

  const getCorporateCustomerByID = async () => {
    let body: any = { action: "getCorporateCustomerByID", id: updateID };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
      .then((res: any) => {
        setNewClient(res?.data?.data && res?.data?.data);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    if (updateID) {
      getCorporateCustomerByID();
    }
  }, [updateID]);

  return (
    <div className="p-4">
      <Form onSubmit={submit}>
        <div className="row mb-3">
          <Form.Group className=" col-md-4 col-lg-4">
            <Form.Label className="">
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Select2
              options={[
                { value: 1, label: "Mr" },
                { value: 2, label: "Ms" },
                { value: 3, label: "Mrs" },
              ]}
              onChange={(e: any) =>
                setNewClient({ ...newClient, title: e?.label, value: e?.value })
              }
              value={{
                value: newClient?.value || 0,
                label: newClient?.title || "Select",
              }}
              required
            />
          </Form.Group>

          <Form.Group className=" col-md-4 col-lg-4">
            <Form.Label className="">
              First Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              name="fName"
              value={
                !!Object.keys(newClient).length ? newClient?.first_name : ""
              }
              onChange={(e) =>
                setNewClient({ ...newClient, first_name: e?.target?.value })
              }
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
              value={
                !!Object.keys(newClient).length ? newClient?.last_name : ""
              }
              onChange={(e) =>
                setNewClient({ ...newClient, last_name: e?.target?.value })
              }
              required
            />
          </Form.Group>
        </div>

        <div className="row mb-3">
          <Form.Group className="col-md-4 col-lg-4">
            <Form.Label className="">
              Mobile Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Mobile Number"
              name="mobile"
              value={!!Object.keys(newClient).length ? newClient?.mobile : ""}
              onChange={(e) =>
                setNewClient({ ...newClient, mobile: e?.target?.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="col-md-4 col-lg-4">
            <Form.Label className="">
              Arrival From <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Where did come from?"
              name="arrival_from"
              value={
                !!Object.keys(newClient).length ? newClient?.arrival_from : ""
              }
              onChange={(e) =>
                setNewClient({ ...newClient, arrival_from: e?.target?.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="col-md-4 col-lg-4">
            <Form.Label className="">
              Nationality <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Nationality"
              name="nationality"
              value={
                !!Object.keys(newClient).length ? newClient?.nationality : ""
              }
              onChange={(e) =>
                setNewClient({ ...newClient, nationality: e?.target?.value })
              }
              required
            />
          </Form.Group>
        </div>

        <div className="row mb-3">
          <div className="col-md-4 col-lg-4">
            <Form.Group className="">
              <Form.Label className="w-100">
                Date of Birth <span className="text-danger">*</span>
              </Form.Label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  // size={1}
                  // label="Date of Birth"
                  open={dobOpen}
                  onClose={() => setDobOpen(false)}
                  value={newClient?.birth_date}
                  inputFormat="yyyy-MM-dd"
                  onChange={(event) => {
                    setNewClient((prev) => ({ ...prev, birth_date: event }));
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
          </div>
          <div className="col-md-6 col-lg-6">
            <Form.Group className="mb-3">
              <Form.Label className="w-100 my-0">
                Gender <span className="text-danger">*</span>
              </Form.Label>
              <div className="align-content-start flex-gap">
                <div>
                  <RadioButton
                    label="Male"
                    name="gender"
                    value="male"
                    checked={newClient?.gender == "male" || !newClient?.gender}
                    onChange={(e: any) =>
                      setNewClient({ ...newClient, gender: e?.target?.value })
                    }
                  />
                </div>
                <div>
                  <RadioButton
                    label="Female"
                    name="gender"
                    value="female"
                    checked={newClient?.gender == "female"}
                    onChange={(e: any) =>
                      setNewClient({ ...newClient, gender: e?.target?.value })
                    }
                  />
                </div>
                <div>
                  <RadioButton
                    label="Other"
                    name="gender"
                    value="other"
                    checked={newClient?.gender == "other"}
                    onChange={(e: any) =>
                      setNewClient({ ...newClient, gender: e?.target?.value })
                    }
                  />
                </div>
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="">
          <Button
            className="px-2 mx-3"
            onClick={() =>
              updateID ? getCorporateCustomerByID() : setNewClient({})
            }
          >
            {updateID ? "Reset" : "Clear"}
          </Button>
          <Button
            className="px-5"
            type="submit"
            color={updateID ? "success" : "info"}
            variant="contained"
          >
            {updateID ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
