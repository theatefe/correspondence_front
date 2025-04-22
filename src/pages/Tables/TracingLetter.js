import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { Container, Row, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import { Tree, TreeNode } from 'react-organizational-chart';

import FlowRenderer from "./FlowRenderer"

import go from "gojs"
// import { ReactDiagram } from 'gojs-react';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

const style = {
  padding: '5px',
  borderRadius: '8px',
  display: 'inline-block',
  border: '1px solid red',
}
const TracingLetter = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  document.title = "ردیابی نامه - سامانه مکاتبات"
  const [myDiagram, setMyDiagram] = useState(null) // Initialize myDiagram as null
  const [data, setData] = useState([]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="نامه ها" breadcrumbItem="مشاهده نامه" />
          {/* <div className="App">
            <h2>React Flow Renderer</h2>
            <FlowRenderer />
            <hr />
            <h2>Not implemented</h2>
            Selected state and validation (React Diagrams).
            <hr />
          </div> */}
          <Tree
            lineWidth={'2px'}
            lineColor={'green'}
            lineBorderRadius={'10px'}
            label={<div style={style}>Root</div>}
          >
            <TreeNode label={<div style={style} >Child 1</div>}>
              <TreeNode label={<div style={style} >Child 1</div>}>
                <TreeNode label={<div style={style} >Child 1</div>}>

                </TreeNode>
              </TreeNode>

            </TreeNode>


          </Tree>

        </Container>
      </div>
    </React.Fragment>
  );
}

export default TracingLetter
