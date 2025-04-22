import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Row, Card, CardBody, Col, CardTitle, Collapse } from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { isEmpty, map, size } from "lodash"
import { getInvoiceDetail as onGetInvoiceDetail } from "../../../store/invoices/actions"

//import images
import correspondence from "../../../assets/images/icons/correspondence.png"
import LetterImg from "../../../assets/images/companies/uranus-letter-empty.jpg"
import SignitureImg from "../../../assets/images/companies/signiture.png"
import ReferralImg from "../../../assets/images/icons/referralLetter.png"
import TranscriptImg from "../../../assets/images/icons/transcriptLetter.png"
import AttachedImg from "../../../assets/images/icons/attachedImg.png"

import classnames from "classnames"

function DetailsSection(props) {
  const letterDetail = props.letterDetail
  const letterTransmition = props.letterTransmition
  const [loading, setLoading] = useState()
  const [col1, setcol1] = useState(true)

  const t_col1 = () => {
    setcol1(!col1)
  }

  const dispatch = useDispatch()
  const { invoiceDetail } = useSelector(state => ({
    invoiceDetail: state.invoices.invoiceDetail,
  }))
  const params = letterDetail
  React.useEffect(() => {
    setLoading(true)
    if (params && params.id) {
      dispatch(onGetInvoiceDetail(params.id))
    } else {
      dispatch(onGetInvoiceDetail(1)) //remove this after full integration
    }
    setLoading(false)
  }, [dispatch, onGetInvoiceDetail])

  return !loading ? (
    <React.Fragment>
      <Col xl={9}>
        <Card>
          <CardBody className="border-bottom d-print-none">
            <div className="d-flex">
              <img src={correspondence} alt="" height="50" />
              <div className="flex-grow-1 ms-3">
                <ul className="list-unstyled hstack gap-2 mb-0">
                  <li>
                    <span className="fw-light">موضوع نامه:</span>
                  </li>
                </ul>
                <h5 className="fw-semibold mt-2">
                  {letterDetail.title || null}
                </h5>
              </div>
            </div>
          </CardBody>
          <CardBody>
            {/* <h5 className="fw-semibold mb-3">Description</h5> */}
            <Row className="justify-content-center">
              <Col className="col-12 col-sm-auto d-flex justify-content-center pb-4">
                <div
                  className="letterStyleArea position-relative text-center"
                  id="letter"
                >
                  <img src={LetterImg} alt="" className="img-fluid" />
                  <div className="topLeftLetterhead">
                    <div className="index date">
                      <span>تاریخ</span> :{" "}
                      <span dir="rtl">{letterDetail.createDate || null}</span>
                    </div>
                    <div className="index letterNo mt-2 mb-1">
                      <span>شماره نامه</span> :{" "}
                      <span>
                        {letterDetail.number != "null"
                          ? letterDetail.number
                          : "*****"}
                      </span>
                    </div>
                    {/* <div className="index classification">
                      <span>طبقه‌بندی</span> : <span>عادی</span>
                    </div>
                    <div className="index urgency">
                      <span>فوریت</span> : <span>آنی</span>
                    </div> */}
                    <div className="index attach">
                      <span>پیوست</span> :{" "}
                      <span>{letterDetail.checkAttachment || null}</span>
                    </div>
                  </div>
                  <div className="centerLetterhead text-start">
                    <div className="letterText">
                      <p>
                        <center>بسمه تعالی</center>
                      </p>
                      <p>{letterDetail.content || null}</p>
                    </div>
                    <div className="bottomLeftLetterhead">
                      {letterDetail.submiterSignature != null ? (
                        <img
                          src={`http://localhost:3000${letterDetail.submiterSignature}`}
                          alt=""
                          className="img-fluid"
                        />
                      ) : (
                        <></>
                      )}
                      {letterDetail.submiter != null ? (
                        <span>{letterDetail.submiter.fullName}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </Col>

              {letterTransmition && letterTransmition.length > 0 ? (
                <Col className="col-12 pt-4 border-top d-print-none">
                  <CardTitle className="h4 fs-5">
                    جزئیات ارجاع / رونوشت
                  </CardTitle>
                  <p className="card-title-desc">
                    در لیست زیر شما می توانید ارجاع و رونوشت هایی برای شما ارسال
                    شده است را مشاهده کنید.
                  </p>
                  <div className="accordion" id="accordion">
                    {letterTransmition &&
                      letterTransmition.map((item, index) => (
                        <div className="accordion-item" key={index}>
                          <h2 className="accordion-header" id="headingOne">
                            <button
                              className={classnames(
                                "accordion-button",
                                "fw-medium",
                                {
                                  collapsed: !col1,
                                }
                              )}
                              type="button"
                              onClick={t_col1}
                              style={{ cursor: "pointer" }}
                            >
                              <Row>
                                <Col className="d-none d-sm-block col px-0">
                                  {" "}
                                  <img
                                    src={
                                      item.status == 1
                                        ? ReferralImg
                                        : TranscriptImg
                                    }
                                    alt=""
                                    className="img-fluid w-100"
                                    style={{
                                      maxHeight: "50.49px",
                                      maxWidth: "50.49px",
                                    }}
                                  />
                                </Col>
                                <Col className="col-auto my-auto">
                                  <h5 className="fw-semibold mb-1 text-start">
                                    {item.sender}
                                    {"  "}
                                    <span
                                      className={
                                        item.status == 1
                                          ? "badge-soft-nilii badge bg-secondary"
                                          : "badge-soft-kaleqazi badge bg-secondary"
                                      }
                                    >
                                      {item.status == 1 ? " ارجاع" : " رونوشت"}
                                    </span>
                                  </h5>
                                  <ul className="list-unstyled hstack text-start gap-2 mb-0 mt-2">
                                    <li>
                                      <span className="fw-light">
                                        تاریخ :{" "}
                                        <span dir="rtl">
                                          {item.createDate.slice(0, 10)} - ساعت
                                          :{" "}
                                        </span>
                                        {item.createDate.slice(11, 16)}
                                      </span>
                                    </li>
                                  </ul>
                                </Col>
                              </Row>
                            </button>
                          </h2>
                          <Collapse
                            isOpen={col1}
                            className="accordion-collapse"
                          >
                            <div className="accordion-body">
                              <Row className="mx-0 w-100">
                                <div className="col-12 px-0">
                                  <strong className="text-dark">
                                    توضیحات:
                                  </strong>
                                  <p className="fw-light mt-1 ">
                                    {item.description}
                                  </p>
                                  {item.files && item.files.length > 1 ? (
                                    <div className="letterAttachments">
                                      <strong className="text-dark">
                                        فایل پیوست:
                                      </strong>
                                      <Row className="mx-0 mt-2">
                                        {item.files.map((item, index) => {
                                          ;<Col
                                            className="col-12 col-sm-auto attachedBox"
                                            key={index}
                                          >
                                            <Link
                                              to={`http://localhost:3000${item.file}`}
                                            >
                                              <Row className="justify-content-start">
                                                <Col className="col-auto px-0">
                                                  <img
                                                    src={AttachedImg}
                                                    alt=""
                                                    height="50"
                                                  />
                                                </Col>
                                                <Col className="col-auto my-auto pe-2">
                                                  <div className="fw-semibold mb-0">
                                                    ضمیمه {index + 1}
                                                  </div>
                                                  <ul className="list-unstyled hstack gap-2 mb-0">
                                                    <li>
                                                      <span className="fw-light">
                                                        دانلود
                                                      </span>
                                                    </li>
                                                  </ul>
                                                </Col>
                                              </Row>
                                            </Link>
                                          </Col>
                                        })}
                                      </Row>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </Row>
                            </div>
                          </Collapse>
                        </div>
                      ))}
                  </div>
                </Col>
              ) : (
                <> </>
              )}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  ) : (
    <></>
  )
}

export default DetailsSection
