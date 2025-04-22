// src/components/filter.
import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"

//import components
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

//i18n
import i18n from "../../i18n"
import { withTranslation } from "react-i18next"
import { useTranslation } from "react-i18next"


import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

import { Link } from "react-router-dom"

import ArchiveModal from "components/Common/ArchiveModal"
import ReferralModal from "components/Common/ReferralModal"

import { Type } from "../JobPages/JobList/JobListCol"

const Correspondence = props => {
  const [selectedRow, setSelectedRow] = useState(null)
  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [archiveModal, setArchiveModal] = useState(false)
  const { t } = useTranslation()
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


  const columns = [
    {
      Header: t("Sender"),
      accessor: "sender",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: t("Title"),
      accessor: "title",
      flag: "true",
      Cell: ({ cell }) => <div className="lopp">{cell.value}</div>,
    },
    {
      Header: t("Status"),
      accessor: "type",
      flag: "true",
      Cell: cell => {
        return (
          <div style={{ textAlign: "center" }}>
            {" "}
            <Type {...cell} />
          </div>
        )
      }
    },
    {
      Header: t("Attachment"),
      accessor: "attachment",
      flag: "true",
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.value}</div>
      ),
    },
    {
      Header: t("Priority"),
      accessor: "priority",
      flag: "true",
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.value}</div>
      ),
    },
    {
      Header: t("Date Received"),
      accessor: "startDate",
      flag: "true",
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center", verticalAlign: "middle" }}>
          {cell.value}
        </div>
      ),
    },
    {
      Header: t("Operations"),
      flag: "true",
      Cell: cellProps => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="list-unstyled hstack gap-1 mb-0"
          >
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${t("Show")}`}>
                    <strong>{t("Show")}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="/Correspondenceindex"
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
                  <Tooltip id={`tooltip-${t("Assign")}`}>
                    <strong>{t("Assign")}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn  btn-soft-info"
                  onClick={() => {
                    const userData = cellProps.row.original
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
            </li>
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${t("Archive")}`}>
                    <strong>{t("Archive")}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="#"
                  className="btn btn-soft-warning"
                  onClick={() => {
                    const userData = cellProps.row.original
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
            </li>
            <li>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${t("Tracing")}`}>
                    <strong>{t("Tracing")}</strong>
                  </Tooltip>
                }
              >
                <Link
                  to="/TracingCorrespondence"
                  className="btn  btn-soft-pink"
                >
                  <i
                    className="mdi mdi-account-network-outline"
                    id="viewtooltip"
                    style={{ fontSize: "16px" }}
                  />
                </Link>
              </OverlayTrigger>
            </li>
          </div>
        )
      },
    },
  ]








  const data = [
    {
      sender: "آرمین آقاجانی (امور مالی)",
      title: "لیست کسورات مرداد",
      type: "ارجاع",
      attachment: "دارد",
      priority: "عادی",
      startDate: "1402/04/14",
      read: true, // Set to true for read messages

    },
    {
      sender: "حسین عزیزآبادی (مدیرعامل)",
      title: "ایجاد فضای سبز",
      type: "ارجاع",
      attachment: "ندارد",
      priority: "فوری",
      startDate: "1402/01/22",
      read: true, // Set to true for read messages

    },
    {
      sender: "عزیز محمدی (مدیر حراست)",
      title: "اضافه کردن دستگاه کارت ساعت",
      type: "رونوشت",
      attachment: "ندارد",
      priority: "آنی",
      startDate: "1402/04/02",
      read: true, // Set to true for read messages

    },
    {
      sender: "آرمین آقاجانی (امور مالی)",
      title: "لیست کسورات تیر",
      type: "ارجاع",
      attachment: "دارد",
      priority: "عادی",
      startDate: "1402/03/14",
      read: true, // Set to true for read messages

    },
    {
      sender: "سعید مزیدآبادی (کارگزینی)",
      title: "بیمه ورزشی",
      type: "رونوشت",
      attachment: "دارد",
      priority: "آنی",
      startDate: "1402/05/16",
      read: true, // Set to true for read messages

    },
    {
      sender: "حسین عزیزآبادی (مدیرعامل)",
      title: "ایجاد فضای سبز",
      type: "ارجاع",
      attachment: "ندارد",
      priority: "فوری",
      startDate: "1402/01/22",
      read: true, // Set to true for read messages

    },
  ]

  const handleRowClick = row => {
    if (selectedRow === row.id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(row.id)
    }
  }

  //meta title
  document.title = "Data Tables | Skote - React Admin & Dashboard Template"

  return (
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
        <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" />
        {/* <Table columns={columns} data={data} /> */}

        <Row>
          <Col>
            <Card>
              <CardBody>
                {/* <CardTitle>Example </CardTitle>
                <CardSubtitle className="mb-3">
                  This is an experimental awesome solution for responsive tables
                  with complex data.
                </CardSubtitle> */}

                <div className="table-rep-plugin">
                  <div className=" mb-0">
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
  )
}
Correspondence.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
  t: PropTypes.any,
}

export default withTranslation()(Correspondence)
