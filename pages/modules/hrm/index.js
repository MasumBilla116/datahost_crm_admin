import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Loader from "../../../components/Loader";
import { getSSRProps } from "../../../utils/getSSRProps";
import Axios from "./../../../utils/axios";
import { HeadSection } from "../../../components";

export const getServerSideProps = async context => {

  const { permission, query } = await getSSRProps({ context: context, access_code: 'm.hrm' });
  return {
    props: {
      permission,
      query
    }
  };
};

const HrmDashboard = ({ permission, query }) => {
  // custom http
  const { http } = Axios();
  // state
  const [todayEmpAttandance, setTodayEmpAttendance] = useState(0);
  const [monthlyLoanApplications, setMonthlyLoanApplications] = useState(0);
  const [monthlyLeaveApplications, setMonthlyLeaveApplications] = useState(0);
  const [allEmployees, setAllEmployee] = useState([]);
  const [loading, setLoading] = useState(false);

  // data mining
  const fetchTotalEmployee = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      let isSubscribed = true;
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/dashboard`, {
        action: "allEmployee",
      });

      if (isSubscribed) {
        const itemListData = res?.data?.data;
        const first10Items = itemListData.slice(0, 10);
        setAllEmployee(first10Items ?? []);
      }
    } catch (err) {
      console.error("Something went wrong!");
    } finally {
      setLoading(false); // Set loading to false after fetching data, regardless of success or error
    }
  }, []);


  const fetchTodayEmpAttendance = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/dashboard`, {
        action: "todayEmpAttandance",
      })
      .then((res) => {
        setTodayEmpAttendance(res.data?.data ?? 0);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const fetchMonthlyLoanApplication = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/dashboard`, {
        action: "monthlyLoanApplication",
      })
      .then((res) => {
        setMonthlyLoanApplications(res.data?.data ?? 0);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const fetchMonthlyLeaveApplication = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/dashboard`, {
        action: "monthlyLeaveApplication",
      })
      .then((res) => {
        setMonthlyLeaveApplications(res.data?.data ?? 0);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const fetchAllEmployee = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/dashboard`, {
        action: "monthlyLeaveApplication",
      })
      .then((res) => {
        setAllEmployee(res.data?.data ?? []);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };


  // useEffect
  useEffect(() => {
    fetchTotalEmployee();
    fetchTodayEmpAttendance();
    fetchMonthlyLoanApplication();
    fetchMonthlyLeaveApplication();
  }, []);

  // table column
  const salesColumns = [
    {
      name: "SL",
      selector: (row, index) => 1 + index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Dept. Name",
      selector: (row) => row.department_name,
      sortable: true,
    },
    {
      name: "Slary",
      selector: (row) => row.salary_amount,
    },
  ];
  return (
    <div className="container-fluid">
      <HeadSection title="HRM Dashbord" />

      {/* Start Row */}
      <div className="row">
        <div className="col-lg-3 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/income.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Total Employees</h6>
                  <h2>{allEmployees?.length}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/expense.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Today Emp. Attendant</h6>
                  <h2>{todayEmpAttandance}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/assets.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">
                    Monthly Loan Applications
                  </h6>
                  <h2>{monthlyLoanApplications}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/staff.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">
                    Monthly Leave Applications
                  </h6>
                  <h2>{monthlyLeaveApplications}</h2>
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
                  <h3 className="card-title mb-1 text-uppercase font-weight-bold">
                    <span className="lstick d-inline-block align-middle" />
                    All Employees
                  </h3>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <DataTable
                    columns={salesColumns}
                    data={allEmployees}
                    highlightOnHover
                    striped

                  />

                  <div className="custom-container">
                    <Link href={`/modules/hrm/employee`}>
                      <a className="custom-link">View All Employee</a>
                    </Link>
                  </div>
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

            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
    </div>
  );
};

export default HrmDashboard;


