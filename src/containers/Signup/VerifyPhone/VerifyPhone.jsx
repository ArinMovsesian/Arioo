import React from 'react';
import ReactCodeInput from 'react-code-input';
import {message, Button} from 'antd';
import axios from 'axios/index';
import {v4} from 'uuid';
import {API_ROOT} from '../../../helpers/apiConfig';
import { history } from '../../../helpers/history';
import Timer from '../Timer/Timer';
import VerifyPhoneSvg from '../../../assets/svgs/verifycode.svg';
import logo from '../../../assets/svgs/logo-arioo.svg';
import logoNewLightBlue from "../../../assets/svgs/logoNewLightBlue.png";
import SearchSvg from '../../../assets/svgs/search.svg';
import ChatSvg from '../../../assets/svgs/chat.svg';
import GroupSvg from '../../../assets/svgs/Group.svg';
import './index.css';

export class VerifyPhone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        mobile: '',
        code: '',
      },
      submitted: false,
      loading: false,
      loadingRecall: false,
      loadingResend: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResendSubmit = this.handleResendSubmit.bind(this);
    this.handleRecallSubmit = this.handleRecallSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loading: true,
    });
    const {data} = this.state;
    const uuidValue = v4();
    const phoneNo = localStorage.getItem('mobile');
    const newData = {
      mobile: phoneNo,
      code: data.code,
    };

    const configHeader = {
      headers: {
        'agent': 'web',
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'uuid': uuidValue,
      }
    };

    if (data.code) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/verify`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success('Signup success!');
            const token = response.data.data.token;
            localStorage.token = token;
            this.setState({
              loading: false,
            });
            const configUserHeader = {
              headers: {
                "Accept": "application/json",
                "language": "en",
                "app": "stars",
                "Authorization": token
              }
            };
            axios.get(`${API_ROOT}/api/v1/user`, configUserHeader)
              .then((response) => {
                if (response.status === 200) {
                  const userObj = response.data.data;

                  if (userObj.first_name && userObj.last_name !=null||
                    userObj.first_name && userObj.last_name != '' ||
                    userObj.first_name && userObj.last_name !=undefined)
                  {
                    this.props.history.push({pathname: '/chat'});
                  }else{
                    history.push('/register');
                  }

                  console.log("user object",userObj);
                  localStorage.setItem("userObj", JSON.stringify(userObj));
                  this.setState({
                    user: userObj,
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })

        .catch((error) => {
          this.setState({
            loading: false,
          });
          // message.error(error.response.data.error);
          message.error("کد وارد شده صحیح نمی باشد");
        });
    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  handleResendSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingResend: true,
    });
    const {data} = this.state;
    const phoneNo = localStorage.getItem('mobile');
    console.log('PHONE NUMBER', phoneNo);
    const newData = {
      mobile: phoneNo,
    };

    const configHeader = {
      headers: {
        'agent': 'web',
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
      },
    };
    if (newData.mobile) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/sms`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            const mobile = data.mobile;
            localStorage.mobile = mobile;
            message.success('Submiting success!');
            this.setState({
              loadingResend: false,
            });
            history.push('/verify');
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
          this.setState({
            loadingResend: false,
          });
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);

  }

  handleRecallSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingRecall: true,
    });
    const {data} = this.state;
    const uuidValue = localStorage.getItem('uuid');
    const phoneNo = localStorage.getItem('mobile');
    const newData = {
      mobile: phoneNo,
    };
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'uuid': uuidValue,
      },
    };
    if (newData.mobile) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/call`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            const mobile = data.mobile;
            localStorage.mobile = mobile;
            message.success('Submiting success!');
            this.setState({
              loadingRecall: false,
            });
            // browserHistory.push('/verify');
          }
        })
        .catch((error) => {
          this.setState({
            loadingRecall: false,
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
        <div className="verifyPhone-container">
          <div className="submitPhone-svg-wrap" style={{ display: "none" }}>
            <img src={VerifyPhoneSvg} className="arioo-verifyPhone-img" alt="arioo cover photo" />
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
              <p className="login-txt" style={{ textAlign: "center" }}>Verify Code</p>
              <form>
                <ReactCodeInput type="tel" fields={4} onChange={value => this.setState({
                  data: {
                    code: value,
                  },
                })}/>
                {submitted && !data.code &&
                <div className="help-block">Code is required</div>
                }
                <br/>
                <div>
                  <Timer/>
                </div>
                <Button onClick={this.handleSubmit} loading={this.state.loading} className="primary btn-submit"
                        disabled={data.code.length === 0}>Signup</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
