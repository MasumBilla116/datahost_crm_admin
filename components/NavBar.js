import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Axios from "../utils/axios";
import { removeCookie } from "../utils/Cookie";
import { CheckAccessCode } from "./../utils/CheckAccessCode";
import themeContext from "./context/themeContext";
import EditIcon from "./elements/EditIcon";
import ViewIcon from "./elements/ViewIcon";
import NavDrawer from "./header/NavDawer";
import ResponsiveNavbar from "./header/ResponsiveNavbar";
import OnlyLogo from "./OnlyLogo";
export default function NavBar() {
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
    toggleDrawer,
    setDawer,
    dawer,
    permission,
    userId,
    golbalCurrency,
    //  setGlobalCurrencies
     setGlobalCurrencies
  } = context;
  const { token, logout, user, http } = Axios();
  const [active, setActive] = useState(false);
  const [currency, setCurrency] = useState("");
  const logoutHandle = async () => {
    if (token != undefined) {
      await removeCookie("stayin");
      await removeCookie("permissions");
      logout();
    }
  };

  useEffect(() => {
    let isMount = true;

    if (user) {
      if (isMount) {
        setActive(true);
      }
    }

    return () => {
      isMount = false;
    };
  }, [user, active]);

  const [selectedCurrency, setSelectedCurrency] = useState({
    value: "",
    label: "Select...",
  });
  useEffect(()=>{
    setSelectedCurrency(

    {
      value: golbalCurrency[0]?.id,
      label: golbalCurrency[0]?.name,
      symbol: golbalCurrency[0]?.symbol,
      exchange_rate: golbalCurrency[0]?.exchange_rate
    })
  },[golbalCurrency])

  useEffect(() => {
    (async () => {
      let isSubscribed = true;
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/business-settings`,
          {
            action: "settingsInfo",
            key: "system_default_currency",
          }
        )
        .then((res) => {
          if (isSubscribed) {
            setSelectedCurrency(res.data?.data?.currency_info);
          }
        })
        .catch((err) => {
          console.log("Server Error ~!");
        });

      return () => (isSubscribed = false);
    })();
  }, []);

  //select2 width
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 200, // Change this to the desired select2 width
    }),
  };

  // router
  const router = useRouter();

  //Status
  const [currencies, setCurrencies] = useState([]);
  const [system_default_currency, setDefaultCurrency] = useState(null);
  const [types, setTypes] = useState(["system_default_currency"]);

  // Data table columns
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
  // data mining

  const getAllActiveCurrencies = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/currency`, {
        action: "activeCurrency",
      })
      .then((res) => {
        if (isSubscribed) {
          setCurrencies(res.data?.data);
          setGlobalCurrencies(res?.data?.data)
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  const update = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/business-settings`, {
        action: "update",
        types: types,
        system_default_currency: system_default_currency,
      })
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res.data?.response}`);
          CurrencyInfoActive();
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
        const msg = err.response?.data?.response;

        if (typeof err.response?.data?.response == "string") {
          notify("error", `${err.response.data.response}`);
        }
      });

    CurrencyInfoActive();

    return () => (isSubscribed = false);
  };
  const actionButton = (tableId) => {
    return (
      <div>
        <ul className="action ">
          <li>
            <Link href={`/modules/restaurant/manage-order/update/${tableId}`}>
              <a>
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

  const goHome = () => {
    localStorage.setItem("activeModule", null);
    window.location.href = "/";
  };

  // useEffect
  useEffect(() => {
    getAllActiveCurrencies();
  }, [getAllActiveCurrencies]);
  useEffect(() => {
    if (system_default_currency != null) {
      update();
    }
  }, [system_default_currency]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHoldDataList();
    });
    return () => clearTimeout(timeout);
  }, []);

  const [accessibleModules, setAccessibleModules] = useState([]);
  // useEffect
  const [countModules, setCountModules] = useState(0);

  useEffect(() => {
    if (permission !== undefined && permission !== null) {
      var count = 0;
      if (countModules === 0) {
        permission?.filter((item) => {
          const module_item = item.split(".");
          if (module_item.length === 2) {
            count += 1;
          }
        });
        setCountModules(count);
      }
    }
  }, [userId]);




  const [hrefValues, setHrefValues] = useState([]);
  
  useEffect(() => {
    if(window !== undefined)
      { 
        const activeModule = localStorage.getItem('activeModule');
        if(activeModule === null)
          {
            setTimeout(()=>{
              const getHrefValues = () => {
                const moduleRouteElements = document.querySelectorAll('.module-route');
                const firstModuleRouteElement = moduleRouteElements[0];  
                if(firstModuleRouteElement)
                  {
                    firstModuleRouteElement.click();
                  }
                }; 
                getHrefValues(); 
              },1000)
            }
      }
  }, []);



  return (
    <div className="d-flex">
      {/* res nav */}
      <div className="toggle-secondary-navbar">
        <ResponsiveNavbar />
      </div>
      {/* end res nav */}

      <div className="toggle-primary-navbar" style={{ height: "100px" }}>
        <div
          onClick={goHome}
          className="d-block h-100 cursor-pointer"
          style={{ backgroundColor: "rgb(48, 86, 211)" }}
        >
          {/* <img className="brand-logo" src="/assets/images/logo.png" /> */}
          <OnlyLogo/>
        </div>
      </div>
      <div className="toggle-primary-navbar w-100 justify-content-center ">
        <header
          className="d-flex w-100 justify-content-between"
          style={{
            backgroundColor: settingsObj?.navbar_bg
              ? settingsObj?.navbar_bg
              : "rgb(48, 86, 211)",
            height: "60px",
          }}
        >
          <div className="d-flex flex-column justify-content-center h-100 align-items-start">
            <div
              className="d-flex justify-content-center pl-2 text-uppercase text-white font-weight-bold"
              style={{ fontSize: "20px", lineHeight: "20px" }}
            >
              {moduleNameString}
            </div>
            <div
              className="d-flex pl-2 justify-content-center align-items-center text-uppercase text-white font-weight-normal"
              style={{ fontSize: "10px" }}
            >
              {breadcrumbList.length > 0 ? (
                breadcrumbList.map((bItem, bIndex) => {
                  if (bIndex === 0) {
                    return <span key={bIndex}>{bItem}</span>;
                  } else {
                    return (
                      <span key={bIndex}>
                        <i className="fa fa-angle-double-right px-1"></i>
                        <span key={bIndex}>{bItem}</span>
                      </span>
                    );
                  }
                })
              ) : (
                <span>organized management panel</span>
              )}
            </div>
          </div>
          <div>
            <ul className="d-flex justify-content-end m-0 list-style-none"> 
                
              {/* {CheckAccessCode('m.stng.crncy_stng', userId, permission) && (
                <li className="nav-item dropdown currencyDropdown">
                  <a
                    className="nav-link dropdown-toggle waves-effect waves-dark position-relative"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <Button
                      type="button"
                      className="btn btn-sm btn-info rounded-0"
                      style={{
                        color: "black",
                        backgroundColor: "white",
                        height: "35px",
                        border: "none",
                      }}
                    > 
                      <span className="">{selectedCurrency?.symbol}</span>
                      <span className="mx-2" style={{ color: "#bbb" }}>
                        |
                      </span>
                      <span className="">{selectedCurrency?.label}</span>
                    </Button>
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-end rounded-0"
                    style={{ padding: 0 }}
                  >
                    {golbalCurrency?.map((item, index) => (
                      <Fragment key={index}>
                        <a
                          className="dropdown-item d-flex border-bottom pr-3"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setDefaultCurrency(item.id);
                            setCurrency(item);
                            setSelectedCurrency((prev) => ({
                              ...prev,
                              value: item.id,
                              label: item.name,
                              symbol: item.symbol,
                              code: item.code,
                            }));
                            // update()
                          }}
                        >
                          <span className="text-center" style={{ width: "40px" }}>
                            {item.symbol}
                          </span>
                          <span className="mr-2" style={{ color: "#ddd" }}>
                            |
                          </span>
                          <span className="">{item.name}</span>
                        </a>
                      </Fragment>
                    ))}
                  </div>
                </li>)} */}
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
              {CheckAccessCode("m.rstrnt.crt_odr", userId, permission) &&
                <li className="nav-item dropdown px-0">
                  <a
                    className="nav-link dropdown-toggle waves-effect waves-dark"
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style={{ color: settingsObj?.text_color }}
                  >
                    <Button
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
                    </Button>
                  </a>
                  {/* dropdown-menu dropdown-menu-end  user-dd animated flipInY */}
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
                            // pagination
                            highlightOnHover
                            subHeader={false}
                            striped
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>}

              <li className="nav-item dropdown profileMenu px-0">
                 

              <a
                className="nav-link profileText dropdown-toggle waves-effect waves-dark d-flex justify-content-center align-items-center"
                href="#"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span
                  style={{
                    height: "60px",
                    border: "none",
                    fontSize: "25px", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    lineHeight: "60px" 
                  }}
                >
                  {user?.name?.charAt(0)}
                </span>
              </a>


                <div className="dropdown-menu dropdown-menu-end  user-dd animated flipInY cust-dropdown-style pt-0">
                  {user && (
                    <>
                      <div className=" d-flex no-block align-items-center  p-3  bg-primary text-white ">
                        <div>
                          <img
                            src="/assets/images/users/1.jpg"
                            alt="user"
                            className="rounded-circle"
                            width="60"
                          />
                        </div>
                        <div className="ms-2">
                          <h4 className="mb-0 text-white">{user?.name}</h4>
                          <p className="mb-0">{user?.email}</p>
                        </div>
                      </div>
                       
                      <Link href="/accounts">
                        <a className="dropdown-item" href="#">
                          <i
                            data-feather="user"
                            className="feather-sm text-info me-1 ms-4"
                          ></i>
                          My Profile
                        </a>
                      </Link>
                      {!active && (
                        <Link href="/user/login">
                          <a
                            className="dropdown-item"
                            style={{ display: active ? "block" : "none" }}
                            href="#"
                          >
                            <i
                              data-feather="log-in"
                              className="feather-sm text-danger me-1 ms-4"
                            ></i>
                            Login
                          </a>
                        </Link>
                      )}
                      {active && (
                        <button
                          type="button"
                          className="dropdown-item mt-1 mb-1 text-secondary logout-btn"
                          style={{ display: active ? "block" : "none" }}
                          onClick={logoutHandle}
                        >
                          <i
                            data-feather="log-out"
                            className="feather-sm text-danger me-1 ms-1"
                          ></i>
                          Logout
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </header>
        {userId !== null && userId !== undefined && (
          <div
            // className={`subHeaderMenus d-flex justify-content-${countModules <= 5 ? 'center' : 'start'} align-items-center text-uppercase`} style={{
              className={`subHeaderMenus d-flex justify-content-center align-items-center text-uppercase`} style={{
              width: "100%",
              height: "40px",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#000",
            }}
          >
            {CheckAccessCode("m.hrm", userId, permission) && (
              <Link href="/modules/hrm">
                <a
                  className={`module-route nav-icon-design active-${moduleNameString === "hrm"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "hrm",
                      moduleUrl: "/modules/hrm",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 448 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M392 32H56C25.1 32 0 57.1 0 88v336c0 30.9 25.1 56 56 56h336c30.9 0 56-25.1 56-56V88c0-30.9-25.1-56-56-56zm-108.3 82.1c0-19.8 29.9-19.8 29.9 0v199.5c0 19.8-29.9 19.8-29.9 0V114.1zm-74.6-7.5c0-19.8 29.9-19.8 29.9 0v216.5c0 19.8-29.9 19.8-29.9 0V106.6zm-74.7 7.5c0-19.8 29.9-19.8 29.9 0v199.5c0 19.8-29.9 19.8-29.9 0V114.1zM59.7 144c0-19.8 29.9-19.8 29.9 0v134.3c0 19.8-29.9 19.8-29.9 0V144zm323.4 227.8c-72.8 63-241.7 65.4-318.1 0-15-12.8 4.4-35.5 19.4-22.7 65.9 55.3 216.1 53.9 279.3 0 14.9-12.9 34.3 9.8 19.4 22.7zm5.2-93.5c0 19.8-29.9 19.8-29.9 0V144c0-19.8 29.9-19.8 29.9 0v134.3z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    HRM
                  </span>
                </a>
              </Link>
            )}
            {CheckAccessCode("m.cstmr", userId, permission) && (
              <Link href="/modules/customer">
                <a
                  className={`module-route mobule-breaking-point active-${moduleNameString === "customer"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "customer",
                      moduleUrl: "/modules/customer",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 640 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    Customer
                  </span>
                </a>
              </Link>
            )}
                         
            {CheckAccessCode("m.lckr", userId, permission) && (
              <Link href="/modules/locker">
                <a
                  className={`module-route mobule-breaking-point active-${moduleNameString === "locker"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "locker",
                      moduleUrl: "/modules/locker",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 448 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    Locker
                  </span>
                </a>
              </Link>
            )}
            {CheckAccessCode("m.tnsprt", userId, permission) && (
              <Link href="/modules/transport">
                <a
                  className={`module-route mobule-breaking-point active-${moduleNameString === "transport"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "transport",
                      moduleUrl: "/modules/transport",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 512 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M192 0c-17.7 0-32 14.3-32 32V64c0 .1 0 .1 0 .2c-38.6 2.2-72.3 27.3-85.2 64.1L39.6 228.8C16.4 238.4 0 261.3 0 288V432v48c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V432H416v48c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V432 288c0-26.7-16.4-49.6-39.6-59.2L437.2 128.3c-12.9-36.8-46.6-62-85.2-64.1c0-.1 0-.1 0-.2V32c0-17.7-14.3-32-32-32H192zM165.4 128H346.6c13.6 0 25.7 8.6 30.2 21.4L402.9 224H109.1l26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zM96 288a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm288 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    Transport
                  </span>
                </a>
              </Link>
            )}
            {CheckAccessCode("m.invtr", userId, permission) && (
              <Link href="/modules/inventory">
                <a
                  className={`module-route mobule-breaking-point active-${moduleNameString === "inventory"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "inventory",
                      moduleUrl: "/modules/inventory",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 448 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M17.7 332.3h412.7v22c0 37.7-29.3 68-65.3 68h-19L259.3 512v-89.7H83c-36 0-65.3-30.3-65.3-68v-22zm0-23.6h412.7v-85H17.7v85zm0-109.4h412.7v-85H17.7v85zM365 0H83C47 0 17.7 30.3 17.7 67.7V90h412.7V67.7C430.3 30.3 401 0 365 0z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    Inventory
                  </span>
                </a>
              </Link>
            )}            
             
            {CheckAccessCode("m.acnt", userId, permission) && (
              <Link href="/modules/accounts">
                <a
                  className={`module-route active-${moduleNameString === "accounts"}`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "accounts",
                      moduleUrl: "/modules/accounts",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 384 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 80c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm128 72c8.8 0 16 7.2 16 16v17.3c8.5 1.2 16.7 3.1 24.1 5.1c8.5 2.3 13.6 11 11.3 19.6s-11 13.6-19.6 11.3c-11.1-3-22-5.2-32.1-5.3c-8.4-.1-17.4 1.8-23.6 5.5c-5.7 3.4-8.1 7.3-8.1 12.8c0 3.7 1.3 6.5 7.3 10.1c6.9 4.1 16.6 7.1 29.2 10.9l.5 .1 0 0 0 0c11.3 3.4 25.3 7.6 36.3 14.6c12.1 7.6 22.4 19.7 22.7 38.2c.3 19.3-9.6 33.3-22.9 41.6c-7.7 4.8-16.4 7.6-25.1 9.1V440c0 8.8-7.2 16-16 16s-16-7.2-16-16V422.2c-11.2-2.1-21.7-5.7-30.9-8.9l0 0 0 0c-2.1-.7-4.2-1.4-6.2-2.1c-8.4-2.8-12.9-11.9-10.1-20.2s11.9-12.9 20.2-10.1c2.5 .8 4.8 1.6 7.1 2.4l0 0 0 0 0 0c13.6 4.6 24.6 8.4 36.3 8.7c9.1 .3 17.9-1.7 23.7-5.3c5.1-3.2 7.9-7.3 7.8-14c-.1-4.6-1.8-7.8-7.7-11.6c-6.8-4.3-16.5-7.4-29-11.2l-1.6-.5 0 0c-11-3.3-24.3-7.3-34.8-13.7c-12-7.2-22.6-18.9-22.7-37.3c-.1-19.4 10.8-32.8 23.8-40.5c7.5-4.4 15.8-7.2 24.1-8.7V232c0-8.8 7.2-16 16-16z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    Accounts
                  </span>
                </a>
              </Link>
            )}
            {CheckAccessCode("m.stng", userId, permission) && (
              <Link href="/modules/settings">
                <a
                  className={`module-route mobule-breaking-point active-${moduleNameString === "settings"
                    }`}
                  onClick={(e) =>
                    setModuleItems(e, {
                      moduleName: "settings",
                      moduleUrl: "/modules/settings",
                    })
                  }
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="14"
                    viewBox="0 0 512 512"
                    style={{ fill: "#555", display: "flex", marginTop: "-1px" }}
                  >
                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                  </svg> */}
                  <span className="hide-menu" style={{ marginLeft: "5px" }}>
                    settings
                  </span>
                </a>
              </Link>
            )} 
            <NavDrawer />
          </div>
        )}
      </div>
    </div>
  );
}
