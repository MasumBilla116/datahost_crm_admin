import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_RoomService = ({pathname}) => {

    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <>  
             {CheckAccessCode("m.rm_srvs", userId, permission) && <li className={`sidebar-item`}>
                <Link href="/modules/room-service">
                    <a className={`active-${pathname === "/modules/room-service"}`} onClick={(e) => setModuleItems(e,{moduleName: "room-service", moduleUrl: "/modules/room-service"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}

             {CheckAccessCode("m.rm_srvs", userId, permission) && <li className={`sidebar-item `}>
                <Link href="/modules/room-service/list">
                    <a className={`active-${pathname === "/modules/room-service/list"}`} onClick={(e) => setModuleItems(e,{moduleName: "room-service", moduleUrl: "/modules/room-service/list"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Room Service</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.rm_srvs.mng.crt_updt", userId, permission) && <li className={`sidebar-item `}>
                <Link href="/modules/room-service/addNewRoomService">
                    <a className={`active-${pathname === "/modules/room-service/addNewRoomService"}`} onClick={(e) => setModuleItems(e,{moduleName: "room-service", moduleUrl: "/modules/room-service/list"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Create  Room Service</span>
                    </a>
                </Link>
            </li>}
        </>
    )
}

export default ML_RoomService
