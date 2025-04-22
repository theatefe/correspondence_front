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
import Select from "react-select"
// toast
import toastr from "toastr"
import "toastr/build/toastr.min.css"
// mention
import { Mention } from "primereact/mention"
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import Breadcrumbs from "../../components/Common/Breadcrumb"
//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"
//Api
import listSerialNumberApi from "../../api/admin/letterSerial/list"
import createPatternNumberApi from "../../api/admin/letterTemplate/create"

const LetterTemplateForm = () => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token")
  const [title, setTitle] = useState("")
  const [selectedSerial, setSelectedSerial] = useState(null)
  const [patternType, setPatternType] = useState("new")
  const [templateString, setTemplateString] = useState()
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState()
  const [optionGroup, setOptionGroup] = useState([])
  const [deafultTemplates, setDeafultTemplates] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDeafultTemplate, setSelectedDeafultTemplate] = useState(null)

  function handleSelectSerial(selectedOption) {
    setSelectedSerial(selectedOption)
  }
  function handleSelectType(selectedOption) {
    setSelectedType(selectedOption)
    getDeafultTemplate(selectedOption.value)
  }
  function handleSelectDeafultTemplate(selectedOption) {
    setSelectedDeafultTemplate(selectedOption)
  }

  const users = [
    { value: 1, nickname: "سریال" },
    { id: 2, nickname: "yyyy" },
    { id: 3, nickname: "yy" },
    { id: 4, nickname: "mm-yy" },
    { id: 5, nickname: "dd-mm-yy" },
  ]

  const onSearch = event => {
    // فیلتر کردن کاربران بر اساس متن وارد شده
    const query = event.query.toLowerCase()
    const filteredUsers = users.filter(user =>
      user.nickname.toLowerCase().includes(query)
    )
    setSuggestions(filteredUsers)
  }

  const itemTemplate = suggestion => {
    return (
      <div>
        <span>{suggestion.nickname}</span>
      </div>
    )
  }

  //meta title
  document.title = "ساخت الگو نامه - مکاتبات"

  // handle submit
  const handleSubmit = async e => {
    e.preventDefault()
    // Perform validation
    if (title.length < 3) {
      toastr.error(t(" عنوان را وارد کنید"))
      return
    }
    if (selectedSerial == null) {
      toastr.error(t(" مخزن سریال را انتخاب کنید"))
      return
    }
    if (
      (patternType == "new" && value.length < 4) ||
      (patternType == "new" && value.length == 0)
    ) {
      toastr.error(t("الگوی شماره‌گذاری را  به درستی وارد کنید"))
      return
    }
    const data = {
      name: title,
      pattern_structure:
        patternType == "new" ? value : selectedDeafultTemplate.label,
      serial: selectedSerial.value,
    }
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    const result = await createPatternNumberApi(
      token,
      title,
      selectedSerial.value,
      value,
      null
    )
    if (result.status == 200) {
      // Show success alert
      toastr.success(t("الگو شماره گذاری نامه با موفقیت ثبت شد"))
      window.setTimeout(() => {
        window.open("/letterTemplateView", "_self")
        return false
      }, 340)
    } else {
      // Show error alert
      toastr.error(t("خطا در سرور! مجدد امتحان کنید"))
    }
  }

  // handle get serials numbers
  const getSerialList = async () => {
    const list = await listSerialNumberApi(token)
    const result = list.data.map(item => {
      return {
        value: item.id,
        label: item.title,
      }
    })
    setOptionGroup(result)
  }
  // get default template
  const getDeafultTemplate = item => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/patterns/search/${item}/`, config)
      .then(res => res.json())
      .then(data => {
        const result = data.map((item, index) => {
          return {
            value: index + 1,
            label: item.pattern_structure,
          }
        })
        setDeafultTemplates(result)
      })
  }

  React.useEffect(() => {
    setLoading(true)
    getSerialList()
    getDeafultTemplate()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="الگوهای شماره‌گذاری"
            breadcrumbItem="ساخت الگو شماره‌گذاری"
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
                    {t("ساخت الگو جدید")}
                  </CardTitle>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={4} xl={4}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-firstname-Input">
                            {t("عنوان")}
                            <span className="requareForm"> *</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="formrow-firstname-Input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                          />
                        </div>
                      </Col>

                      <Col md={4} xl={4}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-personaliCode-Input">
                            {t("مخزن شماره سریال")}
                            <span className="requareForm"> *</span>
                          </Label>
                          <Select
                            value={selectedSerial}
                            onChange={handleSelectSerial}
                            options={optionGroup}
                            className="select2-selection"
                            placeholder={t("انتخاب کنید")}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4} xl={4}>
                        <div className="mb-3 mt-2">
                          <Label htmlFor="patternType">{t("نوع الگو")}</Label>
                          <span className="requareForm"> *</span>
                          <div>
                            <div className="d-inline-block  mr-0">
                              <Input
                                type="radio"
                                name="patternType"
                                id="newPattern"
                                value="new"
                                checked={patternType === "new"}
                                onChange={() => setPatternType("new")}
                              />
                              <Label htmlFor="newPattern" className="ms-2">
                                {t("ایجاد الگوی جدید")}
                              </Label>
                            </div>
                            <div className="d-inline-block mx-2">
                              <Input
                                type="radio"
                                name="patternType"
                                id="defaultPattern"
                                value="default"
                                checked={patternType === "default"}
                                onChange={() => setPatternType("default")}
                              />
                              <Label
                                htmlFor="defaultPattern"
                                className="ml-1 ms-2"
                              >
                                {t("انتخاب الگوهای پیش‌فرض")}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <div style={{ zIndex: "9999" }}>
                        {patternType == "new" ? (
                          <>
                            <Col md={4}>
                              <Label> {"الگوی شماره‌گذاری"} </Label>
                              <span className="requareForm"> *</span>
                              <Mention
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                suggestions={suggestions}
                                onSearch={onSearch}
                                field="nickname"
                                placeholder="Enter @ to mention"
                                rows={1}
                                cols={125}
                                itemTemplate={itemTemplate}
                                className="mention-input"
                              />
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label htmlFor="formrow-personaliCode-Input">
                                  {t("نوع نامه")}
                                  <span className="requareForm"> *</span>
                                </Label>
                                <Select
                                  value={selectedType}
                                  onChange={handleSelectType}
                                  options={[
                                    { label: "داخلی", value: "د" },
                                    { label: "صادره", value: "ص" },
                                    { label: "وارده", value: "و" },
                                  ]}
                                  className="select2-selection"
                                  placeholder={t("انتخاب کنید")}
                                />
                              </div>
                            </Col>
                            <Col md={4}>
                              <Label>{t("الگوهای پیش فرض")}</Label>
                              <span className="requareForm"> *</span>
                              <Select
                                value={selectedDeafultTemplate}
                                onChange={handleSelectDeafultTemplate}
                                options={deafultTemplates}
                                className="select2-selection"
                                placeholder={t("انتخاب کنید")}
                              />
                            </Col>
                          </>
                        )}
                      </div>
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
  ) : (
    <></>
  )
}

export default withTranslation()(LetterTemplateForm)
