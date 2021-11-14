import React from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, PageHeader, Typography, List } from "antd";
import BTC from "../../assets/favicon.ico";
import BTC_ICE from "../../assets/btc_ice.png";

// import "antd/lib/menu/style/index.css";
// import "antd/lib/menu/style/index.less";

import overrides from "./index.less";

// import Page from "@/pages";
const styles = {
  ice: { color: "#52e5ff", fontWeight: 600 },
  white: { color: "white", fontWeight: 600 },
  // wrapper: {
  //   overflow: "hidden",
  // },
};
// original: gym, art, docs, app
const pages = [
  "gym",
  "art",
  // "docs"
];

// "docs" should be example of how to use library or service
// resume should be in about section
// home page should be "app"
// "art" should be hidden
// "gym" should be hidden?
// split gym, art/gallery to right side of nav

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const routes = [
  {
    text: (
      <div style={{ fontSize: 20, marginLeft: -10 }}>
        <span className={overrides.white}>force</span>
        {/* <span className={overrides.ice}>pu.sh</span> */}
        pu.sh
      </div>
    ),
    to: "",
  },
].concat(pages.map((page) => ({ text: capitalize(page), to: page })));

export default function Layout({ route, children }) {
  return (
    <AntLayout>
      <AntLayout.Header style={{ zIndex: 1, width: "100%" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            className="logo"
            src={BTC_ICE}
            width={24}
            height={24}
            style={{ marginLeft: -30 }}
          ></img>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["0"].concat([
              (pages.indexOf(window.location.pathname.slice(1)) + 1).toString(),
            ])}
            selectedKeys={["0"].concat([
              (pages.indexOf(window.location.pathname.slice(1)) + 1).toString(),
            ])}
          >
            {routes.map((route, idx) => (
              <Menu.Item
                className={overrides}
                key={idx}
                style={idx === 0 ? { backgroundColor: "transparent" } : {}}
              >
                <NavLink to={route.to}>{route.text}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </span>
      </AntLayout.Header>

      <AntLayout.Content style={{ padding: 24 }}>{children}</AntLayout.Content>
    </AntLayout>
  );
}
