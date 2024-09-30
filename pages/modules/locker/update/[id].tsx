import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";
import Switch from "react-switch";
import React, { useEffect, useState } from "react";

import toast from '../../../../components/Toast/index';
import Axios from '../../../../utils/axios';
import { Label, Select2, HeadSection } from '../../../../components';
import PropagateLoading from '../../../../components/PropagateLoading';
import Breadcrumbs from '../../../../components/Breadcrumbs';


function updateLockerBYID() {

    const [locker, setLocker] = useState([]);

    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const { http } = Axios();
    const router = useRouter();
    const { isReady, query: { id } } = router;

    useEffect(() => {
        const controller = new AbortController()

        //fetch locker By
        const getallLockerByID = async () => {
            let body: any = {}
            body = {
                action: "getLockerByID",
                id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`,
                body
            ).then((res: any) => {
                const lock = res?.data?.data;
                !!lock.length && setLocker([{
                    ...locker,
                    serial: lock[0]?.serial,
                    prefix: lock[0]?.prefix,
                    length: lock[0]?.serial.length - lock[0]?.prefix.length,
                    description: lock[0]?.description,
                    type: lock[0]?.type,
                    size: lock[0]?.size,
                    availibility: lock[0]?.availability,
                    status: lock[0]?.status,

                }])
            })
                .catch((err: any) => {
                    console.log(err);
                })
        }
        isReady && getallLockerByID()

        return () => controller.abort();

    }, [isReady, id])


    let Locker_types_options = [{ value: '1', label: 'Individual Locker' }, { value: '2', label: 'Combined Locker' }];
    let Locker_availibility_options = [{ value: '1', label: 'available' }, { value: '2', label: 'unavailable' }];
    let Locker_size_options = [{ value: '1', label: 'Small' }, { value: '2', label: 'Medium' }, { value: '3', label: 'Large' }, { value: '4', label: 'Extra Large' }];

    const submit = async (e: any) => {
        notify("info", 'Processing')
        e.preventDefault();

        let body = {
            ...locker[0],
            action: "updateLockerByID",
            id
        }

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/locker`, body)
            .then((res: any) => {
                const lockers = res?.data?.data;
                // console.log(lockers)
                notify("success", 'Locker updated  successfully')
                router.push(`/modules/locker/list`)
            })
            .catch((err: any) => {
                let error = (err?.response?.data?.response)
                console.log(error);

                if (typeof error === 'object') {
                    for (const item in error) {
                        notify("error", item + " cannot be empty")
                    }
                }
                else {
                    notify("error", error)
                }
            });
    }


    const { pathname } = router;

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Lockers', link: '/modules/locker' },
        { text: 'Update Lockers', link: '/modules/locker/update/[id]' },
    ]

    return (
        <div className="container-fluid">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <HeadSection title="Update Locker" />
            <div className="row">
                <div className="col-12">
                    <div className="card shadow p-1">
                        <h5 className="p-3 border-bottom fw-bolder">Update Locker</h5>

                        {!!locker.length ? <div className="w-75 m-auto m-3 p-1">
                            <form onSubmit={submit} >

                                <div className="mb-3 row">
                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Serial" />
                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                        <input placeholder="Serial" required name="prefix" value={locker[0]?.serial} onChange={(e: any) => setLocker([{
                                            ...locker[0],
                                            serial: e?.target?.value
                                        }])} className="form-control" />
                                    </div>
                                </div>



                                {locker[0]?.type &&
                                    <>
                                        <div className="mb-3 row">
                                            <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Locker Type" />
                                            <div className="col-sm-8 col-lg-8 col-md-8">
                                                <Select2
                                                    options={Locker_types_options}
                                                    defaultValue={{ value: "", label: locker[0]?.type }}
                                                    onChange={(e: any) => setLocker([{
                                                        ...locker[0],
                                                        type: e.label,

                                                    }])}
                                                />
                                            </div>
                                        </div>
                                    </>}


                                {locker[0]?.size && <div className="mb-3 row">
                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Size" />
                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                        <Select2
                                            options={Locker_size_options}
                                            defaultValue={{ value: "", label: locker[0]?.size }}
                                            onChange={(e: any) => setLocker([{
                                                ...locker[0],
                                                size: e.label,

                                            }])}
                                        />
                                    </div>
                                </div>}

                                {locker[0]?.availibility && <div className="mb-3 row">
                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Availibility" />
                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                        <Select2
                                            options={Locker_availibility_options}
                                            defaultValue={{ value: "", label: locker[0]?.availibility }}
                                            onChange={(e: any) => setLocker([{
                                                ...locker[0],
                                                availibility: e.label,

                                            }])}
                                        />
                                    </div>
                                </div>}

                                <div className="mb-3 row">
                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Description" />
                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                        <textarea name="description" placeholder="Description" value={locker[0]?.description} onChange={(e: any) => setLocker([{
                                            ...locker[0],
                                            description: e.target.value,

                                        }])} className="form-control" />
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <Label className="col-sm-3 col-lg-3 col-md-3 fw-bolder" text="Status" />
                                    <div className="col-sm-8 col-lg-8 col-md-8">
                                        <Switch onChange={() => setLocker([{
                                            ...locker[0],
                                            status: locker[0]?.status === 1 ? 0 : 1,

                                        }])} checked={locker[0]?.status} />
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <Button className="w-25 m-auto" type="submit" disabled={locker?.length < 0 || locker?.length > 5}>Update Locker</Button>
                                </div>
                            </form>
                        </div> :
                            <div className='text-center mt-5' style={{ height: "250px" }}>
                                <PropagateLoading />
                            </div>}
                    </div>
                </div>
            </div >
        </div >
    )
}

export default updateLockerBYID
