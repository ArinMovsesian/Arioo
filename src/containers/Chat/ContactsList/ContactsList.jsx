import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Icon, Col, Avatar, Input } from 'antd';

const Search = Input.Search;

export default class ContactsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  deleteContact() {
  }

  getContactsList() {
  }

  componentDidMount() {
    this.getContactsList();
  }

  render() {
    return (
      <div>
        <Col span={8}>
          <Search
            placeholder="Search"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        </Col>
      </div>
    );
  }
}
