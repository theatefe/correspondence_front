import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Form,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
// toast
import toastr from "toastr"
import "toastr/build/toastr.min.css"
// Api
import createSerialNumberApi from "../../api/admin/letterSerial/create"

//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"

const LetterSerialForm = () => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token")
  const [title, setTitle] = useState("")
  const [startingNumber, setStartingNumber] = useState(0)
  const [incrementValue, setIncrementValue] = useState(0)

  //meta title
  document.title = "ساخت سریال نامه - مکاتبات"

  // handle submit
  const handleSubmit = async e => {
    e.preventDefault()
    // Perform validation
    if (title.length < 3) {
      toastr.error(t("لطفا عنوان را وارد کنید"))
      return
    }
    if (startingNumber == 0) {
      toastr.error(t("لطفا عدد شروع را وارد کنید"))
      return
    }
    if (incrementValue == 0) {
      toastr.error(t("لطفا عدد رشد را وارد کنید"))
      return
    }
    if (isNaN(startingNumber) || isNaN(incrementValue)) {
      toastr.error(t("لطفا فقط عدد وارد کنید"))
      return
    }
    // Handle form submission logic here (e.g., API call)
    const result = await createSerialNumberApi(
      token,
      title,
      startingNumber,
      incrementValue
    )
    if (result.status === 200) {
      // Show success alert
      toastr.success(t("شماره سریال نامه با موفقیت ثبت شد"))
      window.setTimeout(() => {
        window.open("/letterSerialView", "_self")
        return false
      }, 340)
    } else {
      // Show error alert
      toastr.error(t("خطا در سرور! مجدد امتحان کنید"))
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="شماره سریال نامه"
            breadcrumbItem="ساخت شماره سریال"
          />
          <Row
            className={`${
              i18n.language === "fa" ? "rtlContent" : "ltrContent"
            }`}
          >
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="font-size-22 fw-bold mb-4">
                    {t("ساخت سریال جدید")}
                  </CardTitle>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={4} xl={3}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-firstname-Input">
                            {t("عنوان")}
                            <span className="requareForm"> *</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control "
                            id="formrow-firstname-Input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                          />
                        </div>
                      </Col>

                      <Col md={4} xl={3}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-personaliCode-Input">
                            {t("عدد شروع")}
                            <span className="requareForm"> *</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="formrow-personaliCode-Input"
                            value={startingNumber}
                            onChange={e => setStartingNumber(e.target.value)}
                          />
                        </div>
                      </Col>

                      <Col md={4} xl={3}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-requestDate-Input">
                            {t("عدد رشد")}
                            <span className="requareForm"> *</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="formrow-requestDate-Input"
                            value={incrementValue}
                            onChange={e => setIncrementValue(e.target.value)}
                          />
                        </div>
                      </Col>
                    </Row>

                    <div className="text-end mt-4">
                      <button type="submit" className="btn btn-success w-md">
                        {t("ذخیره")}
                      </button>
                    </div>
                  </Form>
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

export default withTranslation()(LetterSerialForm)
