import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Restaurant = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <> 
            {CheckAccessCode("m.rstrnt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/restaurant">
                    <a className={`active-${pathname === "/modules/restaurant"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "restaurant",
                        moduleUrl: "/modules/restaurant"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li> }
            {CheckAccessCode("m.rstrnt.fd", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/restaurant/manage-foods">
                    <a className={`active-${pathname === "/modules/restaurant/manage-foods"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "restaurant",
                        moduleUrl: "/modules/restaurant/manage-foods"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Foods</span>
                    </a>
                </Link>
            </li> }
            {CheckAccessCode("m.rstrnt.odr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/restaurant/table">
                    <a className={`active-${pathname === "/modules/restaurant/table"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "restaurant",
                        moduleUrl: "/modules/restaurant/table"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Table</span>
                    </a>
                </Link>
            </li> }
            {CheckAccessCode("m.rstrnt.crt_odr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/restaurant/manage-order/create-inv">
                    <a className={`active-${pathname === "/modules/restaurant/manage-order/create-inv"}`} target="_blank">
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Create Orders</span>
                    </a>
                </Link>
            </li> }
            {CheckAccessCode("m.rstrnt.odr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/restaurant/manage-order">
                    <a className={`active-${pathname === "/modules/restaurant/manage-order"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "restaurant",
                        moduleUrl: "/modules/restaurant/manage-order"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Orders</span>
                    </a>
                </Link>
            </li> }
            

        </>
    )
}

export default ML_Restaurant