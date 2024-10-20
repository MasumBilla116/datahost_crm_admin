import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import MRIfileManagerRender from "../../../../../components/RenderMethods/MRIfileManagerRender";
import MRI_Single_Uploader from "../../../../../components/MRIfileManager/MRI_Single_Uploader";
import MRI_Uploader from "../../../../../components/MRIfileManager/MRI_Uploader";
import FileSelectButton from "../../../../../components/MRIfileManager/FileSelectButton";
import { CKEditor } from "ckeditor4-react";
import Axios from "../../../../../utils/axios";
import { useRouter } from "next/router";
import toast from "../../../../../components/Toast/index";
import { getSSRProps } from "../../../../../utils/getSSRProps";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

const Gallery = () => {
    const { http } = Axios();
    const router = useRouter();
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const [pending, setPending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);



    const [section1, setSection1] = useState({
        section1_title: "",
        upload_ids: [],
        upload_files: [],
        section1_isChecked: 1,
    });
console.log("section1",section1)

    const [section2, setSection2] = useState({
        section2_title: "",
        upload_ids: [],
        upload_files: [],
        section2_isChecked: 1,
    });



    const [section3, setSection3] = useState({
        section3_title: "",
        upload_ids: [],
        upload_files: [],
        section3_isChecked: 1,
    });


    const [section4, setSection4] = useState({
        section4_title: "",
        upload_ids: [],
        upload_files: [],
        section4_isChecked: 1,
    });



    const [section5, setSection5] = useState({
        section5_title: "",
        upload_ids: [],
        upload_files: [],
        section5_isChecked: 1,
    });




    const [section6, setSection6] = useState({
        section6_title: "",
        upload_ids: [],
        upload_files: [],
        section6_isChecked: 1,
    });



    const [section7, setSection7] = useState({
        section7_title: "",
        upload_ids: [],
        upload_files: [],
        section7_isChecked: 1,
    });




    const fetchSectionData = useCallback(async () => {
        let isSubscribed = true;
        setLoading(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/gallery`, {
                action: "getGalleryPageInfo",
            })
            .then((res) => {
                if (isSubscribed) {
                    setId(res?.data?.data?.id);


                    /***Section - 1 start */
                    setSection1((prev) => ({
                        ...prev,
                        section1_title: res?.data?.data?.section1_title,
                        section1_isChecked: res?.data?.data?.section1_isChecked,
                    }));

                    if (res.data.data?.section1_photos.length > 0) {
                        setSection1((prev) => ({
                            ...prev,
                            upload_ids: res?.data?.data?.section1_photos,
                            upload_files: res?.data?.data?.section1_uploadsData,
                        }));

                        setArrSection1(res?.data?.data?.section1_photos);
                        setFilesArrSection1(res?.data?.data?.section1_uploadsData);
                    }

                    /***Section - 1 end */



                    /***Section - 2 start */
                    setSection2((prev) => ({
                        ...prev,
                        section2_title: res?.data?.data?.section2_title,
                        section2_isChecked: res?.data?.data?.section2_isChecked,
                    }));

                    if (res.data.data?.section2_photos.length > 0) {
                        setSection2((prev) => ({
                            ...prev,
                            upload_ids: res?.data?.data?.section2_photos,
                            upload_files: res?.data?.data?.section2_uploadsData,
                        }));

                        setArrSection2(res.data.data?.section2_photos);
                        setFilesArrSection2(res.data?.data?.section2_uploadsData);
                    }

                    /***Section - 2 end */



                    /***Section - 3 start */
                    setSection3((prev) => ({
                        ...prev,
                        section3_title: res?.data?.data?.section3_title,
                        section3_isChecked: res?.data?.data?.section3_isChecked,
                    }));

                    if (res.data.data?.section3_photos.length > 0) {
                        setSection3((prev) => ({
                            ...prev,
                            upload_ids: res.data?.data?.section3_photos,
                            upload_files: res.data?.data?.section3_uploadsData,
                        }));

                        setArrSection3(res.data.data?.section3_photos);
                        setFilesArrSection3(res.data?.data?.section3_uploadsData);
                    }

                    /***Section - 3 end */




                    /***Section - 4 start */
                    setSection4((prev) => ({
                        ...prev,
                        section4_title: res?.data?.data?.section4_title,
                        section4_isChecked: res?.data?.data?.section4_isChecked,
                    }));

                    if (res.data.data?.section4_photos.length > 0) {
                        setSection4((prev) => ({
                            ...prev,
                            upload_ids: res.data?.data?.section4_photos,
                            upload_files: res.data?.data?.section4_uploadsData,
                        }));

                        setArrSection4(res.data.data?.section4_photos);
                        setFilesArrSection4(res.data?.data?.section4_uploadsData);
                    }

                    /***Section - 4 end */



                    /***Section - 5 start */
                    setSection5((prev) => ({
                        ...prev,
                        section5_title: res?.data?.data?.section5_title,
                        section5_isChecked: res?.data?.data?.section5_isChecked,
                    }));

                    if (res.data.data?.section5_photos.length > 0) {
                        setSection5((prev) => ({
                            ...prev,
                            upload_ids: res.data?.data?.section5_photos,
                            upload_files: res.data?.data?.section5_uploadsData,
                        }));

                        setArrSection5(res.data.data?.section5_photos);
                        setFilesArrSection5(res.data?.data?.section5_uploadsData);
                    }

                    /***Section - 5 end */



                    /***Section - 6 start */
                    setSection6((prev) => ({
                        ...prev,
                        section6_title: res?.data?.data?.section6_title,
                        section6_isChecked: res?.data?.data?.section6_isChecked,
                    }));

                    if (res.data.data?.section6_photos.length > 0) {
                        setSection6((prev) => ({
                            ...prev,
                            upload_ids: res.data?.data?.section6_photos,
                            upload_files: res.data?.data?.section6_uploadsData,
                        }));

                        setArrSection6(res.data.data?.section6_photos);
                        setFilesArrSection6(res.data?.data?.section6_uploadsData);
                    }

                    /***Section - 6 end */



                    /***Section - 7 start */
                    setSection7((prev) => ({
                        ...prev,
                        section7_title: res?.data?.data?.section7_title,
                        section7_isChecked: res?.data?.data?.section7_isChecked,
                    }));

                    if (res.data.data?.section7_photos.length > 0) {
                        setSection7((prev) => ({
                            ...prev,
                            upload_ids: res.data?.data?.section7_photos,
                            upload_files: res.data?.data?.section7_uploadsData,
                        }));

                        setArrSection7(res.data.data?.section7_photos);
                        setFilesArrSection7(res.data?.data?.section7_uploadsData);
                    }

                    /***Section - 7 end */

                    // }
                    setLoading(false);
                }
            })

            .catch((err) => {
                // console.log('Something went wrong !')
                setLoading(false);
            });

        return () => (isSubscribed = false);
    }, []);

    useEffect(() => {
        fetchSectionData();
    }, [fetchSectionData]);




    const handleSection1Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection1((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };



    const handleSection2Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection2((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };



    const handleSection3Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection3((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };


    const handleSection4Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection4((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };



    const handleSection5Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection5((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };



    const handleSection6Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection6((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };



    const handleSection7Change = (e, fieldName) => {
        const { name, value, type, checked } = e.target || {};
        const data = e.editor ? e.editor.getData() : null;

        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setSection7((prev) => ({
            ...prev,
            [name]: newValue,
            [fieldName]: data !== null ? data : prev[fieldName],
        }));
    };




    /***start File manager section - 1 */
    const [arrSection1, setArrSection1] = useState([]);
    const [filesArrSection1, setFilesArrSection1] = useState([]);
    const setFilesDataSection1 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection1.push(data[i]);
        }

        setSection1((prev) => ({
            ...prev,
            upload_files: filesArrSection1,
        }));
    };

    const setIdsSection1 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection1.push(Ids[i]);
        }

        setSection1((prev) => ({
            ...prev,
            upload_ids: arrSection1,
        }));
    };


    const removePhotoSection1 = (id) => {
        //Ids array remove
        let filtered = arrSection1.filter(function (item) {
            return item != id;
        });

        setArrSection1(filtered);

        setSection1(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection1.filter((item) => item.id !== id);
        setFilesArrSection1(newList);

        setSection1(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 1 */



    /***start File manager section - 2 */
    const [arrSection2, setArrSection2] = useState([]);
    const [filesArrSection2, setFilesArrSection2] = useState([]);
    const setFilesDataSection2 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection2.push(data[i]);
        }

        setSection2((prev) => ({
            ...prev,
            upload_files: filesArrSection2,
        }));
    };

    const setIdsSection2 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection2.push(Ids[i]);
        }

        setSection2((prev) => ({
            ...prev,
            upload_ids: arrSection2,
        }));
    };


    const removePhotoSection2 = (id) => {
        //Ids array remove
        let filtered = arrSection2.filter(function (item) {
            return item != id;
        });

        setArrSection2(filtered);

        setSection2(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection2.filter((item) => item.id !== id);
        setFilesArrSection2(newList);

        setSection2(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 2 */






    /***start File manager section - 3 */
    const [arrSection3, setArrSection3] = useState([]);
    const [filesArrSection3, setFilesArrSection3] = useState([]);
    const setFilesDataSection3 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection3.push(data[i]);
        }

        setSection3((prev) => ({
            ...prev,
            upload_files: filesArrSection3,
        }));
    };

    const setIdsSection3 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection3.push(Ids[i]);
        }

        setSection3((prev) => ({
            ...prev,
            upload_ids: arrSection3,
        }));
    };


    const removePhotoSection3 = (id) => {
        //Ids array remove
        let filtered = arrSection3.filter(function (item) {
            return item != id;
        });

        setArrSection3(filtered);

        setSection3(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection3.filter((item) => item.id !== id);
        setFilesArrSection3(newList);

        setSection3(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 3 */





    /***start File manager section - 4 */
    const [arrSection4, setArrSection4] = useState([]);
    const [filesArrSection4, setFilesArrSection4] = useState([]);
    const setFilesDataSection4 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection4.push(data[i]);
        }

        setSection4((prev) => ({
            ...prev,
            upload_files: filesArrSection4,
        }));
    };

    const setIdsSection4 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection4.push(Ids[i]);
        }

        setSection4((prev) => ({
            ...prev,
            upload_ids: arrSection4,
        }));
    };


    const removePhotoSection4 = (id) => {
        //Ids array remove
        let filtered = arrSection4.filter(function (item) {
            return item != id;
        });

        setArrSection4(filtered);

        setSection4(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection4.filter((item) => item.id !== id);
        setFilesArrSection4(newList);

        setSection4(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 4 */





    /***start File manager section - 5 */
    const [arrSection5, setArrSection5] = useState([]);
    const [filesArrSection5, setFilesArrSection5] = useState([]);
    const setFilesDataSection5 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection5.push(data[i]);
        }

        setSection5((prev) => ({
            ...prev,
            upload_files: filesArrSection5,
        }));
    };

    const setIdsSection5 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection5.push(Ids[i]);
        }

        setSection5((prev) => ({
            ...prev,
            upload_ids: arrSection5,
        }));
    };


    const removePhotoSection5 = (id) => {
        //Ids array remove
        let filtered = arrSection5.filter(function (item) {
            return item != id;
        });

        setArrSection5(filtered);

        setSection5(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection5.filter((item) => item.id !== id);
        setFilesArrSection5(newList);

        setSection5(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 5 */


    /***start File manager section - 6 */
    const [arrSection6, setArrSection6] = useState([]);
    const [filesArrSection6, setFilesArrSection6] = useState([]);
    const setFilesDataSection6 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection6.push(data[i]);
        }

        setSection6((prev) => ({
            ...prev,
            upload_files: filesArrSection6,
        }));
    };

    const setIdsSection6 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection6.push(Ids[i]);
        }

        setSection6((prev) => ({
            ...prev,
            upload_ids: arrSection6,
        }));
    };


    const removePhotoSection6 = (id) => {
        //Ids array remove
        let filtered = arrSection6.filter(function (item) {
            return item != id;
        });

        setArrSection6(filtered);

        setSection6(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection6.filter((item) => item.id !== id);
        setFilesArrSection6(newList);

        setSection6(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 6 */



    /***start File manager section - 7 */
    const [arrSection7, setArrSection7] = useState([]);
    const [filesArrSection7, setFilesArrSection7] = useState([]);
    const setFilesDataSection7 = (data) => {
        for (let i = 0; i < data.length; i++) {
            filesArrSection7.push(data[i]);
        }

        setSection7((prev) => ({
            ...prev,
            upload_files: filesArrSection7,
        }));
    };

    const setIdsSection7 = (Ids) => {
        for (let i = 0; i < Ids.length; i++) {
            arrSection7.push(Ids[i]);
        }

        setSection7((prev) => ({
            ...prev,
            upload_ids: arrSection7,
        }));
    };


    const removePhotoSection7 = (id) => {
        //Ids array remove
        let filtered = arrSection7.filter(function (item) {
            return item != id;
        });

        setArrSection7(filtered);

        setSection7(prev => ({
            ...prev, upload_ids: filtered
        }))

        //remove files array of objects
        const newList = filesArrSection7.filter((item) => item.id !== id);
        setFilesArrSection7(newList);

        setSection7(prev => ({
            ...prev, upload_files: newList
        }))
    };
    /***End File manager section - 7 */


    // submit handler
    const onUpload = async (e) => {
        e.preventDefault();

        const data = new FormData();
        // console.log(data);
        let body = {
            action: "createGalleryPage",
            id:id,
            section1_title: section1.section1_title,
            section1_upload_ids: section1.upload_ids,
            section1_upload_files: section1.upload_files,
            section1_isChecked: section1.section1_isChecked,

            section2_title: section2.section2_title,
            section2_upload_ids: section2.upload_ids,
            section2_upload_files: section2.upload_files,
            section2_isChecked: section2.section2_isChecked,


            section3_title: section3.section3_title,
            section3_upload_ids: section3.upload_ids,
            section3_upload_files: section3.upload_files,
            section3_isChecked: section3.section3_isChecked,


            section4_title: section4.section4_title,
            section4_upload_ids: section4.upload_ids,
            section4_upload_files: section4.upload_files,
            section4_isChecked: section4.section4_isChecked,



            section5_title: section5.section5_title,
            section5_upload_ids: section5.upload_ids,
            section5_upload_files: section5.upload_files,
            section5_isChecked: section5.section5_isChecked,



            section6_title: section6.section6_title,
            section6_upload_ids: section6.upload_ids,
            section6_upload_files: section6.upload_files,
            section6_isChecked: section6.section6_isChecked,



            section7_title: section7.section7_title,
            section7_upload_ids: section7.upload_ids,
            section7_upload_files: section7.upload_files,
            section7_isChecked: section7.section7_isChecked,


        };



        let isSubscribed = true;
        setPending(true);
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/gallery`, body)
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
    };

    return (
        <>
            <div className="card shadow p-3">
                <Form onSubmit={onUpload}>





                    <hr />

                    <h5 className="text-info mt-4">Section 1</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section1_title"
                                onChange={handleSection1Change}
                                defaultValue={section1.section1_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection1}
                                setFilesData={setFilesDataSection1}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section1}
                                            removePhoto={removePhotoSection1}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section1_isChecked"
                                onChange={handleSection1Change}
                                checked={section1.section1_isChecked === 1}
                                defaultChecked={section1.section1_isChecked}
                            />
                        </div>
                    </div>



                    <hr />

                    <h5 className="text-info mt-4">Section 2</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section2_title"
                                onChange={handleSection2Change}
                                defaultValue={section2.section2_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection2}
                                setFilesData={setFilesDataSection2}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section2}
                                            removePhoto={removePhotoSection2}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section2_isChecked"
                                onChange={handleSection2Change}
                                checked={section2.section2_isChecked === 1}
                                defaultChecked={section2.section2_isChecked}
                            />
                        </div>
                    </div>

                    <hr />
                    <h5 className="text-info mt-4">Section 3</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section3_title"
                                onChange={handleSection3Change}
                                defaultValue={section3.section3_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection3}
                                setFilesData={setFilesDataSection3}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section3}
                                            removePhoto={removePhotoSection3}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section3_isChecked"
                                onChange={handleSection3Change}
                                checked={section3.section3_isChecked === 1}
                                defaultChecked={section3.section3_isChecked}
                            />
                        </div>
                    </div>

                    <hr />
                    <h5 className="text-info mt-4">Section 4</h5>

                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section4_title"
                                onChange={handleSection4Change}
                                defaultValue={section4.section4_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection4}
                                setFilesData={setFilesDataSection4}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section4}
                                            removePhoto={removePhotoSection4}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section4_isChecked"
                                onChange={handleSection4Change}
                                checked={section4.section4_isChecked === 1}
                                defaultChecked={section4.section4_isChecked}
                            />
                        </div>
                    </div>





                    <hr />
                    <h5 className="text-info mt-4">Section 5</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section5_title"
                                onChange={handleSection5Change}
                                defaultValue={section5.section5_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection5}
                                setFilesData={setFilesDataSection5}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section5}
                                            removePhoto={removePhotoSection5}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section5_isChecked"
                                onChange={handleSection5Change}
                                checked={section5.section5_isChecked === 1}
                                defaultChecked={section5.section5_isChecked}
                            />
                        </div>
                    </div>


                    <hr />
                    <h5 className="text-info mt-4">Section 6</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section6_title"
                                onChange={handleSection6Change}
                                defaultValue={section6.section6_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection6}
                                setFilesData={setFilesDataSection6}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section6}
                                            removePhoto={removePhotoSection6}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section6_isChecked"
                                onChange={handleSection6Change}
                                checked={section6.section6_isChecked === 1}
                                defaultChecked={section6.section6_isChecked}
                            />
                        </div>
                    </div>


                    <hr />
                    <h5 className="text-info mt-4">Section 7</h5>
                    <div className="row room-form-border">
                        <div className="mb-3 col-md-8 col-lg-8">
                            <Form.Label className="">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                name="section7_title"
                                onChange={handleSection7Change}
                                defaultValue={section7.section7_title}
                            />
                        </div>

                        <div className="mb-3 col-md-4 col-lg-4">
                            <MRIfileManagerRender
                                setIds={setIdsSection7}
                                setFilesData={setFilesDataSection7}
                                render={(
                                    show,
                                    handleClose,
                                    uploadIds,
                                    selecteLoading,
                                    handleShow,
                                    files
                                ) => (
                                    <>
                                        {/* MRI_Uploader Modal Form */}
                                        <Modal
                                            dialogClassName="modal-xlg"
                                            show={show}
                                            onHide={handleClose}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>File Uploader</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <MRI_Uploader
                                                    onSubmitUploads={uploadIds}
                                                    selectLoading={selecteLoading}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer></Modal.Footer>
                                        </Modal>
                                        {/* End MRI_Uploader Modal Form */}

                                        {/* Choose File Button */}
                                        <FileSelectButton
                                            handleShow={handleShow}
                                            files={section7}
                                            removePhoto={removePhotoSection7}
                                        />
                                        {/* End choose file button */}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-3 col-md-5 col-lg-5">
                            <Form.Check
                                type="checkbox"
                                label="Check me"
                                name="section7_isChecked"
                                onChange={handleSection7Change}
                                checked={section7.section7_isChecked === 1}
                                defaultChecked={section7.section7_isChecked}
                            />
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        disabled={pending}
                        className="shadow rounded"
                        type="submit"
                        block
                    >
                        upload
                    </Button>
                </Form>

            </div>
        </>
    );
};

export default Gallery;
