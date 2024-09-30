
import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import EditIcon from '../../../../../components/elements/EditIcon';
import Axios from '../../../../../utils/axios';
import { getSSRProps } from '../../../../../utils/getSSRProps';

export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.stng.wb_cnfg" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };
//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {



    const [slider, setSlider] = useState({
        title: "",

    })


    const handleChange = (e) => {

        setSlider(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))

    }



    let dataset = { ...slider, action: "createSlider" }

    return (

        <Form validated={validated}>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Slider Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    name='title'
                    onChange={handleChange}
                    required
                />
            </Form.Group>



            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Create
            </Button>
        </Form>
    );
};


//Update component
const EditForm = ({ onSubmit, slider_id, pending, validated }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);

    const [slider, setSlider] = useState({
        title: "",
        slider_id: slider_id
    })
    console.log("slider_id", slider);

    const handleChange = (e) => {

        setSlider(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))

    }

    const fetchSliderData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, { action: "getSliderInfo", slider_id })
            .then((res) => {
                if (isSubscribed) {
                    setSlider(prev => ({
                        ...prev,
                        title: res.data.data.title,
                    }));
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false)
            });

        return () => isSubscribed = false;

    }, [slider_id]);



    useEffect(() => {
        fetchSliderData();
    }, [fetchSliderData])


    let dataset = { ...slider, action: "updateSlider" }

    return (

        <Form >

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Slider Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    name='title'
                    defaultValue={slider.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>




            <Button variant="primary" className="shadow rounded"
                disabled={pending || loading} style={{ marginTop: "5px" }}
                onClick={() => onSubmit(dataset)}
            >
                {pending ? 'Updating...' : 'Update'}
            </Button>
        </Form>
    );
};


//Delete component
const DeleteComponent = ({ onSubmit, slider_id, pending }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);


    let dataset = { slider_id, action: "deleteSlider" }

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




const ManageSliders = () => {

    const { http } = Axios();
    const { notify } = MyToast();
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [slider_id, setSliderId] = useState(null)

    //Form validation
    const [validated, setValidated] = useState(false);
    //Create 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    //Update Tower Modal form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [designationId, setDesignationId] = useState(null)

    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (id) => {
        setShowUpdateModal(true);
        setSliderId(id);
    }

    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setSliderId(id);
    }

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAllSlides();
        });
        return () => clearTimeout(timeout);
    }, []);

    const data = sliderList?.data;

    const fetchAllSlides = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, {
            action: "getAllSliders",
        })
            .then((res) => {
                if (isSubscribed) {
                    setFilteredData(res.data?.data);
                    setSliderList(res.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });

        return () => isSubscribed = false;
    };



    //create floor form
    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, items)
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
                    if (msg?.title) {
                        notify("error", `${msg.title.Title}`);
                    }
                }
                setLoading(false);
                setValidated(true);
            });

        fetchAllSlides();

        return () => isSubscribed = false;
    }



    //Update floor form
    const updateForm = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, formData)
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
                    if (msg?.title) {
                        notify("error", `${msg.title.Title}`);
                    }

                }
                setPending(false);
                setValidated(true);
            });

        fetchAllSlides();

        return () => isSubscribed = false;
    }


    //Delete  form
    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, formData)
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

        fetchAllSlides();

        return () => isSubscribed = false;
    }


    //----------------- search operation-----------------

    useEffect(() => {
        let controller = new AbortController();
        const result = data?.filter((slider) => {
            return slider.title
                .toLowerCase()
                .match(search.toLocaleLowerCase());
        });

        setFilteredData(result);
        return () => controller.abort();
    }, [search]);



    //-----------------End search operation-----------------





    const actionButton = (id) => {
        return <>
            <ul className="action ">

                <li>
                    <Link href="#">
                        <a onClick={() => handleOpen(id)} >
                            <EditIcon />
                        </a>
                    </Link>

                </li>
                {/* <li>
                    <Link href="#">
                        <a onClick={() => handleOpenDelete(id)} >
                            <DeleteIcon />
                        </a>
                    </Link>

                </li> */}

            </ul>
        </>
    }


    const columns = [

        {
            name: 'Slider Name',
            selector: row => row.title,
            sortable: true,
        },

        {
            name: 'Action',
            selector: row => actionButton(row.id),
            width: "150px",                       // added line here
        },

    ];
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-xs-2">
                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">All Sliders</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                <Button
                                    className="shadow rounded btn-sm"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Add Slider
                                </Button>



                                {/* Create Modal Form */}
                                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Create Slider</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}






                                {/* Update Modal Form */}
                                <Modal dialogClassName="modal-lg" show={showUpdateModal} onHide={handleExit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update Slider</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} slider_id={slider_id} pending={pending} validated={validated}
                                        />
                                    </Modal.Body>
                                </Modal>
                                {/* End Update Modal Form */}






                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} slider_id={slider_id} pending={pending} />
                                </Modal>


                            </div>
                        </div>


                        <div className="card-body table-responsive">
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                highlightOnHover
                                subHeader
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

export default ManageSliders