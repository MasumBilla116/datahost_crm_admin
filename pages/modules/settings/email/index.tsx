import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { MultiStepForm, Step } from "react-multi-form";
import Switch from "react-switch";
import { HeadSection, Label } from "../../../../components";
import toast from "../../../../components/Toast/index";
import Axios from "../../../../utils/axios";

const FirstForm = ({
  submit,
  changeHandler,
  status1,
  setStatus1,
  submitData,
}) => {
  return (
    <>
      <div className="card shadow p-3">
        <Form noValidate validated={true} onSubmit={submit}>
          <div className="card-body border-bottom ">
            <h4 className="card-title fw-bolder">Info Email Account</h4>
          </div>
          <div className="card-body">
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="infoemail"
                  type="text"
                  value={submitData?.infoemail}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Username</Form.Label>
                <Form.Control
                  required
                  name="infousername"
                  type="text"
                  value={submitData?.infousername}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Password</Form.Label>
                <Form.Control
                  required
                  name="infopassword"
                  type="password"
                  value={submitData?.infopassword}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Label text="Status" />
              <div className="col-sm-9">
                <Switch
                  onChange={() => setStatus1(!status1)}
                  checked={status1}
                />
              </div>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

const SecondForm = ({
  submit,
  changeHandler,
  status2,
  setStatus2,
  submitData,
}) => {
  return (
    <>
      <div className="card shadow p-3">
        <Form noValidate validated={true} onSubmit={submit}>
          <div className="card-body border-bottom ">
            <h4 className="card-title fw-bolder">Sales Email Account</h4>
          </div>
          <div className="card-body">
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="salesemail"
                  type="text"
                  value={submitData?.salesemail}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Username</Form.Label>
                <Form.Control
                  required
                  name="salesusername"
                  type="text"
                  value={submitData?.salesusername}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Password</Form.Label>
                <Form.Control
                  required
                  name="salespassword"
                  type="password"
                  value={submitData?.salespassword}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Label text="Status" />
              <div className="col-sm-9">
                <Switch
                  onChange={() => setStatus2(!status2)}
                  checked={status2}
                />
              </div>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

const ThirdForm = ({
  submit,
  changeHandler,
  status3,
  setStatus3,
  submitData,
}) => {
  return (
    <>
      <div className="card shadow p-3">
        <Form noValidate validated={true} onSubmit={submit}>
          <div className="card-body border-bottom ">
            <h4 className="card-title fw-bolder">Support Email Account</h4>
          </div>
          <div className="card-body">
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="supportemail"
                  type="text"
                  value={submitData?.supportemail}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Username</Form.Label>
                <Form.Control
                  required
                  name="supportusername"
                  type="text"
                  value={submitData?.supportusername}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>SMTP Password</Form.Label>
                <Form.Control
                  required
                  name="supportpassword"
                  type="password"
                  value={submitData?.supportpassword}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Label text="Status" />
              <div className="col-sm-9">
                <Switch
                  onChange={() => setStatus3(!status3)}
                  checked={status3}
                />
              </div>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

const Create = () => {
  const { http } = Axios();

  // Toastify setup
  const notify = useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);

  // State declaration
  const [status1, setStatus1]: any = useState(false);
  const [status2, setStatus2] = useState(false);
  const [status3, setStatus3] = useState(false);
  const [activeForm, setActiveForm] = useState(1);
  const [validated, setValidated] = useState(false);
  const [submitData, setSubmitData]: any = useState({
    infousername: "",
    infopassword: "",
    infoemail: "",
    salesemail: "",
    salesusername: "",
    salespassword: "",
    supportemail: "",
    supportusername: "",
    supportpassword: "",
  });

  // Onchange event
  const changeHandler = (e: any) => {
    if (e.target.value) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    setSubmitData({ ...submitData, [e.target.name]: e.target.value });
  };

  // Onsubmit event
  const submit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      // setValidated(true);
      // Post data
      let body: any = {};
      body = {
        action: "saveInfo",
        value: submitData,
        status1: Number(status1),
        status2: Number(status2),
        status3: Number(status3),
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/config/email`, body)
        .then((res) => {
          res
            ? notify("success", "Data saved successfully!")
            : notify("failed", "Something went wrong!");
        });
      // if (activeForm === 3) {
      //   setActiveForm(4);
      // }
    } else {
      notify("error", "Fields cannot be empty!");
      setValidated(false);
    }
  };

  //Fetch data Onload event
  useEffect(() => {
    const getEmailConfig = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/config/email`, {
          action: "getEmailConfig",
        })
        .then((res) => {
          const data = res?.data?.data;
          // console.log(data);
          const info: any[] = data.filter(
            (data: { type: any }) => data?.type === "info"
          );
          const sales: any[] = data.filter(
            (data: { type: any }) => data?.type === "sales"
          );
          const support: any[] = data.filter(
            (data: { type: any }) => data?.type === "support"
          );
          setSubmitData({
            ...submitData,
            infousername: info[0]?.username || "",
            infoemail: info[0]?.email || "",
            infopassword: info[0]?.password || "",
            salesusername: sales[0]?.username || "",
            salesemail: sales[0]?.email || "",
            salespassword: sales[0]?.password || "",
            supportusername: support[0]?.username || "",
            supportemail: support[0]?.email || "",
            supportpassword: support[0]?.password || "",
          });
          setStatus1(info[0]?.status);
          setStatus2(sales[0]?.status);
          setStatus3(support[0]?.status);
        });
    };

    getEmailConfig();
  }, []);

  return (
    <>
      <HeadSection title="Email Configuration" />
      <div className="container-fluid">
        <div className="cust-w-75 w-xs-100 m-auto">
          <MultiStepForm activeStep={activeForm}>
            <Step label="Info">
              <FirstForm
                submit={submit}
                changeHandler={changeHandler}
                status1={status1}
                setStatus1={setStatus1}
                submitData={submitData}
              />
            </Step>
            <Step label="Sales">
              <SecondForm
                submit={submit}
                changeHandler={changeHandler}
                status2={status2}
                setStatus2={setStatus2}
                submitData={submitData}
              />
            </Step>
            <Step label="Supports">
              <ThirdForm
                submit={submit}
                changeHandler={changeHandler}
                status3={status3}
                setStatus3={setStatus3}
                submitData={submitData}
              />
            </Step>
          </MultiStepForm>
          <div className="text-center">
            <Button
              style={{ width: "100px" }}
              variant="info"
              onClick={() => {
                activeForm > 1 && setActiveForm(activeForm + -1);
              }}
              className="me-2"
              disabled={activeForm === 1}
            >
              Previous
            </Button>
            {activeForm < 3 && (
              <Fragment>
                <Button
                  style={{ width: "100px" }}
                  variant="info"
                  onClick={() => {
                    activeForm < 3 && setActiveForm(activeForm + 1);
                  }}
                  disabled={activeForm == 3}
                >
                  Next
                </Button>
              </Fragment>
            )}

            {activeForm == 3 && (
              <Button
                style={{ width: "100px" }}
                variant="success"
                onClick={submit}
              >
                Sumbit
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
