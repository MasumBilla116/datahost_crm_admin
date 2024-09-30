import Link from 'next/link';
import React, { useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import countryList from 'react-select-country-list';
import { HeadSection, Select2 } from "../../../../components";
import toast from "../../../../components/Toast/index";
import EditIcon from '../../../../components/elements/EditIcon';
import Axios from '../../../../utils/axios';
import { getSSRProps } from '../../../../utils/getSSRProps';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.gnrl_stng" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

export default function ListView({ accessPermissions }) {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);


  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [configValue, setConfigValue] = useState({});

  const [password, setPassword] = useState("");
  const [country, setCountry] = useState();
  const [timeZone, setTimeZone] = useState();
  const [weekend, setWeekend] = useState([]);

  const [defaultWeekend, setDefaultWeekend] = useState([]);

  const [timeZoneList, seTtimeZoneList] = useState([]);
  const counntryList = useMemo(() => countryList().getData(), []);


  const handleExit = () => setShowUpdateModal(false);


  //Config data list
  var wekendList = [
    {
      name: "Saturday"
    },
    {
      name: "Sunday"
    },
    {
      name: "Monday"
    },
    {
      name: "Tuesday"
    },
    {
      name: "Wednesday"
    },
    {
      name: "Thursday"
    },
    {
      name: "Friday"
    },
  ];

  let [itemList, setItemList] = useState([
    {
      config_lebel: "Country",
      config_name: "Country",
      config_value: "",
      is_show: false
    },
    {
      config_lebel: "Time Zone",
      config_name: "Time Zone",
      config_value: "",
      is_show: false
    },
    {
      config_lebel: "Contact Number",
      config_name: "Contact Number",
      config_value: "",
      is_show: false
    },
    {
      config_lebel: "Email",
      config_name: "Email",
      config_value: "",
      is_show: false
    },
    {
      config_lebel: "Contact Person Name",
      config_name: "Contact Person Name",
      config_value: "",
      is_show: false
    },
    // {
    //   config_lebel: "Weekend",
    //   config_name: "Weekend",
    //   config_value: [],
    //   is_show: false
    // }



  ]);



  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
      getTimeZone();
    });
    return () => clearTimeout(timeout);
  }, [configValue]);


  const fetchItemList = async () => {

    itemList.map((obj) => {
      http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, {
        action: "configDataInfo", name: obj.config_name
      })
        .then((res) => {

          let config_data = res?.data?.data;
          setItemList(current =>
            current.map(obj => {
              if (config_data?.config_name == "Weekend") {
                setDefaultWeekend([]);
                let data_val = config_data.config_value;
                data_val.forEach(element => {
                  setDefaultWeekend(defaultWeekend => [
                    ...defaultWeekend,
                    {
                      value: element,
                      label: element
                    }
                  ]);

                });
              }
              if (obj?.config_name === config_data?.config_name) {
                return {
                  ...obj,
                  config_value: config_data.config_value
                };
              }
              return obj;
            }),
          );

        })
        .catch((err) => {
          console.log("Server Error ~!");
        });
    });
  };

  const getTimeZone = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "allTimeZone" })
      .then((res) => {
        seTtimeZoneList(res.data.data);
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
    setCountry("");
    setTimeZone("");
    setConfigValue(prev => ({
      ...prev, [e.target.name]: e.target.value
    }));

  };

  const onSelectWekend = (e) => {

    setWeekend([]);
    e.map((x) => {
      setWeekend(weekend => [
        ...weekend,
        x.value
      ])
    })

  };


  const handleOpen = (name) => {

    setItemList(current =>
      current.map(obj => {

        if (obj.config_name === name) {
          setConfigValue(prev => ({
            ...prev,
            config_value: obj.config_value,
            config_name: obj.config_name
          }));

          return {
            ...obj,
            is_show: true
          };
        }
        if (obj.config_name !== name) {
          return {
            ...obj,
            is_show: false
          };
        }
        return obj;
      }),
    );
  };

  const verification = async (e) => {

    if (password === '') {
      notify("error", "Password Is Required");
      return false;
    }
    let body = {
      action: "userVerifiaction",
      password: password
    };

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, body)
      .then((res) => {

        if (res.data.data.user === "verified") {
          notify("success", `${res.data.response}`);
          updateForm();
        } else {
          notify("error", "Some Problem Occure");
        }
      }).catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof (msg) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          notify("error", "Invalid Password");
        }
      });
  };

  const updateForm = async (e) => {
    let value = configValue.config_value;

    if (configValue?.config_name === 'Country') {
      value = country;
    }
    if (configValue?.config_name === 'Time Zone') {
      value = timeZone;
    }
    if (configValue?.config_name === 'Weekend') {
      value = weekend.toString();
    }

    if (!value) {
      notify("error", "Data are not updated");
      return false;
    }

    let body = {
      action: "updateOrCreateConfigData",
      config_name: configValue.config_name,
      config_value: value
    };

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, body)
      .then((res) => {
        notify("success", "Successfully Updated!");

        setItemList(current =>
          current.map(obj => {
            if (obj.id != 0) {
              if (body.config_name === obj.config_name) {
                return {
                  ...obj,
                  config_value: body.config_value,
                  is_show: false
                };
              } else {
                return {
                  ...obj,
                  is_show: false
                };
              }

            }
            return obj;
          }),
        );
        handleOpenVerificationExit();
        setConfigValue({});
      })
      .catch((e) => {
        const msg = e.response?.data?.response;
        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.facility) {
            notify("error", `${msg.facility.Facility}`);
          }
        }
      });

    // fetchItemList();

    // return ()=>isSubscribed=false;
  };

  return (
    <div className="container-fluid">
            <HeadSection title="General-Setting" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow m-xs-2">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">General Setting</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Modal dialogClassName="modal-lg" show={showVerificationModal} onHide={handleExitVerification}>
                  <Modal.Header closeButton>
                    <Modal.Title>Verification</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formBasicName">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password" name="password" onChange={changeHandlePassword} required />
                      </Form.Group>
                      <Button variant="primary" className="shadow mt-3 rounded" onClick={() => verification()} > Submit </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            </div>


            <div className="card-body table-responsive">

              <table className="table">
                <thead>
                  <tr>
                    <th>Setting</th>
                    <th>Setting Value</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {
                    itemList.map((item, index) => {
                      return (
                        <tr key={`${index}`}>
                          <td
                          >
                            {item.config_lebel}
                          </td>
                          <td>
                            {(() => {
                              if (item.is_show) {
                                if (item.config_name === "Country") {

                                  return (
                                    <Select2 options={counntryList}
                                      placeholder={item.config_value}
                                      onChange={e => setCountry(e.label)} />
                                  )
                                } else if (item.config_name === "Time Zone") {

                                  return (

                                    <Select2
                                      options={timeZoneList && timeZoneList.map(({ id, name }) => ({ value: id, label: name }))}
                                      onChange={e => setTimeZone(e.label)}
                                      placeholder={item.config_value}
                                    />
                                  )
                                }
                                
                                // else if (item.config_name === "Weekend") {

                                //   return (
                                //     <Select2
                                //       isMulti
                                //       isClearable
                                //       options={wekendList && wekendList.map(({ name }) => ({ value: name, label: name }))}
                                //       onChange={onSelectWekend}
                                //       defaultValue={defaultWeekend}

                                //     />

                                //   )
                                // } 
                                
                                else {
                                  return (
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter value"
                                      name="config_value"
                                      defaultValue={item.config_value}
                                      onChange={changeHandler}
                                      required />
                                  )

                                }

                              } else {
                                return (
                                  <p>{item.config_value === "" ? "Not Set Yet" : item.config_value.toString()}</p>
                                )
                              }
                            })()}
                          </td>

                          <td>

                            <ul className="action ">
                              {item.is_show ?


                                <Button className="btn-info mr-3" onClick={updateForm}>
                                  Save
                                </Button>
                                :
                                <>

                                  {accessPermissions.createAndUpdate && <li>
                                    <Link href="#">
                                      <a onClick={() => handleOpen(item.config_name)}>
                                        <EditIcon />
                                      </a>
                                    </Link>
                                  </li>}

                                </>
                              }
                            </ul>

                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}