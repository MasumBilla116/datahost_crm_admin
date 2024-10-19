import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { HeadSection } from "../../../../components";
import Loader from "../../../../components/Loader/loader";
import toast from "../../../../components/Toast/index";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import Axios from "../../../../utils/axios";

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {
  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [table, setTable] = useState({
    tableNo: null,
    seatCapacity: null,
  });

  const handleChange = (e) => {
    setTable((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  let dataset = { ...table, action: "createTable" };

  return (
    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail" className="mb-3">
        <Form.Label>Table Number</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter the number"
          name="tableNo"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Seat Capacity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter the number"
          name="seatCapacity"
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        style={{ marginTop: "15px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Create {loading && <Loader />}
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, tableId, loading, pending, validated }) => {
  const { http } = Axios();

  const [table, setTable] = useState({
    tableId: tableId,
    tableNo: null,
    seatCapacity: null,
  });

  const handleChange = (e) => {
    setTable((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchSetmenuData = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, {
        action: "getTableInfo",
        tableId: tableId,
      })
      .then((res) => {
        if (isSubscribed) {
          setTable((prev) => ({
            ...prev,
            tableNo: res.data.data.table_no,
            seatCapacity: res.data.data.seat_capacity,
          }));
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, [tableId]);

  useEffect(() => {
    fetchSetmenuData();
  }, [fetchSetmenuData]);

  let dataset = { ...table, action: "editTable" };

  return (
    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Table Number</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter the number"
          name="tableNo"
          onChange={handleChange}
          defaultValue={table.tableNo}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Seat Capacity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter the number"
          name="seatCapacity"
          onChange={handleChange}
          defaultValue={table.seatCapacity}
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        disabled={loading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Update {loading && <Loader />}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, tableId, loading, pending }) => {
  const { http } = Axios();
  const [tableData, setTableData] = useState({
    tableId: tableId,
  });

  let dataset = { ...tableData, action: "deleteTable" };

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => onSubmit(dataset)}
        >
          Confirm {loading && <Loader />}
        </Button>
      </Modal.Footer>
    </>
  );
};

const index = () => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allTableData, setallTableData] = useState([]);

  const data = allTableData?.data;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);

  const fetchItemList = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, {
        action: "getAllTables",
      })
      .then((res) => {
        if (isSubscribed) {
          setFilteredData(res.data?.data);
          setallTableData(res.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  const [tableId, setTableId] = useState(null);
  const [pending, setPending] = useState(false);
  //Create From
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const downloadTableQRCode = (id, table_no) => {
    router.push(
      `/modules/restaurant/table/tableQRCodeToPdf?table=${table_no}&id=${id}`,
      "_blank"
    );
  };

  //create table form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, items)
      .then((res) => {
        console.log("response: ", res?.data?.data);
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setValidated(false);
          const { table_no, id } = res?.data?.data;
          downloadTableQRCode(id, table_no);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.tableNo) {
            notify("error", `${msg.tableNo.TableNo}`);
          }
          if (msg?.seatCapacity) {
            notify("error", `${msg.seatCapacity.SeatCapacity}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Delete Table Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (tableId) => {
    setShowDeleteModal(true);
    setTableId(tableId);
  };

  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (tableId) => {
    setShowUpdateModal(true);
    setTableId(tableId);
  };

  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setValidated(false);
        }

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.tableNo) {
            notify("error", `${msg.tableNo.TableNo}`);
          }
          if (msg?.seatCapacity) {
            notify("error", `${msg.seatCapacity.SeatCapacity}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/table`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
        setLoading(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  const columns = [
    {
      name: "Table Number",
      selector: (row) => row.table_no,
      sortable: true,
    },
    {
      name: "Seat Capacity",
      selector: (row) => row.seat_capacity,
      sortable: true,
    },
    {
      name: "Download QRCode",
      selector: (row) => (
        <button
          type="button"
          className="btn text-dark-success"
          onClick={() => {
            downloadTableQRCode(row.id, row.table_no);
          }}
        >
          <i className="fas fa fa-download"></i>
        </button>
      ),
    },
    {
      name: "Status",
      selector: (row) =>
        row.status == 1 ? (
          <span className="text-success fw-bold">Active</span>
        ) : (
          <span className="text-danger fw-bold">Disable</span>
        ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
    },
  ];

  const actionButton = (tableId) => {
    return (
      <>
        <ul className="action">
          <li>
            <Link href="#">
              <a onClick={() => handleOpen(tableId)}>
                <EditIcon />
              </a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a onClick={() => handleOpenDelete(tableId)}>
                <DeleteIcon />
              </a>
            </Link>
          </li>
        </ul>
      </>
    );
  };

  useEffect(() => {
    const searchValue = parseInt(search, 10); // Parse the search input as an integer
    if (!isNaN(searchValue)) {
      const result = data?.filter((item) => {
        return item.table_no === searchValue;
      });
      setFilteredData(result);
    } else {
      // Handle the case when the search input is not a valid integer
      setFilteredData([]);
    }
    console.log("env: ", process.env.NEXT_PUBLIC_MANAGEBEDS_WEB);
  }, [search]);

  return (
    <>
      <HeadSection title="All Tables" />
      <div className="container-fluid">
        {/* <QRCode value="1"/> */}
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Tables</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Table
                  </Button>

                  {/* Create Modal Form */}
                  <Modal
                    dialogClassName="modal-md"
                    show={show}
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Create Table</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm
                        onSubmit={submitForm}
                        loading={loading}
                        validated={validated}
                      />
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
                      <Modal.Title>Update Table</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm
                        onSubmit={updateForm}
                        tableId={tableId}
                        loading={loading}
                        pending={pending}
                        validated={validated}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}

                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      loading={loading}
                      tableId={tableId}
                      pending={pending}
                    />
                  </Modal>
                </div>
              </div>

              <div className="card-body">
                <div className="">
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <input
                        type="text"
                        placeholder="search..."
                        className="w-25 form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    }
                    striped
                  />
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
