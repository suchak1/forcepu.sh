import React from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, PageHeader, Typography, List } from "antd";
import styles from "./index.css";
import Page from "@/pages";

const routes = [
  { text: "Home", to: "" },
  { text: "Gym", to: "gym" },
  { text: "Art", to: "art" },
  { text: "Docs", to: "docs" },
  { text: "App", to: "app" },
];

export default function Layout({ route, children }) {
  return (
    <AntLayout>
      <PageHeader
        title={
          <>
            <span>force</span>
            <span style={{ color: "#52E5FF" }}>pu.sh</span>
          </>
        }
        subTitle={"move fast; break everything"}
      />
      <AntLayout>
        <AntLayout.Sider>
          <List
            style={{ padding: 24 }}
            dataSource={routes}
            renderItem={({ text, to }) => {
              return (
                <List.Item>
                  <Typography.Title level={4}>
                    <NavLink to={to}>{text}</NavLink>
                  </Typography.Title>
                </List.Item>
              );
            }}
          />
        </AntLayout.Sider>
        <AntLayout className={styles.content}>{children}</AntLayout>
      </AntLayout>
    </AntLayout>
  );
}
