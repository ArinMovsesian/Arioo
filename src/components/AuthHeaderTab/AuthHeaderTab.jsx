import React from 'react';
import { Tabs } from 'antd';
import './index.css';

const TabPane = Tabs.TabPane;

export default class AuthTab extends React.Component {

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="2">
          <TabPane tab={<span>Email</span>} key="1">
            {/*Tab 1*/}
          </TabPane>
          <TabPane tab={<span>Phone No</span>} key="2">
            {/*Tab 2*/}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
