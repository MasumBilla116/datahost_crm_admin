import { createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HeadSection } from "../../../../components";
import ActiveCurrency from "../../../../components/ActiveCurrency";
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.invtr.stkrpt",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const index = ({ accessPermissions }) => {
  const [filteredData, setFilteredData] = useState([]);
  console.log("🚀 ~ index ~ filteredData:", filteredData)
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  // const pro = filteredData?.map((data) => {
  //   let per = (parseInt(data?.qty) / parseInt(data?.opening_stock)) * 100;
  // });

  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  // const [filterValue, setFilterValue] = useState("");
  const [choiceValue, setChoiceValue] = useState("");
  const [dobOpen, setDobOpen] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [category, setCategory] = useState([]);

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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [categoryId]);

  //Fetch List Data for datatable
  const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/stock?page=${currentPage}&perPageShow=${perPageShow}`,
          {
            action: "getAllStocksList",
            filterValue: filterValue,
          }
        )
        .then((res) => {
          console.log("🚀 ~ .then ~ res:", res);
          if (isSubscribed) {
            setItemList(res?.data?.data);
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

  useEffect(() => {
    const controller = new AbortController();
    const getCategories = async () => {
      let body = {};
      body = {
        action: "getAllCategories",
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,
          body
        )
        .then((result) => {
          setCategory(result.data.data);
          // console.log("new",result.data.data);
        });
    };

    getCategories();
    return () => controller.abort();
  }, []);

  const columns = [
    {
      name: "Item",
      selector: (row) => `${row.item_name} (${row?.item_type_name})`,
      sortable: true,
    }, 
    {
      name: "Current Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: "Unit Price",
      selector: (row) => (
        <>
          {" "}
          <ActiveCurrency /> {row.unit_price}
        </>
      ),
      sortable: true,
    }, 
    {
      name: "Sale Price",
      selector: (row) => (
        <>
          {" "}
          <ActiveCurrency /> {row.sales_price}
        </>
      ),
      sortable: true,
    }, 
    {
      name: "Total Sale Price",
      selector: (row) => (
        <>
          {" "}
          <ActiveCurrency /> {row.sales_price *  row.stock}
        </>
      ),
      sortable: true,
    }, 
    
     
  ]; 
  const handleChangeFilterChoice = (val) => {
    setChoiceValue(val);
    setSearch("");
    setCategoryId("");
  };

  const handleCategoryChoice = (val) => {
    setCategoryId(val.value);
    setChoiceValue("");
    setSearch("");
  };

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "orange" },
        },
      },
    },
  }); 

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Stock Items", link: "/modules/stock" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all" ,selected: true},
    { title: "In-Stock", value: "in_stock"},
    { title: "Stock Out", value: "stock_out" }, 
  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row">
        <div className="col-12 p-xs-2 ">
          <div className="card shadow">
            <HeadSection title="Stocks" />
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Stock Items</h4>
              </div>
            </div>
            <div className="card-body">
              <div className="custom-data-table position-relative">
                {accessPermissions.download && (
                  <PDFAndPrintBtn
                    currentPage={currentPage}
                    rowsPerPage={perPageShow}
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
                  placeholderText="Name"
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
  );
};

export default index;
