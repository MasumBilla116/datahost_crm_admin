import React, { useEffect, useState } from 'react';
import HotelLogo from './hotelLogo';
import { FaPhone } from 'react-icons/fa';
import BarcodeGenerator from './Barcode';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import Axios from '../utils/axios';

const RestaurantINV = React.forwardRef((props, ref) => {
  const { id, invoices } = props;
  const [loading, setLoading] = useState(true);
  const { http } = Axios();

  //table data
  const columnData = [

    {
      name: <span className='fw-bold' >Food Name</span>,
      selector: row => row?.food_name || row?.setmenuName,
      // width: "60%"
    },
    {
      name: <span className='fw-bold' >Unit Price</span>,
      selector: row => row?.unit_price,
      // width: "60%"
    },
    {
      name: <span className='fw-bold' >Qty</span>,
      selector: row => row?.qty,
      // width: "10%"
    },
    {
      name: <span className='fw-bold' >remarks</span>,
      selector: row => row?.remarks,
      // width: "10%"
    },
    {
      name: <span className='fw-bold' >Total Price</span>,
      selector: row => row?.total_price,
      // width: "60%"
    },
  ];


  const rowData = invoices?.invoice_list;


  // if(!invoices){
  //   return (<div>....</div>);
  // }

  if (!invoices) {
    return <div>Loading invoices data...</div>;
  }

  return (
    <div ref={ref} className="restaurant-inv-content">

      <div>
        <div id="printME" className='pb-5'>
          <div>
            <div className='text-center fs-3'>
              {/* <h1 className='mb-3'>(Company Logo)</h1> */}
              <HotelLogo id={invoices.id} invoiceName="Restaurant Invoice"/>
             
            </div>
            <div className='row small my-2'>
              <div className='col-sm-4 col-lg-4 col-md-4 my-2'>

                <div><strong>Customer : </strong><span>{props.invoices?.customer?.first_name + " " + props.invoices?.customer?.last_name}</span></div>
                {/* <div><strong>Customer : </strong><span>{invoices?.customer?.first_name + " " + invoices?.customer?.last_name}</span></div> */}
                {/* <div><strong>phone : </strong><span>{invoices.customer?.mobile || "NA"}</span></div>
                <div><strong>Address : </strong><span>{invoices.customer?.address || "NA"}</span></div>
                <div><strong>Customer Type : </strong><span>{invoices.customer ? 'Hotel Customer' : 'Walk In Customer'}</span></div> */}
                {/* <div><strong>Balance : </strong><span>{invoices.customer?.balance || "NA"}</span></div>  */}
              </div>
              <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                {/* <div>
                                    <strong>Voucher Number:  </strong>
                                    <strong>{invoices?.voucher_number}</strong>
                                </div>
                                <div>(Bar Code)</div> */}
                <BarcodeGenerator value={invoices?.invoice_number} />
              </div>
              <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                  <div><strong>Date : </strong><span>{moment(invoices?.created_at).format('DD-MM-YYYY')}</span></div>
                  <div><strong>Created By : </strong><span>{invoices?.creator?.name}</span></div>
                  <div><strong>Remarks : </strong><span>{invoices?.remarks}</span></div>
                  <div><strong>Payment Status : </strong><span>{(invoices?.is_paid == 1 || invoices?.paid_amount > 0) ? 'Payment Processing Done' : 'Pending'}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <DataTable
              columns={columnData}
              data={rowData}
              striped
            />
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Net Total:
                  </div>
                  <div className="col-md-5">
                    {invoices.net_total}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Service Charge (%):
                  </div>
                  <div className="col-md-5">
                    {invoices.service_charge}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Total Tax (%):
                  </div>
                  <div className="col-md-5">
                    {invoices.net_vat}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Promo:
                  </div>
                  <div className="col-md-5">
                    {invoices.net_promo}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Discount:
                  </div>
                  <div className="col-md-5">
                    {invoices.discount ? invoices.discount : "0.00"}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7">
                    Grand Total:
                  </div>
                  <div className="col-md-5">
                    {invoices.total_amount}
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex justify-content-between my-4'>
              <div className='w-25 mt-5'>
                <div><hr /></div>
                <div className='text-center fw-bolder'>Reciever's signature </div>
              </div>
              <div className='w-25 text-center pt-5 mt-5'>
                (company logo)
              </div>
              <div className='w-25 mt-5'>
                <div ><hr /></div>
                <div className='text-center fw-bolder'>For managebeds computer</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
});

export default RestaurantINV;
