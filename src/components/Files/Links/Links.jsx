import React from "react";
import downloadSvg from "../../../assets/svgs/ic_action_download.svg";
import "./index.css";

export class Links extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Links: [
        { id: 1, name: "http://localhost:3000" },
        { id: 2, name: "http://localhost:3000"}
      ],
      loading: false
    };
  }

  render() {
    return (
      <div className="documents-body">
        <ul className="doc-list">
          {this.state.Links.map((Link) =>
            <li key={Link.id}>
              <div className="doc-info-wrap">
                <div className="docs-photo">
                  <img src={downloadSvg} alt="download" className="download-icon"/>
                </div>
              </div>
              <div className="docs-name">
                <span>{Link.name}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
