import React, { useState } from "react"

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
} from "reactstrap"
import Select from "react-select"


// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// Formik validation
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

function NewLetter() {
  
  //meta title
  document.title = "Form Validation | Skote - React Admin & Dashboard Template"

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: "آرمین آقاجانی",
      lastname: "Otto",
      correspondenceNumber: "10035",
      correspondenceHeader: "",
      correspondenceTime: "2019-08-19T13:45:00",
      correspondenceTitle: "مثال: معرفی‌نامه",
      city: "City",
      state: "",
      zip: "Zip",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("لطفا نام خود را وارد کنید"),
      lastname: Yup.string().required("لطفا نام خانوادگی خود را وارد کنید"),
      city: Yup.string().required("لطفا شهر خود را وارد کنید"),
      state: Yup.string().required("لطفا شهر خود را وارد کنید"),
      zip: Yup.string().required("لطفا شهر خود را وارد کنید"),
      correspondenceHeader: Yup.string().required("لطفا سربرگ را انتخاب کنید"),
    }),
    onSubmit: values => {
      console.log("values", values)
    },
  })

  const [selectTouched, setSelectTouched] = useState(false)
  const [selectedGroup, setselectedGroup] = useState(null)

  function handleSelectGroup(selectedGroup) {
    if (selectedGroup) {
      const selectedValue = selectedGroup.value
      validation.setFieldValue("correspondenceHeader", selectedGroup.value)
      setselectedGroup(selectedGroup)
      setSelectTouched(true) // Set the select as touched
    }
  }

  const optionGroup = [
    {
      label: "A5",
      options: [
        { label: "سربرگ دار", value: "1سربرگ دار" },
        { label: "بدون سربرگ", value: "بدون سربرگ" },
      ],
    },
    {
      label: "A4",
      options: [
        { label: "سربرگ دار", value: "سربرگ دار" },
        { label: "بدون سربرگ", value: "1بدون سربرگ" },
      ],
    },
  ]

  const optionGroupLetterType = [
    {
      // label: "درون",
      options: [
        { label: "داخلی", value: "داخلی" },
        // { label: "بدون سربرگ", value: "بدون سربرگ" },
      ],
    },
  ]
  const optionGroupSecurity = [
    {
      // label: "درون",
      options: [
        { label: "عادی", value: "عادی" },
        { label: "محرمانه", value: "محرمانه" },
      ],
    },
  ]
  const optionGroupSUrgency = [
    {
      // label: "درون",
      options: [
        { label: "عادی", value: "عادی" },
        { label: "آنی", value: "آنی" },
        { label: "فوری", value: "فوری" },
      ],
    },
  ]

  const [formValidation, setValidation] = useState({
    fnm: null,
    lnm: null,
    unm: null,
    city: null,
    stateV: null,
  })

  function handleSubmit(e) {
    e.preventDefault()
    const modifiedV = { ...formValidation }
    var fnm = document.getElementById("validationTooltip01").value
    var lnm = document.getElementById("validationTooltip02").value
    var unm = document.getElementById("validationTooltipUsername").value
    var city = document.getElementById("validationTooltip03").value
    var stateV = document.getElementById("validationTooltip04").value

    if (fnm === "") {
      modifiedV["fnm"] = false
    } else {
      modifiedV["fnm"] = true
    }

    if (lnm === "") {
      modifiedV["lnm"] = false
    } else {
      modifiedV["lnm"] = true
    }

    if (unm === "") {
      modifiedV["unm"] = false
    } else {
      modifiedV["unm"] = true
    }

    if (city === "") {
      modifiedV["city"] = false
    } else {
      modifiedV["city"] = true
    }

    if (stateV === "") {
      modifiedV["stateV"] = false
    } else {
      modifiedV["stateV"] = true
    }
    setValidation(modifiedV)
  }

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Forms" breadcrumbItem="Form Validation" />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">نامه جدید</h4>
                  <p className="card-title-desc">
                    برای ایجاد نامه جدید مقادیر زیر را تکمیل نمایید.
                  </p>
                  <Form
                    className="needs-validation"
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
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
                            تاریخ و زمان ارسال{" "}
                            <span className="requareForm">*</span>
                          </Label>
                          <Input
                            placeholder="***"
                            className="form-control text-start"
                            type="datetime-local"
                            value={validation.values.correspondenceTime || ""}
                            id="correspondenceTime"
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
                            type="number"
                            className="form-control"
                            id="correspondenceNumber"
                            disabled
                            required
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.correspondenceNumber || ""}
                            invalid={
                              validation.touched.correspondenceNumber &&
                                validation.errors.correspondenceNumber
                                ? true
                                : false
                            }
                          />
                          {validation.touched.correspondenceNumber &&
                            validation.errors.correspondenceNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.correspondenceNumber}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceHeader">
                            نوع نامه <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="correspondenceHeader"
                            name="correspondenceHeader"
                            // value={selectedGroup}
                            // onChange={handleSelectGroup}
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
                              (validation.touched.correspondenceHeader ||
                                selectTouched) &&
                                validation.errors.correspondenceHeader
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "سربرگ مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          // onBlur={() => {
                          //   validation.handleBlur() // Trigger Formik's onBlur
                          //   // setSelectTouched(true) // Set the select as touched
                          // }}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceHeader">
                            طبقه‌بندی <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="correspondenceHeader"
                            name="correspondenceHeader"
                            // value={selectedGroup}
                            // onChange={handleSelectGroup}
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
                              (validation.touched.correspondenceHeader ||
                                selectTouched) &&
                                validation.errors.correspondenceHeader
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "سربرگ مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          // onBlur={() => {
                          //   validation.handleBlur() // Trigger Formik's onBlur
                          //   // setSelectTouched(true) // Set the select as touched
                          // }}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceHeader">
                            فوریت <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="correspondenceHeader"
                            name="correspondenceHeader"
                            // value={selectedGroup}
                            // onChange={handleSelectGroup}
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
                              (validation.touched.correspondenceHeader ||
                                selectTouched) &&
                                validation.errors.correspondenceHeader
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "سربرگ مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          // onBlur={() => {
                          //   validation.handleBlur() // Trigger Formik's onBlur
                          //   // setSelectTouched(true) // Set the select as touched
                          // }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="8">
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
                            required
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            // value={validation.values.correspondenceTitle || ""}
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceHeader">
                            سربرگ <span className="requareForm">*</span>
                          </Label>
                          <Select
                            id="correspondenceHeader"
                            name="correspondenceHeader" // Set the name attribute for Formik
                            value={selectedGroup}
                            onChange={handleSelectGroup} // Call the updated function
                            options={optionGroup}
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
                              (validation.touched.correspondenceHeader ||
                                selectTouched) &&
                                validation.errors.correspondenceHeader
                                ? "select2-selection is-invalid"
                                : "select2-selection"
                            }
                            noOptionsMessage={() => "سربرگ مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                          // onBlur={() => {
                          //   validation.handleBlur() // Trigger Formik's onBlur
                          //   // setSelectTouched(true) // Set the select as touched
                          // }}
                          />
                          {((validation.touched.correspondenceHeader ||
                            selectTouched) &&
                            !selectedGroup) ||
                            validation.errors.correspondenceHeader ? (
                            <FormFeedback type="invalid">
                              {validation.errors.correspondenceHeader ||
                                "لطفا یک گزینه را انتخاب کنید"}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="correspondenceEditor">
                            متن نامه <span className="requareForm">*</span>
                          </Label>
                          <Form method="post" id="correspondenceEditor">
                            <Editor
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                            />
                          </Form>
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
                            type="number"
                            className="form-control"
                            id="correspondenceNumber"
                            disabled
                            required
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.correspondenceNumber || ""}
                            invalid={
                              validation.touched.correspondenceNumber &&
                                validation.errors.correspondenceNumber
                                ? true
                                : false
                            }
                          />
                          {validation.touched.correspondenceNumber &&
                            validation.errors.correspondenceNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.correspondenceNumber}
                            </FormFeedback>
                          ) : null}
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
                            type="number"
                            className="form-control"
                            id="correspondenceNumber"
                            disabled
                            required
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.correspondenceNumber || ""}
                            invalid={
                              validation.touched.correspondenceNumber &&
                                validation.errors.correspondenceNumber
                                ? true
                                : false
                            }
                          />
                          {validation.touched.correspondenceNumber &&
                            validation.errors.correspondenceNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.correspondenceNumber}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button color="primary" type="submit">
                      Submit form
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default NewLetter
