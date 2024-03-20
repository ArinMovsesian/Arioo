import React from "react";
import downloadSvg from "../../../assets/svgs/ic_action_download.svg";
import "./index.css";

export class Media extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Media: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10},
      ],
      loading: false
    };
  }

  render() {
    return (
      <div className="documents-body">
        <ul className="media-list">
          {this.state.Media.map((Medium) =>
            <li key={Medium.id}>
              <div className="doc-info-wrap">
                <div className="media-photo">
                  <img src={downloadSvg} alt="download" className="download-icon"/>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
