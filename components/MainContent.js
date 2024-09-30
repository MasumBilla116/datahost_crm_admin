import React from 'react'
import Footer from './Footer'

export default function MainContent() {
  return (
    <>
    <div className="page-wrapper">
        {/* -------------------------------------------------------------- */}
        {/* Container fluid  */}
        {/* -------------------------------------------------------------- */}
        <div className="container-fluid">
          {/* -------------------------------------------------------------- */}
          {/* Bread crumb and right sidebar toggle */}
          {/* -------------------------------------------------------------- */}
          <div className="row page-titles">
            <div className="col-md-5 col-12 align-self-center">
              <h3 className="text-themecolor mb-0">Dashboard 2</h3>
            </div>
            <div className="col-md-7 col-12 align-self-center d-none d-md-flex justify-content-end">
              <ol className="breadcrumb mb-0 p-0 bg-transparent">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active d-flex align-items-center">
                  Dashboard 2
                </li>
              </ol>
            </div>
          </div>
          {/* -------------------------------------------------------------- */}
          {/* End Bread crumb and right sidebar toggle */}
          {/* -------------------------------------------------------------- */}
          {/* Start Row */}
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex no-block">
                    <div className="me-3 align-self-center">
                      <span className="lstick d-inline-block align-middle" /><img src="/assets/images/icon/income.png" alt="Income" />
                    </div>
                    <div className="align-self-center">
                      <h6 className="text-muted mt-2 mb-0">Total Income</h6>
                      <h2>953,000</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex no-block">
                    <div className="me-3 align-self-center">
                      <span className="lstick d-inline-block align-middle" /><img src="/assets/images/icon/expense.png" alt="Income" />
                    </div>
                    <div className="align-self-center">
                      <h6 className="text-muted mt-2 mb-0">Total Expense</h6>
                      <h2>236,000</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex no-block">
                    <div className="me-3 align-self-center">
                      <span className="lstick d-inline-block align-middle" /><img src="/assets/images/icon/assets.png" alt="Income" />
                    </div>
                    <div className="align-self-center">
                      <h6 className="text-muted mt-2 mb-0">Total Assets</h6>
                      <h2>987,563</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex no-block">
                    <div className="me-3 align-self-center">
                      <span className="lstick d-inline-block align-middle" /><img src="/assets/images/icon/staff.png" alt="Income" />
                    </div>
                    <div className="align-self-center">
                      <h6 className="text-muted mt-2 mb-0">Total Staff</h6>
                      <h2>987,563</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-9 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="card-body">
                  <div className="d-md-flex">
                    <div>
                      <h3 className="card-title mb-1">
                        <span className="lstick d-inline-block align-middle" />Sales Overview
                      </h3>
                    </div>
                    <div className="ms-auto">
                      <select className="form-select">
                        <option selected>January 2021</option>
                        <option value={1}>February 2021</option>
                        <option value={2}>March 2021</option>
                        <option value={3}>April 2021</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-info stats-bar">
                  <div className="row">
                    <div className="col-lg-3 col-md-4">
                      <div className="p-3 active">
                        <h6 className="text-white">Total Sales</h6>
                        <h3 className="text-white mb-0">$10,345</h3>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="p-3">
                        <h6 className="text-white">This Month</h6>
                        <h3 className="text-white mb-0">$7,589</h3>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="p-3">
                        <h6 className="text-white">This Week</h6>
                        <h3 className="text-white mb-0">$1,476</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="Sales-Overview" className="position-relative" style={{height: '360px'}} />
                </div>
              </div>
            </div>
            {/* -------------------------------------------------------------- */}
            {/* visit charts*/}
            {/* -------------------------------------------------------------- */}
            <div className="col-lg-3 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="card-body">
                  <h4 className="card-title">
                    <span className="lstick" />Visit Separation
                  </h4>
                  <div id="Visit-Separation" style={{height: '290px', width: '100%'}} className="d-flex justify-content-center align-items-center" />
                  <table className="table vm fs-3">
                    <tbody><tr>
                        <td className="b-0">Mobile</td>
                        <td className="text-end font-weight-medium b-0">38.5%</td>
                      </tr>
                      <tr>
                        <td>Tablet</td>
                        <td className="text-end font-weight-medium">30.8%</td>
                      </tr>
                      <tr>
                        <td>Desktop</td>
                        <td className="text-end font-weight-medium">7.7%</td>
                      </tr>
                      <tr>
                        <td>Other</td>
                        <td className="text-end font-weight-medium">23.1%</td>
                      </tr>
                    </tbody></table>
                </div>
              </div>
            </div>
          </div>
          {/* End Row */}
          {/* Start Row */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-md-flex">
                    <div>
                      <h4 className="card-title">
                        <span className="lstick d-inline-block align-middle" />Projects of the Month
                      </h4>
                    </div>
                    <div className="ms-auto">
                      <select className="form-select">
                        <option selected>January 2021</option>
                        <option value={1}>February 2021</option>
                        <option value={2}>March 2021</option>
                        <option value={3}>April 2021</option>
                      </select>
                    </div>
                  </div>
                  <div className="table-responsive mt-3">
                    <table className="table v-middle no-wrap mb-0">
                      <thead>
                        <tr>
                          <th className="border-0" colSpan={2}>Assigned</th>
                          <th className="border-0">Name</th>
                          <th className="border-0">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{width: '50px'}}>
                            <span><img src="/assets/images/users/1.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">Sunil Joshi</h6>
                            <small className="text-muted">Web Designer</small>
                          </td>
                          <td>Elite Admin</td>
                          <td>
                            <span className="badge bg-success rounded-pill">Low</span>
                          </td>
                        </tr>
                        <tr className="active">
                          <td>
                            <span><img src="/assets/images/users/2.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">Andrew</h6>
                            <small className="text-muted">Project Manager</small>
                          </td>
                          <td>Real Homes</td>
                          <td>
                            <span className="badge bg-info rounded-pill">Medium</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span><img src="/assets/images/users/3.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">
                              Bhavesh patel
                            </h6>
                            <small className="text-muted">Developer</small>
                          </td>
                          <td>MedicalPro Theme</td>
                          <td>
                            <span className="badge bg-primary rounded-pill">High</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span><img src="/assets/images/users/4.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">Nirav Joshi</h6>
                            <small className="text-muted">Frontend Eng</small>
                          </td>
                          <td>Elite Admin</td>
                          <td>
                            <span className="badge bg-danger rounded-pill">Low</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span><img src="/assets/images/users/5.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">Micheal Doe</h6>
                            <small className="text-muted">Content Writer</small>
                          </td>
                          <td>Helping Hands</td>
                          <td>
                            <span className="badge bg-success rounded-pill">High</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span><img src="/assets/images/users/6.jpg" alt="user" width={50} className="rounded-circle" /></span>
                          </td>
                          <td>
                            <h6 className="mb-0 font-weight-medium">Johnathan</h6>
                            <small className="text-muted">Graphic</small>
                          </td>
                          <td>Digital Agency</td>
                          <td>
                            <span className="badge bg-info rounded-pill">High</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* -------------------------------------------------------------- */}
            {/* Activity widget find scss into widget folder*/}
            {/* -------------------------------------------------------------- */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <h4 className="card-title">
                      <span className="lstick d-inline-block align-middle" />Activity
                    </h4>
                    <div className="dropdown ms-auto">
                      <a href="#" className="icon-options-vertical link" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li>
                          <a className="dropdown-item" href="#">Another action</a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">Something else here</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="activity-box table-responsive scrollable" style={{height: '514px'}}>
                  <div className="card-body">
                    {/* Activity item*/}
                    <div className="activity-item mb-4 d-flex">
                      <div className="me-3">
                        <img src="/assets/images/users/2.jpg" alt="user" width={50} className="rounded-circle" />
                      </div>
                      <div className="mt-2">
                        <h5 className="mb-0 font-weight-medium">
                          Mark Freeman
                          <span className="text-muted fs-3 ms-2">| &nbsp; 6:30 PM</span>
                        </h5>
                        <h6 className="text-muted">uploaded this file</h6>
                        <div className="row">
                          <div className="col-4">
                            <img src="/assets/images/icon/zip.png" alt="user" />
                          </div>
                          <div className="col-8 d-flex align-items-center">
                            <div>
                              <h5 className="mb-0 font-weight-medium">
                                Homepage.zip
                              </h5>
                              <h6>54 MB</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Activity item*/}
                    {/* Activity item*/}
                    <div className="activity-item mb-4 d-flex">
                      <div className="me-3">
                        <img src="/assets/images/users/3.jpg" alt="user" width={50} className="rounded-circle" />
                      </div>
                      <div className="mt-2">
                        <h5 className="mb-1 font-weight-medium">
                          Emma Smith
                          <span className="text-muted fs-3 ms-2">| &nbsp; 6:30 PM</span>
                        </h5>
                        <h6 className="text-muted">
                          joined projectname, and invited
                          <a href="#">@maxcage, @maxcage, @maxcage,<br />
                            @maxcage, @maxcage,+3</a>
                        </h6>
                        <span className="image-list mt-2">
                          <a href="#" className="align-middle position-relative">
                            <img src="/assets/images/users/1.jpg" className="rounded-circle" alt="user" width={40} />
                          </a>
                          <a href="#" className="align-middle position-relative">
                            <img src="/assets/images/users/4.jpg" className="rounded-circle" alt="user" width={40} />
                          </a>
                          <a href="#" className="align-middle position-relative">
                            <span className="round rounded-circle text-white d-inline-block text-center bg-warning" style={{height: '40px', width: '40px'}}>C</span>
                          </a>
                          <a href="#" className="align-middle position-relative">
                            <span className="round rounded-circle text-white d-inline-block text-center bg-danger" style={{height: '40px', width: '40px'}}>S</span>
                          </a>
                          <a href="#" className="align-middle position-relative">+3</a>
                        </span>
                      </div>
                    </div>
                    {/* Activity item*/}
                    {/* Activity item*/}
                    <div className="activity-item mb-4 d-flex">
                      <div className="me-3">
                        <img src="/assets/images/users/4.jpg" alt="user" width={50} className="rounded-circle" />
                      </div>
                      <div className="mt-2">
                        <h5 className="mb-0 font-weight-medium">
                          David R. Jones
                          <span className="text-muted fs-3 ms-2">| &nbsp; 6:30 PM</span>
                        </h5>
                        <h6 className="text-muted">uploaded this file</h6>
                        <span>
                          <a href="#" className="me-2"><img src="/assets/images/big/img1.jpg" alt="user" width={60} /></a>
                          <a href="#" className="me-2"><img src="/assets/images/big/img2.jpg" alt="user" width={60} /></a>
                        </span>
                      </div>
                    </div>
                    {/* Activity item*/}
                    {/* Activity item*/}
                    <div className="activity-item d-flex mb-2">
                      <div className="me-3">
                        <img src="/assets/images/users/6.jpg" alt="user" width={50} className="rounded-circle" />
                      </div>
                      <div className="mt-2">
                        <h5 className="mb-1 font-weight-medium">
                          David R. Jones
                          <span className="text-muted fs-3 ms-2">| &nbsp; 6:30 PM</span>
                        </h5>
                        <h6 className="text-muted">
                          Commented on<a href="#">Test Project</a>
                        </h6>
                        <p className="mb-0">
                          It has survived not only five centuries, but also the
                          leap into
                        </p>
                      </div>
                    </div>
                    {/* Activity item*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <img className="card-img-top blog-img2" src="/assets/images/big/img1.jpg" alt="Card image cap" />
                <div className="card-body">
                  <h3 className="font-normal">
                    Business development of rules 2021
                  </h3>
                  <span className="badge bg-info rounded-pill">Technology</span>
                  <p className="mb-0 mt-3">
                    Titudin venenatis ipsum aciat. Vestibulum ullamcorper quam.
                    nenatis ipsum ac feugiat. Ibulum ullamcorper
                  </p>
                  <div className="d-flex mt-3">
                    <button className="btn ps-0 btn-link">Read more</button>
                    <div className="ms-auto align-self-center">
                      <a href="#" className="link m-r-10"><i className="ri-heart-fill" /></a>
                      <a href="#" className="link m-r-10"><i className="ri-share-fill" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="d-md-flex">
                    <h4 className="card-title">
                      <span className="lstick d-inline-block align-middle" />Website Visit
                    </h4>
                    <ul className="list-inline mb-0 ms-auto">
                      <li className="list-inline-item">
                        <h6 className="text-success">
                          <i className="ri-checkbox-blank-circle-fill align-middle font-10 me-2" />Site A view
                        </h6>
                      </li>
                      <li className="list-inline-item">
                        <h6 className="text-info">
                          <i className="ri-checkbox-blank-circle-fill align-middle font-10 me-2" />Site B view
                        </h6>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center mt-3">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-sm btn-outline-secondary shadow-sm fs-2 me-0">
                        PAGEVIEWS
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-secondary shadow-sm fs-2">
                        REFERRALS
                      </button>
                    </div>
                  </div>
                  <div id="Website-Visit" className="position-relative mt-2" style={{height: '360px', width: '100%'}} />
                </div>
              </div>
            </div>
          </div>
          {/* End row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-4">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats">
                      <h1 className="text-white">3257+</h1>
                      <h6 className="text-white">Twitter Followers</h6>
                      <button className="btn btn-rounded btn-outline btn-light mt-2 fs-3">
                        Check list
                      </button>
                    </div>
                    <div className="stats-icon text-end ms-auto">
                      <i className="ri-twitter-fill display-5 op-3 text-dark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats">
                      <h1 className="text-white">6509+</h1>
                      <h6 className="text-white">Facebook Likes</h6>
                      <button className="btn btn-rounded btn-outline btn-light mt-2 fs-3">
                        Check list
                      </button>
                    </div>
                    <div className="stats-icon text-end ms-auto">
                      <i className="ri-facebook-fill display-5 op-3 text-dark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats">
                      <h1 className="text-white">9062+</h1>
                      <h6 className="text-white">Subscribe</h6>
                      <button className="btn btn-rounded btn-outline btn-light mt-2 fs-3">
                        Check list
                      </button>
                    </div>
                    <div className="stats-icon text-end ms-auto">
                      <i className="ri-mail-line display-5 op-3 text-dark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <h4 className="card-title">
                      <span className="lstick d-inline-block align-middle" />To
                      Do list
                    </h4>
                    <div className="ms-auto">
                      <button className="btn btn-circle btn-success" data-bs-toggle="modal" data-bs-target="#myModal">
                        <i data-feather="plus" className="feather-sm" />
                      </button>
                    </div>
                  </div>
                  {/* -------------------------------------------------------------- */}
                  {/* To do list widgets */}
                  {/* -------------------------------------------------------------- */}
                  <div className="to-do-widget mt-3 common-widget scrollable" style={{height: '410px'}}>
                    {/* .modal for add task */}
                    <div className="modal fade" id="myModal" tabIndex={-1} role="dialog" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header d-flex">
                            <h4 className="modal-title">Add Task</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                          </div>
                          <div className="modal-body">
                            <form>
                              <div className="mb-3">
                                <label>Task name</label>
                                <input type="text" className="form-control" placeholder="Enter Task Name" />
                              </div>
                              <div className="mb-3">
                                <label>Assign to</label>
                                <select className="form-select form-control">
                                  <option selected>Sachin</option>
                                  <option value={1}>Sehwag</option>
                                </select>
                              </div>
                            </form>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                              Close
                            </button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                              Submit
                            </button>
                          </div>
                        </div>
                        {/* /.modal-content */}
                      </div>
                      {/* /.modal-dialog */}
                    </div>
                    {/* /.modal */}
                    <ul className="list-task todo-list list-group mb-0" data-role="tasklist">
                      <li className="list-group-item border-0 mb-0 py-3 pe-3 ps-0" data-role="task">
                        <div className="form-check form-check-inline w-100">
                          <input type="checkbox" className="form-check-input danger check-light-danger" id="inputSchedule" name="inputCheckboxesSchedule" />
                          <label htmlFor="inputSchedule" className="form-check-label font-weight-medium">
                            <span>Schedule meeting with</span><span className="badge bg-danger badge-pill ms-1">Today</span>
                          </label>
                        </div>
                        <ul className="assignedto list-style-none m-0 ps-4 ms-1 mt-1">
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/1.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Steave" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/2.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Jessica" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/3.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Priyanka" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/4.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Selina" className="rounded-circle" />
                          </li>
                        </ul>
                      </li>
                      <li className="list-group-item border-0 mb-0 py-3 pe-3 ps-0" data-role="task">
                        <div className="form-check form-check-inline w-100">
                          <input type="checkbox" id="inputCall" className="form-check-input info check-light-info" name="inputCheckboxesCall" />
                          <label htmlFor="inputCall" className="form-check-label font-weight-medium">
                            <span>Give Purchase report to</span>
                            <span className="badge bg-info badge-pill ms-1">Yesterday</span>
                          </label>
                        </div>
                        <ul className="assignedto m-0 ps-4 ms-1 mt-1">
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/3.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Priyanka" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/4.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Selina" className="rounded-circle" />
                          </li>
                        </ul>
                      </li>
                      <li className="list-group-item border-0 mb-0 py-3 pe-3 ps-0" data-role="task">
                        <div className="form-check form-check-inline w-100">
                          <input type="checkbox" id="inputBook" className="form-check-input primary check-light-primary" name="inputCheckboxesBook" />
                          <label htmlFor="inputBook" className="form-check-label font-weight-medium">
                            <span>Book flight for holiday</span><span className="badge bg-primary badge-pill ms-1">1
                              week</span>
                          </label>
                        </div>
                        <div className="fs-2 ps-3 d-inline-block ms-2">
                          26 jun 2021
                        </div>
                      </li>
                      <li className="list-group-item border-0 mb-0 py-3 pe-3 ps-0" data-role="task">
                        <div className="form-check form-check-inline w-100">
                          <input type="checkbox" id="inputForward" className="form-check-input warning check-light-warning" name="inputCheckboxesForward" />
                          <label htmlFor="inputForward" className="form-check-label font-weight-medium">
                            <span>Forward all tasks</span>
                            <span className="badge bg-warning badge-pill ms-1">2 weeks</span>
                          </label>
                        </div>
                        <div className="fs-2 ps-3 d-inline-block ms-2">
                          26 jun 2021
                        </div>
                      </li>
                      <li className="list-group-item border-0 mb-0 py-3 pe-3 ps-0" data-role="task">
                        <div className="form-check form-check-inline w-100">
                          <input type="checkbox" id="inputRecieve" className="form-check-input success check-light-success" name="inputCheckboxesRecieve" />
                          <label htmlFor="inputRecieve" className="form-check-label font-weight-medium">
                            <span>Recieve shipment</span><span className="badge bg-success badge-pill ms-1">2 weeks</span>
                          </label>
                        </div>
                        <ul className="assignedto list-style-none m-0 ps-4 ms-1 mt-1">
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/1.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Steave" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/2.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Jessica" className="rounded-circle" />
                          </li>
                          <li className="d-inline-block border-0 me-1">
                            <img src="/assets/images/users/3.jpg" alt="user" data-bs-toggle="tooltip" data-bs-placement="top" title data-original-title="Priyanka" className="rounded-circle" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body little-profile text-center">
                  <div className="my-3">
                    <img src="/assets/images/users/8.jpg" alt="user" width={128} className="rounded-circle shadow" />
                  </div>
                  <h3 className="mb-0">Angela Dominic</h3>
                  <h6 className="text-muted">Web Designer &amp; Developer</h6>
                  <ul className="list-inline social-icons mt-4">
                    <li className="list-inline-item">
                      <a href="#"><i className="ri-twitter-fill" /></a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#"><i className="ri-facebook-box-fill" /></a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#"><i className="ri-google-fill" /></a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#"><i className="ri-youtube-fill" /></a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#"><i className="ri-instagram-line" /></a>
                    </li>
                  </ul>
                </div>
                <div className="text-center bg-extra-light">
                  <div className="row">
                    <div className="col-6 p-3 border-right">
                      <h4 className="mb-0 font-weight-medium">1099</h4>
                      <small>Followers</small>
                    </div>
                    <div className="col-6 p-3">
                      <h4 className="mb-0 font-weight-medium">603</h4>
                      <small>Following</small>
                    </div>
                  </div>
                </div>
                <div className="card-body text-center">
                  <a href="#" className="mt-2 mb-3 waves-effect waves-dark btn btn-success btn-md btn-rounded">Follow me</a>
                </div>
              </div>
            </div>
          </div>
          {/* End row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex">
                    <h4 className="card-title">
                      <span className="lstick d-inline-block align-middle" />My
                      Contact
                    </h4>
                    <div className="dropdown ms-auto">
                      <a href="#" className="icon-options-vertical link" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" />
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li>
                          <a className="dropdown-item" href="#">Another action</a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">Something else here</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mailbox">
                    <div className="message-center contact-widget message-body position-relative" style={{height: '450px'}}>
                      <a href="#" className="message-item d-flex align-items-center border-bottom p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/1.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle online" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Pavan kumar
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">info@wrappixel.com</span>
                        </div>
                      </a>
                      {/* Message */}
                      <a href="#" className="message-item d-flex align-items-center border-bottom p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/2.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle busy" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Sonu Nigam
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">pamela1987@gmail.com</span>
                        </div>
                      </a>
                      {/* Message */}
                      <a href="#" className="message-item d-flex align-items-center border-bottom p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/3.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle away" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Arijit Sinh
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">cruise1298.fiplip@gmail.com</span>
                        </div>
                      </a>
                      {/* Message */}
                      <a href="#" className="message-item d-flex align-items-center border-bottom p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/4.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle offline" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Pavan kumar
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">kat@gmail.com</span>
                        </div>
                      </a>
                      {/* Message */}
                      <a href="#" className="message-item d-flex align-items-center border-bottom p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/2.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle busy" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Sonu Nigam
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">pamela1987@gmail.com</span>
                        </div>
                      </a>
                      {/* Message */}
                      <a href="#" className="message-item d-flex align-items-center p-3">
                        <span className="user-img position-relative d-inline-block">
                          <img src="/assets/images/users/1.jpg" alt="user" className="rounded-circle w-100" />
                          <span className="profile-status rounded-circle online" />
                        </span>
                        <div className="w-75 d-inline-block v-middle ps-3">
                          <h5 className="message-title mb-0 mt-1 font-weight-medium">
                            Pavan kumar
                          </h5>
                          <span className="fs-2 text-nowrap d-block time text-truncate text-bodycolor">info@wrappixel.com</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Feeds</h4>
                </div>
                <ul className="feeds ps-0">
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-info d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-info text-info btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0"><i data-feather="bell" className="feather-sm" /></a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">You have 4 pending tasks.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">Just Now</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-success d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-success text-success btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0"><i data-feather="database" className="feather-sm" /></a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">Server #1 overloaded</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">2 Hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-warning d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-warning text-warning btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0"><i data-feather="shopping-cart" className="feather-sm" /></a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">New order received.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">31 May</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-danger d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-danger text-danger btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0"><i data-feather="users" className="feather-sm" /></a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">New user registered.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">30 May</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-primary d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-primary text-primary btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0">
                          <i data-feather="users" className="feather-sm" />
                        </a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">New Version just arrived.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">27 May</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-info d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-info text-info btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0">
                          <i data-feather="bell" className="feather-sm" />
                        </a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">You have 4 pending tasks.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">30 May</span>
                      </div>
                    </div>
                  </div>
                  <div className="feed-item mb-2 py-2 ps-4 pe-3">
                    <div className="border-start border-2 border-primary d-md-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#" className="ms-3 btn btn-light-primary text-primary btn-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0">
                          <i data-feather="users" className="feather-sm" />
                        </a>
                        <div className="ms-3 text-truncate">
                          <span className="text-dark font-weight-medium">New Version just arrived.</span>
                        </div>
                      </div>
                      <div className="justify-content-end text-truncate ms-5 ms-md-auto ps-4 ps-md-0">
                        <span className="fs-2 text-muted">27 May</span>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
          {/* End row */}
          {/* Start row */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    <span className="lstick d-inline-block align-middle" />Recent Comments
                  </h4>
                </div>
                <div className="comment-widgets scrollable mb-2 common-widget" style={{height: '450px'}}>
                  {/* Comment Row */}
                  <div className="d-flex flex-row comment-row border-bottom p-3">
                    <div className="p-2">
                      <span className><img src="/assets/images/users/1.jpg" className="rounded-circle" alt="user" width={50} /></span>
                    </div>
                    <div className="comment-text w-100 p-3">
                      <h5 className="font-weight-medium">James Anderson</h5>
                      <p className="mb-1 fs-3 text-muted">
                        Lorem Ipsum is simply dummy text of the printing and
                        type etting industry
                      </p>
                      <div className="comment-footer d-md-flex align-items-center mt-2">
                        <span className="badge bg-light-info text-info rounded-pill font-weight-medium fs-1 py-1">Pending</span>
                        <span className="action-icons">
                          <a href="#" className="ps-3"><i className="ri-edit-box-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-check-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-heart-line fs-6" /></a>
                        </span>
                        <span className="text-muted ms-auto fw-normal fs-2">April 14, 2021</span>
                      </div>
                    </div>
                  </div>
                  {/* Comment Row */}
                  <div className="d-flex flex-row comment-row border-bottom active p-3">
                    <div className="p-2">
                      <span><img src="/assets/images/users/2.jpg" className="rounded-circle" alt="user" width={50} /></span>
                    </div>
                    <div className="comment-text active w-100 p-3">
                      <h5 className="font-weight-medium">Michael Jorden</h5>
                      <p className="mb-1 fs-3 text-muted">
                        Lorem Ipsum is simply dummy text of the printing and
                        type setting industry.
                      </p>
                      <div className="comment-footer d-md-flex align-items-center mt-2">
                        <span className="badge bg-light-success text-success rounded-pill font-weight-medium fs-1 py-1">Approved</span>
                        <span className="action-icons active">
                          <a href="#" className="ps-3"><i className="ri-edit-box-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-close-circle-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-heart-line fs-6 text-danger" /></a>
                        </span>
                        <span className="text-muted ms-auto fw-normal fs-2">April 14, 2021</span>
                      </div>
                    </div>
                  </div>
                  {/* Comment Row */}
                  <div className="d-flex flex-row comment-row border-bottom p-3">
                    <div className="p-2">
                      <span><img src="/assets/images/users/3.jpg" className="rounded-circle" alt="user" width={50} /></span>
                    </div>
                    <div className="comment-text w-100 p-3">
                      <h5 className="font-weight-medium">Johnathan Doeting</h5>
                      <p className="mb-1 fs-3 text-muted">
                        Lorem Ipsum is simply dummy text of the printing and
                        type setting industry.
                      </p>
                      <div className="comment-footer d-md-flex align-items-center mt-2">
                        <span className="badge bg-light-danger text-danger rounded-pill font-weight-medium fs-1 py-1">Rejected</span>
                        <span className="action-icons">
                          <a href="#" className="ps-3"><i className="ri-edit-box-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-check-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-heart-line fs-6" /></a>
                        </span>
                        <span className="text-muted ms-auto fw-normal fs-2">April 14, 2021</span>
                      </div>
                    </div>
                  </div>
                  {/* Comment Row */}
                  <div className="d-flex flex-row comment-row p-3">
                    <div className="p-2">
                      <span><img src="/assets/images/users/4.jpg" className="rounded-circle" alt="user" width={50} /></span>
                    </div>
                    <div className="comment-text w-100 p-3">
                      <h5 className="font-weight-medium">James Anderson</h5>
                      <p className="mb-1 fs-3 text-muted">
                        Lorem Ipsum is simply dummy text of the printing and
                        type setting industry.
                      </p>
                      <div className="comment-footer d-md-flex align-items-center mt-2">
                        <span className="badge bg-light-info text-info rounded-pill font-weight-medium fs-1 py-1">Pending</span>
                        <span className="action-icons">
                          <a href="#" className="ps-3"><i className="ri-edit-box-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-check-line fs-6" /></a>
                          <a href="#" className="ps-3"><i className="ri-heart-line fs-6" /></a>
                        </span>
                        <span className="text-muted ms-auto fw-normal fs-2">April 14, 2021</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    <span className="lstick d-inline-block align-middle" />Recent Chats
                  </h4>
                  <div className="chat-box scrollable" style={{height: '357px'}}>
                    {/*chat Row */}
                    <ul className="chat-list m-0 p-0">
                      {/*chat Row */}
                      <li className="mt-4">
                        <div className="chat-img d-inline-block align-top">
                          <img src="/assets/images/users/1.jpg" alt="user" className="rounded-circle" />
                        </div>
                        <div className="chat-content ps-3 d-inline-block">
                          <h5 className="text-muted fs-3 font-weight-medium">
                            James Anderson
                          </h5>
                          <div className="message font-weight-medium fs-3 bg-light-info d-inline-block mb-2 text-dark">
                            Lorem Ipsum is simply dummy text of the printing &amp;
                            type setting industry.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:56 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="mt-4">
                        <div className="chat-img d-inline-block align-top">
                          <img src="/assets/images/users/2.jpg" alt="user" className="rounded-circle" />
                        </div>
                        <div className="chat-content ps-3 d-inline-block">
                          <h5 className="text-muted fs-3 font-weight-medium">
                            Bianca Doe
                          </h5>
                          <div className="message font-weight-medium fs-3 bg-light-success d-inline-block mb-2 text-dark">
                            It’s Great opportunity to work.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:57 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="odd mt-4">
                        <div className="chat-content ps-3 d-inline-block text-end">
                          <div className="message font-weight-medium fs-3 bg-light-inverse d-inline-block mb-2 text-dark">
                            I would love to join the team.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:58 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="odd mt-4">
                        <div className="chat-content ps-3 d-inline-block text-end">
                          <div className="message font-weight-medium fs-3 bg-light-inverse d-inline-block mb-2 text-dark">
                            Whats budget of the new project.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:59 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="mt-4">
                        <div className="chat-img d-inline-block align-top">
                          <img src="/assets/images/users/3.jpg" alt="user" className="rounded-circle" />
                        </div>
                        <div className="chat-content ps-3 d-inline-block">
                          <h5 className="text-muted fs-3 font-weight-medium">
                            Angelina Rhodes
                          </h5>
                          <div className="message font-weight-medium fs-3 bg-light-primary d-inline-block mb-2 text-dark">
                            Well we have good budget for the project
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          11:00 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="mt-4">
                        <div className="chat-img d-inline-block align-top">
                          <img src="/assets/images/users/1.jpg" alt="user" className="rounded-circle" />
                        </div>
                        <div className="chat-content ps-3 d-inline-block">
                          <h5 className="text-muted fs-3 font-weight-medium">
                            James Anderson
                          </h5>
                          <div className="message font-weight-medium fs-3 bg-light-info d-inline-block mb-2 text-dark">
                            Lorem Ipsum is simply dummy text of the printing &amp;
                            type setting industry.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:56 am
                        </div>
                      </li>
                      {/*chat Row */}
                      <li className="odd mt-4">
                        <div className="chat-content ps-3 d-inline-block text-end">
                          <div className="message font-weight-medium fs-3 bg-light-inverse d-inline-block mb-2 text-dark">
                            Whats budget of the new project.
                          </div>
                        </div>
                        <div className="chat-time d-inline-block text-end fs-2 font-weight-medium">
                          10:59 am
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body border-top">
                  <div className="row">
                    <div className="col-8">
                      <textarea placeholder="Type your message here" className="form-control border-0" style={{resize: 'none'}} defaultValue={""} />
                    </div>
                    <div className="col-4 text-end">
                      <button type="button" className="btn btn-info btn-circle btn-lg">
                        <i data-feather="send" className />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End row */}
        </div>
        {/* -------------------------------------------------------------- */}
        {/* End Container fluid  */}
        

        <Footer />

    </div>
    </>
  )
}
