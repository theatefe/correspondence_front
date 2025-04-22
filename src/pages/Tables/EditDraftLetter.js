import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Field,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import Dropzone from "react-dropzone"
import Select from "react-select"
import { toPng } from "html-to-image"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import { EditorState, ContentState, convertToRaw } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// image
import imageType from "./../../assets/images/useIcons/types/pic-type.png"
import excelType from "../../assets/images/useIcons/types/excel-type.png"
import wordType from "../../assets/images/useIcons/types/word-type.png"
import zipType from "../../assets/images/useIcons/types/zip-type.png"
import pdfType from "../../assets/images/useIcons/types/pdf-type.png"
import videoType from "../../assets/images/useIcons/types/video-type.png"
import attachType from "../../assets/images/useIcons/types/attach-type.png"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// import { convertToHTML } from "draft-convert"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// Formik validation
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

import logo from "../../assets/images/brands/avatar-temp.png"

import { useCallback } from "react"
import LetterImg from "../../assets/images/companies/talie-letter-empty.jpg"

// ********* option list select ********
const optionGroupLetterType = [
  {
    options: [{ label: "داخلی", value: 1 }],
  },
]
const optionGroupSecurity = [
  {
    options: [
      { label: "عادی", value: 1 },
      { label: "محرمانه", value: 2 },
    ],
  },
]
const optionGroupSUrgency = [
  {
    options: [
      { label: "عادی", value: 1 },
      { label: "فوری", value: 2 },
      { label: "آنی", value: 3 },
    ],
  },
]

