import React, { useState } from "react"
import axios from "axios"
import {
  Col,
  Label,
  Button,
  Input,
  FormGroup,
  FormFeedback,
  Card,
  CardBody,
  CardTitle,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"

import classnames from "classnames"

import logo from "../../assets/images/brands/avatar-temp.png"
import Select from "react-select"

//i18n
import i18n from "../../i18n"
import { useTranslation } from "react-i18next"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
//api
import createUserApi from "../../api/admin/user/create"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

//meta title
document.title = "ثبت کاربر جدید - سامانه مکاتبات"

const CreateUser = () => {
  const { t } = useTranslation()
  //  variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [gender, setGender] = React.useState()
  const [taahol, setTaahol] = React.useState()
  const [title, setTitle] = React.useState()
  const [role, setRole] = React.useState(3)
  const [activity, setActivity] = React.useState(true)
  const [isForeignUser, setIsForeignUser] = useState(false)
  const [company, setCompany] = useState()
  const [birthDate, setBirthDate] = React.useState({ format: "YYYY-MM-DD" })
  const [activeTab, setactiveTab] = useState("1")

  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }
  // handle create Form Api
  const handleSubmitForm = async values => {
    const {
      respectfulTitle,
      name,
      lastName,
      fatherName,
      nationalCode,
      dateOfBirth,
      email,
      mobile,
      education,
      address,
      gender,
      maritalStatus,
    } = values
    const data = {
      respectfulTitle: respectfulTitle.label,
      name: name,
      lastName: lastName,
      fatherName: fatherName || null,
      nationalCode: nationalCode || null,
      dateOfBirth: dateOfBirth || null,
      email: email || null,
      mobile: mobile || null,
      education: education || null,
      address: address || null,
      gender: gender.value,
      maritalStatus: maritalStatus.value,
    }
    try {
      const response = await createUserApi(token, data)
      if (response.status == 200) {
        toastr.success("اطلاعات کاربر جدید با موفقیت ثبت شد")
        window.setTimeout(() => {
          window.open("/users", "_self")
          return false
        }, 560)
      }
      console.log("Response:", response)
    } catch (err) {
      console.error("Error:", err)
    }
    return
  }
  // validation Formik and Yup //
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      respectfulTitle: "",
      name: "",
      lastName: "",
      fatherName: "",
      nationalCode: "",
      dateOfBirth: "",
      email: "",
      mobile: "",
      education: "",
      address: "",
      gender: "",
      maritalStatus: "",
    },
    onSubmit: values => {
      const fieldNames = {
        name: "نام",
        family: "نام خانوادگی",
        respectfulTitle: "عنوان محترمانه",
        gender: "جنسیت",
        maritalStatus: "وضعیت تاهل",
        mobile: "شماره تلفن همراه",
      }
      // فقط فیلدهایی که در fieldNames تعریف شده‌اند و مقدارشان خالی است
      const emptyFields = Object.keys(values).filter(
        key => fieldNames[key] && values[key] === ""
      )
      if (emptyFields.length > 0) {
        emptyFields.forEach(field => {
          const fieldName = fieldNames[field]
          toastr.error(`${fieldName} نمی تواند خالی باشد`)
        })
      } else {
        handleSubmitForm(values)
      }
    },
  })
  // handle birth Date //
  function handleBirthDate(date) {
    setBirthDate(date)
  }

  // handle Select Gender//
  function handleSelectGender(gender) {
    setGender(gender)
  }

  // handle select Taahol //
  function handleSelectTaahol(value) {
    setTaahol(value)
  }

  // handle activity
  function handleActivity(value) {
    setActivity(value)
  }

  // handle Select Company
  function handleSelectCompany(value) {
    setCompany(value)
  }

  // handle select title
  function handleSelectTitle(value) {
    setTitle(value)
  }

  // handle select role
  function handleSelectRole(value) {
    setRole(value)
  }

  // USE EFFECT
  React.useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="کاربران" breadcrumbItem="ثبت کاربر جدید" />
          <Row
            className={`${
              i18n.language === "fa" ? "rtlContent" : "ltrContent"
            }`}
          >
            <Col xl={12}>
              <form onSubmit={validation.handleSubmit}>
                <Card>
                  <CardBody>
                    <CardTitle className="h4">ثبت شخص جدید</CardTitle>
                    <p className="card-title-desc">
                      برای ثبت شخص جدید اطلاعات زیر را تکمیل کنید.
                    </p>
                    <Row>
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => {
                              toggle("1")
                            }}
                          >
                            مشخصات اصلی
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === "4",
                            })}
                            onClick={() => {
                              toggle("4")
                            }}
                          >
                            مشخصات بیشتر
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <TabContent
                        activeTab={activeTab}
                        className="p-3 text-muted"
                      >
                        <TabPane tabId="1">
                          <Row>
                            <Col sm="12">
                              <Row>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">
                                      {t("نام")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="name"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.name}
                                      className="form-control"
                                      id="formrow-firstname-Input"
                                      placeholder={"نام را وارد کنید"}
                                      invalid={
                                        validation.touched.name &&
                                        validation.errors.name
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.name &&
                                    validation.errors.name ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.name}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("نام خانوادگی")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="lastName"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.lastName}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={"نام خانوادگی را وارد کنید"}
                                      invalid={
                                        validation.touched.lastName &&
                                        validation.errors.lastName
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.lastName &&
                                    validation.errors.lastName ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.lastName}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col
                                  md={4}
                                  xl={4}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="title">
                                      {" "}
                                      عنوان محترمانه
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="title"
                                      name="respectfulTitle"
                                      value={title}
                                      onChange={newValue => {
                                        handleSelectTitle(newValue),
                                          validation.setFieldValue(
                                            "respectfulTitle",
                                            newValue
                                          )
                                      }}
                                      options={[
                                        { label: "خانم", value: "MRS" },
                                        { label: "آقا", value: "MR" },
                                        {
                                          label: "جناب آقای مهندس",
                                          value: "MR_ENG",
                                        },
                                        {
                                          label: "جناب آقای دکتر",
                                          value: "MR_DR",
                                        },
                                        { label: "جناب آقای", value: "SIR_MR" },
                                        {
                                          label: "سرکار خانم",
                                          value: "SIR_MRS",
                                        },
                                        {
                                          label: "سرکار خانم مهندس",
                                          value: "SIR_MRS_ENG",
                                        },
                                        {
                                          label: "سرکار خانم دکتر",
                                          value: "SIR_MRS_DR",
                                        },
                                      ]}
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
                                        "گزینه مورد نظر یافت نشد"
                                      }
                                      placeholder="عنوان محترمانه کاربر را انتخاب کنید"
                                      invalid={
                                        validation.touched.respectfulTitle &&
                                        validation.errors.respectfulTitle
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.respectfulTitle &&
                                    validation.errors.respectfulTitle ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.respectfulTitle}
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("نام پدر ")}
                                    </Label>
                                    <Input
                                      type="text"
                                      name="fatherName"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.fatherName}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={"نام پدر را وارد کنید"}
                                    />
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("کد ملی ")}
                                    </Label>
                                    <Input
                                      type="text"
                                      name="nationalCode"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.nationalCode}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={"کد ملی را وارد کنید"}
                                    />
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <FormGroup>
                                    <Label htmlFor="formrow-birthDate-Input">
                                      تاریخ تولد
                                    </Label>
                                    <div style={{ direction: "rtl" }}>
                                      <DatePicker
                                        inputClass="form-control" // تغییر کلاس برای هماهنگی با فیلد کد ملی
                                        name="dateOfBirth"
                                        value={birthDate}
                                        monthYearSeparator="/"
                                        onChange={newValue => {
                                          handleBirthDate(newValue),
                                            validation.setFieldValue(
                                              "dateOfBirth",
                                              newValue
                                            )
                                        }}
                                        format="YYYY-MM-DD"
                                        calendarPosition={"bottom"}
                                        calendar={persian}
                                        locale={persian_fa}
                                        containerStyle={{
                                          width: "100%",
                                        }}
                                        placeholder="تاریخ تولد را انتخاب کنید"
                                        invalid={
                                          validation.touched.dateOfBirth &&
                                          validation.errors.dateOfBirth
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.dateOfBirth &&
                                      validation.errors.dateOfBirth ? (
                                        <div className="text-danger mt-1 small">
                                          {validation.errors.dateOfBirth}
                                        </div>
                                      ) : null}
                                    </div>
                                  </FormGroup>
                                </Col>
                                <Col
                                  md={4}
                                  xl={4}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="gender">
                                      {" "}
                                      جنسیت
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="gender"
                                      name="gender"
                                      value={gender}
                                      onChange={newValue => {
                                        handleSelectGender(newValue),
                                          validation.setFieldValue(
                                            "gender",
                                            newValue
                                          )
                                      }}
                                      options={[
                                        { label: "مرد", value: 1 },
                                        { label: "زن", value: 2 },
                                      ]}
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
                                        "گزینه مورد نظر یافت نشد"
                                      }
                                      placeholder="جنسیت کاربر را انتخاب کنید"
                                      invalid={
                                        validation.touched.gender &&
                                        validation.errors.gender
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.gender &&
                                    validation.errors.gender ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.gender}
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("شماره تلفن همراه")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="number"
                                      name="mobile"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.mobile}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={
                                        "شماره تلفن همراه را وارد کنید"
                                      }
                                      invalid={
                                        validation.touched.mobile &&
                                        validation.errors.mobile
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.mobile &&
                                    validation.errors.mobile ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.mobile}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col
                                  md={4}
                                  xl={4}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="maritalStatus">
                                      {" "}
                                      وضعیت تاهل
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="maritalStatus"
                                      name="maritalStatus"
                                      value={taahol}
                                      onChange={newValue => {
                                        handleSelectTaahol(newValue),
                                          validation.setFieldValue(
                                            "maritalStatus",
                                            newValue
                                          )
                                      }}
                                      options={[
                                        { label: "مجرد", value: 1 },
                                        { label: "متاهل", value: 2 },
                                      ]}
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
                                        "گزینه مورد نظر یافت نشد"
                                      }
                                      placeholder="جنسیت کاربر را انتخاب کنید"
                                      invalid={
                                        validation.touched.maritalStatus &&
                                        validation.errors.maritalStatus
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.maritalStatus &&
                                    validation.errors.maritalStatus ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.maritalStatus}
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="4">
                          <Row>
                            <Col sm="12">
                              <form onSubmit={validation.handleSubmit}>
                                <Row>
                                  <Col md={6} xl={6}>
                                    <div className="mb-3">
                                      <Label htmlFor="formrow-firstname-Input">
                                        {t("تحصیلات")}
                                      </Label>
                                      <Input
                                        type="text"
                                        name="education"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.education}
                                        className="form-control"
                                        id="formrow-firstname-Input"
                                        placeholder={
                                          "تحصیلات کاربر را انتخاب کنید"
                                        }
                                        invalid={
                                          validation.touched.education &&
                                          validation.errors.education
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.education &&
                                      validation.errors.education ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.education}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={6} xl={6}>
                                    <div className="mb-3">
                                      <Label htmlFor="formrow-personaliCode-Input">
                                        {t("شماره تلفن")}
                                      </Label>
                                      <Input
                                        type="number"
                                        name="phoneNumber"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.phoneNumber}
                                        className="form-control"
                                        id="formrow-personaliCode-Input"
                                        placeholder={
                                          "شماره تلفن کاربر را وارد کنید"
                                        }
                                        invalid={
                                          validation.touched.phoneNumber &&
                                          validation.errors.phoneNumber
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.phoneNumber &&
                                      validation.errors.phoneNumber ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.phoneNumber}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={12} xl={12}>
                                    <div className="mb-3">
                                      <Label htmlFor="formrow-personaliCode-Input">
                                        {t("آدرس")}
                                      </Label>
                                      <Input
                                        type="text"
                                        name="address"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.address}
                                        Row="3"
                                        className="form-control"
                                        id="formrow-personaliCode-Input"
                                        placeholder={
                                          "آدرس محل سکونت کاربر را وارد کنید"
                                        }
                                        invalid={
                                          validation.touched.address &&
                                          validation.errors.address
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.address &&
                                      validation.errors.address ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.address}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                              </form>
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </Row>
                  </CardBody>
                </Card>
                <Row className="justify-content-end me-1 ">
                  <Col className="col-auto px-0">
                    <Button type="submit" color="success">
                      {t("ثبت کاربر")}
                    </Button>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </Container>
        {/* container-fluid */}
      </div>
    </React.Fragment>
  )
}

export default CreateUser
