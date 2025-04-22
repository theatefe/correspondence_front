import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { NotificationContainer } from "react-notifications"
import "react-notifications/lib/notifications.css"
import dayjs from "dayjs"
import "dayjs/locale/fa" // برای تنظیم زبان فارسی
import jalali from "dayjs-jalali" // پلاگین تبدیل تاریخ به جلالی
import moment from "moment-jalaali"
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
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
// api ****************************************************
import signLetterApi from "../../../api/user/letter/sign"
import numberingLetterApi from "../../../api/user/letter/numbering"
import getUsersApi from "../../../api/user/List"
import createTrackingApi from "../../../api/user/letter/tracking/create"
import uploadFileApi from "../../../api/common/uploadFile"
import deleteUploadFileApi from "../../../api/common/deleteUploadFile"
import LetterDetailApi from "../../../api/user/letter/DetailLetter"
// Image *************************************************
import attachFileImage from "../../../assets/images/attachFile.png"
import adobephotoshop from "../../../assets/images/users/avatar.png"
import AttachedImg from "../../../assets/images/icons/attachedImg.png"
import ReferralImg from "../../../assets/images/icons/referralLetter.png"
import TranscriptImg from "../../../assets/images/icons/transcriptLetter.png"
import logo from "../../../assets/images/brands/avatar-temp.png"
// فعالسازی پلاگین جلالی
dayjs.extend(jalali)

import classnames from "classnames"

