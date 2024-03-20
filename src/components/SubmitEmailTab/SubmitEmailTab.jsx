import React from 'react';
import axios from 'axios/index';
import {v4} from 'uuid';
import {FormWithConstraints, FieldFeedbacks, FieldFeedback} from 'react-form-with-constraints';
import { Button, message} from 'antd';
import { history } from '../../helpers/history';
import { API_ROOT } from '../../helpers/apiConfig';

export default class SubmitEmailTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        email: '',
      },
      submitted: false,
      loading: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.currentTarget;
    const {name, value} = event.target;
    this.form.validateFields(target);
    const {data} = this.state;
    this.setState({
      data: {
        ...data,
        [name]: value.toLocaleLowerCase(),
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.form.validateFields();
    this.setState({
      submitted: true,
      loading: true,
    });
    const {data} = this.state;
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
      },
    };
    if (data.email) {
      axios.post(`${API_ROOT}/api/v1/auth/otp/email`, data, configHeader)
        .then((response) => {
          if (response.status === 200) {
            const email = data.email;
            localStorage.email = email;
            const uuid = v4();
            localStorage.uuid = uuid;
            message.success('Submiting success!');
            this.setState({
              loading: false,
            });
            history.push('/verifyEmail');
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          message.error(error.response.data.error);
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        <FormWithConstraints ref={form => this.form = form} noValidate>
          <input className="email-input" placeholder="Email address" type="email" name="email"
                 onChange={this.handleChange}
                 minLength={5}
                 value={data.email}
                 required/>
          <FieldFeedbacks for="email">
            <FieldFeedback when="*"/>
          </FieldFeedbacks>
          <Button onClick={this.handleSubmit} className="primary btn-submit-email" loading={this.state.loading}
                  disabled={data.email.length === 0}>Signup</Button>
        </FormWithConstraints>
      </div>
    )
  }
}