function Correspondence() {
  //meta title
  document.title = "نامه پیش نویس - سامانه مکاتبات"
  const { id } = useParams()
  // variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [userInfo, setUserInfo] = React.useState({})
  const elementRef = React.useRef(null)
  const [text, setText] = React.useState()
  const [linked, setLinked] = React.useState(0)
  const [description, setDescription] = React.useState("")
  const [title, setTitle] = React.useState()
  const [receiver, setReceiver] = React.useState([])
  const [letterNumber, setLetterNumber] = React.useState(null)
  const [sendTime, setSendTime] = React.useState()
  const [openModal, setOpenModal] = React.useState(false)
  const [selectAttachments, setSelectedAttachments] = React.useState([])
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [userList, setUserList] = React.useState([])
  const [selectSet, setSelectSet] = useState(null)
  const [selectType, setSelectType] = useState(null)
  const [selectPriority, setSelectPriority] = useState(null)
  const [roneveshtChecked, setRoneveshtChecked] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false)
  const [selectedFiles, setselectedFiles] = React.useState([])
  const textRef = React.useRef()
  const [draftBtn, seDraftBtn] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(false)
  // submit modal
  const [openSubmitModal, setOpenSubmitModal] = React.useState(false)
  const [timer, setTimer] = useState(10)
  // RELATED LETTER
  const [relatedLetter, setRelatedLettre] = useState(0)
  const [relatedLetterError, setRelatedLettreError] = useState(null)
  // DRAFT MESSAGES
  const [infoMessage, setInfoMessage] = useState(null)
  // *********** get draft letter **********
  const getDraftMessage = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/detail-letter/${id}/`, config)
      .then(res => res.json())
      .then(data => {
        const result = data[0]
        console.log(result)
        const set = result
          ? optionGroupLetterType[0].options.find(i => i.value == result.set)
          : ""
        const type = result
          ? optionGroupSecurity[0].options.find(i => i.value == result.type)
          : ""
        const priority = result
          ? optionGroupSUrgency[0].options.find(i => i.value == result.priority)
          : ""
        const text = result ? result.content : null
        const files = result ? result.attachment : []
        setSelectSet(set)
        setSelectType(type)
        setSelectPriority(priority)
        setText(text)
        setInfoMessage(result)
      })
  }
  // ************ get users ***************
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
          return {
            value: item.id,
            label: item.first_name + " " + item.last_name,
          }
        })
        setUserList(users)
      })
  }
  const optionGroupReciver = userList.map(item => {
    return {
      label: item.label,
      value: item.value,
    }
  })

  const handleShowResult = () => {
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    setText(rawContentState.blocks[0].text)
    // Iterate over content blocks and apply inline styles and alignment
    const styledText = rawContentState.blocks.map((block, blockIndex) => {
      let text = block.text
      let blockStyles = {}

      block.inlineStyleRanges.forEach((styleRange, styleIndex) => {
        const style = styleRange.style
        const tag = styleMappings[style]

        if (tag) {
          // Apply inline styles using the corresponding HTML tag
          text = React.createElement(tag, { key: styleIndex }, text)
        }
      })

      if (block.data && block.data.textAlign) {
        // Handle text alignment
        blockStyles.textAlign = block.data.textAlign
        // Wrap the centered text in a div with a CSS class for centering
        if (blockStyles.textAlign === "center") {
          text = (
            <div key={blockIndex} className="centered-text">
              {text}
            </div>
          )
        }
      }

      // Create a styled block element with text alignment
      text = (
        <div key={blockIndex} style={{ ...blockStyles }}>
          {text}
        </div>
      )
      return text
    })

    setOutputText(styledText)
  }
  const styleMappings = {
    BOLD: "strong",
    ITALIC: "em",
    UNDERLINE: "u",
    STRIKETHROUGH: "del",
  }
  // ************ sumit *******************
  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then(dataUrl => {
        // submit
        const status = roneveshtChecked ? 2 : 1 // erja & ronevesht
        const recivers = receiver.map(item => item.value)
        const url = `http://localhost:3000/letter/insert-letter/`
        const formData = {
          attachment: uploadFiles,
          receiver: recivers,
          type: selectType.value,
          priority: selectPriority.value,
          state: 2, // send
          status: status,
          set: selectSet.value,
          title: title,
          description: description,
          content: text,
          linked: relatedLetter ? relatedLetter.id : 0,
          file: dataUrl,
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
            toastr.success("ارسال نامه با موفقیت انجام شد")
            toastr.options = {
              closeButton: true,
              progressBar: true,
              newestOnTop: true,
              positionClass: "toast-top-right",
            }
            window.setTimeout(() => {
              window.open("/outbox-letters", "_self")
              return false
            }, 3000)
          } else {
            toastr.error("مشکلی در ارسال نامه رخ داده است، مجددا امتحان کنید")
            toastr.options = {
              closeButton: true,
              progressBar: true,
              newestOnTop: true,
              positionClass: "toast-top-right",
            }
          }
        })
        return
      })
      .catch(err => {
        console.log(err)
      })
  }
  // ********** go to draft **************
  const sendToDraftFun = () => {
    const status = roneveshtChecked ? 2 : 1 // erja & ronevesht
    const recivers = receiver.map(item => item.value)
    const url = `http://localhost:3000/letter/send-draft-letter/`
    const formData = {
      id: id,
      attachment: uploadFiles,
      receiver: recivers,
      type: selectType.value,
      priority: selectPriority.value,
      state: 1, //  draft
      status: status,
      set: selectSet.value,
      variety: 1, //  draft
      parent: null,
      title: title,
      description: description,
      content: text,
      linked: relatedLetter ? relatedLetter.id : 0,
      file: null,
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
    })
      .then(response => {
        console.log(response)
        return
        if (response.ok) {
          toastr.success("نامه با موفقیت در پیش نویس ذخیره شد")
          toastr.options = {
            closeButton: true,
            progressBar: true,
            newestOnTop: true,
            positionClass: "toast-top-right",
          }
          window.setTimeout(() => {
            window.open("draft-letters", "_self")
            return false
          }, 3000)
        } else {
          toastr.error("مشکلی در ثبت نامه رخ داده است، مجددا امتحان کنید")
          toastr.options = {
            closeButton: true,
            progressBar: true,
            newestOnTop: true,
            positionClass: "toast-top-right",
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  // ********* download letter **********
  const downloadLetter = () => {
    toPng(elementRef.current, { cacheBust: false }).then(dataUrl => {
      const link = document.createElement("a")
      link.download = "pic.png"
      link.href = dataUrl
      link.click()
    })
  }
  // ******** get user info api **********
  const getUserInfo = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-login-user/`, config)
      .then(res => res.json())
      .then(data => {
        setUserInfo({
          id: data[1].id,
          fullName: data[1].first_name + " " + data[1].last_name,
          signature: data[0].signature,
        })
      })
  }
  // ******* get letterNumber api *******
  const getLetterNumber = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/get-number-letter/`, config)
      .then(res => res.json())
      .then(data => {
        setLetterNumber(data.NewNumberLetter)
      })
  }
  // *********** get date ****************
  const getDate = () => {
    fetch("https://api.keybit.ir/time/")
      .then(res => res.json())
      .then(data => setSendTime(data.date.full.official.usual.fa))
  }
  // ******* handle submit draft *********
  const handleSubmit = values => {
    const status = roneveshtChecked ? 2 : 1 // erja & ronevesht
    const recivers = receiver.map(item => item.value)
    const url = `http://localhost:3000/letter/send-draft-letter/`
    const formData = {
      id: id,
      attachment: uploadFiles,
      receiver: recivers,
      type: selectType.value,
      priority: selectPriority.value,
      state: 2, // send
      status: status,
      set: selectSet.value,
      variety: 2, // send
      parent: null,
      title: values.sendTitle,
      description: values.description,
      content: values.text,
      linked: relatedLetter ? relatedLetter.id : 0,
      file: null,
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
        toastr.success("ارسال نامه با موفقیت انجام شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setOpenSubmitModal(false)
        window.setTimeout(() => {
          window.open("/outbox-letters", "_self")
          return false
        }, 3000)
      } else {
        setOpenSubmitModal(false)
        toastr.error("مشکلی در ارسال رخ داده است، مجددا امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }
  // ******* handle submit draft *********
  const handleSubmitDraft = values => {
    const status = roneveshtChecked ? 2 : 1 // erja & ronevesht
    const recivers = receiver.map(item => item.value)
    const url = `http://localhost:3000/letter/send-draft-letter/`
    const formData = {
      id: id,
      attachment: uploadFiles,
      receiver: recivers,
      type: selectType.value,
      priority: selectPriority.value,
      state: 3, // send draft
      status: status,
      set: selectSet.value,
      variety: 3, // send draft
      parent: null,
      title: values.sendTitle,
      description: values.description,
      content: values.text,
      linked: relatedLetter ? relatedLetter.id : 0,
      file: null,
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
        toastr.success("ارسال نامه با قابلیت ویرایش با موفقیت انجام شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setOpenSubmitModal(false)
        window.setTimeout(() => {
          window.open("/outbox-letters", "_self")
          return false
        }, 3000)
      } else {
        setOpenSubmitModal(false)
        toastr.error("مشکلی در ارسال رخ داده است، مجددا امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }
  // ********* Form validation ***********
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      sendTitle: infoMessage ? infoMessage.title : "",
      text: infoMessage ? infoMessage.content : "",
      sendSet: selectSet || "",
      sendType: selectType || "",
      sendPriority: selectPriority || "",
      sendLinked: "",
      reciver: [],
      description: "",
    },
    validationSchema: Yup.object({
      sendTitle: Yup.string()
        .required("عنوان نامه را وارد کنید")
        .max(100, "عنوان نامه نمیتواند بیشتر از 100 کارکتر باشد"),
      text: Yup.string().required("متن نامه را وارد کنید"),
      sendLinked: Yup.string(),
      sendSet: Yup.object().required("نوع نامه را انتخاب کنید"),
      sendType: Yup.object().required("طبقه بندی نامه را انتخاب کنید"),
      sendPriority: Yup.object().required("فوریت نامه را انتخاب کنید"),
      reciver: Yup.array()
        .min(1, "حداقل باید یک کاربر انتخاب کنید")
        .max(5, "حداکثر می‌توانید 5 کاربر انتخاب کنید"),
      description: Yup.string().required("توضیحات ارجاع نمی تواند خالی باشد"),
    }),
    onSubmit: values => {
      setTimeout(() => {
        if (draftBtn) {
          handleSubmitDraft(values)
          return
        }
        if (submitBtn) {
          handleSubmit(values)
          return
        }
        // if (submitBtn) {
        //   getLetterNumber();
        //   setTimeout(() => { setOpenSubmitModal(true), setSubmitBtn(false) }, 400)
        else {
          setTimeout(() => {
            setOpenPreviewModal(true)
          }, 400)
        }
      }, 400)
    },
  })
  // handle change select
  function handleSet(selectSet) {
    setSelectSet(selectSet)
  }
  function handleType(selectType) {
    setSelectType(selectType)
  }
  function handlePriority(selectPriority) {
    setSelectPriority(selectPriority)
  }
  // handle change des
  const handleDescriptionChange = event => {
    setDescription(event.target.value)
  }
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [outputText, setOutputText] = useState([])
  // handle editor state
  const handleEditorChange = newEditorState => {
    setEditorState(newEditorState)
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    const value = rawContentState.blocks[0].text
    setText(value)
    // setIsEditorValid(true);
    // Check if the editor content is empty and update the validity state accordingly.
    //setIsEditorValid(!newEditorState.isEmpty());
  }

  // handle change reciver handlechangeFile
  function handleReciver(receiver) {
    setReceiver(receiver)
  }
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  // handle exist letter
  const handleExistLetter = e => {
    if (e.target.value) {
      const item = e.target.value
      if (item.length > 5) {
        setRelatedLettreError("شماره نامه نمی تواند بیشتر از 5 رقم باشد")
      } else if (item.length < 5) {
        setRelatedLettreError("شماره نامه نمی تواند کمتر از 5 رقم باشد")
      } else {
        const config = {
          headers: {
            Authorization: "Bearer " + token,
            accept: "application/json",
          },
        }
        fetch(`http://localhost:3000/letter/exist-letter/${item}/`, config)
          .then(res => res.json())
          .then(data => {
            if (data.length > 0) {
              const object = {
                id: data[0].id,
                number: data[0].number,
                title: data[0].title,
              }
              setRelatedLettre(object)
              setLinked(object.id)
            } else {
              setRelatedLettreError("شماره نامه ی وارد شده وجود ندارد")
            }
          })
      }
    }
  }
  // handle chnage file
  const handlechangeFile = files => {
    setUploadFiles([])
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
  // Formats the size
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const [containerStyles, setContainerStyles] = useState({})

  function appendTextToPhoto() {
    // Get the current content of the editor
    const contentState = editorState.getCurrentContent()

    // Convert the content state to HTML
    const options = {
      inlineStyles: {
        // Define inline styles for bold and italic
        BOLD: { element: "strong" },
        ITALIC: { element: "em" },
      },
    }
    const html = stateToHTML(contentState, options)

    // Replace line breaks with <br> tags in the HTML
    const htmlWithLineBreaks = html.replace(/\n/g, "<br>")

    // Apply font family and font size styles using inline styles
    const containerStyles = {
      fontFamily: "BNazanin", // Default font family
      fontSize: "12px", // Default font size
    }

    setContainerStyles(containerStyles)

    // Get the selected photo
    const selectedPhoto = document.getElementById("selectedPhoto")

    // Create a <div> element to contain the HTML content with inline styles
    const textContainer = document.createElement("div")
    textContainer.innerHTML = htmlWithLineBreaks

    // Apply the inline styles to the container
    Object.assign(textContainer.style, containerStyles)

    // Append the HTML content to the selected photo
    selectedPhoto.appendChild(textContainer)
  }

  const handleChangeChecked = () => {
    setRoneveshtChecked(!roneveshtChecked)
  }

  // textContainer.classList.add('letterTextStyle', 'letter-fontSize-a5', 'letter-fontFamily');
  React.useEffect(() => {
    setLoading(true)
    getDraftMessage()
    getUsers()
    getDate()
    getUserInfo()
    setLoading(false)
  }, [])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="پیش نویس ها " breadcrumbItem="نامه " />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title"> ویرایش نامه پیش نویس</h4>
                  <p className="card-title-desc">
                    برای ارسال نامه پیش نویس شده، لطفا فیلدهای خالی را کامل
                    کنید.
                  </p>
                  <form onSubmit={validation.handleSubmit}>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendSet">
                            نوع نامه <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="sendSet"
                            name="sendSet"
                            value={selectSet}
                            onChange={newValue => {
                              handleSet(newValue),
                                validation.setFieldValue("sendSet", newValue)
                            }}
                            options={optionGroupLetterType}
                            defaultValue={null} // Set default value to null
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
                            className="select2-selection"
                            noOptionsMessage={() => "نوع نامه یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                            invalid={
                              validation.touched.sendSet &&
                              validation.errors.sendSet
                                ? true
                                : false
                            }
                          />
                          {validation.touched.sendSet &&
                          validation.errors.sendSet ? (
                            <div className="text-danger mt-1 small">
                              {validation.errors.sendSet}
                            </div>
                          ) : null}
                          {/* {validation.touched.sendSet &&
                            validation.errors.sendSet ? (
                            <FormFeedback type="invalid">
                              {validation.errors.sendSet}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendType">
                            طبقه‌بندی <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="sendType"
                            name="sendType"
                            value={selectType}
                            onChange={newValue => {
                              handleType(newValue),
                                validation.setFieldValue("sendType", newValue)
                            }}
                            options={optionGroupSecurity}
                            defaultValue={null} // Set default value to null
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
                            className="select2-selection"
                            noOptionsMessage={() =>
                              "طبقه بندی مورد نظر یافت نشد"
                            }
                            placeholder="از لیست زیر انتخاب کنید"
                            invalid={
                              validation.touched.sendType &&
                              validation.errors.sendType
                                ? true
                                : false
                            }
                          />
                          {validation.touched.sendType &&
                          validation.errors.sendType ? (
                            <div className="text-danger mt-1 small">
                              {validation.errors.sendType}
                            </div>
                          ) : null}
                          {/* {validation.touched.sendType &&
                            validation.errors.sendType ? (
                            <FormFeedback sendType="invalid">
                              {validation.errors.sendType}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendPriority">
                            فوریت <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="sendPriority"
                            name="sendPriority"
                            value={selectPriority}
                            onChange={newValue => {
                              handlePriority(newValue),
                                validation.setFieldValue(
                                  "sendPriority",
                                  newValue
                                )
                            }}
                            options={optionGroupSUrgency}
                            defaultValue={null} // Set default value to null
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
                            className="select2-selection is-invalid"
                            noOptionsMessage={() => "گزینه مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                            invalid={
                              validation.touched.sendPriority &&
                              validation.errors.sendPriority
                                ? true
                                : false
                            }
                          />
                          {validation.touched.sendPriority &&
                          validation.errors.sendPriority ? (
                            <div className="text-danger mt-1 small">
                              {validation.errors.sendPriority}
                            </div>
                          ) : null}
                          {/* {validation.touched.sendPriority &&
                            validation.errors.sendPriority ? (
                            <FormFeedback sendPriority="invalid">
                              {validation.errors.sendPriority}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendTitle">
                            موضوع نامه<span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="sendTitle"
                            placeholder="مثال: معرفی‌نامه"
                            type="text"
                            className="form-control"
                            id="sendTitle"
                            onChange={e => {
                              validation.handleChange(e)
                              setTitle(e.target.value)
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.sendTitle || ""}
                            invalid={
                              validation.touched.sendTitle &&
                              validation.errors.sendTitle
                                ? true
                                : false
                            }
                          />
                          {validation.touched.sendTitle &&
                          validation.errors.sendTitle ? (
                            <FormFeedback type="invalid">
                              {validation.errors.sendTitle}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceEditor">
                            متن نامه <span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="text"
                            type="textarea"
                            rows={7}
                            className="form-control"
                            onChange={e => {
                              validation.handleChange(e)
                              setText(e.target.value)
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.text}
                            invalid={
                              validation.touched.text && validation.errors.text
                                ? true
                                : false
                            }
                          />
                          {validation.touched.text && validation.errors.text ? (
                            <FormFeedback type="invalid">
                              {validation.errors.text}
                            </FormFeedback>
                          ) : null}
                          {/* <div>
                            <Editor
                              textAlignment={'right'}
                              editorState={editorState}
                              onEditorStateChange={handleEditorChange}
                              toolbar={{
                                options: ['inline', 'history'],
                                inline: { inDropdown: false, options: ['bold', 'italic', 'underline', 'strikethrough'] },
                                history: { inDropdown: false },
                              }}
                            />
                          </div> */}
                          {/* {!isEditorValid && <div className="text-danger mt-1 ms-1 small">متن نامه نمی تواند خالی باشد . </div>} */}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <div
                          className="repeater "
                          encType="multipart/form-data"
                        >
                          <div>
                            <Row className="pb-3 pt-md-1">
                              <Col md="3">
                                <FormGroup className="mb-2 mb-md-0">
                                  <Label htmlFor="sendLinked">نامه مرتبط</Label>
                                  <Input
                                    name="sendLinked"
                                    placeholder="شماره نامه مرتبط"
                                    className="form-control"
                                    id="sendLinked"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={handleExistLetter}
                                    value={validation.values.sendLinked || ""}
                                    invalid={
                                      validation.touched.sendLinked &&
                                      validation.errors.sendLinked
                                    }
                                  />
                                  {relatedLetter == null ? (
                                    <Row className="justify-content-start mt-1">
                                      <Col className="col-auto text-danger small">
                                        {
                                          "نامه ای  با شماره ی وارد شده وجود ندارد"
                                        }
                                      </Col>
                                    </Row>
                                  ) : (
                                    <Row className="justify-content-start mt-1">
                                      <Col className="col-auto small ps-3">
                                        موضوع نامه:
                                      </Col>
                                      <Col className="col-auto text-success small ps-2">
                                        {relatedLetter.title || "..."}
                                      </Col>
                                    </Row>
                                  )}
                                  <Label
                                    className="w-100 mb-0"
                                    htmlFor="correspondenceRelated"
                                  >
                                    {/* <Row className="justify-content-start">
                              <Col className="col-auto fw-light">
                                موضوع نامه:
                              </Col>
                              <Col className="col-auto fw-light px-0">
                                قرارداد بیمه تکمیلی
                              </Col>
                            </Row> */}
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md={3} className="mb-2 mb-md-0 zIndex2">
                                <div
                                  className="text-start"
                                  style={{ zIndex: "9999" }}
                                >
                                  <Label htmlFor="reciver">
                                    گیرنده
                                    <span className="requareForm"> * </span>
                                  </Label>
                                  <Select
                                    id="reciver"
                                    name="reciver"
                                    value={receiver}
                                    isMulti={true}
                                    onChange={newValue => {
                                      handleReciver(newValue),
                                        validation.setFieldValue(
                                          "reciver",
                                          newValue
                                        )
                                    }}
                                    options={optionGroupReciver.map(option => ({
                                      label: option.label,
                                      value: option.value,
                                      imageSrc: option.imageSrc, // Provide the image source for each option
                                    }))}
                                    defaultValue={null}
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
                                    className="select2-selection text-start zIndex2"
                                    noOptionsMessage={() =>
                                      "گیرنده مورد نظر یافت نشد"
                                    }
                                    placeholder="از لیست زیر انتخاب کنید"
                                    invalid={
                                      validation.touched.reciver &&
                                      validation.errors.reciver
                                        ? true
                                        : false
                                    }
                                    // components={{
                                    //   Option: OptionWithImage, // Use the custom option component
                                    // }}
                                    getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                                    getOptionValue={option => option.label}
                                  />
                                  {validation.touched.reciver &&
                                  validation.errors.reciver ? (
                                    <div className="text-danger mt-1 small">
                                      {validation.errors.reciver}
                                    </div>
                                  ) : null}
                                </div>
                              </Col>

                              <Col md={4} className="mb-2 mb-md-0">
                                <Label htmlFor="description">
                                  توضیحات <span className="requareForm">*</span>
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  className="form-control"
                                  placeholder="توضیحات ارجاع برای گیرنده را بنویسید"
                                  onChange={e => {
                                    validation.handleChange(e)
                                    setDescription(e.target.value)
                                  }}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.description || ""}
                                  invalid={
                                    validation.touched.description &&
                                    validation.errors.description
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.description &&
                                validation.errors.description ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.description}
                                  </FormFeedback>
                                ) : null}
                              </Col>

                              <Col
                                md={2}
                                className="text-center mb-2 pb-3 ps-5 d-flex mb-md-0"
                              >
                                <div className="form-check d-inline form-switch form-switch-md ps-0 h-100 d-flex align-items-center">
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
                          </div>
                        </div>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label htmlFor="correspondenceRelated">
                          پیوست نامه
                        </Label>
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
                                <h6>فایل مورد نظر را از اینجا انتخاب کنید</h6>
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
                                      <p className="mb-0">{f.formattedSize}</p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </Col>
                    </Row>

                    <Row className="justify-content-end mt-4">
                      <Col className="col-auto px-0">
                        <Button type="submit" color="secondary">
                          پیش‌نمایش
                        </Button>
                      </Col>
                      <Col className="col-auto px-0">
                        <Button
                          color="info"
                          className="ms-1"
                          onClick={sendToDraftFun}
                        >
                          ذخیره در پیش‌نویس
                        </Button>
                      </Col>
                      <Col className="col-auto ps-1">
                        <Button
                          type="submit"
                          color="primary"
                          onClick={() => seDraftBtn(true)}
                        >
                          ارسال نامه با قابلیت ویرایش
                        </Button>
                      </Col>
                      {/* <Col className="col-auto px-0">
                        <Button color="success" className="ms-1" onClick={sendToDraftFun}>
                          ذخیره در پیش‌نویس
                        </Button>
                      </Col> */}
                      <Col className="col-auto ps-1">
                        <Button
                          type="submit"
                          color="success"
                          onClick={() => setSubmitBtn(true)}
                        >
                          ارسال نامه
                        </Button>
                      </Col>
                    </Row>
                  </form>

                  <Modal
                    isOpen={openPreviewModal}
                    modalTransition={{ timeout: 1000 }}
                    backdropTransition={{ timeout: 1000 }}
                  >
                    <ModalHeader>پیش نمایش نامه</ModalHeader>
                    <ModalBody>
                      <Row className="justify-content-center">
                        <Col className="col-12 col-sm-auto d-flex justify-content-center">
                          <div className="letterStyleArea position-relative text-center">
                            <img src={LetterImg} alt="" className="img-fluid" />
                            <div className="topLeftLetterhead">
                              <div className="index date">
                                <span>تاریخ</span> : <span>{sendTime}</span>
                              </div>
                              <div className="index letterNo mt-2">
                                <span>شماره نامه</span> : <span>{"*****"}</span>
                              </div>
                              <div className="index attach mt-1">
                                <span>پیوست</span> :{" "}
                                {uploadFiles.length < 1 ? (
                                  <span>ندارد</span>
                                ) : (
                                  <span>دارد</span>
                                )}
                              </div>
                            </div>
                            <div className="centerLetterhead text-start">
                              <div className="letterText">
                                <p>
                                  <center>بسمه تعالی</center>
                                </p>
                                <p className="mt-2">
                                  {/* {outputText.map((text, index) => (
                                    <div key={index}>{text}</div>
                                  ))} */}
                                  {text}
                                </p>
                              </div>
                              {/* <div className="bottomLeftLetterhead">
                                <img
                                  src={`http://localhost:3000${userInfo.signature}`}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div> */}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mt-3">
                        <Col className="col-auto">
                          <Button
                            color="danger"
                            onClick={() => setOpenPreviewModal(false)}
                          >
                            بازگشت و ادامه
                          </Button>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>

                  <Modal
                    isOpen={false}
                    modalTransition={{ timeout: 1000 }}
                    backdropTransition={{ timeout: 1000 }}
                  >
                    <ModalHeader> تایید و ارسال نامه</ModalHeader>
                    <ModalBody>
                      <Row className="justify-content-center">
                        <Col className="col-12 col-sm-auto d-flex justify-content-center">
                          <div
                            className="letterStyleArea position-relative text-center"
                            ref={elementRef}
                          >
                            <img src={LetterImg} alt="" className="img-fluid" />
                            <div className="topLeftLetterhead">
                              <div className="index date">
                                <span>تاریخ</span> : <span>{sendTime}</span>
                              </div>
                              <div className="index letterNo mt-2">
                                <span>شماره نامه</span> :{" "}
                                <span>{letterNumber}</span>
                              </div>
                              <div className="index attach mt-1">
                                <span>پیوست</span> :{" "}
                                {uploadFiles.length < 1 ? (
                                  <span>ندارد</span>
                                ) : (
                                  <span>دارد</span>
                                )}
                              </div>
                            </div>
                            <div className="centerLetterhead text-start">
                              <div className="letterText">
                                <p>
                                  <center>بسمه تعالی</center>
                                </p>
                                <p className="mt-2">
                                  {outputText.map((text, index) => (
                                    <div key={index}>{text}</div>
                                  ))}
                                </p>
                              </div>
                              <div className="bottomLeftLetterhead">
                                <img
                                  src={`http://localhost:3000${userInfo.signature}`}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mt-3">
                        {/* <p>مدت زمان شما برای ارسال نامه: {timer} ثانیه</p> */}
                        <Col className="col-auto">
                          <Button
                            color="danger"
                            onClick={() => {
                              setOpenSubmitModal(false), setTimer(10)
                            }}
                          >
                            بازگشت
                          </Button>
                          <Button
                            type="submit"
                            color={timer == 0 ? "secondary muted" : "success"}
                            className={timer == 0 ? "ms-1 disabled" : "ms-1"}
                            onClick={htmlToImageConvert}
                          >
                            مهلت ارسال نامه : {timer} ثانیه
                          </Button>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default Correspondence
