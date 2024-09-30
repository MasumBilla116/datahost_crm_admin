import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import HeadSection from "../../../../../components/HeadSection";
import Axios from "../../../../../utils/axios";

import moment from 'moment';
import DataTable from "react-data-table-component";
import EditIcon from "../../../../../components/elements/EditIcon";
import ViewIcon from "../../../../../components/elements/ViewIcon";
const Show = () => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { isReady, query: { id } } = router;

  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [creator, setCreator] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  let Status;
  if (status == 1) {
    Status = "Active"

  }
  else {
    Status = "Inactive"
  }



  //-----------------------fetch department info---------------------------
  useEffect(() => {
    let isSubscribed = true;
    if (!isReady) {
      return;
    }
    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, {
      action: "getDepartmentInfo",
      department: id,
    })
      .then((res) => {
        if (isSubscribed) {
          setDetails(res?.data?.data)
          setStatus(res?.data?.data?.status);
          setCreator(res?.data?.data?.creator)

        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });
    return () => {
      isSubscribed = false;
    };
  }, [id, isReady])
  //-----------------------fetch department info---------------------------








  //----------------------- fetch all employee---------------------------

  useEffect(() => {
    let isSubscribed = true;
    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
      action: "allEmployee"
    })
      .then((res) => {
        if (isSubscribed) {
          setFilteredData(res?.data?.data)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;
  }, [])









  //----------------------- fetch all employee end---------------------------





  //---------------------------delete employee---------------------------
  const [employee_id, setEmployeeId] = useState("");
  const [pending, setPending] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
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


  //--------------------delete employee end----------------------------







  //----------------------- date find---------------------------

  let date = new Date();
  let options = details.created_at;
  let created_at = date.toLocaleDateString('en-US', options);
  // console.log("created_at",moment(details.created_at).format('DD/MM/YYYY'));
  //----------------------- date find end---------------------------



  const actionButton = (rcv_back_id) => {
    return <>
      <ul className="action">
        <li>
          <Link href={`/modules/hrm/employee/details/${id}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>
        <li>
          <Link href={`/modules/hrm/employee/update/${id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>

        {/* <li>
              <a href="#" onClick={(e)=>{e.preventDefault(); handleOpenDelete(id)}}>
                <DeleteIcon/>
              </a>
            </li> */}
      </ul>
    </>
  }



  const columns = [
    {
      name: 'SL',
      selector: (row, index) => index + 1,
      width: "75px",
    },

    {
      name: 'Name',
      selector: row => <span className='text-capitalize'>{row.name}</span>,
      sortable: true,

    },
    {
      name: 'Designation',
      selector: row => row.designation_id,
      sortable: true,

    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: row => row.created_by,
      sortable: true,
    },

    {
      name: 'Created At',
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    // {
    //   name: 'Action',
    //   selector: row => actionButton(row.id),
    // },

  ];


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Department', link: '/modules/hr/department/list' },
    { text: 'View Employee', link: `/modules/hr/department/details/[id]` }
  ]



  return (
    <>
      <HeadSection title="Department Basic Info" />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">





              <div className="card-body">
                <h4 className="card-title mb-0 ">Employees of the Departments</h4>
              </div>
              <div className="card-body border-top">


                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader

                  striped
                />

              </div>
              <hr />



            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Show;