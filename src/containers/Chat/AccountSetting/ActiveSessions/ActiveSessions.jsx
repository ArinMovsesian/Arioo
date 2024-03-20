import React from 'react';
import './index.css';
import {Icon, Button, Select, Row, Col, Radio , Avatar, Modal } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../../../helpers/apiConfig';
import { history } from '../../../../helpers/history';
import SentSvg from '../../../../assets/svgs/sent.svg';


const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
export class ActiveSessions extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      value: 1,
      contactLists:[],
      users: [],
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getContact = this.getContact.bind(this);
  }

  componentWillMount(){
    // const user = JSON.parse(localStorage.getItem("userObj"));
    // console.log(user);
    this.getContact();
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  addContact(id){
  console.log(id);
  }

  getContact() {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "uuid": uuidValue,
        "Authorization": token,
      }
    };
    axios.get(`${API_ROOT}/api/v1/contact?page=0`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const contacts = response.data.data.contact;
          localStorage.setItem("contacts", JSON.stringify(contacts));
          const users = response.data.data.user;
          const result = users.map(user => ({ name: user.first_name }));
          console.log("result contact is",result,users);
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("result", JSON.stringify(result));
          this.setState({
            contactLists: contacts,
            users: users,
          });
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      visible: false,
      value: e.target.value,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {


    return (
      <div className="settings-container" style={{height:'500px'}}>
        <div className="form-container">
          <form>
            <div className="inputs-container">
              <div className="field">
                <Row>
                  <Col span={12}>
                    <h3 style={{ float: 'left' }}>
                      <bold>Active Sessions</bold>
                    </h3>
                  </Col>
                  <Col span={12}>
                    <span style={{ float: 'right',color:'#FF2D55' }}>Terminate all other sessions</span>
                  </Col>
                </Row>
              </div>

              <div className="field">
                <Row style={{ marginBottom:'10px'}}>
                  <Col span={12} style={{borderBottom:'1px solid #C7C7CC'}}>
                    <div>
                      <span  style={{float:'right',direction:'rtl'}}>
                        <Icon type="close" theme="outlined" />
                        <a href='#' style={{paddingRight:'10px'}}>online</a></span>
                          <span>Desktop 0.8</span>
                          <br/>
                          <span>OS X 10.10.2</span>
                          <span className="field" style={{color:"#BBBBBB",fontSize:"10px"}}>
                            63.56.72.110-USA
                          </span>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginBottom:'10px'}}>
                  <Col span={12} style={{borderBottom:'1px solid #C7C7CC'}}>
                    <div>
                      <span  style={{float:'right'}}>
                        <span style={{paddingRight:'10px'}}>6.22 PM</span>
                        <Icon type="close" theme="outlined" />
                      </span>
                      <span>Arioo OS X.40</span>
                      <br/>
                      <span>Macbook Pro X 10.10.2</span>
                      <span className="field" style={{color:"#BBBBBB",fontSize:"10px"}}>
                            63.56.72.110-USA
                          </span>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginBottom:'10px'}}>
                  <Col span={12} style={{borderBottom:'1px solid #C7C7CC'}}>
                    <div>
                      <span  style={{float:'right',direction:'rtl'}}>
                        <Icon type="close" theme="outlined" />
                        <a href='#' style={{paddingRight:'10px'}}>online</a></span>
                      <span>Arioo iOS 2.12</span>
                      <br/>
                      <span>iPhone x,ios 12</span>
                      <span className="field" style={{color:"#BBBBBB",fontSize:"10px"}}>
                            63.56.72.110-USA
                          </span>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginBottom:'10px'}}>
                  <Col span={12} style={{borderBottom:'1px solid #C7C7CC'}}>
                    <div>
                      <span  style={{float:'right'}}>
                        <span style={{paddingRight:'10px'}}>MOON</span>
                        <Icon type="close" theme="outlined" />
                      </span>
                      <span>Arioo Android 2.7.0</span>
                      <br/>
                      <span>Samsung galaxy Note 8,Android 6</span>
                      <span className="field" style={{color:"#BBBBBB",fontSize:"10px"}}>
                            63.56.72.110-USA
                          </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
