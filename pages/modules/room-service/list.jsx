import * as CryptoJS from "crypto-js";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../components";
import FilterDatatable from "../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../components/Filter/ServiceFilter";
import HeadSection from "../../../components/HeadSection";
import toast from "../../../components/Toast/index";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rm_srvs",
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
const DeleteComponent = ({ onSubmit, customerInvId, pending }) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  let myFormData = {
    action: "deleteRoomService",
    customerInvoiceId: customerInvId,
  };

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => onSubmit(myFormData)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

// main component
export default function index({ accessPermissions }) {
  // notifications
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  // http request
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;

  // @@ State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageShow, setPerPageShow] = useState(15);
  const [tblLoader, setTblLoader] = useState(true);
  const [filteredData, setFilteredData] = useState({
    total: 0,
  });
  const [filterValue, setFilterValue] = useState({
    status: "all",
    yearMonth: `${y}-${m}`,
    search: null,
    filter: false,
    paginate: true,
  });

  const [customerInvoiceId, setCustomerInvId] = useState("");
  const [pending, setPending] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);

  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");

  // handler
  const handleOpenDelete = (employeeId) => {
    setShowDeleteModal(true);
    setCustomerInvId(employeeId);
  };

  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };
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

  const actionButton = (id, status) => {
    const key = "123";
    const passphrase = `${id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();

    const ids = encrypted.replace(/\//g, "--");

    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (<li>

            <Link href={`/modules/room-service/invoice/${ids}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>

          </li>)}
          {accessPermissions.createAndUpdate && (<li>

            <Link href={`/modules/room-service/edit/${ids}`}>
              <a>
                <EditIcon />
              </a>
            </Link>
          </li>
          )}
          {status === 1 && (<li>
            {accessPermissions.delete && (
              <Link href="#">
                <a onClick={() => handleOpenDelete(id)}>
                  <DeleteIcon />
                </a>
              </Link>
            )}
          </li>)}
        </ul>
      </>
    );
  };

  // Data mining
  const data = itemList?.data;
  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    if (filterValue.filter === true) {
      setCurrentPage(1);
    }
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "allInvLists", filterValue: filterValue }
        )
        .then((res) => {
          if (isSubscribed) {
            setItemList(res?.data);
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

  // @ UseEffect
  useEffect(() => {
    fetchItemList();
  }, [filterValue, currentPage]);

  //  Datatable columns
  const columns = [
    {
      name: "SL",
      selector: (row, index) => (currentPage - 1) * perPageShow + (index + 1),
      sortable: true,
      width: "75px",
    },
    {
      name: "Order Date/Time",
      selector: (row) => moment(row?.created_at).format("yy-MM-DD HH:mm:ss A"),
      sortable: true,
    },
    {
      name: "Invoice No.",
      selector: (row) => row?.inv_number,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => `${row?.first_name} ${row?.last_name}`,
      sortable: true,
    },
    {
      name: "Room No",
      selector: (row) => row?.room_no,
      sortable: true,
    },
    {
      name: "Payable Amount",
      selector: (row) => row?.net_amount,
      sortable: true,
    },
    {
      name: "Due",
      selector: (row) => row?.due,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`text-capitalize ${row?.order_status === "confirm"
              ? "text-success"
              : row?.order_status === "processing"
                ? "text-info"
                : "text-danger"
            }`}
        >
          {row?.order_status}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => actionButton(row.id, row.status),
    },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
    { title: "Confirm", value: "confirm" },
    { title: "Processing", value: "processing" },
    { title: "Pending", value: "pending" },
  ];

  return (
    <>
      <HeadSection title="All-Room-Services" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Room Services</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Link href="/modules/room-service/addNewRoomService">
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block="true"
                      >
                        Add Room Service
                      </Button>
                    </Link>
                  )}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      customerInvId={customerInvoiceId}
                      pending={pending}
                    />
                  </Modal>
                </div>
              </div>

              <div className="card-body">
                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={true}
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
                {/* end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
