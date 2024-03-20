import React from 'react';
import ReactCodeInput from 'react-code-input';
import {Row, Col, Icon, message, Button} from 'antd';
import {config} from '../../helpers/config';
import axios from 'axios/index';
import {v4} from 'uuid';
import {browserHistory} from 'react-router';

export default class VerifyEmailTab extends React.Component {
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
    const target = event.currentTarget;
    const {name, value} = event.target;
    const {data} = this.state;
    this.setState({
      data: {
        ...data,
        [name]: value,
      }
    });
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
      }
    };
    if (newData.mobile) {
      axios.post(config.apiUrl + '/api/v1/auth/otp/sms', newData, configHeader)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            const mobile = data.mobile;
            localStorage.mobile = mobile;
            message.success('Submiting success!');
            this.setState({
              loadingResend: false,
            });
            // browserHistory.push('/verify');
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
          this.setState({
            loadingResend: false,
          });
          console.log(error.response.data.error);
          console.log(error.response.status);
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
    const uuidValue = v4();
    console.log(uuidValue);
    const phoneNo = localStorage.getItem('mobile');
    console.log('PHONE NUMBER', phoneNo);
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
    if (data.code) {
      axios.post(config.apiUrl + '/api/v1/auth/otp/call', newData, configHeader)
        .then((response) => {
          console.log(response);
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
          message.error(error.response.data.error);
          this.setState({
            loadingRecall: false,
          });
          console.log(error.response.data.error);
          console.log(error.response.status);
        });
    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);


  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loading: true,
    });
    const {data} = this.state;
    const Email = localStorage.getItem('email');
    const uuidValue = v4();
    console.log(uuidValue);
    console.log('EMAIL', Email);
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
      axios.post(config.apiUrl + '/api/v1/auth/otp/emailVerify', newData, configHeader)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            message.success('Signup success!');
            console.log('RESPONSE TOKEN', response.data.data.token);
            const token = response.data.data.token;
            console.log('TOKEN', token);
            localStorage.token = token;
            this.setState({
              loading: false,
            });
            browserHistory.push('/register');
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          message.error(error.response.data.error);
          console.log(error.response.data.error);
          console.log(error.response.status);
        });
    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  render() {
    const {data, submitted} = this.state;
    return (
      <div>
        <form>
          <ReactCodeInput type="number" fields={4} onChange={value => this.setState({
            data: {
              code: value,
            },
          })}/>
          {submitted && !data.code &&
          <div className="help-block">Email is required</div>
          }
          <br/>
          <Button onClick={this.handleSubmit} loading={this.state.loading} className="primary btn-submit"
                  disabled={data.code.length === 0}>Signup</Button>
          <Button onClick={this.handleResendSubmit} loading={this.state.loadingResend}
                  className="primary btn-submit">Resend SMS</Button>
          <Button onClick={this.handleRecallSubmit} loading={this.state.loadingRecall}
                  className="primary btn-submit">Request a Call</Button>
        </form>
      </div>
    )
  }
}
