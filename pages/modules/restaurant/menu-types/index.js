import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { HeadSection } from '../../../../components';
import FileSelectButton from '../../../../components/MRIfileManager/FileSelectButton';
import MRI_Uploader from '../../../../components/MRIfileManager/MRI_Uploader';
import MRIfileManagerRender from '../../../../components/RenderMethods/MRIfileManagerRender';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Axios from '../../../../utils/axios';

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [menuType, setMenuType] = useState({
    name: "",
    description: "",
    logo: [],
    upload_files: [],
    banner: []
  })

  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);

  const handleChange = (e) => {
    setMenuType(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setMenuType(prev => ({
      ...prev, upload_files: filesArr
    }))
  }

  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setMenuType(prev => ({
      ...prev, logo: arr
    }))

  };

  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setMenuType(prev => ({
      ...prev, logo: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setMenuType(prev => ({
      ...prev, upload_files: newList
    }))

  }
  // End File manager section

  let dataset = { ...menuType, action: "createMenuType" }

  return (

    //wrap this MRIfileManagerRender component where you want to integrate file-manager. Make sure exist setIds function.
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

      <Form validated={validated}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Menu Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Menu Name"
            name='name'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='description'
            onChange={handleChange}
          />
        </Form.Group>

        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={menuType} removePhoto={removePhoto} />
        {/* End choose file button */}

        <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
          Create
        </Button>
      </Form>
    </>)} />
  );
};


//Update component
const EditForm = ({ onSubmit, menutypeId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [menuType, setMenuType] = useState({
    name: "",
    description: "",
    logo: [],
    upload_files: [],
    banner: [],
    menutype_id: menutypeId
  })

  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);

  const handleChange = (e) => {
    setMenuType(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setMenuType(prev => ({
      ...prev, upload_files: filesArr
    }))
  }

  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setMenuType(prev => ({
      ...prev, logo: arr
    }))

  };

  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setMenuType(prev => ({
      ...prev, logo: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setMenuType(prev => ({
      ...prev, upload_files: newList
    }))

  }
  // End File manager section

  const fetchMenutypeData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, { action: "getMenutypeInfo", menutype_id: menutypeId })
      .then((res) => {
        if (isSubscribed) {
          setMenuType(prev => ({
            ...prev,
            name: res.data.data.name,
            description: res.data.data.description,
          }));
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [menutypeId]);

  useEffect(() => {
    fetchMenutypeData();
  }, [fetchMenutypeData])


  let dataset = { ...menuType, action: "editMenutype" }

  return (

    //wrap this MRIfileManagerRender component where you want to integrate file-manager. Make sure exist setIds function.
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
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Menu-type Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Category Name"
            name='name'
            defaultValue={menuType.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='description'
            defaultValue={menuType.description}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={menuType} removePhoto={removePhoto} />
        {/* End choose file button */}


        <Button variant="primary" className="shadow rounded"
          disabled={pending || loading} style={{ marginTop: "5px" }}
          onClick={() => onSubmit(dataset)}
        >
          {pending ? 'updating...' : 'update'}
        </Button>
      </Form>
    </>)} />
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, menutypeId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [menuType, setMenuType] = useState({
    menutype_id: menutypeId
  })

  let dataset = { ...menuType, action: "deleteMenutype" }

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

export default function FoodMenuType({accessPermissions}) {

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
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
      });

    fetchItemList();

    return () => isSubscribed = false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [menutypeId, setMenutypeId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (menutype_id) => {
    setShowUpdateModal(true);
    setMenutypeId(menutype_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);

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
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (menutype_id) => {
    setShowDeleteModal(true);
    setMenutypeId(menutype_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, formData)
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

  //Tower Floor Rooms data list
  const [menutypeList, setMenutypeList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = menutypeList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, {
      action: "getAllMenutypes",
    })
      .then((res) => {
        if (isSubscribed) {
          setMenutypeList(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])





  const actionButton = (menutypeId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate &&  <li>
          <Link href="#">
            <a onClick={() => handleOpen(menutypeId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete &&  <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(menutypeId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }


  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      // sortable: true,
      width: "100px",
    },
    {
      name: 'Description',
      selector: row =>  row.description !== "" ? row.description : "---" ,
      // sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      // width: "100px",                       // added line here

    },

  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Menu-Types', link: '/modules/restaurant/menu-types' },

  ];

  return (

    <>

      <HeadSection title="Menu-Types" />

      <div className="card shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Menu-Types</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                 {accessPermissions.createAndUpdate && <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Menu-Type
                  </Button>}



                  {/* Create Modal Form */}
                  <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Menu Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Menu Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm onSubmit={updateForm} menutypeId={menutypeId} pending={pending}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent onSubmit={handleDelete} menutypeId={menutypeId} pending={pending} />
                  </Modal>

                </div>
              </div>


              <div className="card-body">
                <div className="custom-data-table">

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
                        className="w-50 form-control"
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
    </>
  )
}