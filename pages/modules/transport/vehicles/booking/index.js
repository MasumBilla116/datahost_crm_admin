import MyToast from "@mdrakibul8001/toastify";
import { createTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteIcon, EditIcon, HeadSection, ViewIcon } from "../../../../../components";
import ActiveCurrency from "../../../../../components/ActiveCurrency";
import FilterDatatable from "../../../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../../../components/Filter/ServiceFilter";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.tnsprt.bkng" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const DeleteComponent = ({ onSubmit, id, pending }) => {
  const { http } = Axios();
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    vehicleBookingId: id,
  });

  const fetchVehicleBooking = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`,
        {
          action: "getVehicleBookingInfo",
          vehicleBookingId: id,
        }
      )

      .then((res) => {
        if (isSubscribed) {
          setModelName(res.data.data.vehicleBookDetails[0].model);
          setLoading(false);
        }
      })

      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [id]);

  useEffect(() => {
    fetchVehicleBooking();
  }, [fetchVehicleBooking]);

  let myFormData = new FormData();

  myFormData.append("action", "deleteVehicleBooking");
  myFormData.append("vehicleBookingId", id);

  let dataset = { ...booking, action: "deleteVehicleBooking" };

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {modelName} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending || loading}
          onClick={() => {
            onSubmit(dataset);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

const manageVehiclesBooking = ({ accessPermissions }) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [filteredData, setFilteredData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  const [forSearch, setForSearch] = useState([]);
  const [search, setSearch] = useState("");
  // const [filterValue, setFilterValue] = useState("all");
  const [dobOpen, setDobOpen] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { notify } = MyToast();

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

  // for searching
  const data = forSearch?.data;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAllVehicleBookingList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);


  const fetchAllVehicleBookingList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking?page=${currentPage}&perPageShow=${perPageShow}`, {
        action: "getAllVehicleBookingList",
        filterValue: filterValue
      })
        .then((res) => {
          // console.log("response: ",res)
          if (isSubscribed) {
            // setItemList(res?.data);
            // console.log("test",res.data?.data)
            // setFilteredData(res.data?.data);
            setFilteredData(prev => ({
              ...prev,
              total: res?.data?.data?.total || prev?.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage]
            }));
          }
        }).catch(error=>{
          console.log("error: ",error)
        });
      setFilterValue(prev => ({
        ...prev,
        filter: false,
        search: null
      }));
    }
    setTblLoader(false);
    return () => (isSubscribed = false);
  };

  //Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const [vehicleBookingId, setVehicleBookingId] = useState("");
  const [pending, setPending] = useState(false);

  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setVehicleBookingId(id);
  };

  //Delete booking  form
  const handleDelete = async (formData) => { 
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          setFilteredData((prev)=>({
            ...prev,
            filter: true,
          }))
          handleExitDelete();
          setPending(false);
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchAllVehicleBookingList();

    return () => (isSubscribed = false);
  };



  const actionButton = (id, status) => { 
    return (
      <>
        <ul className="action ">
          {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/transport/vehicles/booking/view/${id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}

          {accessPermissions.createAndUpdate && <li>
            <Link href={`/modules/transport/vehicles/booking/update/${id}`}>
              <a>
                <EditIcon />
              </a>
            </Link>
          </li>}

          {status === 1 && (
            <>

              {accessPermissions.delete && <li>
                <Link href="#">
                  <a onClick={() => handleOpenDelete(id)}>
                    <DeleteIcon />
                  </a>
                </Link>
              </li>}
            </>
          )}
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: 'SL',
      selector: (row, index) => index + 1,
      width: "75px",
    },

    {
      name: "Local Voucer",
      selector: (row) => row.local_voucer,
      sortable: true,
    },
    {
      name: "Booking Type",
      selector: (row) => row.booking_type,
      sortable: true,
    },
    {
      name: "Customer Type",
      selector: (row) => row.customer_type,
      sortable: true,
    },
    // {
    //   name: "Vehicle Type",
    //   selector: (row) => row.vehicle_id,
    //   sortable: true,
    // },
    {
      name: "Total Amount",
      selector: (row) => <> <ActiveCurrency/> { row.total_amount}</>,
      sortable: true,
    },

    {
      name: "Booking Date",
      selector: (row) => row.booking_date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.booking_time,
      sortable: true,
    },
    // booking_date
    {
      name: "Action",
      selector: (row) => actionButton(row.id, row.status),
      sortable: true,
      // width: "100px",
    },
  ];
  const PDFAndPrintColumns = [

    {
      name: "Local Voucer",
      selector: (row) => row.local_voucer,
      sortable: true,
    },
    {
      name: "Booking Type",
      selector: (row) => row.booking_type,
      sortable: true,
    },
    {
      name: "Customer Type",
      selector: (row) => row.customer_type,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicle_id,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => <><ActiveCurrency/> { row.total_amount}</>,
      sortable: true,
    },

    {
      name: "Booking Date",
      selector: (row) => row.booking_date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.booking_time || '-',
      sortable: true,
    },
  ];


  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });


  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    {
      text: "All Booking",
      link: "/modules/transport/vehiclesBooking/manageVehiclesBooking",
    },
  ];


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
    { title: "Daily", value: "daily" },
    { title: "Weekly", value: "weekly" },
    { title: "Monthly", value: "monthly" },
    { title: "Yearly", value: "yearly" },

  ];

  return (
    <>
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <HeadSection title="Vehicle Booking" />

        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Vehicle Booking</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && <Link href="/modules/transport/vehicles/booking/create">
                    <Button
                      className="shadow rounded btn-sm"
                      variant="primary"
                      type="button"
                      block
                    >
                      Add Vehicle Booking
                    </Button>
                  </Link>}

                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      id={vehicleBookingId}
                      pending={pending}
                    />
                  </Modal>
                </div>
              </div>
              <div className="card-body">
                <div className="position-relative">
                  {accessPermissions.download && <PDFAndPrintBtn
                    currentPage={currentPage}
                    rowsPerPage={perPageShow}
                    data={filteredData[currentPage]}
                    columns={PDFAndPrintColumns}
                    position={true}
                  />}
                  <ServiceFilter
                    statusList={dynamicStatusList}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    handleChangeFilter={handleChangeFilter}
                    dateFilter={false}
                    placeholderText="Voucher"
                  />
                  <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />
                </div>


                {/* <div>Total Sum on Current Page: {totalSum.toFixed(2)}</div> */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default manageVehiclesBooking;
