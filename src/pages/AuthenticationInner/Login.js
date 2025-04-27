import React, { useState } from "react"
// Redux
import { Link } from "react-router-dom"
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
} from "reactstrap"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

// api
import LoginApi from "../../api/user/Login"

// import images
import profile from "../../assets/images/profile-img2.png"
import logo from "../../assets/images/talie-logo.png"

const Login = () => {
  const [show, setShow] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [textAlert, setTextAlert] = useState(false)

  //meta title
  document.title = "سامانه مکاتبات"

  //login
  const login = async values => {
    const { username, password } = values
    const data = { username, password, fireBaseToken: "string" }

    try {
      const result = await LoginApi(data)
      if (result.status === 200) {
        const info = result.data
        const token = info.user.token
        const type = info.userType
        const userinfo = {
          id: info.user.id,
          name: info.user.name,
          lastName: info.user.lastName,
          signature: info?.signature?.mediaUrl,
          position: info.side,
          respectfulTitle: info.user.respectfulTitle,
          respectfulSide: info.respectfulSide,
        }
        localStorage.setItem("token", token)
        localStorage.setItem("type", type)
        localStorage.setItem("userInfo", JSON.stringify(userinfo))
        setTextAlert("ورود شما با موفقیت انجام شد")
        setSuccessAlert(true)
        setTimeout(() => {
          setSuccessAlert(false)
          window.open("/dashboard", "_self")
        }, 3000)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTextAlert("خطا ! مجدد امتحان کنید")
      } else {
        setTextAlert("خطا ! مجدد امتحان کنید")
      }
      setErrorAlert(true)
      setTimeout(() => {
        setErrorAlert(false)
      }, 3000)
    }
  }
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("نام کاربری خود را وارد کنید"),
      password: Yup.string().required("رمز عبور خود را وارد کنید "),
    }),
    onSubmit: values => {
      login(values)
    },
  })

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center mx-0">
            <Col md={8} lg={6} xl={5}>
              <Alert
                color={errorAlert ? "danger" : "success"}
                role="alert"
                isOpen={errorAlert ? errorAlert : successAlert}
                fade={true}
                toggle={() => {
                  errorAlert ? setErrorAlert(false) : setSuccessAlert(false)
                }}
              >
                {textAlert}
              </Alert>

              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col align-self-center mt-3">
                      <div className="text-primary py-4 ps-4">
                        <h5> سامانه مکاتبات </h5>
                      </div>
                    </Col>
                    <Col className="col align-self-center">
                      <img src={profile} alt="" className="img-fluid " />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="auth-logo">
                    <Link to="/" className="auth-logo-dark">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle border border bg-light ">
                          <img src={logo} alt="" className=" " height="30" />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">نام کاربری</Label>
                        <Input
                          name="username"
                          className="form-control"
                          placeholder="نام کاربری را وارد کنید"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
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

                      <div className="mb-3">
                        <Label className="form-label">رمز</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            type={show ? "text" : "password"}
                            placeholder="رمز را وارد کنید"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <button
                            onClick={() => setShow(!show)}
                            className="btn btn-light "
                            type="button"
                            id="password-addon"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          مرا به خاطر بسپار
                        </label>
                      </div>
                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          ورود
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <Link to="/pages-forgot-pwd" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> رمز خود را فراموش
                          کرده‌اید؟
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p style={{ direction: "ltr", fontFamily: "sans-serif" }}>
                  {new Date().getFullYear()} Copyright © ExirPooyan v1.0.1
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login
