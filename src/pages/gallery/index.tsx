import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import styles from "./index.less";

const { Title, Text } = Typography;

const GalleryPage = ({ dispatch, gallery, _loading }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Title>Gallery</Title>
    </>
  );
};

GalleryPage.displayName = "Gallery";

export default connect(({ gallery, loading }) => ({
  gallery,
}))(GalleryPage);
