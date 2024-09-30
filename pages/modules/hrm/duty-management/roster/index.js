import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { Select2 } from "../../../../../components";
import toast from "../../../../../components/Toast/index";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import ViewIcon from '../../../../../components/elements/ViewIcon';
import Axios from '../../../../../utils/axios';

//Create Component
const CreateForm = ({ onSubmit, loading }) => {

  const { http } = Axios();

  const [roster, setRoster] = useState({});
  const [dutyShiftList, setDutyShiftList] = useState([]);
  const [dutyShift, setDutyShift] = useState();
  //start date and end date
  const [openStartDate, setOpenStartDate] = useState(false);
  const [OpenEndDate, setOpenEndDate] = useState(false);
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  //  start_date,end_date

  const handleChange = (e) => {
    setRoster(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }
  const getDutyShift = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, { action: "allDutyShifts" })
      .then((res) => {
        setDutyShiftList(res.data.data);
      });
  };
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getDutyShift()
    });
    return () => clearTimeout(timeout);
  }, []);

  const onSelectDuty = (id) => {
    setRoster({
      ...roster,
      duty_shift_id: id
    })
  }


  let dataset = { ...roster, start_date, end_date, action: "createRoster" }

  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })

  return (
    <Form>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Roster Name"
          name='name'
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Duty Shift</Form.Label>
        <Select2
          options={dutyShiftList && dutyShiftList.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={e => onSelectDuty(e.value)}
          className="select-bg"
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Start Date</Form.Label>
        {/* <input 
              type="date" 
              className="form-control" 
              name="start_date" 
              onChange={handleChange}
            >
            </input> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker

            size={1}
            label="From"
            open={openStartDate}
            onClose={() => setOpenStartDate(false)}
            value={start_date}
            inputFormat="yyyy-MM-dd"
            onChange={(event) => {
              set_start_date(format(new Date(event), 'yyyy-MM-dd'));
            }}

            renderInput={(params) =>
              <ThemeProvider theme={theme}>
                <TextField onClick={() => setOpenStartDate(true)} fullWidth={true} size='small' {...params} required />
              </ThemeProvider>
            }
          />
        </LocalizationProvider>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>End Date</Form.Label>
        {/* <input 
              type="date" 
              className="form-control" 
              name="end_date" 
              onChange={handleChange}
            >
            </input> */}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker

            size={1}
            label="To"
            open={OpenEndDate}
            onClose={() => setOpenEndDate(false)}
            value={end_date}
            inputFormat="yyyy-MM-dd"
            onChange={(event) => {
              set_end_date(format(new Date(event), 'yyyy-MM-dd'));
            }}

            renderInput={(params) =>
              <ThemeProvider theme={theme}>
                <TextField onClick={() => setOpenEndDate(true)} fullWidth={true} size='small' {...params} required />
              </ThemeProvider>
            }
          />
        </LocalizationProvider>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Description</Form.Label>
        <Form.Control
          as="textarea" rows={5}
          placeholder="Enter Description"
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
  const { http } = Axios();
  const [dutyShiftList, setDutyShiftList] = useState([]);
  const [roster, setRoster] = useState({
    name: item.name,
    start_date: item.start_date,
    end_date: item.end_date,
    description: item.description,
    duty_shift_id: item.duty_shift_id,
    id: item.id,
  })

  const handleChange = (e) => {
    setRoster(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const getDutyShift = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/dutyShift`, { action: "allDutyShifts" })
      .then((res) => {
        setDutyShiftList(res.data.data);
      });
  };
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getDutyShift()
    });
    return () => clearTimeout(timeout);
  }, []);

  const onSelectDuty = (id) => {
    setRoster({
      ...roster,
      duty_shift_id: id
    })
  }

  let dataset = { ...roster, action: "updateRoster" }

  return (
    <Form >
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Room Category Name"
          defaultValue={roster.name}
          name="name"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Duty Shift</Form.Label>
        <Select2
          options={dutyShiftList && dutyShiftList.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={e => onSelectDuty(e.value)}
          placeholder={item.duty_shift ? item.duty_shift.name : ''}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Start Date</Form.Label>
        <input type="date"
          className="form-control"
          name="start_date"
          onChange={handleChange}
          value={roster.start_date}

        ></input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>End Date</Form.Label>
        <input
          type="date"
          className="form-control"
          name="end_date"
          value={roster.end_date}
          onChange={handleChange}>
        </input>
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label style={{ margin: '0px' }}>Description</Form.Label>
        <Form.Control
          as="textarea" rows={5}
          placeholder="Enter Category Description"
          defaultValue={roster.description}
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

  const [roster, setRoster] = useState({
    name: item.name,
    id: item.id
  })

  let dataset = { ...roster, action: "deleteRoster" }
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {roster.name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};


export default function RosterListView({ accessPermissions }) {

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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, items)
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, formData)
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, formData)
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, {
      action: "allRosters",
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
          <Link href={`/modules/hrm/duty-management/roster/details/${row.id}`}>
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
      name: 'Title',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Shift',
      selector: row => row.duty_shift ? row.duty_shift.name : '',
      sortable: true,
    },
    {
      name: 'Start date',
      selector: row => row.start_date,
      sortable: true,
    },
    {
      name: 'End date',
      selector: row => row.end_date,
      sortable: true,
    },
    // {
    //   name: 'Description',
    //   selector: row => row.description,
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: row => actionButton(row),
    },

  ];


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Roster', link: '/modules/dutyManagement/roster' },
    // { text: 'All Duty Shift', link: '/modules/dutyManagement/shift' },

  ];

  return (

    <>
      {/* <HeadSection title="All Roster" /> */}

      <div className="">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card mb-xs-1 shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Roster</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Roster
                  </Button>}

                  {/* Create Modal Form */}
                  <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Roster</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Roster</Modal.Title>
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
    </>
  )
}