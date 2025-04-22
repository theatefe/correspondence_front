import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Spinner,
} from "reactstrap"
import { Link } from "react-router-dom"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

// Pages Components
import ActivityComp from "./ActivityComp"

//Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
// import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"


const Dashboard2 = props => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false)
  const [modal, setmodal] = useState(false)
  const [subscribemodal, setSubscribemodal] = useState(false)
  const [date, setDate] = useState({})
  const [hadis, setHadis] = useState({})
  const [countMessages, setCountMessages] = useState(null)


  const reports = [
    {
      title: props.t("Received msgs"),
      iconClass: "bx-archive-in",
      description: countMessages || 0,
    },
    {
      title: props.t("Received letters"),
      iconClass: "bx-mail-send",
      description: "3",
    },
    {
      title: props.t("Online users"),
      iconClass: "bx-user",
      description: "34",
    },
  ]

  // GET DATE
  const getDate = () => {
    fetch(`https://api.keybit.ir/time/`)
      .then(res => res.json())
      .then(result => {
        const day = result.date.day.number.fa
        const mounth = result.date.month.name
        const year = result.date.year.number.fa
        const dayOfWeek = result.date.weekday.name
        let events = {
          event1: result.date.day.events.holy
            ? result.date.day.events.holy.text
            : null,
          event2: result.date.day.events.local
            ? result.date.day.events.local.text
            : null,
        }
        setDate({
          day: day,
          mounth: mounth,
          year: year,
          weekday: dayOfWeek,
          event: events,
        })
        fetch(`https://api.keybit.ir/hadis/`)
          .then(res => res.json())
          .then(result => {
            let data = result.result
            setHadis({
              person: data.person,
              text: data.text,
              source: data.source,
            })
          })
        setTimeout(() => {
          //setSubscribemodal(true)
          setLoading(false)
        }, 1300)
      })
  }
  // USE EFFECT
  useEffect(() => {
    setLoading(true)
    // getDate()
    //  getCountData()
    // setTimeout(() => {
    //   //setSubscribemodal(true)
    //   setLoading(false);
    // }, 1000)
    setLoading(false)
  }, [])

  useEffect(() => {}, [])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  //meta title
  document.title = "داشبورد - سامانه مکاتبات"
  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("تقویم")}
            breadcrumbItem={props.t("تقویم")}
          /> */}
          <h4 className="font-size-22 fw-bold mb-4 mt-4">
            {props.t("مدیریت مکاتبات")}
          </h4>
          <Row className="mb-4">
            <Col className="portal_Dashboard_cards col-12 col-md-4">
              <Link
                to="/#"
                className="w-100 h-100 d-grid align-content-between"
              >
                <Row>
                  <Col className="title">نامه داخلی</Col>
                </Row>
                <Row>
                  <Col className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </Col>
                </Row>
              </Link>
            </Col>
            <Col className="portal_Dashboard_cards col-12 col-md-4">
              <Link
                to="/#"
                className="w-100 h-100 d-grid align-content-between"
              >
                <Row>
                  <Col className="title">نامه داخلی</Col>
                </Row>
                <Row>
                  <Col className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </Col>
                </Row>
              </Link>
            </Col>
            <Col className="portal_Dashboard_cards col-12 col-md-4">
              <Link
                to="/#"
                className="w-100 h-100 d-grid align-content-between"
              >
                <Row>
                  <Col className="title">نامه داخلی</Col>
                </Row>
                <Row>
                  <Col className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </Col>
                </Row>
              </Link>
            </Col>
            <Col className="portal_Dashboard_cards col-12 col-md-4">
              <Link
                to="/#"
                className="w-100 h-100 d-grid align-content-between"
              >
                <Row>
                  <Col className="title">نامه داخلی</Col>
                </Row>
                <Row>
                  <Col className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </Col>
                </Row>
              </Link>
            </Col>
            <Col className="portal_Dashboard_cards col-12 col-md-4">
              <Link
                to="/#"
                className="w-100 h-100 d-grid align-content-between"
              >
                <Row>
                  <Col className="title">نامه داخلی</Col>
                </Row>
                <Row>
                  <Col className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </Col>
                </Row>
              </Link>
            </Col>
          </Row>

          <Row>
            <Col xl="12">
              <ActivityComp />
            </Col>
          </Row>
        </Container>
      </div>

      {/* subscribe ModalHeader */}
      <Modal
        isOpen={subscribemodal}
        role="dialog"
        autoFocus={true}
        centered
        data-toggle="modal"
        toggle={() => {
          setSubscribemodal(!subscribemodal)
        }}
      >
        <div>
          <ModalHeader
            className="border-bottom-0"
            toggle={() => {
              setSubscribemodal(!subscribemodal)
            }}
          ></ModalHeader>
        </div>
        <div className="modal-body">
          <div className="text-center mb-4">
            <div className="avatar-md mx-auto mb-4">
              <div className="avatar-title bg-light  rounded-circle text-primary h1">
                <i className="mdi mdi-email-open"></i>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-xl-10">
                <h4 className="text-primary">Subscribe !</h4>
                <p className=" font-size-14 mb-4">
                  Subscribe our newletter and get notification to stay update.
                </p>

                <div className="input-group rounded bg-light">
                  <Input
                    type="email"
                    className="form-control bg-transparent border-0"
                    placeholder="Enter Email address"
                  />
                  <Button color="primary" type="button" id="button-addon2">
                    <i className="bx bxs-paper-plane"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal)
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal)
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className=" mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className=" mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal)
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  ) : (
    <>
      <React.Fragment>
        <div className="page-content loader-icon">
          <Container fluid>
            <div className="text-center mt-5" dir="ltr">
              <Spinner
                color="primary"
                style={{
                  height: "3rem",
                  width: "3rem",
                }}
              >
                Loading...
              </Spinner>
            </div>
          </Container>
        </div>
      </React.Fragment>
    </>
  )
}

Dashboard2.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard2)
