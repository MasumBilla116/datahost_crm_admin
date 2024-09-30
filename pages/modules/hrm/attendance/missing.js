import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import AttendanceTable from "../../../../components/attendance_table/attendance_table";
import Loader from "../../../../components/Loader/loader";
import Axios from "../../../../utils/axios";

export default function Missing({accessPermissions}) {
  const { http } = Axios();
  const { notify } = MyToast();
  // loader
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [openDate, setOpenDate] = useState(false); // handle calendar open and close
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd")); // set date format and time format
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
  //  data table
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]); // select rows state
  const [tableData, setTableData] = useState([]);

  // handle select field
  const handleRowSelect = (row) => {
    const updatedSelectedRows = [...selectedRows];
    const existingRowIndex = updatedSelectedRows.findIndex(
      (selectedRow) => selectedRow.id === row.id
    );

    if (existingRowIndex !== -1) {
      updatedSelectedRows.splice(existingRowIndex, 1);
    } else {
      updatedSelectedRows.push(row);
    }

    setSelectedRows(updatedSelectedRows);
  };

  // select missing
  const selectableRows = {
    selectAllRows: true,
    selectAllText: "Select All",
    onClick: (selectedRows, setSelectedRows) => setSelectedRows(selectedRows),
    selectedRows,
  };
  //end select missing 
  // table field and data
  const columns = [
    {
      name: "SL",
      selector: (row,index) =>  index +1,
      sortable: true,
      width: '70px'
    }, 
    {
      name: "Employee ID",
      selector: row => "EMP-" + row.emp_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Designation",
      selector: row => row.designation,
      sortable: true,
    }, 
    {
      name: "In Time", 
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.in_time}
          name="in_time[]"
          className="form-control p-1"
        />
      ),
    },
    {
      name: "Out Time", 
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.out_time}
          name="out_time[]"
          className="form-control p-1"
        />
      ),
    },
    {
      name: "Status", 
      sortable: true,
      cell: (row) =>
        row.status == "present" ? (
          <span className="btn btn-success btn-sm text-capitalize">
            {row.status}
          </span>
        ) : (
          <span className="btn btn-warning btn-sm text-capitalize">
            {row.status}
          </span>
        ),
    },
  ];
  // end table field
  const fetchData = async () => { 
    const formData = {
      action: "missionAttendance",
      date: date,
    };

     await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
     .then(response=>{ 
      setTableData( response?.data?.data ?? [] );
     })
     .catch(error=>{
      console.log("error: ",error)
     }) 

    // const response = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData);
    
    // if (isMounted) {
    //   setLoading(false);
    //   if (response?.data?.status === "success" && Array.isArray(response?.data?.data) && response?.data?.data?.length > 0) {
    //     const new_data = response.data.data.map((row, index) => ({
    //       si: index + 1,
    //       ...row,
    //     }));
    //     console.log("New data:", new_data); // Log new_data to inspect its format
    //     setTableData( response.data.data);
    //   }
    // } 
};
  // prefetch missing data
  useEffect(() => {    
  
    fetchData();
   
  }, []);
   
  // end prefetch missing data

  // find missing attendance
  const findMissingAttendance = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      action: "missionAttendance",
      date: date,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        setLoading(false);
        if (res.data.status === "success") {
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            setTableData([]);
            const tbl_data = res.data.data?.map((row, index) => ({
              si: index + 1,
              inTime: row.in_time,
              outTime: row.out_time,
              ...row,
            }));
            setTableData(tbl_data);
          }
          if (res.data.response === "Not found any result") {
            notify("warning", `${res.data.response}`);
          }
        }
      })
      .catch((e) => {
        //   console.log(e);
      });
  };
  // end find missing attendace

  // save missing attendance data
  const saveMissingAttendance = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    const form = new FormData(e.target);
    const formData = {
      emp_id: form.getAll("emp_id[]"),
      in_time: form.getAll("in_time[]"),
      out_time: form.getAll("out_time[]"),
      action: "missionAttendanceUpdate",
    };

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        setSaveLoading(false);
        if (res.data.response === "All Missing Updated") {
          notify("success", `${res.data.response}`);
        } else {
          notify("warning", `Something is worng`);
        }
      })
      .catch((e) => {
        setSaveLoading(false);
        notify("warning", `Something is worng`);
        //   console.log(e);
      });
  };
  // end save missing attendance data

  return (
    <div className="">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="row pt-4 px-4 pb-2">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-6 mb-2">
                <p style={{ justifyItems: "center", fontWeight: "bold" }}> Missing Attendace</p>
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-6  justify-content-end ">

               {accessPermissions.createAndUpdate && <Form onSubmit={findMissingAttendance}>
                  <div className="row justify-content-end align-items-start">                    {/* emp name */}

                    <div className="col-lg-10 col-xl-10 col-md-10 col-sm-10  mb-4">

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size={1}
                          open={openDate}
                          onClose={() => setOpenDate(false)}
                          value={date}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setDate(format(new Date(event), "yyyy-MM-dd"));
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
                </Form>}
              </div>

              <div className="col-lg-12 border-top "></div>

            </div>
           {accessPermissions.createAndUpdate && <Form onSubmit={saveMissingAttendance}>
              <div className="px-3">

                 <AttendanceTable
                  columns={columns}
                  rows={tableData}
                  pagination={false}
                  searchbar={false}
                /> 

                <div className="row mt-3">
                  <div className="col-lg-6">
                 
                  <p
                    className="w-100 p-1  text-center text-dark d-flex justify-content-center align-items-center mb-4"
                    style={{ background: "#9ef39e",height:"41px" }}
                  >
                    Total Record {tableData?.length}
                  </p>
                
                  </div> 

                  <div className="col-lg-6"> 
                    <button
                      type="submit"
                      className="btn btn-sm btn-success w-100"
                      style={{height:"38px" }}
                    >
                      {saveLoading && <Loader />}
                      Save
                    </button>
                  
               
                  </div>
                </div>




              </div>
            </Form>}

          </div>
        </div>
      </div>
    </div>
  );
}
