import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import FileSelectButton from '../../../../../components/MRIfileManager/FileSelectButton';
import MRI_Uploader from '../../../../../components/MRIfileManager/MRI_Uploader';
import MRIfileManagerRender from '../../../../../components/RenderMethods/MRIfileManagerRender';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
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

    const { http } = Axios();
    const [arr, setArr] = useState([]);
    const [filesArr, setFilesArr] = useState([]);
    const [facilities, setFacilities] = useState({
        name: "",
        sort_description: "",
        long_description: "",
        upload_ids: [],
        upload_files: [],
    })

    const handleChange = (e) => {
        setFacilities(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }


    // start File manager section
    //function set selected files ids
    const setFilesData = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArr.push(data[i]);
        }

        setFacilities(prev => ({
            ...prev, upload_files: filesArr
        }))
    }


    //function set selected files ids
    const setIds = (Ids) => {

        for (let i = 0; i < Ids.length; i++) {
            arr.push(Ids[i]);
        }

        setFacilities(prev => ({
            ...prev, upload_ids: arr
        }))

    };


    const removePhoto = (id) => {
        //Ids array remove
        let filtered = arr.filter(function (item) {
            return item != id;
        });

        setArr(filtered);

        setFacilities(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArr.filter((item) => item.id !== id);
        setFilesArr(newList);

        setFacilities(prev => ({
            ...prev, upload_files: newList
        }))

    }


    let dataset = { ...facilities, action: "createFacilities" }
    // console.log(dataset);

    return (

        <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>


            {/* MRI_Uploader Modal Form */}
            <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Uploader</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <MRI_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            {/* End MRI_Uploader Modal Form */}

            <Form>
                <Form.Group controlId="formBasicName" >
                    <Form.Label>Facilities Name<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Facilities Name"
                        defaultValue={facilities.name}
                        name='name'
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicName" className='mt-3'>
                    <Form.Label>Sort Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Facilities Name"
                        defaultValue={facilities.sort_description}
                        name='sort_description'
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDesc" className="mt-3 mb-4">
                    <Form.Label>Long Description</Form.Label>
                    <Form.Control
                        as="textarea" rows={5}
                        placeholder="Enter Long description"
                        defaultValue={facilities.long_description}
                        name='long_description'
                        onChange={handleChange}
                    />
                </Form.Group>


                {/* Choose File Button */}
                <FileSelectButton handleShow={handleShow} files={facilities} removePhoto={removePhoto} />
                {/* End choose file button */}


                <Button variant="primary" className="shadow rounded" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                    Create
                </Button>
            </Form>

        </>)} />
    );
};




