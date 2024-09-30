import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import themeContext from "../context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const  ML_Hrm_CPY = ({pathname}) => {
    const context = useContext(themeContext);
    const router = useRouter()
    
    const {setModuleItems, permission, toggleDrawer,userId} = context; 
 
    return (
        <> 
           {CheckAccessCode("m.hrm", userId, permission) && 
           <li className="sidebar-item"  >
                <Link href="/modules/hrm">
                    <a className={`active-${pathname === "/modules/hrm"}`} onClick={ (e)=> {setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm"});  }}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>
            } 

            {CheckAccessCode("m.hrm.emp", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/employee">
                    <a className={`active-${pathname === "/modules/hrm/employee"}`} onClick={(e) => {setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/employee"}); }}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Employee</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.dept", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/department">
                    <a className={`active-${pathname === "/modules/hrm/department"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/department"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Department</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.dgntn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/designation">
                    <a className={`active-${pathname === "/modules/hrm/designation"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/designation"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Designation</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.pyrl", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/payroll">
                    <a className={`active-${pathname === "/modules/hrm/payroll"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/payroll"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Payroll</span>
                    </a>
                </Link>
            </li>}

            <li className="sidebar-item">
                <Link href="/modules/hrm/payroll/settings">
                    <a className={`active-${pathname === "/modules/hrm/payroll/settings"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/payroll/settings"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Payroll Settings</span>
                    </a>
                </Link>
            </li>

            {CheckAccessCode("m.hrm.hlds", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/holidays">
                    <a className={`active-${pathname === "/modules/hrm/holidays"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/holidays"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">holidays</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.lvaplctn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/leave-application/categories">
                    <a className={`active-${pathname === "/modules/hrm/leave-application/categories"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/leave-application/categories"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Leave Category</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.lvaplctn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/leave-application">
                    <a className={`active-${pathname === "/modules/hrm/leave-application"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/leave-application"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Leave Application</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.lnaplctn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/loan-application">
                    <a className={`active-${pathname === "/modules/hrm/loan-application"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/loan-application"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Loan Application</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.dty", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/duty-management">
                    <a className={`active-${pathname === "/modules/hrm/duty-management"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/duty-management"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Duty Management</span>
                    </a>
                </Link>
            </li>}

            {CheckAccessCode("m.hrm.atnd", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/hrm/attendance">
                    <a className={`active-${pathname === "/modules/hrm/attendance"}`} onClick={(e) => setModuleItems(e,{moduleName: "hrm", moduleUrl: "/modules/hrm/attendance"})}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Attendance</span>
                    </a>
                </Link>
            </li>}

        </>
    )
}

export default ML_Hrm_CPY