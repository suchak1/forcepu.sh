import React from "react";
import { useState, useEffect } from "react";
import { Typography, Spin, Table } from "antd";
import { G2, Line } from "@ant-design/charts";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { getApiUrl } from "@/utils";
const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Page = () => {
  const HODL = "HODL";
  const hyperdrive = "hyperdrive";
  const [previewData, setPreviewData] = useState({ data: [], stats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const url =
        process.env.NODE_ENV === "development"
          ? "/api/preview"
          : `${getApiUrl()}/preview`;
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => setPreviewData(data))
        .then(() => setLoading(false));
    })();
  }, []);

  G2.registerShape("point", "breath-point", {
    draw(cfg, container) {
      const data = cfg.data;
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();

      if (data.Name === hyperdrive && data.Sig !== null) {
        const fill = data.Sig ? "lime" : "red";
        const symbol = data.Sig ? "triangle" : "triangle-down";
        const text = data.Sig ? "BUY" : "SELL";
        const fontSize = 10;
        group.addShape("text", {
          attrs: {
            text,
            x: point.x - fontSize,
            y: point.y - fontSize / 2,
            fill,
            fontWeight: 400,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowBlur: 10,
            fontSize,
          },
        });

        const decorator1 = group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 5,
            fill,
            opacity: 0.5,
            symbol,
          },
        });
        const decorator2 = group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 5,
            fill,
            opacity: 0.5,
            symbol,
          },
        });
        const decorator3 = group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 5,
            fill,
            opacity: 0.5,
            symbol,
          },
        });
        decorator1.animate(
          {
            r: 10,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: "easeLinear",
            repeat: true,
          }
        );
        decorator2.animate(
          {
            r: 10,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: "easeLinear",
            repeat: true,
            delay: 600,
          }
        );
        decorator3.animate(
          {
            r: 10,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: "easeLinear",
            repeat: true,
            delay: 1200,
          }
        );
        group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 3,
            fill,
            opacity: 0.7,
            symbol,
          },
        });
        group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 0.75,
            fill,
            symbol,
          },
        });
      }

      return group;
    },
  });
  const config = {
    autoFit: true,
    data: previewData.data,
    height: 400,
    xField: "Time",
    yField: "Bal",
    seriesField: "Name",
    smooth: true,
    colorField: "Name",
    color: ({ Name }) => {
      if (Name === HODL) {
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
    point: {
      shape: "breath-point",
    },
  };

  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    {
      title: <span style={{ color: "#DF00DF" }}>{HODL}</span>,
      dataIndex: HODL,
      key: HODL,
    },
    {
      title: <i style={{ color: "#52e5ff" }}>{hyperdrive}</i>,
      dataIndex: hyperdrive,
      key: hyperdrive,
    },
  ];
  return (
    <>
      <Title
        style={{
          // display: "flex",
          marginBottom: 0,
          marginTop: -10,
          // marginBlockStart: 0,
          // marginBlockEnd: 0,
        }}
      >
        Leveraging AutoML to beat BTC
      </Title>
      <span style={{ display: "flex" }}>
        <Title level={5} style={{ paddingTop: 6, paddingBottom: 12 }}>
          a momentum trading strategy using{" "}
          <a href="https://github.com/suchak1/hyperdrive">
            <i style={{ color: "#52e5ff" }}>{hyperdrive}</i>
          </a>
        </Title>{" "}
        {/* a */}
      </span>
      <div className={styles.parent}>
        <div className={styles.child}>
          {!loading ? <Line {...config} /> : <Spin indicator={antIcon} />}{" "}
        </div>
        <div className={styles.child}>
          {!loading ? (
            <Table
              dataSource={previewData.stats}
              columns={columns}
              pagination={false}
              loading={loading}
            />
          ) : null}
        </div>
      </div>
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
