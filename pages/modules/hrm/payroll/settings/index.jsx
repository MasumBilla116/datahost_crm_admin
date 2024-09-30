import React from 'react'
import ManageAddDedType from '../../../../../components/payrollSettings/ManageAddDedType'
import AttendanceSetting from '../../../../../components/payrollSettings/AttendanceSetting'
import BonusSetting from '../../../../../components/payrollSettings/BonusSetting'
import GeneralSetting from '../../../../../components/payrollSettings/GeneralSetting'
import {HeadSection} from '../../../../../components'

const PayrollSettings = () => {
  return (
    <>
    <HeadSection title="Payroll Settings" />
      <div className="row m-0">
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12  ">
            <ManageAddDedType/>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
        <AttendanceSetting/>
        </div>
      </div>

      <div className="row m-0">
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12  ">
            {/* <ManageAddDedType/> */}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
        <BonusSetting/>
        </div>
      </div>

      <div className="row m-0">
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12  ">
            {/* <ManageAddDedType/> */}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
        <GeneralSetting/>
        </div>
      </div>

    </>
  )
}

export default PayrollSettings