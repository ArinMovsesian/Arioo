import React from 'react';
import './index.css';
import {Input, Button, Select, Row, Col, Radio , Avatar, Modal } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../../../helpers/apiConfig';
import { history } from '../../../../helpers/history';
import SentSvg from '../../../../assets/svgs/sent.svg';


const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
export class BlockUsers extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      blockUser: [],
      value: 1,
      contactLists:[],
      users: [],
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getBlockUsers = this.getBlockUsers.bind(this);
    this.getContact = this.getContact.bind(this);
  }

  componentWillMount(){
    this.getBlockUsers();
    this.getContact();
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  getContact() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "Authorization": token,
      }
    };
    axios.get(`${API_ROOT}/api/v1/user/unBlock/data`,configHeader)
      .then((response) => {
        if (response.status === 200) {
          const unblockList = response.data.data;
          console.log("before set",unblockList);
          this.setState({
            users: unblockList,
          });
        }
      })
      .catch( (error) => {
        console.log(error);
      });
    console.log("before set",this.state.users);
  }
  blockUser(id){
    const token = localStorage.getItem('token');
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "Authorization": token,
      }
    };
    axios.post(`${API_ROOT}/api/v1/user/block`, {
      'users_block_id': '[' + id + ']',
    }, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.getContact();
          this.getBlockUsers();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  unBlock(id)
  {
    const token = localStorage.getItem('token');
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "Authorization": token,
      }
    };

    axios.post(`${API_ROOT}/api/v1/user/unBlock`, {
     'users_block_id': '[' + id + ']',
    }, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.getBlockUsers();
          this.getContact();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getBlockUsers() {
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
    axios.get(`${API_ROOT}/api/v1/user/block/data`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const blockUser = response.data.data;
          this.setState({
            blockUser: blockUser,
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
                      <bold>Blocked User</bold>
                    </h3>
                  </Col>
                  <Col span={12} style={{ direction: 'rtl' }}>
                    <span>
                      <a onClick={this.showModal}>add a member</a>
                    </span>
                  </Col>
                </Row>
              </div>

              <div className="field">
                <Row>

              {this.state.blockUser.map((u,i) =>
                <span>
                    <Col span={11} style={{
                      borderBottom: '1px solid #C7C7CC',
                      paddingBottom: '13px',
                      paddingTop: '13px'
                    }}>
                      {u.photo &&
                      <img src={u.photo}  alt="contact-photo" style={{width:'10%'}}/>
                      }
                      {!u.photo &&
                      <Avatar shape="square" style={{width:'10%'}}>{u.first_name.charAt(0)} _ {u.last_name.charAt(0)}</Avatar>
                      }

                        <span style={{ marginLeft: '20px' }}>{u.first_name} {u.last_name}</span>

                      <div style={{ float: 'right', padding: '11px' }}>
                        <a onClick={ () => this.unBlock(u.id)} >UNBLOCKED</a>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                </span>
                )}
                </Row>
              </div>
            </div>

            <Modal
              title="Block Member"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Row gutter={16}>
                {this.state.users.map((u,i) =>
                <Col span={24} style={{margin:'5px'}}>
                  <a onClick={ () => this.blockUser(u.id)}>
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
