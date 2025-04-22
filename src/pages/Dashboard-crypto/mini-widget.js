import PropTypes from 'prop-types'
import React from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import calendarImage from "../../assets/images/calendar.png";
import oghatsharee from "../../assets/images/oghat-sharee.png";

const MiniWidget = () => {
  const [fullDate, setFullDate] = React.useState({});
  const [owghat, setOwghat] = React.useState({});
  const [loadig, setLoading] = React.useState(false);
  const getDate = () => {
    fetch(`https://api.keybit.ir/time/`).then(res => res.json())
      .then(result => {
        let data = result.date;
        var weekday = data.weekday.name;
        var day = data.day.name;
        var month = data.month.name;
        var year = data.year.name;
        setFullDate({ date: weekday + ' ' + day + ' ' + month + ' ' + year, event: data.day.events.local ? data.day.events.local.text : '' });
        fetch(`https://api.keybit.ir/owghat/?city=اراک`).then(res => res.json())
          .then(result => {
            let data = result.result;
            setOwghat({
              azansobh: data.azan_sobh, azanZohr: data.azan_zohr, azanMaghreb: data.azan_maghreb, toloAftab: data.tolu_aftab, ghorobAftab: data.ghorub_aftab
            });
            setLoading(false);
          })
      });
  };

  React.useEffect(() => {
    setLoading(true);
    getDate();

    setLoading(false);
  }, []);

  return !loadig ? (
    <React.Fragment>
      <Col sm="6">
        <Card className='bg-info bg-soft border border-info rounded'>
          <CardBody>
            <Row>
              <Col xs="8">
                <h6 className="text-muted mb-3">
                  <i
                    className={
                      "bx bx bx-calendar h2 text-info align-middle mb-0 me-1"} />{" "}
                  تقویم روز شمار
                </h6>

                <div>
                  <i className={"mdi  mdi-menu-left ms-1  text-info "} /> {" "}
                  <h6 className='mb-3' style={{ display: 'inline' }}> امروز {fullDate.date}</h6>
                  <p className="mb-0 font-size-12 text-justify">
                    {fullDate.event}

                  </p>
                </div>
              </Col>
              <Col xs="4">
                <div>
                  <img src={calendarImage} alt="" className="img-fluid d-block" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="6">
        <Card className='bg-warning bg-soft border border-warning rounded'>
          <CardBody>
            <Row>
              <Col xs="7">
                <div>
                  <h6 className="text-muted mb-3">
                    <i
                      className={
                        "bx bx bxs-sun h2 text-warning align-middle mb-0 me-1"
                      }
                    />{" "}
                    اوقات شرعی
                  </h6>
                  <p className="mb-1 font-size-12">
                    <i className={"mdi mdi-menu-left ms-1  text-warning"} /> {" "}
                    اذان صبح : {owghat.azansobh}
                  </p>
                  <p className="mb-1 font-size-12">
                    <i className={"mdi mdi-menu-left ms-1  text-warning"} /> {" "}
                    اذان ظهر: {owghat.azanZohr}
                  </p>
                  <p className="mb-1 font-size-12">
                    <i className={"mdi mdi-menu-left ms-1  text-warning"} /> {" "}
                    غروب آفتاب: {owghat.ghorobAftab}
                  </p>
                  <p className="mb-2 font-size-12">
                    <i className={"mdi mdi-menu-left ms-1  text-warning"} /> {" "}
                    اذان مغرب: {owghat.azanMaghreb}
                  </p>
                </div>
              </Col>
              <Col xs="5">
                <div className='mt-4'>
                  <img src={oghatsharee} alt="" width={150} className="img-fluid d-block" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>


    </React.Fragment>
  ) : (<></>)
}

export default MiniWidget

MiniWidget.propTypes = {
  reports: PropTypes.array
}