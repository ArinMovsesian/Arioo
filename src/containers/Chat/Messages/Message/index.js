import React from "react";
import PropTypes from "prop-types";

export default class Message extends React.Component {

  render() {
    const now = new Date( this.props.timestamp );
    return (
      <div>
        <div className="chat-user-info-wrap">
          <img className="chat-user-photo" alt="arioo users" />
        </div>
        <div className="chat-message">
          <span className="message-time">{this.props.timestamp}</span>&nbsp;
          <span>{this.props.text}</span>
        </div>
      </div>
    );
  }
}
