import React from 'react';
import { Layout, Menu, Row, Col, Icon, Avatar } from 'antd';


import './index.css';
import Nav from '../Nav/Nav';
import handSvg from '../../../assets/svgs/Group 1887.png';
import messengerSvg from '../../../assets/svgs/Messenger.svg';
import ellipseSvg from '../../../assets/svgs/Ellipse 3.png';
import mobileSvg from '../../../assets/svgs/app feture and env.png';
import laptopSvg from '../../../assets/svgs/macbook-pro-clay.png';
import Footer from '../Footer/Footer';
import axios from "axios";
import { API_ROOT } from "../../../helpers/apiConfig";

const { Content } = Layout;

export default class LandingHome extends React.Component {
  state = {
    userInfo: {},
    userAvatar: "",
    vas: [],
  };

  componentDidMount() {
    this.getVas();
  }
  getVas = () => {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "uuid": uuidValue
      }
    };
    axios.get(`${API_ROOT}/api/v1/channel/index/vas/web`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          console.log("Registraion vas is: ", response.data.data);
          const getVas = response.data.data;
          const getvasUser = getVas.filter(index => index.id == this.props.match.params.id);
          const getvasUserToObj = getvasUser[0];
          console.log("Registraion: getvasUserToObj", getvasUserToObj);
          console.log("Registraion image", getvasUserToObj.media.path);
          this.setState({
            userInfo: getvasUserToObj,
            userAvatar: getvasUserToObj.media.path,
            vas: getVas,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };
  render() {
    return (
        <Layout>
          <Content style={{ background: "#fff", padding: 0, margin: 0, minHeight: 280, marginTop: "150px" }}>
              <Row type="flex" justify="center">
                <Col xs={24} sm={24} md={5} lg={5} xl={5} className="leftPart">
                  <Row type="flex" justify="center">
                    <Col span={10}>
                      <div className="avatar">
                        <img
                          src={this.state.userAvatar === "" ? "https://via.placeholder.com/350x150" : this.state.userAvatar}
                          alt="" style={{ borderRadius: "26px", width: "100%", height: "100%" }}/>
                      </div>
                    </Col>
                    <Col span={10}>
                      <h2
                        className="avatar-name">{this.state.userInfo.name === null ? "undefined" : this.state.userInfo.name}</h2>
                      <h3 className="avatar-username" style={{
                        fontSize: "11px",
                        color: "##2094FA"
                      }}>{this.state.userInfo.username === null ? "undefined" : this.state.userInfo.username}</h3>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={20}>
                      <p
                        className="avatar-desc">{this.state.userInfo.description === null ? "undefined" : this.state.userInfo.description}</p>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={20}>
                      <div className="avatar-dateOfRegistration">
                        <Icon type="user" theme="outlined" style={{color: '#2094FA', width: '17px', height: '19px'}} /><span>Date of registration</span>
                        <h2>{this.state.userInfo.created_at}</h2>
                      </div>
                    </Col>
                  </Row>
                  {/*<Row type="flex" justify="center">*/}
                    {/*<Col span={20}>*/}
                    {/*<div className="avatar-SocialIDs">*/}
                      {/*<div className="social_Icons">*/}
                        {/*<Row>*/}
                          {/*<Col span={6}><Icon type="user" theme="outlined" style={{color: '#2094FA', width: '17px', height: '19px'}} /></Col>*/}
                          {/*<Col span={6}><Icon type="user" theme="outlined" style={{color: '#2094FA', width: '17px', height: '19px'}} /></Col>*/}
                          {/*<Col span={6}><Icon type="user" theme="outlined" style={{color: '#2094FA', width: '17px', height: '19px'}} /></Col>*/}
                          {/*<Col span={6}><Icon type="user" theme="outlined" style={{color: '#2094FA', width: '17px', height: '19px'}} /></Col>*/}
                        {/*</Row>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                    {/*</Col>*/}
                  {/*</Row>*/}
                  {/*<Row type="flex" justify="center">*/}
                    {/*<Col spna={20}>*/}
                      {/*<button className="send-message-btn">Send Message</button>*/}
                    {/*</Col>*/}
                  {/*</Row>*/}
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10} className="centerPart">
                  <div className="appGames">
                    <Row type="flex" justify="center" style={{marginTop: '20px'}}>
                      <Col span={10}>
                        <h2>Zahra''s favorite apps & game</h2>
                      </Col>
                      <Col span={10}>
                        <div style={{textAlign: 'right'}}>
                          <span>All</span>
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: '10px'}}>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="appGames">
                    <Row type="flex" justify="center" style={{marginTop: '30px'}}>
                      <Col span={10}>
                        <h2>Zahra''s favorite apps & game</h2>
                      </Col>
                      <Col span={10}>
                        <div style={{textAlign: 'right'}}>
                          <span>All</span>
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: '10px'}}>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="appGames">
                    <Row type="flex" justify="center" style={{marginTop: '30px'}}>
                      <Col span={10}>
                        <h2>Zahra''s favorite apps & game</h2>
                      </Col>
                      <Col span={10}>
                        <div style={{textAlign: 'right'}}>
                          <span>All</span>
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: '10px'}}>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="appGames">
                    <Row type="flex" justify="center" style={{marginTop: '30px'}}>
                      <Col span={10}>
                        <h2>Zahra''s favorite apps & game</h2>
                      </Col>
                      <Col span={10}>
                        <div style={{textAlign: 'right'}}>
                          <span>All</span>
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: '10px'}}>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="appGamesIconsContainer">
                          <div className="appGamesIcon"></div>
                          <span>Sara Amiri</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={5} lg={5} xl={5} className="rightPart" style={{height: "590px",overflow:"auto"}}>
                  <div>
                    <Row type="flex" justify="center" style={{marginTop: '20px'}}>
                      <Col span={10}>
                        <h2>Celebrities in Stars</h2>
                      </Col>
                      <Col span={10}>
                        <div style={{textAlign: 'right'}}>
                          <span>All</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  {
                    this.state.vas.map(
                      (user, i) => (
                  <div style={{marginTop: '30px'}}>
                    <Row type="flex" justify="center" style={{marginTop: '20px'}}>
                      <Col span={12}>
                        <Row className="startAvatarWrapper">
                          <Col span={10}>
                            <div>
                              <img
                                src={user.media.path}
                                className="chat-user-photo"
                                alt="stars users"
                              />
                            </div>
                          </Col>
                          <Col span={14}>
                            <h2>{user.name}</h2>
                            <span>2.5 K Member</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <div style={{textAlign: 'right'}}>
                          <button>Join</button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                    )
                    )
                  }
                </Col>
              </Row>
          </Content>
        </Layout>


    );
  }
}
