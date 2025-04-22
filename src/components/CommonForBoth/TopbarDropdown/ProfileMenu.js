import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"

// users
import user1 from "../../../assets/images/users/avatar.png"

const ProfileMenu = props => {
  const [menu, setMenu] = useState(false)
  const [UserInfo, setUserInfo] = useState({})
  // useEffect
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo")

    if (storedUserInfo) {
      // تبدیل داده به شیء جاوااسکریپت
      setUserInfo(JSON.parse(storedUserInfo))
    }
  }, [props.success])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">
            {UserInfo.name + " " + UserInfo.lastName}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("پروفایل کاربری")}{" "}
          </DropdownItem>
            {/* <Link to="/forgot-password" className="dropdown-item">
              <i className="bx bx-lock-open font-size-16 align-middle me-1" />
              <span>{props.t("تغییر رمز عبور")}</span>
            </Link> */}
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("خروج")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
