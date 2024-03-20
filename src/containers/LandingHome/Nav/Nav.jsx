import React from 'react';
import {Avatar, Badge, Col, Layout, Menu, Row, message } from "antd";
import {Link} from 'react-router-dom';
import './index.css';
import logoArioo from "../../../assets/svgs/logo-arioo.svg";
import logoariooNew from "../../../assets/svgs/logoNew.svg";
import menue from "../../../assets/svgs/menu.svg";
import closeBtn from "../../../assets/svgs/closebtn.svg";
import { Home } from '../../Home/Home';
import axios from 'axios';
import { API_ROOT } from '../../../helpers/apiConfig';

const { Header, Content } = Layout;
class Nav extends React.Component {
  state = {
    showNav: false,
    firstName: undefined,
    lastName: undefined,
    photo: undefined,
    unreadMessage:'',
  };

  componentDidMount() {
    console.log('AA-->',this.props.location.pathname);
    this.getUnreadMessage();
    if (localStorage.getItem("token") !== null) {
      const userObj = JSON.parse(localStorage.getItem("userObj"));
      console.log("nav userObj -->", userObj);
      this.setState({
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        photo: userObj.photo
      });
    }
  }

  getUnreadMessage(){
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        agent: "web",
        uuid: uuidValue,
        Authorization: token
      },
    };
    axios.get(`${API_ROOT}/api/v1/conversation/unreadMessage/count  `, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const unread = response.data.data.unreadMessage;
          this.setState({
            unreadMessage : unread,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          unreadMessage: '',
        });
      });
  }
  render() {


    return (
      <Layout>
        <Content className="desktopviewNav">
            <Row>
              <Col span={10}>
                <div style={{ textAlign: "left", width: "100%" }}>
                  <Link to="/">
                    <img src={logoariooNew} alt="" style={{ width: "59px", height: "59px", marginLeft: "100px", marginTop: '20px' }}/>
                  </Link>
                </div>
              </Col>
              <Col span={14}>
                <ul className="navigationUL">

                  {/*<Menu.Item key="1">*/}
                  {/*<Link to="/">Home</Link>*/}
                  {/*</Menu.Item>*/}
                  {/*<Menu.Item key="2">App</Menu.Item>*/}
                  {this.props.location.pathname === '/blog'? null: <li><Link to="/blog" style={{color: 'inherit'}}>blog</Link></li>}

                  <li onClick={() => message.info("Coming Soon")}>chat room</li>
                  <li>
                    <Link to='/aboutus' style={{color: 'inherit'}}>about</Link>
                  </li>
                  <li>
                    <Link to='/contactus' style={{color: 'inherit'}}>contact</Link>
                  </li>
                  <li>
                    <Link to='/faq' style={{color: 'inherit'}}>FAQ</Link>
                  </li>
                  {/*<Menu.Item key="8">*/}
                  {/*<Link to={"/registration"}>Registraion</Link>*/}
                  {/*</Menu.Item>*/}
                  <li>{
                    localStorage.getItem("token") !== null ? <Link to='/chat'>
                        { this.state.photo
                          ?
                          <img
                            src={this.state.photo === "" ? "https://via.placeholder.com/25x25" : this.state.photo} alt=""
                            style={{ marginRight: "5px", borderRadius: "5px", width: "25px", height: "25px" }}
                          />
                          :
                          <span style={{ marginRight: "5px",backgroundColor:'#e2e2e2',padding:'6px' , borderRadius: "20px", width: "25px", height: "25px",fontSize:'12px' }}>
                      {this.state.firstName}
                      </span>
                        }
                        <h1 style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          display: "inline"
                        }}>{this.state.firstName + " " + this.state.lastName}</h1>
                        <Badge count={this.state.unreadMessage} overflowCount={999}></Badge>
                      </Link> :
                      <Link to='/home' style={{color: 'inherit'}}> signIn / register </Link>
                  }</li>
                </ul>
              </Col>
            </Row>

        </Content>
        <Content className="mobileviewNav">
          <Row>
            <Col span={12}>
              <Link to="/">
                <img src={logoariooNew} alt="" style={{ width: "52px", height: "33px", margin: "30px" }}/>
              </Link>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: "right" }} onClick={() => this.setState({ showNav: true })}>
                <img src={menue} alt="" style={{ width: "20px", height: "20x", margin: "30px" }}/>
              </div>
            </Col>
          </Row>
          <nav style={{ display: this.state.showNav === true ? "block" : "none", position: "fixed" }}>
            <Row>
              <Col span={12}>
                <img src={logoariooNew} alt="" style={{ width: "52px", height: "33px", margin: "30px" }}/>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: "right" }} onClick={() => this.setState({ showNav: false })}>
                  <img src={closeBtn} alt="" style={{ width: "20px", height: "20x", margin: "30px" }}/>
                </div>
              </Col>
            </Row>
            <ul>
              {/*<li>*/}
              {/*<Link to="/">Home</Link>*/}
              {/*</li>*/}
              {this.props.location.pathname === '/blog'? null: <li><Link to="/blog" style={{color: 'inherit'}}>blog</Link></li>}
              <li onClick={() => message.info("Coming Soon")}>chat room</li>
              {/*<li>Feedback</li>*/}
              <li><Link to='/aboutus'>about</Link></li>
              <li><Link to='/contactus'>contact</Link></li>
              <li><Link to='/faq'>FAQ</Link></li>
              {/*<li>*/}
              {/*<Link to={"/main/registration"}>Registraion</Link>*/}
              {/*</li>*/}
              <li>
                {
                  localStorage.getItem("token") !== null ? <Link to='/chat'><img
                      src={this.state.photo === "" ? "https://via.placeholder.com/25x25" : this.state.photo} alt=""
                      style={{ marginRight: "5px", borderRadius: "5px", width: "25px", height: "25px" }}/><h1 style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      display: "inline"
                    }}>{this.state.firstName + " " + this.state.lastName}</h1></Link> :
                    <Link to='/home'> signIn / register </Link>
                }
              </li>
            </ul>
          </nav>
        </Content>


      </Layout>

    );
  }
}

export default Nav;
