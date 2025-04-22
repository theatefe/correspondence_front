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
  FormFeedback,
  Form,
  Label,
  Input,
} from "reactstrap"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import { Link } from "react-router-dom"
import Select from "react-select"
import logo from "../../assets/images/brands/avatar-temp.png"

import { useFormik } from "formik"
import * as Yup from "yup"

function DataTablesInboxLetters() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [erjaModal, setErjaModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [transmitter, setTransmitter] = React.useState([])
  const [selectedUser, setselectedUser] = useState([])
  const [users, setUsers] = React.useState([])
  const [inboxList, setInboxList] = useState([])
  const [loading, setLoading] = React.useState()
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [file, setFile] = useState(null)
  // Toggle for Modal
  const toggle = () => setErjaModal(!erjaModal)
  const [selectedGroup, setselectedGroup] = useState(null)
  const [roneveshtChecked, setRoneveshtChecked] = useState(false)
  // ******************* change seen status ************
  const handleChangeSeen = id => {
    // request body
    const url = `http://localhost:3000/letter/update-unseen-Letter/${id}/`
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    fetch(url, {
      headers: headers,
      method: "PUT",
      mode: "cors",
    }).then(response => {
      if (response.ok) {
        toastr.success("وضعیت نامه با موفقیت به خوانده نشده تغییر یافت")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        getInboxList()
        // window.location.reload();
      } else {
        // Close the modal
        setApply(null)
        setErjaModal(false)
        // show toast
        toastr.error("خطا در بروز رسانی! لطفا مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }
  //  *********************** erja **********************
  const onClickData = itemId => {
    setApply(itemId)
    setErjaModal(true)
    getUsers()
    getTransmitter(itemId)
  }
  // ******************** get inbox list *****************
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
        fetch(`http://localhost:3000/letter/all-box-letter/`, config)
          .then(res => res.json())
          .then(result => {
            const letters = result.map(item => {
              const creator =
                user.id == item.creator__id
                  ? item.receiver__first_name + " " + item.receiver__last_name
                  : item.creator__first_name + " " + item.creator__last_name
              const statusIn = user.id != item.creator__id ? true : false
              const seen = user.id == item.creator__id ? 0 : item.seen
              return {
                id: item.id,
                sender: creator,
                title: item.title,
                state: item.state,
                type: item.type,
                set: item.set == "1" ? "داخلی" : "خارجی",
                attachment: item.linked,
                priority: item.priority,
                seen: seen,
                status: statusIn,
                attach: item.attach,
                createDate: item.createDate,
              }
            })
            setInboxList(letters)
          })
      })
  }
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
            post:
              item.profiles[0].post != null ? item.profiles[0].post : "کاربر",
          }
        })
        setUsers(list)
      })
  }
  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup)
  }
  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
  }
  const fromGroup = transmitter.map(item => {
    return {
      label: item.fullName,
      value: item.id,
    }
  })
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  // ******************* get transmitter *****************
  const getTransmitter = itemId => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(
      `http://localhost:3000/letter/get-transmitter-trans/${itemId}/`,
      config
    )
      .then(res => res.json())
      .then(data => {
        const list = data.map(item => {
          return {
            id: item.id,
            fullName:
              item.transmitter.first_name + " " + item.transmitter.last_name,
          }
        })
        setTransmitter(list)
      })
  }
  // ******************* handle chnage file **************
  const handlechangeFile = e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("file", file)
      const url = "http://localhost:3000/messanger/upload-file/"
      const headers = new Headers({
        Authorization: "Bearer " + token,
      })
      fetch(url, {
        headers: headers,
        method: "POST",
        mode: "cors",
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            setUploadFiles(x => [...x, data.id])
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
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
        Header: "پیوست",
        accessor: "attach",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center" }}>{cell.value}</div>
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
        accessor: "pros",
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
                  to={`/detail-letter/${cell.value.id}`}
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
                  <Tooltip id={`tooltip-${"ارجاع"}`}>
                    <strong>{"ارجاع"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn  btn-soft-info"
                  onClick={() => {
                    onClickData(cell.value.id)
                  }}
                >
                  <i
                    className="mdi mdi-email-send-outline"
                    id="deletetooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li>
            {cell.value.status ? (
              <>
                <li>
                  <OverlayTrigger
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"تغییر وضعیت به خوانده نشده"}`}>
                        <strong>{"تغییر وضعیت به خوانده نشده"}</strong>
                      </Tooltip>
                    }
                  >
                    {!cell.value.read ? (
                      <Link
                        to="#"
                        className="btn btn-soft-warning"
                        onClick={() => {
                          const letterId = cell.value.id
                          handleChangeSeen(letterId)
                        }}
                      >
                        <i
                          className={
                            cell.value.read
                              ? "mdi mdi-email-outline"
                              : "mdi mdi-email-open-outline"
                          }
                          id="deletetooltip"
                          style={{ fontSize: "16px" }}
                        />
                      </Link>
                    ) : (
                      <Link to="#" className="btn btn-soft-warning">
                        <i
                          className={
                            cell.value.read
                              ? "mdi mdi-email-outline"
                              : "mdi mdi-email-open-outline"
                          }
                          id="deletetooltip"
                          style={{ fontSize: "16px" }}
                        />
                      </Link>
                    )}
                  </OverlayTrigger>
                </li>
              </>
            ) : (
              <></>
            )}
          </div>
        ),
      },
    ],
    [selectedRow]
  )

  const data = inboxList.map(item => {
    var dateTime = item.createDate
    var sendDate = dateTime.slice(0, 10)
    var sendTime = dateTime.slice(11, 19)
    return {
      id: item.id,
      sender: item.sender,
      status: item.status,
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
      startDate: sendDate,
      state: item.state == 3 ? "قابل ویرایش" : "نامه‌نهایی",
      read: item.seen == 1 ? true : false, // Set to true for read messages
      attach: item.attach ? "دارد" : "ندارد",
      pros: {
        id: item.id,
        read: item.seen == 1 ? true : false,
        status: item.status,
      },
    }
  })

  const handleRowClick = row => {
    if (selectedRow === row.id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(row.id)
    }
  }
  const optionGroup = users.map(item => {
    return {
      label: item.fullName + " (" + item.post + ")",
      value: item.id,
    }
  })
  // ******************** handle check status ***********
  const handleChangeChecked = () => {
    setRoneveshtChecked(!roneveshtChecked)
  }

  // ****************** submit function ******************
  const handleSend = values => {
    const lastElement = transmitter.slice(-1)
    const parent = lastElement[0].id
    // const parent = selectedGroup.value;
    const transfree = selectedUser.map(item => item.value)
    const description = values.description
    const status = roneveshtChecked ? 2 : 1
    // request body
    const url = `http://localhost:3000/letter/transmission-letter/`
    const formData = {
      letter: apply,
      status: status,
      parent: parent,
      description: description || null,
      receiver: transfree,
      attachment: uploadFiles,
    }
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    fetch(url, {
      headers: headers,
      method: "POST",
      mode: "cors",
      body: JSON.stringify(formData),
    }).then(response => {
      if (response.ok) {
        setselectedGroup(null)
        setselectedUser(null)
        setTransmitter([])
        setUsers([])
        // Close the modal
        setApply(null)
        setErjaModal(false)
        // show toast
        toastr.success("ارجاع نامه با موفقیت انجام شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      } else {
        // Close the modal
        setApply(null)
        setErjaModal(false)
        // show toast
        toastr.error("خطا در ارسال اطلاعات! لطفا مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }

  // ************* modal validation formik ***************
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // parent: '',
      description: "",
      reciver: [],
    },
    validationSchema: Yup.object().shape({
      // parent: Yup.object()
      //   .required('حداقل باید یک کاربر انتخاب کنید'),
      description: Yup.string(),
      reciver: Yup.array().min(1, "حداقل باید یک کاربر انتخاب کنید"),
    }), // Pass the Yup schema here
    onSubmit: values => {
      handleSend(values)
    },
  })

  React.useEffect(() => {
    setLoading(true)
    getInboxList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "نامه های دریافتی - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <Modal isOpen={erjaModal} toggle={toggle} centered={true}>
        <div className="modal-content">
          <ModalBody className="px-4 py-5 text-center">
            <button
              type="button"
              onClick={toggle}
              className="btn-close position-absolute end-0 top-0 m-3"
            ></button>
            <div className="avatar-sm mb-4 mx-auto">
              <div className="btn-soft-info rounded-3 rounded-circle">
                <i
                  className="mdi mdi-email-send-outline"
                  style={{ fontSize: "28px" }}
                ></i>
              </div>
            </div>
            <Row>
              <Col xs={12}>
                <h6 className="mb-4 card-title">ارجاع نامه</h6>
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <Row>
                      {/* <Col lg={12}>
                        <div className="mt-3 text-start" style={{ zIndex: '9999' }}>
                          <Label> ارجاع از <span className="requareForm">*</span></Label>
                          <Select
                            name="parent"
                            value={selectedGroup}
                            onChange={(newValue) => {
                              handleSelectGroup(newValue),
                                formik.setFieldValue('parent', newValue)
                            }}
                            options={fromGroup.map(group => ({
                              label: group.label,
                              value: group.value,
                              imageSrc: group.imageSrc, // Provide the image source for each option
                            }))}
                            className="select2-selection text-start"
                            noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                            getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                            getOptionValue={(option) => option.label}
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
                            invalid={
                              formik.touched.parent && formik.errors.parent ? true : false
                            }
                          />
                          {formik.touched.parent && formik.errors.parent ? (
                            <div className="text-danger mt-1 small">{formik.errors.parent}</div>
                          ) : null}
                        </div>
                      </Col> */}
                      <Col lg={12}>
                        <div
                          className="mt-3 text-start"
                          style={{ zIndex: "9999" }}
                        >
                          <Label>
                            گیرنده <span className="requareForm">*</span>
                          </Label>
                          <Select
                            name="reciver"
                            value={selectedUser}
                            isMulti={true}
                            onChange={newValue => {
                              handleSelectUser(newValue),
                                formik.setFieldValue("reciver", newValue)
                            }}
                            options={optionGroup.map(group => ({
                              label: group.label,
                              value: group.value,
                              imageSrc: group.imageSrc, // Provide the image source for each option
                            }))}
                            className="select2-selection text-start"
                            noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                            placeholder=" انتخاب کنید"
                            getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                            getOptionValue={option => option.label}
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
                            invalid={
                              formik.touched.reciver && formik.errors.reciver
                                ? true
                                : false
                            }
                          />
                          {formik.touched.reciver && formik.errors.reciver ? (
                            <div className="text-danger mt-1 small">
                              {formik.errors.reciver}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={12} className="mt-3 text-start">
                        <label htmlFor="message">توضیحات</label>
                        <Input
                          name="description"
                          type="textarea"
                          rows={5}
                          className="form-control"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="متن خود را وارد کنید"
                        />
                      </Col>
                      <Col lg={12} className="mt-3 text-start">
                        <label htmlFor="message">ضمیمه</label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            onChange={handlechangeFile}
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
                      <Col lg={12} className="mt-3 text-start">
                        <div className=" mt-2 form-check d-inline form-switch form-switch-md ps-0 h-100 d-flex align-items-center">
                          <label className="form-check-label form-label me-5">
                            رونوشت
                          </label>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={roneveshtChecked}
                            onChange={handleChangeChecked}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="hstack gap-2 mt-4 justify-content-end mb-0">
                      <button
                        type="submit"
                        className="btn text-nowrap btn-success"
                        // onClick={handleSend}
                      >
                        ارسال
                      </button>
                    </div>
                  </div>
                </form>
              </Col>
            </Row>
          </ModalBody>
        </div>
      </Modal>
      {/* <ArchiveModal
        show={archiveModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setArchiveModal(false)}
      /> */}
      <div className="container-fluid">
        <Breadcrumbs title="صندوق ورودی" breadcrumbItem="نامه های دریافتی" />
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
DataTablesInboxLetters.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DataTablesInboxLetters
