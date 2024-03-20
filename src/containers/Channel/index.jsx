import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon,
  Input,
  Modal,
  Col,
  Row,
  Radio,
  Button,
  message,
  Avatar,
  Checkbox
} from 'antd';
import axios, { post } from 'axios/index';
import { history } from '../../helpers/history';
import { API_ROOT } from '../../helpers/apiConfig';
import './index.css';
import ReactDOM from 'react-dom';
import groupSvg from '../../assets/svgs/Group.svg';
import defaultImage from '../../assets/svgs/upload-image.svg';
import { v4 } from 'uuid';
import Hashids from "hashids";

const Search = Input.Search;
const RadioGroup = Radio.Group;

async function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // async event handlers
    reader.onload = e => resolve(reader.result);
    reader.onerror = e => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

let channeluser = undefined;
const groupData = new FormData();

export class Channel extends React.Component {
  /**
   *
   * @param props
   */

  constructor(props) {
    super(props);

    this.state = {
      file: {},
      privateLink: "",
      users: [],
      searchString: '',
      // visible: false,
      checked: false,
      value: '',
      data: {
        name: '',
        description: '',
        type: 'channel',
        username: '',
        is_public: 1,
        type: 'free',
        photo: null,
        members_id: []
      },
      groupData: null,
      selectedUsers: [],
      submitted: false,
      loading: false,
      modal1Visible: false,
      modal2Visible: false,
      nextBtn: true,
    };
    this.handleOnChangeName = this.handleOnChangeName.bind(this);
    this.handleOnChangeUserName = this.handleOnChangeUserName.bind(this);
    this.handleOnChangeDescription = this.handleOnChangeDescription.bind(this);
    this.handleChangePhotoButton = this.handleChangePhotoButton.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.handleChangePhotoFileInput = this.handleChangePhotoFileInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modal1Visible = this.modal1Visible.bind(this);
    this.modal2Visible = this.modal2Visible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlemodal1Cancel = this.handlemodal1Cancel.bind(this);
    this.handleModal2Cancel = this.handleModal2Cancel.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  modal1Visible() {
    this.setState({
      modal1Visible: !this.state.modal1Visible,
    });
  }

  /**
   *
   * @param modal2Visible
   */

  modal2Visible(modal2Visible) {
    this.modal1Visible(false);
    this.setState({
      modal2Visible:modal2Visible
    });
  }


  handleOk() {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 3000);
  }


  handlemodal1Cancel() {
    this.setState({ modal1Visible: false });
  }

  handleModal2Cancel() {
    // this.modal2Visible(false);
    this.setState({ modal2Visible: false });
  }

  cancel = () => {
    this.setState({ modalVisible: false });
  };

  handleOnChangeName = (event) => {
    const { name, value } = event.target;
    let btnSatus;
    if (value === '') {
      btnSatus = true;
    } else {
      btnSatus = false;
    }
    const { data, groupData } = this.state;
    this.setState({
      data: {
        ...data,
        photo: groupData,
        name: value
      },
      nextBtn: btnSatus
    });
  };

