import React, { useState } from "react"
import PropTypes from "prop-types"

import { connect } from "react-redux"

import { Link } from "react-router-dom"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  changeLayoutMode,
} from "../../store/actions"
// reactstrap

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

// api
import CountInboxLetter from "api/user/letter/CountInboxLetter"
// images
import logo from "../../assets/images/talie-logo.png"
import logoLight from "../../assets/images/talie-logo.png"
import logoLightSvg from "../../assets/images/talie-logo.png"
import logoDark from "../../assets/images/talie-logo.png"

//i18n
import { withTranslation } from "react-i18next"

const Header = props => {
  const token = localStorage.getItem("token")
  const [countNewLetters, setCountNewLetters] = React.useState(0)
  // get count inbox list ***********
  const getCountInboxList = async () => {
    const inboxResult = await CountInboxLetter(token)
    setCountNewLetters(inboxResult.data)
  }
  // use effect *********************
  React.useEffect(() => {
    setInterval(() => getCountInboxList(), 1000)
  }, [])
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="65" />
                </span>
              </Link>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="50" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="50" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu)
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars text-white" />
            </button>
          </div>

          <div className="d-flex">
            {/* <NotificationDropdown /> */}

            <div className="dropdown d-inline-block mt-1">
              <Link to={`/letterCartabl`}>
                <button
                  type="button"
                  className="btn header-item noti-icon right-bar-toggle position-relative"
                >
                  <i className="bx bxs-inbox" />
                  {countNewLetters > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill bg-primary"
                      style={{
                        fontSize: "0.70rem",
                        marginTop: "10px",
                        marginLeft: "30px",
                        paddingTop: "3px",
                      }}
                    >
                      {countNewLetters > 10 ? "10+" : countNewLetters}
                    </span>
                  )}
                </button>
              </Link>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  changeLayoutMode: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout
  return { layoutType, showRightSidebar, leftMenu }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeLayoutMode,
})(withTranslation()(Header))
