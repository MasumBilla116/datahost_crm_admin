import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import {http} from "../../../utils/axios";
import Router, { useRouter } from "next/router";
import Switch from "react-switch";
import { HeadSection, Label, RadioButton } from "../../../../components/";
import Breadcrumbs from "../../../../components/Breadcrumbs";
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
  type,
  accountHead,
  loading,
  sectorLists,
  setSubmitData,
}) => {
  const option = [
    { value: "current", label: "CURRENT", name: "type" },
    { value: "personal", label: "PERSONAL", name: "type" },
    { value: "cash", label: "CASH", name: "type" },
  ];

  return (
    <>
      <div className="card shadow p-3">
        <Form noValidate validated={true} onSubmit={submit}>
          <div className="card-body border-bottom ">
            <h4 className="card-title fw-bolder">Update Account</h4>
          </div>
          <div className="card-body">
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Account Name*</Form.Label>
                <Form.Control
                  required
                  name="accountsname"
                  type="text"
                  value={submitData?.accountsname}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              {/* start sector head and under sector */}
              <Form.Group as={Col} md="3">
                <Form.Label>
                  Sector Head<span className="text-danger">*</span>
                </Form.Label>

                <Select2
                  options={accountHead?.map(({ label, value }) => ({
                    value: value,
                    label: label,
                    name: "sector_head",
                  }))}
                  value={accountHead.find(
                    (op) => submitData.sector_head === op.value
                  )}
                  onChange={(e) => {
                    setSubmitData((prev) => ({
                      ...prev,
                      sector_head: e?.value,
                    }));
                  }}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>
                  Under Sector<span className="text-danger">*</span>
                </Form.Label>

                {loading ? (
                  <Select>
                    <option value="">loading...</option>
                  </Select>
                ) : (
                  <Select
                    value={submitData?.under_head}
                    onChange={(e) => {
                      setSubmitData((prev) => ({
                        ...prev,
                        under_head: e?.target?.value,
                      }));
                    }}
                  >
                    <option value="0">none</option>
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
                md="10"
                className="d-flex"
                controlId="validationCustom01"
              >
                <Form.Label>Accounts Type*</Form.Label>
                <span className="mx-5">
                  <RadioButton
                    label="Bank"
                    name="acctype"
                    value="bank"
                    checked={values === 0}
                    onChange={changeHandler}
                  />
                </span>
                <RadioButton
                  label="Cash"
                  name="acctype"
                  value="cash"
                  // checked={submitData.acctype == "cash"}
                  checked={values === 1}
                  onChange={changeHandler}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            {values === 0 && (
              <>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Account Number*</Form.Label>
                    <Form.Control
                      required
                      name="accountsnumber"
                      type="text"
                      value={submitData?.accountsnumber}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Bank Name*</Form.Label>
                    <Form.Control
                      required
                      name="bankname"
                      type="text"
                      value={submitData?.bankname}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Branch Name*</Form.Label>
                    <Form.Control
                      required
                      name="branchname"
                      type="text"
                      value={submitData?.branchname}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Type*</Form.Label>
                    <Form.Control
                      required
                      name="type"
                      type="text"
                      value={submitData?.type}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Accounts Descriptions**</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      rows={3}
                      name="descriptionbank"
                      value={submitData?.descriptionbank}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </>
            )}
            {values === 1 && (
              <>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Opening Balance*</Form.Label>
                    <Form.Control
                      required
                      name="openingbalance"
                      type="number"
                      // value={(type === "BANK" && values === 0) || (type === "CASH" && values === 1) ? submitData?.openingbalance : ""}
                      value={submitData?.openingbalance}
                      onChange={changeHandler}
                      min={0}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="10" controlId="validationCustom01">
                    <Form.Label>Accounts Descriptions**</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      rows={3}
                      name="description"
                      // value={(type === "BANK" && values === 0) || (type === "CASH" && values === 1) ? submitData?.description : ""}
                      value={submitData?.description}
                      onChange={changeHandler}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </>
            )}
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
            <Row className="w-50 m-auto p-4">
              <Button variant="success" type="submit">
                Update Account
              </Button>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

const UpdateAccount = () => {
  const { http } = Axios();
  // Router setup
  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;
  const { pathname } = router;

  // Toastify setup
  const notify = useCallback((type: any, message: any) => {
    toast({ type, message });
  }, []);

  // State declaration
  const [status, setStatus]: any = useState(false);
  const [submitData, setSubmitData]: any = useState([]);
  const [validated, setValidated] = useState(false);
  const [values, setvalues]: any = useState(0);
  const [type, setType] = useState("");

  const [account, setAccount] = useState([]);

  // Onchange event
  const changeHandler = (e: any) => {
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

  // Onsubmit event
  const submit = async (e: any) => {
    e.preventDefault();
    // e.stopPropagation();

    // Validation
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      // setValidated(true);
      // Post data

      let values = {};
      if (type === "CASH") {
        values = {
          accountsname: submitData?.accountsname,
          acctype: type.toLowerCase(),
          openingbalance: submitData?.openingbalance,
          description: submitData?.description,
          prev_under_head: submitData?.prev_under_head,
          under_head: submitData?.under_head,
          sector_head: submitData?.sector_head,
        };
      } else {
        values = {
          accountsname: submitData?.accountsname,
          acctype: type.toLowerCase(),
          accountsnumber: submitData?.accountsnumber,
          bankname: submitData?.bankname,
          branchname: submitData?.branchname,
          type: submitData?.type,
          description: submitData?.descriptionbank,
          pos_availability: status,
          prev_under_head: submitData?.prev_under_head,
          under_head: submitData?.under_head,
          sector_head: submitData?.sector_head,
        };
      }
      let body: any = {};
      body = {
        action: "updateAccounts",
        value: values,
        id,
      };

      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((res) => {
          if (res) {
            notify("success", "Data saved successfully!");
            Router.push("/modules/accounts/list");
          } else {
            notify("failed", "Something went wrong!");
          }
        });
    } else {
      notify("error", "Fields cannot be empty!");
      setValidated(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    //fetch all suppliers
    const getSuppliers = async () => {
      let body: any = {};
      body = {
        action: "getById",
        id,
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, body)
        .then((result) => {
          
          setSubmitData({
            ...submitData,
            sector_head: result?.data?.data[0]?.main_sector_header,
            under_head: result?.data?.data[0]?.sub_sector_header_id,
            prev_under_head: result?.data?.data[0]?.sub_sector_header_id,
            accountsname: result?.data?.data[0]?.account_name,
            accountsnumber:
              result?.data?.data[0]?.account_no !== "NA"
                ? result?.data?.data[0]?.account_no
                : "",
            bankname:
              result?.data?.data[0]?.bank !== "NA"
                ? result?.data?.data[0]?.bank
                : "",
            branchname:
              result?.data?.data[0]?.branch !== "NA"
                ? result?.data?.data[0]?.branch
                : "",
            type:
              result?.data?.data[0]?.account_type !== "NA"
                ? result?.data?.data[0]?.account_type
                : "",
            descriptionbank:
              result?.data?.data[0]?.type === "BANK"
                ? result?.data?.data[0]?.description
                : "",
            openingbalance:
              result?.data?.data[0]?.type === "CASH"
                ? result?.data?.data[0]?.opening_balance
                : "",
            description:
              result?.data?.data[0]?.type === "CASH"
                ? result?.data?.data[0]?.description
                : "",
          });
          setType(result?.data?.data[0]?.type);
          setStatus(result?.data?.data[0]?.status);
          setvalues(result?.data?.data[0]?.type === "BANK" ? 0 : 1);
        });
    };
    getSuppliers();

    return () => controller.abort();
  }, [isReady, id]);

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Account", link: "/modules/accounts" },
    { text: "Update Account", link: "/modules/accounts/update/[id]" },
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

  // const handleSector = (e) => {
  //   setSector((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  // end sector and under sector section
  return (
    <>
      <HeadSection title="Update Accounts" />
      <div className="container-fluid">
        <div className="w-75 m-auto">
          {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
          <FirstForm
            submit={submit}
            changeHandler={changeHandler}
            status={status}
            setStatus={setStatus}
            submitData={submitData}
            values={values}
            account={account}
            type={type}
            accountHead={accountHead}
            loading={loading}
            sectorLists={sectorLists}
            setSubmitData={setSubmitData}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateAccount;
