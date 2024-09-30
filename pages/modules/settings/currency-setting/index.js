// import Button from '@mui/material/Button';
import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Switch from "react-switch";
import { HeadSection } from "../../../../components";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import Select2 from "../../../../components/elements/Select2";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";
import themeContext from "../../../../components/context/themeContext";



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.crncy_stng" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const CreateForm = ({ onSubmit, loading }) => {
  const [currency, setCurrency] = useState({
    name: "",
    symbol: "",
    code: "",
    exchange_rate: "",
  });

  const handleChange = (e) => {
    setCurrency((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  let dataset = { ...currency, action: "createCurrency" };

  return (
    <Form>
      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Symbol</Form.Label>
        <Form.Control
          type="text"
          placeholder="Symbol"
          name="symbol"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Code"
          name="code"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Exchange rate</Form.Label>
        <Form.Control
          type="text"
          placeholder="Exchange rate"
          name="exchange_rate"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        className="shadow rounded"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Create
      </Button>
      {/* <Button className='mt-3' type="submit" variant="contained" color="primary" onClick={() => onSubmit(dataset)} >Add Currency</Button> */}
    </Form>
  );
};

// Update component
const EditForm = ({ onSubmit, id, pending }) => {
  const { http } = Axios();
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState({
    name: "",
    symbol: "",
    code: "",
    exchange_rate: "",
  });

  const handleChange = (e) => {
    setCurrency((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchCurrency = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, {
        action: "getCurrencyInfo",
        currency_id: id,
      })
      .then((res) => {
        if (isSubscribed) {
          setCurrency((prev) => ({
            ...prev,
            name: res.data?.data.name,
            symbol: res.data?.data.symbol,
            code: res.data?.data.code,
            exchange_rate: res.data?.data.exchange_rate,
          }));

          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [id]);
  //   Currency

  useEffect(() => {
    fetchCurrency();
  }, [id]);

  let dataset = {
    ...currency,
    action: "updateCurrency",
    currency_id: id,
  };

  return (
    <Form>
      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
          required
          value={currency.name}
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Symbol</Form.Label>
        <Form.Control
          type="text"
          placeholder="Symbol"
          name="symbol"
          onChange={handleChange}
          required
          value={currency.symbol}
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Code"
          name="code"
          onChange={handleChange}
          required
          value={currency.code}
        />
      </Form.Group>

      <Form.Group controlId="formBasicAddress">
        <Form.Label>Exchange rate</Form.Label>
        <Form.Control
          type="text"
          placeholder="Exchange rate"
          name="exchange_rate"
          onChange={handleChange}
          required
          value={currency.exchange_rate}
        />
      </Form.Group>

      <Button
        variant="primary"
        className="shadow rounded"
        // disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Update
      </Button>
      {/* <Button className='mt-3' type="submit" variant="contained" color="primary" onClick={() => onSubmit(dataset)} >Add Currency</Button> */}
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, id, pending }) => {
  const { http } = Axios();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCurrency = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, {
        action: "getCurrencyInfo",
        currency_id: id,
      })
      .then((res) => {
        if (isSubscribed) {
          setName(res.data.data.name);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [id]);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  let myFormData = new FormData();

  myFormData.append("action", "deleteCurrency");
  myFormData.append("currency_id", id);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending || loading}
          onClick={() => onSubmit(myFormData)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

function index({ accessPermissions }) {
  const { http } = Axios();
  const { notify } = MyToast();
  // get all active currencies
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]); // [{id:1}, ,{id:3}]
  const [currencies, setCurrencies] = useState([]);
  const [currencyId, setCurrencyId] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);
  const [currencyStatus, setCurrencyStatus] = useState(false);


  const context = useContext(themeContext);
  const {

    golbalCurrency,
     setGlobalCurrencies
  } = context;


  const getAllActiveCurrencies = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, {
        action: "getAllActiveCurrencies",
      })
      .then((res) => {
        if (isSubscribed) {
          setCurrencies(res.data?.data);
          setGlobalCurrencies(res.data?.data)
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    getAllActiveCurrencies();
  }, [getAllActiveCurrencies]);

  //create
  const submitForm = async (currency) => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, currency)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.symbol) {
            notify("error", `${msg.symbol.Symbol}`);
          }
          if (msg?.code) {
            notify("error", `${msg.code.Code}`);
          }
          if (msg?.exchange_rate) {
            notify("error", `${msg.exchange_rate.Exchange_rate}`);
          }
        }
        setLoading(false);
      });

    fetchItemList();
    // alert("all value done");
    return () => (isSubscribed = false);
  };

  //select2 width
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 400, // Change this to the desired select2 width
    }),
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);

  //Delete  Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setCurrencyId(id);
  };

  //Delete currency form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
      })
      .catch((e) => {
        setPending(false);
      });

    fetchItemList();
    getAllActiveCurrencies();

    return () => (isSubscribed = false);
  };

  //Update Laundry Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleExit = () => setShowUpdateModal(false);

  const handleOpen = (id) => {
    setShowUpdateModal(true);
    setCurrencyId(id);
  };
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.symbol) {
            notify("error", `${msg.symbol.Symbol}`);
          }
          if (msg?.code) {
            notify("error", `${msg.code.Code}`);
          }
          if (msg?.exchange_rate) {
            notify("error", `${msg.exchange_rate.Exchange_rate}`);
          }
        }
        setLoading(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Fetch List Data for datatable

  const fetchItemList = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, {
        action: "getAllCurrency",
      })
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data?.data);
          setFilteredData(res?.data?.data);
          setStatus(res?.data?.data?.status);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = itemList?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  const actionButton = (id) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.createAndUpdate && <li>
            <Link href="#">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleOpen(id);
                }}
              >
                <EditIcon />
              </a>
            </Link>
          </li>}
          {accessPermissions.delete && <li>
            <Link href="#">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDelete(id);
                }}
              >
                <DeleteIcon />
              </a>
            </Link>
          </li>}
        </ul>
      </>
    );
  };

  const switchAction = async (id) => {
    let body = {};
    body = {
      action: "changeCurencyStatus",
      id,
    };

    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, body)
      .then((res) => {
        if (isSubscribed) {
          fetchItemList();
          getAllActiveCurrencies();
        }
      });

    return () => (isSubscribed = false);
  };

  const columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Currency name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Currency symbol",
      selector: (row) => row.symbol,
      sortable: true,
    },
    {
      name: "Currency code",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Exchange rate(1 USD = ?)",
      selector: (row) => row.exchange_rate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Switch
          height={20}
          width={40}
          checked={row.status == 1 ? true : false}
          onChange={(e) => switchAction(row.id)}
        />
      ),
    },

    {
      name: "Options",
      selector: (row) => actionButton(row.id),
    },
  ];

  //selected default currency
  const [selectedCurrency, setSelectedCurrency] = useState({
    value: "",
    label: "Select...",
  });

  useEffect(() => {
    (async () => {
      let isSubscribed = true;
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/business-settings`,
          {
            action: "settingsInfo",
            key: "system_default_currency",
          }
        )
        .then((res) => {
          if (isSubscribed) {
            setSelectedCurrency(res.data?.data?.currency_info);
          }
        })
        .catch((err) => {
          console.log("Server Error ~!");
        });

      return () => (isSubscribed = false);
    })();
  }, []);

  const [system_default_currency, setDefaultCurrency] = useState(null);

  const update = async (e) => {
    e.preventDefault();

    const formData = new FormData(event.target);
    const types = formData.getAll("types[]");
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/business-settings`, {
        action: "update",
        types: types,
        system_default_currency: system_default_currency,
      })
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res.data?.response}`);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
        const msg = err.response?.data?.response;

        if (typeof err.response?.data?.response == "string") {
          notify("error", `${err.response.data.response}`);
        }
      });

    return () => (isSubscribed = false);
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <HeadSection title="Currency" />

        {/* <div className="row">
          <div className="col-md-12 p-xs-2">
            <Card>
              <Card.Header>System Default Currency</Card.Header>
              <Card.Body>
                <Form onSubmit={update}>
                  <div className="d-flex justify-content-between-xs align-items-center">
                    <div>
                      <Select2
                        value={selectedCurrency}
                        styles={customStyles}
                        options={currencies?.map(({ id, name }) => ({
                          value: id,
                          label: name,
                        }))}
                        onChange={(e) => {
                          setDefaultCurrency(e.value);
                          setSelectedCurrency((prev) => ({
                            ...prev,
                            value: e.value,
                            label: e.label,
                          }));
                        }}
                      />
                      <input
                        type="hidden"
                        name="types[]"
                        value="system_default_currency"
                      />
                    </div>
                    <Button
                      className="cust-ms-5 -mt-xs-1"
                      type="submit"
                      variant="primary"
                      id="default-currency-save-btn"
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div> */}
        <div className="row mb-5">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title">All Currencies</h4>

                  {accessPermissions.createAndUpdate && <Button
                    variant="primary"
                    className="shadow rounded btn-sm"
                    disabled={loading}
                    style={{ marginTop: "5px" }}
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Add Currency
                  </Button>}
                </div>
              </Card.Header>

              {/* Create Modal Form */}
              <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add Currency</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CreateForm onSubmit={submitForm} loading={loading} />
                </Modal.Body>
              </Modal>
              {/* End Create Modal Form */}

              {/* Update Modal Form */}
              <Modal
                dialogClassName="modal-md"
                show={showUpdateModal}
                onHide={handleExit}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Update Currency</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <EditForm
                    onSubmit={updateForm}
                    id={currencyId}
                    pending={pending}
                  />
                </Modal.Body>
              </Modal>
              {/* End Update Modal Form */}

              {/* Delete Modal Form */}
              <Modal show={showDeleteModal} onHide={handleExitDelete}>
                <Modal.Header closeButton></Modal.Header>
                <DeleteComponent
                  onSubmit={handleDelete}
                  id={currencyId}
                  pending={pending}
                />
              </Modal>
              {/* End Delete Modal Form */}
              <Card.Body>
                <p className="mb-2"><b>Note:</b>You can activate only one Currency at a time </p>
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <input
                      type="text"
                      placeholder="search by currrency name ..."
                      className="w-25 form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  }
                  striped
                />
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default index;
