import React from "react";
import { NavLink } from "umi";
import {
  Layout as AntLayout,
  Menu,
  PageHeader,
  Typography,
  List,
  Dropdown,
  Button,
} from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  Authenticator,
  AmplifyProvider,
  createTheme,
  defaultTheme,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "@/aws-exports";

import BTC from "../../assets/favicon.ico";
import BTC_ICE from "../../assets/btc_ice.png";
import overrides from "./index.less";
import "./index.less";

// import "antd/lib/menu/style/index.css";
// import "antd/lib/menu/style/index.less";
Amplify.configure(awsExports);

const theme = createTheme({
  name: "dark-mode-theme",
  // tokens: {
  //   colors: {
  //     button: {
  //       primary: { : "blue" },
  //     },
  //   },
  // },
  overrides: [
    {
      colorMode: "dark",
      tokens: {
        colors: {
          // brand: {
          //   primary: {
          //     ...defaultTheme.tokens.colors.brand.primary,
          //     80: '#52e5ff',
          //   },
          // },
          neutral: {
            // flipping the neutral palette
            10: defaultTheme.tokens.colors.neutral[100],
            20: defaultTheme.tokens.colors.neutral[90],
            40: defaultTheme.tokens.colors.neutral[80],
            80: defaultTheme.tokens.colors.neutral[40],
            90: defaultTheme.tokens.colors.neutral[20],
            100: defaultTheme.tokens.colors.neutral[10],
          },
          black: { value: "#fff" },
          white: { value: "#000" },
        },
      },
    },
  ],
});

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
  // "get started",
  // "gym",
  // "art",
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
      <>
        <div style={{ fontSize: 20, marginLeft: -10 }}>
          <span className={overrides.white}>force</span>
          {/* <span className={overrides.ice}>pu.sh</span> */}
          pu.sh
        </div>
        {/* <div
          style={{
            marginTop: -35,
            color: "grey",
            fontWeight: "normal",
            marginLeft: -10,
          }}
        >
          move fast; break everything
        </div> */}
      </>
    ),
    to: "",
  },
].concat(pages.map((page) => ({ text: capitalize(page), to: page })));

const headerHeight = 64;
// add move fast; break everything to right side of header
// add logo to forcepush div
// remove menu and menu items?
// or at least move these pieces out
export default function Layout({ route, children }) {
  return (
    <AntLayout>
      <AntLayout.Header
        style={{
          zIndex: 1000,
          width: "100%",
          position: "fixed",
          height: headerHeight,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            className="logo"
            src={BTC_ICE}
            width={24}
            height={24}
            style={{ marginLeft: -30 }}
          ></img>
          <Menu
            style={{ height: headerHeight, width: "100%" }}
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
                style={
                  idx === 0
                    ? {
                        backgroundColor: "transparent",
                      }
                    : {
                        display: "flex",
                        alignItems: "center",
                      }
                }
              >
                <NavLink to={route.to}>{route.text}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
          <Dropdown
            // arrow={{ pointAtCenter: true }}
            placement="bottomRight"
            overlay={
              <AmplifyProvider theme={theme} colorMode="dark">
                <Authenticator>
                  {({ signOut, user }) => (
                    <main>
                      <h1>Hello {user.username}</h1>
                      <button onClick={signOut}>Sign out</button>
                    </main>
                  )}
                </Authenticator>
              </AmplifyProvider>
            }
          >
            {/* maybe "Get signals" or "Get started" */}
            <Button>
              Get started
              <DownOutlined />
            </Button>
          </Dropdown>
        </span>
      </AntLayout.Header>

      <AntLayout.Content
        style={{
          padding: 24,
          marginTop: headerHeight,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        {children}
      </AntLayout.Content>
    </AntLayout>
  );
}
