import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Loader from "../../../../components/Loader/loader";
import BankInfo from "../../../../components/stepFroms/BankInfo";
import BasicInfo from "../../../../components/stepFroms/BasicInfo";
import Biographical from "../../../../components/stepFroms/Biographical";
import Emergency from "../../../../components/stepFroms/Emergency";
import LoginInfo from "../../../../components/stepFroms/LoginInfo";
import PositionalInfo from "../../../../components/stepFroms/PositionalInfo";
import SalaryInfo from "../../../../components/stepFroms/SalaryInfo";
import Axios from "../../../../utils/axios";


const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const { http } = Axios();
  const { notify } = MyToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    country_id: null,
    country_name: "",
    state_id: null,
    state_name: "",
    city_id: null,
    city_name: "",
    attendanceTime: "",
    // designation_id: null,
    // designation_name:"",
    employeeType: "",
    role_id: null,
    role_name: "",
    rate: "",
    address: "",

    accNumber: "",
    bankName: "",
    bbanNumber: "",
    branchAddress: "",

    basicAmmount: "",
    transportAllowance: "",
    grossSalary: "",
    tinNo: "",
    salaryType: "",

    department_id: null,
    department_name: "",
    dutyType: "",
    rateType: "",
    hire_date: null,
    join_date: null,
    designation_id: null,
    designation_name: "",
    rate: "",

    birth_date: null,
    maritalStatus: "",
    cityResidence: "",
    gender: "",
    workInCity: "",
    workPermit: "",
    upload_ids: "",

    contactPerson: "",
    contactNumber: "",
    homePhone: "",
    workPhone: "",
    contactRelationship: "",
    alterContact: "",
    althomePhone: "",
    altWorkPhone: "",

    userEmail: "",
    password: "",
    data_access_type:"",
    
    under_head: null,
    sector_head: null,

    // status:1;
  });
  const [loader, setLoader] = useState(false);


  // useEffect
  useEffect(() => {

    if (window !== undefined) {
      const emp_data = window.sessionStorage.getItem("emp");
      const _step = window.sessionStorage.getItem("step");
      setStep(parseInt(_step) || 1)
      if (emp_data !== null) {
        const data = JSON.parse(emp_data);
        setFormData(prev => ({
          ...prev,
          name: data?.name,
          mobile: data?.mobile,
          email: data?.email,
          country_id: data?.country_id,
          country_name: data?.country_name,
          state_id: data?.state_id,
          state_name: data?.state_name,
          city_id: data?.city_id,
          city_name: data?.city_name,
          attendanceTime: data?.attendanceTime,

          employeeType: data?.employeeType,
          role_id: data?.role_id,
          role_name: data?.role_name,
          rate: data?.rate,
          address: data?.address,

          accNumber: data?.accNumber,
          bankName: data?.bankName,
          bbanNumber: data?.bbanNumber,
          branchAddress: data?.branchAddress,

          basicAmmount: data?.basicAmmount,
          transportAllowance: data?.transportAllowance,
          grossSalary: data?.grossSalary,
          tinNo: data?.tinNo,
          salaryType: data?.salaryType,

          department_id: data?.department_id,
          department_name: data?.department_name,
          dutyType: data?.dutyType,
          rateType: data?.rateType,
          hire_date: data?.hire_date,
          join_date: data?.join_date,
          designation_id: data?.designation_id,
          designation_name: data?.designation_name,
          rate: data?.rate,

          birth_date: data?.birth_date,
          maritalStatus: data?.maritalStatus,
          cityResidence: data?.cityResidence,
          gender: data?.gender,
          workInCity: data?.workInCity,
          workPermit: data?.workPermit,
          upload_ids: data?.upload_ids,

          contactPerson: data?.contactPerson,
          contactNumber: data?.contactNumber,
          homePhone: data?.homePhone,
          workPhone: data?.workPhone,
          contactRelationship: data?.contactRelationship,
          alterContact: data?.alterContact,
          althomePhone: data?.althomePhone,
          altWorkPhone: data?.altWorkPhone,

          userEmail: data?.userEmail,
          password: data?.password,
          data_access_type: data?.data_access_type,

          under_head: data?.under_head,
          sector_head: data?.sector_head,
         
          // status:1; 
        }))
      }
    }

  }, [])


  const [handleValidationErrors, setHandleValidationErrors] = useState({
    country_error: false,
    state_error: false,
    city_error: false,
    role_error: false,
    department_error: false,
    designation_error: false,
    join_date_error: false,
    hire_date_error: false,
    rate_error: false,
    birth_date_error: false,
  });

  const validateForm = () => {
    // Implement your validation logic here
    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const isNameValid = name.length >= 3;
    const mobilePattern = /^017\d{2}-\d{3}-\d{3}$/;
    const isMobileValid = mobilePattern.test(mobile);
    return isNameValid && isMobileValid;
  };

  const handleNext = (data) => {
    var validate = true;
    setLoader(true);
    setTimeout(() => {

      if (step === 1 && (formData.country_id === null || formData.country_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          country_error: true
        }));
      }

      if (step === 1 && (formData.state_id === null || formData.state_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          state_error: true
        }));

      }

      if (step === 1 && (formData.city_id === null || formData.city_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          city_error: true
        }));
      }

      if (step === 1 && (formData.role_id === null || formData.role_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          role_error: true
        }));
      }

      if (step === 4 && (formData.department_id === null || formData.department_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          department_error: true
        }));
      }

      if (step === 4 && (formData.designation_id === null || formData.designation_id === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          designation_error: true
        }));
      }

      if (step === 4 && (formData.join_date === null || formData.join_date === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          join_date_error: true
        }));
      }


      if (step === 4 && (formData.hire_date === null || formData.hire_date === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          hire_date_error: true
        }));
      }

      if (step === 4 && (formData.rate === null || formData.rate === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          rate_error: true
        }));
      }


      if (step === 5 && (formData.birth_date === null || formData.birth_date === '')) {
        validate = false;
        setHandleValidationErrors(prev => ({
          ...prev,
          birth_date_error: true
        }));
      }

      if (step < 7 && validate === true) {
        setStep(step + 1);
        window.sessionStorage.setItem("emp", JSON.stringify(formData));
        window.sessionStorage.setItem("step", step + 1);
      }
      setLoader(false); 
    }, 700)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    let body = { ...formData, action: "addEmployee" };
     
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => { 
        window.sessionStorage.removeItem("emp")
        window.sessionStorage.removeItem("step")
        notify("success", `create successfully`);
        router.push("/modules/hrm/employee");
      })
      .catch((e) => {
        const msg = e.response?.data?.response; 
        notify("warning", msg); 
      });
    setLoader(false);
  };

  const handleTopBackBtn = (tap_index) => {
    const _step = window.sessionStorage.getItem("step");
    if (_step !== null) {
      const step_back = parseInt(_step);
      if (tap_index < step_back) {
        setStep(tap_index)
        window.sessionStorage.setItem("step", tap_index);

      }
    }

  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isLastStep = step === 7;


  const [generalLedger, setGeneralLedger] = useState({
    name: "",
    sector_head: "",
    sector_id: null,
    opening_balance: null,
    balance: null,
    description: "",
    status: 1,
  });

  // handle
  const BasicInfoValidation = (e) => {
    const value = e.value;
    // if()  setHandleValidation({})
  }

  return (
    <> 

      <div className="container-fluid">
        <div className="row">
          <div className="col-12  pb-2 pt-xs-2">
            <div className="table-responsive">
              <div className="d-flex justify-content-start align-items-center ">
                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn rounded-0 ${step > 1 ? "success" : step === 1 && 'active'}`}
                    onClick={() => handleTopBackBtn(1)}
                  >
                    Basic Info
                  </button>
                </div>
                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn  rounded-0 ${step > 2 ? "success" : step === 2 && 'active'}`}
                    onClick={() => handleTopBackBtn(2)}
                  >
                    Bank Info
                  </button>
                </div>
                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn rounded-0 ${step > 3 ? "success" : step === 3 && 'active'}`}
                    onClick={() => handleTopBackBtn(3)}
                  >
                    Salary Info
                  </button>
                </div>
                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn rounded-0 ${step > 4 ? "success" : step === 4 && 'active'}`}
                    onClick={() => handleTopBackBtn(4)}
                  >
                    Positional Info
                  </button>
                </div>

                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn rounded-0 ${step > 5 ? "success" : step === 5 && 'active'}`}
                    onClick={() => handleTopBackBtn(5)}
                  >
                    Biographical Info
                  </button>
                </div>

                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn rounded-0 ${step > 6 ? "success" : step === 6 && 'active'}`}
                    onClick={() => handleTopBackBtn(6)}
                  >
                    Emergency Contact
                  </button>
                </div>

                <div className="" >
                  <button
                    type="button"
                    className={`w-100 btn multi-step-btn last-multi-step-btn  rounded-0 ${step > 7 ? "success" : step === 7 && 'active'}`}
                    onClick={() => handleTopBackBtn(7)}
                  >
                    Login Info
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* buttons */}
          <div className="col-12  ">
            <div className="card shadow">
              <Form onSubmit={(e) => handleSubmit(e)}>
                {step === 1 ? (
                  <BasicInfo
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                    handleValidationErrors={handleValidationErrors}
                    setHandleValidationErrors={setHandleValidationErrors}
                  />
                ) : null}

                {step === 2 ? (
                  <BankInfo
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                  />
                ) : null}
                {step === 3 ? (
                  <SalaryInfo
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                  />
                ) : null}
                {step === 4 ? (
                  <PositionalInfo
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                    handleValidationErrors={handleValidationErrors}
                    setHandleValidationErrors={setHandleValidationErrors}
                  />
                ) : null}
                {step === 5 ? (
                  <Biographical
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                    handleValidationErrors={handleValidationErrors}
                    setHandleValidationErrors={setHandleValidationErrors}
                  />
                ) : null}

                {step === 6 ? (
                  <Emergency
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                  />
                ) : null}

                {step === 7 ? (
                  <LoginInfo
                    formData={formData}
                    setFormData={setFormData}
                    validateForm={validateForm}
                  />
                ) : null}

                {isLastStep && (
                  <Row className="justify-content-end mt-4 mr-3 mb-3">
                    <Col xs="auto" className="mr-2">
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="primary"
                        //  onClick={(e)=>{handleSubmit(e)}}
                        //  onClick={handleSubmit}
                        type="submit"
                      >
                        Submit {loader && <Loader />}
                      </Button>
                    </Col>
                  </Row>
                )}

                {!isLastStep && (
                  <Row className="justify-content-end mt-4 mr-3 mb-3">
                    {step > 1 && (
                      <Col xs="auto" className="mr-2">
                        <Button variant="secondary" onClick={handleBack}>
                          Back
                        </Button>
                      </Col>
                    )}
                    {step < 7 && (
                      <Col xs="auto">
                        <Button variant="primary" onClick={handleNext}>
                          Next {loader && <Loader />}
                        </Button>
                      </Col>
                    )}
                  </Row>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
      {/* <Container>
    
    </Container> */}
    </>
  );
};

export default MultiStepForm;
