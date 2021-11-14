import React from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, PageHeader, Typography, List } from "antd";
import BTC from "../../assets/favicon.ico";
import BTC_ICE from "../../assets/btc_ice.png";

// import styles from "./index.less";
// import Page from "@/pages";

const routes = [
  { text: "Home", to: "" },
  { text: "Gym", to: "gym" },
  { text: "Art", to: "art" },
  { text: "Docs", to: "docs" },
  { text: "App", to: "app" },
];

const styles = {
  ice: { color: "#52e5ff" },
  white: { color: "white" },
  // wrapper: {
  //   overflow: "hidden",
  // },
};

export default function Layout({ route, children }) {
  return (
    // <div style={styles.wrapper}>
    <AntLayout>
      <PageHeader
        title={
          <div>
            {/* <span style={{ marginRight: 6, paddingBottom: 10 }}> */}
            {/* <img src={BTC_ICE} width={16}></img> */}
            <img
              src={BTC_ICE}
              width={24}
              style={{ marginRight: 10, marginBottom: 4 }}
            ></img>
            {/* </span> */}
            <span>force</span>
            <span style={styles.ice}>pu.sh</span>
          </div>
        }
        subTitle={"move fast; break everything"}
      />
      <AntLayout>
        <AntLayout.Sider>
          <List
            style={{
              padding: 24,
            }}
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
    // </div>
  );
}
