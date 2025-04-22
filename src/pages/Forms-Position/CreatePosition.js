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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

//meta title
document.title = "ثبت سِمت جدید - سامانه مکاتبات"

const CreatePosition = () => {
  const { t } = useTranslation()
  //  variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [title, setTitle] = React.useState()
  const [role, setRole] = React.useState(3)
  const [activity, setActivity] = React.useState(true)
  const [company, setCompany] = useState()
  const [activeTab, setactiveTab] = useState("1")

  const [formData, setFormData] = useState({
    title: "",
    salutation: "",
  })

  const [errors, setErrors] = useState({
    title: false,
    salutation: false,
  })

  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: false }) // پاک کردن خطا بعد از تغییر مقدار
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // اعتبارسنجی مقادیر
    if (!formData.title || !formData.salutation) {
      let newErrors = {}

      if (!formData.title) {
        newErrors.title = true
        toastr.error("عنوان سمت شغلی نمی‌تواند خالی باشد", "خطا!")
      }

      if (!formData.salutation) {
        newErrors.salutation = true
        toastr.error("عنوان محترمانه سمت شغلی نمی‌تواند خالی باشد", "خطا!")
      }

      setErrors(newErrors)
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
        },
      }
      const data = {
        title: formData.title,
        salutation: formData.salutation,
      }
      await axios
        .post(`http://localhost:3000/accounts/auth/position/`, data, config)
        .then(response => {
          if (response.status === 201) {
            toastr.success("اطلاعات با موفقیت ثبت شد")
            setFormData({
              name: "",
              family: "",
            })
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

  // USE EFFECT
  React.useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="چارت سازمانی" breadcrumbItem="ثبت سمت جدید" />
          <Row
            className={`${
              i18n.language === "fa" ? "rtlContent" : "ltrContent"
            }`}
          >
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">ثبت سمت جدید</CardTitle>
                  <p className="card-title-desc">
                    برای ثبت سمت جدید اطلاعات زیر را تکمیل کنید.
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
                          ایجاد سمت شغلی
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
                          تخصیص کاربر
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent
                      activeTab={activeTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <form onSubmit={handleSubmit}>
                          <Row>
                            <Col sm="12">
                              <Row>
                                <Col md={6} xl={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">
                                      {"عنوان "}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="title"
                                      value={formData.title}
                                      onChange={handleChange}
                                      className="form-control"
                                      id="formrow-firstname-Input"
                                      placeholder={"عنوانِ سمت را وارد کنید"}
                                      invalid={errors.title}
                                    />
                                    {errors.name && (
                                      <FormFeedback type="invalid">
                                        عنوان سمتِ شغلی نمی‌تواند خالی باشد
                                      </FormFeedback>
                                    )}
                                  </div>
                                </Col>
                                <Col md={6} xl={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-personaliCode-Input">
                                      {"عنوان محترمانه"}
                                      <span className="requareForm"> * </span>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="salutation"
                                      value={formData.salutation}
                                      onChange={handleChange}
                                      className="form-control"
                                      id="formrow-personaliCode-Input"
                                      placeholder={
                                        "عنوان محترمانه را وارد کنید"
                                      }
                                      invalid={errors.salutation}
                                    />
                                    {errors.salutation && (
                                      <FormFeedback type="invalid">
                                        عنوان محترمانه سمت شغلی نمی‌تواند خالی
                                        باشد
                                      </FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                              <Row className="justify-content-end me-1">
                                <Col className="col-auto px-0">
                                  <Button type="submit" color="success">
                                    {"ثبت"}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </form>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12"></Col>
                        </Row>
                        <Row className="justify-content-end me-1 ">
                          <Col className="col-auto px-0">
                            <Button type="submit" color="success">
                              {t("ثبت")}
                            </Button>
                          </Col>
                        </Row>
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

export default CreatePosition
