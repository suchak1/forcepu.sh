import React from "react";
import { useState, useEffect } from "react";
import { Typography, Table, Segmented } from "antd";
import Plot from "react-plotly.js";
import { getApiUrl, getDayDiff } from "@/utils";
import { AccountContext } from "../../layouts";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { CopyOutlined } from "@ant-design/icons";
import "swagger-ui-react/swagger-ui.css";
import pageStyles from "../index.less";
import "./index.less";
import styled from "styled-components";

const { Title } = Typography;
// outline: 1px solid ${val ? "#52e5ff" : "magenta"};
// background-color: ${val ? "#52e5ff" : "magenta"};

const Toggle = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: unset;
    outline: 1px solid ${(props) => (props.val ? "#52e5ff" : "magenta")};
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-segmented {
    color: rgba(255, 255, 255, 0.65);
  }

  .ant-segmented-item:hover,
  .ant-segmented-item:focus {
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-segmented-thumb {
    background-color: ${(props) => (props.val ? "magenta" : "#52e5ff")};
  }
`;

const AlgorithmPage = () => {
  const [viz2D, setViz2D] = useState();
  const [viz3D, setViz3D] = useState();
  const [toggle2D, setToggle2D] = useState(true);
  const [metadata, setMetadata] = useState();
  const [metadataLoading, setMetadataLoading] = useState(true);
  const size = 0.4999;
  const width = 3;
  const numTicks = Math.ceil(1 / size);
  const tickText = Array(numTicks).fill("");
  tickText[0] = "SELL";
  tickText[numTicks - 1] = "BUY";
  tickText[Math.floor(numTicks / 2)] = "HODL";
  const tickVals = tickText.map((_, idx) => size * idx);
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

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "dev" })}/visualization?dims=3D`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setViz3D(data))
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

  const plot2D = (
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
        // use v2 and bring opacity up a bit
        {
          x: viz2D?.grid[0],
          y: viz2D?.grid[1],
          z: viz2D?.preds,
          type: "contour",
          hoverinfo: "none",
          contours: {
            coloring: "fill",
            start: 0,
            end: 1,
            size: size,
          },
          line: { smoothing: 0, width },
          colorscale: [
            ["0", "magenta"],
            ["1", "cyan"],
          ],
          opacity: 0.2,
          showscale: false,
          name: "predicted",
        },
        {
          x: viz2D?.grid[0],
          y: viz2D?.grid[1],
          z: viz2D?.preds,
          type: "contour",
          hoverinfo: "none",
          contours: {
            coloring: "lines",
            start: 0,
            end: 1,
            size: size,
          },
          line: { smoothing: 0, width },
          colorscale: [
            ["0", "magenta"],
            ["1", "cyan"],
          ],
          colorbar: {
            title: "Predicted",
            tickmode: "array",
            ticktext: tickText,
            tickvals: tickVals,
          },
          name: "predicted",
        },
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
          marker: {
            color: "magenta",
            line: { color: "black", width: 1 },
          },
          showlegend: true,
          text: "SELL [actual]",
          name: "SELL",
        },
      ]}
      layout={{
        font: {
          color: "rgba(255, 255, 255, 0.85)",
          // family:
          //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
          family: "inherit",
        },
        autosize: true,
        // make responsive
        // https://codesandbox.io/s/nostalgic-jones-4kuww
        title: "Visualization",
        xaxis: { title: "x" },
        yaxis: { title: "y" },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        dragmode: false,
        legend: {
          y: 0,
          x: 0,
          title: { text: "Actual" },
        },
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      config={{ displayModeBar: false }}
    />
  );

  const plot3D = (
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
        // use v2 and bring opacity up a bit
        // {
        //   x: viz2D?.grid[0],
        //   y: viz2D?.grid[1],
        //   z: viz2D?.preds,
        //   type: "contour",
        //   hoverinfo: "none",
        //   contours: {
        //     coloring: "fill",
        //     start: 0,
        //     end: 1,
        //     size: size,
        //   },
        //   line: { smoothing: 0, width },
        //   colorscale: [
        //     ["0", "magenta"],
        //     ["1", "cyan"],
        //   ],
        //   opacity: 0.2,
        //   showscale: false,
        //   name: "predicted",
        // },
        // {
        //   x: viz2D?.grid[0],
        //   y: viz2D?.grid[1],
        //   z: viz2D?.preds,
        //   type: "contour",
        //   hoverinfo: "none",
        //   contours: {
        //     coloring: "lines",
        //     start: 0,
        //     end: 1,
        //     size: size,
        //   },
        //   line: { smoothing: 0, width },
        //   colorscale: [
        //     ["0", "magenta"],
        //     ["1", "cyan"],
        //   ],
        //   colorbar: {
        //     title: "Predicted",
        //     tickmode: "array",
        //     ticktext: tickText,
        //     tickvals: tickVals,
        //   },
        //   name: "predicted",
        // },
        {
          x: viz3D?.actual[0]?.BUY,
          y: viz3D?.actual[1]?.BUY,
          z: viz3D?.actual[2]?.BUY,
          type: "scatter3d",
          mode: "markers",
          // change marker outline to white after making bg black/transparent?
          marker: { color: "cyan", line: { color: "black", width: 1 } },
          showlegend: true,
          text: "BUY [actual]",
          name: "BUY",
        },
        {
          x: viz3D?.actual[0]?.SELL,
          y: viz3D?.actual[1]?.SELL,
          z: viz3D?.actual[2]?.SELL,
          type: "scatter3d",
          mode: "markers",
          // change marker outline to white after making bg black/transparent?
          marker: {
            color: "magenta",
            line: { color: "black", width: 1 },
          },
          showlegend: true,
          text: "SELL [actual]",
          name: "SELL",
        },
        {
          x: viz3D?.grid[0],
          y: viz3D?.grid[1],
          z: viz3D?.grid[2],
          type: "volume",
          opacity: 0.4,
          value: viz3D?.preds,
          colorscale: [
            ["0", "magenta"],
            ["1", "cyan"],
          ],
          hoverinfo: "none",
          // change marker outline to white after making bg black/transparent?
          // marker: {
          //   color: "magenta",
          //   line: { color: "black", width: 1 },
          // },
          // showlegend: true,
          // text: "SELL [actual]",
          // name: "SELL",
        },
      ]}
      layout={{
        font: {
          color: "rgba(255, 255, 255, 0.85)",
          // family:
          //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
          family: "inherit",
        },
        autosize: true,
        // make responsive
        // https://codesandbox.io/s/nostalgic-jones-4kuww
        title: "Visualization",
        xaxis: { title: "x" },
        yaxis: { title: "y" },
        zaxis: { title: "z" },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        // dragmode: false,
        legend: {
          y: 0,
          x: 0,
          title: { text: "Actual" },
        },
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      // config={{ displayModeBar: false }}
    />
  );
  return (
    <>
      {/* consider changing page and nav to /research and title to Algorithm */}
      {/* DISPLAY model stats here and call api.forcepu.sh/model */}
      {/* sanitize model info (remove features) in API */}
      {/* use Segmented component for 2D vs 3D */}
      {/* consider switching BTC toggle to Segmented on home screen */}
      {/* consider using Statistic component for metadata */}
      <Title>AI / ML Model</Title>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "-12px 0px 12px 0px",
        }}
      >
        <>
          <Title level={5}>the driving force behind our signals</Title>
          <Toggle
            val={toggle2D}
            options={["2D", "3D"]}
            defaultValue="2D"
            onChange={(val) => setToggle2D(val === "2D")}
          />
        </>
      </span>
      <div className={pageStyles.parent} style={{ alignItems: "center" }}>
        <div className={pageStyles.child}>{plot3D}</div>
        <div className={pageStyles.child}>
          <Table
            dataSource={metadata}
            columns={columns}
            // title={() => "Metadata"}
            pagination={false}
            loading={metadataLoading}
          />
        </div>
      </div>
    </>
  );
};

AlgorithmPage.displayName = "Algorithm";

export default AlgorithmPage;
