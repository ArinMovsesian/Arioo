import React from "react";
import { Layout, Row, Col, Menu, message } from "antd";
import "./index.css";
// import logoSvg from "../../../assets/svgs/Group 1367.png";
// import {} from "react-router-dom";

import logoariooNew from "../../../assets/svgs/logoNew.svg";
import { Link } from "react-router-dom";
// import menue from "../../../assets/svgs/menu.svg";
// import closeBtn from "../../../assets/svgs/closebtn.svg";


const { Header, Content } = Layout;

class Footer extends React.Component {

  render() {
    return (
      <Layout>
        <Content className="desktopviewFooter">
          <div className="footer">
            <div className="stars-logo-container">
              <Link to="/">
                <img src={logoariooNew} alt="" style={{ width: "52px", height: "33px", margin: "30px" }}/>
              </Link>
              <div className="stars-logo-txt"><span>Stars app</span></div>
            </div>
            <ul className="footer-list">
              {/*<li><span><Link to="/" style={{ color: "inherit" }}>Home</Link></span></li>*/}
              {/*<li><span><Link to='/chat' style={{ color: "inherit" }}> Signin / Register </Link></span></li>*/}
              <li><span><Link to="/blog" style={{ color: "inherit" }}>blog</Link></span></li>
              <li onClick={() => message.info("Coming Soon")} style={{ cursor: "pointer" }}><span>chat room</span></li>
              <li><span><Link to='/aboutus' style={{ color: "inherit" }}>about</Link></span></li>
              <li><span><Link to='/faq' style={{ color: "inherit" }}>FAQ</Link></span></li>
              <li><span><Link to='/contactus' style={{ color: "inherit" }}>contact</Link></span></li>
            </ul>
          </div>
        </Content>
        <Content className="mobileviewFooter">
          <div style={{ textAlign: "center" }}>
            <Link to="/">
              <img src={logoariooNew} alt="" style={{ width: "52px", height: "33px", margin: "30px" }}/>
            </Link>
          </div>
          <Row>
            <Col span={12}>
              <ul>
                {/*<li><Link to="/" style={{ color: "inherit" }}>Home</Link></li>*/}
                {/*<li><Link to='/chat' style={{ color: "inherit" }}> Signin / Register </Link></li>*/}
                <li><Link to="/blog" style={{ color: "inherit" }}>blog</Link></li>
                <li><Link to='/faq' style={{ color: "inherit" }}>FAQ</Link></li>
                <li>-</li>
              </ul>
            </Col>
            <Col span={12}>
              <ul>
                <li onClick={() => message.info("Coming Soon")} style={{ cursor: "pointer" }}>chat room</li>
                <li><Link to='/aboutus' style={{ color: "inherit" }}>about</Link></li>
                <li><Link to='/contactus' style={{ color: "inherit" }}>contact</Link></li>
              </ul>
            </Col>
          </Row>
        </Content>
      </Layout>

    );
  }
}

export default Footer;
