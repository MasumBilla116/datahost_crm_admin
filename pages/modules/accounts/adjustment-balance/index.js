import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { HeadSection, Label, RadioButton, Select2 } from '../../../../components';
import ActiveCurrency from "../../../../components/ActiveCurrency";
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';

function index() {
    const notify = useCallback((type, message) => {
        toast({ type, message });
    }, []);
    const router = useRouter();
    const { pathname } = router;
    const { http } = Axios();
    const [balance1, setBalance1] = useState("");
    const [balance2, setBalance2] = useState("");

    const [balanceID1, setBalanceID1] = useState("");
    const [balanceID2, setBalanceID2] = useState("");

    const [adjustmentInfo, setAdjustmentInfo] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [accounts1, setAccounts1] = useState([]);
    const [values, setValues] = useState(true);    //Acc type Checking ...
    const [values1, setValues1] = useState(true);    //Acc type Checking ...
    const [validated, setValidated] = useState(false);
    useEffect(() => {

        const controller = new AbortController();

        const getData = async () => {
            /**
             * !Getting Supplier Details
             * ?URL: /app/purchase/supplier
             * @param body1
             */

            let bodyAccounts = {};
            bodyAccounts = {
                action: "getAccounts",
                acctype: "all"
            };

            const res = await Promise.all([

                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
                    bodyAccounts
                ).then((res) => { setAccounts(res?.data?.data); setAccounts1(res?.data?.data) })

            ]);

            //Setting acctype
            setAdjustmentInfo({ acctype: 'all' });
        }
        getData();


        return () => controller.abort();

    }, []);

    useEffect(() => {

        const controller = new AbortController();

        const getBalance1 = async () => {
            setBalance1("")
            let body = {}
            body = {
                action: "getById",
                id: balanceID1

            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
                body
            ).then((res) => setBalance1(!!res?.data?.data.length && res?.data?.data[0]?.balance))
        }

        getBalance1();

        return () => controller.abort();

    }, [balanceID1])

    useEffect(() => {

        const controller = new AbortController();

        const getBalance2 = async () => {
            setBalance2("")
            let body = {}
            body = {
                action: "getById",
                id: balanceID2

            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
                body
            ).then((res) => setBalance2(!!res?.data?.data.length && res?.data?.data[0]?.balance))
        }

        getBalance2();

        return () => controller.abort();

    }, [balanceID2])

    const getAccounts = async (type) => {
  
        let bodyAccounts = {};
        bodyAccounts = {
            action: "getAccounts",
            acctype: type
        };
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
            bodyAccounts
        ).then((res) => setAccounts(res?.data?.data))
    }

    const getAccounts1 = async (type) => {

        let bodyAccounts = {};
        bodyAccounts = {
            action: "getAccounts",
            acctype: type
        };
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
            bodyAccounts
        ).then((res) => setAccounts1(res?.data?.data))
    }

    // Onchange event
    const changeHandler = (e) => {

        e.name !== "idfrom" ?
            getAccounts('all')
            : e.name !== "idto" ?
                getAccounts('all')
                : ""
            ;

        if (e?.target?.value || e?.value) {
            setValidated(true);
        }
        else {
            setValidated(false);
        }
        e.name === "adjust_account" ? setBalanceID1(e?.value)
            : e.name === "adjust_account" ?
                setBalanceID2(e?.value)
                :
                "";
        e.name === "adjust_account" ?
            setAdjustmentInfo({ ...adjustmentInfo, [e.name]: e.value }) :
            setAdjustmentInfo({ ...adjustmentInfo, [e.target.name]: e.target.value })
    }

    // Onsubmit event
    const submit = async (e) => {
        e.preventDefault();
        // e.stopPropagation();

        // Validation
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            // Post data
            let body = {}
            body = {
                action: "adjustmentAccount",
                value: adjustmentInfo, balance1

            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,
                body
            ).then((res) => {
                notify("success", "successfully Transfered!");
                router.push(`/modules/accounts/adjustment-balance/details/${res.data.data}`);
            })
        }
        else {
            notify("error", "Fields cannot be empty!")
            setValidated(false);
        }
    }
    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Balance Adjustment', link: '/modules/accounts/adjustment-balance' },
    ]
    return (
        <div className="container-fluid">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            {/* <HeadSection title="Accounts List" /> */}

            <div className="row">
                <div className="col-12">
                    <div className='card shadow p-5'>
                        <HeadSection title="Balance Adjustment" />
                        <h5>Balance Adjustment of Accounts</h5>
                        <FirstForm adjustmentInfo={adjustmentInfo}
                            setAdjustmentInfo={setAdjustmentInfo} submit={submit}
                            balance1={balance1}
                            balance2={balance2}
                            accounts={accounts} setAccounts={setAccounts}
                            values={values}
                            values1={values1}
                            accounts1={accounts1} setAccounts1={setAccounts1}
                            changeHandler={changeHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default index

const FirstForm = ({ values1, changeHandler, setAdjustmentInfo, adjustmentInfo,
    submit, balance1, balance2, accounts, accounts1, setAccounts, setAccounts1, values }) => {

    return (
        <div className='w-75 m-auto my-2 pt-4'>
            <form onSubmit={submit}>
                <div className="mb-3 row">
                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Adjustment to Account" />
                    <div className="col-sm-8 col-lg-8 col-md-8">
                        <Select2
                            options={accounts?.map(({ name, id }) => ({ value: id, label: name, name: "adjust_account" }))}
                            onChange={changeHandler}
                        />
                        <span className='fw-bolder'>Current Balance: <small> <ActiveCurrency/></small> {balance1}</span>
                    </div>
                </div>

                <div className="mb-3 row">
                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Adjustment type" />
                    <div className="col-md-8">
                        <div className="row">
                            <div className="flex-gap align-items-center">
                                <RadioButton
                                    label="Increase Balance"
                                    id="Increase Balance"
                                    name="adjustment_type"
                                    value="increase"
                                    checked={adjustmentInfo.adjustment_type == "increase"}
                                    onChange={changeHandler}
                                />

                                <RadioButton
                                    label="Decrease Balance"
                                    id="Decrease Balance"
                                    name="adjustment_type"
                                    value="decrease"
                                    checked={adjustmentInfo.adjustment_type == "decrease"}
                                    onChange={changeHandler}
                                />

                            </div>
                        </div>
                    </div>
                </div>


                <div className="mb-3 pt-3 row border-top">
                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Adjustment Ammount" />
                    <div className="col-sm-8 col-lg-8 col-md-8">
                        <input type="number" name="amount" placeholder="Amount" className="form-control" value={adjustmentInfo?.ammount} onChange={changeHandler} />
                    </div>
                </div>

                <div className="mb-5 row">
                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Remarks" />
                    <div className="col-sm-8 col-lg-8 col-md-8">
                        <input type="text" name="remarks" placeholder="Remarks" className="form-control" value={adjustmentInfo?.remarks} onChange={changeHandler} />
                    </div>
                </div>
                <div className="mb-3 row">
                    <Button className="w-25 m-auto" type="submit">Submit Balance Adjustment</Button>
                </div>
            </form>
        </div>
    )
}