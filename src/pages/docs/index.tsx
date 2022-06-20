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
  notification,
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
  // 2. Make API key uncopyable - combo of user-select: none and pointer-events:none?
  // (Make sure that pointer events doesn't ruin tooltip hint)
  // 3. Intercept response and display message or notification that request succeeded if 200 status code
  // 4. Move Docs tab to the right? and remove signed in as User text

  return (
    <div style={{ height: "100%" }}>
      <Title>API Docs</Title>
      {/* add message when req fails that you need a valid api key */}
      {/* login and fetch account */}
      {/* hide api key component or indicate that you can login to get one */}
      {/* CHOOSE LATTER ^ */}
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
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
                    loggedIn
                      ? account?.api_key
                      : "Log in to receive your API key."
                  }
                  readOnly
                />
              </Tooltip>
              <Button
                onClick={() => copyToClipboard(account?.api_key, "API Key")}
                icon={<CopyOutlined />}
              />
              {/* handle copying to clipboard */}
              {/* show success or info alert for a few sec at top when Copy button is pressed */}
            </span>
          </Input.Group>
        </div>
        <div>
          <Title level={2}>API</Title>
          <SwaggerUI
            spec={swaggerSpec}
            defaultModelsExpandDepth={0}
            requestInterceptor={(req: Request) => {
              console.log(req);
              const { headers } = req;
              if (!("X-API-Key" in headers)) {
                notification.error({
                  duration: 10,
                  message: "Missing API Key",
                  description: (
                    <>
                      <span>{"Paste your API key in the "}</span>
                      <b>
                        <span style={{ color: "#49cc90" }}>Authorize</span>
                      </b>
                      <span>{" modal."}</span>
                    </>
                  ),
                });
              } else if (headers["X-API-Key"] !== account?.api_key) {
                notification.error({
                  duration: 10,
                  message: "Wrong API Key",
                  description: "Copy your API key from the Auth section.",
                });
              }
              req.url = "https://jsonplaceholder.typicode.com/todos/1";
              return req;
            }}
            responseInterceptor={(res: Response) => {
              console.log(res);
              const errors = {
                401: {
                  message: "Unauthorized",
                  description: "Check your API key.",
                },
                402: {
                  message: "Payment Required",
                  description: "You are not a beta subscriber.",
                },
                403: {
                  message: "Forbidden",
                  description: "Your quota has been reached.",
                },
              };
              const { ok, status } = res;
              if (ok) {
                const { data } = JSON.parse(res.text);
                const signal = data[data.length - 1].Signal;
                notification.success({
                  duration: 10,
                  message: "Success",
                  // Modify description to say "New signal: BUY or SELL" lime or red monospace
                  description: "Your request succeeded.",
                });
              } else {
                notification.error({
                  duration: 10,
                  message:
                    status in errors ? errors[status].message : "Failure",
                  description:
                    status in errors
                      ? errors[status].description
                      : "Your request failed. Check the error message.",
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

DocsPage.displayName = "Docs";

export default DocsPage;
