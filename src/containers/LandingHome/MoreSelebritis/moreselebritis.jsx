import React from "react";
import "./index.css";
import { Col, Layout, Menu, Row } from "antd";
import axios from "axios";
import { API_ROOT } from "../../../helpers/apiConfig";
import { NavLink } from "react-router-dom";
import Group2020 from "../../../assets/Group2020.png";
const { Content } = Layout;

class MoreSelebritis extends React.Component {
  state = {
    getWasData: []
  };

  componentDidMount() {
    this.getVas();
  }

  getVas = () => {
    const uuidValue = localStorage.getItem("uuid");
    const configHeader = {
      headers: {
        "Accept": "application/json",
        "language": "en",
        "app": "stars",
        "agent": "web",
        "uuid": uuidValue
      }
    };
    axios.get(`${API_ROOT}/api/v1/channel/index/vas/web`, configHeader)
      .then((response) => {
        if (response.status === 200) {
          console.log("vas is ", response.data.data);
          this.setState({
            getWasData: response.data.data
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <Layout>
        <Content className="moreSelebritis_main">
          <section className="moreSelebritis_firstSection">
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
          <section className="moreSelebritis_secondSection">
            <div className="mainDIV">
              <ul>
                {
                  this.state.getWasData.map(
                    (value, index) => {
                      return (
                        <NavLink to={`/registration/${value.id}`}>
                          <li key={value.id}>
                            <div>
                              <img src={value.media.path} alt=""/>
                            </div>
                            <div>
                              <span>{value.name}</span>
                            </div>
                          </li>
                        </NavLink>
                      );
                    }
                  )
                }

              </ul>
            </div>
          </section>
          <section className="moreSelebritis_thirdSection">
            <h1>Enter you phone number</h1>
            <form>
              <div style={{ textAlign: "center" }}>
                <input type="text"/>
              </div>
              <div style={{ textAlign: "center" }}>
                <input type="submit" value="SEND"/>
              </div>
            </form>
          </section>
        </Content>
      </Layout>
    );
  }
}

export default MoreSelebritis;
