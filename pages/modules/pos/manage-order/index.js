import { createTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { HeadSection } from "../../../../components";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import Loader from "../../../../components/Loader/loader";
import PdfDataTable from "../../../../components/PdfDataTable";
import PrintDataTable from "../../../../components/PrintDataTable";
import toast from "../../../../components/Toast/index";
import themeContext from "../../../../components/context/themeContext";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import ViewIcon from "../../../../components/elements/ViewIcon";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rstrnt.odr",
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
const DeleteComponent = ({ onSubmit, invoiceId, pending, loader }) => {
  let myFormData = new FormData();

  myFormData.append("action", "deleteInvoice");
  myFormData.append("invoice_id", invoiceId);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Cancel </Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => onSubmit(myFormData)}
        >
          {loader && <Loader />}
          Confirm Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({ accessPermissions }) {
  // hold-data notification msg context
  const context = useContext(themeContext);
  const { setHoldDataNotification, holdDataNotification, fetchHoldDataList ,golbalCurrency} =
    context;
  const [loader, setLoader] = useState(false);

  // fetch hold-data notification msg
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHoldDataList(); // fetch hold-data list and update notification
    });
    return () => clearTimeout(timeout);
  }, []);
  // end hold-data notification

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

  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (voucherId) => {
    setShowDeleteModal(true);
    setInvoiceId(voucherId);
    fetchHoldDataList(); // fetch hold-data list and update notification
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    setLoader(true);
    let isSubscribed = true;
    setPending(true);
    // await http
    //   .post(
    //     `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
    //     formData
    //   )
    //   .then((res) => {
    //     if (isSubscribed) {
    //       setLoader(false);
    //       notify("success", "successfully deleted!");
    //       handleExitDelete();
    //       setPending(false);
    //       setFilterValue(( prev)=>({
    //         ...prev,
    //         filter : true
    //       })); 
    //       fetchHoldDataList(); // fetch hold-data list and update notification
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("error delete !");
    //     setPending(false);
    //     setLoader(false);
    //   });

    // fetchItemList();

    return () => (isSubscribed = false);
  };

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState("");
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //Filter data for invoice report

  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);

  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;

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

  //Fetch List Data for datatable
  const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    // setTblLoader(true);

    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/pos?page=${currentPage}&perPageShow=${perPageShow}`,
          {
            action: "getAllInvoicesList",
            filterValue: filterValue,
          }
        )
        .then((res) => {
          console.log("🚀 ~ .getAllInvoicesList ~ res:", res)
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

    return () => (isSubscribed = false);
  };

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  const actionButton = (invoice_id, status,is_hold) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (
            <li>
              <Link
                href={`/modules/pos/manage-order/details/${invoice_id}`}
              >
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}
          {accessPermissions.createAndUpdate && is_hold === 1 && (
            <li>
              <Link
                href={`/modules/pos/manage-order/update/${invoice_id}`}
              >
                <a>
                  <EditIcon />
                </a>
              </Link>
            </li>
          )}
          {status === 1 && (
            <li>
              {accessPermissions.delete && (
                <Link href="#">
                  <a onClick={() => handleOpenDelete(invoice_id)}>
                    <DeleteIcon />
                  </a>
                </Link>
              )}
            </li>
          )}
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: "Invoice Number",
      selector: (row) => row.sales_invoice,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => `${row?.first_name}  ${row?.last_name}`,
      sortable: true,
    },
    
    {
      name: "Invoice Date",
      selector: (row) => row.created_at,
      sortable: true,
    },
       
    {
      name: "Total Quantity",
      selector: (row) =>  {row.total_items},
      cell: row=> <div style={{textAlign:"center", width:"80%"}}>{row.total_items}</div>,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) =>  {row.total_amount} ,
      sortable: true, 
      cell: row=> <div style={{textAlign:"right",width:"80%"}}>{golbalCurrency[0]?.symbol}{row.total_amount}</div>
    },  
    {
      name: "Status",
      selector: (row) => row.payment_status == 1 ? <span className="text-success fw-bold"> Paid </span> : <span className="fw-bold text-danger ">Due</span>,
      sortable: true,
    }, 
    {
      name: "Action",
      selector: (row) => actionButton(row.id, row.status,row.payment_status),
    },
  ];

  const generatePDF = () => {
    PdfDataTable({ currentPage, rowsPerPage, filteredData, columns });
  };

  const printData = () => {
    PrintDataTable({ currentPage, rowsPerPage, filteredData, columns });
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    // { text: "Restaurant Invoices", link: "/modules/restaurant/food-order" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "", selected: true },
    { title: "Paid", value: 1 },
    { title: "Due", value: 0 }, 
  ]; 

  return (
    <>
      <HeadSection title="Restaurant Invoices" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Restaurant Invoices</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Link href={`/modules/restaurant/manage-order/create-inv`}>
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block
                      >
                        Create Order
                      </Button>
                    </Link>
                  )}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      invoiceId={invoice_id}
                      pending={pending}
                      loader={loader}
                    />
                  </Modal>
                </div>
              </div>

              <div className="card-body">
                <div className=" position-relative">
                  {accessPermissions.download && (
                    <PDFAndPrintBtn
                      currentPage={currentPage}
                      rowsPerPage={rowsPerPage}
                      data={filteredData[currentPage]}
                      columns={columns}
                      position={true}
                    />
                  )}
                  <ServiceFilter
                    statusList={dynamicStatusList}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    handleChangeFilter={handleChangeFilter}
                    dateFilter={false}
                    placeholderText="Voucher / Customer Name / Mobile"
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
      </div>
    </>
  );
}
