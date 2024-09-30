import MyToast from "@mdrakibul8001/toastify";
import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Switch from "react-switch";
import Axios from "../../utils/axios";
import MultiDaySelector from "../elements/MultiDaySelector";
import Select2 from "../elements/Select2";

const AttendanceSetting = () => {
    const { http } = Axios();
    const [weekend, setWeekend] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notify } = MyToast();
    const [formData, setFormData] = useState({
        time: null,
        days: null,
        percentageDeduction: null,
        salaryType:'',

    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseFloat(value),
        });
    }

    const handleSelectChange = (selectedOption, actionMeta) => {
        
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selectedOption.value,
        });
    };


    const fetchInfoData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true);

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { action: "getLatAttendanceInfo" })
            .then((res) => {
                if (isSubscribed) {
                    const data = res.data.data;
                    
                    setFormData(prev => ({
                        time: parseFloat(data.time),
                        days: parseFloat(data.days),
                        percentageDeduction: parseFloat(data.percentageDeduction),
                        salaryType:data.salaryType,
                    }));
                    setWeekend(res?.data?.data?.weekend)
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('Something went wrong!', err);
                setLoading(false);
            });

        return () => isSubscribed = false;
    }, []);

    useEffect(() => {
        fetchInfoData();
    }, [fetchInfoData]);



    const submitForm = async () => {
        let body = {
            ...formData,weekend
        }
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { ...body, action: "crtAndUptAtnStngs" })
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    setLoading(false);

                }

            })
            .catch((e) => {
                const msg = e.response?.data?.response;
                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                else {
                    if (msg?.time) {
                        notify("error", `${msg.time.Time}`);
                    }
                    if (msg?.days) {
                        notify("error", `${msg.days.Days}`);
                    }
                    if (msg?.percentageDeduction) {
                        notify("error", `${msg.percentageDeduction.PercentageDeduction}`);
                    }
                    if (msg?.weekend) {
                        notify("error", `${msg.weekend.Weekend}`);
                    }

                }
                setLoading(false);
            });

        return () => isSubscribed = false;

    }

    const salaryOptions = [
        { value: 'gross', label: 'Gross' },
        { value: 'basic', label: 'Basic' }
    ];


    return (
        <>



            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">

                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Attendance Settings</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">


                                </div>
                            </div>


                            <div className="card-body">

                                <div className=" ml-1 mb-1  row">
                                    <label
                                        className="col-sm-12 col-lg-12 col-md-12 fw-bolder"
                                    >
                                        Deduction Amount
                                    </label>


                                </div>

                                <div className="ml-1 mb-1  row">
                                    <Form.Group className="mb-1 col-4">
                                        <Form.Label style={{ fontSize: '12px' }} >Late Days</Form.Label>
                                        <Form.Control
                                            required
                                            name="days"
                                            type="text"
                                            defaultValue={formData?.days}
                                            onChange={handleChange}

                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-1 col-4">
                                        <Form.Label style={{ fontSize: '12px' }}>Deduct 1 day basic%</Form.Label>
                                        <Form.Control
                                            required
                                            name="percentageDeduction"
                                            defaultValue={formData?.percentageDeduction}
                                            type="text"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-1 col-4">
                                        <Form.Label style={{ fontSize: '12px' }}>Select Sal Type</Form.Label>
                                        <Select2
                                        name="salaryType"
                                        options={salaryOptions}
                                        value={salaryOptions.find(option => option.value === formData.salaryType) ?? ''}
                                        onChange={handleSelectChange}
                                    />
                                    </Form.Group>
                                </div>


                                <div className="row ml-2 align-items-center mt-4">
                                    <label className="col-sm-6 col-lg-6 col-md-6 fw-bolder">
                                        Late Time
                                    </label>
                                    <Form.Group className="col-sm-6 col-lg-6 col-md-6 mb-1">
                                        {/* <Form.Label>Time</Form.Label> */}
                                        <div className="input-group">
                                            <Form.Control
                                                required
                                                name="time"
                                                type="text"
                                                defaultValue={formData?.time}
                                                onChange={handleChange}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text">min</span>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </div>
                                
                                <div className="row ml-2 align-items-center mt-4">
                                <MultiDaySelector weekend={weekend} setWeekend={setWeekend}/>
                                </div>

                                <div className="text-end fw-bold mb-3 me-2 mt-3">

                                    <div className="text-end">
                                        <Button
                                            variant="primary"
                                            style={{ float: "right" }}
                                            onClick={submitForm}
                                        >
                                            {formData?.days == null ? 'Create' : 'Update'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceSetting