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
  Label,
  Input,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Select from "react-select"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"
import logo from "../../assets/images/brands/avatar-temp.png"

import { Type } from "../JobPages/JobList/JobListCol"

function DatatableDraftMessages() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [loading, setLoading] = React.useState()
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [draftList, setDraftList] = useState([])
  const [users, setUsers] = React.useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setselectedUser] = useState([])
  const [showSendDraft, setShowSendDraft] = useState(false)
  const [deleteMsgId, setDeleteMsgId] = useState()
  const [SendMsgId, setSendMsgId] = useState()
  const [bodyMsg, setBodyMsg] = useState()
  const titleRef = React.useRef()
  const textRef = React.useRef()
  // Toggle for Modal
  const toggle = () => setShowDeleteModal(!showDeleteModal)
  const toggleSend = () => setShowSendDraft(!showSendDraft)
  // ******************** get users ***********************
  const getUsers = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-all-user/`, config)
      .then(res => res.json())
      .then(data => {
        const list = data.map(item => {
          return {
            id: item.id,
            fullName: item.first_name + " " + item.last_name,
          }
        })
        setUsers(list)
      })
  }
  // ******************* get message info *****************
  const getMessageInfo = id => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-detail-draft/${id}/`, config)
      .then(res => res.json())
      .then(result => {
        const body = result[0]
        console.log(result[0])
        setBodyMsg(body)
      })
  }
  // handle show delete
  const handleShowDeleteDialog = id => {
    setShowDeleteModal(true)
    setDeleteMsgId(id)
  }
  // handle send draft
  const handleSendDraft = id => {
    getUsers()
    setSendMsgId(id)
    getMessageInfo(id)
    setTimeout(() => setShowSendDraft(true), 2000)
  }
  // select user
  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
  }
  const optionGroup = users.map(item => {
    return {
      label: item.fullName,
      value: item.id,
    }
  })
  // delete message id
  const deleteMessageFun = () => {
    const url = `http://localhost:3000/messanger/delete-message/${deleteMsgId}/`
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    fetch(url, {
      headers: headers,
      method: "DELETE",
      mode: "cors",
    }).then(data => {
      if (data.ok) {
        setShowDeleteModal(false)
        setDeleteMsgId(0)
        toastr.success("پیام با موفقیت حذف شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setShowDeleteModal(false)
        setDeleteMsgId(0)
        toastr.error("مشکلی در حذف پیام رخ داده، مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setTimeout(() => window.location.reload(), 1000)
      }
    })
  }
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
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  // get draft list ***********
  const getDraftList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-draft-message/`, config)
      .then(response => response.json())
      .then(result => {
        const messages = result.map(item => {
          var dateTime = item.createDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          return {
            id: item.id,
            title: item.body.substr(0, 82) + " .....",
            createDate: sendTime + " | " + sendDate,
          }
        })
        setDraftList(messages)
      })
  }
  const columns = useMemo(
    () => [
      {
        Header: "ردیف",
        accessor: "key",
        flag: "true",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "متن پیام",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
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
                  to={`/draft-message/${cell.value}`}
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
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"حذف"}`}>
                    <strong>{"حذف"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  onClick={() => handleShowDeleteDialog(cell.value)}
                  className="btn btn-soft-danger"
                >
                  <i
                    className="mdi mdi-delete-outline md-18"
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

  const data = draftList.map((item, index) => {
    return {
      key: index + 1,
      id: item.id,
      title: item.title,
      startDate: item.createDate,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    getDraftList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "پیام های پیش نویس - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <ReferralModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Modal isOpen={showDeleteModal} centered={true}>
        <ModalHeader toggle={toggle}>حذف پیام</ModalHeader>
        <ModalBody>
          شما در حال حذف پیام پیش نویس شده هستید، آیا از حذف این پیام اطمینان
          دارید؟
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={deleteMessageFun}>
            بله
          </Button>{" "}
          <Button color="danger" onClick={toggle}>
            خیر
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showSendDraft} centered={true}>
        <div className="modal-content">
          <ModalBody className="px-4 py-5 text-center">
            <button
              type="button"
              onClick={toggleSend}
              className="btn-close position-absolute end-0 top-0 m-3"
            ></button>
            <div className="avatar-sm mb-4 mx-auto">
              <div className="btn-soft-primary rounded-3 rounded-circle">
                <i
                  className="mdi mdi-message-text"
                  style={{ fontSize: "28px" }}
                ></i>
              </div>
            </div>
            <Row>
              <Col xs={12}>
                <h6 className="mb-4 card-title"> ویرایش پیش نویس</h6>
                <Form className="repeater" encType="multipart/form-data">
                  <div>
                    <Row>
                      <Col lg={12}>
                        <div
                          className="mt-3 text-start"
                          style={{ zIndex: "9999" }}
                        >
                          <Label> عنوان پیام</Label>
                          <Input
                            placeholder="عنوان پیام را وارد کنید"
                            ref={titleRef}
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div
                          className="mt-3 text-start"
                          style={{ zIndex: "9999" }}
                        >
                          <Label>گیرنده پیام</Label>
                          <Select
                            value={selectedUser}
                            isMulti={true}
                            onChange={selectedUser => {
                              handleSelectUser(selectedUser)
                            }}
                            options={optionGroup.map(group => ({
                              label: group.label,
                              value: group.value,
                              imageSrc: group.imageSrc, // Provide the image source for each option
                            }))}
                            className="select2-selection text-start"
                            noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                            placeholder=" انتخاب کنید"
                            // components={{
                            //   Option: OptionWithImage, // Use the custom option component
                            // }}

                            getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                            styles={{
                              menu: provided => ({
                                ...provided,
                                backgroundColor: "#fff",
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                ":hover": {
                                  backgroundColor: "#eff2f7", // Change to your desired hover background color
                                  cursor: "pointer", // Change the cursor to a pointer
                                },
                                backgroundColor: state.isSelected
                                  ? "#BFC2C6"
                                  : provided.backgroundColor,
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                            }}
                          />
                        </div>
                      </Col>
                      <Col lg={12} className="mt-3 text-start">
                        <label htmlFor="message">متن پیام</label>
                        <textarea
                          value={bodyMsg ? bodyMsg.title : null}
                          ref={textRef}
                          id="message"
                          className="form-control"
                          placeholder="متن پیام را وارد کنید"
                          rows={9}
                        ></textarea>
                      </Col>
                      <Col lg={12} className="mt-3 text-start">
                        <label htmlFor="message">ضمیمه</label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            // onChange={handlechangeFile}
                          />
                          {/* <button
                            className="btn btn-info"
                            type="button"
                            id="inputGroupFileAddon04"
                            onClick={handleUploadFile}
                          >
                            آپلود فایل
                          </button> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Col>
            </Row>
            <div className="hstack gap-2 mt-4 justify-content-end mb-0">
              <button
                type="button"
                className="btn text-nowrap btn-danger"
                onClick={toggleSend}
              >
                انصراف
              </button>
              <button
                type="button"
                className="btn text-nowrap btn-success"
                // onClick={handleSend}
              >
                ارسال
              </button>
            </div>
          </ModalBody>
        </div>
      </Modal>

      <div className="container-fluid">
        <Breadcrumbs title="پیش نویس" breadcrumbItem="پیام ها" />
        {/* <Table columns={columns} data={data} /> */}
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-3">
                      <Row className="justify-content-between mx-0"></Row>
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
DatatableDraftMessages.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableDraftMessages
