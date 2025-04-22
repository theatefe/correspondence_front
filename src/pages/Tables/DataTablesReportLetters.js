// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"

import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

//gregorian calendar & locale
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"

//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Select from "react-select"
import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"
import logo from "../../assets/images/brands/avatar-temp.png"
import { Type } from "../JobPages/JobList/JobListCol"

function DataTablesOutboxLetters() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [selectedRow, setSelectedRow] = useState(null)
  const [outboxList, setOutboxList] = useState([])
  const [userList, setUserList] = React.useState([])
  const [creator, setCreator] = React.useState(null)
  const [number, setNumber] = useState(null)
  const [title, setTitle] = useState(null)
  const [type, setType] = useState(null)
  const [priority, setPriority] = useState(null)
  const [linked, setLinked] = useState(null)
  const [date, setDate] = useState({ format: "YYYY-MM-DDThh:mm" })
  const now = new Date().toJSON()

  // ************ get users ***************
  const getUsers = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-all-user/`, config)
      .then(res => res.json())
      .then(data => {
        const result = data
        const users = result.map(item => {
          return {
            value: item.id,
            label: item.first_name + " " + item.last_name,
          }
        })
        setUserList(users)
      })
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
  // handle date change *********
  const handleDateChange = () => {
    console.log(newValue)
  }
  // get outbox list *************
  const getOutboxList = () => {
    const url = `http://localhost:3000/letter/letter-search/`
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    const formData = {
      number: null,
      title: null,
      creator: null,
      type: null,
      priority: null,
      linked: null,
      createDate: null,
    }
    fetch(url, {
      headers: headers,
      method: "POST",
      mode: "cors",
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        const letters = data.map(item => {
          return {
            id: item.id,
            creator: item.creator__first_name + " " + item.creator__last_name,
            reciver:
              item.transmissions__receiver__first_name +
              " " +
              item.transmissions__receiver__last_name,
            title: item.title,
            type: item.type,
            attachment: item.linked,
            priority: item.priority,
            createDate: item.createDate,
          }
        })
        setOutboxList(letters)
      })
  }
  // handleExistLetter
  const handleExistLetter = e => {
    if (e.target.value) {
      const item = e.target.value
      const config = {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
        },
      }
      fetch(`http://localhost:3000/letter/exist-letter/${item}/`, config)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            setLinked(data[0].id)
          }
        })
    }
  }
  // handleSend ****************
  const handleSearch = () => {
    const miladiDate = new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DDThh:mm")
    const nowDate = now.substring(0, 10)
    const inputDate = miladiDate.substring(0, 10)
    const compareDate = nowDate == inputDate ? true : false
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    const url = `http://localhost:3000/letter/letter-search/`
    const formData = {
      number: number || null,
      title: title || null,
      creator: creator ? creator.value : null,
      type: type ? type.value : null,
      priority: priority ? priority.value : null,
      linked: linked || null,
      createDate: compareDate ? null : miladiDate,
    }
    fetch(url, {
      headers: headers,
      method: "POST",
      mode: "cors",
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const letters = data.map(item => {
          return {
            id: item.id,
            creator: item.creator__first_name + " " + item.creator__last_name,
            reciver:
              item.transmissions__receiver__first_name +
              " " +
              item.transmissions__receiver__last_name,
            title: item.title,
            type: item.type,
            attachment: item.linked,
            priority: item.priority,
            createDate: item.createDate,
          }
        })
        setOutboxList(letters)
      })
  }
  // handleClear ***************
  const handleClear = () => {
    setCreator(null)
    setTitle("")
    setNumber("")
    setDate({ format: "YYYY-MM-DDThh:mm" })
    setType(null)
    setPriority(null)
    setLinked("")
    getOutboxList()
  }

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
        Header: "عنوان نامه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "طبقه بندی",
        accessor: "type",
        flag: "true",

        Cell: cell => {
          return (
            <div style={{ textAlign: "center" }}>
              {" "}
              {/* <Type {...cell} /> */}
              {cell.value}
            </div>
          )
        },
      },
      {
        Header: "نامه پیوست",
        accessor: "attachment",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center" }}>{cell.value}</div>
        ),
      },
      {
        Header: "اولویت",
        accessor: "priority",
        flag: "true",
        Cell: ({ cell }) => (
          <div
            className={cell.value == "فوری" ? "text-danger" : "text-primary"}
            style={{ textAlign: "center" }}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "تاریخ دریافت",
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
                  to={`/detail-letter/${cell.value}`}
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
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"ارجاع"}`}>
                    <strong>{"ارجاع"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn  btn-soft-info"
                  onClick={() => {
                    const userData = cell.value
                    onClickData(userData)
                  }}
                >
                  <i
                    className="mdi mdi-email-send-outline"
                    id="deletetooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"آرشیو"}`}>
                    <strong>{"آرشیو"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn btn-soft-warning"
                  onClick={() => {
                    const userData = cell.value
                    onClickarchive(userData)
                  }}
                >
                  <i
                    className="mdi mdi-archive-outline"
                    id="deletetooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
            {/* <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"ردیابی"}`}>
                    <strong>{"ردیابی"}</strong>
                  </Tooltip>
                }
              >
                <Link to="#" className="btn  btn-soft-pink">
                  <i
                    className="mdi mdi-account-network-outline"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li> */}
          </div>
        ),
      },
    ],
    [selectedRow]
  )

  const data = outboxList.map(item => {
    var dateTime = item.createDate
    var sendDate = dateTime.slice(0, 10)
    var sendTime = dateTime.slice(11, 19)
    return {
      id: item.id,
      sender: item.creator,
      reciver: item.reciver,
      title:
        item.title.length > 32 ? item.title.substr(0, 32) + "..." : item.title,
      type: item.type == "1" ? "عادی" : "محرمانه",
      attachment: item.attachment == null ? "ندارد" : "دارد",
      priority:
        item.priority == "1"
          ? "عادی"
          : item.priority == "2"
          ? "فوری"
          : item.priority == "3"
          ? "آنی"
          : "بدون الویت",
      startDate: sendDate,
    }
  })

  function handleCreator(creator) {
    setCreator(creator)
  }

  function handleDate(date) {
    //const item = new DateObject(date).convert(gregorian, gregorian_en).format();
    setDate(date)
  }

  React.useEffect(() => {
    setLoading(true)
    getUsers()
    getOutboxList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "گزارش نامه - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="گزارشات" breadcrumbItem="نامه ها" />
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
                      <Col md={3}>
                        <FormGroup>
                          <Label>فرستنده</Label>
                          <Select
                            id="reciver"
                            name="reciver"
                            value={creator}
                            isMulti={false}
                            onChange={newValue => handleCreator(newValue)}
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
                      <Col md={3}>
                        <FormGroup>
                          <Label>عنوان نامه</Label>
                          <Input
                            placeholder="عنوان نامه را جستجو کنید"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>شماره نامه</Label>
                          <Input
                            placeholder="شماره نامه را جستجو کنید"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>تاریخ ارسال</Label>
                          <div style={{ direction: "rtl" }}>
                            <DatePicker
                              inputClass="custom-input"
                              value={date}
                              monthYearSeparator="-"
                              onChange={newValue => handleDate(newValue)}
                              format="YYYY-MM-DD"
                              calendar={persian}
                              locale={persian_fa}
                              containerStyle={{
                                width: "100%",
                              }}
                              placeholder="زمان ارسال نامه را مشخص کنید"
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="justify-content-between mx-1">
                      <Col md={3}>
                        <FormGroup>
                          <Label>طبقه‌بندی</Label>
                          <Select
                            id="reciver"
                            name="reciver"
                            value={type}
                            isMulti={false}
                            onChange={newValue => setType(newValue)}
                            options={[
                              { label: "عادی", value: 1 },
                              { label: "محرمانه", value: 2 },
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
                            className="select2-selection text-start"
                            noOptionsMessage={() => "وضعیت مورد نظر یافت نشد"}
                            placeholder="طبقه بندی نامه را انتخاب کنید"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="examplePassword">الویت</Label>
                          <Select
                            id="reciver"
                            name="reciver"
                            value={priority}
                            isMulti={false}
                            onChange={priority => setPriority(priority)}
                            options={[
                              { label: "عادی", value: 1 },
                              { label: "فوری", value: 2 },
                              { label: "آنی", value: 3 },
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
                            placeholder="الویت نامه را انتخاب کنید"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="examplePassword">نامه مرتبط</Label>
                          <Input
                            placeholder="شماره نامه مرتبط را وارد کنید"
                            onChange={handleExistLetter}
                            value={linked}
                          />
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
                      <Col md={2} className="mt-4 pr-0">
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
                    <Row className="mb-3">
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
DataTablesOutboxLetters.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DataTablesOutboxLetters
