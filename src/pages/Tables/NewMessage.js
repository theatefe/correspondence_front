import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Select from "react-select"
import Dropzone from "react-dropzone"
// Import Editor
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  CardSubtitle,
  Label,
  FormFeedback,
  Spinner,
  Alert,
} from "reactstrap"
//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// image
import imageType from "./../../assets/images/useIcons/types/pic-type.png"
import excelType from "../../assets/images/useIcons/types/excel-type.png"
import wordType from "../../assets/images/useIcons/types/word-type.png"
import zipType from "../../assets/images/useIcons/types/zip-type.png"
import pdfType from "../../assets/images/useIcons/types/pdf-type.png"
import videoType from "../../assets/images/useIcons/types/video-type.png"
import attachType from "../../assets/images/useIcons/types/attach-type.png"
import AttachedImg from "../../assets/images/icons/attachedImg.png"
import logo from "../../assets/images/brands/avatar-temp.png"
import { useFormik } from "formik"
import * as Yup from "yup"

function MessageCreate() {
  const token = localStorage.getItem("token")
  const [selectedMulti, setselectedMulti] = React.useState(null)
  const [selectedFiles, setselectedFiles] = React.useState([])
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [userList, setUserList] = React.useState([])
  const [errorAlert, setErrorAlert] = React.useState(false)
  const [successAlert, setSuccessAlert] = React.useState(false)
  const [textAlert, setTextAlert] = React.useState(false)
  const [showSubmit, setShowSubmit] = React.useState(true)
  const [draft, setdraft] = React.useState(false)
  // get users
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
        const result = data
        const users = result.map(item => {
          var post =
            item.profiles[0].post != null ? item.profiles[0].post : "کاربر"
          return {
            value: item.id,
            label: item.first_name + " " + item.last_name + " (" + post + ")",
          }
        })
        setUserList(users)
      })
  }
  //meta title
  document.title = "پیام جدید - سامانه مکاتبات"
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti)
  }

  function handleAcceptedFiles(files) {
    setShowSubmit(false)
    //setUploadFiles([]);
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    files.map(x => setselectedFiles(i => [...i, x]))
    if (files) {
      files.map(item => {
        const formData = new FormData()
        formData.append("file", item)
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
      })
      setTimeout(() => {
        setShowSubmit(true)
        toastr.success("آپلود فایل با موفقیت انجام شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }, 500)
    }
  }
  // draft function
  const draftMessageRequest = values => {
    setdraft(false)
    const media = uploadFiles
    const url = `http://localhost:3000/messanger/goto-draft/`
    const formData = {
      media: media,
      body: values.text,
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
      console.log(response)
      if (response && response.status == 201) {
        toastr.success("پیام شما با موفقیت در پیش نویس ذخیره شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setUploadFiles([])
        window.setTimeout(() => {
          window.open("/draft-messages", "_self")
          return false
        }, 3000)
      } else {
        toastr.error(
          "ذخیره پیام در پیش نویس با خطا مواجه شده است، لطفا مجدد امتحان کنید"
        )
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        // window.setTimeout(() => {
        //   window.location.reload();
        // }, 3000)
      }
    })
    console.log(values)
  }

  // remove file
  const handleRemoveFile = item => {
    setselectedFiles(oldArr => {
      return oldArr.filter(x => x !== item)
    })
    setUploadFiles(oldArr => {
      return oldArr.filter(x => x !== item)
    })
  }

  // submit form
  const handleOnSubmit = values => {
    const reciver = values.audience
      ? values.audience.map(item => {
          return item.value
        })
      : null
    const media = uploadFiles
    const url = `http://localhost:3000/messanger/insert-message/`
    const formData = {
      media: media,
      receive: reciver,
      title: values.title,
      body: values.text,
      status: parseInt(2),
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
      if (response && response.status == 201) {
        toastr.success("پیام شما با موفقیت ارسال شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setUploadFiles([])
        window.setTimeout(() => {
          window.open("/outbox-messages", "_self")
          return false
        }, 3000)
      } else {
        toastr.error("ارسال پیام با خطا مواجه شده است، لطفا مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        // window.setTimeout(() => {
        //   window.location.reload();
        // }, 3000)
      }
    })
  }
  // form validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      text: "",
      audience: [],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(3, "عنوان باید بیشتر از 3 کاراکتر باشد")
        .required("عنوان پیام را وارد نمایید"),
      text: Yup.string()
        .min(3, "متن پیام باید بیشتر از 3 کاراکتر باشد")
        .required("متن پیام را وارد نمایید"),
      audience: Yup.array()
        .min(1, "حداقل باید یک کاربر انتخاب کنید")
        .max(5, "حداکثر می‌توانید 5 کاربر انتخاب کنید"),
    }), // Pass the Yup schema here
    onSubmit: values => {
      if (draft) {
        draftMessageRequest(values)
      } else {
        handleOnSubmit(values)
      }
      // Handle form submission here, e.g., make an API call
    },
  })
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  React.useEffect(() => {
    setLoading(true)
    setUploadFiles([])
    getUsers()
    setLoading(false)
    setTimeout(() => {}, 1000)
  }, [])

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="پیام ها" breadcrumbItem="پیام جدید" />
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <h6 className="card-title">پیام جدید</h6>
                    <CardSubtitle className="mb-3">
                      {" "}
                      جهت ایجاد پیام جدید، فیلدهای زیر را تکمیل کنید.
                    </CardSubtitle>

                    <Row className="mt-3">
                      <Col lg="6">
                        <div className="mb-3">
                          <Label> عنوان پیام</Label>{" "}
                          <span className="requareForm">*</span>
                          <Input
                            name="title"
                            placeholder="عنوان پیام خود را وارد کنید"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            invalid={
                              formik.touched.title && formik.errors.title
                                ? true
                                : false
                            }
                          />
                          {formik.touched.title && formik.errors.title ? (
                            <FormFeedback type="invalid">
                              {formik.errors.title}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3 ajax-select  select2-container">
                          <Label>گیرنده پیام</Label>{" "}
                          <span className="requareForm">*</span>
                          <Select
                            name="audience"
                            value={selectedMulti}
                            isMulti={true}
                            onChange={newValue => {
                              handleMulti(newValue),
                                formik.setFieldValue("audience", newValue)
                            }}
                            options={userList}
                            className="select2-selection text-start zIndex2"
                            noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                            placeholder=" انتخاب کنید"
                            // components={{
                            //   Option: OptionWithImage, // Use the custom option component
                            // }}
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
                              formik.touched.audience && formik.errors.audience
                                ? true
                                : false
                            }
                          />
                          {formik.touched.audience && formik.errors.audience ? (
                            <div className="text-danger mt-1 small">
                              {formik.errors.audience}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg="12">
                        <div className="mb-3">
                          <Label> متن پیام</Label>
                          <span className="requareForm">*</span>
                          <Input
                            name="text"
                            type="textarea"
                            rows={7}
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.text}
                            invalid={
                              formik.touched.text && formik.errors.text
                                ? true
                                : false
                            }
                          />
                          {formik.touched.text && formik.errors.text ? (
                            <FormFeedback type="invalid">
                              {formik.errors.text}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <h6 className="card-title"> افزودن پیوست </h6>
                    <CardSubtitle className="mb-3">
                      {" "}
                      جهت افزودن فایل آن را Drag & Drop کرده یا روی دکمه پایین
                      کلیک کنید.
                    </CardSubtitle>
                    {showSubmit ? (
                      <>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles)
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="display-3 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h5>
                                  فایل مورد نظر را انتخاب کرده و سپس دکمه آپلود
                                  را کلیک کنید
                                </h5>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <Spinner color="secondary">Loading...</Spinner>
                        </div>
                      </>
                    )}
                    {showSubmit ? (
                      <>
                        <div
                          className="dropzone-previews mt-3 row mx-0"
                          id="file-previews"
                        >
                          {selectedFiles.map((item, index) => {
                            return (
                              <Col
                                className="col-12 col-sm-auto me-sm-2 mt-2 mt-sm-2 attachedBox position-relative"
                                key={index}
                              >
                                <Link
                                  className="deleteUploadedFile"
                                  onClick={() => handleRemoveFile(item)}
                                >
                                  <div className="deleteIconArea">
                                    <i className="bx bx-trash"></i>
                                  </div>
                                </Link>
                                <Link>
                                  <Row className="justify-content-start">
                                    <Col className="col-auto px-0">
                                      <img
                                        data-dz-thumbnail=""
                                        height="80"
                                        className="avatar-sm rounded bg-light"
                                        alt={item.name}
                                        src={
                                          item.type.includes("image")
                                            ? imageType
                                            : item.type.includes("sheet")
                                            ? excelType
                                            : item.type.includes("zip")
                                            ? zipType
                                            : item.type.includes("pdf")
                                            ? pdfType
                                            : item.type.includes("word")
                                            ? wordType
                                            : item.type.includes("video")
                                            ? videoType
                                            : attachType
                                        }
                                      />
                                    </Col>
                                    <Col className="col-auto my-auto pe-2">
                                      <div className="fw-semibold mb-0">
                                        {item.name.substr(0, 19) + "..."}
                                        <p className="mb-0">
                                          {item.formattedSize}
                                        </p>
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
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <Row className="justify-content-end mt-4 ">
                      <Col className="col-auto">
                        <button
                          onClick={() => setdraft(true)}
                          type="submit"
                          className="btn btn-info m-1"
                        >
                          ذخیره در پیش‌نویس
                        </button>
                        <button
                          type="submit"
                          className={
                            showSubmit
                              ? "btn btn-success m-1"
                              : "btn btn-success m-1"
                          }
                        >
                          ارسال پیام
                        </button>
                      </Col>
                    </Row>
                    {/* <div className="float-end m-4"> */}
                    {/* <button
                        type="button"
                        onClick={handleUpload}
                        className={!showSubmit ? "btn btn-info m-1" : "btn btn-info m-1 disabled"}
                      >
                        آپلود فایل
                      </button> */}

                    {/* </div> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Alert
              color={errorAlert ? "danger" : "success"}
              role="alert"
              isOpen={errorAlert ? errorAlert : successAlert}
              fade={true}
              toggle={() => {
                errorAlert ? setErrorAlert(false) : setSuccessAlert(false)
              }}
            >
              {textAlert}
            </Alert>
          </form>
        </Container>
      </div>
    </>
  )
}

export default MessageCreate
