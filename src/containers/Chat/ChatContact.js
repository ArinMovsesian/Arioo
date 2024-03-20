/**
 * @auther naamsteh < naemabadei.shayesteh@gmail.com >
 * Document By : naamesteh
 * Date of documantion : 01/07/2018
 * Review by : -
 * Date of review : -
 * This file renders the chat conversations.
 */
import React from "react";
import ReactDOM from "react-dom";
import Lightbox from "react-image-lightbox";
import { NavLink, Link } from "react-router-dom";
import { history } from "../../helpers/history";
import { Avatar, Input, Badge, message, Icon, Checkbox, Progress, Modal, Button } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { v4 } from "uuid";
import { API_ROOT } from "../../helpers/apiConfig";
import { SOCKET_URL } from "../../helpers/socketUrl";
import "react-image-lightbox/style.css";
import "./index.css";
import { ChatAccountSidebar } from "../../components/ChatAccountSidebar";
import Conversations from "./Conversations/Conversations";
import { ContactSmlProfile } from "./ContactProfile/ContactSmlProfile";
import MessageList from "./Messages/MessageList";
import { MessageInput } from "./Messages/MessageInput";
import Hashids from "hashids";
import axios from "axios/index";
import AttachBtnSvg from "../../assets/svgs/attach.svg";
import SendBtnSvg from "../../assets/svgs/send.svg";
import SeenSvg from "../../assets/svgs/delivery.svg";
import SentSvg from "../../assets/svgs/sent.svg";
import expandSvg from "../../assets/svgs/expand.svg";
import replySvg from "../../assets/svgs/reply.svg";

const Search = Input.Search;

const msgType = {
  text: {
    value: 0
  },
  image: {
    value: 1
  },
  video: { value: 2 },
  audio: { value: 3 },
  file: { value: 4 },
  sticker: { value: 5 }
};

let conversationObject;

