import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import AttendanceTable from "../../../../components/attendance_table/attendance_table";
import Select2 from "../../../../components/elements/Select2";
import Loader from "../../../../components/Loader/loader";
import Axios from "../../../../utils/axios";
import { calculateWorkHours } from "../../../../utils/utils";
import { HeadSection } from "../../../../components";

export default function AttendaceLog() {
  const { http } = Axios();
  const { notify } = MyToast();
  // loader
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tableData, setTableData] = useState([]);
  // emp name and id
  const [emp_id, setEmpId] = useState("");
  const [allEmployee, setAllEmployee] = useState(null);
  // date time field theme
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });
  // get all employee
  const getAllEmployee = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, {
        action: "getAllEmployee",
      })
      .then((res) => {
        if (res.data.status === "success") {
          setAllEmployee(res.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    let isSubscribed = true;
    getAllEmployee();
    return () => (isSubscribed = false);
  }, []);

  // form submit
  const submitForm = (e) => {
    e.preventDefault();
    const body = {
      id: emp_id,
      date: dateTime,
    };
  };
  // table field and data
  const columns = [
    {
      name: "SL",
      selector: "si",
      sortable: true,
      width: "75px",
    },
    {
      name: "Employee Name",
      selector: "name",
    },
    {
      name: "In Time",
      selector: "inTime",
      sortable: true,
      cell: (row) => {
        if (row.in_time === null) return "---";
        else return row.in_time;
      },
    },
    {
      name: "Last In Time",
      selector: "in_time",
      sortable: true,
      cell: (row) => {
        if (row.in_time === null) return "---";
        else return row.in_time;
      },
    },
    {
      name: "Last Out Time",
      selector: "out_time",
      sortable: true,
      cell: (row) => {
        if (row.out_time === null) return "---";
        else return row.out_time;
      },
    },
    {
      name: "Worked Hourse",
      selector: "worked_hourse",
      sortable: true,
      cell: (row) => calculateWorkHours(row.in_time, row.out_time),
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
      cell: (row) => (
        <Link href={`/modules/attendance/log_details?emp=${row.emp_id}`}>
          <a className="btn btn-sm btn-info">
            <i className="fas fa fa-eye me-2"></i> Details
          </a>
        </Link>
      ),
    },
  ];

  const [fromToToMonthName, setFromToToMonthName] = useState({
    fromMonth: {
      month: "",
      day: "", 
    },
    toMonth: {
      month: "",
      day: "", 
    },
    year:''
  });
  // find attendance log reports
  const findAttendanceLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTableData([]);
    const formData = {
      action: "findAttendanceLog",
      emp_id: emp_id,
      fromDate: fromDate,
      toDate: toDate,
    };
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const from_month = from.toLocaleString("en-US", { month: "long" });
    const from_day = from.toLocaleString("en-US", { day: "numeric" }); 
    const to_month = to.toLocaleString("en-US", { month: "long" });
    const to_day = to.toLocaleString("en-US", { day: "numeric" }); 
    const to_year = to.getFullYear();

    setFromToToMonthName({
      fromMonth: {
        month: from_month,
        day: from_day, 
      },
      toMonth: {
        month: to_month,
        day: to_day, 
      },
      year: to_year
    });

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        setLoading(false);
        if (res.data.status === "success") {
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            const tbl_data = res.data.data?.map((row, index) => ({
              si: index + 1,
              inTime: row.in_time,
              outTime: row.out_time,
              ...row,
            }));
            setTableData(tbl_data);
          }
        }
      })
      .catch((e) => {
        setLoading(false);
        //   console.log(e);
      });
  };

  return (
    <>
    <HeadSection title="Attendance" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <Form onSubmit={findAttendanceLog}>
                <div className="row p-4">
                  <div className="col-lg-12 border-bottom mb-4">
                    <h6 className="text-primary">Attendance Log</h6>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                    <div className="input-group mb-3">
                      <label
                        htmlFor="employee"
                        className="form-label me-1 mt-2"
                      >
                        Employee:
                      </label>
                      <Form.Group
                        controlId="formBasicName"
                        className="w-100 d-block"
                      >
                        <Select2
                          className="mb-3"
                          options={
                            allEmployee &&
                            allEmployee.map(({ id, name }) => ({
                              value: id,
                              label: name,
                            }))
                          }
                          onChange={(e) => {
                            setEmpId(e.value);
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                    <div className="input-group mb-3">
                      <label htmlFor="from" className="form-label mt-2 me-1">
                        From:
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size={1}
                          open={openFromDate}
                          onClose={() => setOpenFromDate(false)}
                          value={fromDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setFromDate(format(new Date(event), "yyyy-MM-dd"));
                          }}
                          renderInput={(params) => (
                            <ThemeProvider theme={theme}>
                              <TextField
                                onClick={() => setOpenFromDate(true)}
                                fullWidth={true}
                                size="small"
                                {...params}
                                required
                              />
                            </ThemeProvider>
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                    <div className="input-group mb-3">
                      <label htmlFor="to" className="form-label mt-2 me-1">
                        To:
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size={1}
                          open={openToDate}
                          onClose={() => setOpenToDate(false)}
                          value={toDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setToDate(format(new Date(event), "yyyy-MM-dd"));
                          }}
                          renderInput={(params) => (
                            <ThemeProvider theme={theme}>
                              <TextField
                                onClick={() => setOpenToDate(true)}
                                fullWidth={true}
                                size="small"
                                {...params}
                                required
                              />
                            </ThemeProvider>
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 d-flex justify-content-start align-items-center">
                    <button type="submit" className="btn btn-success mt-2">
                      {loading && <Loader />}
                      Search
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>

          <div className="col-12 mt-4">
            <div className=" card shadow">
              <div className="row">
                {/* attendace history table-1 */}
                <div className="col-12 mb-4">
                  <h6 className="text-center mt-4 ">
                    {" "}
                    Attendance History of {" "}
                    {fromToToMonthName.fromMonth.month ?
                      fromToToMonthName.fromMonth.month : '---'}
                    ,
                    {fromToToMonthName.fromMonth.day ?
                      fromToToMonthName.fromMonth.day : '---'}{" "}
                    To{" "}
                    {fromToToMonthName.toMonth.month ? 
                      fromToToMonthName.toMonth.month : '---'}
                    ,
                    {fromToToMonthName.toMonth.day ? fromToToMonthName.toMonth.day : '---'}
                    ,
                    {fromToToMonthName.year ? fromToToMonthName.year : '---'}
                  </h6>
                  <hr className="bg-light" />
                  <AttendanceTable
                    columns={columns}
                    rows={tableData}
                    pagination={false}
                    searchbar={false}
                  />
                </div>
                {/* attendace history table-2 */}
                <div className="col-12 mb-4 d-none">
                  <hr className="bg-light" />
                  <h6 className="text-center mt-4 ">
                    {" "}
                    Attendance History of January 23,2023
                  </h6>
                  <hr className="bg-light" />
                  <AttendanceTable
                    columns={columns}
                    rows={tableData}
                    pagination={false}
                    searchbar={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
