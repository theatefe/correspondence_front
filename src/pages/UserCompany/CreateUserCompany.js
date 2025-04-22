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
import usersListApi from "../../api/admin/user/list"
import companiesListApi from "../../api/admin/company/list"
import createUserCompanyApi from "../../api/admin/userCompany/create"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

//meta title
document.title = "معرفی نماینده شرکت - سامانه مکاتبات"

const CreateUserCompany = () => {
  const { t } = useTranslation()
  //  variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [user, setUser] = React.useState()
  const [company, setCompany] = React.useState()
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])

  // handle selected user
  function handleSelectUser(value) {
    setUser(value)
  }
  // handle selected company
  function handleSelectCompany(value) {
    setCompany(value)
  }

  // handle create Form Api
  const handleSubmitForm = async values => {
    setLoading(true)
    const { user, company, side, respectfulSide } = values
    const data = {
      userId: user.value,
      companyId: company.value,
      side: side,
      respectfulSide: respectfulSide,
    }
    try {
      const response = await createUserCompanyApi(token, data)
      if (response.status == 200) {
        setLoading(false)
        toastr.success("اطلاعات نماینده شرکت با موفقیت ثبت شد")
        window.setTimeout(() => {
          window.open("/list-user-company", "_self")
          return false
        }, 560)
      }
    } catch (err) {
      console.error("Error:", err)
    }
    return
  }
  // validation Formik and Yup //
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: "",
      company: "",
      side: "",
      respectfulSide: "",
    },
    onSubmit: values => {
      const fieldNames = {
        user: "شخص",
        company: "شرکت",
        side: "سمت شغلی",
        respectfulSide: "سمت شغلی محترمانه",
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

  // get users list
  const getAllUsers = async () => {
    const users = await usersListApi(token)
    const list = users.data.map(item => {
      return {
        value: item.id,
        label: item.name + " " + item.lastName,
      }
    })
    setUsers(list)
  }

  // get companies list
  const getAllCompanies = async () => {
    const companies = await companiesListApi(token)
    const list = companies.data.map(item => {
      return {
        value: item.id,
        label: item.name,
      }
    })
    setCompanies(list)
  }

  // USE EFFECT
  React.useEffect(() => {
    setLoading(true)
    getAllUsers()
    getAllCompanies()
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
                      <TabContent className="p-3 text-muted">
                        <TabPane>
                          <Row>
                            <Col sm="12">
                              <Row>
                                <Col
                                  md={6}
                                  xl={6}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="title">
                                      {" "}
                                      انتخاب شخص
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="title"
                                      name="user"
                                      value={user}
                                      onChange={newValue => {
                                        handleSelectUser(newValue),
                                          validation.setFieldValue(
                                            "user",
                                            newValue
                                          )
                                      }}
                                      options={users}
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
                                        validation.touched.user &&
                                        validation.errors.user
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.user &&
                                    validation.errors.user ? (
                                      <div className="text-danger mt-1 small">
                                        {validation.errors.user}
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col
                                  md={6}
                                  xl={6}
                                  className="mb-3 mb-md-0 zIndex2"
                                >
                                  <div
                                    className="text-start"
                                    style={{ zIndex: "9999" }}
                                  >
                                    <Label htmlFor="title">
                                      {" "}
                                      انتخاب شرکت
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Select
                                      id="title"
                                      name="company"
                                      value={company}
                                      onChange={newValue => {
                                        handleSelectCompany(newValue),
                                          validation.setFieldValue(
                                            "company",
                                            newValue
                                          )
                                      }}
                                      options={companies}
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
                              </Row>
                              <Row className="mt-3">
                                <Col md={6} xl={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">
                                      {t("سمت")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="side"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.side}
                                      className="form-control"
                                      id="formrow-firstname-Input"
                                      placeholder={
                                        "سمت نماینده شرکت را وارد کنید"
                                      }
                                      invalid={
                                        validation.touched.side &&
                                        validation.errors.side
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.side &&
                                    validation.errors.side ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.side}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={6} xl={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">
                                      {t("سمت محترمانه")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="respectfulSide"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.respectfulSide}
                                      className="form-control"
                                      id="formrow-firstname-Input"
                                      placeholder={
                                        "سمت محترمانه نماینده شرکت را وارد کنید"
                                      }
                                      invalid={
                                        validation.touched.respectfulSide &&
                                        validation.errors.respectfulSide
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.respectfulSide &&
                                    validation.errors.respectfulSide ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.respectfulSide}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
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
                      {t("ثبت نماینده شرکت")}
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

export default CreateUserCompany
