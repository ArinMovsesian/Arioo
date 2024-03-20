import React from 'react';
import './index.css';
import {
  Input,
  message,
  Button,
  Select,
  Icon,
  Checkbox,
  Slider,
  DatePicker,
  Avatar,
  Col
} from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../../../helpers/apiConfig';
import { history } from '../../../../helpers/history';

const { Option, OptGroup } = Select;
export class ProfileSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount(){
    this.getUser();
  }
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  getUser() {
    const token = localStorage.getItem("token");
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "uuid": uuidValue,
        "Authorization": token,
      }
    };
    axios.get(`${API_ROOT}/api/v1/user`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const cuser = response.data;
          this.setState({
            user: cuser.data,
          });
            console.log('after current user is=====>',this.state.user);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  render() {
    const {user} = this.state;
    return (
      <div className="settings-container">
        <div className="form-container">
          <form className="account-form">
            <div className="inputs-container">
              <div className="field">
                <input type="text"
                       id="firsName"
                       name="first_name"
                       value={user.first_name }
                  // onChange={this.handleOnChange}
                  //  placeholder="firsName"
                       required
                />
                <label htmlFor="profileName">Profile Name</label>
              </div>
              <div className="field">
                <input name="last_name"
                       id="lastName"
                  value={user.username}
                  // onChange={this.handleOnChange}
                  //  placeholder="LastName"
                       required
                />
                <label htmlFor="userName">Username</label>
              </div>
              <div className="field" style={{margin:"0"}}>
                <input name="email"
                       id="email"
                       type="email"
                  value={user.email}
                  // onChange={this.handleOnChange}
                />
                <label htmlFor="Email">Email</label>

              </div>
              <span className="field" style={{color:"#BBBBBB",fontSize:"10px",display:"inline"}}>Email will not be publicly displayed. <a href="#">Learn more.</a></span>

              <br/>
              <br/>
              <div className="field">
                <Select
                  defaultValue={user.language}
                  style={{ width: 400 }}
                  onChange={this.handleChange}
                >
                  <OptGroup label="Language">
                    <Option value="English">English</Option>
                    <Option value="Persian">Persian</Option>
                  </OptGroup>
                </Select>
                <label htmlFor="Language">Language</label>
              </div>
              <br/>

              <div className="field">
                <DatePicker placeholder="Select your Birthday"/>
                <label htmlFor="Language">Time Zone</label>
              </div>
              <br/>
              <Button
                // onClick={this.handleSubmit}
                // loading={this.state.loadingSubmit}
                className="primary btn-submit"
                // disabled={data.first_name.length === 0 && data.last_name.length === 0}
              >save changes
              </Button>
            </div>
            <div className="avatar-container">
              <div className="avatar-uploader">
                  { user.photo
                    ?
                    <img  src={user.photo} alt="user avatar" />
                    :
                    <Avatar className="chat-square-avatar">{user.first_name}</Avatar>
                  }

              </div>
              <input
                onChange={this.handleChangePhotoFileInput}
                ref={input => (this.inputFileRef = input)}
                style={{ display: 'none' }}
                type="file"
              />
              <Button onClick={this.handleChangePhotoButton} className="avatar-btn">Change
                Image</Button>
              <br/>
              <Button onClick={this.handleDeleteImage} className="avatar-btn delete-btn">Delete
                Image</Button>
            </div>
          </form>
          <div></div>
        </div>
      </div>
    );
  }
}
