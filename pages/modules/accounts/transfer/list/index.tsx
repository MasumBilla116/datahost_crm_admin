import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { HeadSection, ViewIcon } from "../../../../../components";
import Axios from "../../../../../utils/axios";

import style from "./payment.module.css";
import FilterDatatable from "../../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../../components/Filter/ServiceFilter";
import { getSSRProps } from "../../../../../utils/getSSRProps";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "acnt.mng_trnfr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};




const List = ({accessPermissions}) => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [rows, setRows] = React.useState([]);
  const [payslip, setPayslip] = useState([]);

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

  // const getPayslipList = async () => {
  //   let isSubscribed = true;
  //   await http
  //     .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
  //       action: "getTransferList",
  //     })
  //     .then((res) => {
  //       if (isSubscribed) {
  //         
  //         setPayslip(res?.data);
  //         setFilteredData(res.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Server Error ~!");
  //     });

  //   return () => (isSubscribed = false);
  // };

  const getPayslipList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "getAllTransferList", filterValue: filterValue }
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

  /**Getting Data List */
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
          {accessPermissions.listAndDetails &&<li>
            <Link href={`/modules/accounts/transfer/details/${id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}
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
      name: "From Account",
      selector: (row) => row?.from_account?.account_name,
      sortable: true,
    },
    {
      name: "To Account",
      selector: (row) => row?.to_account?.account_name,
      sortable: true,
    },
    {
      name: "Acmount",
      selector: (row) => row?.amount,
      sortable: true,
    },
    {
      name: "AFT No.",
      selector: (row) => row?.slip_num,
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row?.remarks,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row?.created_at,
      sortable: true,
    },
    // {
    //   name: 'Active',
    //   selector: row => row.is_cancelled == 1 ?  <RedLed/> : <GreenLed />
    // },
    {
      name: "Action",
      selector: (row) => (row.is_cancelled == 1 ? "" : actionButton(row.id)),
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    {
      text: "All Balance Transfer List",
      link: "/modules/accounts/transfer/list",
    },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];
  return (
    <>
      <HeadSection title="List of Transfered Balance." />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2 ">
            <div className="card p-xs-2 ">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Balance Transfer List</h4>
              </div>
              <div className="card-body">
               
                  
                {/* slip_num */}

                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="AFT No"
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
