import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Modal,
  Row,
  Button,
  Collapse,
  ModalBody,
  Label,
  Input,
} from "reactstrap"
import { saveAs } from "file-saver"
import Select from "react-select"
//import images
import adobephotoshop from "../../../assets/images/users/avatar.png"
import LetterImg from "../../../assets/images/companies/uranus-letter-empty.jpg"
import AttachedImg from "../../../assets/images/icons/attachedImg.png"
import ReferralImg from "../../../assets/images/icons/referralLetter.png"
import TranscriptImg from "../../../assets/images/icons/transcriptLetter.png"
import logo from "../../../assets/images/brands/avatar-temp.png"

import { useFormik } from "formik"
import * as Yup from "yup"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import classnames from "classnames"

const Overview = props => {
  const letterDetail = props.letterDetail
  const transmissions = props.transmissions
  const [modal_center, setmodal_center] = useState(false)
  const [modal_center2, setmodal_center2] = useState(false)
  const [modal_center3, setmodal_center3] = useState(false)
  const [modal_body3, setmodal_body3] = useState({})
  //erja variable
  const [apply, setApply] = useState(null)
  const [erjaModal, setErjaModal] = useState(false)
  const [users, setUsers] = React.useState([])
  const [transmitter, setTransmitter] = React.useState([])
  const [selectedUser, setselectedUser] = useState([])
  // Toggle for Modal
  const toggle = () => setErjaModal(!erjaModal)
  const [selectedGroup, setselectedGroup] = useState(null)
  const [roneveshtChecked, setRoneveshtChecked] = useState(false)
  const [uploadFiles, setUploadFiles] = React.useState([])
  // Accordions Steps
  const [col1, setcol1] = useState(true)
  const [col2, setcol2] = useState(false)
  const [col3, setcol3] = useState(true)

  const t_col1 = () => {
    setcol1(!col1)
    setcol2(false)
    setcol3(false)
  }

  const token = localStorage.getItem("token")
  // const [letterDetail, setLetterDetail] = React.useState({});
  const [loading, setLoading] = React.useState()

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function tog_center() {
    setmodal_center(!modal_center)
    removeBodyCss()
  }
  function tog_center2() {
    setmodal_center2(!modal_center2)
    removeBodyCss()
  }

  function tog_center3(item) {
    setmodal_center3(!modal_center3)
    setmodal_body3(item)
    removeBodyCss()
  }

  // ******************* erja function ******************
  const onClickData = id => {
    setApply(id)
    setErjaModal(true)
    getUsers()
    getTransmitter(id)
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
          }
        })
        setUsers(list)
      })
  }
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
  // ************** handle chose trans **************
  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup)
  }
  // ******************** handle check status ***********
  const handleChangeChecked = () => {
    setRoneveshtChecked(!roneveshtChecked)
  }
  // ****************** submit function ******************
  const handleSend = values => {
    const parent = selectedGroup.value
    const transfree = selectedUser.map(item => item.value)
    const description = values.description
    const status = roneveshtChecked ? 2 : 1
    // request body
    const url = `http://localhost:3000/letter/transmission-letter/`
    const formData = {
      letter: apply,
      status: status,
      parent: parent,
      description: description,
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
      parent: "",
      description: "",
      reciver: [],
    },
    validationSchema: Yup.object().shape({
      parent: Yup.object().required("حداقل باید یک کاربر انتخاب کنید"),
      description: Yup.string().required("توضیحات ارجاع نمی تواند خالی باشد"),
      reciver: Yup.array()
        .min(1, "حداقل باید یک کاربر انتخاب کنید")
        .max(5, "حداکثر می‌توانید 5 کاربر انتخاب کنید"),
    }), // Pass the Yup schema here
    onSubmit: values => {
      handleSend(values)
    },
  })
  // ************ modal handle chnage file ***************
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
  const fromGroup = transmitter.map(item => {
    return {
      label: item.fullName,
      value: item.id,
    }
  })

  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )

  const optionGroup = users.map(item => {
    return {
      label: item.fullName,
      value: item.id,
    }
  })

  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
  }

  const printInvoice = () => {
    window.print()
  }

  const handleDownloadLetter = item => {
    const fileUrl = `http://localhost:3000${item.file}`
    saveAs(fileUrl, "ضمیمه" + item.id)
  }
  React.useEffect(() => {}, [])

  return (
    <React.Fragment>
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
                      <Col lg={12}>
                        <div
                          className="mt-3 text-start"
                          style={{ zIndex: "9999" }}
                        >
                          <Label>
                            {" "}
                            ارجاع از <span className="requareForm">*</span>
                          </Label>
                          <Select
                            name="parent"
                            value={selectedGroup}
                            onChange={newValue => {
                              handleSelectGroup(newValue),
                                formik.setFieldValue("parent", newValue)
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
                              formik.touched.parent && formik.errors.parent
                                ? true
                                : false
                            }
                          />
                          {formik.touched.parent && formik.errors.parent ? (
                            <div className="text-danger mt-1 small">
                              {formik.errors.parent}
                            </div>
                          ) : null}
                        </div>
                      </Col>
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
                        <label htmlFor="message">
                          توضیحات <span className="requareForm">*</span>
                        </label>
                        <Input
                          name="description"
                          type="textarea"
                          rows={5}
                          className="form-control"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="متن خود را وارد کنید"
                          invalid={
                            formik.touched.description &&
                            formik.errors.description
                              ? true
                              : false
                          }
                        />
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <div className="text-danger mt-1 small">
                            {formik.errors.description}
                          </div>
                        ) : null}
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
                            defaultChecked={roneveshtChecked}
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
      <Col xl={3} className="d-print-none">
        <Card>
          <CardBody>
            <h5 className="fw-semibold">جزئیات نامه</h5>

            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="col">شماره نامه</th>
                    <td scope="col">
                      {letterDetail.number != "null"
                        ? letterDetail.number
                        : "*****"}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">تاریخ ساخت نامه</th>
                    <td>{letterDetail.createDate || null}</td>
                  </tr>
                  <tr>
                    <th scope="row">نوع نامه</th>
                    <td>داخلی</td>
                  </tr>
                  <tr>
                    <th scope="row">طبقه‌بندی</th>
                    <td>
                      <span className="badge badge-soft-warning">
                        {letterDetail.type || null}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">فوریت</th>
                    <td>
                      <span
                        className={
                          letterDetail.priority == "عادی"
                            ? "badge badge-soft-success"
                            : "badge badge-soft-danger"
                        }
                      >
                        {letterDetail.priority || null}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">نامه مرتبط</th>
                    <td>
                      {" "}
                      {letterDetail.linked || null}{" "}
                      {letterDetail.linked != "ندارد" ? (
                        <Link
                          onClick={() => {
                            tog_center()
                          }}
                        >
                          (مشاهده)
                        </Link>
                      ) : (
                        <></>
                      )}
                      <Modal
                        isOpen={modal_center}
                        toggle={() => {
                          tog_center()
                        }}
                        centered
                      >
                        <div className="modal-header">
                          <h5 className="modal-title mt-0">
                            نامه شماره {letterDetail.linked}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              setmodal_center(false)
                            }}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body text-center">
                          <img
                            src={`http://localhost:3000${letterDetail.linkedMedia}`}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </Modal>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">پیوست نامه</th>
                    <td>
                      {" "}
                      {letterDetail.checkAttachment || null}{" "}
                      {letterDetail.checkAttachment == "دارد" ? (
                        <Link
                          onClick={() => {
                            tog_center2()
                          }}
                        >
                          (مشاهده)
                        </Link>
                      ) : (
                        <></>
                      )}
                      <Modal
                        isOpen={modal_center2}
                        toggle={() => {
                          tog_center2()
                        }}
                        centered
                      >
                        <div className="modal-header">
                          <h5 className="modal-title mt-0">پیوست‌های نامه</h5>
                          <button
                            type="button"
                            onClick={() => {
                              setmodal_center2(false)
                            }}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <strong className="text-dark">فایل پیوست:</strong>

                          <Row className="mx-0 mt-3">
                            {letterDetail.attachments &&
                              letterDetail.attachments.map((item, index) => {
                                return (
                                  <Col
                                    className="col-12 col-sm-auto me-sm-2 mt-2 mt-sm-0 attachedBox"
                                    key={index}
                                  >
                                    {/* <a href={`http://localhost:3000${item.file}`}
                                    download={item.file}
                                    target="_blank"
                                    rel="noreferrer"> */}
                                    <Link
                                      onClick={() => handleDownloadLetter(item)}
                                    >
                                      <Row className="justify-content-start">
                                        <Col className="col-auto px-0">
                                          <img
                                            src={AttachedImg}
                                            alt=""
                                            height="50"
                                          />
                                        </Col>
                                        <Col className="col-auto my-auto pe-2">
                                          <div className="fw-semibold mb-0">
                                            ضمیمه {index + 1}
                                          </div>
                                          <ul className="list-unstyled hstack gap-2 mb-0">
                                            <li>
                                              <span className="fw-light">
                                                دانلود
                                              </span>
                                            </li>
                                          </ul>
                                        </Col>
                                      </Row>
                                    </Link>
                                  </Col>
                                )
                              })}
                          </Row>
                        </div>
                      </Modal>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hstack gap-2">
              <button
                onClick={printInvoice}
                className="btn btn-soft-primary w-100"
              >
                {" "}
                چاپ نامه <i className="mdi mdi-download"></i>
              </button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <img
                src={adobephotoshop}
                alt=""
                height="50"
                className="mx-auto d-block avatarStyle"
              />
              <p className="fw-light mb-0">سازنده نامه</p>

              <h5 className="mt-2 mb-1">
                {" "}
                {transmissions &&
                  transmissions[0].transmitter.first_name +
                    " " +
                    transmissions[0].transmitter.last_name}
              </h5>
              <p className="fw-light mb-0">
                {transmissions && transmissions[0].transmitter.profiles[0].post}
              </p>
            </div>
            <ul className="list-unstyled mt-4"></ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h5 className="text-center mb-2">
              ردیابی نامه <i className="mdi mdi-routes fs-3"></i>
            </h5>
            <Button
              color="light"
              className={
                "btn badge-soft-secondary waves-effect text-start mt-2"
              }
            >
              <span>
                {" "}
                {transmissions &&
                  transmissions[0].transmitter.first_name +
                    " " +
                    transmissions[0].transmitter.last_name}
              </span>
              <br />(
              {transmissions && transmissions[0].transmitter.profiles[0].post})
            </Button>
            {transmissions &&
              transmissions.map((item, index) => (
                <>
                  <span className="mx-2">
                    <i className="mdi mdi-arrow-left-thick"></i>
                  </span>
                  <Button
                    onClick={() => {
                      tog_center3(item)
                    }}
                    color="light"
                    className={
                      item.status == 1
                        ? "btn badge-soft-nilii waves-effect text-start mt-2"
                        : "btn badge-soft-kaleqazi waves-effect text-start mt-2"
                    }
                    key={index}
                  >
                    از :{" "}
                    {item.transmitter.first_name +
                      " " +
                      item.transmitter.last_name || " "}
                    <br />
                    به :{" "}
                    <span>
                      {item.receiver.first_name +
                        " " +
                        item.receiver.last_name || ""}
                    </span>
                    <br />({item.receiver.profiles[0].post || "کاربر"})
                  </Button>
                </>
              ))}

            <Modal
              isOpen={modal_center3}
              centered
              toggle={() => {
                setmodal_center3(false)
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title mt-0">جزئیات نامه</h5>
                <button
                  type="button"
                  onClick={() => {
                    setmodal_center3(false)
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* <strong className="text-dark">فایل پیوست:</strong> */}

                <Row className="mx-0">
                  <Col className="col-12">
                    <div className="accordion" id="accordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button
                            className={classnames(
                              "accordion-button",
                              "fw-medium",
                              {
                                collapsed: !col1,
                              }
                            )}
                            type="button"
                            onClick={t_col1}
                            style={{ cursor: "pointer" }}
                          >
                            <Row>
                              <Col className="d-none d-sm-block col px-0">
                                {" "}
                                <img
                                  src={
                                    modal_body3.status &&
                                    modal_body3.status == 1
                                      ? ReferralImg
                                      : TranscriptImg
                                  }
                                  alt=""
                                  className="img-fluid w-100"
                                  style={{
                                    maxHeight: "50.49px",
                                    maxWidth: "50.49px",
                                  }}
                                />
                              </Col>
                              <Col className="col-auto my-auto">
                                <h5 className="fw-semibold mb-1 text-start">
                                  {modal_body3.transmitter
                                    ? modal_body3.transmitter.first_name +
                                      " " +
                                      modal_body3.transmitter.last_name
                                    : " "}
                                  (
                                  {modal_body3.transmitter &&
                                  modal_body3.transmitter.profiles[0].post !=
                                    null
                                    ? modal_body3.transmitter.profiles[0].post
                                    : "کاربر"}
                                  )
                                  <span
                                    className={
                                      modal_body3.status &&
                                      modal_body3.status == 1
                                        ? "badge-soft-nilii badge bg-secondary"
                                        : "badge-soft-kaleqazi badge bg-secondary"
                                    }
                                  >
                                    {modal_body3.status &&
                                    modal_body3.status == 1
                                      ? "ارجاع"
                                      : "رونوشت"}
                                  </span>
                                </h5>
                                <ul className="list-unstyled hstack text-start gap-2 mb-0 mt-2">
                                  <li>
                                    <span className="fw-light">
                                      {/* سه شنبه - 12/7/1402 - 15:55 */}
                                      تاریخ ارسال :
                                    </span>{" "}
                                    <span className="fw-light" dir="rtl">
                                      {modal_body3.createDate
                                        ? modal_body3.createDate.substr(0, 10)
                                        : ""}
                                    </span>
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          </button>
                        </h2>

                        <Collapse isOpen={col1} className="accordion-collapse">
                          <div className="accordion-body">
                            <Row className="mx-0 w-100">
                              <div className="col-12 px-0">
                                {/* <strong className="text-dark">توضیحات:</strong> */}
                                <p className="fw-light mt-1">
                                  {modal_body3.description}
                                </p>
                                {modal_body3.attach &&
                                modal_body3.attach.lenght > 0 ? (
                                  <div className="letterAttachments">
                                    <strong className="text-dark">
                                      فایل پیوست:
                                    </strong>

                                    <Row className="mx-0">
                                      <Col className="col-12 col-sm-auto attachedBox">
                                        <Link>
                                          <Row className="justify-content-start">
                                            <Col className="col-auto px-0">
                                              <img
                                                src={AttachedImg}
                                                alt=""
                                                height="50"
                                              />
                                            </Col>
                                            <Col className="col-auto my-auto pe-2">
                                              <div className="fw-semibold mb-0">
                                                mohasebat
                                              </div>
                                              <ul className="list-unstyled hstack gap-2 mb-0">
                                                <li>
                                                  <span className="fw-light">
                                                    دانلود
                                                  </span>
                                                </li>
                                              </ul>
                                            </Col>
                                          </Row>
                                        </Link>
                                      </Col>
                                    </Row>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Row>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>
            <Row className="justify-content-end mt-3">
              <Col className="col-12 d-flex align-items-center justify-content-end">
                ارجاع <div className="erjaBoxColor"></div>
              </Col>
              <Col className="col-12 d-flex align-items-center justify-content-end">
                رونوشت <div className="runeveshtBoxColor"></div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Overview
