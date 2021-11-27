import React from "react";
import { useState, useEffect } from "react";
import { Typography, Spin, Table } from "antd";
import { Line } from "@ant-design/charts";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.less";

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Page = () => {
  const [holdingData, setHoldingData] = useState(null);
  const [hyperData, setHyperData] = useState(null);
  const [holdingStats, setHoldingStats] = useState(null);
  const [hyperStats, setHyperStats] = useState(null);
  const holdingLabel = "HODLing BTC";
  const [holdingLoading, setHoldingLoading] = useState(true);
  const [hyperLoading, setHyperLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const url =
        process.env.NODE_ENV === "development"
          ? "/api/holding"
          : "https://api.forcepu.sh/holding";
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((res) => {
          setHoldingData(
            res.data.map((datum) => {
              datum.name = holdingLabel;
              return datum;
            })
          );
          setHoldingStats(res.stats);
        })
        .then(() => setHoldingLoading(false));
    })();
    (async () => {
      const url =
        process.env.NODE_ENV === "development"
          ? "/api/hyper"
          : "https://api.forcepu.sh/hyper";
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((res) => {
          setHyperData(
            res.data.map((datum) => {
              datum.name = "trading BTC with hyperdrive";
              return datum;
            })
          );
          setHyperStats(res.stats);
        })
        .then(() => setHyperLoading(false));
    })();
  }, []);

  const config = {
    autoFit: true,
    data: holdingData && hyperData ? holdingData.concat(hyperData) : [],
    height: 400,
    xField: "Time",
    yField: "Bal",
    seriesField: "name",
    smooth: true,
    colorField: "name",
    color: ({ name }) => {
      if (name === holdingLabel) {
        return "magenta";
      }
      return "#52e5ff";
    },
    area: {
      style: {
        fillOpacity: 0.15,
      },
    },
    animation: {
      appear: {
        animation: "wave-in",
        duration: 5000,
      },
    },
    xAxis: {
      tickCount: 10,
    },
    yAxis: {
      label: {
        formatter: (v) => `$ ${v}`,
      },
    },
  };

  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    {
      title: <span style={{ color: "#DF00DF" }}>HODL</span>,
      dataIndex: "hodl",
      key: "hodl",
    },
    {
      title: <i style={{ color: "#52e5ff" }}>hyperdrive</i>,
      dataIndex: "hyperdrive",
      key: "hyperdrive",
    },
  ];
  return (
    <>
      <Title>Leveraging AutoML to beat BTC</Title>
      <Title level={5} style={{ paddingBottom: 12, marginTop: -12 }}>
        a momentum trading strategy using{" "}
        <a href="https://github.com/suchak1/hyperdrive">
          <i style={{ color: "#52e5ff" }}>hyperdrive</i>
        </a>
      </Title>
      <div className={styles.parent}>
        <div className={styles.child}>
          {holdingData && hyperData ? (
            <Line {...config} />
          ) : (
            <Spin indicator={antIcon} />
          )}{" "}
        </div>
        <div className={styles.child}>
          {holdingStats && hyperStats ? (
            <Table
              dataSource={Object.keys(holdingStats).map((key, idx) => {
                return {
                  key: idx.toString(),
                  metric: key,
                  hodl: holdingStats[key],
                  hyperdrive: hyperStats[key],
                };
              })}
              columns={columns}
              pagination={false}
              loading={holdingLoading || hyperLoading}
            />
          ) : null}
        </div>
      </div>
      {/* place strat stats here (sortino, return, drawdown, etc) */}
    </>
    // automated portfolio management
    // using momentum based strategy

    // use this example: https://g2plot.antv.vision/en/examples/line/multiple#line-area
    // multiline chart w area obj and animation obj
    // ant design charts is react wrapper of g2plot

    // use simulated data from model
    // need to make oracle class in hyperdrive
    // and write declassified script that updates predictions.csv in models/latest each night
    // does it need latest data? then make sure api key is hidden in declassified file

    // OR EASIER:
    // have lambda predict using pickled data and combine w signals.csv (consistent simulation)

    // best soln so far:
    // hyperdrive: test predictions.csv using pca5 branch / create model workflow dispatch
    // backend: make api endpoint that combines predictions.csv with signals.csv and returns
    // backend: make endpoint that returns btc close data (including most recent close - little hard) / might use alt source
    // frontend: make js fx that calculates acct balance given close array and signals array
  );
};

Page.displayName = "Page";

export default Page;
