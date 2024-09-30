import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_RoomsAndTower = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <>  
            {CheckAccessCode("m.rm_tr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower">
                    <a className={`active-${pathname === "/modules/room-tower"}`} onClick={(e) => setModuleItems(e,{moduleName: "room-tower", moduleUrl: "/modules/room-tower"})}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.rm_tr.twr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-tower">
                    <a className={`active-${pathname === "/modules/room-tower/manage-tower"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-tower"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Manage Towers</span>
                    </a>
                </Link>
            </li>}
            
            
            {CheckAccessCode("m.rm_tr.rmctgry", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-room/category">
                    <a className={`active-${pathname === "/modules/room-tower/manage-room/category"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-room/category"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Room Category</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.rm_tr.fclts", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-facility">
                    <a className={`active-${pathname === "/modules/room-tower/manage-facility"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-facility"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Manage Facilities</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.rm_tr.rmtyp", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-room/room-type">
                    <a className={`active-${pathname === "/modules/room-tower/manage-room/room-type"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-room/room-type"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Room Types</span>
                    </a>
                </Link>
            </li>}
            
           

            {/* {CheckAccessCode("m.rm_tr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower">
                    <a className={`active-${pathname === "/modules/room-tower"}`} onClick={(e) => setModuleItems(e,{moduleName: "room-tower", moduleUrl: "/modules/room-tower"})}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Pricing</span>
                    </a>
                </Link>
            </li>} */}
            {CheckAccessCode("m.rm_tr.rm", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-room">
                    <a className={`active-${pathname === "/modules/room-tower/manage-room"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-room"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Manage Rooms</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.rm_tr.fclts", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/manage-room/price">
                    <a className={`active-${pathname === "/modules/room-tower/manage-room/price"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/manage-room/price"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Pricing</span>
                    </a>
                </Link>
            </li>}
            {/* {CheckAccessCode("m.rm_tr.fclts", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/room-tower/hourly-price/hourlyPricing">
                    <a className={`active-${pathname === "/modules/room-tower/hourly-price/hourlyPricing"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "room-tower",
                        moduleUrl: "/modules/room-tower/hourly-price/hourlyPricing"
                    })}>
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Regular Price</span>
                    </a>
                </Link>
            </li>} */}
        </>
    )
}

export default ML_RoomsAndTower