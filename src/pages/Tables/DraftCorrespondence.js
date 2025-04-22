import React, { useState } from "react"
import { useParams } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

import Select from "react-select"
import { toPng } from "html-to-image"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import { EditorState, ContentState, convertToRaw } from "draft-js"
import { stateToHTML } from "draft-js-export-html"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

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
import LetterImg from "../../assets/images/companies/uranus-letter-empty.jpg"
import SignitureImg from "../../assets/images/companies/signiture.png"

function DraftLetter() {
  //meta title
  document.title = "ویرایش نامه پیش نویس - سامانه مکاتبات"
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
  const [attachments, setAttachments] = React.useState([])
  const [letterNumber, setLetterNumber] = React.useState(null)
  const [sendTime, setSendTime] = React.useState()
  const [openModal, setOpenModal] = React.useState(false)
  const [selectAttachments, setSelectedAttachments] = React.useState([])
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [userList, setUserList] = React.useState([])
  const [selectTouched, setSelectTouched] = useState(false)
  const [selectedGroup, setselectedGroup] = useState(null)
  const [selectSet, setSelectSet] = useState(null)
  const [selectType, setSelectType] = useState(null)
  const [selectPriority, setSelectPriority] = useState(null)
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
  // ************ sumit *******************
  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then(dataUrl => {
        // submit
        console.log(
          title,
          text,
          letterNumber,
          selectSet.value,
          selectType.value,
          selectPriority.value,
          description,
          linked,
          receiver.value
        )
        console.log(dataUrl)
        const url = `http://localhost:3000/letter/insert-letter/`
        const formData = {
          attachment: [],
          receiver: [receiver.value],
          number: letterNumber,
          type: selectType.value,
          priority: selectPriority.value,
          state: 2, // send
          set: selectSet.value,
          title: title,
          description: description,
          content: text,
          linked: linked,
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
          console.log(response)
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
        })
        return
        // const link = document.createElement("a");
        // link.download = "pic.png";
        // link.href = dataUrl;
        // link.click();
      })
      .catch(err => {
        console.log(err)
      })
  }
  // ********** go to draft **************
  const sendToDraftFun = () => {
    const url = `http://localhost:3000/letter/insert-letter/`
    const formData = {
      attachment: [],
      receiver: [],
      number: letterNumber,
      type: selectType.value,
      priority: selectPriority.value,
      state: 1, // draft
      set: selectSet.value,
      status: 0,
      title: title,
      description: null,
      content: text,
      linked: linked,
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
        const result = data[0]
        setUserInfo({
          id: result.id,
          fullName: result.first_name + " " + result.last_name,
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
        setLetterNumber(data)
      })
  }
  // *********** get date ****************
  const getDate = () => {
    fetch("https://api.keybit.ir/time/")
      .then(res => res.json())
      .then(data => setSendTime(data.date.full.official.usual.fa))
  }
  // ********* Form validation ***********
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: userInfo.fullName,
      correspondenceTime: sendTime,
      correspondenceTitle: "",
      // set: '',
      // type: '',
      // priority: '',
      text: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("لطفا نام خود را وارد کنید"),
      correspondenceTime: Yup.string(),
      correspondenceTitle: Yup.string()
        .required("لطفا عنوان نامه را وارد کنید")
        .max(100, "عنوان نامه نمیتواند بیشتر از 100 کارکتر باشد"),
      // set: Yup.string().required('نوع نامه را انتخاب کنید'),
      // type: Yup.string().required('طبقه بندی نامه را انتخاب کنید'),
      // priority: Yup.string().required('فوریت نامه را انتخاب کنید'),
      text: Yup.string().required("لطفا متن نامه را وارد کنید"),
    }),
    onSubmit: values => {
      console.log("values", values)
      setTitle(values.correspondenceTitle)
      setText(values.text)

      setOpenModal(true)
    },
  })
  // option list select
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
  // handle change reciver
  function handleReciver(receiver) {
    setReceiver(receiver)
  }
  const [formValidation, setValidation] = useState({
    fnm: null,
    lnm: null,
    unm: null,
    city: null,
    stateV: null,
  })
  //for change tooltip display propery
  const onChangeValidation = (fieldName, value) => {
    const modifiedV = { ...validation }
    if (value !== "") {
      modifiedV[fieldName] = true
    } else {
      modifiedV[fieldName] = false
    }
    setValidation(modifiedV)
  }
  // Form validation
  const rangeValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      min_Length: "",
      max_Length: "",
      range_Length: "",
      min_Value: "",
      max_Value: "",
      range_Value: "",
      regular_Exp: "",
    },
    validationSchema: Yup.object().shape({
      min_Length: Yup.string()
        .min(6, "Must be exactly 6 digits")
        .required("Min 6 chars"),
      max_Length: Yup.string()
        .max(6, "Must be exactly 6 digits")
        .required("Max 6 chars"),
      range_Length: Yup.string()
        .required("شماره‌نامه 5 رقم می‌باشد")
        .min(5, "شماره‌نامه 5 رقم می‌باشد")
        .max(5, "شماره‌نامه 5 رقم می‌باشد"),
      min_Value: Yup.string()
        .required("Min Value 6")
        .test(
          "val",
          "This value should be greater than or equal to 6",
          val => val >= 6
        ),
      max_Value: Yup.string()
        .required("Max Value 6")
        .matches(/^[0-6]+$/, "This value should be lower than or equal to 6."),
      range_Value: Yup.string()
        .required("range between 5 to 10")
        .min(5, "This value should be between 5 and 10")
        .max(10, "This value should be between 5 and 10"),
      regular_Exp: Yup.string()
        .matches(/^[#0-9]+$/, "Only Hex Value")
        .required("Only Hex Value"),
    }),
    onSubmit: values => {
      console.log("values", values)
    },
  })
  const [formRows, setFormRows] = useState([{ id: 1 }])
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  // handle chnage file
  const handlechangeFile = e => {
    if (e.target.files) {
      setSelectedAttachments(e.target.files[0])
    }
  }
  // handle upload file
  const handleUploadFile = () => {
    if (!selectAttachments) {
      alert("file is not exist!")
    } else {
      // selectAttachments.forEach((item) => {
      const formData = new FormData()
      formData.append("file", selectAttachments[0])
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
          console.log(data)
          if (data) {
            setUploadFiles(x => [...x, data.id])
          }
        })
        .catch(error => {
          console.log(error)
        })
      // })
    }
  }

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
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

  // textContainer.classList.add('letterTextStyle', 'letter-fontSize-a5', 'letter-fontFamily');
  React.useEffect(() => {
    setLoading(true)
    getUsers()
    getDate()
    getUserInfo()
    getLetterNumber()
    setLoading(false)
  }, [])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="نامه ها" breadcrumbItem="نامه جدید" />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">نامه جدید</h4>
                  <p className="card-title-desc">
                    برای ایجاد نامه جدید مقادیر زیر را تکمیل نمایید.
                  </p>
                  <form onSubmit={validation.handleSubmit}>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceSender">
                            فرستنده <span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="firstname"
                            placeholder="فرستنده"
                            type="text"
                            className="form-control"
                            id="correspondenceSender"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstname || ""}
                            invalid={
                              validation.touched.firstname &&
                              validation.errors.firstname
                                ? true
                                : false
                            }
                            disabled
                            required
                          />
                          {validation.touched.firstname &&
                          validation.errors.firstname ? (
                            <FormFeedback type="invalid">
                              {validation.errors.firstname}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceTime">
                            تاریخ ارسال <span className="requareForm">*</span>
                          </Label>
                          <Input
                            placeholder="***"
                            className="form-control text-start"
                            type="string"
                            value={validation.values.correspondenceTime || ""}
                            name="correspondenceTime"
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceNumber">
                            شماره نامه <span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="correspondenceNumber"
                            placeholder="شماره نامه"
                            type="text"
                            className="form-control"
                            id="correspondenceNumber"
                            value={letterNumber}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="set">
                            نوع نامه <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="set"
                            name="set"
                            value={selectSet}
                            onChange={newValue => {
                              handleSet(newValue)
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
                            className={
                              (validation.touched.set || selectTouched) &&
                              validation.errors.set
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "نوع نامه یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          />
                          {/* {validation.touched.set &&
                            validation.errors.set ? (
                            <FormFeedback type="invalid">
                              {validation.errors.set}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="type">
                            طبقه‌بندی <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="type"
                            name="type"
                            value={selectType}
                            onChange={newValue => {
                              handleType(newValue)
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
                            className={
                              (validation.touched.type || selectTouched) &&
                              validation.errors.type
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() =>
                              "طبقه بندی مورد نظر یافت نشد"
                            }
                            placeholder="از لیست زیر انتخاب کنید"
                          />
                          {/* {validation.touched.type &&
                            validation.errors.type ? (
                            <FormFeedback type="invalid">
                              {validation.errors.type}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="priority">
                            فوریت <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="priority"
                            name="priority"
                            value={selectPriority}
                            onChange={newValue => {
                              handlePriority(newValue)
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
                            className={
                              (validation.touched.priority || selectTouched) &&
                              validation.errors.priority
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "گزینه مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          />
                          {/* {validation.touched.priority &&
                            validation.errors.priority ? (
                            <FormFeedback priority="invalid">
                              {validation.errors.priority}
                            </FormFeedback>
                          ) : null} */}
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceTitle">
                            موضوع <span className="requareForm">*</span>
                          </Label>
                          <Input
                            name="correspondenceTitle"
                            placeholder="مثال: معرفی‌نامه"
                            type="text"
                            className="form-control"
                            id="correspondenceTitle"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.correspondenceTitle || ""}
                            invalid={
                              validation.touched.correspondenceTitle &&
                              validation.errors.correspondenceTitle
                                ? true
                                : false
                            }
                          />
                          {validation.touched.correspondenceTitle &&
                          validation.errors.correspondenceTitle ? (
                            <FormFeedback type="invalid">
                              {validation.errors.correspondenceTitle}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceEditor">
                            متن نامه <span className="requareForm">*</span>
                          </Label>
                          <div method="post" id="correspondenceEditor">
                            {/* <Editor
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              editorState={editorState}
                              onEditorStateChange={setEditorState}
                            /> */}
                            <Input
                              name="text"
                              type="textarea"
                              rows={7}
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.text}
                              invalid={
                                validation.touched.text &&
                                validation.errors.text
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.text &&
                            validation.errors.text ? (
                              <FormFeedback type="invalid">
                                {validation.errors.text}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3 mb-md-0">
                          <Label htmlFor="correspondenceRelated">
                            نامه مرتبط
                          </Label>
                          <Input
                            name="range_Length"
                            placeholder="شماره نامه مرتبط"
                            className="form-control"
                            id="correspondenceRelated"
                            type="number"
                            onFocus={e => {
                              if (rangeValidation.values.range_Length) {
                                rangeValidation.setFieldValue(
                                  "range_Length",
                                  ""
                                ) // Clear the value
                                rangeValidation.setFieldTouched(
                                  "range_Length",
                                  false
                                ) // Clear touch status
                              }
                            }}
                            onChange={e => {
                              rangeValidation.handleChange(e)

                              // Manually re-validate when input changes
                              rangeValidation.validateForm().then(() => {
                                rangeValidation.setFieldTouched(
                                  "range_Length",
                                  true
                                )
                              })
                            }}
                            value={rangeValidation.values.range_Length || ""}
                            invalid={
                              rangeValidation.touched.range_Length &&
                              rangeValidation.errors.range_Length
                            }
                          />
                          {rangeValidation.touched.range_Length &&
                          rangeValidation.errors.range_Length ? (
                            <FormFeedback type="invalid">
                              {rangeValidation.errors.range_Length}
                            </FormFeedback>
                          ) : null}
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceRelated">
                            پیوست نامه
                          </Label>
                          <div className="input-group">
                            <Input
                              type="file"
                              className="form-control"
                              id="correspondenceAttachments"
                              aria-describedby="inputGroupFileAddon04"
                              aria-label="Upload"
                              onClick={handlechangeFile}
                            />
                            <button
                              className="btn btn-info"
                              type="button"
                              id="inputGroupFileAddon04"
                              onClick={handleUploadFile}
                            >
                              آپلود فایل
                            </button>
                          </div>
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <div
                          className="repeater "
                          encType="multipart/form-data"
                        >
                          <div>
                            {(formRows || []).map((formRow, key) => (
                              // تو همین اولین رو، بوردر باتم و پی بی3 و دکمه دیلیت بعد از اضافه شدن یک گیرنده ظاهر بشن
                              <Row
                                key={key}
                                className="border-bottom pb-3 pt-md-3"
                              >
                                <Col md={4} className="mb-3 mb-md-0 zIndex2">
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label>گیرنده</Label>
                                    <Select
                                      value={receiver}
                                      isMulti={true}
                                      onChange={newValue => {
                                        handleReciver(newValue)
                                      }}
                                      options={optionGroupReciver.map(
                                        option => ({
                                          label: option.label,
                                          value: option.value,
                                          imageSrc: option.imageSrc, // Provide the image source for each option
                                        })
                                      )}
                                      className="select2-selection text-start zIndex2"
                                      noOptionsMessage={() =>
                                        "گیرنده مورد نظر یافت نشد"
                                      }
                                      placeholder="از لیست زیر انتخاب کنید"
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

                                <Col md={4} className="mb-3 mb-md-0">
                                  <Label htmlFor="referralDes">توضیحات</Label>
                                  <textarea
                                    id="referralDes"
                                    className="form-control"
                                    placeholder="توضیحات خود را اینجا بنویسید"
                                    rows="1"
                                    onChange={handleDescriptionChange}
                                  ></textarea>
                                </Col>
                                <Col
                                  md={2}
                                  className="text-center d-flex mb-3 mb-md-0"
                                >
                                  <div className=" mt-2 form-check d-inline form-switch form-switch-md ps-0 h-100 d-flex align-items-center">
                                    <label
                                      htmlFor="customSwitchsizemdRunevesht"
                                      className="form-check-label form-label me-5"
                                    >
                                      رونوشت
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="customSwitchsizemdRunevesht"
                                    />
                                  </div>
                                </Col>
                                {/* این دکمه بعد از اضافه شدن گیرنده دوم اضافه بشه. منظور از دکمه دییلیت تو کامنت بالایی همین بود */}
                                {/* <Col md={2} className="align-self-end">
                                  <div className="d-grid">
                                    <input
                                      type="button"
                                      className="btn btn-danger"
                                      value="حذف گیرنده"
                                      onClick={() =>
                                        onDeleteFormRow(formRow.id)
                                      }
                                    />
                                  </div>
                                </Col> */}
                              </Row>
                            ))}
                          </div>

                          {/* <Button
                            color="primary"
                            className="btn mt-3 "
                            onClick={() => onAddFormRow()}
                          >
                            افزودن گیرنده
                            <i className="mdi mdi-account-multiple-plus ms-2"></i>{" "}
                          </Button> */}
                        </div>
                      </Col>
                    </Row>

                    <Row className="justify-content-end mt-4">
                      <Col className="col-auto">
                        <Button type="submit" color="success" className="mx-1">
                          پیش‌نمایش و ارسال
                        </Button>
                        <Button>لفو</Button>
                      </Col>
                    </Row>
                  </form>

                  <Modal
                    isOpen={openModal}
                    modalTransition={{ timeout: 400 }}
                    backdropTransition={{ timeout: 100 }}
                  >
                    <ModalHeader>پیش نمایش نامه</ModalHeader>
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
                                {attachments.length == 0 ? (
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
                                <p>{text || " "}</p>
                              </div>
                              <div className="bottomLeftLetterhead">
                                <img
                                  src={SignitureImg}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mt-5">
                        <Col className="col-auto">
                          <Button
                            color="danger"
                            onClick={() => setOpenModal(false)}
                          >
                            بازگشت و ویرایش
                          </Button>
                          <Button
                            type="submit"
                            color="info"
                            className="ms-1"
                            onClick={downloadLetter}
                          >
                            دانلود نامه
                          </Button>
                          <Button
                            type="submit"
                            color="warning"
                            className="ms-1"
                            onClick={sendToDraftFun}
                          >
                            ذخیره در پیش نویس
                          </Button>
                          <Button
                            type="submit"
                            color="success"
                            className="ms-1"
                            onClick={htmlToImageConvert}
                          >
                            تایید و ارسال
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

export default DraftLetter
