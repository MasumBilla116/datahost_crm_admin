import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import toast from "../../../../../components/Toast/index";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import ViewIcon from '../../../../../components/elements/ViewIcon';
import Axios from '../../../../../utils/axios';

//Create Component
const CreateForm = ({ onSubmit, loading }) => {

  const { http } = Axios();

  const [dutyShift, setDutyShift] = useState({
    name: "",
    start_time: "",
    end_time: "",
    description: ""
  })

  const handleChange = (e) => {
    setDutyShift(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  let dataset = { ...dutyShift, action: "createDutyShift" }

  return (
    <Form>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Shift Name"
          name='name'
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Start Time</Form.Label>
        <input type="time" className="form-control" name="start_time" onChange={handleChange}></input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>End Time</Form.Label>
        <input type="time" className="form-control" name="end_time" onChange={handleChange}></input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Description</Form.Label>
        <Form.Control
          as="textarea" rows={5}
          placeholder="Enter Category Description"
          name='description'
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, item }) => {

  const [dutyShift, setDutyShift] = useState({
    name: item.name,
    start_time: item.start_time,
    end_time: item.end_time,
    description: item.description,
    id: item.id,
  })

  const handleChange = (e) => {
    setDutyShift(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }
  let dataset = { ...dutyShift, action: "updateDutyShift" }

  return (
    <Form >
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Room Category Name"
          defaultValue={dutyShift.name}
          name="name"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Start Time</Form.Label>
        <input type="time"
          className="form-control"
          name="start_time"
          onChange={handleChange}
          defaultValue={dutyShift.start_time}

        ></input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>End Time</Form.Label>
        <input
          type="time"
          className="form-control"
          name="end_time"
          defaultValue={dutyShift.end_time}
          onChange={handleChange}>
        </input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea" rows={5}
          placeholder="Enter Category Description"
          defaultValue={dutyShift.description}
          name="description"
          onChange={handleChange}
        />
      </Form.Group>


      <Button variant="primary" className="shadow rounded"
        style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        update
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, item }) => {

  const [dutyShift, setDutyShift] = useState({
    name: item.name,
    id: item.id
  })

  let dataset = { ...dutyShift, action: "deleteDutyShift" }
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {dutyShift.name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};


export default function ShiftListView({ accessPermissions }) {

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const submitForm = async (items) => {

    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }

        }
        setLoading(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [id, setId] = useState(null);
  const [item, setItem] = useState({});



  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (obj) => {
    setShowUpdateModal(true);
    setItem(obj);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (obj) => {

    setShowDeleteModal(true);
    setItem(obj);
  }



  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);

        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }

        }
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  const handleDelete = async (formData) => {

    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);

        }

      })
      .catch((e) => {
        console.log('error delete !')
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }




  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = itemList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, {
      action: "allDutyShifts",
    })
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])


  const actionButton = (row) => {
    return <>
      <ul className="action ">
        {/* {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/hrm/duty-management/shift/details/${row.id}`}>
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
        {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(row)}>
              <DeleteIcon />
            </a>
          </Link>
        </li>}

      </ul>
    </>
  }

  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Start time',
      selector: row => row.start_time,
      sortable: true,
    },
    {
      name: 'End time',
      selector: row => row.end_time,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row),
    },

  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Duty Shift', link: '/modules/dutyManagement/shift' },

  ];

  return (


    <>
      {/* <HeadSection title="All Duty Shift" /> */}

      <div className="">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card mb-xs-1 shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Duty Shift</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Duty Shift
                  </Button>}

                  {/* Create Modal Form */}
                  <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Duty Shift</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Duty Shift</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm onSubmit={updateForm} item={item}
                      />
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
  )
}