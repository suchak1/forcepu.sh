import React, { useState, useEffect, createContext } from "react";
import { NavLink } from "umi";
import { Layout as AntLayout, Menu, Button, Modal, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  Authenticator,
  AmplifyProvider,
  useAuthenticator,
  createTheme,
  defaultTheme,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import BTC_ICE from "../../assets/btc_ice.png";
import overrides from "./index.less";
import "./index.less";
import {
  getLoginLoading,
  getEnvironment,
  getHostname,
  getAccount,
} from "@/utils";
import TOS from "../pages/tos";
import pageStyles from "../pages/index.less";

let config;
const isLocal = getEnvironment() === "local";
const protocol = isLocal ? "http" : "https";
const hostname = getHostname(false);
const port = isLocal ? ":8000" : "";
// const { pathname } = window.location;
// const redirectUrl = `${protocol}://${hostname}${port}${pathname}`;
const redirectUrl = `${protocol}://${hostname}${port}`;

if (isLocal) {
  config = require("@/aws-exports").default;
} else {
  config = {
    aws_project_region: process.env.UMI_APP_REGION,
    aws_cognito_identity_pool_id: process.env.UMI_APP_IDENTITY_POOL_ID,
    aws_cognito_region: process.env.UMI_APP_REGION,
    aws_user_pools_id: process.env.UMI_APP_USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.UMI_APP_WEB_CLIENT_ID,
    oauth: {
      domain: process.env.UMI_APP_OAUTH_DOMAIN,
      scope: [
        "phone",
        "email",
        "openid",
        "profile",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: redirectUrl,
      redirectSignOut: redirectUrl,
      responseType: "code",
    },
    federationTarget: "COGNITO_USER_POOLS",
    aws_cognito_username_attributes: ["EMAIL"],
    aws_cognito_social_providers: ["GOOGLE"],
    aws_cognito_signup_attributes: ["EMAIL", "NAME", "PICTURE"],
    aws_cognito_mfa_configuration: "OPTIONAL",
    aws_cognito_mfa_types: ["TOTP"],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: [
        "REQUIRES_LOWERCASE",
        "REQUIRES_NUMBERS",
        "REQUIRES_SYMBOLS",
        "REQUIRES_UPPERCASE",
      ],
    },
    aws_cognito_verification_mechanisms: ["EMAIL"],
  };
}
// config.oauth.redirectSignIn = redirectUrl;
// config.oauth.redirectSignOut = redirectUrl;

Amplify.configure(config);

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
  "docs",
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
          pu.sh
        </div>
      </>
    ),
    to: "",
  },
].concat(pages.map((page) => ({ text: capitalize(page), to: page })));

const headerHeight = 64;
const footerHeight = headerHeight;
// add move fast; break everything to right side of header
// add logo to forcepush div
// remove menu and menu items?
// or at least move these pieces out

export const AccountContext = createContext({});

interface LayoutProps {
  route: any;
  children: any;
}
const Layout = ({ children }: LayoutProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const { user: loggedIn, signOut } = useAuthenticator((context) => [
    context.user,
  ]);
  const [account, setAccount] = useState();
  const [accountLoading, setAccountLoading] = useState(false);
  const showModal = !loggedIn && showLogin;
  const dummy = <Authenticator className={overrides.invisible} />;
  const getAccountText = (user: string | undefined) => `signed in as ${user}`;
  const accountText = getAccountText(
    loggedIn?.attributes?.name || loggedIn?.attributes?.email
  );
  const [checked, setChecked] = useState(false);
  const [acknowledgeLoading, setAcknowledgeLoading] = useState(false);

  useEffect(getLoginLoading(setLoginLoading));
  useEffect(getAccount(loggedIn, setAccount, setAccountLoading), [loggedIn]);

  const onCheck = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  const onAcknowledge = () => {
    console.log("click");
    setAcknowledgeLoading(true);
    setTimeout(() => {
      setAcknowledgeLoading(false);
    }, 3000);
  };

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
            items={routes.map((route, idx) => ({
              className: [overrides.white, overrides.ice].join(" "),
              key: idx,
              style:
                idx === 0
                  ? {
                      backgroundColor: "transparent",
                    }
                  : {
                      display: "flex",
                      alignItems: "center",
                    },
              label: <NavLink to={route.to}>{route.text}</NavLink>,
            }))}
          ></Menu>
          {dummy}
          {!loginLoading && (
            <span
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {loggedIn && (
                <span className={overrides.account}>{accountText}</span>
              )}
              {loggedIn ? (
                <Button
                  className="signOut"
                  onClick={() => {
                    setShowLogin(false);
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              ) : (
                // maybe "Get signals" or "Get started"
                <Button
                  className={overrides.start}
                  onClick={() => setShowLogin(true)}
                >
                  Get started
                </Button>
              )}
              <Modal
                // changing this would change position of modal when you alternate between Sign In and Create Account
                style={{ height: "462px" }}
                visible={showModal}
                closable={false}
                centered
                onCancel={() => setShowLogin(false)}
                footer={null}
              >
                <AmplifyProvider theme={theme} colorMode="dark">
                  <Authenticator />
                </AmplifyProvider>
              </Modal>
            </span>
          )}
        </span>
      </AntLayout.Header>

      <AntLayout.Content
        style={{
          padding: 24,
          marginTop: headerHeight,
          minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
          overflow: "auto",
        }}
      >
        <Modal
          width={600}
          visible
          title="Acknowledgement"
          bodyStyle={{ height: "200px", padding: "24px", overflowY: "scroll" }}
          // visible={account && !account?.permissions?.read_disclaimer}
          closable={false}
          centered
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={checked}
                onChange={onCheck}
                style={{ textAlign: "left" }}
              >
                I agree to the Terms of Service & Financial Disclaimer.
              </Checkbox>
              <Button
                className={pageStyles.disabled}
                type="primary"
                loading={acknowledgeLoading}
                disabled={!checked}
                onClick={onAcknowledge}
              >
                OK
              </Button>
            </div>
          }
          // footer with checkbox, statement, and grayed out confirm
          // confirm button hits api to update user
          // onCancel={() => setShowLogin(false)}
        >
          <TOS maxLevel={4} />
        </Modal>
        <AccountContext.Provider
          value={{ account, accountLoading, loginLoading, setShowLogin }}
        >
          {children}
        </AccountContext.Provider>
      </AntLayout.Content>
      <AntLayout.Footer
        style={{
          height: footerHeight,
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#1f1f1f",
          alignItems: "center",
        }}
      >
        <span className={overrides.footerLink}>
          _move fast; break everything
        </span>
        <a href="/privacy" className={overrides.footerLink}>
          {/* Change this to NavLink to avoid loading */}
          Privacy
        </a>
      </AntLayout.Footer>
    </AntLayout>
  );
};

export default ({ route, children }: LayoutProps) => (
  <Authenticator.Provider>
    <Layout route={route}>{children}</Layout>
  </Authenticator.Provider>
);
