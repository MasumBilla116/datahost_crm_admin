import MyToast from "@mdrakibul8001/toastify";
import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import AttendanceTable from "../../../../components/attendance_table/attendance_table";
import Select2 from "../../../../components/elements/Select2";
import Loader from "../../../../components/Loader/loader";
import Axios from "../../../../utils/axios";

export default function Monthly(){  
    const { http } = Axios();
    const { notify } = MyToast();
    // loader
  const [loading,setLoading] = useState(false);
    // emp name and id
    const [emp_id,setEmpId] = useState(""); 
    const [year, setYear ] = useState("");
    const [allEmployee, setAllEmployee] = useState(null);
    const [month,setMonth] = useState("");
    // handle in clock
    const [openInclock,setOpenInClock] = useState(false); 
    const [selectedInTime, setSelectedInTime] = useState(format(new Date(), 'yyyy-MM-dd H:m:i'));  
    // handle out-time handle 
    const [openOutclock,setOpenOutClock] = useState(false);
    const [selectedOutTime, setSelectedOutTime] = useState(format(new Date(), 'yyyy-MM-dd H:m:i'));  
    // table data
    const [tableData,setTableData] = useState([]);
    // form reference
    const formRef  = useRef(null);
    // full year name
    const [fullYear,setFullYear] = useState(null);
    // full month name
    const [fullMonth, setFullMonth] = useState(null);
     
    // year data 
    const yearData = [
        { year: 2023 },
        { year: 2022 }, 
        { year: 2021 }, 
        { year: 2020 }, 
        { year: 2019 }, 
      ];
    //   month data 
    const monthName =  [
        {month:"January"},
        {month:"February"},
        {month:"March"},
        {month:"April"},
        {month:"May"},
        {month:"June"},
        {month:"July"},
        {month:"August"},
        {month:"September"},
        {month:"October"},
        {month:"November"},
        {month:"December"}, 
    ]  
    //   popup clock
   
    // date-time theme
    const theme = createTheme({ 
        components: {
          MuiFormLabel: {
            styleOverrides: {
              asterisk: { color: "red" },
            },
          },
        },
    
      });  

      const handleRowSelect = (row)=>{
        
      }
    // table field and data
    const columns = [
        {
        name: 'SL',
        selector: 'si',
        sortable: true, 
        width: "75px",
        },
        {
        name: 'All',
        selector: 'selected',
        cell: (row) => (
            <input
            type="checkbox"
            checked={row.selected}
            onChange={() => handleRowSelect(row)}
            />
        ),
        },
        {
        name: 'Employee ID',
        selector: 'emp_id',
        sortable: true,
        },
        {
        name: 'Name',
        selector: 'name',
        sortable: true,
        },
        {
        name: 'Designation',
        selector: 'designation',
        sortable: true,
        },
        {
            name: 'Date',
            selector: 'date',
            sortable: true,
        },
        {
        name: 'In Time',
        selector: 'in_time',
        sortable: true,
        cell:(row)=>{
            if(row.in_time === null)
              return '---';
            else
              return row.in_time
          }
        },
        {
        name: 'Out Time',
        selector: 'out_time',
        sortable: true,
        cell:(row)=>{
            if(row.out_time === null)
              return '---';
            else
              return row.out_time
          }
        },
        {
        name: 'Status',
        selector: 'status',
        sortable: true,
        cell: (row) => row.status == 'present' ?
           <span className="btn btn-success btn-sm text-capitalize">{row.status}</span>
       :
          <span className="btn btn-warning btn-sm text-capitalize">{row.status}</span>
        },
    ]; 

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
  // get monthly attendance reports
  const monthlyAttendanceReport = async ()=>{
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, {
        action: "monthlyAttendanceReport",
      })
      .then((res) => {
        if (res.data.status === "success") {
            const tbl_data = res.data.data.map((row,index)=>({si:index+1,...row})); 
            setTableData(tbl_data) 
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    let isSubscribed = true;
    getAllEmployee();
    monthlyAttendanceReport();
    setFullMonth(monthName);
    setFullYear(yearData);
    return () => (isSubscribed = false);
  }, []); 

    // submit form
    const submitForm = async(e)=>{
        setLoading(true);
        e.preventDefault();
        const month_digit = new Date(`1 ${month} ${+year}`); 
        const formData = {
            emp_id: +emp_id,  
            year: +year,
            month: month_digit.getMonth() + 1,
            in_time: selectedInTime,
            out_time: selectedOutTime,
            action: "monthlyAttendanceDetails",
        };  
        await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
        .then((res) => { 
          setTableData([]);
          setLoading(false);
          if (res.data.status === "success") {

            if(Array.isArray(res.data.data) && res.data.data.length > 0)
            { 
                setTableData(res.data.data) 
            }
            if(res.data.response === "All Fields is required")
            {
                notify("warning", `${res.data.response}`); 
            }
          }
        })
        .catch((e) => {
        //   console.log(e);
        });
    }

    // reset form
    const resetForm =  (e) => {
        e.preventDefault();  
        monthlyAttendanceReport(); // refetching all data
        setYear(""); // Reset year state
        setMonth(""); // Reset month state
        setEmpId(""); // Reset emp_id state
        setSelectedInTime(format(new Date(), 'yyyy-MM-dd H:m:i')); // Reset in_time state
        setSelectedOutTime(format(new Date(), 'yyyy-MM-dd H:m:i')); // Reset out_time state  
        formRef.current.reset();
      };
      
    
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow"> 
                        <Form ref={formRef} onSubmit={submitForm}> 
                            <div className="row p-4">
                                <div className="col-lg-12 mb-4">
                                    <h4>Monthly Attendance</h4>
                                </div>
                                <div className="col-lg-6 col-xl-12 col-md-6 col-sm-12 mb-2">
                                    <h6 className="mt-2">Attendace</h6>
                                </div>
                                <div className="col-lg-12 border-top mb-4"></div>
                                <div className="col-lg-6 col-xl-6 col-md-12 col-sm-12 mb-4"> 
                                    <div className="row">
                                        {/* emp name */}
                                        <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                                            <label htmlFor="emp_name">Employee Name*</label>
                                        </div>
                                        <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12">
                                        <Form.Group controlId="formBasicName"> 
                                            <Select2
                                            className="mb-3"
                                            options={allEmployee && allEmployee?.map(({ id, name }) => ({ value: id, label: name }))}
                                            onChange={e =>{setEmpId(e.value)}}
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
                                                    options={fullYear?.map(({ year }) => ({ value: year,label:year }))}
                                                    onChange={e => {
                                                        setYear(e.value)
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
                                                    options={fullMonth?.map(({ month }) => ({ value: month,label:month }))}
                                                    onChange={e => {
                                                        setMonth(e.value)
                                                    }}
                                                />
                                            </Form.Group> 
                                        </div>
                                        {/* start time */}
                                        <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                                            <label htmlFor="time">Time*</label>
                                        </div>
                                        <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12  mb-4"> 
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <TimePicker 
                                                    size={1} 
                                                    open={openInclock}
                                                    onClose={() => setOpenInClock(false)}
                                                    value={selectedInTime}
                                                    inputFormat="h:m:i"
                                                    onChange={(event) => { 
                                                        setSelectedInTime(format(new Date(event), 'yyyy-MM-dd h:m:i'));
                                                    }}  
                                                    renderInput={(params) =>
                                                        <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setOpenInClock(true)} fullWidth={true} size='small' {...params} required />
                                                        </ThemeProvider>
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        {/* start out-time */}
                                        <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                                            <label htmlFor="out-time">Out Time*</label>
                                        </div>
                                        <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12"> 
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <TimePicker 
                                                    size={1} 
                                                    open={openOutclock}
                                                    onClose={() => setOpenOutClock(false)}
                                                    value={selectedOutTime}
                                                    inputFormat="h:m:i"
                                                    onChange={(event) => { 
                                                        setSelectedOutTime(format(new Date(event), 'yyyy-MM-dd h:m:i'));
                                                    }}  
                                                    renderInput={(params) =>
                                                        <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setOpenOutClock(true)} fullWidth={true} size='small' {...params} required />
                                                        </ThemeProvider>
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        {/* end */}
                                        <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12"></div>
                                        <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12 mt-4"> 
                                            <div className="d-flex justify-content-end align-items-center">
                                                <button type="reset" className="btn btn-warning btn-sm me-2" onClick={resetForm}>Reset</button>
                                                <button type="submit" className="btn btn-success btn-sm">
                                                    {loading && <Loader/>}
                                                    Details
                                                </button>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </Form>
                    </div>
                </div>
            </div> 

            <div className="row mt-2">
                <div className="col-12">
                    <div className="card shadow"> 
                        <div className="row p-4">
                            <AttendanceTable columns={columns} rows={tableData}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}