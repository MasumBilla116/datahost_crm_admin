import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap";
import Axios from '../../utils/axios';
import toast from "../../components/Toast/index";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MyToast from '@mdrakibul8001/toastify';
import EditIcon from '../elements/EditIcon';
import DeleteIcon from '../elements/DeleteIcon';
import DataTable from 'react-data-table-component';
import Link from 'next/link';



//Delete component
const DeleteComponent = ({ onSubmit, type_id, pending }) => {

    const { http } = Axios();
    const [loading, setLoading] = useState(true);


    let dataset = { type_id, action: "deleteAddDeddType" }

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
        type: '',
        status: 1

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

    let dataset = { ...formData, action: "createAddDeddType" }

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
                            placeholder="Please Enter the ammount"
                            value={formData.name}
                            onChange={handleChange}
                        //   onBlur={validateForm}
                        />

                    </Form.Group>


                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Select Type</Form.Label>
                        <select
                            className="form-control"
                            onChange={handleChange}
                            value={formData?.type}
                            name='type'
                        >
                            <option value=''>None</option>
                            <option value='additton'>ADDITION</option>
                            <option value='deduction'>DEDUCTION	</option>

                        </select>

                    </Form.Group>
                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Select Status</Form.Label>
                        <select
                            className="form-control"
                            onChange={handleChange}
                            value={formData?.status}
                            name='status'
                        >
                            <option value=''>None</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive	</option>
                        </select>
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


//Create Component
const EditForm = ({ onSubmit, type_id, pending, validated }) => {

    const { http } = Axios();
    const [loading, setLoading] = useState(true);
    const [dobOpen, setDobOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        status: 1

    })
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);


    const fetchInfoData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { action: "getAddDeddTypeInfo", type_id: type_id })
            .then((res) => {
                if (isSubscribed) {
                    setFormData(prev => ({
                        ...prev,
                        name: res.data.data.name,
                        type: res.data.data.type,
                        status: res.data.data.status,
                    }));
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false)
            });

        return () => isSubscribed = false;

    }, [type_id]);

    useEffect(() => {
        fetchInfoData();
    }, [fetchInfoData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }

    let dataset = { ...formData, type_id, action: "updateAddDeddType" }

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
                            placeholder="Please Enter the ammount"
                            value={formData.name}
                            onChange={handleChange}
                        //   onBlur={validateForm}
                        />

                    </Form.Group>


                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Select Type</Form.Label>
                        <select
                            className="form-control"
                            onChange={handleChange}
                            value={formData?.type}
                            name='type'
                        >
                            <option value=''>None</option>
                            <option value='additton'>ADDITION</option>
                            <option value='deduction'>DEDUCTION	</option>

                        </select>

                    </Form.Group>
                    <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                        <Form.Label>Select Status</Form.Label>
                        <select
                            className="form-control"
                            onChange={handleChange}
                            value={formData?.status}
                            name='status'
                        >
                            <option value=''>None</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive	</option>
                        </select>
                    </Form.Group>

                </div>
                <div className="col-md-2">


                </div>
            </div>


            <Button variant="primary" className="shadow rounded"
                disabled={pending || loading} style={{ marginTop: "5px" }}
                onClick={() => onSubmit(dataset)}
            >
                {pending ? 'updating...' : 'update'}
            </Button>
        </Form>
    );
};




const ManageAddDedType = () => {
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


    //Update Tower Modal form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [pending, setPending] = useState(false);
    const [categoryId, setCategoryId] = useState(null)

    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (id) => {
        setShowUpdateModal(true);
        setTypeId(id);
    }



    // type_id
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);

    const data = searchList?.data;

    const fetchItemList = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, {
            action: "getAllAddDeddType",
        })
            .then((res) => {
                if (isSubscribed) {
                  
                    setFilteredData(res?.data?.data);
                    setSearchList(res?.data)
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, items)
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
                    if (msg?.name) {
                        notify("error", `${msg.name.Name}`);
                    }
                    if (msg?.type) {
                        notify("error", `${msg.type.Type}`);
                    }

                }
                setLoading(false);
                setValidated(true);
            });

        fetchItemList();

        return () => isSubscribed = false;
    }




    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setTypeId(id);
    }


    //Delete Tower form
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




    const columns = [

        {
            name: 'Name',
            selector: row => row?.name,
            sortable: true,
        },

        {
            name: 'type',
            selector: row => row?.type,
            sortable: true,
        },

        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            //   width: "100px",
            cell: row => (
                <span className={row.status === 1 ? 'text-success' : 'text-danger'}>
                    {row.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
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
                <li>
                    <Link href="#">
                        <a onClick={() => handleOpen(id)}>
                            <EditIcon />
                        </a>
                    </Link>
                </li>
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


    useEffect(() => {
        let controller = new AbortController();
        const result = data?.filter((item) => {
            return item.name.toLowerCase().match(search.toLocaleLowerCase())

        });

        setFilteredData(result);
        return () => controller.abort();
    }, [search])


    //Update floor form
    const updateForm = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Updated!");
                    handleExit();
                    setPending(false);
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
                setPending(false);
                setValidated(true);
            });

        fetchItemList();

        return () => isSubscribed = false;
    }
    return (
        <div className="container-fluid ">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0"> Addition/Deduction Type</h4>
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
                                        <Modal.Title> Addition/Deduction Type</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}


                                {/* Update Modal Form */}
                                <Modal dialogClassName="" show={showUpdateModal} onHide={handleExit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update Add./Ded. Type</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} type_id={type_id} pending={pending} validated={validated}
                                        />
                                    </Modal.Body>
                                </Modal>
                                {/* End Update Modal Form */}

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
                                subHeaderComponent={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                        <input
                                            type="text"
                                            placeholder="search..."
                                            className="w-25 form-control"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                }
                                striped
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAddDedType