import React from "react";
import { useState, useEffect } from "react";
import { Typography, Table, Input } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { getApiUrl } from "@/utils";
const { Title, Text } = Typography;

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    fixed: "left",
  },
  {
    title: "Id",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Weight",
    dataIndex: "Weight",
    key: "Weight",
  },
  {
    title: "Reps",
    dataIndex: "Reps",
    key: "Reps",
  },
  {
    title: "Exercise",
    dataIndex: "Exercise",
    key: "Exercise",
  },
  {
    title: "Volume",
    dataIndex: "Volume",
    key: "Volume",
  },
  {
    title: "1RM",
    dataIndex: "1RM",
    key: "1RM",
  },
];

const TiersPage = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // const url = `${getApiUrl({ localOverride: "prod" })}/exercise_log`;
      // fetch(url, { method: "GET" })
      //   .then((response) => response.json())
      //   .then((data) => setLog(data))
      //   .then(() => setLoading(false));
      fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.5",
          "apollographql-client-name": "slippi-web",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "sec-gpc": "1",
          Referer: "https://slippi.gg/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body:
          '{"operationName":"AccountManagementPageQuery","variables":{"cc":"STONE#0","uid":"STONE#0"},"query":"fragment userProfilePage on User {\\n  fbUid\\n  displayName\\n  connectCode {\\n    code\\n    __typename\\n  }\\n  status\\n  activeSubscription {\\n    level\\n    hasGiftSub\\n    __typename\\n  }\\n  rankedNetplayProfile {\\n    id\\n    ratingOrdinal\\n    ratingUpdateCount\\n    wins\\n    losses\\n    dailyGlobalPlacement\\n    dailyRegionalPlacement\\n    continent\\n    characters {\\n      id\\n      character\\n      gameCount\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery AccountManagementPageQuery($cc: String!, $uid: String!) {\\n  getUser(fbUid: $uid) {\\n    ...userProfilePage\\n    __typename\\n  }\\n  getConnectCode(code: $cc) {\\n    user {\\n      ...userProfilePage\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    })();
  }, []);

  return (
    <>
      <Title>Tier List (The North)</Title>
      {/* 7 tiers
      bronze, silver, gold, plat, diamond, grand/master
      F,      D,      C,    B,    A,       S,
      0,      1055,   1436, 1752, 2004,    2192
      drk grn lte grn yllw  yl-or orange   red 
      green <----------------------------> red
       */}
      <Input.Search
        size="large"
        prefix={<SearchOutlined />}
        allowClear
        enterButton="Search"
        style={{ marginBottom: 16 }}
      />
      <Text>{log.length} results</Text>
      <Table
        loading={
          loading && {
            indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
          }
        }
        columns={columns}
        dataSource={log}
        pagination={{ position: ["topRight", "bottomRight"] }}
        // sticky
      />
    </>
  );
};

TiersPage.displayName = "Tiers";

export default TiersPage;
