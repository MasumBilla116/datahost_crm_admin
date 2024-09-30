import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Booking = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
  return (
      <>
          

          {CheckAccessCode("m.bkng", userId, permission) && <li className={`sidebar-item`}>
              <Link href="/modules/bookings">
                  <a className={`active-${pathname === "/modules/bookings"}`} onClick={(e) => setModuleItems(e,{moduleName: "bookings", moduleUrl: "/modules/bookings"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Dashboard</span>
                  </a>
              </Link>
          </li>}

          {CheckAccessCode("m.bkng.mng", userId, permission) && <li className={`sidebar-item`}>
              <Link href="/modules/bookings/create">
                  <a className={`active-${pathname === "/modules/bookings/create"}`} onClick={(e) => setModuleItems(e,{moduleName: "bookings", moduleUrl: "/modules/bookings/create"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Create Bookings</span>
                  </a>
              </Link>
          </li>}
          
          {CheckAccessCode("m.bkng.mng", userId, permission) && <li className={`sidebar-item`}>
              <Link href="/modules/bookings/list">
                  <a className={`active-${pathname === "/modules/bookings/list"}`} onClick={(e) => setModuleItems(e,{moduleName: "bookings", moduleUrl: "/modules/bookings/list"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Bookings</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.bkng.mng", userId, permission) && <li className={`sidebar-item`}>
              <Link href="/modules/bookings/refund/manageRefund">
                  <a className={`active-${pathname === "/modules/bookings/refund/manageRefund"}`} onClick={(e) => setModuleItems(e,{moduleName: "bookings", moduleUrl: "/modules/bookings/refund/manageRefund"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Refund</span>
                  </a>
              </Link>
          </li>}


      </>
  )
}

export default ML_Booking