import React from "react";
import PropTypes from "prop-types";
import { Input, Button, message } from "antd";
import axios from "axios/index";
import { v4 } from "uuid";
import { API_ROOT } from "../../../../helpers/apiConfig";
import Message from '../Message/index';
import "./index.css";

export default class MessageList extends React.Component{

  render(){
    return (
      <div className="chat-messages-body">
        <ul className="chat-message-list">
          {this.props.messages.map(message =>
            <Message timestamp={message.timestamp}
             owner={message.owner}
              key={message.id}
              text={message.text}
            />
          )}
        </ul>
      </div>
    );
  }
}
