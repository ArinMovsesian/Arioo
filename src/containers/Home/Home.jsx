import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../assets/svgs/logo-arioo.svg';
import logoNewLightBlue from "../../assets/svgs/logoNewLightBlue.png";
import homePageBackground from "../../assets/svgs/homePageBackground.png";
import homeSvg from '../../assets/svgs/introo.svg';
import SearchSvg from '../../assets/svgs/search.svg';
import ChatSvg from '../../assets/svgs/chat.svg';
import GroupSvg from '../../assets/svgs/Group.svg';
import "./index.css";

export class Home extends React.Component {

  render() {
    return (
      <div className="HomePageWrapper">
            <div className="home-form-container">
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img src={logoNewLightBlue} alt="Arioo"/>
              </div>
              <p className="home-txt">See What's happening in the world right now</p>
              <div className="continue-txt">
                <span>Login with</span>
              </div>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <Link to='/submitphone' className="btn-phone-register">Phone No</Link>
              </div>
              <div style={{ textAlign: "center" }}>
                <Link to='/submitemail' className="btn-email-register">Email</Link>
              </div>
            </div>
      </div>
    );
  }
}
