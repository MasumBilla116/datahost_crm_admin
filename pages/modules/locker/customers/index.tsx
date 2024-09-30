import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import MyToast from "@mdrakibul8001/toastify";
import { DeleteIcon, EditIcon, HeadSection, ViewIcon } from "../../../../components";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import { useRouter } from "../../../../node_modules/next/router";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.lckr.asgn_lckr" });
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
  const [lockerSearchState, setLockerSearchState] = useState([]);
  const [serial, setSerial] = useState("");
  const [id, setID] = useState(0);
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageShow, setPerPageShow] = useState(15);
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
    setFilterValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true,
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

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/entry?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "getAllLockerEntryList", filterValue: filterValue }
        )
        .then((res) => {
          if (isSubscribed) {
            setFilteredData((prev) => ({
              ...prev,
              total: res.data?.data?.total || prev.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage],
            }));
          }
        });
      setFilterValue((prev) => ({
        ...prev,
        filter: false,
        search: null,
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => (isSubscribed = false);
  };

  const deleteLocker = async () => {
    setID &&
      (await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/entry`, {
          action: "lockerDeleteByID",
          id,
        })
        .then((res: any) => {
          res && setLockers(lockers?.filter((locker) => locker?.id !== id));
          setOpen(false);
          notify("success", serial + "'s" + " locker deleted successfully");
        })
        .catch((err: any) => {
          console.log(err);
        }));
  };

  const actionButton = (serial: any, id: number) => {
    return (
      <ul className="action mt-3">
        {accessPermissions.listAndDetails &&<li>
          <Link href={`/modules/locker/customers/details/${id}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate && <li>
          <Link href={`/modules/locker/customers/update/${id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.delete &&<li>
          <Link href={``}>
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

  const GenerateName = (title: any, middle: any, last: any) => {
    if (title && middle && last) {
      return title + " " + middle + " " + last;
    } else if (middle && last) {
      return middle + " " + last;
    } else if (title && middle) {
      return title + " " + middle;
    } else if (middle) {
      return "Mr " + middle;
    }
  };

  const columns: any = [
    {
      name: <span className="fw-bold">Guest name</span>,
      selector: (row: { title: string; first_name: any; last_name: any }) =>
        GenerateName(row?.title, row?.first_name, row?.last_name),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Guest number</span>,
      selector: (row: { mobile: number }) => row?.mobile,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Total items</span>,
      selector: (row: { total_item: any }) => row?.total_item,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="fw-bold">pick up date</span>,
      selector: (row: { pickup_date: any }) => row?.pickup_date,
      sortable: true,
    },
    {
      name: <span className="fw-bold"> pick up time</span>,
      selector: (row: { time: any }) => moment(row?.time).format("h:mm a"),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Token</span>,
      selector: (row: { token: any }) => row?.token,
      sortable: true,
    },
    {
      name: <span className="fw-bold">Created At</span>,
      selector: (row: { created_at: any }) =>
        moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: <span className="fw-bold">Action</span>,
      selector: (row: {
        last_name(
          title: (title: any, first_name: any, last_name: any) => any,
          first_name: (
            title: (title: any, first_name: any, last_name: any) => any,
            first_name: any,
            last_name: any
          ) => any,
          last_name: any
        ): any;
        first_name(
          title: (title: any, first_name: any, last_name: any) => any,
          first_name: any,
          last_name: any
        ): any;
        title(title: any, first_name: any, last_name: any): any;
        serial: any;
        id: number;
      }) =>
        actionButton(
          GenerateName(row?.title, row?.first_name, row?.last_name),
          row.id
        ),
      width: "150px",
    },
  ];

  useEffect(() => {
    let controller = new AbortController();

    const result = lockerSearchState?.filter((locker) => {
      return (
        locker?.title?.toLowerCase().match(search.toLocaleLowerCase()) ||
        locker?.first_name?.toLowerCase().match(search.toLocaleLowerCase()) ||
        locker?.last_name?.toLowerCase().match(search.toLocaleLowerCase()) ||
        locker?.mobile?.toLowerCase().match(search.toLocaleLowerCase())
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
    { text: "All Locker Entry", link: "/modules/locker/entry" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <div className="container-fluid">
      <HeadSection title="Lockers Entries" />

        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center justify-content-between">
                <div>
                  <h4 className="card-title mb-0 fw-bolder">
                    All Lockers Entries
                  </h4>
                </div>
                <div>
                { accessPermissions.createAndUpdate && <Link href="/modules/locker/customers/assign">
                    <Button className="mx-3 btn-sm" variant="primary">
                      Assign Customer
                    </Button>
                  </Link>}
                </div>
              </div>

              <div className="card-body p-xs-2">
                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Name / Phone / Token"
                />
                <FilterDatatable
                  tblLoader={tblLoader}
                  columns={columns}
                  setFilterValue={setFilterValue}
                  filteredData={filteredData}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPageShow}
                />
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
            Are you sure to Delete{" "}
            <span className="fw-bolder">{serial}'s </span>locker ?
          </Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant="danger" onClick={deleteLocker}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default index;
