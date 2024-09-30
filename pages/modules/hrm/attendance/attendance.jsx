import MyToast from "@mdrakibul8001/toastify";
import { createTheme } from "@mui/material/styles";
import format from "date-fns/format";
import Link from "next/link";
import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import AttendanceTable from "../../../../components/attendance_table/attendance_table";
import DateRangeForm from "../../../../components/DateRangeForm";
import Axios from "../../../../utils/axios";
import { calculateWorkHours } from "../../../../utils/utils";
import Entry from "./entry";
import Missing from "./missing";
import { HeadSection } from "../../../../components";


const Attendance = () => {
    const { http } = Axios();
    const { notify } = MyToast();
    // loader
    const [loading, setLoading] = useState(false);
    //   popup clock
    // handle in clock
    const [openFromDate, setOpenFromDate] = useState(false);
    const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
    // handle out-time handle
    const [openToDate, setOpenToDate] = useState(false);
    const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [tableData, setTableData] = useState([]);

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
            sortable: true,
        },
        {
            name: "In Time",
            selector: "in_time",
            sortable: true,
            cell: (row) => {
                if (row.in_time === null)
                    return '---';
                else
                    return row.in_time
            }
        },
        {
            name: "Last In Time",
            selector: "in_time",
            sortable: true,
            cell: (row) => {
                if (row.in_time === null)
                    return '---';
                else
                    return row.in_time
            }
        },
        {
            name: "Last Out Time",
            selector: "out_time",
            sortable: true,
            cell: (row) => {
                if (row.out_time === null)
                    return '---';
                else
                    return row.out_time
            }
        },
        {
            name: "Worked Hourse",
            selector: "worked_hourse",
            sortable: true,
            cell: (row) => calculateWorkHours(row.in_time, row.out_time)
        },
        {
            name: "Action",
            selector: "action",
            sortable: true,
            cell: (row) => (
                <Link href={`/modules/attendance/log_details?emp=${row.emp_id}`} >
                    <a className="btn btn-sm btn-info">
                        <i className="fas fa fa-eye me-2"></i> Details
                    </a>
                </Link>
            ),
        },
    ];
    // const submitForm = async (e) => {
    //     e.preventDefault();
    //     const formData = {
    //         action: "attendanceFilterByDate",
    //         fromDate: fromDate,
    //         toDate: toDate,
    //     };
    //     setTableData([]);
    //     await http
    //         .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
    //         .then((res) => {
    //             setLoading(false);
    //             if (res.data.status === "success") {
    //                 if (Array.isArray(res.data.data) && res.data.data.length > 0) {
    //                     const tbl_data = res.data.data?.map((row, index) => ({ si: index + 1, inTime: row.in_time, outTime: row.out_time, ...row }));
    //                     setTableData(tbl_data)
    //                 }
    //             }
    //         })
    //         .catch((e) => {
    //             //   console.log(e);
    //         });
    // };



    const submitForm = async (formData) => {
        setTableData([]);
        try {
          const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData);
          setLoading(false);
    
          if (res.data.status === "success" && Array.isArray(res.data.data) && res.data.data.length > 0) {
            const tbl_data = res.data.data?.map((row, index) => ({ si: index + 1, inTime: row.in_time, outTime: row.out_time, ...row }));
            setTableData(tbl_data);
          }
        } catch (e) {
          // Handle error
          // console.log(e);
        }
      };
    return (
        <>
        <HeadSection title="Attendance" />
            <div className="row container-fluid">
                <div className="col-md-7">


                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding">
                            <div className="ms-auto me-4 flex-shrink-0">

                                {/* <Form onSubmit={submitForm}>
                                    <div className="row justify-content-end">
                                        <div className="col-xl-3 col-lg-3 col-md-5 col-sm-5">
                                            <div className="input-group">
                                                <label
                                                    htmlFor="from"
                                                    className="form-label mt-2 me-1 font-weight-medium"
                                                >
                                                    From
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
                                        <div className="col-xl-3 col-lg-3 col-md-5 col-sm-5">
                                            <div className="input-group mb-3">
                                                <label
                                                    htmlFor="to"
                                                    className="form-label mt-2 me-1 font-weight-medium"
                                                >
                                                    To
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
                                        <div className="col-xl-1 col-lg-1 col-md-2 col-sm-2 d-flex justify-content-center align-items-center">
                                            <button type="submit" className="btn btn-success mt-4">
                                                {loading && <Loader />}
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </Form> */}
                                                {/* <DateRangeForm onSubmit={submitForm} loading={loading} /> */}


                            </div>
                        </div>






                        <div className="card-body">
                            <div className="table-responsive">
                                <div className="d-flex align-items-center">


                                </div>
                                <AttendanceTable
                                    columns={columns}
                                    rows={tableData}
                                    pagination={false}
                                    searchbar={true}
                                    subHeaderComponent={
                                        <DateRangeForm onSubmit={submitForm} loading={loading} />
                                      }
                                // subHeaderComponent={`<div>comp 1</div>`}
                                />


                            </div>
                        </div>

                    </div>


                </div>



                <div className="col-12 col-md-5">
                    <div className="row">
                        <div className="col-12">
                            <Entry />
                        </div>

                        <div className="col-12">
                            <Missing />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Attendance