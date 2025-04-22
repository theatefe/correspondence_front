// src/components/filter.
import React, { useState, useMemo } from "react"
import axios from "axios"
import moment from "moment-jalaali"
import PropTypes from "prop-types"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import Select from "react-select"
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
//Api
import listPatternNumberApi from "../../api/admin/letterTemplate/list"
import assignTypeToTemplateApi from "../../api/admin/letterTemplate/assignType"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import { Link } from "react-router-dom"

function LetterTemplateView() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [inboxList, setInboxList] = useState([])
  const [loading, setLoading] = React.useState()

  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const toggleModal = value => {
    const item = inboxList?.find(x => x.id === value)
    console.log(item)
    setTimeout(() => {
      if (item) {
        setSelectedItem(item)
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
    setSelectedType(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setShowSubmit(false)
    // perform validation
    if (selectedType == null) {
      toastr.error(t("نوع نامه را انتخاب کنید"))
      return
    }
    const result = await assignTypeToTemplateApi(
      token,
      selectedId,
      selectedType.value
    )
    if (result.status == 200) {
      // Show success alert
      toastr.success("نوع نامه با موفقیت به الگو اضافه شد")
      window.setTimeout(() => {
        getTemplateList()
        setShowModal(false)
        setSelectedItem(null)
        setSelectedId(null)
        setSelectedType(null)
      }, 340)
    } else {
      if (error.response && error.response.status === 400) {
        console.error("Error:", error.response.data.message)
        toastr.error(error.response.data.message, "خطا!")
      } else {
        toastr.error(error.response.data.error, "خطا!")
      }
      getTemplateList()
      setShowModal(false)
      setSelectedItem(null)
      setSelectedId(null)
      setSelectedType(null)
    }
  }

  function handleSelectType(selectedOption) {
    setSelectedType(selectedOption)
    setShowSubmit(true)
  }

  // ******************** get serial list *****************
  const getTemplateList = async () => {
    const list = await listPatternNumberApi(token)
    const result = list.data.map(item => {
      return {
        id: item.id,
        name: item.title,
        exist: item.type || "-",
        dateTime: item.createdAt,
        serial: item.letterNumbering.title,
        status: item.active ? "فعال" : "غیرفعال",
        creator: item.admin.name + " " + item.admin.lastName,
        created: item.createdAt,
        updater: "-",
        updated: item.updatedAt,
      }
    })
    setInboxList(result)
  }
  // create columns *********************************************
  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "موجودیت",
        accessor: "exist",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "تاریخ و ساعت موثر",
        accessor: "dateTime",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ direction: "ltr" }} className="lopp">
            {cell.value}
          </div>
        ),
      },
      {
        Header: "مخزن سریال",
        accessor: "serial",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "وضعیت",
        accessor: "status",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            className={`${
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
      // {
      //   Header: "آخرین تغییردهنده",
      //   accessor: "update",
      //   flag: "true",
      //   Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      // },
      // {
      //   Header: "تاریخ آخرین تغییر",
      //   accessor: "updated",
      //   flag: "true",
      //   Cell: ({ cell }) => <div>{cell.value}</div>,
      // },
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
                  <Tooltip id={`tooltip-${"الحاق الگو به نوع نامه"}`}>
                    <strong>{"الحاق الگو به نوع نامه"}</strong>
                  </Tooltip>
                }
              >
                <Button onClick={() => toggleModal(cell.value)} color="primary">
                  <i
                    className="mdi mdi-star md-18"
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
  // create data columns ******************************************
  const data = inboxList.map(item => {
    const jalaliCreated = item.dateTime
    const jalaliCreatedDate = moment(jalaliCreated).format(
      "jYYYY/jMM/jDD HH:mm:ss"
    )
    const jalaliUpdated = item.updated
    const jalaliUpdatedDate = moment(jalaliUpdated).format(
      "jYYYY/jMM/jDD HH:mm:ss"
    )
    return {
      id: item.id,
      name: item.name,
      exist: item.exist,
      dateTime: jalaliCreatedDate,
      serial: item.serial,
      status: item.status,
      creator: item.creator,
      created: jalaliCreatedDate,
      update: item.updater,
      updated: jalaliUpdatedDate,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    getTemplateList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "لیست الگوهای نامه - مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="الگوهای نامه" breadcrumbItem="لیست الگوها" />
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
                                <Link to="/letterTemplatelForm">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    ساخت الگو جدید
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
        <Modal isOpen={showModal} toggle={handleClose} centered>
          <ModalHeader toggle={handleClose}>الحاق الگو</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="template">عنوان الگو</Label>
                    <span className="requareForm">*</span>
                    <Input
                      type="text"
                      id="template"
                      placeholder="عنوان الگو"
                      value={selectedItem?.name || ""}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-personaliCode-Input">
                      {"نوع نامه"}
                      <span className="requareForm">*</span>
                    </Label>
                    <Select
                      value={selectedType}
                      onChange={handleSelectType}
                      options={[
                        { label: "داخلی", value: 1 },
                        { label: "صادره", value: 3 },
                        { label: "وارده", value: 2 },
                      ]}
                      className="select2-selection"
                      placeholder={"انتخاب کنید"}
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#e0e0e0"
                            : "#ffffff", // رنگ پس‌زمینه برای حالت فوکوس و حالت عادی
                          color: "#000000", // رنگ متن
                        }),
                        menu: provided => ({
                          ...provided,
                          zIndex: 10, // تنظیم zIndex برای نمایش صحیح منوی کشویی
                        }),
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleClose}>
              بستن
            </Button>
            <Button
              type="submit"
              color="success"
              onClick={handleSubmit}
              disabled={!showSubmit}
            >
              ثبت
            </Button>
          </ModalFooter>
        </Modal>
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
LetterTemplateView.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default LetterTemplateView
