// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import moment from "moment-jalaali"
//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Container,
  Button,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap"

// api
import usersListApi from "../../api/admin/user/list"
import userCompaniesListApi from "../../api/admin/userCompany/list"

import { Link } from "react-router-dom"
import toastr from "toastr"

function ListUserCompanies() {
  const token = localStorage.getItem("token")
  const [usersList, setUsersList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  // modal state
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [modal, setModal] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // modal toggle
  const toggleModal = userId => {
    setSelectedUserId(userId)
    setModal(!modal)
    setPassword()
    setConfirmPassword()
  }
  // get users list *****************************
  const getUserCompaniesList = async () => {
    const response = await userCompaniesListApi(token)
    const usersCompanies = response.data.map(item => {
      return {
        id: item.id,
        user: item.user.name + " " + item.user.lastName,
        company: item.company.name,
        side: item.side,
        respectfulSide: item.respectfulSide,
        createdAt: item.createdAt,
      }
    })
    setUsersList(usersCompanies)
  }
  // handle select role *************************
  function handleSelectRole(value) {
    setRole(value)
  }
  // handle change active ***********************
  const handleChangeActive = async id => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      await axios
        .post(
          `http://localhost:3000/accounts/auth/toggle-active-status/${id}/`,
          {},
          { headers }
        )
        .then(response => {
          if (response.status == 200) {
            toastr.success("وضعیت کاربر با موفقیت به روز رسانی شد")
            getUserList()
          }
          console.log("Response:", response)
        })
    } catch (err) {
      console.error("Error:", err)
    }
  }
  // handle reset password **********************
  const handleResetPassword = async () => {
    try {
      if (password.length < 4) {
        toastr.error("رمز عبور نمی تواند کمتر از 4 کاراکتر باشد.")
      } else if (confirmPassword.length < 4) {
        toastr.error("تایید رمز عبور نمی تواند کمتر از 4 کاراکتر باشد.")
      } else if (password !== confirmPassword) {
        toastr.error("رمز عبور و تایید رمزعبور یکسان نیست")
      } else {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
        const data = {
          id: selectedUserId,
          new_password: password,
        }
        await axios
          .put(
            `http://localhost:3000/accounts/auth/api/password_reset/`,
            data,
            { headers }
          )
          .then(response => {
            if (response.status == 200) {
              toastr.success("بازنشانی رمزعبور با موفقیت انجام شد")
              getUserList()
            }
            toggleModal()
            setPassword()
            setConfirmPassword()
            setSelectedUserId(null)
          })
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }
  // set columns ********************************
  const columns = useMemo(() => [
    {
      Header: "کاربر",
      accessor: "user",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: "شرکت",
      accessor: "company",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: "سمت شغلی",
      accessor: "side",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: "عنوان محترمانه سمت شغلی",
      accessor: "respectfulSide",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: "تاریخ ثبت",
      accessor: "createdAt",
      flag: "true",
      Cell: ({ cell }) => (
        <div style={{ direction: "ltr" }} className="lopp">
          {cell.value}
        </div>
      ),
    },
    {
      Header: "عملیات",
      accessor: "id",
      flag: "true",
      Cell: ({ cell }) => (
        <div
          style={{ display: "flex", justifyContent: "center" }}
          className="list-unstyled hstack gap-1 mb-0"
        >
          <li>
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-${"ویرایش"}`}>
                  <strong>{"ویرایش "}</strong>
                </Tooltip>
              }
            >
              <Link
                to={`/edit-user/${cell.value}`}
                className="btn btn-soft-info"
              >
                <i
                  className="mdi mdi-account-edit md-18"
                  id="viewtooltip"
                  style={{ fontSize: "16px" }}
                />
              </Link>
            </OverlayTrigger>
          </li>
        </div>
      ),
    },
  ])
  // set data ************************************
  const data = usersList.map(item => {
    const jalaliCreatd = item.createdAt
    const jalaliCreatedDate = moment(jalaliCreatd).format(
      "jYYYY/jMM/jDD HH:mm:ss"
    )
    return {
      id: item.id,
      user: item.user,
      company: item.company,
      side: item.side,
      respectfulSide: item.respectfulSide,
      createdAt: jalaliCreatedDate,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    getUserCompaniesList()
    setLoading(false)
  }, [])

  //meta title
  document.title = "کاربران - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title=" کاربران" breadcrumbItem="لیست کاربران" />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-3">
                      <Row className="justify-content-between mx-0">
                        <Col className="col-12 col-sm-auto px-0 order-last order-sm-first mt-2 mt-sm-0">
                          <Row className="mx-0 justify-content-center justify-content-sm-start">
                            <Col className="col-12 col-md-auto ps-0">
                              <div className="text-sm-end ps-0">
                                <Link to="/create-user">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="text-nowrap w-100"
                                  >
                                    ثبت کاربر جدید
                                    <i className="dripicons-document-edit font-size-14 align-middle ms-2 "></i>
                                  </Button>
                                </Link>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Row>
                    <TableContainer
                      columns={columns}
                      data={data}
                      isGlobalFilter={true}
                      isAddOptions={false}
                      customPageSize={20}
                      className="custom-header-css table-striped "
                      enableRowSelection={true}
                      mokatebatTableBtn={true}
                      simpleSearchBox={true}
                      // isJobListGlobalFilter={true}
                    />
                  </div>
                </div>
                {/* reset password modal start */}
                <Modal isOpen={modal} toggle={() => toggleModal(null)} centered>
                  <ModalHeader toggle={() => toggleModal(null)}>
                    تغییر رمزعبور
                  </ModalHeader>
                  <ModalBody>
                    <Form>
                      <FormGroup>
                        <Label for="newPassword">رمزعبور جدید</Label>
                        <Input
                          type="password"
                          id="newPassword"
                          placeholder="رمزعبور جدید را وارد کنید"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="confirmPassword">تأیید رمزعبور</Label>
                        <Input
                          type="password"
                          id="confirmPassword"
                          placeholder="رمزعبور را مجدداً وارد کنید"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                        />
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={() => toggleModal(null)}>
                      بستن
                    </Button>
                    <Button color="primary" onClick={handleResetPassword}>
                      تغییر رمزعبور
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* reset password modal end */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  ) : (
    <>
      <React.Fragment>
        <div className="page-content loader-icon">
          <Container fluid>
            <div className="text-center mt-5" dir="ltr">
              <Spinner
                color="primary"
                style={{
                  height: "3rem",
                  width: "3rem",
                }}
              >
                Loading...
              </Spinner>
            </div>
          </Container>
        </div>
      </React.Fragment>
    </>
  )
}
ListUserCompanies.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default ListUserCompanies
