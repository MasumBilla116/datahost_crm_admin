// DateRangeForm.js
import React, { useState } from 'react';
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from 'date-fns';
import { Form } from "react-bootstrap";
import Loader from '../Loader';

const DateRangeForm = ({ onSubmit, loading }) => {
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const today = new Date();
  const [fromDate, setFromDate] = useState(format(today, 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
  const theme = createTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      action: "attendanceFilterByDate",
      fromDate: fromDate,
      toDate: toDate,
    };

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="row justify-content-end pe-4">
        {/* From Date */}
        <div className="col-xl-3 col-lg-3 col-md-5 col-sm-5">
          <div className="input-group">
            <label htmlFor="from" className="form-label mt-2 me-1 font-weight-medium">
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
                  setFromDate(format(new Date(event), 'yyyy-MM-dd'));
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

        {/* To Date */}
        <div className="col-xl-3 col-lg-3 col-md-5 col-sm-5">
          <div className="input-group mb-3">
            <label htmlFor="to" className="form-label mt-2 me-1 font-weight-medium">
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
                  setToDate(format(new Date(event), 'yyyy-MM-dd'));
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

        {/* Submit Button */}
        <div className="col-xl-1 col-lg-1 col-md-2 col-sm-2 d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-success mt-4">
            {loading && <Loader />}
            Search
          </button>
        </div>
      </div>
    </Form>
  );
};

export default DateRangeForm;
