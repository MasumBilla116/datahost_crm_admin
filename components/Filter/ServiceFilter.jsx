import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { useState } from "react";

const ServiceFilter = ({ statusList,dateFilter, filterValue, setFilterValue, handleChangeFilter, placeholderText }) => {

    const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
    const date = new Date();
    const [endDate, setEndDate] = useState();
    const theme = createTheme({
        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "red" },
                },
            },
        },
    });

    const [text, setText] = useState(null);
    const searchHandle = (e) => {
        setFilterValue(prev => ({
            ...prev,
            search: text,
            paginate: true,
            filter: true
        }));
    }
    const resetHandle = (e) => {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        setEndDate(`${y}-${m}-01`)
        setText(null);
        setFilterValue(prev => ({
            ...prev,
            search: '',
            status: "all",
            yearMonth: `${y}-${m}`,
            filter: true,
        }));
    }

    return <form className=''>
        <div className='row'>

            {statusList !== false && <div className="col-lg-2 col-md-6 col-sm-12 mb-2 pe-lg-0">
                <label htmlFor="status" className="font-weight-bold">Status</label>
                <select onChange={handleChangeFilter} className="form-select" name="status" style={{ padding: "8px", borderColor: "#bfbfbf" }}>
                    {statusList?.map((row, index) => (
                        <option key={index} value={row.value} selected={filterValue.status === row.value ? true : false}>{row.title}</option>
                    ))}
                </select>
            </div>}

            {
                
                dateFilter=== true && 
                <div className="col-lg-2 col-md-6 col-sm-12 mb-2 pe-lg-0">
                <div>
                    <label htmlFor="date">Date</label>
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
                                    paginate: true,
                                    filter: true,
                                }));
                            }}
                            variant="inline"
                            openTo="month"  
                            views={["month", "year"]}  
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
            </div>}



            <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                <label htmlFor="search" className="font-weight-bold">Search</label>
                <div className="input-group mb-3">
                    <input onChange={(e) => setText(e.target.value)} type="text" defaultValue={text} className="form-control" placeholder={placeholderText || 'Search...'} style={{ paddingTop: "7px" }} />
                    <button className="btn btn-primary" type="button" id="search-btn" onClick={searchHandle}>Search</button>
                </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-12 d-flex justify-content-start align-items-center filter-reset-btn-con">
                <div className="position-ralative">
                    <label htmlFor="reset" className="d-xs-none">&nbsp;</label>
                    <button type='reset' onClick={resetHandle} className='btn res-1024-1368-mt-28 w-100 btn-primary horizontal-devider' style={{ paddingTop: "7px" }}>Reset</button>
                </div>
            </div>

        </div>
    </form>
}




export default ServiceFilter;