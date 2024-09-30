import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import React, { useState } from "react";

const FilterByYear = ({ handleChangeFilter, setFilterValue }) => {
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() +1;
  const [endDate, setEndDate] = useState(`${y}-${m}-01`);
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  return (
    <div>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        sx={{ padding: "8px" }}
      >
        <DatePicker
          size={1}
          label=""
          open={dobOpenEndDate}
          onClose={() => setDobOpenEndDate(false)}
          value={endDate}
          inputFormat="yyyy-MM"
          onChange={(event) => {
            setEndDate(format(new Date(event), "yyyy-MM"));
            setFilterValue((prev) => ({
              ...prev,
              yearMonth: format(new Date(event), "yyyy-MM"),
              search: true
            }));
          }}
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          renderInput={(params) => (
            <ThemeProvider theme={theme}>
              <TextField
                onClick={(e) => {
                  setDobOpenEndDate(true);
                }}
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
  );
};

export default FilterByYear;
