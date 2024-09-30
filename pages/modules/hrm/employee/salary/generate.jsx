import React, { Fragment, useCallback, useEffect, useState } from 'react'
import HeadSection from '../../../../../components/HeadSection'

import { Button, Modal } from "react-bootstrap";
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

const Generate = () => {

    const [salaryData, setSalaryData] = useState([]);


    const { http } = Axios();
    const [dobOpen, setDobOpen] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [designationList, setDesignationList] = useState([]);
    const [salaryMonth, setSalaryMonth] = useState(null);
    const [tblLoader, setTblLoader] = useState(true);
    const notify = useCallback((type, message) => {
        ToastMessage({ type, message });
    }, []);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date as 'yyyy-MM-dd' 
    const [formData, setFormData] = useState({
        department_id: null,
        department_name: 'all',
        designation_id: null,
        designation_name: "",
        salary_month: formattedDate
    })


    const fetchItemList = async () => {
        let isSubscribed = true;
        setTblLoader(true);


        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { action: "getAllMonthlySalary" })
            .then((res) => {
                if (isSubscribed) {
                    setSalaryData(res?.data?.data);
                }
            });
        setTblLoader(false);
        return () => isSubscribed = false;
    };


    useEffect(() => {
        fetchItemList();

    }, []);

    useEffect(() => {
        getDepartment();
        getDesignation();

    }, []);

    const getDepartment = async () => {
        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
            .then((res) => {
                if (isSubscribed) {
                    setDepartmentList(res?.data?.data)

                }
            });

        return () => isSubscribed = false;
    }

    const getDesignation = async () => {
        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, { action: "getDesignations", })
            .then((res) => {
                if (isSubscribed) {

                    setDesignationList(res?.data?.data)

                }
            });

        return () => isSubscribed = false;
    }

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


    /** delete start */
    const [salaryId, setSalaryId] = useState(null);
    const [pending, setPending] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);

    const handleOpenDelete = (id) => {

        setShowDeleteModal(true);
        setSalaryId(id);
    }


    //Delete  form
    const handleDelete = async (formData) => {

        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully deleted!");
                    handleExitDelete();
                    setPending(false);

                }

            })
            .catch((e) => {
                console.log('error delete !')
                setPending(false);
            });

        fetchItemList();

        return () => isSubscribed = false;
    }


    /** delete end */

    const actionButton = (row) => {

        return <>
            <ul className="action">
                <li>
                    <Link href={`/modules/hrm/payroll/salary/month/${row}`}>

                        <a>
                            <ViewIcon />
                        </a>
                    </Link>

                </li>
                {/* <li>

                    <a>
                        <EditIcon />
                    </a>

                </li> */}

                <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleOpenDelete(row) }}>
                    {/* <a href="#" onClick={handleOpenDelete(row.id)}> */}
                        <DeleteIcon />
                    </a>
                </li>
            </ul >
        </>
    }


    const columns = [

        {
            name: 'SL No',
            selector: (row, index) => index + 1,
            sortable: true,
            // width: "60px",

        },
        {
            name: 'Salary Name',
            selector: row => row.month_name,
            sortable: true,

        },
        {
            name: 'Generate Date',
            selector: row => row.created_at,
            sortable: true,

        },
        {
            name: 'Generate By',
            selector: row => row.created_by,
            sortable: true,

        },

        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,

        },
        {
            name: 'Approved Data',
            selector: row => row.approved_data,
            sortable: true,

        },
        {
            name: 'Approved By',
            selector: row => row.approved_by,
            sortable: true,

        },
        {
            name: 'Action',
            selector: row => actionButton(row),
        },

    ];



    // const handleGenerate = () => {
    //     // Create new data object
    //     const newData = {
    //         id: salaryData.length + 1,
    //         salaryName: 'New Salary',
    //         created_by: 'Admin User',
    //         created_at: new Date().toISOString().split('T')[0], // Current date
    //         approved_by: 'Admin User',
    //         approved_data: new Date().toISOString().split('T')[0],
    //         status: "pending",
    //     };

    //     // Update SalaryData state with new data
    //     setSalaryData(prevData => [...prevData, newData]);


    // };


    const handleGenerate = async () => {

        let body = {
            action: "generateMonthlySalary",
            generated_date: formData?.salary_month,
        };
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, body)
            .then((res) => {
                notify("success", `Successfully update`);
                fetchItemList();
                // router.push("/modules/hrm/employee");
            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                
                if (typeof e.response?.data?.response == "string") {
                    notify("error", `${e.response?.data?.response}`);
                } else {

                    if (msg?.generated_date) {
                        notify("error", `${msg.generated_date.Generated_date}`);
                    }
                }
            });


    }

    const handleStatusChange = async (id, newStatus) => {


        let body = {
            action: "updateStatusOfSalaryMonth",
            status: newStatus,
            id: id,
        };

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, body)
            .then((res) => {
                notify("success", `Successfully update`);
                // router.push("/modules/hrm/employee");
                setSalaryData(prevData =>
                    prevData.map(item =>
                        item.id === id ? { ...item, status: newStatus } : item
                    ));

                fetchItemList();
            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof e.response?.data?.response == "string") {
                    notify("error", `${e.response?.data?.response}`);
                }
                // else {
                //   if (msg?.salary_type) {
                //     notify("error", `${msg.salary_type.Salary_type}`);
                //   }
                //   if (msg?.salary_amount) {
                //     notify("error", `${msg.salary_amount.Salary_amount}`);
                //   }
                // }
            });

        // You may want to add a call to your API to update the status in your backend here
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
                                    {/* <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            onChange={handleChange}
                                            value={formData?.department_name}
                                            name='department_name'
                                        >
                                            <option value='all'>All</option>
                                            {departmentList &&
                                                departmentList.map((department, index) => (
                                                    <Fragment key={index}>
                                                        <option value={department?.name}>
                                                            {department?.name}
                                                        </option>
                                                    </Fragment>
                                                ))}
                                        </select>
                                    </div> */}



                                    <div className="col-md-3">
                                        <label htmlFor="designationSelect">Select Salary Month</label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                size={1}
                                                // label="Date of Birth"
                                                open={dobOpen}
                                                onClose={() => setDobOpen(false)}
                                                value={formData?.salary_month}
                                                inputFormat="yyyy-MM-dd"
                                                onChange={(event) => {
                                                    const formattedDate = event ? format(event, 'yyyy-MM-dd') : null;
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
                                    <div className="col-md-3" style={{ marginTop: '30px' }}>
                                        {/* <label htmlFor="designationSelect">Designation</label> */}
                                        <Button
                                            className="shadow rounded btn-md mr-2"
                                            variant="primary"
                                            type="button"
                                            onClick={handleGenerate}
                                        >
                                            Generate
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
                                            <th scope="col" className="font-weight-bold text-uppercase">Month Name</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Generate Date</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Generate By</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-uppercase">Status</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Approved Date</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Approved By</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-center" >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaryData.map((data, index) => (
                                            <tr key={data.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.month_name}</td>
                                                <td>{new Date(data.created_at).toISOString().split('T')[0]}</td>
                                                <td>{data.generated_by_name}</td>
                                                <td>
                                                    <select
                                                        value={data.status}
                                                        onChange={(e) => handleStatusChange(data.id, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                {/* <td>{new Date(data.approved_date).toISOString().split('T')[0]}</td> */}
                                                <td>{data.approved_date}</td>
                                                <td>{data.approved_by_name}</td>
                                                <td>
                                                    {actionButton(data.id)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} salaryId={salaryId} pending={pending} />
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Generate