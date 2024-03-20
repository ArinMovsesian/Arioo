import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Tabs } from "antd";
import { v4 } from "uuid";
import { Docs } from "../../../../components/Files/Docs/Docs";
import { Media } from "../../../../components/Files/Media/Media";
import { Links } from "../../../../components/Files/Links/Links";
import { Audio } from "../../../../components/Files/Audio/Audio";
import {ChatAccountSidebar} from "../../../../components/ChatAccountSidebar";
import Conversations from '../../Conversations/Conversations';
import { Avatar, Input, Badge, message, Icon } from "antd";
import "./index.css";
import Hashids from "hashids";
import { API_ROOT } from "../../../../helpers/apiConfig";
import axios from "axios/index";
import ExpandSvg from '../../../../assets/svgs/expand.svg';
import CollapseSvg from '../../../../assets/svgs/minimum.svg';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

export class ContactLrgProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      conversations: [],
      users: [],
      media:[],
      contactObj: {},
    };
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

    const serverTime = conversationObj.last_msg.time_server;
    console.log("========================>>>>>>", serverTime);

    let threadValue = hashids.encode(sort[0], sort[1]);

    const threadobject = {
      "event": "history",
      "data": {
        "thread": threadValue,
        "time_server": serverTime,
      }
    };

    console.log(threadobject);
    console.log("THREAD", JSON.stringify(threadobject));

    this.socket.send(JSON.stringify(threadobject));

  }

  goToConversationId(id) {
    // history.push("/chat/" + id);

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
    this.getUsersbyParams();

  }

  getConversations() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token,
      },
    };
    axios.get(`${API_ROOT}/api/v1/conversation`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const conversations = response.data.data;
          localStorage.setItem("conversations", JSON.stringify(conversations));
          console.log('CONVERSATION', conversations);
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


  getMedia(){
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };
    axios.get(`${API_ROOT}/api/v1/media?page=0`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const Media = response.data.data;
          console.log('========>MEDIA', Media);
          this.setState({
            media: Media,
          });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
      });
  }


  componentDidMount() {
    this.getConversations();
    this.getMedia();
  }

  render() {
    const users = JSON.parse(localStorage.getItem("users"));
    const targetId = parseInt(this.props.match.params.id);
    const conversations = this.state.conversations;
    console.log('===========>', conversations);

    function isEqualConversation(conversation) {
      return conversation.target_id === parseInt(targetId);
    }

    function isEqualId(user) {
      return user.id === parseInt(targetId);
    }
    const contactObj = users.find(isEqualId);
    const conversationObj = conversations.find(isEqualConversation);

    console.log('>>>>>++++++++>>>>>>>', contactObj);
    return (
      <div className="chat-wrapper">
        <ChatAccountSidebar />
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
        <div className="large-profile-container">
          <div className="base-info-wrap">
            <div className="profile-dialog-wrap">
              <Link to={`/conversation/${contactObj.id}`}><img src={CollapseSvg} className="collapse-icon" /></Link>
              <a className="profile-dialog">
                <div className="profile-dialog-photo-wrap">
                  { contactObj.photo &&
                    <img src={contactObj.photo} className="profile-dialog-photo" alt="stars contacts"/>
                  }
                  { !contactObj.photo &&
                  <Avatar className="profile-dialog-photo contact-dialog-photo" alt="stars contacts">{contactObj.first_name.charAt(0).toUpperCase()}</Avatar>
                  }
                  </div>
                <div className="profile-dialog-message-wrap">
                  <div className="profile-message-wrap">
                    <span id="profile-name">{contactObj.first_name + ' ' + contactObj.last_name}</span>
                    <span>online</span>
                    <span id="profile-bio">{contactObj.bio}</span>
                    <div className="profile-meta-info-wrap">
                      <div className="profile-phone-wrap">
                        <div className="username-wrap">
                          <div className="info-container">
                            <div className="mobile-icon-info"></div>
                            <div className="txt-mob">
                              <span>+{contactObj.phone}</span>
                              <small>Phone Number</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="profile-moment-wrap">
                        <div className="username-wrap">
                          <div className="info-container">
                            <div className="moment-icon-info"></div>
                            <div className="txt-mom">
                              <span>{contactObj.first_name + ' ' + contactObj.last_name}</span>
                              <small>Moment</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="files-tab-wrap">
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab={<span>MEDIA</span>} key="1">
                <Media/>
              </TabPane>
              <TabPane tab={<span>DOCS</span>} key="2">
                <Docs/>
              </TabPane>
              <TabPane tab={<span>LINKS</span>} key="3">
                <Links/>
              </TabPane>
              <TabPane tab={<span>AUDIO</span>} key="4">
                <Audio/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
