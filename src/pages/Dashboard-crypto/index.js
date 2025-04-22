import React from "react"
import { Container, Row, Col } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
//Import Components
import CardUser from "./card-user"
import CardKalam from "./card-kalam"
import MiniWidget from "./mini-widget"
import WalletBalance from "./wallet-balance"
import OverView from "./overview"
import Transactions from "./transactions"
import Notifications from "./notifications"
import BuySell from "./buy-sell"
import Announcements from "./../Dashboard/Announcements"
// *********************
import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

const Dashboard = () => {
  //meta title
  document.title = "پنل کاربری - اورانوس"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="مکاتبات" breadcrumbItem="پنل کاربری" />
          <Row>
            <CardUser />
            <Col xl="8">
              <CardKalam />
              <Row>
                <MiniWidget />
              </Row>
            </Col>
          </Row>

          {/* <Row className="mb-5">
            <Col xl="12">
              <Calendar
                calendar={persian}
                locale={persian_fa}
              />
            </Col>
          </Row> */}

          <Row>
            <Col xl="12">
              <Announcements />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
