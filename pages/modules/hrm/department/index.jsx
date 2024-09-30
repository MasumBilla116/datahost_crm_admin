import * as moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Switch from "react-switch";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import toast from "../../../../components/Toast/index";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import ViewIcon from "../../../../components/elements/ViewIcon";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "./../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.dept",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};



//Create Component
const CreateForm = ({ onSubmit, loading }) => {
  const { http } = Axios();

  const [department_status, setStatus] = useState(true);
  const [department, setDepartment] = useState({
    status: Number(department_status),
  });

  const handleChange = (e) => {
    setDepartment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const setDepartmentStatus = (status) => {
    setDepartment((prev) => ({
      ...prev,
      status: status == true ? 1 : 0,
    }));
    setStatus(status);
  };
  let dataset = { ...department, action: "createDepartment" };

  return (
    <>
      <Form>
        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
          <Form.Label>
            Department Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your department name"
            autoFocus
            name="name"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Department Description <span className="text-danger">*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ display: "block" }}>
            Department Status
          </Form.Label>

          <Switch
            onChange={() => setDepartmentStatus(!department_status)}
            checked={department_status}
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
    </>
  );
};

//Update component
const EditForm = ({ onSubmit, item }) => {
  const [department_status, setStatus] =
    item.status == 1 ? useState(true) : useState(false);
  const [department, setDepartment] = useState({
    name: item.name,
    description: item.description,
    id: item.id,
    status: Number(department_status),
  });
  let old_status = item.status;

  const handleChange = (e) => {
    setDepartment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const setDepartmentStatus = (status) => {
    setDepartment((prev) => ({
      ...prev,
      status: status == true ? 1 : 0,
    }));
    setStatus(status);
  };
  let dataset = { ...department, action: "editDepartment" };

  return (
    <>
      <Form>
        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
          <Form.Label>
            Department Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your department name"
            autoFocus
            name="name"
            onChange={handleChange}
            defaultValue={department.name}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Department Description </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            onChange={handleChange}
            defaultValue={department.description}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ display: "block" }}>
            Department Status
          </Form.Label>

          <Switch
            onChange={() => setDepartmentStatus(!department_status)}
            checked={department_status}
          />
        </Form.Group>

        <Button
          variant="primary"
          className="shadow rounded"
          style={{ marginTop: "5px" }}
          onClick={() => onSubmit(dataset)}
        >
          Update
        </Button>
      </Form>
    </>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, item }) => {
  const [department, setDepartment] = useState({
    name: item.name,
    id: item.id,
  });

  let dataset = { ...department, action: "deleteDepartment" };
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {department.name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {
  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const router = useRouter();
  const { pathname } = router;

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;

  const [currentPage, setCurrentPage] = useState(1)
  const [perPageShow, setPerPageShow] = useState(15)
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
    setFilterValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true
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
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments?page=${currentPage}&perPageShow=${perPageShow}`, {
            action: "getAllDepartmentList",
            filterValue: filterValue
          })
            .then((res) => {
              if (isSubscribed) {
                setItemList(res?.data);
                // setFilteredData(res.data?.data);
                setFilteredData(prev => ({
                  ...prev,
                  total: res.data?.data?.total || prev.total,
                  paginate: true,
                  [currentPage]: res?.data?.data[currentPage]
                }));
              }
            });
          setFilterValue(prev => ({
            ...prev,
            filter: false,
            search: null
          }));
        }
        setTblLoader(false);
      // }, 800)
  
  
  
      return () => (isSubscribed = false);
    }

  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`,
        items
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setFilterValue((prev)=>({
            ...prev,
            filter:true
        }))
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

    fetchItemList();

    return () => (isSubscribed = false);
  };

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [id, setId] = useState(null);
  const [item, setItem] = useState({});

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (obj) => {
    setShowUpdateModal(true);
    setItem(obj);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (obj) => {
    setShowDeleteModal(true);
    setItem(obj);
  };

  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setFilterValue((prev)=>({
            ...prev,
            filter:true
        }))
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

    fetchItemList();

    return () => (isSubscribed = false);
  };

  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
          setFilterValue((prev)=>({
            ...prev,
            filter:true
        }))
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };



;



  const actionButton = (row) => {
    return (
      <>
        <ul className="action ">
          {/* {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/hrm/department/details/${row.id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>} */}

         {accessPermissions.createAndUpdate && <li>
            <Link href="#">
              <a onClick={() => handleOpen(row)}>
                <EditIcon />
              </a>
            </Link>
          </li>}
          { accessPermissions.delete && <li>
            <Link href="#">
              <a onClick={() => handleOpenDelete(row)}>
                <DeleteIcon />
              </a>
            </Link>
          </li>}
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Creator",
      selector: (row) => row.creator?.name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.created_at).format("Do MMM YYYY"),
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status === 0 ? "Inactive" : "Active",
      sortable: true,
      cell: row => (
        <div style={{ color: row.status === 0 ? 'red' : 'green' }}>
          {row.status === 0 ? "Inactive" : "Active"}
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => actionButton(row),
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.status == 0,
      style: {
        color: "red",
      },
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Department", link: "/modules/hr/department/list" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];





  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Departments" />


      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card mb-xs-1 shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Department</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
               {accessPermissions.createAndUpdate &&  <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Department
                </Button>}

                {/* Create Modal Form */}
                <Modal
                  dialogClassName="modal-md"
                  show={show}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Create Department</Modal.Title>
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
                    <Modal.Title>Update Department</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} item={item} />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} item={item} />
                </Modal>
              </div>
            </div>

            <div className="card-body">
              <ServiceFilter
                statusList={dynamicStatusList}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                handleChangeFilter={handleChangeFilter}
                dateFilter={false}
                placeholderText="Name"
              />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
