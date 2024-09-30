import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Housekeeping = ({pathname}) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <> 
            {CheckAccessCode("m.hskpng", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/housekeeping">
                    <a className={`active-${pathname === "/modules/housekeeping"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "housekeeping",
                        moduleUrl: "/modules/housekeeping"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.hskpng.hskpr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/housekeeping/housekeepers">
                    <a className={`active-${pathname === "/modules/housekeeping/housekeepers"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "housekeeping",
                        moduleUrl: "/modules/housekeeping/housekeepers"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Housekeepers</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.hskpng.taskCatgry", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/housekeeping/task-category">
                    <a className={`active-${pathname === "/modules/housekeeping/task-category"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "housekeeping",
                        moduleUrl: "/modules/housekeeping/task-category"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Task Category</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.hskpng.asigntask", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/housekeeping/task-assign">
                    <a className={`active-${pathname === "/modules/housekeeping/task-assign"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "housekeeping",
                        moduleUrl: "/modules/housekeeping/task-assign"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Task Assign</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.hskpng.hskprtask", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/housekeeping/housekeepers/tasks">
                    <a className={`active-${pathname === "/modules/housekeeping/housekeepers/tasks"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "housekeeping",
                        moduleUrl: "/modules/housekeeping/housekeepers/tasks"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">Manage Tasks</span>
                    </a>
                </Link>
            </li>}

            
    
        </>
    )
}

export default ML_Housekeeping