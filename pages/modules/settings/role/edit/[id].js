import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyToast from "@mdrakibul8001/toastify";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import Textarea from "react-expanding-textarea";
import { Button, Form, Label, TextInput } from "../../../../../components";
import ThemeContext from "../../../../../components/context/themeContext";
import Axios from "../../../../../utils/axios";
const AddRole = () => {
    const context = useContext(ThemeContext);
    const { userPermission } = context;


    const [permissionsList, setPermissionsList] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const router = useRouter();
    const { isReady, query: { id } } = router;

    const { notify } = MyToast();
    const { http } = Axios();

    const [openModule, setOpenModule] = useState(null);
    const [hoveredGuest, setHoveredGuest] = useState(null);
    const [reservationModal, setReservationModal] = useState(false);

    const [role, setRole] = useState({
        title: "",
        description: "",
    });



    /**Getting Permissions */
    const getPermissions = async () => {
        await http
            .post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, { action: "getAllPermissionNew", })
            .then((result) => {
                if (result.data.status === 'success') {
                    const resData = result.data.data;
                    const accessPermissions = resData['accessPermissions'];

                    const pmsList = accessPermissions.map((item, index) => {
                        item['children'] = JSON.parse(item['children'])
                        item['children'].unshift({ id: item['id'], label: `${item['label']} DASHBOARD`, value: item['value'] })
                        return item;
                    })

                    setPermissionsList(pmsList);
                }


            });
    };

    useEffect(() => {
        getPermissions();
    }, []);


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
                       
                        setSelectedPermissions(result.access_codes)
                        setRole((prev) => ({...prev, title: result.role.title, description: result.role.description}));
                        // setChecked(result.access_codes);
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



    const changeHandler = (e) => {
        setRole((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };



    const updateByParent = (e, selectType, moduleItem) => {
        e.preventDefault();

        let selectedPerms = [...selectedPermissions];

        const mItemIndex = selectedPerms.indexOf(moduleItem['value']);
        if (selectType === 'select' && mItemIndex === -1) {
            selectedPerms.push(moduleItem['value'])
        } else if (selectType === 'unselect' && mItemIndex !== -1) {
            selectedPerms.splice(mItemIndex, 1)
        }


        moduleItem['children'].forEach((item) => {
            const itemIndex = selectedPerms.indexOf(item['value']);
            if (selectType === 'select' && itemIndex === -1) {
                selectedPerms.push(item['value'])
            } else if (selectType === 'unselect' && itemIndex !== -1) {
                selectedPerms.splice(itemIndex, 1)
            }
        })



        setSelectedPermissions(selectedPerms)

    }






    const updateByChildren = (e, moduleValue, childItem) => {
        e.preventDefault();

        let selectedPerms = [...selectedPermissions];

        if (selectedPerms.indexOf(childItem['value']) === -1) {
            selectedPerms.push(childItem['value'])
        } else {
            const cItemIndex = selectedPerms.indexOf(childItem['value']);
            selectedPerms.splice(cItemIndex, 1)
        }
        
        setSelectedPermissions(selectedPerms)

    }


    async function submitFormPermission(e) {
        e.preventDefault();

        const res = await http.post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {
                ...role,
                action: "editRolePermission",
                role_id: id,
                access_codes: selectedPermissions
            }).then((res) => {
                notify("success", "Role has been Created Successfully!");
                router.push(`/modules/settings/role/all-roles`)
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
                                        <Label text="Description" />
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
                                        <Label text="Set Permissions" />
                                        <div className="col-12">
                                            <div className="border p-2">
                                                {permissionsList.map((moduleItem, index) => (
                                                    <div key={moduleItem['value']}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                border: "1px solid #ddd",
                                                                marginTop: index !== 0 ? "4px" : "0",
                                                                cursor: "pointer",
                                                                borderRadius: openModule === index ? '5px 5px 0 0' : '5px',
                                                                backgroundColor: "#f9f9f9",
                                                                padding: '0 10px'
                                                            }}
                                                            onClick={() =>
                                                                setOpenModule(
                                                                    openModule === index ? null : index
                                                                )
                                                            }
                                                            onMouseEnter={() => setHoveredGuest(index)}
                                                            onMouseLeave={() => setHoveredGuest(null)}

                                                        >

                                                            <div className="d-flex justify-content-start align-items-center" style={{ height: '40px', padding: '4 px 10px 0', fontWeight: openModule === index ? 'bold' : 'normal', fontSize: '18px', marginBottom: '0' }}>{moduleItem['label']} MODULE</div>
                                                            <FontAwesomeIcon icon={faAngleDown} />

                                                        </div>
                                                        <Collapse in={openModule === index}>
                                                            <div>

                                                                <div className="d-flex p-1" style={{ backgroundColor: '#eee' }}>
                                                                    <span onClick={e => updateByParent(e, 'select', moduleItem)} className="cursor-pointer" style={{ fontSize: '12px', backgroundColor: '#fff', border: '1px solid #ddd', padding: '1px 5px 0' }}>Select All</span>
                                                                    <span style={{ width: '10px' }}></span>
                                                                    <span onClick={e => updateByParent(e, 'unselect', moduleItem)} className="cursor-pointer" style={{ fontSize: '12px', backgroundColor: '#fff', border: '1px solid #ddd', padding: '1px 5px 0' }}>Un-Select All</span>
                                                                </div>
                                                                <div className="row p-2">
                                                                    {
                                                                        moduleItem.children.map((item) => (

                                                                            <div key={item['value']} className="col-2">
                                                                                <div onClick={e => updateByChildren(e, moduleItem['value'], item)} className="d-flex justify-content-start align-items-center mb-1">
                                                                                    <label htmlFor={`itm-${item['value']}`} style={{ fontSize: '12px', marginBottom: '0' }}><input id={`itm-${item['value']}`} type="checkbox" checked={selectedPermissions.indexOf(item['value']) >= 0} /> {item['label']}</label>
                                                                                </div>
                                                                            </div>

                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                ))
                                                }
                                            </div>
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
