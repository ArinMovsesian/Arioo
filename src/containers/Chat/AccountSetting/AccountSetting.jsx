import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ChatAccountSidebar } from "../../../components/ChatAccountSidebar/index";
import "./index.css";
import defaultImage from "../../../assets/svgs/upload-image.svg";
import { Input, message, DatePicker, Button, Upload,  Menu, Icon } from "antd";
import axios from "axios";
import { API_ROOT } from "../../../helpers/apiConfig";
import { history } from "../../../helpers/history";
import { NotificationSetting } from './NotificationSetting/NotificationSetting';
import { PrivateRoute } from '../../../components/PrivateRoutes/PrivateRoutes';
import { LastSeen } from './LastSeen/LastSeen';
import { BlockUsers } from './BlockUsers/BlockUsers';
import { ProfileSetting } from './ProfileSetting/ProfileSetting';
import { PrivacyGroup } from './PrivacyGroup/PrivacyGroup';
import { ActiveSessions } from './ActiveSessions/ActiveSessions';


const { TextArea } = Input;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";

  if (!isJPG && !isPNG) {
    message.error("You can only upload JPG and PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

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


export class AccountSetting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        first_name: "",
        last_name: "",
        birthday: "",
        gender: "",
        bio: "",
        photo: "",
        username: '',
        email: '',
      },
      file: null,
      base64: null,
      objectUrl: null,
      media: null,
      submitted: false,
      loading: false,
      loadingSubmit: false
    };

    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  };

  inputFileRef = null;

  handleChangeImage = (event) => {
    event.preventDefault();
    const { data } = this.state;
    this.setState({
      ...data,
      imageUrl: null,
      loading: false
    });
  };

  handleDeleteImage = (event) => {
    event.preventDefault();
    const { data } = this.state;
    this.setState({
      ...data,
      objectUrl: null
    });
  };

  handleChange = (info) => {
    const { data } = this.state;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        ...data,
        imageUrl,
        loading: false
      }));
    }
  };

  handleOnChange = (event) => {
    const { name, value } = event.target;
    const { data, media } = this.state;
    this.setState({
      data: {
        ...data,
        photo: media,
        [name]: value,
      },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      submitted: true,
      loadingSubmit: true
    });
    const { data, media } = this.state;
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
      console.log('===========>', media);
      axios.post(`${API_ROOT}/api/v1/user/update`, data, configHeader)
        .then((response) => {
          if (response.status === 200) {
            message.success("Updating success!");
            this.setState({
              loadingSubmit: false
            });
            // history.push("/chat");
          }
        })
        .catch((error) => {
          this.setState({
            loadingSubmit: false
          });
          message.error(error.response.data.error);
        });

    }
    // alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    // console.log(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  };

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

    const media = new FormData();
    media.append('photo', file);
    media.append('first_name', data.first_name);
    media.append('last_name', data.last_name);
    media.append('bio', data.bio);
    media.append('gender', data.gender);
    media.append('birthday', data.birthday);

    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then(dataUrl => {
      this.setState({
        data: {
          ...data,
        },
        base64: dataUrl,
        objectUrl: URL.createObjectURL(file),
        media,
      });
    });
  };

  render() {
    const { data, objectUrl } = this.state;
    return (
      <div className="chat-wrapper">
        <ChatAccountSidebar/>
        <div className="setting-column">
          <div className="setting-header">
            <div><span>Settings</span></div>
          </div>
          <div className="setting-body-wrapper">
            <div className="settings-menu-wrap">

              <Menu
                onClick={this.handleClick}
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
              >
                <MenuItemGroup>
                  <Menu.Item key="sub1">
                    <NavLink
                      to={`/setting/profileSetting`}
                      activeClassName="active"
                      style={{color: 'inherit',
                        textAlign: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                      }}
                    >
                      Account
                    </NavLink>
                  </Menu.Item>
                </MenuItemGroup>
                <SubMenu key="sub2" title={<span>Privacy and Safety</span>}>
                  <MenuItemGroup key="g1">
                    <Menu.Item key="1">
                      <NavLink
                        to={`/setting/blockUser`}
                        activeClassName="active"
                        style={{color: 'inherit',
                          textAlign: 'inherit',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                        }}
                      >
                      Blocked Users
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <NavLink
                        to={`/setting/lastSeen`}
                        activeClassName="active"
                        style={{color: 'inherit',
                          textAlign: 'inherit',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                        }}
                      >
                        Last Seen
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <NavLink
                        to={`/setting/privacyGroup`}
                        activeClassName="active"
                        style={{color: 'inherit',
                          textAlign: 'inherit',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                        }}
                      >
                      Group
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <NavLink
                        to={`/setting/activeSessions`}
                        activeClassName="active"
                        style={{color: 'inherit',
                          textAlign: 'inherit',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                        }}
                      >
                      Active Sessions
                      </NavLink>
                    </Menu.Item>
                  </MenuItemGroup>
                </SubMenu>
                <SubMenu key="sub3" title={<span>Info</span>}>
                </SubMenu>
              <MenuItemGroup>
                <Menu.Item key="sub4">
                  <NavLink
                    to={`/setting/notificationSetting`}
                    activeClassName="active"
                    style={{color: 'inherit',
                      textAlign: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                    }}
                  >
                    Notifications
                  </NavLink>
                </Menu.Item>
              </MenuItemGroup>
                <SubMenu key="sub5" title={<span>Find Friends</span>}>
                </SubMenu>
                <SubMenu key="sub6" title={<span>Blocked accounts </span>}>
                </SubMenu>
              </Menu>

            </div>


            <PrivateRoute path="/setting/profileSetting" component={ProfileSetting} />
            <PrivateRoute path="/setting/notificationSetting" component={NotificationSetting} />
            <PrivateRoute path="/setting/lastSeen" component={LastSeen} />
            <PrivateRoute path="/setting/blockUser" component={BlockUsers} />
            <PrivateRoute path="/setting/privacyGroup" component={PrivacyGroup} />
            <PrivateRoute path="/setting/activeSessions" component={ActiveSessions} />


          </div>
        </div>
      </div>
    );
  }
}
