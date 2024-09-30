import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import * as React from "react";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Loader from "../../../../components/Loader/loader";
import Select2 from "../../../../components/elements/Select2";
import Axios from "../../../../utils/axios";

export default function Entry({accessPermissions}) {
  // loader
  const [loading, setLoading] = useState(false);
  // notify message alert
  const { notify } = MyToast();
  // check
  const [checked, setChecked] = useState("check-in");
  const [openDate, setOpenDate] = useState(false); // handle calendar open and close
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd H:m:i")); // set date format and time format
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
  const { http } = Axios();
  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    const date_time = date.split(" ");

    const formData = {
      action: "attendance",
      emp_id: emp_id,
      date: date_time[0],
      in_time: checked === "check-in" ? date_time[1] : null,
      out_time: checked === "check-out" ? date_time[1] : null,
      check: checked,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        if (res.data.status === "success") {
          notify("success", `${res.data.response}`);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        notify("warning", `Something is worng. Please try again`);
      });
  };
  return (
    <>
      <div className="">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="row p-3">
                {/* <div className="col-lg-12 mb-4 mt-2">
                  <h4>Attendance Entry from Admin</h4>
                </div> */}
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12  ">
                  <p style={{justifyItems:"center",fontWeight:"bold"}}>New Attendace</p>
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12  mb-4">
                  <div className="d-flex w-100 justify-content-end align-item-center">
                   {accessPermissions.createAndUpdate && <button
                      type="button"
                      className="btn btn-success btn-sm me-2"
                      onClick={() => setChecked("check-in")}
                    >
                      {checked === "check-in" && (
                        <i className="fas fa fa-check me-2"></i>
                      )}
                      Check In
                    </button>}
                   {accessPermissions.createAndUpdate && <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => setChecked("check-out")}
                    >
                      {checked === "check-out" && (
                        <i className="fas fa fa-check me-2"></i>
                      )}
                      Check Out
                    </button>}
                  </div>
                </div> 
                <div >
                  {accessPermissions.createAndUpdate && <Form id="attendance_form" onSubmit={submitForm}>
                    <div className="row">
                      <div className="col-lg-5">
                        <div className="">
                          <label htmlFor="emp_name">Employee Name*</label>
                        </div>
                        <div className="">
                          <Form.Group controlId="formBasicName">
                            <Select2
                              // className="mb-3"
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

                      <div className="col-lg-5">
                        <div className="">
                          <label htmlFor="emp_name">Punch Time*</label>
                        </div>
                        <div className="">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                              size={1}
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={date}
                              inputFormat="yyyy-MM-dd H:m:i"
                              onChange={(event) => {
                                
                                setDate(
                                  format(new Date(event), "yyyy-MM-dd H:m:i")
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
                      </div>
                      <div className="col-lg-2 mt-4 pt-1">
                    
                          <button
                            type="submit"
                            className="btn btn-success btn-sm text-capitalize mt-10"
                            style={{height:"38px",width:"100%"}}
                          >
                            {loading && <Loader />}
                            {/* {checked} */}
                            Update
                          </button>
                       
                      </div>


                      {/* <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12"></div>
                      <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12 mt-4">
                        <div className="d-flex justify-content-end align-items-center">
                          <button
                            type="submit"
                            className="btn btn-success btn-sm text-capitalize"
                          >
                            {loading && <Loader />}
                           
                            Update
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </Form>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
