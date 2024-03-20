import React from 'react';
import {history} from '../../../helpers/history';
import {Input, message, DatePicker, Button, Upload, Icon} from 'antd';
import axios from 'axios/index';
import {API_ROOT} from '../../../helpers/apiConfig';
import AccountRegisterSvg from '../../../assets/svgs/uniform3.svg';
import defaultImage from '../../../assets/svgs/upload-image.svg';

const {TextArea} = Input;

/**
 * Returns a promise that reads a file as a dataUrl representation (composed
 * of a mimetype and a base64 string).
 *
 * @param file {File}
 * @return {Promise}
 */
async function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // async event handlers
    reader.onload = e => resolve(reader.result);
    reader.onerror = e => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export class RegisterAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        first_name: "",
        last_name: "",
        birthday: "",
        gender: "",
        bio: "",
        photo: {},
      },
      file: {},
      base64: null,
      objectUrl: null,
      media: null,
      submitted: false,
      loading: false,
      loadingSubmit: false
    };

    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePhotoButton = this.handleChangePhotoButton.bind(this);
    this.handleChangePhotoFileInput = this.handleChangePhotoFileInput.bind(this);
  }

  // Simulate click of the file upload input.
  handleChangePhotoButton = e => {
    e.preventDefault();
    this.inputFileRef.click();
  };

  handleChangePhotoFileInput = e => {
    const target = e.currentTarget;
    const file = target.files.item(0);

    // validate file as image
    if (!file.type.startsWith("image/")) {
      alert("File is not an image");
      return;
    }
  }

  inputFileRef = null;

  handleChangeImage = (event) => {
    event.preventDefault();
    const {data} = this.state;
    this.setState({
      ...data,
      imageUrl: null,
      loading: false
    });
  }

  handleDeleteImage = (event) => {
    event.preventDefault();
    const {data} = this.state;
    this.setState({
      ...data,
      objectUrl: null,
    });
  }


  handleOnChange = (event) => {
    const {name, value} = event.target;
    const {data, media} = this.state;
    this.setState({
      data: {
        ...data,
        photo: media,
        [name]: value,
      },
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingSubmit: true
    });
    const {data , file} = this.state;
    const media = new FormData();
    media.append('photo', file);
    media.append('first_name', data.first_name);
    media.append('last_name', data.last_name);
    media.append('bio', data.bio);
    media.append('gender', data.gender);
    media.append('birthday', data.birthday);
    console.log(media.get("photo"));
    console.log(media.get("first_name"));
    console.log(media.get("last_name"));
    console.log(media.get("bio"));
    console.log(media.get("gender"));
    console.log(media.get("birthday"));
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };
    if (data.first_name && data.last_name) {
      axios.post(`${API_ROOT}/api/v1/user/update`, media, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success('Updating success!');
            this.setState({
              loadingSubmit: false
            });
            history.push('/chat');
          }
        })
        .catch((error) => {
          this.setState({
            loadingSubmit: false
          });
          message.error(error.response.data.error);
        });

    }
  }

  handleChangePhotoButton = e => {
    e.preventDefault();
    this.inputFileRef.click();
  };

  handleChangePhotoFileInput = e => {
    const { data } = this.state;
    const target = e.currentTarget;
    const file = target.files.item(0);
    // validate file as image
    if (!file.type.startsWith("image/")) {
      alert("File is not an image");
      return;
    }


    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then(dataUrl => {
      this.setState({
        data: {
          ...data,
        },
        file,
        base64: dataUrl,
        objectUrl: URL.createObjectURL(file),
      });
    });
  };

  render() {
    const {data, objectUrl} = this.state;
    return (
      <div className="signUpWrapper">
        <div className="verifyPhone-container">
          <div className="accountSetup-svg-wrap" style={{ display: "none" }}>
            <img src={AccountRegisterSvg} className="arioo-accountSetup-img" alt="stars image"/>
            <div className="centered account"><span>Account Setup</span></div>
          </div>
          <div className="account-form-wrapper" style={{ border: "none", width: "100%" }}>
            <div className="account-form-container" style={{ margin: "0 auto" }}>
              <div><span style={{
                fontSize: "49px",
                color: "#E8E8E8",
                fontWeight: "bold",
                marginBottom: "37px",
                display: "inline-block"
              }}>Account Setup</span></div>
              <form className="account-form">
                <div className="avatar-container">
                  <div className="avatar-uploader">
                    <img src={objectUrl || defaultImage}/>
                  </div>
                  <input
                    onChange={this.handleChangePhotoFileInput}
                    ref={input => (this.inputFileRef = input)}
                    style={{display: "none"}}
                    type="file"
                  />
                  <Button onClick={this.handleChangePhotoButton} className="avatar-btn">Change Image</Button>
                  <br/>
                  <Button onClick={this.handleDeleteImage} className="avatar-btn delete-btn">Delete Image</Button>
                </div>
                <div className="inputs-container">
                  <Input className="email-input" name="first_name" value={data.first_name}
                         onChange={this.handleOnChange}
                         placeholder="Name" required/>
                  <br/>
                  <br/>
                  <Input className="email-input" name="last_name" value={data.last_name}
                         onChange={this.handleOnChange}
                         placeholder="LastName" required/>
                  <br/>
                  <br/>
                  <DatePicker placeholder="Select your Birthday" onChange={value => this.setState({
                    data: {
                      ...data,
                      birthday: new Date(value).getDate().toString()
                    }
                  })}/>
                  <br/>
                  <br/>
                  <TextArea className="bio-input" placeholder="Bio" name="bio" value={data.bio}
                            onChange={this.handleOnChange}
                  />
                  <br/>
                  <br/>
                  <span className="txt-terms">
                    By signing up, you agree to our Terms, Privacy Policy.
                  </span>
                  <Button
                    onClick={this.handleSubmit}
                    loading={this.state.loadingSubmit}
                    className="primary btn-submit"
                    disabled={data.first_name.length === 0 && data.last_name.length === 0}
                  >Signup
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
