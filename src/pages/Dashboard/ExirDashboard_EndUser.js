import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
  Container,
  div,
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
} from "reactstrap"
import { Link } from "react-router-dom"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

// Pages Components
import WelcomeCompExirDashboard from "./WelcomeCompExirDashboard"
import ImportantLinks from "./ImportantLinks"
import SocialSource from "./SocialSource"
import ActivityComp from "./ActivityComp"
import TopCities from "./TopCities"
import LatestTranaction from "./LatestTranaction"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"

//Calendar
import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import transition from "react-element-popper/animations/transition"

const Dashboard = props => {
  const [modal, setmodal] = useState(false)
  const [subscribemodal, setSubscribemodal] = useState(false)
  const { t } = useTranslation()

  const { chartsData } = useSelector(state => ({
    chartsData: state.Dashboard.chartsData,
  }))

  const reports = [
    {
      title: props.t("Received msgs"),
      iconClass: "bx-archive-in",
      description: "16",
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

  const [value, setValue] = useState(new Date())

  useEffect(() => {
    setTimeout(() => {
      //setSubscribemodal(true)
    }, 2000)
  }, [])

  const [periodData, setPeriodData] = useState([])
  const [periodType, setPeriodType] = useState("yearly")

  useEffect(() => {
    setPeriodData(chartsData)
  }, [chartsData])

  const onChangeChartPeriod = pType => {
    setPeriodType(pType)
    dispatch(onGetChartsData(pType))
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  //meta title
  document.title = "Dashboard | Skote - React Admin & Dashboard Template"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h4 className="font-size-22 fw-bold mb-4 mt-4">
            {props.t("مدیریت مکاتبات")}
          </h4>

          <div className="mb-4 mx-0 row gap-2">
            <div className="portal_Dashboard_cards col-12 col-md-auto m-1 mt-2">
              <Link
                to="/letterCartabl"
                className="w-100 h-100 d-grid align-content-between"
              >
                <div className="row">
                  <div className="title">فهرست نامه‌ها</div>
                </div>
                <div className="row">
                  <div className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 ms-2"></i>
                    ارتباطات سازمانی
                  </div>
                </div>
              </Link>
            </div>
            <div className="portal_Dashboard_cards col-12 col-md-auto m-1 mt-2">
              <Link
                to="/internalLetters"
                className="w-100 h-100 d-grid align-content-between"
              >
                <div className="row">
                  <div className="title">نامه داخلی</div>
                </div>
                <div className="row">
                  <div className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 ms-2"></i>
                    ارتباطات سازمانی
                  </div>
                </div>
              </Link>
            </div>
            {/* <div className="portal_Dashboard_cards col-12 col-md-auto m-1 mt-2">
              <Link
                to="/issuedLetters"
                className="w-100 h-100 d-grid align-content-between"
              >
                <div className="row">
                  <div className="title">نامه صادره</div>
                </div>
                <div className="row">
                  <div className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 ms-2"></i>
                    ارتباطات سازمانی
                  </div>
                </div>
              </Link>
            </div> */}
            {/* <div className="portal_Dashboard_cards col-12 col-md-auto m-1 mt-2">
              <Link
                to="/new-message"
                className="w-100 h-100 d-grid align-content-between"
              >
                <div className="row">
                  <div className="title">پیام</div>
                </div>
                <div className="row">
                  <div className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 me-2"></i>
                    ارتباطات سازمانی
                  </div>
                </div>
              </Link>
            </div>
            <div className="portal_Dashboard_cards col-12 col-md-auto m-1 mt-2">
              <Link
                to="/inbox-messages"
                className="w-100 h-100 d-grid align-content-between"
              >
                <div className="row">
                  <div className="title">لیست پیام‌ها</div>
                </div>
                <div className="row">
                  <div className="location">
                    {" "}
                    <i className="bx bx-message-square-dots font-size-18 ms-2"></i>
                    ارتباطات سازمانی
                  </div>
                </div>
              </Link>
            </div> */}
          </div>

          {/* <h4 className="font-size-22 fw-bold mb-4 mt-5">
            {props.t("اعلان ها")}
          </h4>

          <div>
            <Col xl="12">
              <ActivityComp />
            </Col>
          </div> */}
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
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
