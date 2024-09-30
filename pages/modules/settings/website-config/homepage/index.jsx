import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Switch from "react-switch";
import FileSelectButton from '../../../../../components/MRIfileManager/FileSelectButton';
import MRI_Single_Uploader from '../../../../../components/MRIfileManager/MRI_Single_Uploader';
import MRIfileManagerRender from '../../../../../components/RenderMethods/MRIfileManagerRender';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import Select from '../../../../../components/elements/Select';
import Select2 from "../../../../../components/elements/Select2";
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
  const [pageList, setPageList] = useState([]);
  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);
  const [section, setSection] = useState({
    page_id: null,
    title: "",
    sort_description: "",
    long_description: "",
    link: "",
    upload_ids: [],
    upload_files: [],
    status: 1,
  })



  useEffect(() => {
    let isMount = true;
    fetchAllPages();
    return () => {
      isMount = false;
    }
  }, []);


  const fetchAllPages = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, { action: "getAllPagesfrDrpdwn" })
      .then((res) => {
        setPageList(res.data?.data);
      })
      .catch((err) => {
        console.log('Something went wrong !')
      });
  }


  const handleChange = (e) => {

    setSection(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

  }




  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setSection(prev => ({
      ...prev, upload_files: filesArr
    }))
  }


  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setSection(prev => ({
      ...prev, upload_ids: arr
    }))

  };


  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setSection(prev => ({
      ...prev, upload_ids: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setSection(prev => ({
      ...prev, upload_files: newList
    }))

  }



  let dataset = { ...section, action: "createSections" }

  return (
    <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>

      {/* MRI_Uploader Modal Form */}
      <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>File Uploader</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <MRI_Single_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
      {/* End MRI_Uploader Modal Form */}

      <Form validated={validated}>

        {/* <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select page</Form.Label>
          {loading ? (
            <Select>
              <option value="">loading...</option>
            </Select>
          ) : (
            <Select defaultValue="" name="page_id" onChange={handleChange}>
              <option value="" disabled>Select..</option>
              {pageList &&
                pageList?.map((page, ind) => (
                  <Fragment key={ind}>
                    <option value={page.id}>{page.title}</option>
                  </Fragment>
                ))
              }
            </Select>
          )}
        </Form.Group> */}

        <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select page</Form.Label>

          <Select2
            options={pageList && pageList.map(({ id, title }) => ({ value: id, label: title }))}
            onChange={(e) => setSection(prev => ({ ...prev, page_id: e.value }))}

          />

        </Form.Group>



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

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Link"
            name='link'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Sort Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='sort_description'
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Long Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='long_description'
            onChange={handleChange}
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


        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={section} removePhoto={removePhoto} />
        {/* End choose file button */}



        <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right" }} type="button" onClick={() => onSubmit(dataset)} block>
          Create Section
        </Button>
      </Form>

    </>)} />
  );
};



