import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteIcon, EditIcon, HeadSection } from "../../../components";
import FilterDatatable from "../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../components/Filter/ServiceFilter";
import toast from "../../../components/Toast/index";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
// import { toast } from 'react-toastify';
import ActiveCurrency from "../../../components/ActiveCurrency";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.acnt.mng_acnt",
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
const DeleteComponent = ({ onSubmit, accId, pending }) => {
  const { http } = Axios();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  let myFormData = new FormData();

  myFormData.append("action", "deleteAccount");
  myFormData.append("id", accId);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete?</Modal.Title>
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

const List = ({ accessPermissions }) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [rows, setRows] = React.useState([]);
  const [supplierList, setSupplierList] = useState([]);

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

  // const getSupplierList = async () => {
  //   let isSubscribed = true;
  //   await http
  //     .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
  //       action: "listAccounts",
  //     })
  //     .then((res) => {
  //       if (isSubscribed) {
  //         //console.log(res.data);
  //         setSupplierList(res?.data);
  //         setFilteredData(res.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Server Error ~!");
  //     });

  //   return () => (isSubscribed = false);
  // };

  const getSupplierList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "allListAccounts", filterValue: filterValue }
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

  /**Getting Supplier List */
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getSupplierList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  //Delete Tower Modal
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const [pending, setPending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accId, setAccId] = useState(""); //accId
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (accId) => {
    setShowDeleteModal(true);
    setAccId(accId);
  };

  //Delete Laundry Voucher form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
            search: null,
          }));
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    getSupplierList();

    return () => (isSubscribed = false);
  };

  const actionButton = (id: any) => {
    return (
      <>
        <ul className="action">
          {/* <li>
                <Link href={`/modules/accounts/details/${id}`}
                >
                <a>
                    <ViewIcon />
                </a>
                </Link>
            </li> */}
          {accessPermissions.createAndUpdate && (
            <li>
              <Link href={`/modules/accounts/update/${id}`}>
                <a>
                  <EditIcon />
                </a>
              </Link>
            </li>
          )}

          {accessPermissions.delete && (
            <li>
              <Link href="#">
                <a onClick={() => handleOpenDelete(id)}>
                  <DeleteIcon />
                </a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.status == 0,
      style: {
        backgroundColor: "rgba(243, 59, 42, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const columns = [
    {
      name: "Account Name",
      selector: (row) => row.account_name,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Account Number",
      selector: (row) => row.account_no,
      sortable: true,
    },
    {
      name: "Bank ",
      selector: (row) => row.bank,
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Account Type",
      selector: (row) => row.account_type,
      sortable: true,
    },
    {
      name: "Pos Availability",
      selector: (row) => (row.pos_availability == 0 ? "N/A" : "YES"),
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.pos_availability == 1,
          classNames: ["success"],
        },
        {
          when: (row) => row.pos_availability == 0,
          classNames: ["warning"],
        },
      ],
    },
    {
      name: "Opening Balance",
      selector: (row) => (
        <>
          {" "}
          <ActiveCurrency />
          {row.opening_balance}
        </>
      ),
      sortable: true,
    },
    {
      name: "Balance",
      selector: (row) => (
        <>
          {" "}
          <ActiveCurrency /> {row.balance}
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Account", link: "/modules/accounts" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <HeadSection title="Accounts List" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12  p-xs-2 ">
            <div className="card">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Accounts List</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Link href="/modules/accounts/create">
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block
                      >
                        Add Account
                      </Button>
                    </Link>
                  )}

                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      accId={accId}
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
                  dateFilter={false}
                  placeholderText="Account Name / Account No"
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
    </>
  );
};

export default List;
