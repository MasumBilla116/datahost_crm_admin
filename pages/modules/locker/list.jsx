import MyToast from "@mdrakibul8001/toastify";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { DeleteIcon, EditIcon, HeadSection, ViewIcon } from "../../../components";
import PropagateLoading from "../../../components/PropagateLoading";
import Loader from "../../../components/Loader/loader";
import Axios from "../../../utils/axios";
import FilterDatatable from "../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../components/Filter/ServiceFilter";
import { getSSRProps } from "../../../utils/getSSRProps";



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.lckr.lckrlist" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};


function index({accessPermissions}) {
  const { http } = Axios();
  const { notify } = MyToast();

  //Sate declaration
  const [lockers, setLockers] = useState([]);
  const [lockersSearch, setLockersSearch] = useState([]);
  const [serial, setSerial] = useState("");
  const [id, setID] = useState(0);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [search, setSearch] = useState("");



    /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const[dateFilter,setDateFilter]= useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPageShow, setPerPageShow] = useState(15)
  const [tblLoader, setTblLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
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


  
  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
      if (!filteredData?.[currentPage] || filterValue.filter === true) {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllLockerList", filterValue: filterValue })
          .then((res) => {
            if (isSubscribed) {

              // setItemList(res?.data);
              // setFilteredData(res.data?.data);
              setFilteredData(prev => ({
                ...prev,
                total: res.data?.data?.total || prev.total,
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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);



  const deleteLocker = async () => {
    setID &&
      (await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, {
          action: "deleteLocker",
          id,
        })
        .then((res) => {
          const lockers = res?.data?.data;
          !!lockers.length &&
            setLockers(lockers.filter((locker) => locker?.status === 1));
          setOpen(false);
          notify("success", "Locker " + serial + " deleted successfully");
          setFilterValue((prev)=>({
            ...prev,
            filter: true,
          }));
        })
        .catch((err) => {
          console.log(err);
        }));
        fetchItemList();
  };

  const actionButton = (serial, id) => {
    return (
      <ul className="action mt-3">
        {accessPermissions.listAndDetails &&<li>
          <Link href="#">
            <a
              onClick={() => {
                setOpenView(true);
                setSerial(serial);
                setID(id);
              }}
            >
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate &&<li>
          <Link href={`/modules/locker/update/${id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.delete &&<li>
          <Link href="#">
            <a
              onClick={() => {
                setOpen(true);
                setSerial(serial);
                setID(id);
              }}
            >
              <DeleteIcon />
            </a>
          </Link>
        </li>}
      </ul>
    );
  };

  const columns = [
    {
      name: <span className="fw-bold">Serial</span>,
      selector: row => row?.serial,
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Type</span>,
      selector: row => row?.type,
      width: "15%",
      sortable: true,
    },
    {
      name: <span className="fw-bold ">Availability</span>,
      selector: row => (
        <span
          className={`
            ${row?.status
              ? row?.availability === "available"
                ? "text-success"
                : "text-danger"
              : ""}
              text-capitalize
              `
          }
        >
          {row?.availability}
        </span>
      ),
      width: "10%",
      sortable: true,
    },
    
    {
      name: <span className="fw-bold">Size</span>,
      selector: row => row?.size,
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Description</span>,
      selector: row => row?.description,
      width: "15%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Created At</span>,
      selector: row =>
        moment(row.created_at).format("DD/MM/YYYY"),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Updated At</span>,
      selector: row =>
        moment(row.updated_at).format("DD/MM/YYYY"),
      width: "10%",
      sortable: true,
    },
    {
      name: <span className="fw-bold">Action</span>,
      selector: row =>
        actionButton(row.serial, row.id),
      width: "15%",
    },
  ];

  useEffect(() => {
    let controller = new AbortController();

    const result = lockersSearch?.filter((locker) => {
      return (
        locker?.serial.toLowerCase().match(search.toLocaleLowerCase()) ||
        locker?.type.toLowerCase().match(search.toLocaleLowerCase()) ||
        locker?.availability.toLowerCase().match(search.toLocaleLowerCase())
      );
    });

    setLockers(result);
    return () => controller.abort();
  }, [search]);
  const router = useRouter();
  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Lockers", link: "/modules/locker" },
  ];


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
    { title: "Available", value: "available" },
    { title: "Unavailable", value: "unavailable" },

  ];

  return (
    <>
      <div className="container-fluid">
      <HeadSection title="Locker List" />

        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center justify-content-between">
                <div>
                  <h4 className="card-title mb-0 fw-bolder">All Lockers</h4>
                </div>
                <div>
                  {accessPermissions.createAndUpdate &&<Link href="/modules/locker/create">
                    <Button variant="primary" className="btn-sm">
                      Create Locker
                    </Button>
                  </Link>}
                </div>
              </div>
              <div className="card-body">
                 

                  <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Type / Serial"
                />
                  <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />

                  
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* //Delete Modal// */}
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Modal.Title className="fs-5">
            Are you sure to Delete locker{" "}
            <span className="fw-bolder">{serial}</span> ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant="danger" disabled={!serial} onClick={deleteLocker}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //View Modal// */}
      <Modal
        dialogClassName="modal-md"
        show={openView}
        onHide={() => setOpenView(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <ViewLockerByID id={id} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default index;

const ViewLockerByID = ({ id }) => {
  const [locker, setLocker] = useState([]);
  const { http } = Axios();

  useEffect(() => {
    const controller = new AbortController();

    //fetch locker By
    const getallLockerByID = async () => {
      let body = {};
      body = {
        action: "getLockerByID",
        id,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, body)
        .then((res) => {
          const locker = res?.data?.data;
          !!locker.length &&
            setLocker(locker.filter((locker) => locker?.status === 1));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getallLockerByID();

    return () => controller.abort();
  }, []);

  return (
    <>
      {!!locker.length ? (
        locker.map((lock, index) => {
          return (
            <div key={index} className="p-2">
              <h5 className="pb-2 text-center">
                <span className="fw-bolder">Serial : </span>
                {lock?.serial}
              </h5>
              <div className="py-1">
                <span className="fw-bolder">Availability : </span>
                {lock?.availability}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Locker Type : </span>
                {lock?.type}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Size : </span>
                {lock?.size}
              </div>
              <div className="py-1">
                <span className="fw-bolder">Description : </span>
                {lock?.description}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ height: "100px" }}>
          <div className="text-center">
            <PropagateLoading />
          </div>
        </div>
      )}
    </>
  );
};