const EditForm = ({ onSubmit, facilities_id, pending, validated }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);
    const [arr, setArr] = useState([]);
    const [filesArr, setFilesArr] = useState([]);
    const [facilities, setFacilities] = useState({
        name: "",
        sort_description: "",
        long_description: "",
        upload_ids: [],
        upload_files: [],
        facilities_id: facilities_id
    });


    const handleChange = (e) => {
        setFacilities(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }


    const fetchFacilitiesData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/facilities`, { action: "getFacilitiesInfo", facilities_id: facilities_id })
            .then((res) => {
                if (isSubscribed) {
                    setFacilities(prev => ({
                        ...prev,
                        name: res?.data?.data?.name,
                        sort_description: res.data.data.sort_description,
                        long_description: res.data.data.long_description,
                    }));

                    if (res.data.data?.photos.length > 0) {

                        setFacilities(prev => ({
                            ...prev,
                            upload_ids: res.data?.data?.photos,
                            upload_files: res.data?.data?.uploadsData,
                        }))

                        setArr(res.data.data?.photos);
                        setFilesArr(res.data?.data?.uploadsData)
                    }

                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false)
            });

        return () => isSubscribed = false;

    }, [facilities_id]);



    useEffect(() => {
        fetchFacilitiesData();
    }, [fetchFacilitiesData])


    // start File manager section
    //function set selected files ids
    const setFilesData = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArr.push(data[i]);
        }

        setFacilities(prev => ({
            ...prev, upload_files: filesArr
        }))
    }

    //function set selected files ids
    const setIds = (Ids) => {

        for (let i = 0; i < Ids.length; i++) {
            arr.push(Ids[i]);
        }

        setFacilities(prev => ({
            ...prev, upload_ids: arr
        }))

    };

    const removePhoto = (id) => {
        //Ids array remove
        let filtered = arr.filter(function (item) {
            return item != id;
        });

        setArr(filtered);

        setFacilities(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArr.filter((item) => item.id !== id);
        setFilesArr(newList);

        setFacilities(prev => ({
            ...prev, upload_files: newList
        }))

    }


    let dataset = { ...facilities, action: "updateFacilities" }

    return (

        <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>


            {/* MRI_Uploader Modal Form */}
            <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Uploader</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <MRI_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            {/* End MRI_Uploader Modal Form */}

            <Form>
                <Form.Group controlId="formBasicName" >
                    <Form.Label>Facilities Name<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Facilities Name"
                        defaultValue={facilities.name}
                        name='name'
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicName" >
                    <Form.Label>Sort Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Facilities Name"
                        defaultValue={facilities.sort_description}
                        name='sort_description'
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDesc" className="mt-3">
                    <Form.Label>Long Description</Form.Label>
                    <Form.Control
                        as="textarea" rows={5}
                        placeholder="Enter Long description"
                        defaultValue={facilities.long_description}
                        name='long_description'
                        onChange={handleChange}
                    />
                </Form.Group>


                {/* Choose File Button */}
                <FileSelectButton handleShow={handleShow} files={facilities} removePhoto={removePhoto} />
                {/* End choose file button */}


                <Button variant="primary" className="shadow rounded" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                    Update
                </Button>
            </Form>

        </>)} />
    );





}







//Delete component
const DeleteComponent = ({ onSubmit, facilities_id, pending }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);


    let dataset = { facilities_id, action: "deleteFacilities" }

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

const Facilities = () => {
    const { http } = Axios();
    const router = useRouter();
    const { pathname } = router;
    const { notify } = MyToast();
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [facilitiesList, setFacilitiesList] = useState([]);
    const [facilities_id, setFacilitiesId] = useState(null)
    const [pending, setPending] = useState(false);
    //Form validation
    const [validated, setValidated] = useState(false);



    /** Create */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    //Update Tower Modal form
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [designationId, setDesignationId] = useState(null)

    const handleExit = () => setShowUpdateModal(false);
    const handleOpen = (id) => {
        setShowUpdateModal(true);
        setFacilitiesId(id);

    }


    /**Delete Tower Modal */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setFacilitiesId(id);
    }








    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAllFacilities();
        });
        return () => clearTimeout(timeout);
    }, []);


    const fetchAllFacilities = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/facilities`, {
            action: "getAllFacilities",
        })
            .then((res) => {
                if (isSubscribed) {
                    setFilteredData(res.data?.data);
                    setFacilitiesList(res.data);
                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });

        return () => isSubscribed = false;
    };

    /** create  form start */
    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/facilities`, items)
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

        fetchAllFacilities();

        return () => isSubscribed = false;
    }
    /** create  form end */



    /** Update  form start */

    const updateForm = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/facilities`, formData)
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

        fetchAllFacilities();

        return () => isSubscribed = false;
    }


    /** Delete  form start */
    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/facilities`, formData)
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

        fetchAllFacilities();

        return () => isSubscribed = false;
    }


    /** Delete  form end*/




    const actionButton = (id) => {
        return <>
            <ul className="action ">

                <li>
                    <Link href="#">
                        <a onClick={() => handleOpen(id)}  >
                            <EditIcon />
                        </a>
                    </Link>

                </li>
                <li>
                    <Link href="#">
                        <a onClick={() => handleOpenDelete(id)}  >
                            <DeleteIcon />
                        </a>
                    </Link>

                </li>

            </ul>
        </>
    }


    const columns = [
        {
            name: 'Title',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Sort Description',
            selector: row => row.sort_description,
            sortable: true,

        },
        {
            name: 'Long Description',
            selector: row => row.long_description,
            sortable: true,
            width: "150px",
        },

        {
            name: 'Action',
            selector: row => actionButton(row.id),
            width: "150px",                       // added line here
        },

    ];


        //breadcrumbs
        const breadcrumbs = [
            { text: 'Dashboard', link: '/dashboard' },
            { text: 'All Facilities', link: '/modules/facilities' },
        ]


    return (

        <>
        
        <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="row">
                <div className="col-12  p-xs-2">
                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">All Facilities</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                <Button
                                    className="shadow rounded btn-sm"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Create Facilities
                                </Button>

                                {/* Create Modal Form */}
                                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Create Facilities</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}



                                {/* Update Modal Form */}
                                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update Slider</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} facilities_id={facilities_id} pending={pending} validated={validated}
                                        />
                                    </Modal.Body>
                                </Modal>
                                {/* End Update Modal Form */}



                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} facilities_id={facilities_id} pending={pending} />
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
        </>
    )
}

export default Facilities