  onRadioChange = (e) => {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    let hashids = new Hashids(token);
    const privateLink = hashids.encode(Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1));
    console.log(uuidValue);
    console.log(token);
    console.log(privateLink);
    if (e.target.value === 1) {
      // radio 1(textbox) click and show textbox
      document.getElementById('publicLink').style.visibility = 'visible';
      document.getElementById('privateLink').style.visibility = 'hidden';

    }
    if (e.target.value === 2) {
      // radio 2(link) click and show link
      document.getElementById('publicLink').style.visibility = 'hidden';
      document.getElementById('privateLink').style.visibility = 'visible';
    }
    channeluser = privateLink;
    this.setState({
      value: e.target.value,
      privateLink: privateLink
    });
  };

  handleOnChangeUserName = (event) => {
    channeluser = event.target.value;
  };

  handleOnChangeDescription = (event) => {
    const { description, value } = event.target;
    let btnSatus;
    if (value === '') {
      btnSatus = true;
    } else {
      btnSatus = false;
    }
    const { data, groupData } = this.state;
    this.setState({
      data: {
        ...data,
        photo: groupData,
        description: value
      },
      nextBtn: btnSatus
    });
  };

  inputFileRef = null;


  handleChangePhotoButton = (e) => {
    e.preventDefault();
    this.inputFileRef.click();
  };

  handleChangePhotoFileInput = (event) => {
    const { data } = this.state;
    // const target = e.currentTarget;
    this.state.file = event.target.files[0];
    // validate file as image
    if (!this.state.file.type.startsWith("image/")) {
      alert('File is not an image');
      return;
    }

    // groupData.append('photo', this.state.file);
    // groupData.append('name', data.name);
    // groupData.append('description', data.description);
    // groupData.append('is_free', data.is_free);
    // groupData.append('is_public', data.is_public);
    // groupData.append('type', 'free');
    // groupData.append('members_id', data.members_id);

    this.setState({
      ...this.state,
      file: event.target.files[0],
      objectUrl: URL.createObjectURL(this.state.file)
    });
  };

  /**
   *
   * @param id
   */


  getContact() {
    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        Accept: 'application/json',
        language: 'en',
        app: 'stars',
        agent: 'web',
        uuid: uuidValue,
        Authorization: token
      }
    };
    axios.get(`${API_ROOT}/api/v1/contact?page=0`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const contacts = response.data.data.contact;
          localStorage.setItem('contacts', JSON.stringify(contacts));
          const users = response.data.data.user;
          const result = users.map(user => ({ name: user.first_name }));
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('result', JSON.stringify(result));
          this.setState({
            contactLists: contacts,
            users,
            loading: false
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: true
        });
      });
  }

  filterList(event) {
    const { value } = event.target;
    const result = localStorage.getItem('result');
    this.setState({
      searchString: this.refs.search.value
    });
  }

  componentWillMount() {
    this.setState({ contacts: localStorage.getItem('result') });
  }


  componentDidMount() {
    this.getContact();
    this.setState({
      loading: true
    });
  }

  toggle(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  selectContactId(itemId) {
    let { selectedUsers, data } = this.state;
    const users = JSON.parse(localStorage.getItem('users'));

    if (!selectedUsers.length) {
      selectedUsers = users.filter((item) => {
        return itemId === item.id;
        data.members_id.push(itemId);
      });
      this.setState({
        selectedUsers,
        checked: true
      });
    } else {
      const notAdded = selectedUsers.every((item, index) => {
        if (item.id === itemId) {
          selectedUsers.splice(index, 1);
          return false;
        }
        return true;
      });

      if (notAdded) {
        users.forEach((item) => {
          if (item.id === itemId) {
            selectedUsers.push(item);
            data.members_id.push(item.id);
          }
        });
      }

      this.setState({
        selectedUsers
      });
    }
  }


  selectContactWithId(getID) {
    let { selectedUsers, data, file } = this.state;
    const users = JSON.parse(localStorage.getItem("users"));
    let tokenTest = true;
    let i = 0;
    if (!selectedUsers.length) {
      selectedUsers.push(getID);
      data.members_id.push(getID);
      console.log(selectedUsers);
      this.setState({
        selectedUsers
      });
    } else {
      for (i; i < selectedUsers.length; i++) {
        if (selectedUsers[i] === getID) {
          console.log("in if");
          tokenTest = false;
          selectedUsers.splice(i, 1);
          data.members_id.splice(i, 1);
        }
      }
      if (tokenTest) {
        selectedUsers.push(getID);
        data.members_id.push(getID);
      }
      console.log("selectedUsers --->", selectedUsers);
      console.log("data is: --->", data);
      this.setState({
        selectedUsers
      });
    }
  }

  handleGrpSubmit(event) {
    event.preventDefault();
    this.appendChatMessage(this.messageInput.value, this.inputFileRef.value);
    this.messageInput.value = '';
    this.setState({
      isTyping: false,
      meta: null,
      replyMessage: null,
      chosenMessages: []
    });
  }

  handleSubmit() {
    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        Accept: 'application/json',
        language: 'en',
        app: 'stars',
        Authorization: token,
        agent: 'web',
        uuid: uuidValue,
        'Content-Type': 'application/json'
      },
    };

    // groupData.append('username', channeluser);

    const { data } = this.state;
    const groupData = new FormData();
    groupData.append("photo", this.state.file);
    groupData.append("name", data.name);
    groupData.append("description", data.description);
    groupData.append("type", data.type);
    groupData.append("is_public", data.is_public);
    groupData.append("type", "free");
    groupData.append("username", channeluser);
    groupData.append("members_id", "[" + data.members_id + "]");
    console.log(groupData.get("photo"));
    console.log(groupData.get("name"));
    console.log(groupData.get("description"));
    console.log(groupData.get("type"));
    console.log(groupData.get("is_public"));
    console.log(groupData.get("type"));
    console.log(groupData.get("members_id"));
    console.log(groupData.get("username"));


    axios.post(`${API_ROOT}/api/v1/channel/`, groupData, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.getContact();
          // window.location = '/chat';
          const group = data.name;
          localStorage.group = group;
          const uuid = v4();
          localStorage.uuid = uuid;
          message.success('Submiting success!');
          this.setState({
            data: [],
            loading: false,
            modal1Visible: false,
            modal2Visible: false
          });
          history.push("/chat");
        }
      })
      .catch((error) => {
        this.componentDidMount();
        this.setState({
          loading: false,
          modal1Visible: false,
          modal2Visible: false
        });

        // window.location = '/chat';
        message.error(error.response.data.error);
      });
  }


  /**
   * @function render
   * @description Renders the component
   * @returns {*}
   */

  render() {
    const radioStyle = {
      display: 'block',
      height: '25px',
      lineHeight: '30px'
    };
    const { data, objectUrl } = this.state;
    let _users = this.state.users;
    const search = this.state.searchString.trim()
      .toLowerCase();
    if (search.length > 0) {
      _users = _users.filter(user => user.first_name.toLowerCase()
        .match(search));
    }
    return (
      <div>
        <a className="sidebar-link group-text" onClick={this.modal1Visible}>
          <span>New Channel</span>
        </a>

        <Modal
          title="New Channel"
          visible={this.state.modal1Visible}
          onOk={this.handleOk}
          onCancel={this.handlemodal1Cancel}
          footer={[
            <a type="primary" onClick={() => this.modal1Visible(false)}>Cancel</a>,
            <a
              disabled={this.state.nextBtn}
              className="next-btn"
              onClick={() => this.modal2Visible(true)}
              type="primary"
            >Next
            </a>
          ]}
        >
          <form>
            <div className="gutter-example">
              <Row>
                <Col span={8}>
                  <div className="avatar-container">
                    <div className="avatar-uploader">
                      <img src={objectUrl || defaultImage}/>
                    </div>
                    <input
                      onChange={this.handleChangePhotoFileInput}
                      ref={input => (this.inputFileRef = input)}
                      style={{ display: 'none' }}
                      type="file"
                      required="required"
                    />
                    <Button onClick={this.handleChangePhotoButton} className="avatar-btn">Change
                      Image</Button>
                  </div>
                </Col>
                <Col span={16}>
                  <div className="field">
                    <input
                      name="name"
                      id="name"
                      type="text"
                      value={data.name}
                      placeholder="name"
                      onChange={this.handleOnChangeName}
                    />
                  </div>
                </Col>
                <Col span={8}/>
                <Col span={16}>
                  <div className="field">
                    <input
                      name="description"
                      id="description"
                      type="text"
                      value={data.description}
                      placeholder="Description (optional)"
                      onChange={this.handleOnChangeDescription}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </form>
        </Modal>

        <Modal
          title="ADD Members"
          visible={this.state.modal2Visible}
          onOk={this.handleOk}
          onCancel={this.handleModal2Cancel}
          footer={[
            <a
              className="next-btn"
              onClick={() => this.handleSubmit(true) && this.modal1Visible(false)}
              type="primary"
            >Create</a>
          ]}
        >
          <form onSubmit={this.handleGrpSubmit}>
            <div className="contact-search-wrap">
              <input
                type="text"
                className="search-contacts"
                value={this.state.searchString}
                ref="search"
                onChange={this.filterList}
                placeholder="Search"
              />
            </div>
            <ul className="contact-list-wrap" style={{ paddingLeft: 0 }}>
              {
                this.state.loading &&
                <Icon type="loading"/>
              }
              {_users.map((user, index) =>
                (<li className="contact-item" key={index}>
                  <Checkbox
                    onChange={this.selectContactWithId.bind(this, user.id)}
                    style={{ marginRight: 10 }}
                  />
                  <Link
                    to={`/conversation/${user.id}`}
                    // onClick={this.selectContactId.bind(this, user.id)}
                  >
                    {user.photo &&
                    <div className="contact-user-info-wrap">
                      <img src={user.photo} className="contact-user-photo" alt="stars"/>
                    </div>
                    }
                    {!user.photo &&
                    <Avatar
                      className="contact-user-photo contact-user-info-wrap"
                    >{user.first_name.charAt(0).toUpperCase()}</Avatar>
                    }
                    <div className="contact-name">
                      <span>{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                  </Link>
                </li>),
              )}
            </ul>
            <RadioGroup onChange={this.onRadioChange} value={this.state.value}>
              <Radio style={radioStyle} value={1}>Channel Name
              </Radio>
              <span
                className="text-muted">Any one can find the channel in search and join
              </span>
              <Radio style={radioStyle} value={2}>Private Channel
              </Radio>
              <span
                className="text-muted">Only people with a special invite link may join
              </span>
            </RadioGroup>
            <div id="channelLink">
              <div id="publicLink" style={{ visibility: 'hidden' }}>
                <input
                  name="username"
                  id="username"
                  type="text"
                  placeholder="username"
                  onChange={this.handleOnChangeUserName}
                />
              </div>
              <div id="privateLink" style={{ visibility: 'hidden' }}>
                <a href={this.state.privateLink}>stars.do/{this.state.privateLink}</a>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
