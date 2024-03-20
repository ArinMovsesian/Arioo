import * as React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios/index';
import {v4} from 'uuid';
import {message, Button} from 'antd/lib/index';
import {API_ROOT} from '../../../helpers/apiConfig';
import { history } from '../../../helpers/history';


export default class Timer extends React.Component {

  constructor(props) {
    super();

    // sets a default value for the component state
    this.state = {
      left: props.time || 60,
      submitted: false,
      loadingRecall: false,
      loadingResend: false,
    };
    this.handleResendSubmit = this.handleResendSubmit.bind(this);
    this.handleRecallSubmit = this.handleRecallSubmit.bind(this);
  }

  getMinutes() {
    return Math.floor(this.state.left / 60);
  }

  getSeconds() {
    return Math.floor(this.state.left % 60);
  }

  interval = null
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.left >= 1) {
        this.setState({
          left: this.state.left - 1,
        });
      } else {
        clearInterval(this.interval);
        if (this.props.onEnd) {
          this.props.onEnd();
        }
      }
    }, 1000);
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.left === 0 && clearInterval(this.interval);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handleResendSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingResend: true,
      // left: 60,
    });
    const {data} = this.state;
    const phoneNo = localStorage.getItem('mobile');
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
          this.setState({
            loadingResend: false,
          });
          // message.error(error.response.data.error);
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
      // left: 60,
    });
    const {data} = this.state;
    const uuidValue = v4();
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
            history.push('/verify');
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
    return (
      <div>
        <div className="timer-wrap" style={{ margin: "34px auto" }}>
          <div style={{ width: "50%", textAlign: "left" }}>
            <span>I have not received SMS</span>
          </div>
          <div style={{ width: "50%", textAlign: "right" }}>
            <span className="count-down-timer">{`${this.getMinutes()}:${this.getSeconds()}`}</span>
          </div>
        </div>
        <div className="wrong-phone-txt">
          <Link to="/submitphone" className="back-txt-block">I entered wrong phone number</Link>
        </div>
        {this.state.left === 0 && <div className="resend-wrap" style={{ width: "100%" }}>
          <div style={{ width: "50%" }}>
          <Button onClick={this.handleResendSubmit} loading={this.state.loadingResend}
          className="btn-resend">Resend SMS</Button>
          </div>
          <div style={{ width: "50%" }}>
            <Button onClick={this.handleRecallSubmit} loading={this.state.loadingRecall}
                    className="btn-resend">Request a Call</Button>
          </div>
        </div>}
      </div>
    );
  }
}
