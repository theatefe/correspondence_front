// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import moment from "moment-jalaali"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
// API
import listSerialNumberApi from "../../api/admin/letterSerial/list"
import changeActiveApi from "../../api/admin/letterSerial/changeActive"
import deleteNumberApi from "../../api/admin/letterSerial/delete"
//  provider***************
import Select from "react-select"
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
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import { Link } from "react-router-dom"
import logo from "../../assets/images/brands/avatar-temp.png"

function LetterSerialView() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [erjaModal, setErjaModal] = useState(false)
  const [inboxList, setInboxList] = useState([])
  const [loading, setLoading] = React.useState()
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSubmit, setShowSubmit] = useState(true)
  // Toggle for Modal *************
  const toggleModal = value => {
    setTimeout(() => {
      if (value) {
        setSelectedId(value)
        setShowModal(true)
      } else {
        console.log("Item not found")
      }
    }, 300)
  }
  const handleClose = () => {
    setShowModal(false) // Close the modal
    setSelectedItem(null)
    setSelectedId(null)
  }
  // get serial list *****************
  const getSerialList = async () => {
    const result = await listSerialNumberApi(token)
    const list = result.data.map(item => {
      return {
        id: item.id,
        title: item.title,
        creator: item.admin.name + " " + item.admin.lastName,
        increment: item.growthNumber,
        start: item.startingNumber,
        active: item.active ? "فعال" : "غیرفعال",
        createDate: item.createdAt,
        updater:
          item.updater != null
            ? item.updater.name + " " + item.updater.lastName
            : "-",
        updateDate: item.updater == null ? "-" : item.updatedAt,
      }
    })
    setInboxList(list)
  }
  // handle delete number ***********
  const handleDeleteNumber = async e => {
    e.preventDefault()
    setShowSubmit(false)
    // perform validation
    const result = await deleteNumberApi(token, selectedId)
    if (result.status == 200) {
      // Show success alert
      toastr.success("شماره سریال با موفقیت حذف شد")
      window.setTimeout(() => {
        getSerialList()
        setShowModal(false)
        setSelectedItem(null)
        setSelectedId(null)
      }, 340)
    } else {
      if (error.response && error.response.status === 400) {
        console.error("Error:", error.response.data.message)
        toastr.error(error.response.data.message, "خطا!")
      } else {
        toastr.error(error.response.data.error, "خطا!")
      }
      getSerialList()
      setShowModal(false)
      setSelectedItem(null)
      setSelectedId(null)
    }
  }
  // handle change active ***********************
  const handleChangeActive = async id => {
    try {
      const response = await changeActiveApi(token, id)
      if (response.status == 200) {
        toastr.success("وضعیت سریال با موفقیت به روز رسانی شد")
        getSerialList()
      } else {
        toastr.error(error.response.data.error, "خطا!")
      }
    } catch (err) {
      console.error(error.response.data.error, "خطا!")
    }
  }
  // handle create grid **************************
  const columns = useMemo(
    () => [
      {
        Header: "عنوان",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "عدد شروع",
        accessor: "start",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "عدد رشد",
        accessor: "increment",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "وضعیت",
        accessor: "active",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            onClick={() => handleChangeActive(cell.row.original.id)}
            className={`btn ${
              cell.value == "فعال" ? "activatedBtn" : "deactivatedBtn"
            }`}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "ایجادکننده",
        accessor: "creator",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "تاریخ ایجاد",
        accessor: "created",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ direction: "ltr" }}>{cell.value}</div>
        ),
      },
      {
        Header: "آخرین تغییردهنده",
        accessor: "updater",
        flag: "true",
        Cell: ({ cell }) => (
          <div dir className="lopp">
            {cell.value}
          </div>
        ),
      },
      {
        Header: "تاریخ آخرین تغییر",
        accessor: "updated",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ direction: "ltr" }}>{cell.value}</div>
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
                  <Tooltip id={`tooltip-${"حذف شماره سریال نامه"}`}>
                    <strong>{"حذف شماره سریال نامه"}</strong>
                  </Tooltip>
                }
              >
                <Button onClick={() => toggleModal(cell.value)} color="danger">
                  <i
                    className="mdi mdi-trash-can-outline"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Button>
              </OverlayTrigger>
            </li>
          </div>
        ),
      },
    ],
    [selectedRow]
  )

  const data = inboxList.map(item => {
    const jalaliCreated = item.createDate
    const jalaliCreatedDate = moment(jalaliCreated).format(
      "jYYYY/jMM/jDD HH:mm:ss"
    )
    const jalaliUpdated = item.createDate
    const jalaliUpdatedDate = moment(jalaliUpdated).format(
      "jYYYY/jMM/jDD HH:mm:ss"
    )
    return {
      id: item.id,
      title:
        item.title.length > 50 ? item.title.substr(0, 50) + " ..." : item.title,
      increment: item.increment,
      start: item.start,
      active: item.active,
      creator: item.creator,
      created: jalaliCreatedDate,
      updater: item.updater,
      updated: jalaliUpdatedDate,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    getSerialList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "لیست سریال های نامه - مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="سریال نامه" breadcrumbItem="لیست سریال‌ها" />
        {/* <Table columns={columns} data={data} /> */}
        <Modal isOpen={showModal} toggle={handleClose} centered>
          <ModalHeader toggle={handleClose}> حذف سریال نامه</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                {/* <Col md={6}> */}
                {/* <FormGroup> */}
                <Label for="template">{`آیا از حذف این سریال نامه اطمینان دارید؟`}</Label>
                {/* </FormGroup> */}
                {/* </Col> */}
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleClose}>
              خیر
            </Button>
            <Button
              type="submit"
              color="success"
              onClick={handleDeleteNumber}
              disabled={!showSubmit}
            >
              بله
            </Button>
          </ModalFooter>
        </Modal>
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
                                <Link to="/letterSerialForm">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    ایجاد سریال جدید
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
LetterSerialView.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default LetterSerialView
