import { useState } from "react";
import Form from "react-bootstrap/Form";


const BankInfo = ({ formData, setFormData, validateForm }) => {

  const [bankInfo, setBankInfo] = useState({
    accNumber: "",
    bankName: "",
    bbanNumber: "",
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
    <div className=" p-3">
      <div className="card-body border-bottom ">
        <h4 className="card-title fw-bolder">Bank Information</h4>
      </div>

      <Form noValidate>
        <div className="card-body">
          <div className="row ">
            <div className="col-md-3">

              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  required
                  name="accNumber"
                  type="text"
                  placeholder="Account Number"
                  value={formData.accNumber}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>


            </div>
            <div className="col-md-3">

              <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  required
                  name="bankName"
                  type="text"
                  placeholder="Bank Name"
                  value={formData.bankName}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a mobile number.
                </Form.Control.Feedback>
              </Form.Group>

            </div>

            <div className="col-md-3">
              <Form.Group md="10" controlId="validationCustom01" className="mt-3">
                <Form.Label>BBAN Number</Form.Label>
                <Form.Control
                  required
                  name="bbanNumber"
                  type="text"
                  className="mb-3"
                  // onBlur={validateForm}
                  value={formData.bbanNumber}
                  onChange={handleChange}
                  placeholder="BBAN Number"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>


            </div>

            <div className="col-md-3">
              <Form.Group md="10" controlId="validationCustom01" className="mt-3">
                <Form.Label>Branch Address</Form.Label>
                <Form.Control
                  required
                  name="branchAddress"
                  type="text"
                  className="mb-3"
                  // onBlur={validateForm}
                  value={formData.branchAddress}
                  onChange={handleChange}
                  placeholder="Branch Address"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>


            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BankInfo;
