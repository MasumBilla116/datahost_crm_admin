import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import DataTable, { createTheme } from 'react-data-table-component';
import PropagateLoading from '../../../../../components/PropagateLoading';
import Axios from '../../../../../utils/axios';

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
    const [vouchers, setVouchers] = useState([]);
    const [editHistories, setEditHistories] = useState([]);
    // console.log(editHistories)
    const [initialLoading, setInitialLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController();

        //fetching invoice items
        const getVoucherDetails = async () => {
            let body = {}
            body = {
                action: "getVoucherInfo",
                voucher_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,
                body
            ).then(res => {
                setVouchers(res?.data?.data || []);
                setInitialLoading(false)
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }

        const getVoucherEditHistory = async () => {
            let body = {}
            body = {
                action: "getEditHistory",
                voucher_id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,
                body
            ).then(res => {
                setEditHistories(res?.data?.data || []);
                setInitialLoading(false)
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }

        isReady && getVoucherDetails() ; getVoucherEditHistory();

        return () => controller.abort();
    }, [id, isReady])

    createTheme('solarized', {
        text: {
            primary: '#268bd2',
            secondary: '#2aa198',
        },
        background: {
            default: '#002b36',
        },
        context: {
            background: '#cb4b16',
            text: '#FFFFFF',
        },
        divider: {
            default: '#073642',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');
    
    //table data
    const columnData= [
        {
            name: <span className='fw-bold' >Product</span>,
            selector: row => row?.itemName
        },
        {
            name: <span className='fw-bold' >Note</span>,
            selector: row => row?.note
        },
        {
            name: <span className='fw-bold' >Edited By</span>,
            selector: row => row?.action_by
        },
        {
            name: <span className='fw-bold' >Old Qty</span>,
            selector: row => row?.old_qty
        },
        {
            name: <span className='fw-bold' >affected Qty</span>,
            selector: row => row?.affected_qty
        },
        {
            name: <span className='fw-bold' >New Qty</span>,
            selector: row => row?.new_qty
        },
        {
            name: <span className='fw-bold' >Updated At</span>,
            selector: row => {moment(row?.created_at).format('DD-MM-YYYY')}
        },
    ];


      //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Consumption Vouchers', link: '/modules/inventory/vouchers' },
    { text: 'History Voucher', link: '/modules/inventory/vouchers/edit-history/[id]' },
  ]

    return (
        <div>
             {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className='card shadow p-5 m-4'>
                <h4 className='text-center my-2'>Voucher Edit History</h4>
                {initialLoading ? <div className="my-5 mx-3 text-center">
                    <PropagateLoading />
                </div>
                    : <div>
                        <div className='text-end mx-2 mb-4'><span className='border p-3 fw-bolder'>{vouchers.voucher_number}</span></div>
                        <div>
                            <Table striped bordered hover className='shadow'>
                                <thead>
                                    <tr className='text-center fw-bolder'>
                                        <th className='fw-bolder'>SL</th>
                                        <th className='fw-bolder'>Product</th>
                                        <th className='fw-bolder'>Remarks</th>
                                        <th className='fw-bolder'>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vouchers?.voucher_list?.map((invoice, index) => {
                                        return (
                                            <tr className='text-center'>
                                                <td>{index + 1}</td>
                                                <td>{invoice?.itemName}</td>
                                                <td>{invoice?.item_remarks || "-"}</td>
                                                <td>{invoice?.item_qty}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>

                        </div>
                        <hr />
                        <h6 className='text-center my-4 fw-bolder'>Details table</h6>
                        {!!editHistories.length && editHistories?.map((table, index) => {
                            var number;
                            if((index+1) <= 1){
                                number= 'st';
                            }
                            else if((index+1) <= 2){
                                number= 'nd'
                            }
                            else if((index+1) <= 3){
                                number= 'rd'
                            }
                            else if((index+1) <= (index+1)){
                                number= 'th'
                            }
                            return (
                                
                                <>
                                <h4 style={{textAlign: 'center'}}>{index+1}{number} edit history</h4>
                                <div className='border my-3 mb-3'>
                                    <DataTable
                                        columns={columnData}
                                        data={table}
                                        striped
                                        // theme={"solarized"}
                                    />
                                </div>
                                </>
                                
                            )
                        })
                        }

                    </div>}
            </div>
        </div >
    )
}

export default VoucherEditHistory