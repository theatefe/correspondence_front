import React from "react"

import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar.png"
import automationImg from "../../assets/images/automation.png"

import i18n from '../../i18n';

import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"


const WelcomeCompExirDashboard = props => {
  const token = localStorage.getItem("token");
  const [info, setInfo] = React.useState({});

  // GET USER INFO *******
  const getUserInfo = () => {
    // const config = {
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     accept: 'application/json'
    //   }
    // };
    //   .then(response => response.json())
    //   .then((result) => {
    //     const data = result;
    //     setInfo({ id: data[1].id, perasonalId: data[0].personnelID, avatar: data[0].avatar, fullName: data[1].first_name + " " + data[1].last_name, post: data[0].post });
    //   })
  }

  // USE EFFECT
  React.useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <React.Fragment>
      <Card className="overflow-hidden w-100">
        <div className="bg-primary bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary"> {props.t("Welcome")}</h5>
                <p>
                  {props.t("User Panel")}
                </p>
              </div>
            </Col>
            <Col xs="5" className="align-self-center text-center">
              <img
                src={automationImg}
                alt=""
                className="img-fluid w-75  text-center"
              />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row className="justify-content-between">
            <Col className="col-auto col-sm-6">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate ms-1">{info.fullName}</h5>
              {/* این فیلد برای سمت شغلی می باشد  */}
              <p className=" mb-0 text-truncate ms-1"> عنوان شغلی : {info.post || "..."}</p>
            </Col>

            <Col className="col-auto col-sm-6  my-auto">
              <div className="pt-4">
                {/* <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">125</h5>
                    <p className=" mb-0">Projects</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">$1245</h5>
                    <p className=" mb-0">Revenue</p>
                  </Col>
                </Row> */}
                <div className="mt-5">
                  <Link to="" className="btn btn-primary btn-sm w-100">
                    {props.t("User Profile")} <i className="mdi mdi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default withTranslation()(WelcomeCompExirDashboard)