import React from 'react';
import './index.css';
import {Input, Button, Select, Row, Col, Radio , Avatar, Modal } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../../../helpers/apiConfig';
import { history } from '../../../../helpers/history';
import SentSvg from '../../../../assets/svgs/sent.svg';

const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
export class PrivacyGroup extends React.Component {


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
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div className="settings-container" style={{overflowY: 'hidden',height:'600px'}}>
        <div className="form-container">
          <form className="account-form">
            <div className="inputs-container">
              <div className="field">
                <h3><bold> Group invite setting</bold></h3>
              </div>
              <div className="field">
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio style={radioStyle} value={1}>Everybody</Radio>
                  <Radio style={radioStyle} value={2}>My contacts</Radio>
                </RadioGroup>
                <p htmlFor="profileName">Who can invite your to group and channel</p>
              </div>



              <br/>
              <div className="field">
                <h3>Add exception</h3>
              </div>
              <div className="field">
                <Row gutter={16}>
                  <Col span={12}>
                    <p>Always share with</p>
                  </Col>
                  <Col span={12}>
                    <a style={{float:'right'}} onClick={this.showModal}>add a member</a>
                  </Col>
                </Row>
              </div>

              <div className="field">
                <Row gutter={16}>
                  <Col span={12}>
                    <Avatar shape="square" size="large" icon="user" />
                    <div  style={{float:'right',padding:"7%"}}>
                      <span>Mojgan Ahmadi</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Avatar shape="square" size="large" icon="user" />
                    <div  style={{float:'right',padding:"7%"}}>
                      <span>Mojgan Ahmadi</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Avatar shape="square" size="large" icon="user" />
                    <div  style={{float:'right',padding:"7%"}}>
                      <span>Sara Aliyar</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Avatar shape="square" size="large" icon="user" />
                    <div  style={{float:'right',padding:"7%"}}>
                      <span>Sara Aliyar</span>
                    </div>
                  </Col>
                </Row>
              </div>

              <span className="field" style={{ color: '#BBBBBB', fontSize: '10px', display: 'inline' }}>
                There Users will or will not be abale to add you to group and channels regadless settings above.
              </span>

              <br/>
              <Button
                // onClick={this.handleSubmit}
                // loading={this.state.loadingSubmit}
                className="primary btn-submit"
                // disabled={data.first_name.length === 0 && data.last_name.length === 0}
              >save changes
              </Button>
            </div>

            <Modal
              title="ADD Members"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Row gutter={16}>
                {this.state.users.map((u,i) =>
                  <Col span={24} style={{margin:'5px'}}>
                    <a onClick={ () => this.addContact(u.id)}>
                      {u.photo &&
                      <img src={u.photo}  alt="contact-photo" style={{width:'10%'}}/>
                      }
                      {!u.photo &&
                      <Avatar shape="square" style={{width:'10%'}}>{u.first_name.charAt(0)} _ {u.last_name.charAt(0)}</Avatar>
                      }

                      <span style={{ padding: '4%' }}>
                        {u.first_name} {u.last_name}
                    </span>
                    </a>
                  </Col>
                )}
              </Row>
            </Modal>


          </form>
        </div>
      </div>
    );
  }
}
