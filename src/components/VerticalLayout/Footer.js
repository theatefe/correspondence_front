import React from "react"
import { Container, Row, Col } from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"


const Footer = props => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            {/* <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                
              </div>
            </Col> */}
           <Col className="col-12 text-center">
              {new Date().getFullYear()} © {props.t("ExirPoyan")}
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default withTranslation()(Footer)
