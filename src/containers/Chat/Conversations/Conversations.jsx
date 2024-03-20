import React from "react";
import { Link, NavLink } from "react-router-dom";
import Hashids from "hashids";
import { Input, Badge, message, Icon, Avatar } from "antd";
import axios from "axios/index";
import { API_ROOT } from "../../../helpers/apiConfig";
import { history } from "../../../helpers/history";
import "./index.css";

const Search = Input.Search;

export default class Conversations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
      submitted: false,
      loading: false,
    };
  }

  goToConversationId(id) {
    history.push("/chat/" + id);

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

  }

  getConversationbyThread(id) {

    const user = JSON.parse(localStorage.getItem("userObj"));
    let conversations = JSON.parse(localStorage.getItem("conversations"));
    const senderId = user.id;
    const targetId = id;
    let hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort(function(a, b) {
      return a - b;
    });

    function isEqualId(conversation) {
      return conversation.target_id === parseInt(targetId);
    }

    const conversationObject = conversations.find(isEqualId);

    const serverTime = conversationObject.last_msg.time_server;

    let threadValue = hashids.encode(sort[0], sort[1]);

    const threadobject = {
      "event": "history",
      "data": {
        "thread": threadValue,
        "time_server": serverTime
      }
    };

    this.socket.send(JSON.stringify(threadobject));
    this.goToConversationId();
    this.getUsersbyParams();
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
          this.setState({
            conversations: conversations
          });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
      });
  }

  filterList(event) {
    const updatedList = this.state.conversations;
    const updatedConversations = updatedList.filter(function(item) {
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });

    this.setState({ conversations: updatedConversations });
  }

  componentDidMount() {
    this.getConversations();
  }

  componentWillMount() {
    this.setState({ conversations: this.state.conversations });
  }

  render() {
    return (
      <div className="conversation-wrapper">
        <div className="conversation-list">
          <ul className="conversation-list-container">
            {this.state.loading &&
            <Icon type="loading" style={{ padding: "20px 0" }}/>
            }
            {this.state.conversations && this.state.conversations.map((conversation, index) =>
              <li className="chat-dialog-wrap" key={index}>
                {conversation.type === "single" &&
                <NavLink
                  to={`/conversation/${conversation.target_id}`}
                  activeClassName="active" className="chat-dialog"
                  onClick={this.getConversationbyThread.bind(this, conversation.target_id)}
                >
                  <div className="chat-dialog-photo-wrap">
                    {conversation.target.photo &&
                    <img src={conversation.target.photo} className="chat-dialog-photo" alt="stars contacts"/>
                    }
                    {!conversation.target.photo &&
                    <Avatar shape="square">{conversation.target.first_name.charAt(0)}</Avatar>
                    }
                  </div>
                  {conversation.target.active === 1 &&
                  <button className="chat-dialog-message-wrap" style={{border:"none"}}>
                    <div className="name-time-wrapper">
                      <div>
                        <Badge status="success"/>
                        <span
                          className="conversation-txts">{conversation.target.first_name + " " + conversation.target.last_name}</span>
                      </div>
                      <span
                        className="conversation-txts">{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                    </div>
                    <div className="meta-converstaion-data">
                      {conversation.unread_count > 0 &&
                      <div className="counter-badge">{conversation.unread_count}</div>
                      }
                      {conversation.unread_count === 0 &&
                      <div className="counter-badge" style={{ display: "none" }}>{conversation.unread_count}</div>
                      }                        </div>
                  </button>
                  }
                  {conversation.target.active === 0 &&
                  <a className="chat-dialog-message-wrap">
                    <div className="name-time-wrapper">
                      <div>
                        <span>{conversation.target.first_name + " " + conversation.target.last_name}</span>
                      </div>
                      <span>{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                    </div>
                    <div className="meta-converstaion-data">
                      {conversation.unread_count > 0 &&
                      <div className="counter-badge">{conversation.unread_count}</div>
                      }
                      {conversation.unread_count === 0 &&
                      <div className="counter-badge" style={{ display: "none" }}>{conversation.unread_count}</div>
                      }
                    </div>
                  </a>
                  }
                </NavLink>
                }
                {conversation.type === "group" &&
                <NavLink
                  to={`/conversation/${conversation.thread}`}
                  activeClassName="active" className="chat-dialog"
                  onClick={this.getConversationbyThread.bind(this, conversation.thread)}
                >
                  <div className="chat-dialog-photo-wrap">
                    {conversation.group.media &&
                    <img src={conversation.group.media.path} className="chat-dialog-photo" alt="stars contacts"/>
                    }
                    {!conversation.group.media &&
                    <Avatar shape="square">{conversation.group.name.charAt(0)}</Avatar>
                    }
                  </div>
                  <button className="chat-dialog-message-wrap" style={{border:"none"}}>
                    <div className="name-time-wrapper">
                      <div>
                        <span>{conversation.group.name}</span>
                      </div>
                      {conversation.last_msg &&
                      <span>{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                      }
                    </div>
                    <div className="meta-converstaion-data">
                      {conversation.last_msg &&
                      <span className="con-last-msg">{`${conversation.last_msg.content.substr(0, 10)}...`}</span>
                      }
                      {conversation.unread_count > 0 &&
                      <div className="counter-badge">{conversation.unread_count}</div>
                      }
                      {conversation.unread_count === 0 &&
                      <div className="counter-badge" style={{ display: "none" }}>{conversation.unread_count}</div>
                      }
                    </div>
                  </button>
                </NavLink>
                }
                {conversation.type === "channel" &&
                <NavLink
                  to={`/conversation/${conversation.thread}`}
                  activeClassName="active" className="chat-dialog"
                  onClick={this.getConversationbyThread.bind(this, conversation.thread)}
                >
                  <div className="chat-dialog-photo-wrap">
                    {conversation.channel.media &&
                    <img src={conversation.channel.media.path} className="chat-dialog-photo" alt="stars contacts"/>
                    }
                    {!conversation.channel.media &&
                    <Avatar shape="square">{conversation.channel.name.charAt(0)}</Avatar>
                    }
                  </div>
                   <button className="chat-dialog-message-wrap" style={{border:"none"}}>
                    <div className="name-time-wrapper">
                      <div>
                        <span>{conversation.channel.name}</span>
                      </div>
                      {conversation.last_msg &&
                      <span>{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                      }
                    </div>
                    <div className="meta-converstaion-data">
                      {conversation.last_msg &&
                      <span className="con-last-msg">{`${conversation.last_msg.content.substr(0, 10)}...`}</span>
                      }
                      {conversation.unread_count > 0 &&
                      <div className="counter-badge">{conversation.unread_count}</div>
                      }
                      {conversation.unread_count === 0 &&
                      <div className="counter-badge" style={{ display: "none" }}>{conversation.unread_count}</div>
                      }
                    </div>
                   </button>
                </NavLink>
                }
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
