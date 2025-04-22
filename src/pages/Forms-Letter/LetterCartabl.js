// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import moment from "moment-jalaali"

//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import classnames from "classnames"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Container,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Collapse,
} from "reactstrap"
import { Link } from "react-router-dom"
// API
import InboxLetter from "../../api/user/letter/InboxLetter"
import OutboxLetter from "../../api/user/letter/outboxLetter"
import DraftLetter from "../../api/user/letter/DraftLetter"
import CountInboxLetter from "../../api/user/letter/CountInboxLetter"
//MODAL
import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

function LetterCartabl() {
  const token = localStorage.getItem("token")
  const [selectedRow, setSelectedRow] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [countNewLetters, setCountNewLetters] = React.useState(0)
  const [inboxList, setInboxList] = React.useState([])
  const [outboxList, setOutboxList] = React.useState([])
  const [darftList, setDraftList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [verticalActiveTab, setverticalActiveTab] = useState("1")
  const [col1, setcol1] = useState(true) // برای مکاتبات
  const toggleVertical = tab => {
    if (verticalActiveTab !== tab) {
      setverticalActiveTab(tab)
    }
  }
  const t_col1 = () => {
    setcol1(!col1)
  }
  // get count inbox list ***********
  const getCountInboxList = async () => {
    const inboxResult = await CountInboxLetter(token)
    setCountNewLetters(inboxResult.data)
  }
  // get inbox list ***********
  const getInboxList = async () => {
    const inboxResult = await InboxLetter(token)
    const result = inboxResult.data.map(item => {
      const jalaliLetterDate = moment(item.letter.numberedAt).format(
        "jYYYY/jMM/jDD"
      )
      const jalaliReciverDate = moment(item.createdAt).format("jYYYY/jMM/jDD")
      return {
        id: item.id,
        letterId: item.letter.id,
        title: item.letter.title,
        set: item.letter.confidentiality,
        reciver: item.toUser
          ? item.toUser.name + " " + item.toUser.lastName
          : "-",
        sender: item.fromUser
          ? item.fromUser.name + " " + item.fromUser.lastName
          : "-",
        sendtime: jalaliReciverDate,
        startDate: jalaliLetterDate,
        number: item.letter.number,
        recivertype: item.letter.status,
        answer: item.letter.status,
        position: item.letter.type,
        priority: item.letter.priority,
        attachment: item.letter.attached != null ? "دارد" : "ندارد",
        seen: item.status == 0 ? false : true,
      }
    })
    setInboxList(result)
  }
  // get outbox list ***********
  const getOutboxList = async () => {
    const response = await OutboxLetter(token)
    const result = response.data.map(item => {
      const jalaliLetterDate = moment(item.numberedAt).format("jYYYY/jMM/jDD")
      return {
        id: item.id,
        title: item.title,
        set: item.type,
        reciver: item.reciver
          ? item.reciver.name + " " + item.reciver.lastName
          : "-",
        sendtime: jalaliLetterDate,
        startDate: jalaliLetterDate,
        number: item.number != null ? item.number : "-",
        recivertype: item.status,
        answer: item.answer,
        position: item.confidentiality,
        priority: item.priority,
        attachment: item.number !== null ? "دارد" : "ندارد",
      }
    })
    setOutboxList(result)
  }
  // get draft list ***********
  const getDraftList = async () => {
    const response = await DraftLetter(token)
    const drafts = response.data
    const list = drafts.map(item => {
      return {
        id: item.id,
        title: item.title,
        set: item.type,
        reciver: item.reciver
          ? item.reciver.name + " " + item.reciver.lastName
          : "-",
        sendtime: item.reciver ? item.reciver.createdAt.substr(0, 10) : "-",
        priority: item.priority,
        type: item.confidentiality,
        state: item.status,
        attach: item.attach ? "دارد" : "ندارد",
        createDate: item.createDate,
      }
    })
    setDraftList(list)
  }
  // columns inbox letters *****
  const inboxColumns = useMemo(
    () => [
      {
        Header: "موضوع",
        accessor: "title",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={row.original.seen === false ? { fontWeight: "bold" } : {}}
          >
            {cell.value}
            {row.original.seen === false && (
              <span className="badge bg-primary ms-2">جدید</span>
            )}
          </div>
        ),
      },
      {
        Header: "نوع نامه",
        accessor: "set",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={row.original.seen === false ? { fontWeight: "bold" } : {}}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "گیرنده",
        accessor: "reciver",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={row.original.seen === false ? { fontWeight: "bold" } : {}}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "فرستنده",
        accessor: "sender",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={row.original.seen === false ? { fontWeight: "bold" } : {}}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "زمان دریافت",
        accessor: "sendtime",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={row.original.seen === false ? { fontWeight: "bold" } : {}}
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "تاریخ نامه",
        accessor: "startDate",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "وضعیت نامه",
        accessor: "recivertype",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "شماره نامه",
        accessor: "number",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      // {
      //   Header: "پاسخ",
      //   accessor: "answer",
      //   flag: "true",
      //   Cell: ({ cell, row }) => (
      //     <div
      //       style={
      //         row.original.seen === false
      //           ? {
      //               textAlign: "center",
      //               verticalAlign: "middle",
      //               fontWeight: "bold",
      //             }
      //           : { textAlign: "center", verticalAlign: "middle" }
      //       }
      //     >
      //       {cell.value ? (
      //         <span style={{ color: "green" }}>✔️</span> // نمایش تیک سبز برای true
      //       ) : (
      //         <span style={{ color: "red" }}>❌</span> // نمایش ضربدر قرمز برای false
      //       )}
      //     </div>
      //   ),
      // },
      {
        Header: "طبقه بندی",
        accessor: "position",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "فوریت",
        accessor: "priority",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "پیوست",
        accessor: "attachment",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={
              row.original.seen === false
                ? {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontWeight: "bold",
                  }
                : { textAlign: "center", verticalAlign: "middle" }
            }
          >
            {cell.value}
          </div>
        ),
      },
      {
        Header: "عملیات",
        accessor: "id",
        flag: "true",
        Cell: ({ cell, row }) => (
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="list-unstyled hstack gap-1 mb-0"
          >
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"نمایش نامه"}`}>
                    <strong>{"نمایش نامه"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to={`/letterDetail/${row.original.letterId}/${cell.value}`}
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
  const inboxData = inboxList.map(item => {
    return {
      id: item.id,
      letterId: item.letterId,
      title: item.title,
      reciver: item.reciver,
      sender: item.sender,
      set: item.set,
      sendtime: item.sendtime,
      startDate: item.startDate,
      number: item.number,
      recivertype: item.recivertype,
      answer: item.answer == "پاسخ" ? true : false,
      position: item.position,
      priority: item.priority,
      attachment: item.attachment,
      seen: item.seen,
    }
  })
  // columns outbox letters  *****
  const outboxColumns = useMemo(
    () => [
      {
        Header: "موضوع",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "نوع نامه",
        accessor: "set",
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
        Header: "وضعیت نامه",
        accessor: "recivertype",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "زمان ارسال",
        accessor: "sendtime",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "تاریخ نامه",
        accessor: "startDate",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "شماره نامه",
        accessor: "number",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "طبقه بندی",
        accessor: "position",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "فوریت",
        accessor: "priority",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "پیوست",
        accessor: "attachment",
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
                  <Tooltip id={`tooltip-${"نمایش نامه"}`}>
                    <strong>{"نمایش نامه"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to={`/letterDetail/${cell.value}`}
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
  const outboxData = outboxList.map(item => {
    return {
      id: item.id,
      title: item.title,
      set: item.set,
      reciver: item.reciver,
      sendtime: item.sendtime,
      startDate: item.startDate,
      number: item.number,
      recivertype: item.recivertype,
      position: item.position,
      priority: item.priority,
      attachment: item.attachment,
    }
  })
  // columns draft letters  ******
  const draftColumns = useMemo(
    () => [
      {
        Header: "موضوع",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "نوع نامه",
        accessor: "set",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "گیرنده",
        accessor: "reciver",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      // {
      //   Header: "فرستنده",
      //   accessor: "sender",
      //   flag: "true",
      //   Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      // },
      {
        Header: "زمان ایجاد",
        accessor: "sendtime",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      {
        Header: "الویت نامه",
        accessor: "priority",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      {
        Header: "طبقه بندی نامه",
        accessor: "type",
        flag: "true",
        Cell: ({ cell }) => (
          <div style={{ textAlign: "center", verticalAlign: "middle" }}>
            {cell.value}
          </div>
        ),
      },
      // {
      //   Header: "نقش دریافت کننده",
      //   accessor: "recivertype",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div style={{ textAlign: "center", verticalAlign: "middle" }}>
      //       {cell.value}
      //     </div>
      //   ),
      // },
      // {
      //   Header: "پاسخ",
      //   accessor: "answer",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div style={{ textAlign: "center", verticalAlign: "middle" }}>
      //       {cell.value}
      //     </div>
      //   ),
      // },
      // {
      //   Header: "طبقه بندی",
      //   accessor: "position",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div style={{ textAlign: "center", verticalAlign: "middle" }}>
      //       {cell.value}
      //     </div>
      //   ),
      // },
      // {
      //   Header: "فوریت",
      //   accessor: "priority",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div style={{ textAlign: "center", verticalAlign: "middle" }}>
      //       {cell.value}
      //     </div>
      //   ),
      // },
      {
        Header: "پیوست",
        accessor: "attachment",
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
                  <Tooltip id={`tooltip-${"نمایش نامه"}`}>
                    <strong>{"نمایش نامه"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to={`/letterDetail/${cell.value}`}
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
  const draftData = darftList.map(item => {
    return {
      id: item.id,
      title: item.title,
      set: item.set,
      reciver: item.reciver,
      sendtime: item.sendtime,
      priority: item.priority,
      type: item.type,
      state: item.state,
      position: item.position,
      attachment: item.attach,
    }
  })

  React.useEffect(() => {
    setLoading(true)
    setInterval(() => getCountInboxList(), 1000)
    setTimeout(() => {
      getInboxList()
      getOutboxList()
      getDraftList()
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
        <Breadcrumbs title="خانه" breadcrumbItem="کارتابل" />
        {/* <Table columns={columns} data={data} /> */}
        <Row>
          <Col lg={12}>
            <Row className="">
              <Col lg={3}>
                <Card>
                  <CardBody>
                    {/* آکاردئون مکاتبات */}
                    <div className="accordion" id="accordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header mt-0" id="headingOne">
                          <button
                            className={classnames(
                              "accordion-button",
                              "fw-medium",
                              { collapsed: !col1 }
                            )}
                            type="button"
                            onClick={t_col1}
                            style={{ cursor: "pointer" }}
                          >
                            مکاتبات
                          </button>
                        </h2>

                        <Collapse isOpen={col1} className="accordion-collapse">
                          <div className="accordion-body p-2">
                            <Nav pills className="flex-column">
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    "mb-2": true,
                                    active: verticalActiveTab === "1",
                                  })}
                                  onClick={() => toggleVertical("1")}
                                >
                                  {`دریافتی (${countNewLetters})`}
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    "mb-2": true,
                                    active: verticalActiveTab === "2",
                                  })}
                                  onClick={() => toggleVertical("2")}
                                >
                                  ارسالی
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active: verticalActiveTab === "3",
                                  })}
                                  onClick={() => toggleVertical("3")}
                                >
                                  پیش نویس
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={9}>
                <Card>
                  <CardBody>
                    <TabContent
                      activeTab={verticalActiveTab}
                      className="text-muted mt-4 mt-md-0"
                    >
                      <TabPane tabId="1">
                        <CardTitle className="h4">صندوق ورودی</CardTitle>
                        <TableContainer
                          columns={inboxColumns}
                          data={inboxData}
                          isGlobalFilter={true}
                          isAddOptions={false}
                          customPageSize={20}
                          className="custom-header-css table-striped "
                          enableRowSelection={true}
                          mokatebatTableBtn={true}
                          simpleSearchBox={true}
                          // isJobListGlobalFilter={true}
                        />
                      </TabPane>
                      <TabPane tabId="2">
                        <CardTitle className="h4">صندوق خروجی</CardTitle>
                        <TableContainer
                          columns={outboxColumns}
                          data={outboxData}
                          isGlobalFilter={true}
                          isAddOptions={false}
                          customPageSize={20}
                          className="custom-header-css table-striped "
                          enableRowSelection={true}
                          mokatebatTableBtn={true}
                          simpleSearchBox={true}
                          // isJobListGlobalFilter={true}
                        />
                      </TabPane>
                      <TabPane tabId="3">
                        <CardTitle className="h4"> پیش نویس</CardTitle>
                        <TableContainer
                          columns={draftColumns}
                          data={draftData}
                          isGlobalFilter={true}
                          isAddOptions={false}
                          customPageSize={20}
                          className="custom-header-css table-striped "
                          enableRowSelection={true}
                          mokatebatTableBtn={true}
                          simpleSearchBox={true}
                          // isJobListGlobalFilter={true}
                        />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col></Col>
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
