import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { NFTE } from "@nfte/react";
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
          <img src={data?.media} width={nftWidth} />
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
            {/* </Col>
            <Col flex={1}> */}
            <span style={{ width: metadataWidth }}>token id</span>
            {/* </Col>
            <Col flex={1}> */}
            <span style={{ width: metadataWidth }}>minted on</span>
            {/* </Col>
          </Row> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* <Row>
            <Col flex={1}> */}
            <span style={{ width: metadataWidth }}>
              vape<span style={{ color: "#52e5ff" }}>m.eth</span>
            </span>{" "}
            {/* </Col>
            <Col flex={1}> */}
            <span style={{ width: metadataWidth }}>{data?.tokenId}</span>
            {/* </Col>
            <Col flex={1}> */}
            <span style={{ width: metadataWidth }}>
              {data?.timestamp &&
                new Date(data?.timestamp * 1000).toISOString()}
            </span>{" "}
            {/* </Col>
          </Row> */}
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
          {nftCard("0x86b3448919dcb802c96759f85b532dfe34990e64", "49700010004")}
        </Col>
        <Col flex={1}>
          {nftCard("0x3e34556b7d6a6c79320168140e14c10d7a1febb7", "100010492")}
        </Col>
      </Row>
      {/* <Row gutter={[16, 16]}>
        <Col>
          <NFTE
            contract="0xc0cf5b82ae2352303b2ea02c3be88e23f2594171"
            tokenId="22700084881"
            darkMode={true}
          />
        </Col>
        <Col>
          <NFTE
            contract="0x4398b03f65d32505557d8719936d3a190c40df6c"
            tokenId="40200010012"
            darkMode={true}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col>
          <NFTE
            contract="0xdad9dc2d497fbf0d27837700c0a7ba6b8c8f2b30"
            tokenId="49100040011"
            darkMode={true}
          />
        </Col>
        <Col>
          <NFTE
            contract="0xc92ca2b5b8a996ad2a6fdd97c6d7ed038e61c725"
            tokenId="14500012231"
            darkMode={true}
          />
        </Col>
      </Row> */}
    </>
  );
};

ArtPage.displayName = "Art";

export default connect(({ art, loading }) => ({
  art,
}))(ArtPage);
