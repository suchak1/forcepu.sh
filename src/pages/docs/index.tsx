import React from "react";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
import { getApiUrl } from "@/utils";
import swaggerSpec from "../api/spec/swagger.json";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import styles from "./index.less";
import styled from "styled-components";

const { Title, Text } = Typography;
swaggerSpec.servers[0].url = getApiUrl();

const DocsPage = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const width = useWindowWidth();
  const height = useWindowHeight();

  // const docsService = new GymService();

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
      <Document file="https://s3.amazonaws.com/api.forcepu.sh/resume.pdf">
        <Page size="letter" pageNumber={1} width={width * 0.6} />
      </Document>
    </>
    // </Layout.Content>
    // </Layout>
  );
};

DocsPage.displayName = "Docs";

export default DocsPage;
