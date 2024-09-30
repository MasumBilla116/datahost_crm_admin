import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Transport = ({ pathname }) => {
    const context = useContext(themeContext);

    const { setModuleItems, permission, userId} = context;
    return (
        <>

            {CheckAccessCode("m.tnsprt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/transport">
                    <a className={`active-${pathname === "/modules/transport"}`} onClick={(e) => setModuleItems(e, { moduleName: "transport", moduleUrl: "/modules/transport" })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.tnsprt.vhlc", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/transport/vehicles">
                    <a className={`active-${pathname === "/modules/transport/vehicles"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "transport",
                        moduleUrl: "/modules/transport/vehicles"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Vehicles</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.tnsprt.drvr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/transport/drivers">
                    <a className={`active-${pathname === "/modules/transport/drivers"}`} onClick={(e) => setModuleItems(e, { moduleName: "transport", moduleUrl: "/modules/transport/drivers" })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Drivers</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.tnsprt.bkng", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/transport/vehicles/booking">
                    <a className={`active-${pathname === "/modules/transport/vehicles/booking"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "transport",
                        moduleUrl: "/modules/transport/vehicles/booking"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Booking</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.tnsprt.bkng.crt_updt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/transport/vehicles/booking/create">
                    <a className={`active-${pathname === "/modules/transport/vehicles/booking/create"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "transport",
                        moduleUrl: "/modules/transport/vehicles/booking/create"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Create vehicle Booking</span>
                    </a>
                </Link>
            </li>}
        </>
    )
}

export default ML_Transport