import React, { useState } from "react"
import { Link } from "react-router-dom"
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
  CardSubtitle,
  FormFeedback,
  Field,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import Dropzone from "react-dropzone"
import Select from "react-select"
import { toPng } from "html-to-image"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { convertToHTML } from "draft-convert"
// import { EditorState, ContentState, convertToRaw, convertFromRaw } from "draft-js"
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

import { stateToHTML } from "draft-js-export-html"
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
// import 'react-quill/dist/quill.snow.css';

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// Formik validation
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

import logo from "../../assets/images/brands/avatar-temp.png"

import { useCallback } from "react"
import LetterImg from "../../assets/images/companies/uranus-letter-empty.jpg"
import SignitureImg from "../../assets/images/companies/signiture.png"

// image
import imageType from "./../../assets/images/useIcons/types/pic-type.png"
import excelType from "../../assets/images/useIcons/types/excel-type.png"
import wordType from "../../assets/images/useIcons/types/word-type.png"
import zipType from "../../assets/images/useIcons/types/zip-type.png"
import pdfType from "../../assets/images/useIcons/types/pdf-type.png"
import videoType from "../../assets/images/useIcons/types/video-type.png"
import attachType from "../../assets/images/useIcons/types/attach-type.png"

function Correspondence() {
  //meta title
  document.title = "نامه جدید - سامانه مکاتبات"
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
  const [attachments, setAttachments] = React.useState([])
  const [letterNumber, setLetterNumber] = React.useState(null)
  const [sendTime, setSendTime] = React.useState()
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false)
  const [selectAttachments, setSelectedAttachments] = React.useState([])
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [userList, setUserList] = React.useState([])
  const [selectTouched, setSelectTouched] = useState(false)
  const [selectedGroup, setselectedGroup] = useState(null)
  const [selectSet, setSelectSet] = useState(null)
  const [selectType, setSelectType] = useState(null)
  const [selectPriority, setSelectPriority] = useState(null)
  const [roneveshtChecked, setRoneveshtChecked] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(false)
  const [selectedFiles, setselectedFiles] = React.useState([])
  const [draftBtn, seDraftBtn] = useState(false)
  const [showBtn, setShowBtn] = useState(true)
  const [showSubmit, setShowSubmit] = useState(true)
  const [cState, setCState] = useState(null)
  // letter
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [convertedContent, setConvertedContent] = useState(null)
  // submit modal
  const [openSubmitModal, setOpenSubmitModal] = React.useState(false)
  const [timer, setTimer] = useState(10)
  // RELATED LETTER
  const [relatedLetter, setRelatedLettre] = useState(0)
  const { t } = useTranslation()
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
  const optionGroupReciver = userList.map(item => {
    return {
      label: item.label,
      value: item.value,
    }
  })
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
            setOpenSubmitModal(false)
            window.setTimeout(() => {
              window.open("/outbox-letters", "_self")
              return false
            }, 3000)
          } else {
            setOpenSubmitModal(false)
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
    const url = `http://localhost:3000/letter/insert-letter/`
    const formData = {
      attachment: uploadFiles,
      receiver: recivers,
      type: selectType.value,
      priority: selectPriority.value,
      state: 1, // draft
      status: status,
      set: selectSet.value,
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
      .then(data => {
        setSendTime(data.date.full.official.usual.fa)
      })
  }
  // *********** remove file  **********
  const handleRemoveFile = item => {
    setselectedFiles(oldArr => {
      return oldArr.filter(x => x !== item)
    })
    setUploadFiles(oldArr => {
      return oldArr.filter(x => x !== item)
    })
  }
  // *********** handle submit draft *******
  const handleSubmit = values => {
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
      title: values.sendTitle,
      description: values.description,
      content: convertedContent,
      linked: relatedLetter ? relatedLetter.id : 0,
      file: null,
    }
    console.log(formData)
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
        setUploadFiles([])
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
      setShowBtn(true)
    })
    return
  }
  // *********** handle submit draft *******
  const handleSubmitDarft = values => {
    const status = roneveshtChecked ? 2 : 1 // erja & ronevesht
    const recivers = receiver.map(item => item.value)
    const url = `http://localhost:3000/letter/insert-letter/`
    const formData = {
      attachment: uploadFiles,
      receiver: recivers,
      type: selectType.value,
      priority: selectPriority.value,
      state: 3, // send draft
      status: status,
      set: selectSet.value,
      title: values.sendTitle,
      description: values.description,
      content: convertedContent,
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
        setUploadFiles([])
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
      setShowBtn(true)
    })
  }
  // ********* Form validation ***********
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      sendTitle: "",
      //text: '',
      sendSet: "",
      sendType: "",
      sendPriority: "",
      sendLinked: "",
      reciver: [],
      description: "",
    },
    validationSchema: Yup.object({
      sendTitle: Yup.string()
        .required("عنوان نامه را وارد کنید")
        .max(100, "عنوان نامه نمیتواند بیشتر از 100 کارکتر باشد"),
      //text: Yup.string().required('متن نامه را وارد کنید'),
      sendLinked: Yup.string(),
      sendSet: Yup.object().required("نوع نامه را انتخاب کنید"),
      sendType: Yup.object().required("طبقه بندی نامه را انتخاب کنید"),
      sendPriority: Yup.object().required("فوریت نامه را انتخاب کنید"),
      reciver: Yup.array()
        .min(1, "حداقل باید یک کاربر انتخاب کنید")
        .max(5, "حداکثر می‌توانید 5 کاربر انتخاب کنید"),
      description: Yup.string(),
    }),
    onSubmit: values => {
      // setTitle(values.sendTitle);
      // setDescription(values.description);
      // setText(values.text);
      setLinked(values.sendLinked)
      setTimeout(() => {
        if (draftBtn) {
          setShowBtn(false)
          handleSubmitDarft(values)
          return
        }
        if (submitBtn) {
          setShowBtn(false)
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
  // option list select
  const optionGroupLetterType = [
    {
      options: [
        { label: "داخلی", value: 1 },
        { label: "خارجی", value: 2 },
      ],
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
    if (e.target.value.length > 3) {
      const item = e.target.value
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
            setRelatedLettre(0)
            setLinked(0)
          }
        })
    } else {
      setRelatedLettre(0)
      setLinked(0)
    }
  }
  // handle chnage file
  const handlechangeFile = files => {
    setShowSubmit(false)
    // setUploadFiles([]);
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
  // Formats the size
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const [outputText, setOutputText] = useState([])

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

  const handleShowResult = () => {
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    //setText(rawContentState.blocks[0].text);
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
    let html = convertToHTML(editorState.getCurrentContent())
    setConvertedContent(html)
  }, [editorState])

  React.useEffect(() => {
    setLoading(true)
    setUploadFiles([])
    getUsers()
    getDate()
    getUserInfo()
    setLoading(false)
  }, [])

  React.useEffect(() => {
    let timerInterval
    if (openSubmitModal) {
      timerInterval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1)
        } else {
          // toggleSubmitModal();
        }
      }, 1000)
    } else {
      clearInterval(timerInterval)
    }
    return () => {
      clearInterval(timerInterval) // Cleanup the interval when the component unmounts
    }
  }, [openSubmitModal, timer])

  const toggleSubmitModal = () => {
    setOpenSubmitModal(!openSubmitModal)
    if (!openModal) {
      // Reset the timer when opening the modal
      setTimer(10)
    }
  }

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="نامه ها" breadcrumbItem="نامه جدید" />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody
                  className={`${
                    i18n.language === "fa" ? "rtlContent" : "ltrContent"
                  }`}
                >
                  <h4 className="card-title">{t("New letter")}</h4>
                  <p className="card-title-desc">
                    {t("Complete the following values to create a new letter.")}{" "}
                  </p>
                  <form onSubmit={validation.handleSubmit}>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendSet">
                            {t("Type of letter")}
                            <span className="requareForm"> *</span>
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
                            noOptionsMessage={() => {
                              t("The desired letter was not found")
                            }}
                            placeholder={t("Choose from the list below")}
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
                            {t("Classification")}{" "}
                            <span className="requareForm">*</span>
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
                            noOptionsMessage={() => {
                              t("The desired Classification was not found")
                            }}
                            placeholder={t("Choose from the list below")}
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
                            {t("Urgency")}{" "}
                            <span className="requareForm">*</span>
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
                            noOptionsMessage={() => {
                              t("The desired Urgency was not found")
                            }}
                            placeholder={t("Choose from the list below")}
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
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="sendTitle">
                            {t("Subject")}{" "}
                            <span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="sendTitle"
                            placeholder={t("Example: Introduction to work")}
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
                            {t("Text")}
                            <span className="requareForm"> *</span>
                          </Label>
                          {/*<Input
                            name="text"
                            type="textarea"
                            rows={7}
                            className="form-control"
                            onChange={(e) => {
                              validation.handleChange(e);
                              setText(e.target.value);
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.text}
                            invalid={
                              validation.touched.text && validation.errors.text ? true : false
                            }
                          />
                          {validation.touched.text && validation.errors.text ? (
                            <FormFeedback type="invalid">{validation.errors.text}</FormFeedback>
                          ) : null} */}
                          <div>
                            <Editor
                              textAlignment={"right"}
                              editorState={editorState}
                              onEditorStateChange={setEditorState}
                              wrapperClassName="wrapper-class"
                              editorClassName="editor-class"
                              toolbarClassName="toolbar-class"
                            />
                          </div>
                          {convertedContent && convertedContent < 8 ? (
                            <div className="text-danger mt-1 ms-1 small">
                              متن نامه نمی تواند خالی باشد .{" "}
                            </div>
                          ) : (
                            <></>
                          )}
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
                                  <Label htmlFor="sendLinked">
                                    {t("Related letter")}
                                  </Label>
                                  <Input
                                    name="sendLinked"
                                    placeholder={t("Related letter number")}
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
                                        {t("Subject")}:
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
                              <Col md={4} className="mb-2 mb-md-0 zIndex2">
                                <div style={{ zIndex: "9999" }}>
                                  <Label> {t("Receiver")} </Label>
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
                                    noOptionsMessage={() => {
                                      t("The intended recipient was not found")
                                    }}
                                    placeholder={t(
                                      "Choose from the list below"
                                    )}
                                    getOptionValue={option => option.label}
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
                                  />
                                  {validation.touched.reciver &&
                                  validation.errors.reciver ? (
                                    <div className="text-danger mt-1 small">
                                      {validation.errors.reciver}
                                    </div>
                                  ) : null}
                                </div>
                              </Col>

                              <Col md={3} className="mb-2 mb-md-0">
                                <Label htmlFor="referralDes">
                                  {t("Description")}{" "}
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  className="form-control"
                                  placeholder={t("Write your description here")}
                                  onChange={e => {
                                    validation.handleChange(e)
                                    setDescription(e.target.value)
                                  }}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.description || ""}
                                />
                              </Col>

                              <Col
                                md={2}
                                className="text-center mb-2 pb-3 ps-5 d-flex mb-md-0"
                              >
                                <div className="form-check d-inline form-switch form-switch-md ps-0 h-100 d-flex align-items-center">
                                  <label className="form-check-label form-label me-5">
                                    {t("Transcript")}
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
                          {t("Attachment")}{" "}
                        </Label>
                        {showSubmit ? (
                          <>
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
                                    <h6>
                                      فایل مورد نظر را از اینجا انتخاب کنید
                                    </h6>
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
                      </Col>
                    </Row>

                    <Row className="justify-content-end mt-4">
                      <Col className="col-auto px-0">
                        <Button
                          type="submit"
                          color="secondary"
                          className={!showBtn ? "disabled" : ""}
                          aria-disabled={!showBtn ? "true" : "false"}
                        >
                          پیش‌نمایش
                        </Button>
                      </Col>
                      <Col className="col-auto px-0">
                        <Button
                          color="info"
                          onClick={sendToDraftFun}
                          className={!showBtn ? "disabled ms-1" : "ms-1"}
                          aria-disabled={!showBtn ? "true" : "false"}
                        >
                          ذخیره در پیش‌نویس
                        </Button>
                      </Col>
                      <Col className="col-auto ps-1">
                        <Button
                          type="submit"
                          color="primary"
                          onClick={() => seDraftBtn(true)}
                          className={!showBtn ? "disabled" : ""}
                          aria-disabled={!showBtn ? "true" : "false"}
                        >
                          ارسال نامه با قابلیت ویرایش
                        </Button>
                      </Col>
                      <Col className="col-auto ps-1">
                        <Button
                          type="submit"
                          color="success"
                          onClick={() => setSubmitBtn(true)}
                          className={!showBtn ? "disabled" : ""}
                          aria-disabled={!showBtn ? "true" : "false"}
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
                    isOpen={openSubmitModal}
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

export default withTranslation()(Correspondence)
