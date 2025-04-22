import React from "react"

import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Link } from "react-router-dom"

//i18n
import i18n from "../../i18n"

import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

import linkImg from "../../assets/images/link.png"

const ImportantLinks = props => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {" "}
      <Card
        className={`w-100 position-relative ${
          i18n.language === "fa" ? "rtlContent" : "ltrContent"
        }`}
      >
        <CardBody>
        <CardTitle className="mb-4">{props.t("Useful links")}</CardTitle>
          <Row>
            <Col className="col-6 col-md-12">
            <Link to={`http://192.168.6.12/glpi/`}>
              <Button
                type="button"
                className="w-100 btn btn-soft-primary waves-effect waves-light"
              >
                  <i className="bx bx-link fs-5"></i>{" "}
                {props.t("Ticketing system")}
              </Button>
              </Link>
            </Col>
            <Col className="col-6 col-md-12 mt-0 mt-md-3">
              <Button
                type="button"
                className="w-100 btn btn-soft-primary waves-effect waves-light"
              >
               <i className="bx bx-link fs-5"></i>
                {props.t("Project files archive system")}{" "}
              </Button>
            </Col>
          </Row>
        </CardBody>
        <img src={linkImg} alt="" className="linkImg_BgImg mb-2" />
      </Card>
    </React.Fragment >
  )
}

export default withTranslation()(ImportantLinks)
