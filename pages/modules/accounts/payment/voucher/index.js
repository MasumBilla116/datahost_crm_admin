import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FilterDatatable from "../../../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../../../components/Filter/ServiceFilter";
import PdfDataTable from "../../../../../components/PdfDataTable";
import PrintDataTable from "../../../../../components/PrintDataTable";
import ViewIcon from "../../../../../components/elements/ViewIcon";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";
import { HeadSection } from "../../../../../components";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.acnt.pmnt_vscr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const index = ({ accessPermissions }) => {
  const { http } = Axios();
  const { notify } = MyToast();

  const router = useRouter();
  const { pathname } = router;

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);

  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState("");

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
  // const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllPaymentVouchersList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {
            setFilteredData(prev => ({
              ...prev,
              total: res.data?.data?.total,
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
    const result = itemList?.filter((item) => {
      return item.voucher_no.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  const actionButton = (voucherId) => {
    return (
      <>
        <ul className="action">
         {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/accounts/payment/voucher/${voucherId}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: "Voucher No",
      selector: (row) => row.voucher_no,
      sortable: true,
    },
    {
      name: "Voucher Type",
      selector: (row) => row.voucher_type,
      sortable: true,
    },
    {
      name: "Payment Type",
      selector: (row) => row.payment_type,
      sortable: true,
    },

    {
      name: "From",
      selector: (row) => row.from_account,
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => row.to_account,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Voucher Date",
      selector: (row) => row.date,
      sortable: true,
    },
    // {
    //   name: 'Total Credit',
    //   selector: row => row.total_credit,
    //   sortable: true,
    // },
    // {
    //   name: 'Creator',
    //   selector: row => row.creator.name,
    //   sortable: true,
    // },
    // {
    //   name: 'Created At',
    //   selector: row => moment(row.created_at).format('DD/MM/YYYY'),
    //   sortable: true,
    // },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
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
    { text: "All Payment Vouchers", link: "/modules/accounts/payment/voucher" },
  ];


  const dynamicStatusList = [
    { title: "cheque", value: "cheque", selected: true },
    { title: "cash", value: "cash" },

  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Payment Vouchers" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Payment Vouchers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate && <Link href={`/modules/accounts/payment/voucher/create`}>
                  <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    block
                  >
                    Create Voucher
                  </Button>
                </Link>}

                {/* Delete Modal Form */}
                {/* <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} invoiceId={invoice_id} pending={pending} />
                </Modal> */}
              </div>
            </div>

            <div className="card-body p-xs-2  ">
              <div className="position-relative">

                {accessPermissions.download &&<PDFAndPrintBtn
                  currentPage={currentPage}
                  rowsPerPage={perPageShow}
                  data={filteredData[currentPage]}
                  columns={columns}
                  position={true}
                />}

                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={true}
                  placeholderText="Name"
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
