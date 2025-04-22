import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  Container,
  Card,
  CardBody,
  Col,
  Modal,
  Row,
  Button,
  Form,
} from "reactstrap"
import { saveAs } from "file-saver"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

import speakerNotification from "../../assets/images/icons/speakerNotification.png"
import AttachedImg from "../../assets/images/icons/attachedImg.png"

const DetailNotification = () => {
  document.title = "مشاهده‌اطلاعیه- سامانه مکاتبات"
  const { id } = useParams()
  const token = localStorage.getItem("token")
  const [loading, setLoading] = React.useState()
  const [info, setInfo] = React.useState()
  const [infoMedia, setInfoMedia] = React.useState([])

  // get detail
  const getDetail = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    }
    fetch(`http://localhost:3000/declaration/get-declaration/${id}/`, config)
      .then(res => res.json())
      .then(result => {
        const item = result[0]
        const detail = {
          id: item.id,
          title: item.title,
          content: item.content,
          date: item.createDate.slice(0, 10),
          time: item.createDate.slice(11, 16),
        }
        const medias = item.media.length > 0 ? item.media : []
        const files = medias.map(item => {
          return {
            id: item.id,
            media: item.file,
          }
        })
        setInfo(detail)
        setInfoMedia(files)
      })
  }

  // handle download
  const handleDownload = (media, index) => {
    const fileUrl = `http://localhost:3000${media}`
    const fileName = "ضمیمه" + index + 1
    saveAs(fileUrl, fileName)
  }

  React.useEffect(() => {
    setLoading(true)
    getDetail()
    setLoading(false)
  }, [])

  return !loading ? (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="اطلاعیه‌ها" breadcrumbItem="مشاهده اطلاعیه‌ها" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title messageCardTitle border-bottom pb-2">
                    {info ? info.title : " "}
                  </h4>

                  {/* Send Messages */}
                  <Row className="justify-content-start">
                    <Col className="col-12">
                      <div className="messagecard send shadow-sm">
                        <Row className="mx-0">
                          <Col className="col-12 messageTitle">
                            <Row className="justify-content-between mx-0">
                              <Col className="col-auto ps-0">
                                <Row>
                                  <Col className="col-auto">
                                    <img
                                      src={speakerNotification}
                                      alt=""
                                      height="50"
                                      className="mx-auto d-block"
                                    />
                                  </Col>
                                  <Col className="col-auto my-auto">
                                    <Row>
                                      <Col className="col-12 ps-1">
                                        <div className="messageUserName fw-semibold">
                                          پیام سیستم
                                        </div>
                                      </Col>
                                      <Col className="col-12 ps-1">
                                        <div className="messageWhoIS">
                                          اورانوس
                                        </div>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className="col-auto my-auto">
                                <Row>
                                  <Col className="col-12">
                                    <div className="messageDate text-end">
                                      {" "}
                                      <div> {info ? info.date : " "}</div>
                                      <div> {info ? info.time : " "}</div>
                                      {/* in icon Deliver hast */}
                                      {/* <i className="bx bx-check messageDeliverIcon"></i> */}
                                      {/* <i className="bx bx-check-double messageDeliverIcon"></i> */}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                          <Col className="col-12 px-0">
                            <p className="messageText border-bottom">
                              {info ? info.content : " "}
                            </p>
                          </Col>
                          <Col className="col-12 px-0">
                            <Row className="mx-0">
                              {infoMedia.map((item, index) => {
                                return (
                                  <Col
                                    className="col-12 col-sm-auto me-2 attachedBox messageDownloadArea"
                                    key={index}
                                  >
                                    <a
                                      onClick={() =>
                                        handleDownload(item.media, index)
                                      }
                                      download={item.file}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Row className="justify-content-start ">
                                        <Col className="col-auto px-0">
                                          <img
                                            src={AttachedImg}
                                            alt=""
                                            height="50"
                                          />
                                        </Col>
                                        <Col className="col-auto my-auto pe-2">
                                          <div className="fw-semibold attachedBoxText mb-0">
                                            ضمیمه {index + 1}
                                          </div>
                                          <ul className="list-unstyled hstack gap-2 mb-0">
                                            <li>
                                              <span className="fw-light attachedBoxText">
                                                دانلود
                                              </span>
                                            </li>
                                          </ul>
                                        </Col>
                                      </Row>
                                    </a>
                                  </Col>
                                )
                              })}
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default DetailNotification
