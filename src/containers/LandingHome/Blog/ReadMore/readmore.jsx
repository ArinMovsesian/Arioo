import React, { Component } from "react";
import placeholder1 from "../../../../assets/readMoreBlog/placeholder1.jpg";
import placeholder2 from "../../../../assets/readMoreBlog/placeholder2.jpg";

import "./index.css";
import { Layout } from "antd";

const { Content } = Layout;

class BlogReadMore extends Component {
  render() {
    return (
      <Layout>
        <Content className="blogReadMore_main_desktop">
          <div className="blogReadMore_headerWallpaper">
            <img src={placeholder1} alt=""/>
          </div>
          <div className="blogReadMore_line"></div>
          <section className="blogReadMore_main_section">
            <h1>Introducing 5 Top Stores in Star</h1>

            <p>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
              to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
              PageMaker including versions of Lorem Ipsum</p>
            <h2>Sport Shoes</h2>
            <div>
              <img src={placeholder2} alt=""/>
            </div>
            <p>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
              to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
              PageMaker including versions of Lorem Ipsum</p>
            <h2>perfume</h2>
            <div>
              <video width="320" height="240" controls poster={placeholder2}>
                <source type="video/mp4"/>
                <source type="video/ogg"/>
                Your browser does not support the video tag.
              </video>
            </div>
            <div></div>
          </section>
        </Content>
        <Content className="blogReadMore_main_mobile">
          <div className="blogReadMore_headerWallpaper">
            <img src={placeholder1} alt=""/>
          </div>
          <div className="blogReadMore_line"></div>
          <section className="blogReadMore_main_section">
            <h1>Introducing 5 Top Stores in Star</h1>

            <p>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
              to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
              PageMaker including versions of Lorem Ipsum</p>
            <h2>Sport Shoes</h2>
            <div>
              <img src={placeholder2} alt=""/>
            </div>
            <p>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
              to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
              PageMaker including versions of Lorem Ipsum</p>
            <h2>perfume</h2>
            <div>
              <video width="320" height="240" controls poster={placeholder2}>
                <source type="video/mp4"/>
                <source type="video/ogg"/>
                Your browser does not support the video tag.
              </video>
            </div>
            <div></div>
          </section>
        </Content>
      </Layout>
    );
  }
}

export default BlogReadMore;
