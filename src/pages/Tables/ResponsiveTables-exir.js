import React from "react"

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
  Label,
} from "reactstrap"

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
//  import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ResponsiveTablesExir = () => {
  //meta title
  document.title = "Responsive Table | Skote - React Admin & Dashboard Template"
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Responsive Table" />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle>Example </CardTitle>
                  <CardSubtitle className="mb-3">
                    This is an experimental awesome solution for responsive
                    tables with complex data.
                  </CardSubtitle>

                  <div className="table-rep-plugin">
                    <div className="table-responsive mb-0">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">3</th>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ResponsiveTablesExir
