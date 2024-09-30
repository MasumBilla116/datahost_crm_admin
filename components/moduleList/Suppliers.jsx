import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Suppliers = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
  return (
      <> 
          {CheckAccessCode("m.splr", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier">
                  <a className={`active-${pathname === "/modules/supplier"}`} onClick={(e) => setModuleItems(e,{moduleName: "supplier", moduleUrl: "/modules/supplier"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Dashboard</span>
                  </a>
              </Link>
          </li>}

          {CheckAccessCode("m.splr.mngsplr", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier/list">
                  <a className={`active-${pathname === "/modules/supplier/list"}`} onClick={(e) => setModuleItems(e,{moduleName: "supplier", moduleUrl: "/modules/supplier/list"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Supplier</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.splr.mngsplr.crt_updt", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier/create">
                  <a className={`active-${pathname === "/modules/supplier/create"}`} onClick={(e) => setModuleItems(e,{moduleName: "supplier", moduleUrl: "/modules/supplier/create"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Create Supplier</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.splr.make_pmnt", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier/payment/create">
                  <a className={`active-${pathname === "/modules/supplier/payment/create"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "supplier",
                      moduleUrl: "/modules/supplier/payment/create"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Make Payment</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.splr.make_pmnt", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier/payment">
                  <a className={`active-${pathname === "/modules/supplier/payment"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "supplier",
                      moduleUrl: "/modules/supplier/payment"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Payments</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.splr.splr_ldgr", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/supplier/ledger">
                  <a className={`active-${pathname === "/modules/supplier/ledger"}`} onClick={(e) => setModuleItems(e,{moduleName: "supplier", moduleUrl: "/modules/supplier/ledger"})}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Supplier Ledger</span>
                  </a>
              </Link>
          </li>}
      </>
  )
}

export default ML_Suppliers