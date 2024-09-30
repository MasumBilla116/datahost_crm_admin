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
import { getSSRProps } from '../../../../utils/getSSRProps';



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.invtr.mngwrhs" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [warehouse, setWarehouse] = useState({
    name: "",
    location_details: "",
    // num_of_levels:0,
    status: 0,
  })

  const [inputVal, setInputVal] = useState([]);
  const [levelName, setLevelName] = useState([]);

  const handleChange = (e) => {
    e.preventDefault()

    // if(e.target.name == 'num_of_levels'){

    //   setNumOfLevel(e.target.value);
    //   numOfLevel = Number(numOfLevel) + Number(e.target.value)

    //   for(var i = 0; i < Number(e.target.value); i++){
    //       //console.log(i)
    // setInputVal([...inputVal, InputForm()])
    //   }
    // }

    setWarehouse(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

    if (e.target.name == 'level_name') {
      setLevelName([{ id: 1, name: e.target.value }])
    }
  }

  const handleLevelNameChange = (e) => {
    setLevelName([...levelName,
    { id: ind, name: e.target.value }
    ])

  }

  var inputValue = [];
  const [ind, setInd] = useState(2)

  function levelChange() {
    setInd(() => ind + 1)
    // for(var i = 0; i < 5; i++){
    //   //inputValue.push(InputForm())
    //   //  setInputVal([...inputVal, InputForm()])
    // }

    if (ind <= 5) {
      setInputVal([...inputVal,
      {
        id: ind,
        input: InputForm(ind)
      }
      ])
    }
    else {
      notify("error", "Can't add level more than 5!");
    }

  }

  async function removeObjectFromArray(id) {
    setInputVal(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
    setLevelName(currentLevel =>
      currentLevel.filter(objLevel => {
        return objLevel.id !== id;
      }),
    );
  };

  const InputForm = (no) => {
    return (
      <>
        <div className="form-group">
          <label for="memberName">Level {no} Locations Will Be Called As: (Section/Rack/Shelf/Box etc.)</label>
          <div className="row">
            <div className="col-md-10">
              <input type="text" onChange={handleLevelNameChange} className="form-control" />
            </div>
            <div className="col-md-2">
              <Link href='#'>
                <a className="btn btn-danger" onClick={() => removeObjectFromArray(no)}>
                  <DeleteIcon />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  let dataset = { ...warehouse, levelName, action: "createWarehouse" }


  return (

    <Form>
      <Form.Group className="mb-3" controlId="formBasicName" >
        <Form.Label><span className="text-danger">*</span>Warehouse Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Warehouse Name"
          name='name'
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Location Details</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter location details"
          name='location_details'
          onChange={handleChange}
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicName" >
          <Form.Label>Number of levels</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of levels"
            name='num_of_levels'
            id="num_of_levels"
            onChange={handleChange}
          />
        </Form.Group> */}

      <div className="form-group">
        <label for="memberName"><span className="text-danger">*</span>Level 1 Locations Will Be Called As: (Section/Rack/Shelf/Box etc.)</label>
        <div className="row">
          <div className="col-md-12">
            <input type="text" name="level_name" onChange={handleChange} className="form-control" />
          </div>
        </div>
      </div>

      <Button variant="primary" className="shadow rounded mb-3" style={{ marginTop: "5px" }} type="button" onClick={levelChange} block>
        Add More Warehouse Location Level
      </Button>

      <div id="dd_handle">
        {inputVal.map((v, i) => (
          <>
            {v.input}
          </>
        ))}
      </div>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, warehouseId, pending }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [loading, setLoading] = useState(true);

  const [warehouse, setWarehouse] = useState({
    name: "",
    location_details: "",
    status: 0,
    warehouse_id: warehouseId,
  })

  const [inputVal, setInputVal] = useState([]);
  const [levelName, setLevelName] = useState([]);

  const [inputLevel, setInputLevel] = useState([]);

  const handleChange = (e) => {
    e.preventDefault()
    setWarehouse(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  async function handleEditLevel(e, id) {

    const newState = levelName.map(obj => {
      if (obj.id === id) {
        return { ...obj, name: e.target.value };
      }
      return obj;
    });

    setLevelName(newState);
  }

  const handleLevelNameChange = (e) => {
    setLevelName([...levelName,
    { id: ind, name: e.target.value }
    ])

  }

  const [ind, setInd] = useState()

  function addLevelChange() {
    setInd(() => ind + 1)

    if (ind <= 5) {
      setInputVal([...inputVal,
      {
        id: ind,
        input: InputForm(ind)
      }
      ])
    }
    else {
      notify("error", "Can't add level more than 5!");
    }
  }

  async function removeObjectFromArray(id) {
    setInputVal(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
    setLevelName(currentLevel =>
      currentLevel.filter(objLevel => {
        return objLevel.id !== id;
      }),
    );
  };

  const InputForm = (no) => {
    return (
      <>
        <div className="form-group">
          <label for="memberName">Level {no} Locations Will Be Called As: (Section/Rack/Shelf/Box etc.)</label>
          <div className="row">
            <div className="col-md-10">
              <input type="text" onChange={handleLevelNameChange} className="form-control" />
            </div>
            <div className="col-md-2">
              <Link href='#'>
                <a className="btn btn-danger" onClick={() => removeObjectFromArray(no)}>
                  <DeleteIcon />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const fetchwarehouseData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, { action: "getWarehouseInfo", warehouse_id: warehouseId })
      .then((res) => {
        if (isSubscribed) {
          setWarehouse(prev => ({
            ...prev,
            name: res.data.data.name,
            location_details: res.data.data.location_details,
            status: res.data.data.status,
          }));
          setInputLevel(res.data.data.level_list)
          setLevelName(res.data.data.level_list)
          setInd((res.data.data.num_of_levels + 1))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [warehouseId]);

  useEffect(() => {
    fetchwarehouseData();
  }, [fetchwarehouseData])


  let dataset = { ...warehouse, levelName, action: "updateWarehouse" }

  return (

    <Form >
      <Form.Group className="mb-3" controlId="formBasicName" >
        <Form.Label><span className="text-danger">*</span>Warehouse Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Warehouse Name"
          name='name'
          defaultValue={warehouse.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Location Details</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter location details"
          name='location_details'
          defaultValue={warehouse.location_details}
          onChange={handleChange}
        />
      </Form.Group>

      {inputLevel?.map((level, i) => (
        <div key={i} className="form-group">
          <label for="memberName"><span className="text-danger">*</span>Level {level.id} Locations Will Be Called As: (Section/Rack/Shelf/Box etc.)</label>
          <div className="row">
            <div className="col-md-10">
              <input type="text" defaultValue={level.name} name="level_name" onChange={(e) => handleEditLevel(e, level.id)} className="form-control" />
            </div>
          </div>
        </div>
      ))}

      <Button variant="primary" className="shadow rounded mb-3" style={{ marginTop: "5px" }} type="button" onClick={addLevelChange} block>
        Add More Warehouse Location Level
      </Button>

      <div id="dd_handle">
        {inputVal.map((v, i) => (
          <>
            {v.input}
          </>
        ))}
      </div>

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
const DeleteComponent = ({ onSubmit, warehouseId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState({
    warehouse_id: warehouseId
  })

  let dataset = { ...warehouse, action: "deleteWarehouse" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {

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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, items)
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
          if (msg?.levelName) {
            notify("error", `${msg.levelName.LevelName}`);
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
  const [warehouseId, setWarehouseId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (warehouse_id) => {
    setShowUpdateModal(true);
    setWarehouseId(warehouse_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, formData)
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
          if (msg?.levelName) {
            notify("error", `${msg.levelName.LevelName}`);
          }

        }
        setLoading(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (warehouse_id) => {
    setShowDeleteModal(true);
    setWarehouseId(warehouse_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, formData)
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
  const [itemList, setItemList] = useState([]);
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
  const data = itemList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, {
      action: "getAllWarehouse",
    })
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data);
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





  const actionButton = (warehouseId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate &&<li>
          <Link href="#">
            <a onClick={() => handleOpen(warehouseId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete &&<li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(warehouseId)}>
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
      sortable: true,
    },
    {
      name: 'Location Details',
      selector: row => row.location_details,
      sortable: true,
    },
    {
      name: 'Levels',
      selector: row => row.num_of_levels,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      sortable: true,

    },

  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Warehouses', link: '/modules/inventory/warehouses' },
  ]

  return (
    <>
      <HeadSection title="All Warehouses" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2 ">
            <div className="card shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Warehouses</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                 { accessPermissions.createAndUpdate &&<Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Warehouse
                  </Button>}
                  {/* Create Modal Form */}
                  <Modal dialogClassName="" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Warehouse</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Warehouse</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm onSubmit={updateForm} warehouseId={warehouseId} pending={pending}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent onSubmit={handleDelete} warehouseId={warehouseId} pending={pending} />
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
                          placeholder="Search..."
                          className="form-control"
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
          </div>
        </div>
      </div>
    </>
  )
}