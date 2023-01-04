import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { Typography, Segmented, Row, Col, Card, Button, Spin } from "antd";
import Plot from "react-plotly.js";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   AddressElement,
// } from "@stripe/react-stripe-js";
import { getApiUrl, getDayDiff, get3DCircle, linspace } from "@/utils";
import pageStyles from "@/pages/home/index.module.less";
import layoutStyles from "@/layouts/index.module.less";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountContext } from "../../layouts";
import CUBE from "../../../assets/cube.gif";

import overrides from "./index.module.less";

import styled from "styled-components";

const { Title } = Typography;

const xs = [];
const ys = [];
const zs = [];
const base = linspace(-2, 2, 100);
base.forEach((x, i) => {
  base.forEach((y, j) => {
    const z = ((7 * x * y) / Math.E) ^ (x ** 2 + y ** 2);
    xs.push(x);
    ys.push(y);
    zs.push(z);
  });
});
// const xs = linspace(-2, 2, 10);
// const ys = xs;
// const zs = xs.map((x, i) => ((7 * x * ys[i]) / Math.E) ^ (x ** 2 + ys[i] ** 2));
const numPoints = 360;
const eyes = get3DCircle(
  [0, 0, 0],
  [1.25, 1.25, 1.25],
  [1.25, 1.25, -1.25],
  numPoints
);
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
const spinner = <Spin style={{ width: "100%" }} indicator={antIcon} />;
// const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
// youtube
// const stripePromise = loadStripe("pk_test_vAZ3gh1LcuM7fW4rKNvqafgB00DR9RKOjN");
const SubscriptionPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, accountLoading } = useContext(AccountContext);
  const inBeta = loggedIn && account?.permissions?.in_beta;
  const [minInvestment, setMinInvestment] = useState();
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
  console.log(loggedIn);
  const paymentOptions = {
    defaultValues: {
      billingDetails: {
        email: loggedIn?.attributes?.email,
      },
    },
  };
  const addressOptions = {
    mode: "billing",
    fields: {
      phone: "always",
    },
    validation: {
      phone: {
        required: "always",
      },
    },
    defaultValues: {
      name: loggedIn?.attributes?.name,
      email: loggedIn?.attributes?.email,
      //     phone: "411",
      //     address: {
      //       line1: "1 Wayward Ave",
      //       line2: "Apt 1",
      //       city: "Futuria",
      //       state: "FL",
      //       country: "USA",
      //       postal_code: "01101",
      //     },
    },
  };
  const options = {
    // https://stripe.com/docs/elements/appearance-api?platform=web#theme
    // https://stripe.com/docs/elements/appearance-api#theme
    appearance: { theme: "night" },
    // passing the client secret obtained from the server
    // clientSecret: "{{CLIENT_SECRET}}",
    // youtube
    clientSecret:
      "pi_1ISrCzCZ6qsJgndJwlPxeAzG_secret_eZ2nKJLTfQZB0pAnLNqtm1Ns6",
  };
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
    const url = `${getApiUrl({ localOverride: "prod" })}/preview`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const previewBTC = data.BTC.data;
        const previewUSD = data.USD.data;
        let lastUSD = previewUSD.slice(previewUSD.length - 2);
        lastUSD = lastUSD[0].Name === "HODL" ? lastUSD[0] : lastUSD[1];
        const btcPrice = lastUSD.Bal;
        console.log(btcPrice);
        let first = previewBTC.slice(0, 2);
        first = first[0].Name === "hyperdrive" ? first[0] : first[1];
        const start = first.Time;
        let last = previewBTC.slice(previewBTC.length - 2);
        last = last[0].Name === "hyperdrive" ? last[0] : last[1];
        const end = last.Time;
        const days = getDayDiff(start, end);
        const totalBTCRate = last.Bal - 1;
        const monthlyBTCRate = (totalBTCRate / days) * 30;
        // this should be tied to val in backend / maybe make endpoint that returns backend constant
        const monthlySubUSD = 5;
        const monthlySubBTC = monthlySubUSD / btcPrice;
        // principal * monthly rate >= monthlysubrate
        const minBTCInvestment = (monthlySubBTC / monthlyBTCRate).toPrecision(
          2
        );
        console.log(minBTCInvestment);
        setMinInvestment(minBTCInvestment);
      })
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   // use frames and useMemo instead
  //   // https://codesandbox.io/s/pier-stat-flood-w1ed4?file=/src/Flood.js

  //   const interval = setInterval(() => {
  //     const newEyeIdx = (eyeIdx + 1) % eyes.length;
  //     const multiplier = numPoints / 360;
  //     const theta = Math.floor(newEyeIdx / multiplier);

  //     const roundAngle = (angle: number) => {
  //       // works with numPoints <= 360
  //       const divisor = Math.floor(360 / numPoints);
  //       const remainder = angle % divisor;
  //       return angle + (remainder ? divisor - (angle % divisor) : 0);
  //     };

  //     if (theta === roundAngle(55)) {
  //       // setUp({ x: -1, y: -1, z: -1 });
  //     } else if (theta === roundAngle(180)) {
  //       // setUp({ x: 1, y: 1, z: -1 });
  //     } else if (theta === 290) {
  //       // setUp({ x: -1, y: -1, z: 1 });
  //     }

  //     setEyeIdx(newEyeIdx);

  //     // 15 ms => 60fps
  //     // 30 ms => 30fps
  //     // 40 ms => 24fps
  //   }, 15);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [eyeIdx]);
  // const plot3D = useMemo(
  //   () => (
  //     <Plot
  //       data={[
  //         {
  //           x: xs,
  //           y: ys,
  //           z: zs,
  //           type: "scatter3d",
  //           mode: "markers",
  //           // change marker outline to white after making bg black/transparent?
  //           marker: { color: "cyan", line: { color: "black", width: 1 } },
  //           hoverinfo: "skip",
  //           // showlegend: true,
  //           // text: "BUY [actual]",
  //           // name: "BUY",
  //         },
  //         // 8 points of cube
  //         // (-1, )
  //         // {
  //         //   x: xs,
  //         //   y: ys,
  //         //   z: zs,
  //         //   type: "volume",
  //         //   opacity: 0.4,
  //         //   // value: viz3D?.preds,
  //         //   colorscale: [
  //         //     ["0", "magenta"],
  //         //     ["1", "cyan"],
  //         //   ],
  //         //   colorbar: {
  //         //     title: "Predicted",
  //         //     tickmode: "array",
  //         //     ticktext: tickText,
  //         //     tickvals: tickVals,
  //         //   },
  //         //   hoverinfo: "skip",
  //         //   // change marker outline to white after making bg black/transparent?
  //         //   // marker: {
  //         //   //   color: "magenta",
  //         //   //   line: { color: "black", width: 1 },
  //         //   // },
  //         //   // showlegend: true,
  //         // },
  //       ]}
  //       // disable x, y, z titles?
  //       layout={{
  //         scene: {
  //           xaxis: {
  //             showgrid: false,
  //             showticklabels: false,
  //           },
  //           yaxis: {
  //             showgrid: false,
  //             showticklabels: false,
  //           },
  //           zaxis: {
  //             showgrid: false,
  //             showticklabels: false,
  //           },
  //           camera: {
  //             eye: eyes[eyeIdx],
  //             up,
  //           },
  //         },
  //         font: {
  //           color: "rgba(255, 255, 255, 0.85)",
  //           // family:
  //           //   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;",
  //           family: "inherit",
  //         },
  //         autosize: true,
  //         // make responsive
  //         // https://codesandbox.io/s/nostalgic-jones-4kuww
  //         paper_bgcolor: "transparent",
  //         plot_bgcolor: "transparent",
  //         // legend: {
  //         //   y: 0,
  //         //   x: 0,
  //         //   title: { text: "Actual" },
  //         // },
  //       }}
  //       style={{ width: "100%", height: "250px" }}
  //       useResizeHandler
  //       config={{ displayModeBar: false }}
  //     />
  //   ),
  //   [viz3D, eyeIdx, up]
  // );

  return (
    <>
      <Title>Premium Access</Title>
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
      </span>
      <div
        className={pageStyles.parent}
        style={{ alignItems: "center", minHeight: "450px" }}
      >
        <div className={pageStyles.child}>
          {/* test if preview endpoint is done loading (for return estimate) */}
          {!minInvestment ? (
            spinner
          ) : (
            <>
              <Title level={3}>Signals API</Title>
              {/* should be level 3-5 */}
              <span>{"Access to the "}</span>
              <span style={{ fontFamily: '"Courier","Courier New",monospace', color: "#52e5ff" }}>
                /signals
              </span>
              <span>
                {
                  " API which provides up to a week's worth of the latest BUY and SELL signals."
                }
              </span>
              {/* example of json datum? */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* replace this with card with price per month (finally from backend config endpoint) heading and 5 requests / day (constant from backend) subheading*/}
                <img height="200px" src={CUBE}></img>
              </div>
              <div>New signals are produced by 12:05 UTC.</div>
              {minInvestment && (
                <div
                  style={{ marginBottom: "24px" }}
                >{`Minimum recommended investment: ${minInvestment} BTC`}</div>
              )}
              <b>Disclaimer:</b>
              {/* Maybe merge the following disclaimer divs */}
              <div>
                Note that the algorithm's signals <b>DO NOT</b> constitute
                investment advice.
              </div>
              <div>
                {" "}
                Do your own research, make your own judgements, and invest
                responsibly.
              </div>
            </>
          )}
        </div>
        {/* test if signed in | if not, then don't render,
        if signed in, then test if in beta | if so, show beta view, 
        else test if active subscription | if so, show plan/sub amount, payment method, and option to cancel / manage - should have to open modal and click button or type in phrase to cancel
        else show stripe subscription page*/}
        {/* https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements */}
        {metadata.length ? (
          <div className={pageStyles.child}>
            <Title level={3}>Payment</Title>
            <img height="200px" src={CUBE}></img>
            <Button className={overrides.subscribe}>Subscribe</Button>
            {/* <Elements stripe={stripePromise} options={options}> */}
              {/* <AddressElement options={addressOptions} /> */}
              {/* <PaymentElement options={paymentOptions} /> */}
            {/* </Elements> */}
            {/* <Row gutter={[24, 24]}>
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
            </Row> */}
          </div>
        ) : null}
      </div>
    </>
  );
};

SubscriptionPage.displayName = "Subscription";

export default SubscriptionPage;
