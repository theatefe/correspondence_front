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

function DatatableVacationList() {
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
    fetch(`http://localhost:3000/form/outbox-busyness/`, config)
      .then(response => response.json())
      .then(result => {
        const outboxList = result.map(item => {
          var dateTime = item.createDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          var reciver =
            item.receiver__first_name + " " + item.receiver__last_name
          var status =
            item.status == 1
              ? "درحال بررسی"
              : item.status == 2
              ? "موافقت"
              : "رد درخواست"
          return {
            id: item.id,
            reciver: reciver,
            status: status,
            type: item.type,
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
        Header: "گیرنده فرم",
        accessor: "reciver",
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
        Header: "وضعیت درخواست",
        accessor: "status",
        flag: "true",

        Cell: cell => {
          return <div style={{ textAlign: "center" }}> {cell.value}</div>
        },
      },
      {
        Header: "آخرین بروزرسانی",
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
                  to={`/business-detail/${cell.value}`}
                  className="btn btn-soft-primary"
                >
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
      status: item.status,
      type: item.type == 1 ? "درخواست وام" : "ضمانت وام",
      createDate: item.createDate,
      read: item.status == 1 ? true : false,
    }
  })

  React.useEffect(() => {
    //meta title
    document.title = "فرم‌های اشتغال بکار - سامانه مکاتبات"
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
          breadcrumbItem="درخواست های اشتغال به‌کار"
        />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-3">
                      <Row className="justify-content-between mx-0">
                        <Col className="col-12 col-sm-auto px-0 order-last order-sm-first mt-2 mt-sm-0">
                          <Row className="mx-0 justify-content-center justify-content-sm-start">
                            <Col className="col-12 col-md-auto ps-0">
                              <div className="text-sm-end ps-0">
                                <Link to="/business-form">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    درخواست اشتغال به کار
                                    <i className="dripicons-document-edit font-size-14 align-middle ms-2 "></i>
                                  </Button>
                                </Link>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Row>
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
DatatableVacationList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableVacationList
