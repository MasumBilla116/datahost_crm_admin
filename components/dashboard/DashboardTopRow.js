import React from "react";

const DashboardTopRow = ({}) => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-6 p-xs-2">
        <div className="card mb-xs-1">
          <div className="card-body">
            <div className="d-flex no-block">
              <div className="me-3 align-self-center">
                <span className="lstick d-inline-block align-middle" />
                <img src="/assets/images/icon/income.png" alt="Income" />
              </div>
              <div className="align-self-center">
                <h6 className="text-muted mt-2 mb-0">Block Title</h6>
                <h2>0</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 p-xs-2">
        <div className="card mb-xs-1">
          <div className="card-body">
            <div className="d-flex no-block">
              <div className="me-3 align-self-center">
                <span className="lstick d-inline-block align-middle" />
                <img src="/assets/images/icon/expense.png" alt="Income" />
              </div>
              <div className="align-self-center">
                <h6 className="text-muted mt-2 mb-0">Block Title</h6>
                <h2>0</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 p-xs-2">
        <div className="card mb-xs-1">
          <div className="card-body">
            <div className="d-flex no-block">
              <div className="me-3 align-self-center">
                <span className="lstick d-inline-block align-middle" />
                <img src="/assets/images/icon/assets.png" alt="Income" />
              </div>
              <div className="align-self-center">
                <h6 className="text-muted mt-2 mb-0">Block Title</h6>
                <h2>0</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 p-xs-2">
        <div className="card mb-xs-1">
          <div className="card-body">
            <div className="d-flex no-block">
              <div className="me-3 align-self-center">
                <span className="lstick d-inline-block align-middle" />
                <img src="/assets/images/icon/staff.png" alt="Income" />
              </div>
              <div className="align-self-center">
                <h6 className="text-muted mt-2 mb-0">Block Title</h6>
                <h2>0</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopRow;
