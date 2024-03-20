import React from "react";
import PropTypes from "prop-types";
import { Input, Button, message } from "antd";
import axios from "axios/index";
import { v4 } from "uuid";
import { API_ROOT } from "../../../../helpers/apiConfig";
import "./index.css";

export class MessageInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    // this.handleChange = this.handleChange.bind(this);
    this.handleMsgSubmit = this.handleMsgSubmit.bind(this);
  }


  //
  // handleChange(event) {
  //   event.preventDefault();
  //   this.setState({ value: event.target.value });
  // }


  handleMsgSubmit(event) {
    event.preventDefault();
    event.preventDefault();
    this.props.appendChatMessage(this.messageInput.value );
    this.messageInput.value = '';

    // if (this.socket && this.state.value) {
    //   this.setState({
    //     value: ""
    //   });
    //
    //   console.log("handleClick -----------> " + this.state.value);
    //
    //   const newMsg = {
    //     "event": "message",
    //     "data": {
    //       "global_id": "14543634145243243234",
    //       "thread": "9JUQ",
    //       "target_type": "single", // single or channel or group
    //       "target_id": 1 // in case the target_type is `single`
    //
    //     }
    //   };
    //
    //   console.log(newMsg);
    //   console.log(JSON.stringify(newMsg));
    //
    //   // send data to the server
    //   this.socket.onopen = () => this.socket.send(JSON.stringify(newMsg));

    // }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleMsgSubmit}>
          <input className="chat-messages-typing-input"
                 placeholder="Write a Message..."
                 ref={message => this.messageInput = message}
                 autoFocus="true"
          />
          <button>Send</button>
        </form>
      </div>
    );
  }
}
