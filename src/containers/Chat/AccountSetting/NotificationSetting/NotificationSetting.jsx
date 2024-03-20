import React from 'react';
import './index.css';
import { Input, message, Button, Icon, Checkbox, Slider } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../../../helpers/apiConfig';
import { history } from '../../../../helpers/history';

export class NotificationSetting extends React.Component {
  state = {
    desktop_notification: false,
    background_notification: false,
    message_preview: false,
    social_network: false,
    the_people_who_followed_you: false,
    people_who_tagged_you: false,
    sound: 0,
  };

  componentDidMount() {
    this.getForm();
    // this.state.notificationSettingArray.push({ type: 'scroll', title: 'sound', value: 1 });
    console.log('didMount: ', this.state);
  }
  onChange = (e) => {
      if (e.target.value === 'DN') {
        this.setState({
          desktop_notification: e.target.checked,
        });
        console.log(this.state);
      }
      if (e.target.value === 'BN') {
        this.setState({
          background_notification: e.target.checked,
        });
        console.log(this.state);
      }
      if (e.target.value === 'MP') {
        this.setState({
          message_preview: e.target.checked,
        });
        console.log(this.state);
      }
      if (e.target.value === 'SN') {
        this.setState({
          social_network: e.target.checked,
        });
        console.log(this.state);
      }
      if (e.target.value === 'TPWFY') {
        this.setState({
          the_people_who_followed_you: e.target.checked,
        });
        console.log(this.state);
      }
      if (e.target.value === 'PWTY') {
        this.setState({
          people_who_tagged_you: e.target.checked,
        });
        console.log(this.state);
    }
    console.log('desktop notification value is======>',this.state.desktop_notification);
  };
  onChangeScroll = (value) => {
    this.setState({
      sound: value,
    });
  }
  // onChange = (e) => {
  //   console.log(`checked = ${e.target.checked} --> ${e.target.value}`);
  //   if (e.target.value === 'DN') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'DN');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //   if (e.target.value === 'BN') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'BN');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //   if (e.target.value === 'MP') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'MP');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //   if (e.target.value === 'SN') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'SN');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //   if (e.target.value === 'TPWFY') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'TPWFY');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //
  //   if (e.target.value === 'PWTY') {
  //     if (e.target.checked === true) {
  //       this.state.notificationSettingArray.push({ type: 'check', title: e.target.value });
  //     } else {
  //       const index = this.state.notificationSettingArray.findIndex(x => x.title === 'PWTY');
  //       this.state.notificationSettingArray.splice(index, 1);
  //       // console.log('indexOf: ',index);
  //     }
  //   }
  //   console.log(this.state.notificationSettingArray);
  // };
  // onChangeScroll = (e) => {
  //   console.log(`scroll = ${e}`);
  //   const index = this.state.notificationSettingArray.findIndex(x => x.title === 'sound');
  //   this.state.notificationSettingArray[index].value = e;
  //   console.log('scroll ==>', this.state.notificationSettingArray);
  // };

  submitForm = () => {

    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'Authorization': token,
        'agent': 'web',
        'uuid': uuidValue,
        'Content-Type': 'application/json',
      },
    };
    // const newData = JSON.stringify(this.state.notificationSettingArray);
    axios.post(`${API_ROOT}/api/v1/user/setting`, this.state, configHeader)
      .then((response) => {
        if (response.status === 200) {
          message.success('Adding was success!');
          console.log('response: ',response);
        }
      })
      .catch((error) => {
        message.error(error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  getForm = () => {
    const token = localStorage.getItem('token');
    const uuidValue = localStorage.getItem('uuid');
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'Authorization': token,
        'agent': 'web',
        'uuid': uuidValue,
        'Content-Type': 'application/json',
      },
    };
    axios.get(`${API_ROOT}/api/v1/user/setting`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const notifSetting = response.data.data;
          console.log("notification is ehsan modify ",notifSetting);
          this.setState({
            desktop_notification: notifSetting.desktop_notification,
            background_notification: notifSetting.background_notification,
            message_preview: notifSetting.message_preview,
            social_network: notifSetting.social_network,
            the_people_who_followed_you: notifSetting.the_people_who_followed_you,
            people_who_tagged_you: notifSetting.people_who_tagged_you,
            sound: notifSetting.sound,
          });
          console.log("after set state is :",this.state);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: true,
        });
      });
  }

  render() {
    return (
      <div className="settings-container">
        <div className="form-container">
          <form className="account-form">
            <div className="inputs-container">
              <h2 className="notificationTitleName">Messaging</h2>
              <div className="notificationWrapper">
                  <Checkbox
                    checked={this.state.desktop_notification}
                    onChange={this.onChange}
                    value="DN">Desktop Notification</Checkbox>
              </div>
              <div className="notificationWrapper">
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.background_notification}
                  value="BN">Background Notification</Checkbox>
              </div>
              <div className="notificationWrapper">
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.message_preview}
                  value="MP">Message preview</Checkbox>
              </div>
              <div style={{ margin: '15px', marginTop: '20px' }}>
                <h2 style={{ fontSize: '15px', color: '#515C8B' }}>Sound</h2>
                <div>
                  <Slider
                    onChange={this.onChangeScroll}
                    value={this.state.sound}
                  />
                </div>
              </div>
              <h2 className="notificationTitleName">Social Network</h2>
              <div className="notificationWrapper">
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.social_network}
                  value="SN">Social Network</Checkbox>
              </div>
              <div className="notificationWrapper">
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.the_people_who_followed_you}
                  value="TPWFY">The people who followed
                  you</Checkbox>
              </div>
              <div className="notificationWrapper">
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.people_who_tagged_you}
                  value="PWTY">People who tagged you</Checkbox>
              </div>
              <div style={{ marginTop: '80px' }}>
                <Button
                  onClick={this.submitForm}
                  className="primary btn-submit"
                >save changes
                </Button>
              </div>
              {/*<div style={{ marginTop: '80px' }}>*/}
                {/*<Button*/}
                  {/*onClick={this.getForm}*/}
                  {/*className="primary btn-submit"*/}
                {/*>get changes*/}
                {/*</Button>*/}
              {/*</div>*/}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
