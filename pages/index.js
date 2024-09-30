import * as CryptoJS from "crypto-js";
import * as moment from "moment";
import Link from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import DataTable from "react-data-table-component";
import { ViewIcon } from "../components";
import themeContext from "../components/context/themeContext";
import TransportDashboardSummary from "../components/dashboard/transport/TransportDashboardSummary";
import ActiveCurrency from "../components/ActiveCurrency";
import Axios from "../utils/axios";

function Home() {
  const { http } = Axios();
  const context = useContext(themeContext);
  const { permission } = context;
 




  //fetch dashboard data
  const [dashboardData, setDashboardData] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  /*fetch for booking data*/
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  //Filter data for booking report
  const [filterValue, setFilterValue] = useState("daily");
  const [filterCheckout, setFilterCheckout] = useState("daily");

  const [cancellationData, setCancellationData] = useState([]);
  /*fetch for sales data*/
  const [sellsData, setSellsData] = useState([]);
  /*fetch for checkout data*/
  const [checkoutData, setCheckoutData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [restrudentSells, setRestrudentSells] = useState([]);
  const [monthValue, setMonthValue] = useState();
  /*fetch for housekeeping data*/
  const [houseKeepingData, setHouseKeepingData] = useState([]);
  /*fetch for employee data*/
  const [employeeDetails, setEmployeeDetails] = useState([]);

  /*fetch for rooms data*/
  const [roomDatas, setRoomDatas] = useState([]);

  /*fetch for monthly attendance data*/
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchData = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
        action: "index",
      })
      .then((res) => {
        let result = res.data?.data;
        if (isSubscribed) {
          setDashboardData((prev) => ({
            ...prev,
            totalEmployees: result?.totalEmployees?.total,
          }));
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //inhouse guests
  const [inhouseGuest, setInhouseGuest] = useState([]);
  const fetchedInhouseGuests = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
        action: "inhouseGuests",
      })
      .then((res) => {
        let result = res.data?.data;
        if (isSubscribed) {
          setInhouseGuest(result.slice(0, 5));
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    fetchedInhouseGuests();
  }, [fetchedInhouseGuests]);

  /*----------fetch total Expense start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotalExpense = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "totalExpense",
        })
        .then((res) => {
          setTotalExpense(res.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTotalExpense();
  }, []);

  /*----------fetch total Expense end------*/

  /*----------fetch total income start------*/

  const fetchTotalBooking = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
        action: "totalBooking",
      })
      .then((res) => {
        if (isSubscribed) {
          setTotalBooking(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);



  const fetchTotalIncome = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
        action: "totalIncome",
      })
      .then((res) => {
        if (isSubscribed) {
          setTotalIncome(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotalIncome = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "totalIncome",
        })
        .then((res) => {
          setTotalIncome(res.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTotalIncome();
    fetchTotalBooking();
    return () => controller.abort();
  }, []);

  /*----------fetch total income end------*/

  /*----------fetch total Sells  start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotalSells = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "sells",
        })
        .then((res) => {
          setSellsData(res.data?.data.slice(0, 5));
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTotalSells();
    return () => controller.abort();
  }, []);

  /*----------fetch total Sells  end------*/

  /*----------fetch total cancelation data  start------*/
  useEffect(() => {
    const controller = new AbortController();
    const fetchCancellation = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "cancellation",
        })
        .then((res) => {
          setCancellationData(res.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchCancellation();
    return () => controller.abort();
  }, []);

  /*----------fetch total cancelation data end -----------*/

  /*----------fetch total month wise data  start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchMonthwiseData = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "sellsOverview",
        })
        .then((res) => {
          setMonthData(res.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchMonthwiseData();
    return () => controller.abort();
  }, []);

  let monthArray = [];
  monthData.forEach((obj, i) => {
    monthArray.push(parseInt(obj.total));
  });

  /*----------fetch total month wise end -----------*/

  /*----------fetch total month wise data  start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchRestrudentData = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "restrudentSellsOverview",
        })
        .then((res) => {
          setRestrudentSells(res.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchRestrudentData();
    return () => controller.abort();
  }, []);

  let restrudentSellsArr = [];
  restrudentSells.forEach((obj, i) => {
    restrudentSellsArr.push(parseInt(obj.total));
  });
  // console.log("now",restrudentSellsArr);

  /*----------fetch total month wise end -----------*/

  /*----------fetch total housekeeping data  start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/housekeeping/slip`,
          { action: "getAllHousekeepingSlip" }
        )
        .then((res) => {
          setHouseKeepingData(res?.data?.data);
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTasks();
    return () => controller.abort();
  }, []);

  /*----------fetch total housekeeping data  end------*/

  /*----------fetch Booking Data Start------*/

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue]);

  //Fetch List Data for datatable

  const fetchItemList = async () => {
    let isSubscribed = true;
    let formData = {
      action: "checkInDateTime",
      filterValue: filterValue,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, formData)
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data?.data);
          setFilteredData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  /*----------fetch Booking Data end ------*/

  /*--------- checkout data filter start--------- */

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCheckoutData();
    });
    return () => clearTimeout(timeout);
  }, [filterValue]);
  // }, [filterValue]);

  const fetchCheckoutData = async () => {
    let isSubscribed = true;
    let formData = {
      action: "checkOutDateTime",
      checkOutFilter: filterCheckout,
      // checkOutFilter: filterCheckout,
      // setFilterCheckout
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, formData)
      .then((res) => {
        if (isSubscribed) {
          setCheckoutData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  /**--------- checkout data filter end--------- */

  //search data
  useEffect(() => {
    let controller = new AbortController();
    const result = itemList?.filter((item) => {
      return (
        item?.invoice_id?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item?.mobile?.includes(search)
      );
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  const handleChangeFilter = (val) => {
    setFilterValue(val);
    setSearch("");
    // setFilterCheckout("")
  };

  const handleChangeCheckOut = (val) => {
    setFilterCheckout(val);
    setSearch("");
    // setFilterValue("")
  };

  /*----------fetch Booking Data End------*/

  /*----------fetch total Expense start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotalEmployees = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "staffingManage",
        })
        .then((res) => {
          setEmployeeDetails((res.data?.data).slice(0, 5));
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTotalEmployees();
  }, []);

  /*----------fetch total Expense end------*/

  /*----------fetch total Expense start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchRoomDatas = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/dashboard`, {
          action: "roomInfo",
        })
        .then((res) => {
          setRoomDatas(res.data?.data.slice(0, 5));
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchRoomDatas();
  }, []);

  /*----------fetch total Expense end------*/

  /*----------fetch total attendance start------*/

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotalAttendance = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, {
          action: "monthlyAttendanceReport",
        })
        .then((res) => {
          if (res.data.status === "success") {
            const tbl_data = res.data.data.map((row, index) => ({
              si: index + 1,
              ...row,
            }));
            setAttendanceData(tbl_data.slice(0, 5));
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };
    fetchTotalAttendance();
  }, []);

  /*----------fetch total attendance end------*/

  const action = (booking_id) => {
    const key = "123";
    const passphrase = `${booking_id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();
    const ids = encrypted.replace(/\//g, "--");

    return (
      <ul className="action ">
        <li>
          <Link href={`/modules/bookings/invoice/${ids}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>
      </ul>
    );
  };

  const columns = [
    {
      name: "Guest",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => "D100",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => action(row.id),
    },
  ];

  const salesColumns = [
    {
      name: "Guest",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => "D100",
      sortable: true,
    },
    {
      name: "Check-In",
      selector: (row) =>
        row.checkin_at ? moment(row.checkin_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    // {
    //   name: 'Status',
    //   selector: row => row.status,
    //   sortable: true,
    // },

    {
      name: "Action",
      selector: (row) => action(row.id),
    },
  ];

  const guestColumnInhouse = [
    {
      name: "Guest",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => "D100",
      sortable: true,
    },
    {
      name: "Check-In",
      selector: (row) =>
        row.checkin_at ? moment(row.checkin_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => action(row.id),
    },
  ];

  const cancelColumns = [
    {
      name: "Guest",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => "D100",
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => action(row.id),
    },
  ];

  const checkoutColumns = [
    {
      name: "Guest",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => "D100",
      sortable: true,
    },
    {
      name: "Check-Out",
      selector: (row) =>
        row.date_to ? moment(row.date_to).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => action(row.id),
    },
  ];

  const houseKeepingColumns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Remarks</span>,
      selector: (row) =>
        row?.completing_remarks ? (
          <span>{row?.completing_remarks}</span>
        ) : (
          <span>processing</span>
        ),
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
  ];

  const employeeColumns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row) => row?.name,
      sortable: true,
    },

    {
      name: <span className="fw-bold">Address</span>,
      selector: (row) => row?.address,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Designation</span>,
      selector: (row) => row?.designation_name,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Department</span>,
      selector: (row) => row?.department_name,
      sortable: true,
    },
    // {
    //   name: <span className="fw-bold">Description</span>,
    //   selector: (row) => row?.department_description,
    //   sortable: true,
    // },
  ];

  const roomColumns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="fw-bold">Room No</span>,
      selector: (row) => row?.room_no,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Room Type</span>,
      selector: (row) => row?.room_type,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Room Condition</span>,
      selector: (row) => row?.room_status,
      sortable: true,
    },
  ];

  const attendanceColumns = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="fw-bold">Name</span>,
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Date</span>,
      selector: (row) => row?.date,
      sortable: true,
    },
    {
      name: <span className="fw-bold">In Time</span>,
      selector: (row) => row?.in_time,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Out Time</span>,
      selector: (row) => row?.out_time,
      sortable: true,
    },
  ];

  return (
    <div className="col dashboard-col">

      {
      
      permission?.includes("m.hrm") && 
      
      <div className="row">
        <div className="col-lg-3 col-md-6">
          <div className="card bg-info mb-3">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <img src="/assets/images/icon/income-w.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-white mt-2 mb-0">Total Income</h6>
                  <h2 className="mt-0 text-white"><ActiveCurrency/>{totalIncome}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-success mb-3">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <img src="/assets/images/icon/expense-w.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-white mt-2 mb-0">Total Expense</h6>
                  <h2 className="mt-0 text-white"><ActiveCurrency/>{totalExpense}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-primary mb-3">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <img src="/assets/images/icon/assets-w.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-white mt-2 mb-0">Total Bookings</h6>
                  <h2 className="mt-0 text-white">{totalBooking}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-danger mb-3">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <img src="/assets/images/icon/staff-w.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-white mt-2 mb-0">Total Employees</h6>
                  <h2 className="mt-0 text-white">
                    {dashboardData?.totalEmployees || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }



      {/* End row */}

      {/* Start Tabs */}


      {permission?.includes("m.hrm") && 
      <div className="row">
        <div className="col-md-6 ">
          <div className="card mb-xs-1.2">
            <div
              className="
                d-flex
                border-bottom
                title-part-padding
                align-items-center
                bg-primary
              ">
              <div>
                <h4 className="text-white fw-bolder card-title mb-0">
                  TODAY'S ACTIVITY
                </h4>
              </div>
            </div>
            <div className="card-body">
              <div>
                {/* Nav tabs */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link p-xs-0.3 active"
                      data-bs-toggle="tab"
                      href="#home"
                      role="tab"
                    >
                      <span>Sales</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link p-xs-0.3"
                      data-bs-toggle="tab"
                      href="#profile"
                      role="tab"
                    >
                      <span>Cancellations</span>
                    </a>
                  </li>
                </ul>
                {/* Tab panes */}
                <div className="tab-content">
                  <div className="tab-pane active" id="home" role="tabpanel">
                    <DataTable
                      columns={salesColumns}
                      data={sellsData}
                      highlightOnHover
                      striped
                    />
                    {/* <Link href="/modules/bookings/all-booking">
                        <a>
                          <button
                            className="shadow rounded btn btn-primary"
                            style={{
                              marginTop: "20px",
                              zIndex: 1,
                              marginLeft: "480px",
                            }}
                            type="button"
                          >
                            More <i className="fas fa-arrow-right" style={{ marginLeft: "5px" }}></i>
                          </button>
                        </a>
                      </Link> */}
                    <div className="d-flex justify-content-end mt-2">
                      <Link href="/modules/bookings/list">
                        <span className="view-all-btn">View all</span>
                      </Link>
                    </div>
                  </div>

                  <div className="tab-pane p-3" id="profile" role="tabpanel">
                    <DataTable
                      columns={cancelColumns}
                      data={cancellationData}
                      pagination
                      highlightOnHover
                      subHeader
                      striped
                    />
                  </div>
                  <div className="tab-pane p-3" id="messages" role="tabpanel">
                    <h3>Best Tab ever</h3>
                    <h4>you can use it with the small code</h4>
                    <p>
                      Donec pede justo, fringilla vel, aliquet nec, vulputate
                      eget, arcu. In enim justo, rhoncus ut, imperdiet a.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-xs-1.2">
            <div
              className="
                d-flex
                border-bottom
                title-part-padding
                align-items-center
                bg-info
              "
            >
              <div>
                <h4 className=" text-white fw-bolder card-title mb-0">
                  RESERVATIONS
                </h4>
              </div>
              <div className="ms-auto">
                {/* Code Modal */}
                <div
                  id="view-code2-modal"
                  className="modal fade"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header border-bottom">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Custom Icon Tab - View Code
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                    </div>
                    {/* /.modal-content */}
                  </div>
                  {/* /.modal-dialog */}
                </div>
                {/* /.modal */}
              </div>
            </div>
            <div className="card-body">
              <div>
                {/* Nav tabs */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link d-flex active"
                      data-bs-toggle="tab"
                      href="#home2"
                      role="tab"
                    >
                      <span className="d-none d-md-block ms-2">Check In</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link d-flex"
                      data-bs-toggle="tab"
                      href="#profile2"
                      role="tab"
                    >
                      <span className="d-none d-md-block ms-2">Check Out</span>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className="nav-link d-flex"
                      data-bs-toggle="tab"
                      href="#messages2"
                      role="tab"
                    >
                      <span className="d-none d-md-block ms-2">
                        In-House Guest
                      </span>
                    </a>
                  </li>
                </ul>
                {/* Tab panes */}
                <div className="tab-content">
                  <div className="tab-pane active p-3" id="home2" role="tabpanel">
                    <div className="d-flex align-items-center">
                      <div className="flex-gap">
                        <div>
                          <ToggleButtonGroup
                            type="radio"
                            value={filterValue}
                            name="booking_report"
                            onChange={handleChangeFilter}
                          >
                            {/* <ToggleButtonGroup type="radio" value={filterCheckout} name="booking_report" onChange={handleChangeCheckOut}> */}

                            {/* filterCheckout */}
                            <ToggleButton id="tbg-btn-1" value="daily">
                              Today
                            </ToggleButton>
                            <ToggleButton id="tbg-btn-2" value="tomorrow">
                              Tomorrow
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>

                      <div className="ms-auto "></div>
                    </div>
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <input
                          type="text"
                          placeholder="search by mobile or invoice no."
                          className="w-25 w-xs-full form-control search-input_RESERVATIONS"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      }
                      striped
                    />
                  </div>
                  <div className="tab-pane p-3" id="profile2" role="tabpanel">
                    <div className="d-flex align-items-center">
                      <div className="flex-gap">
                        <div>
                          <ToggleButtonGroup
                            type="radio"
                            value={filterCheckout}
                            name="booking_report_checkout"
                            onChange={handleChangeCheckOut}
                          >
                            <ToggleButton id="tbg-btn-3" value="daily">
                              Today
                            </ToggleButton>
                            <ToggleButton id="tbg-btn-4" value="tomorrow">
                              Tomorrow
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>

                      <div className="ms-auto "></div>
                    </div>
                    <DataTable
                      columns={checkoutColumns}
                      data={checkoutData}
                      pagination
                      highlightOnHover
                      subHeader
                    />
                  </  div>
                  <div className="tab-pane p-3" id="messages2" role="tabpanel">
                    <DataTable
                      columns={guestColumnInhouse}
                      data={inhouseGuest}
                      highlightOnHover
                      subHeader
                      striped
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}

      <div className="row">


        {permission?.includes("m.hskpng") && <div className="col-lg-6">
          <div className="card mb-xs-1.2 w-100">
            <div className="card-body">
              <div className="d-md-flex">
                <div>
                  <h4 className="card-title">
                    <span className="lstick d-inline-block align-middle" />
                    Housekeeping Task
                  </h4>
                </div>
                {/*<div className="ms-auto">*/}
                {/*  <select className="form-select" defaultValue="">*/}
                {/*    <option value="">January 2021</option>*/}
                {/*    <option value={1}>February 2021</option>*/}
                {/*    <option value={2}>March 2021</option>*/}
                {/*    <option value={3}>April 2021</option>*/}
                {/*  </select>*/}
                {/*</div>*/}
              </div>
              <div className="table-responsive mt-3">
                <DataTable
                  columns={houseKeepingColumns}
                  data={houseKeepingData?.slice(0, 5)}
                  highlightOnHover
                  striped
                />

                <div className="d-flex justify-content-end mt-2">
                  <Link href="/modules/housekeeping/housekeepers/tasks">
                    <span className="view-all-btn">View all</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {permission?.includes("m.hskpng") && <div className="col-lg-6 col-md-6 d-flex align-items-stretch">
          <div className="card mb-xs-1.2 w-100" style={{ height: "400px !important" }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <h4 className="card-title">
                  <span className="lstick d-inline-block align-middle" />
                  Room Status
                </h4>
              </div>
              <div className="table-responsive mt-3">
                <DataTable
                  columns={roomColumns}
                  data={roomDatas}
                  highlightOnHover
                  striped
                />
              </div>
            </div>
          </div>
        </div>}

      </div>
      
      {permission?.includes("m.tnsprt") && <TransportDashboardSummary />}
    </div>
  );
}

export default Home;
