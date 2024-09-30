import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import HeadSection from "../../../../components/HeadSection";
import Select from "../../../../components/elements/Select";
import Select2 from "../../../../components/elements/Select2";
import Axios from "../../../../utils/axios";

const SubSectors = ({ sect, dot }) => {

    return (
        <>
            {sect?.children_recursive?.map((subsect, i) => (
                <Fragment key={i}>
                    <option value={subsect.id} data_name={subsect.title} >{dot}{subsect.title}</option>
                    {subsect?.children_recursive?.length != 0 && (
                        <SubSectors sect={subsect} dot={'----' + dot} />
                    )}
                </Fragment>
            ))}
        </>
    );
}

const create = () => {
    const { http } = Axios();
    const { notify } = MyToast();
    const router = useRouter();
    const { pathname } = router;

    const [loading, setLoading] = useState(true);
    const [validated, setValidated] = useState(false);
    const [status, setStatus] = useState(false);
    const [values, setvalues] = useState(0);
    const [account, setAccount] = useState({
        accountsname: "",
        acctype: "",
        accountsnumber: "",
        bankname: "",
        branchname: "",
        type: "",
        openingbalance: "",
        description: ""
    })

    const [generalLedger, setGeneralLedger] = useState({
        name: "",
        sector_head: "",
        sector_id: null,
        opening_balance: null,
        balance: null,
        description: "",
        status: 1,

    });

    const accountHead = [
        { label: 'Assets', value: 'asset' },
        { label: 'Liabilities', value: 'liability' },
        { label: 'Expenses', value: 'expenditure' },
        { label: 'Revenue', value: 'revenue' }
    ]


    const [sectorLists, setSectorList] = useState([]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        const sectorList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`,
                { account_type: generalLedger?.sector_head, action: "getSubSectors" }
            ).then((res) => {
                setSectorList(res.data.data);
                setLoading(false);
            }).catch((error) => {
                console.log('fetching sector list error', error);
            });
        };
        sectorList()
        return () => controller.abort();
    }, [generalLedger.sector_head]);


    const handleChange = (e) => {

        setGeneralLedger((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    async function submitForm(e) {

        e.preventDefault();

        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, {
            action: "CreateLedger",
            ...generalLedger
        })
            .then((res) => {
                notify("success", "successfully Added!");
                router.push(`/modules/accounts/general-ledger`);
            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                  }
                  else {
                    if (msg?.name) {
                      notify("error", `${msg.name.Name}`);
                    }
                    if (msg?.sector_head) {
                        notify("error", `${msg.sector_head.Sector_head}`);
                      }
                      if (msg?.sector_id) {
                        notify("error", `${msg.sector_id.Sector_id}`);
                      }
                      if (msg?.opening_balance) {
                        notify("error", `${msg.opening_balance.Opening_balance}`);
                      }
                  }
                setLoading(false);
            });

        return () => isSubscribed = false;
    }

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All General Ledger', link: '/modules/accounts/general-ledger' },
        { text: 'Add General Ledger', link: '/modules/accounts/general-ledger/create' },
    ]

    return (
        <>
            <HeadSection title="Create General Ledger" />
            <div className="container-fluid">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-md-12 p-xs-2">
                        <div className="card shadow">

                            <Form onSubmit={submitForm} id="customerForm" noValidate validated={validated}>
                                <div className="card-body border-bottom ">
                                    <h4 className="card-title fw-bolder">Create General Ledger</h4>
                                </div>
                                <div className="card-body">

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="name"
                                                value={generalLedger?.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>Sector Head<span className="text-danger">*</span></Form.Label>

                                            <Select2
                                                options={accountHead?.map(({ label, value }) => ({ value: value, label: label, name: "sector_head" }))}
                                                onChange={(e) => {
                                                    setGeneralLedger((prev) => ({
                                                        ...prev, sector_head: e.value
                                                    })

                                                    )
                                                }}
                                                required

                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>Under Sector<span className="text-danger">*</span></Form.Label>

                                            {loading ? (
                                                <Select>
                                                    <option value="">loading...</option>
                                                </Select>
                                            ) : (
                                                <Select onChange={(e) => setGeneralLedger(prev => ({
                                                    ...prev, sector_id: Number(e?.target?.value)
                                                }))}>
                                                    <option value="0">none</option>
                                                    {sectorLists &&
                                                        sectorLists?.map((sect, ind) => (
                                                            <Fragment key={ind}>
                                                                <option value={sect.id}>{sect.title}</option>
                                                                {sect?.children_recursive?.length != 0 && (
                                                                    <SubSectors sect={sect} dot='----' />
                                                                )}
                                                            </Fragment>
                                                        ))
                                                    }
                                                </Select>
                                            )}

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Cost Centres<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Currency<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>

                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Effect Inventory<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Payroll<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>

                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Opening Balance<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="opening_balance"
                                                defaultValue={generalLedger?.opening_balance}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Phone<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>

                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>City<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Postal<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>

                                    </Row>






                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Address<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description..."
                                                rows={3}
                                                name="description"
                                                value={account?.description}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description..."
                                                rows={3}
                                                name="description"
                                                value={generalLedger?.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Inactive<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Account Name"
                                                name="accountsname"
                                                value={account?.accountsname}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Comments<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description..."
                                                rows={3}
                                                name="description"
                                                value={account?.description}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </Form.Group>

                                    </Row>



                                    <Row className="cust-w-25 w-xs-100 m-auto p-4">
                                        <Button variant="success" type="submit">Create Ledger</Button>
                                    </Row>

                                </div>

                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default create