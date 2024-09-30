import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ML_Hrm from "../components/moduleList/Hrm";
import ThemeContext from "./context/themeContext";
import ML_Accounts from "./moduleList/Accounts";
import ML_Channel from "./moduleList/Channel";
import ML_Customer from "./moduleList/Customer";
import ML_Housekeeping from "./moduleList/Housekeeping";
import ML_Inventory from "./moduleList/Inventory";
import ML_Locker from "./moduleList/Locker";
import ML_Purchase from "./moduleList/Purchase";
import ML_RoomService from "./moduleList/RoomService";
import ML_Settings from "./moduleList/Settings";
import ML_Suppliers from "./moduleList/Suppliers";
import ML_Transport from "./moduleList/Transport";
import ML_Booking from "./moduleList/Booking";


export default function LeftSidebar2() {

  const context = useContext(ThemeContext);

  const { permission, settingsObj, menubar, modulelist,modileAccess } = context;
  const { pathname } = useRouter();

  let activeModule = null;
  if (typeof window !== undefined && typeof window !== "undefined") {
    activeModule = localStorage.getItem("activeModule");
    // if (activeModule === null) {
    //   localStorage.setItem("activeModule", "hrm");
    // }
  }
  useEffect(() => {
    const urlParts = pathname.replace(/^\/|\/$/g, '').split('/');
    if(urlParts.length > 0 && urlParts[0] !== ''){
      if(urlParts[0] === 'modules'){
        localStorage.setItem("activeModule", urlParts[1])
      }
    }
  }, []);

  
  // const [moduleAccess,setModuleAccess] = useState([]);
  // useEffect(async ()=>{
  //   const {modules} = await getCookie('permissions');
  //   if(modules !== '' && modules !== undefined)
  //   {
  //     setModuleAccess(modules);
  //   } 
  // },[]);

  // activeModule = hrm

  return (
    <>
      <aside className="menuSidebar" style={{backgroundColor: "#fff"}}>
        <div className="scroll-sidebar">
          <ul className="sidebar-nav">
            {activeModule === "hrm" && <ML_Hrm pathname={pathname}/>}
            {activeModule === "customer" && <ML_Customer pathname={pathname}/>}
            {activeModule === "housekeeping" && <ML_Housekeeping pathname={pathname}/>} 
            {activeModule === "locker" && <ML_Locker pathname={pathname}/>}
            {activeModule === "transport" && <ML_Transport pathname={pathname}/>}
            {activeModule === "inventory" && <ML_Inventory pathname={pathname}/>}
            {activeModule === "purchase" && <ML_Purchase pathname={pathname}/>}
            {activeModule === "supplier" && <ML_Suppliers pathname={pathname}/>}
            {activeModule === "accounts" && <ML_Accounts pathname={pathname}/>}
            {activeModule === "settings" && <ML_Settings pathname={pathname}/>}
            {activeModule === "channel" && <ML_Channel pathname={pathname}/>}
          </ul>
        </div>
      </aside>
    </>
  );
}
