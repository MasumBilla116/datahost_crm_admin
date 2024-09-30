import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select2 from "../../../../components/elements/Select2";
import ViewIcon from '../../../../components/elements/ViewIcon';
import Loader from "../../../../components/Loader";
import Axios from '../../../../utils/axios';
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import { getSSRProps } from "../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.tnsprt.drvr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [vehicle, setVehicle] = useState({
    model: "",
    brand: "",
    reg_no: "",
    vehicle_type: "",
    seat_capacity: null
  })

  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState([])
  const [vehicleList, setVehicleList] = useState([]);
  const [vehiclee, setVehiclee] = useState([])
  const handleChange = (e) => {

    setVehicle(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // let dataset = { ...vehicle, action: "createVehicle" }
  let dataset = { vehicleId: vehiclee.vehicle_id, driverId: employee.employee_id, action: "createDriver" }



  // ---------------------- All diriver fetch--------------------------



  const getEmployee = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
      .then((res) => {
        const filteredEmployees = res.data.data.filter(employee => employee.designation_name === "Driver");
        setEmployeeList(filteredEmployees);
        // setEmployeeList(res.data.data);
      });
  };

  //---------------------- All diriver fetch end--------------------------

  // ---------------------- single diriver values--------------------------

  const onSelectEmployee = (e) => {
    setEmployee({
      employee_id: e.value,
      employee_name: e.label,
      salary_amount: e.salary_amount,
      salary_type: e.salary_type
    })

  }
  // ---------------------- single diriver values end--------------------------

  // ---------------------- All Vehicle fetch--------------------------



  const getVehicle = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, { action: "getAllVehicle" })
      .then((res) => {
        setVehicleList(res.data.data);
      });
  };


  //---------------------- All Vehicle fetch end--------------------------




  // ---------------------- single Vehicle values--------------------------

  const onSelectVehicle = (e) => {
    setVehiclee({
      vehicle_id: e.value,
      vehicle_name: e.label,
    })

  }
  // ---------------------- single Vehicle values end--------------------------

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getEmployee();
      getVehicle();
    });
    return () => clearTimeout(timeout);
  }, []);

  return (

    <Form validated={validated}>

      <div className="row">
        <div className="col-md-12">

          <Form.Group className="mb-2" controlId="formBasicDesc" >
            <Form.Label>Select Employee<span className="text-danger">*</span></Form.Label>
            <Select2 name="employee_type"
              options={employeeList && employeeList.map(({ id, name, salary_amount, salary_type }) => ({ value: id, label: name, salary_amount, salary_type }))}
              onChange={onSelectEmployee}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formBasicDesc" >
            <Form.Label>Select vehicle<span className="text-danger">*</span></Form.Label>
            <Select2 name="vehicle_type"
              options={vehicleList && vehicleList.map(({ id, name, reg_no, model }) => ({ value: id, label: model, reg_no }))}
              onChange={onSelectVehicle}
            />
          </Form.Group>

        </div>
        <div className="col-md-2">


        </div>
      </div>


      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, driver_id, pending, validated }) => {
  const { http } = Axios();

  const [loading, setLoading] = useState(true);

  const [driver, setDriver] = useState({
    employee_id: "",
    employee_name: "",
    vehicle_id: "",
    model: ""
  })

  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState([])
  const [vehicleList, setVehicleList] = useState([]);
  const [vehiclee, setVehiclee] = useState([])

  const handleChange = (e) => {

    setVehicle(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const fetchVehicleData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers`, { action: "getDriverInfo", driver_id: driver_id })
      .then((res) => {
        if (isSubscribed) {
          setDriver(prev => ({
            ...prev,
            employee_id: res.data.data.employee_id,
            employee_name: res.data.data.employee_name,
            vehicle_id: res.data.data.vehicle_id,
            model: res.data.data.model,
          }))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [driver_id]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData])


  const selected_employee_options = { value: driver?.employee_id, label: driver?.employee_name };
  const selected_vehicle_options = { value: driver?.vehicle_id, label: driver?.model };

  // console.log("selected_employee_options",selected_employee_options,"         ","selected_vehicle_options","  ",selected_vehicle_options);
  // console.log("data updated",driver_id, vehiclee.vehicle_id,employee.employee_id);
  // console.log({driver_id: driver_id, vehicleId:vehiclee.vehicle_id,driverId:employee.employee_id, action: "updateDriver" }); 
  // console.log(driver.employee_name,driver.employee_id,driver.vehicle_id ,driver.model,driver);


  // ---------------------- All diriver fetch--------------------------
  const getEmployee = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
      .then((res) => {
        setEmployeeList(res.data.data);
      });
  };

  //---------------------- All diriver fetch end--------------------------





  // ---------------------- single diriver values--------------------------
  const onSelectEmployee = (e) => {
    setEmployee({
      employee_id: e.value,
      employee_name: e.label,
      salary_amount: e.salary_amount,
      salary_type: e.salary_type
    })

  }
  // ---------------------- single diriver values end--------------------------







  // ---------------------- All Vehicle fetch--------------------------



  const getVehicle = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, { action: "getAllVehicle" })
      .then((res) => {
        setVehicleList(res.data.data);
      });
  };


  //---------------------- All Vehicle fetch end--------------------------




  // ---------------------- single Vehicle values--------------------------





  const onSelectVehicle = (e) => {
    setVehiclee({
      vehicle_id: e.value,
      vehicle_name: e.label,
    })

  }
  // ---------------------- single Vehicle values end--------------------------



  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getEmployee();
      getVehicle();
    });
    return () => clearTimeout(timeout);
  }, []);


  let dataset = { driver_id: driver_id, vehicleId: vehiclee.vehicle_id || driver?.vehicle_id, driverId: employee.employee_id || driver?.employee_id, action: "updateDriver" }

  return (

    <Form >

      <div className="row">
        <div className="col-md-10">

          <Form.Group className="mb-2" controlId="formBasicDesc" >
            <Form.Label>Select Employee<span className="text-danger">*</span></Form.Label>
            {!!driver?.employee_id === true &&
              <Select2 name="employee_type"
                options={employeeList && employeeList.map(({ id, name, salary_amount, salary_type }) => ({ value: id, label: name, salary_amount, salary_type }))}
                onChange={onSelectEmployee}
                defaultValue={selected_employee_options}
              />
            }
            {!!driver?.employee_id === false &&
              <Select2 name="employee_type"
                options={employeeList && employeeList.map(({ id, name, salary_amount, salary_type }) => ({ value: id, label: name, salary_amount, salary_type }))}
                onChange={onSelectEmployee}
              />
            }

          </Form.Group>
          <Form.Group className="mb-2" controlId="formBasicDesc" >
            <Form.Label>Select vehicle<span className="text-danger">*</span></Form.Label>

            {/* {  driver?.id !== null && */}
            {!!driver?.vehicle_id === true &&
              <Select2 name="vehicle_type"
                options={vehicleList && vehicleList.map(({ id, name, reg_no, model }) => ({ value: id, label: model, reg_no }))}
                onChange={onSelectVehicle}
                defaultValue={selected_vehicle_options}
              />
            }

            {!!driver?.vehicle_id === false &&
              <Select2 name="vehicle_type"
                options={vehicleList && vehicleList.map(({ id, name, reg_no, model }) => ({ value: id, label: model, reg_no }))}
                onChange={onSelectVehicle}
              />
            }
            {/* } */}
          </Form.Group>

        </div>
        <div className="col-md-2">


        </div>
      </div>
      <Button variant="primary" className="shadow rounded"
        disabled={pending || loading} style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? 'updating...' : 'update'}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, driver_id, pending }) => {
  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [driver, setDriverId] = useState({
    driver_id: driver_id
  })

  let dataset = { ...driver, action: "deleteDriver" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({ accessPermissions }) {

  const { http } = Axios();

  // const notify = React.useCallback((type, message) => {
  //     toast({ type, message });
  //   }, []);

  const { notify } = MyToast();
  const router = useRouter();
  const { pathname } = router;

  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setValidated(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true
          }))
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.driverId) {
            notify("error", `${msg.driverId.EmployeeId}`);
          }
          if (msg?.vehicleId) {
            notify("error", `${msg.vehicleId.VehicleId}`);
          }

        }
        setLoading(false);
        setValidated(true);
      });

    fetchDriversList();

    return () => isSubscribed = false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [driver_id, setDriver_id] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (id) => {

    // console.log("obj",obj);
    setShowUpdateModal(true);
    setDriver_id(id);


  }


  //Update floor form
  const updateForm = async (formData) => {

    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setValidated(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true
          }))
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.driverId) {
            notify("error", `${msg.driverId.EmployeeId}`);
          }
          if (msg?.vehicleId) {
            notify("error", `${msg.vehicleId.VehicleId}`);
          }

        }
        setPending(false);
        setValidated(true);
      });

    fetchDriversList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);

  const handleOpenDelete = (driver_id) => {
    setShowDeleteModal(true);
    setDriver_id(driver_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true
          }))
        }

      })
      .catch((e) => {
        console.log('error delete !')
        setPending(false);
      });

    fetchDriversList();

    return () => isSubscribed = false;
  }

  //Tower Driver data list
  const [vehicleRegNo, setVehicleRegNo] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true)
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
      fetchDriversList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);


  //Fetch List Data for datatable
  const data = vehicleRegNo?.data;


  const fetchDriversList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllDriverList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {
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
    return () => isSubscribed = false;
  };



  const actionButton = (driver_id) => {

    return <>
      <ul className="action ">
        {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/transport/drivers/details/${driver_id}`}
          >
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}

        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(driver_id)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(driver_id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }


  const columns = [
    {
      name: <span className='fw-bold' >SL</span>,
      selector: (row, index) => index + 1,
      width: "10%"
    },

    {
      name: 'Employee Name',
      selector: row => row.employee_name,
      sortable: true,
    },
    {
      name: 'Model',
      selector: row => row.model,
      sortable: true,
    },
    {
      name: 'Registration No',
      selector: row => row.reg_no,
      sortable: true,
    },
    {
      name: 'Vehicle Type',
      selector: row => row.vehicle_type,
      sortable: true,
    },
    {
      name: 'Seat Capacity',
      selector: row => row.seat_capacity,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      // width: "100px",
      sortable: true,
    },

  ];


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Drivers', link: '/modules/transport/drivers' },
  ]


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];
  const [editData, setEditData] = useState({});

  const handleAdd = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "createEmployeeId" })
      .then((res) => {
        console.log("res", res?.data?.data)
        setEditData(null);

        router.push({
          pathname: '../hrm/employee/update',
          query: { data: null, employee_id: res?.data?.data, updateForm: false },
        });
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        notify("warning", msg);
      });


  };
  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Drivers" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Drivers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate && (
                  <>
                    <Button
                      className="shadow rounded btn-sm me-2"
                      variant="primary"
                      type="button"
                      onClick={handleAdd}
                      block
                    >
                      Add New Driver
                    </Button>

                    {/* New Button Example */}
                    <Button
                      className="shadow rounded btn-sm"
                      // variant="secondary"
                       variant="primary"
                      type="button"
                      // onClick={handleManageDrivers}
                      onClick={handleShow}
                      block
                    >

                      Manage Vehicles Drivers
                    </Button>
                  </>
                )}

                {/* Create Modal Form */}
                <Modal dialogClassName="" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Driver</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Driver</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm
                      onSubmit={updateForm}
                      driver_id={driver_id}
                      pending={pending}
                      validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}

                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} driver_id={driver_id} pending={pending} />
                </Modal>
              </div>

            </div>


            <div className="card-body">
              <div className="">


                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Name / Model /Reg No/ Vehicle Type"
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />


              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}