 
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from 'react';

const theme = createTheme();

const FromToToTimePicker = ({time,setfromtime,settotime}) => {
  const fromToToTime = time.split("-");
  const [openFromClock, setOpenFromClock] = useState(false);
  const [openToClock, setOpenToClock] = useState(false);
  const [fromTime, setFromTime] = useState( ); // Initialize with your default or initial time
  const [toTime, setToTime] = useState(); // Initialize with your default or initial time


  useEffect(()=>{
    // default from time
    const from = fromToToTime[0]?.split(":");
    const defaultFromTime = new Date();
    defaultFromTime.setHours(parseInt(from[0],10));
    defaultFromTime.setMinutes(parseInt(from[1],10)); 
    setFromTime(defaultFromTime);  
    setfromtime(defaultFromTime);
    // default to time
    const to = fromToToTime[1]?.split(":");
    const defaultToTime = new Date();
    defaultToTime.setHours(parseInt(to[0],10));
    defaultToTime.setMinutes(parseInt(to[1],10)); 
    setToTime(defaultToTime); 
    settotime(defaultToTime);
  },[time])

  const fromChangeHandler = (newTime) => {
    const date = new Date(newTime);
    const h = date.getHours();
    const m = date.getMinutes();
    setFromTime(newTime);
    setfromtime(`${h}:${m}`);
  };

  const toChangeHandler = (newTime) => {
    const date = new Date(newTime);
    const h = date.getHours();
    const m = date.getMinutes();
    setToTime(newTime);
    settotime(`${h}:${m}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* From TimePicker */}
      {fromTime !== null && <TimePicker
        size={1}
        open={openFromClock}
        onClose={() => setOpenFromClock(false)}
        value={fromTime}
        inputFormat="H:m:i"
        onChange={fromChangeHandler}
        renderInput={(params) => (
          <ThemeProvider theme={theme}>
            <TextField
              onClick={() => setOpenFromClock(true)}
               
              size="small"
              {...params}
              required
            />
          </ThemeProvider>
        )}
      />}

      {/* To TimePicker */}
      {toTime !== null && <TimePicker
        size={1}
        open={openToClock}
        onClose={() => setOpenToClock(false)}
        value={toTime}
        inputFormat="H:m:i"
        onChange={toChangeHandler}
        renderInput={(params) => (
          <ThemeProvider theme={theme}>
            <TextField
              onClick={() => setOpenToClock(true)} 
              size="small"
              {...params}
              required
            />
          </ThemeProvider>
        )}
      />}
    </LocalizationProvider>
  );
};

export default FromToToTimePicker;
