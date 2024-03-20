import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Input, Badge, message, Icon } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Hashids from 'hashids';
import { v4 } from "uuid";
import { API_ROOT } from "../../helpers/apiConfig";
import {  SOCKET_URL } from '../../helpers/socketUrl';
import "./index.css";
import { ChatAccountSidebar } from "../../components/ChatAccountSidebar";
import Conversations from "./Conversations/Conversations";
import { ContactSmlProfile } from "./ContactProfile/ContactSmlProfile";
import MessageList from "./Messages/MessageList";
import { MessageInput } from "./Messages/MessageInput";
import axios from "axios/index";

const Search = Input.Search;

export class Chat extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: [],
      conversations: [],
      typing: false,
      submitted: false,
      loading: false,
    };
  }


  componentDidMount() {
    this.connection();
    this.getConversations();
  }

  componentDidUpdate() {
    localStorage.setItem("messages", JSON.stringify(this.state.messages));
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.event === "register") {
        console.log("===============>[SW] on register", JSON.parse(e.data));
      } else if (data.event === "history"){
        console.log("===============>[SW] on history", JSON.parse(e.data));
        const history = JSON.parse(e.data).data;
        console.log("----------------->HISTORY", history);
        this.setState({
          messages: history,
          isTyping: false
        });
      }
    }
  }


  getConversationbyThread() {

    const user = JSON.parse(localStorage.getItem("userObj"));
    const conversations = JSON.parse(localStorage.getItem("conversations"));
    const targetId = parseInt(this.props.match.params.id);
    const senderId = user.id;
    let hashids = new Hashids();
    const arry = [senderId, targetId];
    const sort = arry.sort(function(a, b) {
      return a - b;
    });

    function isEqualId(conversation) {
      return conversation.target_id === parseInt(targetId);
    }

    const conversationObj = conversations.find(isEqualId);

    const serverTime = conversationObj.last_update;

    let threadValue = hashids.encode(sort[0], sort[1]);

    const threadobject = {
      "event": "history",
      "data": {
        "thread": threadValue,
        "time_server": serverTime
      }
    };

    this.socket.send(JSON.stringify(threadobject));

  }


  componentWillUnmount() {
    if (!this.socket) return;
    try {
      this.socket.close();
    } catch (error) {
      console.log("Error in closing socket: ", error);
    }
  }

  connection() {
    this.socket = new WebSocket(`${SOCKET_URL}`);
    const uuidValue = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const fcmToken = localStorage.getItem("fcmToken");

    //registered data
    const object = {
      "event": "register",
      "data": {
        "token": token,
        "uuid": uuidValue,
        "push_token": fcmToken,
        "ostype": "web"
      }
    };

    // When a connection is made
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("[SW] on message", data);
    };

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify(object));
    };

    this.setState({ ws: this.socket });

    // Try to reconnect in 5 seconds
    this.socket.onclose = (e) => {
      console.log("Socket is closed. Reconnect will be attempted in 5 second.", e.data);
      setTimeout(() => {
        this.connection();
      }, 3000);
    };

    // A connection could not be made
    this.socket.onerror = function(event) {
      console.log(event);
    };

  }

  goToConversationId(id) {

    const user = JSON.parse(localStorage.getItem("userObj"));
    const senderId = user.id;
    const targetId = id;
    const time = Date.now().toString();

    let hashids = new Hashids();
    const arry = [senderId, targetId];
    const sort = arry.sort(function(a, b) {
      return a - b;
    });

    let threadValue = hashids.encode(sort[0], sort[1]);

    const object = {
      "event": "mstatus",
      "data": {
        "target_type": "single",
        "thread": threadValue,
        "target_id": targetId,
        "sender_id": senderId
      }
    };

    console.log(object);
    // send data to the server
    this.socket.send(JSON.stringify(object));
    this.getConversationbyThread();
  }


  getConversations() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };
    axios.get(`${API_ROOT}/api/v1/conversation`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const conversations = response.data.data;
          localStorage.setItem("conversations", JSON.stringify(conversations));
          let grpArr = [];
          let chnlArr = [];
          for(let i=0;i<conversations.length;i++){
            if(conversations[i].type==="group"){
               grpArr.push(conversations[i]);
              localStorage.setItem("groups", JSON.stringify(grpArr));
            }
            if(conversations[i].type==="channel"){
              chnlArr.push(conversations[i]);
            }
          }
          localStorage.setItem("groups", JSON.stringify(grpArr));
          localStorage.setItem("channels", JSON.stringify(chnlArr));

          this.setState({
            conversations: conversations,
            loading: false,
          });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
        this.setState({
          loading: true
        });
      });
  }

  componentWillUnmount() {
    if (!this.socket) return;
    try {
      this.socket.close();
    } catch (error) {
      console.log("Error in closing socket: ", error);
    }
  }

  render() {
  return (
      <div className="chat-wrapper">
        <ChatAccountSidebar/>
        <div className="conversation-wrapper">
          <Search
            className="conversation-search-box"
            placeholder="Search"
            onSearch={value => console.log(value)}
            onChange={this.filterList}
            style={{ width: 333, height: 71 }}
          />
          <Conversations/>
        </div>
        <div className="chat-messages-wrapper" style={{height: 'auto'}}>
          <div className="chat-messages-header">
          </div>
          <div className="chat-messages-body-start">
            <span>Please select a chat or make a contact to start messaging</span>
          </div>
        </div>
      </div>
    );
  }
}
