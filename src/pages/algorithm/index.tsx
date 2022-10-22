import React from "react";
import { useState, useEffect } from "react";
import { Typography, Table, Segmented } from "antd";
import Plot from "react-plotly.js";
import { getApiUrl, getDayDiff, get3DCircle } from "@/utils";
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

// const eyes = [
//   { x: 0.1, y: 0.1, z: 2.15 },
//   { x: 1.25, y: 1.25, z: 1.25 }, // distance from (0, 0, 0) ~ 2.16
//   { x: 1.53, y: 1.53, z: 0.1 },
//   { x: 1.25, y: 1.25, z: -1.25 },
//   { x: 0.1, y: 0.1, z: -2.15 },
// ];
const eyes = get3DCircle(
  [0, 0, 0],
  [1.25, 1.25, 1.25],
  [1.25, 1.25, -1.25],
  60
);
// .map((pt: number[]) => ({ x: pt[0], y: pt[1], z: pt[2] }));

console.log(eyes);

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

const Toggle = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: unset;
    outline: 1px solid
      ${(props: { val: boolean }) => (props.val ? "#52e5ff" : "magenta")};
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-segmented-item:hover,
  .ant-segmented-item:focus {
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-segmented-thumb {
    background-color: ${(props: { val: boolean }) =>
      props.val ? "magenta" : "#52e5ff"};
  }
`;

const AlgorithmPage = () => {
  const [viz2D, setViz2D] = useState();
  const [viz3D, setViz3D] = useState();
  // this should be true
  const [toggle2D, setToggle2D] = useState(false);
  const [metadata, setMetadata] = useState();
  const [metadataLoading, setMetadataLoading] = useState(true);
  const size = 0.4999;
  const [eye, setEye] = useState({ x: 1.25, y: 1.25, z: 1.25 });
  const [eyeIdx, setEyeIdx] = useState(0);
  const [up, setUp] = useState({ x: 0, y: 0, z: 1 });
  const [hover, setHover] = useState(false);
  // const size = 0.3333;
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

  useEffect(() => {
    // use frames and useMemo instead
    // https://codesandbox.io/s/pier-stat-flood-w1ed4?file=/src/Flood.js
    // console.log(eyes[time % eyes.length]);
    // console.log(time % eyes.length);
    // console.log(eye)
    // console.log()
    const interval = setInterval(() => {
      // console.log(eyes[time % eyes.length]);
      // console.log(time % eyes.length);
      // setTime((oldTime) => oldTime + 1);
      const newEyeIdx = (eyeIdx + 1) % eyes.length;
      console.log(newEyeIdx, eyes[newEyeIdx]);
      if (!hover) {
        if (newEyeIdx === 12) {
          setUp({ x: -1, y: -1, z: -1 });
        } else if (newEyeIdx === 30) {
          setUp({ x: 1, y: 1, z: -1 });
        } else if (newEyeIdx === 48) {
          setUp({ x: -1, y: -1, z: 1 });
        }
      }
      // } else if (newEyeIdx % eyes.length === 6) {
      //   setUp({ x: 0, y: 0, z: 1 });
      // }
      setEyeIdx(newEyeIdx);
      if (!hover) {
        setEye(eyes[newEyeIdx]);
      }

      // eyeIdx == 2 or 6, camera flips
      // 15 ms => 60fps
      // 30 ms => 30fps
      // 40 ms => 24fps
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [eye]);

  // TODO:
  // 3. Move Algorithm tab to the right? and remove signed in as User text?
  // beginning camera
  // center
  // :
  // {x: 0, y: 0, z: 0}
  // eye
  // :
  // {x: 1.25, y: 1.25, z: 1.25}
  // up
  // :
  // {x: 0, y: 0, z: 1}
  // consider making camera move in python and exporting as html
  // const plot = (toggleVal) => (
  //   <Plot
  //     // onUpdate={(fig, div) => {
  //     //   console.log(time);
  //     //   console.log("fig", fig) || console.log("div", div);
  //     // }}
  //     data={
  //       toggleVal === "2D"
  //         ? [
  //             {
  //               x: viz2D?.grid[0],
  //               y: viz2D?.grid[1],
  //               z: viz2D?.preds,
  //               type: "contour",
  //               hoverinfo: "none",
  //               contours: {
  //                 coloring: "fill",
  //                 start: 0,
  //                 end: 1,
  //                 size: size,
  //               },
  //               line: { smoothing: 0, width },
  //               colorscale: [
  //                 ["0", "magenta"],
  //                 ["0.4", "magenta"],
  //                 ["0.5", "#8080FF"],
  //                 ["0.6", "cyan"],
  //                 ["1", "cyan"],
  //               ],
  //               // colorbar: {
  //               //   //   title: "Predicted",
  //               //   tickmode: "array",
  //               //   //   // ticktext: ["SELL", "BUY"],
  //               //   //   // tickvals: [0, 1],
  //               //   //   nticks: 10,
  //               //   ticktext: tickText.map(() => ""),
  //               //   tickvals: tickVals,
  //               // },
  //               opacity: 0.2,
  //               showscale: false,
  //               name: "predicted",
  //             },
  //             {
  //               x: viz2D?.grid[0],
  //               y: viz2D?.grid[1],
  //               z: viz2D?.preds,
  //               type: "contour",
  //               hoverinfo: "none",
  //               contours: {
  //                 coloring: "lines",
  //                 start: 0,
  //                 end: 1,
  //                 size: size,
  //               },
  //               line: { smoothing: 0, width },
  //               colorscale: [
  //                 ["0", "magenta"],
  //                 ["1", "cyan"],
  //               ],
  //               // showscale: false,
  //               colorbar: {
  //                 title: "Predicted",
  //                 tickmode: "array",
  //                 ticktext: tickText,
  //                 tickvals: tickVals,
  //               },
  //               name: "predicted",
  //             },
  //             {
  //               x: viz2D?.actual[0]?.BUY,
  //               y: viz2D?.actual[1]?.BUY,
  //               type: "scatter",
  //               mode: "markers",
  //               // change marker outline to white after making bg black/transparent?
  //               marker: { color: "cyan", line: { color: "black", width: 1 } },
  //               showlegend: true,
  //               text: "BUY [actual]",
  //               name: "BUY",
  //             },
  //             {
  //               x: viz2D?.actual[0]?.SELL,
  //               y: viz2D?.actual[1]?.SELL,
  //               type: "scatter",
  //               mode: "markers",
  //               // change marker outline to white after making bg black/transparent?
  //               marker: {
  //                 color: "magenta",
  //                 line: { color: "black", width: 1 },
  //               },
  //               showlegend: true,
  //               text: "SELL [actual]",
  //               name: "SELL",
  //             },
  //           ]
  //         : [
  //             {
  //               x: viz3D?.actual[0]?.BUY,
  //               y: viz3D?.actual[1]?.BUY,
  //               z: viz3D?.actual[2]?.BUY,
  //               type: "scatter3d",
  //               mode: "markers",
  //               // change marker outline to white after making bg black/transparent?
  //               marker: { color: "cyan", line: { color: "black", width: 1 } },
  //               showlegend: true,
  //               text: "BUY [actual]",
  //               name: "BUY",
  //             },
  //             {
  //               x: viz3D?.actual[0]?.SELL,
  //               y: viz3D?.actual[1]?.SELL,
  //               z: viz3D?.actual[2]?.SELL,
  //               type: "scatter3d",
  //               mode: "markers",
  //               // change marker outline to white after making bg black/transparent?
  //               marker: {
  //                 color: "magenta",
  //                 line: { color: "black", width: 1 },
  //               },
  //               showlegend: true,
  //               text: "SELL [actual]",
  //               name: "SELL",
  //             },
  //             {
  //               x: viz3D?.grid[0],
  //               y: viz3D?.grid[1],
  //               z: viz3D?.grid[2],
  //               type: "volume",
  //               opacity: 0.4,
  //               value: viz3D?.preds,
  //               colorscale: [
  //                 ["0", "magenta"],
  //                 ["1", "cyan"],
  //               ],
  //               colorbar: {
  //                 title: "Predicted",
  //                 tickmode: "array",
  //                 ticktext: tickText,
  //                 tickvals: tickVals,
  //               },
  //               hoverinfo: "none",
  //               // change marker outline to white after making bg black/transparent?
  //               // marker: {
  //               //   color: "magenta",
  //               //   line: { color: "black", width: 1 },
  //               // },
  //               // showlegend: true,
  //               // text: "SELL [actual]",
  //               // name: "SELL",
  //             },
  //           ]
  //     }
  //     layout={{
  //       scene: {
  //         camera: {
  //           eye,
  //           //     // center: { x: time, y: time, z: time },
  //           //     eye: eyes[time % eyes.length],
  //           // up: { x: time, y: time, z: time },
  //         },
  //       },
  //       font: {
  //         color: "rgba(255, 255, 255, 0.85)",
  //         // family:
  //         //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
  //         family: "inherit",
  //       },
  //       autosize: true,
  //       // make responsive
  //       // https://codesandbox.io/s/nostalgic-jones-4kuww
  //       // title: "Visualization",
  //       xaxis: { title: "x" },
  //       yaxis: { title: "y" },
  //       zaxis: { title: "z" },
  //       paper_bgcolor: "transparent",
  //       plot_bgcolor: "transparent",
  //       // dragmode: false,
  //       legend: {
  //         y: 0,
  //         x: 0,
  //         title: { text: "Actual" },
  //       },
  //     }}
  //     style={{ width: "100%", height: "100%" }}
  //     useResizeHandler
  //     frames={eyes.map((eye: any) => ({
  //       layout: { scene: { camera: { eye } } },
  //     }))}
  //     // config={{ displayModeBar: false }}
  //   />
  // );

  const plot3D = (
    <Plot
      onHover={() => setHover(true)}
      onUnhover={() => setHover(false)}
      data={[
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
          colorbar: {
            title: "Predicted",
            tickmode: "array",
            ticktext: tickText,
            tickvals: tickVals,
          },
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
        scene: {
          camera: {
            eye,
            up,
            // eye: {
            //   x: -0.6533950783163606,
            //   y: -0.6533950783163606,
            //   z: 1.957970822,
            // },
            //     // center: { x: time, y: time, z: time },
            //     eye: eyes[time % eyes.length],
            // up: { x: 0, y: 0, z: 0 },
            // at eyeIdx === 2, blue string hould be back bottom, and bottom is mostly blue
            // up: { x: -1, y: -1, z: -1 },
          },
        },
        font: {
          color: "rgba(255, 255, 255, 0.85)",
          // family:
          //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
          family: "inherit",
        },
        autosize: true,
        // make responsive
        // https://codesandbox.io/s/nostalgic-jones-4kuww
        // title: "Visualization",
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
      // frames={eyes.map((eye: any) => ({
      //   layout: { scene: { camera: { eye } } },
      // }))}
      // config={{ displayModeBar: false }}
    />
  );

  // const getPlot = (dims: string) => (dims === "2D" ? plot2D : plot3D);
  // const memoizedPlot = (dep: string) => useMemo(() => getPlot(dep), [dep]);
  // const memoizedPlot = useMemo(() => getPlot(toggle2D), [toggle2D]);

  return (
    <>
      {/* consider changing page and nav to /research and title to Algorithm */}
      {/* remove numbers on axis for 3d / camera should spin up and down */}
      {/* consider switching BTC toggle to Segmented on home screen */}
      {/* consider using Statistic component for metadata */}
      {/*  */}
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
          {/* consider square and cube icons https://ant.design/components/segmented/#components-segmented-demo-with-icon */}

          <Toggle
            val={toggle2D}
            options={["2D", "3D"]}
            defaultValue="2D"
            onChange={(val: string) => setToggle2D(val === "2D")}
          />
        </>
      </span>
      <div className={pageStyles.parent} style={{ alignItems: "center" }}>
        <div className={pageStyles.child}>
          {/* <div style={toggle2D ? {} : { display: "none" }}>{plot("2D")}</div>
          <div style={toggle2D ? { display: "none" } : {}}>{plot("3D")}</div> */}
          {plot3D}
        </div>
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