const Overview = ({
  letterDetail,
  setLetterDetail,
  trackings,
  setLetterTrackings,
}) => {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const [clientType, setClientType] = useState(null)
  const [modal_center2, setmodal_center2] = useState(false)
  const [modal_center3, setmodal_center3] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState({})
  //erja variable
  const [apply, setApply] = useState(null)
  const [erjaModal, setErjaModal] = useState(false)
  const [users, setUsers] = React.useState([])
  const [selectedUser, setselectedUser] = useState([])
  // Toggle for Modal
  const toggle = () => setErjaModal(!erjaModal)
  const [roneveshtChecked, setRoneveshtChecked] = useState(false)
  const [uploadFiles, setUploadFiles] = React.useState([])
  // Accordions Steps
  const [col1, setcol1] = useState(true)
  const t_col1 = () => {
    setcol1(!col1)
  }

  const token = localStorage.getItem("token")

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function tog_center2() {
    setmodal_center2(!modal_center2)
    removeBodyCss()
  }
  const toPersianNumber = str => {
    return String(str).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d])
  }
  function openTrackingModal(item) {
    const jalaliCreatedDate = moment(item.createdAt).format("jYYYY/jMM/jDD")
    const newValue = Object.assign(item, {
      jalaliCreatedDate: toPersianNumber(jalaliCreatedDate),
    })
    setmodal_center3(!modal_center3)
    setTrackingInfo(newValue)
    removeBodyCss()
  }

  // ******************* erja function ******************
  const onClickData = id => {
    setApply(id)
    setErjaModal(true)
    getUsers()
  }
  // ******************** get users ***********************
  const getUsers = async () => {
    try {
      const getUsers = await getUsersApi(token)
      const users = getUsers.data.map(item => {
        const position = item.respectfulSide != null ? item.respectfulSide : " "
        return {
          value: item.user.id,
          label: `${item.user.name} ${item.user.lastName} - ${position}`,
        }
      })
      setUsers(users)
    } catch (error) {
      toastr.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "خطا در امضا نامه",
        "خطا!"
      )
    }
  }
  // ******************** handle check status ***********
  const handleChangeChecked = () => {
    setRoneveshtChecked(!roneveshtChecked)
  }
  // ****************** create tracking function ******************
  const handleCreateTrack = async values => {
    try {
      if (selectedUser?.length > 0) {
        await Promise.all(
          values.reciver.map(async reciver => {
            const body = {
              description: values.description || null,
              letterId: letterDetail.id,
              toUserId: reciver.value,
              type: roneveshtChecked ? 1 : 0,
              letterTrackingMedias: uploadFiles.map(media => ({
                mediaId: media.id,
                title: media.title,
              })),
            }
            await createTrackingApi(token, body)
          })
        )
      }
      const updateLetter = await LetterDetailApi(token, letterDetail.id)
      setLetterTrackings(updateLetter.data.letterTrackings)
      toastr.options = {
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        positionClass: "toast-top-right",
      }
      toastr.success("ارجاع نامه با موفقیت انجام شد")
      setselectedUser([])
      formik.resetForm()
      setUsers([])
      // Close the modal
      setApply(null)
      setErjaModal(false)
    } catch (error) {
      console.error("Error in handleCreateTransmission:", error)
      toastr.error("خطا در ارجاع نامه")
    }
  }
  // **************** handle sign letter *****************
  const handleSignLetter = async () => {
    if (letterDetail.id !== null) {
      const data = {
        letterId: Number(letterDetail.id),
      }
      try {
        const response = await signLetterApi(token, data)
        if (response.status === 200) {
          const item = response.data
          const jalaliCreated = item.createdAt
          const jalaliCreatedDate =
            moment(jalaliCreated).format("jYYYY/jMM/jDD")
          const newLetter = {
            id: item.id,
            content: item.content,
            set: item.confidentiality,
            sender:
              item.sender !== null
                ? {
                    id: item.sender.id,
                    fullName: item.sender.name + " " + item.sender.lastName,
                  }
                : null,
            reciver:
              item.reciver !== null
                ? {
                    id: item.reciver.id,
                    fullName: item.reciver.name + " " + item.reciver.lastName,
                  }
                : null,
            signer:
              item.signer != null
                ? {
                    id: item.signer.id,
                    fullName: item.signer.name + " " + item.signer.lastName,
                  }
                : null,
            Signature:
              item.signatureStatus == "امضاشده" ? item.signature : null,
            createDate: jalaliCreatedDate,
            linked: item.attached != null ? item.attachType : "ندارد",
            number: item.number !== null ? item.number : null,
            priority: item.priority,
            title: item.title,
            type: item.type,
            checkAttachment: item.letterMedias.length < 1 ? "ندارد" : "دارد",
            attachments: item.letterMedias,
            status: item.status,
          }
          setLetterDetail(newLetter)
          toastr.options = {
            closeButton: true,
            progressBar: true,
            newestOnTop: true,
            positionClass: "toast-top-right",
          }
          toastr.success("امضا نامه با موفقیت انجام شد")
        } else {
          toastr.error("خطایی رخ داده است", "خطا!")
        }
      } catch (error) {
        toastr.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "خطا در امضا نامه",
          "خطا!"
        )
      }
    }
  }
  // *************** handle numbering letter *************
  const handleNumberingLetter = async () => {
    if (letterDetail.id == null) return
    const data = {
      letterId: letterDetail.id,
    }
    const response = await numberingLetterApi(token, data)
    if (response.status === 200) {
      const item = response.data
      const jalaliCreated = item.createdAt
      const jalaliCreatedDate = moment(jalaliCreated).format("jYYYY/jMM/jDD")
      const newLetter = {
        id: item.id,
        content: item.content,
        set: item.confidentiality,
        sender:
          item.sender !== null
            ? {
                id: item.sender.id,
                fullName: item.sender.name + " " + item.sender.lastName,
              }
            : null,
        reciver:
          item.reciver !== null
            ? {
                id: item.reciver.id,
                fullName: item.reciver.name + " " + item.reciver.lastName,
              }
            : null,
        signer:
          item.signer != null
            ? {
                id: item.signer.id,
                fullName: item.signer.name + " " + item.signer.lastName,
              }
            : null,
        Signature: item.signatureStatus == "امضاشده" ? item.signature : null,
        createDate: jalaliCreatedDate,
        linked: item.attached != null ? item.attachType : "ندارد",
        number: item.number !== null ? item.number : null,
        priority: item.priority,
        title: item.title,
        type: item.type,
        checkAttachment: item.letterMedias.length < 1 ? "ندارد" : "دارد",
        attachments: item.letterMedias,
        status: item.status,
      }
      setLetterDetail(newLetter)
      toastr.options = {
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        positionClass: "toast-top-right",
      }
      toastr.success("نامه با موفقیت شماره شد")
    } else {
      toastr.error("خطایی رخ داده است", "خطا!")
    }
  }
  // ************* modal validation formik ***************
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: "",
      reciver: [],
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().required("توضیحات ارجاع را وارد کنید"),
      reciver: Yup.array().min(1, "حداقل باید یک کاربر انتخاب کنید"),
    }),
    onSubmit: values => {
      handleCreateTrack(values)
    },
  })
  // ******************  handle chnage file ****************
  const handlechangeFile = async e => {
    const files = Array.from(e.target.files)
    const formattedFiles = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    try {
      const uploadPromises = formattedFiles.map(file => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("dist", file.name)
        return uploadFileApi(token, formData)
      })
      const responses = await Promise.all(uploadPromises)
      // ذخیره‌ی شناسه فایل‌های آپلود شده
      responses.forEach(response => {
        if (response.data) {
          setUploadFiles(prevFiles => [
            ...prevFiles,
            {
              id: response.data.id,
              file: response.data.mediaUrl,
              title: formatMediaTitle(response.data.mediaUrl),
            },
          ])
        }
      })
      toastr.options = {
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        positionClass: "toast-top-right",
      }
      toastr.success("آپلود فایل با موفقیت انجام شد")
    } catch (error) {
      console.error("Error uploading file:", error)
      toastr.error("خطا در آپلود فایل")
    }
  }
  //*************** تابع برای استخراج نام فایل *********
  function formatMediaTitle(url) {
    const filename = extractFileName(url)
    // تبدیل underscore و خط تیر به فاصله
    let title = filename.replace(/[_-]/g, " ")
    return title.trim() || "فایل بدون عنوان"
  }
  // *************** تابع استخراج نام فایل از URL **********
  function extractFileName(url) {
    // حذف پارامترهای احتمالی در URL
    const cleanUrl = url.split("?")[0]
    // استخراج آخرین بخش از URL
    const parts = cleanUrl.split("/")
    let filename = parts[parts.length - 1]
    // حذف هش یا شناسه یکتا اگر وجود دارد
    filename = filename.replace(/-[0-9]+$/, "")
    return filename
  }
  // ************* حذف فایل آپلود شده *********************
  const handleDeleteFile = async id => {
    if (id) {
      const result = await deleteUploadFileApi(token, id)
      if (result.status === 200) {
        setUploadFiles(uploadFiles.filter(item => item.id != id))
      }
    }
  }
  // *************** Formats the size ***********************
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
  }
  const handleDownloadLetter = item => {
    const fileUrl = item.mediaObj.mediaUrl
    const mediaName = item.title
    saveAs(fileUrl, mediaName)
  }
  React.useEffect(() => {
    if (letterDetail && userInfo) {
      setClientType(
        letterDetail.signer?.id === userInfo.id
          ? "signer"
          : userInfo.id === letterDetail.sender?.id
          ? "sender"
          : "user"
      )
    }
  }, [letterDetail, userInfo])
  return (
    <React.Fragment>
      <Modal isOpen={erjaModal} centered={true}>
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
                            options={users}
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
                        <label htmlFor="message">توضیحات </label>
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
                        <div className="input-group mb-3">
                          <Input
                            className="form-control"
                            type="file"
                            id="correspondenceAttachments"
                            multiple
                            onChange={e => handlechangeFile(e)}
                          />
                        </div>
                        {uploadFiles.map((file, index) => (
                          <Row className="" key={index}>
                            <div className="col">
                              <div
                                className="card h-100 shadow-sm border border-muted my-1"
                                style={{ maxHeight: "62px" }}
                              >
                                <div className="d-flex align-items-center justify-content-between p-2">
                                  <img
                                    src={attachFileImage}
                                    alt={file.name}
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                      objectFit: "scale-down",
                                    }}
                                    className="me-2"
                                  />
                                  <h6
                                    className="card-title text-truncate mb-0 flex-grow-1"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {file.title}
                                  </h6>
                                  <button
                                    className="btn btn-danger btn-sm ms-1"
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={() => handleDeleteFile(file.id)}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                                <div className="position-absolute top-0 end-0 m-2">
                                  <span className="badge bg-primary">
                                    {file.formattedSize}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Row>
                        ))}
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
              <NotificationContainer />

              <table className="table">
                <tbody>
                  <tr className="first-step">
                    <th scope="col">شماره نامه</th>
                    <td scope="col">
                      {letterDetail && letterDetail.number != null
                        ? letterDetail.number
                        : "*****"}
                    </td>
                  </tr>
                  <tr data-tour="2">
                    <th scope="row">تاریخ ساخت نامه</th>
                    <td style={{ direction: "ltr" }}>
                      {letterDetail?.createDate}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">نوع نامه</th>
                    <td>{letterDetail?.set || null}</td>
                  </tr>
                  <tr>
                    <th scope="row">طبقه‌بندی</th>
                    <td>
                      <span className="badge badge-soft-warning">
                        {letterDetail?.type || null}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">فوریت</th>
                    <td>
                      <span
                        className={
                          letterDetail?.priority == "عادی"
                            ? "badge badge-soft-success"
                            : "badge badge-soft-danger"
                        }
                      >
                        {letterDetail?.priority || null}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">وضعیت</th>
                    <td>
                      <span className="badge badge-soft-success">
                        {letterDetail?.status || null}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">پیوست نامه</th>
                    <td>
                      {" "}
                      {letterDetail?.checkAttachment || null}{" "}
                      {letterDetail?.checkAttachment == "دارد" ? (
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
                            {letterDetail?.attachments &&
                              letterDetail?.attachments.map((item, index) => {
                                return (
                                  <Col
                                    className="col-12 col-sm-auto me-sm-2 mt-2 mt-sm-0 attachedBox position-relative"
                                    key={index}
                                  >
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
                                            {item.file}
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
                onClick={() => {
                  onClickData(letterDetail.id)
                }}
                className="btn btn-primary w-100"
              >
                {" "}
                ارجاع‌ نامه <i className="mdi mdi-email-send-outline"></i>
              </button>
              {(clientType === "signer" || clientType === "sender") &&
              letterDetail.status !== "شماره شده" ? (
                <button
                  className="btn btn-warning w-100"
                  onClick={() => navigate(`/letter/edit/${letterDetail.id}`)}
                >
                  {" "}
                  ویرایش نامه <i className="mdi mdi-comment-edit"></i>
                </button>
              ) : (
                <></>
              )}
            </div>
            {clientType === "signer" && (
              <div className="hstack gap-2 mt-2">
                {letterDetail.status === "ثبت شده" && (
                  <>
                    <button
                      onClick={handleSignLetter}
                      className="btn btn-info w-100"
                    >
                      امضا نامه <i className="mdi mdi-draw"></i>
                    </button>
                    <button
                      onClick={handleNumberingLetter}
                      className="btn btn-success w-100"
                    >
                      شماره نامه <i className="mdi mdi-numeric"></i>
                    </button>
                  </>
                )}
                {letterDetail.status === "امضا شده" && (
                  <button
                    onClick={handleNumberingLetter}
                    className="btn btn-success w-100"
                  >
                    شماره نامه <i className="mdi mdi-numeric"></i>
                  </button>
                )}
              </div>
            )}
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
                {letterDetail?.sender && letterDetail?.sender?.fullName}
              </h5>
            </div>
            <ul className="list-unstyled mt-4"></ul>
          </CardBody>
        </Card>

        {trackings.length > 0 && (
          <Card>
            <CardBody>
              <h5 className="text-center mb-2">
                ردیابی نامه <i className="mdi mdi-routes fs-3"></i>
              </h5>
              {trackings &&
                trackings.map((item, index) => (
                  <>
                    {index == 0 ? (
                      <></>
                    ) : (
                      <span className="mx-2">
                        <i className="mdi mdi-arrow-left-thick"></i>
                      </span>
                    )}
                    <Button
                      onClick={() => {
                        openTrackingModal(item)
                      }}
                      color="light"
                      className={
                        item.type == 0
                          ? "btn badge-soft-nilii waves-effect text-start mt-2"
                          : item.type == 1
                          ? "btn badge-soft-kaleqazi waves-effect text-start mt-2"
                          : "btn badge-soft-success waves-effect text-start mt-2"
                      }
                      key={index}
                    >
                      از :{" "}
                      {item.fromUser
                        ? item.fromUser.name + " " + item.fromUser.lastName
                        : "-"}
                      <br />
                      به :{" "}
                      <span>
                        {item.toUser
                          ? item.toUser.name + " " + item.toUser.lastName
                          : "-"}
                      </span>
                      <br />
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
                  <h5 className="modal-title mt-0">جزئیات ارجاع</h5>
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
                                      trackingInfo && trackingInfo.type == 0
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
                                    {trackingInfo?.toUser?.name +
                                      " " +
                                      trackingInfo?.toUser?.lastName}
                                    <span
                                      className={
                                        trackingInfo && trackingInfo.type == 0
                                          ? "mx-2 badge-soft-nilii badge bg-secondary"
                                          : trackingInfo.type == 1
                                          ? "mx-2 badge-soft-kaleqazi badge bg-secondary"
                                          : "mx-2 badge-soft-success badge bg-secondary"
                                      }
                                    >
                                      {trackingInfo.typeText}
                                    </span>
                                  </h5>
                                  <ul className="list-unstyled hstack text-start gap-2 mb-0 mt-2">
                                    <li>
                                      <span className="fw-light">
                                        تاریخ ارسال :
                                      </span>{" "}
                                      <span className="fw-light" dir="rtl">
                                        {trackingInfo.jalaliCreatedDate}
                                      </span>
                                    </li>
                                  </ul>
                                </Col>
                              </Row>
                            </button>
                          </h2>

                          <Collapse
                            isOpen={col1}
                            className="accordion-collapse"
                          >
                            <div className="accordion-body">
                              <Row className="mx-0 w-100">
                                <div className="col-12 px-0">
                                  <span className="fw-light mt-1">
                                    فرستنده:
                                  </span>
                                  <p className="">{`${trackingInfo?.fromUser?.name} ${trackingInfo?.fromUser?.lastName}`}</p>
                                  <span className="fw-light mt-1">
                                    توضیحات:
                                  </span>
                                  <p className="">{trackingInfo.description}</p>
                                  <div className="letterAttachments">
                                    <span className="fw-light mt-1">
                                      فایل پیوست:
                                    </span>

                                    <Row className="mx-0">
                                      {trackingInfo.letterTrackingMedias &&
                                      trackingInfo.letterTrackingMedias.length >
                                        0 ? (
                                        trackingInfo.letterTrackingMedias.map(
                                          (item, index) => {
                                            return (
                                              <Col
                                                className="col-12 me-sm-2 mt-1 attachedBox"
                                                key={index}
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
                                                      {" "}
                                                      {item.title}
                                                    </div>
                                                    <Link
                                                      onClick={() =>
                                                        handleDownloadLetter(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <ul className="list-unstyled hstack gap-2 mb-0">
                                                        <li>
                                                          <span className="fw-light">
                                                            دانلود
                                                          </span>
                                                        </li>
                                                      </ul>
                                                    </Link>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            )
                                          }
                                        )
                                      ) : (
                                        <>
                                          <div className="col-12 px-0">
                                            {/* <strong className="text-dark">توضیحات:</strong> */}
                                            <p className="fw-light mt-2">
                                              ضمیمه‌ای وجود ندارد.
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </Row>
                                  </div>
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
                <Col className="col-12 d-flex align-items-center justify-content-end">
                  پاسخ <div className="answerBoxColor"></div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      </Col>
    </React.Fragment>
  )
}

export default Overview
