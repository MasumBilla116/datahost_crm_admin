import { useCallback, useEffect, useState } from "react";
import {
  HeadSection,
  Label,
  RadioButton,
  Select2,
} from "../../../../../components";
import ActiveCurrency from "../../../../../components/ActiveCurrency";
import toast from "../../../../../components/Toast/index";
import { useRouter } from "../../../../../node_modules/next/router";
import Axios from "../../../../../utils/axios";

function index() {
  const notify = useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [supplier, setSupplier] = useState([]);
  const [supplierID, setSupplierID] = useState([]);
  const [balance, setBalance] = useState("");
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountID, setAccountID] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [values, setValues]: Boolean = useState(true); //Acc type Checking ...
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      /**
       * !Getting Supplier Details
       * ?URL: /app/purchase/supplier
       * @param body1
       */

      let bodySupplier: any = {};
      bodySupplier = {
        action: "getAllSupplier",
      };

      let bodyAccounts: any = {};
      bodyAccounts = {
        action: "getAccounts",
        acctype: "cash",
      };

      const res = await Promise.all([
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
            bodySupplier
          )
          .then((res: any) => setSupplier(res?.data?.data)),

        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
            bodyAccounts
          )
          .then((res: any) => setAccounts(res?.data?.data)),
      ]);

      //Setting acctype
      setPaymentInfo({ acctype: "cash" });
    };
    getData();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getBalance = async () => {
      setBalance("");
      let body: any = {};
      body = {
        action: "getSupplierBalance",
        supplier_id: supplierID,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((res: any) =>
          setBalance(!!res?.data?.data.length && res?.data?.data[0]?.balance)
        );
    };

    getBalance();

    return () => controller.abort();
  }, [supplierID]);

  useEffect(() => {
    const controller = new AbortController();

    const getAccountBalance = async () => {
      // setAccountBalance("")
      let body: any = {};
      body = {
        action: "getAccountBalance",
        account_id: accountID,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res: any) => {
          setAccountBalance(res?.data?.data?.balance);
        });
    };

    getAccountBalance();

    return () => controller.abort();
  }, [accountID]);

  const getAccounts = async (type: any) => {
    let bodyAccounts: any = {};
    bodyAccounts = {
      action: "getAccounts",
      acctype: type,
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
        bodyAccounts
      )
      .then((res: any) => setAccounts(res?.data?.data));
  };

  // Onchange event
  const changeHandler = (e: any) => {
    e.name !== "id"
      ? e?.target?.name === "acctype"
        ? e.target.value === "bank"
          ? (setValues(false), getAccounts("bank"))
          : (setValues(true), getAccounts("cash"))
        : ""
      : "";

    if (e?.target?.value || e?.value) {
      setValidated(true);
    } else {
      setValidated(false);
    }

    e.name === "supplier_id" ? setSupplierID(e?.value) : "";
    e.name === "id" ? setAccountID(e?.value) : "";
    e.name === "id" || e.name === "supplier_id"
      ? setPaymentInfo({ ...paymentInfo, [e.name]: e.value })
      : setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  // Onsubmit event
  const submit = async (e: any) => {
    e.preventDefault();
    // e.stopPropagation();

    // Validation
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      // Post data
      let body: any = {};
      body = {
        action: "makePayments",
        value: paymentInfo,
        supplier_id: supplierID,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res) => {
          notify("success", "Payment Created successfully!");
          router.push(`/modules/supplier/payment`);
        })
        .catch((e) => {
          const msg = e.response?.data?.response;

          if (typeof e.response?.data?.response == "string") {
            notify("error", `${e.response.data.response}`);
          }
        });
    } else {
      notify("error", "Fields cannot be empty!");
      setValidated(false);
    }
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    {
      text: "Payment To supplier",
      link: "/modules/purchase/supplier/payment/create",
    },
  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row">
        <div className="col-12 ">
          <div className="card shadow pl-4 pt-4">
            <HeadSection title="Make Payment To supplier" />
            <h5>Make Payment To supplier</h5>
            <FirstForm
              supplier={supplier}
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              submit={submit}
              balance={balance}
              setSupplierID={setSupplierID}
              accounts={accounts}
              accountBalance={accountBalance}
              setAccounts={setAccounts}
              values={values}
              changeHandler={changeHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;

const FirstForm = ({
  changeHandler,
  supplier,
  setPaymentInfo,
  paymentInfo,
  submit,
  balance,
  accountBalance,
  setSupplierID,
  accounts,
  setAccounts,
  values,
}) => {
  return (
    <div className="w-75">
      <form onSubmit={submit}>
        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Payment Type"
          />
          <div className="col-sm-12 col-lg-10 col-md-12 d-flex">
            <span className="mr-3">
              <RadioButton
                label="Bank"
                id="Bank"
                name="acctype"
                value="bank"
                checked={!values}
                onChange={changeHandler}
              />
            </span>
            <RadioButton
              label="Cash"
              id="Cash"
              name="acctype"
              value="cash"
              checked={values}
              onChange={changeHandler}
            />
          </div>
        </div>

        <div className="row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Supplier Name"
          />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <Select2
              options={supplier?.map(({ id, name }) => ({
                value: id,
                label: name,
                name: "supplier_id",
              }))}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <Label className="col-sm-2 col-lg-2 col-md-2 fw-bolder" text="" />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <span className="fw-bolder">
              Balance:{" "}
              <small>
                {" "}
                <ActiveCurrency />{" "}
              </small>{" "}
              {balance}
            </span>
          </div>
        </div>
        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Accounts"
          />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <Select2
              options={accounts?.map(({ name, id }) => ({
                value: id,
                label: name,
                name: "id",
              }))}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <Label className="col-sm-2 col-lg-2 col-md-2 fw-bolder" text="" />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <span className="fw-bolder">
              Balance:
              <small>
                {" "}
                <ActiveCurrency />{" "}
              </small>{" "}
              {accountBalance}
            </span>
          </div>
        </div>

        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Ammount"
          />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="form-control"
              value={paymentInfo?.ammount}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <Label className="col-sm-2 col-lg-2 col-md-2 fw-bolder" text="Date" />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <input
              type="date"
              placeholder="Invoice Date:"
              className="form-control"
              name="date"
              value={paymentInfo?.date}
              onChange={changeHandler}
              id="date"
            />
          </div>
        </div>

        {!!!values && (
          <div className="mb-3 row">
            <Label
              className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
              text="Cheque Details"
            />
            <div className="col-sm-12 col-lg-8 col-md-12">
              <input
                type="text"
                name="check_num"
                placeholder="Checque Number"
                className="form-control"
                value={paymentInfo?.check_num}
                onChange={changeHandler}
              />
            </div>
          </div>
        )}

        <div className="mb-5 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Payment Note"
          />
          <div className="col-sm-12 col-lg-8 col-md-12">
            <input
              type="text"
              name="remarks"
              placeholder="Remarks"
              className="form-control"
              value={paymentInfo?.remarks}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="mb-3 ">
          <button className="btn btn-primary w-xs-100" type="submit">
            Submit Payment
          </button>
        </div>
      </form>
    </div>
  );
};

//options={accounts?.map((item, index) => ({ value: item, label: item.account_type == "NA"? "Default Cash AC NA" : item.account_type, name: "type" }))}
