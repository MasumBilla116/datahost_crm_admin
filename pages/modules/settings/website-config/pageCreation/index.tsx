import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DeleteIcon from "../../../../../components/elements/DeleteIcon";

import toast from "../../../../../components/Toast/index";
import EditIcon from "../../../../../components/elements/EditIcon";
import Axios from "../../../../../utils/axios";

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
      // fetchtaskList();
    });
    return () => clearTimeout(timeout);
  }, []);

  //Fetch List Data for datatable
  const data = taskList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`, {
        action: "getAllPage",
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
    fetchItemList();
    let controller = new AbortController();
    const result = data?.filter((data) => {
      return data.page_name.toLowerCase().match(search.toLocaleLowerCase());
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
              <Link
                href={`/modules/website-configuration/pageCreation/update/${row.id}`}
              >
                <a>
                  <EditIcon />
                </a>
              </Link>
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
      name: "Page Name",
      selector: (row) => row.page_name,
      sortable: true,
    },
    {
      name: "Menu",
      selector: (row) => row.menu?.title,
      sortable: true,
    },
    {
      name: "Template",
      selector: (row) => row.template?.title,
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
                <h4 className="card-title mb-0">All Template</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Link href="/modules/website-configuration/pageCreation/create">
                  <Button
                    className="shadow rounded"
                    variant="primary"
                    type="button"
                    block
                  >
                    Create Template
                  </Button>
                </Link>

                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent
                    onSubmit={handleDelete}
                    templateObj={templateObj}
                  />
                </Modal>
              </div>
            </div>

            <div className="card-body table-responsive">
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