//Update component
const EditForm = ({ onSubmit, section_id, pending, validated }) => {
  console.log("section_id",section_id)

  const { http } = Axios();
  const [pageList, setPageList] = useState([]);
  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState({
    page_id: null,
    title: "",
    sort_description: "",
    long_description: "",
    link: "",
    upload_ids: [],
    upload_files: [],
    status: null,
    section_id: section_id
  })





  useEffect(() => {
    let isMount = true;
    fetchAllPages();
    return () => {
      isMount = false;
    }
  }, []);


  const fetchAllPages = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, { action: "getAllPagesfrDrpdwn" })
      .then((res) => {
        setPageList(res.data?.data);
      })
      .catch((err) => {
        console.log('Something went wrong !')
      });
  }


  

  const [selectedStatus, setSelectedStatus] = useState(section.status);
  const handleChange = (e) => {

    setSection(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

    setSelectedStatus(parseInt(e.target.value, 10));

  }




  const fetchSectionData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, { action: "getSectionInfo", section_id: section_id })
      .then((res) => {
        if (isSubscribed) {
          setSection(prev => ({
            ...prev,
            page_id: res?.data?.data?.page_id,
            title: res.data.data.title,
            sort_description: res.data.data.sort_description,
            long_description: res.data.data.long_description,
            link: res.data.data.link,
            status: res.data.data.status
          }));

          if (res.data.data?.photos.length > 0) {

            setSection(prev => ({
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

  }, [section_id]);


  useEffect(() => {
    fetchSectionData();
  }, [fetchSectionData])





  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setSection(prev => ({
      ...prev, upload_files: filesArr
    }))
  }


  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setSection(prev => ({
      ...prev, upload_ids: arr
    }))

  };


  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setSection(prev => ({
      ...prev, upload_ids: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setSection(prev => ({
      ...prev, upload_files: newList
    }))

  }



  let dataset = { ...section, action: "updateSections" }

  return (
    <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>

      {/* MRI_Uploader Modal Form */}
      <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>File Uploader</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <MRI_Single_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
      {/* End MRI_Uploader Modal Form */}

      <Form validated={validated}>

        <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select page</Form.Label>
          {loading ? (
            <Select>
              <option value="">loading...</option>
            </Select>
          ) : (
            <Select value={section?.page_id} name="page_id" onChange={handleChange}>
              <option value="" disabled>Select..</option>
              {pageList &&
                pageList?.map((page, ind) => (
                  <Fragment key={ind}>
                    <option value={page.id}>{page.title}</option>
                  </Fragment>
                ))
              }
            </Select>
          )}
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select page</Form.Label>

            <Select2
             options={pageList && pageList.map(({ id, title }) => ({ value: id, label: title}))}
             onChange={(e) =>setSection(prev=>({...prev, page_id:e.value}))}
            
            />
       
        </Form.Group> */}



        <Form.Group controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            name='title'
            onChange={handleChange}
            required
            defaultValue={section.title}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Link"
            name='link'
            onChange={handleChange}
            defaultValue={section.link}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Sort Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='sort_description'
            onChange={handleChange}
            defaultValue={section.sort_description}
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Long Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='long_description'
            onChange={handleChange}
            defaultValue={section.long_description}
          />
        </Form.Group>
        <Form.Group controlId="formBasicSelect">
          <Form.Label>Status</Form.Label>
          <Form.Select
            onChange={handleChange}
            name="status"
            value={section?.status}

          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </Form.Select>
        </Form.Group>


        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={section} removePhoto={removePhoto} />
        {/* End choose file button */}



        <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right" }} type="button" onClick={() => onSubmit(dataset)} block>
          Update Section
        </Button>
      </Form>

    </>)} />
  );
};



//Delete component
const DeleteComponent = ({ onSubmit, section_id, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);


  let dataset = { section_id, action: "deleteSection" }

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
  const [section_id, setSectionId] = useState(null)
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
    setSectionId(id);
  }



  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setSectionId(id);
  }




  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAllSections();
    });
    return () => clearTimeout(timeout);
  }, []);

  const data = pageList?.data;

  const fetchAllSections = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, {
      action: "getAllSections",
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

    fetchAllSections();

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

    fetchAllSections();

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

    fetchAllSections();

    return () => isSubscribed = false;
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
      name: 'Page',
      selector: row => row.page_name,
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
      name: 'Access',
      selector: row => SwitchButton(row.id, row.status),
      // width: "150px", 

    },


    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "150px",                       // added line here
    },

  ];










  const SwitchButton = (id, status) => {

    const [selectedStatus, setSelectedStatus] = useState(status);



    let body = { action: "updateSectionStatus", section_id: id, status: selectedStatus }
    const handleChange = () => {
      const newStatus = selectedStatus === 1 ? 0 : 1;
      notify("success", "successfully Updated!");
      setSelectedStatus(newStatus);
    };


    useEffect(() => {

      handleUpdateStatus(body)

    }, [selectedStatus])





    return (
      <>
        <Switch
        height={20} width={40}
          onChange={handleChange}
          checked={selectedStatus === 1}
        />
      </>
    );
  };



  const handleUpdateStatus = async (formData) => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/pages`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully updated!");
        }

      })
      .catch((e) => {
        console.log('error updated !')

      });

    fetchAllSections();
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
                <h4 className="card-title mb-0">All Sections</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Section
                </Button>



                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Section</Modal.Title>
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
                    <EditForm onSubmit={updateForm} section_id={section_id} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}


                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} section_id={section_id} pending={pending} />
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

export default Pages