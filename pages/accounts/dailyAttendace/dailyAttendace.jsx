import React, { useCallback, useEffect, useState } from 'react'
import format from "date-fns/format";
import { Button, Form, Modal } from "react-bootstrap";
import { TextField } from "@mui/material"
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AnalogClock from '../../../components/AnalogClock';
import DigitalClock from '../../../components/DigitalClock';
import Axios from '../../../utils/axios';
import ViewIcon from '../../../components/elements/ViewIcon';
import EditIcon from '../../../components/elements/EditIcon';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import MyToast from "@mdrakibul8001/toastify";
import axios from 'axios';



// Update component
const EditForm = ({ onSubmit, attendenceDetails, pending }) => {
    const { http } = Axios();
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [attendence, setAttendence] = useState({
        date: attendenceDetails?.date || '',
        type: '',
        time: '',
        reason: ''
    });







    const handleChange = (e) => {
        setAttendence((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };



    //get All countries data


    let dataset = {
        ...attendence,
        action: "attendanceReconcilation",
        attendenceId: attendenceDetails?.id,
        attendence: attendence,
    };


    const accountHead = [
        { label: 'Liabilities', value: 'liability' },
    ]


    return (


        <Form>

            <div className="row">

                <div className="col-sm-6 col-md-6 col-lg-6 mb-3">
                    <Form.Group controlId="formBasicMobile">
                        <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                        <select
                            className="form-control"
                            onChange={handleChange}
                            // value={selectedPayment}
                            name='type'
                        >
                            <option value=''>None</option>
                            <option value='check-in'>Check-in</option>
                            <option value='check-out'>Check-out</option>
                        </select>
                    </Form.Group>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 mb-3">
                    <Form.Group controlId="formBasicMobile">
                        <Form.Label>Time<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="time"
                            placeholder="Contact Number"
                            name="time"
                            onChange={handleChange}
                            required

                        />
                    </Form.Group>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                    <Form.Group controlId="formBasicMobile">
                        <Form.Label>Reason<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Reason"
                            name="reason"
                            required
                            onChange={handleChange}
                        />
                    </Form.Group>
                </div>
            </div>
            <Button
                variant="primary"
                className="shadow rounded"
                style={{ marginTop: "5px" }}
                onClick={() => onSubmit(dataset)}
            >
                Update
            </Button>
        </Form>
    );
};


const DailyAttendace = () => {
    const { http, user, token, logout } = Axios();
    const { notify } = MyToast();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState("check-in");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [isLoading, setIsLoading] = useState(true);
    const [emp_id, setEmpId] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [inTime, setInTime] = useState(null);
    const [openInTime, setOpenInTime] = useState(false);
    const [outTime, setOutTime] = useState(null);
    const [openOutTime, setOpenOutTime] = useState(false);
    const [attendance, setAllAttendance] = useState([])
    const [userId, setUserId] = useState();
    const [pending, setPending] = useState(false);
    // const [action, setAction] = useState()
   

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (user) {
            const decodedJwt = parseJwt(token);
            setUserId(decodedJwt?.id)
        }

        // let decoded = decodeJwt(token);
    }, [user, token]);


    const attendenceList = async () => {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
            { action: "activeUserAttendance", userId }
        ).then((res) => {
            setAllAttendance(res.data.data)
            setIsLoading(false);
        }).catch((error) => {
            console.log('fetching attendence list error', error);
        });
    };


    useEffect(() => {
        attendenceList();
    }, [userId]);


    //Update
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [attendenceId, setAttendenceId] = useState(0);
    const [attendenceDetails, setAttendenceDetails] = useState(0);
    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (data) => {
        setShowUpdateModal(true);
        setAttendenceDetails(data);
    };





    const column = [
        {
            name: <span className="fw-bold">SL</span>,
            selector: (row, index) => index + 1,
            sortable: true,
            width: "50px",
            // center: true
        },
        {
            name: "Date",
            selector: (row) => row.date,
            sortable: true,
            center: true
        },
        {
            name: "In Time",
            selector: (row) => row.in_time,
            sortable: true,
            center: true
        },

        {
            name: "Out Time",
            selector: (row) => row.out_time,
            sortable: true,
            center: true
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            center: true
        },

        {
            name: "Action",
            selector: (row) => actionButton(row),
            center: true
        },
    ];

    const customStyles = {
        head: {
            style: {
                textAlign: "center", // Center align the header
            },
        },
    };

    const actionButton = (row) => {
        return (
            <>
                <ul className="action align-items-center">
                    <li>
                        <Link href='#'>
                            <a>
                                <ViewIcon />
                            </a>
                        </Link>
                    </li>

                    <li>
                        <Link href='#'>
                            <a onClick={() => handleOpen(row)}>
                                <EditIcon />
                            </a>
                        </Link>
                    </li>


                </ul>
            </>
        );
    };

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

    const UserAttendenceInfo = useCallback(async () => {
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, {
                action: "activeUserTodayAttendanceInfo",
            })
            .then((res) => {
                setInTime(res?.data?.data?.in_time)
                setOutTime(res?.data?.data?.out_time)

            })
            .catch((err) => {
                console.log("Something went wrong !");
            });

    }, []);

    useEffect(() => {
        UserAttendenceInfo();
    }, [UserAttendenceInfo]);


    let buttonText = "";

    if (inTime === null && outTime === null) {
        buttonText = "CHECK-IN";
    } else if (inTime !== null && outTime === null) {
        buttonText = "CHECK-OUT";
    } else if (inTime !== null && outTime !== null) {
        buttonText = "Both In & Out Recorded";
    }
    const[currentIp,setCurrentIp] = useState('103.239.253.107')
    const [ipAddressList, setIpAddressList] = useState([]);
    
    const fetchIpAddressList = async () => {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
            { action: "getAllIpAddress" }
        ).then((res) => {
            setIpAddressList(res.data.data);
        }).catch((error) => {
            console.log('fetching attendence list error', error);
        });
    };


    useEffect(() => {
        fetchIpAddressList();
    }, []);


    const [ipAddress, setIpAddress] = useState('');


    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };
        fetchIpAddress();
    }, []);

    const submitForm = async (e) => {
        
        setLoading(true);
        e.preventDefault();
        const matchedIp = ipAddressList.find(item => item.ip_address === ipAddress);
        if (!matchedIp) {
            notify("error", `You are out of the office`);
            return;
        }
        const currentTime = new Date();
        if (inTime === null) {
            setInTime(currentTime);
        } else {
            setOutTime(currentTime);
        }

        const in_time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const out_time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const action = inTime === null ? "check-in" : "check-out";
        const formData = {
            action: "employeeAttendance",
            date: date,
            in_time: in_time,
            out_time: out_time,
            check: action,
        };
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
            .then((res) => {
                if (res.data.status === "success") {
                    notify("success", `${res.data.response}`);
                    attendenceList();
                }
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                notify("warning", `Something is worng. Please try again`);
            });
    }

    const updateForm = async (formData) => {
        let body = {
            date: formData?.date,
            type: formData?.type,
            time: formData?.time,
            reason: formData?.reason,
            attendenceId:formData?.attendenceId,
            userId:userId,
            action:'attendanceReconcilation'
        }
       


        let isSubscribed = true;
        setLoading(true);
       await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, body)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    handleExit();
                    setLoading(false);

                }
            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof msg == "string") {
                    notify("error", `${msg}`);
                } else {
                    if (msg?.time) {
                        notify("error", `${msg.time.Time}`);
                    }
                    if (msg?.type) {
                        notify("error", `${msg.type.Type}`);
                    }
                    if (msg?.reason) {
                        notify("error", `${msg.reason.Reason}`);
                    }

                }
                setLoading(false);
            });

        return () => (isSubscribed = false);
    }

    return (
        <>
            <div className="">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-4">
                            <div className="row p-3">

                                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12  ">
                                    <p style={{ justifyItems: "center", fontWeight: "bold" }}>Daily Attendace</p>
                                </div>
                                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12  mb-4">
                                    <div className="d-flex w-100 justify-content-end align-item-center">

                                    </div>
                                </div>
                                <div >
                                    <Form id="attendance_form" onSubmit={submitForm}>
                                        <div className="row">


                                            <div className="col-lg-9 mt-4">

                                                <div className="">
                                                    <DataTable
                                                        columns={column}
                                                        data={attendance}
                                                        customStyles={customStyles}
                                                        highlightOnHover
                                                        striped

                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3">
                                                <div className="card shadow-sm">
                                                    <div className="card-body" style={{ padding: '7px' }}>
                                                        <DigitalClock />
                                                        <button
                                                            type="submit"
                                                            className="btn  btn-sm text-capitalize mt-1"
                                                            style={{ height: "38px", width: "100%", background: inTime !== null && outTime !== null ? '#c9c5c5' : '#1b5e20', color: 'white' }}
                                                        >
                                                            {/* {inTime === null ? "CHECK-IN" : "CHECK-OUT"} */}
                                                            {buttonText}
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* Update Modal Form */}
                                            <Modal
                                                dialogClassName="modal-md"
                                                show={showUpdateModal}
                                                onHide={handleExit}
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Update Reconciliation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <EditForm
                                                        onSubmit={updateForm}
                                                        attendenceDetails={attendenceDetails}
                                                        pending={pending}
                                                    />
                                                </Modal.Body>
                                            </Modal>
                                            {/* End Update Modal Form */}
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DailyAttendace




