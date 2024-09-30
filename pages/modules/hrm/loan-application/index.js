import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import HeadSection from "../../../../components/HeadSection";
import toast from "../../../../components/Toast";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import ViewIcon from "../../../../components/elements/ViewIcon";
import Axios from "../../../../utils/axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';


import { getSSRProps } from "./../../../../utils/getSSRProps";
import LoanCategory from "./loan_category";
export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.lnaplctn",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const ApproveApplication = ({ onSubmit, loanId }) => {
  console.log(onSubmit, loanId);
  const { http } = Axios();
  const router = useRouter();
  const { id } = router.query;

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  let formData = new FormData();

  formData.append("action", "loanApplicationApproval");
  formData.append("loan_status", "Approved");
  formData.append("loan_id", loanId);
  formData.append("admin_note", note);



  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Admin Note of {loanId}</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Admin Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Form.Group>

      <Button
        variant="info"
        style={{ marginTop: "5px", marginLeft: "40%" }}
        type="button"
        onClick={() => onSubmit(formData)}
        block
      >
        Approve
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, loandata, pending }) => {
  console.log(loandata);
  let myFormData = new FormData();

  myFormData.append("action", "deleteLoanApplication");
  myFormData.append("loan_id", loandata.id);
  // due_amount
  return (
    <>
      <Modal.Body>
        {loandata.due_amount ? (
          <Modal.Title>
            This loan amount has not been fully cleared.{" "}
          </Modal.Title>
        ) : (
          <Modal.Title>Are you sure to Cancel </Modal.Title>
        )}
      </Modal.Body>
      <Modal.Footer>
        {loandata.due_amount ? (
          <Button variant="danger" disabled>
            Confirm
          </Button>
        ) : (
          <Button
            variant="danger"
            disabled={pending}
            onClick={() => onSubmit(myFormData)}
          >
            Confirm
          </Button>
        )}
      </Modal.Footer>
    </>
  );
};

const index = ({ accessPermissions }) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const [filteredData, setFilteredData] = useState({
    total: 0,
    paginate: true,
  });
  const [loanList, setLoanList] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const [loanId, setLoanId] = useState("");
  const [loandata, setLoanData] = useState({});

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

  //Fetch List Data for datatable
  const data = loanList?.data;
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLoanAppList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  const fetchLoanAppList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    if (filterValue.filter === true) {
      setCurrentPage(1);
    }

    let formData = {
      action: "getAllLoanApplicationList",
      filterValue: filterValue,
    };
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan?page=${currentPage}&perPageShow=${perPageShow}`,
          formData
        )
        .then((res) => {
          if (isSubscribed) {
            setLoanList(res?.data);
            // setFilteredData(res.data?.data);
            setFilteredData(prev => ({
              ...prev,
              total: res?.data?.data?.total || prev?.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage],
            }));
          }
        })
        .catch((err) => {
          console.log("Server Error ~!");
        });
      setFilterValue((prev) => ({
        ...prev,
        filter: false,
        search: null,
      }));
    }
    setTblLoader(false);

    return () => (isSubscribed = false);
  };

  const handleShow = (loanId) => {
    setLoanId(loanId);
    setShow(true);
  };

  //Delete loan Modal

  const handleOpenDelete = (row) => {
    setShowDeleteModal(true);
    // setLoanId(loanId);
    setLoanData(row);
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchLoanAppList();

    return () => (isSubscribed = false);
  };

  const handleApprove = async (items) => {
    let isSubscribed = true;

    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, items)
      .then((res) => {
        if (isSubscribed) {
          fetchLoanAppList();
          notify("success", "successfully Approved!");
          handleClose();
          handleRejectClose();
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
        // else {
        //   notify("error", `Something went wrong !`);
        // }
      });

    return () => (isSubscribed = false);
  };

  const actionButton = (row) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (
            <li>
              <Link href={`/modules/hrm/loan-application/details/${row.id}`}>
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}

          {row?.loan_status == "Pending" ? (
            <li>
              {accessPermissions.createAndUpdate && (
                <Link href={`/modules/hrm/loan-application/update/${row.id}`}>
                  <a>
                    <EditIcon />
                  </a>
                </Link>
              )}
            </li>
          ) : (
            ""
          )}

          <li>
            {accessPermissions.delete && (
              <Link href="#">
                <a onClick={() => handleOpenDelete(row)}>
                  <DeleteIcon />
                </a>
              </Link>
            )}
          </li>
        </ul>
      </>
    );
  };

  const columns = [
    // {
    //   name: 'Invoice Number',
    //   selector: row => row.id,
    //   sortable: true,

    // },

    {
      name: <span className="fw-bold">SL</span>,
      selector: (row, index) => index + 1,
      sortable: true,
      // width: "75px",
    },
    {
      name: "Employee",
      selector: (row) => row?.name,
      sortable: true,
    },
    // {
    //   name: "Subject",
    //   selector: (row) => row.subject,
    //   sortable: true,
    // },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Payment",
      selector: (row) => row.loan_payment,
      sortable: true,
    },
    {
      name: "amount",
      selector: (row) => row.amount,
      sortable: true,
    },

    {
      name: <span className="fw-bold">Loan Status</span>,
      // selector: row => row?.loan_status == 'Pending' ? <button className="btn btn-danger">Pending</button> : <button onClick={handleShow} className="btn btn-success">{row?.loan_status}</button>
      selector: (row) =>
        row?.loan_status == "Pending" ? (
          <span className="text-danger">Pending</span>
        ) : (
          <span className="text-success">{row?.loan_status}</span>
        ),
    },

    {
      name: "Action",
      selector: (row) => actionButton(row),
    },
  ];

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((loan) => {
      return loan?.name.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Loan-Applications", link: "/modules/hr/loanApplications" },
    // { text: 'Create Loan-Applications', link: '/modules/hr/loanApplications/createLoanApplication' },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
    { title: "Approved", value: "Approved" },
    { title: "Pending", value: "Pending" },
  ];
  return (
    <>
      <HeadSection title="All Loan Applications" />

      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2  col-md-8">
            <div className="card mb-xs-1 shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Loan Applications</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Link href={`/modules/hrm/loan-application/create`}>
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block
                      >
                        Create Loan
                      </Button>
                    </Link>
                  )}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      loandata={loandata}
                      pending={pending}
                    />
                  </Modal>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Approve Application</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ApproveApplication
                        onSubmit={handleApprove}
                        loanId={loanId}
                      />
                    </Modal.Body>
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
          <div className="col-12 col-md-4">
          <LoanCategory/>
        </div>
        </div>
        
      </div>
    </>
  );
};

export default index;
