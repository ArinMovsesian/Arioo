import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios/index";
import { API_ROOT } from "../../../helpers/apiConfig";
import "./index.css";
import { ChatAccountSidebar } from "../../../components/ChatAccountSidebar";
import { v4 } from 'uuid';
import { message } from 'antd';
import { history } from '../../../helpers/history';

export class Sticker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      stickerPacks: [],
      stickers: [],
      loading: false,
      data: {
        sticker_pack_id: null
      },
    };
  }

  getSticker() {
    const token = localStorage.getItem("token");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "Authorization": token
      }
    };
    axios.get(`${API_ROOT}/api/v1/sticker/pack`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          const stickersPack = response.data.data;
          this.setState({
            stickerPacks: stickersPack
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postSticker(id){
    const token = localStorage.getItem('token');
    this.setState({
      data:{
        sticker_pack_id: parseInt(id),
      }
    });
    const {data} = this.state;
    const configHeader = {
      headers: {
        'Accept': 'application/json',
        'language': 'en',
        'app': 'stars',
        'Authorization': token
      }
    };
    if (id) {
      axios.post(`${API_ROOT}/api/v1/user/sticker`, data, configHeader)
        .then((response) =>  {
          if (response.status === 200) {
            message.success('added success!');
          }
        })
        .catch((error) => {
          message.error(error.response.data.error);
        });

    }
  }

  componentDidMount() {
    this.getSticker();
  }

  render() {
    return (
      <div className="chat-wrapper">
        <ChatAccountSidebar/>
        <div className="setting-column">
          <div className="setting-header">
            <div><span>Settings</span></div>
          </div>
          <div className="setting-body-wrapper">
            <div className="settings-menu-wrap">
              <ul style={{ paddingLeft: "21px" }}>
                <li><NavLink to="/">Account</NavLink></li>
                <li><NavLink to="/">Privacy and safety</NavLink></li>
                <li><NavLink to="/">info</NavLink></li>
                <li><NavLink to="/">Notifications</NavLink></li>
                <li><NavLink to="/">Find friends</NavLink></li>
                <li><NavLink to="/">Blocked accounts</NavLink></li>
              </ul>
            </div>
            <div>
              <ul className="media-list" style={{ flexDirection: "column" }}>
                {
                  this.state.stickerPacks.map(
                    (stickerPack) => {
                      return (
                        <li key={stickerPack.id}>
                          <button onClick={this.postSticker.bind(this, stickerPack.id)}>install</button>
                          <span>{stickerPack.title}</span>
                          <ul className="media-list">
                            {
                              stickerPack.stickers.map((sticker) => {
                                return (
                                  <li key={sticker.id}>
                                    <div className="doc-info-wrap">
                                      <div className="media-photo">
                                        <img src={sticker.path} alt="stickers"
                                             className="download-icon"/>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })
                            }
                          </ul>
                        </li>
                      );
                    }
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
