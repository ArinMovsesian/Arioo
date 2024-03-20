import React from "react";
import { Layout, Menu, Row, Col, Button, Carousel, Icon, Modal } from "antd";
import handSvg from "../../../assets/Group2040.png";
// import handSvg from "../../../assets/Group 2039.png";
import messengerSvg from "../../../assets/svgs/Messenger.svg";
import ellipseSvg from "../../../assets/svgs/Ellipse 3.png";
import mobileSvg from "../../../assets/svgs/app feture and env.png";
import laptopSvg from "../../../assets/svgs/macbook-pro-clay.png";
import logoArioo from "../../../assets/svgs/logo-arioo.svg";
import MobilebetterReso from "../../../assets/MobilebetterReso.png";
import "./index.css";
import { Link, NavLink } from "react-router-dom";
import axios from 'axios';
import { API_ROOT } from '../../../helpers/apiConfig';
import downloadSvg from '../../../assets/svgs/ic_action_download.svg';
// ***** badges
import cafebazar from "../../../assets/badges/cafebazar.svg";
import charkhoone from "../../../assets/badges/charkhoone.svg";
import myket from "../../../assets/badges/myket.svg";
import iranapps from "../../../assets/badges/iranapps.svg";
import plystore from "../../../assets/badges/plystore.svg";
import appstore from "../../../assets/badges/app-store-badge.png";
import sibapp from "../../../assets/badges/sibapp.jpg";


const { Content, Header } = Layout;

export default class LandingHome extends React.Component {
  state = {
    vasObjMobile: [],
    vasObjDesc: [],
    modalVisibility: false,
    ios: false,
    android: false,
  };

