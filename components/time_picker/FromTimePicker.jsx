import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from 'react';

const theme = createTheme();

const FromTimePicker = ({ time, setfromtime }) => {
  const [openClock, setOpenClock] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    // default time
    const timeParts = time.split(":");
    const defaultTime = new Date();
    defaultTime.setHours(parseInt(timeParts[0], 10));
    defaultTime.setMinutes(parseInt(timeParts[1], 10));
    setSelectedTime(defaultTime);
    setfromtime(defaultTime);
  }, [time, setfromtime]);

  const timeChangeHandler = (newTime) => {
    const date = new Date(newTime);
    const h = date.getHours();
    const m = date.getMinutes();
    setSelectedTime(newTime);
    setfromtime(`${h}:${m}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* TimePicker */}
      {selectedTime !== null && <TimePicker
        size={1}
        open={openClock}
        onClose={() => setOpenClock(false)}
        value={selectedTime}
        inputFormat="H:m:i"
        onChange={timeChangeHandler}
        renderInput={(params) => (
          <ThemeProvider theme={theme}>
            <TextField
              onClick={() => setOpenClock(true)}
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

export default FromTimePicker;
