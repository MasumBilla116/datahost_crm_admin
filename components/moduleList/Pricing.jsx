import Link from "next/link";
import React, { useContext } from 'react';
import themeContext from "../../components/context/themeContext";

const Pricing = () => {
    const context = useContext(themeContext);

    const { permission ,userId} = context;
    return (
        <>

            <li
                className={`nav-small-cap ${permission.includes("booking&room.management") ? "" : "d-none"
                    }`}
            >
                <i className="mdi mdi-dots-horizontal"></i>
                <span className="hide-menu">Pricing</span>
            </li>

            <li
                className={`sidebar-item ${permission.includes("booking&room.room.tower.list")
                    ? ""
                    : "d-none"
                    }`}
            >
                <Link href="/modules/roomManagement/roomPrice">
                    <a className="sidebar-link">
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Regular Price</span>
                    </a>
                </Link>
            </li>

            <li
                className={`sidebar-item ${permission.includes("booking&room.room.tower.list")
                    ? ""
                    : "d-none"
                    }`}
            >
                <Link href="/modules/roomManagement/manageHourlyPricing/hourlyPricing">
                    <a className="sidebar-link">
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Hourly Price</span>
                    </a>
                </Link>
            </li>

            <li
                className={`sidebar-item ${permission.includes("booking&room.room.tower.list")
                    ? ""
                    : "d-none"
                    }`}
            >
                <Link href="/modules/roomManagement/manageHourlyPricing">
                    <a
                        className="sidebar-link waves-effect waves-dark sidebar-link"
                        href="#"
                        aria-expanded="false"
                    >
                        <i className="mdi mdi-file-document"></i>
                        <span className="hide-menu">Time Slots</span>
                    </a>
                </Link>
            </li>


        </>
    )
}

export default Pricing