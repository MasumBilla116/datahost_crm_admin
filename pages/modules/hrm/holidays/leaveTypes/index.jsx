import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Link from 'next/link';
import DataTable from "react-data-table-component";
import EditIcon from '../../../../../components/elements/EditIcon';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import { useRouter } from "next/router";
import Label from "../../../../../components/elements/Label";
import Axios from "../../../../../utils/axios";
import moment from 'moment';
import ToastMessage from "../../../../../components/Toast";



const DeleteComponent = ({ onSubmit, leaveId, pending }) => {
    const { http } = Axios();

    const [loading, setLoading] = useState(true);
    const [leaveType, setDriverId] = useState({
        leaveId: leaveId
    })

    let dataset = { ...leaveType, action: "deleteLeaveType" }

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


const LeaveTypes = () => {
    const notify = React.useCallback((type, message) => {
        ToastMessage({ type, message });
    }, []);
    const { http } = Axios();
    const [pending, setPending] = useState(false);
    const [holidays, setHolidayList] = useState([]);
    const [year, setYear] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const [type, setType] = useState("");
    const [leaveId, setLeaveId] = useState(null);
    const [uleaveId, setULeaveId] = useState(null);
    const { pathname } = router;

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




    async function submitForm() {
        // e.preventDefault();
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "createLeave", name: type })
            .then((res) => {
                notify("success", "successfully Added!");
                setLoading(false);
                setType("");
            }).catch((e) => {

                const msg = e.response?.data?.response;

                if (typeof (e?.response?.data?.response) == 'string') {
                    notify("error", `${e.response?.data?.response}`);
                }
                else {
                    if (msg?.name) {
                        notify("error", `${msg?.name?.Name}`);
                    }
                }
                setLoading(false);

            });

        holidayList();
        return () => isSubscribed = false;

    }




    async function updateType() {
        // e.preventDefault();
        let isSubscribed = true;
        setLoading(true);
        // let data = {...
        //     uleaveId : uleaveId,
        //     type:type
        // }
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "updateTypeInfo", uleaveId: uleaveId, type: type })
            .then((res) => {
                notify("success", "successfully Update!");
                setLoading(false);
                setType("");
                setULeaveId(null);
            }).catch((e) => {

                const msg = e.response?.data?.response;

                if (typeof (e?.response?.data?.response) == 'string') {
                    notify("error", `${e.response?.data?.response}`);
                }
                else {
                    if (msg?.name) {
                        notify("error", `${msg?.name?.Name}`);
                    }
                }
                setLoading(false);

            });

        holidayList();
        return () => isSubscribed = false;

    }


    const columns = [

        {
            name: 'name',
            selector: row => row.name,
            sortable: true,

        },


        {
            name: 'Created At',
            selector: row => moment(row.created_at).format('DD/MM/YYYY'),
            sortable: true,
        },
        {
            name: 'Updated At',
            selector: row => moment(row.updated_at).format('DD/MM/YYYY'),
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => actionButton(row.id),
        },

    ];
    const actionButton = (id) => {
        return <>
            <ul className="action">
                <li>
                    <Link href='#'>
                        <a onClick={() => handleOpenupdate(id)}>
                            <EditIcon />
                        </a>
                    </Link>
                </li>

                <li>

                    <Link href='#'>
                        <a
                            onClick={() => handleOpenDelete(id)}
                        >
                            <DeleteIcon />
                        </a>
                    </Link>

                </li>
            </ul>
        </>
    }

    const conditionalRowStyles = [
        {
            when: row => row.status == 0,
            style: {
                color: 'red',
            }
        },

    ];





    /*** Delete  Modal */

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);

    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setLeaveId(id);
    }

    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, formData)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully deleted!");
                    handleExitDelete(false);
                    setPending(false);
                }

            })
            .catch((e) => {
                console.log('error delete !')
                setPending(false);
            });

        holidayList();

        return () => isSubscribed = false;
    }



    /*** Delete  Modal */



    /*** update  */
    const handleOpenupdate = async (id) => {
        try {
            // setShowDeleteModal(true);
            setULeaveId(id);
            setLoading(true);

            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "getTypeInfo", leaveId: id });

            if (res.data.data) {
                setType(res.data.data.name);
            }

            setLoading(false);
        } catch (err) {
            console.log('Something went wrong!', err);
            setLoading(false);
        }
    };







    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-xs-2">
                    <div className="card mb-xs-1">


                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">All Leave Types</h4>
                            </div>


                            <div className="ms-auto flex-shrink-0">
                            <div className="d-flex justify-content-end">
                                                <Form.Label className="text-right mr-3">Create New Holiday Type</Form.Label>
                                            </div>
                                <div className="row">
                                    <div className="d-flex align-items-center">
                                        <Form.Group controlId="formBasicName" className="flex-grow-1">
                                            {/* <div className="d-flex justify-content-end">
                                                <Form.Label className="text-right mr-3">Create New Holiday Type<span className="text-danger">*</span></Form.Label>
                                            </div> */}
                                            <Form.Control
                                                type="text"
                                                placeholder="Type Name"
                                                name="name"
                                                onChange={(e) => setType(e.target.value)}
                                                required
                                                // className="mb-3"
                                                value={type}
                                                style={{ fontSize: '15px', width: '300px' }}
                                            />
                                        </Form.Group>

                                        {uleaveId ?
                                            <>

                                                <Button
                                                    className="shadow"
                                                    variant="primary"
                                                    type="button"
                                                    onClick={updateType}
                                                    style={{ fontSize: '15px', padding: '6px 20px' }}   
                                                >

                                                    Update
                                                </Button>
                                            </> : <>

                                                <Button
                                                    className="shadow"
                                                    variant="primary"
                                                    type="button"
                                                    onClick={submitForm}
                                                    style={{ fontSize: '15px', padding: '6px 20px' }}
                                                >
                                                    Create
                                                </Button>
                                            </>


                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">


                            <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                <Modal.Header closeButton></Modal.Header>
                                <DeleteComponent onSubmit={handleDelete} leaveId={leaveId} pending={pending} />
                            </Modal>

                            <DataTable
                                columns={columns}
                                data={holidays}
                                pagination
                                highlightOnHover
                                subHeader
                                conditionalRowStyles={conditionalRowStyles}
                                subHeaderComponent={
                                    <input
                                        type="text"
                                        placeholder="search..."
                                        className="w-25 form-control"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
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

export default LeaveTypes