  showModal = (platform) => {
    if (platform === "ios") {
      this.setState({
        modalVisibility: true,
        ios: true,
        android: false
      });
    } else {
      this.setState({
        modalVisibility: true,
        ios: false,
        android: true
      });
    }
  };
  sendInvitationLink = (e) => {
    e.preventDefault();
    alert(1);
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      modalVisibility: false
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      modalVisibility: false
    });
  };

  componentDidMount() {
    this.getVas();
    console.log("LandingHome:", this.props);

  }

  getVas = () => {
    let vasMobile2D = [];
    let vasDesc2D = [];
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "uuid": uuidValue,
      },
    };
    axios.get(`${API_ROOT}/api/v1/channel/index/vas/web`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          console.log("vas is ", response.data.data);
          const vasMobile = response.data.data;
          const vasDesc = response.data.data;

          // convert 2D for mobile array
          for (let i = 0, k = -1; i < vasMobile.length; i++) {
            if (i % 2 === 0) {
              k++;
              vasMobile2D[k] = [];
            }
            vasMobile2D[k].push(vasMobile[i]);
          }
          // convert 2D for mobile array


          // convert 2D for Desc array
          for (let i = 0, k = -1; i < vasDesc.length; i++) {
            if (i % 5 === 0) {
              k++;
              vasDesc2D[k] = [];
            }
            vasDesc2D[k].push(vasDesc[i]);
          }
          // convert 2D for Desc array


          console.log("vasMobile2D is ", vasMobile2D);
          console.log("vasDesc2D is ", vasDesc2D);
          this.setState({
            vasObjMobile: vasMobile2D,
            vasObjDesc: vasDesc2D
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };
  goToRegistration = (id) => {
    alert(id);
  };


  render() {
    return (
        <Layout>
            <Content className="desktopView"
                     style={{ background: "#fff", padding: 0, margin: 0, minHeight: 280, marginTop: "150px" }}>
              <div className="stars-container">
                <div className="section1">
                  <div className="hand-image-container">
                    <img src={handSvg} alt="hand-mobile" style={{ width: "100%", height: "auto" }}/>
                  </div>
                  <div className="messenger-container">
                    <div className="messenger-img">
                      <img src={messengerSvg} alt="messenger text"/>
                    </div>
                    <div className="money-channel-container">
                      <div className="money">
                          <span>
                            MONEY
                          </span>
                        <span className="transfer">
                            TRANSFER
                          </span>
                      </div>
                      <div className="channel">
                        <span>CHANNELS </span>
                        <span>GROUPS</span>
                      </div>
                    </div>
                    <div>
                      <div className="download-ios"><Button onClick={() => this.showModal("ios")}>Download iOS</Button>
                      </div>
                      <div className="download-android"><Button onClick={() => this.showModal("android")}>Download
                        Android</Button></div>
                      <div className="download-web"><NavLink to="/home"><Button>Web</Button></NavLink></div>
                    </div>
                  </div>
                </div>
                <div className="section2">
                  <div className="ellipsis1"><img src={ellipseSvg} alt="ellipse icon"/></div>
                  <div className="celeb-txt">
                    <span>Celebrities on Stars</span>
                  </div>
                  <div className="follow-txt">
                    <span>Follow your favorite celebrity and watch new unique videos.</span>
                  </div>
                  <div className="celebs-container">
                    <Row style={{ width: "100%" }}>
                      <Carousel autoplay={true} dots={false}>
                        {
                          this.state.vasObjDesc.map(
                            (value1, index1) => {
                              return (
                                <div>
                                  <ul>
                                    {
                                      value1.map(
                                        (value2, index2) => {
                                          return (
                                            <NavLink to={`/registration/${value2.id}`}>
                                              <li>
                                                <div style={{ width: "100px", height: "100px" }}>
                                                  <img
                                                    src={value2.media === null ? "https://via.placeholder.com/350x150" : value2.media.path}
                                                    alt=""
                                                    style={{ borderRadius: "26px", width: "100%", height: "100%" }}/>
                                                </div>
                                                <div style={{ marginTop: "20px" }}><span
                                                  style={{ color: "#2A2E43" }}>{value2.name.slice(0, 15)}...</span></div>
                                              </li>
                                            </NavLink>
                                          );
                                        }
                                      )
                                    }
                                  </ul>
                                </div>
                              )
                            }
                          )
                        }
                      </Carousel>

                    </Row>

                  </div>
                  <div className="view-more-btn"><NavLink to="/morecelebritis"><Button>View More...</Button></NavLink>
                  </div>
                  <div className="ellipsis2"><img src={ellipseSvg} alt="ellipse icon"/></div>
                </div>
                <div className="section3">
                  <div className="app-feature-container">
                    <div className="app-txt-wrap">
                      <h1 className="app-txt-wrap-h1">App Environment & Feature list</h1>
                      {/*<div>*/}
                      {/*<span>App Environment &</span>*/}
                      {/*</div>*/}
                      {/*<div className="app-txt-wrap">*/}
                      {/*<span>Feature list</span>*/}
                      {/*</div>*/}
                    </div>
                    <ul className="app-list">
                      <li><span>Chat</span></li>
                      <li><span>Group</span></li>
                      <li><span>Channel, Music, Video, Shop</span></li>
                      <li><span>Money Transfer</span></li>
                      <li><span>Earn money</span></li>
                    </ul>
                    {/*<div className="app-view-more"><Button>View More...</Button></div>*/}
                  </div>
                  <div className="mobile-img-container">
                    <img src={MobilebetterReso} alt="mobile svg" style={{ width: "672px", height: "auto" }}/>
                  </div>
                </div>
                <div className="section4">
                  <div className="app-feature-container" style={{paddingLeft: 94}}>
                    <div className="app-txt-wrap">
                      <h1 className="app-txt-wrap-h1">Web Enviorment & Feature list</h1>
                      {/*<div>*/}
                      {/*<span>Web Environment &</span>*/}
                      {/*</div>*/}
                      {/*<div className="app-txt-wrap">*/}
                      {/*<span>Web Environment &</span>*/}
                      {/*</div>*/}
                    </div>
                    <ul className="app-list">
                      <li><span>Chat</span></li>
                      <li><span>Group</span></li>
                      <li><span>Channel, Music, Video, Shop</span></li>
                      <li><span>Money Transfer</span></li>
                      <li><span>Money Transfer</span></li>
                      <li><span>Air money</span></li>
                    </ul>
                    <div className="app-view-more"><NavLink to="/home"><Button>View
                      More...</Button></NavLink></div>
                  </div>
                  <div className="mobile-img-container">
                    <img src={laptopSvg} alt="mobile svg" />
                  </div>
                </div>
                <div className="section5">
                  <div className="user_section5"><span>User Testimonial</span></div>
                </div>

                <Row>
                  <Col span={6} style={{ textAlign: "center" }}>
                   <span style={{ width: "25px", height: "25px", cursor: "pointer" }} className="arrowShadow"
                         onClick={() => this.sliderDesktop.prev()}>
                     <Icon type="left" theme="outlined" style={{ color: "#1F8EF0", marginTop: "5px" }}/>
                   </span>
                  </Col>
                  <Col span={12}>
                    <Carousel ref={node => (this.sliderDesktop = node)} dots={false} autoplay={true}>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                    </Carousel>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                  <span style={{ width: "25px", height: "25px", cursor: "pointer" }} className="arrowShadow"
                        onClick={() => this.sliderDesktop.next()}>
                    <Icon type="right" theme="outlined" style={{ color: "#1F8EF0", marginTop: "5px" }}/>
                   </span>
                  </Col>
                </Row>
              </div>
            </Content>
            <Content className="mobileView"
                     style={{ background: "#fff", padding: 0, margin: 0, minHeight: 280, marginTop: "150px" }}>

              <Row>
                <Col span={14}>
                  <div>
                    <img src={handSvg} alt="hand-mobile" style={{ width: "100%", height: "auto" }}/>
                  </div>
                </Col>
                <Col span={10}>
                  <div style={{ marginTop: "30px", marginLeft: "-30px" }}>
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "24px", color: "#2A2E43", fontWeight: "bold" }}>MONEY</span>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <span style={{ fontSize: "24px", color: "#2A2E43", fontWeight: "bold" }}>TRANSFER</span>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "19px", color: "#2A2E43", fontWeight: "bold" }}>CHANNELS</span>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "19px", color: "#2A2E43", fontWeight: "bold" }}>GROUPS</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className="download-ios-mobile"><Button onClick={() => this.showModal("ios")}>Download iOS</Button>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="download-android-mobile"><Button onClick={() => this.showModal("android")}>Download
                    Android</Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <div style={{ marginTop: "123px", marginLeft: "10px" }}>
                  <img src={ellipseSvg} alt="ellipse icon"/>
                </div>
              </Row>
              <Row>
                <h1 style={{
                  color: "#2A2E43",
                  fontSize: "20px",
                  marginTop: "30px",
                  marginLeft: "30px",
                  fontWeight: "bold"
                }}>Celebrities on Stars</h1>
                <p style={{
                  olor: "#2A2E43",
                  fontSize: "15px",
                  marginTop: "30px",
                  marginLeft: "30px",
                  width: "70%",
                  lineHeight: "20px"
                }}>Follow your favorite celebrity and watch new unique videos.</p>
                <Carousel dots={false}>
                  {
                    this.state.vasObjMobile.map(
                      (value1, index1) => {
                        return (
                          <div>
                            <Row>
                              {
                                value1.map(
                                  (value2, index2) => {
                                    return (

                                      <Col span={12}>
                                        <NavLink to={`/registration/${value2.id}`}>
                                          <div style={{
                                            width: "90px",
                                            height: "90px",
                                            margin: "10px auto"
                                          }}>
                                            <img
                                              src={value2.media === null ? "https://via.placeholder.com/350x150" : value2.media.path}
                                              alt="" style={{ width: "100%", height: "100%", borderRadius: "26px" }}/>
                                          </div>
                                          <div style={{ textAlign: "center" }}>
                                          <span style={{
                                            color: "#2A2E43",
                                            fontSize: "15px"
                                          }}>{value2.name.slice(0, 15)}...</span>
                                          </div>
                                        </NavLink>
                                      </Col>
                                    );
                                  }
                                )
                              }
                            </Row>
                          </div>
                        );
                      }
                    )
                  }
                </Carousel>
                <div className="app-view-more-mobile"><NavLink to="/moreselebritis"><Button>View
                  More...</Button></NavLink></div>
              </Row>
              <Row>
                <div className="app-feature-container-mobile">
                  <img src={MobilebetterReso} alt="mobile svg"
                       style={{ width: "672px", height: "auto", marginRight: "-40px" }}/>
                  <h1 style={{
                    color: "#515C8B",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginTop: "30px"
                  }}>App Environment & Feature list</h1>
                  <ul>
                    <li>Chat</li>
                    <li>Group</li>
                    <li>Channel, Music, Video, Shop</li>
                    <li>Money Transfer</li>
                    <li>Online payment</li>
                    <li>Air money</li>
                  </ul>
                  {/*<div className="app-view-more-mobile"><Button>View More...</Button></div>*/}
                </div>
              </Row>
              <Row>
                <div className="web-feature-container-mobile">
                  <img src={laptopSvg} alt="mobile svg" style={{ width: "100%", height: "auto" }}/>
                  <h1 style={{ color: "#515C8B", fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>Web
                    Environment & Feature list</h1>
                  <ul>
                    <li>Chat</li>
                    <li>Group</li>
                    <li>Channel, Music, Video, Shop</li>
                    <li>Money Transfer</li>
                    <li>Online payment</li>
                    <li>Air money</li>
                  </ul>
                  <div className="app-view-more-mobile"><NavLink to="/home"><Button>View
                    More...</Button></NavLink></div>
                </div>
              </Row>
              <Row>
                <h1 style={{ color: "#515C8B", fontSize: "25px", fontWeight: "bold", textAlign: "center" }}>User
                  Testimonial</h1>
                <Row>
                  <Col span={6} style={{ textAlign: "center" }}>
                   <span style={{ width: "25px", height: "25px", cursor: "pointer" }} className="arrowShadow"
                         onClick={() => this.sliderMobile.prev()}>
                     <Icon type="left" theme="outlined" style={{ color: "#1F8EF0", marginTop: "5px" }}/>
                   </span>
                  </Col>
                  <Col span={12}>
                    <Carousel ref={node => (this.sliderMobile = node)} dots={false} autoplay={true}>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                      <div>
                        <h2 style={{ textAlign: "center", color: "#515C8B", fontSize: "20px", fontWeight: "bold" }}>Ehsan
                          Fathian</h2>
                        <p style={{ textAlign: "center", color: "#2A2E43", fontSize: "15px", fontWeight: "bold" }}>
                          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                          standard dummy text ever since the 1500s, when an unknown printer took a galley
                        </p>
                      </div>
                    </Carousel>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                  <span style={{ width: "25px", height: "25px", cursor: "pointer" }} className="arrowShadow"
                        onClick={() => this.sliderMobile.next()}>
                    <Icon type="right" theme="outlined" style={{ color: "#1F8EF0", marginTop: "5px" }}/>
                   </span>
                  </Col>
                </Row>
              </Row>


              <Modal
                visible={this.state.modalVisibility}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className="downloadAppModal"
                footer={null}
              >
                <p>Download application</p>
                <div style={Object.assign({
                  textAlign: "center",
                  marginBottom: "15px"
                }, this.state.ios === true ? { display: "block" } : { display: "none" })}>
                  <img src={appstore} alt=""/>
                  <img src={sibapp} alt=""/>
                </div>
                <div
                  style={Object.assign({ textAlign: "center" }, this.state.android === true ? { display: "block" } : { display: "none" })}>
                  <img src={myket} alt=""/>
                  <img src={iranapps} alt=""/>
                  <img src={charkhoone} alt=""/>
                  <img src={cafebazar} alt=""/>
                  <img src={plystore} alt=""/>
                </div>
                <h2 style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#000000",
                  marginTop: "40px",
                  marginBottom: "14px"
                }}>Get the download link on the phone</h2>
                <form onSubmit={this.sendInvitationLink}>
                  <div style={{ textAlign: "center" }}>
                    <input type="text" placeholder="phone number"/>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "12px" }}>
                    <input type="submit" value="Send"/>
                  </div>
                </form>
              </Modal>
            </Content>
        </Layout>
    );
  }
}
