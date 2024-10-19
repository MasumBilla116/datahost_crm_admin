import Link from 'next/link';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select from '../../../../components/elements/Select';
import Select2 from "../../../../components/elements/Select2";
import ItemSubCat from '../../../../components/inventory_category/ItemSubCat';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import ViewIcon from '../../../../components/elements/ViewIcon';
import MyToast from "@mdrakibul8001/toastify"
import { HeadSection } from '../../../../components';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useRouter } from 'next/router';

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [setmenu, setSetmenu] = useState({
    name: "",
    price: null,
    description: "",
  })

  const [foodList, setFoodList] = useState("");
  const foods_options = foodList?.data;

  const [foods, setFoods] = useState("");

  var handleFood = (e) => {
    setFoods(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  const handleChange = (e) => {
    setSetmenu(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    const controller = new AbortController();
    async function getAllFoods() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, { action: "getAllFood", })
        .then((res) => {
          setFoodList(res?.data);
        });
    }
    getAllFoods()
    return () => controller.abort();

  }, [])

  let dataset = { ...setmenu, foods, action: "createSetmenu" }

  return (

    <Form validated={validated}>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Set Menu name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Set Menu Name"
          name='name'
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Select Foods</Form.Label>
        <Select2
          options={foods_options?.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={handleFood}
          isMulti
          className="basic-multi-select"
          classNamePrefix="select"
          closeMenuOnSelect={false}
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Unit Price"
          name='price'
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
const EditForm = ({ onSubmit, setmenuId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);

  const [setmenu, setSetmenu] = useState({
    name: "",
    price: null,
    description: "",
    setmenu_id: setmenuId
  })

  const [foodList, setFoodList] = useState("");
  const foods_options = foodList?.data;

  const [foodObj, setFoodObj] = useState({});
  const [foods, setFoods] = useState("");

  var handleFood = (e) => {
    setFoods(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  const handleChange = (e) => {
    setSetmenu(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const fetchSetmenuData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, { action: "getSetmenuInfo", setmenu_id: setmenuId })
      .then((res) => {
        if (isSubscribed) {
          setSetmenu(prev => ({
            ...prev,
            name: res.data.data.name,
            price: res.data.data.price,
            description: res.data.data.description,
          }));
          setFoodObj(res.data.data)
          setFoods(res.data.data?.restaurant_foods?.map(food => food.id))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [setmenuId]);

  useEffect(() => {
    const controller = new AbortController();
    async function getAllFoods() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, { action: "getAllFood", })
        .then((res) => {
          setFoodList(res?.data);
        });
    }
    getAllFoods()
    return () => controller.abort();

  }, [])

  useEffect(() => {
    fetchSetmenuData();
  }, [fetchSetmenuData])


  let dataset = { ...setmenu, foods, action: "editSetmenu" }

  return (

    <Form >

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Set Menu Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Set Menu name"
          name='name'
          defaultValue={setmenu.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Room Facilities</Form.Label>
        {
          !loading &&
          <Select2
            isMulti
            options={foods_options?.map(({ id, name }) => ({ value: id, label: name }))}
            defaultValue={foodObj?.restaurant_foods?.map(({ id, name }) => ({ value: id, label: name }))}
            onChange={handleFood}
            closeMenuOnSelect={false}
          />
        }
        {
          loading &&
          <Select2
            isMulti
            options={foods_options?.map(({ id, name }) => ({ value: id, label: name }))}
            onChange={handleFood}

          />
        }
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Unit Price"
          name='price'
          onChange={handleChange}
          defaultValue={setmenu.price}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          defaultValue={setmenu.description}
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
const DeleteComponent = ({ onSubmit, setmenuId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [setmenu, setSetmenu] = useState({
    setmenu_id: setmenuId
  })

  let dataset = { ...setmenu, action: "deleteSetmenu" }

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

export default function ListView() {

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  // const notify = React.useCallback((type, message) => {
  //     toast({ type, message });
  //   }, []);

  const { notify } = MyToast();


  //Create From
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, items)
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
          if (msg?.price) {
            notify("error", `${msg.price.Price}`);
          }
          if (msg?.foods) {
            notify("error", `please select atleast one food!`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [setmenuId, setSetmenuId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (setmenu_id) => {
    setShowUpdateModal(true);
    setSetmenuId(setmenu_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, formData)
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
          if (msg?.price) {
            notify("error", `${msg.price.Price}`);
          }
          if (msg?.foods) {
            notify("error", `please select atleast one food!`);
          }
        }
        setPending(false);
        setValidated(true);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (setmenu_id) => {
    setShowDeleteModal(true);
    setSetmenuId(setmenu_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, formData)
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
  const [setmenuList, setSetmenuList] = useState([]);
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
  const data = setmenuList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/setmenus`, {
      action: "getAllSetmenus",
    })
      .then((res) => {
        if (isSubscribed) {
          setSetmenuList(res?.data);
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





  const actionButton = (setmenuId) => {
    return <>
      <ul className="action ">

        <li>
          <Link href="#">
            <a onClick={() => handleOpen(setmenuId)}>
              <EditIcon />
            </a>
          </Link>

        </li>
        <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(setmenuId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>

      </ul>
    </>
  }


  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Foods',
      selector: row => row.restaurant_foods.map((food) => (<><span className="badge font-weight-medium bg-light-primary text-primary">{food.name}</span>&nbsp;</>)),
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "100px",                       // added line here

    },

  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'SetMenus', link: '/modules/restaurant/setmenus' },

  ];

  return (

    <>
   <HeadSection title="All SetMenus" />  
    <div className="container-fluid">
    <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} />
      <div className="row">
        <div className="col-12">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All SetMenus</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Button
                  className="shadow rounded"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Set Menu
                </Button>



                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Set Menu</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Promo Offer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} setmenuId={setmenuId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} setmenuId={setmenuId} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="">

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
    </div>
    
    </>
  )
}