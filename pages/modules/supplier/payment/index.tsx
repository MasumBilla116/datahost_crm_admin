import Link from "next/link";
import React, { useState } from "react";
import { HeadSection, ViewIcon } from "../../../../components";
import Axios from "../../../../utils/axios";

import { useRouter } from "next/router";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import style from "./payment.module.css";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.splr.make_pmnt",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const List = ({ accessPermissions }) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [filteredData, setFilteredData] = useState([]);
  const [itemList, setItemList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  const [search, setSearch] = useState("");
  const [rows, setRows] = React.useState([]);
  const [payslip, setPayslip] = useState([]);

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

  const data = itemList?.data;
  // const getPayslipList = async () => {
  //   let isSubscribed = true;
  //   await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "getPaySlip" })
  //     .then((res) => {
  //       if (isSubscribed) {
  //         setItemList(res?.data);
  //         setPayslip(res?.data);
  //         setFilteredData(res.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Server Error ~!")
  //     });

  //   return () => isSubscribed = false;
  // };

  const getPayslipList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts?page=${currentPage}&perPageShow=${perPageShow}`,
          {
            action: "getPaySlipList",
            filterValue: filterValue,
          }
        )
        .then((res) => {
          if (isSubscribed) {
            // setItemList(res?.data);
            // setFilteredData(res.data?.data);
            setFilteredData((prev) => ({
              ...prev,
              total: res.data?.data?.total,
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

  /**Getting Supplier List */
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getPayslipList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  const handleDelete = async (id: any) => {
    let body: any = {};

    body = {
      action: "delete",
      id: id,
    };
    await http.post(
      `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
      body
    );
  };

  const actionButton = (id: any) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (
            <li>
              <Link href={`/modules/supplier/payment/payslip/${id}`}>
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}
          {accessPermissions.createAndUpdate && (
            <li>
              <Link href={`/modules/accounts/update/${id}`}>
                <a>{/* <EditIcon /> */}</a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.is_cancelled == 1,
      style: {
        backgroundColor: "rgba(243, 59, 42, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const RedLed = () => {
    return (
      <div className={style.ledbox}>
        <div className={style.ledred}></div>
        <p>Yellow LED</p>
      </div>
    );
  };
  const GreenLed = () => {
    return (
      <div className={style.ledbox}>
        <div className={style.ledgreen}></div>
        <p>Yellow LED</p>
      </div>
    );
  };

  const columns = [
    {
      name: "Slip",
      selector: (row) => row.slip,
      sortable: true,
    },
    {
      name: "Payee",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Acmount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Payment Type ",
      selector: (row) => row.payment_type,
      sortable: true,
    },
    {
      name: "Pay Type",
      selector: (row) => row.pay_type,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => (row.is_cancelled == 1 ? "Inactive" : "Active"),
    },
    {
      name: "Action",
      selector: (row) => (row.is_cancelled == 1 ? "" : actionButton(row.id)),
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Payslip List", link: "/modules/supplier/payment" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <HeadSection title="Payslip List" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Payslip List</h4>
              </div>
              <div className="card-body">
                <div className="custom-data-table position-relative">
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
                    dateFilter={false}
                    placeholderText="Name / Slip NUmber / Mobile Number"
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
};

export default List;
