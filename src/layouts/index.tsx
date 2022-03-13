import React, { useState } from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, Button, Modal } from "antd";
import {
  Authenticator,
  AmplifyProvider,
  useAuthenticator,
  createTheme,
  defaultTheme,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { getApiUrl } from "@/utils";
import "@aws-amplify/ui-react/styles.css";
import BTC_ICE from "../../assets/btc_ice.png";
import overrides from "./index.less";
import "./index.less";

const isLocal = process.env.NODE_ENV === "development";

let config;
if (isLocal) {
  config = require("@/aws-exports").default;
  Amplify.configure(config);
  // const url = `https://api.dev.forcepu.sh/auth`;
  // const getConfig = async () =>
  //   fetch(url, { method: "GET" })
  //     .then((response) => response.json())
  //     .then((config) => Amplify.configure(config));
  // getConfig();
} else {
  const url = `${getApiUrl()}/auth`;
  const getConfig = async () =>
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((config) => Amplify.configure(config));
  getConfig();
}

const theme = createTheme({
  name: "dark-mode-theme",
  overrides: [
    {
      colorMode: "dark",
      tokens: {
        colors: {
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

// original: gym, art, docs, app
const pages: string[] = [
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

const capitalize = (s: string | any[]) => s[0].toUpperCase() + s.slice(1);

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

const Layout = ({ route, children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const loggedIn = user;
  const showModal = !loggedIn && showLogin;
  const dummy = <Authenticator className={overrides.invisible} />;

  return (
    <AntLayout>
      <AntLayout.Header
        style={{
          // this is so that header stays above toggle in fixed scrolling
          zIndex: 1000,
          width: "100%",
          position: "fixed",
          height: headerHeight,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <img className="logo" src={BTC_ICE} width={24} height={24}></img>
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
                className={[overrides.white, overrides.ice].join(" ")}
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
          {dummy}
          {loggedIn && (
            <span
              style={{ whiteSpace: "nowrap", paddingRight: "20px" }}
            >{`signed in as ${
              user?.attributes?.name || user?.attributes?.email
            }`}</span>
          )}
          {loggedIn ? (
            <Button className="signOut" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            // maybe "Get signals" or "Get started"
            <Button onClick={() => setShowLogin(true)}>Get started</Button>
          )}
          <Modal
            visible={showModal}
            closable={false}
            onCancel={() => setShowLogin(false)}
          >
            <AmplifyProvider theme={theme} colorMode="dark">
              <Authenticator />
            </AmplifyProvider>
          </Modal>
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
};

export default ({ route, children }) => (
  <Authenticator.Provider>
    <Layout route={route}>{children}</Layout>
  </Authenticator.Provider>
);
