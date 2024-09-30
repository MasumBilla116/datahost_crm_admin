import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Switch from "react-switch";
// import RadioButton from "../../../../components/elements/RadioButton";
import MyToast from "@mdrakibul8001/toastify";
import { HeadSection, Label, RadioButton } from "../../../../components/";
import Axios from "../../../../utils/axios";


const create = () => {
    const { http } = Axios();
    const {notify} = MyToast();
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


    const handleChange = (e) => {
        if (e.target.name === "acctype") {
            if (e.target.value === "bank") {
                setvalues(0)
            }
            else {
                setvalues(1)
            }
        }

        setAccount((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    async function submitForm(e) {
        
        e.preventDefault();

        const formData = new FormData(event.target);
        const types = formData.getAll('types[]'); 
        let isSubscribed = true;
        setLoading(true); 
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,{
            action: "createAccounts",
            account:account,status
          })
          .then((res)=>{
            notify("success", "successfully Added!");
            router.push(`/modules/accounts`);
          })
          .catch((e)=>{
            const msg = e.response?.data?.response;
            setLoading(false);
          });
   
        return ()=>isSubscribed=false;
    }
    return (
        <>
            <HeadSection title="Create New Accounts" />
            <div className="container-fluid">
                <div className="w-75 m-auto">
                    <div className="card shadow p-3">

                        <Form onSubmit={submitForm} id="customerForm" noValidate validated={validated}>
                            <div className="card-body border-bottom ">
                                <h4 className="card-title fw-bolder">Create New Account</h4>
                            </div>
                            <div className="card-body">

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="10">
                                        <Form.Label>Account Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Account Name"
                                            name="accountsname"
                                            value={account?.accountsname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col} md="10" className="d-flex">
                                        <Form.Label>Accounts Type <span className="text-danger">*</span></Form.Label>
                                        <span className='mx-5'>
                                            <RadioButton
                                                label="Bank"
                                                id="Bank"
                                                name="acctype"
                                                value="bank"
                                                checked={!values}
                                                onChange={handleChange}
                                            />
                                        </span>
                                        <RadioButton
                                            label="Cash"
                                            id="Cash"
                                            name="acctype"
                                            value="cash"
                                            checked={account.acctype == "cash"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>


                                {values === 0 && <>


                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="10">
                                            <Form.Label>Account Number<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="E.g: NBR-784-333-876-343"
                                                name="accountsnumber"
                                                value={account?.accountsnumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="10">
                                            <Form.Label>Bank Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="bankname"
                                                placeholder="e.g: American Bank Ltd"
                                                value={account?.bankname}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>


                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="10">
                                            <Form.Label>Branch Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="branchname"
                                                placeholder="Las Vegas Banian City"
                                                value={account?.branchname}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="10">
                                            <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="type"
                                                placeholder="e.g: Current/Savings/Others..."
                                                value={account?.type}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>


                                </>
                                }
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="10">
                                        <Form.Label>Opening Balance<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            name="openingbalance"
                                            type="number"
                                            placeholder="e.g: $1000"
                                            value={account?.openingbalance}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col} md="10">
                                        <Form.Label>Accounts Descriptions<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Description..."
                                            rows={3}
                                            name="description"
                                            value={account?.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Row>

                                {values === 0 && <Row>
                                    <Label text="POS Available" />
                                    <div className="col-sm-10 col-md-10 col-lg-10">
                                        <Switch onChange={() => setStatus(!status)} checked={status} />
                                    </div>
                                </Row>}

                                <Row className="w-50 m-auto p-4">
                                    <Button variant="success" type="submit">Create Account</Button>
                                </Row>

                            </div>

                        </Form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default create