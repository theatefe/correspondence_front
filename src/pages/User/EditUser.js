import React, { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Col,
  Label,
  Button,
  Input,
  FormFeedback,
  Card,
  CardBody,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"

import classnames from "classnames"
// api
import updateUserApi from "../../api/admin/user/update"
import findUserApi from "../../api/admin/user/findOne"

//i18n
import i18n from "../../i18n"
import { useTranslation } from "react-i18next"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

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
  const [activeTab, setactiveTab] = useState("1")

  // handle update Form Api
  const handleSubmitForm = async values => {
    console.log(values)
    setLoading(true)
    try {
      const body = {
        respectfulTitle: values.respectfulTitle,
        name: values.name,
        lastName: values.lastName,
        mobile: values.mobile,
        id,
      }
      const response = await updateUserApi(token, body)
      if (response.status === 200) {
        setLoading(false)
        toastr.success("اطلاعات کاربر با موفقیت ویرایش شد")
        window.setTimeout(() => {
          window.open("/users", "_self")
          return false
        }, 560)
      } else {
        setLoading(false)
        toastr.error("خطا در ویرایش اطلاعات کاربر")
        return false
        // Handle error
      }
    } catch (error) {
      setLoading(false)
      toastr.error("خطا در ویرایش اطلاعات کاربر")
      // Handle error
      console.error(error)
    }
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
  // Get User Info Api //
  const getUserInfoApi = async () => {
    const user = await findUserApi(token, id)
    validation.setValues({
      respectfulTitle: user.data.respectfulTitle,
      name: user.data.name,
      lastName: user.data.lastName,
      mobile: user.data.mobile,
    })
  }
  // USE EFFECT
  React.useEffect(() => {
    //meta title
    document.title = "ویرایش کاربر - سامانه مکاتبات"
    setLoading(true)
    getUserInfoApi()
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
                          >
                            مشخصات اصلی
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
                                      id="formrow-personaliCode-Input"
                                      placeholder={"نام خانوادگی را وارد کنید"}
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
