import Link from "next/link";
import { useContext } from "react";
import { CheckAccessCode } from "../../utils/CheckAccessCode";
import themeContext from "../context/themeContext";

const ML_POS = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <> 
            {CheckAccessCode("m.rstrnt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/pos">
                    <a className={`active-${pathname === "/modules/pos"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "pos",
                        moduleUrl: "/modules/pos"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li> }
             
            {CheckAccessCode("m.rstrnt.crt_odr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/pos/manage-order/create-inv">
                    <a className={`active-${pathname === "/modules/pos/manage-order/create-inv"}`} target="_blank">
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Add Sale</span>
                    </a>
                </Link>
            </li> }
            {CheckAccessCode("m.rstrnt.odr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/pos/manage-order">
                    <a className={`active-${pathname === "/modules/pos/manage-order"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "pos",
                        moduleUrl: "/modules/pos/manage-order"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Orders</span>
                    </a>
                </Link>
            </li> }
            

        </>
    )
}

export default ML_POS