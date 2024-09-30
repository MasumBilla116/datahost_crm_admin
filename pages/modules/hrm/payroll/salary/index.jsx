import MyToast from "@mdrakibul8001/toastify";
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { HeadSection } from '../../../../../components';
import FilterDatatable from "../../../../../components/Filter/FilterDatatable";
import toast from "../../../../../components/Toast/index";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import Select2 from "../../../../../components/elements/Select2";
import Axios from '../../../../../utils/axios';
import { getSSRProps } from "./../../../../../utils/getSSRProps";

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

    const { http } = Axios();

    const [dobOpen, setDobOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: null,
        salary_month: null,

    })
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const [employeeList, setEmployeeList] = useState([]);
    const [employee, setEmployee] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    let dataset = { ...formData, employeeId: employee.employee_id, action: "createAadvanceSalary" }



    // ---------------------- All Employee fetch--------------------------



    const getEmployee = async () => {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
            .then((res) => {
                setEmployeeList(res.data.data);
            });
    };

    //---------------------- All Employee fetch end--------------------------



    // ---------------------- single Employee values--------------------------

    const onSelectEmployee = (e) => {
        setEmployee({
            employee_id: e.value,
            employee_name: e.label,
            salary_amount: e.salary_amount,
            salary_type: e.salary_type
        })

    }
    // ---------------------- single Employee values end--------------------------


    //---------------------- All Vehicle fetch end--------------------------


    // ---------------------- single Vehicle values--------------------------

    const onSelectVehicle = (e) => {
        setVehiclee({
            vehicle_id: e.value,
            vehicle_name: e.label,
        })

    }
    // ---------------------- single Vehicle values end--------------------------

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            getEmployee();
        });
        return () => clearTimeout(timeout);
    }, []);



    const theme = createTheme({

        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "red" },
                },
            },
        },

    })




    return (

        <Form validated={validated}>

            <div className="row">
                <div className="col-md-12">

                    <Form.Group className="mb-2" controlId="formBasicDesc" >
                        <Form.Label>Select Employee<span className="text-danger">*</span></Form.Label>
                        <Select2 name="employee_type"
                            options={employeeList && employeeList.map(({ id, name, salary_amount, salary_type }) => ({ value: id, label: name, salary_amount, salary_type }))}
                            onChange={onSelectEmployee}
                            className="select-bg"
                        />
                    </Form.Group>


                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            required
                            name="amount"
                            type="number"
                            placeholder="Please Enter the ammount"
                            value={formData.ammount}
                            onChange={handleChange}
                        //   onBlur={validateForm}
                        />
                        <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                            Please provide a name.
                        </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group md="10" className="mt-3" controlId="validationCustom01" >
                        <Form.Label>Salary Month </Form.Label>
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
                                        <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                                    </ThemeProvider>
                                }
                            />
                        </LocalizationProvider>

                    </Form.Group>


                </div>
                <div className="col-md-2">


                </div>
            </div>


            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Create
            </Button>
        </Form>
    );
};


