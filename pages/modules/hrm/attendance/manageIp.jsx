import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap";
import Axios from '../../../../utils/axios';
import MyToast from '@mdrakibul8001/toastify';
import DataTable from 'react-data-table-component';
import { DeleteIcon, EditIcon, ViewIcon } from '../../../../components';
import Link from 'next/link';



//Create Component
const EditForm = ({ onSubmit, loading, validated, editData }) => {
    
    const { http } = Axios();
    const [ip, setIp] = useState({
        id: editData?.id,
        ip_address: editData?.ip_address,
        status: editData?.status,
        action: "updateIpAddress"
    })

    //Set Customer
    const handleChange = (e) => {
        setIp((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
   



    let dataset = { ...ip }

    return (

        <Form validated={validated}>

            <div className="row">


                <Form.Group className="mb-2 col-12">
                    <Form.Label>
                        First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Ip address"
                        name="ip_address"
                        value={ip?.ip_address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2 col-12">
                    <Form.Label>
                        First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                            name="status"
                            value={editData?.status}
                            onChange={handleChange}
                            required
                          >
                            <option disabled value="">
                              Select Title
                            </option>
                            <option value={0}>Inactive</option>
                            <option value={1}>Active</option>
                          </Form.Select>
                </Form.Group>


            </div>


            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Update
            </Button>
        </Form>
    );
};


//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

    const { http } = Axios();
    const [ip, setIp] = useState({
        ip_address: "",
        status: 1,
        action: "createIpAddress"
    })

    //Set Customer
    const handleChange = (e) => {
        setIp((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };




    let dataset = { ...ip }

    return (

        <Form validated={validated}>

            <div className="row">


                <Form.Group className="mb-2 col-12">
                    <Form.Label>
                        First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Ip address"
                        name="ip_address"
                        value={ip?.ip_address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>


            </div>


            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Create
            </Button>
        </Form>
    );
};



const DeleteComponent = ({ onSubmit, pending, editData }) => {

    let dataset = {
        action: "deleteIpAddress",
        address_id: editData?.id,
    };
    return (
        <>
            <Modal.Body>
                <Modal.Title>Are you sure to Delete </Modal.Title>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="danger"
                    disabled={pending}
                    onClick={() => onSubmit(dataset)}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </>
    );

}


const ManageIp = () => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const { http } = Axios();
    const { notify } = MyToast();
    const [ipAddressList, setIpAddressList] = useState([]);
    const [editData, setEditData] = useState({});
    const [pending, setPending] = useState(false);

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




    const columns = [
        {
            name: 'SL',
            selector: (row, index) => index + 1,
            sortable: true,
            width: "75px",
        },
        {
            name: 'Ip Address',
            selector: row => row.ip_address,
            sortable: true,
            // width: "75px",
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
            name: "Action",
            selector: (row) => action(row),
            center: true,
            width: "250px",
        },
    ];


    const action = (row) => {
        return (
            <>
                <ul className="action">

                    <li>
                        <Link href="#">
                            <a onClick={() => handleOpenUpdate(row)}>
                                <EditIcon />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <a onClick={() => handleOpenDelete(row)}>
                                <DeleteIcon />
                            </a>
                        </Link>
                    </li>
                </ul>
            </>
        );
    };


    const submitForm = async (items) => {
        // items
        try {
            const res = await http.post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
                items
            );
            setLoading(false);

            if (res.data.status === "success") {
                notify("success", "successfully Added!");
                fetchIpAddressList();
                handleClose();

            }
        } catch (e) {
            const msg = e.response?.data?.response;
            if (typeof (msg) == 'string') {
                notify("error", `${msg}`);
            }
            else {
                if (msg?.ip_address) {
                    notify("error", `${msg.ip_address.Ip_Address}`);
                }

            }
            setLoading(false);
            // setValidated(true);
        }
    }



    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const handleExitUpdate = () => setShowUpdateModal(false);


    const handleOpenUpdate = (row) => {
        setShowUpdateModal(true);
        setEditData(row);
    };





    const updateForm = async (items) => {
        // items
        try {
            const res = await http.post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
                items
            );
            setLoading(false);

            if (res.data.status === "success") {
                notify("success", "successfully Added!");
                fetchIpAddressList();
                handleExitUpdate();
            }
        } catch (e) {
            const msg = e.response?.data?.response;
            if (typeof (msg) == 'string') {
                notify("error", `${msg}`);
            }
            else {
                if (msg?.ip_address) {
                    notify("error", `${msg.ip_address.Ip_Address}`);
                }

            }
            setLoading(false);
            // setValidated(true);
        }
    }



    //Rejecte  Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);


    const handleOpenDelete = (row) => {
        setShowDeleteModal(true);
        setEditData(row);
    };


    //Delete laundry form
    const handleDelete = async (formData) => {

        let isSubscribed = true;
        setPending(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Delete!");
                    fetchIpAddressList();
                    handleExitDelete();
                    setPending(false);

                }
            })
            .catch((e) => {
                setPending(false);
            });

        return () => (isSubscribed = false);
    };

    return (
        <div className="">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">



                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">IP List</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">

                                <Button
                                    className="shadow rounded btn-sm"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Add IP
                                </Button>
                                {/* Create Modal Form */}
                                <Modal dialogClassName="" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add Ip</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}
                                {/* update Modal Form */}
                                <Modal dialogClassName="" show={showUpdateModal} onHide={handleExitUpdate}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Ip</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} loading={loading} validated={validated} editData={editData} />
                                    </Modal.Body>
                                </Modal>

                                {/* Reject Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton>Delete Ip Address</Modal.Header>
                                    <DeleteComponent
                                        onSubmit={handleDelete}
                                        editData={editData}
                                        pending={pending}
                                    />
                                </Modal>
                            </div>
                        </div>


                        <div className="card-body">
                            <DataTable
                                columns={columns}
                                data={ipAddressList}
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

export default ManageIp