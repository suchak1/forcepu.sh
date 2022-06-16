import React from "react";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
import { getApiUrl, useAccount } from "@/utils";
import swaggerSpec from "../../api/spec/swagger.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import styles from "./index.less";
import styled from "styled-components";

const { Title, Text } = Typography;
swaggerSpec.servers[0].url = getApiUrl();

const APIKey = styled(Input.Password)`
  input {
    pointer-events: none;
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

  //   useEffect(() => {
  //     (async () => {
  //       const url = "https://s3.amazonaws.com/api.forcepu.sh/resume.pdf";
  //       fetch(url, { method: "GET" })
  //         .then((response) => response.json())
  //         .then((data) => setLog(data))
  //         .then(() => setLoading(false));
  //     })();
  //   }, []);

  return (
    // <Layout>
    // <Layout.Content style={{ padding: 24 }}>
    <>
      <Title>Resume</Title>
      {/* add message when req fails that you need a valid api key */}
      {/* login and fetch account */}
      {/* hide api key component or indicate that you can login to get one */}
      <Input.Group>
        <span style={{ display: "flex" }}>
          <APIKey
            style={{ userSelect: "none" }}
            // style={{pointerEvents: 'none'}}
            addonBefore="API Key"
            defaultValue={account?.api_key}
            readOnly
          />
          {/* change input focus color to cyan */}
          {/* <Button */}
          {/* onClick={() => */}
          {/* copyToClipboard(account?.api_key, "API Key") */}
          {/* } */}
          {/* icon={<CopyOutlined />} */}
          {/* /> */}
          {/* handle copying to clipboard */}
          {/* show success or info alert for a few sec at top when Copy button is pressed */}
        </span>
      </Input.Group>
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

// const copyToClipboard = (val: string, name: string) =>
//   navigator.clipboard.writeText(val).then(
//     () => message.success(`Copied ${name} to clipboard.`),
//     () => message.error(`Did not copy ${name} to clipboard`)
//   );

// {/* <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" /> */}
// {/* <SwaggerUI spec={swaggerSpec} /> */}
// {/* use signals_ui.pdf in downloads folder as guide, keep wide screen - better for mobile */}
// {/* remove params wrapper div, remove info div, rename algo to Signals API or Algo API, ,  */}
// {/* requestInterceptor => should inject api key if necessary, responseInterceptor => should reveal cards on left */}
// {/* parameterize api vs api.dev and replace string in json after importing */}
// {/* 2. API swagger docs on separate Page called Docs with NavLink in header */}
