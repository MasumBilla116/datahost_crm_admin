import { useState } from "react";
import Form from "react-bootstrap/Form";


const SalaryInfo = ({ formData, setFormData, validateForm }) => {

  const [bankInfo, setBankInfo] = useState({
    basic: "",
    transportAllowance: "",
    grossSalary: "",
    branchAddress: ""

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,

    });


  };


  return (
    <>

      <div className=" p-3">
        <div className="card-body border-bottom ">
          <h4 className="card-title fw-bolder"> Salary Information</h4>
        </div>

        <Form noValidate>
          <div className="card-body">
            <div className="row ">
              <div className="col-md-4">
                <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                  <Form.Label>Basic</Form.Label>
                  <Form.Control
                    required
                    name="basicAmmount"
                    type="number"
                    placeholder="Basic Ammount"
                    defaultValue={formData.basicAmmount}
                    onChange={handleChange}
                  // onBlur={validateForm}
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                    Please provide a name.
                  </Form.Control.Feedback>
                </Form.Group>


                <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                  <Form.Label>Salary Type</Form.Label>
                  <select name="salaryType" onChange={handleChange} className="form-select" value={formData.salaryType}>
                    {/* <option selected>January 2021</option> */}
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                    <option value="contract">Contract</option>
                  </select>
                  <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                    Please provide a mobile number.
                  </Form.Control.Feedback>
                </Form.Group>

              </div>
              <div className="col-md-4">
                <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                  <Form.Label>Transport Allowance</Form.Label>
                  <Form.Control
                    required
                    name="transportAllowance"
                    type="number"
                    placeholder="Bank Name"
                    defaultValue={formData.transportAllowance}
                    onChange={handleChange}
                  // onBlur={validateForm}
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                    Please provide a mobile number.
                  </Form.Control.Feedback>
                </Form.Group>

              </div>

              <div className="col-md-4">
                <Form.Group md="10" controlId="validationCustom01" className="mt-3">
                  <Form.Label>Gross Salary</Form.Label>
                  <Form.Control
                    required
                    name="grossSalary"
                    type="number"
                    className="mb-3"
                    // onBlur={validateForm}
                    defaultValue={formData.grossSalary}
                    onChange={handleChange}
                    placeholder="Gross Salary"
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>


              </div>

              <div className="col-md-4">
                <div className="card-body border-bottom ">
                  <h4 className="card-title fw-bolder"> Tax Information</h4>
                </div>
                <Form.Group md="10" controlId="validationCustom01" className="mt-3">
                  <Form.Label>TIN No</Form.Label>
                  <Form.Control
                    required
                    name="tinNo"
                    type="text"
                    className="mb-3"
                    // onBlur={validateForm}
                    defaultValue={formData.tinNo}
                    onChange={handleChange}
                    placeholder="tinNo"
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>


              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default SalaryInfo;
