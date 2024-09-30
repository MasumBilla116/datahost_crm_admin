import React, { Fragment, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";
import { useRouter } from 'next/router';
import lodash from 'lodash';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import Link from 'next/link';

//MUI
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

//local
import Axios from '../../../../../utils/axios';
import MyToast from "@mdrakibul8001/toastify"
import PropagateLoading from '../../../../../components/PropagateLoading';
import { Label, Select2, HeadSection, EditIcon, DeleteIcon } from '../../../../../components';
import Breadcrumbs from "../../../../../components/Breadcrumbs";

//boilerplate
const initialItem: { item_name: string, size: string, type: string, description: string } = {
    item_name: "",
    size: "",
    type: "",
    description: ""
}
const initialLoading: { loading: boolean, loading2Locker: boolean, loading3Guest: boolean } = {
    loading: false,
    loading2Locker: false,
    loading3Guest: false
}

function LockerUpdate() {

    //loading
    const [state, setState] = useState(initialLoading)

    //state declaration
    const [guests, setGuests]: any = useState([]);
    const [luggage, setLuggage]: any = useState([]);
    const [lockers, setLockers]: any = useState([]);
    const [items, setItems]: any = useState(initialItem);

    const [lockerInfo, setLockerInfo]: any = useState({});
    const [lockerDetails, setLockerDetails]: any = useState([]);

    const [guestDetails, setGuestDetails]: any = useState([]);
    const [itemsUpdate, setItemsUpdate]: any = useState(initialItem);

    const [key, setKey]: any = useState("");
    const [index, setIndex] = useState<number>();
    const [update, setUpdate] = useState<boolean>(false);

    const [pickupOpen, setPickupOpen] = useState<boolean>(false)
    const [pickup2Open, setPickup2Open] = useState<boolean>(false)

    const { http } = Axios();
    const router = useRouter();
    const { notify } = MyToast();
    const { isReady, query: { id } } = router;

    const [guestName, setGuestName] = useState<string>("");
    const [lockerDefault, setLockerDefault]: any = useState("")

    //get locker info By ID
    useEffect(() => {
        const controller = new AbortController()

        const lockerEntryInfoByID = async () => {
            let body: any = {
                action: "lockerEntryInfoByID",
                id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/entry`, body)
                .then((res: any) => {
                    const lockers = res?.data?.data;
                    setGuestName(GenerateName(lockers?.customer?.title, lockers?.customer?.first_name, lockers?.customer?.last_name))
                    // setGuestName((lockers?.customer?.title, lockers?.customer?.first_name, lockers?.customer?.last_name))
                    setLuggage(!!lockers?.luggages?.length && lockers?.luggages?.filter((luggage: { status: number; }) => { return luggage?.status === 1 }));
                    setLockerDefault(!!lockers?.lockers.length && lockers?.lockers?.map((locker: any) => { return ({ value: locker?.id, label: locker?.serial }) }))
                    setLockerInfo({ ...lockers, locker_id: (!!lockers?.lockers && lockers?.lockers?.map((locker: any) => { return (locker?.id) })), pickup_time: lockers?.time })
                })
                .catch((err: any) => { console.log(err) })
        }

        isReady && lockerEntryInfoByID();

        return () => controller.abort();
    }, [isReady, id])

    const addItems = async (e: any) => {
        e.preventDefault()
        if (items?.item_name) {
            let currentItem: string = items?.item_name;
            if (!!luggage?.length) {
                const duplicateItems: any = luggage.filter((item: any) => item?.item_name === currentItem)
                if (!!duplicateItems?.length) {
                    notify("error", items?.item_name + ` Already exists!`)
                }
                else {
                    addLuggage()
                }
            }
            else {
                addLuggage()
            }
        }
    }

    const [newLuggage, setNewLuggage] = useState([]);
    const addLuggage = () => {
        setLuggage([...luggage, items])
        setItems(initialItem)
        setLockerInfo({ ...lockerInfo, luggage: [...luggage, items] })
        setNewLuggage([...newLuggage, items]);
        notify("success", `Luggage added to the locker!`)
    }

    useEffect(() => {
        let controller = new AbortController();

        const getAllLocker = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, { action: "getAllLocker" })
                .then((res: any) => {
                    const lockers = res?.data?.data;
                    const locker_options = [];
                    !!lockers.length && lockers.map((locker: any) => {
                        if (locker?.availability === 'available' && locker?.status === 1) {
                            return (
                                locker_options.push({
                                    label: locker?.serial,
                                    value: locker?.id
                                })
                            )
                        }
                    })
                    setLockers(locker_options);
                })
                .catch((err: any) => { console.log(err) })
        }
        getAllLocker()

        return () => controller.abort();
    }, [])

    useEffect(() => {
        const controller = new AbortController()

        setState({ ...state, loading: true })

        const customSearch = async () => {
            let body: any = {
                action: "customSearch",
                key
            }
            // if (key && key?.length > 2) {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`, body)
                .then((res: any) => {
                    const customers = res?.data?.data;
                    setGuests(customers || []);
                    setState({ ...state, loading: false })
                })
                .catch((err: any) => { console.log(err) })
            // }
            // else {
            //     !key && setState({ ...state, loading: false })
            //     setGuests([])
            // }
        }

        customSearch()
        return () => controller.abort();

    }, [key])


    useEffect(() => {
        const controller = new AbortController()
        // console.log(lockerInfo?.locker_id)

        if (lockerInfo?.locker_id && !!lockerInfo?.locker_id.length) {
            setState({ ...state, loading2Locker: true })

            //fetch locker By Id
            const getallLockerByID = async () => {
                let body: any = {}
                body = {
                    action: "getLockerByIDs",
                    id: lockerInfo?.locker_id && lockerInfo?.locker_id
                }
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`,
                    body
                ).then((res: any) => {
                    const lock = res?.data?.data;
                    !!lock.length && setLockerDetails(lock)
                    setState({ ...state, loading2Locker: false })
                })
                    .catch((err: any) => {
                        console.log(err);
                    })
            }
            lockerInfo?.locker_id && getallLockerByID()
        }
        else {
            setLockerDetails([])
        }

        return () => controller.abort();
    }, [lockerInfo?.locker_id])

    useEffect(() => {
        const controller = new AbortController()

        //fetch guest info
        const customerInfoByID = async () => {
            setState({ ...state, loading3Guest: true })

            let body: any = {}
            body = {
                action: "customerInfoByID",
                id: lockerInfo?.guest_id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers`,
                body
            ).then((res: any) => {
                const customer = res?.data?.data;
                !!customer?.length &&
                    setGuestDetails(customer)
                setState({ ...state, loading3Guest: false })

            }).catch((err: any) => {
                console.log(err);
            })
        }
        lockerInfo?.guest_id ? customerInfoByID() : setGuestDetails([])

        return () => controller.abort();
    }, [lockerInfo?.guest_id])

    const onsubmit = async (e: any) => {
        e.preventDefault()
        if (!lockerInfo?.guest_id) {
            notify("error", "Please enter guest name")
        }
        else if (!lockerInfo?.locker_id) {
            notify("error", "Please locker serial")
        }
        else if (!lockerInfo?.pickup_date) {
            notify("error", "Please pickup date")
        }
        else {
            const updatedLocker = { ...lockerInfo, luggage, newLuggage, deletedLuggage }
            let body: any = {
                ...updatedLocker,
                // token: generateToken(),
                action: "lockerUpdateByID",
                id,
            }
            const lockerUpdate = async () => {
                await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker/entry`, body)
                    .then((res: any) => {
                        const locker = res?.data?.data;
                        router.push(`/modules/locker/customers`)
                        notify("success", "Locker update successfull!")

                    })
                    .catch((err: any) => { console.log(err) })
            }
            lockerUpdate()
        }
    }

    //Generating locker token
    const generateToken = () => {

        var today: any = new Date();
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy: any = today.getFullYear().toString().slice(-2);
        var dd: any = today.getDate().toString();
        today = yyyy + mm + dd;
        let lockerID: any = "";

        if (!!lockerInfo?.locker_id.length) {
            lockerInfo?.locker_id.map((id: any) => {
                return lockerID += id;
            })
        }
        let token: any = `LCT-${today}-${String(lockerID || lockerInfo?.locker_id).padStart(6, '0')}`;
        return token
    }

    const GenerateName = (title: String, middle: String, last: String) => {
        if (title && middle && last) {
            return title + " " + middle + " " + last
        }
        else if (middle && last) {
            return middle + " " + last
        }
        else if (title && middle) {
            return title + " " + middle
        }
        else if (middle) {
            return "Mr " + middle
        }
    }

    const editItems = (index: number) => {
        setIndex(index);
        setUpdate(true)
        setItemsUpdate(luggage[index])
    }

    const updateItems = (e: any) => {
        e.preventDefault();
        let existingitem: any = [];
        if (!!luggage.length) {
            existingitem = luggage.filter(each => each?.item_name === itemsUpdate?.item_name)
        }
        if (!!existingitem?.length) {
            if (existingitem[0]?.item_name === luggage[index]?.item_name) {
                updateLuggage()
            }
            else {

                notify("error", itemsUpdate?.item_name + ` Already exists!`)
            }
        }
        else {
            updateLuggage()
        }
    }

    const updateLuggage = () => {
        let val1 = itemsUpdate;
        let val2 = luggage[index];

        // Checking for equal luggage 
        if (lodash.isEqual(val1, val2)) {
            notify("error", `No update done!`)
        }
        else {
            const luggageNew = luggage.map((item: any, ind: any) => {
                if (index === ind) {
                    return {
                        ...item,
                        item_name: itemsUpdate?.item_name,
                        size: itemsUpdate?.size,
                        type: itemsUpdate?.type,
                        description: itemsUpdate?.description,
                    }
                }
                else {
                    return {
                        ...item
                    }
                }
            })
            setLuggage(luggageNew)
            setItems(initialItem)
            setItemsUpdate(initialItem)
            setUpdate(false)
            setIndex(-1);
            notify("success", "Luggage updated successfully!")
        }
    }

    const [deletedLuggage, setDeletedLuggage] = useState([])
    const deleteItems = (items: any, ind: number) => {
        if (luggage?.length === 1) {
            notify("error", ` Luggage must not be empty!`)
        }
        else {
            setDeletedLuggage([...deletedLuggage, luggage[ind]])

            if (newLuggage?.length) {
                setNewLuggage(newLuggage.filter(lugg => { return lugg?.item_name !== luggage[ind]?.item_name }))
            }

            luggage.splice(ind, 1);
            notify("success", items?.item_name + ` Deleted successfully!`)
        }

    }

    const { pathname } = router;

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Locker Entry', link: '/modules/locker/entry' },
        { text: 'Edit Entry', link: '/modules/locker/entry/update/[id]' },
    ]

    return (
        <Fragment>
            <div className="container-fluid">
                <HeadSection title="Locker Enry" />
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow p-3 pb-5">
                            <h5 className="p-3 border-bottom fw-bolder">Locker Entry</h5>
                            <div className="row p-3">

                                <div className="col-lg-6">
                                    <h6 className="col-sm-11 col-lg-11 col-md-11 py-2 border-bottom text-info mb-5">Guest Info</h6>
                                    {/* {guestName ? <div className="mb-2 row">
                                        <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Select Guest" />
                                        <div className="col-sm-8 col-lg-8 col-md-8">
                                            < Select2
                                                isSearchable
                                                isLoading={state?.loading}
                                                isClearable
                                                defaultValue={{ value: "", label: guestName }}
                                                options={guests && guests.map(({ id, first_name, last_name, title, mobile }) => ({ value: id, label: GenerateName(title, first_name, last_name) + ", " + "phone: " + mobile }))}
                                                onChange={(e: any) => { setLockerInfo({ ...lockerInfo, guest_id: e?.value }); }}
                                                onInputChange={(e: any) => setKey(e)}
                                            />
                                        </div>
                                    </div> :
                                        <div className='text-center mb-2 ps-5 py-2 pb-3'>
                                            <PropagateLoading />
                                        </div>} */}
                                    {/* <div className="mb-2 row">
                                        <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Select Guest" />
                                        <div className="col-sm-8 col-lg-8 col-md-8">
                                            < Select2
                                                isSearchable
                                                isLoading={state?.loading}
                                                isClearable
                                                defaultValue={{ value: "", label: guestName }}
                                                options={guests && guests.map(({ id, first_name, last_name, title, mobile }) => ({ value: id, label: GenerateName(title, first_name, last_name) + ", " + "phone: " + mobile }))}
                                                onChange={(e: any) => { setLockerInfo({ ...lockerInfo, guest_id: e?.value }); }}
                                                onInputChange={(e: any) => setKey(e)}
                                            />
                                        </div>
                                    </div> */}

                                    {!state?.loading3Guest ? !!guestDetails.length && guestDetails.map((guest: any, index: number) => {
                                        return (

                                            <div className="row">

                                                <div className="col-sm-12 col-lg-12 col-md-12" key={index}>

                                                    {/* <div
                                                        className=" "
                                                        style={{
                                                            fontSize: "12px",
                                                            marginTop: "5px",
                                                            padding: "0px 5px",
                                                            background: "#eee",
                                                        }}
                                                    >

                                                        <span className="text-dark fw-bold">Name:{" "}</span>{" "}
                                                        <span className=" fw-bold">{guest?.title + " " + guest?.first_name + " " + guest?.last_name} ,</span>{" "}
                                                        &nbsp;<span className="text-dark fw-bold">Phone:{" "}</span>
                                                        <span className=" fw-bold">{guest?.mobile} ,</span>{" "}&nbsp;
                                                        <span className="text-dark fw-bold"> Gander:{" "}</span>
                                                        <span className=" fw-bold">{guest?.gender}</span>{" "}&nbsp;
                                                        <span className="text-dark fw-bold">Address:{" "}</span>
                                                        <span className=" fw-bold">{guest?.address}</span>{" "}&nbsp;</div> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                        : state?.loading3Guest &&
                                        <div className='text-center mb-2 ps-5 py-2 pb-3'>
                                            {/* <PropagateLoading /> */}
                                        </div>}

                                    {lockerDefault && <div className="row mb-3">
                                        <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Select Locker" />
                                        <div className="col-sm-8 col-lg-8 col-md-8 ">
                                            <Select2
                                                options={lockers}
                                                defaultValue={lockerDefault}
                                                isMulti
                                                onChange={(e: any) => setLockerInfo({ ...lockerInfo, locker_id: Array.isArray(e) && !!e?.length && e.map(x => x.value) })}
                                            />
                                        </div>
                                    </div>}

                                    {/* {!state?.loading2Locker ? !!lockerDetails.length && lockerDetails.map((locker: any, index: number) => {
                                        return (
                                            !!locker?.length && locker.map((lock: any) => {
                                                return (
                                                    <div className='col-sm-8 col-lg-6 col-md-8 m-auto' key={index}>
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Serial: </span>{lock?.serial}</span>&nbsp;
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Type: </span>{lock?.type}</span>&nbsp;
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Size: </span>{lock?.size}</span>&nbsp;
                                                    </div>
                                                )
                                            })

                                        )
                                    })
                                        : state?.loading2Locker &&
                                        <div className='text-center mb-2 ps-5 py-2 pb-3'>
                                            <PropagateLoading />
                                        </div>} */}

                                    {update ?
                                        <div>
                                            <h6 className="col-sm-11 col-lg-11 col-md-11 py-2 border-bottom text-info mb-5">Update Luggage</h6>
                                            <form onSubmit={updateItems}>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage details" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input placeholder="Items"
                                                            type="text" name="item_name"
                                                            className="form-control"
                                                            value={itemsUpdate?.item_name}
                                                            onChange={(e: any) => setItemsUpdate({ ...itemsUpdate, item_name: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage size" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input type="radio" className="btn-check" name="size" id="size1" autoComplete="off" checked={itemsUpdate?.size === "Small"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, size: "Small" })} />
                                                        <label className="btn btn-outline-primary rounded-pill font-weight-medium fs-3" htmlFor="size1" >Small</label>

                                                        <input type="radio" className="btn-check" name="options" id="size2" autoComplete="off" checked={itemsUpdate?.size === "Medium"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, size: "Medium" })} />
                                                        <label className="btn btn-outline-info rounded-pill font-weight-medium fs-3 ms-2" htmlFor="size2" >Medium</label>

                                                        <input type="radio" className="btn-check" name="options" id="size3" autoComplete="off" checked={itemsUpdate?.size === "Large"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, size: "Large" })} />
                                                        <label className="btn btn-outline-warning rounded-pill font-weight-medium fs-3 ms-2" htmlFor="size3" >Large</label>

                                                        <input type="radio" className="btn-check" name="options" id="size4" autoComplete="off" checked={itemsUpdate?.size === "Extra Large"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, size: "Extra Large" })} />
                                                        <label className="btn btn-outline-danger rounded-pill font-weight-medium fs-3 ms-2" htmlFor="size4" >Extra Large</label>
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage type" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input type="radio" className="btn-check" name="type" id="type1" autoComplete="off" checked={itemsUpdate?.type === "General"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, type: "General" })} />
                                                        <label className="btn btn-outline-primary rounded-pill font-weight-medium fs-3" htmlFor="type1">General</label>

                                                        <input type="radio" className="btn-check" name="type" id="type2" autoComplete="off" checked={itemsUpdate?.type === "Sensitive"} onClick={(e) => setItemsUpdate({ ...itemsUpdate, type: "Sensitive" })} />
                                                        <label className="btn btn-outline-danger rounded-pill font-weight-medium fs-3 ms-2" htmlFor="type2">Sensitive</label>

                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage remarks" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <textarea placeholder="Description" className="form-control" value={itemsUpdate?.description || 'sample item'} onChange={(e: any) => setItemsUpdate({ ...itemsUpdate, description: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8 d-flex">
                                                        <div> <Button className="text-dark px-3" variant="danger" type="submit" onClick={() => { setUpdate(false); setIndex(-1) }}>Discard</Button></div>
                                                        <div><Button className="text-dark px-3 ms-2" variant="info" type="submit" disabled={!itemsUpdate?.item_name || !itemsUpdate?.size || !itemsUpdate?.type}>Update Items</Button></div>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                        :
                                        <div>
                                            <h6 className="col-sm-11 col-lg-11 col-md-11 py-2 border-bottom text-info mb-5">Add Luggage</h6>
                                            <form onSubmit={addItems}>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage details" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input placeholder="Items"
                                                            type="text" name="item_name"
                                                            className="form-control"
                                                            value={items?.item_name}
                                                            onChange={(e: any) => setItems({ ...items, item_name: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage size" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input type="radio" className="btn-check" name="options" id="option1" autoComplete="off" checked={items?.size === "Small"} onClick={(e) => setItems({ ...items, size: "Small" })} />
                                                        <label className="btn btn-outline-primary rounded-pill font-weight-medium fs-3" htmlFor="option1" >Small</label>

                                                        <input type="radio" className="btn-check" name="options" id="option2" autoComplete="off" checked={items?.size === "Medium"} onClick={(e) => setItems({ ...items, size: "Medium" })} />
                                                        <label className="btn btn-outline-info rounded-pill font-weight-medium fs-3 ms-2" htmlFor="option2" >Medium</label>

                                                        <input type="radio" className="btn-check" name="options" id="option3" autoComplete="off" checked={items?.size === "Large"} onClick={(e) => setItems({ ...items, size: "Large" })} />
                                                        <label className="btn btn-outline-warning rounded-pill font-weight-medium fs-3 ms-2" htmlFor="option3" >Large</label>

                                                        <input type="radio" className="btn-check" name="options" id="option4" autoComplete="off" checked={items?.size === "Extra Large"} onClick={(e) => setItems({ ...items, size: "Extra Large" })} />
                                                        <label className="btn btn-outline-danger rounded-pill font-weight-medium fs-3 ms-2" htmlFor="option4" >Extra Large</label>
                                                    </div>
                                                </div>


                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage type" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <input type="radio" className="btn-check" name="type" id="type1" autoComplete="off" checked={items?.type === "General"} onClick={(e) => setItems({ ...items, type: "General" })} />
                                                        <label className="btn btn-outline-primary rounded-pill font-weight-medium fs-3" htmlFor="type1">General</label>

                                                        <input type="radio" className="btn-check" name="type2" id="type2" autoComplete="off" checked={items?.type === "Sensitive"} onClick={(e) => setItems({ ...items, type: "Sensitive" })} />
                                                        <label className="btn btn-outline-danger rounded-pill font-weight-medium fs-3 ms-2" htmlFor="type2">Sensitive</label>
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Luggage remarks" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                                        <textarea placeholder="Remarks" className="form-control" value={items?.description} onChange={(e: any) => setItems({ ...items, description: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="" />
                                                    <div className="col-sm-8 col-lg-8 col-md-8 d-flex">
                                                        <div> <Button className="text-dark px-4 me-2" variant="danger" type="submit" disabled={!items?.item_name && !items?.size && !items?.type} onClick={() => setItems(initialItem)}>Clear</Button></div>
                                                        <div><Button className="text-dark px-3" variant="success" type="submit" disabled={!items?.item_name || !items?.size || !items?.type}>Add Items</Button></div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    }

                                </div>

                                <div className="col-lg-6">
                                    <h6 className="col-sm-11 col-lg-11 col-md-11 py-2 border-bottom text-info mb-5">Locker Entry</h6>
                                    <form onSubmit={onsubmit}>

                                        <div className="mb-3 row">
                                            <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Expected Pickup date" />
                                            <div className="col-sm-8 col-lg-8 col-md-8">

                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Stack spacing={3}>
                                                        <DatePicker
                                                            disablePast
                                                            open={pickupOpen}
                                                            onClose={() => setPickupOpen(false)}
                                                            openTo="year"
                                                            views={['day']}
                                                            label="Pick up date"
                                                            inputFormat="YYYY-MM-DD"
                                                            value={(lockerInfo?.pickup_date) || null}
                                                            onChange={(e: any) => setLockerInfo({ ...lockerInfo, pickup_date: e })}
                                                            renderInput={(params) =>
                                                                <TextField onClick={() => setPickupOpen(true)} fullWidth={true} size='small' {...params} required />
                                                            }
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </div>
                                        </div>

                                        <div className="mb-3 row">
                                            <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Expected Pickup Time" />
                                            <div className="col-sm-8 col-lg-8 col-md-8">
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                        <TimePicker
                                                            open={pickup2Open}
                                                            onClose={() => setPickup2Open(false)}
                                                            label="Pick up time"
                                                            value={moment(lockerInfo?.pickup_time).format() || null}
                                                            onChange={(newValue) => {
                                                                setLockerInfo({ ...lockerInfo, pickup_time: newValue });
                                                            }}
                                                            renderInput={(params) => <TextField onClick={() => setPickup2Open(true)} size='small' {...params} required />}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className="mb-4 row">
                                            <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Remarks" />
                                            <div className="col-sm-8 col-lg-8 col-md-8">
                                                <input placeholder="Remarks"
                                                    style={{ height: "40px" }}
                                                    type="text"
                                                    name="item_name"
                                                    className="form-control"
                                                    value={lockerInfo?.remarks}
                                                    onChange={(e: any) => setLockerInfo({ ...lockerInfo, remarks: e?.target?.value })} />
                                            </div>
                                        </div>
                                        <div className="col-sm-11 col-lg-11 col-md-11">
                                            {!!luggage?.length && <h6 className="py-2 border-bottom text-info mb-5">Luggage Info</h6>}

                                            {!!luggage?.length ?
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr className="text-center fw-bolder">
                                                            <th className=" fw-bolder">SL</th>
                                                            <th className=" fw-bolder">Item Name</th>
                                                            <th className=" fw-bolder">Size</th>
                                                            <th className=" fw-bolder">Type</th>
                                                            <th className=" fw-bolder">Description</th>
                                                            <th className=" fw-bolder">Action</th>
                                                        </tr>
                                                    </thead>
                                                    {luggage.map((items: any, ind: any) => {
                                                        return (<tbody>
                                                            <tr className="text-center " key={ind}>
                                                                <td>{ind + 1}</td>
                                                                <td>{items?.item_name}</td>
                                                                <td>{items?.size}</td>
                                                                <td>{items?.type}</td>
                                                                <td>{items?.description || 'sample item'}</td>
                                                                <td>
                                                                    <ul className="action text-center ">
                                                                        <li>
                                                                            <Link href="#">
                                                                                <a onClick={() => editItems(ind)}>

                                                                                    <span className={ind === index ? `d-none` : `text-primary`}> <EditIcon /></span>
                                                                                </a>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link href='#'>
                                                                                <a onClick={() => { deleteItems(items, ind) }}>
                                                                                    <span className={ind === index ? `d-none` : `text-danger`}><DeleteIcon /></span>
                                                                                </a>
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </tbody>)
                                                    })}
                                                </Table>
                                                :
                                                <div className="text-center mt-5 pt-5"><PropagateLoading /></div>
                                            }
                                        </div>

                                        {!!luggage?.length && <div className="mb-3 text-center mt-5">
                                            <Button className="px-5" variant="warning" type="submit" disabled={!luggage.length} >Update Locker</Button>
                                        </div>}
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </Fragment>

    )
}

export default LockerUpdate
