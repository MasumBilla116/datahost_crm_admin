import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { HeadSection } from '../../../../components';
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

  const [category, setCategory] = useState({
    name: "",
    description: "",
  })

  const handleChange = (e) => {
    setCategory(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  let dataset = { ...category, action: "createCategory" }

  return (

    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name<span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
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

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, categoryId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    category_id: categoryId
  })

  const handleChange = (e) => {
    setCategory(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const fetchCategoryData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, { action: "getCategoryInfo", category_id: categoryId })
      .then((res) => {
        if (isSubscribed) {
          setCategory(prev => ({
            ...prev,
            name: res.data.data.name,
          }));
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [categoryId]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData])


  let dataset = { ...category, action: "editCategory" }

  return (

    <Form >

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name<span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
          name='name'
          defaultValue={category.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          defaultValue={category.description}
          onChange={handleChange}
        />
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
const DeleteComponent = ({ onSubmit, categoryId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({
    category_id: categoryId
  })

  let dataset = { ...category, action: "deleteCategory" }

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

export default function FoodCategories({ accessPermissions }) {

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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, items)
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
  const [categoryId, setCategoryId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (category_id) => {
    setShowUpdateModal(true);
    setCategoryId(category_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, formData)
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
  const handleOpenDelete = (item_id) => {
    setShowDeleteModal(true);
    setCategoryId(item_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, formData)
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
  const [categoryList, setCategoryList] = useState([]);
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
  const data = categoryList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, {
      action: "getAllCategories",
    })
      .then((res) => {
        if (isSubscribed) {
          setCategoryList(res?.data);
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





  const actionButton = (categoryId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(categoryId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(categoryId)}>
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
      selector: row => row.name ?? "---",
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description !== "" ? row.description : "---",
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "120px",

    },

  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Categories', link: '/modules/restaurant/categories' },

  ];


  return (

    <>
      <HeadSection title="All Categories" />
      <div className="card shadow">

        <div className="d-flex border-bottom title-part-padding align-items-center">
          <div>
            <h4 className="card-title mb-0">All Categories</h4>
          </div>
          <div className="ms-auto flex-shrink-0">
            {accessPermissions.createAndUpdate && <Button
              className="shadow rounded btn-sm"
              variant="primary"
              type="button"
              onClick={handleShow}
              block
            >
              Create Category
            </Button>}



            {/* Create Modal Form */}
            <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CreateForm onSubmit={submitForm} loading={loading} />
              </Modal.Body>
            </Modal>
            {/* End Create Modal Form */}

            {/* Update Modal Form */}
            <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
              <Modal.Header closeButton>
                <Modal.Title>Update Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditForm onSubmit={updateForm} categoryId={categoryId} pending={pending}
                />
              </Modal.Body>
            </Modal>
            {/* End Update Modal Form */}
            {/* Delete Modal Form */}
            <Modal show={showDeleteModal} onHide={handleExitDelete}>
              <Modal.Header closeButton></Modal.Header>
              <DeleteComponent onSubmit={handleDelete} categoryId={categoryId} pending={pending} />
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