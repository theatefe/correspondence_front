import React, { useState } from "react"
import { Row, Card, CardBody, Col, CardTitle } from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { getInvoiceDetail as onGetInvoiceDetail } from "../../../store/invoices/actions"
import draftToHtml from "draftjs-to-html"
//import images
import correspondence from "../../../assets/images/icons/correspondence.png"
import LetterImg from "../../../assets/images/companies/talie-letter-empty.jpg"

function DetailsSection({ letterDetail, letterTransmition }) {
  // STATES HOOK ******************************
  const [loading, setLoading] = useState()
  const [htmlContent, setHtmlContent] = React.useState()
  const [accordionStates, setAccordionStates] = React.useState(0)
  const linesPerPage = 6
  const dispatch = useDispatch()
  const params = letterDetail
  // HANDLE PRINT *****************************
  const handleCustomPrint = () => {
    const printContent = document.getElementById("print-content")
    if (!printContent) return
    const printWindow = window
    const style = `
    <style>
      body {
        margin: 0;
        padding: 0;
        direction: rtl;
        font-size: 10px !important;
      }

      .img-fluid {
        margin: 0;
        padding: 0;
        position: absolute;
        object-fit: cover;
        z-index: 0;
      }

      .topLeftLetterhead {
        font-family: "BNazanin" !important;
        font-size: 8px !important;
        direction: ltr;
        position: relative;
        z-index: 10;
        padding-top: 20px;
        padding-left: 10px;
        color: #000;
      }

      .letterText {
        font-family: "BNazanin" !important;
        font-size: 10px !important;
        position: relative;
        z-index: 10;
        padding: 10px 2px 50px 2px;
        color: #000;
      }

      .centerLetterhead {
        position: relative;
        z-index: 10;
        padding: 20px 30px;
      }

      .bottomLeftLetterhead {
      font-family: "BNazanin" !important;
      font-size: 8px !important;
      direction: ltr;
      text-align: left;
      margin-top: 30px;
      margin-left: 40px;
      position: relative;
      z-index: 10;
      display: block; /* مهم */
    }

    .bottomLeftLetterhead img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      display: block; /* خیلی مهم! باعث میشه pها زیر تصویر قرار بگیرن */
      margin-bottom: 5px;
    }

    .bottomLeftLetterhead p {
      margin-top: 0px;
      margin-bottom: 3px;
      display: block;
    }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .bottomLeftLetterhead {
          page-break-inside: avoid;
        }
      }
    </style>
  `

    printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <script src="https://cdn.tailwindcss.com/3.3.2"></script>
        ${style}
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
  // LINES PAGES *******************************
  // چک کنید که letterDetail.content مقدار داشته باشد
  const plainText = letterDetail.content
    ? letterDetail.content
        .replace(/<[^>]*>?/gm, "") // حذف تگ‌های HTML
        .split("\n") // تقسیم محتوا به خط‌ها
        .filter(line => line.trim() !== "") // حذف خطوط خالی
    : []
  // تقسیم محتوای نامه به صفحات با 6 خط در هر صفحه
  const pages = []
  for (let i = 0; i < plainText.length; i += linesPerPage) {
    pages.push(plainText.slice(i, i + linesPerPage).join("\n"))
  }
  const t_col1 = index => {
    const newAccordionStates = [...accordionStates]
    newAccordionStates[index] = !newAccordionStates[index]
    setAccordionStates(newAccordionStates)
  }
  // USE EFFECT ************************************
  React.useEffect(() => {
    const fetchInvoiceDetail = async () => {
      setLoading(true)
      try {
        const invoiceId = params?.id || 1 // در صورت عدم وجود id در params، مقدار پیش‌فرض 1 استفاده می‌شود
        await dispatch(onGetInvoiceDetail(invoiceId))

        if (letterDetail?.content) {
          const contentFromDatabase = letterDetail.content
          const text = JSON.parse(contentFromDatabase)
          const htmlContent = draftToHtml(text)
          setHtmlContent(htmlContent)
        }
      } catch (error) {
        console.error("Error fetching invoice details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoiceDetail()
  }, [params?.id, dispatch, letterDetail])
  // RETURN ****************************************
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
              <button
                onClick={() => handleCustomPrint()}
                className="btn btn-soft-secondary"
              >
                {" "}
                چاپ‌ نامه <i className="mdi mdi-download"></i>
              </button>
            </div>
          </CardBody>
          <CardBody>
            {/* <h5 className="fw-semibold mb-3">Description</h5> */}
            <Row className="justify-content-center">
              {letterDetail.set == "خارجی" ? (
                <>
                  <Col className="col-12 col-sm-auto d-flex justify-content-center pb-4">
                    <div
                      className="letterStyleArea position-relative text-center"
                      id="letter"
                    >
                      <img src={LetterImg} alt="" className="img-fluid" />
                      <div className="topLeftLetterhead">
                        <div className="index date">
                          <span>تاریخ</span> :{" "}
                          <span dir="rtl">
                            {letterDetail.createDate
                              ? letterDetail.createDate
                              : null}
                          </span>
                        </div>
                        <div className="index letterNo mt-2 mb-1">
                          <span>شماره نامه</span> :{" "}
                          <span>
                            {letterDetail && letterDetail.number != null
                              ? letterDetail.number
                              : "*****"}
                          </span>
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
                          {letterDetail?.status !== "ثبت شده" ? (
                            letterDetail?.Signature?.mediaUrl ? (
                              <>
                                <img
                                  src={letterDetail.Signature.mediaUrl}
                                  alt="امضای نامه"
                                  className="img-fluid"
                                />
                                <span>
                                  {letterDetail.signer?.fullName ||
                                    "نام نامشخص"}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted">
                                امضا موجود نیست
                              </span>
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Col>
                </>
              ) : (
                <>
                  <Col
                    className="col-12 col-sm-auto justify-content-center"
                    style={{ maxHeight: "630px", overflow: "auto" }}
                  >
                    {pages.map((pageContent, pageIndex) => (
                      <div
                        className="letterStyleArea position-relative text-center mt-3"
                        key={pageIndex}
                      >
                        <div style={{ minHeight: "100%" }} id="print-content">
                          <img src={LetterImg} alt="" className="img-fluid" />

                          <div className="topLeftLetterhead mt-1 z-10">
                            <div className="index date">
                              <span>
                                {letterDetail.createDate
                                  ? letterDetail.createDate
                                  : "-"}
                              </span>
                            </div>
                            <div className="index letterNo">
                              <span>
                                {letterDetail.number
                                  ? letterDetail.number
                                  : "*****"}
                              </span>
                            </div>
                          </div>

                          <div className="centerLetterhead text-start mt-5">
                            <div
                              className="letterText"
                              style={{
                                fontFamily: "BNazanin",
                                fontSize: "14px",
                                overflow: "hidden",
                                maxHeight: "calc(100% - 50px)",
                              }}
                            >
                              {pageIndex === 0 && (
                                <h4 className="text-center mb-3">بسمه تعالی</h4>
                              )}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent,
                                }}
                              />

                              {letterDetail?.status !== "ثبت شده" &&
                                letterDetail?.Signature?.mediaUrl && (
                                  <div className="bottomLeftLetterhead mb-5 d-block ltr">
                                    <img
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={letterDetail.Signature.mediaUrl}
                                      alt="امضای نامه"
                                      className="img-fluid"
                                    />
                                    <p> {"با درود و احترام"} </p>
                                    <p>{letterDetail.signer?.fullName}</p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Col>
                </>
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
