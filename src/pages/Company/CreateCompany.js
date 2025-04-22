import React, { useState } from "react"
import axios from "axios"
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

// api
import createCompanyApi from "../../api/admin/company/create"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
// Validation Formik and yup
import * as Yup from "yup"
import { useFormik, ErrorMessage } from "formik"

//meta title
document.title = "ثبت شرکت جدید - سامانه مکاتبات"

const CreateCompany = () => {
  const { t } = useTranslation()
  //  variable
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [type, setType] = React.useState(false)
  const [showSubmitBtn, setShowSubmitBtn] = React.useState(true)

  // handle create Form Api
  const handleSubmitForm = async values => {
    setShowSubmitBtn(false)
    const { name, description, email, phoneNumber, address } = values
    const data = {
      name,
      description,
      email,
      phoneNumber,
      address,
    }
    try {
      const response = await createCompanyApi(token, data)
      if (response.status == 200) {
        toastr.success("اطلاعات شرکت با موفقیت ثبت شد")
        window.setTimeout(() => {
          window.open("/list-company", "_self")
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
      name: "",
      description: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
    onSubmit: values => {
      const fieldNames = {
        name: "نام شرکت",
        description: "اطلاعات شرکت",
        email: "ایمیل شرکت",
        phoneNumber: "شماره تماس",
        address: "آدرس",
      }
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

  // USE EFFECT
  React.useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="شرکت‌ها" breadcrumbItem="ثبت شرکت جدید" />
          <Row
            className={`${
              i18n.language === "fa" ? "rtlContent" : "ltrContent"
            }`}
          >
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="font-size-22 fw-bold mb-4">
                    {t("ساخت شرکت جدید")}
                  </CardTitle>
                  <p className="card-title-desc">
                    برای ثبت شرکت جدید اطلاعات زیر را تکمیل کنید.
                  </p>
                  <Row>
                    <Col sm="12">
                      <form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col md={3} xl={3}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-firstname-Input">
                                {t("نام شرکت")}
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
                                placeholder={"نام شرکت را وارد کنید"}
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
                              <Label htmlFor="formrow-firstname-Input">
                                {t("توضیحات شرکت")}
                                <span className="requareForm"> * </span>
                              </Label>
                              <Input
                                type="text"
                                name="description"
                                onChange={e => validation.handleChange(e)}
                                onBlur={validation.handleBlur}
                                value={validation.values.description}
                                className="form-control"
                                id="formrow-firstname-Input"
                                placeholder={"توضیحات شرکت را وارد کنید"}
                                invalid={
                                  validation.touched.description &&
                                  validation.errors.description
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.description &&
                              validation.errors.description ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.description}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3} xl={3}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-firstname-Input">
                                {t("ایمیل شرکت")}
                                <span className="requareForm"> * </span>
                              </Label>
                              <Input
                                type="text"
                                name="email"
                                onChange={e => validation.handleChange(e)}
                                onBlur={validation.handleBlur}
                                value={validation.values.email}
                                className="form-control"
                                id="formrow-firstname-Input"
                                placeholder={"ایمیل شرکت را وارد کنید"}
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
                          <Col md={3} xl={3}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-personaliCode-Input">
                                {t("شماره تماس شرکت")}
                                <span className="requareForm"> * </span>
                              </Label>
                              <Input
                                type="text"
                                name="phoneNumber"
                                onChange={e => validation.handleChange(e)}
                                onBlur={validation.handleBlur}
                                value={validation.values.phoneNumber}
                                className="form-control"
                                id="formrow-firstname-Input"
                                placeholder={"شماره تماس شرکت را وارد کنید"}
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
                        </Row>
                        <Row>
                          <Col md={12} xl={12}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-personaliCode-Input">
                                {t("آدرس")}
                                <span className="requareForm"> * </span>
                              </Label>
                              <Input
                                type="text"
                                name="address"
                                onChange={e => validation.handleChange(e)}
                                onBlur={validation.handleBlur}
                                value={validation.values.address}
                                className="form-control"
                                id="formrow-firstname-Input"
                                placeholder={"آدرس شرکت را وارد کنید"}
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
                        <Row className="justify-content-end me-1 ">
                          <Col className="col-auto px-0">
                            <Button
                              type="submit"
                              color="success"
                              disabled={!showSubmitBtn}
                            >
                              {t("ذخیره")}
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    </Col>
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

export default CreateCompany
