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
  Button,
  Spinner,
  Container,
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

function DatatableOutboxMessages() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [inboxList, setInboxList] = React.useState([])
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
  // Define a default UI for filtering
  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    isJobListGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)

    return (
      <React.Fragment>
        <Row className="justify-content-center justify-content-sm-between mx-0">
          {/* Search table */}
          <Col className="col-12 col-sm-auto px-0">
            <div className="search-box me-xxl-0 me-0 ms-0 mx-0 my-xxl-0 d-inline-block">
              <div className="position-relative">
                <label htmlFor="search-bar-0" className="search-label mb-0">
                  <span id="search-bar-0-label" className="sr-only">
                    Search this table
                  </span>
                  <input
                    onChange={e => {
                      setValue(e.target.value)
                      onChange(e.target.value)
                    }}
                    id="search-bar-0"
                    type="text"
                    className="form-control"
                    placeholder={`${count} رکورد...`}
                    value={value || ""}
                  />
                </label>
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </div>
          </Col>
        </Row>

        {isJobListGlobalFilter && <JobListGlobalFilter />}
      </React.Fragment>
    )
  }
  // get inbox list ***********
  const getInboxList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-send-message/`, config)
      .then(response => response.json())
      .then(result => {
        const messages = result.map(item => {
          var dateTime = item.updateDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          return {
            id: item.id,
            audience:
              item.audience__first_name + " " + item.audience__last_name,
            receiver: parseInt(item.receiver),
            title: item.title,
            unseenCount: item.unseenCount,
            createDate: sendTime + " | " + sendDate,
          }
        })
        setInboxList(messages)
      })
  }
  const columns = useMemo(
    () => [
      {
        Header: "گیرنده",
        accessor: "sender",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "عنوان مکالمه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      // {
      //   Header: "وضعیت",
      //   accessor: "type",
      //   flag: "true",

      //   Cell: cell => {
      //     return (
      //       <div style={{ textAlign: "center" }}>
      //         {" "}
      //         <Type {...cell} />
      //       </div>
      //     )
      //   },
      // },
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
      sender: item.audience,
      title: item.title,
      type: item.unseenCount > 0 ? "جدید" : "خوانده شده",
      startDate: item.createDate,
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
  document.title = "پیام های ارسالی - سامانه مکاتبات"

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
        <Breadcrumbs title="صندوق خروجی" breadcrumbItem="پیام های ارسالی" />
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
DatatableOutboxMessages.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableOutboxMessages
