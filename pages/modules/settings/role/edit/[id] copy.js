import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import Textarea from "react-expanding-textarea";
import { Button, Form, Label, TextInput } from "../../../../../components";
import ThemeContext from "../../../../../components/context/themeContext";
import Axios from "../../../../../utils/axios";

const AddRole = () => {
    const context = useContext(ThemeContext);
    const {userPermission} = context;

    const [permissions, setPermissions] = useState([]);
    console.log("permissions",permissions);
    /**For Tree Operation State */
    const [parentAccessCodes, setParentAccessCodes] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const router = useRouter();
    const {
        isReady,
        query: {
            id,
        }
    } = router;
    /**For Tree Operation State */

        //const {http} = getToken();
        const { notify } = MyToast();
    const {http} = Axios();

    const [role, setRole] = useState({
        title: "",
        description: "",
    });


    //fetch role permission info
    const fetchRolePermissionsInfo = useCallback(async () => {
        if (!isReady) {
            return;
        }

        let isSubscribed = true;

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {
            action: "getPermissionIdsByRoleId",
            role_id: id
        })
            .then((res) => {
                if (isSubscribed) {
                    let result = res.data.data;
                    setRole((prev) => ({...prev, title: result.role.title, description: result.role.description}));
                    setChecked(result.access_codes);
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')

            });

        return () => isSubscribed = false;

    }, [isReady, id]);

    useEffect(() => {
        fetchRolePermissionsInfo();
    }, [fetchRolePermissionsInfo])

    useEffect(() => {
        if (checked.length <= 0) {
            setChecked([]);
        }
    }, [checked.length])

    /**Permission Form Submission */
    async function submitFormPermission(e) {
        e.preventDefault();

        const res = await http.post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {
                ...role,
                action: "editRolePermission",
                role_id: id,
                access_codes: checked
            }).then((res) => {
                notify("success", "Role has been Created Successfully!");
                userPermission();
        }).catch((e) => {
            const msg = e.response?.data?.response;

            if (typeof e.response?.data?.response == "string") {
                notify("error", `${e.response.data.response}`);
            } else {
                if (msg?.title) {
                    notify("error", `Role title should not empty !`);
                }
                if (msg?.permission_ids) {
                    notify("error", `Check permissions !`);
                }
            }
        });
    }

    /**Getting Permissions */
    const getPermissions = async () => {
        await http
            .post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {action: "getAllPermissionNew",})
            .then((result) => {
                if (result.data.status === 'success') {
                    const resData = result.data.data;
                   
                    const accessPermissions = resData['accessPermissions'];

                    const pmsList = accessPermissions.map((item, index) => {
                        item['children'] = JSON.parse(item['children'])
                        return item;
                    })
                    
                    setPermissions(pmsList);
                }


            });
    };


    // Define state to track the initial selection
const [initialSelectionDone, setInitialSelectionDone] = useState(false);



const updateRoleCheckbox = (selectedCodes) => {
   

    const getAllChildNodes = (parentNode) => {
        let children = [];
        parentNode.children.forEach((childNode) => {
            children.push(childNode.value);
            if (childNode.children) {
                children = [...children, ...getAllChildNodes(childNode)];
            }
        });
        return children;
    };

    let updatedChecked = [...selectedCodes];
    let updatedExpanded = [...expanded];

    updatedChecked.forEach((code) => {
        const parentNode = permissions.find((node) => node.value === code);
        if (parentNode && parentNode.children) {
            parentNode.children.forEach((childNode) => {
                if (!updatedChecked.includes(childNode.value)) {
                    const index = updatedExpanded.indexOf(childNode.value);
                    if (index !== -1) {
                        updatedExpanded.splice(index, 1);
                    }
                }
            });
        }
    });

    setExpanded(updatedExpanded);
    if (!initialSelectionDone) {
        permissions.forEach(parentNode => {
            if (updatedChecked.includes(parentNode.value)) {
                const parentNodeChecked = getAllChildNodes(parentNode);
                updatedChecked = [...updatedChecked, ...parentNodeChecked];
            }
        });
        setInitialSelectionDone(true);
    }
    setChecked(updatedChecked);
};


    

    useEffect(() => {
        let isMount = true;
        if (isMount) {
            getPermissions();
        }
        return () => {
            isMount = false;
        };
    }, []);

    const changeHandler = (e) => {
        setRole((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <h4 className="card-title">Add Role</h4>
                            </div>

                            <Form onSubmit={submitFormPermission}>
                                <div className="card-body">
                                    <TextInput
                                        label="Title"
                                        placeholder="Title"
                                        defaultValue={role?.title}
                                        onChange={changeHandler}
                                        name="title"
                                        type="text"
                                    />

                                    <div className="mb-3 row">
                                        <Label text="Description"/>
                                        <div className="col-md-10">
                                            <Textarea
                                                className="textarea form-control"
                                                // defaultValue="Write Descriptions..."
                                                rows="3"
                                                id="my-textarea"
                                                defaultValue={role?.description}
                                                onChange={changeHandler}
                                                placeholder="Enter additional notes..."
                                                name="description"
                                            />
                                        </div>
                                    </div>


                                    <div className="mb-3 row">
                                        <Label text="Set Permissions"/>
                                        <div className="col-md-10 col-lg-3 col-sm-6">
                                            <CheckboxTree
                                                iconsClass="fa5"
                                                nodes={permissions}
                                                checked={checked}
                                                expanded={expanded}
                                                checkModel={`all`}
                                                noCascade={true}
                                                onCheck={(checked) => updateRoleCheckbox(checked)}
                                                onExpand={(expanded) => setExpanded(expanded)}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 border-top"></div>
                                    <div className="text-end">
                                        <Button className="btn-info">Save</Button>

                                        <Button className="btn-dark">Cancel</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AddRole;
