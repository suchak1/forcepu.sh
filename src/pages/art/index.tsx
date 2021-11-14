import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { NFTE } from "@nfte/react";
import HoverVideoPlayer from "react-hover-video-player";

// try use-nft instead

import styles from "./index.less";

const { Title, Text } = Typography;

const nftWidth = 400;
const metadataWidth = nftWidth / 3;
const nftCard = (contract, token) => (
  <NFTE contract={contract} tokenId={token} darkMode={true}>
    {({ data, className, style, darkMode, autoPlay }) => {
      console.log(JSON.stringify(data));
      return (
        <Card
          title={data?.name}
          extra={<a href={data?.mediaPageUrl}>etherscan</a>}
          style={{ width: nftWidth + 48 }}
        >
          {/* <img src={data?.media} width={nftWidth} /> */}
          <HoverVideoPlayer videoSrc={data?.metadata?.animation_url} />
          <div style={{ paddingTop: 18 }}>{data?.description}</div>
          <div
            style={{
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 16,
            }}
          >
            <span style={{ width: metadataWidth }}>owned by</span>
            <span style={{ width: metadataWidth }}>token id</span>
            <span style={{ width: metadataWidth }}>minted on</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ width: metadataWidth }}>
              vape<span style={{ color: "#52e5ff" }}>m.eth</span>
            </span>
            <span style={{ width: metadataWidth }}>{data?.tokenId}</span>
            <span style={{ width: metadataWidth }}>
              {data?.timestamp &&
                new Date(data?.timestamp * 1000).toISOString()}
            </span>
          </div>
          {/* description then next line => owner, minted by, minted on spread out all gray, second line white bold */}
          {/* first line => owned by (gray, lowercase, no colon) */}
          {/* second line => vapem.eth with white and ice coloring semibold? */}
        </Card>
      );
    }}
    {/* use create a better custom card w antd and preview video (autoplay on hover) else display png */}
    {/* react-hover-video-player */}
  </NFTE>
);
// use NFTE
// or opensea / embeddable
const ArtPage = ({ dispatch, art, _loading }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Title>Gallery</Title>
      <Row>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {nftCard(
              "0x86b3448919dcb802c96759f85b532dfe34990e64",
              "49700010004"
            )}
          </div>
        </Col>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            {nftCard("0x3e34556b7d6a6c79320168140e14c10d7a1febb7", "100010492")}
          </div>
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {nftCard(
              "0xc0cf5b82ae2352303b2ea02c3be88e23f2594171",
              "22700084881"
            )}
          </div>
        </Col>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            {nftCard(
              "0x4398b03f65d32505557d8719936d3a190c40df6c",
              "40200010012"
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {nftCard(
              "0xdad9dc2d497fbf0d27837700c0a7ba6b8c8f2b30",
              "49100040011"
            )}
          </div>
        </Col>
        <Col flex={1}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            {nftCard(
              "0xc92ca2b5b8a996ad2a6fdd97c6d7ed038e61c725",
              "14500012231"
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

ArtPage.displayName = "Art";

export default connect(({ art, loading }) => ({
  art,
}))(ArtPage);
