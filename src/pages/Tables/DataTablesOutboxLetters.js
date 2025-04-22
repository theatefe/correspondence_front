// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"

//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Container,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

import { Type } from "../JobPages/JobList/JobListCol"

function DataTablesOutboxLetters() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(10)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [outboxList, setOutboxList] = useState([])
  // delete
  const onClickData = apply => {
    setApply(apply)
    setDeleteModal(true)
  }
  const onClickarchive = apply => {
    setApply(apply)
    setArchiveModal(true)
  }
  const handleDeleteApplyJob = () => {
    if (apply && apply.id) {
      dispatch(OnDeleteApplyJob(apply.id))
      setDeleteModal(false)
    }
  }

  // get outbox list *************
  const getOutboxList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/outbox-letter/`, config)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        const letters = result.map(item => {
          return {
            id: item.id,
            reciver: item.receiver__first_name + " " + item.receiver__last_name,
            title: item.title,
            type: item.type,
            set: item.set == "1" ? "داخلی" : "خارجی",
            state: item.state,
            attachment: item.linked,
            priority: item.priority,
            createDate: item.createDate,
          }
        })
        setOutboxList(letters)
      })
  }

  const columns = useMemo(
    () => [
      {
        Header: " گیرنده نامه",
        accessor: "sender",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "عنوان نامه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "نوع نامه",
        accessor: "set",
        flag: "true",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "وضعیت نامه",
        accessor: "state",
        flag: "true",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "طبقه بندی",
        accessor: "type",
        flag: "true",

        Cell: cell => {
          return (
            <div style={{ textAlign: "center" }}>
              {" "}
              {/* <Type {...cell} /> */}
              {cell.value}
            </div>
          )
        },
      },
      {
        Header: "نامه مرتبط",
        accessor: "attachment",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center" }}>{cell.value}</div>
        ),
      },
      {
        Header: "اولویت",
        accessor: "priority",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            className={cell.value == "فوری" ? "text-danger" : "text-primary"}
            style={{ textAlign: "center" }}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "تاریخ دریافت",
        accessor: "startDate",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "عملیات",
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
                  to={`/detail-letter/${cell.value}`}
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
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"ارجاع"}`}>
                    <strong>{"ارجاع"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn  btn-soft-info"
                  onClick={() => {
                    const userData = cell.value
                    onClickData(userData)
                  }}
                >
                  <i
                    className="mdi mdi-email-send-outline"
                    id="deletetooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"آرشیو"}`}>
                    <strong>{"آرشیو"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn btn-soft-warning"
                  onClick={() => {
                    const userData = cell.value
                    onClickarchive(userData)
                  }}
                >
                  <i
                    className="mdi mdi-archive-outline"
                    id="deletetooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"ردیابی"}`}>
                    <strong>{"ردیابی"}</strong>
                  </Tooltip>
                }
              >
                <Link to="#" className="btn  btn-soft-pink">
                  <i
                    className="mdi mdi-account-network-outline"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
          </div>
        ),
      },
    ],
    [selectedRow]
  )

  const data = outboxList.map(item => {
    var dateTime = item.createDate
    var sendDate = dateTime.slice(0, 10)
    var sendTime = dateTime.slice(11, 19)
    return {
      id: item.id,
      sender: item.reciver,
      title:
        item.title.length > 50 ? item.title.substr(0, 50) + " ..." : item.title,
      type: item.type == "1" ? "عادی" : "محرمانه",
      set: item.set,
      attachment: item.attachment == null ? "ندارد" : "دارد",
      priority:
        item.priority == "1"
          ? "عادی"
          : item.priority == "2"
          ? "فوری"
          : item.priority == "3"
          ? "آنی"
          : "بدون الویت",
      state: item.state == 3 ? "قابل ویرایش" : "نامه‌نهایی",
      startDate: sendDate,
    }
  })

  const handleRowClick = row => {
    if (selectedRow === row.id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(row.id)
    }
  }

  React.useEffect(() => {
    setLoading(true)
    getOutboxList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "نامه های ارسالی - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <ReferralModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setDeleteModal(false)}
        apply={apply}
      />
      <ArchiveModal
        show={archiveModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setArchiveModal(false)}
      />
      <div className="container-fluid">
        <Breadcrumbs title="صندوق خروجی" breadcrumbItem="نامه های ارسالی" />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-3">
                      <Row className="justify-content-between mx-0">
                        {/* <Col className="col-12 col-sm-auto px-0 mt-2 mt-sm-0">
                            
                              <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                isJobListGlobalFilter={isJobListGlobalFilter}
                              />
                           
                          </Col> */}
                        <Col className="col-12 col-sm-auto px-0 order-last order-sm-first mt-2 mt-sm-0">
                          <Row className="mx-0 justify-content-center justify-content-sm-start">
                            <Col className="col-12 col-md-auto ps-0">
                              <div className="text-sm-end ps-0">
                                <Link to="/new-letter">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    نامه جدید
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
DataTablesOutboxLetters.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DataTablesOutboxLetters
