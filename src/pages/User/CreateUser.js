import React, { useState } from "react"
import {
  Col,
  Label,
  Button,
  Input,
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
//i18n
import i18n from "../../i18n"
import { useTranslation } from "react-i18next"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"
//api
import createUserApi from "../../api/admin/user/create"
import createUserSystemApi from "../../api/admin/userSystem/create"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
<<<<<<< HEAD
import { useFormik } from "formik"
=======
import { useFormik} from "formik"
>>>>>>> 231c31a47444066e64df1974930764289292c364

//meta title
document.title = "ثبت کاربر جدید - سامانه مکاتبات"

const CreateUser = () => {
  const { t } = useTranslation()
  //  variable
  const token = localStorage.getItem("token")
  const [userId, setUserId] = React.useState()
  const [loading, setLoading] = React.useState()
  const [activeTab, setactiveTab] = useState("1")

  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }
  // handle create Form Api
  const handleSubmitForm = async values => {
    const data = {
      respectfulTitle: values.respectfulTitle,
      name: values.name,
      lastName: values.lastName,
      mobile: values.mobile,
    }
    try {
      const response = await createUserApi(token, data)
      if (response.status == 200) {
        setUserId(response.data.id)
        toggle("2")
      }
      console.log("Response:", response)
    } catch (err) {
      console.error("Error:", err)
    }
    return
  }
  // handle create user system
  const handleSubmitUserSystemForm = async values => {
    const data = {
      userId,
      username: values.userName,
      password: values.password,
      userType: Number(1),
      side: values.side,
      respectfulSide: values.respectfulSide,
    }
    try {
      const response = await createUserSystemApi(token, data)
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
      mobile: "",
    },
    // تعریف ولیدیشن دستی
    validate: values => {
      const errors = {}
      const fieldNames = {
        respectfulTitle: "عنوان محترمانه",
        name: "نام",
        lastName: "نام خانوادگی",
        mobile: "شماره تلفن همراه",
      }
      // بررسی فیلدهای خالی
      Object.keys(fieldNames).forEach(key => {
        if (!values[key]) {
          errors[key] = `${fieldNames[key]} نمی‌تواند خالی باشد`
        }
      })

      return errors
    },
    onSubmit: values => {
      // اگر خطایی وجود نداشته باشد، فرم سابمیت می‌شود
      handleSubmitForm(values)
    },
  })

  // validation Formik and Yup //
  const validationUserSystem = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      password: "",
      side: "",
      respectfulSide: "",
    },
    validate: values => {
      const errors = {}
      const fieldNames = {
        userName: "نام کاربری",
        password: "رمز عبور",
        side: "سمت شغلی",
        respectfulSide: "سمت محترمانه شغلی",
      }
      Object.keys(fieldNames).forEach(key => {
        if (!values[key]) {
          errors[key] = `${fieldNames[key]} نمی‌تواند خالی باشد`
        }
      })
      return errors
    },
    onSubmit: values => {
      handleSubmitUserSystemForm(values)
    },
  })

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
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        // onClick={() => {
                        //   toggle("2")
                        // }}
                      >
                        مشخصات سیستمی
                      </NavLink>
                    </Nav>

                    <TabContent
                      activeTab={activeTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <form onSubmit={validation.handleSubmit}>
                          <Row>
                            <Col sm="12">
                              <Row>
                                <Col md={3} xl={3}>
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
                                      id="formrow-name-Input"
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
                                <Col md={3} xl={3}>
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
                                      id="formrow-lastName-Input"
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
                                  md={3}
                                  xl={3}
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
                                    <Input
                                      type="text"
                                      name="respectfulTitle"
                                      onChange={e => validation.handleChange(e)}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.respectfulTitle}
                                      className="form-control"
                                      id="formrow-respectfulTitle-Input"
                                      placeholder={
                                        " عنوان محترمانه را وارد کنید"
                                      }
                                      invalid={
                                        validation.touched.respectfulTitle &&
                                        validation.errors.respectfulTitle
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.respectfulTitle &&
                                    validation.errors.respectfulTitle ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.respectfulTitle}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={3} xl={3}>
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
                                      id="formrow-mobile-Input"
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
                              </Row>
                            </Col>
                          </Row>
                          <Row className="justify-content-end me-1 mt-2 ">
                            <Col className="col-auto px-0">
                              <Button type="submit" color="success">
                                {t("مرحله بعد")}
                              </Button>
                            </Col>
                          </Row>
                        </form>
                      </TabPane>
                      <TabPane tabId="2">
                        <form onSubmit={validationUserSystem.handleSubmit}>
                          <Row>
                            <Col sm="12">
                              <Row>
                                <Col md={3} xl={3}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">
                                      {t("نام کاربری")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="userName"
                                      onChange={e =>
                                        validationUserSystem.handleChange(e)
                                      }
                                      onBlur={validationUserSystem.handleBlur}
                                      value={
                                        validationUserSystem.values.userName
                                      }
                                      className="form-control"
                                      id="formrow-userName-Input"
                                      placeholder={"نام کاربری را وارد کنید"}
                                      invalid={
                                        validationUserSystem.touched.userName &&
                                        validationUserSystem.errors.userName
                                          ? true
                                          : false
                                      }
                                    />
                                    {validationUserSystem.touched.userName &&
                                    validationUserSystem.errors.userName ? (
                                      <FormFeedback type="invalid">
                                        {validationUserSystem.errors.userName}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={3} xl={3}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("رمز عبور")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="password"
                                      name="password"
                                      onChange={e =>
                                        validationUserSystem.handleChange(e)
                                      }
                                      onBlur={validationUserSystem.handleBlur}
                                      value={
                                        validationUserSystem.values.password
                                      }
                                      className="form-control"
                                      id="formrow-password-Input"
                                      placeholder={"رمز عبور را وارد کنید"}
                                      invalid={
                                        validationUserSystem.touched.password &&
                                        validationUserSystem.errors.password
                                          ? true
                                          : false
                                      }
                                    />
                                    {validationUserSystem.touched.password &&
                                    validationUserSystem.errors.password ? (
                                      <FormFeedback type="invalid">
                                        {validationUserSystem.errors.password}
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
                                    <Label htmlFor="title">
                                      {" "}
                                      سمت سغلی
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="side"
                                      onChange={e =>
                                        validationUserSystem.handleChange(e)
                                      }
                                      onBlur={validationUserSystem.handleBlur}
                                      value={validationUserSystem.values.side}
                                      className="form-control"
                                      id="formrow-side-Input"
                                      placeholder={" سمت شغلی را وارد کنید"}
                                      invalid={
                                        validationUserSystem.touched.side &&
                                        validationUserSystem.errors.side
                                          ? true
                                          : false
                                      }
                                    />
                                    {validationUserSystem.touched.side &&
                                    validationUserSystem.errors.side ? (
                                      <FormFeedback type="invalid">
                                        {validationUserSystem.errors.side}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={3} xl={3}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {t("سمت محترمانه شغلی")}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="respectfulSide"
                                      onChange={e =>
                                        validationUserSystem.handleChange(e)
                                      }
                                      onBlur={validationUserSystem.handleBlur}
                                      value={
                                        validationUserSystem.values
                                          .respectfulSide
                                      }
                                      className="form-control"
                                      id="formrow-respectfulSide-Input"
                                      placeholder={
                                        " سمت محترمانه شغل خود را وارد کنید"
                                      }
                                      invalid={
                                        validationUserSystem.touched
                                          .respectfulSide &&
                                        validationUserSystem.errors
                                          .respectfulSide
                                          ? true
                                          : false
                                      }
                                    />
                                    {validationUserSystem.touched
                                      .respectfulSide &&
                                    validationUserSystem.errors
                                      .respectfulSide ? (
                                      <FormFeedback type="invalid">
                                        {
                                          validationUserSystem.errors
                                            .respectfulSide
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="justify-content-end me-1 mt-2 ">
                            <Col className="col-auto px-0">
                              <Button type="submit" color="success">
                                {t("ثبت نهایی")}
                              </Button>
                            </Col>
                          </Row>
                        </form>
                      </TabPane>
                    </TabContent>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* container-fluid */}
      </div>
    </React.Fragment>
  )
}

export default CreateUser
