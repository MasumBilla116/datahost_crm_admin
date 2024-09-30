import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import themeContext from "../../../components/context/themeContext";
import Loader from "../../../components/Loader";
import { getSSRProps } from "../../../utils/getSSRProps";
import Axios from "./../../../utils/axios";
import { CheckAccessCode } from "./../../../utils/CheckAccessCode";
import { HeadSection } from "../../../components";
export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.cstmr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const CustomerDashboard = ( {
  permission,
  query,
  accessPermissions
}) => { 
  // custome http
  const { http } = Axios();

  // state
  const [allCustomer, setAllCustomer] = useState([]);
  const [totalGeneralCustomer, setTotalGeneralCustomer] = useState(0);
  const [totalCorporateCustomer, setTotalCorporateCustomer] = useState(0);
  const [loading, setLoading] = useState(false);

  const context = useContext(themeContext);
  const {userId,accessType } = context;

  // fetch data
  const countCustomer = async () => {
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/dashboard`,
        {
          action: "countCustomer",
        }
      )
      .then((res) => {
        setTotalCorporateCustomer(res.data?.data?.corporate_cust_count ?? []);
        setTotalGeneralCustomer(res.data?.data?.general_cust_count ?? 0);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const FetchAllCustomer = async () => {
    setLoading(true);
    try {
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/dashboard`,
        {
          action: "allCustomer",
        }
      );

      setAllCustomer(res.data?.data ?? []);
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect
  useEffect(() => {
    FetchAllCustomer();
    countCustomer();
  }, []);

  // table column
  const salesColumns = [
    {
      name: "SL",
      selector: (row, index) => 1 + index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Nationality",
      selector: (row) => row.nationality,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.arrival_from,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => (row.customer_type == 1 ? "Corporate" : "General"),
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          {CheckAccessCode("m.cstmr.gnrl.list_dtls", userId, permission) && (
            <Link
              href={
                row.customer_type === 1
                  ? `/modules/customer/corporate/details/${row.id}`
                  : `/modules/customer/general/details/${row.id}`
              }
            >
              <a className="btn btn-sm btn-info">
                Details
              </a>
            </Link>
          )}
        </>
      ),
    },
  ];



  return (
    <div className="container-fluid">
       <HeadSection title="Customer Dashbord" />
      {/* Start Row */}
      <div className="row">
        <div className="col-lg-6 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/income.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">
                    Total Genaral Customer
                  </h6>
                  <h2>{totalGeneralCustomer}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/expense.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">
                    Total Corporate Customer
                  </h6>
                  <h2>{totalCorporateCustomer}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
      {/* Start row */}
      <div className="row">
        <div className="col-lg-9 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <div className="d-md-flex">
                <div>
                  <h3 className="card-title mb-1 text-uppercase font-weight-bold">
                    <span className="lstick d-inline-block align-middle" />
                    All Customers
                  </h3>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <DataTable
                    columns={salesColumns}
                    data={allCustomer?.slice(0, 10)}
                    highlightOnHover
                    striped
                  />
                  {/* <div className="custom-container">
                    <Link href={`/modules/customer/general`}>
                      <a className="custom-link">View All Cusomers</a>
                    </Link>
                  </div> */}
                </>
              )}
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------- */}
        {/* visit charts*/}
        {/* -------------------------------------------------------------- */}
        <div className="col-lg-3 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <h4 className="card-title">
                <span className="lstick" />
              </h4>
              <h5 style={{ color: "gray" }}> </h5>
              <div
                id="Visit-Separation"
                style={{ height: "290px", width: "100%" }}
                className="d-flex justify-content-center align-items-center"
              />
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
    </div>
  );
};

export default CustomerDashboard;
