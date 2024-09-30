import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select2 from "../../../../components/elements/Select2";
import ViewIcon from '../../../../components/elements/ViewIcon';
import Axios from '../../../../utils/axios';

import { getSSRProps } from "./../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.dgntn",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};


//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [designation, setDesignation] = useState({
    name: "",
    department_id: null,
    description: "",
  })

  const [departmentList, setDepartmentList] = useState("");
  const departments_options = departmentList?.data;

  const handleChange = (e) => {
    if (e.name == 'department_id') {
      setDesignation(prev => ({
        ...prev, department_id: e.value
      }))
    }
    else {
      setDesignation(prev => ({
        ...prev, [e.target.name]: e.target.value
      }))
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    async function getAllDepartments() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
        .then((res) => {
          setDepartmentList(res?.data);
        });
    }
    getAllDepartments()
    return () => controller.abort();

  }, [])

  let dataset = { ...designation, action: "createDesignation" }

  return (

    <Form validated={validated}>

      <div className="row">
        <div >
          <Form.Group controlId="formBasicEmail" >
            <Form.Label style={{margin:'0px'}}>Designation Title</Form.Label><span className="text-danger">*</span>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              name='name'
              onChange={handleChange}
              required
            />
          </Form.Group>

        </div>

        <div >
          <Form.Group controlId="formBasicEmail" className='mt-3'>
            <Form.Label style={{margin:'0px'}}>Select Department</Form.Label><span className="text-danger">*</span>
            <Select2
              options={departments_options?.map(({ id, name }) => ({ value: id, label: name, name: "department_id" }))}
              onChange={handleChange}
              className="basic-multi-select"
              classNamePrefix="select"
              required
            />
          </Form.Group>

        </div>
      </div>




      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label style={{margin:'0px'}}>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          onChange={handleChange}
        />
      </Form.Group>



      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "20px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, designationId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);

  const [designation, setDesignation] = useState({
    name: "",
    department_id: null,
    department_name: "",
    description: "",
    designation_id: designationId
  })

  const [departmentList, setDepartmentList] = useState("");
  const departments_options = departmentList?.data;

  const handleChange = (e) => {
    if (e.name == 'department_id') {
      setDesignation(prev => ({
        ...prev, department_id: e.value
      }))
    }
    else {
      setDesignation(prev => ({
        ...prev, [e.target.name]: e.target.value
      }))
    }
  }

  const fetchDesignationData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, { action: "getDesignationInfo", designation_id: designationId })
      .then((res) => {
        if (isSubscribed) {
          setDesignation(prev => ({
            ...prev,
            name: res?.data?.data?.name,
            department_id: res?.data?.data?.department_id,
            department_name: res?.data?.data?.department?.name,
            description: res?.data?.data?.description,
          }));
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [designationId]);

  useEffect(() => {
    const controller = new AbortController();
    async function getAllDepartments() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
        .then((res) => {
          setDepartmentList(res?.data);
        });
    }
    getAllDepartments()
    return () => controller.abort();

  }, [])

  useEffect(() => {
    fetchDesignationData();
  }, [fetchDesignationData])


  let dataset = { ...designation, action: "editDesignations" }

  return (

    <Form >

      <Form.Group controlId="formBasicEmail">
        <Form.Label style={{margin:'0px'}} >Designation Title <span className="text-danger">*</span> </ Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          name='name'
          defaultValue={designation.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicName" className="mb-4 mt-4">
        <Form.Label style={{margin:'0px'}} >Select Department <span className="text-danger">*</span></Form.Label>
        {
          !loading &&
          <Select2
            options={departments_options?.map(({ id, name }) => ({ value: id, label: name, name: 'department_id' }))}
            defaultValue={{ value: designation.department_id, label: designation.department_name }}
            onChange={handleChange}
          />
        }
        {
          loading &&
          <Select2
            isMulti
            options={departments_options?.map(({ id, name }) => ({ value: id, label: name }))}
            onChange={handleChange}

          />
        }
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-4">
        <Form.Label style={{margin:'0px'}}>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          defaultValue={designation.description}
          onChange={handleChange}
        />
      </Form.Group>


      <Button variant="primary" className="shadow rounded"
        disabled={pending || loading} style={{ marginTop: "20px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? 'updating...' : 'update'}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, designationId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [designation, setDesignation] = useState({
    designation_id: designationId
  })

  let dataset = { ...designation, action: "deleteDesignation" }

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

export default function ListView({accessPermissions}) {

  const { http } = Axios();

  // const notify = React.useCallback((type, message) => {
  //     toast({ type, message });
  //   }, []);

  const { notify } = MyToast();
  const router = useRouter();
  const { pathname } = router;


  //Create Tower
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setFilterValue(prev=>({...prev,filter:true}))
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
          if (msg?.department_id) {
            notify("error", `Please select a department!`);
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
  const [designationId, setDesignationId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (designation_id) => {
    setShowUpdateModal(true);
    setDesignationId(designation_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setFilterValue(prev=>({...prev,filter:true}))
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
          if (msg?.department_id) {
            notify("error", `Please select a department!`);
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
  const handleOpenDelete = (designation_id) => {
    setShowDeleteModal(true);
    setDesignationId(designation_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setFilterValue(prev=>({...prev,filter:true}))
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
  const [designationList, setDesignationList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);



  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [currentPage, setCurrentPage] = useState(1)
  const [perPageShow, setPerPageShow] = useState(15)
  const [tblLoader, setTblLoader] = useState(true);
  const [filterValue, setFilterValue] = useState({
    status: "all",
    yearMonth: `${y}-${m}`,
    search: null,
    filter: false,
    paginate: true,
  });


  // for data table chagne
  const handleChangeFilter = (e) => {
    setFilterValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true
    }));
    setSearch("");
  };



  /**** Table  */


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);


  //Fetch List Data for datatable
  const data = designationList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations?page=${currentPage}&perPageShow=${perPageShow}`, {
        action: "getDesignationsList",
        filterValue: filterValue
      })
        .then((res) => {
          if (isSubscribed) {
            setDesignationList(res?.data);
            setFilteredData(res.data?.data);
          }
        })
        .catch((err) => {
          console.log("Server Error ~!")
        });
      setFilterValue(prev => ({
        ...prev,
        filter: false,
        search: null
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => isSubscribed = false;
  };







  const actionButton = (designationId) => {
    return <>
      <ul className="action ">
       {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/hrm/designation/details/${designationId}`} >
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(designationId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
      { accessPermissions.delete &&   <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(designationId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }


  const columns = [
    {
      name: 'Designation Name',
      selector: row => <span className='text-capitalize'>{row.name}</span>,
      sortable: true,
    },

    {
      name: 'Department Name',
      selector: row => <span className='text-capitalize'>{row.department?.name}</span>,
      sortable: true,
    },   
    
    {
      name: 'Status',
      selector: row => row.status === 0 ? "Inactive" : "Active",
      sortable: true,
      cell: row => (
        <div style={{ color: row.status === 0 ? 'red' : 'green' }}>
          {row.status === 0 ? "Inactive" : "Active"}
        </div>
      ),
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
    { text: 'All Designations', link: '/modules/hr/designation' }
  ];


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Designations" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card mb-xs-1 shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Designations</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
               {accessPermissions.createAndUpdate && <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Designation
                </Button>}



                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Designation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Designation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} designationId={designationId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} designationId={designationId} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="">
                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />


              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}