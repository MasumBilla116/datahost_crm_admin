import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { HeadSection } from '../../../../../components';
import Axios from '../../../../../utils/axios';
import Breadcrumbs from '../../../../../components/Breadcrumbs';

const vehiclesDetails = () => {
    const { http } = Axios();
    const router = useRouter();
    const { pathname } = router;
    const {
        isReady,
        query: { id },
    } = router;
    const [vehicle, setVehicle] = useState({});



    const fetchVehicleInfo = useCallback(async () => {
        if (!isReady) {
            console.log("fetching...");
            return;
        }

        let isSubscribed = true;
        await http
            .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicles`, {
                action: "getVehicleInfo",
                vehicle_id: id,
            })
            .then((res) => {
                if (isSubscribed) {
                    setVehicle(res?.data?.data)

                }
            })
            .catch((err) => {
                console.log("Something went wrong !");
            });

        return () => (isSubscribed = false);
    }, [id, isReady]);

    useEffect(() => {
        fetchVehicleInfo();
    }, [fetchVehicleInfo]);

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Vehicles', link: '/modules/transport/vehicles' },
        { text: 'View Vehicle', link: '/modules/transport/vehicles/view/[id]' },
    ]

    return (
        <Fragment>
            <HeadSection title="Vehicle Information" />
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">

                        <div className="card shadow">
                            <div className="border-bottom title-part-padding">
                                <h4 className="card-title mb-0">
                                    Vehicle info
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="table-responsive">
                                            <table className="table border table-striped">
                                                <tbody>
                                                    <tr>
                                                        <td width={300}>Model</td>
                                                        <td>{vehicle?.model}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Brand</td>
                                                        <td>{vehicle?.brand}</td>

                                                    </tr>
                                                    <tr>
                                                        <td>Registration</td>
                                                        <td>{vehicle?.reg_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Vehicle Type</td>
                                                        <td>{vehicle?.vehicle_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Seat Capacity</td>
                                                        <td>{vehicle?.seat_capacity}</td>
                                                    </tr>
                                                    {/* <tr>
                                            <td>Driver</td>
                                            <td>name</td>
                                        </tr> */}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="table-responsive">
                                            <table className="table border table-striped">

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default vehiclesDetails