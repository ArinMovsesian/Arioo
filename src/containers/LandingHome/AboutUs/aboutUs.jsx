import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { Col, Layout, Menu, Row, Icon } from "antd";
import Group2020 from "../../../assets/About_Stars-min.png";
import malePlaceHolder from "../../../assets/male-placeholder.jpg";
import femalePlaceHolder from "../../../assets/female-placeholder.jpg";

const { Content } = Layout;

class AboutUS extends React.Component {
  render() {
    return (
      <Layout>
        <Content className="aboutus_main_desktop">
          <section className="aboutus_firstSection">
            <Row>
              <Col md={12} xs={24}>
                <div className="leftPart">
                  <img src={Group2020} alt=""/>
                </div>
              </Col>
              <Col md={12} xs={24}>
                <div className="rightPart">
                  <h1>Celebrities</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris
                    rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis.
                    Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin.
                    Sapien</p>
                </div>
              </Col>
            </Row>
          </section>
          <section className="aboutus_secondSection">
            <Row>
              <Col md={4} xs={24}></Col>
              <Col md={16} xs={24}>

                <h1 style={{ fontWeight: "bold", fontSize: "30px", marginTop: "80px" }}>Our Goal</h1>
                <div className="AboutUs_OurGoal">
                  <p style={{ fontWeight: "bold", fontSize: "20px", marginTop: "20px", lineHeight: "30px" }}>Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris
                    rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis.
                    Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin.
                    Sapien</p>
                </div>
                {/*<h1 style={{ fontWeight: "bold", fontSize: "30px", marginTop: "50px" }}>Our Team</h1>*/}
                {/*<div className="aboutUs_flex-container">*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="aboutUs_flexItems">*/}
                    {/*<figure>*/}
                      {/*<div className="aboutUs_OurTeam_imageContainer">*/}
                        {/*<img src={malePlaceHolder} alt="Trulli"/>*/}

                        {/*<div>*/}
                          {/*<Icon type="linkedin" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="gitlab" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                          {/*<Icon type="facebook" theme="filled" style={{ fontSize: "30px", margin: "5px" }}/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      {/*<figcaption>Arin Movsesian</figcaption>*/}

                    {/*</figure>*/}
                  {/*</div>*/}
                {/*</div>*/}
                <h1 style={{ fontWeight: "bold", fontSize: "30px", marginTop: "50px", marginBottom: "30px" }}>Release
                  Notes</h1>
                <Row>
                  <Col md={8} xs={24}>
                    <div className="AboutUs_releaseNote">
                      <Row>
                        <Col span={12}>
                          <span style={{ fontSize: "25px", fontWeight: "bold", color: "#000" }}>2.33</span>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                          <span style={{ color: "#b9b9b9" }}>Sep 2019</span>
                        </Col>
                      </Row>
                      <p style={{ fontSize: "15px", lineHeight: "22px", marginTop: "15px" }}>et dolore magna aliqua.
                        Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris
                        rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem
                        mollis.
                        Morbi tristique </p>
                    </div>
                  </Col>
                  <Col md={8} xs={24}>
                    <div className="AboutUs_releaseNote">
                      <Row>
                        <Col span={12}>
                          <span style={{ fontSize: "25px", fontWeight: "bold", color: "#000" }}>2.33</span>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                          <span style={{ color: "#b9b9b9" }}>Sep 2019</span>
                        </Col>
                      </Row>
                      <p style={{ fontSize: "15px", lineHeight: "22px", marginTop: "15px" }}>et dolore magna aliqua.
                        Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris
                        rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem
                        mollis.
                        Morbi tristique </p>
                    </div>
                  </Col>

                  <Col md={8} xs={24}>
                    <div className="AboutUs_releaseNote">
                      <Row>
                        <Col span={12}>
                          <span style={{ fontSize: "25px", fontWeight: "bold", color: "#000" }}>2.33</span>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                          <span style={{ color: "#b9b9b9" }}>Sep 2019</span>
                        </Col>
                      </Row>
                      <p style={{ fontSize: "15px", lineHeight: "22px", marginTop: "15px" }}>et dolore magna aliqua.
                        Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris
                        rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem
                        mollis.
                        Morbi tristique </p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4} xs={24}></Col>
            </Row>

          </section>
        </Content>
      </Layout>
    );
  }
}

export default AboutUS;
