import Link from "next/link";
import { useContext } from "react";
import DataTable from "react-data-table-component";
import EditIcon from "../elements/EditIcon";
import ViewIcon from "../elements/ViewIcon";
import themeContext from "./../context/themeContext";
import NavDawer from "./NavDawer";

const ResponsiveNavbar = (props) => {
  // context
  const context = useContext(themeContext);
  const {
    settingsObj,
    CurrencyInfoActive,
    setInvoiceLength,
    invoiceLength,
    setHoldDataNotification,
    holdDataNotification,
    fetchHoldDataList,
    setModuleItems,
    moduleNameString,
    breadcrumbList,
  } = context;

  // handler
  const goHome = () => {
    localStorage.setItem("activeModule", null);
    window.location.href = "/";
  };

  const actionButton = (tableId) => {
    return (
      <div>
        <ul className="action ">
          <li>
            <Link href={`/modules/restaurant/manage-order/update/${tableId}`}>
              <a
              //  onClick={() => handleOpen(tableId)}
              >
                <EditIcon />
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/modules/restaurant/manage-order/details/${tableId}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  // data-table
  const columns = [
    {
      name: "Date",
      selector: (row) => row.invoice_date,
      sortable: true,
    },
    {
      name: "Reference",
      selector: (row) => row.reference,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
    },
  ];

  return (
    <div className="w-100 d-flex justify-content-between align-items-center res-nav">
      <NavDawer />
      <div style={{ height: "45px" }}>
        <div
          onClick={goHome}
          className="d-block cursor-pointer"
          style={{ backgroundColor: "rgb(48, 86, 211)", paddingTop: "3.5px" }}
        >
          <img
            style={{ width: "95px", height: "35px" }}
            src="/assets/images/logo.png"
          />
        </div>
      </div>
      <div>
        <ul className="d-flex justify-content-end m-0 list-style-none">
          <li className="nav-item d-flex justify-content-center align-items-center">
            <div
              className="d-block"
              style={{
                width: "0.5px",
                height: "35px",
                opacity: ".3",
                marginBottom: "2px",
                backgroundColor: "white",
              }}
            ></div>
          </li>
          <li className="nav-item dropdown px-0">
            <a
              className="nav-link dropdown-toggle waves-effect waves-dark cust-dropdown-toggle notification-menu"
              href="#"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{ color: settingsObj?.text_color }}
            >
              <button
                type="button"
                className="btn btn-sm btn-info rounded-0"
                style={{
                  color: "black",
                  backgroundColor: "transparent",
                  height: "35px",
                  border: "none",
                }}
              >
                <i
                  className="fa fa-bell"
                  style={{
                    color: settingsObj?.text_color,
                    fontSize: "24px",
                  }}
                ></i>
                {holdDataNotification?.length > 0 && (
                  <span
                    className="badge"
                    style={{
                      top: "-5px",
                      right: "8px",
                    }}
                  >
                    {holdDataNotification.length}
                  </span>
                )}
              </button>
            </a>
            <div className="dropdown-menu dropdown-menu-end  animated flipInY cust-dropdown-style p-0">
              <ul className="list-style-none">
                <li>
                  <div
                    className="border-bottom py-3 px-4"
                    style={{ background: "#007BFF" }}
                  >
                    <div className="mb-0 font-weight-medium text-white">
                      Hold Data
                    </div>
                  </div>
                </li>
                <li>
                  <div className="message-center notifications position-relative">
                    <DataTable
                      columns={columns}
                      data={holdDataNotification}
                      highlightOnHover
                      subHeader={false}
                      striped
                    />
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveNavbar;
