import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

const Announcements = () => {
  const token = localStorage.getItem("token");
  const [announcements, setAnnouncements] = React.useState([]);

  // get Announcements **************
  const getAnnouncements = () => {
    // const config = {
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     accept: 'application/json'
    //   }
    // };
    //   .then(response => response.json())
    //   .then((result) => {
    //     const list = result.map((item) => {
    //       return {
    //         id: item.id,
    //         title: item.title,
    //         content: item.content,
    //         createdAt: item.createDate,
    //       }
    //     })
    //     setAnnouncements(list);
    //   })
  };

  React.useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <React.Fragment>
      <Card className=" bg-soft border border-primary rounded">
        <CardBody>
          <CardTitle className="mb-4 border-bottom p-2 ">اطلاعیه ها</CardTitle>
          <ul className="verti-timeline list-unstyled ">
            {announcements && announcements.map((item, key) => (
              <li className="event-list active" key={key}>
                <div className="event-timeline-dot">
                  <i className="bx bx-message-dots font-size-18 bx-flashing" />
                </div>
                <div className="flex-shrink-0 d-flex">
                  <div className="me-3">
                    <h5 className="font-size-14">
                      {item.title}
                      <i className="bx bx-chevrons-left font-size-16 text-primary align-middle ms-2" />
                    </h5>
                  </div>
                  <div className="flex-grow-1">
                    <div>{item.content}</div>
                  </div>
                </div>
              </li>
            )

            )}
          </ul>
          {/* <div className="text-center mt-4">
            <Link
              to="#"
              className="btn btn-primary waves-effect waves-light btn-sm"
            >
              View More <i className="mdi mdi-arrow-right ms-1" />
            </Link>
          </div> */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Announcements;