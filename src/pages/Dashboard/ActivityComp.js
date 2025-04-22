import React from "react"
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap"
import { Link } from "react-router-dom"
import moment from "jalali-moment"
//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

const ActivityComp = props => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token")
  const [announcements, setAnnouncements] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  // GET ANNOUNCEMENTS ********
  React.useEffect(() => {
    // setLoading(false)
    //getData()
    // setLoading(true)
  }, [])

  return !loading ? (
    <React.Fragment>
      <Card>
        {announcements && announcements.length > 0 ? (
          <CardBody>
            {/* <CardTitle className={`mb-5 ${i18n.language === "fa" ? "rtlContent" : "ltrContent"}`}>{props.t("Notifications")}</CardTitle> */}
            <ul className="verti-timeline list-unstyled">
              {announcements.slice(0, 4).map((item, key) => (
                <li
                  className={key == 0 ? "event-list active" : "event-list"}
                  key={key}
                >
                  <div className="event-timeline-dot">
                    <i
                      className={
                        key == 0
                          ? "bx bx-notification font-size-18 bx-flashing"
                          : "bx bx-notification font-size-18"
                      }
                    />
                  </div>
                  <Row>
                    <Col className="col-2 col-md-1">
                      <span className="font-size-14"> {item.createdAt} </span>
                    </Col>
                    <Col className="col-2 col-md-1 px-0 text-start">
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-center ms-3" />
                    </Col>

                    <Col className="col-8 col-md-9">
                      <div>
                        {item.content.length < 100
                          ? item.content
                          : item.content.substr(0, 162) + " و..."}
                        {item.content.length < 75 ? (
                          <></>
                        ) : (
                          <Link to={`/notif/${item.id}`}> مشاهده بیشتر </Link>
                        )}
                      </div>
                    </Col>
                  </Row>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <Link
                to="/notif"
                className="btn btn-primary waves-effect waves-light btn-sm"
              >
                {props.t("View all")}
                <i className="mdi mdi-eye ms-1" />
              </Link>
            </div>
          </CardBody>
        ) : (
          <></>
        )}
      </Card>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default withTranslation()(ActivityComp)
