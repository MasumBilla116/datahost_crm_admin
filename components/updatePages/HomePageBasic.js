
import React, { useState, useCallback, useEffect } from "react";
// import {TextInput,Select2} from "../elements/TextInput";
import { Label, Select2, TextInput, HeadSection, RadioButton } from "../";
import { icons } from "../icon/data";
import Select from "react-select";
import { Button, Form, Modal } from "react-bootstrap";


import { CKEditor } from "ckeditor4-react";

export default function Page({ onSubmit, pageDetails }) {
  let data = pageDetails?.page_details;
  const [facilities, setFacilities] = useState([{ title: "", icon: "" }]);
  const [rooms, setRooms] = useState([
    { icon: [], title: "", description: "", price: "", image: "" },
  ]);
  const [aboutUs, setAboutUs] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  
  const [oldIcon, setoldIcon] = useState([
    [{
      name: "",
      label: ""
    }]
  ]);

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach((obj) => {
        if (obj.settings_name == "aboutUs") {
          setAboutUs(obj.settings_value);
        } else if (obj.settings_name == "welcomeMessage") {

          setWelcomeMessage(obj.settings_value)
        } else if (obj.settings_name == "facilities") {
          if (obj.settings_value?.length > 0) {
            setFacilities(obj.settings_value);
          }
        } else if (obj.settings_name == "rooms") {
          if (obj.settings_value?.length > 0) {
            let setting_value = obj.settings_value;
            setting_value.forEach((obj, key) => {
              let icons = obj.icon;
              let i = 0;
              icons.forEach(icon => {
                let values = [...oldIcon];
                // values[key][i]["name"] = icon;
                // values[key][i]["label"] = icon;
                setoldIcon(values)
                i++;
                
              })
            })
            setRooms(setting_value);

          }
        } else if (obj.settings_name == "support") {
          setSupport(obj.settings_value);
        }
      });
    }


  }, [pageDetails])


  const [support, setSupport] = useState(
    {
      phone_front_icon: "",
      phone_front_title: "",
      phone_front_description: "",

      phone_back_icon: "",
      phone_back_title: "",
      phone_back_description: "",

      email_front_icon: "",
      email_front_title: "",
      email_front_description: "",

      email_back_icon: "",
      email_back_title: "",
      email_back_description: "",

      address_front_icon: "",
      address_front_title: "",
      address_front_description: "",

      address_back_icon: "",
      address_back_title: "",
      address_back_description: "",
    },
  );
  let getOldIcon = (icons) => {
    // let icon = [];
    // icons.forEach(element => {
    //   let data = {
    //     'name': element,
    //     'label': element
    //   }
    //   icon.push(data);
    // });
    // return icon;
  }

  let handleChangeSupport = (e) => {
    let values = { ...support };
    values[e.target.name] = e.target.value;
    setSupport(values);
  };
  let handleChangeFacilities = (index, e) => {
    let values = [...facilities];
    values[index][e.target.name] = e.target.value;
    setFacilities(values);
  };

  let handleChangeRooms = (index, e) => {
    let values = [...rooms];
    values[index][e.target.name] = e.target.value;
    setRooms(values);
  };

  let handleFacilitieIcon = (index, e) => {
    let values = [...facilities];
    values[index]["icon"] = e.value;
  };

  const handleRoomIcon = (index, e) => {
    let values = [...rooms];
    values[index]["icon"] = Array.isArray(e) ? e.map((x) => x.value) : [];
  };

  let addFacilityFields = () => {
    setFacilities([...facilities, { title: "", icon: "" }]);
  };

  let removeFacilityFields = (index) => {
    let newFormValues = [...facilities];
    newFormValues.splice(index, 1);
    setFacilities(newFormValues);
  };

  let addRoomFields = () => {
    setRooms([...rooms, { title: "", description: "", price: "", image: "" }]);
  };

  let removeRoomFields = (index) => {
    let roomValues = [...rooms];
    roomValues.splice(index, 1);
    setRooms(roomValues);
  };



  const handleAboutUS = (e) => {
    setAboutUs(e.target.value);
  }

  const handleCKeditor = (e) => {
    setWelcomeMessage(e.editor.getData());
  }

  const [selectedOption, setSelectedOption] = useState(null);
  let dataset = {
    facilities: facilities,
    rooms: rooms,
    welcomeMessage: welcomeMessage,
    aboutUs: aboutUs,
    support: support,
  }
  return (
    <>
      <div>
        <hr />
        <Form>
          <div className="col-md-10">
            <h5 className="text-info mt-4">Add Facilities</h5>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th width="45%">Icon</th>
                  <th width="45%">Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((element, index) => (
                  <tr key={index}>
                    <td>
                      <Select
                        name="icon"
                        placeholder={element.icon}
                        options={icons}

                        onChange={(e) => handleFacilitieIcon(index, e)}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i className={`mdi ${e.icon}`}> </i>
                            <span style={{ marginLeft: 5 }}>{e.icon}</span>
                          </div>
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={element.title || ""}
                        onChange={(e) => handleChangeFacilities(index, e)}
                        required
                      />
                    </td>
                    <td>
                      {index ? (
                        <i
                          className="mdi mdi-minus-box remove-btn "
                          onClick={() => removeFacilityFields(index)}
                        ></i>
                      ) : (
                        <i
                          className="mdi mdi-plus-box add-btn"
                          onClick={() => addFacilityFields()}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h5 className="text-info mt-4">Add Rooms</h5>

          {rooms.map((element, index) => (
            <div className="row room-form-border" key={index}>
              <div className="mb-3 col-md-3 col-lg-3">
                <Form.Label className="">
                  Room Image <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control className="form-control" type="file" id="formFile" />
              </div>
              <div className="mb-3 col-md-5 col-lg-5">
                <Form.Label className="">
                  Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={element.title || ""}
                  onChange={(e) => handleChangeRooms(index, e)}
                  required
                />
              </div>
              <div className="mb-3 col-md-3 col-lg-3">
                <Form.Label className="">
                  Price <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={element.price || ""}
                  onChange={(e) => handleChangeRooms(index, e)}
                  required
                />
              </div>
              <div className="mb-3 col-md-1 col-lg-1">
                {index ? (
                  <i
                    className="mdi mdi-minus-box remove-btn"
                    style={{ marginTop: "1.2rem" }}
                    onClick={() => removeRoomFields(index)}
                  ></i>
                ) : (
                  <i
                    className="mdi mdi-plus-box add-btn"
                    style={{ marginTop: "1.2rem" }}
                    onClick={() => addRoomFields()}
                  ></i>
                )}
              </div>

              <div className="mb-3 col-md-5 col-lg-5">
                <Form.Label className="">
                  Facility Icon <span className="text-danger">*</span>
                </Form.Label>

                {/* incomplete this multiple select , need som discussion  */}

                <Select
                  placeholder="Select Option"
                  value={getOldIcon(element.icon)}
                  // options={icons}
                  options={icons && icons.map(({ value, icon }) => ({ value: value, label: icon }))}

                  isMulti
                  onChange={(e) => handleRoomIcon(index, e)}
                // getOptionLabel={(e) => (
                //   <div style={{ display: "flex", alignItems: "center" }}>
                //     <i className={`mdi ${e.icon}`}> </i>
                //     <span style={{ marginLeft: 5 }}>{e.icon}</span>
                //   </div>
                // )}
                />
              </div>
              <div className="mb-3 col-md-6 col-lg-6">
                <Form.Label className="">
                  Description <span className="text-danger">*</span>
                </Form.Label>

                <textarea
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  rows={2}
                  onChange={(e) => handleChangeRooms(index, e)}
                />
              </div>
            </div>
          ))}

          <div className="col-md-12">
            <h5 className="text-info mt-4">About Us</h5>
            <textarea
              className="form-control"
              placeholder="About Us"
              name="description"
              onChange={handleAboutUS}
              defaultValue={aboutUs}
              rows={5}
            />

            <h5 className="text-info mt-4">Welcome Message</h5>
            <CKEditor
              onFocus={handleCKeditor}
              onBlur={handleCKeditor}
              onChange={handleCKeditor}
              onSelectionChange={handleCKeditor}
              initData={welcomeMessage}
              defaultValue={welcomeMessage}
        
            />

{/* {!!welcomeMessage === true &&
          <CKEditor
          onFocus={handleCKeditor}
          onBlur={handleCKeditor}
          onChange={handleCKeditor}
          onSelectionChange={handleCKeditor}
          initData={welcomeMessage}
          // defaultValue={welcomeMessage}
    
        />

}

{!!welcomeMessage === false &&
          <CKEditor
          onFocus={handleCKeditor}
          onBlur={handleCKeditor}
          onChange={handleCKeditor}
          onSelectionChange={handleCKeditor}
          // initData={welcomeMessage}
          // defaultValue={welcomeMessage}
    
        />

} */}

          </div>

          <div className="row card-body bg-light">
            <h5 className="text-info mt-4">Support Section</h5>
            <div className="mt-4 mb-5">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link d-flex active"
                    data-bs-toggle="tab"
                    href="#phone"
                    role="tab"
                  >
                    <span>
                      <i className="mdi mdi-phone-in-talk" />
                    </span>
                    <span className="d-none d-md-block ms-2">Phone </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex"
                    data-bs-toggle="tab"
                    href="#email"
                    role="tab"
                  >
                    <span>
                      <i className="mdi mdi-email" />
                    </span>
                    <span className="d-none d-md-block ms-2">Email</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex"
                    data-bs-toggle="tab"
                    href="#address"
                    role="tab"
                  >
                    <span>
                      <i className="mdi mdi-map-marker-radius" />
                    </span>
                    <span className="d-none d-md-block ms-2">Address</span>
                  </a>
                </li>
              </ul>
              {/* Tab panes */}
              <div className="tab-content">
                <div className="tab-pane active" id="phone" role="tabpanel">
                  <div className="p-3">
                    <h6 className="mt-2 pt-3 text-muted">
                      <span className="lstick d-inline-block align-middle"></span>
                      Phone Front Side:
                    </h6>
                    <div className="row">
                      <div className="mb-3 col-md-3 col-lg-3">
                        <Form.Label className="">
                          Icon <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          placeholder={support.phone_front_icon}
                          options={icons}
                          onChange={(e) => setSupport(prev => ({ ...prev, phone_front_icon: e.value }))}
                          getOptionLabel={(e) => (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className={`mdi ${e.icon}`}> </i>
                              <span style={{ marginLeft: 5 }}>{e.icon}</span>
                            </div>
                          )}
                        />
                      </div>
                      <div className="mb-3 col-md-4 col-lg-4">
                        <Form.Label className="">
                          Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          name="phone_front_title"
                          onChange={handleChangeSupport}
                          value={support.phone_front_title}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-5 col-lg-5">
                        <Form.Label className="">
                          Description <span className="text-danger">*</span>
                        </Form.Label>

                        <textarea
                          className="form-control"
                          placeholder="Description"
                          name="phone_front_description"
                          onChange={handleChangeSupport}
                          value={support.phone_front_description}
                          rows={2}
                        />
                      </div>
                    </div>
                    <h6 className="mt-2 pt-3 text-muted">
                      <span className="lstick d-inline-block align-middle"></span>
                      Phone Back Side:
                    </h6>

                    <div className="row">
                      <div className="mb-3 col-md-3 col-lg-3">
                        <Form.Label className="">
                          Icon <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          placeholder={support.phone_back_icon}
                          options={icons}
                          onChange={(e) => setSupport(prev => ({ ...prev, phone_back_icon: e.value }))}
                          getOptionLabel={(e) => (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className={`mdi ${e.icon}`}> </i>
                              <span style={{ marginLeft: 5 }}>{e.icon}</span>
                            </div>
                          )}
                        />
                      </div>
                      <div className="mb-3 col-md-4 col-lg-4">
                        <Form.Label className="">
                          Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          name="phone_back_title"
                          onChange={handleChangeSupport}
                          value={support.phone_back_title}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-5 col-lg-5">
                        <Form.Label className="">
                          Description <span className="text-danger">*</span>
                        </Form.Label>

                        <textarea
                          className="form-control"
                          placeholder="Description"
                          name="phone_back_description"
                          onChange={handleChangeSupport}
                          value={support.phone_back_description}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane  p-3" id="email" role="tabpanel">
                  <h6 className="mt-2 pt-3 text-muted">
                    <span className="lstick d-inline-block align-middle"></span>
                    Email Front Side:
                  </h6>

                  <div className="row">
                    <div className="mb-3 col-md-3 col-lg-3">
                      <Form.Label className="">
                        Icon <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        placeholder={support.email_front_icon}
                        options={icons}
                        onChange={(e) => setSupport(prev => ({ ...prev, email_front_icon: e.value }))}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i className={`mdi ${e.icon}`}> </i>
                            <span style={{ marginLeft: 5 }}>{e.icon}</span>
                          </div>
                        )}
                      />
                    </div>
                    <div className="mb-3 col-md-4 col-lg-4">
                      <Form.Label className="">
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="email_front_title"
                        onChange={handleChangeSupport}
                        value={support.email_front_title}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-5 col-lg-5">
                      <Form.Label className="">
                        Description <span className="text-danger">*</span>
                      </Form.Label>

                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="email_front_description"
                        value={support.email_front_description}
                        onChange={handleChangeSupport}
                        rows={2}
                      />
                    </div>
                  </div>
                  <h6 className="mt-2 pt-3 text-muted">
                    <span className="lstick d-inline-block align-middle"></span>
                    Email Back Side:
                  </h6>
                  <div className="row">
                    <div className="mb-3 col-md-3 col-lg-3">
                      <Form.Label className="">
                        Icon <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        placeholder={support.email_back_icon}
                        options={icons}
                        onChange={(e) => setSupport(prev => ({ ...prev, email_back_icon: e.value }))}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i className={`mdi ${e.icon}`}> </i>
                            <span style={{ marginLeft: 5 }}>{e.icon}</span>
                          </div>
                        )}
                      />
                    </div>
                    <div className="mb-3 col-md-4 col-lg-4">
                      <Form.Label className="">
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="email_back_title"
                        onChange={handleChangeSupport}
                        value={support.email_back_title}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-5 col-lg-5">
                      <Form.Label className="">
                        Description <span className="text-danger">*</span>
                      </Form.Label>

                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="email_back_description"
                        onChange={handleChangeSupport}
                        value={support.email_back_description}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                <div className="tab-pane p-3" id="address" role="tabpanel">
                  <h6 className="mt-2 pt-3 text-muted">
                    <span className="lstick d-inline-block align-middle"></span>
                    Address Front Side:
                  </h6>

                  <div className="row">
                    <div className="mb-3 col-md-3 col-lg-3">
                      <Form.Label className="">
                        Icon <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        placeholder={support.address_front_icon}
                        options={icons}
                        onChange={(e) => setSupport(prev => ({ ...prev, address_front_icon: e.value }))}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i className={`mdi ${e.icon}`}> </i>
                            <span style={{ marginLeft: 5 }}>{e.icon}</span>
                          </div>
                        )}
                      />
                    </div>
                    <div className="mb-3 col-md-4 col-lg-4">
                      <Form.Label className="">
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="address_front_title"
                        onChange={handleChangeSupport}
                        value={support.address_front_title}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-5 col-lg-5">
                      <Form.Label className="">
                        Description <span className="text-danger">*</span>
                      </Form.Label>

                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="address_front_description"
                        onChange={handleChangeSupport}
                        value={support.address_front_description}
                        rows={2}
                      />
                    </div>
                  </div>
                  <h6 className="mt-2 pt-3 text-muted">
                    <span className="lstick d-inline-block align-middle"></span>
                    Address Back Side:
                  </h6>

                  <div className="row">
                    <div className="mb-3 col-md-3 col-lg-3">
                      <Form.Label className="">
                        Icon <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        placeholder={support.address_back_icon}
                        options={icons}
                        onChange={(e) => setSupport(prev => ({ ...prev, address_back_icon: e.value }))}
                        getOptionLabel={(e) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i className={`mdi ${e.icon}`}> </i>
                            <span style={{ marginLeft: 5 }}>{e.icon}</span>
                          </div>
                        )}
                      />
                    </div>
                    <div className="mb-3 col-md-4 col-lg-4">
                      <Form.Label className="">
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="address_back_title"
                        onChange={handleChangeSupport}
                        value={support.address_back_title}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-5 col-lg-5">
                      <Form.Label className="">
                        Description <span className="text-danger">*</span>
                      </Form.Label>

                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="address_back_description"
                        onChange={handleChangeSupport}
                        value={support.address_back_description}
                        rows={2}
                      />
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={() => onSubmit(dataset)} variant="primary" className="shadow rounded" style={{ marginTop: "5px" }} type="button" block>
            Update
          </Button>
        </Form>
      </div>
    </>
  );
}
