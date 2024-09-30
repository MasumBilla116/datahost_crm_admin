import React, { useEffect, useState } from "react";
import toast from "../../../../../components/Toast/index";
import Axios from "../../../../../utils/axios";
import { getSSRProps } from "../../../../../utils/getSSRProps";
import { HeadSection } from "../../../../../components";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.stng.wb_cnfg",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const PaymentMethods = () => {
  const { http } = Axios();
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  
  // @@ useState
  const [allPaymentMethods,setAllPaymentMethods] = useState([]);


  // @@ handle  tab
  const [tabIndex, setTabIndex] = useState(0);
  const handleTab = (index) => {
    setTabIndex(index);
  };




  // @@ handle to submit bkash method
  const handleBkashMethod = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    data.append("method_name", "Bkash");
    data.append("action", "saveBkashPeymentMethod");

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,
        data
      )
      .then((res) => {
        console.log("payment method res: ", res);
        if (res?.data?.status == "success") {
          notify("success", res?.data?.response);
        } else {
          notify("error", res?.data?.response);
        }
      })
      .catch((err) => {
        notify("error", "Something is wrong");
      });
  };
  const fetchAllPaymentMethods = async () =>{
    await http
    .post(
      `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,{
        action: "getAllPaymentMethods"
      }
    )
    .then((res) => {
      const arr = res?.data?.data?.payment_methods;
      var newObj = {};

      arr?.map((row)=>{
        newObj[row?.method_name] = {
            app_key: row?.app_key,
            app_secret_key: row?.app_secret_key,
            app_user: row?.app_user,
            app_password: row?.app_password,
            status: row?.status
        }
      }); 
      setAllPaymentMethods(newObj); 
    })
    .catch((err) => {
      notify("error", "Something is wrong");
    });
  }
 


  useEffect(()=>{
    fetchAllPaymentMethods();
  },[]);

  return (
    <div className={`container-fluid  `}>
             <HeadSection title="Payment Methods" />

      <div className={`row`}>
        <div className="col-md-12 card">
          <h4 className="mt-2">Payment Methods</h4>
          <hr />
          <div>
            <ul className="payment-method-ul">
              <li>
                <button type="button" className={`btn ${tabIndex == 0 ? "btn-success" : ""}`} onClick={()=>handleTab(0)}>
                  Bkash
                </button>
              </li>
              <li>
                <button type="button" className={`btn ${tabIndex == 1 ? "btn-success" : ""}`}  onClick={()=>handleTab(1)}>
                Nagad
                </button>
              </li>
            </ul>
          </div>
          {/* <hr style={{marginTop:"0"}}/> */}
          <div className={`w-100 ${tabIndex == 0 ? "d-block" : "d-none"}`}>
            <h6>Bkash Payment Method</h6>
            <form action="#" method="post" onSubmit={handleBkashMethod}>
              <div className="col-md-4 pb-4">
                <div className="mb-3">
                  <label htmlFor="bkash_app_key" className="form-label">
                    App Key
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="app_key"
                    id="bkash_app_key"
                    placeholder="Bkash app key"
                    defaultValue={allPaymentMethods?.Bkash?.app_key}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bkash_secret_app_key" className="form-label">
                    App Secret Key
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="app_secret_key"
                    id="bkash_secret_app_key"
                    placeholder="Bkash app secret key"
                    defaultValue={allPaymentMethods?.Bkash?.app_secret_key}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bkash_user" className="form-label">
                    User
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="user"
                    id="bkash_user"
                    placeholder="Bkash User"
                    defaultValue={allPaymentMethods?.Bkash?.app_user}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="bkash_password" className="form-label">
                    Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    id="bkash_password"
                    placeholder="Bkash password"
                    defaultValue={allPaymentMethods?.Bkash?.app_password}
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    name="status"
                    type="checkbox"
                    id="bkash_status"
                    defaultChecked={allPaymentMethods?.Bkash?.status}  // Use the controlled state 
                  />
                  <label className="form-check-label" htmlFor="bkash_status">
                    Enable / Disable
                  </label>
                </div>

                <div className="form-check form-switch mb-3 text-right">
                  <button type="submit" className="btn btn-sm btn-success">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className={`w-100 ${tabIndex == 1 ? "d-block" : "d-none"}`}>
            <h6>Nogod Payment Method</h6>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
