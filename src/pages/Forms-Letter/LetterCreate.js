import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import classnames from "classnames"
import axios from "axios"
import moment from "moment-jalaali"
// Reactstrap ******************************
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
//Api **************************************
import GetListApi from "../../api/user/List"
import createApi from "../../api/user/letter/create"
import updateApi from "./../../api/user/letter/update"
import signLetterApi from "../../api/user/letter/sign"
import numberingLetterApi from "../../api/user/letter/numbering"
import uploadFile from "../../api/common/uploadFile"
import deleteUploadFileApi from "../../api/common/deleteUploadFile"
import createTracking from "../../api/user/letter/tracking/create"
// toast *************************************
import toastr from "toastr"
import "toastr/build/toastr.min.css"
// Form Editor *******************************
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
//i18n *****************************************
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"
// Images **************************************
import LetterImg from "../../assets/images/companies/talie-letter-empty.jpg"
import attachFileImage from "../../assets/images/attachFile.png"
// ***********************************************
// ******************** Function *****************
function LetterCreate() {
  // navigate **********************
  const navigate = useNavigate()
  // auth **************************
  const token = localStorage.getItem("token")
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  // State variables to manage form data
  const [formValues, setFormValues] = useState({
    correspondenceTitle: "",
    selectedGroup: null,
    selectedReceiver: null,
    selectedMulti: [],
    description: "",
    classification: { label: "عادی", value: 1 },
    urgency: { label: "عادی", value: 1 },
  })
  const [transmissionValues, setTransmissionValues] = useState({
    erjaRecivers: [],
    roneveshtRecivers: [],
  })
  const [letter, setLetter] = useState({
    id: null,
    number: "****",
    date: null,
  })
  // page count
  const [pages, setPages] = useState([])
  const maxLinesPerPage = 4
  // state for editor text
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [contentAsJSON, setContentAsJSON] = useState("")
  const [editorTitle, setEditorTitle] = useState("")
  const [editorReciver, setEditorReciver] = useState(null)
  // state status label
  const [statusLabel, setStatusLabel] = useState()
  // state loader
  const [loading, setLoading] = useState(false)
  // state button disabled
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  // show modal
  const [showModal, setShowModal] = useState(false)
  // state users list
  const [usersList, setUsersList] = useState([])
  // state attach list
  const [uploadFiles, setUploadFiles] = useState([])
  // State to track validation errors
  const [errors, setErrors] = useState({})
  const [htmlContent, setHtmlContent] = useState("")
  // Function to handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
    setIsButtonDisabled(false)
  }
  const updateEditorContent = reciver => {
    const setReciver = reciver ? reciver : " "
    const setTitle = editorTitle ? editorTitle : " "

    const currentContent = editorState.getCurrentContent()

    // تبدیل محتوای فعلی به متن ساده با حفظ خطوط جدید
    const currentText = currentContent.getPlainText()

    // ترکیب محتوا با اطلاعات جدید
    const combinedText = `${currentText}${setReciver}\n${setTitle}\n`

    // ایجاد محتوای جدید از متن ترکیبی
    const newContentState = ContentState.createFromText(combinedText)

    // ایجاد وضعیت جدید ادیتور با حفظ undo/redo history
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    )
    // آپدیت وضعیت ادیتور و قرار دادن کرسر در انتها
    setEditorState(EditorState.moveFocusToEnd(newEditorState))
  }
  // Function to handle title change
  const handleTitleChange = e => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
    setIsButtonDisabled(false)
  }
  // Function to handle blur  input title
  const handleTitleBlur = e => {
    const { value } = e.target
    // بررسی خالی بودن یا وجود متن
    const title = value.trim() ? `موضوع : ${value}` : "" // اگر مقدار خالی باشد، متن خالی بفرست
    setEditorTitle(title)
  }
  // Function to handle select change
  const handleSelectChange = (selectedOption, name) => {
    setFormValues(prev => ({ ...prev, [name]: selectedOption }))
    setIsButtonDisabled(false)
  }
  // انتخاب گیرنده نامه
  const handleSelectReciver = (selectedOption, name) => {
    setFormValues(prev => ({ ...prev, [name]: selectedOption }))
    // اضافه کردن مقدار انتخاب شده به محتوای ادیتور
    const reciverName = `${selectedOption.respectfulTitle} ${selectedOption.fullName}` // متن جدید
    const reciverPosition = selectedOption.respectfulSide // متن جدید
    const combinedText = reciverName + "\n" + reciverPosition // ترکیب متن‌ها با تگ <br/>
    setEditorReciver(combinedText)
    updateEditorContent(combinedText) // استفاده از تابع مشترک
    setIsButtonDisabled(false)
  }
  // انتخاب گیرندگان ارجاع و رونوشت
  const handleSelectTransmissionChange = (selectedOption, name) => {
    setTransmissionValues(prev => ({ ...prev, [name]: selectedOption }))
  }
  // توضیحات ارجاع
  const handleDescriptionChange = e => {
    const { name, value } = e.target
    setTransmissionValues(prev => ({ ...prev, [name]: value }))
  }
  // بازکردن مودال ارجاع
  const handleShowModal = () => {
    setShowModal(true)
  }
  // بستن مودال ارجاع
  const handleCloseModal = () => {
    setTransmissionValues({ erjaRecivers: [], roneveshtRecivers: [] })
    setShowModal(false)
  }
  // اعتبارسنجی فیلدهای نامه
  const validateFields = () => {
    const newErrors = {}
    if (!formValues.correspondenceTitle) {
      newErrors.correspondenceTitle = "موضوع نامه را وارد کنید"
      toastr.error("موضوع نامه وارد نشده است")
    }

    if (!formValues.selectedGroup) {
      newErrors.selectedGroup = "امضاکننده را انتخاب کنید"
      toastr.error("امضاکننده نامه انتخاب نشده است")
    }

    if (!formValues.selectedReceiver) {
      newErrors.selectedReceiver = "گیرنده نامه را انتخاب کنید"
      toastr.error("گیرنده نامه انتخاب نشده‌ است")
    }

    if (!editorState || !editorState.getCurrentContent().hasText()) {
      newErrors.editorContent = "متن نامه را وارد کنید"
      toastr.error("متن نامه وارد نشده است")
    }
    setErrors(newErrors)

    // به جای reliance روی state، مستقیماً از newErrors استفاده کنید
    return Object.keys(newErrors).length === 0
  }
  // لیست کاربران سیستم
  const getUsersList = async () => {
    try {
      const response = await GetListApi(token)
      if (response.status == 200) {
        const list = response.data
        const users = list.map(item => {
          const position = item.side != null ? item.side : " "
          return {
            value: item.id,
            label: item.user.name + " " + item.user.lastName + " - " + position,
            respectfulTitle: item.user.respectfulTitle,
            fullName: `${item.user.name} ${item.user.lastName}`,
            respectfulSide: item.respectfulSide,
          }
        })
        setUsersList(users)
      } else {
        if (response && response.status === 400) {
          console.error("Error:", response.data.message)
          toastr.error(response.data.message, "خطا!")
        } else {
          toastr.error(response.data.error, "خطا!")
        }
      }
    } catch (err) {
      console.error("خطا!")
    }
  }
  // ذخیره و بروزرسانی نامه
  const handleSubmit = async e => {
    e.preventDefault()
    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const contentAsJSON = JSON.stringify(rawContentState)
    setIsButtonDisabled(true)
    if (validateFields()) {
      setLoading(true)
      const data = {
        title: formValues.correspondenceTitle || null,
        content: contentAsJSON,
        signerId: formValues.selectedGroup.value,
        reciverUserId: formValues.selectedReceiver.value,
        reciverCompanyId: null,
        type: 1, // داخلی
        priority: formValues.urgency.value,
        confidentiality: formValues.classification.value,
        attached: null,
        attachType: null,
        LetterMedias: uploadFiles.map((media, index) => {
          return {
            mediaId: media.id,
            title: `${formValues.correspondenceTitle} + file${index + 1}`,
          }
        }),
      }
      if (letter.id !== null) {
        const body = { ...data, id: letter.id }
        const result = await updateApi(token, body)
        if (result.status == 200) {
          setLoading(false)
          setStatusLabel("ثبت شده")
          toastr.success("اطلاعات نامه با موفقیت ذخیره شد")
        } else {
          setLoading(false)
          toastr.error(t("خطا در سرور! مجدد امتحان کنید"))
        }
      } else {
        const result = await createApi(token, data)
        if (result.status == 200) {
          setLoading(false)
          setStatusLabel("ثبت شده")
          const data = result.data
          toastr.success("اطلاعات نامه با موفقیت ذخیره شد")
          setLetter({
            id: data.id || null,
          })
        } else {
          setLoading(false)
          toastr.error(t("خطا در سرور! مجدد امتحان کنید"))
        }
      }
    }
  }
  //meta title
  document.title = "ایجاد نامه جدید - اتوماسیون اداری"

  const [customActiveTab, setcustomActiveTab] = useState("1")

  const { t } = useTranslation()

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab)
    }
  }

  // آپلود فایل انتخاب شده
  const handleFileChange = async e => {
    const files = Array.from(e.target.files)
    const formattedFiles = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setLoading(true)
    try {
      const uploadPromises = formattedFiles.map(file => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("dist", file.name)
        return uploadFile(token, formData)
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
    } finally {
      setLoading(false)
      setIsButtonDisabled(false) // مخفی کردن loader پس از اتمام آپلود
    }
  }

  //تابع برای استخراج نام فایل
  function formatMediaTitle(url) {
    const filename = extractFileName(url)
    // تبدیل underscore و خط تیر به فاصله
    let title = filename.replace(/[_-]/g, " ")
    return title.trim() || "فایل بدون عنوان"
  }

  // تابع استخراج نام فایل از URL
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

  // حذف فایل آپلود شده
  const handleDeleteFile = async id => {
    if (id) {
      const result = await deleteUploadFileApi(token, id)
      if (result.status === 200) {
        setUploadFiles(uploadFiles.filter(item => item.id != id))
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

  // امضای نامه
  const handleSignLetter = async () => {
    if (letter.id !== null) {
      const data = {
        letterId: letter.id,
      }
      const response = await signLetterApi(token, data)
      if (response.status == 200) {
        const jalaliCreated = response.data.signedAt
        const jalaliCreatedDate = moment(jalaliCreated).format("jYYYY/jMM/jDD")
        setLetter({
          id: response.data.id,
          date: jalaliCreatedDate,
        })
        setStatusLabel("امضاشده")
      } else {
        toastr.error("شما امضاکننده نامه نیستید", "خطا!")
      }
    }
  }

  // ارجاع نامه
  const handleCreateTransmission = async () => {
    try {
      if (letter.id == null) {
        handleCloseModal()
        return
      }
      // اعتبارسنجی گیرندگان
      if (
        (!transmissionValues.erjaRecivers ||
          transmissionValues.erjaRecivers.length === 0) &&
        (!transmissionValues.roneveshtRecivers ||
          transmissionValues.roneveshtRecivers.length === 0)
      ) {
        toastr.warning("لطفاً حداقل یک گیرنده (ارجاع یا رونوشت) انتخاب کنید")
        return
      }
      // اعتبارسنجی توضیحات
      if (
        !transmissionValues.descriptionErja ||
        transmissionValues.descriptionErja.trim() === ""
      ) {
        toastr.warning("لطفاً توضیحات را وارد کنید")
        return
      }
      // ارسال ارجاعات
      if (transmissionValues.erjaRecivers?.length > 0) {
        await Promise.all(
          transmissionValues.erjaRecivers.map(async reciver => {
            const body = {
              description: transmissionValues.descriptionErja || "",
              letterId: letter.id,
              toUserId: reciver.value,
              type: Number(0),
              letterTrackingMedias: [],
            }
            await createTracking(token, body)
          })
        )
      }
      // ارسال رونوشت‌ها
      if (transmissionValues.roneveshtRecivers?.length > 0) {
        await Promise.all(
          transmissionValues.roneveshtRecivers.map(async reciver => {
            const body = {
              description: transmissionValues.descriptionErja || "",
              letterId: letter.id,
              toUserId: reciver.value,
              type: Number(1),
              letterTrackingMedias: [],
            }
            await createTracking(token, body)
          })
        )
      }
      toastr.success("ارجاع نامه با موفقیت انجام شد")
      handleCloseModal()
    } catch (error) {
      console.error("Error in handleCreateTransmission:", error)
      toastr.error("خطا در ارجاع نامه")
    }
  }

  // handle delete letter
  const handleDeleteLetter = async () => {
    if (letter.id !== null) {
      const config = {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
        },
      }
      await axios
        .delete(
          // `http://localhost:3000/letter/delete-letter/${letter.id}/`,
          config
        )
        .then(response => {
          if (response.status === 204) {
            toastr.success("حذف نامه با موفقیت انجام شد")
            setTimeout(() => {
              navigate("/letterCartabl")
            }, 500)
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            console.error("Error:", error.response.data.message)
            toastr.error(error.response.data.message, "خطا!")
          } else {
            toastr.error(error.response.data.error, "خطا!")
          }
        })
    }
  }

  // شماره گذاری نامه
  const handleNumberingLetter = async () => {
    if (letter.id !== null) {
      const data = {
        letterId: letter.id,
      }
      const response = await numberingLetterApi(token, data)
      if (response.status === 200) {
        setStatusLabel("شماره شده")
        const jalaliCreated = response.data.signedAt
        const jalaliCreatedDate = moment(jalaliCreated).format("jYYYY/jMM/jDD")
        setLetter({
          id: response.data.id,
          date: jalaliCreatedDate,
          number: response.data.number,
        })
      } else {
        setStatusLabel("خطا ! مجدد امتحان کنید")
      }
    }
  }

  // handle editor state
  const handleEditorChange = newEditorState => {
    setEditorState(newEditorState)

    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const contentAsJSON = JSON.stringify(rawContentState, null, 2)
    setContentAsJSON(contentAsJSON)

    // Convert editor content to HTML
    const newHtmlContent = draftToHtml(rawContentState)
    setHtmlContent(newHtmlContent)

    setIsButtonDisabled(false) // Enable button when editor content changes
  }

  React.useEffect(() => {
    setLoading(true)
    // تابع تقسیم محتوا به صفحات
    const splitContentIntoPages = content => {
      const div = document.createElement("div")
      div.innerHTML = content.replace(/\n/g, "<br/>")
      const lines = div.innerHTML.split("<br/>")
      let currentPage = []
      let pagesArray = []

      lines.forEach((line, index) => {
        currentPage.push(line)
        if (
          currentPage.length >= maxLinesPerPage ||
          index === lines.length - 1
        ) {
          pagesArray.push(currentPage.join("\n"))
          currentPage = []
        }
      })

      return pagesArray
    }
    // ابتدا دریافت لیست کاربران
    getUsersList().then(() => {
      // سپس تقسیم محتوا به صفحات
      const pages = splitContentIntoPages(htmlContent)
      setPages(pages)
      setLoading(false)
    })
  }, [htmlContent])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Breadcrumbs title="Forms" breadcrumbItem="Form Validation" /> */}

          <h4 className="card-title font-size-22">{t("نامه داخلی")}</h4>
          <Row>
            <Col className="col-lg-12 px-0 mt-3">
              <Card className="mb-2 letterCard_style">
                <CardBody>
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <div className="row">
                        {statusLabel !== "شماره شده" ? (
                          <>
                            <div className="col-auto px-1 px-lg-2">
                              <button
                                className="d-flex align-items-center btn btn-primary withText px-2 py-2"
                                disabled={loading || isButtonDisabled}
                                onClick={handleSubmit}
                              >
                                {loading ? (
                                  <>
                                    <i className="bx bx-loader bx-spin font-size-18 ms-lg-1"></i>
                                    <span className="d-none d-sm-block">
                                      در حال ذخیره...
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save font-size-18 ms-lg-1"></i>
                                    <span className="d-none d-sm-block">
                                      ذخیره
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                            {/* حذف نامه */}
                            {/* <div className="col-auto px-1">
                              <button
                                className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 textFree"
                                disabled={statusLabel !== "ثبت شده"}
                                onClick={handleDeleteLetter}
                              >
                                <i className="bx bx-trash font-size-18"></i>
                              </button>
                            </div> */}
                            <div className="col-auto px-1 px-lg-2">
                              <button
                                className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
                                onClick={handleSignLetter}
                                disabled={statusLabel !== "ثبت شده"}
                              >
                                <i className="fas fa-file-signature ms-lg-1"></i>
                                <span className="d-none d-sm-block">امضا</span>
                              </button>
                            </div>
                            <div className="col-auto px-1 px-lg-2">
                              <button
                                className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
                                onClick={handleNumberingLetter}
                                disabled={statusLabel !== "امضاشده"}
                              >
                                <i className="mdi mdi-numeric ms-lg-1 font-size-22"></i>
                                <span className="d-none d-sm-block">
                                  ثبت شماره
                                </span>
                              </button>
                            </div>
                            <div className="col-auto px-1 px-lg-2">
                              <button
                                className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
                                onClick={handleShowModal}
                                disabled={statusLabel !== "ثبت شده"}
                              >
                                <i className="bx bx-send ms-lg-1 font-size-18"></i>
                                <span className="d-none d-sm-block">ارجاع</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-auto px-1 px-lg-2">
                              <button
                                className="d-flex align-items-center btn letterBtn_topNav px-2 py-2 withText noHover"
                                onClick={handleShowModal}
                                // disabled={statusLabel !== "ثبت شده"}
                              >
                                <i className="bx bx-send ms-lg-1 font-size-18"></i>
                                <span className="d-none d-sm-block">ارجاع</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center col-auto mt-3 mt-sm-0">
                      {statusLabel != null ? (
                        <span className="letterStatus_topNav">
                          {statusLabel}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col className="col-12 col-lg-4 px-0">
              <Card className="mb-0 letterCard_style h-100">
                <CardBody
                  className={`p-0 ${
                    i18n.language === "fa" ? "rtlContent" : "ltrContent"
                  }`}
                >
                  <Nav tabs className="nav-tabs-custom nav-justified">
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
                        <span className="d-block d-lg-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">مشخصات</span>
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
                        <span className="d-none d-sm-block">متن</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "3",
                        })}
                        onClick={() => {
                          toggleCustom("3")
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">پیوست</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent
                    activeTab={customActiveTab}
                    className="position-relative text-muted p-3"
                  >
                    <TabPane tabId="1">
                      <Row className="">
                        <Col sm="12">
                          <Form className="needs-validation">
                            <Row style={{ paddingBottom: "60px" }}>
                              <Col md="12 ">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="correspondenceTitle">
                                    {t("موضوع")}{" "}
                                    <span className="requareForm">*</span>
                                  </Label>
                                  <Input
                                    name="correspondenceTitle"
                                    type="text"
                                    className="form-control"
                                    id="correspondenceTitle"
                                    value={formValues.correspondenceTitle}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    invalid={!!errors.correspondenceTitle}
                                    placeholder="موضوع نامه را وارد کنید"
                                    disabled={statusLabel == "شماره شده"}
                                  />
                                  {errors.correspondenceTitle && (
                                    <FormFeedback>
                                      {errors.correspondenceTitle}
                                    </FormFeedback>
                                  )}
                                </FormGroup>
                              </Col>

                              <Col md="12" className="mb-3 mb-md-0">
                                <div className="mb-3">
                                  <Label>
                                    {" "}
                                    {t("امضا کننده")}
                                    <span className="requareForm">*</span>
                                  </Label>{" "}
                                  <Select
                                    value={formValues.selectedGroup}
                                    onChange={selected =>
                                      handleSelectChange(
                                        selected,
                                        "selectedGroup"
                                      )
                                    }
                                    options={usersList}
                                    className="select2-selection"
                                    placeholder="امضاکننده نامه را انتخاب کنید"
                                    isDisabled={statusLabel == "شماره شده"}
                                  />
                                  {errors.selectedGroup && (
                                    <div
                                      className="text-danger mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {errors.selectedGroup}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col md="12" className="mb-3 mb-md-0">
                                <div className="mb-3">
                                  <Label>
                                    {" "}
                                    {t("گیرنده")}
                                    <span className="requareForm">*</span>
                                  </Label>{" "}
                                  <Select
                                    value={formValues.selectedReceiver}
                                    onChange={selected =>
                                      handleSelectReciver(
                                        selected,
                                        "selectedReceiver"
                                      )
                                    }
                                    options={usersList}
                                    className="select2-selection"
                                    placeholder="گیرنده نامه را انتخاب کنید"
                                    isDisabled={statusLabel == "شماره شده"}
                                  />
                                  {errors.selectedReceiver && (
                                    <div
                                      className="text-danger mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {errors.selectedReceiver}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col md="12" className="mb-3 mb-md-0">
                                <div className="mb-3">
                                  <Label> {t("رونوشت گیرنده")}</Label>{" "}
                                  <Select
                                    value={formValues.selectedMulti}
                                    isMulti
                                    onChange={selected =>
                                      handleSelectChange(
                                        selected,
                                        "selectedMulti"
                                      )
                                    }
                                    options={usersList}
                                    className="select2-selection"
                                    placeholder="رونوشت گیرنده را انتخاب کنید"
                                    isDisabled={statusLabel == "شماره شده"}
                                  />
                                </div>
                              </Col>

                              <Col md="12" className="mb-3 mb-md-0">
                                <div className="">
                                  <Label>توضیحات</Label>
                                  <Input
                                    type="textarea"
                                    name="description"
                                    id="textarea"
                                    rows="3"
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                    placeholder="توضیحات را وارد کنید"
                                    disabled={statusLabel == "شماره شده"}
                                  />
                                </div>
                              </Col>

                              <div className="col-12">
                                <div className="row mt-3 justify-content-between">
                                  <div className="col-auto">
                                    <div className="mb-3">
                                      {/* مقدار پیشفرض *عادی* باشد*/}
                                      <Label> {t("طبقه بندی")}</Label>{" "}
                                      <Select
                                        value={
                                          formValues.classification
                                            ? {
                                                label:
                                                  formValues.classification
                                                    .label,
                                                value:
                                                  formValues.classification
                                                    .value,
                                              }
                                            : { label: "عادی", value: 0 } // مقدار پیش‌فرض
                                        }
                                        onChange={selected =>
                                          handleSelectChange(
                                            selected,
                                            "classification"
                                          )
                                        }
                                        options={[
                                          { label: "عادی", value: 0 },
                                          { label: "محرمانه", value: 1 },
                                        ]}
                                        className="select2-selection"
                                        isDisabled={statusLabel == "شماره شده"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-auto">
                                    <div className="mb-3">
                                      {/* مقدار پیشفرض *عادی* باشد*/}
                                      <Label> {t("فوریت")}</Label>{" "}
                                      <Select
                                        value={
                                          formValues.urgency
                                            ? {
                                                label: formValues.urgency.label,
                                                value: formValues.urgency.value,
                                              }
                                            : { label: "عادی", value: 1 } // مقدار پیش‌فرض
                                        }
                                        onChange={selected =>
                                          handleSelectChange(
                                            selected,
                                            "urgency"
                                          )
                                        }
                                        options={[
                                          { label: "عادی", value: 1 },
                                          { label: "فوری", value: 2 },
                                          { label: "آنی", value: 3 },
                                        ]}
                                        className="select2-selection"
                                        placeholder="Select"
                                        isDisabled={statusLabel == "شماره شده"}
                                      />
                                    </div>
                                  </div>{" "}
                                </div>
                              </div>

                              <Col
                                md="12"
                                className="position-absolute"
                                style={{ bottom: "0px" }}
                              >
                                <div
                                  className="mb-0"
                                  style={{ marginBottom: "0px" }}
                                >
                                  <Label htmlFor="correspondenceSender">
                                    {t("فرستنده")}{" "}
                                  </Label>
                                  <Input
                                    name="firstname"
                                    placeholder={t("Sender")}
                                    type="text"
                                    className="form-control"
                                    id="correspondenceSender"
                                    value={
                                      userInfo
                                        ? userInfo.name +
                                          " " +
                                          userInfo.lastName
                                        : "-"
                                    }
                                    disabled
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" className="">
                      <Row>
                        <Col sm="12">
                          <Col md="12">
                            <FormGroup className="mb-3 mt-2">
                              <Label htmlFor="correspondenceEditor">
                                {t("متن")}
                                <span className="requareForm"> *</span>
                              </Label>
                              <div method="post" id="correspondenceEditor">
                                <Editor
                                  editorState={editorState}
                                  readOnly={statusLabel === "شماره شده"}
                                  editorStyle={
                                    statusLabel === "شماره شده"
                                      ? {
                                          opacity: 0.7,
                                          backgroundColor: "#f5f5f5",
                                          cursor: "not-allowed",
                                        }
                                      : {
                                          lineHeight: "0.68",
                                          padding: "10px",
                                          minHeight: "200px",
                                        }
                                  }
                                  onEditorStateChange={handleEditorChange}
                                  toolbar={{
                                    options: [
                                      "inline",
                                      "list",
                                      "textAlign",
                                      "history",
                                    ],
                                    inline: {
                                      options: ["bold", "italic", "underline"],
                                    },
                                    blockType: {
                                      inDropdown: true,
                                    },
                                    list: {
                                      inDropdown: false,
                                    },
                                    textAlign: {
                                      inDropdown: false,
                                    },
                                    link: {
                                      inDropdown: true,
                                    },
                                    history: {
                                      inDropdown: false,
                                    },
                                  }}
                                  toolbarClassName="toolbarClassName"
                                  wrapperClassName="wrapperClassName"
                                  editorClassName="editorClassName"
                                />
                                {errors.editorContent && (
                                  <div
                                    className="text-danger mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {errors.editorContent}
                                  </div>
                                )}
                              </div>
                            </FormGroup>
                          </Col>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3" className="">
                      <Col sm="12">
                        <FormGroup className="mb-3 mt-2">
                          <Label
                            htmlFor="correspondenceAttachments"
                            className="form-label"
                          >
                            {t("Attachment")}{" "}
                          </Label>
                          {loading && (
                            <div
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.64)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999,
                              }}
                            >
                              <div className="loader d-flex flex-column align-items-center">
                                <div
                                  className="spinner-border text-white mb-3"
                                  style={{ width: "48px", height: "48px" }}
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                                <span className="text-white px-3 py-2 rounded">
                                  در حال آپلود...
                                </span>
                              </div>
                            </div>
                          )}
                          <Input
                            className="form-control"
                            type="file"
                            id="correspondenceAttachments"
                            multiple
                            onChange={e => handleFileChange(e)}
                            disabled={statusLabel == "شماره شده"}
                          />
                        </FormGroup>
                      </Col>
                      {uploadFiles.map((file, index) => (
                        <Row
                          className={
                            statusLabel === "شماره شده"
                              ? "opacity-50 pe-none "
                              : ""
                          }
                          key={index}
                        >
                          <div className="col">
                            <div
                              className="card h-100 shadow-sm border border-muted"
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
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
            <Col className="col-12 col-lg-8 ps-0 pe-0 mt-3 mt-lg-0 pe-lg-2">
              <Card className="mb-0 h-100 letterCard_style">
                <CardBody
                  className={`${
                    i18n.language === "fa" ? "rtlContent" : "ltrContent"
                  }`}
                >
                  <Row
                    className="justify-content-center "
                    style={{
                      backgroundColor: "transparent",
                      backgroundImage: "none",
                    }}
                  >
                    <Col
                      className="col-12 col-sm-auto justify-content-center"
                      style={{ maxHeight: "630px" }}
                    >
                      {pages.map((pageContent, pageIndex) => (
                        <div
                          className="letterStyleArea position-relative text-center mt-3"
                          key={pageIndex}
                        >
                          <img src={LetterImg} alt="" className="img-fluid" />

                          <div
                            className="topLeftLetterhead"
                            style={{ marginLeft: "5px", textAlign: "center" }}
                          >
                            <div className="index date mt-1">
                              <span>
                                {["امضاشده", "شماره شده"].includes(statusLabel)
                                  ? letter.date
                                  : "-"}
                              </span>
                            </div>
                            <div className="index letterNo">
                              <span>
                                {statusLabel == "شماره شده"
                                  ? letter.number
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="centerLetterhead text-start mt-5">
                            <div
                              className="letterText"
                              style={{
                                fontFamily: "BNazanin",
                                fontSize: "14px",
                                overflow: "hidden",
                                maxHeight: "calc(100% - 50px)",
                              }}
                            >
                              {pageIndex === 0 && (
                                <h4 className="text-center mb-3">بسمه تعالی</h4>
                              )}

                              <div
                                style={{
                                  maxHeight: "265px",
                                  overflow: "hidden",
                                  lineHeight: "1",
                                }}
                                className="preview mt-1"
                                dangerouslySetInnerHTML={{
                                  __html: pageContent,
                                }}
                              />

                              {["امضاشده", "شماره شده"].includes(statusLabel) &&
                                pageIndex === pages.length - 1 && (
                                  <div className="bottomLeftLetterhead mb-3">
                                    <img
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={userInfo?.signature}
                                      alt="Signature"
                                      className="img-fluid"
                                    />
                                    <p> {"با درود و احترام"} </p>
                                    <p>
                                      {userInfo?.name +
                                        " " +
                                        userInfo?.lastName}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Modal */}
                      {showModal && (
                        <>
                          <div className="modal-backdrop fade show"></div>
                          <div
                            className="modal show d-block"
                            tabIndex="-1"
                            role="dialog"
                          >
                            <div
                              className="modal-dialog modal-dialog-centered"
                              role="document"
                            >
                              <div className="modal-content shadow-lg rounded-3">
                                <div className="modal-header text-primary">
                                  <h5 className="modal-title">ارجاع نامه</h5>
                                  <button
                                    type="button"
                                    className="btn-close text-white"
                                    onClick={handleCloseModal}
                                  ></button>
                                </div>

                                {/* محتوای مودال */}
                                <div className="modal-body">
                                  {/* ارجاع */}
                                  <div className="form-group">
                                    <FormGroup className="mb-3 mt-2">
                                      <Label
                                        htmlFor="correspondenceAttachments"
                                        className="form-label"
                                      >
                                        {"ارجاع نامه "}
                                      </Label>
                                      <Select
                                        value={transmissionValues.erjaRecivers}
                                        isMulti
                                        onChange={selected =>
                                          handleSelectTransmissionChange(
                                            selected,
                                            "erjaRecivers"
                                          )
                                        }
                                        options={usersList}
                                        className="select2-selection"
                                        placeholder="گیرنده ارجاع را انتخاب کنید"
                                      />
                                    </FormGroup>
                                  </div>
                                  {/* پیش نویس */}
                                  <div className="form-group">
                                    <FormGroup className="mb-3 mt-2">
                                      <Label
                                        htmlFor="correspondenceAttachments"
                                        className="form-label"
                                      >
                                        {"پیش نویس نامه "}
                                      </Label>
                                      <Select
                                        value={
                                          transmissionValues.roneveshtRecivers
                                        }
                                        isMulti
                                        onChange={selected =>
                                          handleSelectTransmissionChange(
                                            selected,
                                            "roneveshtRecivers"
                                          )
                                        }
                                        options={usersList}
                                        className="select2-selection"
                                        placeholder="گیرنده رونوشت را انتخاب کنید"
                                      />
                                    </FormGroup>
                                  </div>
                                  {/* توضیحات */}
                                  <div className="form-group">
                                    <FormGroup className="mb-3 mt-2">
                                      <Label
                                        htmlFor="correspondenceAttachments"
                                        className="form-label"
                                      >
                                        {"توضیحات "}
                                      </Label>
                                      <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="توضیحات خود را وارد کنید"
                                        name="descriptionErja"
                                        type="text"
                                        onChange={e =>
                                          handleDescriptionChange(e)
                                        }
                                      ></textarea>
                                    </FormGroup>
                                  </div>
                                </div>

                                {/* دکمه‌های مودال */}
                                <div className="modal-footer justify-content-between">
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleCreateTransmission}
                                  >
                                    ثبت
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                  >
                                    بستن
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withTranslation()(LetterCreate)
