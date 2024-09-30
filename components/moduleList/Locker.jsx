import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Locker = ({pathname}) => {
    const context = useContext(themeContext);

  const {setModuleItems, permission,userId} = context;
  return (
      <> 
 
        {CheckAccessCode("m.lckr", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/locker">
            <a className={`active-${pathname === "/modules/locker"}`} onClick={(e) => setModuleItems(e,{moduleName: "locker", moduleUrl: "/modules/locker"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Dashboard</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lckr.lckrlist", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/locker/list">
            <a className={`active-${pathname === "/modules/locker/list"}`} onClick={(e) => setModuleItems(e,{moduleName: "locker", moduleUrl: "/modules/locker/list"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Locker List</span>
            </a>
          </Link>
        </li>}

        {CheckAccessCode("m.lckr.lckrlist.crt_updt", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/locker/create">
            <a className={`active-${pathname === "/modules/locker/create"}`} onClick={(e) => setModuleItems(e,{moduleName: "locker", moduleUrl: "/modules/locker/list"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Create Locker</span>
            </a>
          </Link>
        </li>}

        {CheckAccessCode("m.lckr.asgn_lckr", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/locker/customers">
            <a className={`active-${pathname === "/modules/locker/customers"}`} onClick={(e) => setModuleItems(e,{moduleName: "locker", moduleUrl: "/modules/locker/customers"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Assigned Lockers</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lckr.asgn_lckr.crt_updt", userId, permission) &&
         <li className="sidebar-item">
          <Link href="/modules/locker/customers/assign">
            <a className={`active-${pathname === "/modules/locker/customers/assign"}`} onClick={(e) => setModuleItems(e,{moduleName: "locker", moduleUrl: "/modules/locker/customers/assign"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Assigned Lockers</span>
            </a>
          </Link>
        </li>
         } 
      </>
  )
}

export default ML_Locker