import React from 'react';
import { Link, withRouter, Redirect, Route } from "react-router-dom";
import { Icon, Avatar } from 'antd';
import axios from 'axios/index';
import { v4 } from 'uuid';
import { API_ROOT } from '../../helpers/apiConfig';
import logo from '../../assets/svgs/logo-arioo.svg';
import './index.css';
import { Contact } from '../Contact';
import { Group } from '../../containers/Group';
import { Channel } from '../../containers/Channel';
import settingSVG from '../../assets/svgs/setting.svg';
import groupSVG from '../../assets/svgs/new_group.svg';
import channelSVG from '../../assets/svgs/channel.svg';
import Routes from "../../routes";


export class ChatAccountSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
    this.handleSignout = this.handleSignout.bind(this);
  }

  handleSignout(event) {
    event.preventDefault();
    localStorage.removeItem('channels');
    localStorage.removeItem('contacts');
    localStorage.removeItem('conversations');
    localStorage.removeItem('fcmToken');
    localStorage.removeItem('groups');
    localStorage.removeItem('messages');
    localStorage.removeItem('mobile');
    localStorage.removeItem('result');
    localStorage.removeItem('token');
    localStorage.removeItem('userObj');
    localStorage.removeItem('users');
    // console.log('HIS:',this.props);
  }

  getUser() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };
    axios.get(`${API_ROOT}/api/v1/user`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const userObj = response.data.data;
          localStorage.setItem("userObj", JSON.stringify(userObj));
          this.setState({
            user: userObj,
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getUser();
  }

  render() {
    const { user } = this.state;
    return (
      <div className="chat-info-sidebar">
        <div className="chat-logo-wrapper">
          <div className="chat-logo-container">
            <img src={logo} alt="Arioo" id="chat-logo" />
          </div>
        </div>
        <div className="chat-avatar-container">
          <div className="chat-base-account">
            { user.photo
              ?
              <img className="chat-square-avatar" src={user.photo} alt="user avatar" />
              :

              <Avatar className="chat-square-avatar">{user.first_name}</Avatar>
            }
            <div className="chat-name"><span>{user.first_name + " " + user.last_name}</span></div>
          </div>
        </div>
        <div className="chat-box-avatar">
          <div className="chat-box-info">
            { user.photo &&
              <img className="chat-avatar" src={user.photo} alt="user avatar"/>
            }
            { user.photo === null &&
              <img className="chat-avatar" src={user.photo} alt="user avatar"/>
            }
            <div className="chat-name-box"><span>{user.first_name + " " + user.last_name}</span></div>
          </div>
        </div>
        <div className="chat-menu-sidebar">
          <ul>
            <Contact/>
            <li className="sidebar-link" >
              <img src={settingSVG} alt="setting icon" />
              <Link className="signout-link" to={'/setting'} style={{paddingLeft: 5}}>Setting</Link>
            </li>
            <li className="sidebar-link new-group">
              <img src={groupSVG} alt="group icon" />
              <Group />
            </li>
            <li className="sidebar-link new-channel">
              <img src={channelSVG} alt="channel icon" />
              <Channel />
            </li>
            <li onClick={this.handleSignout}>
              <Icon type="logout" />
              <Link to="/home">log out</Link>
            </li>
          </ul>
        </div>
        <div className="moment-box">
          <Icon type="bulb"/>
          <span>Moments</span>
        </div>
      </div>
    );
  }
};
