import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import { useWindowWidth, useWindowHeight } from "@wojtekmaj/react-hooks";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import styles from "./index.less";

const { Title, Text } = Typography;

const DocsPage = ({ dispatch, docs, _loading }) => {
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

export default connect(({ docs, loading }) => ({
  docs,
  // loading: loading.models.docs,
}))(DocsPage);
