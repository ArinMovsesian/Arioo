import React from "react";
import { Layout, Menu, Row, Col, Button, Icon } from "antd";
import handSvg from "../../assets/svgs/Group 1887.png";
import messengerSvg from "../../assets/svgs/Messenger.svg";
import ellipseSvg from "../../assets/svgs/Ellipse 3.png";
import mobileSvg from "../../assets/svgs/app feture and env.png";
import laptopSvg from "../../assets/svgs/macbook-pro-clay.png";
import "./index.css";
import Nav from './Nav/Nav';
import Footer from './Footer/Footer';
import { Route, Switch, Redirect, Router } from "react-router";
import Registration from "./Registration/Registration";
import LandingHome from "./Home/Home";
import { Home } from "../Home/Home";
import Blog from "./Blog/blog";
import MoreSelebritis from "./MoreSelebritis/moreselebritis";
import ContactUs from "./ContactUs/contactus";
import BlogReadMore from "./Blog/ReadMore/readmore";
import AboutUS from "./AboutUs/aboutUs";
import FAQ from "./FAQ/faq";

const { Content } = Layout;

export default class LandingMain extends React.Component {
  state = {
    loaderIcon: true,
  };
  componentDidMount(){
    this.setState({
      loaderIcon: false,
    });
  };
  render() {
    console.log("LandingMain", this.props);

    return (
      <div>
        {
          this.state.loaderIcon === true
          ?
            <div className="preloaderIcon">
               <Icon type="loading" style={{ fontSize: "30px" }}/>
            </div>
          :
          <div className="profile-view-container"
               style={this.props.location.pathname === '/blog' ? { overflowY: 'hidden' } : { overflowY: "auto" }}>
            <Nav {...this.props} />
            <Switch>
              <Route exact path="/" component={LandingHome}/>
              <Route exact path="/registration/:id" component={Registration}/>
              <Route exact path="/blog" component={Blog}/>
              <Route exact path="/blog/readmore" component={BlogReadMore}/>
              <Route exact path="/morecelebritis" component={MoreSelebritis}/>
              <Route exact path="/contactus" component={ContactUs}/>
              <Route exact path="/aboutus" component={AboutUS}/>
              <Route exact path="/faq" component={FAQ}/>
              {/*<Route exact path="/landingHome" component={LandingHome} />*/}
              {/*<Route exact path={this.props.match.url + '/registration'} component={Registration} />*/}
              {/*<Route path="/arioolanding/registration/:id" component={Registration}/>*/}
              {/*<Route path="/home" component={Home}/>*/}
              {/*<Redirect exact from="/" to={'/arioolanding'}/>*/}
            </Switch>
            {
              this.props.location.pathname === '/blog' ? null : <Footer/>
            }

          </div>
        }
      </div>
    );
  }
}
