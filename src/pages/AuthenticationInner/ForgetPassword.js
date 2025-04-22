import React from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Button,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap"

import { Link } from "react-router-dom"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import chengePassword from "../../assets/images/chengePassword.png"
import logo from "../../assets/images/logo.svg"
import logoExir from "../../assets/images/brands/logoExir.png"

const ForgetPasswordPage = () => {
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: values => {
      console.log(values)
    },
  })
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center mx-0">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-soft bg-primary">
                  <Row>
                    <Col className="col-7 align-self-center">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">تغییر رمز ورود</h5>
                        {/* <p>Sign in to continue to Skote.</p> */}
                      </div>
                    </Col>
                    <Col className="col-5 align-self-center">
                      <img src={chengePassword} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoExir}
                            alt=""
                            className=" "
                            height="40"
                          />
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
                        <h5 className="text-dark">
                          برای تغییر رمز ورود خود لطفا به واحد IT مراجعه
                          فرمایید.
                        </h5>
                        {/* <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null} */}
                      </div>
                      {/* <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row> */}
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  بازگشت به{" "}
                  <Link
                    to="/login"
                    className="font-weight-medium text-primary"
                  >
                    ورود
                  </Link>{" "}
                </p>
                <p>
                  {new Date().getFullYear()} Copyright © ExirPooyan v1.0.1 2023
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ForgetPasswordPage
