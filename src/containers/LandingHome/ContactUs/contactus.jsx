import React, { Component } from "react";
import "./index.css";
import { Col, Layout, Menu, message, Row, Icon } from "antd";
import axios from "axios";
import { API_ROOT } from "../../../helpers/apiConfig";
import { BlockUsers } from "../../Chat/AccountSetting/BlockUsers/BlockUsers";

const { Content } = Layout;

class ContactUs extends Component {
  state = {
    subject: null,
    desc: null,
    fileData: null,
    isDisabled: true,
    showFileNotif: false,
    fileName: null,
    submitCompleted: false
  };

  subjectOnPress = (event) => {
    if (event.target.value === "") {
      this.setState({
        isDisabled: true
      });
    } else {
      this.setState({
        subject: event.target.value,
        isDisabled: false
      });
    }
  };
  // subject = undefined;
  // desc = undefined;
  // fileData = undefined;
  fileUpload = (e) => {
    e.preventDefault();
    document.getElementById("fileInput").click();
  };
  submitContactUsForm = (e) => {
    e.preventDefault();
    this.setState({
      submitCompleted: true
    });
    console.log("sub", this.state.subject);
    console.log("desc", this.state.desc.value);
    console.log("file", this.state.fileData);

    let contactUsFormData = new FormData();
    contactUsFormData.append("subject", this.state.subject);
    contactUsFormData.append("desc", this.state.desc.value);
    contactUsFormData.append("file", this.state.fileData);


    let configHeader = undefined;
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      configHeader = {
        headers: {
          "Accept": "application/json",
          "language": "en",
          "app": "stars",
          "Authorization": token
        }
      };

    } else {
      configHeader = {
        headers: {
          "Accept": "application/json",
          "language": "en",
          "app": "stars"
        }
      };
    }

    axios.post(`${API_ROOT}/api/v1/contact_us`, contactUsFormData, configHeader)
      .then((response) => {
        if (response.status === 200) {
          this.myFormRef.reset();
          this.setState({
            submitCompleted: false
          });
          message.success("پیام شما با موفقیت ارسال شد");

        }
      })
      .catch((error) => {
        // message.error(error.response.data.error);
        this.myFormRef.reset();
        message.error("ارسال ناموفق");
      });
  };
  uploadImageForContactUs = (event) => {
    this.setState({
      fileData: event.target.files[0],
      fileName: event.target.files[0].name,
      showFileNotif: true
    });
    // this.state.fileData = event.target.files[0];
    console.log("file info: ", event.target.files[0].name);

  };
  render() {
    return (
      <Layout>
        <Content className="contactUs_main">
          <div className="form_wraper">
            <h1>contact us</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus
              aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi
              tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin. Sapien</p>
            <form onSubmit={this.submitContactUsForm} ref={(el) => this.myFormRef = el}>
              <div>
                <input type="text" placeholder="Subject:" onKeyUp={this.subjectOnPress}/>
              </div>
              <div>
                <textarea placeholder="Your message:" ref={value => this.state.desc = value}/>
              </div>
              <div className="upload_and_submit">
                <div>
                  <button onClick={this.fileUpload}>UPLOAD FILE</button>
                  <input type="file" id="fileInput" style={{ display: "none" }}
                         onChange={this.uploadImageForContactUs}/>
                  {
                    this.state.showFileNotif &&
                    <div className="addFileNotification">
                      <span>فایل شما افزوده گردید</span>
                      <div>
                        <span>({this.state.fileName.slice(0, 5)}...)</span>
                      </div>
                    </div>
                  }
                </div>
                <div>
                  <button type="submit" disabled={this.state.isDisabled} className="submitBTN">
                    {
                      this.state.submitCompleted
                        ?
                        <Icon type="loading"/>
                        :
                        "submit"
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default ContactUs;
