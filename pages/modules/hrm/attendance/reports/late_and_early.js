import MyToast from "@mdrakibul8001/toastify";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AttendanceTable from "../../../../../components/attendance_table/attendance_table";
import Select2 from "../../../../../components/elements/Select2";
import Loader from "../../../../../components/Loader/loader";
import Axios from "../../../../../utils/axios";
import { allMonthName, fullYear } from "../../../../../utils/utils";

import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';

export default function LateAndEarly() {
  const { http } = Axios();
  const { notify } = MyToast();
  // loader
  const [loading, setLoading] = useState(false);
  // emp name and id
  const [emp_id, setEmpId] = useState("");
  const [year, setYear] = useState("");
  const [allEmployee, setAllEmployee] = useState(null);
  const [month, setMonth] = useState("");
  const [openDate, setOpenDate] = useState(false);  // handle calendar open and close
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd')); // set date format and time format 
  const [missingTblData,setMissingTblData] = useState([]);


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

  // table data
  const [tableData, setTableData] = useState([]);
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
        // console.log(e);
      });
  };

  // fetch employee data
  useEffect(() => {
    let isRun = true;
    getAllEmployee();
    return () => (isRun = false);
  }, []);

  const handleRowSelect = row =>{

  }
  // table field and data
  const columns = [
    {
      name: "SL",
      selector: "si",
      sortable: true,
      width: "75px",
    },
    {
      name: "All",
      selector: "selected",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.selected}
          onChange={() => handleRowSelect(row)}
        />
      ),
    },
    {
      name: "Employee ID",
      selector: "employeeId",
      sortable: true,
      cell: (row) => "EMP-"+row.emp_id,
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Designation",
      selector: "designation",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "In Time",
      selector: "inTime",
      sortable: true,
      cell: (row) => <input type="text" className="form-control p-1" value={row.in_time} />,
    },
    {
      name: "Out Time",
      selector: "outTime",
      sortable: true,
      cell: (row) => <input type="text" className="form-control p-1" value={row.out_time}/>,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => row.status == 'present' ?
           <span className="btn btn-success btn-sm text-capitalize">{row.status}</span>
       :
          <span className="btn btn-warning btn-sm text-capitalize">{row.status}</span>
        
      
    },
  ];

  // hrm table column and data
  const tbl_columns = [
    {
      name: "SL",
      selector: "si",
      sortable: true,
      width: "75px",
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "In Time",
      selector: "in_time",
      sortable: true,
      cell:(row)=>{
        if(row.in_time === null)
          return '---';
        else
          return row.in_time
      }
    },
    {
      name: "Attendance Setup (In Time)",
      selector: "in_time",
      sortable: true,
      cell:(row)=>{
        if(row.in_time === null)
          return '---';
        else
          return row.in_time
      }
    },
    {
      name: "Late Time",
      selector: "late_time",
      sortable: true,
      cell:(row)=> '---',
    },
    {
      name: "Out Time",
      selector: "out_time",
      sortable: true,
      cell:(row)=>{
        if(row.out_time === null)
          return '---';
        else
          return row.out_time
      }
    },
    {
      name: "Attendance Setup (Out Time)",
      selector: "out_time",
      sortable: true,
      cell:(row)=>{
        if(row.out_time === null)
          return '---';
        else
          return row.out_time
      }
    },
    {
      name: "Early Closing",
      selector: "early_closing",
      sortable: true,
    },
  ];

  // find details
  const AttendanceDetails = async (e) => {
    setLoading(true);
    e.preventDefault();
    const month_digit = new Date(`1 ${month} ${+year}`);
    const formData = {
      emp_id: +emp_id,
      year: +year,
      month: month_digit.getMonth() + 1,
      action: "lateAndEarlyMonthlyAttendanceDetails",
    };
    console.warn(formData);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        setTableData([]);
        setLoading(false);
        if (res.data.status === "success") {
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            const tbl_data = res.data.data.map((row, index) => ({
              si: index + 1,
              ...row,
            }));
            setTableData(tbl_data);
          }
          if (res.data.response === "All Fields is required") {
            notify("warning", `${res.data.response}`);
          }
        }
      })
      .catch((e) => {
        //   console.log(e);
      });
  };


   // find missing attendance
   const findMissingAttendance = async(e) =>{
    setLoading(true);  
    e.preventDefault();
    const formData = {
        action: "missionAttendance",
        date: date
    }
    await http
    .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
    .then((res) => {  
        setLoading(false);
      if (res.data.status === "success") {
        if(Array.isArray(res.data.data) && res.data.data.length > 0)
        { 
          setMissingTblData([]);
            const tbl_data = res.data.data?.map((row,index)=>({si:index+1,inTime: row.in_time,outTime:row.out_time,...row}));
             
            setMissingTblData(tbl_data)
        }
        if(res.data.response === "Not found any result")
        {
            notify("warning", `${res.data.response}`); 
        }
      }
    })
    .catch((e) => {
    //   console.log(e);
    });

}
// end find missing attendace
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="row p-4">
                <div className="col-lg-12 mb-4">
                  <h4>Monthly Attendance</h4>
                </div>
                <div className="col-lg-6 col-xl-12 col-md-6 col-sm-12 mb-2">
                  <h6 className="mt-2">Attendace</h6>
                </div>
                <div className="col-lg-12 border-top mb-4"></div>
                <div className="col-lg-6 col-xl-6 col-md-12 col-sm-12 mb-4">
                  <Form onSubmit={AttendanceDetails}>
                    <div className="row">
                      {/* emp name */}
                      <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                        <label htmlFor="emp_name">Employee Name*</label>
                      </div>
                      <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12">
                        <Form.Group controlId="formBasicName">
                          <Select2
                            className="mb-3"
                            options={
                              allEmployee &&
                              allEmployee?.map(({ id, name }) => ({
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
                      {/* start year */}
                      <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                        <label htmlFor="year">Year*</label>
                      </div>
                      <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12">
                        <Form.Group controlId="formBasicName">
                          <Select2
                            className="mb-3"
                            options={fullYear?.map(({ year }) => ({
                              value: year,
                              label: year,
                            }))}
                            onChange={(e) => {
                              setYear(e.value);
                            }}
                          />
                        </Form.Group>
                      </div>
                      {/* start month */}
                      <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                        <label htmlFor="year">Month*</label>
                      </div>
                      <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12">
                        <Form.Group controlId="formBasicName">
                          <Select2
                            className="mb-3"
                            options={allMonthName?.map(({ month }) => ({
                              value: month,
                              label: month,
                            }))}
                            onChange={(e) => {
                              setMonth(e.value);
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12"></div>
                      <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12 mt-4">
                        <div className="d-flex justify-content-end align-items-center">
                          <button
                            type="reset"
                            onClick={() => {
                              setTableData([]);
                            }}
                            className="btn btn-success btn-warning btn-sm me-2"
                          >
                            Reset
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success btn-sm"
                          >
                            {loading && <Loader />}
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              {/* start hrm  table */}
              <div className="row p-4">
                <div className="col-lg-12 mb-4">
                  <div className="d-flex justify-content-end align-items-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary me-1"
                    >
                      <i className="fas fa fa-list"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-success ">
                      <svg
                        fill="#fff"
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                      >
                        {" "}
                        <path d="M64 464H96v48H64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V288H336V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56H192v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V448 368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H192v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H304c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H320v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V432 368z" />
                      </svg>{" "}
                      PDF
                    </button>
                  </div>
                </div>
                <div className="col-lg-12 mb-4">
                  <div className="d-flex justify-content-center align-items-center">
                    <Image
                      src={"/assets/images/hrm_logo.png"}
                      width={100}
                      height={60}
                      alt="hrm-logo"
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <p>HRM</p>
                  </div>
                </div>

                {/* hrm table */}
                <div className="col-lg-12 col-xl-12">
                  <DataTable columns={tbl_columns} data={tableData} />
                </div>
              </div>
              {/* end HRM table*/}
            </div>
            {/* start missing attendance */}
            <div className="card shadow">
              <div className="row mt-2">
                <div className="col-12">
                  <div className="row p-4">
                    <div className="col-12 mb-4">
                      <h6 className="text-primary font-bold">
                        Missing Attendance
                      </h6>
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-12 col-sm-12 mb-4">
                      <Form onSubmit={findMissingAttendance}>
                        <div className="row">
                          {/* emp name */}
                          <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                            <label htmlFor="emp_name">Date*</label>
                          </div>
                          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-8">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                size={1}
                                open={openDate}
                                onClose={() => setOpenDate(false)}
                                value={date}
                                inputFormat="yyyy-MM-dd"
                                onChange={(event) => {
                                  setDate(
                                    format(new Date(event), "yyyy-MM-dd")
                                  );
                                }}
                                renderInput={(params) => (
                                  <ThemeProvider theme={theme}>
                                    <TextField
                                      onClick={() => setOpenDate(true)}
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
                          <div className="col-xl-2 col-lg-2 col-md-2 col-sm-4">
                            <button type="submit" className="btn   btn-success">
                              {loading && <Loader />}
                              Search
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                    <div className="col-12">
                      <hr className="bg-light" />
                    </div>
                    <AttendanceTable
                      columns={columns}
                      rows={missingTblData}
                      pagination={false}
                      searchbar={false}
                    />
                    <div className="col-12 mt-4">
                      <p
                        className="w-100 p-1  text-center text-dark"
                        style={{ background: "#9ef39e" }}
                      >
                        Total Record {missingTblData.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end missing attendance */}
          </div>
        </div>
      </div>
    </>
  );
}
