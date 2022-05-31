import React from "react";
import { useState, useEffect } from "react";
import { Typography, Spin, Table, Switch, Alert } from "antd";
import { G2, Line } from "@ant-design/charts";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { getApiUrl } from "@/utils";

const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Page = () => {
  const HODL = "HODL";
  const hyperdrive = "hyperdrive";
  const [previewData, setPreviewData] = useState({
    BTC: { data: [], stats: [] },
    USD: { data: [], stats: [] },
  });
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(true);

  const formatBTC = (v: number) => `${Math.round(v * 10) / 10} ₿`;
  const formatUSD = (v: number) => {
    if (v < 1e3) {
      return `$ ${v}`;
    } else if (v < 1e6) {
      return `$ ${v / 1e3}k`;
    }
    return `$ ${v / 1e6}M`;
  };
  useEffect(() => {
    (async () => {
      const url = `${getApiUrl({ localOverride: "prod" })}/preview`;
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

        group.addShape("marker", {
          attrs: {
            x: point.x,
            y: point.y,
            r: 5,
            fill,
            opacity: 1,
            symbol,
          },
        });

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
    data: toggle ? previewData.BTC.data : previewData.USD.data,
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
        duration: 3000,
        easing: "easeCircleInOut",
      },
    },
    xAxis: {
      tickCount: 10,
      grid: {
        line: {
          style: {
            lineWidth: 0,
            strokeOpacity: 0,
          },
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: any) => (toggle ? formatBTC(v) : formatUSD(v)),
      },
      grid: {
        line: {
          style: {
            lineWidth: 0,
            strokeOpacity: 0,
          },
        },
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
      <Alert
        message="You are not in the closed beta, but you may receive an invitation in the future. 🤔⏳📧"
        type="warning"
        showIcon
        closable
        style={{ marginBottom: "12px" }}
      />
      <Title>Leveraging AutoML to beat BTC</Title>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "-12px 0px 12px 0px",
        }}
      >
        <Title level={5}>
          a momentum trading strategy using{" "}
          <a href="https://github.com/suchak1/hyperdrive">
            <i style={{ color: "#52e5ff" }}>{hyperdrive}</i>
          </a>
        </Title>
        <Switch
          checkedChildren="BTC (₿)"
          unCheckedChildren="USD ($)"
          defaultChecked
          onChange={(checked) => setToggle(checked)}
        />
      </span>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <div className={styles.parent}>
          <div className={styles.child}>{!loading && <Line {...config} />}</div>
          <div className={styles.child}>
            {!loading && (
              <Table
                dataSource={
                  toggle ? previewData.BTC.stats : previewData.USD.stats
                }
                columns={columns}
                pagination={false}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}
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
