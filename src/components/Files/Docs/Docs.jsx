import React from "react";
import downloadSvg from "../../../assets/svgs/ic_action_download.svg";
import "./index.css";

export class Docs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Docs: [
        { id: 1, name: "tarh-arioo.pdf", size: "700MB" },
        { id: 2, name: "graphic.pdf", size: "7.8MB" }
      ],
      loading: false
    };
  }

  render() {
    return (
      <div className="documents-body">
        <ul className="doc-list">
          {this.state.Docs.map((Doc) =>
            <li key={Doc.id}>
              <div className="doc-info-wrap">
                <div className="docs-photo">
                  <img src={downloadSvg} alt="download" className="download-icon"/>
                </div>
              </div>
              <div className="docs-name">
                <span>{Doc.name}</span>
                <span id="doc-size">{Doc.size}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
