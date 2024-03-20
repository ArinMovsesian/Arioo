import React from "react";
import { Link } from "react-router-dom";
import { Avatar} from "antd";
import "./index.css";

export class ContactSmlProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const users = JSON.parse(localStorage.getItem("users"));
    console.log('USERS', users);
    const targetUser = users.find(function(user) {
      return user.id;
    });
    console.log('TARGET USER', targetUser);
    return (
      <div className="contact-profile-wrap">
        <div className="general-info">
          <div className="chat-base-account">
            <Avatar className="chat-square-avatar" shape="square" icon="user" size="large"/>
            <div className="chat-name"><span>zahra Ebrahimi</span></div>
          </div>
        </div>
        <div className="username-wrap">
          <div className="info-container">
            <div className="user-icon-info"></div>
            <div className="txt-info">
              <span>@foo</span>
              <span>Username</span>
            </div>
          </div>
        </div>
        <div className="username-wrap">
          <div className="info-container">
            <div className="bio-icon-info"></div>
            <div className="txt-info">
              <span>I'm a Designer</span>
              <span>Bio</span>
            </div>
          </div>
        </div>
        <div className="username-wrap">
          <div className="info-container">
            <div className="phone-icon-info"></div>
            <div className="txt-info">
              <span>+989121234567</span>
              <span>Phone Number</span>
            </div>
          </div>
        </div>
        <div className="username-wrap">
          <div className="info-container">
            <div className="notif-icon-info"></div>
            <div className="txt-info">
              <span>Notification</span>
              <span>Disable</span>
            </div>
          </div>
        </div>
        <div className="username-wrap">
          <div className="info-container">
            <div className="mom-icon-info"></div>
            <div className="txt-info">
              <span>Maryam Najafi</span>
              <span>Moment</span>
            </div>
          </div>
        </div>
        <div className="attach-photo-container">
          <div className="photo-txt-wrap">
            <span>Attachment Photos</span>
            <Link to='/'>view all</Link>
          </div>
        </div>
      </div>
    );
  }
}
