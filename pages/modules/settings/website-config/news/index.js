
import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import FileSelectButton from '../../../../../components/MRIfileManager/FileSelectButton';
import MRI_Single_Uploader from '../../../../../components/MRIfileManager/MRI_Single_Uploader';
import MRIfileManagerRender from '../../../../../components/RenderMethods/MRIfileManagerRender';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import Select from '../../../../../components/elements/Select';
import Axios from '../../../../../utils/axios';

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {
    
    const {http} = Axios();
    const [sliderList, setSliderList] = useState([]);
    const [arr, setArr]=useState([]);
    const [filesArr, setFilesArr]=useState([]);
    
    const [news, setNews] = useState({
        short_description: '',
        title: "",
        long_description:"",
        status: '',
        upload_ids:[],
        upload_files:[],
    })
    
    useEffect(()=>{
        const controller = new AbortController();
        const fetchAllNews = async () =>{
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, { action: "getAllSliders" })
                .then((res) => {
                    setSliderList(res.data?.data);
                })
                .catch((err) => {
                    console.log('Something went wrong !')
                });
        }
        fetchAllNews();
    },[])
    
    const handleChange = (e) => {
        
        setNews(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
        
    }
    
    // start File manager section
    //function set selected files ids
    const setFilesData=(data)=>{
        for (let i = 0; i < data.length; i++) {
            filesArr.push(data[i]);
        }
        
        setNews(prev=>({
            ...prev, upload_files:filesArr
        }))
    }
    
    
    //function set selected files ids
    const setIds=(Ids)=>{
        
        for (let i = 0; i < Ids.length; i++) {
            arr.push(Ids[i]);
        }
        
        setNews(prev=>({
            ...prev, upload_ids:arr
        }))
        
    };
    
    
    const removePhoto = (id) => {
        //Ids array remove
        let filtered = arr.filter(function(item){
            return item != id;
        });
        
        setArr(filtered);
        
        setNews(prev=>({
            ...prev, upload_ids:filtered
        }))
        
        //remove files array of objects
        const newList = filesArr.filter((item) => item.id !== id);
        setFilesArr(newList);
        
        setNews(prev=>({
            ...prev, upload_files:newList
        }))
        
    }
    
    
    
    let dataset = { ...news, action: "createNews" }
    
    return (
        
        <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData}   render={(show,handleClose,uploadIds,selecteLoading,handleShow,files)=>(<>
            
            {/* MRI_Uploader Modal Form */}
            <Modal  dialogClassName="modal-xlg"   show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Uploader</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <MRI_Single_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading}/>
                
                </Modal.Body>
                <Modal.Footer>
                
                </Modal.Footer>
            </Modal>
            {/* End MRI_Uploader Modal Form */}
            
            <Form validated={validated}>
                
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        name='title'
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDesc" className="mt-3">
                    <Form.Label>Short Description</Form.Label>
                    
                    <Form.Control as="textarea" rows={5}
                                  placeholder="Enter Short Description"
                                  name='short_description'
                                  onChange={handleChange}
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDesc" className="mt-3">
                    <Form.Label>Long Description</Form.Label>
                    
                    <Form.Control as="textarea" rows={5}
                                  placeholder="Enter Long Description"
                                  name='long_description'
                                  onChange={handleChange}
                    />
                </Form.Group>
                
                <Form.Group controlId="formStatus" className="mt-3">
                    <Form.Label>Status</Form.Label>
                    <Select defaultValue=""  name="status" onChange={handleChange}>
                        <option value="" disabled>Select Status</option>
                        <Fragment>
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                        </Fragment>
                    </Select>
                </Form.Group>
                
                
                {/* Choose File Button */}
                <FileSelectButton handleShow={handleShow} files={news} removePhoto={removePhoto}/>
                {/* End choose file button */}
                
                
                
                <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right"}} type="button" onClick={()=>onSubmit(dataset)} block>
                    Create News
                </Button>
            </Form>
        
        </>)} />
    );
};


