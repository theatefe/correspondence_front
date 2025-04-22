import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
} from "reactstrap"
import Switch from "react-switch"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

const animatedComponents = makeAnimated()

const ReferralModal = ({ show, onDeleteClick, onCloseClick }) => {
  const [formRows, setFormRows] = useState([{ id: 1 }])
  const onAddFormRow = () => {
    const modifiedRows = [...formRows]
    modifiedRows.push({ id: modifiedRows.length + 1 })
    setFormRows(modifiedRows)
  }

  const handleSend = () => {
    // Close the modal
    onCloseClick()

    toastr.success("ارسال موفقیت‌آمیز بود")
    toastr.options = {
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
      positionClass: "toast-top-right",
    }
  }

  const handleArchive = () => {
    // Close the modal
    onCloseClick()

    toastr.success("نامه به آرشیو اضافه شد")
    toastr.options = {
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
      positionClass: "toast-top-right",
    }
  }

  const onDeleteFormRow = id => {
    if (id !== 1) {
      var modifiedRows = [...formRows]
      modifiedRows = modifiedRows.filter(x => x["id"] !== id)
      setFormRows(modifiedRows)
    }
  }

  const optionGroup = [
    {
      label: "امور مالی",
      options: [
        { label: "آقای حسینی", value: "آقای حسینی" },
        { label: "آقای داودی", value: "آقای داودی" },
        { label: "خانم آریایی", value: "خانم آریایی" },
      ],
    },
    {
      label: "کارگزینی",
      options: [
        { label: "آقای جعفری", value: "آقای جعفری" },
        { label: "خانم یاری", value: "خانم یاری" },
        { label: "خانم میرزایی", value: "خانم میرزایی" },
      ],
    },
    {
      label: "امور مالی",
      options: [
        { label: "آقای حسینی", value: "آقای حسینی" },
        { label: "آقای داودی", value: "آقای داودی" },
        { label: "خانم آریایی", value: "خانم آریایی" },
      ],
    },
    {
      label: "کارگزینی",
      options: [
        { label: "آقای جعفری", value: "آقای جعفری" },
        { label: "خانم یاری", value: "خانم یاری" },
        { label: "خانم میرزایی", value: "خانم میرزایی" },
      ],
    },
    {
      label: "امور مالی",
      options: [
        { label: "آقای حسینی", value: "آقای حسینی" },
        { label: "آقای داودی", value: "آقای داودی" },
        { label: "خانم آریایی", value: "خانم آریایی" },
      ],
    },
    {
      label: "کارگزینی",
      options: [
        { label: "آقای جعفری", value: "آقای جعفری" },
        { label: "خانم یاری", value: "خانم یاری" },
        { label: "خانم میرزایی", value: "خانم میرزایی" },
      ],
    },
    {
      label: "امور مالی",
      options: [
        { label: "آقای حسینی", value: "آقای حسینی" },
        { label: "آقای داودی", value: "آقای داودی" },
        { label: "خانم آریایی", value: "خانم آریایی" },
      ],
    },
    {
      label: "کارگزینی",
      options: [
        { label: "آقای جعفری", value: "آقای جعفری" },
        { label: "خانم یاری", value: "خانم یاری" },
        { label: "خانم میرزایی", value: "خانم میرزایی" },
      ],
    },
  ]

  const [selectedGroup, setselectedGroup] = useState(null)
  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup)
  }
  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button
            type="button"
            onClick={onCloseClick}
            className="btn-close position-absolute end-0 top-0 m-3"
          ></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className=" btn-warning btn-soft-warning py-0 px-2 rounded-3 rounded-circle">
              <i
                className="mdi mdi-archive-outline"
                style={{ fontSize: "28px" }}
              ></i>
            </div>
          </div>
          <Row>
            <Col xs={12}>
              <h6 className="mb-4 card-title">آرشیو نامه</h6>
            </Col>
          </Row>

          <p className="text-muted font-size-16 mb-4">
            نامه با عنوان <strong>ایجاد فضای سبز</strong> در آرشیو ذخیره شود؟
          </p>

          <div className="hstack gap-2 justify-content-center mb-0">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleArchive}
            >
              بله
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCloseClick}
            >
              لغو
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

ReferralModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.bool,
}

export default ReferralModal
