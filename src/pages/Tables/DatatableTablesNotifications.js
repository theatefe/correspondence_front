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

function DatatableNotifications() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [draftList, setDraftList] = useState([])
  const [showSendDraft, setShowSendDraft] = useState(false)
  // Toggle for Modal
  const toggleSend = () => setShowSendDraft(!showSendDraft)
  // handle send draft

  // get draft list ***********
  const getList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/declaration/get-all-declaration/`, config)
      .then(response => response.json())
      .then(result => {
        const messages = result.map(item => {
          var dateTime = item.createDate
          var sendDate = dateTime.slice(0, 10)
          var sendTime = dateTime.slice(11, 16)
          return {
            id: item.id,
            title: item.title,
            content: item.content.substr(0, 45) + "...",
            createDate: sendDate,
          }
        })
        setDraftList(messages)
      })
  }
  const columns = useMemo(
    () => [
      // {
      //   Header: "ردیف",
      //   accessor: "key",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div>
      //       {cell.value}
      //     </div>
      //   ),
      // },
      {
        Header: "عنوان اطلاعیه",
        accessor: "title",
        flag: "true",
        Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
      },
      // {
      //   Header: "محتوا",
      //   accessor: "content",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div className="lopp">
      //       {cell.value}
      //     </div>
      //   ),
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
                  to={`/notif/${cell.value}`}
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
  const data = draftList.map((item, index) => {
    return {
      key: index + 1,
      id: item.id,
      title: item.title,
      content: item.content.substr(0, 35),
      startDate: item.createDate,
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
  document.title = "اطلاعیه ها - سامانه مکاتبات"

  return !loading ? (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="اطلاعیه‌ها" breadcrumbItem="لیست‌اطلاعیه‌ها" />
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
DatatableNotifications.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DatatableNotifications
