import * as CryptoJS from 'crypto-js';
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import RoomServiceFilter from "../../../../components/Filter/ServiceFilter";
import HeadSection from "../../../../components/HeadSection";
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from "../../../../components/elements/EditIcon";
import ViewIcon from "../../../../components/elements/ViewIcon";
import Axios from "../../../../utils/axios";

// accessPermissions.listAndDetails &&

// accessPermissions.createAndUpdate &&

// accessPermissions.delete && 


// accessPermissions.download && 



import { getSSRProps } from "./../../../../utils/getSSRProps";
export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.emp",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

//Delete component
const DeleteComponent = ({ onSubmit, empId, pending }) => {

  const { http } = Axios();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchEmployeeInfo = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "getEmployeeInfo", employee_id: empId })
      .then((res) => {
        if (isSubscribed) {
          setName(res.data.data.name)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [empId]);

  useEffect(() => {
    fetchEmployeeInfo();
  }, [fetchEmployeeInfo])



  let myFormData = { "action": "deleteEmployee", employee_id: empId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete {name} ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending || loading} onClick={() => onSubmit(myFormData)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};


export default function index({ accessPermissions }) {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();

  //Delete Tower Modal
  const [employee_id, setEmployeeId] = useState("");
  const [pending, setPending] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const [editData, setEditData] = useState({});


  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true)
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


  const handleAdd = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "createEmployeeId" })
      .then((res) => {
        setEditData(null);

        router.push({
          pathname: '../hrm/employee/update',
          query: { data: null, employee_id: res?.data?.data, updateForm: false },
        });
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        notify("warning", msg);
      });


  };

  const handleEdit = (data) => {
    setEditData(data);
    // setIsModalOpen(true);
    router.push({
      pathname: '../hrm/employee/update',
      // query: { data: data }, 
      query: { data: JSON.stringify(data), updateForm: true, employee_id: data?.id },
    });
  };




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


  const handleOpenDelete = (employeeId) => {
    setShowDeleteModal(true);
    setEmployeeId(employeeId);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, formData)
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
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);


  const actionButton = (row) => {

    const key = '123';
    const passphrase = `${row?.id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();

    const ids = encrypted.replace(/\//g, '--');


    return <>
      <ul className="action">
        {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/hrm/employee/details/${ids}`}
          >
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate && <li>
          {/* <Link href={`/modules/hrm/employee/update/${ids}`}> */}
          <a onClick={() => handleEdit(row)}>
            <EditIcon />
          </a>
          {/* </Link> */}
          {/* <Link href={`/modules/hrm/employee/update/${ids}`}>
              <a  href="#">
                <EditIcon />
              </a>
            </Link> */}
        </li>}

        {accessPermissions.delete && <li>
          <a href="#" onClick={(e) => { e.preventDefault(); handleOpenDelete(row?.id) }}>
            <DeleteIcon />
          </a>
        </li>}
      </ul>
    </>
  }


  const columns = [

    {
      name: 'SL',
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",

    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,

    },
    {
      name: 'Department',
      selector: row => row.department_name,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: row => row.designation_name,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      sortable: true,
    },
    {
      name: 'E-mail',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Creator',
      selector: row => row.created_by,
      sortable: true,
      // width: "70px",
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
    // {
    //   name: 'Created At',
    //   selector: row => row.created_at,
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: row => actionButton(row),
    },

  ];



  const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee?page=${currentPage}&perPageShow=${perPageShow}`, { action: "allEmployeeList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {
            setItemList(res?.data);
            setFilteredData(prev => ({
              ...prev,
              total: res?.data?.data?.total || prev?.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage]
            }));
          }
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




  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])

  const router = useRouter();
  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Employee', link: '/modules/hr/employee' }
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];

  return (
    <>
      <HeadSection title="All-Employees" />

      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card mb-xs-2 shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Employees</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <div className="d-flex justify-content-end">
                    {accessPermissions.createAndUpdate &&
                      // <Link href="/modules/hrm/employee/create">
                      <Button
                        className="shadow rounded btn-sm mr-2"
                        variant="primary"
                        type="button"
                        onClick={handleAdd}
                      >
                        Create Employee
                      </Button>
                      // </Link>
                    }
                    <Link href="/modules/hrm/employee/salary/generate">

                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                      >
                        Salary Generate
                      </Button>
                    </Link>
                  </div>


                </div>
              </div>
              {/* Delete Modal Form */}
              <Modal show={showDeleteModal} onHide={handleExitDelete}>
                <Modal.Header closeButton></Modal.Header>
                <DeleteComponent onSubmit={handleDelete} empId={employee_id} pending={pending} />
              </Modal>

              <div className="card-body p-xs-2">

                <RoomServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Name / Phone /Email"
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />


              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );

}
