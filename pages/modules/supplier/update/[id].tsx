import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import countryList from "react-select-country-list";
import Switch from "react-switch";
import { Button, Label, Select2 } from "../../../../components";
import Select from "../../../../components/elements/Select";
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

const Update = (props: any) => {
  const router = useRouter();
  const { pathname } = router;
  const [value, setValue] = useState([]);
  const [status, setStatus] = useState([]);
  const [country, setCountry] = useState();
  const options = useMemo(() => countryList().getData(), []);
  const { notify } = MyToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sectorLists, setSectorList] = useState([]);
  const {
    query: { id },
  } = router;
  console.log("id", id);

  const { http } = Axios();
  //const { id } = router.query;
  const getSupplierByID = async () => {
    try {
      let body: any = {};
      body = {
        action: "getSupplierByID",
        id: id,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
          body
        )
        .then((result) => {
          setValue(result.data.data[0]); //var j = {0: "1", 1: "2", 2: "3", 3: "4"}; Object.values(j)->["1", "2", "3", "4"]
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSupplierByID();
  }, [id]);

  const supplier_type = [
    { value: "regular", label: "Regular", name: "supplier_type" },
    { value: "company", label: "Company", name: "supplier_type" },
    { value: "temporary", label: "Temporary", name: "supplier_type" },
  ];

  const setInitialValue = () => {
    try {
      setStatus(!!status);
    } catch (error) {
      console.log(error);
    }
  };
  const changeHandler = (e: any) => {
    e.name == "supplier_type"
      ? setValue({ ...value, [e.name]: e.value })
      : setValue({ ...value, [e.target.name]: e.target.value });
  };
  const submitForm = async (e: any) => {
    e.preventDefault();
    let body: any = {};
    let countryName = "";

    if (!country) {
      countryName = value?.country_name;
    } else {
      countryName = country;
    }

    body = {
      action: "updateSupplier",
      id: Number(id),
      name: value.name,
      // country_name: countryName,
      // type: value.supplier_type,
      default_bank_account: value.bank_acc_number,
      bank_name: value.bank_name,
      tax_id: value.tax_id,
      address: value.supplier_address,
      contact_number: value.contact_number,
      description: value.description,
      opening_balance: value.opening_balance,
      sector_head: value.sector_head,
      sector_id: value.sector_id,
      // status: Number(status)
    };

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
      });
  };

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
  }, [value?.sector_head]);

  const handleCountry = (e: any) => {
    setCountry(e.value);
  };

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Supplier", link: "/modules/purchase/supplier" },
    { text: "Update Supplier", link: "/modules/purchase/supplier/update/[id]" },
  ];

  const accountHead = [{ label: "Liabilities", value: "liability" }];

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={ pathname} /> */}
          <div className="card">
            <div className="card-body border-bottom">
              <h4 className="card-title">Update Supplier Details</h4>
            </div>

            <Form onSubmit={submitForm}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formBasicName" className="mb-3">
                      <Form.Label> Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Supplier Name"
                        onChange={changeHandler}
                        name="name"
                        required
                        value={value?.name}
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicMobile" className="mb-3">
                      <Form.Label>
                        Sector Head<span className="text-danger">*</span>
                      </Form.Label>

                      <Select2
                        options={accountHead?.map(({ label, value }) => ({
                          value,
                          label,
                          name: "sector_head",
                        }))}
                        value={accountHead.find(
                          (option) => option.value === value?.sector_head
                        )}
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
                      <Form.Label> Address</Form.Label>

                      <textarea
                        className="form-control"
                        style={{ height: "150px" }} // Adjust the height as needed
                        placeholder="Supplier Address"
                        onChange={changeHandler}
                        name="supplier_address"
                        value={value?.address}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicBankName" className="mb-3">
                      <Form.Label> Bank Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="i.e: American Bank LTD."
                        onChange={changeHandler}
                        name="bank_name"
                        required
                        value={value?.bank_name}
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicBankAcc" className="mb-4">
                      <Form.Label> Bank Acc</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="i.e: AMX-355-222-111"
                        onChange={changeHandler}
                        name="bank_acc_number"
                        required
                        value={value?.bank_acc_number}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formBasicContact" className="mb-3">
                      <Form.Label> Contact Info</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Contact Number"
                        onChange={changeHandler}
                        name="contact_number"
                        required
                        value={value?.contact_number}
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
                          value={value?.sector_id}
                          onChange={(e) =>
                            setValue((prev) => ({
                              ...prev,
                              sector_id: Number(e?.target?.value),
                            }))
                          }
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

                    <Form.Group controlId="formBasicDescription" className="mb-3">
                      <Form.Label> Description</Form.Label>

                      <textarea
                        className="form-control"
                        style={{ height: "150px" }} // Adjust the height as needed
                        placeholder="Enter additional notes..."
                        onChange={changeHandler}
                        name="description"
                        defaultValue={value?.desciption}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicOpeningBalance">
                      <Form.Label> Opening Balance</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Opening Balance"
                        onChange={changeHandler}
                        name="opening_balance"
                        required
                        value={value?.opening_balance}
                      />
                    </Form.Group>

                    {/* <Form.Group controlId="formBasicOpeningBalance"> */}

                    {/* </Form.Group> */}
                  </div>
                </div>

                <div className="mb-3 row">
                  <Label text="Active/In Active" />
                  <div className="col-sm-9">
                    <Switch
                      onChange={() => setStatus(!status)}
                      checked={status}
                    />
                  </div>
                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-primary">Update</Button>

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
  );
};

export default Update;
