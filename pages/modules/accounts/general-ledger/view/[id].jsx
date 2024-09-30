import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react'
import { HeadSection } from '../../../../../components';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import Axios from '../../../../../utils/axios';
import moment from 'moment';

const ledgerDetails = () => {
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {
        isReady,
        query: {
            id,
        }
    } = router;

    const { http } = Axios();
    const { pathname } = router;


    useEffect(() => {
        let isSubscribed = true;

        if (!isReady) {
            console.log('fetching...')
            return; 
        }
        setLoading(true);
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, { action: "getLedgerInfo", id: id })
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
        { text: 'All Ledger', link: '/modules/accounts/general-ledger' },
        { text: 'View Ledger', link: `/modules/accounts/general-ledger/view/[id]` }
    ]

    return (
        <>
            <HeadSection title="Ledger Basic Info" />
            <div className="container-fluid ">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card shadow">
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h3 className="box-title">Ledger’s Basic Info</h3>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td width={390}>Name</td>
                                                        <td>{details?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Sector Head</td>
                                                        <td>
                                                        {details?.sector_head}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Opening Balance</td>
                                                        <td>{details?.opening_balance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Balance</td>
                                                        <td>{details?.balance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Designation of the  Employee</td>
                                                        <td>{details?.description}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Account Type</td>
                                                        <td>{details?.account_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Title</td>
                                                        <td>{details?.title}</td>
                                                    </tr>
                                                 

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h3 className="box-title mt-5">Creation/updation related info</h3>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>

                                                    <tr>
                                                        <td>Created At</td>
                                                        <td>{moment(details?.created_at).format('DD/MM/YYYY')}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Updated At</td>
                                                        <td>{moment(details?.updated_at).format('DD/MM/YYYY')}</td>
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

export default ledgerDetails