import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CKEditor } from "ckeditor4-react";
import { useRouter } from "next/router";
import Axios from "../../../../../../utils/axios";
import toast from "../../../../../../components/Toast/index";
import { getSSRProps } from "../../../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
    const {
      permission,
      query,
      accessPermissions
    } = await getSSRProps({ context: context, access_code: "m.stng.wb_cnfg" });
    return {
      props: {
        permission,
        query,
        accessPermissions
      },
    };
  };


const PrivacyPolicy = () => {


    const { http } = Axios();
    const router = useRouter();
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);
    const [id, setId] = useState(null);
    const [pending, setPending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState({
        title: "",
        content: "",
        // section_isChecked: 1,
    });

    const fetchSectionData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/privacy-policy`, {
                action: "getPrivacyPoliciesInfo",
            })

            .then((res) => {
                if (isSubscribed) {
                    setId(res?.data?.data?.id);
                    setSection((prev) => ({
                        ...prev,
                        title: res?.data?.data?.title,
                        content: res.data.data.content,
                    }));
                }
            })

        }, []);


        useEffect(() => {
            fetchSectionData();
        }, [fetchSectionData]);

    const handleSectionChange = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue =  value;

        setSection((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };

        // submit handler
        const onUpload = async (e) => {
            e.preventDefault();

            let body = {

action: "createPrivacyPolicies",
id: id,
title: section.title,
content: section.content,

            }
            let isSubscribed = true;
            setPending(true);
            await http
                .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/privacy-policy`,body)
                .then((res) => {
                    if (isSubscribed) {
                        notify("success", "successfully Added!");
                        ref.current.value = "";
                        setPending(false);
                    }
                })
                .catch((e) => {
                    const msg = e.response?.data?.response;
    
                    if (typeof msg == "string") {
                        notify("error", `${msg}`);
                    } else {
                        if (msg?.name) {
                            notify("error", `${msg.name.Name}`);
                        }
                    }
                    setPending(false);
                });
    
            return () => (isSubscribed = false);
        
        
        }

    return (
        <>
            <div className="card shadow p-3">
                <Form onSubmit={onUpload}>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="title"
                                onChange={(e) =>
                                    handleSectionChange(e, "content")
                                }
                                defaultValue={section.title}
                            // onChange={handleChange5}
                            // required
                            />
                        </div>
                 

                        {section?.content ? (
                            <div className="mb-3 col-md-10 col-lg-10">
                                <Form.Label className="">
                                    Description <span className="text-danger">*</span>
                                </Form.Label>
                                <CKEditor
                                    oonFocus={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    onBlur={(e) => handleSectionChange(e, "content")}
                                    onChange={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    onSelectionChange={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    initData={section.content}
                                />
                            </div>
                        ) : <>
                         <div className="mb-3 col-md-10 col-lg-10">
                        <Form.Label className="">
                                    Description <span className="text-danger">*</span>
                                </Form.Label>
                                <CKEditor
                                    oonFocus={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    onBlur={(e) => handleSectionChange(e, "content")}
                                    onChange={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    onSelectionChange={(e) =>
                                        handleSectionChange(e, "content")
                                    }
                                    // initData={section.content}
                                />
                            </div>
                        
                        
                        </>
                        
                        
                        }

                    </div>
                    <Button
                        variant="primary"
                        disabled={pending}
                        className="shadow rounded"
                        type="submit"
                        block
                    >
                        Update
                    </Button>
                </Form>
            </div>

        </>
    )
}

export default PrivacyPolicy