import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HeadSection from '../../../../components/HeadSection';
import PropagateLoading from '../../../../components/PropagateLoading';
import Axios from '../../../../utils/axios';
import getStatus from '../../../../utils/getStatus';

function VoucherEditHistory() {
    // Router setup
    const router = useRouter();
    const {
        isReady,
        query: {
            id,
        }
    } = router;

    const { http } = Axios();
    const { pathname } = router;
    //state declaration
    const [itemInfo, setItemInfo] = useState([]);

    const [initialLoading, setInitialLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getItemDetails = async () => {
            let   body = {
                action: "getItemInfo",
                item_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`,
                body
            ).then(res => {
                setItemInfo(res?.data?.data[0] || []);
                setInitialLoading(false)
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }
        if(itemInfo?.length == 0){
            isReady && getItemDetails();
        } 

        return () => controller.abort();
    }, [id, isReady])

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Items', link: '/modules/inventory/items' },
        { text: 'View Items', link: '/modules/inventory/items/details/[id]' },
    ]
 

    return (
        <div>
            <HeadSection title="Item-Details" />
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow p-5 m-1'>
                <h4 className='text-center my-2'>Inventory Item Details for ({itemInfo?.item_name})</h4>
                {initialLoading ? <div className="my-5 mx-3 text-center">
                    <PropagateLoading />
                </div>
                    :
                    <>

                        <div className="container-fluid ">
                            <div className="row">

                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-body">

                                            <div className="row">
                                                <div className="col-lg-5 col-md-5 col-sm-5">

                                                    <h3 className="box-title ">Item Basic Info</h3>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td width={200}>Item Name</td>
                                                                    <td >:</td>
                                                                    <td>{itemInfo?.item_name}</td>
                                                                </tr>
                                                                
                                                                <tr>
                                                                    <td>Inventory Category</td>
                                                                    <td >:</td>
                                                                    <td>
                                                                        {itemInfo?.category_name}
                                                                    </td>
                                                                </tr>    
                                                                <tr>
                                                                    <td>Item Type</td>
                                                                    <td >:</td>
                                                                    <td>
                                                                        {itemInfo?.item_type_name}
                                                                    </td>
                                                                </tr>    
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 col-md-2 col-sm-2">

                                                </div>
                                                <div className="col-lg-5 col-md-5 col-sm-5">
                                                    <h3 className="box-title">Creation/updation related info</h3>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td width={390}>Status</td>
                                                                    <td >:</td>
                                                                    <td>{ getStatus(itemInfo?.status)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Created At</td>
                                                                    <td >:</td>
                                                                    <td>{moment(itemInfo?.created_at).format('DD-MM-YYYY')}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <h3 className="box-title mt-5">Creation/updation related info</h3>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td width={390}>Created By</td>
                                                                    <td>{itemInfo?.creator?.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Created At</td>
                                                                    <td>{moment(itemInfo?.created_at).format('DD-MM-YYYY')}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div >
    )
}

export default VoucherEditHistory