//Update component
const EditForm = ({ onSubmit, news_id, pending, validated }) => {
    
    const { http } = Axios();
    
    const [loading, setLoading] = useState(true);
    const [arr, setArr]=useState([]);
    const [filesArr, setFilesArr]=useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [news, setNews] = useState({
        title: "",
        short_description:"",
        long_description:"",
        status:"",
        upload_ids:[],
        upload_files:[],
        news_id:news_id
    });
    
    useEffect(()=>{
        const controller = new AbortController();
        const fetchAllNews = async () =>{
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/slide`, { action: "getAllSliders" })
                .then((res) => {
                    setSliderList(res.data?.data);
                })
                .catch((err) => {
                    console.log('Something went wrong !')
                });
        }
        fetchAllNews();
    },[])
    
    const handleChange = (e) => {
        
        setNews(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
        
    }
    
    const fetchSliderData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/news`, { action: "getNewsInfo", news_id:news_id })
            .then((res) => {
                console.log("news res: ",res.data.data)
                // if (res?.data?.status == "success") {
                    setNews(prev => ({
                        ...prev,
                        news_id: res?.data?.data?.id,
                        title: res?.data?.data?.title,
                        long_description: res?.data?.data?.long_description,
                        short_description: res?.data?.data?.short_description,
                        status: res?.data?.data?.status
                    }));
                    if(res.data.data?.photos.length > 0){
                        
                        setNews(prev=>({
                            ...prev,
                            upload_ids: res.data?.data?.photos,
                            upload_files: res.data?.data?.uploadsData,
                        }))
                        
                        setArr(res.data.data?.photos);
                        setFilesArr(res.data?.data?.uploadsData)
                    }
                    
                    setLoading(false)
                // }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false)
            });
        
        return () => isSubscribed = false;
        
    }, [news_id]);
    
    
    console.log("news : ",news)
    useEffect(() => {
        fetchSliderData();
    }, [news_id])
    
    
    
    // start File manager section
    //function set selected files ids
    const setFilesData=(data)=>{
        for (let i = 0; i < data.length; i++) {
            filesArr.push(data[i]);
        }
        
        setNews(prev=>({
            ...prev, upload_files:filesArr
        }))
    }
    
    //function set selected files ids
    const setIds=(Ids)=>{
        
        for (let i = 0; i < Ids.length; i++) {
            arr.push(Ids[i]);
        }
        
        setNews(prev=>({
            ...prev, upload_ids:arr
        }))
        
    };
    
    const removePhoto = (id) => {
        //Ids array remove
        let filtered = arr.filter(function(item){
            return item != id;
        });
        
        setArr(filtered);
        
        setNews(prev=>({
            ...prev, upload_ids:filtered
        }))
        
        //remove files array of objects
        const newList = filesArr.filter((item) => item.id !== id);
        setFilesArr(newList);
        
        setNews(prev=>({
            ...prev, upload_files:newList
        }))
        
    }
    
    
    let dataset = { ...news,action: "updateNews" }
    
    return (
        
        //wrap this MRIfileManagerRender component where you want to integrate file-manager. Make sure exist setIds function.
        <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData}   render={(show,handleClose,uploadIds,selecteLoading,handleShow,files)=>(<>
            
            {/* MRI_Uploader Modal Form */}
            <Modal  dialogClassName="modal-xlg"   show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Uploader</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <MRI_Single_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading}/>
                
                </Modal.Body>
                <Modal.Footer>
                
                </Modal.Footer>
            </Modal>
            {/* End MRI_Uploader Modal Form */}
            
            <Form validated={validated}>
                
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        name='title'
                        onChange={handleChange}
                        defaultValue={news.title}
                        required
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDesc" className="mt-3">
                    <Form.Label>Short Description</Form.Label>
                    
                    <Form.Control as="textarea" rows={5}
                                  placeholder="Enter Description"
                                  name='description'
                                  onChange={handleChange}
                                  defaultValue={news.short_description}
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDesc" className="mt-3">
                    <Form.Label>long_Description</Form.Label>
                    
                    <Form.Control as="textarea" rows={5}
                                  placeholder="Enter Description"
                                  name='description'
                                  onChange={handleChange}
                                  defaultValue={news.long_description}
                    />
                </Form.Group>
                
                
                <Form.Group className="mb-3" controlId="formBasicDesc" >
                    <Form.Label>Select Status</Form.Label>
                    <Select value={news.status} name="status" onChange={handleChange}>
                        <Fragment >
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                        </Fragment>
                    </Select>
                </Form.Group>
                
                
                {/* Choose File Button */}
                <FileSelectButton handleShow={handleShow} files={news} removePhoto={removePhoto}/>
                {/* End choose file button */}
                
                
                <Button variant="primary" className="shadow rounded"
                        disabled={pending || loading} style={{ marginTop: "5px" }}
                        onClick={()=>onSubmit(dataset)}
                >
                    {pending?'Updating...':'Update'}
                </Button>
            </Form>
        </>)} />
    );
};


//Delete component
const DeleteComponent = ({ onSubmit, news_id, pending }) => {
    
    const { http } = Axios();
    
    const [loading, setLoading] = useState(true);
    
    
    let dataset = { news_id, action: "deleteNews" }
    
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




const News = () => {
    
    const { http } = Axios();
    const { notify } = MyToast();
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [news_id, setNewsId] = useState(null)
    
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
        setNewsId(id);
        
    }
    
    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
    const handleOpenDelete = (id) => {
        setShowDeleteModal(true);
        setNewsId(id);
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/news`, {
                action: "getAllNews",
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/news`, items)
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
        
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/news`, formData)
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
                console.log("error msg: ",e)
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
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/news`, formData)
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
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            width: "250px"
        },
        {
            name: 'Short Description',
            selector: row => row.short_description,
            sortable: true,
            width: "450px"
        },
        {
            name: 'Long Description',
            selector: row => row.long_description,
            sortable: true,
            width: "610px"
        },
        
        {
            name: 'Status',
            selector: row => (row.status === 1 ? 'Active' :"Deactive"),
            sortable: true,
            width: "80px"
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
                <div className="col-12  p-xs-2">
                    <div className="card shadow">
                        
                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h4 className="card-title mb-0">All News</h4>
                            </div>
                            <div className="ms-auto flex-shrink-0">
                                <Button
                                    className="shadow rounded"
                                    variant="primary"
                                    type="button"
                                    onClick={handleShow}
                                    block
                                >
                                    Add News
                                </Button>
                                
                                
                                
                                {/* Create Modal Form */}
                                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Create News</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                                    </Modal.Body>
                                </Modal>
                                {/* End Create Modal Form */}
                                
                                
                                
                                
                                
                                
                                {/* Update Modal Form */}
                                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update News</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <EditForm onSubmit={updateForm} news_id={news_id} pending={pending} validated={validated}
                                        />
                                    </Modal.Body>
                                </Modal>
                                {/* End Update Modal Form */}
                                
                                
                                
                                
                                
                                
                                {/* Delete Modal Form */}
                                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <DeleteComponent onSubmit={handleDelete} news_id={news_id} pending={pending} />
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

export default News