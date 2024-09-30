// "use client";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-indiana-drag-scroll/dist/style.css";
import "react-phone-input-2/lib/style.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "../components";
import ThemeContext from "../components/context/themeContext";
import { getCookie } from "../utils/Cookie";
import Axios from "../utils/axios";
import Login from "./user/login";
// import decodeJwt from "../components/helpers/tokendecode";

const MyApp = ({ Component, pageProps }: AppProps) => {
  /**
   * !Axios Assesments
   * @http @token @logout @user
   */
  const { http, user, token, logout } = Axios();
  const router = useRouter();
  const [accessType, setAccessType] = useState("");

  const parseJwt = (token: any) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      const decodedJwt = parseJwt(token);
      setAccessType(decodedJwt.data_access_type);
      if (decodedJwt?.exp * 1000 < Date.now()) {
        logout();
      }
    }

    // let decoded = decodeJwt(token);
  }, [user, token, router.pathname]);






  if (typeof window !== "undefined") {
    if (!user) {
      return (
        <>
          <Login />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            closeOnClick
            pauseOnHover
            transition={Slide}
          />
        </>
      );
    }
  }


  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  let [hoteItemList, setHotelItemList] = useState([]);
  const [hotelName, setHotelName] = useState('');



  const fetchItemList = async () => {
    http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "getConfigDataInfo",
      })
      .then((res) => {
        const configDataList = res?.data?.data;
        const hotelNameItem = configDataList.find(item => item.config_name === 'Hotel Name');
        if (hotelNameItem) {
          setHotelName(hotelNameItem.config_value);
        }

        configDataList.map((cItem) => {
          cItem["is_show"] = false;
          setHotelItemList((prev) => [...prev, cItem]);
        });
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();

    });
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const getModulesPermissions = async () => {
      // const permissions = await getCookie("permissions");
      const cookieUserId = await getCookie("userId");
      const role_Id = await getCookie("roleId");
      setRoleId(role_Id)
      setUserId(cookieUserId);
    };
    getModulesPermissions();
  }, []);

  //set weekend
  const [menubar, setMenubar] = useState("");

  const [loading, setLoading] = useState(true);

  const MenuBar = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "configDataInfo",
        name: "Menu Bar",
      })
      .then((res) => {
        if (isSubscribed) {
          setMenubar(res.data.data?.config_value);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    MenuBar();
  }, [MenuBar]);

  //set user settings
  const [settings, setSettings] = useState([]);
  const UserSettings = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/site`, {
        action: "settingsInfo",
      })
      .then((res) => {
        if (isSubscribed) {
          setSettings(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    UserSettings();
  }, [UserSettings]);

  const [settingsObj, setSettingsObj] = useState({
    navbar_bg: "",
    sidebar_bg: "",
    text_color: "",
    fixed_Sidebar: "",
    fixed_Header: "",
    boxed_layout: "",
  });

  useEffect(() => {
    if (settings?.length) {
      settings.map((item) => {
        if (item?.type === "navbar-bg") {
          // setSettingsObj((prev) => ({ ...prev, navbar_bg: item.value }));
          setSettingsObj((prev) => ({ ...prev, navbar_bg: "#3056d3" }));
        } else if (item.type === "sidebar-bg") {
          setSettingsObj((prev) => ({ ...prev, sidebar_bg: item.value }));
        } else if (item.type === "text-color") {
          setSettingsObj((prev) => ({ ...prev, text_color: item.value }));
        } else if (item.type === "fixed-Sidebar") {
          setSettingsObj((prev) => ({ ...prev, fixed_Sidebar: item.value }));
        } else if (item.type === "fixed-Header") {
          setSettingsObj((prev) => ({ ...prev, fixed_Header: item.value }));
        } else if (item.type === "boxed-layout") {
          setSettingsObj((prev) => ({ ...prev, boxed_layout: item.value }));
        } else {
          setSettingsObj((prev) => ({ ...prev }));
        }
      });
    }
  }, [settings]);

  //currency information
  const [selectedCurrency, setSelectedCurrency] = useState({
    value: "",
    label: "Select...",
  });

  const [invoiceLength, setInvoiceLength] = useState(null);

  const CurrencyInfoActive = useCallback(async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/business-settings`, {
        action: "settingsInfo",
        key: "system_default_currency",
      })
      .then((res) => {
        if (isSubscribed) {
          setSelectedCurrency(res.data?.data?.currency_info);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    CurrencyInfoActive();
  }, [CurrencyInfoActive]);

  // hold-data list and update notification
  const [holdDataNotification, setHoldDataNotification] = useState([]);
  // fetch
  const fetchHoldDataList = async () => {
    let isSubscribed = true;
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,
        {
          action: "getAllHoldData",
        }
      )
      .then((res) => {
        if (isSubscribed) {
          let result = res.data?.data;
          setHoldDataNotification(result);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => (isSubscribed = false);
  };

  // New Breadcrumb Start ===========================
  const [moduleNameString, setModuleList] = useState("");
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const generateBreadCrumb = (urlParts) => {
    urlParts = urlParts.replace(/^\/|\/$/g, "").split("/");
    if (urlParts.length > 0 && urlParts[0] !== "") {
      if (urlParts[0] === "modules") {
        const moduleIndex = urlParts.indexOf("modules");
        urlParts.splice(moduleIndex, 1);
      }
      if (urlParts.length === 1) {
        urlParts[1] = "dashboard";
      }
      setBreadcrumbList(urlParts);
      setModuleList(urlParts[0]);
    } else {
      setBreadcrumbList(["hotel management panel"]);
      setModuleList("dashboard");
    }
  };
  useEffect(() => {
    const { pathname } = router;
    generateBreadCrumb(pathname);
  }, []);
  const setModuleItems = (event, { moduleName, moduleUrl }) => {
    setModuleList(moduleName);
    generateBreadCrumb(moduleUrl);
    localStorage.setItem("activeModule", moduleName);
    toggleDrawer(false)(event);
    router.push(moduleUrl);
  };
  // New Breadcrumb End ===========================

  // state
  const [isDawerOpen, setIsDawerOpen] = useState(false);
  // handler
  const toggleDrawer = (status: boolean) => (event: any) => {
    setIsDawerOpen(status);
  };

  const [permission, setPermissions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getPermissionData?roleId=${roleId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPermissions(data)
        // setPermissionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (roleId) {
      fetchData();
    }
  }, [roleId]);



  const [golbalCurrency, setGlobalCurrencies] = useState([]);


  const providerValues = {
    MenuBar,
    menubar,
    permission,
    userId,
    accessType,
    // userPermission,
    UserSettings,
    settingsObj,
    selectedCurrency,
    CurrencyInfoActive,
    user,
    setInvoiceLength,
    invoiceLength,
    setHoldDataNotification,
    holdDataNotification,
    fetchHoldDataList,
    setModuleItems,
    moduleNameString,
    breadcrumbList,
    toggleDrawer,
    setIsDawerOpen,
    isDawerOpen,
    hotelName,
    hoteItemList,
    golbalCurrency, 
    setGlobalCurrencies
  };
  return (
    <>
      {menubar && menubar === "top" && (
        <Script src="/dist/js/app.init.horizontal.js" id="menu-script" />
      )}

      <ThemeContext.Provider value={providerValues}>
        {/* {
          user &&  */}
        <Layout>
          <Component {...pageProps} />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            closeOnClick
            pauseOnHover
            transition={Slide}
          />
        </Layout>
        {/* } */}
      </ThemeContext.Provider>
    </>
  );
};
export default MyApp;
