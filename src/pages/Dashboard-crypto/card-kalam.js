import React from "react"
import { Row, Col, Card } from "reactstrap"
import axios from "axios";

//Import Image
import features from "../../assets/images/12-ui (2).png"
import { result } from "lodash";

const CardHadis = () => {
  const [content, setContent] = React.useState({});
  const [loadig, setLoading] = React.useState(false);
  const get = () => {
    fetch(`https://api.keybit.ir/hadis/`).then(res => res.json()).then(result => { let data = result.result; setContent({ person: data.person, text: data.text, source: data.source }) });
  };

  React.useEffect(() => {
    setLoading(true);
    get();
    setLoading(false);
  }, []);


  return !loadig ? (
    <React.Fragment>
      <Card className="bg-success bg-soft border border-success rounded">
        <div>
          <Row>
            <Col lg="9" sm="8">
              <div className="p-4">
                <h6 className="text-muted">
                  <i
                    className={
                      "bx bx-book h2 text-success align-middle mb-0 me-1"
                    }
                  />{" "}
                  حدیث روز
                </h6>
                <div className="mt-3">
                  <p className="mb-1 font-size-14">
                    <i className="mdi mdi-circle-medium align-middle text-success me-1" />{" "}
                    {content.person || null} می فرمایند :
                  </p>
                  <p className="mb-3 font-size-14">
                    <i className="mdi mdi-circle-medium align-middle text-success me-1" />{" "}
                    {content.text || null}
                  </p>
                  <p className="mb-0 font-size-12">
                    <i className="mdi mdi-circle-medium align-middle text-success me-1" />{" "}
                    منبع : {content.source || null}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg="3" sm="4" className="align-self-center">
              <div>
                <img src={features} alt="" width={185} className="img-fluid d-block" />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </React.Fragment>
  ) : (<></>)
}

export default CardHadis
