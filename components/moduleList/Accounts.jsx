import Link from "next/link";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import { CheckAccessCode } from "../../utils/CheckAccessCode";

const ML_Accounts = ({ pathname }) => {
    const context = useContext(themeContext);

    const {setModuleItems, permission,userId} = context;
    return (
        <> 

            {CheckAccessCode("m.acnt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts">
                    <a className={`active-${pathname === "/modules/accounts"}`} onClick={(e) => setModuleItems(e, { moduleName: "accounts", moduleUrl: "/modules/accounts" })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Dashboard</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.acnt.mng_bank_acnt", userId, permission) && <li className="sidebar-item">
                <a className="sidebar-link" style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                    <i className="mdi mdi-drawing"/>
                    <span className="hide-menu">Account Settings</span>
                </a>
            </li>}
            {CheckAccessCode("m.acnt.mng_bank_acnt.crt_updt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/create">
                    <a className={`active-${pathname === "/modules/accounts/create"}`} onClick={(e) => setModuleItems(e, { moduleName: "accounts", moduleUrl: "/modules/accounts/create" })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Create Bank Account</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.acnt.mng_bank_acnt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/list">
                    <a className={`active-${pathname === "/modules/accounts/list"}`} onClick={(e) => setModuleItems(e, { moduleName: "accounts", moduleUrl: "/modules/accounts/list" })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Bank Account</span>
                    </a>
                </Link>
            </li>}






            {CheckAccessCode("m.acnt.crt_of_acnt", userId, permission) && <li className={`sidebar-item `}>
                <Link href="/modules/accounts/sector">
                    <a className={`active-${pathname === "/modules/accounts/sector"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/sector"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Chart Of Accounts</span>
                    </a>
                </Link>
            </li>}
            {/* {CheckAccessCode("m.acnt.mng_vscr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/vouchers">
                    <a className={`active-${pathname === "/modules/accounts/vouchers"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/vouchers"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Voucher</span>
                    </a>
                </Link>
            </li>} */}
            {CheckAccessCode("m.acnt.mng_ldgr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/ledger">
                    <a className={`active-${pathname === "/modules/accounts/ledger"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/ledger"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Ledger</span>
                    </a>
                </Link>
            </li>}
            

            

            {CheckAccessCode("m.acnt.gnrl_ldgr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/general-ledger">
                    <a className={`active-${pathname === "/modules/accounts/general-ledger"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/general-ledger"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">General Ledger</span>
                    </a>
                </Link>
            </li>} 

            {CheckAccessCode("m.acnt.htl_acnt", userId, permission) && <li className="sidebar-item mt-5">
                <a className="sidebar-link" style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                    <i className="mdi mdi-drawing"/>
                    <span className="hide-menu">Manage Voucher</span>
                </a>
            </li>}
            {CheckAccessCode("m.acnt.pmnt_vscr", userId, permission) && <li className="sidebar-item">
                    <Link href="/modules/accounts/payment/voucher">
                        <a className={`active-${pathname === "/modules/accounts/payment/voucher"}`} onClick={(e) => setModuleItems(e,{
                            moduleName: "accounts",
                            moduleUrl: "/modules/accounts/payment/voucher"
                        })}>
                            <i className="mdi mdi-file-document"/>
                            <span className="hide-menu">Payment Vouchers</span>
                        </a>
                    </Link>
                </li>}
                {CheckAccessCode("m.acnt.pmnt_vscr.crt_updt", userId, permission) && <li className="sidebar-item">
                    <Link href="/modules/accounts/payment/voucher/create">
                        <a className={`active-${pathname === "/modules/accounts/payment/voucher/create"}`} onClick={(e) => setModuleItems(e,{
                            moduleName: "accounts",
                            moduleUrl: "/modules/accounts/payment/voucher/create"
                        })}>
                            <i className="mdi mdi-file-document"/>
                            <span className="hide-menu">Create Payment Voucher</span>
                        </a>
                    </Link>
                </li>}
                {CheckAccessCode("m.acnt.fnd_trnfr", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/transfer/list">
                    <a className={`active-${pathname === "/modules/accounts/transfer/list"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/transfer/list"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Fund Transfer</span>
                    </a>
                </Link>
            </li>}
                {CheckAccessCode("m.acnt.fnd_trnfr.crt_updt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/transfer">
                    <a className={`active-${pathname === "/modules/accounts/transfer"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/transfer"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Create Fund Transfer</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.acnt.mng_adjstmnt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/adjustment-balance/list">
                    <a className={`active-${pathname === "/modules/accounts/adjustment-balance/list"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/adjustment-balance/list"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Manage Adjustment</span>
                    </a>
                </Link>
            </li>}
            {CheckAccessCode("m.acnt.mng_adjstmnt.crt_updt", userId, permission) && <li className="sidebar-item">
                <Link href="/modules/accounts/adjustment-balance">
                    <a className={`active-${pathname === "/modules/accounts/adjustment-balance"}`} onClick={(e) => setModuleItems(e, {
                        moduleName: "accounts",
                        moduleUrl: "/modules/accounts/adjustment-balance"
                    })}>
                        <i className="mdi mdi-file-document" />
                        <span className="hide-menu">Create Adjustment</span>
                    </a>
                </Link>
            </li>}
        </>
    )
}

export default ML_Accounts