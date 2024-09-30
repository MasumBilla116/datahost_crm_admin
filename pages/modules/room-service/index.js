import * as moment from "moment";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Loader from "../../../components/Loader";
import { getSSRProps } from "../../../utils/getSSRProps";
import ViewIcon from "./../../../components/elements/ViewIcon";
import Axios from "./../../../utils/axios";
import { HeadSection } from "../../../components";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rm_srvs",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};


const Dashbord = ({ accessPermissions }) => {
  // custom http
  const { http } = Axios();
  const [loading, setLoading] = useState(false);

  // state
  const [topRowData, setTopRowData] = useState({
    totalRooms: 0,
    totalHousekeepers: 0,
    ongoingTask: 0,
  });
  const [allTask, setAllTask] = useState([]);


  // fetch
  const fetchTopRowData = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/room-service/dashboard`, {
        action: "fetchDashboardTopRowData",
      })
      .then((res) => {

        setTopRowData(prev => ({
          totalRooms: res?.data?.data?.totalRooms ?? 0,
          totalHousekeepers: res?.data?.data?.totalHousekeepers ?? 0,
          ongoingTask: res?.data?.data?.ongoingTask ?? 0,
        }));
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const fetchTasks = async () => {
    setLoading(true); // Set loading to true before fetching data

    try {
      let isSubscribed = true;
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/room-service/dashboard`, {
        action: "FetchAllAssignTask",
      });

      if (isSubscribed) {
        const response = res?.data?.data;
        setAllTask(response);
      }
    } catch (err) {
      console.error("Server Error ~!", err);
    } finally {
      setLoading(false); // Set loading to false after fetching data, regardless of success or error
    }

    return () => (isSubscribed = false);
  };


  // useEffect
  useEffect(() => {
    fetchTopRowData();
    fetchTasks();
  }, [])


  // handler
  const actionButton = (task) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/room-service/housekeeping/task-assign/${task?.id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}

        </ul>
      </>
    );
  };


  // table column
  const salesColumns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: <span className="fw-bold">House Keeper Name</span>,
      selector: (row) => <span className="text-capitalize">{row?.name}</span>,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Task</span>,
      selector: row => row.task_name ? <span className="text-capitalize">{row.task_name}</span> : "-",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Status</span>,
      selector: (row) =>
        row?.is_complete ? (
          <span className="text-success fw-bolder">Done</span>
        ) : (
          <span className="text-danger fw-bolder">Ongoing</span>
        ),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Task Date</span>,
      selector: (row) => moment(row?.task_date).format("MM/DD/YYYY"),
      sortable: true,
    },
    // {
    //   name: <span className="fw-bold">Action</span>,
    //   selector: (row) => actionButton(row),
    // },
  ];

  return (
    <div className="container-fluid">
     <HeadSection title="Room-Service Dashbord" />

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
                  <h6 className="text-muted mt-2 mb-0">Total Rooms</h6>
                  <h2>{topRowData?.totalRooms}</h2>
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
                  <h6 className="text-muted mt-2 mb-0">Total Housekeeper</h6>
                  <h2>{topRowData?.totalHousekeepers}</h2>
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
                  <img src="/assets/images/icon/staff.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">On Going Task</h6>
                  <h2>{topRowData?.ongoingTask}</h2>
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
                    Assigntask
                  </h3>
                </div>

              </div>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <DataTable
                    columns={salesColumns.slice(0, 10)}
                    data={allTask}
                    highlightOnHover
                    striped
                  />


                  {allTask.length > 0 && (<div className="custom-container">
                    <Link href={`/modules/room-service/housekeeping/housekeepers/tasks`}>
                      <a className="custom-link">View All Tasks</a>
                    </Link>
                  </div>)}

                </>
              )
              }
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
    </div>
  )
}

export default Dashbord