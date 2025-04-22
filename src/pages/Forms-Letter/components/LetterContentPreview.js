import React from "react"
import { Row, Col } from "reactstrap"
import LetterImg from "@/assets/images/companies/uranus-letter-empty.jpg"
import SignitureImg from "@/assets/images/companies/signiture.png"

function LetterContentPreview({ pages = [], statusLabel, userInfo }) {
  return (
    <Row
      className="justify-content-center"
      style={{ backgroundColor: "transparent", backgroundImage: "none" }}
    >
      <Col
        className="col-12 col-sm-auto justify-content-center"
        style={{ maxHeight: "630px", overflow: "auto" }}
      >
        {pages.map((pageContent, pageIndex) => (
          <div
            className="letterStyleArea position-relative text-center mt-3"
            key={pageIndex}
          >
            <img src={LetterImg} alt="letter" className="img-fluid" />

            <div className="topLeftLetterhead" style={{ marginLeft: "25px" }}>
              <div className="index date" style={{ marginTop: "12px" }}>
                <span>{/* تاریخ */}</span>
              </div>
              <div className="index letterNo">
                <span>{/* شماره نامه */}</span>
              </div>
              <div className="index attach">
                <span>{/* پیوست */}</span>
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
                  className="preview mt-2"
                  dangerouslySetInnerHTML={{ __html: pageContent }}
                />

                {statusLabel === "امضاشده" &&
                  pageIndex === pages.length - 1 && (
                    <div className="bottomLeftLetterhead">
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src={SignitureImg}
                        alt="Signature"
                        className="img-fluid"
                      />
                      <p>با درود و احترام</p>
                      <p>{(userInfo && userInfo.name ? userInfo.name : "") + " " + (userInfo && userInfo.family ? userInfo.family : "")}</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </Col>
    </Row>
  )
}

export default LetterContentPreview
