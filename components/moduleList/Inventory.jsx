import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Inventory = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <> 

            {CheckAccessCode("m.invtr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory">
                    <a className={`active-${pathname === "/modules/inventory"}`} onClick={(e) => setModuleItems(e,{moduleName: "inventory", moduleUrl: "/modules/inventory"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.ctgry", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/categories">
                    <a className={`active-${pathname === "/modules/inventory/categories"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/categories"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Categories</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.itms", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/items">
                    <a className={`active-${pathname === "/modules/inventory/items"}`} onClick={(e) => setModuleItems(e,{moduleName: "inventory", moduleUrl: "/modules/inventory/items"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Items</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.cnsmptn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/vouchers">
                    <a className={`active-${pathname === "/modules/inventory/vouchers"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/vouchers"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Consumption Vouchers</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.cnsmptn.crt_updt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/vouchers/create">
                    <a className={`active-${pathname === "/modules/inventory/vouchers/create"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/vouchers/create"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Create Consumption Vouchers</span>
                    </a>
                </Link>
            </li>}
            
           
            {CheckAccessCode("m.invtr.mngwrhs", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/warehouses">
                    <a className={`active-${pathname === "/modules/inventory/warehouses"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/warehouses"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Warehouse</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.wrhslctn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/warehouses/location">
                    <a className={`active-${pathname === "/modules/inventory/warehouses/location"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/warehouses/location"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Warehouse Locations</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.invtr.stkrpt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/inventory/stock-report">
                    <a className={`active-${pathname === "/modules/inventory/stock-report"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "inventory",
                        moduleUrl: "/modules/inventory/stock-report"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Stock Report</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.splr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/supplier">
                    <a className={`active-${pathname === "/modules/supplier"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "supplier",
                        moduleUrl: "/modules/supplier"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Supplier</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.prchs", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/purchase">
                    <a className={`active-${pathname === "/modules/purchase"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "purchase",
                        moduleUrl: "/modules/purchase"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">purchase</span>
                    </a>
                </Link>
            </li>}
        </>
    )
}

export default ML_Inventory