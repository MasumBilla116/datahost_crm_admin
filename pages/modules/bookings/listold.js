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
import { HeadSection } from "../../../components";
import PdfDataTable from "../../../components/PdfDataTable";
import PrintDataTable from "../../../components/PrintDataTable";
import EditIcon from "../../../components/elements/EditIcon";
import ViewIcon from "../../../components/elements/ViewIcon";
import { encrypt } from "../../../components/helpers/helper";
import Axios from "../../../utils/axios";

export default function ListView() {
  // custome http
  const { http } = Axios();

  // router
  const router = useRouter();
  const { pathname } = router;

  // toster
  const { notify } = MyToast();

  // state
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);
  const [filterValue, setFilterValue] = useState("all"); //daily, weekly, monthly, all
  const [choiceValue, setChoiceValue] = useState(""); //second filter option, active,pending,completed etc.
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // handler
  const handleChangeFilter = (val) => {
    setFilterValue(val);
    setSearch("");
    setChoiceValue("");
  };

  const handleChangeFilterChoice = (val) => {
    setChoiceValue(val);
    setSearch("");
  };

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
  }, [filterValue, startDate, endDate]);

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

  // filter
  useEffect(() => {
    let controller = new AbortController();
    const result = itemList?.filter((item) => {
      if (choiceValue === "active") {
        return item?.checkin_at !== null && item?.status === 1;
      } else if (choiceValue === "pending") {
        return item?.checkin_at === null && item?.status === 1;
      } else if (choiceValue === "cancelled") {
        return item?.status === 0;
      } else {
        return item?.status === 1;
      }
    });
    setFilteredData(result);
    return () => controller.abort();
  }, [choiceValue]);

  React.useEffect(() => {
    let sum = 0;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataOnCurrentPage = filteredData?.slice(startIndex, endIndex);
    dataOnCurrentPage?.forEach((row) => {
      const netAmount = parseFloat(row.net_amount);
      if (!isNaN(netAmount)) {
        sum += netAmount;
      }
    });
    setTotalSum(sum);
  }, [filteredData, currentPage, rowsPerPage]);

  // fetch data
  const fetchItemList = async () => {
    let isSubscribed = true;
    let formData = {
      action: "getAllBooking",
      filterValue: filterValue,
      startDate,
      endDate,
    };
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data?.data);
          setFilteredData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });
    return () => (isSubscribed = false);
  };

  // Action
  const actionButton = (inv_id, booking_id) => {
    const key = "123";
    const passphrase = `${booking_id}`;
    const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();
    const ids = encrypted.replace(/\//g, "--");
    return (
      <Link href={`/modules/bookings/invoice/${ids}`}>
        <a style={{ fontWeight: "bold" }}>{inv_id}</a>
      </Link>
    );
  };

  const action = (booking_id) => {
    const bookingId = encrypt(booking_id);
    return (
      <div className="flex-gap-inline">
        <Link href={`/modules/bookings/invoice/${bookingId}`}>
          <a>
            <ViewIcon />
          </a>
        </Link>
        <Link href={`/modules/bookings/${bookingId}`}>
          <a>
            <EditIcon />
          </a>
        </Link>
      </div>
    );
  };

  // data table
  const columns = [
    {
      name: "Invoice Number",
      selector: (row) => actionButton(row.invoice_id, row.id),
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
      name: "Booking Date",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Check-In Date",
      selector: (row) =>
        row.checkin_at ? moment(row.checkin_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Checkout Date",
      selector: (row) =>
        row.checkout_at ? moment(row.checkout_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => action(row.id),
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

  // pdf
  const generatePDF = () => {
    PdfDataTable({ currentPage, rowsPerPage, filteredData, columns });
  };
  const printData = () => {
    PrintDataTable({ currentPage, rowsPerPage, filteredData, columns });
  };

  return (
    <>
      <HeadSection title="All-Booking" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Bookings</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <Link href="/modules/bookings/create">
                    <a className="shadow rounded btn btn-primary">
                      Add New Booking{" "}
                    </a>
                  </Link>
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
                          name="booking_report"
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
                          <ToggleButton id="tbg-btn-5" value="deleted">
                            Deleted
                          </ToggleButton>
                          <ToggleButton id="tbg-btn-6" value="custom">
                            Custom
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                      <div className="PrintPdfBtn">
                        <button
                          className="pdfAndprintbutton"
                          onClick={generatePDF}
                        >
                          PDF
                        </button>
                        <button
                          className="pdfAndprintbutton"
                          onClick={printData}
                        >
                          Print
                        </button>
                      </div>
                    </div>
                    <div className="ms-auto ">
                      <ToggleButtonGroup
                        type="radio"
                        value={choiceValue}
                        name="filter_report"
                        onChange={handleChangeFilterChoice}
                      >
                        <ToggleButton
                          variant="outline-info"
                          id="tbg-btn-6"
                          value="active"
                        >
                          Active
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-info"
                          id="tbg-btn-7"
                          value="pending"
                        >
                          Pending
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-info"
                          id="tbg-btn-8"
                          value="cancelled"
                        >
                          Cancelled
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                  {filterValue === "custom" && (
                    <>
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
                              onChange={(event) => {
                                setStartDate(
                                  format(new Date(event), "yyyy-MM-dd")
                                );
                              }}
                              // variant="inline"
                              // openTo="year"
                              // views={["year", "month", "day"]}
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
                              // variant="inline"
                              // openTo="year"
                              // views={["year", "month", "day"]}
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
                    </>
                  )}
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <input
                        type="text"
                        placeholder="search by mobile or invoice no."
                        className="w-25 form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
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
                  <div>Total Sum on Current Page: {totalSum.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
