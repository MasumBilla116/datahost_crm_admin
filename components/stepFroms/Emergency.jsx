import { useState } from "react";
import Form from "react-bootstrap/Form";


const Emergency = ({ formData, setFormData, validateForm }) => {


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
        <h4 className="card-title fw-bolder">Emergency Contact Information</h4>
      </div>

      <Form noValidate>
        <div className="card-body">
          <div className="row ">
            <div className="col-md-6">
              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Emergency Contact Person</Form.Label>
                <Form.Control
                  required
                  name="contactPerson"
                  type="text"
                  placeholder="Emergency Contact Person "
                  value={formData.contactPerson}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control
                  required
                  name="contactNumber"
                  type="text"
                  placeholder="Emergency Contact"
                  value={formData.contactNumber}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Emergency Home Phone</Form.Label>
                <Form.Control
                  required
                  name="homePhone"
                  type="text"
                  placeholder="Emergency Home Phone"
                  value={formData.homePhone}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Emergency Work Phone</Form.Label>
                <Form.Control
                  required
                  name="workPhone"
                  type="text"
                  placeholder="Emergency Work Phone"
                  value={formData.workPhone}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>





            </div>
            <div className="col-md-6">
              <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                <Form.Label>Emergency Contact Relationship</Form.Label>
                <Form.Control
                  required
                  name="contactRelationship"
                  type="text"
                  placeholder="Emergency Contact Relationship"
                  value={formData.contactRelationship}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a mobile number.
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                <Form.Label>Alter Emergency Contact</Form.Label>
                <Form.Control
                  required
                  name="alterContact"
                  type="text"
                  placeholder="Alter Emergency Contact"
                  value={formData.alterContact}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a mobile number.
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label> Alt Emergency Home Phone</Form.Label>
                <Form.Control
                  required
                  name="althomePhone"
                  type="text"
                  placeholder=" Alt Emergency Home Phone"
                  value={formData.althomePhone}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Alt Emergency Work Phone</Form.Label>
                <Form.Control
                  required
                  name="altWorkPhone"
                  type="text"
                  placeholder="Alt Emergency Work Phone"
                  value={formData.altWorkPhone}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

            </div>



          </div>
        </div>
      </Form>
    </div>
  );
};

export default Emergency;
