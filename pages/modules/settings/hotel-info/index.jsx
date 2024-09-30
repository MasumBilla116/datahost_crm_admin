import { createTheme } from "@mui/material/styles";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import countryList from "react-select-country-list";
import FileSelectButton from "../../../../components/MRIfileManager/FileSelectButton";
import MRI_Single_Uploader from "../../../../components/MRIfileManager/MRI_Single_Uploader";
import MRIfileManagerRender from "../../../../components/RenderMethods/MRIfileManagerRender";
import toast from "../../../../components/Toast/index";
import EditIcon from "../../../../components/elements/EditIcon";
import Select2 from "../../../../components/elements/Select2";
import FromTimePicker from "../../../../components/time_picker/FromTimePicker";
import FromToToTimePicker from "../../../../components/time_picker/FromToToTimePicker";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";
import themeContext from "../../../../components/context/themeContext";
import { HeadSection } from "../../../../components";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.stng.htl_infol",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

export default function HotelInfo({ accessPermissions }) {
  const { http } = Axios();
  const [openInclock, setOpenInClock] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const context = useContext(themeContext);
  const { hotelName } = context;


  // date-time theme
  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [configValue, setConfigValue] = useState({});

  const [picValue, setPicvalue] = useState({
    upload_ids: [],
    upload_files: [],
  });

  const [password, setPassword] = useState("");
  const [weekend, setWeekend] = useState([]);
  const [defaultWeekend, setDefaultWeekend] = useState([]);
  const [timeZone, setTimeZone] = useState();

  // console.log("<configValue></configValue>",configValue);
  const handleExit = () => setShowUpdateModal(false);

  //Config data list
  const [country, setCountry] = useState();

  let [itemList, setItemList] = useState([]);
  const [itemDetails, setItemDetails] = useState({});

  const [timeZoneList, seTtimeZoneList] = useState([]);
  const counntryList = useMemo(() => countryList().getData(), []);

  const wekendList = [
    {
      name: "Saturday",
    },
    {
      name: "Sunday",
    },
    {
      name: "Monday",
    },
    {
      name: "Tuesday",
    },
    {
      name: "Wednesday",
    },
    {
      name: "Thursday",
    },
    {
      name: "Friday",
    },
  ];

  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();

  //function set selected files ids

  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);
  //function set selected files ids
  const setIds = (Ids) => {
    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setPicvalue((prev) => ({
      ...prev,
      upload_ids: arr,
    }));
  };

  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setPicvalue((prev) => ({
      ...prev,
      upload_ids: filtered,
    }));

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setPicvalue((prev) => ({
      ...prev,
      upload_files: newList,
    }));
  };

  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }
    setPicvalue((prev) => ({
      ...prev,
      upload_files: filesArr,
    }));
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
      getTimeZone();
    });
    return () => clearTimeout(timeout);
  }, []);
  // configValue

  //fir web
  const [arrWeb, setArrWeb] = useState([]);
  const [filesArrWeb, setFilesArrWeb] = useState([]);
  const [configValueWeb, setConfigValueWeb] = useState({});
  const [showVerificationModalWeb, setShowVerificationModalWeb] =
    useState(false);
  const [picValueWeb, setPicvalueWeb] = useState({
    upload_ids: [],
    upload_files: [],
  });

  //function set selected files ids
  const setIdsWeb = (Ids) => {
    for (let i = 0; i < Ids.length; i++) {
      arrWeb.push(Ids[i]);
    }

    setPicvalueWeb((prev) => ({
      ...prev,
      upload_ids: arrWeb,
    }));
  };

  const removePhotoWeb = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArrWeb(filtered);

    setPicvalueWeb((prev) => ({
      ...prev,
      upload_ids: filtered,
    }));

    //remove files array of objects
    const newList = filesArrWeb.filter((item) => item.id !== id);
    setFilesArrWeb(newList);

    setPicvalueWeb((prev) => ({
      ...prev,
      upload_files: newList,
    }));
  };

  // start File manager section
  //function set selected files ids
  const setFilesDataWeb = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArrWeb.push(data[i]);
    }
    setPicvalueWeb((prev) => ({
      ...prev,
      upload_files: filesArrWeb,
    }));
  };

  const fetchItemList = async () => {
    http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "getConfigDataInfo",
      })
      .then((res) => {
        const configDataList = res?.data?.data;
        configDataList.map((cItem) => {
          cItem["is_show"] = false;
          setItemList((prev) => [...prev, cItem]);
        });
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });
  };

  const handleExitVerification = () => setShowVerificationModal(false);
  const handleOpenVerificationExit = () => setShowVerificationModal(false);

  const handleOpenVerification = () => {
    setPassword("");
    setShowVerificationModal(true);
  };

  const changeHandlePassword = (e) => {
    setPassword(e.target.value);
  };
  const changeHandler = (e) => {
    setConfigValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSelectWekend = (e) => {
    setWeekend([]);
    e.map((x) => {
      setWeekend((weekend) => [...weekend, x.value]);
    });
  };

  const handleOpen = (name) => {
    setItemList((current) =>
      current.map((obj) => {
        if (obj.config_name === name) {
          setConfigValue((prev) => ({
            ...prev,
            config_value: obj.config_value,
            config_name: obj.config_name,
          }));

          return {
            ...obj,
            is_show: true,
          };
        }
        if (obj.config_name !== name) {
          return {
            ...obj,
            is_show: false,
          };
        }
        return obj;
      })
    );
  };

  const verification = async (e) => {
    if (password === "") {
      notify("error", "Password Is Required");
      return false;
    }
    let body = {
      action: "userVerifiaction",
      password: password,
    };

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,
        body
      )
      .then((res) => {
        if (res.data.data.user === "verified") {
          notify("success", `${res.data.response}`);
          updateForm();
        } else {
          notify("error", "Some Problem Occure");
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof msg == "string") {
          notify("error", `${e.response.data.response}`);
        } else {
          notify("error", "Invalid Password");
        }
      });
  };

  const updateForm = async () => {
    let value = configValue?.config_value;

    //     console.log('configValue',configValue?.config_name)
    // return;
    setImagePath(value);
    if (configValue?.config_name === "Country") {
      value = country;
    }
    if (configValue?.config_name === "Time Zone") {
      value = timeZone;
    }
    if (configValue?.config_name === "Weekend") {
      value = weekend.toString();
    }

    if (configValue?.config_name === "Dark Logo") {
      value = picValue?.upload_ids;
      // value = picValue?.upload_ids;
      // setImagePath(value);
    }
    if (configValue?.config_name === "Light Logo") {
      value = picValueWeb?.upload_ids;
      // value = picValueWeb?.upload_ids;
      // setImagePath(value);
    }
    if (configValue?.config_name === "Check-In") {
      value = `${fromTime}`;
    }

    if (configValue?.config_name === "Check-Out") {
      value = `${fromTime}`;
    }

    if (configValue?.config_name === "Luggage Storage") {
      value = `${fromTime}-${toTime}`;
    }

    // if (configValue?.config_name === "Cancel by Customer") {
    //   value = value;
    // }
    // Cancel by Customer
    if (!value) {
      notify("error", "Data are not updated");
      return false;
    }

    let body = {
      action: "updateOrCreateConfigData",
      config_name: configValue?.config_name,
      config_value: value,
      // upload_ids:configValue?.upload_ids,
      // upload_files:configValue?.upload_files,
    };

    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,
        body
      )
      .then((res) => {
        notify("success", "Successfully Updated!");

        setItemList((current) =>
          current.map((obj) => {
            if (obj.id != 0) {
              if (body.config_name === obj.config_name) {
                return {
                  ...obj,
                  config_value: body.config_value,
                  is_show: false,
                };
              } else {
                return {
                  ...obj,
                  is_show: false,
                };
              }
            }
            return obj;
          })
        );
        // getInvoiceTermsAndCondition();
        handleOpenVerificationExit();
        setConfigValue({});
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.facility) {
            notify("error", `${msg.facility.Facility}`);
          }
        }
      });

    // fetchItemList();

    // return ()=>isSubscribed=false;
  };

  const getTimeZone = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "allTimeZone",
      })
      .then((res) => {
        seTtimeZoneList(res.data.data);
      });
  };

  // @@ handle to add terms and conditions field
  const [termsAndConditionsTblRow, setTermsAndConditionsTblRow] = useState([]);
  const [termsAndConditionsTblTotalRow, setTermsAndConditionsTblTotalRow] = useState(0);
  // @@ row add
  const handleToAddTermsAndConditionField = () => {
    setTermsAndConditionsTblRow((prev) => [
      ...prev,
      { id: termsAndConditionsTblRow?.length + 1, value: "" },
    ]);
    setTermsAndConditionsTblTotalRow(termsAndConditionsTblRow?.length + 1)
  };
  // @@ row remove
  const handleToRemoveTermsAndConditionField = (row) => {
    const newRow = termsAndConditionsTblRow?.filter((item) => item?.id != row);
    setTermsAndConditionsTblRow(newRow);
    setTermsAndConditionsTblTotalRow(termsAndConditionsTblRow?.length - 1)
  };

  // @@ submit terms and conditions
  const submitTermAndContisions = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("action", "invoiceTermsAndConditionsSave");
    formData.append("totalRow", termsAndConditionsTblTotalRow);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, formData)
      .then((res) => {
        if (res?.data?.status == "success") {
          notify("success", `${res?.data?.response}`);
          // getInvoiceTermsAndCondition();
        } else {
          notify("error", `${res?.data?.response}`);
        }

      }).catch(error => {
        notify("error", `Something is worng try again`);
      });
  };

  useEffect(() => {
    getInvoiceTermsAndCondition();
  }, []);


  const getInvoiceTermsAndCondition = async (e) => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: 'getInvoiceTermsAndCondition'
      })
      .then((res) => {
        if (res?.data?.data?.length == 0) {
          setTermsAndConditionsTblRow([{
            config_value: ""
          }])
        } else {
          var newArr = [];
          res?.data?.data?.map((row, index) => {
            const obj = {
              id: index + 1,
              config_value: row?.config_value,
            };
            newArr.push(obj);
          })
          setTermsAndConditionsTblRow(newArr);
          setTermsAndConditionsTblTotalRow(newArr?.length)
        }
      }).catch(error => {
      });
  };

  return (
    <>
      <HeadSection title="Settings Dashbord" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow m-xs-2">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div className="row  " style={{ width: "100%" }}>
                  <div className="col-md-6">
                    <h4 className="card-title mb-0 text-uppercase font-weight-bold text-center">
                      Hotel Information
                    </h4>
                  </div>
                  <div className="col-md-6">
                    <h4 className="card-title mb-0 text-uppercase font-weight-bold text-center">
                      Room Booking Invoice Terms & Conditions
                    </h4>
                  </div>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <Modal
                    dialog
                    ClassName="modal-lg"
                    show={showVerificationModal}
                    onHide={handleExitVerification}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Verification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="formBasicName">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={changeHandlePassword}
                            required
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          className="shadow mt-3 rounded"
                          onClick={() => verification()}
                        >
                          {" "}
                          Submit{" "}
                        </Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card-body table-responsive">
                    <table className="table">
                      <thead style={{ background: "#f2f2f2" }}>
                        <tr>
                          <th className="card-title mb-0 text-uppercase font-weight-bold text-muted">
                            Setting
                          </th>
                          <th className="card-title mb-0 text-uppercase font-weight-bold text-muted">
                            Setting Value
                          </th>
                          <th className="card-title mb-0 text-uppercase font-weight-bold text-muted">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>

                        {itemList.map((item, index) => {
                          if (
                            item.config_name === "Rejected by Admin" ||
                            item.config_name === "Cancel by Customer"
                          ) {
                            return null; // Skip these items, as they will be handled in the fieldset below
                          }
                          return (
                            <tr key={`${index}`}>
                              <td>{item.config_name}</td>
                              <td
                                style={
                                  item.config_name === "Light Logo"
                                    ? { backgroundColor: "#3056d3", color: "white" }
                                    : {}
                                }
                              >
                                {(() => {
                                  if (item.is_show) {
                                    if (item.config_name === "Dark Logo") {
                                      return (
                                        <MRIfileManagerRender
                                          setIds={setIds}
                                          setFilesData={setFilesData}
                                          render={(
                                            show,
                                            handleClose,
                                            uploadIds,
                                            selecteLoading,
                                            handleShow,
                                            files
                                          ) => (
                                            <>
                                              <Modal
                                                dialogClassName="modal-xlg"
                                                show={show}
                                                onHide={handleClose}
                                              >
                                                <Modal.Header closeButton>
                                                  <Modal.Title>
                                                    File Uploader
                                                  </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                  <MRI_Single_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                  />
                                                </Modal.Body>
                                                <Modal.Footer></Modal.Footer>
                                              </Modal>
                                              <FileSelectButton
                                                handleShow={handleShow}
                                                files={picValue}
                                                removePhoto={removePhoto}
                                              />
                                            </>
                                          )}
                                        />
                                      );
                                    } else if (
                                      item.config_name === "Light Logo"
                                    ) {
                                      return (
                                        <MRIfileManagerRender
                                          setIds={setIdsWeb}
                                          setFilesData={setFilesDataWeb}
                                          render={(
                                            show,
                                            handleClose,
                                            uploadIds,
                                            selecteLoading,
                                            handleShow,
                                            files
                                          ) => (
                                            <>
                                              <Modal
                                                dialogClassName="modal-xlg"
                                                show={show}
                                                onHide={handleClose}
                                              >
                                                <Modal.Header closeButton>
                                                  <Modal.Title>
                                                    File Uploader
                                                  </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                  <MRI_Single_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                  />
                                                </Modal.Body>
                                                <Modal.Footer></Modal.Footer>
                                              </Modal>
                                              <FileSelectButton
                                                handleShow={handleShow}
                                                files={picValueWeb}
                                                removePhoto={removePhotoWeb}
                                              />
                                            </>
                                          )}
                                        />
                                      );
                                    } else {
                                      if (
                                        item.config_name ===
                                        "Sales Contact Number"
                                      ) {
                                        return (
                                          <Form.Control
                                            type="number"
                                            placeholder="017xx-xxx-xxx"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                            onChange={changeHandler}
                                            required
                                          />
                                        );
                                      } else if (
                                        item.config_name === "Sales Contact Email"
                                      ) {
                                        return (
                                          <Form.Control
                                            type="email"
                                            placeholder="example@gmail.com"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                            onChange={changeHandler}
                                            required
                                          />
                                        );
                                      } else if (item.config_name === "Country") {
                                        return (
                                          <Select2
                                            options={counntryList}
                                            placeholder={item.config_value}
                                            onChange={(e) => setCountry(e.label)}
                                          />
                                        );
                                      } else if (
                                        item.config_name === "Time Zone"
                                      ) {
                                        return (
                                          <Select2
                                            options={
                                              timeZoneList &&
                                              timeZoneList.map(
                                                ({ id, name }) => ({
                                                  value: id,
                                                  label: name,
                                                })
                                              )
                                            }
                                            onChange={(e) => setTimeZone(e.label)}
                                            placeholder={item.config_value}
                                          />
                                        );
                                      } else if (item.config_name === "Weekend") {
                                        return (
                                          <Select2
                                            isMulti
                                            isClearable
                                            options={
                                              wekendList &&
                                              wekendList.map(({ name }) => ({
                                                value: name,
                                                label: name,
                                              }))
                                            }
                                            onChange={onSelectWekend}
                                            defaultValue={defaultWeekend}
                                          />
                                        );
                                      } else if (
                                        item.config_name === "Additional Info"
                                      ) {
                                        return (
                                          <Form.Control
                                            as="textarea"
                                            onChange={changeHandler}
                                            placeholder="Enter Value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                          ></Form.Control>
                                        );
                                      } else if (item.config_name === "Pets") {
                                        return (
                                          <Form.Control
                                            onChange={changeHandler}
                                            placeholder="Enter Value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                          ></Form.Control>
                                        );
                                      } else if (
                                        item.config_name ===
                                        "Children & Extra Beds"
                                      ) {
                                        return (
                                          <Form.Control
                                            onChange={changeHandler}
                                            placeholder="Enter Value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                          ></Form.Control>
                                        );
                                      } else if (
                                        item.config_name ===
                                        "Cancellation/Payment"
                                      ) {
                                        return (
                                          <Form.Control
                                            onChange={changeHandler}
                                            placeholder="Enter Value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                          ></Form.Control>
                                        );
                                      } else if (
                                        item.config_name === "Check-In"
                                      ) {
                                        return (
                                          // <Form.Control
                                          // onChange={changeHandler}
                                          // placeholder="Enter Value"
                                          // name="config_value"
                                          // defaultValue={item.config_value}
                                          // >

                                          // </Form.Control>

                                          <FromTimePicker
                                            time={item.config_value}
                                            setfromtime={setFromTime}
                                          />
                                          // <FromToToTimePicker time={item.config_value} setfromtime={setFromTime} settotime={setToTime} />
                                        );
                                      } else if (
                                        item.config_name === "Check-Out"
                                      ) {
                                        return (
                                          <FromTimePicker
                                            time={item.config_value}
                                            setfromtime={setFromTime}
                                          />

                                          // <FromToToTimePicker time={item.config_value} setfromtime={setFromTime} settotime={setToTime} />
                                        );
                                      } else if (
                                        item.config_name === "Luggage Storage"
                                      ) {
                                        return (
                                          <FromToToTimePicker
                                            time={item.config_value}
                                            setfromtime={setFromTime}
                                            settotime={setToTime}
                                          />
                                        );
                                      } else {
                                        return (
                                          <Form.Control
                                            type="text"
                                            placeholder="Enter Value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                            onChange={changeHandler}
                                            required
                                          />
                                        );
                                      }
                                    }
                                  } else if (item?.config_name === "Dark Logo") {
                                    return (
                                      <img
                                        src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${item?.config_value}`}
                                        width="100"
                                        height="100"
                                      />
                                    );
                                  } else if (item?.config_name === "Light Logo") {
                                    return (
                                      <img
                                        src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${item?.config_value}`}
                                        width="100"
                                        height="100"
                                      />
                                    );
                                  } else {
                                    return (
                                      <p>
                                        {item.config_value === ""
                                          ? "Not Set Yet"
                                          : Array.isArray(item?.config_value)
                                            ? item.config_value.toString()
                                            : item.config_value}
                                      </p>
                                    );
                                  }
                                })()}
                              </td>

                              <td>
                                <ul className="action ">
                                  {item.is_show ? (
                                    <Button
                                      className="btn-info mr-3"
                                      onClick={() => updateForm()}
                                    >
                                      Save
                                    </Button>
                                  ) : (
                                    <>
                                      {/* {accessPermissions.createAndUpdate &&   */}
                                      <li>
                                        <Link href="#">
                                          <a
                                            onClick={() =>
                                              handleOpen(item.config_name)
                                            }
                                          >
                                            <EditIcon />
                                          </a>
                                        </Link>
                                      </li>

                                      {/* } */}
                                    </>
                                  )}
                                </ul>
                              </td>
                            </tr>

                          );
                        })}
                        <tr>
                          <td colSpan="3">
                            <fieldset style={{ border: "1px solid #ddd", padding: "10px" }}>
                              <legend
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#666",
                                  width: "auto",
                                  padding: "0 10px",
                                }}
                              >
                                {/* Booking Refund Charge(%) */}
                                {/* Booking Refund Charge (Percentage) */}
                                Refund Charge for Booking (%)
                              </legend>
                              <table style={{ width: "100%" }}>
                                <tbody>
                                  {itemList
                                    .filter(
                                      (item) =>
                                        item.config_name === "Rejected by Admin" ||
                                        item.config_name === "Cancel by Customer"
                                    )
                                    .map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.config_name}</td>
                                        <td>
                                          <Form.Control
                                            type="number"
                                            placeholder="Enter value"
                                            name="config_value"
                                            defaultValue={item.config_value}
                                            onChange={changeHandler}
                                            required
                                          />
                                        </td>
                                        <td>
                                          <ul className="action">
                                            {item.is_show ? (
                                              <Button className="btn-info mr-3" onClick={() => updateForm()}>
                                                Save
                                              </Button>
                                            ) : (
                                              <>
                                                <li>
                                                  <Link href="#">
                                                    <a onClick={() => handleOpen(item.config_name)}>
                                                      <EditIcon />
                                                    </a>
                                                  </Link>
                                                </li>
                                              </>
                                            )}
                                          </ul>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold" }}>
                                      How much do you want to deduct
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </fieldset>

                          </td>
                        </tr>
                      </tbody>


                    </table>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-body table-responsive">
                    <form
                      onSubmit={submitTermAndContisions}
                      action="#"
                      method="post"
                    >
                      <table className="table">
                        <thead style={{ background: "#f2f2f2" }}>
                          <tr>
                            <th className="card-title mb-0 text-uppercase font-weight-bold text-muted">
                              S.I
                            </th>
                            <th className="card-title mb-0 text-uppercase font-weight-bold text-muted">
                              Terms & Condition
                            </th>
                            <th className="card-title mb-0 text-uppercase font-weight-bold text-muted text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody id="invoice_terms_and_conditions_tbl_body">
                          {termsAndConditionsTblRow?.map((row, index) => {
                            const tbl_row = index + 1;
                            return (
                              <tr key={index + 111}>
                                <td>{tbl_row}</td>
                                <td>
                                  <textarea
                                    placeholder="What is your invoice terms & conditions...??"
                                    name={`terms_conditions_${tbl_row}`}
                                    id={`terms_condition_${tbl_row}`}
                                    className="form-control"
                                    defaultValue={row?.config_value}
                                  ></textarea>
                                </td>

                                <td className="text-center">
                                  {index == 0 ? (
                                    <button
                                      onClick={handleToAddTermsAndConditionField}
                                      className="btn btn-sm btn-outline-success"
                                      type="button"
                                    >
                                      <i className="fas fa fa-plus"></i>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleToRemoveTermsAndConditionField(tbl_row)
                                      }
                                      className="btn btn-sm btn-outline-danger"
                                      type="button"
                                    >
                                      <i className="fas fa fa-trash"></i>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td></td>
                            <td></td>
                            <td className="text-center">
                              <button
                                type="submit"
                                className="btn btn-sm btn-success"
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </form>
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
