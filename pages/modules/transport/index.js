import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import MyToast from "@mdrakibul8001/toastify";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { DeleteIcon, EditIcon, HeadSection, ViewIcon } from "../../../components";
import ActiveCurrency from "../../../components/ActiveCurrency";
import TransportDashboardSummary from "../../../components/dashboard/transport/TransportDashboardSummary";
import { getSSRProps } from "../../../utils/getSSRProps";
import Axios from "./../../../utils/axios";



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.tnsprt" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};


const TransportDashboard = (accessPermissions) => {

  // custom http
  const { http } = Axios();

  // notification
  const { notify } = MyToast();


  // state
  const [TotalCount, setTotalCount] = useState({
    totalMonthlyIncome: 0,
    totalVehicle: 0,
    totalDrivers: 0,
    totalBookings: 0,
  });
  const [VehicleBookingList, setVehicleBookingList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleBookingId, setVehicleBookingId] = useState("");
  const [pending, setPending] = useState(false);

  // data mining
  const fetchTotalCount = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/vehicle/dashboard`, {
        action: "fetchTotalCount",
      })
      .then((res) => {
        setTotalCount({
          totalMonthlyIncome: res?.data?.data.totalMonthlyIncome ?? 0,
          totalVehicle: res?.data?.data.totalVehicle ?? 0,
          totalDrivers: res?.data?.data.totalDrivers ?? 0,
          totalBookings: res?.data?.data.totalBookings ?? 0,
        });
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const fetchAllVehicleBookingList = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/vehicle/dashboard`, {
        action: "fetchAllVehicleBookingList",
      })
      .then((res) => {
        console.log("res: ", res?.data?.data);
        setVehicleBookingList(res?.data?.data);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  // handle
  const handleExitDelete = () => setShowDeleteModal(false);
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
        notify("success", "successfully deleted!");
        handleExitDelete();
        setPending(false);
      })
      .catch((e) => {
        console.log("error delete !", e);
        setPending(false);
      });
    fetchAllVehicleBookingList();
  };

  const actionButton = (id, status) => {
    return (
      <>
        <ul className="action ">
          {accessPermissions.listAndDetails &&
            <li>
              <Link href={`/modules/transport/vehicles/booking/view/${id}`}>
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>}
          {accessPermissions.createAndUpdate &&
            <li>
              <Link href={`/modules/transport/vehicles/booking/update/${id}`}>
                <a>
                  <EditIcon />
                </a>
              </Link>
            </li>}
          {accessPermissions.delete &&
            <>
              {status === 1 && (

                <li>
                  <Link href="#">
                    <a onClick={() => handleOpenDelete(id)}>
                      <DeleteIcon />
                    </a>
                  </Link>
                </li>
              )}

            </>

          }
        </ul>
      </>
    );
  };

  // useEffect
  useEffect(() => {
    fetchTotalCount();
    fetchAllVehicleBookingList();
  }, []);


  // data table column
  const columns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      width: "75px",
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

  return (
    <div className="container-fluid">
       <HeadSection title="Transport Dashbord" />

      <TransportDashboardSummary />
      <div className="row">
        <div className="col-lg-9 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <div className="d-md-flex">
                <div>
                  <h3 className="card-title mb-1">
                    <span className="lstick d-inline-block align-middle" />
                    Vehicle Booking
                  </h3>
                </div>
              </div>
              {VehicleBookingList?.length > 0 ? <><DataTable
                columns={columns}
                data={VehicleBookingList}
                highlightOnHover
                striped
              />
                <div className="mt-2">
                  <Link href="/modules/transport/vehicles/booking">
                    <a className="view-all-btn">View all</a>
                  </Link>
                </div> </> : (
                <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>No Booking Assign yet</div>

              )}
            </div>

          </div>
        </div>
        {/* -------------------------------------------------------------- */}
        {/* visit charts*/}
        {/* -------------------------------------------------------------- */}
        <div className="col-lg-3 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <h4 className="card-title">
                <span className="lstick" />
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal Form */}
      {<Modal show={showDeleteModal} onHide={handleExitDelete}>
        <Modal.Header closeButton></Modal.Header>
        <DeleteComponent
          onSubmit={handleDelete}
          id={vehicleBookingId}
          pending={pending}
        />
      </Modal>}
    </div>
  );
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

export default TransportDashboard;
