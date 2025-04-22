import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Spinner,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { useSelector, useDispatch } from "react-redux"
import withRouter from "components/Common/withRouter"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import avatar from "../../assets/images/users/avatar.png"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"

//toastr
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const UserProfile = () => {
  //meta title
  document.title = "پروفایل کاربری - سامانه مکاتبات"
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = React.useState()
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [idx, setidx] = useState(1)


  // CHANGE PASSWORD
  const changePasswordFun = (values) => {
    // const formData = {
    //   "old_password": values.currentPassword,
    //   "new_password": values.newPassword,
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
    //       if (response.status == 400) {
    //         toastr.error("رمز عبور فعلی صحیح نمی باشد، مجدد امتحان کنید")
    //         toastr.options = {
    //           closeButton: true,
    //           progressBar: true,
    //           newestOnTop: true,
    //           positionClass: "toast-top-right",
    //         }
    //       } else {
    //         toastr.error("خطا ! مجدد تلاش کنید.")
    //         toastr.options = {
    //           closeButton: true,
    //           progressBar: true,
    //           newestOnTop: true,
    //           positionClass: "toast-top-right",
    //         }
    //       }
    //     }
    //   })
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1300)
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      currentPassword: '',
      newPassword: '',
      confrimNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("لطفا رمز عبور فعلی خود را وارد کنید").min(6, ' رمز عبور شما نمیتواند کمتر از 6 کاراکتر باشد'),
      newPassword: Yup.string().required(" لطفا رمز عبور جدید  را وارد کنید").min(6, ' رمز عبور شما نمیتواند کمتر از 6 کاراکتر باشد'),
      confrimNewPassword: Yup.string().required("لطفا تکرار رمز عبور را وارد کنید").oneOf([Yup.ref('newPassword'), null], 'تکرار رمزعبور با رمزعبور یکسان نیست'),
    }),
    onSubmit: values => {
      changePasswordFun(values);
      dispatch(editProfile(values))
    },
  })

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="داشبورد" breadcrumbItem="پروفایل کاربری" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail "
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center ms-2">
                      <div className="text-muted">
                        <h5>{userInfo.fullName}</h5>
                        <p className="mb-1">  عنوان شغلی :  {userInfo.post} </p>
                        <p className="mb-1">  شماره پرسنلی: {userInfo.personalId} </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">تغییر رمز ورود</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <div className="mb-3">
                  <Label className="form-label">رمز عبور فعلی</Label>
                  <div className="input-group auth-pass-inputgroup">
                    <Input
                      name="currentPassword"
                      value={validation.values.currentPassword || ""}
                      type={show ? "text" : "password"}
                      placeholder="رمز عبور فعلی را وارد کنید"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.currentPassword &&
                          validation.errors.currentPassword
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
                    {validation.touched.currentPassword && validation.errors.currentPassword ? (
                      <FormFeedback type="invalid">
                        {validation.errors.currentPassword}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>

                <div className="mb-3">
                  <Label className="form-label">رمز جدید</Label>
                  <div className="input-group auth-pass-inputgroup">
                    <Input
                      name="newPassword"
                      value={validation.values.newPassword || ""}
                      type={show ? "text" : "password"}
                      placeholder="رمز جدید خود را وارد کنید"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.newPassword &&
                          validation.errors.newPassword
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
                    {validation.touched.newPassword && validation.errors.newPassword ? (
                      <FormFeedback type="invalid">
                        {validation.errors.newPassword}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>

                <div className="mb-3">
                  <Label className="form-label">تکرار رمز جدید</Label>
                  <div className="input-group auth-pass-inputgroup">
                    <Input
                      name="confrimNewPassword"
                      value={validation.values.confrimNewPassword || ""}
                      type={show ? "text" : "password"}
                      placeholder="رمز جدید خود را تکرار کنید"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.confrimNewPassword &&
                          validation.errors.confrimNewPassword
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
                    {validation.touched.confrimNewPassword && validation.errors.confrimNewPassword ? (
                      <FormFeedback type="invalid">
                        {validation.errors.confrimNewPassword}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button type="submit" color="success">
                    تغییر رمز عبور <i className="mdi mdi-shield-key fs-6"></i>
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  ) : (<>
    <React.Fragment>
      <div className="page-content loader-icon">
        <Container fluid>
          <div className="text-center mt-5" dir="ltr">
            <Spinner color="primary" style={{
              height: '3rem',
              width: '3rem'
            }}>
              Loading...
            </Spinner>
          </div>
        </Container>
      </div>
    </React.Fragment></>)
}

export default withRouter(UserProfile)
