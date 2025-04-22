import React from "react"
import { Row, Col, Card } from "reactstrap"

//Import Image
import features from "../../assets/images/crypto/features-img/img-1.png"

const CardKalam = () => {
  return (
    <React.Fragment>
      <Card className="bg-success bg-soft">
        <div>
          <Row>
            <Col lg="9" sm="8">
              <div className="p-4">
                <h5 className="text-primary">حدیث روز</h5>
                <div className="mt-4">
                  <p className="mb-1">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1" />{" "}
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                  </p>
                  <p className="mb-1">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1" />{" "}
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1" />{" "}
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                  </p>
                </div>
              </div>
            </Col>
            <Col lg="3" sm="4" className="align-self-center">
              <div>
                <img src={features} alt="" className="img-fluid d-block" />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default CardKalam
