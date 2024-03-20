import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Iframe from 'react-iframe'
import { Col, Layout, Menu, Row, Icon } from "antd";
import Bag from "../../../assets/BLOG_TEMP/IMG/bag.png";
import TN1 from "../../../assets/BLOG_TEMP/IMG/TN1.png";
import TN2 from "../../../assets/BLOG_TEMP/IMG/TN2.png";
import LN1 from "../../../assets/BLOG_TEMP/IMG/LN1.png";
import LN2 from "../../../assets/BLOG_TEMP/IMG/LN2.png";
import LN3 from "../../../assets/BLOG_TEMP/IMG/LN3.png";
import Sele from "../../../assets/BLOG_TEMP/IMG/sele.png";

const { Content } = Layout;

class Blog extends React.Component {
    state = {
      contentHeight: '50',
      loader: true
    };

  resizeIframe  = (obj) => {
    const e = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    this.setState({ contentHeight: e, loader: false });

  };
  render() {
    return (
          <div className='iframe-container'>
            <div className="iframe-containerLoaderContainer">
              {this.state.loader === true ? <Icon type="loading" style={{ fontSize: "30px" }}/> : null}
            </div>
            <Iframe url="https://blog.stars.do/"
                    width="100%"
                    height={this.state.contentHeight}
                    id="myId"
                    onLoad={this.resizeIframe}
                    className="myClassname"
                    display="initial"
                    position="relative"
                    scrolling="no"
                    allowFullScreen/>
          </div>
    );
  }
}

export default Blog;
