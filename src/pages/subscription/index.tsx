import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { Typography, Segmented, Row, Col, Card, Statistic, Spin } from "antd";
import Plot from "react-plotly.js";
import { getApiUrl, getDayDiff, get3DCircle } from "@/utils";
import pageStyles from "../index.less";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountContext } from "../../layouts";
import "./index.less";

import styled from "styled-components";

const { Title } = Typography;

const numPoints = 360;
const eyes = get3DCircle(
  [0, 0, 0],
  [1.25, 1.25, 1.25],
  [1.25, 1.25, -1.25],
  numPoints
);
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
const spinner = <Spin style={{ width: "100%" }} indicator={antIcon} />;

const SubscriptionPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, accountLoading } = useContext(AccountContext);
  const inBeta = loggedIn && account?.permissions?.in_beta;
  const [viz2D, setViz2D] = useState();
  const [viz3D, setViz3D] = useState();
  const default2DToggle = false;
  const [toggle2D, setToggle2D] = useState(default2DToggle);
  const [metadata, setMetadata] = useState([]);
  // const loading = !(metadata.length && viz2D && viz3D);
  const size = 0.4999;
  const [eyeIdx, setEyeIdx] = useState(0);
  const [up, setUp] = useState({ x: 0, y: 0, z: 1 });
  // const size = 0.3333;
  const width = 3;
  const numTicks = Math.ceil(1 / size);
  const tickText = Array(numTicks).fill("");
  tickText[0] = "SELL";
  tickText[numTicks - 1] = "BUY";
  tickText[Math.floor(numTicks / 2)] = "HODL";
  const tickVals = tickText.map((_, idx) => size * idx);
  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "prod" })}/model`;
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
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "prod" })}/visualization`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setViz2D(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "prod" })}/visualization?dims=3D`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setViz3D(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // use frames and useMemo instead
    // https://codesandbox.io/s/pier-stat-flood-w1ed4?file=/src/Flood.js

    const interval = setInterval(() => {
      const newEyeIdx = (eyeIdx + 1) % eyes.length;
      const multiplier = numPoints / 360;
      const theta = Math.floor(newEyeIdx / multiplier);

      const roundAngle = (angle: number) => {
        // works with numPoints <= 360
        const divisor = Math.floor(360 / numPoints);
        const remainder = angle % divisor;
        return angle + (remainder ? divisor - (angle % divisor) : 0);
      };

      if (theta === roundAngle(55)) {
        setUp({ x: -1, y: -1, z: -1 });
      } else if (theta === roundAngle(180)) {
        setUp({ x: 1, y: 1, z: -1 });
      } else if (theta === 290) {
        setUp({ x: -1, y: -1, z: 1 });
      }

      setEyeIdx(newEyeIdx);

      // 15 ms => 60fps
      // 30 ms => 30fps
      // 40 ms => 24fps
    }, 15);
    return () => {
      clearInterval(interval);
    };
  }, [eyeIdx]);

  return (
    <>
      {/* consider changing page and nav to /research and title to Algorithm */}
      {/* remove numbers on axis for 3d / camera should spin up and down */}
      {/* consider switching BTC toggle to Segmented on home screen */}
      {/* consider using Statistic component for metadata */}
      {/*  */}
      <Title>Premium Access</Title>
      {/* Crystal ball ...er cube */}
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "-12px 0px 12px 0px",
        }}
      >
        <Title level={5} style={{ width: "75%" }}>
          to the algorithm's <span style={{ color: "#52e5ff" }}>BUY</span> and{" "}
          <span style={{ color: "magenta" }}>SELL</span> signals
        </Title>
        {/* the crystal ball ...er cube behind our signals */}
        {/* consider square and cube icons https://ant.design/components/segmented/#components-segmented-demo-with-icon */}
      </span>
      <div
        className={pageStyles.parent}
        style={{ alignItems: "center", minHeight: "450px" }}
      >
        <div className={pageStyles.child}>
          {/* test if preview endpoint is done loading (for return estimate) */}
          {!(viz2D && viz3D) ? spinner : <>{"DatumInfo"}</>}
        </div>
        {/* test if signed in | if not, then don't render,
        if signed in, then test if in beta | if so, show beta view, 
        else test if active subscription | if so, show plan/sub amount, payment method, and option to cancel / manage - should have to open modal and click button or type in phrase to cancel
        else show stripe subscription page*/}
        {metadata.length ? (
          <div className={pageStyles.child}>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ textAlign: "justify" }}>
                The points on the plot represent historical market data reduced
                from {metadata[2]?.stat} dimensions to {toggle2D ? "2D" : "3D"}.
                The filled regions represent the model's predictions. Based on
                which region today's data point occupies, we may be able to
                predict whether now is a good time to{" "}
                <b>
                  <span style={{ color: "#52e5ff" }}>BUY</span>
                </b>{" "}
                or{" "}
                <b>
                  <span style={{ color: "magenta" }}>SELL</span>
                </b>
                .
              </Col>
              {metadata?.map((datum) => (
                <Col span={12}>
                  <Card>
                    <Statistic title={datum.metadata} value={datum.stat} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : null}
      </div>
    </>
  );
};

SubscriptionPage.displayName = "Subscription";

export default SubscriptionPage;