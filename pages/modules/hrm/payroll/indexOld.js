import React from "react";
import { getSSRProps } from "../../../../utils/getSSRProps";
import ListSalary from "./salary";

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

const PayrollDashboard = ({accessPermissions}) => {


    return (

        <>
            <div className="row m-0">
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-12  "> 
                                <ListSalary accessPermissions={accessPermissions}/> 
                        </div>
                    </div>
                </div> 
                <div className="col-12 col-md-6">
                    
                </div>
            </div>

        </>
    );

}

export default PayrollDashboard;