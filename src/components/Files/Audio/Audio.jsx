import React from 'react';
import downloadSvg from '../../../assets/svgs/ic_action_download.svg';
import './index.css';

export class Audio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Audios: [
        { id: 1, name: "Mohsen Chavoshi.mp3", music:"Delbar", size: "700MB" },
        { id: 2, name: "Mohsen Chavoshi.mp3", music:"Rafigham Kojaei", size: "7.8MB" },
      ],
      loading: false,
    };
  }

  render() {
    return (
      <div className="documents-body">
        <ul className="doc-list">
          {this.state.Audios.map((Audio) =>
            <li key={Audio.id}>
              <div className="doc-info-wrap">
                <div className="docs-photo">
                  <img src={downloadSvg} alt="download" className="download-icon"/>
                </div>
              </div>
              <div className="docs-name">
                <span>{Audio.name}</span>
                <span className="doc-size">{Audio.music}</span>
              </div>
              <div className="size-column">
                <span>{Audio.size}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
