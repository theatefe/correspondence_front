import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import { NotificationContainer, NotificationManager } from "react-notifications"
import "react-notifications/lib/notifications.css"
import datetime from "persian-time-ago"

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../../assets/images/users/avatar-4.jpg"

//i18n
import { withTranslation } from "react-i18next"

const NotificationDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const token = localStorage.getItem("token")
  const [menu, setMenu] = useState(false)
  const [loading, setLoading] = React.useState()
  const [msgList, setMsgList] = React.useState([])
  const [letterList, setLetterList] = React.useState([])
  const [msgCount, setMsgCount] = React.useState()
  const [notifCount, setNotifCount] = React.useState()
  const [letterCount, setLetterCount] = React.useState()
  const [userInfo, setUserInfo] = React.useState({})
  const [notifications, setNotifications] = useState([])
  const [showingNotificationTitle, setShowingNotificationTitle] =
    useState(false)

  const sendNotification = () => {
    const newNotification = {
      id: new Date().getTime(),
      message: "New Notification",
    }

    setNotifications(prevNotifications => [
      newNotification,
      ...prevNotifications.slice(0, 4),
    ])

    // Display notification
    NotificationManager.info(newNotification.message, "Title", 3000)
  }

  useEffect(() => {
    setLoading(true)
    setLoading(false)
    //sendNotification()
  }, [])

  // useEffect(() => {
  //   return () => {
  //     setNotifications([])
  //   }
  // }, [])

  // useEffect(() => {
  //   const originalTitle = document.title
  //   const originalFavicon = document.querySelector('link[rel="icon"]').href

  //   const showNotificationTitle = () => {
  //     document.title = ` اعلان جدید(${msgCount + letterCount})`
  //     // document.querySelector('link[rel="icon"]').href =
  //     //   "path/to/notification-favicon.png"
  //   }

  //   const resetTitleAndFavicon = () => {
  //     document.title = originalTitle
  //     document.querySelector('link[rel="icon"]').href = originalFavicon
  //   }

  //   if (msgCount + letterCount > 0 && showingNotificationTitle) {
  //     // Show notification title and favicon for 2 seconds when there are notifications
  //     showNotificationTitle()
  //     setTimeout(resetTitleAndFavicon, 2000)
  //   }
  // }, [showingNotificationTitle, notifications])

  // useEffect(() => {
  //   // Set up interval to toggle showingNotificationTitle every 2 seconds
  //   const intervalId = setInterval(() => {
  //     setShowingNotificationTitle(prevState => !prevState)
  //   }, 2000)

  //   // Clear interval when component unmounts
  //   return () => {
  //     clearInterval(intervalId)
  //   }
  // }, [])

  return !loading ? (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada text-white d-lg-none" />
          <i className="bx bx-bell bx-tada d-none d-lg-block" />
          <span className="badge bg-danger rounded-pill">
            {msgCount + letterCount > 0 ? msgCount + letterCount : ""}
          </span>
        </DropdownToggle>

        {msgCount + letterCount > 0 ? (
          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0"> {props.t("اعلان های جدید")} </h6>
                </Col>
                <div className="col-auto">
                  <Link to={"/notifications"} className="small">
                    {" "}
                    مشاهده همه
                  </Link>
                </div>
              </Row>
            </div>

            <SimpleBar
              style={{ height: "auto", maxHeight: "250px", overflowY: "auto" }}
            >
              {msgList &&
                msgList.map((item, index) => {
                  return (
                    <Link
                      to={`/view-messages/${item.id}`}
                      className="text-reset notification-item"
                      key={index}
                      onClick={() => setMenu(false)}
                    >
                      <div className="d-flex">
                        <div className="avatar-xs me-3">
                          <span className="avatar-title bg-primary rounded-circle font-size-18">
                            <i className="bx bx-message-rounded-dots" />
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mt-0 mb-1">{item.sender}</h6>
                          <div className="font-size-12 text-muted">
                            <p className="mb-1">{item.title}</p>
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline" />{" "}
                              {item.createDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              {letterList &&
                letterList.map((item, index) => {
                  return (
                    <Link
                      to={`/detail-letter/${item.id}`}
                      className="text-reset notification-item"
                      key={index}
                      onClick={() => setMenu(false)}
                    >
                      <div className="d-flex">
                        <div className="avatar-xs me-3">
                          <span className="avatar-title bg-primary rounded-circle font-size-18">
                            <i className="bx bx-file" />
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mt-0 mb-1">{item.sender}</h6>
                          <div className="font-size-12 text-muted">
                            <p className="mb-1">{item.title}</p>
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline" />{" "}
                              {item.createDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </SimpleBar>
            <div className="p-2 border-top d-grid">
              <Link
                className="btn btn-sm btn-link font-size-14 text-center"
                to="#"
              >
                <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
                <span key="t-view-more">{props.t("مشاهده همه...")}</span>
              </Link>
            </div>
          </DropdownMenu>
        ) : (
          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
            <div className="p-3 bg-muted">
              <Row>
                <Col className="text-center pb-2 pt-2">
                  <h6 className="m-0"> {props.t("اعلان جدید وجود ندارد.")} </h6>
                </Col>
              </Row>
            </div>
          </DropdownMenu>
        )}
      </Dropdown>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default withTranslation()(NotificationDropdown)

NotificationDropdown.propTypes = {
  t: PropTypes.any,
}
