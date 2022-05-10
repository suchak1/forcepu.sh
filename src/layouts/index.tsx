import React, { useState, useEffect, createContext, cloneElement } from "react";
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

let config;
const isLocal = process.env.NODE_ENV === "development";
const prodHostname = "forcepu.sh";
const devHostname = "dev.forcepu.sh";
const isDev = window.location.hostname === devHostname;
const redirectUrl = isDev
  ? `https://${devHostname}`
  : `https://${prodHostname}`;

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
  // "docs",
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

const Layout = ({ route, children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const LoginContext = createContext({ showLogin, setShowLogin });
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const defaultAnimation = {
    appear: {
      animation: "wave-in",
      duration: 4000,
    },
  };
  const [animation, setAnimation] = useState(defaultAnimation);
  const loggedIn = user;
  useEffect(() => {
    if (loggedIn) {
      const { idToken } = user.signInUserSession;
      const url = `${getApiUrl()}/protected`;
      fetch(url, {
        method: "GET",
        headers: { Authorization: idToken.jwtToken },
      }).then((response) => response.json());
      // .then((data) => console.log(data));
    }
  }, [user]);
  const showModal = !loggedIn && showLogin;
  const dummy = <Authenticator className={overrides.invisible} />;
  const getAccountText = (user: string | undefined) => `signed in as ${user}`;
  const account = getAccountText(
    user?.attributes?.name || user?.attributes?.email
  );

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
              label: (
                <NavLink
                  onClick={() => setAnimation(defaultAnimation)}
                  to={route.to}
                >
                  {route.text}
                </NavLink>
              ),
            }))}
          ></Menu>
          {dummy}
          <span
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {loggedIn && <span className={overrides.account}>{account}</span>}
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
        {/* <LoginContext.Provider value={{ showLogin, setShowLogin }}> */}
        {/* {children} */}
        {cloneElement(children, {
          setShowLogin,
          user,
          animationOpts: { animation, setAnimation, defaultAnimation },
        })}
        {/* </LoginContext.Provider> */}
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
          Privacy
        </a>
      </AntLayout.Footer>
    </AntLayout>
  );
};

// export { LoginContext };

export default ({ route, children }) => (
  <Authenticator.Provider>
    <Layout route={route}>{children}</Layout>
  </Authenticator.Provider>
);
