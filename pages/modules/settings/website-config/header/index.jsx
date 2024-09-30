import React, { useCallback, useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import MyToast from "@mdrakibul8001/toastify";
import Axios from '../../../../../utils/axios';

function ImageSelector() {
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [loading, setLoading] = useState(false);
    const { notify } = MyToast();
    const handleImageSelect = (event) => {
        setSelectedHeader(event.target.value);
    };
    const { http } = Axios();
    const submitForm = async () => {
        let body = {
            headerOption: selectedHeader
        }
        let isSubscribed = true;
        setLoading(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`, { ...body, action: "crtAndUptHeaderStngs" })
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
                    if (msg?.headerOption) {
                        notify("error", `${msg.headerOption.HeaderOption}`);
                    }

                }
                setLoading(false);
            });

        return () => isSubscribed = false;

    }


    const fetchInfoData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true);

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`, { action: "getHomePageStngInfo" })
            .then((res) => {
                if (isSubscribed) {
                    const data = res.data.data;
                    console.log("data", data?.headerOption);
                    setSelectedHeader(data?.headerOption)
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

    return (
        <div className="container-fluid">

            <div className="row">
                <div className="col-6">
                    <div className="card shadow p-3">

                        <div className="d-flex border-bottom title-part-padding align-items-center">
                            <div>
                                <h5 className="card-title mb-0">Header Settings</h5>
                            </div>
                            <div className="ms-auto flex-shrink-0">


                            </div>
                        </div>

                        {/* <h3>Select one</h3> */}
                        <div className="row mt-3">
                            <div className="col-12 d-flex align-items-center mb-3">
                                <label htmlFor="image1" className="d-flex align-items-center">
                                    <img
                                        src="/assets/images/header/leftlogo.png"
                                        alt="Left Logo"
                                        style={{ border: selectedHeader === 'left' ? '5px solid black' : 'none', width: '500px' }}
                                    />
                                    <input
                                        type="radio"
                                        id="image1"
                                        name="image"
                                        value="left"
                                        checked={selectedHeader === 'left'}
                                        onChange={handleImageSelect}
                                        style={{ marginLeft: '10px' }}
                                    />
                                    <span style={{ marginLeft: '10px' }}>Left Logo</span>
                                </label>
                            </div>
                            <div className="col-12 d-flex align-items-center">
                                <label htmlFor="image2" className="d-flex align-items-center">
                                    <img
                                        src="/assets/images/header/centerlogo.png"
                                        alt="Center Logo"
                                        style={{ border: selectedHeader === 'center' ? '5px solid black' : 'none', width: '500px' }}
                                    />
                                    <input
                                        type="radio"
                                        id="image2"
                                        name="image"
                                        value="center"
                                        checked={selectedHeader === 'center'}
                                        onChange={handleImageSelect}
                                        style={{ marginLeft: '10px' }}
                                    />
                                    <span style={{ marginLeft: '10px' }}>Center Logo</span>
                                </label>
                            </div>
                        </div>

                        <div className="text-end fw-bold mb-3 me-2 mt-3">
                            <div className="text-end">
                                <Button
                                    variant="primary"
                                    style={{ float: "right" }}
                                    onClick={submitForm}
                                >
                                    {selectedHeader == null ? 'Create' : 'Update'}
                                    {/* Create */}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ImageSelector;
