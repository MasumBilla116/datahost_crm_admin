import MyToast from "@mdrakibul8001/toastify";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import countryList from "react-select-country-list";
import { Button, HeadSection, Select2 } from "../../../components";
import ActiveCurrency from "../../../components/ActiveCurrency";
import Select from "../../../components/elements/Select";
import { useRouter } from "../../../node_modules/next/router";
import Axios from "../../../utils/axios";

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

const create = () => {
  /** State controlling  */
  const [status, setStatus] = useState([]);
  const [value, setValue] = useState([]);
  const [country, setCountry] = useState({ value: "", label: "" });
  const options = useMemo(() => countryList().getData(), []);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();

  const [isLoading, setIsLoading] = useState(true);
  const [sectorLists, setSectorList] = useState([]);
  /** State controlling  */

  const { http } = Axios();

  const supplier_type = [
    { value: "regular", label: "Regular", name: "supplier_type" },
    { value: "company", label: "Company", name: "supplier_type" },
    { value: "temporary", label: "Temporary", name: "supplier_type" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: value?.sector_head,
          action: "getSubSectors",
        })
        .then((res) => {
          setSectorList(res.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("fetching sector list error", error);
        });
    };
    sectorList();
    return () => controller.abort();
  }, [value.sector_head]);

  /**Submission Form Control */
  const submitForm = async (e: any) => {
    e.preventDefault();
    let body: any = {};
    body = {
      action: "createSupplier",
      name: value.name,
      // country_name: country.label,
      // type: value.supplier_type,
      default_bank_account: value.bank_acc_number,
      bank_name: value.bank_name,
      // tax_id: value.tax_id,
      address: value.supplier_address,
      contact_number: value.contact_number,
      description: value.description,
      opening_balance: value.opening_balance,
      sector_head: value.sector_head,
      sector_id: value.sector_id,

      status: 1,
    };
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
        body
      )
      .then((res) => {
        notify("success", "successfully Added!");
        router.push(`/modules/supplier/list`);
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.sector_head) {
            notify("error", `${msg.sector_head.Sector_head}`);
          }
          if (msg?.sector_id) {
            notify("error", `${msg.sector_id.Sector_id}`);
          }
        }

        console.log(msg);
        setLoading(false);
      });

    return () => (isSubscribed = false);
  };

  /**Change Handler Control */
  const changeHandler = (e: any) => {
    e.name == "supplier_type"
      ? setValue({ ...value, [e.name]: e.value })
      : setValue({ ...value, [e.target.name]: e.target.value });
  };

  const accountHead = [{ label: "Liabilities", value: "liability" }];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Supplier", link: "/modules/purchase/supplier" },
    { text: "Create Supplier", link: "/modules/purchase/supplier/create" },
  ];

  return (
    <>
      <HeadSection title="Create Supplier" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add New Supplier</h4>
              </div>
              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="formBasicName" className="mb-3">
                        <Form.Label>
                          {" "}
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Supplier Name"
                          onChange={changeHandler}
                          name="name"
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicMobile" className="mb-3">
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
                            setValue((prev) => ({
                              ...prev,
                              sector_head: e.value,
                            }));
                          }}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicAddress" className="mb-3">
                        <Form.Label>
                          {" "}
                          Address <span className="text-danger">*</span>
                        </Form.Label>

                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Supplier Address"
                          onChange={changeHandler}
                          name="supplier_address"
                          // value={value}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        controlId="formBasicBankName"
                        className="mb-3"
                      >
                        <Form.Label>
                          {" "}
                          Bank Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="i.e: American Bank LTD."
                          onChange={changeHandler}
                          name="bank_name"
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicBankAcc" className="mb-4">
                        <Form.Label>
                          {" "}
                          Bank Acc <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="i.e: AMX-355-222-111"
                          onChange={changeHandler}
                          name="bank_acc_number"
                          required
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group controlId="formBasicContact" className="mb-3">
                        <Form.Label>
                          {" "}
                          Contact Info <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Contact Number"
                          onChange={changeHandler}
                          name="contact_number"
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicMobile" className="mb-3">
                        <Form.Label>
                          Under Sector<span className="text-danger">*</span>
                        </Form.Label>

                        {isLoading ? (
                          <Select>
                            <option value="">loading...</option>
                          </Select>
                        ) : (
                          <Select
                            onChange={(e) =>
                              setValue((prev) => ({
                                ...prev,
                                sector_id: Number(e?.target?.value),
                              }))
                            }
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

                      <Form.Group
                        controlId="formBasicDescription"
                        className="mb-3"
                      >
                        <Form.Label>
                          {" "}
                          Description <span className="text-danger">*</span>
                        </Form.Label>

                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Enter additional notes..."
                          onChange={changeHandler}
                          name="description"
                          // value={value}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicOpeningBalance">
                        <Form.Label>
                          {" "}
                          Opening Balance (<ActiveCurrency />){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Opening Balance"
                          onChange={changeHandler}
                          name="opening_balance"
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button className="btn-info">Save</Button>

                      {/* <Button className="btn-dark">
                        Cancel
                      </Button> */}
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default create;
