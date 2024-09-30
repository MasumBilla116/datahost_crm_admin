import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DataTable from 'react-data-table-component';
import { Select2 } from "../../../../../components";
import toast from "../../../../../components/Toast/index";
import ViewIcon from '../../../../../components/elements/ViewIcon';
import Axios from '../../../../../utils/axios';

//Create Component
const CreateForm = ({ onSubmit, loading }) => {

  const { http } = Axios();

  const [roster, setRoster] = useState({
    roster_id: "",
    roster_employee: []
  });
  const [employee, setEmployee] = useState([]);

  const [rosterList, setRosterList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [oldEmployeeListt, setOldEmployeeListt] = useState([]);

  const handleChange = (e) => {
    setRoster(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }
  const getRoster = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, { action: "allRosters" })
      .then((res) => {
        setRosterList(res.data.data);
      });
  };
  const getEmployee = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, { action: "allEmployee" })
      .then((res) => {
        setEmployeeList(res.data.data);
      });
  };

  const fetchOldEmployee = async () => {
    setOldEmployeeListt([]);

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, { action: "rosterInfoEmployee", id: roster.roster_id })
      .then((res) => {
        setOldEmployeeListt(res?.data?.data)
      });


  };



  useEffect(() => {
    fetchOldEmployee();
  }, [roster?.roster_id])


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getRoster();
      getEmployee();
    });
    return () => clearTimeout(timeout);
  }, []);



  const onSelectRoster = (id) => {
    setRoster({
      ...roster,
      roster_id: id,
    })
  }


  const onSelectEmployee = (e) => {
    setEmployee([])
    e.map((x) => {
      setEmployee(employee => [
        ...employee,
        { employee_id: x.value ,
          // employee_name:x.label,

        }
      ])
    })

  }

  let dataset = {
    ...roster,
    roster_employee: employee,
    action: "createRosterAssignment"
  }



  //--------------------- fetch roster details--------------------------

  const [rosterDetails, setRosterDetails] = useState([]);
  const [rosterInfoloading, setRosterInfoLoading] = useState(false);
  const fetchRoasterDetails = async (id) => {
    setRosterDetails([]);
    setRosterInfoLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, {
        action: "rosterInfo",
        id: id,
      })
      .then((res) => {
        setRosterDetails([res?.data?.data]);
        setRosterInfoLoading(false);
      });
  };


  //--------------------- fetch roster details end--------------------------

  return (
    <Form>

      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Roster<span className="text-danger">*</span></Form.Label>
        <Select2
          options={rosterList && rosterList.map(({ id, name, start_date, end_date }) => ({
            value: id,
            label:
              name + "    " + "(" + (start_date + "   -  " + end_date) + ")",

          }))}
          onChange={(e) => { onSelectRoster(e.value); fetchRoasterDetails(e.value); }}
        />
      </Form.Group>
      {rosterDetails?.map((info, index) => {
        return (
          <>
            <div className="pr-5 m-auto" key={index}>
              <div className="mb-1">
                <span className="badge font-weight-medium bg-light-primary text-primary">
                  <span className="text-dark">Name: </span>
                  {info?.name}
                </span>
                &nbsp;
                <span className="badge font-weight-medium bg-light-primary text-primary">
                  <span className="text-dark">Duty Shift: </span>
                  {info?.duty_shift.name}
                </span>
                &nbsp;
                <span className="badge font-weight-medium bg-light-primary text-primary">
                  <span className="text-dark">Start Date: </span>
                  {info?.start_date}
                </span>
                &nbsp;
                <span className="badge font-weight-medium bg-light-primary text-primary">
                  <span className="text-dark">End Date: </span>
                  {info?.end_date}
                </span>
                &nbsp;
              </div>
            </div>
          </>
        );
      })}
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Employee<span className="text-danger">*</span></Form.Label>

        {
          oldEmployeeListt?.length > 0 &&
          <Select2
            isMulti
            options={employeeList && employeeList.map(({ id, name, department_name, designations_name }) =>
              ({ value: id, label: name + "    ----    " + department_name + "   -----  " + designations_name }))}
            onChange={onSelectEmployee}
            defaultValue={oldEmployeeListt?.map(({ value, label}) => ({ value: value, label: label}))}
          />
        }


        {
          oldEmployeeListt?.length <= 0 &&
          <Select2
            isMulti
            options={employeeList && employeeList.map(({ id, name, department_name, designations_name }) =>
              ({ value: id, label: name + "    ----    " + department_name + "   -----         " + designations_name }))}
            onChange={onSelectEmployee}


          />
        }



      </Form.Group>

      {/* {employee?.map((info, index) => {
          return (
            <>
              <div className="pr-5 m-auto" key={index}>
                <div className="mb-1">
                  <span className="badge font-weight-medium bg-light-primary text-primary">
                    <span className="text-dark">Name: </span>
                    {info?.employee_name}
                  </span>
                  &nbsp;
                  <span className="badge font-weight-medium bg-light-primary text-primary">
                    <span className="text-dark">Duty Shift: </span>
                    {info?.salary_amount}
                  </span>
                  &nbsp;
                  <span className="badge font-weight-medium bg-light-primary text-primary">
                    <span className="text-dark">Start Date: </span>
                    {info?.salary_type}
                  </span>
                  &nbsp;
                </div>
              </div>
            </>
          );
        })} */}

      <Button variant="primary" className="shadow rounded" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Submit
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, item, oldEmployee }) => {
  const { http } = Axios();
  const [employee, setEmployee] = useState([])
  const [rosterList, setRosterList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [roster, setRoster] = useState({
    id: item.id,
    roster_id: item.roster_id
  })

  const handleChange = (e) => {
    setRoster(prev => ({
      ...prev,
      roster_id: e.target.value
    }))
  }

  const getRoster = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, { action: "allRosters" })
      .then((res) => {
        setRosterList(res.data.data);
      });
  };
  const getEmployee = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee" })
      .then((res) => {
        setEmployeeList(res.data.data);

      });
  };

  React.useEffect(() => {
    getRoster();
    getEmployee();
    oldEmployee.map((obj) => {
      setEmployee(employee => [
        ...employee,
        { employee_id: obj.value }
      ])
    })


  }, []);

  const onSelectRoster = (id) => {
    setRoster({
      ...roster,
      roster_id: id,
    })
  }
  const onSelectEmployee = (e) => {
    setEmployee([])
    e.map((obj) => {
      setEmployee(employee => [
        ...employee,
        { employee_id: obj.value }
      ])
    })

  }
  let dataset = {
    ...roster,
    roster_employee: employee,
    action: "updateRosterAssignment"
  }
  return (
    <Form >
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Roster</Form.Label>
        <Select2
          options={rosterList && rosterList.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={e => onSelectRoster(e.value)}
          placeholder={item.roster ? item.roster.name : ''}
        />
      </Form.Group>
      <Form.Group controlId="formBasicName" className='mb-3'>
        <Form.Label>Employee</Form.Label>
        <Select2
          isMulti
          isClearable
          options={employeeList && employeeList.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={onSelectEmployee}
          defaultValue={oldEmployee}
        />
      </Form.Group>
      {/* {oldEmployeeList[0].label} */}
      <Button variant="primary" className="shadow rounded"
        style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        update
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, item }) => {

  const [roster, setRoster] = useState({
    name: item.name,
    id: item.id
  })

  let dataset = { ...roster, action: "deleteRosterAssignment" }
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {roster.name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};





const EmployeeList = ({ employee }) => {


  return (
    <>
      <td className='pt-3'>
        {
          employee.map(obj => {
            return (
              <>
                <p>
                  <b>Name: </b>{obj.employee ? obj.employee.name : ''}
                  <br />
                  <b>Designation: </b>{obj.employee.designation ? obj.employee.designation.name : ''}
                </p>
              </>
            )
          })
        }
      </td>
    </>
  );
};






export default function AssignmentListView({accessPermissions}) {

  const { http } = Axios();
  const [dateState, setDateState] = useState(new Date());
  const [roster, setRoster] = useState([]);
  const [rosterDeftInfo, setRosterDeftInfo] = useState([]);
  const [allEmployee, setAlEmployee] = useState([]);
  const router = useRouter();
  const { pathname } = router;
  
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, items)
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

    // fetchItemList();

    return () => isSubscribed = false;
  }


  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [id, setId] = useState(null);
  const [item, setItem] = useState({});
  const [oldEmployeeList, setOldEmployeeList] = useState([]);

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (obj) => {
    setShowUpdateModal(true);
    setItem(obj);
    setOldEmployeeList([]);
    obj.roster_employee.map((obj) => {
      setOldEmployeeList(oldEmployeeList => [
        ...oldEmployeeList,
        {
          label: obj.employee ? obj.employee.name : '',
          value: obj.employee_id,
        }
      ])
    });

  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (obj) => {

    setShowDeleteModal(true);
    setItem(obj);
  }

  //Update floor form
  const updateForm = async (formData) => {

    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, formData)
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


  const handleDelete = async (formData) => {

    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, formData)
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


  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // rosterViewBtnn();
      fetchRosterList();
      getEmployee();
      getRosterEmployee();

    });
    return () => clearTimeout(timeout);
  }, []);





  //-----------------calender operation ------------------------------

  const changeDate = (e) => {
    setDateState(e);
  }

  // date filter for calender dtaa

  let allRosterDate = filteredData?.map((datas) => {
    return datas.roster;
  })

  let selectedDate = moment(dateState).format('YYYY-MM-DD');

  let selectRosterInfo = allRosterDate?.filter((dates) => {

    return dates.start_date == selectedDate;

  })


  //------------------------------serach by date -------------------------------

  const data = roster;
  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.start_date <= selectedDate && item.end_date >= selectedDate;
    });

    setRoster(result);
    return () => controller.abort();
  }, [selectedDate])



  //------------------------------serach by date end -------------------------------

  //--------------------------------------Department Information----------------------------------------------------------------------------


  //---------------------Roster Employee Operation---------------------------------

  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const rosterViewBtnn = async (id) => {
    if (isRequestInProgress) return;
    setIsRequestInProgress(true);
  
    
    let isSubscribed = true;
  
    try {
      // Clear previous data
      setRosterDeftInfo([]);
      setAlEmployee([]);
  
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, {
        action: "allDeptInfoFromRoster",
        id: id
      });
  
      if (isSubscribed) {
        
        setRosterDeftInfo(res?.data?.data);
        setAlEmployee(res?.data?.data);
      }
    } catch (err) {
      console.log("Server Error ~!");
    } finally {
      setIsRequestInProgress(false);
    }
  
    getRosterEmployee(id);
  
    return () => {
      isSubscribed = false;
    };
  };
  

  // employeeID

  const deptactionButton = (row) => {
    return <>
      <ul className="action ">
        {accessPermissions.listAndDetails && <li>
          <Link href='#'>
            <a
              onClick={() =>{
                empInfoBtn(row.id,row.department_id);
                
              }}

            >
              <ViewIcon />
            </a>
          </Link>
        </li>}
      </ul>
    </>
  }

  const deptColumns = [

    {
      name: 'Department Name',
      selector: row => row.department_name,
      sortable: true,
    },

    {
      name: 'Total Employee',
      selector: row => row?.total_employees,
      sortable: true,
    },

    {
      name: 'Assigned Employee',
      selector: row => row?.assigned_employees,
      sortable: true,
    },

    {
      name: 'Action',
      selector: row => deptactionButton(row),
    },

  ];



  //--------------------------------------Department Information end----------------------------------------------------------------------------




  //--------------------------------------Employee Information----------------------------------------------------------------------------


  const [rosterEmployeeInfo, setRosterEmployeeInfo] = useState([]);
  const [rosterAsnId, setRosterAsnId] = useState(null);
  const empInfoBtn = async (id,department_id) => {
    setRosterAsnId(id);
    // setAlEmployee([]);

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, {
      action: "empInfoFromRoster",
      id: id,
      department_id:department_id
    })
      .then((res) => {
        if (isSubscribed) {
          setAlEmployee(res.data.data)
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    // getRosterEmployee(id)
    return () => isSubscribed = false;

  }

  const empColumns = [

    {
      name: 'Employee Name',
      selector: row => row.employeeName,
      sortable: true,
    },

    {
      name: 'Department',
      selector: row => row.department_name,
      sortable: true,
    },

    {
      name: 'Designation',
      selector: row => row.designations_name,
      sortable: true,
    },

    {
      name: 'Status',
      selector: row => 'Pending',
      sortable: true,
    },

  ];



  //--------------------------------------Employee Information end----------------------------------------------------------------------------










  //-------------------------------------Roster Information-------------------------------------------------------------------------

  const fetchRosterList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, {
      action: "allRosters",
    })
      .then((res) => {
        if (isSubscribed) {

          setRoster(res.data.data)
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };




  const rosterTblColumns = [

    {
      name: 'Roster Name',
      selector: row => row.name,
      sortable: true,
    },

    {
      name: 'Duty Shift',
      selector: row => row.duty_shift.name,
      sortable: true,
    },

    {
      name: 'From Date',
      selector: row => row.start_date,
      sortable: true,
    },


    {
      name: 'To Date',
      selector: row => row.end_date,
      sortable: true,
    },



    {
      name: 'Action',
      selector: row => actionButtonofRoster(row),
    },


  ];




  const actionButtonofRoster = (row) => {

    return <>
      <ul className="action ">
        {accessPermissions.listAndDetails && <li>
          {/* <Link href={`/modules/hrm/duty-management/roster/details/${row.id}`}> */}
            <a
              onClick={() =>
                rosterViewBtnn(row.id)}
            >
              <ViewIcon />
            </a>
          {/* </Link> */}
        </li>}

        {/* <li>
          <Link href="#">
            <a onClick={() => handleOpen(row)}>
              <EditIcon />
            </a>
          </Link>
        </li> */}

      </ul>
    </>
  }

  //-------------------------------------Roster Information end-------------------------------------------------



  //--------------------------------all employee list for data table----------------------------
  const [employeeList, setEmployeeList] = useState([]);
  const getEmployee = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, { action: "allEmployee" })
      .then((res) => {
          setEmployeeList(res.data.data);
      });
  };




  // roster wise employee 

  const [rosterWiseEmployeeList, setRosterWiseEmployeeList] = useState([]);
  const getRosterEmployee = async (id) => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`, {
      action: "allEmpInfoFromRoster",
      id: id
    })
      .then((res) => {
        if(res?.data?.data){

          setRosterWiseEmployeeList(res?.data?.data[0]?.roster_employee)
        }
      });
  };

  //--------------------------------all employee list for data table end----------------------------


      //breadcrumbs
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Assignment', link: '/modules/dutyManagement/assignment' },
    ]

  return (
    <div className="">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row no-pad">
        <div className="col-12 p-xs-2">
          <div className="card mb-xs-1 shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Assignment</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
               {accessPermissions.createAndUpdate && <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Roster Assignment
                </Button>}

                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className=' '>Create Roster Assignment</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Roster</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} item={item} oldEmployee={oldEmployeeList}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} item={item} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="row">
                <div className="col mb-4" >
                  <div className="">
                    <p>Selected Date is <b >{moment(dateState).format('YYYY-MM-DD')}</b></p>
                    <Calendar
                      className="w-100"
                      value={dateState}
                      onChange={changeDate}
                    />

                  </div>
                </div>
                <div className="col">
                  <div className="">
                    <h5 className="text-info">Roster Information</h5>
                    <DataTable
                      columns={rosterTblColumns}
                      data={roster}
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

              <div className="row">
                <div className="col">
                  <div className="">
                    <h5 className="text-info">Department Information</h5>
                    <DataTable
                      columns={deptColumns}
                      data={rosterDeftInfo}
                      pagination
                      highlightOnHover
                      subHeader
                      striped
                    />

                  </div>
                </div>
                <div className="col">
                  <div className="">
                    <h5 className="text-info">Employee Information</h5>
                    
                    <DataTable
                      columns={empColumns}
                      data={allEmployee}
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
        </div>
      </div>
    </div>
  )
}