import React from "react";
import PropTypes from 'prop-types';
import { Input, Button, message } from "antd";
import axios from "axios/index";
import { v4 } from "uuid";
import { API_ROOT } from "../../../../helpers/apiConfig";
import "./index.css";

export class AddMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: {
        last_msg: '',
      },
      submitted: false,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOMsgSubmit = this.handleOMsgSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { chat } = this.state;
    this.setState({
      chat: {
        ...chat,
        [name]: value,
      }
    });
  }


  handleOMsgSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true
    });
    const { chat } = this.state;
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };

    const newData = {
      target_user_id: "",
      owner_id: "",
      type: "",
      last_update: ""
    };

    if (chat.last_msg) {
      axios.post(`${API_ROOT}/api/v1/conversation`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            // message.success("Adding was success!");
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
          console.log(error.response.data.error);
          console.log(error.response.status);
          console.log(error);
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  render() {
    return (
      <div>
        <form>
          <input className="chat-messages-typing-input"
                 placeholder="Message"
                 name="last_msg"
                 onChange={this.handleChange}
          />
          <Button onClick={this.handleMsgSubmit}
                  className="btn-submit"
                  type="primary">
            Send
          </Button>
        </form>
      </div>
    );
  }
}
