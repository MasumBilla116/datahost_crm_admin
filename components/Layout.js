import { useRouter } from 'next/router';
import { useContext } from 'react';
import Footer from "./Footer";
import LeftSidebar2 from "./LeftSidebar2";
import NavBar from "./NavBar";
import themeContext from './context/themeContext';


const Layout = ({children}) => {

    const context = useContext(themeContext);
    const {menubar, settingsObj, router, user} = context;
    const {pathname} = useRouter();

    return (
        <div id="main-wrapper">
            <NavBar/>
            {user !== undefined && <div className="d-flex">
                <LeftSidebar2/>
                <div className="page-wrapper" style={{display: pathname === '/modules/restaurant/food-order/create-inv' ? "contents !important" : 'block', paddingTop: '25px', overflowY: 'scroll', width: "calc(100% - 230px)", height: "calc(100vh - 100px)"}}>
                    {children}
                    <Footer/>
                </div>
            </div>}
        </div>
    );
}

export default Layout;
