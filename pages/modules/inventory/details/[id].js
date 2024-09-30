import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import DataTable, { createTheme } from 'react-data-table-component';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import Axios from '../../../../utils/axios';
import PropagateLoading from '../../../../components/PropagateLoading';
import HeadSection from '../../../../components/HeadSection';
import Breadcrumbs from '../../../../components/Breadcrumbs';

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
            let body = {}
            body = {
                action: "getItemInfo",
                item_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`,
                body
            ).then(res => {
                setItemInfo(res?.data?.data || []);
                setInitialLoading(false)
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }

        isReady && getItemDetails();

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
                <h4 className='text-center my-2'>Inventory Item Details for ({itemInfo?.name})</h4>
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
                                                                    <td width={390}>Item Name</td>
                                                                    <td>{itemInfo?.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Item Code</td>
                                                                    <td>
                                                                        {itemInfo?.code}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Inventory Category</td>
                                                                    <td>
                                                                        {itemInfo?.inventory_category?.name}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Warehouse location name</td>
                                                                    <td>
                                                                        {itemInfo?.warehouse_location?.title}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Warehouse location code</td>
                                                                    <td>
                                                                        {itemInfo?.warehouse_location?.location_code}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Unit Price</td>
                                                                    <td>
                                                                        {itemInfo.unit_cost}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Unit Type</td>
                                                                    <td>
                                                                        {itemInfo.unit_type}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Item Type</td>
                                                                    <td>
                                                                        {itemInfo.item_type}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Opening Stock</td>
                                                                    <td>
                                                                        {itemInfo.opening_stock}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Total Quantity</td>
                                                                    <td>
                                                                        {itemInfo.qty}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Minimum Stock</td>
                                                                    <td>
                                                                        {itemInfo.min_stock}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Description</td>
                                                                    <td>
                                                                        {itemInfo?.description}
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
                                                                    <td width={390}>Created By</td>
                                                                    <td >:</td>
                                                                    <td>{itemInfo?.creator?.name}</td>
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