import React, { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import jalaali from "jalaali-js"
import {
  Col,
  Label,
  Button,
  Form,
  Input,
  FormGroup,
  FormFeedback,
  InputGroup,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledCollapse,
} from "reactstrap"

import classnames from "classnames"

import logo from "../../assets/images/brands/avatar-temp.png"
import Select from "react-select"

//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

//gregorian calendar & locale
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

const EditUser = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  //  variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [userInfo, setUserInfo] = React.useState({})
  const [userList, setUserList] = React.useState([])
  const [gender, setGender] = React.useState()
  const [taahol, setTaahol] = React.useState()
  const [title, setTitle] = React.useState({})
  const [role, setRole] = React.useState(3)
  const [variety, setVariety] = React.useState()
  const [activity, setActivity] = React.useState(true)
  const [education, setEducation] = React.useState()
  const [isForeignUser, setIsForeignUser] = useState(false)
  const [company, setCompany] = useState()
  const [type, setType] = React.useState(1)
  const [birthDate, setBirthDate] = React.useState({ format: "YYYY-MM-DD" })
  const [activeTab, setactiveTab] = useState("1")

  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  // handle select title
  function handleSelectTitle(value) {
    setTitle(value)
  }
  // Get User Info Api //
  const getUserInfoApi = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/accounts/auth/get-detail-user/${id}/`, config)
      .then(res => res.json())
      .then(data => {
        const info = data
        setUserInfo({
          name: info.first_name,
          family: info.last_name,
          fatherName: info.fatherName,
          nationalCode: info.nationalCode,
          birthDate: info.birthDate,
          birthPlace: info.placeOfBirth,
          mobileNumber: info.mobileNumber,
          personnelID: info.personnelID,
          email: info.email,
          username: info.username,
          is_foreign: info.is_foreign,
          company: info.company,
          companyId: info.company_id,
          position: info.position,
          salutation: info.salutation,
          education: info.education,
          address: info.address,
          phoneNumber: info.phoneNumber,
        })
        setBirthDate(info.birthDate)
        setIsForeignUser(info.is_foreign)
        setEducation(info.education)
        setGender(info.gender)
        setTaahol(info.marital_status)
        setTitle(info.title)
        setActivity({
          label: info.is_active ? "فعال" : "غیرفعال",
          value: info.is_active,
        })
        setRole(
          info.adminFlag
            ? { label: "مدیر سیستم", value: 1 }
            : info.secretariatFlag
            ? { label: "دبیرخانه", value: 2 }
            : { label: "کاربر", value: 3 }
        )
      })
  }
  // Get Users Api //
  const getUsersApi = () => {
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
        // const users = result.map(item => {
        //   var post =
        //     item.profiles[0].post != null ? item.profiles[0].post : "کاربر"
        //   return {
        //     value: item.id,
        //     label: item.first_name + " " + item.last_name + " (" + post + ")",
        //   }
        // })
        // setUserList(users)
      })
  }
  const optionGroupReciver = userList.map(item => {
    return {
      label: item.label,
      value: item.value,
    }
  })
  // handle create Form Api
  const handleSubmitForm = async values => {
    const {
      name,
      family,
      fatherName,
      nationalCode,
      birthPlace,
      gender,
      mobileNumber,
      personnelID,
      email,
      username,
      company,
      position,
      salutation,
      address,
      phoneNumber,
    } = values
    const data = {
      username: username,
      first_name: name,
      last_name: family,
      email: email,
      profile: {
        gender: gender.value,
        marital_status: taahol.value,
        title: title.value || null,
        fatherName: fatherName,
        birthDate: birthDate || null,
        placeOfBirth: birthPlace || null,
        personnelID: personnelID,
        nationalCode: nationalCode,
        certificateNo: null,
        skillType: null,
        education: education.value || null,
        jobTitle: null,
        address: address,
        phoneNumber: phoneNumber || null,
        mobileNumber: mobileNumber,
        post: null,
        edmsFlag: false,
        adminFlag: role == 1 ? true : false,
        secretariatFlag: role == 2 ? true : false,
        is_foreign: isForeignUser,
        position: position || null,
        salutation: salutation || null,
        role: null,
        company: company || userInfo.companyId,
      },
    }
    try {
      await axios
        .put(
          `http://localhost:3000/accounts/auth/update-profile/${id}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(response => {
          if (response.status == 200) {
            toastr.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد")
            window.setTimeout(() => {
              window.open("/users", "_self")
              return false
            }, 560)
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
    } catch (err) {
      toastr.error(err.response.data.message, "خطا!")
    }
  }
  // validation Formik and Yup //
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userInfo?.name || "",
      family: userInfo?.family || "",
      fatherName: userInfo?.fatherName || "",
      nationalCode: userInfo?.nationalCode || "",
      birthDate: userInfo?.birthDate ? new Date(userInfo.birthDate) : "",
      birthPlace: userInfo?.birthPlace || "",
      gender: gender ? gender : "",
      maritalStatus: taahol ? taahol : "",
      mobileNumber: userInfo?.mobileNumber || "",
      personnelID: userInfo?.personnelID || "",
      email: userInfo?.email || "",
      username: userInfo?.username || "",
      password: "",
      repeatPassword: "",
      activity: activity ? activity : "",
      is_foreign: userInfo?.is_foreign || "",
      company: userInfo?.companyId || "",
      position: userInfo?.position || "",
      salutation: userInfo?.salutation || "",
      education: userInfo?.education || "",
      address: userInfo?.address || "",
      phoneNumber: userInfo?.phoneNumber || "",
    },
    onSubmit: values => {
      const fieldNames = {
        name: "نام",
        family: "نام خانوادگی",
        nationalCode: "کد ملی",
        gender: "جنسیت",
        maritalStatus: "وضعیت تاهل",
        mobileNumber: "شماره تلفن همراه ",
        personnelID: "شماره پرسنلی",
        email: "ایمیل",
        username: "نام کاربری",
        activity: "وضعیت فعالیت کاربر",
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
    const gDate = new Date(date)

    // گرفتن سال، ماه و روز
    const year = gDate.getFullYear()
    const month = String(gDate.getMonth() + 1).padStart(2, "0") // ماه‌ها از 0 شروع می‌شوند، بنابراین +1
    const day = String(gDate.getDate()).padStart(2, "0") // اضافه کردن صفر برای تک‌رقمی‌ها

    // فرمت کردن تاریخ به yyyy-mm-dd
    const formattedGregorianDate = `${year}-${month}-${day}`

    setBirthDate(formattedGregorianDate) // ذخیره در state
  }

  // handle Select Gender//
  function handleSelectGender(gender) {
    setGender(gender)
  }

  // handle select Taahol //
  function handleSelectTaahol(value) {
    setTaahol(value)
  }

  // handle select education //
  function handleSelectEducation(value) {
    setEducation(value)
  }

  // handle activity
  function handleActivity(value) {
    setActivity(value)
  }

  // handle Select Company
  function handleSelectCompany(value) {
    setCompany(value)
  }

  // handle select role
  function handleSelectRole(value) {
    setRole(value)
  }

  // USE EFFECT
  React.useEffect(() => {
    //meta title
    document.title = "ویرایش کاربر - سامانه مکاتبات"
    setLoading(true)
    getUserInfoApi()
    getUsersApi()
    setLoading(false)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="کاربران" breadcrumbItem="ویرایش کاربر" />
          <Row
            className={`${
              i18n.language === "fa" ? "rtlContent" : "ltrContent"
            }`}
          >
            <Col xl={12}>
              <form onSubmit={validation.handleSubmit}>
                <h3 className="mb-3">ویرایش کاربر</h3>
                <Card>
                  <CardBody>
                    {/* <CardTitle className="h4">ویرایش کاربر </CardTitle> */}
                    <p className="card-title-desc">
                      برای ویرایش کاربر اطلاعات زیر را به‌روزرسانی کنید.
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
                              active: activeTab === "2",
                            })}
                            onClick={() => {
                              toggle("2")
                            }}
                          >
                            حساب کاربری
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === "3",
                            })}
                            onClick={() => {
                              toggle("3")
                            }}
                          >
                            کاربر خارج از سازمان
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
                                      name="family"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.family}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={"نام خانوادگی را وارد کنید"}
                                      invalid={
                                        validation.touched.family &&
                                        validation.errors.family
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.family &&
                                    validation.errors.family ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.family}
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
                                      name="maritalStatus"
                                      value={title}
                                      onChange={newValue => {
                                        handleSelectTitle(newValue),
                                          validation.setFieldValue(
                                            "title",
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
                                        validation.touched.title &&
                                        validation.errors.title
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.title &&
                                    validation.errors.title ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.title}
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
                                      invalid={
                                        validation.touched.fatherName &&
                                        validation.errors.fatherName
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.fatherName &&
                                    validation.errors.fatherName ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.fatherName}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("کد ملی ")}
                                      <span className="requareForm"> * </span>
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
                                      invalid={
                                        validation.touched.nationalCode &&
                                        validation.errors.nationalCode
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.nationalCode &&
                                    validation.errors.nationalCode ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.nationalCode}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={4} xl={4}>
                                  <FormGroup>
                                    <Label htmlFor="formrow-birthDate-Input">
                                      تاریخ تولد
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <div style={{ direction: "rtl" }}>
                                      <DatePicker
                                        inputClass="form-control" // تغییر کلاس برای هماهنگی با فیلد کد ملی
                                        name="birthDate"
                                        value={birthDate}
                                        monthYearSeparator="/"
                                        onChange={newValue => {
                                          handleBirthDate(newValue),
                                            validation.setFieldValue(
                                              "birthDate",
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
                                          validation.touched.birthDate &&
                                          validation.errors.birthDate
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.birthDate &&
                                      validation.errors.birthDate ? (
                                        <div className="text-danger mt-1 small">
                                          {validation.errors.birthDate}
                                        </div>
                                      ) : null}
                                    </div>
                                  </FormGroup>
                                </Col>
                                <Col md={4} xl={4}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("محل تولد")}
                                    </Label>
                                    <Input
                                      type="text"
                                      name="birthPlace"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.birthPlace}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={"محل تولد را وارد کنید"}
                                      invalid={
                                        validation.touched.birthPlace &&
                                        validation.errors.birthPlace
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.birthPlace &&
                                    validation.errors.birthPlace ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.birthPlace}
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
                                        { label: "مرد", value: "MALE" },
                                        { label: "زن", value: "FEMALE" },
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
                                      name="mobileNumber"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.mobileNumber}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={
                                        "شماره تلفن همراه را وارد کنید"
                                      }
                                      invalid={
                                        validation.touched.mobileNumber &&
                                        validation.errors.mobileNumber
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.mobileNumber &&
                                    validation.errors.mobileNumber ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.mobileNumber}
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
                                        { label: "مجرد", value: "SINGLE" },
                                        { label: "متاهل", value: "MARRIED" },
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
                                <Col
                                  md={4}
                                  xl={4}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="variety">
                                      {" "}
                                      نوع کاربری
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="role"
                                      name="role"
                                      value={role}
                                      onChange={newValue => {
                                        handleSelectRole(newValue),
                                          validation.setFieldValue(
                                            "role",
                                            newValue
                                          )
                                      }}
                                      options={[
                                        { label: "مدیر سیستم", value: 1 },
                                        { label: "دبیرخانه", value: 2 },
                                        { label: "کاربر", value: 3 },
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
                                      placeholder="توع کاربری را انتخاب کنید"
                                      invalid={
                                        validation.touched.role &&
                                        validation.errors.role
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.role &&
                                    validation.errors.role ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.role}
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="2">
                          <Row>
                            <Col sm="12">
                              <form onSubmit={validation.handleSubmit}>
                                <Row>
                                  <Col md={3} xl={3}>
                                    <div className="mb-3">
                                      <Label htmlFor="personalCode">
                                        {t("کد پرسنلی")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        name="personnelID"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.personnelID}
                                        className="form-control"
                                        id="personalCode"
                                        placeholder={
                                          "کد پرسنلی کاربر را وارد کنید"
                                        }
                                        invalid={
                                          validation.touched.personnelID &&
                                          validation.errors.personnelID
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.personnelID &&
                                      validation.errors.personnelID ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.personnelID}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={3} xl={3}>
                                    <div className="mb-3">
                                      <Label htmlFor="email">
                                        {t("ایمیل")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Input
                                        type="email"
                                        name="email"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.email}
                                        className="form-control"
                                        id="email"
                                        placeholder={"ایمیل کاربر را وارد کنید"}
                                        invalid={
                                          validation.touched.email &&
                                          validation.errors.email
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.email &&
                                      validation.errors.email ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.email}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col
                                    md={3}
                                    xl={3}
                                    className="mb-3 mb-md-0 zIndex2"
                                  >
                                    <div
                                      className="text-start"
                                      style={{ zIndex: "9999" }}
                                    >
                                      <Label htmlFor="variety">
                                        {t("وضعیت کاربر")}
                                      </Label>
                                      <Select
                                        id="activity"
                                        name="activity"
                                        value={activity}
                                        onChange={newValue => {
                                          handleActivity(newValue),
                                            validation.setFieldValue(
                                              "activity",
                                              newValue
                                            )
                                        }}
                                        options={[
                                          { label: "فعال", value: true },
                                          { label: "غیرفعال", value: false },
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
                                        placeholder="وضعیت کاربر را انتخاب کنید"
                                        invalid={
                                          validation.touched.activity &&
                                          validation.errors.activity
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.activity &&
                                      validation.errors.activity ? (
                                        <div className="text-danger mt-1 small">
                                          {validation.errors.activity}
                                        </div>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={3} xl={3}>
                                    <div className="mb-3">
                                      <Label htmlFor="username">
                                        {t("نام کاربری")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        name="username"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.username}
                                        className="form-control"
                                        id="username"
                                        placeholder={
                                          "نام کاربری کاربر را وارد کنید"
                                        }
                                        invalid={
                                          validation.touched.username &&
                                          validation.errors.username
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.username &&
                                      validation.errors.username ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.username}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                              </form>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="3">
                          <Row>
                            <Col sm="12">
                              <form onSubmit={validation.handleSubmit}>
                                <Row>
                                  <Col md={12} xl={12}>
                                    <div className="mt-1 mb-3">
                                      <Label htmlFor="formrow-personaliCode-Input">
                                        {t("کاربر خارج از سازمان")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <FormGroup check inline>
                                        <Input
                                          type="checkbox"
                                          checked={isForeignUser}
                                          onChange={e =>
                                            setIsForeignUser(e.target.checked)
                                          }
                                        />
                                        <Label check></Label>
                                      </FormGroup>
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
                                      <Label htmlFor="variety">
                                        {"شرکت"}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Select
                                        id="variety"
                                        name="company"
                                        value={company}
                                        onChange={newValue => {
                                          handleSelectCompany(newValue),
                                            validation.setFieldValue(
                                              "company",
                                              newValue
                                            )
                                        }}
                                        options={[
                                          {
                                            label: "اورانوس",
                                            value: "Exir",
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
                                        placeholder="شرکت را انتخاب کنید"
                                        isDisabled={!isForeignUser}
                                        invalid={
                                          validation.touched.company &&
                                          validation.errors.company
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.company &&
                                      validation.errors.company ? (
                                        <div className="text-danger mt-1 small">
                                          {validation.errors.company}
                                        </div>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={4} xl={4}>
                                    <div className="mb-3">
                                      <Label htmlFor="position">
                                        {t("سمت شخص")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        name="position"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.position}
                                        className="form-control"
                                        id="position"
                                        placeholder={
                                          "سمت شغلی کاربر را انتخاب کنید"
                                        }
                                        disabled={!isForeignUser}
                                        invalid={
                                          validation.touched.position &&
                                          validation.errors.position
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.position &&
                                      validation.errors.position ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.position}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={4} xl={4}>
                                    <div className="mb-3">
                                      <Label htmlFor="saldition">
                                        {t("سمت محترمانه")}
                                        <span className="requareForm"> * </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        name="salutation"
                                        onChange={e =>
                                          validation.handleChange(e)
                                        }
                                        onBlur={validation.handleBlur}
                                        value={validation.values.salutation}
                                        className="form-control"
                                        id="saldition"
                                        placeholder={
                                          "سمت محترمانه کاربر را وارد کنید"
                                        }
                                        disabled={!isForeignUser}
                                        invalid={
                                          validation.touched.salutation &&
                                          validation.errors.salutation
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.salutation &&
                                      validation.errors.salutation ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.salutation}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                              </form>
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
                                      <Label htmlFor="education">
                                        {t("تحصیلات")}
                                      </Label>
                                      <Select
                                        id="education"
                                        name="education"
                                        value={education}
                                        onChange={newValue => {
                                          handleSelectEducation(newValue),
                                            validation.setFieldValue(
                                              "education",
                                              newValue
                                            )
                                        }}
                                        options={[
                                          {
                                            label: "زیردیپلم",
                                            value: "Below Diploma",
                                          },
                                          { label: "دیپلم", value: "Diploma" },
                                          {
                                            label: "کاردانی",
                                            value: "Associates",
                                          },
                                          {
                                            label: "کارشناسی",
                                            value: "Bachelors",
                                          },
                                          { label: "ارشد", value: "Masters" },
                                          {
                                            label: "دکترا",
                                            value: "Doctorate",
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
                                        placeholder="تحصیلات را انتخاب کنید"
                                        invalid={
                                          validation.touched.education &&
                                          validation.errors.education
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.touched.education &&
                                      validation.errors.education ? (
                                        <div className="text-danger mt-1 small">
                                          {validation.errors.education}
                                        </div>
                                      ) : null}
                                    </div>
                                  </Col>
                                  <Col md={6} xl={6}>
                                    <div className="mb-3">
                                      <Label htmlFor="number">
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
                                        id="number"
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
                                      <Label htmlFor="address">
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
                                        id="address"
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
                      {t("به‌روزرسانی")}
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

export default EditUser
