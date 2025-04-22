import React, { useState, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { saveAs } from "file-saver"
import Dropzone from "react-dropzone"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import {
  Modal,
  ModalBody,
  Container,
  Card,
  CardBody,
  Spinner,
  Label,
  Col,
  Row,
  Button,
  Input,
  Form,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
} from "reactstrap"
import Select from "react-select"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useFormik } from "formik"
import * as Yup from "yup"

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
import adobephotoshop from "../../assets/images/users/avatar.png"
import AttachedImg from "../../assets/images/icons/attachedImg.png"
import logo from "../../assets/images/brands/avatar-temp.png"

import classnames from "classnames"

import TableContainer from "../../components/Common/TableContainer"

import { Type } from "../JobPages/JobList/JobListCol"

const ViewMessages = () => {
  document.title = "مشاهده پیام - سامانه مکاتبات"
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState(false)
  const { id } = useParams()
  const [users, setUsers] = React.useState([])
  const [isReplying, setIsReplying] = useState(false)
  const [isReload, setIsReload] = useState(false)
  const [sendingReply, setSendingReply] = useState(false)
  const [conversation, setConversation] = useState({})
  const [messages, setMessages] = useState([])
  const [userInfo, setUserInfo] = useState()
  const [forwardModal, setForwardModal] = React.useState(false)
  const [selectedFiles, setselectedFiles] = React.useState([])

  const [forwardConversation, setForwardConversation] = React.useState(null)

  const [uploadFiles, setUploadFiles] = React.useState([])
  const [forwardMsgId, setForwardMsgId] = React.useState()
  const [selectedUser, setselectedUser] = useState([])
  const [file, setFile] = useState(null)
  const replyText = React.useRef()
  // Toggle for Modal
  const toggle = () => setForwardModal(!forwardModal)
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
        const list = data.map(item => {
          return {
            id: item.id,
            fullName: item.first_name + " " + item.last_name,
          }
        })
        setUsers(list)
      })
  }
  // get user info
  const getUserInfo = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-login-user/`, config)
      .then(res => res.json())
      .then(result => {
        const data = result[1]
        setUserInfo(data.id)
      })
  }
  // update seen
  const updateSeenFub = () => {
    if (userInfo == conversation.receiver) {
      const url = `http://localhost:3000/messanger/update-seen-conversation/${id}/`
      const headers = new Headers({
        Authorization: "Bearer " + token,
        accept: "application/json",
        "Content-Type": "application/json",
      })
      fetch(url, {
        headers: headers,
        method: "PUT",
        mode: "cors",
      })
    }
  }
  // get detail message
  const getDetailMessages = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(
      `http://localhost:3000/messanger/get-detail-conversation/${id}/`,
      config
    )
      .then(res => res.json())
      .then(result => {
        const data = result[0]
        setConversation({
          title: data.title,
          creator: data.creator,
          audience: data.audience,
          receiver: data.receiver,
        })
        const list = data.messages.map(item => {
          var dateTime = item.createDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          var mediaFiles = item.attachment
          return {
            id: item.id,
            text: item.body,
            senderId: item.sender.id,
            sender: item.sender.first_name + " " + item.sender.last_name,
            status: item.status,
            seen: item.seen,
            createDate: sendDate + " | " + sendTime,
            attachments: mediaFiles,
          }
        })
        setMessages(list)
      })
  }
  const handleReplyClick = () => {
    setIsReplying(true)
  }
  const handleCancelClick = () => {
    setIsReplying(false)
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  // forward modal
  const handleOpenForward = itemId => {
    setForwardModal(!forwardModal)
    setForwardMsgId(itemId)
  }
  // selected user for forward
  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
    getInboxList(selectedUser)
  }
  // select users for forward
  const optionGroup = users.map(item => {
    return {
      label: item.fullName,
      value: item.id,
    }
  })
  // formik forward
  const forwardFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      forwardReciver: "",
      forwardTitle: "",
    },
    validationSchema: Yup.object().shape({
      forwardReciver: Yup.object().required("حداقل باید یک کاربر انتخاب کنید"),
      forwardTitle: Yup.string(),
    }),
    onSubmit: values => {
      handleSendForward(values)
    },
  })
  // send forward
  const handleSendForward = values => {
    const reciver = values.forwardReciver.value
    const forwardTitle = values.forwardTitle
    // request body
    const url = `http://localhost:3000/messanger/forward-message/`
    let formData
    if (forwardConversation != null) {
      formData = {
        receive: reciver,
        title: null,
        message: forwardMsgId,
        conversation: forwardConversation,
      }
    } else {
      formData = {
        receive: reciver,
        title: forwardTitle,
        message: forwardMsgId,
        conversation: null,
      }
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
        setForwardModal(false)
        setForwardMsgId()
        setselectedUser([])
        toastr.success("هدایت پیام با موفقیت انجام شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        window.setTimeout(() => {
          window.open("/inbox-messages", "_self")
          return false
        }, 2000)
      } else {
        setForwardModal(false)
        setForwardMsgId()
        setselectedUser([])
        toastr.error("هدایت پیام با خطا روبرو شده است، لطفا مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }
  // handle chnage file
  function handlechangeFile(files) {
    setUploadFiles([])
    //const files = files;
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
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
      toastr.success("آپلود فایل با موفقیت انجام شد")
      toastr.options = {
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        positionClass: "toast-top-right",
      }
    }
  }
  // handle upload file
  const handleUploadFile = () => {
    if (!file) {
      alert("file is not exist!")
    } else {
      // selectAttachments.forEach((item) => {
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
            toastr.success("آپلود فایل با موفقیت انجام شد")
            toastr.options = {
              closeButton: true,
              progressBar: true,
              newestOnTop: true,
              positionClass: "toast-top-right",
            }
            setUploadFiles(x => [data.id])
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  // send reply
  const handleSend = event => {
    event.preventDefault()
    const text = replyText.current.value
    if (text.length < 1) {
      toastr.warning("متن پیام وارد نشده است")
      toastr.options = {
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        positionClass: "toast-top-right",
      }
      return
    }
    setSendingReply(true)
    const media = uploadFiles
    const reciver =
      conversation.creator == userInfo
        ? conversation.audience
        : conversation.creator
    const formData = {
      media: media,
      conversation: id,
      body: text,
      status: 1,
      receive: reciver,
    }
    const url = `http://localhost:3000/messanger/response-message/`
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
    })
      .then(res => res.json())
      .then(() => {
        replyText.current.value = null
        setIsReplying(false)
        toastr.success("پیام با موفقیت ارسال شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setIsReload(true)
        setSendingReply(false)
      })
  }
  // close forward
  const closeForward = () => {
    setForwardModal(false)
    setselectedUser([])
    setInboxList([])
  }
  // formatBytes
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // Forward Modal Multi Tab
  const [customActiveTab, setcustomActiveTab] = useState("1")

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab)
    }
  }

  const [inboxList, setInboxList] = React.useState([])

  // handle choose conversation
  const handleChooseConversation = value => {
    const conversationId = value.value
    setForwardConversation(conversationId)
  }
  // get table lis
  const getInboxList = selectedUser => {
    const reciverId = selectedUser.value
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(
      `http://localhost:3000/messanger/get-exist-conversation/${reciverId}/`,
      config
    )
      .then(response => response.json())
      .then(result => {
        const messages = result.map(item => {
          var dateTime = item.updateDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          return {
            id: item.id,
            sender: selectedUser.label,
            title: item.title.substr(0, 42),
            createDate: sendDate,
          }
        })
        setInboxList(messages)
      })
  }

  const columns = useMemo(
    () => [
      {
        Header: "انتخاب مکالمه",
        accessor: "id",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="list-unstyled hstack gap-1 mb-0"
          >
            <Input
              type="radio"
              onClick={() => handleChooseConversation(cell)}
            />
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"نمایش"}`}>
                    <strong>{"نمایش"}</strong>
                  </Tooltip>
                }
              >
                <Link to={`/view-messages/${cell.value}`} className="btn btn-soft-primary">
                <Input type="checkbox" />
                </Link>
              </OverlayTrigger>
            </li> */}
          </div>
        ),
      },
      {
        Header: "فرستنده",
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
    ],
    [selectedUser]
  )
  const data = inboxList.map(item => {
    return {
      id: item.id,
      sender: item.sender,
      title: item.title,
      startDate: item.createDate,
    }
  })

  const handleDownloadAttachment = item => {
    const fileUrl = `http://localhost:3000${item.file}`
    const mediaName = item.file.split("/")
    saveAs(fileUrl, mediaName[2])
  }

  React.useEffect(() => {
    setLoading(true)
    setIsReload(false)
    updateSeenFub()
    getUsers()
    setTimeout(() => {
      getUserInfo()
      getDetailMessages()
      setLoading(false)
    }, 300)
  }, [isReload])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="پیام ها" breadcrumbItem="مشاهده مکالمه" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title messageCardTitle border-bottom pb-2">
                    {conversation.title}
                  </h4>

                  {messages.map((item, index) => {
                    return (
                      <Row
                        className={
                          item.senderId == userInfo
                            ? "justify-content-start mt-3"
                            : "justify-content-end mt-3"
                        }
                        key={index}
                      >
                        <Col className="col-12 col-md-9">
                          <div
                            className={
                              item.senderId == userInfo
                                ? "messagecard received shadow-sm"
                                : "messagecard send shadow-sm"
                            }
                          >
                            <Row className="mx-0">
                              <Col className="col-12 messageTitle">
                                <Row className="justify-content-between mx-0">
                                  <Col className="col-auto ps-0">
                                    <Row>
                                      <Col className="col-auto">
                                        <img
                                          src={adobephotoshop}
                                          alt=""
                                          height="50"
                                          className="mx-auto d-block avatarStyle"
                                        />
                                      </Col>
                                      <Col className="col-auto my-auto">
                                        <Row>
                                          <Col className="col-12 ps-1">
                                            <div className="messageUserName fw-semibold">
                                              {item.status == 4
                                                ? "هدایت شده از : " +
                                                  item.sender
                                                : item.sender}
                                            </div>
                                          </Col>
                                          {/* <Col className="col-12 ps-1">
                                            <div className="messageWhoIS">
                                              کارشناس اداری
                                            </div>
                                          </Col> */}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col className="col-auto my-auto">
                                    <Row>
                                      <Col className="col-12">
                                        <div className="messageDate">
                                          {" "}
                                          <span dir="ltr">
                                            {item.createDate}
                                          </span>
                                          {/* in icon Deliver hast */}
                                          {/* <i className="bx bx-check messageDeliverIcon"></i> */}
                                          {item.seen == 2 ? (
                                            <i className="bx bx-check-double messageDeliverIcon"></i>
                                          ) : (
                                            <i className="bx bx-check messageDeliverIcon"></i>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className="col-12 px-0 mt-2">
                                <p
                                  className="messageText border-bottom"
                                  dir="rtl"
                                >
                                  {item.text}
                                </p>
                              </Col>

                              <Col className="col-12 px-0">
                                <Row
                                  className={
                                    item.attachments &&
                                    item.attachments.length > 0
                                      ? "mx-0 mb-3"
                                      : "mx-0"
                                  }
                                >
                                  {item.attachments &&
                                  item.attachments.length > 0 ? (
                                    item.attachments.map((item, index) => {
                                      return (
                                        <>
                                          <Col className="col-12 col-sm-auto attachedBox messageDownloadArea me-2">
                                            {/* <Link to={`http://localhost:3000${item.file}`}> */}
                                            <Row className="justify-content-start ">
                                              <Col className="col-auto px-0">
                                                <img
                                                  src={AttachedImg}
                                                  alt=""
                                                  height="50"
                                                />
                                              </Col>
                                              <Col className="col-auto my-auto pe-2">
                                                <div>
                                                  <span className="text-secondary">
                                                    ضمیمه {index + 1}
                                                  </span>
                                                </div>
                                                <ul className="list-unstyled hstack gap-2 mb-0">
                                                  <li>
                                                    <a
                                                      onClick={() =>
                                                        handleDownloadAttachment(
                                                          item
                                                        )
                                                      }
                                                      download={item.file}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                    >
                                                      <span className="fw-light attachedBoxText">
                                                        دانلود
                                                      </span>
                                                    </a>
                                                  </li>
                                                </ul>
                                              </Col>
                                            </Row>
                                            {/* </Link> */}
                                          </Col>
                                        </>
                                      )
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Row>
                                <Row className="mx-0 justify-content-end">
                                  <Col className="col-auto px-0">
                                    <OverlayTrigger
                                      placement={"top"}
                                      overlay={
                                        <Tooltip
                                          id={`tooltip-${"هدایت به دیگری"}`}
                                        >
                                          <strong>{"هدایت به دیگری"}</strong>
                                        </Tooltip>
                                      }
                                    >
                                      <button
                                        onClick={() =>
                                          handleOpenForward(item.id)
                                        }
                                        type="button"
                                        className="btn btn-soft-secondary waves-effect waves-light btn-rounded"
                                      >
                                        <i
                                          style={{ fontSize: "16px" }}
                                          className="mdi mdi-email-send-outline"
                                        ></i>
                                      </button>
                                    </OverlayTrigger>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )
                  })}

                  <Row className="mt-5">
                    <Col className="col-12 text-end">
                      {!isReplying ? (
                        <Button
                          color="primary"
                          onClick={handleReplyClick}
                          className="btn btn-primary waves-effect waves-light"
                        >
                          پاسخ
                        </Button>
                      ) : (
                        <div className="messagesEditorArea mt-3">
                          <Form method="post" className="mb-3 text-start">
                            <span className="m-2"> پاسخ پیام</span>
                            <textarea
                              name="text"
                              type="textarea"
                              rows={3}
                              ref={replyText}
                              className="form-control mt-2"
                              placeholder="متن پیام را وارد کنید"
                            />
                            <Col className="col-12 mt-2">
                              <Dropzone
                                onDrop={acceptedFiles => {
                                  handlechangeFile(acceptedFiles)
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
                                        فایل مورد نظر را از این قسمت انتخاب کنید
                                      </h5>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              <div
                                className="dropzone-previews mt-3 row mx-0"
                                id="file-previews"
                              >
                                {selectedFiles.map((f, i) => {
                                  return (
                                    <Card
                                      className="mt-1 mb-0 me-1  border rounded-3 shadow-sm  rounded dz-processing dz-image-preview dz-success dz-complete col-md-auto w-auto"
                                      key={i + "-file"}
                                    >
                                      <div className="p-2  ">
                                        <Row className="align-items-center ">
                                          <Col className="col-auto">
                                            <img
                                              data-dz-thumbnail=""
                                              height="80"
                                              className="avatar-sm rounded bg-light"
                                              alt={f.name}
                                              src={
                                                f.type.includes("image")
                                                  ? imageType
                                                  : f.type.includes("sheet")
                                                  ? excelType
                                                  : f.type.includes("zip")
                                                  ? zipType
                                                  : f.type.includes("pdf")
                                                  ? pdfType
                                                  : f.type.includes("word")
                                                  ? wordType
                                                  : f.type.includes("video")
                                                  ? videoType
                                                  : attachType
                                              }
                                            />
                                          </Col>
                                          <Col>
                                            <Link
                                              to="#"
                                              className="text-muted font-weight-bold"
                                            >
                                              {f.name.substr(0, 9) + "..."}
                                            </Link>
                                            <p className="mb-0">
                                              {f.formattedSize}
                                            </p>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Card>
                                  )
                                })}
                              </div>
                            </Col>
                          </Form>

                          <Button
                            color="secondary"
                            onClick={handleCancelClick}
                            className="btn btn-secondary waves-effect waves-light me-2"
                          >
                            لغو
                          </Button>

                          <Button
                            color="success"
                            onClick={handleSend}
                            className="btn btn-success waves-effect waves-light"
                            disabled={sendingReply ? true : false}
                          >
                            ارسال
                          </Button>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Modal
                    isOpen={forwardModal}
                    toggle={toggle}
                    centered={true}
                    size="lg"
                  >
                    <div className="modal-content">
                      <ModalBody className="pt-5 pb-3 text-center">
                        <form onSubmit={forwardFormik.handleSubmit}>
                          <button
                            type="button"
                            onClick={closeForward}
                            className="btn-close position-absolute end-0 top-0 m-3"
                          ></button>
                          <div className="avatar-sm mb-4 mx-auto">
                            <div className="btn-soft-primary rounded-3 rounded-circle">
                              <i
                                className="mdi mdi-email-send-outline"
                                style={{ fontSize: "28px" }}
                              ></i>
                            </div>
                          </div>
                          <Row>
                            <Col xs={12}>
                              <h6 className="mb-4 card-title">
                                هدایت پیام به دیگری
                              </h6>
                              <Card>
                                <CardBody>
                                  <Nav
                                    tabs
                                    className="nav-tabs-custom nav-justified"
                                  >
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active: customActiveTab === "1",
                                        })}
                                        onClick={() => {
                                          toggleCustom("1")
                                        }}
                                      >
                                        <span className="d-block d-sm-none">
                                          <i className="fas fa-home"></i>
                                        </span>
                                        <span className="d-none d-sm-block">
                                          مکالمه جدید
                                        </span>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active: customActiveTab === "2",
                                        })}
                                        onClick={() => {
                                          toggleCustom("2")
                                        }}
                                      >
                                        <span className="d-block d-sm-none">
                                          <i className="far fa-user"></i>
                                        </span>
                                        <span className="d-none d-sm-block">
                                          مکالمات قبلی
                                        </span>
                                      </NavLink>
                                    </NavItem>
                                  </Nav>

                                  <TabContent
                                    activeTab={customActiveTab}
                                    className="p-3 text-muted"
                                  >
                                    <TabPane tabId="1">
                                      <Row>
                                        <Col lg={12} className="px-0">
                                          <div
                                            className="mb-3 text-start"
                                            style={{ zIndex: "9999" }}
                                          >
                                            <Label>گیرنده</Label>
                                            <Select
                                              name="forwardReciver"
                                              value={selectedUser}
                                              isMulti={false}
                                              onChange={selectedUser => {
                                                handleSelectUser(selectedUser),
                                                  forwardFormik.setFieldValue(
                                                    "forwardReciver",
                                                    selectedUser
                                                  )
                                              }}
                                              options={optionGroup.map(
                                                group => ({
                                                  label: group.label,
                                                  value: group.value,
                                                  imageSrc: group.imageSrc, // Provide the image source for each option
                                                })
                                              )}
                                              className="select2-selection text-start"
                                              noOptionsMessage={() =>
                                                "گیرنده مورد نظر یافت نشد"
                                              }
                                              placeholder="گیرنده پیام را انتخاب کنید"
                                              getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                                              getOptionValue={option =>
                                                option.label
                                              }
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
                                                  backgroundColor:
                                                    state.isSelected
                                                      ? "#BFC2C6"
                                                      : provided.backgroundColor,
                                                  color: "var(--bs-body-color)",
                                                  textAlign: "right,",
                                                }),
                                              }}
                                              invalid={
                                                forwardFormik.touched
                                                  .forwardReciver &&
                                                forwardFormik.errors
                                                  .forwardReciver
                                                  ? true
                                                  : false
                                              }
                                            />
                                            {forwardFormik.touched
                                              .forwardReciver &&
                                            forwardFormik.errors
                                              .forwardReciver ? (
                                              <div className="text-danger mt-1 small ">
                                                {
                                                  forwardFormik.errors
                                                    .forwardReciver
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                        </Col>
                                        <Col lg={12} className="px-0">
                                          <Input
                                            name="forwardTitle"
                                            placeholder="عنوان مکالمه جدید را وارد کنید"
                                            type="text"
                                            className="form-control"
                                            onChange={
                                              forwardFormik.handleChange
                                            }
                                            onBlur={forwardFormik.handleBlur}
                                            value={
                                              forwardFormik.values.forwardTitle
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                      <Row>
                                        <Col lg={12} className="px-0">
                                          <div
                                            className="mb-3 text-start"
                                            style={{ zIndex: "9999" }}
                                          >
                                            <Label>گیرنده</Label>
                                            <Select
                                              name="forwardReciver"
                                              value={selectedUser}
                                              isMulti={false}
                                              onChange={selectedUser => {
                                                handleSelectUser(selectedUser),
                                                  forwardFormik.setFieldValue(
                                                    "forwardReciver",
                                                    selectedUser
                                                  )
                                              }}
                                              options={optionGroup.map(
                                                group => ({
                                                  label: group.label,
                                                  value: group.value,
                                                  imageSrc: group.imageSrc, // Provide the image source for each option
                                                })
                                              )}
                                              className="select2-selection text-start"
                                              noOptionsMessage={() =>
                                                "گیرنده مورد نظر یافت نشد"
                                              }
                                              placeholder="گیرنده پیام را انتخاب کنید"
                                              getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                                              getOptionValue={option =>
                                                option.label
                                              }
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
                                                  backgroundColor:
                                                    state.isSelected
                                                      ? "#BFC2C6"
                                                      : provided.backgroundColor,
                                                  color: "var(--bs-body-color)",
                                                  textAlign: "right,",
                                                }),
                                              }}
                                              invalid={
                                                forwardFormik.touched
                                                  .forwardReciver &&
                                                forwardFormik.errors
                                                  .forwardReciver
                                                  ? true
                                                  : false
                                              }
                                            />
                                            {forwardFormik.touched
                                              .forwardReciver &&
                                            forwardFormik.errors
                                              .forwardReciver ? (
                                              <div className="text-danger mt-1 small ">
                                                {
                                                  forwardFormik.errors
                                                    .forwardReciver
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm={12} className="px-0">
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
                                        </Col>
                                      </Row>
                                    </TabPane>
                                  </TabContent>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row className="justify-content-end ">
                            <Col className="col-auto">
                              <button
                                type="button"
                                className="btn text-nowrap btn-secondary"
                                onClick={closeForward}
                              >
                                لغو
                              </button>
                              <button
                                type="submit"
                                className="btn text-nowrap btn-success ms-2"
                                // onClick={handleSendForward}
                              >
                                ارسال
                              </button>
                            </Col>
                          </Row>
                        </form>
                      </ModalBody>
                    </div>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
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

export default ViewMessages
