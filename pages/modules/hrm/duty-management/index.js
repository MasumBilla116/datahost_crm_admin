import React from "react";
import { getSSRProps } from "./../../../../utils/getSSRProps";
import AssignmentListView from "./assignment";
import RosterListView from "./roster";
import ShiftListView from "./shift";
import { HeadSection } from "../../../../components";
export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.dty",
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

        <div className="container-fluid">
          <HeadSection title="Duty-management" />
            {/* <div className="container"></div> */}
            <div className="row">
                <div className="col-12 col-md-6">
                    <RosterListView accessPermissions={accessPermissions}/>
                </div>
                <div className="col-12 col-md-6">
                    <ShiftListView accessPermissions={accessPermissions}/>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <AssignmentListView accessPermissions={accessPermissions}/>
                </div>
            </div>

        </div>
    );

}

export default PayrollDashboard;