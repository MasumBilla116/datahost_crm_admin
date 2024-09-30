import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { EditIcon, HeadSection, ViewIcon } from "../../../components";
import PropagateLoading from "../../../components/PropagateLoading";
import Loader from "../../../components/Loader";
import Axios from "./../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.lckr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const LockerDashboard = ({accessPermissions}) => {
  // custom http
  const { http } = Axios();

  // notifications
  const { notify } = MyToast();

  // state
  const [TotalCount, setTotalCount] = useState({
    totalLocker: 0,
    totalAvailabelLocker: 0,
    totalUnavailabelLocker: 0,
  });
  const [AllLockers, setAllLockers] = useState([]);
  const [serial, setSerial] = useState("");
  const [id, setID] = useState(0);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  // handler
  const deleteLocker = async () => { 
    await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, {
          action: "deleteLocker", id
        })
        .then((res) => {
            console.log("delete: ",res);
            getallLockers();
            setOpen(false);
            notify("success", "Locker " + serial + " deleted successfully");
        })
        .catch((err) => {
          console.log(err);
        })
  };

  // data mining
  const fetchTotalCount = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/dashboard`, {
        action: "fetchTotalCount",
      })
      .then((res) => {
        setTotalCount({
          totalLocker: res.data?.data?.totalLocker ?? 0,
          totalAvailabelLocker: res.data?.data?.totalAvailabelLocker ?? 0,
          totalUnavailabelLocker: res.data?.data?.totalUnavailabelLocker ?? 0,
        });
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const getallLockers = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/dashboard`, {
        action: "getAllLockerEntryList",
      })
      .then((res) => {
        const locker = res?.data?.data ?? [];
        setAllLockers(locker.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect
  useEffect(() => {
    fetchTotalCount();
    getallLockers();
  }, []);

  // table actions
  const actionButton = (serial, id) => {
    return (
      <ul className="action mt-3">
        {accessPermissions.listAndDetails && <li>
          <Link href="#">
            <a
              onClick={() => {
                setOpenView(true);
                setSerial(serial);
                setID(id);
              }}
            >
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate &&<li>
          <Link href={`/modules/locker/update/${id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>}
      </ul>
    );
  };

  // table columns
  const columns = [
    {
      name: <span className="fw-bold">Serial</span>,
      selector: (row) => row?.serial,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Type</span>,
      selector: (row) => row?.type,
      sortable: true,
    },
    {
      name: <span className="fw-bold ">Availability</span>,
      selector: (row) => (
        <span
          className={`
           ${ row?.status
              ? row?.availability === "available"
                ? "text-success"
                : "text-danger"
              : ""}
              text-capitalize
          `}
        >
          {row?.availability}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Size</span>,
      selector: (row) => row?.size,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Action</span>,
      selector: (row ) =>
        actionButton(row.serial, row.id),
    },
  ];

  return (
    <div className="container-fluid">
              <HeadSection title="Locker" />

      {/* Start Row */}
      <div className="row">
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/income.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Total Locker</h6>
                  <h2>{TotalCount.totalLocker}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/expense.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Availabel Locker</h6>
                  <h2>{TotalCount.totalAvailabelLocker}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/assets.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Unavailabel Locker</h6>
                  <h2>{TotalCount.totalUnavailabelLocker}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
      {/* Start row */}
      <div className="row">
        <div className="col-lg-9 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <div className="d-md-flex">
                <div>
                  <h3 className="card-title mb-1">
                    <span className="lstick d-inline-block align-middle" />
                    Lockers
                  </h3>
                </div>
              </div>
              { AllLockers.length > 0 ? <>
              
                <DataTable
                    columns={columns}
                    data={AllLockers.slice(0, 10)}
                    highlightOnHover
                />
                <div className="  mt-2">
                    <Link href="/modules/locker/list">
                    <a className="view-all-btn">View all</a>
                    </Link>
                </div>
              
              </>
              : <Loader/>}
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
              <h5 style={{ color: "gray" }}> </h5>
              <div
                id="Visit-Separation"
                style={{ height: "290px", width: "100%" }}
                className="d-flex justify-content-center align-items-center"
              />
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}

      {/* //Delete Modal// */}
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Modal.Title className="fs-5">
            Are you sure to Delete locker 
            <span className="fw-bolder">{serial}</span> ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant="danger" disabled={!serial} onClick={deleteLocker}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-md"
        show={openView}
        onHide={() => setOpenView(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body> 
          <ViewLockerByID id={id} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

const ViewLockerByID = ({ id }) => { 
  const [locker, setLocker] = useState([]);
  const { http } = Axios();

  useEffect(() => {
    const controller = new AbortController();

    //fetch locker By
    const getallLockerByID = async () => {
      let body = {};
      body = {
        action: "getLockerByID",
        id,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, body)
        .then((res) => {
          const locker = res?.data?.data;
          setLocker(locker);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    getallLockerByID();
    
    return () => controller.abort();
}, []); 


  return (
    <>
      {!!locker.length ? (
        locker.map((lock, index) => {
          return (
            <div key={index} className="p-2">
              <h5 className="pb-2 text-center">
                <span className="fw-bolder">Serial : </span>
                {lock?.serial}
              </h5>
              <div className="py-1">
                <span className="fw-bolder">Availability : </span>
                {lock?.availability}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Locker Type : </span>
                {lock?.type}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Size : </span>
                {lock?.size}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Description : </span>
                {lock?.description}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ height: "100px" }}>
          <div className="text-center">
            <PropagateLoading />
          </div>
        </div>
      )}
    </>
  );
};

export default LockerDashboard;