export class ChatContact extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ws: null,
      messages: [],
      chats: [],
      chosenMessages: [],
      conversations: [],
      users: [],
      groups: [],
      channels: [],
      replyArray: [],
      forwardMessages: [],
      contactObj: {},
      groupObj: {},
      groupMember: [],
      groupImg: '',
      channelObj: {},
      channelImg: '',
      conversationObject: {},
      meta: {},
      reply: {},
      text: '',
      value: '',
      replyMessage: '',
      searchString: '',
      id: null,
      fId: null,
      checked: false,
      isTyping: false,
      messageSeen: false,
      submitted: false,
      shown: false,
      loading: false,
      wsLoading: false,
      visible: false,
      progressLoading: false,
      isOpen: false,
      progress: 0,
      name: '',
      senderid: '',
    };
    this.appendChatMessage = this.appendChatMessage.bind(this);
    this.handleMsgSubmit = this.handleMsgSubmit.bind(this);
    this.handelCancelUpload = this.handelCancelUpload.bind(this);
    this.handleCancelSelect = this.handleCancelSelect.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.handleCancelForward = this.handleCancelForward.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.filterList = this.filterList.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  inputFileRef = null;

  componentDidMount() {
    this.connection();
    setTimeout(() => {
      this.fetchHistory();
    }, 5000);
    this.getConversations();
    this.getConversationsById();
    this.scrollToBottom();
    this.getContactObj();


    this.getusers();
    this.getGroups();
    this.getChannels();
    this.getUsersbyParams();
    this.getGroupsbyParams();
    this.getChannelsbyParams();

    // if (localStorage.getItem("messages")) {
    //   this.setState({
    //     messages: JSON.parse(localStorage.getItem("messages")),
    //     loading: true
    //   });
    // }
  }


  componentWillUnmount() {
    if (!this.socket) return;
    try {
      this.socket.close();
    } catch (error) {
      console.log("Error in closing socket: ", error);
    }
  }


  // update messages by their events


  componentWillUpdate(nextProps) {
    const { refs } = this;
    const { messageList } = this.refs;
    this.historyChanged = nextProps.history.length !== this.props.history.length;
    if (this.historyChanged) {
      const { messageList } = this.refs;
      const scrollPos = messageList.scrollTop;
      const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
      this.scrollAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom);
    }
    if (!this.scrollAtBottom) {
      const numMessages = messageList.childNodes.length;
      this.topMessage = numMessages === 0 ? null : messageList.childNodes[0];
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
    // localStorage.setItem("messages", JSON.stringify(this.state.messages));
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // console.log('test--->', data);
      if (data.event === "message") {
        console.log("===============>[SW] on message", JSON.parse(e.data));
        const { conversations } = this.state;
        console.log("============>conversations", this.state.conversations);
        const dataThread = data.data.thread;
        console.log("============>dataThread", dataThread);
        const index = conversations.findIndex(({ thread }) => thread === dataThread);
        console.log("============>index", index);
        if (index === -1 || index === 0) {
          if (data.data.sender_id == this.props.match.params.id) {
            // conversations.push(data.data);
          } else {
            conversations.push(data.data);
          }
        } else {
          conversations[index].last_msg = data.data;
          console.log("=========>testConversation", conversations[index].last_msg);
        }
        // if (this.states.conversations.length === 0) {
        //   this.setState({
        //     conversations: [...this.state.conversations, data.data]
        //   });
        // } else {
        //   return;
        // }

        if (data.data.sender_id == this.props.match.params.id) {
          console.log("bozzzzzine->");
          this.setState({
            messages: [...this.state.messages, data.data],
            chats: [...this.state.messages, data.data],
            lastMessage: data.data,
            isTyping: false
          });
        } else {
          // this.setState({
          //   messages: [...this.state.messages, data.data],
          //   chats: [...this.state.messages, data.data],
          //   lastMessage: data.data,
          //   isTyping: false,
          // });
        }

        console.log("============>STATE", this.state.conversations);
      } else if (data.event === "typing") {
        console.log("===============>[SW] on typing", JSON.parse(e.data));
        const targetId = this.props.match.params.id;
        const sendid = JSON.parse(e.data).data.sender_id;
        this.setState({
          senderid: sendid
        });
        if (JSON.parse(e.data).data.sender_id == targetId) {
          this.setState({
            isTyping: true
          });
          setTimeout(() => {
            this.setState({
              isTyping: false
            });
          }, 1000);
        }
      } else if (data.event === "mstatus") {
      } else if (data.event === "msg_delete") {
        console.log("===============>[SW] on delete", JSON.parse(e.data));
      } else if (data.event === "register") {
        console.log("===============>[SW] on register", JSON.parse(e.data));
      } else if (data.event === "history") {
        console.log("===============>[SW] on history", JSON.parse(e.data));
        const conversations = JSON.parse(localStorage.getItem("conversations"));
        const history = JSON.parse(e.data);
        const reverseHistory = history.data.messages.reverse();
        const targetId = this.props.match.params.id;
        if (conversations.length > 0) {
          function isEqualId(conversation) {
            if (conversation.type === "single") {
              return conversation.target_id === parseInt(targetId);
            } else if (conversation.type == "group") {
              return conversation.thread === targetId;
            } else if (conversation.type == "channel") {
              return conversation.thread === targetId;
            }
          }
          conversationObject = conversations.find(isEqualId);
          console.log("this is conversation+_+_+_+_+_", conversationObject);
          const last_Msg = conversationObject.last_msg;
          this.setState({
            messages: reverseHistory
          });

          const obj1 = JSON.parse(e.data).data;
          const obj2 = obj1[Object.keys(obj1)[Object.keys(obj1).length - 1]];

          // console.log("aksjdhakhdk",last_Msg,JSON.parse(e.data).data,"object 2 is ================>",obj2);

          // const history = JSON.parse(e.data).data.reverse();
          const history = obj2;
          // const newHistory = history.push(last_Msg);
          if (history.length > 0) {
            const lastChatMsg = history[0];
            const lastTimeServer = lastChatMsg.time_server;
            localStorage.setItem(`history${lastChatMsg.target_id}`, JSON.stringify(lastChatMsg));
          } else {
            return;
          }
          if (this.historyChanged) {
            if (this.scrollAtBottom) {
              this.scrollToBottom();
            }
            if (this.topMessage) {
              ReactDOM.findDOMNode(this.topMessage).scrollIntoView();
            }
          }
          console.log("===============>HISTORY", history);
          this.setState({
            messages: history,
            isTyping: false
          });
        }
      } else if (data.event === "mstatus") {
        console.log("===============>[SW] on mstatus", JSON.parse(e.data));
        // localStorage.setItem("serverTime", JSON.stringify(data.data));
      }
      // localStorage.setItem("messages", JSON.stringify(this.state.messages));
    };
  }
  getusers() {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        agent: "web",
        uuid: uuidValue,
        Authorization: token
      },
    };
    axios.get(`${API_ROOT}/api/v1/contact?page=0`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const contacts = response.data.data.contact;
          localStorage.setItem("contacts", JSON.stringify(contacts));
          const users = response.data.data.user;
          localStorage.setItem("users", JSON.stringify(users));

          this.setState({
            users
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

  getGroups() {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        agent: "web",
        uuid: uuidValue,
        Authorization: token
      },
    };
    axios.get(`${API_ROOT}/api/v1/group`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          console.log("group is ", response.data.data);
          const groups = response.data.data;
          localStorage.setItem("groups", JSON.stringify(groups));
          this.setState({
            groups
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

  getChannels() {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        agent: "web",
        uuid: uuidValue,
        Authorization: token
      },
    };

    axios.get(`${API_ROOT}/api/v1/channel`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          console.log("channnel is ", response.data.data);
          const channels = response.data.data;
          localStorage.setItem("channels", JSON.stringify(channels));

          this.setState({
            channels
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

  getUsersbyParams() {
    const users = JSON.parse(localStorage.getItem("users"));
    const targetId = parseInt(this.props.match.params.id);

    function isEqualId(user) {
      return user.id === parseInt(targetId);
    }

    const contactObj = users.find(isEqualId);
    this.state.contactObj = contactObj;
  }

  getGroupsbyParams() {
    const groups = JSON.parse(localStorage.getItem("groups"));
    const thread = this.props.match.params.id;
    let groupImage = '';
    function isEqualId(groups) {
      if (groups.thread === thread) {
        if (groups.media != null ) {
          groupImage= groups.media.path;
        } else {
          groupImage= '';
        }
        return groups.thread == thread;
      }
      return false;

      // return group.thread == thread;
    }
    const group = groups.find(isEqualId);
    if (group) {
      this.getGroupMemeber(thread);
    }
    this.setState({
      groupObj: group,
      groupImg:groupImage,
    });
  }

  getGroupMemeber(thread) {
    const token = localStorage.getItem('token');

    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        Authorization: token
      },
    };
    axios.get(`${API_ROOT}/api/v1/groupSubscriptions/${thread}/`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          // const groupMember = response.data.data.member;
          this.setState({
            groupMember: response.data.data.member
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // return this.state.groupMember;
  }

  getChannelsbyParams() {
    const channels = JSON.parse(localStorage.getItem("channels"));
    const thread = this.props.match.params.id;
    let channelImage = "";

    function isEqualId(channel) {
      if (channel.thread == thread) {

        if (channel.media != null ) {
          channelImage = channel.media.path;
        } else {
          channelImage = '';
        }

        return channel.thread == thread;
        // return true;
      }
      return false;
    }
    const channel = channels.find(isEqualId);
    this.setState({
      channelObj: channel,
      channelImg: channelImage,
    });
    this.state.channelObj = channel;
    console.log("channel after set state()()()()()()",this.state.channelObj,this.state.channelImg);
  }

  // When contact or channel or gorup is select for chat
  getConversationbyThread(id) {
    const user = JSON.parse(localStorage.getItem("userObj"));
    const conversations = JSON.parse(localStorage.getItem("conversations"));
    const senderId = user.id;
    const targetId = id;
    const hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort((a, b) => a - b);

    function isEqualId(conversation) {
      if (conversation.type == "single") {
        console.log('in yek pv ast');
        return conversation.target_id == targetId;
      } else if (conversation.type == "group" || conversation.type == "channel") {
        console.log('in yek group ya channel ast');
        return conversation.thread == targetId;
      }
    }

    console.log("this is thread===========>", targetId);
    const conversationObject = conversations.find(isEqualId);
    console.log("/+/+/+/+/+_", conversationObject);
    let threadValue;
    if (conversationObject.type === "single") {
      threadValue = hashids.encode(sort[0], conversationObject.last_update);
    } else if (conversationObject.type === "group" || conversationObject.type === "channel") {
      threadValue = conversationObject.thread;
    }
    const serverTime = conversationObject.last_update;

    const threadobject = {
      event: "history",
      data: {
        thread: threadValue,
        time_server: serverTime
      }
    };

    this.socket.send(JSON.stringify(threadobject));
    this.goToConversationId();
    this.getUsersbyParams();
    this.componentDidMount();
    console.log('finisth onCLICKKKK------------>');
  }


  leaveBtnHandler(thread) {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        Authorization: token,
        Accept: "application/json",
        language: "en",
        app: "stars"
      },
    };

    console.log("language is ====>", configHeader);

    axios.post(`${API_ROOT}/api/v1/groupSubscriptions/${thread}/leave`, {}, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push({ pathname: "../chat" });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
        this.setState({
          loading: true,
        });
      });
  }

  leaveChannelBtnHandler(thread) {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        Authorization: token,
        Accept: "application/json",
        language: "en",
        app: "stars"
      },
    };

    console.log("language is ====>", configHeader);

    axios.post(`${API_ROOT}/api/v1/channelSubscriptions/${thread}/leave`, {}, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push({ pathname: "../chat" });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
        this.setState({
          loading: true,
        });
      });
  }


  connection = () => {
    this.socket = new WebSocket(`${SOCKET_URL}`);
    const uuidValue = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const fcmToken = localStorage.getItem("fcmToken");

    // registered data
    const object = {
      event: "register",
      data: {
        token,
        uuid: uuidValue,
        push_token: fcmToken,
        ostype: "web"
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

  replyMsg(Id, content, message) {
    console.log("reply ejra mishe");
    console.log("id===>", Id);
    console.log("content", content);
    console.log("message", message);
    let { messages, replyArray } = this.state;
    if (!replyArray.length) {
      replyArray = messages.filter((item, index) => message === item);
    }
    messages.forEach((item) => {
      if (message === item) {
        replyArray.push(item);
      }
    });
    this.setState({
      shown: false,
      checked: false,
      chosenMessages: [],
      messageReply: message,
      meta: message.meta,
      replyArray,
      replyMessage: content,
      id: Id,
      reply: {
        replyMessage: content,
        message,
        id: Id,
      },
    });
  }

  deleteMsg(message) {
    for (let j = 0; j < message.length; j++) {
      const conversationThread = message[j].thread;
      const globalId = message[j].global_id;
      const targetId = message[j].target_id;
      const targetType = message[j].target_type;
      const object = {
        event: "msg_delete",
        data: {
          global_id: globalId,
          thread: conversationThread,
          target_type: targetType,
          target_id: targetId,
          mutual: true
        }
      };
      const messages = this.state.messages;
      for (let i = 0; i < messages.length; i++) {
        if (messages[i]._id == message[j]._id) {
          messages.splice(i, 1);
          this.socket.send(JSON.stringify(object));
          this.setState({
            ...this.state,
            messages,
            shown: false,
            checked: false,
            chosenMessages: [],
          });
        }
      }
    }
  }

  addToChosen(itemId) {
    // console.log("itemid",itemId);
    console.log("addToChosen->itemId", itemId);
    let { messages, chosenMessages } = this.state;
    console.log("addToChosen->messages", messages);
    // console.log('addToChosen->chosenMessages', chosenMessages);
    if (!chosenMessages.length) {
      chosenMessages = messages.filter(item => item._id === itemId);
      console.log("addToChosen->chosenMessages", chosenMessages);
      // console.log('[chosenMessages]-->', chosenMessages);
      // this.state.chosenMessages = chosenMessages;
      // this.setState({
      //   //...chosenMessages,
      //   ...this.state,
      //   chosenMessages: chosenMessages,
      //   shown: true,
      // });
      this.setState({
        show: true,
        chosenMessages
      });
      // console.log("===========>", chosenMessages);
    } else {
      console.log("else exe!!!!");
      const notAdded = chosenMessages.every((item, index) => {
        if (item._id === itemId) {
          chosenMessages.splice(index, 1);
          return false;
        }
        return true;
      });

      if (notAdded) {
        messages.forEach((item) => {
          if (item._id === itemId) {
            chosenMessages.push(item);
          }
        });
      }
      console.log("addToChosen->chosenMessages in else", chosenMessages);

      this.setState({
        chosenMessages,
        shown: true,
      });
    }
    // console.log("=======>CHOSEN MESSAGE", this.state.chosenMessages);
  }

  forwardNavigation(i, name) {
    const { chosenMessages } = this.state;
    console.log("chosen message in forward", chosenMessages, i, name);
    history.push(`/conversation/${i}`);
    this.getConversationbyThread(i);
    this.setState({
      name,
      fId: i,
      visible: false,
      shown: false
    });
  }

  goToConversationId(id) {
    const user = JSON.parse(localStorage.getItem("userObj"));
    const senderId = user.id;
    const targetId = parseInt(this.props.match.params.id);
    const time = Date.now().toString();

    const hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort((a, b) => a - b);

    const threadValue = hashids.encode(sort[0], sort[1]);

    const object = {
      event: "mstatus",
      data: {
        target_type: "single",
        thread: threadValue,
        target_id: targetId,
        sender_id: senderId
      }
    };

    // send data to the server
    this.socket.send(JSON.stringify(object));
    this.setState({
      messageSeen: true
    });
  }

  appendChatMessage(content, file) {
    const { meta, item, replyMessage, id, chosenMessages, reply } = this.state;
    console.log('refrence --> id', id);
    console.log("chosenMessages: ", chosenMessages);
    console.log("meta: ", meta);
    console.log("replyMessage: ", replyMessage);
    console.log("id", id);
    console.log("reply", reply);
    const users = JSON.parse(localStorage.getItem("users"));
    const contacts = JSON.parse(localStorage.getItem("contacts"));
    const user = JSON.parse(localStorage.getItem("userObj"));
    const targetId = parseInt(this.props.match.params.id);
    const senderId = user.id;
    const time = Date.now().toString();
    const hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort((a, b) => a - b);
    const threadValue = hashids.encode(sort[0], sort[1]);


    const User = {
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.photo,
      username: user.username
    };


    const newMessage = {
      _id: this.state.messages.length,
      content,
      global_id: time.concat(senderId),
      type: 0,
      thread: threadValue,
      meta,
      reference_type: "none",
      reference_id: "",
      target_type: "single",
      target_id: targetId,
      sender_id: senderId,
      direction: 0,
      status: 0,
      time_created: new Date().getTime(),
      time_received: new Date().getTime(),
      time_server: new Date().getTime(),
      sender: User
    };

    const ImageMessage = {
      _id: this.state.messages.length,
      content,
      global_id: time.concat(senderId),
      type: 1,
      thread: threadValue,
      meta: {
        ...meta,
        type: 1,
      },
      reference_type: "none",
      reference_id: "",
      target_type: "single",
      target_id: targetId,
      sender_id: senderId,
      direction: 0,
      status: 0,
      time_created: new Date().getTime(),
      time_received: new Date().getTime(),
      time_server: new Date().getTime(),
      sender: User
    };

    const VideoMessage = {
      _id: this.state.messages.length,
      content,
      global_id: time.concat(senderId),
      type: 2,
      thread: threadValue,
      meta: {
        ...meta,
        type: 2
      },
      reference_type: "none",
      reference_id: "",
      target_type: "single",
      target_id: targetId,
      sender_id: senderId,
      direction: 0,
      status: 0,
      time_created: new Date().getTime(),
      time_received: new Date().getTime(),
      time_server: new Date().getTime(),
      sender: User
    };

    const newReplyMessage = {
      _id: this.state.messages.length,
      content,
      global_id: time.concat(senderId),
      type: 0,
      thread: threadValue,
      meta,
      reference_type: "reply",
      reference_id: id,
      target_type: "single",
      target_id: targetId,
      sender_id: senderId,
      direction: 0,
      status: 0,
      time_created: new Date().getTime(),
      time_received: new Date().getTime(),
      time_server: new Date().getTime(),
      sender: User
    };

    const newForwardMessage = {
      _id: this.state.messages.length,
      content,
      global_id: time.concat(senderId),
      type: 0,
      thread: threadValue,
      meta,
      reference_type: "forward",
      reference_id: id,
      target_type: "single",
      target_id: targetId,
      sender_id: senderId,
      direction: 0,
      status: 0,
      time_created: new Date().getTime(),
      time_received: new Date().getTime(),
      time_server: new Date().getTime(),
      sender: User
    };

    if (chosenMessages.length === 1) {
      console.log("firstIf");
      chosenMessages.map((cMsg) => {
        const forwardId = parseInt(cMsg.global_id);
      });
      let type=undefined;
      let desc;
      let name,photo,globalId,sourceThread;
      if(chosenMessages[0].target_type =="group"){
        type =1;
        name = this.state.groupObj.name;
        desc = this.state.groupObj.description;
        if(this.state.groupObj.media.path){
          photo = this.state.groupObj.media.path
        }else{
          photo='';
        }
        globalId= chosenMessages[0].global_id;
        sourceThread= chosenMessages[0].thread;
      }
      else if(chosenMessages[0].target_type =="channel"){
        type = 2;
        name = this.state.groupObj.name;
        desc = this.state.groupObj.description;
        if(this.state.groupObj.media.path){
          photo = this.state.groupObj.media.path
        }else{
          photo='';
        }
        globalId= chosenMessages[0].global_id;
        sourceThread= chosenMessages[0].thread;
      }
      else if(chosenMessages[0].target_type == 'single'){
        type = 0;
        name = '';
        desc ='';
        photo = '';
        globalId= chosenMessages[0].global_id;
        sourceThread= chosenMessages[0].thread;
      }
      const newMsg = {
        event: "message",
        data: {
          global_id: time.concat(senderId),
          content: chosenMessages[0].content,
          type: 0,
          thread: threadValue,
          meta: newMessage.meta,
          reference_type: "forward",
          reference_id: id,
          target_type: "single",
          target_id: targetId,
          sender_id: senderId,
          direction: 0,
          status: 0,
          time_created: new Date().getTime(),
          time_received: new Date().getTime(),
          time_server: new Date().getTime(),
          sender: User,
          source: {
            type: type,
            data: {
              name: name,
              description: desc,
              photo: photo,
              global_id: globalId,
              thread: sourceThread
            }
          }
        }
      };

      this.socket.send(JSON.stringify(newMsg));


      const newForwardMessageInForward = {
        _id: this.state.messages.length,
        content: chosenMessages[0].content,
        global_id: time.concat(senderId),
        type: 0,
        thread: threadValue,
        meta,
        reference_type: "forward",
        reference_id: id,
        target_type: "single",
        target_id: targetId,
        sender_id: senderId,
        direction: 0,
        status: 0,
        time_created: new Date().getTime(),
        time_received: new Date().getTime(),
        time_server: new Date().getTime(),
        sender: User
      };
      this.setState({
        messages: [...this.state.messages, newForwardMessageInForward],
        chats: [...this.state.messages, newForwardMessageInForward],
        lastMessage: newMsg
      });
    }
    if (!replyMessage && chosenMessages.length === 0) {
      console.log("secondIf");

      console.log(this.props.match.params.id);

      let regex = new RegExp("[a-zA-Z]");
      let typeDetection = regex.test(this.props.match.params.id);
      if (typeDetection) {
        console.log("group / channel");

        let typeDetection;
        if(conversationObject.type === 'group') {
          typeDetection = 'group';
        }else if(conversationObject.type === 'channel'){
          typeDetection = 'channel';
        };
        const newMsg = {
          event: "message",
          data: {
            global_id: time.concat(senderId),
            content: newMessage.content,
            type: 0,
            thread: this.props.match.params.id,
            meta: newMessage.meta,
            reference_type: "none",
            reference_id: "",
            target_type: typeDetection,
            target_id: null,
            sender_id: senderId,
            direction: 0,
            status: 0,
            time_created: new Date().getTime(),
            time_received: new Date().getTime(),
            time_server: new Date().getTime(),
            sender: User
          }
        };
        // console.log('=====>FILE', file);

        this.socket.send(JSON.stringify(newMsg));
        this.setState({
          messages: [...this.state.messages, newMessage],
          chats: [...this.state.messages, newMessage]
        });
        // console.log("=====>NEWMESSAGE", newMessage);
        // console.log("=====>Content", newMessage.content);

        const msgThread = newMessage.thread;
        // object
        const con = this.state.conversations.filter(item => item.thread === msgThread);
        // array
        const { conversations } = this.state;
        const index = conversations.findIndex(({ thread }) => thread === newMessage.thread);
        if (index === -1) {
          conversations.push(newMessage);
        } else {
          conversations[index].last_msg = newMessage;
        }


      } else {
        console.log("single");


        const newMsg = {
          event: "message",
          data: {
            global_id: time.concat(senderId),
            content: newMessage.content,
            type: 0,
            thread: threadValue,
            meta: newMessage.meta,
            reference_type: "none",
            reference_id: "",
            target_type: "single",
            target_id: targetId,
            sender_id: senderId,
            direction: 0,
            status: 0,
            time_created: new Date().getTime(),
            time_received: new Date().getTime(),
            time_server: new Date().getTime(),
            sender: User
          }
        };
        // console.log('=====>FILE', file);

        if(meta){
          console.log("meta darad");
          // this.socket.send(JSON.stringify(ImageMessage));
        }
        else if(!meta){
          console.log("meta nadarad");
          // this.socket.send(JSON.stringify(newMsg));
        }
        this.setState({
          messages: [...this.state.messages, newMessage],
          chats: [...this.state.messages, newMessage]
        });
        // console.log("=====>NEWMESSAGE", newMessage);
        // console.log("=====>Content", newMessage.content);

        const msgThread = newMessage.thread;
        // object
        const con = this.state.conversations.filter(item => item.thread === msgThread);
        // array
        const { conversations } = this.state;
        const index = conversations.findIndex(({ thread }) => thread === newMessage.thread);
        if (index === -1) {
          conversations.push(newMessage);
        } else {
          conversations[index].last_msg = newMessage;
        }





      }
    }
    else if (file) {
      console.log("thirdIf");
      if (item.type.startsWith("image/")) {
        const newMsg = {
          event: "message",
          data: {
            global_id: time.concat(senderId),
            content: newMessage.content,
            type: msgType.image.value,
            thread: threadValue,
            meta: {
              ...newMessage.meta,
              type: 1
            },
            reference_type: "none",
            target_type: "single",
            target_id: targetId,
            sender_id: senderId,
            direction: 0,
            status: 0,
            time_created: new Date().getTime(),
            time_received: new Date().getTime(),
            time_server: new Date().getTime(),
            sender: User
          },
        };

        this.socket.send(JSON.stringify(newMsg));
        // console.log(JSON.stringify("newMsg", newMsg));


        this.setState({
          messages: [...this.state.messages, ImageMessage],
          chats: [...this.state.messages, ImageMessage],
          lastMessage: newMsg
        });
        // console.log("=====>", ImageMessage);
        const msgThread = ImageMessage.thread;
        // object
        const con = this.state.conversations.filter(item => item.thread === msgThread);
        // array
        const { conversations } = this.state;
        const index = conversations.findIndex(({ thread }) => thread === ImageMessage.thread);
        if (index === -1) {
          conversations.push(ImageMessage);
        } else {
          conversations[index].last_msg = ImageMessage;
        }
        console.log("============>IMAGE MESSAGE", conversations);
      }
      else if (item.type.startsWith("video/")) {
        const newMsg = {
          event: "message",
          data: {
            global_id: time.concat(senderId),
            content: newMessage.content,
            type: msgType.video.value,
            thread: threadValue,
            meta: {
              ...newMessage.meta,
              type: 2
            },
            reference_type: "none",
            target_type: "single",
            target_id: targetId,
            sender_id: senderId,
            direction: 0,
            status: 0,
            time_created: new Date().getTime(),
            time_received: new Date().getTime(),
            time_server: new Date().getTime(),
            sender: User
          },
        };

        this.socket.send(JSON.stringify(newMsg));
        // console.log(JSON.stringify("NEW MESSAGE", newMsg));

        this.setState({
          messages: [...this.state.messages, VideoMessage],
          chats: [...this.state.messages, VideoMessage],
          lastMessage: newMsg
        });
        // console.log("=====>", VideoMessage);
        const msgThread = VideoMessage.thread;
        // object
        const con = this.state.conversations.filter(item => item.thread === msgThread);
        // array
        const { conversations } = this.state;
        const index = conversations.findIndex(({ thread }) => thread === VideoMessage.thread);
        if (index === -1) {
          conversations.push(VideoMessage);
        } else {
          conversations[index].last_msg = VideoMessage;
        }
      }
    }
    else if (replyMessage && id) {
      console.log("fourthIf");
      const newMsg = {
        event: "message",
        data: {
          global_id: time.concat(senderId),
          content: newMessage.content,
          type: 0,
          thread: threadValue,
          meta: newMessage.meta,
          reference_type: "reply",
          reference_id: id,
          target_type: "single",
          target_id: targetId,
          sender_id: senderId,
          direction: 0,
          status: 0,
          time_created: new Date().getTime(),
          time_received: new Date().getTime(),
          time_server: new Date().getTime(),
          sender: User
        }
      };

      this.socket.send(JSON.stringify(newMsg));
      this.setState({
        messages: [...this.state.messages, newReplyMessage],
        chats: [...this.state.messages, newReplyMessage],
        lastMessage: newMsg
      });
      // console.log("=====>newReplyMessage", newReplyMessage);
      const msgThread = newReplyMessage.thread;
      // object
      const con = this.state.conversations.filter(item => item.thread === msgThread);
      // array
      const { conversations } = this.state;
      const index = conversations.findIndex(({ thread }) => thread === newReplyMessage.thread);
      if (index === -1) {
        conversations.push(newReplyMessage);
      } else {
        conversations[index].last_msg = newReplyMessage;
      }
    }
    else if (reply && chosenMessages.length === 0) {
      console.log("fifthIf");
      const newMsg = {
        event: "message",
        data: {
          global_id: time.concat(senderId),
          content: newMessage.content,
          type: 0,
          thread: threadValue,
          meta: newMessage.meta,
          reference_type: "reply",
          reference_id: id,
          target_type: "single",
          target_id: targetId,
          sender_id: senderId,
          direction: 0,
          status: 0,
          time_created: new Date().getTime(),
          time_received: new Date().getTime(),
          time_server: new Date().getTime(),
          sender: User
        }
      };

      this.socket.send(JSON.stringify(newMsg));
      this.setState({
        messages: [...this.state.messages, newReplyMessage],
        chats: [...this.state.messages, newReplyMessage],
        lastMessage: newMsg
      });
      // console.log("=====>newReplyMessage", newReplyMessage);
      const msgThread = newReplyMessage.thread;
      // object
      const con = this.state.conversations.filter(item => item.thread === msgThread);
      // array
      const { conversations } = this.state;
      const index = conversations.findIndex(({ thread }) => thread === newReplyMessage.thread);
      if (index === -1) {
        conversations.push(newReplyMessage);
      } else {
        conversations[index].last_msg = newReplyMessage;
      }
    }
    // else if (chosenMessages) {
    //   console.log("sixthIF");
    //   const newMsg = {
    //     event: "message",
    //     data: {
    //       global_id: time.concat(senderId),
    //       content: newMessage.content,
    //       type: 0,
    //       thread: threadValue,
    //       meta: newMessage.meta,
    //       reference_type: "forward",
    //       reference_id: id,
    //       target_type: "single",
    //       target_id: targetId,
    //       sender_id: senderId,
    //       direction: 0,
    //       status: 0,
    //       time_created: new Date().getTime(),
    //       time_received: new Date().getTime(),
    //       time_server: new Date().getTime(),
    //       sender: User
    //     }
    //   };
    //
    //   this.socket.send(JSON.stringify(newMsg));
    //   this.setState({
    //     messages: [...this.state.messages, newForwardMessage],
    //     chats: [...this.state.messages, newForwardMessage],
    //     lastMessage: newMsg
    //   });
    //   // console.log("=====>newReplyMessage", newReplyMessage);
    // }
  }

  getConversations() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        Accept: "application/json",
        language: "en",
        app: "stars",
        Authorization: token
      },
    };
    axios.get(`${API_ROOT}/api/v1/conversation`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const conversations = response.data.data;
          localStorage.setItem('conversations', JSON.stringify(conversations));
          this.setState({
            conversations,
            loading: false,
          });
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
        this.setState({
          loading: true,
        });
      });
  }

  getConversationsById() {
    const conversations = JSON.parse(localStorage.getItem("conversations"));
    const targetId = parseInt(this.props.match.params.id);

    function isEqualConversation(conversation) {
      return conversation.target_id === parseInt(targetId);
    }

    const conversationObject = conversations.find(isEqualConversation);
    localStorage.setItem('conversationObject', JSON.stringify(conversationObject));
    this.setState({
      conversationObject
    });
  }

  getContactObj() {
    const contactId = this.props.match.params.id;
    const users = this.state.users;
  }

  toggle(e) {
    console.log('checked = ', e.target.checked);
    this.setState({
      shown: true,
      checked: e.target.checked,
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const targetId = parseInt(this.props.match.params.id);

    if (this.messageInput.value.length === 0) {
      this.setState({
        [name]: value,
        isTyping: false,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }


    const typingObj = {
      event: "typing",
      data: {
        target_id: targetId
      }
    };

    this.socket.send(JSON.stringify(typingObj));
  }

  handleMsgSubmit(event) {
    event.preventDefault();
    this.appendChatMessage(this.messageInput.value, this.inputFileRef.value);
    this.messageInput.value = '';
    this.setState({
      isTyping: false,
      meta: null,
      checked: false,
      replyMessage: null,
      chosenMessages: [],
    });
  }
  filterList(event) {
    const { value } = event.target;
    this.setState({
      searchString: this.refs.search.value
    });
  }

  handelCancelUpload = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      file: null,
      meta: null
    });
  };
  handleCancelSelect = (e) => {
    e.preventDefault();
    this.setState({
      shown: false,
      checked: false,
      chosenMessages: [],
    });
  };
  handleCancelReply = (e) => {
    e.preventDefault();
    this.setState({
      replyMessage: '',
      id: null,
      reply: {},
    });
  };
  handleCancelForward = (e) => {
    e.preventDefault();
    this.setState({
      chosenMessages: []
    });
  };

  // Simulate click of the file upload input.
  handleChangeFileButton = (e) => {
    e.preventDefault();
    this.inputFileRef.click();
  };


  handleChangeFileInput = (event) => {
    const target = event.currentTarget;
    const file = target.files.item(0);

    // validate file as image
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return;
    }

    const media = new FormData();
    media.append('media', file);
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        language: "en",
        app: "stars",
        Authorization: token
      },

      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // console.log(percentCompleted);
        this.setState({
          progress: percentCompleted,
          progressLoading: true
        });
        // console.log("==========>", this.state.progress);
      },
    };

    if (media && file) {
      axios.post(`${API_ROOT}/api/v1/media`, media, config)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data.data;
            const Meta = {
              dimension: `${data.width}x${data.height}`,
              local_path: data.path,
              remote_thumb_url: data.thumb,
              remote_url: data.path,
              size: data.size
            };
            const item = {
              name: file.name,
              size: file.size,
              type: file.type
            };
            this.setState({
              ...this.state,
              meta: Meta,
              progressLoading: false,
              file,
              item
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  showModal() {

    this.setState({
      visible: !this.state.visible
      // id: this.props.match.params.id ,
    });
    // console.log("=======>FORWARDCHOSEN", this.state.chosenMessages);
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  fetchLastHistory() {
    const user = JSON.parse(localStorage.getItem('userObj'));
    const conversations = JSON.parse(localStorage.getItem("conversations"));
    const targetId = parseInt(this.props.match.params.id);
    const senderId = user.id;
    const hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort((a, b) => a - b);
    const lastMsgHistory = JSON.parse(localStorage.getItem(`history${targetId}`));

    if (conversations.length > 0) {
      if (lastMsgHistory) {
        const serverTime = lastMsgHistory.time_server;

        function isEqualId(conversation) {
          return conversation.target_id === parseInt(targetId);
        }

        const conversationObject = conversations.find(isEqualId);
        // console.log("CONVERSATION OBJECT", conversationObject);
        const threadValue = hashids.encode(sort[0], sort[1]);

        const threadobject = {
          event: "history",
          data: {
            thread: threadValue,
            time_server: serverTime
          }
        };

        this.socket.send(JSON.stringify(threadobject));
        this.goToConversationId();
        this.getUsersbyParams();
      } else {

      }
    }
  }

  fetchHistory() {
    const user = JSON.parse(localStorage.getItem('userObj'));
    const conversations = JSON.parse(localStorage.getItem("conversations"));
    const targetId = parseInt(this.props.match.params.id);
    const senderId = user.id;
    const hashids = new Hashids("stars");
    const arry = [senderId, targetId];
    const sort = arry.sort((a, b) => a - b);

    if (conversations.length > 0) {
      function isEqualId(conversation) {
        return conversation.target_id === parseInt(targetId);
      }

      const conversationObject = conversations.find(isEqualId);
      // console.log("CONVERSATION OBJECT", conversationObject);
      if (conversationObject) {
        const serverTime = conversationObject.last_msg.time_server;
        const threadValue = hashids.encode(sort[0], sort[1]);

        const threadobject = {
          event: "history",
          data: {
            thread: threadValue,
            time_server: serverTime
          },
        };

        this.socket.send(JSON.stringify(threadobject));
        this.goToConversationId();
        this.getUsersbyParams();
      } else {

      }
    } else {

    }
  }

  onScroll() {
    const { refs } = this;
    const scrollTop = refs.messageList.scrollTop;
    if (scrollTop === 0) {
      this.fetchLastHistory();
    }
  }

  scrollToBottom() {
    const { messageList } = this.refs;
    const scrollHeight = messageList.scrollHeight;
    const height = messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const shown = {
      display: this.state.shown ? "block" : "none"
    };

    const hidden = {
      display: this.state.shown ? "none" : "block"
    };
    const { replyMessage, file, isOpen, meta, messages, id, messageSeen, messageReply, chosenMessages, reply } = this.state;
    console.log('render messages: ', messages);
    const user = JSON.parse(localStorage.getItem('userObj'));

    const users = JSON.parse(localStorage.getItem('users'));
    const groups = JSON.parse(localStorage.getItem('groups'));
    const targetId = parseInt(this.props.match.params.id);
    const conversations = this.state.conversations;

    function isEqualConversation(conversation) {
      return conversation.target_id === parseInt(targetId);
    }

    function isEqualId(user) {
      return user.id === parseInt(targetId);
    }

    function isEqualReplyMsg(msg) {
      return msg.global_id === id;
    }

    const replyMsg = messages.find(isEqualReplyMsg);


    const contactObj = users.find(isEqualId);
    const { groupObj } = this.state;
    const { channelObj } = this.state;
    const conversationObj = conversations.find(isEqualConversation);

    let _conversations = this.state.conversations;
    const search = this.state.searchString.trim().toLowerCase();
    if (search.length > 0) {
      _conversations = _conversations.filter((conversation) => {
        if (conversation.type === 'single') {
          return conversation.target.first_name.toLowerCase().match(search);
        } else if (conversation.type === 'group') {
          return conversation.group.name.toLowerCase().match(search);
        } else if (conversation.type === 'channel') {
          return conversation.channel.name.toLowerCase().match(search);
        }
      });
    }

    const lastMessage = messages[messages.length - 1];

    return (
      <div className="chat-wrapper">
        <ChatAccountSidebar />
        <div>
          <div className="conversation-search-box">
            <input
              type="text"
              className="search-contacts"
              value={this.state.searchString}
              ref="search"
              onChange={this.filterList}
              placeholder="Search"
              style={{ width: 349, height: 68 }}
            />
          </div>
          <div className="conversation-list">
            <ul className="conversation-list-container">
              {this.state.loading &&
              <Icon type="loading" style={{ padding: "20px 0" }}/>
              }
              {_conversations && _conversations.map((conversation, index) =>
                (<li className="chat-dialog-wrap" key={index}>
                  {
                    conversation.type === "single" &&
                    <NavLink
                    to={`/conversation/${conversation.target_id}`}
                    activeClassName="active"
                    className="chat-dialog"
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
                    <button className="chat-dialog-message-wrap" style={{ border: "none" }}>
                      <div className="name-time-wrapper">
                        <div>
                          <Badge status="success" />
                          <span
                            className="conversation-txts"
                          >{`${conversation.target.first_name} ${conversation.target.last_name}`}</span>
                        </div>
                        {/* {lastMessage && lastMessage.thread !== conversation.thread && ( */}
                        {/* <span className="conversation-txts">{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span> */}
                        {/* )} */}
                        {/* {lastMessage && lastMessage.thread === conversation.thread && ( */}
                        {/* <span className="conversation-txts">{new Date(lastMessage.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span> */}
                        {/* )} */}
                        <span
                          className="conversation-txts"
                        >{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                      </div>
                      <div className="meta-converstaion-data">
                        {/* {lastMessage && lastMessage.thread !== conversation.thread && ( */}
                        {/* <span className="con-last-msg conversation-txts">{`${conversation.last_msg.content.substr(0, 10)}...`}</span> */}
                        {/* )} */}
                        {/* {lastMessage && lastMessage.thread === conversation.thread && lastMessage.type === 0 && ( */}
                        {/* <span */}
                        {/* className="con-last-msg conversation-txts">{`${lastMessage.content.substr(0, 10)}...`}</span> */}
                        {/* ) */}
                        {/* } */}
                        {conversation.last_msg.type === 1 && (
                          <span className="con-last-msg conversation-txts">Photo</span>
                        )
                        }
                        {conversation.last_msg.type === 2 && (
                          <span className="con-last-msg conversation-txts">Video</span>
                        )
                        }
                        <span
                          className="con-last-msg conversation-txts"
                        >{`${conversation.last_msg.content.substr(0, 10)}...`}</span>
                        {conversation.unread_count > 0 &&
                        <div className="counter-badge">{conversation.unread_count}</div>
                        }
                        {conversation.unread_count === 0 &&
                        <div className="counter-badge" style={{ display: 'none' }}>{conversation.unread_count}</div>
                        }
                      </div>
                    </button>
                    }
                    {conversation.target.active === 0 &&
                    <a className="chat-dialog-message-wrap">
                      <div className="name-time-wrapper">
                        <div>
                          <span>{`${conversation.target.first_name} ${conversation.target.last_name}`}</span>
                        </div>
                        {/* {lastMessage && lastMessage.thread !== conversation.thread && ( */}
                        {/* <span className="conversation-txts">{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span> */}
                        {/* )} */}
                        {/* {lastMessage && lastMessage.thread === conversation.thread && ( */}
                        {/* <span className="conversation-txts">{new Date(lastMessage.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span> */}
                        {/* )}                      */}
                        <span
                          className="conversation-txts"
                        >{new Date(conversation.last_msg.time_created).toLocaleTimeString().replace(/:\d+ /, " ")}</span>
                      </div>
                      <div className="meta-converstaion-data">
                        {/* {lastMessage && lastMessage.thread !== conversation.thread && ( */}
                        {/* <span className="con-last-msg conversation-txts">{`${conversation.last_msg.content.substr(0, 10)}...`}</span> */}
                        {/* )} */}
                        {/* {lastMessage && lastMessage.thread === conversation.thread && lastMessage.type === 0 && ( */}
                        {/* <span */}
                        {/* className="con-last-msg conversation-txts">{`${lastMessage.content.substr(0, 10)}...`}</span> */}
                        {/* ) */}
                        {/* } */}
                        {/* {lastMessage && lastMessage.type === 1 && lastMessage.thread === conversation.thread && ( */}
                        {/* <span className="con-last-msg conversation-txts">Photo</span> */}
                        {/* ) */}
                        {/* } */}
                        {/* {lastMessage && lastMessage.type === 2 && lastMessage.thread === conversation.thread && ( */}
                        {/* <span className="con-last-msg conversation-txts">Video</span> */}
                        {/* ) */}
                        {/* } */}
                        {conversation.last_msg.type === 0 &&
                        <span
                          className="con-last-msg conversation-txts"
                        >{`${conversation.last_msg.content.substr(0, 10)}...`}</span>
                        }
                        {conversation.last_msg.type === 1 && (
                          <span className="con-last-msg conversation-txts">Photo</span>
                        )
                        }
                        {conversation.last_msg.type === 2 && (
                          <span className="con-last-msg conversation-txts">Video</span>
                        )
                        }
                        {conversation.unread_count > 0 &&
                        <div className="counter-badge">{conversation.unread_count}</div>
                        }
                        {conversation.unread_count === 0 &&
                        <div className="counter-badge" style={{ display: 'none' }}>{conversation.unread_count}</div>
                        }
                      </div>
                    </a>
                    }
                  </NavLink>
                  }
                  {
                    conversation.type === "group" &&
                    <NavLink
                    to={`/conversation/${conversation.thread}`}
                    activeClassName="active"
                    className="chat-dialog"
                    onClick={this.getConversationbyThread.bind(this, conversation.thread)}
                  >
                    <div className="chat-dialog-photo-wrap">
                      {conversation.group.media &&
                      <img
                        src={conversation.group.media.path}
                        className="chat-dialog-photo"
                        alt="stars contacts"
                      />
                      }
                      {!conversation.group.media &&
                      <Avatar shape="square">{conversation.group.name.charAt(0)}</Avatar>
                      }
                    </div>
                    <button className="chat-dialog-message-wrap" style={{ border: "none" }}>
                      <div className="name-time-wrapper">
                        <div>
                          <span>{conversation.group.name}</span>
                        </div>
                        {conversation.last_msg &&
                        <span>{new Date(conversation.last_msg.time_created).toLocaleTimeString()
                          .replace(/:\d+ /, " ")}</span>
                        }
                      </div>
                      <div className="meta-converstaion-data">
                        {conversation.last_msg &&
                        <span
                          className="con-last-msg"
                        >{`${conversation.last_msg.content.substr(0, 10)}...`}
                        </span>
                        }
                        {conversation.unread_count > 0 &&
                        <div className="counter-badge">{conversation.unread_count}</div>
                        }
                        {conversation.unread_count === 0 &&
                        <div className="counter-badge" style={{ display: 'none' }} >
                          {conversation.unread_count}
                        </div>
                        }
                      </div>
                    </button>
                  </NavLink>
                  }
                  {
                    conversation.type === "channel" &&
                    <NavLink
                      to={`/conversation/${conversation.thread}`}
                      activeClassName="active"
                      className="chat-dialog"
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
                      <button className="chat-dialog-message-wrap" style={{ border: "none" }}>
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
                </li>),
              )}
            </ul>
          </div>
        </div>

        {/** *******chat-messages-wrapper******** */}

        <div className="chat-messages-wrapper">
          <div className="chat-messages-header">
            {contactObj &&
            <span>{`${contactObj.first_name} ${contactObj.last_name}`}</span>
            }
            {!contactObj && !channelObj && !groupObj && conversationObj &&
            <span>{`${conversationObj.target.first_name} ${conversationObj.target.last_name}`}</span>
            }
            <br/>
            {this.state.wsLoading === true && (<span> Waiting for network... </span>)}
            {this.state.isTyping === true && (<span style={{ paddingLeft: 2 }}> typing...</span>)}
          </div>
          <div>
            <div className="chat-messages-body" id="chat-body" ref="messageList" onScroll={this.onScroll}>
              <ul className="chat-message-list">
                {console.log("@@@@@", this.state.messages)}
                {
                  this.state.messages.map((message, index) => {

                    if (message.reference_type === "reply") {
                      // console.log(message);
                      const arrs = messages.filter(msg => message.reference_id === msg.global_id);
                      // console.log("=======>A", arrs);
                      arrs.map((arr, i) => <span key={i}>{arr.content}</span>);
                      // console.log("=======>B");
                      return (
                        <li key={index}>
                          <a onClick={this.addToChosen.bind(this, message._id)}>
                            <Checkbox
                              onChange={this.toggle}
                              checked={this.state.checked}
                              style={{ marginRight: 10 }}
                            />
                            <div className="target-message">
                              {
                                message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <img
                                    src={message.sender.photo}
                                    className="chat-user-photo"
                                    alt="stars users"
                                  />
                                </div>
                              }
                              {
                                !message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <Avatar
                                    className="contact-user-photo contact-user-info-wrap"
                                  >
                                    {message.sender.first_name}
                                  </Avatar>
                                </div>
                              }
                              <div className="chat-message">
                                <div className="target-msg-wrap">
                                  {message.meta && (message.type === 1) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <img src={message.meta.remote_url}/>
                                      {isOpen && (
                                        <Lightbox
                                          mainSrc={message.meta.remote_url}
                                          onCloseRequest={() => this.setState({ isOpen: false })}
                                        />
                                      )}
                                    </a>
                                  )
                                  }
                                  {message.meta && (message.type === 2) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <video width="200" controls>
                                        <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                      </video>
                                    </a>
                                  )
                                  }
                                  <blockquote>
                                    <a href={`/conversation/${message.sender.id}`}>{`${message.sender.first_name} ${message.sender.last_name}`}</a>
                                    {arrs.map((arr, i) => <span key={i}>{arr.content}</span>)}
                                  </blockquote>
                                  <span>{message.content}</span>
                                </div>
                                <div className="timer-target-wrap">
                                <span
                                  className="message-time"
                                >{new Date(message.time_created).toLocaleTimeString()
                                  .replace(/:\d+ /, " ")}</span>&nbsp;
                                </div>
                                {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                                <div className="timer-target-wrap">
                                  <img
                                    src={SentSvg}
                                    className="message-status-icon"
                                    alt="message sent"
                                  />
                                </div>
                                }
                              </div>
                            </div>
                          </a>
                          <a
                            className="reply-icon"
                            onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                          >
                            <img src={replySvg}/>
                          </a>
                        </li>
                      );
                    } else if (message.reference_type === "forward") {
                      const farrs = messages.filter(msg => message.global_id === msg.global_id);
                      farrs.map((farr, i) => <span key={i}>{farr.content}</span>);
                      return (
                        <li key={index}>
                          <a href={`/conversation/${message.sender_id}`} >
                            <Checkbox onChange={this.toggle} style={{ marginRight: 10 }}/>
                            <div className="target-message">
                              {
                                message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <img
                                    src={message.sender.photo}
                                    className="chat-user-photo"
                                    alt="stars users"
                                  />
                                </div>
                              }
                              {
                                !message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <Avatar
                                    className="contact-user-photo contact-user-info-wrap"
                                  >
                                    {message.sender.first_name}
                                  </Avatar>
                                </div>
                              }
                              <div className="chat-message">
                                <div className="target-msg-wrap">
                                  {
                                    message.meta && (message.type === 1) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <img src={message.meta.remote_url}/>
                                      {isOpen && (
                                        <Lightbox
                                          mainSrc={message.meta.remote_url}
                                          onCloseRequest={() => this.setState({ isOpen: false })}
                                        />
                                      )}
                                    </a>
                                  )
                                  }
                                  {
                                    message.meta && (message.type === 2) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <video width="200" controls>
                                        <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                      </video>
                                    </a>
                                  )
                                  }
                                  <blockquote>
                                    <a>{`${message.sender.first_name} ${message.sender.last_name}`}</a>
                                    {/*{farrs.map((arr, i) => <span key={i}>{arr.content}</span>)}*/}
                                  </blockquote>
                                  <span>
                                        <p>{message.content}</p>
                                  </span>
                                </div>
                                <div className="timer-target-wrap">
                                <span
                                  className="message-time"
                                >{new Date(message.time_created).toLocaleTimeString()
                                  .replace(/:\d+ /, " ")}</span>&nbsp;
                                </div>
                                {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                                <div className="timer-target-wrap">
                                  <img
                                    src={SentSvg}
                                    className="message-status-icon"
                                    alt="message sent"
                                  />
                                </div>
                                }
                              </div>
                            </div>
                          </a>
                          <a
                            className="reply-icon"
                            onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                          >
                            <img src={replySvg}/>
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={index}>
                        <a onClick={this.addToChosen.bind(this, message._id)}>
                          <Checkbox onChange={this.toggle} style={{ marginRight: 10 }}/>
                          <div className="target-message">
                            {
                              message.sender.photo &&
                              <div className="chat-user-info-wrap">
                                <img
                                  src={message.sender.photo}
                                  className="chat-user-photo"
                                  alt="stars users"
                                />
                              </div>
                            }
                            {
                              !message.sender.photo &&
                              <div className="chat-user-info-wrap">
                                <Avatar
                                  className="contact-user-photo contact-user-info-wrap"
                                >
                                  {message.sender.first_name}
                                </Avatar>
                              </div>
                            }
                            <div className="chat-message">
                              <div className="target-msg-wrap">
                                {message.meta && (message.type === 1) && (
                                  <a
                                    className="image-message"
                                    onClick={() => this.setState({ isOpen: true })}
                                  >
                                    <img src={message.meta.remote_url}/>
                                    {isOpen && (
                                      <Lightbox
                                        mainSrc={message.meta.remote_url}
                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                      />
                                    )}
                                  </a>
                                )
                                }
                                {message.meta && (message.type === 2) && (
                                  <a
                                    className="image-message"
                                    onClick={() => this.setState({ isOpen: true })}
                                  >
                                    <video width="200" controls>
                                      <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                    </video>
                                  </a>
                                )
                                }
                                <span>{message.content}</span>
                              </div>
                              <div className="timer-target-wrap">
                              <span
                                className="message-time"
                              >{new Date(message.time_created).toLocaleTimeString()
                                .replace(/:\d+ /, " ")}</span>&nbsp;
                              </div>
                              {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                              <div className="timer-target-wrap">
                                <img
                                  src={SentSvg}
                                  className="message-status-icon"
                                  alt="message sent"
                                />
                              </div>

                              }
                            </div>
                          </div>
                        </a>
                        <a
                          className="reply-icon"
                          onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                        >
                          <img src={replySvg}/>
                        </a>
                      </li>
                    );

                    if (message.sender_id === user.id) {


                      if (message.reference_type === "reply") {
                        // console.log(message);
                        const arrs = messages.filter(msg => message.reference_id === msg.global_id);
                        // console.log("=======>A", arrs);
                        arrs.map((arr, i) => <span key={i}>{arr.content}</span>);
                        // console.log("=======>B");
                        return (
                          <li key={index}>
                            <a onClick={this.addToChosen.bind(this, message._id)}>
                              <Checkbox onChange={this.toggle} style={{ marginRight: 10 }}/>
                              <div className="sender-message">
                                {
                                  message.sender.photo &&
                                  <div className="chat-user-info-wrap">
                                    <img
                                      src={message.sender.photo}
                                      className="chat-user-photo"
                                      alt="stars users"
                                    />
                                  </div>
                                }
                                {
                                  !message.sender.photo &&
                                  <div className="chat-user-info-wrap">
                                    <Avatar
                                      className="contact-user-photo contact-user-info-wrap"
                                      alt="stars users"
                                    >{message.sender.first_name}</Avatar>
                                  </div>
                                }
                                <div className="chat-message">
                                  <div className="owner-msg-wrap">
                                    {message.meta && (message.type === 1) && (
                                      <a
                                        className="image-message"
                                        onClick={() => this.setState({ isOpen: true })}
                                      >
                                        <img src={message.meta.remote_url}/>
                                        {isOpen && (
                                          <Lightbox
                                            mainSrc={message.meta.remote_thumb_url}
                                            onCloseRequest={() => this.setState({ isOpen: false })}
                                          />
                                        )}
                                      </a>
                                    )
                                    }
                                    {message.meta && (message.type === 2) && (
                                      <a
                                        className="image-message"
                                        onClick={() => this.setState({ isOpen: true })}
                                      >
                                        <video width="200" controls>
                                          <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                        </video>
                                      </a>
                                    )
                                    }
                                    <blockquote>
                                      <button style={{
                                        background: "none",
                                        border: "none"
                                      }}>{`${message.sender.first_name} ${message.sender.last_name}`}</button>
                                      {arrs.map((arr, i) => <span key={i}>{arr.content}</span>)}
                                    </blockquote>
                                    <span>{message.content}</span>
                                  </div>
                                  <div className="timer-owner-wrap">
                                  <span
                                    className="message-time"
                                  >{new Date(message.time_created).toLocaleTimeString()
                                    .replace(/:\d+ /, " ")}</span>&nbsp;
                                  </div>
                                  {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                                  <div className="timer-owner-wrap">
                                    <img
                                      src={SentSvg}
                                      className="message-status-icon"
                                      alt="message sent"
                                    />
                                  </div>
                                  }
                                  {((messageSeen === true) || message.status === 2) &&
                                  <div className="timer-owner-wrap">
                                    <img
                                      src={SeenSvg}
                                      className="message-status-icon"
                                      alt="message sent"
                                    />
                                  </div>
                                  }
                                </div>
                              </div>
                            </a>
                            <a
                              className="reply-icon"
                              onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                            >
                              <img src={replySvg}/>
                            </a>
                          </li>
                        );
                      } else if (message.reference_type === "forward") {
                        // console.log(message);
                        const farrs = messages.filter(msg => message.reference_id === msg.global_id);
                        // console.log("=======>AAAAAA", farrs);
                        farrs.map((farr, i) => <span key={i}>{farr.content}</span>);
                        // console.log("=======>BBBBBB");
                        return (
                          <li key={index}>
                            <a onClick={this.addToChosen.bind(this, message._id)}>
                              <Checkbox onChange={this.toggle} style={{ marginRight: 10 }}/>
                              <div className="sender-message">
                                {
                                  message.sender.photo &&
                                  <div className="chat-user-info-wrap">
                                    <img
                                      src={message.sender.photo}
                                      className="chat-user-photo"
                                      alt="stars users"
                                    />
                                  </div>
                                }
                                {
                                  !message.sender.photo &&
                                  <div className="chat-user-info-wrap">
                                    <Avatar
                                      className="contact-user-photo contact-user-info-wrap"
                                      alt="stars users"
                                    >{message.sender.first_name}</Avatar>
                                  </div>
                                }
                                <div className="chat-message">
                                  <div className="owner-msg-wrap">
                                    {message.meta && (message.type === 1) && (
                                      <a
                                        className="image-message"
                                        onClick={() => this.setState({ isOpen: true })}
                                      >
                                        <img src={message.meta.remote_url}/>
                                        {isOpen && (
                                          <Lightbox
                                            mainSrc={message.meta.remote_thumb_url}
                                            onCloseRequest={() => this.setState({ isOpen: false })}
                                          />
                                        )}
                                      </a>
                                    )
                                    }
                                    {message.meta && (message.type === 2) && (
                                      <a
                                        className="image-message"
                                        onClick={() => this.setState({ isOpen: true })}
                                      >
                                        <video width="200" controls>
                                          <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                        </video>
                                      </a>
                                    )
                                    }
                                    <blockquote>
                                      <a>{`${message.sender.first_name} ${message.sender.last_name}`}</a>
                                      {farrs.map((arr, i) => <span key={i}>{arr.content}</span>)}
                                    </blockquote>
                                    <span>{message.content}</span>
                                  </div>
                                  <div className="timer-owner-wrap">
                                  <span
                                    className="message-time"
                                  >{new Date(message.time_created).toLocaleTimeString()
                                    .replace(/:\d+ /, " ")}</span>&nbsp;
                                  </div>
                                  {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                                  <div className="timer-owner-wrap">
                                    <img
                                      src={SentSvg}
                                      className="message-status-icon"
                                      alt="message sent"
                                    />
                                  </div>
                                  }
                                  {((messageSeen === true) || message.status === 2) &&
                                  <div className="timer-owner-wrap">
                                    <img
                                      src={SeenSvg}
                                      className="message-status-icon"
                                      alt="message sent"
                                    />
                                  </div>
                                  }
                                </div>
                              </div>
                            </a>
                            <a
                              className="reply-icon"
                              onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                            >
                              <img src={replySvg}/>
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={index}>
                          <a onClick={this.addToChosen.bind(this, message._id)}>
                            <Checkbox onChange={this.toggle} style={{ marginRight: 10 }}/>
                            <div className="sender-message">
                              {
                                message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <img
                                    src={message.sender.photo}
                                    className="chat-user-photo"
                                    alt="stars users"
                                  />
                                </div>
                              }
                              {
                                !message.sender.photo &&
                                <div className="chat-user-info-wrap">
                                  <Avatar
                                    className="contact-user-photo contact-user-info-wrap"
                                    alt="stars users"
                                  >{message.sender.first_name}</Avatar>
                                </div>
                              }
                              <div className="chat-message">
                                <div className="owner-msg-wrap">
                                  {message.meta && (message.type === 1) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <img src={message.meta.remote_url}/>
                                      {isOpen && (
                                        <Lightbox
                                          mainSrc={message.meta.remote_thumb_url}
                                          onCloseRequest={() => this.setState({ isOpen: false })}
                                        />
                                      )}
                                    </a>
                                  )
                                  }
                                  {message.meta && (message.type === 2) && (
                                    <a
                                      className="image-message"
                                      onClick={() => this.setState({ isOpen: true })}
                                    >
                                      <video width="200" controls>
                                        <source src={message.meta.remote_url} id="video_here"/>
                                          Your browser does not support HTML5 video.
                                      </video>
                                    </a>
                                  )
                                  }
                                  <span>{message.content}</span>
                                </div>
                                <div className="timer-owner-wrap">
                                <span
                                  className="message-time"
                                >{new Date(message.time_created).toLocaleTimeString()
                                  .replace(/:\d+ /, " ")}</span>&nbsp;
                                </div>
                                {(messageSeen === false) && (message.status === 0 || message.status === 1) &&
                                <div className="timer-owner-wrap">
                                  <img
                                    src={SentSvg}
                                    className="message-status-icon"
                                    alt="message sent"
                                  />
                                </div>
                                }
                                {((messageSeen === true) || message.status === 2) &&
                                <div className="timer-owner-wrap">
                                  <img
                                    src={SeenSvg}
                                    className="message-status-icon"
                                    alt="message sent"
                                  />
                                </div>
                                }
                              </div>
                            </div>
                          </a>
                          <a
                            className="reply-icon"
                            onClick={this.replyMsg.bind(this, message.global_id, message.content, message)}
                          >
                            <img src={replySvg}/>
                          </a>
                        </li>
                      );


                    }
                  },
                )}
              </ul>
            </div>
          </div>

          <div style={shown} className="input-menu">
            <a onClick={this.showModal}>FORWARD{this.state.chosenMessages.length}</a>
            <Modal
              title="FORWARD"
              wrapClassName="vertical-center-modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              // footer={[
              //   <Button>FORWARD</Button>
              // ]}
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
                  <Icon type="loading"/>
                }
                {
                  users.map((user, index) =>
                  (<li className="contact-item" key={index}>
                    <a
                      onClick={this.forwardNavigation.bind(this, user.id, `${`${user.first_name} ${user.last_name}`}`)}
                    >
                      {user.photo &&
                      <div className="contact-user-info-wrap">
                        <img src={user.photo} className="contact-user-photo" alt="stars"/>
                      </div>
                      }
                      {!user.photo &&
                      <Avatar
                        className="contact-user-photo contact-user-info-wrap"
                      >{user.first_name.charAt(0).toUpperCase()}</Avatar>
                      }
                      <div className="contact-name">
                        <span>{`${user.first_name} ${user.last_name}`}</span>
                      </div>
                    </a>
                  </li>),
                )}
              </ul>
            </Modal>
            <a
              onClick={this.deleteMsg.bind(this, this.state.chosenMessages)}>DELETE {this.state.chosenMessages.length}</a>
            {this.state.chosenMessages.length === 1 && this.state.chosenMessages.map(msg =>

              <a key={msg._id} onClick={this.replyMsg.bind(this, msg.global_id, msg.content, msg)}>REPLY</a>

            )}
            {this.state.chosenMessages.length >= 1 &&
            <a style={{ display: "none" }}>REPLY</a>
            }
            <a onClick={this.handleCancelSelect}>
              CANCEL
            </a>
          </div>


          <form
            className="chat-form-submit"
            onSubmit={this.handleMsgSubmit}
            style={hidden}
          >
            {
              replyMessage &&
              <div className="blockquote-input">
                <blockquote className="meta-file">
                  <div style={{ flexGrow: 1 }}>
                    <a>{`${messageReply.sender.first_name} ${messageReply.sender.last_name}`}</a>
                    <span>{replyMessage}</span>
                  </div>
                  <a onClick={this.handleCancelReply}>cancel</a>
                </blockquote>
              </div>
            }
            {
              replyMessage === "" && reply.message &&
              <div className="blockquote-input">
                <blockquote className="meta-file">
                  <div style={{ flexGrow: 1 }}>
                    <img style={{ width: 100, height: 50 }} src={reply.message.meta.remote_thumb_url}
                         alt="reply image"/>
                    <a>{`${messageReply.sender.first_name} ${messageReply.sender.last_name}`}</a>
                    <span>{replyMessage}</span>
                  </div>
                  <a onClick={this.handleCancelReply}>cancel</a>
                </blockquote>
              </div>
            }
            {
              this.state.chosenMessages.length > 0 &&
              <div className="blockquote-input">
                <blockquote style={{margin:'0px',padding:'0px'}}>
                  {
                    this.state.chosenMessages.map(msg =>
                      <div style={{ width: "50%", float: "left" }}>
                        <span>
                          Forwarded from :
                        </span>
                        <a key={msg._id} style={{ flexGrow: 1 }}> {msg.sender.first_name} </a>
                        <p style={{margin:'0px',padding:'0px'}}>{msg.content}</p>
                      </div>
                    )
                  }
                  <div style={{ width: "50%", float: "left", textAlign: "right" }}><a onClick={this.handleCancelForward}
                                                                                      style={{ paddingRight: 10 }}>cancel</a>
                  </div>
                </blockquote>

              </div>
            }
            {
              meta && file && file.type.startsWith("image/") &&
              <div className="file-container">
                <img src={meta.remote_url} style={{ width: 100, height: 50 }}/>
                <div className="meta-file">
                  <span>{file.name.size}</span>
                  <a onClick={this.handelCancelUpload}>cancel</a>
                </div>
              </div>
            }
            {
              meta && file && file.type.startsWith("video/") &&
              <div className="file-container">
                <div>
                  <video width="50" controls>
                    <source src={meta.remote_url} id="video_here"/>
                    Your browser does not support HTML5 video.
                  </video>
                </div>
                <div className="meta-file">
                  <span>{file.name}</span>
                  <a onClick={this.handelCancelUpload}>cancel</a>
                </div>
              </div>
            }
            {
              this.state.progress !== 100 &&
              <div style={{ width: 170 }}>
                {this.state.progress !== 0 &&
                (
                  <div className="upload-wrapper">
                    <Icon type="download" style={{ fontSize: 18, color: "#08c" }}/>
                    <Progress percent={this.state.progress} size="small"/>
                  </div>
                )
                }
              </div>
            }
            {
              this.state.progress === 100 && this.state.progressLoading &&
              <Icon type="loading" style={{ padding: "20px 0" }}/>
            }
            <div className="input-wrapper">
              <a
                className="attach-btn"
                onClick={this.handleChangeFileButton}
              >
                <img src={AttachBtnSvg} alt="image button"/>
              </a>
              <input
                className="chat-messages-typing-input"
                placeholder="Write a Message..."
                name="text"
                onChange={this.handleChange}
                ref={message => this.messageInput = message}
                autoFocus="true"
                autoComplete="off"
              />
              <input
                onChange={this.handleChangeFileInput}
                ref={input => (this.inputFileRef = input)}
                style={{ display: "none" }}
                type="file"
                accept="image/*,video/*"
              />
              <button className="send-btn">
                <img
                  src={SendBtnSvg}
                  alt="send button"
                />
              </button>
            </div>
          </form>
        </div>

        {/** *******chat-messages-wrapper******** */}
        {contactObj && !channelObj && !groupObj &&
        <div className="contact-profile-wrap">
          <Link to={`/contact/${contactObj.id}/profile`}><img src={expandSvg} className="collapse-icon"/></Link>
          <div className="general-info">
            <div className="chat-base-account">
              {contactObj.photo &&
              <img className="chat-square-avatar" src={contactObj.photo} alt="avatar"/>
              }
              {!contactObj.photo &&
              <Avatar shape="square">{contactObj.first_name.charAt(0)}</Avatar>
              }
              <div className="chat-name"><span>{`${contactObj.first_name} ${contactObj.last_name}`}</span></div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="user-icon-info"/>
              <div className="txt-info">
                <span>{contactObj.username}</span>
                <span>Username</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="bio-icon-info"/>
              <div className="txt-info">
                <span>{contactObj.bio}</span>
                <span>Bio</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="phone-icon-info"/>
              <div className="txt-info">
                <span>+{contactObj.phone}</span>
                <span>Phone Number</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="notif-icon-info"/>
              <div className="txt-info">
                <span>Notification</span>
                <span>Disable</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="mom-icon-info"/>
              <div className="txt-info">
                <span/>
                <span>Moment</span>
              </div>
            </div>
          </div>
          <div className="attach-photo-container">
            <div className="photo-txt-wrap">
              <span>Attachment Photos</span>
              <Link to="/">view all</Link>
            </div>
          </div>
        </div>
        }
        {!contactObj && conversationObj &&
        <div className="contact-profile-wrap">
          <Link to={`/contact/${conversationObj.target.id}/profile`}>
            <img src={expandSvg} alt="" className="collapse-icon" />
          </Link>
          <div className="general-info">
            <div className="chat-base-account">
              <img className="chat-square-avatar" src={conversationObj.target.photo} alt="avatar" />
              <div className="chat-name">
                <span>{`${conversationObj.target.first_name} ${conversationObj.target.last_name}`}</span></div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="user-icon-info"/>
              <div className="txt-info">
                <span>{conversationObj.target.username}</span>
                <span>Username</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="bio-icon-info"/>
              <div className="txt-info">
                <span>{conversationObj.target.bio}</span>
                <span>Bio</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="phone-icon-info"/>
              <div className="txt-info">
                <span>+{conversationObj.target.phone}</span>
                <span>Phone Number</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="notif-icon-info"/>
              <div className="txt-info">
                <span>Notification</span>
                <span>Disable</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="mom-icon-info"/>
              <div className="txt-info">
                <span/>
                <span>Moment</span>
              </div>
            </div>
          </div>
          <div className="attach-photo-container">
            <div className="photo-txt-wrap">
              <span>Attachment Photos</span>
              <Link to="/">view all</Link>
            </div>
          </div>
        </div>
        }
        {groupObj && !contactObj && !channelObj &&
        <div className="contact-profile-wrap">

          <div className="general-info">
            <div className="chat-base-account">
              { this.state.groupImg &&
              <img className="chat-square-avatar" src={this.state.groupImg} alt="user avatar" />
              }
              { this.state.groupImg == null &&
              <Avatar className="chat-square-avatar">{groupObj.name.charAt(0).toUpperCase()}</Avatar>
              }
              <div className="chat-name">
                <span>{groupObj.thread}</span></div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="user-icon-info"/>
              <div className="txt-info">
                <span>{groupObj.username}</span>
                <span>Username</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="bio-icon-info"/>
              <div className="txt-info">
                <span>sdklfjdf</span>
                <span>Bio</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="phone-icon-info"/>
              <div className="txt-info">
                <span>sdklfjds</span>
                <span>Phone Number</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="notif-icon-info"/>
              <div className="txt-info">
                <span>Notification</span>
                <span>Disable</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="mom-icon-info"/>
              <div className="txt-info">
                <span/>
                <span>Moment</span>
              </div>
            </div>
          </div>
          <div className="attach-photo-container">
            <div className="photo-txt-wrap">
              <span>Attachment Photos</span>
              <Link to="/">view all</Link>
            </div>
            <div style={{ margin: "20px" }}>
              <Button
                type="danger"
                onClick={() => this.leaveBtnHandler(groupObj.thread)}
                className="leave-btn"
              >
              Leave
              </Button>
            </div>
            <div style={{ overflowX: "hidden", width: "86%" }}>
              <b>{this.state.groupMember.length} Member</b>
              <table>
                <tbody>
                {
                  this.state.groupMember.map(
                    (v, i) => (
                      <tr>
                        <td>
                          <img style={{ width: "40px", height: "40px", borderRadius: "5px", float: "left" }}
                               src={v.photo === null || v.photo === "" ? "https://via.placeholder.com/350x150" : v.photo}
                               alt="avatar"/>
                          <span style={{ float: "right", width: "65%" }}>{v.first_name} {v.last_name}</span>
                        </td>
                      </tr>
                    )
                  )
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        }
        {channelObj && !groupObj && !contactObj &&
        <div className="contact-profile-wrap">

          <div className="general-info">
            <div className="chat-base-account">
              { this.state.channelObj.media &&
              <img className="chat-square-avatar" src={this.state.channelObj.media.path} alt="user avatar" />
              }
              <div className="chat-name">
                <span>{channelObj.thread}</span></div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="user-icon-info"/>
              <div className="txt-info">
                <span>{channelObj.username}</span>
                <span>Username</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="bio-icon-info"/>
              <div className="txt-info">
                <span>sdklfjdf</span>
                <span>Bio</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="phone-icon-info"/>
              <div className="txt-info">
                <span>sdklfjds</span>
                <span>Phone Number</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="notif-icon-info"/>
              <div className="txt-info">
                <span>Notification</span>
                <span>Disable</span>
              </div>
            </div>
          </div>
          <div className="username-wrap">
            <div className="info-container">
              <div className="mom-icon-info"/>
              <div className="txt-info">
                <span/>
                <span>Moment</span>
              </div>
            </div>
          </div>
          <div className="attach-photo-container">
            <div className="photo-txt-wrap">
              <span>Attachment Photos</span>
              <Link to="/">view all</Link>
            </div>
            <Button type="danger" onClick={() => this.leaveChannelBtnHandler(channelObj.thread)}>Leave</Button>
          </div>
        </div>
        }
      </div>
    );
  }
}
