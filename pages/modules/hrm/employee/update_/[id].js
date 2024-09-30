import * as CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import HeadSection from "../../../../../components/HeadSection";
import toast from "../../../../../components/Toast/index";
import themeContext from "../../../../../components/context/themeContext";
import Button from "../../../../../components/elements/Button";
import Label from "../../../../../components/elements/Label";
import RadioButton from "../../../../../components/elements/RadioButton";
import Select from "../../../../../components/elements/Select";
import Select2 from "../../../../../components/elements/Select2";
import PropagateLoading from "../../../../../components/PropagateLoading";
import Axios from "../../../../../utils/axios";

export default function UpdateEmployee() {
  const context = useContext(themeContext);
  const { accessType } = context;


  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  const { pathname } = router;

  const [params, setParams] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    if (!isReady) {
      // console.log("fetching...");
      return;
    }

    const key = "123";
    const str = id.replace(/--/g, "/");
    const decrypted = CryptoJS.AES.decrypt(str, key).toString(
      CryptoJS.enc.Utf8
    );

    if (isSubscribed) {
      setParams(decrypted);
    }

    return () => (isSubscribed = false);
  }, [id, isReady]);

  const { http } = Axios();
  const [loading, setLoading] = useState(true);

  const [employee, setEmployee] = useState({
    department_id: null,
    designation_id: null,
    name: "",
    gender: "",
    // salary_type: "",
    // salary_amount: "",
    address: "",
    description: "",
    mobile: "",
    email: "",
    status: 1,
    is_user: false,
    role_id: null,
    roles: [],
    user_status: 1,
    user_defined_password: false,
    password: "",
    country_id: null,
    state_id: null,
    city_id: null,
    countryData: [],
    stateData: [],
    cityData: [],
    getDept: [],
    getAllDesignation: [],
    getEmpDetails: {},
    sector_head: null,
    sector_id: null,
    sector_parent_id: null,
  });

  const [employeeSalary, setEmployeeSalary] = useState({
    salary_type: "",
    salary_amount: "",
  })

  const [additions, setAdditions] = useState([{ addition_typeId: '', addition_typeName: '', addition_amount: '' }]);
  const [deductions, setDeductions] = useState([{ deduction_typeId: '', deduction_typeName: '', deduction_amount: '' }]);


  const handleChange = (e) => {
    setEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setEmployeeSalary((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handleChangeadditions


  const handleChangeadditions = (index, event) => {
    const { name, value } = event.target;
    setAdditions(prevState => {
      const newAdditions = [...prevState];
      newAdditions[index] = {
        ...newAdditions[index],
        [name]: value,
        ...(name === 'addition_typeId' && { addition_typeName: event.target.options[event.target.selectedIndex].text })
      };
      return newAdditions;
    });
  };

  const handleAddAdditionField = () => {

    let body = { employee_id: params, action: "addAdditionInfo", add_ded_type: 'additton' };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        setAdditions([...additions, { addition_id: res?.data?.data, addition_typeId: '', addition_typeName: '', addition_amount: '' }]);
      })

  };

  const handleRemoveAdditionField = (index, addition) => {


    let body = { id: addition?.addition_id, action: "deleteSalarySettingsItem" };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        if (res?.data?.status == 'success') {
          notify("success", `Successfully Remove`);
          setAdditions(additions.filter((_, i) => i !== index));
        }
      })


  };






  const handleChangeDeductions = (index, event) => {
    const { name, value } = event.target;
    setDeductions(prevState => {
      const newDeductions = [...prevState];
      newDeductions[index] = {
        ...newDeductions[index],
        [name]: value,
        ...(name === 'deduction_typeId' && { deduction_typeName: event.target.options[event.target.selectedIndex].text })
      };
      return newDeductions;
    });
  };

  const handleAddDeductionField = () => {
    let body = { employee_id: params, action: "addAdditionInfo", add_ded_type: 'deduction' };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        setDeductions([...deductions, { deduction_id: res?.data?.data, deduction_typeId: '', deduction_typeName: '', deduction_amount: '' }]);
      })
    // setDeductions([...deductions, {deduction_id:res?.data?.data, deduction_typeId: '', deduction_typeName: '', deduction_amount: '' }]);
  };

  const handleRemoveDeductionField = (index, deduction) => {

    // console.log(deduction?.deduction_id)
    let body = { id: deduction?.deduction_id, action: "deleteSalarySettingsItem", add_ded_type: 'deduction' };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        if (res?.data?.status == 'success') {

          notify("success", `Successfully Remove`);
          setDeductions(deductions.filter((_, i) => i !== index));
        }
      })
  };





  const dept_options = employee?.getDept.data;
  const designation_options = employee?.getAllDesignation.data;

  const selected_desig_options = {
    value: employee?.getEmpDetails?.designation?.id,
    label: employee?.getEmpDetails?.designation?.name,
  };
  const selected_dept_options = {
    value: employee?.getEmpDetails?.department?.id,
    label: employee?.getEmpDetails?.department?.name,
  };
  const selected_role_options = {
    value: employee?.getEmpDetails?.user?.role?.id || "",
    label: employee?.getEmpDetails?.user?.role?.title || "select...",
  };
  const selected_country_options = {
    value: employee?.getEmpDetails?.user?.country?.id || "",
    label: employee?.getEmpDetails?.user?.country?.name || "select...",
  };
  const selected_state_options = {
    value: employee?.getEmpDetails?.user?.state?.id || "",
    label: employee?.getEmpDetails?.user?.state?.name || "select...",
  };
  const selected_city_options = {
    value: employee?.getEmpDetails?.user?.city?.id || "",
    label: employee?.getEmpDetails?.user?.city?.name || "select...",
  };

  useEffect(() => {
    getDepartment();
    getDesignation();
    getRoles();
    getAllContries();
    fetchAddAndDeductionType()
  }, []);

  const [additionList, setAdditionList] = useState([])
  const [deductionList, setDeductionList] = useState([])



  const fetchAddAndDeductionType = async () => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, {
      action: "getAllAddDeddType",
    })
      .then((res) => {
        if (isSubscribed) {
          const data = res.data?.data || [];

          const additions = data.filter(item => item.type === 'additton');
          const deductions = data.filter(item => item.type === 'deduction');

          setAdditionList(additions);
          setDeductionList(deductions);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => isSubscribed = false;
  };


  async function getDepartment() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, {
        action: "getAllDepartments",
      })
      .then((res) => {
        if (isSubscribed) {
          setEmployee((prev) => ({
            ...prev,
            getDept: res.data,
          }));
        }
      });

    return () => (isSubscribed = false);
  }

  async function getDesignation() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, {
        action: "getDesignations",
      })
      .then((res) => {
        if (isSubscribed) {
          setEmployee((prev) => ({
            ...prev,
            getAllDesignation: res.data,
          }));
        }
      });
    return () => (isSubscribed = false);
  }

  async function getRoles() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {
        action: "getAllRoles",
      })
      .then((res) => {
        if (isSubscribed) {
          setEmployee((prev) => ({
            ...prev,
            roles: res.data.data,
          }));
        }
      });
    return () => (isSubscribed = false);
  }

  const getUser = () => {
    let isSubscribed = true;
    if (employee.getEmpDetails?.user_id) {
      if (isSubscribed) {
        setEmployee((prev) => ({
          ...prev,
          is_user: true,
        }));
      }
    }
    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getUser();
  }, [employee?.getEmpDetails?.user_id]);

  const employeeDetails = useCallback(async () => {
    if (!isReady) {
      // console.log("fetching...");
      return;
    }

    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeInfo",
        employee_id: params,
      })
      .then((res) => {
        if (isSubscribed) {
          setEmployee((prev) => ({
            ...prev,
            getEmpDetails: res?.data?.data,
            department_id: res?.data?.data?.department?.id,
            designation_id: res?.data.data?.designation?.id,
            name: res?.data?.data?.name,
            gender: res?.data?.data?.gender,
            salary_type: res?.data?.data?.salary_type,
            salary_amount: res?.data?.data?.salary_amount,
            address: res?.data?.data?.address,
            description: res?.data?.data?.description,
            mobile: res?.data?.data?.mobile,
            email: res?.data?.data?.email,
            role_id: res?.data?.data?.user?.role?.id,
            country_id: res?.data?.data?.user?.country?.id,
            state_id: res?.data?.data?.user?.state?.id,
            city_id: res?.data?.data?.user?.city?.id,
            sector_head: res?.data?.data?.sector_head,
            sector_id: res?.data?.data?.sector_id,
            sector_parent_id: res?.data?.data?.sector_parent_id,
            data_access_type: res?.data?.data?.data_access_type
          }));

          setEmployeeSalary((prev) => ({
            ...prev,
            salary_type: res?.data?.data?.salary_type,
            salary_amount: res?.data?.data?.salary_amount,

          }));
          setLoading(false);
        }



      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [isReady, params]);
  useEffect(() => {
    employeeDetails();
  }, [employeeDetails]);




  const getEmployeeAdditionInfo = useCallback(async () => {

    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeAdditionInfo",
        employee_id: params,
      })
      .then((res) => {
        if (isSubscribed) {

          setAdditions(res.data.data)
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [isReady, params]);
  useEffect(() => {
    getEmployeeAdditionInfo();
  }, [getEmployeeAdditionInfo]);





  const getEmployeeDeductionInfo = useCallback(async () => {
    if (!isReady) {
      // console.log("fetching...");
      return;
    }
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeDeductionInfo",
        employee_id: params,
      })
      .then((res) => {
        if (isSubscribed) {

          setDeductions(res.data.data)
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [isReady, params]);
  useEffect(() => {
    getEmployeeDeductionInfo();
  }, [getEmployeeDeductionInfo]);




  //get All countries data
  const getAllContries = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "allCountries",
      })
      .then((res) => {
        if (isSubscribed) {
          setEmployee((prev) => ({
            ...prev,
            countryData: res.data.data,
          }));
        }
      })
      .catch((err) => { });
    return () => (isSubscribed = false);
  };

  const changeState = (e) => {
    if (e.value) {
      setEmployee((prev) => ({
        ...prev,
        country_id: e.value,
      }));
    }
  };

  useEffect(() => {
    getStateById();
  }, [employee?.country_id]);

  const getStateById = async () => {
    let isSubscribed = true;
    if (employee?.country_id !== null) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getState",
          country_id: employee?.country_id,
        })
        .then((res) => {
          if (isSubscribed) {
            setEmployee((prev) => ({
              ...prev,
              stateData: res.data.data,
            }));
          }
        })
        .catch((err) => {
          console.log("error state");
        });
    }
    return () => (isSubscribed = false);
  };

  const changeCity = (e) => {
    if (e.value) {
      setEmployee((prev) => ({
        ...prev,
        state_id: e.value,
      }));
    }
  };

  const getCityById = async () => {
    let isSubscribed = true;
    if (employee.state_id !== null) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getCity",
          state_id: employee?.state_id,
        })
        .then((res) => {
          if (isSubscribed) {
            setEmployee((prev) => ({
              ...prev,
              cityData: res.data.data,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getCityById();
  }, [employee?.state_id]);

  async function submitForm(e) {
    e.preventDefault();
    let body = {
      ...employee,
      action: "updateEmployeeInfo",
      employee_id: params,
    };

    // console.log("body: ",body);
    // return;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        notify("success", `Successfully update`);
        router.push("/modules/hrm/employee");
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response?.data?.response}`);
        } else {
          if (msg?.department_id) {
            notify("error", `${msg.department_id.Department_id}`);
          }
          if (msg?.designation_id) {
            notify("error", `${msg.designation_id.Designation_id}`);
          }
          if (msg?.salary_type) {
            notify("error", `${msg.salary_type.Salary_type}`);
          }
          if (msg?.gender) {
            notify("error", `${msg.gender.Gender}`);
          }
          if (msg?.status) {
            notify("error", `${msg.status.Status}`);
          }
          if (msg?.role_id) {
            notify("error", `${msg.role_id?.Role_id}`);
          }
          if (msg?.country_id) {
            notify("error", `${msg.country_id.Country_id}`);
          }
          if (msg?.state_id) {
            notify("error", `${msg.state_id.State_id}`);
          }
          if (msg?.city_id) {
            notify("error", `${msg.city_id.City_id}`);
          }
          // if (msg?.password) {
          //   notify("error", `${msg.password.Password}`);
          // }
        }
      });
  }
  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Employee", link: "/modules/hr/employee" },
    { text: "Edit Employee", link: `/modules/hr/employee/update/[id]` },
  ];

  // start sector and under sector section
  const [submitData, setSubmitData] = useState([]);
  const [sectorLists, setSectorList] = useState([]);
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


  useEffect(() => {
    setSubmitData({ ...submitData, acctype: "bank" });
  }, []);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: employee.sector_head,
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
  }, [employee.sector_head]);


  // handleUpdateSalary
  const handleUpdateSalary = async () => {

    let body = {
      ...employeeSalary,
      action: "updateEmployeeSalaryInfo",
      employee_id: params,
      additions,
      deductions
    };
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        notify("success", `Successfully update`);
        // router.push("/modules/hrm/employee");
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response?.data?.response}`);
        } else {

          if (msg?.salary_type) {
            notify("error", `${msg.salary_type.Salary_type}`);
          }
          if (msg?.salary_amount) {
            notify("error", `${msg.salary_amount.Salary_amount}`);
          }


        }
      });


  }
  return (
    <>
      <HeadSection title="Update-Employee" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 col-md-7 custom-col-md-6">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Update Employee</h4>
              </div>
              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <div className="row container">
                    <div className="col-md-6">
                      <Form.Group controlId="formBasicName">
                        <Form.Label>
                          {" "}
                          Name <span className="text-danger">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="text"
                          placeholder="Full Name Here"
                          name="name"
                          onChange={handleChange}
                          value={employee.name}
                          required
                        />
                      </Form.Group>
                      {/* start sector head and under sector */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Sector Head<span className="text-danger">*</span>
                        </Form.Label>

                        <Select2
                          options={accountHead?.map(({ label, value }) => ({
                            value: value,
                            label: label,
                            name: "sector_head",
                          }))}
                          value={accountHead.find(option => option.value === employee.sector_head)}
                          onChange={(e) => {
                            setEmployee((prev) => ({
                              ...prev,
                              sector_head: e?.value,
                            }));
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
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
                              setEmployee((prev) => ({
                                ...prev,
                                sector_parent_id: e?.target?.value,
                              }));
                            }}
                            value={employee.sector_id}
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
                      {employee?.department_id !== null && (
                        <>
                          <Form.Group controlId="formBasicName">
                            <Form.Label>
                              {" "}
                              Department <span className="text-danger">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Select2
                              className="mb-3"
                              options={dept_options?.map(({ id, name }) => ({
                                value: id,
                                label: name,
                              }))}
                              defaultValue={selected_dept_options}
                              onChange={(e) =>
                                setEmployee((prev) => ({
                                  ...prev,
                                  department_id: e.value,
                                }))
                              }
                            />
                          </Form.Group>
                        </>
                      )}



                      <Form.Group controlId="formBasicAddress" className="mt-2">
                        <Form.Label>
                          {" "}
                          Address <span className="text-danger">*</span>{" "}
                        </Form.Label>

                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Address"
                          onChange={handleChange}
                          name="address"
                          value={employee.address}
                        // value={value}
                        // required
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group controlId="formBasicAddress">
                        <Form.Label>
                          {" "}
                          Gender <span className="text-danger">*</span>{" "}
                        </Form.Label>
                        <div className="row">
                          <div className="col-md-10">
                            <div className="flex-gap align-items-center">
                              <RadioButton
                                label="Male"
                                id="Male"
                                name="gender"
                                value="male"
                                checked={employee.gender == "male"}
                                onChange={handleChange}
                              />

                              <RadioButton
                                label="Female"
                                id="Female"
                                name="gender"
                                value="female"
                                checked={employee.gender == "female"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </Form.Group>
                      <Form.Group controlId="formBasicName" className="mt-3">
                        <Form.Label>
                          {" "}
                          Mobile <span className="text-danger">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="number"
                          placeholder="017xx-xxx-xxx"
                          value={employee.mobile}
                          name="mobile"
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicName" className="mt-3">
                        <Form.Label>
                          {" "}
                          Email <span className="text-danger">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          className="mb-3 "
                          type="email"
                          placeholder="example@gmail.com"
                          name="email"
                          value={employee.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      {employee?.designation_id !== null && (
                        <>
                          <Form.Group controlId="formBasicName">
                            <Form.Label>
                              {" "}
                              Designation <span className="text-danger">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Select2
                              options={designation_options?.map(
                                ({ id, name }) => ({ value: id, label: name })
                              )}
                              defaultValue={selected_desig_options}
                              onChange={(e) =>
                                setEmployee((prev) => ({
                                  ...prev,
                                  designation_id: e.value,
                                }))
                              }
                            />
                          </Form.Group>
                        </>
                      )}



                      <Form.Group controlId="formBasicAddress">
                        <Form.Label>
                          {" "}
                          Description <span className="text-danger">
                            *
                          </span>{" "}
                        </Form.Label>

                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description..."
                          onChange={handleChange}
                          name="description"
                          value={employee.description}
                        // required
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {employee?.department_id === null && (
                    <>
                      <div className="mb-3 row">
                        <Label text="Department" />
                        <div className="col-md-10">
                          <Select2
                            options={dept_options?.map(({ id, name }) => ({
                              value: id,
                              label: name,
                            }))}
                            defaultValue={{ value: "", label: "loading..." }}
                            onChange={(e) =>
                              setEmployee((prev) => ({
                                ...prev,
                                department_id: e.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Checking Is User or Not */}
                  <div className="mb-3 row mt-4 ml-1">
                    <Label text="Is User?" />
                    <div
                      className="col-md-10 form-check form-switch"
                      style={{ fontSize: "150%" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        name="is_user"
                        onChange={() =>
                          setEmployee((prev) => ({
                            ...prev,
                            is_user: !employee.is_user,
                          }))
                        }
                        checked={employee.is_user}
                      />
                    </div>
                  </div>
                  <div className={`${employee.is_user ? "" : "d-none"} m-3`}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName">
                          <Form.Label>
                            {" "}
                            Role <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          {employee?.role_id === null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={{
                                  value: "",
                                  label: "loading...",
                                }}
                                options={
                                  employee.roles &&
                                  employee.roles.map(({ id, title }) => ({
                                    value: id,
                                    label: title,
                                  }))
                                }
                                onChange={(e) =>
                                  setEmployee((prev) => ({
                                    ...prev,
                                    role_id: e.value,
                                  }))
                                }
                              />
                            </>
                          )}
                          {employee?.role_id !== null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={selected_role_options}
                                options={
                                  employee.roles &&
                                  employee.roles.map(({ id, title }) => ({
                                    value: id,
                                    label: title,
                                  }))
                                }
                                onChange={(e) =>
                                  setEmployee((prev) => ({
                                    ...prev,
                                    role_id: e.value,
                                  }))
                                }
                              />
                            </>
                          )}
                        </Form.Group>
                        <Form.Group controlId="formBasicName" className="mt-3">
                          <Form.Label>
                            {" "}
                            State <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          {employee?.state_id === null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={{
                                  value: "",
                                  label: "loading...",
                                }}
                                options={employee.stateData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeCity}
                              />{" "}
                            </>
                          )}
                          {employee?.state_id !== null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={selected_state_options}
                                options={employee.stateData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeCity}
                              />{" "}
                            </>
                          )}
                        </Form.Group>

                        <Form.Group controlId="formBasicName" className="mt-3">
                          <Form.Label>
                            {" "}
                            User Define Password?{" "}
                            <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          <div className="mb-3 row">
                            <div
                              className="col-md-10 form-check form-switch"
                              style={{ fontSize: "150%" }}
                            >
                              <input
                                style={{ marginLeft: "-30px" }}
                                className="form-check-input ml-6"
                                type="checkbox"
                                name="user_defined_password"
                                onChange={() =>
                                  setEmployee((prev) => ({
                                    ...prev,
                                    user_defined_password:
                                      !employee.user_defined_password,
                                  }))
                                }
                                checked={employee.user_defined_password}
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName">
                          <Form.Label>
                            {" "}
                            Country <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          {employee?.country_id === null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={{
                                  value: "",
                                  label: "loading...",
                                }}
                                options={employee.countryData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeState}
                              />{" "}
                            </>
                          )}
                          {employee?.country_id !== null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={selected_country_options}
                                options={employee.countryData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={changeState}
                              />{" "}
                            </>
                          )}
                        </Form.Group>

                        <Form.Group controlId="formBasicName" className="mt-3">
                          <Form.Label>
                            {" "}
                            City <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          {employee?.state_id === null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={{
                                  value: "",
                                  label: "loading...",
                                }}
                                options={employee.cityData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={(e) =>
                                  setEmployee((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                  }))
                                }
                              />{" "}
                            </>
                          )}
                          {employee?.state_id !== null && (
                            <>
                              {" "}
                              <Select2
                                defaultValue={selected_city_options}
                                options={employee.cityData.map(
                                  ({ id, name }) => ({ value: id, label: name })
                                )}
                                onChange={(e) =>
                                  setEmployee((prev) => ({
                                    ...prev,
                                    city_id: e.value,
                                  }))
                                }
                              />{" "}
                            </>
                          )}
                        </Form.Group>

                        <Form.Group controlId="formBasicName" className="mt-3">
                          <Form.Label>
                            {" "}
                            Password <span className="text-danger">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="Type 8-character password"
                            name="password"
                            disabled={employee.user_defined_password}
                            onChange={handleChange}
                          // required
                          />
                        </Form.Group>

                        <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                          <Form.Label>Data Access Type</Form.Label>
                          <select value={employee.data_access_type} onChange={handleChange} name="data_access_type" className="form-select" >
                            <option value="as_role">As role</option>
                            <option value="own">Own</option>
                          </select>
                          <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                            Please provide role
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-info">Update</Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>

          <div className="col-12 col-md-5 custom-col-md-6">
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-body border-bottom">
                    <h4 className="card-title">Salary Info</h4>
                  </div>
                  <div className="card-body">
                    <div className="row container">
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName">
                          <Form.Label>
                            {" "}
                            Salary Type <span className="text-danger">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Select
                            value={employee?.salary_type || ""}
                            name="salary_type"
                            onChange={handleChange}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                          </Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>
                            {" "}
                            Salary Amount(Basic) <span className="text-danger">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            className="mb-3"
                            type="number"
                            placeholder="Salary Amount"
                            name="salary_amount"
                            onChange={handleChange}
                            value={employee.salary_amount}
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>



                    <div>
                      {loading ? (
                        <div className="text-center my-5">
                          <PropagateLoading />
                        </div>
                      ) : (
                        <>
                          <div className="border-top mt-2 px-3 py-1">
                            <div className="row align-items-center border-bottom">
                              <div className="col">
                                <h4 className="card-title mt-1 pt-1" style={{ fontSize: '13px' }}>Addition</h4>
                              </div>
                              <div className="col text-end">
                                <button
                                  className="btn btn-info"
                                  onClick={handleAddAdditionField}
                                  style={{ padding: '2px 30px', fontSize: '12px' }}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            {additions.map((addition, index) => (
                              <div className="row container mt-2" key={index}>
                                <div className="col-md-6">
                                  <Form.Group controlId={`formBasicName-${index}`}>
                                    <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Additions Type</Form.Label>
                                    <Form.Select
                                      value={addition.addition_typeId}
                                      name="addition_typeId"
                                      onChange={(e) => handleChangeadditions(index, e)}
                                      style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                    >
                                      <option value=''>None</option>
                                      {additionList.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </div>
                                <div className="col-md-4">
                                  <Form.Group controlId={`formBasicAmount-${index}`}>
                                    <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Amount</Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Amount"
                                      name="addition_amount"
                                      onChange={(e) => handleChangeadditions(index, e)}
                                      value={addition.addition_amount}
                                      style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                      required
                                    />
                                  </Form.Group>
                                </div>
                                <div className="col-md-2 align-items-end" style={{ marginTop: '30px' }}>
                                  <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px' }} onClick={() => handleRemoveAdditionField(index, addition)}>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>


                      )}

                    </div>




                    {loading ? (
                      <div className="text-center my-5">
                        <PropagateLoading />
                      </div>
                    ) : (
                      <>
                        <div className="border-top mt-2 px-3 py-1">
                          <div className="row align-items-center border-bottom mt-2">
                            <div className="col">
                              <h4 className="card-title mt-1 pt-1" style={{ fontSize: '13px' }}>Deduction</h4>
                            </div>
                            <div className="col text-end">
                              <button
                                className="btn btn-info"
                                onClick={handleAddDeductionField}
                                style={{ padding: '2px 30px', fontSize: '12px' }}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {deductions.map((deduction, index) => (
                            <div className="row container mt-2" key={index}>
                              <div className="col-md-6">
                                <Form.Group controlId={`formBasicName-${index}`}>
                                  <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Deductions Type</Form.Label>
                                  <Form.Select
                                    value={deduction.deduction_typeId}
                                    name="deduction_typeId"
                                    onChange={(e) => handleChangeDeductions(index, e)}
                                    style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                  >
                                    <option value=''>None</option>
                                    {deductionList.map((item) => (
                                      <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group controlId={`formBasicAmount-${index}`}>
                                  <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Amount</Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="Amount"
                                    name="deduction_amount"
                                    onChange={(e) => handleChangeDeductions(index, e)}
                                    value={deduction.deduction_amount}
                                    style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                    required
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-md-2 align-items-end" style={{ marginTop: '30px' }}>
                                <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px' }} onClick={() => handleRemoveDeductionField(index, deduction)}>
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>


                    )}





                    <div className="border-top mt-2 pt-3">
                      <div className="text-end">
                        <button onClick={handleUpdateSalary} className="btn-info">Update Salary</button>
                        {/* <Button onClick={handleUpdateSalary} className="btn-info">Update</Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
