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
const BonusSetting = () => {
    const { http } = Axios();
    const [weekend, setWeekend] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notify } = MyToast();
    const [formData, setFormData] = useState({
        bonusAmount: null,
        bonusType:'',

    })

    const bonusOptions = [
        { value: 'gross', label: 'Gross' },
        { value: 'basic', label: 'Basic' }
    ];



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
                        bonusAmount: data.bonusAmount,
                        bonusType: data.bonusType,
                    }));

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
            ...formData, 
        }

        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { ...body, action: "crtAndUptBonusStngs" })
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
                    if (msg?.amount) {
                        notify("error", `${msg.amount.Amount}`);
                    }
                }
                setLoading(false);
            });

        return () => isSubscribed = false;

    }

    return (
        <>



            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">

                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Bonus Settings</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">


                                </div>
                            </div>


                            <div className="card-body">

                                <div className=" ml-1 mb-1  row">
                                    {/* <label
                                        className="col-sm-12 col-lg-12 col-md-12 fw-bolder"
                                    >
                                        Addition Amount
                                    </label> */}


                                </div>

                                <div className="ml-1 mb-1  row">
                                    <Form.Group className="mb-1 col-6">
                                        <Form.Label>Bonus Amount %</Form.Label>
                                        <Form.Control
                                            required
                                            name="bonusAmount"
                                            type="number"
                                            defaultValue={formData?.bonusAmount}
                                            onChange={handleChange}

                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-1 col-6">
                                        <Form.Label>Select Bonus Type</Form.Label>
                                        <Select2
                                        name="bonusType"
                                        options={bonusOptions}
                                        value={bonusOptions.find(option => option.value === formData.bonusType) ?? ''}
                                        onChange={handleSelectChange}
                                    />
                                    </Form.Group>
                                </div>






                                <div className="text-end fw-bold mb-3 me-2 mt-3">

                                    <div className="text-end">
                                        <Button
                                            variant="primary"
                                            style={{ float: "right" }}
                                            onClick={submitForm}
                                        >
                                            {formData?.bonusAmount == null ? 'Create' : 'Update'}
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

export default BonusSetting