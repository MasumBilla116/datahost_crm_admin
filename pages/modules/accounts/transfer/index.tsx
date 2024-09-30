import { format } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { HeadSection, Label, Select2 } from "../../../../components";
import ActiveCurrency from "../../../../components/ActiveCurrency";
import toast from "../../../../components/Toast/index";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "acnt.fnd_trnfr",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

function index() {
  const notify = useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);
  const router = useRouter();

  const { pathname } = router;
  const { http } = Axios();
  const [balance1, setBalance1] = useState("");
  const [balance2, setBalance2] = useState("");

  const [balanceID1, setBalanceID1] = useState("");
  const [balanceID2, setBalanceID2] = useState("");

  const [paymentInfo, setPaymentInfo] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accounts1, setAccounts1] = useState([]);
  const [values, setValues]: Boolean = useState(true); //Acc type Checking ...
  const [values1, setValues1]: Boolean = useState(true); //Acc type Checking ...
  const [validated, setValidated] = useState(false);
  const [date, setDate] = useState("");
  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      /**
       * !Getting Supplier Details
       * ?URL: /app/purchase/supplier
       * @param body1
       */

      let bodyAccounts: any = {};
      bodyAccounts = {
        action: "getAccounts",
        acctype: "all",
      };

      const res = await Promise.all([
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
            bodyAccounts
          )
          .then((res: any) => {
            setAccounts(res?.data?.data);
            setAccounts1(res?.data?.data);
          }),
      ]);

      //Setting acctype
      setPaymentInfo({ acctype: "all" });
    };
    getData();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getBalance1 = async () => {
      setBalance1("");
      let body: any = {};
      body = {
        action: "getById",
        id: balanceID1,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res: any) =>
          setBalance1(!!res?.data?.data.length && res?.data?.data[0]?.balance)
        );
    };

    getBalance1();

    return () => controller.abort();
  }, [balanceID1]);

  useEffect(() => {
    const controller = new AbortController();

    const getBalance2 = async () => {
      setBalance2("");
      let body: any = {};
      body = {
        action: "getById",
        id: balanceID2,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res: any) =>
          setBalance2(!!res?.data?.data.length && res?.data?.data[0]?.balance)
        );
    };

    getBalance2();

    return () => controller.abort();
  }, [balanceID2]);

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

  const getAccounts1 = async (type: any) => {
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
      .then((res: any) => setAccounts1(res?.data?.data));
  };

  const changeDate = (e: any) => {
    setDate(format(new Date(e), "yyyy-MM-dd"));
  };

  // Onchange event
  const changeHandler = (e: any) => {
    /*e.name !== "idfrom"?
        e?.target?.name === "acctypefrom"?
            e.target.value === "bank"?
            (setValues(false), getAccounts('bank'))
            :
                (setValues(true), getAccounts('cash'))
            : ""
        :"";

        e.name !== "idto"?
        e?.target?.name === "acctypeto"?
            e.target.value === "bank"?
            (setValues1(false), getAccounts1('bank'))
            :
                (setValues1(true), getAccounts1('cash'))
            : ""
        :"";*/

    e.name !== "idfrom"
      ? getAccounts("all")
      : e.name !== "idto"
      ? getAccounts("all")
      : "";

    if (e?.target?.value || e?.value) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    e.name === "idfrom"
      ? setBalanceID1(e?.value)
      : e.name === "idto"
      ? setBalanceID2(e?.value)
      : "";
    e.name === "idfrom" || e.name === "idto"
      ? setPaymentInfo({ ...paymentInfo, [e.name]: e.value, date })
      : setPaymentInfo({
          ...paymentInfo,
          [e.target.name]: e.target.value,
          date,
        });
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
        action: "transferFund",
        value: paymentInfo,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res) => {
          notify("success", "successfully Transfered!");
          router.push(`/modules/accounts/transfer/details/${res.data.data}`);
        });
    } else {
      notify("error", "Fields cannot be empty!");
      setValidated(false);
    }
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Transfer Fund ", link: "/modules/accounts/transfer" },
  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row">
        <div className="col-12  p-xs-2 ">
          <div className="card shadow p-3 ">
            <HeadSection title="Transfer Fund" />
            <h5 className="card-title">Transfer Fund Operations</h5>
            <hr className="mt-0" />
            <FirstForm
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              submit={submit}
              balance1={balance1}
              balance2={balance2}
              accounts={accounts}
              setAccounts={setAccounts}
              values={values}
              values1={values1}
              accounts1={accounts1}
              setAccounts1={setAccounts1}
              changeHandler={changeHandler}
              changeDate={changeDate}
              date={date}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;

const FirstForm = ({
  values1,
  changeHandler,
  setPaymentInfo,
  paymentInfo,
  changeDate,
  date,
  submit,
  balance1,
  balance2,
  accounts,
  accounts1,
  setAccounts,
  setAccounts1,
  values,
}) => {
  // const [date, setDate] = useState("");

  return (
    <div className="">
      <form onSubmit={submit}>
        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Accounts From"
          />
          <div className="col-sm-12 col-lg-4 col-md-8">
            <Select2
              options={accounts?.map(({ name, id }) => ({
                value: id,
                label: name,
                name: "idfrom",
              }))}
              onChange={changeHandler}
            />
            <span className="fw-bolder">
              Balance:{" "}
              <small>
                {" "}
                <ActiveCurrency />
              </small>{" "}
              {balance1}
            </span>
          </div>
        </div>

        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Accounts To"
          />
          <div className="col-sm-12 col-lg-4 col-md-8">
            <Select2
              options={accounts1?.map(({ name, id }) => ({
                value: id,
                label: name,
                name: "idto",
              }))}
              onChange={changeHandler}
            />
            <span className="fw-bolder">
              Balance:{" "}
              <small>
                {" "}
                <ActiveCurrency />
              </small>{" "}
              {balance2}
            </span>
          </div>
        </div>

        <div className="mb-3 pt-3 row border-top">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Ammount"
          />
          <div className="col-sm-12 col-lg-4 col-md-8">
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
          <div className="col-sm-12 col-lg-4 col-md-8 ">
            {/* <input type="date" placeholder="Invoice Date:" className="form-control" name="date" value={paymentInfo?.date} onChange={changeHandler} id="date" /> */}

            <DatePicker
              type="date"
              className="form-control form-control w-xs-100"
              value={date}
              placeholderText={"Please select a date"}
              required
              onChange={changeDate}
            />
          </div>
        </div>

        <div className="mb-3 row">
          <Label
            className="col-sm-2 col-lg-2 col-md-2 fw-bolder"
            text="Remarks"
          />
          <div className="col-sm-12 col-lg-4 col-md-8">
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
        <div className="row">
          <div className="col-sm-2 col-lg-2 col-md-2"></div>
          <div className="col-sm-2 col-lg-4 col-md-8">
            <Button className="w-100 " type="submit">
              Transfer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

//options={accounts?.map((item, index) => ({ value: item, label: item.account_type == "NA"? "Default Cash AC NA" : item.account_type, name: "type" }))}
