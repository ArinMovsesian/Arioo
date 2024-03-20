import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { Col, Layout, Menu, Row, Icon, Collapse } from "antd";

const { Header, Content } = Layout;
const Panel = Collapse.Panel;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const customPanelStyle = {
  background: "transparent",
  borderRadius: 2,
  marginBottom: 8,
  overflow: "hidden",
  border: "solid 1px #9F9F9F"
};

class FAQ extends React.Component{
  render() {
    return (
      <Layout>
        <Content className="faq_main">
          <div className="faq_container">
            <Row>
              <Col xs={24} sm={24} md={12} lg={11} xl={10}>
                <section className="faq_left">
                  <h1>New Post</h1>
                  <ul>
                    <li>
                      <a href="#firstSection">chat, group, channel</a>
                    </li>
                    <li>
                      <a href="#secondSection">share, forward, reply</a>
                    </li>
                    <li>
                      <a href="#thirdSection">music player</a>
                    </li>
                    <li>
                      <a href="#fourthSection">create new</a>
                    </li>
                    <li>
                      <a href="#fifthSection">api</a>
                    </li>
                  </ul>
                </section>
              </Col>
              <Col xs={24} sm={24} md={12} lg={13} xl={14}>
                <section className="faq_right" id="firstSection">
                  <h1 className="faq_title">chat, group, channel</h1>
                  <div className="faq_line">
                    <div></div>
                  </div>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                      <p>{text}</p>
                      <
                      /Panel>
                      <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                  </Collapse>
                </section>
                <section className="faq_right" id="secondSection">
                  <h1 className="faq_title">share, forward, reply</h1>
                  <div className="faq_line">
                    <div></div>
                  </div>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                      <p>{text}</p>
                      <
                      /Panel>
                      <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                  </Collapse>
                </section>
                <section className="faq_right" id="thirdSection">
                  <h1 className="faq_title">music player</h1>
                  <div className="faq_line">
                    <div></div>
                  </div>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                      <p>{text}</p>
                      <
                      /Panel>
                      <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                  </Collapse>
                </section>
                <section className="faq_right" id="fourthSection">
                  <h1 className="faq_title">create new</h1>
                  <div className="faq_line">
                    <div></div>
                  </div>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                      <p>{text}</p>
                      <
                      /Panel>
                      <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                  </Collapse>
                </section>
                <section className="faq_right" id="fifthSection">
                  <h1 className="faq_title">api</h1>
                  <div className="faq_line">
                    <div></div>
                  </div>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                      <p>{text}</p>
                      <
                      /Panel>
                      <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                        <p>{text}</p>
                      </Panel>
                  </Collapse>
                </section>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
  )
  }
  }
  export default FAQ;
