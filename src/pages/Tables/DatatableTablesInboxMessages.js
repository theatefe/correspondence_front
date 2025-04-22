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

function DatatableInboxMessages() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [inboxList, setInboxList] = React.useState([])
  const [userInfo, setUserInfo] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  // delete
  const handleDeleteApplyJob = () => {
    if (apply && apply.id) {
      dispatch(OnDeleteApplyJob(apply.id))
      setDeleteModal(false)
    }
  }
  // get inbox list ***********
  const getInboxList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-login-user/`, config)
      .then(res => res.json())
      .then(data => {
        const result = data[1]
        const user = {
          id: result.id,
          firstName: result.first_name,
          lastName: result.last_name,
          signature: result.profile__signature,
        }
        setUserInfo(user)
        fetch(`http://localhost:3000/messanger/get-box-message/`, config)
          .then(response => response.json())
          .then(result => {
            const messages = result.map(item => {
              var dateTime = item.updateDate
              var sendDate = dateTime.slice(0, 10)
              var sendTime = dateTime.slice(11, 16)
              var sender =
                user.id == item.creator_id
                  ? item.audience__first_name + " " + item.audience__last_name
                  : item.creator__first_name + " " + item.creator__last_name
              var seen = user.id == item.receiver_id ? item.unseenCount : 0
              var inbox = user.id == item.receiver_id ? true : false
              return {
                id: item.id,
                sender: sender,
                title: item.title,
                status: inbox,
                unseenCount: seen,
                createDate: sendTime + " | " + sendDate,
              }
            })
            setInboxList(messages)
          })
      })
  }
  const columns = useMemo(
    () => [
      {
        Header: "مخاطب",
        accessor: "sender",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "وارده/صادره",
        accessor: "status",
        flag: "true",
        Cell: ({ cell }) => (
          <div className="lopp">
            {cell.value ? (
              <>
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-${"وارده"}`}>
                      <strong>{"وارده"}</strong>
                    </Tooltip>
                  }
                >
                  <i className="mdi mdi-arrow-down-bold text-success"></i>
                </OverlayTrigger>
              </>
            ) : (
              <>
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-${"صادره"}`}>
                      <strong>{"صادره"}</strong>
                    </Tooltip>
                  }
                >
                  <i className="mdi mdi-arrow-up-bold text-danger"></i>
                </OverlayTrigger>
              </>
            )}
          </div>
        ),
      },
      {
        Header: "عنوان مکالمه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "وضعیت",
        accessor: "type",
        flag: "true",

        Cell: cell => {
          return (
            <div style={{ textAlign: "center" }}>
              {" "}
              <Type {...cell} />
            </div>
          )
        },
      },
      {
        Header: "آخرین بروزرسانی",
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
                  to={`/view-messages/${cell.value}`}
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

  const data = inboxList.map(item => {
    return {
      id: item.id,
      sender: item.sender,
      title:
        item.title.length > 35 ? item.title.substr(0, 35) + "..." : item.title,
      status: item.status,
      type: item.unseenCount > 0 ? "جدید" : "خوانده شده",
      startDate: item.createDate,
      read: item.unseenCount > 0 ? true : false,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    getInboxList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "پیام های من - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <ReferralModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ArchiveModal
        show={archiveModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setArchiveModal(false)}
      />
      <div className="container-fluid">
        <Breadcrumbs title="پیام ها" breadcrumbItem="پیام‌های من" />
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
                                <Link to="/new-message">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    پیام جدید
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
DatatableInboxMessages.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableInboxMessages
