// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"

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
  Modal,
  ModalBody,
} from "reactstrap"
import { Link } from "react-router-dom"
import datetime from "persian-time-ago"

function DatatableHeaderNotifications() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [notifList, setNotifList] = useState([])

  // get draft list ***********
  const getList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/messanger/get-login-user/`, config)
      .then(res => res.json())
      .then(data => {
        const result = data[1]
        const user = {
          id: result.id,
          firstName: result.first_name,
          lastName: result.last_name,
          signature: result.profile__signature,
        }
        fetch(`http://localhost:3000/messanger/get-receive-message/`, config)
          .then(response => response.json())
          .then(result => {
            const messages = result.filter(
              item => item.receiver_id == user.id && item.unseenCount > 0
            )
            const list = messages.map(item => {
              var dateTime = item.updateDate
              var sendDate = dateTime.slice(0, 10)
              var sendTime = dateTime.slice(11, 19)
              var sender =
                user.id == item.creator_id
                  ? item.audience__first_name + " " + item.audience__last_name
                  : item.creator__first_name + " " + item.creator__last_name
              return {
                id: item.id,
                sender: sender,
                title: item.title,
                unseenCount: item.unseenCount,
                createDate: datetime(sendDate + " " + sendTime),
                status: 0, // پیام
              }
            })
            setNotifList(list)
            fetch(`http://localhost:3000/letter/inbox-letter/`, config)
              .then(response => response.json())
              .then(result => {
                const letters = result.filter(item => item.seen == 1)
                letters.map(item => {
                  var dateTime = item.letter__createDate
                  var sendDate = dateTime.slice(0, 10)
                  var sendTime = dateTime.slice(11, 19)
                  var sender =
                    item.letter__creator__first_name +
                    " " +
                    item.letter__creator__last_name
                  const obj = {
                    id: item.letter_id,
                    sender: sender,
                    title: item.letter__title,
                    unseenCount: item.seen,
                    createDate: datetime(sendDate + " " + sendTime),
                    status: 1, //نامه
                  }
                  setNotifList(x => [...x, obj])
                })
                setLoading(false)
              })
          })
      })
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
        Header: "دسته بندی",
        accessor: "status",
        flag: "true",
        Cell: ({ cell }) => <div>{cell.value == 0 ? "پیام" : "نامه"}</div>,
      },
      {
        Header: "عنوان اعلان",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },

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
        accessor: "obj",
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
                  to={
                    cell.value.status == 0
                      ? `/view-messages/${cell.value.id}`
                      : `/detail-letter/${cell.value.id}`
                  }
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
    []
  )
  const data = notifList.map((item, index) => {
    return {
      key: index + 1,
      id: item.id,
      title: item.title,
      sender: item.sender,
      startDate: item.createDate,
      status: item.status,
      obj: { id: item.id, status: item.status },
    }
  })
  React.useEffect(() => {
    setLoading(true)
    getList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])
  //meta title
  document.title = "اعلان ها - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="اعلان‌ها" breadcrumbItem="لیست اعلان‌ها" />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
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
DatatableHeaderNotifications.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableHeaderNotifications
