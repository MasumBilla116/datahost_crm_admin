import React from "react";
import { getSSRProps } from "./../../../../utils/getSSRProps";
import ListSalary from "./salary";
import Generate from "../employee/salary/generate";
import BonusGenerate from "../employee/bonus/generate";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.pyrl",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const PayrollDashboard = ({ accessPermissions }) => {


  return (

    <>
      <div className="row m-0">
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12  ">
            
              <Generate />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <ListSalary accessPermissions={accessPermissions} />
        </div>
      </div>
      <div className="row m-0">
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12  ">
            
              <BonusGenerate />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          {/* <ListSalary accessPermissions={accessPermissions} /> */}
        </div>
      </div>

    </>
  );

}

export default PayrollDashboard;