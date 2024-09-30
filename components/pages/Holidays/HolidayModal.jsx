import moment from 'moment';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import 'react-calendar/dist/Calendar.css';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast from "../../../components/Toast/index";
// import Button from '../../../components/elements/Button';
import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import Axios from "../../../utils/axios";

const HolidayModal = ({ isModalOpen, handleCloseModal, selectedDate }) => {
    const { http } = Axios();
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);
    const [dates, setDates] = useState([
        {
            startDate: moment(selectedDate, "YYYY-MM-DD").toDate(),
            endDate: moment(selectedDate, "YYYY-MM-DD").toDate(),
            key: "selectionn",
        },
    ]);
    const [type, setType] = useState("");
    const [description, setDesc] = useState("");
    const [startDate, setStartDate] = useState(selectedDate);
    const [endDate, setEndDate] = useState(selectedDate);
    useEffect(() => {
        // Calculate the number of days whenever startDate changes
        setStartDate(selectedDate)
        setEndDate(selectedDate);
    }, [selectedDate]);


    const [loading, setLoading] = useState(true);
    const [startOpenDate, setOpenStartDate] = useState(false);
    const [endOpenDate, setOpenEndDate] = useState(false);
    const [numberOfDays, setNumberOfDays] = useState(null);
    const [holidays, setHolidayList] = useState([]);


    useEffect(() => {
        // Calculate the number of days whenever startDate changes
        handleCalculateDays();
    }, [startDate, endDate]);




    React.useEffect(() => {
        const timeout = setTimeout(() => {
            holidayList();
        });
        return () => clearTimeout(timeout);
    }, []);

    const holidayList = async () => {


        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "getAllLeaveType" })
            .then((res) => {
                setHolidayList(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });
        return () => isSubscribed = false;
    };


    const handleCalculateDays = () => {
        if (startDate) {
            const startDateObject = new Date(startDate);
            startDateObject.setHours(0, 0, 0, 0);
            if (!isNaN(startDateObject.getTime())) {
                if (endDate) {
                    const endDateObject = new Date(endDate);
                    endDateObject.setHours(0, 0, 0, 0);
                    if (!isNaN(endDateObject.getTime())) {
                        const timeDifference = endDateObject.getTime() - startDateObject.getTime() + (24 * 60 * 60 * 1000);
                        const calculatedDays = timeDifference / (1000 * 60 * 60 * 24);
                        setNumberOfDays(calculatedDays);

                    } else {
                        console.error('Invalid endDate object');
                    }
                } else {
                    // If only startDate is selected, consider one day
                    setNumberOfDays(1);
                    console.log(`Only startDate selected. Defaulting to one day.`);
                }
            } else {
                console.error('Invalid startDate object');
            }
        } else {
            console.error('Please select the start date');
        }
    };



    async function submitForm(e) {
        e.preventDefault();
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "create", type, description, numberOfDays, startDate, endDate })
            .then((res) => {
                notify("success", "successfully Added!");
                handleCloseModal();
            }).catch((e) => {
                const msg = e.response?.data?.response; 
                if (msg?.type !== undefined) {
                    
                    notify("error", `${msg?.type?.Type}`);
                }
                if (msg?.description !== undefined) {
                    
                    notify("error", `${msg?.description?.Description}`);
                } 
            });
    }



    const theme = createTheme({

        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "" },
                },
            },
        },

    })
    return (
        <Modal show={isModalOpen} onHide={handleCloseModal} >
            <Modal.Header closeButton>
                <Modal.Title>ADD HOLIDAY</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <div className="card-body">

                        <div className="row ">

                            <div className="mb-4 d-flex">
                                <div className="mr-4">
                                    <Form.Group controlId="formBasicName">
                                        <Form.Label>Start Date <span className="text-danger">*</span> </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                required
                                                size={1}
                                                label="Enter start date"
                                                open={startOpenDate}
                                                onClose={() => setOpenStartDate(false)}
                                                value={selectedDate}
                                                inputFormat="yyyy-MM-dd"
                                                onChange={(event) => {
                                                    setStartDate(format(new Date(event), 'yyyy-MM-dd'));
                                                }}
                                                renderInput={(params) => (
                                                    <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setOpenStartDate(true)} fullWidth={true} size="small" {...params} required />
                                                    </ThemeProvider>
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </div>

                                <div>
                                    <Form.Group controlId="formBasicName">
                                        <Form.Label>End Date <span className="text-danger">*</span> </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                required
                                                size={1}
                                                label="Enter end date"
                                                open={endOpenDate}
                                                onClose={() => setOpenEndDate(false)}
                                                value={endDate}
                                                inputFormat="yyyy-MM-dd"
                                                onChange={(event) => {
                                                    setEndDate(format(new Date(event), 'yyyy-MM-dd'));
                                                }}
                                                renderInput={(params) => (
                                                    <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setOpenEndDate(true)} fullWidth={true} size="small" {...params} required />
                                                    </ThemeProvider>
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group >
                                <Form.Label className="">
                                    Type of Holiday <span className="text-danger">*</span>
                                </Form.Label>
                                <br />

                                <select
                                    className="mb-3"
                                    value={type}
                                    required
                                    name="account_type"
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ height: '40px', width: '100%', maxWidth: '417px' }}
                                    >
                                    <option value="">Select Account type</option>
                                    {holidays.map(({ id, name }) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </Form.Group>

                            <Form.Group controlId="formBasicAddress" className="mt-2">
                                <Form.Label> Description <span className="text-danger">*</span> </Form.Label>


                                <textarea
                                    className="form-control"
                                    style={{ height: "150px" }} // Adjust the height as needed
                                    placeholder="Description"
                                    onChange={(e) => setDesc(e.target.value)}
                                    name="description"
                                />
                            </Form.Group>

                        </div>

                    </div>
                    <div className="p-3 border-top">
                        <div className="text-end">
                            <Button
                                className="shadow rounded btn-md"
                                variant="primary"
                                type="button"
                                block
                                onClick={submitForm}
                            >
                                Save
                            </Button>

                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default HolidayModal;
