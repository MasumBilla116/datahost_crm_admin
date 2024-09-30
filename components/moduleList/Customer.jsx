import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

//   {CheckAccessCode("m.bkng", userId, permission) &&

const ML_Customer = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, userId,permission} = context;
    return (
        <> 

           {CheckAccessCode("m.cstmr", userId, permission)  &&  <li className="sidebar-item">
                <Link href="/modules/customer">
                    <a className={`active-${pathname === "/modules/customer"}`} onClick={(e) => setModuleItems(e,{moduleName: "customer", moduleUrl: "/modules/customer"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("'m.cstmr.gnrl", userId, permission)  &&  <li className="sidebar-item">
                <Link href="/modules/customer/create">
                    <a className={`active-${pathname === "/modules/customer/create"}`} onClick={(e) => setModuleItems(e,{moduleName: "customer", moduleUrl: "/modules/customer/create"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Create Customer</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("'m.cstmr.gnrl", userId, permission)  &&  <li className="sidebar-item">
                <Link href="/modules/customer/general">
                    <a className={`active-${pathname === "/modules/customer/general"}`} onClick={(e) => setModuleItems(e,{moduleName: "customer", moduleUrl: "/modules/customer/general"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">General</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.cstmr.crprt", userId, permission)  && <li className="sidebar-item">
                <Link href="/modules/customer/corporate">
                    <a className={`active-${pathname === "/modules/customer/corporate"}`} onClick={(e) => setModuleItems(e,{moduleName: "customer", moduleUrl: "/modules/customer/corporate"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Corporate</span>
                    </a>
                </Link>
            </li>}
        </>
    )
}

export default ML_Customer