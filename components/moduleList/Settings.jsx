import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Settings = ({pathname}) => {
    const context = useContext(themeContext);

  const {setModuleItems, permission,userId} = context;
  return (
      <>
          {CheckAccessCode("m.stng", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings">
                  <a className={`active-${pathname === "/modules/settings"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Dashboard</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.mng_rl", userId, permission) && <li className="sidebar-item">
              <Link href="/user/all-users">
                  <a className={`active-${pathname === "/user/all-users"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/user/all-users"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Users</span>
                  </a>
              </Link>
          </li>}

          {CheckAccessCode("m.stng.mng_rl", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/role/all-roles">
                  <a className={`active-${pathname === "/modules/settings/role/all-roles"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/role/all-roles"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Roles</span>
                  </a>
              </Link>
          </li>}
          {/* {CheckAccessCode("m.stng.mng_prmsn", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/permission">
                  <a className={`active-${pathname === "/modules/settings/permission"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/permission"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Permissions</span>
                  </a>
              </Link>
          </li>} */}
          {/* {CheckAccessCode("m.stng.tre_vw_prmsn", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/settings/role/treeview-permissions">
                    <a className={`active-${pathname === "/modules/settings/role/treeview-permissions"}`} onClick={(e) => setModuleItems(e,{
                        moduleName: "settings",
                        moduleUrl: "/modules/settings/role/treeview-permissions"
                    })}>
                        <i className="mdi mdi-file-document"/>
                        <span className="hide-menu">TreeView Permissions</span>
                    </a>
                </Link>
            </li>} */}
          {CheckAccessCode("m.stng.gnrl_stng", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/general-setting">
                  <a className={`active-${pathname === "/modules/settings/general-setting"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/general-setting"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">General Settings</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.crncy_stng", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/currency-setting">
                  <a className={`active-${pathname === "/modules/settings/currency-setting"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/currency-setting"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Currency Settings</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.htl_info", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/hotel-info">
                  <a className={`active-${pathname === "/modules/settings/hotel-info"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/hotel-info"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">hotel info</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.eml_cnfg", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/email">
                  <a className={`active-${pathname === "/modules/settings/email"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/email"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Email Configuration</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.prmo_ofr", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/promo-offers">
                  <a className={`active-${pathname === "/modules/settings/promo-offers"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/promo-offers"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Manage Promo Offers</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.tx_mngnt", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/tax">
                  <a className={`active-${pathname === "/modules/settings/tax"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/tax"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Tax Management</span>
                  </a>
              </Link>
          </li>}
          {CheckAccessCode("m.stng.srvs_crg", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/service">
                  <a className={`active-${pathname === "/modules/settings/service"}`} onClick={(e) => setModuleItems(e,{
                      moduleName: "settings",
                      moduleUrl: "/modules/settings/service"
                  })}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Service Charge</span>
                  </a>
              </Link>
          </li>}

          {CheckAccessCode("m.stng.wb_cnfg", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/website-config">
                  <a className={`active-${pathname === "/modules/settings/website-config"}`}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Website Config</span>
                  </a>
              </Link>
          </li>}

          {CheckAccessCode("m.stng.wb_cnfg", userId, permission) && <li className="sidebar-item">
              <Link href="/modules/settings/website-config/payment_methods">
                  <a className={`active-${pathname === "/modules/settings/website-config/payment_methods"}`}>
                      <i className="mdi mdi-file-document"/>
                      <span className="hide-menu">Payment Methods</span>
                  </a>
              </Link>
          </li>}

      </>
  )
}

export default ML_Settings