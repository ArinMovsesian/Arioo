/**
 * @auther naamsteh < naemabadei.shayesteh@gmail.com >
 * Document By : naamesteh
 * Date of documantion : 01/07/2018
 * Review by : -
 * Date of review : -
 * This file renders the chat conversations.
 */
import React from "react";
import { Link } from 'react-router-dom';
import { Icon, Input, Modal, Button, message, Avatar } from "antd";
import axios from "axios/index";
import { history } from '../../helpers/history';
import { API_ROOT } from "../../helpers/apiConfig";
import "./index.css";
import { Links } from "../Files/Links/Links";
import contactSvg from '../../assets/svgs/Contact.svg';

const Search = Input.Search;

export class Contact extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      contactLists: [],
      searchString: '',
      visible: false,
      modal2Visible: false,
      value: "",
      data: {
        phone: "",
        firstName: "",
        lastName: ""
      },
      submitted: false,
      loading: false,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.setModal2Visible = this.setModal2Visible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  componentWillMount() {
    this.setState({ contacts: localStorage.getItem("result"), loading: true });
  }

  componentDidMount() {
    this.getContact();
  }

  showModal() {
    this.setState({
      visible: !this.state.visible
    });
  }

  setModal2Visible(modal2Visible) {
    this.setState({
      modal2Visible,
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

  goToContactId(id) {
    // history.push(`chat/contact/${id}`);
  }

  handleOnChange(event) {
    const { name, value } = event.target;
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        [name]: value
      },
    });
  }

  handleOnSubmit(event) {
    event.preventDefault();
    this.contactForm.reset();
    this.setState({
      submitted: true
    });
    const { data } = this.state;
    console.log(data);
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token,
        "agent": "web",
        "uuid": uuidValue,
        "Content-Type": "application/json"
      }
    };

    const newData = {
      contacts: [
        {
          name: data.firstName + " " + data.lastName,
          phone: data.phone,
        }
      ]
    };
    if (data.phone && data.firstName) {
      axios.post(`${API_ROOT}/api/v1/contact`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success("Adding was success!");
            this.setState({
              visible: false,
              modal2Visible: false,
            });
            this.getContact();
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
          console.log(error.response.data.error);
        });

    }
  }


  goToContactId(id){
    // console.log(id);
    this.setState({
      visible: false,
    });
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
          console.log("this is contact: ", response.data.data);
          const contacts = response.data.data.contact;
          // ********** GET CONTACT ********** //
          localStorage.setItem("contacts", JSON.stringify(contacts));
          // ********** GET CONTACT ********** //
          const users = response.data.data.user;
          const result = users.map(user => ({ name: user.first_name }));
          console.log("result: ", result);
          // ********** GET USERS ********** //
          localStorage.setItem("users", JSON.stringify(users));
          // ********** GET USERS ********** //
          // ********** GET RESULT ********** //
          localStorage.setItem("result", JSON.stringify(result));
          // ********** GET RESULT ********** //
          this.setState({
            contactLists: contacts,
            users: users,
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

  filterList(event){
    const { value } = event.target;
    const result = localStorage.getItem("result");
    this.setState({
      searchString: this.refs.search.value,
    });
  }

  render() {
    const { data } = this.state;
    let _users = this.state.users;
    let search = this.state.searchString.trim().toLowerCase();
    if (search.length > 0) {
      _users = _users.filter(function(user) {
        return user.first_name.toLowerCase().match(search);
      });
    }
    return (
      <div>
        <a className="sidebar-link" onClick={this.showModal}>
         <img src={contactSvg} alt="contact icon" />
          <span>Contact</span>
        </a>

        <Modal
          title="Contacts"
          wrapClassName="vertical-center-modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={() => this.setModal2Visible(true)}>New Contact</Button>
          ]}
        >
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

          <ul className="contact-list-wrap">
            {
              this.state.loading &&
              <Icon type="loading" />
            }
            {_users.map((user, index) =>
              <li className="contact-item" key={user.id}>
                <Link to={`/conversation/${user.id}`}
                onClick={this.goToContactId.bind(this, user.id)}
                >
                  { user.photo &&
                    <div className="contact-user-info-wrap">
                      <img src={user.photo} className="contact-user-photo" alt="stars"/>
                    </div>
                  }
                  { !user.photo &&
                  <Avatar className="contact-user-photo contact-user-info-wrap">{user.first_name.charAt(0).toUpperCase()}</Avatar>
                  }
                  <div className="contact-name">
                    <span>{user.first_name + ' ' + user.last_name}</span>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </Modal>
        <Modal
          title="Add new contact"
          wrapClassName="vertical-center-modal"
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}
          footer={[
            <Button key="back" onClick={() => this.setModal2Visible(false)}>cancel</Button>
          ]}
        >
          <form className="contact-form" ref={(val) => this.contactForm = val}>
            <div className="input-wrap">
              <Input type="tel" className="email-input" name="phone"
                     onChange={this.handleOnChange}
                     placeholder="phone: 98XXXXXXXXXX" required/>
            </div>
            <div className="input-wrap">
              <Input type="text" className="email-input" name="firstName"
                     onChange={this.handleOnChange}
                     placeholder="First name" required/>
            </div>
            <div className="input-wrap">
              <Input type="text" className="email-input" name="lastName"
                     onChange={this.handleOnChange}
                     placeholder="Last name" required/>
            </div>
            <div className="button-wrap">
              <Button onClick={this.handleOnSubmit}
                      className="btn-submit"
                      type="primary"
                      disabled={data.phone.length === 0 && data.firstName.length === 0}>
                Save</Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
