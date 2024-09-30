import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import DataTable from "react-data-table-component";
import HeadSection from "../../../../components/HeadSection";
import toast from "../../../../components/Toast/index";
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import ViewIcon from "../../../../components/elements/ViewIcon";
import TablePlaceholder from "../../../../components/placeholder/TablePlaceholder";
import Axios from "../../../../utils/axios";
// import { DatePicker } from "react-bootstrap";

import { getSSRProps } from "./../../../../utils/getSSRProps";
export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.lvaplctn",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

export default function TableList({ accessPermissions }) {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [applications, setApplicationList] = useState([]);
  const [allApplication, setAllApplication] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [dobOpen, setDobOpen] = useState(false);
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // setOpenStartDate,setDobOpenEndDate
  const [selectedOption, setSelectedOption] = useState("");

  //Filter data for booking report

  const [filterValue, setFilterValue] = useState("all");

  const handleChangeFilter = (val) => {
    setFilterValue(val);
    setSearch("");
  };

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }
  const data = applications?.data;

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      applicationList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, startDate, endDate]);

  const applicationList = async () => {
    let isSubscribed = true;
    let formData = {
      action: "allLeaveApplication",
      filterValue: filterValue,
      startDate,
      endDate,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, formData)
      .then((res) => {
        setApplicationList(res.data);
        setFilteredData(res?.data?.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((applicaint) => {
      return applicaint.name.toLowerCase().match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  async function deleteApplication(id) {
    //setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, {
        action: "deleteLeaveApplication",
        application_id: id,
      })
      .then((res) => {
        notify("success", "successfully has been deleted!");
        //setLoading(false);
      });
    applicationList();
  }

  if (loading)
    return (
      <>
        <HeadSection title="All-Leave-Applications" />

        <TablePlaceholder header_name="All-Leave-Applications" />
      </>
    );

  const columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Employee Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row?.subject,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.title,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row?.date,
      sortable: true,
    },
    {
      name: "Leave-Type",
      selector: (row) => (row?.isHalfday == 1 ? "Half-Day" : "Full-Day"),
      sortable: true,
    },

    {
      name: "Created At",
      selector: (row) => row?.created_at,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
    },
  ];

  const actionButton = (id) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && (
            <li>
              <Link href={`/modules/hrm/leave-application/details/${id}`}>
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}

          {accessPermissions.delete && (
            <li>
              <Link href="#">
                <a onClick={() => deleteApplication(id)}>
                  <DeleteIcon />
                </a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Leave-Applications", link: "/modules/hr/leaveApplications" },
  ];

  return (
    <>
      <HeadSection title="All-Leave-Applications" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card mb-xs-1 shadow">
              <div className="d-flex border-bottom title-part-padding justify-content-between align-items-center">
                <div className=" title-part-padding">
                  <h4 className="card-title mb-0">All Leave-Applications</h4>
                </div>
                <div className="text-center">
                  {accessPermissions.createAndUpdate && (
                    <Link href="/modules/hrm/leave-application/addEmployeesLeave">
                      <Button
                        className="shadow rounded btn-sm mb-2 mt-2"
                        variant="primary"
                        type="button"
                        style={{ marginRight: "10px" }} // Adjust the margin-right as needed
                      >
                        New Application
                      </Button>
                    </Link>
                  )}

                  {/* {accessPermissions.createAndUpdate && (
                    <Link href="/modules/hrm/leave-application/addEmployeesLeave">
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                      >
                        Add Leave
                      </Button>
                    </Link>
                  )} */}
                </div>
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <div className="d-flex align-items-center">
                    <div className="flex-gap">
                      <div>
                        <ToggleButtonGroup
                          type="radio"
                          value={filterValue}
                          name="invoice_report"
                          onChange={handleChangeFilter}
                        >
                          <ToggleButton id="tbg-btn-0" value="all">
                            All
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-1" value="daily">
                            Daily
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-2" value="weekly">
                            Weekly
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-3" value="monthly">
                            Monthly
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-4" value="yearly">
                            Yearly
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-5" value="custom">
                            Custom
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>

                      {filterValue === "custom" && (
                        <>
                          <div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                size={1}
                                label="From"
                                open={dobOpenStartDate}
                                onClose={() => setDobOpenStartDate(false)}
                                value={startDate}
                                inputFormat="yyyy-MM-dd"
                                onChange={(event) => {
                                  setStartDate(
                                    format(new Date(event), "yyyy-MM-dd")
                                  );
                                }}
                                variant="inline"
                                openTo="year"
                                views={["year", "month", "day"]}
                                renderInput={(params) => (
                                  <ThemeProvider theme={theme}>
                                    <TextField
                                      onClick={() => setDobOpenStartDate(true)}
                                      fullWidth={true}
                                      size="small"
                                      {...params}
                                      required
                                    />
                                  </ThemeProvider>
                                )}
                              />
                            </LocalizationProvider>
                          </div>
                          <div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                size={1}
                                label="To"
                                open={dobOpenEndDate}
                                onClose={() => setDobOpenEndDate(false)}
                                value={endDate}
                                inputFormat="yyyy-MM-dd"
                                onChange={(event) => {
                                  setEndDate(
                                    format(new Date(event), "yyyy-MM-dd")
                                  );
                                }}
                                variant="inline"
                                openTo="year"
                                views={["year", "month", "day"]}
                                renderInput={(params) => (
                                  <ThemeProvider theme={theme}>
                                    <TextField
                                      onClick={() => setDobOpenEndDate(true)}
                                      fullWidth={true}
                                      size="small"
                                      {...params}
                                      required
                                    />
                                  </ThemeProvider>
                                )}
                              />
                            </LocalizationProvider>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="ms-auto "></div>
                  </div>

                  <div className="custom-data-table">
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="search..."
                            className="w-25 form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                      }
                      striped
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