//Update component
const EditForm = ({ onSubmit, salary_id, pending, validated }) => {
    const { http } = Axios();
    const [dobOpen, setDobOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        emp: null,
        salary_month: "",
        salary_amount: null
    })

    const [employeeList, setEmployeeList] = useState([]);
    const [employee, setEmployee] = useState([])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }


    const fetchSalaryData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/salary`, { action: "getAdvanceSalaryInfo", salary_id: salary_id })

            .then((res) => {
                if (isSubscribed) {
                    console.log(res.data.data)
                    setFormData(prev => ({
                        ...prev,
                        emp_id: res.data.data.emp_id,
                        employee_name: res.data.data.employee_name,
                        salary_amount: res.data.data.salary_amount,
                        salary_month: res.data.data.salary_month,
                    }))
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false)
            });

        return () => isSubscribed = false;

    }, [salary_id]);

    useEffect(() => {
        fetchSalaryData();
    }, [fetchSalaryData])


    const selected_employee_options = { value: formData?.emp_id, label: formData?.employee_name };





    // ---------------------- All diriver fetch--------------------------
    const getEmployee = async () => {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
            .then((res) => {
                setEmployeeList(res.data.data);
            });
    };

    //---------------------- All diriver fetch end--------------------------





    // ---------------------- single diriver values--------------------------
    const onSelectEmployee = (e) => {
        setEmployee({
            emp_id: e.value,
            employee_name: e.label,
            salary_amount: e.salary_amount,
            salary_type: e.salary_type
        })

    }
    // ---------------------- single diriver values end--------------------------




    React.useEffect(() => {
        const timeout = setTimeout(() => {
            getEmployee();
        });
        return () => clearTimeout(timeout);
    }, []);



    let dataset = { ...formData, emp_id: employee.emp_id || formData?.emp_id, salary_id, action: "updateAdvanceSalary" }
    // let dataset = { ...formData, employeeId:formData?.emp_id, salary_id,action: "updateSalary" }



    const theme = createTheme({

        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "red" },
                },
            },
        },

    })
    return (

        <>
            <Form validated={validated}>

                <div className="row">
                    <div className="col-md-12">
                        {!!formData?.emp_id === true &&
                            <Form.Group className="mb-2" controlId="formBasicDesc" >
                                <Form.Label>Select Employee<span className="text-danger">*</span></Form.Label>
                                <Select2 name="employee_type"
                                    options={employeeList && employeeList.map(({ id, name, salary_amount, salary_type }) => ({ value: id, label: name, salary_amount, salary_type }))}
                                    onChange={onSelectEmployee}
                                    className="select-bg"
                                    defaultValue={selected_employee_options}
                                />
                            </Form.Group>
                        }

                        <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                required
                                name="salary_amount"
                                type="number"
                                placeholder="Please Enter the ammount"
                                value={formData?.salary_amount}
                                onChange={handleChange}
                            //   onBlur={validateForm}
                            />
                            <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group md="10" className="mt-3" controlId="validationCustom01" >
                            <Form.Label>Salary Month </Form.Label>
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
                                            <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                                        </ThemeProvider>
                                    }
                                />
                            </LocalizationProvider>

                        </Form.Group>


                    </div>
                    <div className="col-md-2">


                    </div>
                </div>


                <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "15px" }} type="button" onClick={() => onSubmit(dataset)} block>
                    Update
                </Button>
            </Form>
        </>
    );
};


//Delete component
const DeleteComponent = ({ onSubmit, salary_id, pending }) => {
    const { http } = Axios();

    const [loading, setLoading] = useState(true);
    const [formData, setFormDataId] = useState({
        salary_id: salary_id
    })

    let dataset = { ...formData, action: "deleteAdvanceSalary" }

    return (
        <>
            <Modal.Body>
                <Modal.Title>Are you sure to delete ?</Modal.Title>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
                    Confirm
                </Button>
            </Modal.Footer>
        </>
    );
};


export const getServerSideProps = async (context) => {
    const { permission, query, accessPermissions } = await getSSRProps({
        context: context,
        access_code: "m.hrm.pyrl",
    });
    return {
        props: {
            permission,
            query,
            accessPermissions,
        },
    };
};

const ListSalary = ({ accessPermissions }) => {

    const { notify } = MyToast();
    const router = useRouter();
    const { pathname } = router;
    const [filteredData, setFilteredData] = useState([]);
    const [alldata, setAlldata] = useState([]);
    const [search, setSearch] = useState("");
    const [salary_id, setSalary_id] = useState(null)
    //Create Tower
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    //Form validation
    const [validated, setValidated] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const { http } = Axios();


    /**** Table  */

    // @ Default date
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;

    const [currentPage, setCurrentPage] = useState(1)
    const [perPageShow, setPerPageShow] = useState(15)
    const [tblLoader, setTblLoader] = useState(true);
    const [filterValue, setFilterValue] = useState({
        status: "all",
        yearMonth: `${y}-${m}`,
        search: null,
        filter: false,
        paginate: true,
    });


    // for data table chagne
    const handleChangeFilter = (e) => {
        setFilterValue(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
            paginate: true,
            filter: true
        }));
        setSearch("");
    };



    /**** Table  */

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchSalaryList();
        });
        return () => clearTimeout(timeout);
    }, [filterValue, currentPage]);


    //Fetch List Data for datatable
    //   const data = vehicleRegNo?.data;

    const fetchSalaryList = async () => {
        let isSubscribed = true;
        setTblLoader(true);
        setTimeout(async () => {
            if (!filteredData?.[currentPage] || filterValue.filter === true) {
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/salary?page=${currentPage}&perPageShow=${perPageShow}`, {
                    action: "allAdvanceSalarieList", filterValue: filterValue
                })
                    .then((res) => {
                        if (isSubscribed) {
                            //   setVehicleRegNo(res?.data);
                            setFilteredData(res?.data?.data);
                            setAlldata(res?.data);
                        }
                    })
                    .catch((err) => {
                        console.log("Server Error ~!")
                    });
                setFilterValue(prev => ({
                    ...prev,
                    filter: false,
                    search: null
                }));
            }
            setTblLoader(false);
        }, 800)
        return () => isSubscribed = false;
    };


    //create floor form
    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/salary`, items)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    handleClose();
                    setLoading(false);
                    setValidated(false);
                    setFilterValue((prev) => ({
                        ...prev,
                        filter: true
                    }))
                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                else {
                    if (msg?.employeeId) {
                        notify("error", `${msg.employeeId.EmployeeId}`);
                    }
                    if (msg?.amount) {
                        notify("error", `${msg.amount.Ammount}`);
                    }

                }
                setLoading(false);
                setValidated(true);
            });

        // fetchSalaryList();

        return () => isSubscribed = false;
    }



    //Update Tower Modal form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [pending, setPending] = useState(false);
    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (id) => {
        setShowUpdateModal(true);
        setSalary_id(id);
    }


    //Update floor form
    const updateForm = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/salary`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Updated!");
                    handleExit();
                    setPending(false);
                    setValidated(false);
                    setFilterValue((prev) => ({
                        ...prev,
                        filter: true
                    }))
                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                else {
                    if (msg?.driverId) {
                        notify("error", `${msg.driverId.EmployeeId}`);
                    }
                    if (msg?.vehicleId) {
                        notify("error", `${msg.vehicleId.VehicleId}`);
                    }

                }
                setPending(false);
                setValidated(true);
            });

        fetchSalaryList();

        return () => isSubscribed = false;
    }




    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);

    const handleOpenDelete = (salary_id) => {
        setShowDeleteModal(true);
        setSalary_id(salary_id);
    }


    //Delete Tower form
    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/salary`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully deleted!");
                    handleExitDelete();
                    setPending(false);
                    setFilterValue((prev) => ({
                        ...prev,
                        filter: true
                    }))
                }

            })
            .catch((e) => {
                console.log('error delete !')
                setPending(false);
            });

        return () => isSubscribed = false;
    }




    const columns = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: (row, index) => index + 1,
            width: "75px",
        },

        {
            name: 'Employee',
            selector: row => row.employees_name,
            sortable: true,

        },
        {
            name: 'Salary',
            selector: row => row.salary_amount,
            sortable: true,
            // width: "70px",
        },
        {
            name: 'Month',
            selector: row => row.salary_month,
            sortable: true,
        },

        {
            name: 'Action',
            selector: row => actionButton(row.id),
            // width: "100px",
            sortable: true,
        },


    ];





    const actionButton = (salary_id) => {
        return (
            <ul className="action list-unstyled mb-0 d-flex justify-content-end">
                {accessPermissions.createAndUpdate && (
                    <li className="mr-2">
                        <Link href="#">
                            <a onClick={() => handleOpen(salary_id)}>
                                <EditIcon />
                            </a>
                        </Link>
                    </li>
                )}
                {accessPermissions.delete && (
                    <li>
                        <Link href="#">
                            <a onClick={() => handleOpenDelete(salary_id)}>
                                <DeleteIcon />
                            </a>
                        </Link>
                    </li>
                )}
            </ul>
        );
    };


    const data = alldata?.data;



    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All-Salary List', link: '/modules/hr/payroll/salary' },

    ];


    const dynamicStatusList = [
        { title: "All", value: "all", selected: true },
        { title: "Deleted", value: "deleted" },

    ];


    return (
        <>
            <HeadSection title="Manage Salary" />
            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">

                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Salary Advance</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">
                                    {accessPermissions.createAndUpdate && <Button
                                        className="shadow rounded btn-sm"
                                        variant="primary"
                                        type="button"
                                        onClick={handleShow}
                                        block
                                    >
                                        Add Advance
                                    </Button>
                                    }
                                    {/* Create Modal Form */}
                                    <Modal dialogClassName="" show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add Salary</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                        </Modal.Body>
                                    </Modal>
                                    {/* End Create Modal Form */}



                                    {/* Update Modal Form */}
                                    <Modal dialogClassName="" show={showUpdateModal} onHide={handleExit}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Update Salary</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <EditForm onSubmit={updateForm} salary_id={salary_id} pending={pending} validated={validated}
                                            />
                                        </Modal.Body>
                                    </Modal>
                                    {/* End Update Modal Form */}

                                    {/* Delete Modal Form */}
                                    <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                        <Modal.Header closeButton></Modal.Header>
                                        <DeleteComponent onSubmit={handleDelete} salary_id={salary_id} pending={pending} />
                                    </Modal>



                                </div>
                            </div>


                            <div className="card-body">

                                <table className="table table-striped small">
                                    <thead style={{ backgroundColor: 'rgb(234, 238, 251)' }}>
                                        <tr>
                                            <th scope="col" className="font-weight-bold text-uppercase" style={{ whiteSpace: 'nowrap' }}>SL No</th>
                                            <th scope="col" className="font-weight-bold text-uppercase" style={{ whiteSpace: 'nowrap' }}>Employee</th>
                                            <th scope="col" className="font-weight-bold text-uppercase" style={{ whiteSpace: 'nowrap' }}>Amount</th>
                                            <th scope="col" className="font-weight-bold text-uppercase" style={{ whiteSpace: 'nowrap' }}>Salary Month</th>
                                            <th scope="col" className="font-weight-bold text-uppercase" style={{ whiteSpace: 'nowrap' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData[1] && filteredData[1].map((data, index) => (
                                            <tr key={data.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.employees_name}</td>
                                                <td>{data.salary_amount}</td>
                                                <td>{data.salary_month}</td>
                                                <td >
                                                    {actionButton(data.id)}
                                                </td>
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

export default ListSalary