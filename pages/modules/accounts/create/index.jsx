import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import {http} from "../../../utils/axios";
import { useRouter } from "next/router";
import Switch from "react-switch";
import { HeadSection, Label, RadioButton } from "../../../../components";
import toast from "../../../../components/Toast/index";
import Select from "../../../../components/elements/Select";
import Select2 from "../../../../components/elements/Select2";
import Axios from "../../../../utils/axios";

const SubSectors = ({ sect, dot }) => {
  return (
    <>
      {sect?.children_recursive?.map((subsect, i) => (
        <Fragment key={i}>
          <option value={subsect.id} data_name={subsect.title}>
            {dot}
            {subsect.title}
          </option>
          {subsect?.children_recursive?.length != 0 && (
            <SubSectors sect={subsect} dot={"----" + dot} />
          )}
        </Fragment>
      ))}
    </>
  );
};

const FirstForm = ({
  submit,
  changeHandler,
  status,
  setStatus,
  submitData,
  values,
  validated,
  accountHead,
  loading,
  sectorLists,
  handleSector,
  setSubmitData,
}) => {
  const option = [
    { value: "current", label: "CURRENT", name: "type" },
    { value: "personal", label: "PERSONAL", name: "type" },
    { value: "cash", label: "CASH", name: "type" },
  ];

  return (
    <>
      <div className="card shadow">
        <Form noValidate validated={validated} onSubmit={submit}>
          <div className="card-body border-bottom pb-1">
            <h4 className="card-title fw-bolder">Create New Account</h4>
          </div>
          <div className="card-body">
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustom01">
                <Form.Label>
                  Account Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  required
                  name="accountsname"
                  type="text"
                  value={submitData?.accountsname}
                  onChange={changeHandler}
                  placeholder="Accounts Name"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              {/* start sector head and under sector */}
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Sector Head<span className="text-danger">*</span>
                </Form.Label>

                <Select2
                  options={accountHead?.map(({ label, value }) => ({
                    value: value,
                    label: label,
                    name: "sector_head",
                  }))}
                  onChange={(e) => {
                    setSubmitData((prev) => ({
                      ...prev,
                      sector_head: e?.value,
                    }));
                  }}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Under Sector<span className="text-danger">*</span>
                </Form.Label>

                {loading ? (
                  <Select>
                    <option value="">loading...</option>
                  </Select>
                ) : (
                  <Select
                    onChange={(e) => {
                      setSubmitData((prev) => ({
                        ...prev,
                        under_sector: e?.target?.value,
                      }));
                    }}
                  >
                    <option value="0">None</option>
                    {sectorLists &&
                      sectorLists?.map((sect, ind) => (
                        <Fragment key={ind}>
                          <option value={sect.id}>{sect.title}</option>
                          {sect?.children_recursive?.length != 0 && (
                            <SubSectors sect={sect} dot="----" />
                          )}
                        </Fragment>
                      ))}
                  </Select>
                )}
              </Form.Group>

              {/* end sector head and under sector */}
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="12"
                className=" "
                controlId="validationCustom01"
              >
                <Form.Label>
                  Accounts Type<span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex">
                  <span className="me-4">
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
                    checked={submitData.acctype == "cash"}
                    onChange={changeHandler}
                  />
                </div>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            {values === 0 && (
              <>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>
                      Account Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      name="accountsnumber"
                      type="text"
                      placeholder="E.g: NBR-784-333-876-343"
                      value={submitData?.accountsnumber}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>
                      Bank Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      name="bankname"
                      placeholder="e.g: American Bank Ltd"
                      type="text"
                      value={submitData?.bankname}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>
                      Branch Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      name="branchname"
                      placeholder="Las Vegas Banian City"
                      type="text"
                      value={submitData?.branchname}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>
                      Type<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      name="type"
                      placeholder="e.g: Current/Savings/Others..."
                      type="text"
                      value={submitData?.type}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </>
            )}
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustom01">
                <Form.Label>
                  Opening Balance<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  required
                  name="openingbalance"
                  type="number"
                  placeholder="e.g: $1000"
                  value={submitData?.openingbalance}
                  onChange={changeHandler}
                  min={0}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustom01">
                <Form.Label>
                  Accounts Descriptions<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  placeholder="Description..."
                  rows={3}
                  name="description"
                  value={submitData?.description}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            {values === 0 && (
              <Row>
                <Label text="POS Available" />
                <div className="col-sm-10 col-md-10 col-lg-10">
                  <Switch
                    onChange={() => setStatus(!status)}
                    checked={status}
                  />
                </div>
              </Row>
            )}
            <Row className="m-auto cust-w-25 w-xs-100 p-4">
              <Button variant="success" type="submit">
                Create Account
              </Button>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

const Create = () => {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  // Toastify setup
  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  // State declaration
  const [status, setStatus] = useState(false);
  const [submitData, setSubmitData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [values, setvalues] = useState(0);

  // Onchange event
  const changeHandler = (e) => {
    if (e.target.name === "acctype") {
      if (e.target.value === "bank") {
        setvalues(0);
      } else {
        setvalues(1);
      }
    }
    if (e.target.value) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    setSubmitData({ ...submitData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setSubmitData({ ...submitData, acctype: "bank" });
  }, []);

  // Onsubmit event
  const submit = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    e.preventDefault();
    let body = {};
    body = {
      action: "createAccounts",
      value: submitData,
      status: Number(status),
    };


    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
      .then((res) => {
        notify("success", "successfully Added!");
        router.push(`/modules/accounts/list`);
        setValidated(true);
      })
      .catch((e) => {
        notify("error", "Fields cannot be empty!");
        setValidated(false);
      });
  };
  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Account", link: "/modules/accounts" },
    { text: "Create Account", link: "/modules/accounts/create" },
  ];

  // start sector and under sector section
  const accountHead = [
    { label: "Assets", value: "asset" },
    { label: "Liabilities", value: "liability" },
    { label: "Expenses", value: "expenditure" },
    { label: "Revenue", value: "revenue" },
  ];
  const [generalLedger, setGeneralLedger] = useState({
    name: "",
    sector_head: "",
    sector_id: null,
    opening_balance: null,
    balance: null,
    description: "",
    status: 1,
  });
  const [loading, setLoading] = useState(true);
  const [sectorLists, setSectorList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: submitData?.sector_head,
          action: "getSubSectors",
        })
        .then((res) => {
          setSectorList(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("fetching sector list error", error);
        });
    };
    sectorList();
    return () => controller.abort();
  }, [submitData.sector_head]);

  const [sector, setSector] = useState({
    sector_head: null,
    under_sector: null,
  });
  const handleSector = (e) => {
    setSector((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // end sector and under sector section

  return (
    <>
      <HeadSection title="Create New Accounts" />
      <div className="container-fluid">
        <div className="cust-w-75 m-auto w-xs-100">
          {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
          <FirstForm
            submit={submit}
            changeHandler={changeHandler}
            status={status}
            setStatus={setStatus}
            submitData={submitData}
            values={values}
            validated={validated}
            accountHead={accountHead}
            loading={loading}
            sectorLists={sectorLists}
            handleSector={handleSector}
            setSubmitData={setSubmitData}
          />
        </div>
      </div>
    </>
  );
};

export default Create;
