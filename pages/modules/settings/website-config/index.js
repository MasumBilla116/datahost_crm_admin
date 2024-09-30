import React from "react";
import { getSSRProps } from "../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";


export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.stng.wb_cnfg" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };

const WebsiteConfig = () => {


    return (
        <div className={`container-fluid  `}>
                   <HeadSection title="Web Config" />

            <div className={`row`}>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/sliders"
                       className={`p-2 d-block rounded-3 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2">Slider</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/slides"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm `}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x  border-left pl-2">Slides</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/homepage"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2">Home Page</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/pages/about_us_page/create"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x  border-left pl-2">About Us</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/gallery"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Gallery</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/pages/privacy-policy"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Privacy Policy</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/pages/terms_&_condition"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Terms & Condition</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/pages/return-&-refund"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Return & Refund</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/contact_us"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Contact Us</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/review"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Review</span>
                    </a>
                </div>
                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/facilities"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Common Facilities</span>
                    </a>
                </div>

                <div className={`col-sm-12 col-md-2 col-lg-2 mb-4`}>
                    <a href="/modules/settings/website-config/header"
                       className={`p-2 d-block rounded-3 border-1 shadow-sm`}
                       style={{backgroundColor: '#fff', border: '1px solid #b3d2f3'}}>
                        <i className="mdi mdi-settings mr-2 fa-1x"/>
                        <span className="hide-menu fa-1x border-left pl-2 ">Header</span>
                    </a>
                </div>
            </div>


            {/*<li className="sidebar-item">*/}
            {/*    <Link href="/modules/website-configuration/review">*/}
            {/*        <a className="sidebar-link">*/}
            {/*            <i className="mdi mdi-drupal"/>*/}
            {/*            <span className="hide-menu">Review</span>*/}
            {/*        </a>*/}
            {/*    </Link>*/}
            {/*</li>*/}

            {/*<li className="sidebar-item">*/}
            {/*    <Link href="/modules/facilities">*/}
            {/*        <a className="sidebar-link">*/}
            {/*            <i className="mdi mdi-drawing"/>*/}
            {/*            <span className="hide-menu">Common Facilities</span>*/}
            {/*        </a>*/}
            {/*    </Link>*/}
            {/*</li>*/}
        </div>
    );

}

export default WebsiteConfig;