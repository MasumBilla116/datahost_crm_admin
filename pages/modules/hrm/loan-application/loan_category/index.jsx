import MyToast from '@mdrakibul8001/toastify';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap";
import Axios from '../../../../../utils/axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EditIcon from '../../../../../components/elements/EditIcon';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import DataTable from 'react-data-table-component';
import Link from 'next/link';



//Delete component
const DeleteComponent = ({ onSubmit, type_id, pending }) => {

    const { http } = Axios();
    const [loading, setLoading] = useState(true);


    let dataset = { type_id, action: "deleteLoanCategoryType" }

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


//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

    const { http } = Axios();

    const [dobOpen, setDobOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',

    })
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    let dataset = { ...formData, action: "createLoanCategory" }

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

                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            name="name"
                            type="text"
                            placeholder="Please Enter the Category name"
                            value={formData.name}
                            onChange={handleChange}
                        //   onBlur={validateForm}
                        />

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


const LoanCategory = () => {
    const { notify } = MyToast();
    //Create Tower
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const { http } = Axios();
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");
    const [searchList, setSearchList] = useState([]);
    const [type_id, setTypeId] = useState(null)
    console.log("filteredData", filteredData);

    //Update Tower Modal form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [pending, setPending] = useState(false);
    const [categoryId, setCategoryId] = useState(null)

    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (id) => {
        setShowUpdateModal(true);
        setTypeId(id);
    }


    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setTypeId(id);
    }

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);

    const fetchItemList = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, {
            action: "getAllLoanCategory",
        })
            .then((res) => {
                if (isSubscribed) {

                    setFilteredData(res?.data?.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });

        return () => isSubscribed = false;
    };

    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, items)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    handleClose();
                    setLoading(false);
                    setValidated(false);

                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                else {
                    if (msg?.name) {
                        notify("error", `${msg.name.Name}`);
                    }

                }
                setLoading(false);
                setValidated(true);
            });

        fetchItemList();

        return () => isSubscribed = false;
    }



    //Delete Tower form
    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, formData)
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


    const columns = [

        {
            name: 'Name',
            selector: row => row?.name,
            sortable: true,
        },

        {
            name: 'Action',
            selector: row => actionButton(row.id),
            width: "150px",                       // added line here
        },

    ];

    const actionButton = (id) => {
        return <>
            <ul className="action ">
                {/* <li>
                    <Link href="#">
                        <a onClick={() => handleOpen(id)}>
                            <EditIcon />
                        </a>
                    </Link>
                </li> */}
                <li>
                    <Link href="#">
                        <a onClick={() => handleOpenDelete(id)} >
                            <DeleteIcon />
                        </a>
                    </Link>

                </li>

            </ul>
        </>
    }
    return (
        <div className="container-fluid ">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0"> Loan Category Type</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                <Button
                                    className="shadow rounded btn-sm"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Add Type
                                </Button>


                                {/* Create Modal Form */}
                                <Modal dialogClassName="" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title> Addition Loan Type</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}

                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} type_id={type_id} pending={pending} />
                                </Modal>


                            </div>
                        </div>


                        <div className="card-body">

                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                highlightOnHover
                                subHeader

                                striped
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoanCategory