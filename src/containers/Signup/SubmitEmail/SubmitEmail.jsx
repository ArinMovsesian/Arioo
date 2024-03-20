import React from 'react';
import ReactTelInput from 'react-telephone-input/lib/withStyles';
import { message, Button, Tabs} from 'antd';
import axios from 'axios/index';
import {v4} from 'uuid';
import {API_ROOT} from '../../../helpers/apiConfig';
import { history } from '../../../helpers/history';
import SubmitPhoneSvg from '../../../assets/svgs/singup-phoneno.svg';
import logo from '../../../assets/svgs/logo-arioo.svg';
import SubmitEmailTab from '../../../components/SubmitEmailTab/SubmitEmailTab';
import logoNewLightBlue from "../../../assets/svgs/logoNewLightBlue.png";
import SearchSvg from '../../../assets/svgs/search.svg';
import ChatSvg from '../../../assets/svgs/chat.svg';
import GroupSvg from '../../../assets/svgs/Group.svg';

const TabPane = Tabs.TabPane;


export class SubmitEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        mobile: '',
      },
      submitted: false,
      loadingCall: false,
      loadingSms: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallSubmit = this.handleCallSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    const {name, value} = event.target;
    const {data} = this.state;
    this.setState({
      data: {
        ...data,
        [name]: value,
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingSms: true,
    });
    const {data} = this.state;
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
      },
    };
    if (data.mobile) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/sms`, data, configHeader)
        .then((response) =>  {
          if (response.status === 200) {
            const mobile = data.mobile;
            localStorage.mobile = mobile;
            message.success('Submiting success!');
            this.setState({
              loadingSms: false,
            });
            history.push('/verifyPhone');
          }
        })
        .catch((error) => {
          this.setState({
            loadingSms: false,
          });
          message.error(error.response.data.error);
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  handleCallSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingCall: true,
    });

    let UUID;
    if(localStorage.getItem('uuid') === null) {
      UUID = v4();
    }else if(localStorage.getItem('uuid') !== null) {
      UUID = localStorage.getItem('uuid');
    }

    const {data} = this.state;
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'uuid': UUID,
      },
    };
    if (data.mobile) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/call`, data, configHeader)
        .then((response) =>{
          if (response.status === 200) {
            const mobile = data.mobile;
            localStorage.mobile = mobile;
            localStorage.uuid = UUID;
            message.success('Submiting success!');
            this.setState({
              loadingCall: false,
            });
            history.push('/verify');
          }
        })
        .catch((error) => {
          this.setState({
            loadingCall: false,
          });
          message.error(error.response.data.error);
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);


  }

  render() {
    const {data, submitted} = this.state;
    return (
      <div className="signUpWrapper">
        <div className="submitPhone-container">
          <div className="submitPhone-svg-wrap" style={{ display: "none" }}>
            <img src={SubmitPhoneSvg} className="arioo-submitPhone-img" alt="stars image" />
            <ul className="centered">
              <li>
                <img src={SearchSvg} alt="search" className="register-list-icon" />
                <span>Follow your interests.</span>
              </li>
              <li>
                <img src={GroupSvg} alt="group" className="register-list-icon" />
                <span>Hear what people are talking about.</span>
              </li>
              <li>
                <img src={ChatSvg} alt="chat" className="register-list-icon" />
                <span>Join the conversation.</span>
              </li>
            </ul>
          </div>
          <div className="form-wrapper" style={{ margin: "0 auto", width: "100%" }}>
            <div className="form-container" style={{ textAlign: "center" }}>
              <div>
                <img src={logoNewLightBlue} alt="Arioo" id="logo"/>
              </div>
              <p className="login-txt" style={{ textAlign: "center" }}>Sign up With phone No</p>
              <div className="tab-container">
                <Tabs defaultActiveKey="1" animated={false}>
                  <TabPane tab={<span>Email</span>} key="1">
                    <SubmitEmailTab/>
                  </TabPane>
                  <TabPane tab={<span>Phone No</span>} key="2">
                    <form onSubmit={this.handleSubmit}>
                      <ReactTelInput
                        flagsImagePath={
                          "https://raw.githubusercontent.com/mukeshsoni/react-telephone-input/master/example/src/flags.png"
                        }
                        onChange={value => this.setState({
                          data: {
                            mobile: value.replace(/[^\d]/g, ''),
                          },
                        })}
                        initialValue="+98"
                        defaultCountry="Iran"
                        onEnterKeyPress={() => console.log("onEnterKeyPress")}
                        inputProps={{autoFocus: true}}
                      />
                      {submitted && !data.mobile &&
                      <div className="help-block">Mobile number is required</div>
                      }
                      <br/>
                      <Button onClick={this.handleSubmit} loading={this.state.loadingSms} className="primary btn-submit" disabled={data.mobile.length === 0}>Send code as SMS</Button>
                      <br />
                      <Button onClick={this.handleCallSubmit} loading={this.state.loadingCall} className="primary btn-submit" disabled={data.mobile.length === 0}>Send code as Call</Button>
                    </form>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
