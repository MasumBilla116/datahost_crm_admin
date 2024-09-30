import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Axios from "../../utils/axios";
import themeContext from "../context/themeContext";
import Select from "../elements/Select";
import Select2 from "../elements/Select2";
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

const BasicInfo = ({ formData, setFormData, validateForm, handleValidationErrors, setHandleValidationErrors }) => {

  const context = useContext(themeContext);
  const { permission } = context;
  const { notify } = MyToast();
  const router = useRouter();
  const { http } = Axios();
  const [pickup2Open, setPickup2Open] = useState(false)
  const [employee, setEmployee] = useState({
    department_id: null,
    designation_id: null,
    designation_name: "",
    name: "",
    address: "",
    mobile: "",
    email: "",
    status: 1,
    password: "",
    country_id: null,
    country_name: "",
    state_id: null,
    state_name: "",
    role_id: null,
    roles: [],
    city_id: null,
    countryData: [],
    stateData: [],
    cityData: [],
    getDept: [],
    getAllDesignation: [],

  });



  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getDepartment();
      getDesignation();
      getAllContries();
      getStateById();
      getCityById();
      getRoles();
    }
    return () => {
      isMount = false;
    }
  }, [employee.country_id, employee.state_id]);

  //get All countries data
  const getAllContries = async () => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, { action: "allCountries", })
      .then((res) => {
        if (isSubscribed) {
          setEmployee(prev => ({
            ...prev,
            countryData: res.data.data,
          }))

        }
      });

    return () => isSubscribed = false;
  }

  const getStateById = async () => {
    let isSubscribed = true;
    if (employee.country_id !== null) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, { action: "getState", country_id: employee.country_id })
        .then((res) => {
          if (isSubscribed) {
            setEmployee(prev => ({
              ...prev,
              stateData: res.data.data,
            }))

          }
        });
    }
    return () => isSubscribed = false;
  }

  const getCityById = async () => {
    let isSubscribed = true;
    if (employee.state_id !== null) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, { action: "getCity", state_id: employee.state_id })
        .then((res) => {
          if (isSubscribed) {
            setEmployee(prev => ({
              ...prev,
              cityData: res.data.data,
            }))

          }
        });
    }
    return () => isSubscribed = false;
  }


  async function getDepartment() {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
      .then((res) => {
        if (isSubscribed) {

          setEmployee(prev => ({
            ...prev,
            getDept: res.data,
          }))
        }
      });

    return () => isSubscribed = false;

  }

  async function getDesignation() {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, { action: "getDesignations", })
      .then((res) => {
        if (isSubscribed) {

          setEmployee(prev => ({
            ...prev,
            getAllDesignation: res.data,
          }))

        }
      });

    return () => isSubscribed = false;
  }

  async function getRoles() {
    let isSubscribed = true;

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, { action: "getAllRoles", })
      .then((res) => {

        if (isSubscribed) {
          setEmployee(prev => ({
            ...prev,
            roles: res.data.data,
          }))

        }
      });
    return () => isSubscribed = false;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      country_id: employee.country_id,
      state_id: employee.state_id,
      city_id: employee.city_id,
    });


  };


  const changeState = (e) => {
    if (e.value) {
      setHandleValidationErrors(prev => ({
        ...prev,
        country_error: false
      }));
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        country_id: e.value, // Update country_id in the component state
      }));

      // Update the submitData object with the new country_id
      setFormData((prevSubmitData) => ({
        ...prevSubmitData,
        country_id: e.value,
        country_name: e.label,
      }));

    }
  };



  const changeCity = (e) => {
    if (e.value) {
      setHandleValidationErrors(prev => ({
        ...prev,
        state_error: false
      }));
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        state_id: e.value, // Update state_id in the component state
      }));
      // Update the submitData object with the new state_id
      setFormData((prevSubmitData) => ({
        ...prevSubmitData,
        state_id: e.value,
        state_name: e.label,
      }));

    }
  };

  const designation_options = employee.getAllDesignation.data;
  const [defaultCountry, setDefaultCountry] = useState({ value: null, label: null });
  const [defaultState, setDefaultState] = useState({ value: null, label: null });
  const [defaultCity, setDefaultCity] = useState({ value: null, label: null });
  const [defaultDesignation, setDefaultDesignation] = useState({ value: null, label: null });
  const [defaultRole, setDefaultRole] = useState({ value: null, label: null });

  useEffect(() => {
    if (window !== undefined) {
      const emp_data = window.sessionStorage.getItem("emp");
      if (emp_data !== null) {
        const data = JSON.parse(emp_data);
        setDefaultCountry({ value: data?.country_id, label: data?.country_name })
        setDefaultState({ value: data?.state_id, label: data?.state_name })
        setDefaultCity({ value: data?.city_id, label: data?.city_name })
        setDefaultDesignation({ value: data?.designation_id, label: data?.designation_name })
        setDefaultRole({ value: data?.role_id, label: data?.role_name })

      }

    }
  }, [])

  const [loading, setLoading] = useState(true);
  const [sectorLists, setSectorList] = useState([]);

  // start sector and under sector section
  const accountHead = [
    { label: "Assets", value: "asset" },
    { label: "Liabilities", value: "liability" },
    { label: "Expenses", value: "expenditure" },
    { label: "Revenue", value: "revenue" },
  ];


  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: formData?.sector_head,
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
  }, [formData.sector_head]);

  return (
    <div className=" p-3">
      <div className="card-body border-bottom ">
        <h4 className="card-title fw-bolder">Employee Basic Information</h4>
      </div>

      {/* <Form noValidate> */}
      <div className="card-body">
        <div className="row ">
          <div className="col-md-4">


            <Form.Group md="10" className="mt-3" controlId="validationCustom01">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                name="name"
                type="text"
                placeholder="Full Name Here"
                value={formData.name}
                onChange={handleChange}
                onBlur={validateForm}
              />
              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                Please provide a name.
              </Form.Control.Feedback>
            </Form.Group>
            {/* start sector head and under sector */}
            <Form.Group md="3" className="d-none">
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
                  setFormData((prev) => ({
                    ...prev,
                    sector_head: e?.value,
                  }));
                }}
                required
              />
            </Form.Group>
            <Form.Group md="3" className="d-none" >
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
                    setFormData((prev) => ({
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



            <Form.Group md="10" controlId="validationCustom01" className="mt-3">
              <Form.Label> Country <span className="text-danger">*</span> </Form.Label>
              <Select2 options={employee.countryData.map(({ id, name }) => ({ value: id, label: name }))}
                className=""
                required
                //  onChange={handleChange}
                onChange={changeState}
                required={true}
                value={{id:formData.country_id,label: formData.country_name}}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

              {handleValidationErrors.country_error && <div className="text-danger">Country is required</div>}

            </Form.Group>
            <Form.Group md="10" controlId="validationCustom02" className="mt-3" >
              <Form.Label>Employee Type </Form.Label>
              <select name="employeeType" onChange={handleChange} className="form-select" value={formData.employeeType}>
                {/* <option selected>January 2021</option> */}
                <option value="fulltime">Fulltime</option>
                <option value="contractual">contractual</option>
                <option value="intern">Intern</option>
              </select>
              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                Please provide a mobile number.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group md="10" className="mt-3" controlId="validationCustom01">
              <Form.Label>Address</Form.Label>
              <Form.Control
                required
                as="textarea"
                name="address"
                type="text"
                placeholder="Enter your Address"
                value={formData.address}
                onChange={handleChange}
                onBlur={validateForm}
              />
              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                Please provide a name.
              </Form.Control.Feedback>
            </Form.Group>

          </div>

          <div className="col-md-4">

            <Form.Group md="10" controlId="validationCustom02" className="mt-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                required
                name="mobile"
                type="text"
                placeholder="017xx-xxx-xxx"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={validateForm}
              />
              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                Please provide a mobile number.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group md="10" controlId="formBasicName" className="mt-3">
              <Form.Label> State <span className="text-danger">*</span> </Form.Label>
              <Select2 options={employee.stateData.map(({ id, name }) => ({ value: id, label: name }))}
                onChange={changeCity}
                value={{id:formData.state_id,label: formData.state_name}}
              />
              <div className="text-danger">{handleValidationErrors.state_error && ' State is required'}</div>
            </Form.Group>

            <Form.Group md="10" controlId="validationCustom02" className="mt-3" >
              <Form.Label>Attendance Time </Form.Label>
              <select name="attendanceTime" onChange={handleChange} className="form-select" value={formData.attendanceTime}>
                {/* <option selected>January 2021</option> */}
                <option value="day">Day</option>
                <option value="morning">Morning</option>
                <option value="hourly">Hourly</option>
              </select>
              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                Please provide a mobile number.
              </Form.Control.Feedback>
            </Form.Group>

          </div>

          <div className="col-md-4">

            <Form.Group md="10" controlId="validationCustom01" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                name="email"
                type="text"
                onChange={handleChange}
                className="mb-3"
                onBlur={validateForm}
                value={formData.email}
                placeholder="abc@xyx.com"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>


            <Form.Group md="10" controlId="formBasicName" className="mt-3">
              <Form.Label> City <span className="text-danger">*</span> </Form.Label>
              <Select2 options={employee.cityData.map(({ id, name }) => ({ value: id, label: name }))}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, city_id: e.value, city_name: e.label }))
                  setHandleValidationErrors(prev => ({
                    ...prev,
                    city_error: false
                  }));
                }}
                value={{id:formData.city_id,label: formData.city_name}}
              />
              <div className="text-danger">{handleValidationErrors.city_error && 'City is required'}</div>
            </Form.Group>


            <Form.Group md="10" controlId="formBasicName" className="mt-3" >
              <Form.Label> Role <span className="text-danger">*</span> </Form.Label>
              <Select2 options={employee.roles && employee.roles.map(({ id, title }) => ({ value: id, label: title }))}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, role_id: e.value, role_name: e.label }))
                  setHandleValidationErrors(prev => ({
                    ...prev,
                    role_error: false
                  }));
                }}
                // defaultRole
                value={{id:formData.role_id,label: formData.role_name}}
              />
              <div className="text-danger">{handleValidationErrors.role_error && 'Role is required'}</div>
            </Form.Group>

          </div>
        </div>
      </div>
      {/* </Form> */}
    </div>
  );
};

export default BasicInfo;
