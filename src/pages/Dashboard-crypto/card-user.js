import React, { useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap"
import { Link } from "react-router-dom"
import features from "../../assets/images/12-ui-3.png"
const CardUser = () => {
  const token = localStorage.getItem("token");
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState({});

  // get user info ********************
  const getUserInfo = () => {
    // const config = {
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     accept: 'application/json'
    //   }
    // };
    //   .then(response => response.json())
    //   .then((result) => {
    //     const data = result[0];
    //     setInfo({ id: data.id, fullName: data.first_name + " " + data.last_name });
    //   })
  }

  // useEffect *********************
  React.useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <React.Fragment>
      <Col xl="4">
        <Card className=" bg-soft border border-primary rounded" style={{ height: '395px' }}>
          <CardBody >
            <div className="mt-2 ms-2">
              <Row>
                <Col lg="6" sm="8">
                  <div className="mb-4 me-3">
                    <i className="mdi mdi-account-circle text-primary h1"></i>
                  </div>
                  <div>
                    <h5>{info ? info.fullName : null}</h5> 
                    <p className="text-muted mb-1">سمت شغلی : برنامه نویس</p>
                    <p className="text-muted mb-0">شماره پرسنلی : 3005</p>
                  </div>
                </Col>
                <Col lg="6" sm="8" className="mt-5">
                  <div>
                    <img src={features} alt="" width={185} className="img-fluid d-block" />
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>

          <CardFooter className="bg-transparent border-top p-4">
            <div className="text-end">
              <Link to="#" className="btn btn-outline-primary me-2 w-md">
                تغییر رمز عبور
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default CardUser
