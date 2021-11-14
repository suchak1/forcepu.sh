import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import styles from "./index.less";

const { Title, Text } = Typography;
// use NFTE
// or opensea / embeddable
const ArtPage = ({ dispatch, art, _loading }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Title>Gallery</Title>
      <nft-card
        tokenAddress="0x5caebd3b32e210e85ce3e9d51638b9c445481567"
        tokenId="2242579050293992223"
        network="mainnet"
      ></nft-card>
    </>
  );
};

ArtPage.displayName = "Art";

export default connect(({ art, loading }) => ({
  art,
}))(ArtPage);
