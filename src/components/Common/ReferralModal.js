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
  Input
} from "reactstrap"
import Switch from "react-switch"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import logo from "../../assets/images/brands/avatar-temp.png";


const animatedComponents = makeAnimated()

const ReferralModal = ({ show, onDeleteClick, onCloseClick, apply }) => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = React.useState([]);
  const [transmitter, setTransmitter] = React.useState([]);
  const [selectedGroup, setselectedGroup] = useState(null)
  const [file, setFile] = useState(null);
  const [uploadFiles, setUploadFiles] = React.useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [loading, setLoading] = React.useState();
  const decriptionRef = React.useRef();
  // ******************** get users ***********************
  const getUsers = () => {
  }
  // ******************* get transmitter *****************
  const getTransmitter = (apply) => {
  }
  // Create a custom option component that includes an image
  const getOptionLabel = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <img src={logo} className="select2Avatar" alt={label} />
      {label}
    </div>
  )

  // handle chnage file 
  const handlechangeFile = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  // handle upload file
  const handleUploadFile = () => {
  }

  // ****************** submit function ******************
  const handleSend = () => {
  }

  const optionGroup = users.map((item) => {
    return {
      label: item.fullName, value: item.id
    }
  })

  const fromGroup = transmitter.map((item) => {
    return {
      label: item.fullName, value: item.id
    }
  })


  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup)
  }
  function handleSelectUser(selectedUser) {
    setselectedUser(selectedUser)
  }
  React.useEffect(() => {
    setLoading(true);
    getUsers();
    //getTransmitter();
    setTimeout(() => {
    }, 1000);
  }, []);
  return !loading ? (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button
            type="button"
            onClick={onCloseClick}
            className="btn-close position-absolute end-0 top-0 m-3"
          ></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="btn-soft-info rounded-3 rounded-circle">
              <i
                className="mdi mdi-email-send-outline"
                style={{ fontSize: "28px" }}
              ></i>
            </div>
          </div>
          <Row>
            <Col xs={12}>
              <h6 className="mb-4 card-title">ارجاع نامه</h6>
              <Form className="repeater" encType="multipart/form-data">
                <div>
                  <Row>
                    <Col lg={12}>
                      <div className="mt-3 text-start" style={{ zIndex: '9999' }}>
                        <Label> ارجاع از</Label>
                        <Select
                          value={selectedGroup}
                          onChange={selectedOption => {
                            handleSelectGroup(selectedOption)
                          }}
                          options={fromGroup.map(group => ({
                            label: group.label,
                            value: group.value,
                            imageSrc: group.imageSrc, // Provide the image source for each option
                          }))}
                          className="select2-selection text-start"
                          noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                          placeholder="از لیست زیر انتخاب کنید"
                          // components={{
                          //   Option: OptionWithImage, // Use the custom option component
                          // }}
                          getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function
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

                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div
                        className="mb-3 text-start"
                        style={{ zIndex: "9999" }}
                      >
                        <Label>گیرنده</Label>
                        <Select
                          value={selectedUser}
                          isMulti={true}
                          onChange={selectedUser => {
                            handleSelectUser(selectedUser)
                          }}
                          options={optionGroup.map(group => ({
                            label: group.label,
                            value: group.value,
                            imageSrc: group.imageSrc, // Provide the image source for each option
                          }))}
                          className="select2-selection text-start"
                          noOptionsMessage={() => "گیرنده مورد نظر یافت نشد"}
                          placeholder=" انتخاب کنید"
                          // components={{
                          //   Option: OptionWithImage, // Use the custom option component
                          // }}

                          getOptionLabel={getOptionLabel} // Use the custom getOptionLabel function



                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: '#fff',
                              color: "var(--bs-body-color)",
                              textAlign: "right,",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              ':hover': {
                                backgroundColor: "#eff2f7", // Change to your desired hover background color
                                cursor: "pointer", // Change the cursor to a pointer
                              },
                              backgroundColor: state.isSelected ? '#BFC2C6' : provided.backgroundColor,
                              color: "var(--bs-body-color)",
                              textAlign: "right,",
                            }),
                          }}

                        />
                      </div>
                    </Col>
                    <Col lg={12} className="mt-3 text-start">
                      <label htmlFor="message">توضیحات</label>
                      <textarea
                        ref={decriptionRef}
                        id="message"
                        className="form-control"
                        placeholder="متن خود را وارد کنید"
                        rows={5}
                      ></textarea>
                    </Col>
                    <Col lg={12} className="mt-3 text-start">
                      <label htmlFor="message">ضمیمه</label>
                      <div className="input-group">
                        <Input
                          type="file"
                          className="form-control"
                          id="correspondenceAttachments"
                          aria-describedby="inputGroupFileAddon04"
                          aria-label="Upload"
                          onClick={handlechangeFile}
                        />
                        <button
                          className="btn btn-info"
                          type="button"
                          id="inputGroupFileAddon04"
                          onClick={handleUploadFile}
                        >
                          آپلود فایل
                        </button>
                      </div>
                    </Col>
                  </Row>

                </div>
              </Form>
            </Col>
          </Row>
          <div className="hstack gap-2 mt-4 justify-content-end mb-0">
            <button
              type="button"
              className="btn text-nowrap btn-success"
              onClick={handleSend}
            >
              ارسال
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  ) : (<></>)
}

ReferralModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.bool,
}

export default ReferralModal
