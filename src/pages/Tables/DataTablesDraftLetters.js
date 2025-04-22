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
  Button,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Spinner,
} from "reactstrap"

import { Link } from "react-router-dom"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

import { Type } from "../JobPages/JobList/JobListCol"

function DataTablesDraftLetters() {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const [inboxList, setInboxList] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLetterId, setDeleteLetterId] = useState()
  // Toggle for Modal
  const toggle = () => setShowDeleteModal(!showDeleteModal)

  // delete
  const onClickData = apply => {
    setApply(apply)
    setDeleteModal(true)
  }
  const onClickarchive = apply => {
    setApply(apply)
    setArchiveModal(true)
  }
  const handleDeleteApplyJob = () => {
    if (apply && apply.id) {
      dispatch(OnDeleteApplyJob(apply.id))
      setDeleteModal(false)
    }
  }

  // handle show delete
  const handleShowDeleteDialog = id => {
    setShowDeleteModal(true)
    setDeleteLetterId(id)
  }

  // delete letter
  const deleteLetterFun = () => {
    const url = `http://localhost:3000/letter/delete-letter/${deleteLetterId}/`
    const headers = new Headers({
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    })
    fetch(url, {
      headers: headers,
      method: "DELETE",
      mode: "cors",
    }).then(data => {
      console.log(data)
      if (data.ok) {
        setShowDeleteModal(false)
        setDeleteLetterId(0)
        toastr.success("نامه با موفقیت حذف شد")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setShowDeleteModal(false)
        setDeleteLetterId(0)
        toastr.error("مشکلی در حذف نامه رخ داده، مجدد امتحان کنید")
        toastr.options = {
          closeButton: true,
          progressBar: true,
          newestOnTop: true,
          positionClass: "toast-top-right",
        }
      }
    })
  }

  //  getDraftList **************
  const getDraftList = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/letter/get-draft-letter/`, config)
      .then(res => res.json())
      .then(result => {
        const letters = result.map(item => {
          return {
            id: item.id,
            title: item.title,
            type: item.type,
            attachment: item.linked,
            priority: item.priority,
            createDate: item.createDate,
          }
        })
        setInboxList(letters)
      })
  }

  const columns = useMemo(
    () => [
      // {
      //   Header: "فرستنده",
      //   accessor: "sender",
      //   flag: "true",
      //   Cell: ({ cell }) => (
      //     <div className="lopp">
      //       {cell.value}
      //     </div>
      //   ),
      // },
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
                  to={`/draft-letter/${cell.value}`}
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
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"حذف"}`}>
                    <strong>{"حذف"}</strong>
                  </Tooltip>
                }
              >
                <Link
                  onClick={() => handleShowDeleteDialog(cell.value)}
                  className="btn btn-soft-danger"
                >
                  <i
                    className="mdi mdi-delete-outline md-18"
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
    var dateTime = item.createDate
    var sendDate = dateTime.slice(0, 10)
    var sendTime = dateTime.slice(11, 19)
    return {
      id: item.id,
      sender: item.sender,
      title:
        item.title.length > 50 ? item.title.substr(0, 50) + " ..." : item.title,
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

  const handleRowClick = row => {
    if (selectedRow === row.id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(row.id)
    }
  }

  React.useEffect(() => {
    setLoading(true)
    getDraftList()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  //meta title
  document.title = "نامه های پیش نویس - سامانه مکاتبات"

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

      <Modal isOpen={showDeleteModal} centered={true}>
        <ModalHeader toggle={toggle}> حذف نامه </ModalHeader>
        <ModalBody>
          شما در حال حذف نامه پیش نویس شده هستید، آیا از حذف این نامه اطمینان
          دارید؟
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={deleteLetterFun}>
            بله
          </Button>{" "}
          <Button color="danger" onClick={toggle}>
            خیر
          </Button>
        </ModalFooter>
      </Modal>

      <div className="container-fluid">
        <Breadcrumbs title="پیش نویس" breadcrumbItem="نامه ها" />
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
DataTablesDraftLetters.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default DataTablesDraftLetters
