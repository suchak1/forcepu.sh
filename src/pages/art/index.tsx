import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import styles from "./index.less";

const { Title, Text } = Typography;

const ArtPage = ({ dispatch, art, _loading }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Title>Gallery</Title>
    </>
  );
};

ArtPage.displayName = "Art";

export default connect(({ art, loading }) => ({
  art,
}))(ArtPage);
