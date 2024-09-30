import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DeleteIcon from "../../../../../components/elements/DeleteIcon";

import Switch from "react-switch";
import toast from "../../../../../components/Toast/index";
import EditIcon from "../../../../../components/elements/EditIcon";
import Axios from "../../../../../utils/axios";

//Create Task Component
const CreateForm = ({ onSubmit, loading }) => {
  const { http } = Axios();

  const [template_status, setStatus] = useState<boolean>(false);
  const [template_type, setType] = useState<boolean>(false);
  const [template, setTemplate] = useState({
    title: "",
    slug: "",
    description: "",
    status: Number(template_status),
    type: template_type == false ? "static" : "dynamic",
  });

  // const handleChange =(e)=>{
  //   setTemplate(prev=>({
  //     ...prev, taskName:e.target.value
  //   }))
  // }
  const handleChange = (e) => {
    setTemplate((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const setTemplateStatus = (status) => {
    setTemplate((prev) => ({
      ...prev,
      status: status == true ? 1 : 0,
    }));
    setStatus(status);
  };

  const setTemplateType = (type) => {
    setTemplate((prev) => ({
      ...prev,
      type: type == true ? "dynamic" : "static",
    }));
    setType(type);
  };

  let dataset = { ...template, action: "createTemplate" };

  return (
    <Form>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Template Title"
          name="title"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Slug</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Template Slug"
          name="slug"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter Description"
          name="description"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label style={{ display: "block" }}>Static/Dynamic</Form.Label>

        <Switch
          onChange={() => setTemplateType(!template_type)}
          checked={template_type}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label style={{ display: "block" }}>Active/In Active</Form.Label>

        <Switch
          onChange={() => setTemplateStatus(!template_status)}
          checked={template_status}
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
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, templateObj }) => {
  const { http } = Axios();
  let old_status = templateObj.status;
  const [template_status, setStatus] =
    templateObj.status == 1
      ? useState<boolean>(true)
      : useState<boolean>(false);
  const [template_type, setType] =
    templateObj.type == "dynamic"
      ? useState<boolean>(true)
      : useState<boolean>(false);

  const [template, setTemplate] = useState({
    id: templateObj.id,
    title: templateObj.title,
    slug: templateObj.slug,
    description: templateObj.description,
    status: Number(template_status),
  });

  const handleChange = (e) => {
    setTemplate((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setTemplateStatus = (status) => {
    setTemplate((prev) => ({
      ...prev,
      status: status == true ? 1 : 0,
    }));
    setStatus(status);
  };

  const setTemplateType = (type) => {
    setTemplate((prev) => ({
      ...prev,
      type: type == true ? "dynamic" : "static",
    }));
    setType(type);
  };

  let dataset = { ...template, action: "editTemplate" };

  return (
    <Form>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Template Title"
          name="title"
          defaultValue={template.title}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Slug</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Template Slug"
          name="slug"
          defaultValue={template.slug}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter Description"
          name="description"
          defaultValue={template.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label style={{ display: "block" }}>Static/Dynamic</Form.Label>

        <Switch
          onChange={() => setTemplateType(!template_type)}
          checked={template_type}
        />
      </Form.Group>

      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label style={{ display: "block" }}>Active/Deractive</Form.Label>

        <Switch
          onChange={() => setTemplateStatus(!template_status)}
          checked={template_status}
        />
      </Form.Group>

      <Button
        variant="primary"
        className="shadow rounded"
        style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset, old_status)}
      >
        update
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, templateObj }) => {
  const [template, setTemplate] = useState({
    id: templateObj.id,
  });

  let dataset = { ...template, action: "deleteTemplate" };
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {templateObj.title} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView() {
  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [taskList, setTasklist] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const submitForm = async (template) => {
    if (template.title == "") {
      notify("error", "Template Title is required");
      return;
    }
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/template`,
        template
      )
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
        }
        setLoading(false);
      });

    fetchtaskList();

    return () => (isSubscribed = false);
  };

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [id, setId] = useState(null);
  const [templateObj, setTemplateObj] = useState({});

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (obj) => {
    setTemplateObj(obj);
    setShowUpdateModal(true);
    return;
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (obj) => {
    setTemplateObj(obj);
    setShowDeleteModal(true);
    return;
  };

  //Update task form
  const updateForm = async (formData, old_status) => {
    let isSubscribed = true;
    setPending(true);

    if (formData.title == "") {
      notify("error", "Template Title is required");
      return;
    }
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/template`,
        formData
      )
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
        }
        setPending(false);
      });

    fetchtaskList();

    return () => (isSubscribed = false);
  };

  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/template`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchtaskList();

    return () => (isSubscribed = false);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchtaskList();
    });
    return () => clearTimeout(timeout);
  }, []);

  //Fetch List Data for datatable
  const data = taskList?.data;

  const fetchtaskList = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/template`, {
        action: "getAllTemplates",
      })
      .then((res) => {
        if (isSubscribed) {
          setTasklist(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((data) => {
      return data.title.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  const actionButton = (row) => {
    return (
      <>
        <ul className="action ">
          <li>
            <Link href="#">
              <a onClick={() => handleOpen(row)}>
                <EditIcon />
              </a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a onClick={() => handleOpenDelete(row)}>
                <DeleteIcon />
              </a>
            </Link>
          </li>
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status == 1 ? "Active" : "Deactive"),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12  p-xs-2">
          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-singleTasks-center">
              <div>
                <h4 className="card-title mb-0">All Templates</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Button
                  className="shadow rounded"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Template
                </Button>

                {/* Create Modal Form */}
                <Modal
                  dialogClassName="modal-md"
                  show={show}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Create Template</Modal.Title>
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
                    <Modal.Title>Update Template</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} templateObj={templateObj} />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent
                    onSubmit={handleDelete}
                    templateObj={templateObj}
                  />
                </Modal>
              </div>
            </div>

            <div className="card-body">
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
  );
}
