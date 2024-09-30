import Link from "next/link";
import React, { useContext } from 'react';
import themeContext from "../../components/context/themeContext";

const Clients = () => {
    const context = useContext(themeContext);

    const { setModuleItems, permission } = context;
    return (
        <>
            <li className="sidebar-item"> 
                <Link href="/modules/customer">
                    <a onClick={(e) => setModuleItems(e, { moduleName: "CLIENTS", moduleUrl: "/modules/customer" })} className="sidebar-link">
                        <i className="mdi mdi-drawing" />
                        <span className="hide-menu">Individual Clients</span>
                    </a>
                </Link>
            </li>
            <li className="sidebar-item">
                <Link href="/modules/customer/client">
                    <a onClick={(e) => setModuleItems(e, { moduleName: "CLIENTS", moduleUrl: "/modules/customer/client" })} className="sidebar-link">
                        <i className="mdi mdi-drawing" />
                        <span className="hide-menu">Corporate Clients</span>
                    </a>
                </Link>
            </li>


        </>
    )
}

export default Clients