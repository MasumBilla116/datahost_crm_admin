import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Axios from '../../../../../utils/axios';
import { HeadSection } from '../../../../../components';
import Breadcrumbs from '../../../../../components/Breadcrumbs';


const DriverDetails = () => {
    const router = useRouter();
    const { pathname } = router;
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(true);
    const { http } = Axios();
    const {
        isReady,
        query: {
            id,
        }
    } = router;



    useEffect(() => {
        let isSubscribed = true;

        if (!isReady) {
            console.log('fetching...')
            return;
        }
        setLoading(true);
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/drivers`, { action: "getDriverInfo", driver_id: id })
            .then((res) => {
                if (isSubscribed) {
                    setDetails(res?.data?.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false);
            });

        return () => {
            isSubscribed = false;
        }

    }, [id, isReady])

   //breadcrumbs
   const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Drivers', link: '/modules/transport/drivers' },
    { text: 'View Drivers', link: '/modules/transport/drivers/details/[id]' },    
  ]

    return (
        <>
            <HeadSection title="Drivers Basic Info" />
            <div className="container-fluid">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row ">
                    {/* Column */}
                    <div className="col-lg-6">
                        <div className="card shadow ">
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 ">
                                        <h3 className="box-title ">Drivers Basic Info</h3>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td> Id</td>
                                                        <td>
                                                            {details && details.id}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width={390}>Name</td>
                                                        <td>{details && details.employee_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width={390}>Gender</td>
                                                        <td>{details && details.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mobile No</td>
                                                        <td>
                                                            {details && details.mobile}
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td>Email Id</td>
                                                        <td>
                                                            {details && details.email}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Salary Type</td>
                                                        <td>
                                                            {details && details.salary_type}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>Salary Amount</td>
                                                        <td>
                                                            {details && details.salary_amount}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>Status</td>
                                                        <td>{details && details.status == 1 ? "Active" : "Inactive"}</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="col-lg-6">

                        <div className="card shadow">

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h3 className="box-title ">Vehicle related info</h3>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td width={390}>Vehicle Type</td>
                                                        <td>{details && details.vehicle_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width={390}>Model</td>
                                                        <td>{details && details.model}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Reg no</td>
                                                        <td>{details && details.reg_no}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Seat Capacity</td>
                                                        <td>{details && details.seat_capacity}</td>
                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
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

export default DriverDetails