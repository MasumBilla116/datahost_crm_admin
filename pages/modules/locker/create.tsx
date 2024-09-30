import React, { useEffect, useState } from "react";
import lodash from "lodash";
import Switch from "react-switch";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Axios from "../../../utils/axios";

import MyToast from "@mdrakibul8001/toastify";
import { Label, Select2, HeadSection } from "../../../components";
import Breadcrumbs from "../../../components/Breadcrumbs";

function CreateLocker() {
  const [locker, setLocker]: any = useState({
    first: "",
    middle: "",
    last: "",
    length: "",
    status: 1,
  });
  const [lockers, setLockers]: any = useState([]);
  const [allLockers, setallLockers]: any = useState([]);
  const [duplicate, setDuplicate]: any = useState([]);
  const [status, setStatus]: any = useState(true);
  const [showRange, setShowRange]: any = useState(false);

  const { http } = Axios();
  const router = useRouter();
  const { notify } = MyToast();

  const onchange = (e: any) => {
    if (
      e.target.name === "first" ||
      e.target.name === "middle" ||
      e.target.name === "last"
    ) {
      setLocker({ ...locker, [e.target.name]: e.target.value?.toUpperCase() });
    } else {
      setLocker({ ...locker, [e.target.name]: e.target.value });
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();

    let firstSerial = locker?.first;
    let lastSerial = locker?.last;

    let single = locker?.middle;

    if (!showRange) {
      if (!single) {
        notify("error", "locker number is empty");
      } else {
        let tempLockers: any = [];
        let presents =
          lockers?.length && lockers?.filter((each) => each === single);

        if (presents?.length) {
          notify("error", presents[0] + " already exists");
        } else {
          tempLockers.push(single);

          var double = lodash.intersectionWith(
            tempLockers,
            allLockers,
            lodash.isEqual
          );
          double && double?.length
            ? notify(
                "error",
                double?.map((each: any) => {
                  return each;
                }) + " already exists!"
              )
            : notify("success", "locker generated successfully!");
          setDuplicate([...duplicate, ...double]);

          const children = lockers.concat(tempLockers);
          const uniqueLocker = lodash.difference(children, allLockers);

          setLockers(uniqueLocker);
          setLocker({ ...locker });
        }
      }
    } else if (showRange) {
      if (!firstSerial) {
        notify("error", "first locker no is empty");
      } else if (!lastSerial) {
        notify("error", "last locker no is empty");
      } else if (firstSerial && lastSerial) {
        if (firstSerial === lastSerial) {
          notify("error", "first number and second number cannot be same ");
        } else if (Number(firstSerial) && Number(lastSerial)) {
          let first = "";
          generateLocker(first, firstSerial, lastSerial);
        } else if (
          (Number(firstSerial) && !Number(lastSerial)) ||
          (!Number(firstSerial) && Number(lastSerial))
        ) {
          notify("error", "locker serial mismatched");
        } else {
          var firstNum = firstSerial?.match(/\d+/g);
          var lastNum = lastSerial?.match(/\d+/g);

          var firstLetr = firstSerial?.match(/[a-zA-Z]+/g);
          var lastLetr = lastSerial?.match(/[a-zA-Z]+/g);

          if (!firstNum?.length || !lastNum?.length) {
            notify("error", "invalid locker format");
          } else if (firstLetr[0] !== lastLetr[0]) {
            notify("error", "locker serial mismatched");
          } else {
            generateLocker(firstLetr[0], firstNum[0], lastNum[0]);
          }
        }
      }
    }
  };

  const generateLocker = async (
    prefix: string,
    firstNum: number,
    lastNum: number
  ) => {
    let tempLockers: any = [];
    if (Number(firstNum) < Number(lastNum)) {
      for (let i = Number(firstNum); i <= Number(lastNum); i++) {
        tempLockers.push(prefix + String(i));
      }
    } else if (Number(firstNum) > Number(lastNum)) {
      for (let i = Number(lastNum); i <= Number(firstNum); i++) {
        tempLockers.push(prefix + String(i));
      }
    }

    const children = lockers.concat(tempLockers);
    let uniqueChars = lodash.uniq(children);

    const uniqueLocker = lodash.difference(uniqueChars, allLockers);
    setLockers(uniqueLocker);
    setLocker({ ...locker });

    //Duplicate lockers
    var presents = lodash.intersectionWith(
      uniqueChars,
      allLockers,
      lodash.isEqual
    );
    presents && presents?.length
      ? notify(
          "error",
          presents?.length > 3
            ? presents?.slice(0, 2)?.map((each: any) => {
                return each;
              }) + "... already exists!"
            : presents?.map((each: any) => {
                return each;
              }) + " already exists!"
        )
      : notify("success", "locker generated successfully!");
    setDuplicate([...duplicate, ...presents]);
  };

  let Locker_types_options = [
    { value: "1", label: "Individual Locker" },
    { value: "2", label: "Combined Locker" },
  ];
  let Locker_size_options = [
    { value: "1", label: "Small" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Large" },
    { value: "4", label: "Extra Large" },
  ];

  useEffect(() => {
    const controller = new AbortController();

    //fetch all lockers
    const getallLockers = async () => {
      let body: any = {};
      body = {
        action: "getAllLocker",
      };
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, body)
        .then((res: any) => {
          const lockers = res?.data?.data;
          const serial = [];
          !!lockers?.length &&
            lockers?.map((each: any) => {
              return serial?.push(each?.serial);
            });
          setallLockers(serial);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    getallLockers();

    return () => controller.abort();
  }, []);

  const create = async () => {
    let body: any = {
      ...locker,
      lockers,
      status,
      action: "createLocker",
    };

    // console.log(body)
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, body)
      .then((res: any) => {
        notify("success", res?.data?.response);
        router.push(`/modules/locker/list`);
      })
      .catch((err: any) => {
        let error = err?.response?.data?.response;

        if (typeof error === "object") {
          for (const item in error) {
            notify("error", item + " cannot be empty");
          }
        } else {
          notify("error", error);
        }
      });
  };

  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Lockers", link: "/modules/locker" },
    { text: "Create Lockers", link: "/modules/locker/create" },
  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Create New Locker" />
      <div className="card shadow p-3">
        <h5 className="p-3 border-bottom fw-bolder">Create Locker</h5>
        <div className="row">
          <div className="col-lg-6">
            <div className="m-3 p-3">
              <div className="mb-3 row">
                <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                  Locker Type<span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 col-lg-8 col-md-8">
                  <Select2
                    options={Locker_types_options}
                    onChange={(e: any) =>
                      setLocker({ ...locker, type: e.label })
                    }
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                  Size<span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 col-lg-8 col-md-8">
                  <Select2
                    options={Locker_size_options}
                    onChange={(e: any) =>
                      setLocker({ ...locker, size: e.label })
                    }
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                  Description
                </label>
                <div className="col-sm-8 col-lg-8 col-md-8">
                  <textarea
                    name="description"
                    value={locker?.description}
                    placeholder="Description"
                    className="form-control"
                    onChange={onchange}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                  Status<span className="text-danger">*</span>
                </label>
                <div className="col-sm-8 col-lg-8 col-md-8">
                  <Switch
                    onChange={(e: any) => {
                      setStatus(!status);
                      e
                        ? setLocker({ ...locker, status: 1 })
                        : setLocker({ ...locker, status: 0 });
                    }}
                    checked={status}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="mb-3 row mt-4">
              <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                Locker Entry Type<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8 col-lg-8 col-md-8 d-flex align-items-center">
                <input
                  type="radio"
                  className="btn-check"
                  name="Single Locker"
                  id="Single Locker"
                  autoComplete="off"
                  checked={!showRange}
                  onClick={(e) => {
                    setLocker({
                      ...locker,
                      first_locker_number: 0,
                      last_locker_number: 0,
                    });
                    setShowRange(false);
                  }}
                />
                <label
                  className="btn btn-outline-primary rounded-pill font-weight-medium fs-3"
                  htmlFor="Single Locker"
                >
                  Single Locker
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="Ranged Locker"
                  id="Ranged Locker"
                  autoComplete="off"
                  checked={showRange}
                  onClick={(e) => {
                    setShowRange(true);
                  }}
                />
                <label
                  className="btn btn-outline-info rounded-pill font-weight-medium fs-3 ms-2"
                  htmlFor="Ranged Locker"
                >
                  Ranged Locker
                </label>
              </div>
            </div>

            {showRange && (
              <>
                <div className="mb-3 row">
                  <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                    First Locker number<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-6 col-lg-6 col-md-6">
                    <input
                      type="text"
                      name="first"
                      placeholder="First Locker number"
                      value={locker?.first}
                      className="form-control"
                      onChange={onchange}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                    Last Locker Number<span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-6 col-lg-6 col-md-6">
                    <input
                      type="text"
                      name="last"
                      placeholder="Last Locker Number"
                      value={locker?.last}
                      className="form-control"
                      onChange={onchange}
                    />
                  </div>
                </div>
              </>
            )}
            {!showRange && (
              <div className="mb-3 row">
                <label className="col-sm-3 col-lg-3 col-md-3 fw-bolder">
                  Locker number
                </label>
                <div className="col-sm-6 col-lg-6 col-md-6">
                  <input
                    type="text"
                    name="middle"
                    placeholder="Locker number"
                    value={locker?.middle}
                    className="form-control"
                    onChange={onchange}
                  />
                </div>
              </div>
            )}

            <div className="mb-2 mt-4 row">
              <div className="w-75 text-end">
                <Button onClick={submit}>Generate Locker</Button>
              </div>
            </div>

            <div className="mb-2 mt-4 row">
              <div className="w-75 ps-2">
                {!!lockers?.length && (
                  <>
                    {lockers?.map((lock: any, index: number) => {
                      return (
                        <Button
                          key={index}
                          className="pe-0 pt-0 ps-3 "
                          variant="outline-primary m-1 delay"
                          onClick={() => {
                            setLockers(
                              lockers?.length &&
                                lockers.filter((each: any) => each !== lock)
                            );
                          }}
                        >
                          <span className="fs-3">{lock}</span>
                          <span className="bi bi-x ms-2"></span>
                        </Button>
                      );
                    })}

                    <div className="my-4 text-end">
                      <Button variant="warning" onClick={create}>
                        Create locker
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLocker;
