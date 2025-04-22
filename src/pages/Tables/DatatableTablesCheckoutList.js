// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"

//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Container,
  Button,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

import { Type } from "../JobPages/JobList/JobListCol"

function DatatableCheckoutList() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [list, setList] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  // get inbox list ***********
  const getInboxList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/form/outbox-checkout/`, config)
      .then(response => response.json())
      .then(result => {
        const outboxList = result.map(item => {
          var dateTime = item.createDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          var person = item.person__first_name + " " + item.person__last_name
          var reciver =
            item.receiver__first_name + " " + item.receiver__last_name
          var type =
            item.type == 1
              ? "ترک کار"
              : item.status == 2
              ? "اخراج"
              : item.status == 3
              ? "پایان قرارداد"
              : item.status == 4
              ? "بازنشستگی"
              : "استعفا"
          return {
            id: item.id,
            reciver: reciver,
            person: person,
            type: type,
            createDate: sendTime + " | " + sendDate,
          }
        })
        const reverse = outboxList.reverse()
        setList(reverse)
      })
  }
  const columns = useMemo(
    () => [
      {
        Header: "متقاضی تسویه",
        accessor: "person",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "نوع تقاضا",
        accessor: "type",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "گیرنده فرم",
        accessor: "reciver",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "تاریخ درخواست",
        accessor: "createDate",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "مشاهده و پاسخ",
        accessor: "id",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="list-unstyled hstack gap-1 mb-0"
          >
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"نمایش"}`}>
                    <strong>{"نمایش"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to={`/checkout-detail/${cell.value}`}
                  className="btn btn-soft-primary"
                >
                  {/* <Link to={'#'} className="btn btn-soft-primary"> */}
                  <i
                    className="mdi mdi-eye-outline md-18"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li>
          </div>
        ),
      },
    ],
    [selectedRow]
  )

  const data = list.map(item => {
    return {
      id: item.id,
      reciver: item.reciver,
      person: item.person,
      type: item.type,
      createDate: item.createDate,
    }
  })

  React.useEffect(() => {
    //meta title
    document.title = "فرم‌های تسویه حساب - سامانه مکاتبات"
    setLoading(true)
    getInboxList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title="فرم های خروجی"
          breadcrumbItem="درخواست های تسویه حساب"
        />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-2"></Row>
                    <TableContainer
                      columns={columns}
                      data={data}
                      isGlobalFilter={true}
                      isAddOptions={false}
                      customPageSize={20}
                      className="custom-header-css table-striped "
                      enableRowSelection={true}
                      mokatebatTableBtn={true}
                      simpleSearchBox={true}
                      // isJobListGlobalFilter={true}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
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
DatatableCheckoutList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableCheckoutList
