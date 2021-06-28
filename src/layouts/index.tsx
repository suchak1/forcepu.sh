import React from 'react';
import { NavLink } from 'umi';
import { Layout as AntLayout, Menu, PageHeader, Typography, List } from 'antd';
import styles from './index.css';

const routes = [
  { text: 'Home', to: '' },
  { text: 'Audit', to: 'audit' }
];

export default function Layout({ route, children }) {
  return (
    <AntLayout>
      <AntLayout.Sider theme="light">
        <List
          style={{ padding: 24 }}
          dataSource={routes}
          renderItem={({ text, to }) => {
            return (
              <List.Item>
                <Typography.Title level={4}><NavLink to={to}>{text}</NavLink></Typography.Title>
              </List.Item>
            )
          }}
        />
      </AntLayout.Sider>
      <AntLayout className={styles.content}>
        {children}
      </AntLayout>
    </AntLayout>
  );
}