import React, { Fragment, useCallback, useEffect, useState } from 'react'
import HeadSection from '../../../../../components/HeadSection'

import { Button, Modal, Form } from "react-bootstrap";
import Link from "next/link";
import Axios from '../../../../../utils/axios';
import Select2 from "../../../../../components/elements/Select2";
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { DeleteIcon, EditIcon, ViewIcon } from '../../../../../components';
import DataTable from 'react-data-table-component';
import MyToast from '@mdrakibul8001/toastify';
import ToastMessage from '../../../../../components/Toast';

//Delete component
const DeleteComponent = ({ onSubmit, salaryId, pending }) => {

    const { http } = Axios();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);





    let myFormData = { "action": "deleteMonthlySalary", id: salaryId }

    return (
        <>
            <Modal.Body>
                <Modal.Title>Are you sure to delete ?</Modal.Title>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="danger" onClick={() => onSubmit(myFormData)}>
                    Delete
                </Button>
            </Modal.Footer>
        </>
    );
};

const BonusGenerate = () => {

    const [salaryData, setSalaryData] = useState([
        { id: 1, employee: 'John Doe', bonusType: 'Gross', amount: 500 },
        { id: 2, employee: 'Jane Smith', bonusType: 'Basic', amount: 300 },
        { id: 3, employee: 'Bob Johnson', bonusType: 'Gross', amount: 450 },
        { id: 4, employee: 'Alice Brown', bonusType: 'Basic', amount: 350 },
        { id: 5, employee: 'Charlie Davis', bonusType: 'Gross', amount: 600 },
        { id: 6, employee: 'Debbie Harris', bonusType: 'Basic', amount: 400 },
        { id: 7, employee: 'Frank Green', bonusType: 'Gross', amount: 550 },
        { id: 8, employee: 'Grace Lee', bonusType: 'Basic', amount: 320 },
        { id: 9, employee: 'Henry White', bonusType: 'Gross', amount: 480 },
        { id: 10, employee: 'Isla Black', bonusType: 'Basic', amount: 370 }
    ]);


    const { http } = Axios();
    const [dobOpen, setDobOpen] = useState(false);
    const [dobOpenSingle, setDobOpenSingle] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [designationList, setDesignationList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [salaryMonth, setSalaryMonth] = useState(null);
    const [tblLoader, setTblLoader] = useState(true);
    const notify = useCallback((type, message) => {
        ToastMessage({ type, message });
    }, []);
    const [filteredData, setFilteredData] = useState([]);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date as 'yyyy-MM-dd' 
    const [formData, setFormData] = useState({
        employee: '',
        salary_month: formattedDate,
        bonusAmount: null
    })


    useEffect(() => {
        const controller = new AbortController();
        async function getEmployees() {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee", })
                .then((res) => {
                    setEmployeeList(res?.data?.data);
                });
        }


        getEmployees();
        return () => controller.abort();

    }, [])



    const theme = createTheme({

        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "red" },
                },
            },
        },

    })


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };




    const handleGenerate = async () => {

        let body = {
            action: "generateBonus",
            generated_date: formData?.salary_month,
        };
        // console.log('body',body);
        // return;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, body)
            .then((res) => {
                notify("success", `Successfully update`);
                fetchItemList();
                // router.push("/modules/hrm/employee");
            })
            .catch((e) => {
                console.log(e)
                // const msg = e.response?.data?.response;
                // if (typeof e.response?.data?.response == "string") {
                //     notify("error", `${e.response?.data?.response}`);
                // } else {

                //     if (msg?.generated_date) {
                //         notify("error", `${msg.generated_date.Generated_date}`);
                //     }
                // }
            });


    }

    const handleSingleGenerate = async () => {
        // singleGenerateBonus
        // console.log("formData",formData);
        // return;
        let body = {
            ...formData,
            action: "singleGenerateBonus",
        };
        // console.log(body)
        // return;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, body)
            .then((res) => {
                notify("success", `Successfully update`);
                fetchItemList();
                // router.push("/modules/hrm/employee");
            })
            .catch((e) => {
                
                const msg = e.response?.data?.response;

                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
            });


    }

    

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);
    const fetchItemList = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, {
            action: "getAllBonusList",
        })
            .then((res) => {
                if (isSubscribed) {
                    setFilteredData(res.data?.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });

        return () => isSubscribed = false;
    };


    return (
        <>
            <HeadSection title="Salary Generate" />

            <div className="container-fluid">

                <div className="row">
                    <div className="col-12 p-xs-2">
                        <div className="card mb-xs-2 shadow">
                            <div className="d-flex border-bottom title-part-padding align-items-center w-100">
                                <div className="row w-100">
                                    <div className="col-md-6 d-flex align-items-center justify-content-start">
                                        <h3>Employee Bonus</h3>
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center justify-content-end">
                                        <div className="col-md-8 pe-0">
                                            <label htmlFor="designationSelect">Select Salary Month</label>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    size={1}
                                                    views={['year', 'month']}

                                                    open={dobOpen}
                                                    onClose={() => setDobOpen(false)}
                                                    value={formData?.salary_month}
                                                    inputFormat="yyyy-MM"
                                                    onChange={(event) => {
                                                        const formattedDate = event ? format(event, 'yyyy-MM') : null;
                                                        setFormData(prev => ({ ...prev, salary_month: formattedDate }));
                                                    }}
                                                    renderInput={(params) =>
                                                        <ThemeProvider theme={theme}>
                                                            <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} placeholder="Select Month" required />
                                                        </ThemeProvider>
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className="col-md-4 d-flex align-items-center justify-content-end pe-0" style={{ marginTop: '30px' }}>
                                            <Button
                                                className="shadow rounded btn-md"
                                                variant="primary"
                                                type="button"
                                                onClick={handleGenerate}
                                            >
                                                Bulk Generate
                                            </Button>
                                        </div>
                                    </div>

                                </div>



                            </div>


                            <div className="d-flex border-bottom title-part-padding align-items-center w-100">
                                <div className="row w-100">
                                    <div className="col-md-3">
                                        <label htmlFor="designationSelect">Select Employee</label>

                                        <select
                                            className="form-control"
                                            onChange={handleChange}
                                            value={formData?.employee}
                                            name='employee'
                                        >
                                            <option value='all'>Employee</option>
                                            {employeeList &&
                                                employeeList.map((employee, index) => (
                                                    <Fragment key={index}>
                                                        <option value={employee?.id}>
                                                            {employee?.name}
                                                        </option>
                                                    </Fragment>
                                                ))}
                                        </select>
                                    </div>



                                    <div className="col-md-3">
                                        <label htmlFor="designationSelect">Bonus Amount</label>
                                        <Form.Group >
                                            {/* <Form.Label>Bonus Amount %</Form.Label> */}
                                            <Form.Control
                                                required
                                                name="bonusAmount"
                                                type="number"
                                                defaultValue={formData?.bonusAmount}
                                                onChange={handleChange}

                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="designationSelect">Select Salary Month</label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                size={1}
                                                views={['year', 'month']}

                                                // label="Date of Birth"
                                                open={dobOpenSingle}
                                                onClose={() => setDobOpenSingle(false)}
                                                value={formData?.salary_month}
                                                inputFormat="yyyy-MM"
                                                onChange={(event) => {
                                                    const formattedDate = event ? format(event, 'yyyy-MM') : null;
                                                    setFormData(prev => ({ ...prev, salary_month: formattedDate }));
                                                }}
                                                renderInput={(params) =>
                                                    <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setDobOpenSingle(true)} fullWidth={true} size='small' {...params} placeholder="Select Month" required />
                                                    </ThemeProvider>
                                                }
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="col-md-3" style={{ marginTop: '30px' }}>
                                        {/* <label htmlFor="designationSelect">Designation</label> */}
                                        <Button
                                            className="shadow rounded btn-md mr-2"
                                            variant="primary"
                                            type="button"
                                            onClick={handleSingleGenerate}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                </div>

                                <div className="ms-auto flex-shrink-0">
                                    <div className="d-flex justify-content-end">

                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <table className="table table-striped small">
                                    <thead style={{ backgroundColor: 'rgb(234, 238, 251)' }}>
                                        <tr>
                                            <th scope="col" className="font-weight-bold text-uppercase ">SL No</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Employee</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Bonus Type </th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Amount</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Date</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {salaryData.map((data, index) => (
                                            <tr key={data.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.employee}</td>
                                                <td>{data.bonusType}</td>
                                                <td>{data.amount}</td>
                                            </tr>
                                        ))} */}

                                        {filteredData.map((data, index) => (
                                            <tr key={data.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.name}</td>
                                                <td className="text-capitalize" >{data.bonus_type}</td>
                                                <td>{data.amount}</td>
                                                <td>{data.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default BonusGenerate