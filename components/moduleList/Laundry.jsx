import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Laundry = ({pathname}) => {
    const context = useContext(themeContext);

  const {setModuleItems, permission,userId} = context;
  return (
      <>  
        {CheckAccessCode("m.lndr", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry">
            <a className={`active-${pathname === "/modules/laundry"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Dashboard</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.oprtr", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/operators">
            <a className={`active-${pathname === "/modules/laundry/operators"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/operators"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Operator</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.vscr", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/vouchers">
            <a className={`active-${pathname === "/modules/laundry/vouchers"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/vouchers"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Vouchers</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.vscr.crt_updt", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/vouchers/invoice/create">
            <a className={`active-${pathname === "/modules/laundry/vouchers/invoice/create"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/vouchers/invoice/create"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Create Vouchers</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.rcvng", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/receiving">
            <a className={`active-${pathname === "/modules/laundry/receiving"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/receiving"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Receiving</span>
            </a>
          </Link>
        </li>}

        {CheckAccessCode("m.lndr.rcvng.crt_updt", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/receiving/create">
            <a className={`active-${pathname === "/modules/laundry/receiving/create"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/receiving/create"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Create Receiving</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.pmnt", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/payment">
            <a className={`active-${pathname === "/modules/laundry/payment"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/payment"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Manage Payment</span>
            </a>
          </Link>
        </li>}
        {CheckAccessCode("m.lndr.pmnt.crt_updt", userId, permission) && <li className="sidebar-item">
          <Link href="/modules/laundry/payment/create">
            <a className={`active-${pathname === "/modules/laundry/payment/create"}`} onClick={(e) => setModuleItems(e,{
              moduleName: "laundry",
              moduleUrl: "/modules/laundry/payment/create"
            })}>
              <i className="mdi mdi-file-document"/>
              <span className="hide-menu">Create Payment</span>
            </a>
          </Link>
        </li>}

      </>
  )
}

export default ML_Laundry