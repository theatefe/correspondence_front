// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
  desc,
  asc,
} from "react-table"

import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

//gregorian calendar & locale
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"

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
  Form,
  FormGroup,
  Container,
  Label,
  Input,
  Button,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Select from "react-select"
import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

import { Type } from "../JobPages/JobList/JobListCol"

import logo from "../../assets/images/brands/avatar-temp.png"

function LetterCartabl() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [inboxList, setInboxList] = React.useState([])
  const [userInfo, setUserInfo] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [receiver, setReceiver] = React.useState()
  const [userList, setUserList] = React.useState([])
  //search input
  const [sender, setSender] = React.useState(null)
  const [title, setTitle] = React.useState(null)
  const [content, setContent] = React.useState(null)
  const [status, setStatus] = React.useState(null)

  const [fromDate, setFromDate] = useState({ format: "YYYY-MM-DD" })
  const [toDate, setToDate] = useState({ format: "YYYY-MM-DD" })

  // ************ get users ***************
  const getUsers = () => {
    // const config = {
    //   headers: {
    //     Authorization: "Bearer " + token,
    //     accept: "application/json",
    //   },
    // }
    // fetch(`http://localhost:3000/messanger/get-all-user/`, config)
    //   .then(res => res.json())
    //   .then(data => {
    //     const result = data
    //     const users = result.map(item => {
    //       return {
    //         value: item.id,
    //         label: item.first_name + " " + item.last_name,
    //       }
    //     })
    //     setUserList(users)
    //   })
  }
  // get user info ************************
  const getUserInfo = () => {
    // const config = {
    //   headers: {
    //     Authorization: "Bearer " + token,
    //     accept: "application/json",
    //   },
    // }
    // fetch(`http://localhost:3000/messanger/get-login-user/`, config)
    //   .then(res => res.json())
    //   .then(result => {
    //     const data = result[1]
    //     setUserInfo(data.id)
    //   })
  }
  const optionGroupReciver = userList.map(item => {
    return {
      label: item.label,
      value: item.value,
    }
  })
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )
  const handleDeleteApplyJob = () => {
    if (apply && apply.id) {
      dispatch(OnDeleteApplyJob(apply.id))
      setDeleteModal(false)
    }
  }
  // handle sender **********
  function handleReciver(sender) {
    setSender(sender)
  }
  // handle search ***********
  const handleSearch = () => {
    // const startDate = fromDate
    //   ? new DateObject(fromDate).convert(gregorian, gregorian_en).format()
    //   : null
    // const endDate = toDate
    //   ? new DateObject(toDate).convert(gregorian, gregorian_en).format()
    //   : null
    // const headers = new Headers({
    //   Authorization: "Bearer " + token,
    //   accept: "application/json",
    //   "Content-Type": "application/json",
    // })
    // const url = `http://localhost:3000/messanger/search-message/`
    // const formData = {
    //   body: content || null,
    //   title: title || null,
    //   sender: sender ? sender.value : null,
    //   seen: status ? status.value : null,
    //   startDate: startDate,
    //   endDate: endDate,
    // }
    // fetch(url, {
    //   headers: headers,
    //   method: "POST",
    //   mode: "cors",
    //   body: JSON.stringify(formData),
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //     const messages = data.map(item => {
    //       var dateTime = item.createDate
    //       var sendDate = dateTime.slice(0, 10)
    //       var sendTime = dateTime.slice(11, 19)
    //       var sender = item.sender__first_name + " " + item.sender__last_name
    //       var title =
    //         item.conversation__title !== null
    //           ? item.conversation__title
    //           : "پیام پیش نویس"
    //       return {
    //         id: item.conversation_id,
    //         sender: sender,
    //         reciver:
    //           item.conversation__receiver__first_name +
    //           " " +
    //           item.conversation__receiver__last_name,
    //         title: title.substr(0, 17) + "...",
    //         content: item.body.substr(0, 23) + "...",
    //         unseenCount: item.seen,
    //         createDate: sendTime + " | " + sendDate,
    //       }
    //     })
    //     setInboxList(messages)
    //   })
  }
  // get inbox list ***********
  const getInboxList = () => {
    // const url = `http://localhost:3000/messanger/search-message/`
    // const headers = new Headers({
    //   Authorization: "Bearer " + token,
    //   accept: "application/json",
    //   "Content-Type": "application/json",
    // })
    // const formData = {
    //   body: null,
    //   title: null,
    //   sender: null,
    //   seen: null,
    //   startDate: null,
    //   endDate: null,
    // }
    // fetch(url, {
    //   headers: headers,
    //   method: "POST",
    //   mode: "cors",
    //   body: JSON.stringify(formData),
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     const messages = data.map(item => {
    //       var dateTime = item.createDate
    //       var sendDate = dateTime.slice(0, 10)
    //       var sendTime = dateTime.slice(11, 19)
    //       var sender = item.sender__first_name + " " + item.sender__last_name
    //       var title =
    //         item.conversation__title !== null
    //           ? item.conversation__title
    //           : "پیام پیش نویس"
    //       return {
    //         id: item.conversation_id,
    //         sender: sender,
    //         reciver:
    //           item.conversation__receiver__first_name +
    //           " " +
    //           item.conversation__receiver__last_name,
    //         title: title.substr(0, 17) + "...",
    //         content: item.body.substr(0, 23) + "...",
    //         unseenCount: item.seen,
    //         createDate: sendTime + " | " + sendDate,
    //       }
    //     })
    //     setInboxList(messages)
    //   })
  }

  // columns *********************
  const columns = useMemo(
    () => [
      {
        Header: "فرستنده",
        accessor: "sender",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "گیرنده",
        accessor: "reciver",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "عنوان مکالمه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "متن پیام",
        accessor: "content",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      // {
      //   Header: "وضعیت",
      //   accessor: "type",
      //   flag: "true",

      //   Cell: cell => {
      //     return (
      //       <div style={{ textAlign: "center" }}>
      //         {" "}
      //         <Type {...cell} />
      //       </div>
      //     )
      //   },
      // },
      {
        Header: "تاریخ ارسال",
        accessor: "startDate",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
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
                  <Tooltip id={`tooltip-${"نمایش"}`}>
                    <strong>{"نمایش"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to={`/view-messages/${cell.value}`}
                  className="btn btn-soft-primary"
                >
                  <i
                    className="mdi mdi-eye-outline md-18"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li>
          </div>
        ),
      },
    ],
    [selectedRow]
  )
  const data = inboxList.map(item => {
    return {
      id: item.id,
      sender: item.sender,
      reciver: item.reciver,
      title: item.title,
      content: item.content,
      type: item.unseenCount == 1 ? "جدید" : "خوانده شده",
      startDate: item.createDate,
    }
  })
  // handle from date ************
  function handleFromDate(date) {
    //const item = new DateObject(date).convert(gregorian, gregorian_en).format();
    setFromDate(date)
  }
  // handle to date ************
  function handleToDate(date) {
    //const item = new DateObject(date).convert(gregorian, gregorian_en).format();
    setToDate(date)
  }
  // handle clear ****************
  const handleClear = () => {
    setSender(null)
    setTitle("")
    setContent("")
    setFromDate(null)
    setToDate(null)
    setStatus(null)
    getInboxList()
  }

  React.useEffect(() => {
    setLoading(true)
    getUserInfo()
    getUsers()
    setTimeout(() => {
      getInboxList()
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "کارتابل نامه‌ها -مکاتبات"

  return !loading ? (
    <div className="page-content">
      <ReferralModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ArchiveModal
        show={archiveModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setArchiveModal(false)}
      />
      <div className="container-fluid">
        <Breadcrumbs title="نامه ها" breadcrumbItem="کارتابل" />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row className="mb-3  ms-1 border-bottom">
                  <h5> فیلتر گزارشات</h5>
                </Row>
                <Row className="mb-2">
                  <Form>
                    <Row className="justify-content-between mx-1">
                      <Col md={2}>
                        <FormGroup>
                          <Label>فرستنده</Label>
                          <Select
                            id="reciver"
                            name="reciver"
                            value={sender}
                            isMulti={false}
                            onChange={newValue => handleReciver(newValue)}
                            options={optionGroupReciver.map(option => ({
                              label: option.label,
                              value: option.value,
                              imageSrc: option.imageSrc, // Provide the image source for each option
                            }))}
                            defaultValue={null}
                            styles={{
                              menu: provided => ({
                                ...provided,
                                backgroundColor: "#fff",
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                ":hover": {
                                  backgroundColor: "#eff2f7", // Change to your desired hover background color
                                  cursor: "pointer", // Change the cursor to a pointer
                                },
                                backgroundColor: state.isSelected
                                  ? "#BFC2C6"
                                  : provided.backgroundColor,
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                            }}
                            className="select2-selection text-start zIndex2"
                            noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                            placeholder="از لیست زیر انتخاب کنید"
                            getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
                            getOptionValue={option => option.label}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>عنوان مکالمه</Label>
                          <Input
                            placeholder="قسمتی از عنوان مکالمه را جستجو کنید"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>متن پیام</Label>
                          <Input
                            placeholder="قسمتی از متن پیام را جستجو کنید"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>وضعیت</Label>
                          <Select
                            id="reciver"
                            name="reciver"
                            value={status}
                            isMulti={false}
                            onChange={newValue => setStatus(newValue)}
                            options={[
                              { label: "جدید", value: 1 },
                              { label: "خوانده شده", value: 2 },
                            ]}
                            defaultValue={null}
                            styles={{
                              menu: provided => ({
                                ...provided,
                                backgroundColor: "#fff",
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                ":hover": {
                                  backgroundColor: "#eff2f7", // Change to your desired hover background color
                                  cursor: "pointer", // Change the cursor to a pointer
                                },
                                backgroundColor: state.isSelected
                                  ? "#BFC2C6"
                                  : provided.backgroundColor,
                                color: "var(--bs-body-color)",
                                textAlign: "right,",
                              }),
                            }}
                            className="select2-selection text-start zIndex2"
                            noOptionsMessage={() => "وضعیت مورد نظر یافت نشد"}
                            placeholder="وضعیت مکالمه را انتخاب کنید"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>از تاریخ</Label>
                          <div style={{ direction: "rtl" }}>
                            <DatePicker
                              inputClass="custom-input"
                              value={fromDate}
                              monthYearSeparator="-"
                              onChange={newValue => handleFromDate(newValue)}
                              format="YYYY-MM-DD"
                              calendar={persian}
                              locale={persian_fa}
                              containerStyle={{
                                width: "100%",
                              }}
                              placeholder="شروع بازه‌زمانی را انتخاب کنید"
                            />
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>تا تاریخ</Label>
                          <div style={{ direction: "rtl" }}>
                            <DatePicker
                              inputClass="custom-input"
                              value={toDate}
                              monthYearSeparator="-"
                              onChange={newValue => handleToDate(newValue)}
                              format="YYYY-MM-DD"
                              calendar={persian}
                              locale={persian_fa}
                              containerStyle={{
                                width: "100%",
                              }}
                              placeholder="پایان بازه‌زمانی را انتخاب کنید"
                            />
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md={1} className="mt-4 pe-1 ps-3">
                        <FormGroup>
                          <Button block color="secondary" onClick={handleClear}>
                            {" "}
                            حذف فیلترها
                          </Button>
                        </FormGroup>
                      </Col>
                      <Col md={1} className="mt-4">
                        <FormGroup>
                          <Button block color="primary" onClick={handleSearch}>
                            {" "}
                            جستجو
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div className=" mb-0">
                    <Row className="mb-2">
                      <Row className="justify-content-between mx-0"></Row>
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
LetterCartabl.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default LetterCartabl
