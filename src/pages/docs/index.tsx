import React from "react";
import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Input,
  message,
  Button,
  Tooltip,
  Popover,
} from "antd";
import { getApiUrl, useAccount } from "@/utils";
import swaggerSpec from "../../api/spec/swagger.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { CopyOutlined } from "@ant-design/icons";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./index.less";
import styled from "styled-components";

const { Title, Text } = Typography;
swaggerSpec.servers[0].url = getApiUrl();

//  input {
//    pointer-events: none;
//  }
const APIKey = styled(Input.Password)`
  input {
    font-family: monospace;
    user-select: none;
    -webkit-user-select: none;
  }

  .ant-input-affix-wrapper:hover,
  .ant-input-affix-wrapper:active {
    border-color: #52e5ff;
    box-shadow: 0 0 5px #52e5ff;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: #52e5ff;
  }
`;

const DocsPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const [accountLoading, setAccountLoading] = useState(false);
  const [account, setAccount] = useState();
  const inBeta = loggedIn && account?.permissions?.in_beta;

  useEffect(useAccount(loggedIn, setAccount, setAccountLoading), [loggedIn]);

  const copyToClipboard = (val: string, name: string) =>
    navigator.clipboard.writeText(val).then(
      () => message.success(`Copied ${name} to clipboard.`),
      () => message.error(`Did not copy ${name} to clipboard`)
    );

  // TODO:
  // 1. remove account debugging line
  // 2. Add helpful message to /signals API for invalid api key (missing from db)
  // 3. Make API key uncopyable - combo of user-select: none and pointer-events:none?
  // (Make sure that pointer events doesn't ruin tooltip hint)
  // 4. Intercept request send and display message or notification about wrong api key if api key exists
  // 5. Intercept response and display message or notification that request succeeded if 200 status code
  // 6. Find a way to collapse Schema at mount

  return (
    // <Layout>
    // <Layout.Content style={{ padding: 24 }}>
    <>
      <Title>API Docs</Title>
      {/* add message when req fails that you need a valid api key */}
      {/* login and fetch account */}
      {/* hide api key component or indicate that you can login to get one */}
      {/* CHOOSE LATTER ^ */}
      <Title level={2}>Auth</Title>
      <div style={{ paddingBottom: "22px", marginTop: "-4px" }}>
        <div>{"Use this key to authenticate your API requests."}</div>
        <div>
          <span>{"Header: "}</span>
          <span style={{ fontFamily: "monospace" }}>{"X-API-Key"}</span>
        </div>
      </div>
      <Input.Group style={{ paddingBottom: "26px" }}>
        <span style={{ display: "flex" }}>
          {/* use tooltip and/or message above explaining that this is needed to access endpoint */}
          {/* and header is X-API-Key */}
          <Tooltip
            title="Use the button on the right to copy."
            placement="bottom"
          >
            <APIKey
              // style={{
              //   userSelect: "none",
              //   "-webkit-user-select": "none",
              //   "user-select": "none",
              // }}
              style={{ userSelect: "none" }}
              addonBefore="API Key"
              defaultValue={
                loggedIn ? account?.api_key : "Log in to receive your API key."
              }
              readOnly
              // this isn't working?
              // onClick={() => copyToClipboard(account?.api_key, "API Key")}
            />
          </Tooltip>
          {/* change input focus color to cyan */}
          <Button
            onClick={() => copyToClipboard(account?.api_key, "API Key")}
            icon={<CopyOutlined />}
          />
          {/* handle copying to clipboard */}
          {/* show success or info alert for a few sec at top when Copy button is pressed */}
        </span>
      </Input.Group>
      <Title level={2}>API</Title>

      <SwaggerUI
        spec={swaggerSpec}
        // docExpansion="full"
      />
    </>
    // </Layout.Content>
    // </Layout>
  );
};

DocsPage.displayName = "Docs";

export default DocsPage;

// const StyledSwagger = styled(SwaggerUI)``;
// .swagger-ui .opblock-description-wrapper {
//   display: none;
// }

// .swagger-ui .opblock.opblock-get .opblock-summary-method {
//   background: #52e5ff;
// }

// {/* <SwaggerUI spec={swaggerSpec} /> */}
// {/* use signals_ui.pdf in downloads folder as guide, keep wide screen - better for mobile */}
// {/* remove params wrapper div, remove info div, rename algo to Signals API or Algo API, ,  */}
// {/* requestInterceptor => should inject api key if necessary, responseInterceptor => should reveal cards on left */}
// {/* 2. API swagger docs on separate Page called Docs with NavLink in header */}
