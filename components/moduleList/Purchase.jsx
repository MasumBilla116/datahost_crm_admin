import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Purchase = ({pathname}) => {

    const context = useContext(themeContext);

  const {setModuleItems, permission,userId} = context;
  return (
      <> 
        {CheckAccessCode("m.prchs", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/purchase">
            <a className={`active-${pathname === "/modules/purchase"}`} onClick={(e) => setModuleItems(e,{moduleName: "purchase", moduleUrl: "/modules/purchase"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Dashboard</span>
            </a>
          </Link>
        </li>}

        {CheckAccessCode("m.prchs.crt_invc", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/purchase/requisition">
            <a className={`active-${pathname === "/modules/purchase/requisition"}`} onClick={(e) => setModuleItems(e,{moduleName: "purchase", moduleUrl: "/modules/purchase/requisition"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Purchase Requisition</span>
            </a>
          </Link>
        </li>}


        {CheckAccessCode("m.prchs.crt_invc", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/purchase/invoice/create">
            <a className={`active-${pathname === "/modules/purchase/invoice/create"}`} onClick={(e) => setModuleItems(e,{moduleName: "purchase", moduleUrl: "/modules/purchase/invoice/create"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Create Invoice</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.prchs.mng_invc", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/purchase/invoice">
            <a className={`active-${pathname === "/modules/purchase/invoice"}`} onClick={(e) => setModuleItems(e,{moduleName: "purchase", moduleUrl: "/modules/purchase/invoice"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Invoice</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.prchs.prchs_rtn", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/purchase/return">
            <a className={`active-${pathname === "/modules/purchase/return"}`} onClick={(e) => setModuleItems(e,{moduleName: "purchase", moduleUrl: "/modules/purchase/return"})}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Purchase Return</span>
            </a>
          </Link>
        </li>}
      </>
  )
}

export default ML_Purchase