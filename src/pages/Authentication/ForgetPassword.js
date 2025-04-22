import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const ForgetPasswordPage = props => {
  const token = localStorage.getItem("token");

  //meta title
  document.title = "تغییر رمز عبور - سامانه مکاتبات";

  const changePasswordFun = (values) => {
    // const formData = {
    //   "old_password": values.pass,
    //   "new_password": values.newpass
    // }
    // const headers = new Headers({
    //   Authorization: "Bearer " + token,
    //   accept: "application/json",
    //   "Content-Type": "application/json",
    // });
    // fetch(url, {
    //   headers: headers,
    //   method: 'PATCH',
    //   mode: 'cors',
    //   body: JSON.stringify(formData)
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       toastr.success("رمز عبور جدید با موفقیت ثبت شد، به صفحه ورود هدایت می شوید")
    //       toastr.options = {
    //         closeButton: true,
    //         progressBar: true,
    //         newestOnTop: true,
    //         positionClass: "toast-top-right",
    //       }
    //       window.setTimeout(() => {
    //         window.open("/login", "_self");
    //         return false;
    //       }, 3000)
    //     } else {
    //       toastr.error("مشکلی در بروزرسانی رمز عبور رخ داده است، مجدد امتحان کنید")
    //       toastr.options = {
    //         closeButton: true,
    //         progressBar: true,
    //         newestOnTop: true,
    //         positionClass: "toast-top-right",
    //       }
    //       window.setTimeout(() => {
    //         window.location.reload();
    //       }, 3000)
    //     }
    //   })
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      pass: '',
      newpass: '',
      confpass: '',
    },
    validationSchema: Yup.object({
      pass: Yup.string().required("لطفاٌ رمز عبور فعلی را وارد کنید").min(6, 'رمز عبور نمی تواند کمتر از 6 کاراکتر باشد'),
      newpass: Yup.string().required("لطفاٌ رمز عبور جدید را وارد کنید").min(6, 'رمز عبور نمی تواند کمتر از 6 کاراکتر باشد'),
      confpass: Yup.string().required("لطفاٌ تکرار رمز عبور جدید را وارد کنید").oneOf([Yup.ref('newpass'), null], 'تکرار رمزعبور با رمزعبور یکسان نیست')
    }),
    onSubmit: (values) => {
      changePasswordFun(values);
    }
  });

  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/dashboard" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4 mt-4">
                        <h5 className="text-white">تغییر رمز عبور </h5>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="profile-user-wid mb-2 mt-2">
                        {/* <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span> */}
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">رمز عبور فعلی:</Label>
                        <Input
                          name="pass"
                          className="form-control"
                          placeholder="رمز عبور فعلی را وارد کنید"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.pass || ""}
                          invalid={
                            validation.touched.pass && validation.errors.pass ? true : false
                          }
                        />
                        {validation.touched.pass && validation.errors.pass ? (
                          <FormFeedback type="invalid">{validation.errors.pass}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label"> رمز عبور جدید :</Label>
                        <Input
                          name="newpass"
                          className="form-control"
                          placeholder="رمز عبور جدید را وارد کنید"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.newpass || ""}
                          invalid={
                            validation.touched.newpass && validation.errors.newpass ? true : false
                          }
                        />
                        {validation.touched.newpass && validation.errors.newpass ? (
                          <FormFeedback type="invalid">{validation.errors.newpass}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <Label className="form-label"> تکرار رمز جدید :</Label>
                        <Input
                          name="confpass"
                          className="form-control"
                          placeholder="تکرار رمز عبور جدید را وارد کنید"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confpass || ""}
                          invalid={
                            validation.touched.confpass && validation.errors.confpass ? true : false
                          }
                        />
                        {validation.touched.confpass && validation.errors.confpass ? (
                          <FormFeedback type="invalid">{validation.errors.confpass}</FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3 ">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            ذخیره و بروزرسانی
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              {/* <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
