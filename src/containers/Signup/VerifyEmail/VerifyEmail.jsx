import React from 'react';
import ReactCodeInput from 'react-code-input';
import { message, Button} from 'antd';
import axios from 'axios/index';

import {v4} from 'uuid';
import { history } from '../../../helpers/history';
import {API_ROOT} from '../../../helpers/apiConfig';
import logoNewLightBlue from "../../../assets/svgs/logoNewLightBlue.png";
import VerifyPhoneSvg from '../../../assets/svgs/verifycode.svg';
import SearchSvg from '../../../assets/svgs/search.svg';
import ChatSvg from '../../../assets/svgs/chat.svg';
import GroupSvg from '../../../assets/svgs/Group.svg';

import './index.css';

export class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        email: '',
        code: '',
      },
      submitted: false,
      loading: false,
      loadingRecall: false,
      loadingResend: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      loading: true,
    });
    const {data} = this.state;
    const Email = localStorage.getItem('email');
    const uuidValue = localStorage.getItem('uuid');
    const newData = {
      email: Email,
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
      axios.post(`${API_ROOT}/api/v1/auth/otp/emailVerify`, newData, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success('Signup success!');
            const token = response.data.data.token;
            localStorage.token = token;
            this.setState({
              loading: false,
            });
            history.push('/register');
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          message.warn(error.response.data.error);
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
            <img src={VerifyPhoneSvg} className="arioo-verifyPhone-img" alt="stars cover photo" />
            <ul className="centered">
              <li>
                <img src={SearchSvg} alt="search" className="register-list-icon"/>
                <span>Follow your interests.</span>
              </li>
              <li>
                <img src={GroupSvg} alt="group" className="register-list-icon"/>
                <span>Hear what people are talking about.</span>
              </li>
              <li>
                <img src={ChatSvg} alt="chat" className="register-list-icon"/>
                <span>Join the conversation.</span>
              </li>
            </ul>
          </div>
          <div className="form-wrapper" style={{ margin: "0 auto", width: "100%" }}>
            <div className="form-container" style={{ textAlign: "center" }}>
              <img src={logoNewLightBlue} alt="Arioo" id="logo"/>
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
                <Button onClick={this.handleSubmit} loading={this.state.loading} className="primary btn-submit-verify"
                        disabled={data.code.length === 0}>Next</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
