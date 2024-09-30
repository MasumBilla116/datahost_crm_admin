import DashboardTopRow from "./dashboard/DashboardTopRow";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      {/* Start Row */}
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
      {/* End Row */}
      {/* Start row */}
      <div className="row">
        <div className="col-lg-9 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <div className="d-md-flex">
                <div>
                  <h3 className="card-title mb-1">
                    <span className="lstick d-inline-block align-middle" />
                    Block Title
                  </h3>
              <h5 style={{color:"gray"}}>On Development</h5>
                </div>
                
              </div>
            </div> 
            <div className="card-body">
              <div
                id="Sales-Overview"
                className="position-relative"
                style={{ height: "360px" }}
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------- */}
        {/* visit charts*/}
        {/* -------------------------------------------------------------- */}
        <div className="col-lg-3 p-xs-2 d-flex align-items-stretch">
          <div className="card mb-xs-2 w-100">
            <div className="card-body">
              <h4 className="card-title">
                <span className="lstick" />
                Block Title
              </h4>
              <h5 style={{color:"gray"}}>On Development</h5>
              <div
                id="Visit-Separation"
                style={{ height: "290px", width: "100%" }}
                className="d-flex justify-content-center align-items-center"
              /> 
            </div>
          </div>
        </div>
      </div>
      {/* End Row */}
    </div>
  );
};

export default Dashboard;
