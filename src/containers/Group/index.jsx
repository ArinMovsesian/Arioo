import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon,
  Input,
  Modal,
  Col,
  Row,
  Button,
  message,
  Avatar,
  Checkbox,
} from 'antd';
import axios, { post } from 'axios/index';
import { history } from '../../helpers/history';
import { API_ROOT } from '../../helpers/apiConfig';
import './index.css';
import groupSvg from '../../assets/svgs/Group.svg';
import defaultImage from '../../assets/svgs/upload-image.svg';
import { v4 } from 'uuid';

const Search = Input.Search;


async function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // async event handlers
    reader.onload = e => resolve(reader.result);
    reader.onerror = e => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export class Group extends React.Component {
  /**
   *
   * @param props
   */

  constructor(props) {
    super(props);


    this.handleOnChangeName = this.handleOnChangeName.bind(this);
    this.handleOnChangeUserName = this.handleOnChangeUserName.bind(this);
    this.handleOnChangeDescription = this.handleOnChangeDescription.bind(this);
    this.handleChangePhotoButton = this.handleChangePhotoButton.bind(this);
    this.handleChangePhotoFileInput = this.handleChangePhotoFileInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.modal1Visible = this.modal1Visible.bind(this);
    this.modal2Visible = this.modal2Visible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    // this.handleCancel = this.handleCancel.bind(this);
    this.filterList = this.filterList.bind(this);
    this.handlemodal1Cancel = this.handlemodal1Cancel.bind(this);
    this.handleModal2Cancel = this.handleModal2Cancel.bind(this);
  }

  state = {
    file: {},
    users: [],
    searchString: "",
    // visible: false,
    checked: false,
    value: "",
    data: {
      name: "",
      description: "",
      type: "free",
      // username: '',
      is_public: 1,
      photo: {},
      members_id: []
    },
    groupData: null,
    selectedUsers: [],
    submitted: false,
    loading: false,
    modal1Visible: false,
    modal2Visible: false,
    nextBtn: true
  };
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

  cancel=() => {
    this.setState({ modalVisible: false });
  }

  handleOnChangeName = (event) => {
    const { name, value } = event.target;
    let btnSatus;
    if (value === '') {
      btnSatus = true;
    } else {
      btnSatus = false;
    }
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        name: value,
      },
      nextBtn: btnSatus,
    });
  };


  handleOnChangeUserName = (event) => {
    const { username, value } = event.target;
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
        // username: value,
      },
      nextBtn: btnSatus,
    });
  };

  handleOnChangeDescription = (event) => {
    const { description , value } = event.target;
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
        description: value,
      },
      nextBtn: btnSatus,
    });
  };

  inputFileRef = null;


  handleChangePhotoButton = (e) => {
    e.preventDefault();
    this.inputFileRef.click();
  };

  handleChangePhotoFileInput = (e) => {
    const { data } = this.state;
    // const target = e.currentTarget;
    this.state.file = e.target.files[0];
    console.log("check file===========>", this.state.file);
    // validate file as image
    if (!this.state.file.type.startsWith("image/")) {
      alert('File is not an image');
      // return;
    }

    // const groupData = new FormData();
    // groupData.append('photo', this.state.file);
    // groupData.append('name', data.name);
    // groupData.append('description', data.description);
    // groupData.append('is_free', data.is_free);
    // groupData.append('is_public', data.is_public);
    // // groupData.append('username', data.username);
    // groupData.append('members_id', data.members_id);
    // console.log(groupData.get('is_free'));

    // this.state.data.photo = '1111';
    this.setState({
      ...this.state,
      file: e.target.files[0],
      // data: groupData,
      objectUrl: URL.createObjectURL(this.state.file)
    });

    console.log("data=============>", this.state.data);
  };

  /**
   *
   * @param id
   */

  goToContactId(id) {
    // console.log(id);
    this.setState({
      visible: false,
    });
  }

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
        Authorization: token,
      },
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
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: true,
        });
      });
  }

  filterList(event) {
    const { value } = event.target;
    const result = localStorage.getItem('result');
    this.setState({
      searchString: this.refs.search.value,
    });
  }

  componentWillMount() {
    this.setState({ contacts: localStorage.getItem('result') });
  }


  componentDidMount() {
    this.getContact();
    this.setState({
      loading: true,
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
      console.log('klklkllklklkl', selectedUsers);
      this.setState({
        selectedUsers,
        checked: true,
      });
      console.log('===========>', selectedUsers);
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
        selectedUsers,
      });
    }
    console.log('=======>SELECTED USERS', this.state.data);
  }

  selectContactWithId = (getID) => {
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
  };
  handleGrpSubmit(event) {
    event.preventDefault();
    this.appendChatMessage(this.messageInput.value, this.inputFileRef.value);
    this.messageInput.value = '';
    this.setState({
      isTyping: false,
      meta: null,
      replyMessage: null,
      chosenMessages: [],
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
        // 'Content-Type': 'application/json',
      },
    };


    const { data, file } = this.state;
    console.log("members_id====>", data.members_id);
    const RestO = (...args) => {
      return args;
    };
    const A = RestO(data.members_id);
    console.log("A==>", A);
    const groupData = new FormData();
    groupData.append("photo", file);
    groupData.append("name", data.name);
    groupData.append("description", data.description);
    groupData.append("type", data.type);
    groupData.append("is_public", data.is_public);
    // groupData.append('username', data.username);
    groupData.append("members_id", "[" + data.members_id + "]");
    console.log(groupData.get("photo"));
    console.log(groupData.get("name"));
    console.log(groupData.get("description"));
    console.log(groupData.get("type"));
    console.log(groupData.get("is_public"));
    console.log(groupData.get("members_id"));


    axios.post(`${API_ROOT}/api/v1/group/`, groupData, configHeader)
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
            modal2Visible: false,
          });
          history.push('/chat');
        }
      })
      .catch((error) => {
        this.componentDidMount();
        this.setState({
          loading: false,
          modal1Visible: false,
          modal2Visible: false,
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
          <span>New Group</span>
        </a>

        <Modal
          title="New Group"
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
            </a>,
          ]}
        >
          <form>
            <div className="gutter-example">
              <Row>
                <Col span={8}>
                  <div className="avatar-container">
                    <div className="avatar-uploader">
                      <img src={objectUrl || defaultImage} />
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
                <Col span={8} />
                {/*<Col span={16}>*/}
                  {/*<div className="field">*/}
                    {/*<input*/}
                      {/*name="username"*/}
                      {/*id="username"*/}
                      {/*type="text"*/}
                      {/*value={data.username}*/}
                      {/*placeholder="username"*/}
                      {/*onChange={this.handleOnChangeUserName}*/}
                    {/*/>*/}
                  {/*</div>*/}
                {/*</Col>*/}
                <Col span={8} />
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
            >Create</a>,
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
                <Icon type="loading" />
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
                      <img src={user.photo} className="contact-user-photo" alt="stars" />
                    </div>
                    }
                    {!user.photo &&
                    <Avatar
                      className="contact-user-photo contact-user-info-wrap"
                    >{user.first_name.charAt(0)
                        .toUpperCase()}</Avatar>
                    }
                    <div className="contact-name">
                      <span>{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                  </Link>
                </li>),
              )}
            </ul>
          </form>

        </Modal>


      </div>
    );
  }
}
