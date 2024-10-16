import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getSSRProps } from "../../../utils/getSSRProps";
import Axios from "./../../../utils/axios";
import { HeadSection } from "../../../components";


export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rstrnt",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};



const RestaurantDashboard = ({accessPermissions}) => {
    // custom http
  const { http } = Axios();

  // state
  const [TotalCount,setTotalCount] = useState({
    orders: 0,
    restaurantCategory: 0,
    foods: 0
  });
  const [MonthlyIncome , stMonthlyIncome] = useState(0);
  const [TodayFoodOrders,setTodayFoodOrders] = useState([]);
  const [MenuList,setMenuList] = useState([]);


  // data mining
  const FetchTotal = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/dashboard`, {
        action: "FetchTotal",
      })
      .then((res) => {
        setTotalCount({
            orders: res.data?.data.totalOrders ?? 0,
            restaurantCategory: res.data?.data?.restaurantCategory ?? 0,
            foods: res.data?.data?.totalFoods ?? 0
          });
          stMonthlyIncome(res.data?.data?.monthlyIncome ?? 0)
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  const FetchMenuList= async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/dashboard`, {
        action: "FetchMenuList",
      })
      .then((res) => {
        setMenuList(res.data?.data ?? []);
      })
      .catch((error) => {
        console.log("something worng: ", error);
      });
  };

  // useEffect
  useEffect(()=>{
    FetchTotal();
    FetchMenuList();
  },[])


   // table column
   const MenuListColumn = [
    {
      name: "S.I",
      selector: (row, index) => 1 + index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Menu Name",
      selector: (row) => row.name,
      sortable: true,
    },
     
  ];

    return (
        <div className="container-fluid">
           <HeadSection title="Restaurant" />
        {/* Start Row */}
        <div className="row">
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/income.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Monthly Income</h6>
                  <h2>{MonthlyIncome}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
         
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/assets.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Restaurant Category</h6>
                  <h2>{TotalCount.restaurantCategory}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 p-xs-2">
          <div className="card mb-xs-1">
            <div className="card-body">
              <div className="d-flex no-block">
                <div className="me-3 align-self-center">
                  <span className="lstick d-inline-block align-middle" />
                  <img src="/assets/images/icon/staff.png" alt="Income" />
                </div>
                <div className="align-self-center">
                  <h6 className="text-muted mt-2 mb-0">Total Foods</h6>
                  <h2>{TotalCount.foods}</h2>
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
                    <h3 className="card-title mb-1">
                      <span className="lstick d-inline-block align-middle" /> 
                    </h3> 
                  </div>
                  
                </div>
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
                  Menu List
                </h4>   
              </div>
              <DataTable
                columns={MenuListColumn}
                data={MenuList}
                highlightOnHover
                striped  
              />
            </div>
          </div>
        </div>
        {/* End Row */}
      </div>
    );

}

export default RestaurantDashboard;