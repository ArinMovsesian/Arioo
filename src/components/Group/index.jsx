import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon,
  Input,
  Modal,
  Table,
  Col,
  Row,
  Button,
  message,
  Avatar,
  DatePicker,
  Checkbox
} from 'antd';
import axios from 'axios/index';
import { history } from '../../helpers/history';
import { API_ROOT } from '../../helpers/apiConfig';
import './index.css';
import groupSvg from '../../assets/svgs/Group.svg';
import defaultImage from '../../assets/svgs/upload-image.svg';

const Search = Input.Search;

export class Group extends React.Component {

  /**
   *
   * @param props
   */

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      searchString: '',
      visible: false,
      modal2Visible: false,
      checked: false,
      value: '',
      data: {
        phone: '',
        firstName: '',
        lastName: ''
      },
      submitted: false,
      loading: false
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.setModal2Visible = this.setModal2Visible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  showModal() {
    this.setState({
      visible: !this.state.visible
    });
  }

  /**
   *
   * @param modal2Visible
   */

  setModal2Visible(modal2Visible) {
    this.showModal(false);
    this.setState({
      modal2Visible
    });
  }


  handleOk() {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 3000);
  }


  handleCancel() {
    this.setState({ visible: false });
  }

  handleOnChange(event) {
    const { name, value } = event.target;
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        [name]: value
      }
    });
  }

  /**
   *
   * @param event
   */

  handleOnSubmit(event) {
    event.preventDefault();
    this.refs.form.reset();
    this.setState({
      submitted: true
    });
    const { data } = this.state;
    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'Authorization': token,
        'agent': 'web',
        'uuid': uuidValue,
        'Content-Type': 'application/json'
      }
    };

    const newData = {
      contacts: [
        {
          name: data.firstName + ' ' + data.lastName,
          phone: data.phone
        }
      ]
    };
    if (data.phone && data.firstName) {
      axios.post(`${API_ROOT}/api/v1/contact`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success('Adding was success!');
            this.setState({
              visible: false,
              modal2Visible: false
            });
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
          console.log(error.response.data.error);
        });

    }
  }

  /**
   *
   * @param id
   */

  goToContactId(id) {
    // console.log(id);
    this.setState({
      visible: false
    });
  }

  getContact() {
    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'agent': 'web',
        'uuid': uuidValue,
        'Authorization': token
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
            users: users,
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
    // this.setState({
    //   checked: e.target.checked,
    // });
  }

  selectContactId(itemId){
    let { messages, chosenMessages } = this.state;
    if (!chosenMessages.length) {
      chosenMessages = messages.filter((item, index) => {
        return itemId === item._id;
      });

      this.setState({
        selectedMember: chosenMessages,
        shown: true,
      });
      // console.log("===========>", chosenMessages);
    } else {
      let notAdded = chosenMessages.every((item, index) => {
        if (item._id === itemId) {
          chosenMessages.splice(index, 1);
          return false;
        } else {
          return true;
        }
      });

      if (notAdded) {
        messages.forEach((item) => {
          if (item._id === itemId) {
            chosenMessages.push(item);
          }
        });
      }

      this.setState({
        chosenMessages: chosenMessages,
        shown: true,
      });
    }
    // console.log("=======>CHOSEN MESSAGE", this.state.chosenMessages);
  }




  /**
   * @function render
   * @description Renders the component
   * @returns {*}
   */

  render() {
    const { data } = this.state;
    let _users = this.state.users;
    let search = this.state.searchString.trim()
      .toLowerCase();
    if (search.length > 0) {
      _users = _users.filter(function (user) {
        return user.first_name.toLowerCase()
          .match(search);
      });
    }
    return (
      <div>
        <a className="sidebar-link group-text" onClick={this.showModal}>
          <span>New Group</span>
        </a>

        <Modal
          title="New Group"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <a type="primary" onClick={() => this.showModal(false)}>Cancel</a>,
            <a className='next-btn' onClick={() => this.setModal2Visible(true)}
               type="primary">Next</a>
          ]}
        >
          <form>
            <div className="gutter-example">
              <Row>
                <Col span={8}>
                  <div className='media-photo'></div>
                </Col>
                <Col span={16}>
                  <Input type="name" className="name-input" name="name"
                         onChange={this.handleOnChange}
                         placeholder="Group Name" required/>
                </Col>
              </Row>
            </div>
          </form>
        </Modal>

        <Modal
          title="ADD Members"
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}
          footer={[
            <a className='next-btn'
               onClick={() => this.setModal2Visible(false) && this.showModal(false)}
               type="primary">Create</a>
          ]}
        >
          <form>
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
                <li className="contact-item" key={index}>
                  <Checkbox
                    onChange={this.toggle}
                    style={{ marginRight: 10 }}/>
                  <Link to={`/conversation/${user.id}`}
                        onClick={this.selectContactId.bind(this, user.id)}
                  >
                    {user.photo &&
                    <div className="contact-user-info-wrap">
                      <img src={user.photo} className="contact-user-photo" alt="stars"/>
                    </div>
                    }
                    {!user.photo &&
                    <Avatar
                      className="contact-user-photo contact-user-info-wrap">{user.first_name.charAt(0)
                      .toUpperCase()}</Avatar>
                    }
                    <div className="contact-name">
                      <span>{user.first_name + ' ' + user.last_name}</span>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </form>

        </Modal>


      </div>
    );
  }
}
