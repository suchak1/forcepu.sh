import React from "react";
import { useState, useEffect } from "react";
import {
  Typography,
  Table,
  message,
  Button,
  Tooltip,
  notification,
} from "antd";
import Plot from "react-plotly.js";
import { getApiUrl, transpose, getDayDiff } from "@/utils";
import { AccountContext } from "../../layouts";
import swaggerSpec from "../../api/spec/swagger.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { CopyOutlined } from "@ant-design/icons";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import layoutStyles from "../../layouts/index.less";
import "./index.less";
import styled from "styled-components";

const { Title } = Typography;
swaggerSpec.servers[0].url = getApiUrl();

const AlgorithmPage = () => {
  const [viz2D, setViz2D] = useState();
  //   {
  //   actual: [[]],
  // }
  const [metadata, setMetadata] = useState();
  const [metadataLoading, setMetadataLoading] = useState(true);

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "dev" })}/model`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const {
          created,
          start,
          end,
          num_features: numFeatures,
          accuracy,
        } = data;
        const lastUpdated = `${Math.floor(
          getDayDiff(created, new Date()) / 30
        )} months ago`;
        const dataRange = `${Math.floor(getDayDiff(start, end) / 365)} years`;
        const labels = [
          "Last Updated",
          "Training Data Range",
          "Number of Features",
          "Test Accuracy",
        ];
        const values = [
          lastUpdated,
          dataRange,
          numFeatures,
          `${Math.round(accuracy * 1000) / 10}%`,
        ];
        const newData = labels.map((label, idx) => ({
          key: idx,
          metadata: label,
          stat: values[idx],
        }));
        return newData;
      })
      .then((data) => setMetadata(data))
      .catch((err) => console.error(err))
      .finally(() => setMetadataLoading(false));
  }, []);

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "dev" })}/visualization`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setViz2D(data))
      .catch((err) => console.error(err));
    // .finally(() => setMetadataLoading(false));
  }, []);

  const stats = [
    {
      key: 0,
      metadata: "Total Return [%]",
      // HODL: 0.0,
      stat: 70.97,
    },
    {
      key: 1,
      metadata: "Max Drawdown [%]",
      // HODL: 0.0,
      stat: 25.77,
    },
    {
      key: 2,
      metadata: "Win Rate [%]",
      // HODL: null,
      stat: 50.0,
    },
    {
      key: 3,
      metadata: "Profit Factor",
      // HODL: null,
      stat: 2.18,
    },
    {
      key: 4,
      metadata: "Total Fees Paid",
      // HODL: 0.0,
      stat: 0.04,
    },
    {
      key: 5,
      metadata: "Profitable Time [%]",
      // HODL: 9.39,
      stat: 90.61,
    },
  ];

  const columns = [
    { title: "Metadata", dataIndex: "metadata", key: "metadata" },
    // {
    //   title: <span style={{ color: "#DF00DF" }}>{HODL}</span>,
    //   dataIndex: HODL,
    //   key: HODL,
    // },
    {
      title: <i style={{ color: "#52e5ff" }}>{"Stat"}</i>,
      dataIndex: "stat",
      key: "stat",
    },
  ];

  // const columns = [
  //   { title: "Metadata", dataIndex: "metadata", key: "metadata" },
  //   {
  //     title: <span style={{ color: "#DF00DF" }}>{HODL}</span>,
  //     dataIndex: HODL,
  //     key: HODL,
  //   },
  //   {
  //     title: <i style={{ color: "#52e5ff" }}>{hyperdrive}</i>,
  //     dataIndex: hyperdrive,
  //     key: hyperdrive,
  //   },
  // ];

  // TODO:
  // 3. Move Algorithm tab to the right? and remove signed in as User text?

  return (
    <>
      {/* consider changing page and nav to /research and title to Algorithm */}
      {/* DISPLAY model stats here and call api.forcepu.sh/model */}
      {/* sanitize model info (remove features) in API */}
      <Title>AI / ML Model</Title>
      <Table
        dataSource={metadata}
        columns={columns}
        title={() => "Metadata"}
        pagination={false}
        loading={metadataLoading}
      />
      <Plot
        data={[
          // {
          //   x: [5, 5],
          //   y: [0, 5],
          //   z: [0, 0],
          //   type: "scatter3d",
          //   mode: "markers",
          //   marker: { color: "cyan" },
          // },
          // {
          //   x: [0, 0],
          //   y: [0, 5],
          //   z: [5, 5],
          //   type: "scatter3d",
          //   mode: "markers",
          //   marker: { color: "magenta" },
          // },
          // {
          //   // x: [2.5, 2.5, 2.5, 2.5, 0.0, 5.0],
          //   // y: [0.0, 2.5, 5.0, 2.5, 2.5, 2.5],
          //   // z: [2.5, 0.0, 2.5, 5.0, 2.5, 2.5],
          //   value: [0, 0, 0, 0, 1, 1],
          //   type: "volume",
          //   mode: "markers",
          //   colorscale: [
          //     ["0", "magenta"],
          //     ["1", "cyan"],
          //   ],
          //   x: [0.0, 2.5, 2.5, 2.5, 2.5, 5.0],
          //   y: [2.5, 0.0, 2.5, 2.5, 5.0, 2.5],
          //   z: [2.5, 2.5, 0.0, 5.0, 2.5, 2.5],
          //   // colorscale: "cool",
          //   // colorscale: ["magenta", "cyan"],
          // },

          // 2D

          // 2 contours and 2 scatters
          {
            x: viz2D?.actual[0]?.BUY,
            y: viz2D?.actual[1]?.BUY,
            type: "scatter",
            mode: "markers",
            // change marker outline to white after making bg black/transparent?
            marker: { color: "cyan", line: { color: "black", width: 1 } },
            showlegend: true,
            text: "BUY [actual]",
            name: "BUY",
          },
          {
            x: viz2D?.actual[0]?.SELL,
            y: viz2D?.actual[1]?.SELL,
            type: "scatter",
            mode: "markers",
            // change marker outline to white after making bg black/transparent?
            marker: { color: "magenta", line: { color: "black", width: 1 } },
            showlegend: true,
            text: "SELL [actual]",
            name: "SELL",
          },
        ]}
        layout={{ width: "100%", height: "100%", title: "Visualization" }}
      />
    </>
  );
};

AlgorithmPage.displayName = "Algorithm";

export default AlgorithmPage;
