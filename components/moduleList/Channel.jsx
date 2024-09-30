import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Channel = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    const [docsDomainName, setDocsDomainName] = useState('');

    useEffect(() => {
        const hostName = window.location.host.replace(/^[^.]+\./g, "");
        setDocsDomainName(`https://api.${hostName}`)
    })

    return (
        <>
            {CheckAccessCode("m.chnl", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/channel">
                    <a className={`active-${pathname === "/modules/channel"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "channel",
                        moduleUrl: "/modules/channel"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.chnl.mng_chnl", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/channel/list">
                    <a className={`active-${pathname === "/modules/channel/list"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "channel",
                        moduleUrl: "/modules/channel/list"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Channel</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.chnl.mng_chnl", userId, permission) && <li className="sidebar-item">
                <a href={`${docsDomainName}`} target={`_blank`}>
                    <i className="mdi mdi-file-document"/>
                    <span className="hide-menu">API Integration</span>
                </a>
            </li>}
        </>
    )
}

export default ML_Channel