import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import toast from "../../../../components/Toast/index";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import Select from "../../../../components/elements/Select";
import Select2 from "../../../../components/elements/Select2";
import ViewIcon from "../../../../components/elements/ViewIcon";
import Loader from "../../../../components/Loader";
import Axios from "../../../../utils/axios";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import { getSSRProps } from "../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.tnsprt.vhlc" });
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
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState({
    driver_id: null,
    driver_name: "",
    salary_amount: "",
    mobile: ""
  });
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);




  const [vehicle, setVehicle] = useState({
    model: "",
    brand: "",
    reg_no: "",
    vehicle_type: "",
    fuel_type: "",
    // driver:"",
    seat_capacity: null,
  });



  const handleChange = (e) => {
    setVehicle((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,

    }));
  };




  //------------------------------ fetch all Drivers------------------------------

  // useEffect(() => {

  //   const controller = new AbortController();
  //   const getAllDrivers = async () => {
  //     await http
  //       .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
  //       .then((res) => {
  //         console.log(res.data.data)
  //         setDrivers(res.data.data);
  //       });

  //   }

  //   getAllDrivers();
  //   return () => controller.abort();
  // }, []);


  useEffect(() => {
    const controller = new AbortController();
    const getAllDrivers = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
        .then((res) => {
          const filteredDrivers = res.data.data.filter(employee => employee.designation_name === "Driver");
          setDrivers(filteredDrivers);
        });
  
    }
  
    getAllDrivers();
    return () => controller.abort();
  }, []);
  



  const onSelectDriver = (e) => {
    setDriver({
      driver_id: e.value,
      driver_name: e.label,
      salary_amount: e.salary_amount,
      mobile: e.mobile
    })

  }


  //------------------------------ fetch all Drivers end------------------------------


  //------------------------------ fetch  Driver info ------------------------------




  const [driverDetails, setDriverDetails] = useState({});
  const [driverInfoloading, setDriverInfoLoading] = useState(false);
  const fetchDriverDetails = async (driverID) => {

    setDriverDetails([]);
    setDriverInfoLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeInfo",
        employee_id: driverID,
      })
      .then((res) => {
        setDriverDetails(res?.data?.data);
        setDriverInfoLoading(false);
      });
  };




  //------------------------------ fetch  Driver info ------------------------------




  let driverId = driver.driver_id;

  // let dataset = { ...vehicle, driverId, action: "createVehicle" };
  let dataset = { ...vehicle, action: "createVehicle" };


  return (
    <Form validated={validated}>

      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Model name<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Model Name"
              name="model"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Brand name<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Brand Name"
              name="brand"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Registration Number<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter registration number"
              name="reg_no"
              onChange={handleChange}
              required
            />
          </Form.Group>

        </div>
        <div className="col-md-6">
          <Form.Group controlId="formBasicDesc">
            <Form.Label>Vehicle Type<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Vehicle Type"
              name="vehicle_type"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicDesc" className="mt-3">
            <Form.Label>Fuel Type<span className="text-danger">*</span></Form.Label>
            <Select name="fuel_type" onChange={handleChange}>
              <option value="">None</option>
              <option value="disel">Disel</option>
              <option value="petrol">Petrol</option>
              <option value="octen">Octan</option>
              <option value="electric_fuel">Electric Fuel</option>
            </Select>

          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Seat Capacity<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Seat Capacity"
              name="seat_capacity"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-6">

          <Form.Group controlId="formBasicDesc" className="mt-3">
            <Form.Label>Drivers<span className="text-danger">*</span></Form.Label>
            <Select2 name="driver"
              options={
                drivers?.map(({ id, name, mobile, salary_amount }) => ({ value: id, label: name, mobile, salary_amount }))
              }
              onChange={(e) => { onSelectDriver(e); fetchDriverDetails(e.value); }}>

            </Select2>
          </Form.Group>

          {driverDetails?.name &&

            <div className="col p-0">

              <div className=' ' style={{
                fontSize: '12px',
                marginTop: '5px',
                padding: '0px 5px',
              }}>
                <span className='text-dark fw-bold'>Name: </span> <span className=' fw-bold'>{driverDetails?.name} ,</span> &nbsp;
                <span className='text-dark fw-bold'>Mobile: </span><span className=' fw-bold'>{driverDetails?.mobile}</span> &nbsp;
              </div>
            </div>
          }
        </div>
        <div className="col-md-4">

        </div>
      </div> */}

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        disabled={loading}
        style={{ marginTop: "15px" }}
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
const EditForm = ({ onSubmit, vehicleId, pending, validated }) => {
  const { http } = Axios();

  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({
    model: "",
    brand: "",
    reg_no: "",
    vehicle_type: "",
    fuel_type: "",
    seat_capacity: null,
    // driver_id: null,
    vehicle_id: vehicleId,
  });

  const handleChange = (e) => {
    setVehicle((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchVehicleData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, {
        action: "getVehicleInfo",
        vehicle_id: vehicleId,
      })
      .then((res) => {
        if (isSubscribed) {
          setVehicle((prev) => ({
            ...prev,
            model: res.data.data.model,
            brand: res.data.data.brand,
            reg_no: res.data.data.reg_no,
            vehicle_type: res.data.data.vehicle_type,
            seat_capacity: res.data.data.seat_capacity,
            fuel_type: res.data.data.fuel_type,
            // driver_id: res.data.data.employee_id,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  let dataset = { ...vehicle, action: "updateVehicle" };



  //------------------------------ fetch  Driver info ------------------------------




  const [driverDetails, setDriverDetails] = useState([]);
  const [driverInfoloading, setDriverInfoLoading] = useState(false);
  const fetchDriverDetails = async () => {
    setDriverDetails([]);
    setDriverInfoLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeInfo",
        employee_id: vehicle.driver_id,
      })
      .then((res) => {
        // console.log("emp info",res?.data?.data);
        setDriverDetails(res?.data?.data)
        //   setDriverDetails([res?.data?.data]);
        setDriverInfoLoading(false);
      });
  };


  useEffect(() => {
    fetchDriverDetails()
  }, [vehicle.driver_id])



  //------------------------------ fetch  Driver info ------------------------------

  return (
    <Form>
      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Model name<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Model Name"
              name="model"
              onChange={handleChange}
              defaultValue={vehicle.model}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Brand name<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Brand Name"
              name="brand"
              onChange={handleChange}
              defaultValue={vehicle.brand}
              required
            />
          </Form.Group>


          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Registration Number<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter registration number"
              name="reg_no"
              onChange={handleChange}
              defaultValue={vehicle.reg_no}
              required
            />
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-2" controlId="formBasicDesc">
            <Form.Label> Vehicle Type<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Vehicle Type"
              value={vehicle.vehicle_type}
              name="vehicle_type"
              onChange={handleChange}
            />

          </Form.Group>


          <Form.Group controlId="formBasicDesc" className="mt-3">
            <Form.Label>Fuel Type<span className="text-danger">*</span></Form.Label>
            <Select
              defaultValue={vehicle.fuel_type}
              name="fuel_type" onChange={handleChange}>
              <option value="">None</option>
              <option value="disel">Disel</option>
              <option value="petrol">Petrol</option>
              <option value="octen">Octen</option>
              <option value="electric_fuel">Electric Fuel</option>
            </Select>

          </Form.Group>

          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Seat Capacity<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Seat Capacity"
              name="seat_capacity"
              onChange={handleChange}
              defaultValue={vehicle.seat_capacity}
              required
            />
          </Form.Group>
        </div>
      </div>





      {/* <div className="row">
        <div className="col-md-8">
          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Driver<span className="text-danger">*</span></Form.Label>
            <Form.Control
              disabled
              type="number"
              placeholder="Em"
              name="seat_capacity"
              onChange={handleChange}
              defaultValue={vehicle.driver_id}
              // defaultValue={driverDetails.name}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">

        </div>
      </div> */}

      <Button
        variant="primary"
        className="shadow rounded"
        disabled={pending || loading}
        style={{ marginTop: "15px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? "updating..." : "update"}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, vehicleId, pending }) => {
  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState({
    vehicle_id: vehicleId,
  });

  let dataset = { ...vehicle, action: "deleteVehicle" };

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
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, items)
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

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.price) {
            notify("error", `${msg.price.Price}`);
          }
          if (msg?.foods) {
            notify("error", `please select atleast one food!`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (vehicle_id) => {
    setShowUpdateModal(true);
    setVehicleId(vehicle_id);
  };

  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`,
        formData
      )
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

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.price) {
            notify("error", `${msg.price.Price}`);
          }
          if (msg?.foods) {
            notify("error", `please select atleast one food!`);
          }
        }
        setPending(false);
        setValidated(true);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (vehicle_id) => {
    setShowDeleteModal(true);
    setVehicleId(vehicle_id);
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`,
        formData
      )
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
        console.log("error delete !");
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Tower Floor Rooms data list
  const [setmenuList, setSetmenuList] = useState([]);
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
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  //Fetch List Data for datatable
  const data = setmenuList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllVehicleList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {
            setFilteredData(prev => ({
              ...prev,
              total: res?.data?.data?.total || prev?.total,
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

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.model.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  const actionButton = (vehicleId) => {
    return (
      <>
        <ul className="action ">
          {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/transport/vehicles/details/${vehicleId}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}

          {accessPermissions.createAndUpdate && <li>
            <Link href="#">
              <a onClick={() => handleOpen(vehicleId)}>
                <EditIcon />
              </a>
            </Link>
          </li>}
          {accessPermissions.delete && <li>
            <Link href="#">
              <a onClick={() => handleOpenDelete(vehicleId)}>
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
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => row.reg_no,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicle_type,
      sortable: true,
    },
    {
      name: "Seat Capacity",
      selector: (row) => row.seat_capacity,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => actionButton(row.id),
      sortable: true,
      // width: "100px",
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Vehicles', link: '/modules/transport/vehicles' },
  ]


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];
  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Vehicles" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Vehicles</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate && <Button
                  className="shadow rounded btn-sm  "
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Vehicle
                </Button>}

                {/* Create Modal Form */}
                <Modal
                  dialogClassName="modal-md"
                  show={show}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Create Vehicle</Modal.Title>
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
                    <Modal.Title>Update Vehicle</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm
                      onSubmit={updateForm}
                      vehicleId={vehicleId}
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
                    vehicleId={vehicleId}
                    pending={pending}
                  />
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
                  placeholderText="Model / Brand / Reg No / Vehicle Type"

                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
