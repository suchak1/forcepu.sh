import React from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, PageHeader, Typography, List } from "antd";
// import styles from "./index.less";
import Page from "@/pages";

const routes = [
  { text: "Home", to: "" },
  { text: "Gym", to: "gym" },
  { text: "Art", to: "art" },
  { text: "Docs", to: "docs" },
  { text: "App", to: "app" },
];

const styles = { ice: { color: "#52e5ff" }, white: { color: "white" } };

export default function Layout({ route, children }) {
  console.log(window.location);
  return (
    <AntLayout>
      <PageHeader
        title={
          <div>
            <span>force</span>
            <span style={styles.ice}>pu.sh</span>
          </div>
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
                    <NavLink
                      to={to}
                      style={
                        window.location.pathname.slice(1) === to
                          ? styles.ice
                          : styles.white
                      }
                    >
                      {text}
                    </NavLink>
                  </Typography.Title>
                </List.Item>
              );
            }}
          />
        </AntLayout.Sider>
        <AntLayout>{children}</AntLayout>
      </AntLayout>
    </AntLayout>
  );
}
