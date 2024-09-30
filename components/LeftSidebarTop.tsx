import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "./context/themeContext";
// import { FaFontAwesome } from "react-icons/fa";
import { useRouter } from "next/router";
import { getCookie } from "../utils/Cookie";

export default function LeftSidebarTop() {
  const context = useContext(ThemeContext);

  const { permission, settingsObj } = context;
  const { pathname } = useRouter();

  const [moduleAccess, setModuleAccess] = useState<any>([]);
  useEffect(() => {
    const getModulesPermissions = async () => {
      const { modules } = await getCookie("permissions");
      if (modules !== "" && modules !== undefined) {
        setModuleAccess(modules);
      }
    };
    getModulesPermissions();
  }, []);

  return (
    <>
      <aside
        className={`left-sidebar ${
          pathname === "/modules/restaurant/food-order/create-inv"
            ? "d-none"
            : ""
        }`}
        style={{
          backgroundColor: settingsObj?.sidebar_bg,
          color: settingsObj?.text_color,
          position: settingsObj?.fixed_Sidebar,
        }}
      >
        <div className="scroll-sidebar">
          <nav className="sidebar-nav">
            <ul
              id="sidebarnav"
              style={{ backgroundColor: settingsObj?.sidebar_bg }}
            >
              {/* HRM */}
              {moduleAccess.includes("hrm") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("hrm.management") ? "" : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-account-key"
                    />
                    <span className="hide-menu">HRM</span>
                  </a>

                  <ul aria-expanded="false" className="collapse first-level">
                    {/* Employee */}
                    <li
                      className="sidebar-item"
                      style={{ color: settingsObj?.text_color }}
                    >
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Employee</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className={`sidebar-item`}>
                          {permission.includes("hrm.employee.create") && (
                            <Link href="/modules/hr/employee/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Add Employee</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className={`sidebar-item`}>
                          {permission.includes("hrm.employee.list") && (
                            <Link href="/modules/hr/employee">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">All Employees</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Employee */}
                    {/* Payroll */}

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Manage Payroll</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className={"sidebar-item"}>
                          {permission.includes("hrm.department.list") && (
                            <Link href="/modules/hr/payroll/salary">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Salary</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    {/* End Payroll */}
                    {/* Department */}

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Manage Department</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className={"sidebar-item"}>
                          {permission.includes("hrm.department.list") && (
                            <Link href="/modules/hr/department/list">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  All Departments
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    {/* End Department */}
                    {/* Designation */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Designation</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes("hrm.designation.list") && (
                            <Link href="/modules/hr/designation">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Manage Designations
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Designation */}
                    {/* Holidays */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Holidays</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes("hrm.holiday.create") && (
                            <Link href="/modules/hr/holidays/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Add Holiday</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes("hrm.holiday.list") && (
                            <Link href="/modules/hr/holidays">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">All Holidays</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Holidays */}
                    {/* Leave Categories */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Leave Categories</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes("hrm.leave.create") && (
                            <Link href="/modules/hr/leaveCategories/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Add Leave</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes("hrm.leave.list") && (
                            <Link href="/modules/hr/leaveCategories">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">All Leaves</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Leave Categories */}
                    {/* Leave Applications */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Leave Applications</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "hrm.leave.application.application"
                          ) && (
                            <Link href="/modules/hr/leaveApplications">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Applications</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes("hrm.my.applications") && (
                            <Link href="/modules/hr/leaveApplications/myApplications">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  My Applications
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "hrm.leave.application.new.application"
                          ) && (
                            <Link href="/modules/hr/leaveApplications/addLeaveApplication">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  New Application
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "hrm.leave.application.create.employee.leave"
                          ) && (
                            <Link href="/modules/hr/leaveApplications/addEmployeesLeave">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Add Leave</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Leave Applications */}

                    {/* loan applications */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Loan Applications</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          <Link href="/modules/hr/loanApplications/createLoanApplication">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">
                                Create Loan Applications
                              </span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/hr/loanApplications">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">
                                Manage Loan Applications
                              </span>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {/* loan applications */}
                    {/* Duty Roster */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Duty Roster</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes("hrm.roster.list") && (
                            <Link href="/modules/dutyManagement/roster">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Rosters</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes("hrm.shift.list") && (
                            <Link href="/modules/dutyManagement/shift">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Shifts</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    {/* End Duty Roster */}
                    {/* start employee attendance */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Attendance</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/dashboard">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Dashboard</span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/entry">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Entry</span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/monthly">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Monthly</span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/missing">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Missing</span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/reports/late_and_early">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Late & Early</span>
                            </a>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link href="/modules/attendance/log">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Log</span>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {/* end employee attendance */}

                    {/* Roster Assignments */}
                    <li className="sidebar-item">
                      {permission.includes("hrm.roster.assignments") && (
                        <Link href="/modules/dutyManagement/assignment">
                          <a
                            className="sidebar-link waves-effect waves-dark sidebar-link"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-cube-send" />
                            <span className="hide-menu">
                              Roster Assignments
                            </span>
                          </a>
                        </Link>
                      )}
                    </li>

                    <li className="sidebar-item">
                      {permission.includes("hrm.roster.assignments") && (
                        <Link href="/modules/channel">
                          <a
                            className="sidebar-link waves-effect waves-dark sidebar-link"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-cube-send" />
                            <span className="hide-menu">Channel</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    {/* End Roster Assignments */}
                  </ul>
                </li>
              )}
              {/* End HRM */}

              {/* Customer Management */}
              {moduleAccess.includes("customer") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("customer.management") ? "" : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-account-multiple"
                    />
                    <span className="hide-menu">Clients</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      {permission.includes("customer.customer.list") && (
                        <Link href="/modules/customer">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">
                              Individual Clients
                            </span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes(
                        "customer.corporate.client.list"
                      ) && (
                        <Link href="/modules/customer/client">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Corporate Clients</span>
                          </a>
                        </Link>
                      )}
                    </li>
                  </ul>
                </li>
              )}
              {/* End Customers */}

              {/* Bookings */}
              {moduleAccess.includes("booking") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("booking&room.management")
                      ? ""
                      : "d-none"
                  }`}
                >
                  <a
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                    style={{ color: settingsObj?.text_color }}
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-cart-plus"
                    />
                    <span className="hide-menu">Booking</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      {permission.includes("booking&rooms.create.booking") && (
                        <Link href="/modules/bookings/create">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Create Booking</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("booking&create.booking.list") && (
                        <Link href="/modules/bookings/all-booking">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">All Bookings</span>
                          </a>
                        </Link>
                      )}
                    </li>

                    {/* manage room services */}
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Room Services</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "booking&room.room.tower.list"
                          ) && (
                            <Link href="/modules/bookings/room-service/addNewRoomService">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Add New Room-Service-Inv
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "booking&room.room.categories.list"
                          ) && (
                            <Link href="/modules/bookings/room-service/view-all-inv">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drupal" />
                                <span className="hide-menu">
                                  View All Room-Service-Inv
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    <li className="sidebar-item">
                      <Link href="/modules/facilities">
                        <a className="sidebar-link">
                          <i className="mdi mdi-drawing" />
                          <span className="hide-menu">Manage Facilities</span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* Bookings */}

              {/* Restaurant */}
              {moduleAccess.includes("restaurant") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("restaurant.management") ? "" : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-food-fork-drink"
                    />
                    <span className="hide-menu">Restaurant</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      {permission.includes("restaurant.invoice.create") && (
                        <Link href="/modules/restaurant/food-order/create-inv">
                          <a target="_blank" className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Create Invoice</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("restaurant.invoice.list") && (
                        <Link href="/modules/restaurant/food-order">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Manage Invoices</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("restaurant.food.list") && (
                        <Link href="/modules/restaurant/foods">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Manage Foods</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("restaurant.set-menu.list") && (
                        <Link href="/modules/restaurant/setmenus">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Manage Set-menus</span>
                          </a>
                        </Link>
                      )}
                    </li>

                    <li className="sidebar-item">
                      {permission.includes("restaurant.categories.list") && (
                        <Link href="/modules/restaurant/categories">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Categories</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("restaurant.menu.type.list") && (
                        <Link href="/modules/restaurant/menu-types">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Menu Types</span>
                          </a>
                        </Link>
                      )}
                    </li>

                    <li className="sidebar-item">
                      <Link href="/modules/restaurant/table">
                        <a className="sidebar-link">
                          <i className="mdi mdi-drawing" />
                          <span className="hide-menu">Manage Table</span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* End Restaurant */}

              {/* Housekeeping */}
              {moduleAccess.includes("housekeeping") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("housekeeping.management")
                      ? ""
                      : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-apple-safari"
                    />
                    <span className="hide-menu">Housekeeping</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      {permission.includes("housekeeping.task.list") && (
                        <Link href="/modules/housekeeping/task">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Tasks</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("housekeeping.housekeeper.list") && (
                        <Link href="/modules/housekeeping/managehousekeepers">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Housekeepers</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("housekeeping.assign.task") && (
                        <Link href="/modules/housekeeping/assignhousekeeper">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Assign Task</span>
                          </a>
                        </Link>
                      )}
                    </li>
                    <li className="sidebar-item">
                      {permission.includes("housekeeping.housekeeper.task") && (
                        <Link href="/modules/housekeeping/housekeepers/tasks">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Housekeeper Tasks</span>
                          </a>
                        </Link>
                      )}
                    </li>
                  </ul>
                </li>
              )}
              {/* End Housekeeping */}

              {/* laundry system start */}
              {moduleAccess.includes("laundry") && (
                <li className="sidebar-item">
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-tshirt-crew"
                    />
                    <span className="hide-menu">Laundry</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      {permission.includes(
                        "housekeeping.laundry.operator.list"
                      ) && (
                        <Link href="/modules/housekeeping/managelaundryoperator">
                          <a className="sidebar-link">
                            <span className="hide-menu">
                              All Laundry Operator
                            </span>
                          </a>
                        </Link>
                      )}
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <span className="hide-menu">Voucher</span>
                      </a>

                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.voucher.voucher.create"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/laundryVouchers/Invoice/inv-item">
                              <a className="sidebar-link">
                                <span className="hide-menu">
                                  Create Voucher
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>

                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.voucher.voucher.list"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/laundryVouchers">
                              <a className="sidebar-link">
                                <span className="hide-menu">All Voucher</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <span className="hide-menu">
                          Laundry Receive Back-slip
                        </span>
                      </a>

                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.receive.back.slip.create"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/laundryReceiveBackSlip/createlaundryReceiveBackSlip/rcv-back">
                              <a className="sidebar-link">
                                <span className="hide-menu">
                                  Create Laundry Receive
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>

                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.receive.back.slip.list"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/laundryReceiveBackSlip/laundryReceiveBackSlipManage/manage_rcv_back">
                              <a className="sidebar-link">
                                <span className="hide-menu">
                                  Manage Laundry Receive
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <span className="hide-menu">Payment</span>
                      </a>

                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.payment.create"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/payment/create">
                              <a className="sidebar-link">
                                <span className="hide-menu">Make Payment</span>
                              </a>
                            </Link>
                          )}
                        </li>

                        <li className="sidebar-item">
                          {permission.includes(
                            "housekeeping.laundry.manage.payment.list"
                          ) && (
                            <Link href="/modules/housekeeping/managelaundryoperator/payment">
                              <a className="sidebar-link">
                                <span className="hide-menu">
                                  Manage Payment
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              )}
              {/* laundry system end */}

              {/* New Locker */}
              {moduleAccess.includes("locker") && (
                <li className="sidebar-item">
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-server"
                    />
                    <span className="hide-menu">Locker</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      <Link href="/modules/locker/create">
                        <a className="sidebar-link">
                          <i className="mdi mdi-format-align-left"></i>
                          <span className="hide-menu">Create Locker</span>
                        </a>
                      </Link>
                    </li>

                    <li className="sidebar-item">
                      <Link href="/modules/locker">
                        <a className="sidebar-link">
                          <i className="mdi mdi-format-align-left"></i>
                          <span className="hide-menu">All Locker</span>
                        </a>
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link href="/modules/locker/entry/create">
                        <a className="sidebar-link">
                          <i className="mdi mdi-format-align-left"></i>
                          <span className="hide-menu">Locker Entry</span>
                        </a>
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link href="/modules/locker/entry">
                        <a className="sidebar-link">
                          <i className="mdi mdi-format-align-left"></i>
                          <span className="hide-menu">All Entry</span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* Locker Entry */}

              {/* Start Transport */}
              {moduleAccess.includes("transport") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("transportation.management")
                      ? ""
                      : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-car-connected"
                    />
                    <span className="hide-menu">Transport</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Vehicles</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "transportation.vehicles.vehicle.list"
                          ) && (
                            <Link href="/modules/transport/vehicles">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Manage Vehicles
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Drivers</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "transportation.driver.driver.list"
                          ) && (
                            <Link href="/modules/transport/drivers">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Manage Drivers
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Vehicle Booking</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          <Link href="/modules/transport/vehiclesBooking/createVehiclesBooking">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">
                                Create Vehicle Booking
                              </span>
                            </a>
                          </Link>
                        </li>

                        <li className="sidebar-item">
                          {/* manageVehiclesBooking */}
                          <Link href="/modules/transport/vehiclesBooking/manageVehiclesBooking">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Manage Booking</span>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              )}
              {/* End Transport */}

              {/* Stock */}
              {moduleAccess.includes("stock") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("purchase.stock.manage") ? "" : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-chart-areaspline"
                    />
                    <span className="hide-menu">Stock</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Manage Warehouse</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.warehouse.warehouse.list"
                          ) && (
                            <Link href="/modules/inventory/warehouses">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  All Warehouses
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.warehouse.location"
                          ) && (
                            <Link href="/modules/inventory/warehouses/location">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drupal" />
                                <span className="hide-menu">Locations</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Manage Inventory</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.manage.inventory.categories.list"
                          ) && (
                            <Link href="/modules/inventory/categories">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Manage Categories
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.manage.inventory.item.list"
                          ) && (
                            <Link href="/modules/inventory/items">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drupal" />
                                <span className="hide-menu">Manage Items</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Consumption</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.consumption.voucher.create"
                          ) && (
                            <Link href="/modules/inventory/vouchers/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Create Voucher
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "inventory.consumption.voucher.list"
                          ) && (
                            <Link href="/modules/inventory/vouchers">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drupal" />
                                <span className="hide-menu">All Vouchers</span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <Link href="/modules/stock">
                        <a className="sidebar-link">
                          <i className="mdi mdi-drawing" />
                          <span className="hide-menu">Stock Report</span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* End Stock */}

              {/* Accounting */}
              {moduleAccess.includes("accounts") && (
                <li
                  className={`sidebar-item ${
                    permission.includes("accounting.management") ? "" : "d-none"
                  }`}
                >
                  <a
                    style={{ color: settingsObj?.text_color }}
                    className="sidebar-link has-arrow waves-effect waves-dark"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-expanded="false"
                  >
                    <i
                      style={{ color: settingsObj?.text_color }}
                      className="mdi mdi-bank"
                    />
                    <span className="hide-menu">Accounts</span>
                  </a>
                  <ul aria-expanded="false" className="collapse first-level">
                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">Hotel Accounts</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.account.create"
                          ) && (
                            <Link href="/modules/accounts/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Add Account</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.account.list"
                          ) && (
                            <Link href="/modules/accounts">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">All Account</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.fund.transfer"
                          ) && (
                            <Link href="/modules/accounts/transfer">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">Fund Transfer</span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.adjust.balance"
                          ) && (
                            <Link href="/modules/accounts/adjustment-balance">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Adjust Balance
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.transfer.list"
                          ) && (
                            <Link href="/modules/accounts/transfer/list">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Transfer Slips
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.hotel.account.adjustment.list"
                          ) && (
                            <Link href="/modules/accounts/adjustment-balance/list">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Adjustment Lists
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                      </ul>
                    </li>

                    <li className="sidebar-item">
                      <a
                        className="sidebar-link has-arrow waves-effect waves-dark"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dns" />
                        <span className="hide-menu">General Accounting</span>
                      </a>
                      <ul
                        aria-expanded="false"
                        className="collapse second-level"
                      >
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.general.account.account.sector"
                          ) && (
                            <Link href="/modules/accounts/sector">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Account Sector
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.general.account.voucher.create"
                          ) && (
                            <Link href="/modules/accounts/vouchers/create">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Create Voucher
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.general.account.voucher.list"
                          ) && (
                            <Link href="/modules/accounts/vouchers">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Manage Voucher
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.general.account.account.ledger"
                          ) && (
                            <Link href="/modules/accounts/ledger">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Account Ledger
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>
                        <li className="sidebar-item">
                          {permission.includes(
                            "account.general.account.account.ledger"
                          ) && (
                            <Link href="/modules/accounts/payment/voucher">
                              <a className="sidebar-link">
                                <i className="mdi mdi-drawing" />
                                <span className="hide-menu">
                                  Payment Vouchers
                                </span>
                              </a>
                            </Link>
                          )}
                        </li>

                        <li className="sidebar-item">
                          <Link href="/modules/accounts/general-ledger">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">General Ledger</span>
                            </a>
                          </Link>
                        </li>

                        <li className="sidebar-item">
                          <Link href="/modules/accounts/statement">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drawing" />
                              <span className="hide-menu">Statement</span>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              )}
              {/* End Accounting */}

              {/* suppliers, purchase, pricing, manage rooms */}
              {moduleAccess.includes("purchase") && (
                <li className="nav-small-cap">
                  <i className="mdi mdi-dots-horizontal" />
                  <span className="hide-menu">Purchase</span>
                </li>
              )}

              <li className="sidebar-item mega-dropdown">
                <a
                  className="sidebar-link has-arrow waves-effect waves-dark"
                  href="#"
                  aria-expanded="false"
                >
                  <i
                    style={{ color: settingsObj?.text_color }}
                    className="mdi mdi-view-module"
                  />
                  <span
                    className="hide-menu"
                    style={{ color: settingsObj?.text_color }}
                  >
                    More
                  </span>
                </a>
                <ul aria-expanded="false" className="collapse first-level">
                  <li className="sidebar-item">
                    <a href="ui-accordian.html" className="sidebar-link">
                      <i className="mdi mdi-layers" />
                      <span className="hide-menu">
                        <strong>Purchase</strong>
                      </span>
                    </a>
                  </li>

                  <li className="sidebar-item">
                    <a href="ui-badge.html" className="sidebar-link">
                      <i className="mdi mdi-layers" />
                      <span className="hide-menu">
                        <strong>Supplier</strong>
                      </span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="ui-buttons.html" className="sidebar-link">
                      <i className="mdi mdi-layers" />
                      <span className="hide-menu">
                        <strong>Room Pricing</strong>
                      </span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="ui-dropdowns.html" className="sidebar-link">
                      <i className="mdi mdi-layers" />
                      <span className="hide-menu">
                        <strong>Manage Rooms</strong>
                      </span>
                    </a>
                  </li>
                  {/* menu list */}
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/invoice/inv-item">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Create Invoice</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/supplier/create">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Add Supplier</span>
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`sidebar-item ${
                      permission.includes("booking&room.room.tower.list")
                        ? ""
                        : "d-none"
                    }`}
                  >
                    <Link href="/modules/roomManagement/roomPrice">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Regular Price</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/roomManagement/tower">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Manage Towers</span>
                      </a>
                    </Link>
                  </li>

                  <li className="sidebar-item">
                    <Link href="/modules/purchase/invoice">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Manage Invoices</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/supplier">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">All Suppliers</span>
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`sidebar-item ${
                      permission.includes("booking&room.room.tower.list")
                        ? ""
                        : "d-none"
                    }`}
                  >
                    <Link href="/modules/roomManagement/manageHourlyPricing/hourlyPricing">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Hourly Price</span>
                      </a>
                    </Link>
                  </li>

                  <li className="sidebar-item">
                    <Link href="/modules/roomManagement/roomCategory">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Room Categories</span>
                      </a>
                    </Link>
                  </li>

                  <li className="sidebar-item">
                    <Link href="/modules/purchase/return">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Retuned Invoices</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/supplier/payment/create">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Make Payment</span>
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`sidebar-item ${
                      permission.includes("booking&room.room.tower.list")
                        ? ""
                        : "d-none"
                    }`}
                  >
                    <Link href="/modules/roomManagement/manageHourlyPricing">
                      <a
                        className="sidebar-link waves-effect waves-dark sidebar-link"
                        href="#"
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Time Slots</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/roomManagement/roomType">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Room Types</span>
                      </a>
                    </Link>
                  </li>

                  <li className="sidebar-item">
                    <Link href="">
                      <a className="sidebar-link">
                        {/* <i style={{color:settingsObj?.text_color}} className="mdi mdi-layers" /> */}
                        <span className="hide-menu"></span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/supplier/payment">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Payment Slips</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="">
                      <a className="sidebar-link">
                        {/* <i style={{color:settingsObj?.text_color}} className="mdi mdi-layers" /> */}
                        <span className="hide-menu"></span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/roomManagement/roomFacility">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Room Facilities</span>
                      </a>
                    </Link>
                  </li>

                  <li className="sidebar-item">
                    <Link href="">
                      <a className="sidebar-link">
                        {/* <i style={{color:settingsObj?.text_color}} className="mdi mdi-layers" /> */}
                        <span className="hide-menu"></span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/modules/purchase/supplier/ledger">
                      <a className="sidebar-link">
                        <i className="mdi mdi-layers" />
                        <span className="hide-menu">Supplier Ledger</span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="">
                      <a className="sidebar-link ">
                        {/* <i style={{color:settingsObj?.text_color}} className="mdi mdi-layers" /> */}
                        <span className="hide-menu"></span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="">
                      <a className="sidebar-link ">
                        <span className="hide-menu"></span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* end suppliers, purchase, pricing, manage rooms */}

              {/* General Settings */}

              <li
                className={`sidebar-item d-none ${
                  permission.includes("setting.management") ? "" : "d-none"
                }`}
              >
                <a
                  className="sidebar-link has-arrow waves-effect waves-dark"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-expanded="false"
                >
                  <i className="mdi mdi-image-filter-vintage"></i>
                  <span className="hide-menu">Settings</span>
                </a>
                <ul aria-expanded="false" className="collapse first-level">
                  <li className="sidebar-item">
                    <a
                      className="sidebar-link has-arrow waves-effect waves-dark"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-expanded="false"
                    >
                      <i data-feather="settings" className="feather-icon" />
                      <span className="hide-menu">Website Configuration</span>
                    </a>
                    <ul aria-expanded="false" className="collapse second-level">
                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/sliders">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Sliders</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/slides">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Slides</span>
                          </a>
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/section">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Home Page</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/pages/about_us_page/create">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">About-Us Page</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/gallery">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Gallery Page</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/pages/privacy-policy">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Privacy Policy</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/pages/terms_&_condition">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Terms & Condition</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/pages/return-&-refund">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Return & Refund</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/contact_us">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Contact Us</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/website-configuration/review">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Review</span>
                          </a>
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link href="/modules/facilities">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">Common Facilities</span>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="sidebar-item">
                    <a
                      className="sidebar-link has-arrow waves-effect waves-dark"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-expanded="false"
                    >
                      <i data-feather="settings" className="feather-icon" />
                      <span className="hide-menu">Roles & Permissions</span>
                    </a>
                    <ul aria-expanded="false" className="collapse second-level">
                      <li className="sidebar-item">
                        {/* {permission.includes("setting.roles.list") && */}
                        <Link href="/admin/role/all-roles">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drawing" />
                            <span className="hide-menu">All Roles</span>
                          </a>
                        </Link>
                        {/* } */}
                      </li>
                      <li className="sidebar-item">
                        <Link href="/admin/permission">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">Create Permission</span>
                          </a>
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        {/* {permission.includes("setting.permission.list") && */}
                        <Link href="/admin/permission/all-permissions">
                          <a className="sidebar-link">
                            <i className="mdi mdi-drupal" />
                            <span className="hide-menu">All Permissions</span>
                          </a>
                        </Link>
                        {/* }  */}
                      </li>
                      <li className="sidebar-item">
                        {permission.includes("setting.permission.treeview") && (
                          <Link href="/admin/role/all-permissions">
                            <a className="sidebar-link">
                              <i className="mdi mdi-drupal" />
                              <span className="hide-menu">
                                TreeView Permissions
                              </span>
                            </a>
                          </Link>
                        )}
                      </li>
                    </ul>
                  </li>

                  <li className="sidebar-item">
                    <Link href="/admin/general-setting">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> General Settings </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/currency-settings">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Currency Settings </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/information">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Hotel Info </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/email">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Email Configuration </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/promo-offers">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Manage Promo Offers </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/tax">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Tax Management </span>
                      </a>
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link href="/admin/service">
                      <a className="sidebar-link">
                        <i data-feather="settings" className="feather-icon" />
                        <span className="hide-menu"> Service Charge </span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </li>

               {/* End General Settings */}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
