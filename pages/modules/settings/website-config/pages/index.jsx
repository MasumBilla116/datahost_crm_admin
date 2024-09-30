import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import Axios from '../../../../../utils/axios';




//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {



    const [page, setPage] = useState({
        title: "",
        description: "",
        status: 1,


    })

    const handleChange = (e) => {

        setPage(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))

    }



    let dataset = { ...page, action: "createPage" }

    return (

        <Form validated={validated}>

            <Form.Group controlId="formBasicEmail">
                <Form.Label> Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    name='title'
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    name='description'
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBasicSelect">
                <Form.Label>Status</Form.Label>
                <Form.Select
                    onChange={handleChange}
                    name="status"
                    defaultValue={1}
                >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                </Form.Select>
            </Form.Group>



            <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
                Create
            </Button>
        </Form>
    );
};






//Update component
const EditForm = ({ onSubmit, page_id, pending, validated }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState({
        title: "",
        description: "",
        status: null,
        page_id: page_id
    })
    console.log("page_id", page);

    const handleChange = (e) => {

        setPage(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))

    }

    const fetchPageData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, { action: "getPageInfo", page_id })
            .then((res) => {
                if (isSubscribed) {
                    setPage(prev => ({
                        ...prev,
                        title: res.data.data.title,
                        description: res.data.data.description,
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

    }, [page_id]);



    useEffect(() => {
        fetchPageData();
    }, [fetchPageData])


    let dataset = { ...page, action: "updatePage" }

    return (

        <Form >

            <Form.Group controlId="formBasicEmail">
                <Form.Label>page Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    name='title'
                    defaultValue={page.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>page description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter description"
                    name='description'
                    defaultValue={page.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicSelect">
                <Form.Label>Status</Form.Label>
                <Form.Select
                    onChange={handleChange}
                    name="status"
                    defaultValue={page.status}
                >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                </Form.Select>
            </Form.Group>




            <Button variant="primary" className="shadow rounded"
                disabled={pending || loading} style={{ marginTop: "5px" }}
                onClick={() => onSubmit(dataset)}
            >
                {pending ? 'updating...' : 'update'}
            </Button>
        </Form>
    );
};



//Delete component
const DeleteComponent = ({ onSubmit, page_id, pending }) => {

    const { http } = Axios();

    const [loading, setLoading] = useState(true);


    let dataset = { page_id, action: "deletePage" }

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







const Pages = () => {
    const [filteredData, setFilteredData] = useState([]);
    const { http } = Axios();
    const { notify } = MyToast();
    const [search, setSearch] = useState("");
    const [pending, setPending] = useState(false);
    const [pageList, setPagerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page_id, setPageId] = useState(null)
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
        setPageId(id);
    }



    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setPageId(id);
    }




    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAllPages();
        });
        return () => clearTimeout(timeout);
    }, []);

    const data = pageList?.data;

    const fetchAllPages = async () => {

        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, {
            action: "getAllPages",
        })
            .then((res) => {
                if (isSubscribed) {
                    setFilteredData(res.data?.data);
                    setPagerList(res.data);
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, items)
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

        fetchAllPages();

        return () => isSubscribed = false;
    }



    //Update floor form
    const updateForm = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, formData)
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

        fetchAllPages();

        return () => isSubscribed = false;
    }




    //Delete  form
    const handleDelete = async (formData) => {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, formData)
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

        fetchAllPages();

        return () => isSubscribed = false;
    }












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


    const columns = [
        {
            name: "SL",
            selector: (row, index) => index + 1,
            sortable: true,
            width: "75px",
        },

        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
              <p style={{ color: row.status ? 'green' : 'red' }}>
                {row.status ? 'ACTIVE' : 'INACTIVE'}
              </p>
            ),
            sortable: true,
          },


        {
            name: 'Action',
            selector: row => actionButton(row.id),
            width: "150px",                       // added line here
        },

    ];



    //----------------- search operation-----------------

    useEffect(() => {
        let controller = new AbortController();
        const result = data?.filter((page) => {
            return page.title
                .toLowerCase()
                .match(search.toLocaleLowerCase());
        });

        setFilteredData(result);
        return () => controller.abort();
    }, [search]);



    //-----------------End search operation-----------------




    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12  p-xs-2">
                    <div className="card shadow">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">All Pages</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                <Button
                                    className="shadow rounded"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Add Page
                                </Button>



                                {/* Create Modal Form */}
                                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Create page</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}






                                {/* Update Modal Form */}
                                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update page</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} page_id={page_id} pending={pending} validated={validated}
                                        />
                                    </Modal.Body>
                                </Modal>
                                {/* End Update Modal Form */}






                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} page_id={page_id} pending={pending} />
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

export default Pages