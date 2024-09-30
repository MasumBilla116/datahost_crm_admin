import MyToast from "@mdrakibul8001/toastify";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as CryptoJS from "crypto-js";
import { format } from "date-fns";
import * as moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import DataTable from "react-data-table-component";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { EditIcon, HeadSection, ViewIcon } from "../../../components";
import Loader from "../../../components/Loader";
import { decrypt, encrypt } from "../../../components/helpers/helper";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
import { getBookingStatus } from "../../../utils/utils";
import PDFAndPrintBtn from "./../../../components/Filter/PDFAndPrintBtn";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.bkng.mng",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

export default function ListView({ accessPermissions }) {
  // custome http
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();
  const { url_status, url_platform, start_date, end_date } = router.query; 
  // state
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  const [filterValue, setFilterValue] = useState("all");
  const [choiceValue, setChoiceValue] = useState("pending");
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);

  const currentDate = new Date();
  const defaultEndDate = format(currentDate, "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(
    startDate ? startDate : defaultEndDate
  );
  const [endDate, setEndDate] = useState(endDate ? endDate : defaultEndDate);
  const initialBookingStatus = url_status ||  "pending";
  const initialplatform = url_platform || "all";
  const [platFormValue, setPlatFormValue] = useState(url_platform);
  const [bookingStatus, setBookingStatus] = useState(url_status);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");


  const handleChangeFilter = (val) => {
    setFilterValue(val);
    setSearch("");
    setChoiceValue("");
    router.push(
      `/modules/bookings/list?url_status=${choiceValue}&url_platform=${val}&start_date=${startDate}&end_date=${endDate}`
    );
  };

  const handleChangeFilterChoice = (val) => {
    setChoiceValue(val);
    setSearch("");
    console.log("booking status: ",val)
    router.push(
      `/modules/bookings/list?url_status=${val}&url_platform=${filterValue}&start_date=${startDate}&end_date=${endDate}`
    );
  };

  const handleStartDatePickerChange = (selectedDate) => {
    setStartDate(format(new Date(selectedDate), "yyyy-MM-dd"));
    setDobOpenStartDate(false);
    setSearch("");
    // setChoiceValue("");
    router.push(
      `/modules/bookings/list?url_status=${choiceValue}&url_platform=${filterValue}&start_date=${format(
        new Date(selectedDate),
        "yyyy-MM-dd"
      )}&end_date=${endDate}`
    );
  };

  const handleEndDatePickerChange = (selectedDate) => {
    setEndDate(format(new Date(selectedDate), "yyyy-MM-dd"));
    setDobOpenEndDate(false);
    setSearch("");
    // setChoiceValue("");
    router.push(
      `/modules/bookings/list?url_status=${choiceValue}&url_platform=${filterValue}&start_date=${startDate}&end_date=${format(
        new Date(selectedDate),
        "yyyy-MM-dd"
      )}`
    );
  };

  useEffect(() => {
    setBookingStatus(url_status === undefined ? "pending" : url_status);
    setFilterValue(url_platform === undefined ? "all" : url_platform);
    setStartDate(start_date === undefined ? startDate : start_date);
    setEndDate(end_date === undefined ? endDate : end_date);
    // setMonth_year(url_month_year);
  }, [router.query]);

  // theme
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  // useEffect
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, bookingStatus, startDate, endDate]);

  // search data
  useEffect(() => {
    let controller = new AbortController();
    const result = itemList?.filter((item) => {
      return (
        item?.invoice_id?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item?.mobile?.includes(search)
      );
    });
    setFilteredData(result);
    return () => controller.abort();
  }, [search]);

  React.useEffect(() => {
    let sum = 0;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataOnCurrentPage = filteredData?.slice(startIndex, endIndex);
    dataOnCurrentPage?.forEach((row) => {
      const netAmount = parseFloat(row.total_amount);
      if (!isNaN(netAmount)) {
        sum += netAmount;
      }
    });
    setTotalSum(sum);
  }, [filteredData, currentPage, rowsPerPage]);

  // fetch data
  const fetchItemList = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data

      let formData = {
        action: "getAllBooking",
        platform: filterValue,
        status: bookingStatus,
        // month_year: endDate,
        startDate: startDate,
        endDate: endDate,
      };

      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
        formData
      );
      setResponse(res?.data?.response);
      setItemList(res?.data?.data);
      setFilteredData(res?.data?.data);
      
    } catch (err) {
      console.log("Server Error ~!");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Action
  const actionButton = (inv_id, booking_id, platform) => {
    const key = "123";
    const passphrase = `${booking_id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();
    const bookingId = encrypted.replace(/\//g, "--");
    return (
      <>
        {accessPermissions.listAndDetails && (
          <Link
            href={`/modules/bookings/invoice/${
              platform === "FrontDesk" || platform === null
                ? "frontDesk"
                : "frontDesk"
            }/${bookingId}`}
          >
            <a style={{ fontWeight: "bold" }}>{inv_id}</a>
          </Link>
        )}
      </>
    );
  };

  const handleClone = async (bookingId) => { 
    let param = decrypt(bookingId);
    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`,
        { action: "cloneCustomerBooking", bookingId: param }
      )
      .then((res) => {  
        const booking_id = encrypt(res?.data?.data?.booking_id); 
        if (res?.data?.status == "success") {
          router.push(`/modules/bookings/${booking_id}`);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response; 
      });
  };

  const action = (booking) => {
    const bookingId = encrypt(booking?.id);
    return (
      <>
        <ul className="action">
          {/* {booking?.platform === "FrontDesk" ? (
            <li>
              
              {accessPermissions.listAndDetails && (
                <Link href={`/modules/bookings/invoice/frontDesk/${bookingId}`}>
                  <a><ViewIcon /></a>
                </Link>
              )}
            </li>
          ) : (
            <li>
              
              {accessPermissions.listAndDetails && (
                <Link href={`/modules/bookings/invoice/others/${bookingId}`}>
                  <a>
                    <ViewIcon />
                  </a>
                </Link>
              )}
            </li>
          )} */}
          <li>
              {accessPermissions.listAndDetails && (
                <Link href={`/modules/bookings/invoice/frontDesk/${bookingId}`}>
                  <a><ViewIcon /></a>
                </Link>
              )}
            </li>
          {accessPermissions.createAndUpdate && (
            <li>
              <Link href={`/modules/bookings/${bookingId}`}>
                <a>
                  <EditIcon />
                </a>
              </Link>
            </li>
          )}

          {accessPermissions.createAndUpdate && (
            <li>
              {/* <Link href={`/modules/bookings/${bookingId}`}>
              <a className="btn btn-success me-2 btn-sm" >
                Clone
              </a>
            </Link> */}

              <Link href="#">
                <a
                  className="btn btn-success me-2 btn-sm"
                  onClick={() => handleClone(bookingId)}
                >
                  Clone
                </a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

 
  
  // data table
  const columns = [
    {
      name: "Invoice Number",
      selector: (row) => actionButton(row.invoice_id, row.id, row.platform),
      sortable: true,
    },
    {
      name: "Booking",
      selector: (row) => row.checkout_type,
      sortable: true,
      width:"120px"
    },
    {
      name: "platform",
      selector: (row) => row.platform,
      sortable: true,
      width:"120px"
    },
    {
      name: "Customer",
      selector: (row) => (row.first_name )+ " " + (row?.last_name == null ? "" : row.last_name),
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    }, 
    {
      name: "Check-In",
      selector: (row) =>
        row.date_from ? moment(row.date_from).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Checkout",
      selector: (row) =>
        row.date_to ? moment(row.date_to).format("DD/MM/YYYY") : "-",
      sortable: true,
    },  
    {
      name: "Room No",
      selector: (row) => row.room_no ?? "---",
      sortable: true,
      center: true,
      width:"120px"
    },
    {
      name: "Booking",
      selector: (row) => getBookingStatus(row.status,true),
      sortable: true,
      center: true,
    },
    {
      name: "Action",
      selector: (row) => action(row),
      center: true,
      // width: "15%",
    },
  ];


  const PDFAndPrintcolumns = [
    {
      name: "Invoice Number",
      selector: (row) => row.invoice_id,
      sortable: true,
    },
    {
      name: "Booking Type",
      selector: (row) => row.checkout_type,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.net_amount,
      sortable: true,
      footer: (
        <div>
          Total: {totalSum.toFixed(2)} {/* Display the total sum */}
        </div>
      ),
    },
    {
      name: "Booking",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Check-In",
      selector: (row) =>
        row.checkin_at ? moment(row.checkin_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Checkout",
      selector: (row) =>
        row.checkout_at ? moment(row.checkout_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },

    {
      name: "Checkout Date",
      selector: (row) =>
        row.checkout_at ? moment(row.checkout_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Assign Room",
      selector: (row) => row.room_id || "-",
      center: true, // Center the content in this column
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.status === 0,
      style: {
        backgroundColor: "crimson",
        color: "white",
      },
    },
  ];

  return (
    <>
      <HeadSection title="All-Booking" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Bookings</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Link href="/modules/bookings/create">
                      <a className="shadow rounded btn btn-primary btn-sm">
                        Add New Booking{" "}
                      </a>
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="flex-gap mt-3">
                  <div>
                    <ToggleButtonGroup
                      type="radio"
                      value={bookingStatus}
                      name="filter_report"
                      onChange={handleChangeFilterChoice}
                    >
                       <ToggleButton
                        variant="outline-info"
                        id="tbg-btn-11"
                        value="pending"
                        active={bookingStatus === "pending"}
                      >
                        Pending
                      </ToggleButton>

                      <ToggleButton
                        variant="outline-info"
                        id="tbg-btn-12"
                        value="booked"
                        active={bookingStatus === "booked"}
                      >
                        Booked
                      </ToggleButton>
                     

                      <ToggleButton
                        variant="outline-info"
                        id="tbg-btn-13"
                        value="checked-in"
                        active={bookingStatus === "checked-in"}
                      >
                        Checked-In
                      </ToggleButton>
                      
                       <ToggleButton
                        variant="outline-info"
                        id="tbg-btn-14"
                        value="cancelled"
                        active={bookingStatus === "cancelled"}
                      >
                        Cancelled
                      </ToggleButton>  

                      <ToggleButton
                        variant="outline-info"
                        id="tbg-btn-15"
                        value="rejected"
                        active={bookingStatus === "rejected"}
                      >
                        Reject
                      </ToggleButton>

                    </ToggleButtonGroup>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="flex-gap">
                    <div>
                      <ToggleButtonGroup
                        type="radio"
                        value={filterValue}
                        name="booking_report"
                        onChange={handleChangeFilter}
                      >
                        <ToggleButton
                          id="tbg-btn-0"
                          value="all"
                          variant="outline-info"
                          active={filterValue === "all"}
                        >
                          All
                        </ToggleButton>
                        <ToggleButton id="tbg-btn-1" value="FrontDesk" variant="outline-info">
                          Front Desk
                        </ToggleButton>
                        <ToggleButton id="tbg-btn-2" value="Web" variant="outline-info">
                          Web Site
                        </ToggleButton>
                        <ToggleButton id="tbg-btn-3" value="Channel" variant="outline-info">
                          Channel
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                </div>
                <div className="flex-gap">
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        size={1}
                        label="From"
                        open={dobOpenStartDate}
                        onClose={() => setDobOpenStartDate(false)}
                        value={startDate}
                        inputFormat="yyyy-MM-dd"
                        onChange={(selectedDate) =>
                          handleStartDatePickerChange(selectedDate)
                        }
                        variant="inline"
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
                        onChange={(selectedDate) =>
                          handleEndDatePickerChange(selectedDate)
                        }
                        variant="inline"
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
                </div>
                <div>
                  {loading ? (
                    <Loader /> // Show the loader when loading is true
                  ) : (
                    <>
                      {filteredData?.length === 0 ? (
                        <p
                          className="text-center d-flex align-items-center justify-content-center text-muted font-weight-bold"
                          style={{
                            height: "50vh",
                            fontSize: "1.5rem",
                            opacity: 0.7,
                          }}
                        >
                          {/* No booking on this date range */}

                          {response}
                        </p>
                      ) : (
                        <div className="custom-data-table">
                          <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            subHeader
                            subHeaderComponent={
                              <div className="row">
                                <div className="col-lg-8 col-md-6 col-sm-12"></div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <div className="d-flex position-relative">
                                    <input
                                      type="text"
                                      placeholder="search by mobile or invoice no."
                                      className=" me-3  form-control"
                                      value={search}
                                      onChange={(e) =>
                                        setSearch(e.target.value)
                                      }
                                    />
                                    <div className="mt-2">
                                      {accessPermissions.download && (
                                        <PDFAndPrintBtn
                                          currentPage={currentPage}
                                          rowsPerPage={rowsPerPage}
                                          data={filteredData}
                                          columns={PDFAndPrintcolumns}
                                          position={false}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                            striped
                            paginationPerPageOptions={[10, 25, 50]}
                            paginationRowsPerPage={rowsPerPage}
                            onChangeRowsPerPage={(currentRowsPerPage) =>
                              setRowsPerPage(currentRowsPerPage)
                            }
                            customStyles={{
                              headRow: {
                                style: {
                                  background: "#eee",
                                  fontWeight: "bold",
                                  fontSize: ".9rem",
                                  color: "#464545",
                                },
                              },
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {filteredData?.length === 0 ? (
                    ""
                  ) : (
                    <>Total Sum on Current Page: {totalSum.toFixed(2)}</>
                  )}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
