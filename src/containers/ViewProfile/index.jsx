import React from "react";
import axios from "axios/index";
import { v4 } from "uuid";
import { Layout, Menu, Icon, Button, Row, Col } from "antd";
import { history } from "../../helpers/history";
import { API_ROOT } from "../../helpers/apiConfig";
import "./index.css";
import downloadSvg from "../../assets/svgs/ic_action_download.svg";
import twitterSvg from "../../assets/svgs/twitter-icons.svg";
import instagramSvg from "../../assets/svgs/instagram.svg";
import facebookSvg from "../../assets/svgs/facebook.svg";
import telegramSvg from "../../assets/svgs/telegram.svg";
import websiteSvg from "../../assets/svgs/website.svg";
import regitrationSvg from "../../assets/svgs/Registration.svg";
import useridSvg from "../../assets/svgs/id-icons---free-download--png-and-svg.svg";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class ViewProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apps: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ],
      celebrities: [
        { id: 1, name: "Gal gadot", member: "2.5 M Member" },
        { id: 2, name: "Gal gadot", member: "2.5 M Member" },
        { id: 3, name: "Gal gadot", member: "2.5 M Member" },
        { id: 4, name: "Gal gadot", member: "2.5 M Member" },
        { id: 5, name: "Gal gadot", member: "2.5 M Member" }
      ]
    };

  }


  render() {
    return (
      <div className="profile-view-container">
        <Layout>
          <Header className="header">
            <div className="logo"/>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "34px", borderBottom: "0" }}
            >
              <Menu.Item key="1">Home</Menu.Item>
              <Menu.Item key="2">App</Menu.Item>
              <Menu.Item key="4">Blog</Menu.Item>
              <Menu.Item key="5">Contact us</Menu.Item>
              <Menu.Item key="6">Feedback</Menu.Item>
              <Menu.Item key="7">Chatroom</Menu.Item>
              <Menu.Item key="8">Registration</Menu.Item>
              <Menu.Item key="9">Signin</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={400} style={{ background: "#fff" }}>
              <div className="base-info">
                <div className="profile-image-container"><img/></div>
                <div className="info">
                  <span>Zahra Ebrahimi</span>
                  <a>@zahra_ebrahimi</a>
                </div>
              </div>
              <div className="profile-content">
              <span>
                is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when www.behance.com printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              </span>
              </div>
              <ul className="list-info">
                <li>
                  <img src={regitrationSvg} alt="registration-icon"/>
                  <div>
                    <span className="id-date-info">Date of registration</span>
                    <span className="p-date">Jun 2017</span>
                  </div>
                </li>
                <li>
                  <img src={useridSvg} alt="userid-icon"/>
                  <div>
                    <span className="id-date-info">Social IDs</span>
                    {/*<span className="p-date">Jun 2017</span>*/}
                  </div>
                </li>
              </ul>
              <div className="social-icons">
                <a>
                  <img src={twitterSvg} alt="twitter-icon"/>
                </a>
                <a>
                  <img src={instagramSvg} alt="instagram-icon"/>
                </a>
                <a>
                  <img src={facebookSvg} alt="facebook-icon"/>
                </a>
                <a>
                  <img src={telegramSvg} alt="telegram-icon"/>
                </a>
                <a>
                  <img src={websiteSvg} alt="website-icon"/>
                </a>
              </div>
              <div className="send-msg-profile">
                <Button>Send Messages</Button>
              </div>
            </Sider>
            <Layout>
              <Content style={{ background: "#fff", padding: 0, margin: 0, minHeight: 280 }}>
                <Row className="store-container">
                  <Col span={14}>
                    <div className="profile-favorite-app">
                      <div className="store-menu">
                        <span>Zahra's favorite apps & game</span>
                        <a>All</a>
                      </div>
                      <div className="app-container">
                        <ul className="media-list">
                          {this.state.apps.map((app) =>
                            <li key={app.id}>
                              <div className="doc-info-wrap">
                                <div className="media-photo">
                                  <img src={downloadSvg} alt="download" className="download-icon"/>
                                </div>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col span={10}>
                    <div className="profile-celebrities">
                      <div className="cel-menu">
                        <span>Celebrities in Stars</span>
                        <a>All</a>
                      </div>
                      <div className="celebrities-col">
                        <ul className="cel-list">
                          {this.state.celebrities.map((cel) =>
                            <li key={cel.id}>
                              <div className="cel-info-wrap">
                                <div className="cel-photo">
                                  <img/>
                                </div>
                                <div className="cel-info-base">
                                  <span className="cel-info-name">{cel.name}</span>
                                  <span className="cel-info-member">{cel.member}</span>
                                </div>
                              </div>
                              <div>
                                <Button>Join</Button>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

