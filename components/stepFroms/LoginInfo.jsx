import Form from "react-bootstrap/Form";


const LoginInfo = ({ formData, setFormData, validateForm }) => {
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
        <h4 className="card-title fw-bolder">Employee Login Info.</h4>
      </div>

      <Form noValidate>
        <div className="card-body">
          <div className="row ">
            <div className="col-md-6">
              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>User Email</Form.Label>
                <Form.Control
                  required
                  name="userEmail"
                  type="text"
                  placeholder="User Email"
                  value={formData.userEmail}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  name="password"
                  type="text"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                // onBlur={validateForm}
                />
                <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                  Please provide a name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                  <Form.Label>Data Access Type</Form.Label>
                  <select onChange={handleChange} name="data_access_type" className="form-select" value={formData.data_access_type}>
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
      </Form>
    </div>
  );
};

export default LoginInfo;
