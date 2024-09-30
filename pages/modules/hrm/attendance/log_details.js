import MyToast from "@mdrakibul8001/toastify";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaWindowClose } from "react-icons/fa";
import Axios from "../../../../utils/axios";
import { calculateWorkHours } from "../../../../utils/utils";

export default function LogDetails() {
  const { http } = Axios();
  const { notify } = MyToast();
  const [tableData, setTableData] = useState([]);
  const [empName, setEmpName] = useState("");
  const route = useRouter(); 
  // handle in clock
  const [openInclock, setOpenInClock] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    format(new Date(), "yyyy-MM-dd H:m:i")
  );
  // modal
  const [toggleModal, setToggleModal] = useState(false);
  const handleModal = () => {
    if (toggleModal) setToggleModal(false);
    else setToggleModal(true);
  };

  // delete modal
  const [deleteModal,setDeleteModal] = useState(false);
  

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

  

  const logDetails = async (emp_id) => {
    const formData = {
      action: "logDetails",
      emp_id: emp_id,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        if (res.data.status === "success") {
          setTableData(res.data.data.data);
          setEmpName(res.data.data.name);
        }
      })
      .catch((e) => {
        //   console.log(e);
      });
  };

  useEffect(() => {
    let isRun = true;
    logDetails(route.query.emp);

    // return () => (isRun = false);
  }, []);
  // get the month name
  const getMonthName = (date) => {
    const fullDate = new Date(date);
    const month = fullDate.toLocaleString("default", { month: "long" });
    return month;
  };

  //get day
  const getDay = (date) => {
    const day = new Date(date);
    return day.getDate();
  };
  //get full year
  const getFullYear = (date) => {
    const year_ = new Date(date);
    return year_.getFullYear();
  };

  const [modalTitle, setModalTitle] = useState({ title: "", label: "" }); 
  const [updateEmpId,setUpdateEmpId] = useState();
  const [updateType,setUpdateType] = useState();
  /// update
  const handleUpdateModal = (emp_id, time, date, type) => {
    if (time !== "---") {
      setSelectedTime(date + " " + time);
    }
    if (type === "in") {
      setModalTitle({ title: "Change punch in time", label: "In Time" });
    } else {
      setModalTitle({ title: "Change punch out time", label: "Out Time" });
    }
    setUpdateEmpId(emp_id);
    setUpdateType(type);
  };
  
  const Update = async (e) => { 
    e.preventDefault();
    const formData = {
      action: "update_attendance",
      at_id: updateEmpId,
      time: selectedTime,
      type: updateType
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        if (res.data.status === "success") {
          notify("success", `${res.data.response}`);
          logDetails();
          handleModal();
        }
      })
      .catch((e) => {
        //   console.log(e);
        notify("warning", `Somethig is worng`);
        
      });
  };

  const [deleteAttendanceEmpId,setDeleteEmpAttendance] = useState();
  const [openDeleteModal,setOpenDeleteModal] = useState(false);
  // delete
  const handleDeleteModal = () => {
    if(openDeleteModal)
    {
      setOpenDeleteModal(false);
    }
    else{
      setOpenDeleteModal(true);
    }
  };

  const deleteAttendance = async(e)=>{
    e.preventDefault();
    const formData ={
      action: "delete_attendance",
      at_id: deleteAttendanceEmpId
    } 
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
      .then((res) => {
        if (res.data.status === "success") {
          notify("success", `${res.data.response}`);
          handleDeleteModal();
          logDetails(); 
        }
      })
      .catch((e) => {
        //   console.log(e);
        notify("warning", `Somethig is worng`);
        
      });
  }

  // count si
  const SI = 1;
  return (
    <>
      <div className="container-fluid">
        {/* Create Modal Form */}
        <Modal show={toggleModal} onHide={handleModal}>
          <Form onSubmit={Update}>
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                {/* start time */}
                <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12">
                  <label htmlFor="time">{modalTitle.label}</label>
                </div>
                <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12  mb-4">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      size={1}
                      open={openInclock}
                      onClose={() => setOpenInClock(false)}
                      value={selectedTime}
                      inputFormat="H:m:i"
                      onChange={(event) => {
                        setSelectedTime(
                          format(new Date(event), "yyyy-MM-dd H:m:i")
                        );
                      }}
                      renderInput={(params) => (
                        <ThemeProvider theme={theme}>
                          <TextField
                            onClick={() => setOpenInClock(true)}
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
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* End Create Modal Form */} 
        {/* delete Modal Form */}
        <Modal show={openDeleteModal} onHide={handleDeleteModal}>
          <Form onSubmit={Update}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Delete This Item</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteModal}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={deleteAttendance}>
                Yes! Delete  
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* End delete Modal Form */} 
      
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="row p-4">
                <div className="col-12 mb-4">
                  <h5 className="text-center">{empName}</h5>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModal}
                  >
                    Modal
                  </button>
                </div>
                {/* first table */}
                <div className="col-12 mb-4 p-0">
                  {tableData?.map((row, index) => (
                    <>
                      <p className="ms-1 mb-4 mt-4">
                        {getMonthName(row.date)}, {getDay(row.date)},{" "}
                        {getFullYear(row.date)}
                      </p>
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>S.I</th>
                            <th>Punch Time</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{SI }</td>
                            <td>{row.in_time ? row.in_time : "---"}</td>
                            <td>In</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger me-2"
                                onClick={() => {
                                  setDeleteEmpAttendance(row.at_id);;
                                  handleDeleteModal()
                                }}
                              >
                                <FaWindowClose />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  handleUpdateModal(
                                    row.at_id,
                                    row.in_time,
                                    row.date,
                                    "in"
                                  );
                                  handleModal();
                                }}
                              >
                                <i className="fas fa fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>{SI +1}</td>
                            <td>{row.out_time ? row.out_time : "---"}</td>
                            <td>Out</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger me-2"
                                onClick={() => {
                                  setDeleteEmpAttendance(row.at_id);
                                  handleDeleteModal();
                                }}
                              >
                                <FaWindowClose />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  handleUpdateModal(
                                    row.at_id,
                                    row.out_time,
                                    row.date,
                                    "out"
                                  );
                                  handleModal();
                                }}
                              >
                                <i className="fas fa fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan={4}>
                              N.B: You Spent{" "}
                              {calculateWorkHours(row.in_time, row.out_time)}{" "}
                              Hours out of working hourse
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </>
                  ))}
                  {/* <AttendanceTable
                      columns={columns}
                      rows={tableData}
                      pagination={false}
                      searchbar={false}
                    /> */}
                </div>

                {/* pagination */}
                <div className="col-12 pe-0 d-none">
                  <div className="d-flex justify-content-end align-items-center">
                    <nav>
                      <ul className="pagination">
                        <li className="page-item">
                          <a className="page-link rounded-0 " href="#">
                            <span>&laquo;</span>
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link rounded-0" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link rounded-0" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link rounded-0" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link rounded-0" href="#">
                            <span>&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
