import MyToast from "@mdrakibul8001/toastify";
import { createTheme } from "@mui/material/styles";
import format from "date-fns/format";
import Link from "next/link";
import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import DateRangeForm from "../../../../components/DateRangeForm";
import AttendanceTable from "../../../../components/attendance_table/attendance_table";
import Axios from "../../../../utils/axios";
import { calculateWorkHours } from "../../../../utils/utils";
import Entry from "./entry";
import Missing from "./missing";


import ViewIcon from "../../../../components/elements/ViewIcon";
import { getSSRProps } from "./../../../../utils/getSSRProps";
import Reconciliation from "./reconciliation";
import ManageIp from "./manageIp";
import { HeadSection } from "../../../../components";
export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: " 	m.hrm.atnd",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};


const Attendance = ({ accessPermissions }) => {
  const { http } = Axios();
  const { notify } = MyToast();
  // loader
  const [loading, setLoading] = useState(false);
  //   popup clock
  // handle in clock
  const [openFromDate, setOpenFromDate] = useState(false);
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  // handle out-time handle
  const [openToDate, setOpenToDate] = useState(false);
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tableData, setTableData] = useState([]);

  // date-time theme
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  // table field and data
  const columns = [
    {
      name: "SL",
      selector: row => row.si,
      sortable: true,
      width: "75px",
    },
    {
      name: "Employee Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "In Time",
      sortable: true,
      selector: (row) => {
        if (row.in_time === null) return "---";
        else return row.in_time;
      },
    },
    {
      name: "Last In Time",
      sortable: true,
      selector: (row) => {
        if (row.in_time === null) return "---";
        else return row.in_time;
      },
    },
    {
      name: "Last Out Time",
      sortable: true,
      selector: (row) => {
        if (row.out_time === null) return "---";
        else return row.out_time;
      },
    },
    {
      name: "Worked Hourse",
      sortable: true,
      selector: (row) => calculateWorkHours(row.in_time, row.out_time),
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
      cell: (row) => (<ul className="action">
        {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/attendance/log_details?emp=${row.emp_id}`}>
            <a >
              <ViewIcon />
            </a>
          </Link>
        </li>
        }
      </ul>
      ),
    },
  ];

  const submitForm = async (formData) => {
    setTableData([]);
    try {
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/attendance`,
        formData
      );
      setLoading(false);

      if (
        res.data.status === "success" &&
        Array.isArray(res.data.data) &&
        res.data.data.length > 0
      ) {
        const tbl_data = res.data.data?.map((row, index) => ({
          si: index + 1,
          inTime: row?.in_time,
          outTime: row?.out_time,
          ...row,
        }));
        setTableData(tbl_data);
      }
    } catch (e) {
      // Handle error
      // console.log(e);
    }
  };
  return (
    <>
            <HeadSection title="Attendance" />

      <div className="container-fluid">
        <div className="row ">
          <div className="col-md-7 p-xs-2">
            <div className="card mb-xs-2">
              <div className="card-body">

                <DateRangeForm onSubmit={submitForm} loading={loading}  />
                <AttendanceTable
                  columns={columns}
                  rows={tableData}
                  pagination={false}
                  searchbar={true}
                // subHeaderComponent={
                //   <DateRangeForm onSubmit={submitForm} loading={loading} />
                // }
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5 p-xs-2">
            <Entry accessPermissions={accessPermissions} />
            <Reconciliation/>
            <Missing accessPermissions={accessPermissions} />
            <ManageIp/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
