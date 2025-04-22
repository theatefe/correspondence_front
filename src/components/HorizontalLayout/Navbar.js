import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"

const Navbar = props => {
  const [dashboard, setdashboard] = useState(false)
  const [ui, setui] = useState(false)
  const [app, setapp] = useState(false)
  const [email, setemail] = useState(false)
  const [menu, setMenu] = useState(false)
  const [trafficManagement, setTrafficManagement] = useState(false)
  const [ecommerce, setecommerce] = useState(false)
  const [crypto, setcrypto] = useState(false)
  const [project, setproject] = useState(false)
  const [task, settask] = useState(false)
  const [contact, setcontact] = useState(false)
  const [blog, setBlog] = useState(false)
  const [job, setJob] = useState(false)
  const [candidate, setCandidate] = useState(false)
  const [component, setcomponent] = useState(false)
  const [form, setform] = useState(false)
  const [table, settable] = useState(false)
  const [chart, setchart] = useState(false)
  const [icon, seticon] = useState(false)
  const [map, setmap] = useState(false)
  const [extra, setextra] = useState(false)
  const [invoice, setinvoice] = useState(false)
  const [auth, setauth] = useState(false)
  const [utility, setutility] = useState(false)

  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    removeActivation(items)
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement
      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active")
        }
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    to="/dashboard"
                    className="nav-link dropdown-toggle arrow-none d-flex"
                  >
                    <i className="bx bx-home-circle font-size-22 me-2"></i>{" "}
                    <span className="">خانه</span>
                  </Link>
                </li>

                {/* <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault()
                      setapp(!app)
                    }}
                    className="nav-link dropdown-togglez arrow-none d-flex"
                  >
                    <i className="bx bx-message-square-dots me-2 font-size-22"></i>
                    {props.t("سرمایه انسانی")}{" "}
                    <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setemail(!email)
                        }}
                      >
                        {props.t("مدیریت تردد")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        <Link to="/email-inbox" className="dropdown-item">
                          {props.t("درخواست تصحیح اطلاعات تردد")}
                        </Link>
                        <Link to="/email-read" className="dropdown-item">
                          {props.t("Read Email")}
                        </Link>
                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault()
                              setemail(!email)
                            }}
                          >
                            <span key="t-email-templates">Templates</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: email,
                            })}
                          >
                            <Link
                              to="/email-template-basic"
                              className="dropdown-item"
                            >
                              {props.t("Basic Action")}
                            </Link>
                            <Link
                              to="/email-template-alert"
                              className="dropdown-item"
                            >
                              {props.t("Alert Email")}
                            </Link>
                            <Link
                              to="/email-template-billing"
                              className="dropdown-item"
                            >
                              {props.t("Billing Email")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setemail(!email)
                        }}
                      >
                        {props.t("Email")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        <Link to="/email-inbox" className="dropdown-item">
                          {props.t("Inbox")}
                        </Link>
                        <Link to="/email-read" className="dropdown-item">
                          {props.t("Read Email")}
                        </Link>
                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault()
                              setemail(!email)
                            }}
                          >
                            <span key="t-email-templates">Templates</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: email,
                            })}
                          >
                            <Link
                              to="/email-template-basic"
                              className="dropdown-item"
                            >
                              {props.t("Basic Action")}
                            </Link>
                            <Link
                              to="/email-template-alert"
                              className="dropdown-item"
                            >
                              {props.t("Alert Email")}
                            </Link>
                            <Link
                              to="/email-template-billing"
                              className="dropdown-item"
                            >
                              {props.t("Billing Email")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setemail(!email)
                        }}
                      >
                        {props.t("Email")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        <Link to="/email-inbox" className="dropdown-item">
                          {props.t("Inbox")}
                        </Link>
                        <Link to="/email-read" className="dropdown-item">
                          {props.t("Read Email")}
                        </Link>
                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault()
                              setemail(!email)
                            }}
                          >
                            <span key="t-email-templates">Templates</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: email,
                            })}
                          >
                            <Link
                              to="/email-template-basic"
                              className="dropdown-item"
                            >
                              {props.t("Basic Action")}
                            </Link>
                            <Link
                              to="/email-template-alert"
                              className="dropdown-item"
                            >
                              {props.t("Alert Email")}
                            </Link>
                            <Link
                              to="/email-template-billing"
                              className="dropdown-item"
                            >
                              {props.t("Billing Email")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to="/calendar" className="dropdown-item">
                      {props.t("Calendar")}
                    </Link>
                  </div>
                </li> */}

                <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault()
                      setapp(!app)
                    }}
                    className="nav-link dropdown-togglez arrow-none d-flex"
                  >
                    <i className="bx bx-message-square-dots me-2 font-size-22"></i>
                    {props.t("ارتباطات سازمانی")}{" "}
                    <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setemail(!email)
                        }}
                      >
                        {props.t("مدیریت مکاتبات")}{" "}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault()
                              setMenu(!menu)
                            }}
                          >
                            <span key="t-email-templates">فهرست ها</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: menu,
                            })}
                          >
                            <Link
                              to="/letterCartabl"
                              className="dropdown-item"
                            >
                              {props.t("نامه")}
                            </Link>
                            {/* <Link
                              to="/email-template-alert"
                              className="dropdown-item"
                            >
                              {props.t("پیام")}
                            </Link> */}
                          </div>
                        </div>
                        {/* <Link to="/issuedletternew" className="dropdown-item">
                          {props.t("نامه صادره")}
                        </Link> */}
                        <Link to="/letternew" className="dropdown-item">
                          {props.t("نامه داخلی")}
                        </Link>
                        {/* <Link to="/email-read" className="dropdown-item">
                          {props.t("پیام")}
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)