import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { Typography, Spin, Table, Switch, Popover, Tooltip } from "antd";
import { G2, Line } from "@ant-design/charts";
import { LoadingOutlined, LockFilled } from "@ant-design/icons";
import styles from "./index.less";
import { getApiUrl, getDateRange, convertShortISO } from "@/utils";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useWindowWidth } from "@wojtekmaj/react-hooks";
// import "./index.less";
const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Page = ({
  chartIsLoading,
  waitForChart,
  setShowLogin,
  animationOpts: { animation, setAnimation, defaultAnimation },
  user,
}) => {
  const HODL = "HODL";
  const hyperdrive = "hyperdrive";
  const [previewData, setPreviewData] = useState({
    BTC: { data: [], stats: [] },
    USD: { data: [], stats: [] },
  });
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lockRatio, setLockRatio] = useState(0);
  const [lockIcon, setLockIcon] = useState("🔒");
  const [unlockIcon, setUnlockIcon] = useState("🔑");
  // const [chartIsLoading, setChartIsLoading] = useState(true);
  // const waitForChart = () => {
  //   setChartIsLoading(true);
  //   const timer = setTimeout(
  //     () => setChartIsLoading(false),
  //     defaultAnimation.appear.duration
  //   );
  //   return () => clearTimeout(timer);
  // };
  // const defaultAnimation = {
  //   appear: {
  //     animation: "wave-in",
  //     duration: 4000,
  //   },
  // };
  // const [animation, setAnimation] = useState(defaultAnimation);
  const width = useWindowWidth();
  console.log("chartIsLoading: ", chartIsLoading);
  const chartRef = useRef();
  // const tooltipRef = useRef();
  // let chartHeight, chartWidth;
  // if (chartRef?.current) {
  //   ({
  //     height: chartHeight,
  //     width: chartWidth,
  //   } = chartRef?.current?.getChart()?.getChartSize());
  //   document.documentElement.style.chartWidth = chartWidth;
  //   document.documentElement.style.chartHeight = chartHeight;
  //   document.documentElement.style.lockRatio = lockRatio;
  // }

  const lockSize = 50;
  const formatBTC = (v: number) => `${Math.round(v * 10) / 10} ₿`;
  const formatUSD = (v: number) => {
    if (v < 1e3) {
      return `$ ${v}`;
    } else if (v < 1e6) {
      return `$ ${v / 1e3}k`;
    }
    return `$ ${v / 1e6}M`;
  };
  // const { user } = useAuthenticator((context) => [context.user]);
  // const { showLogin, setShowLogin } = useContext(LoginContext);
  const popoverContent = (
    <span
      style={{ color: "#d9d9d9", fontWeight: "600", fontFamily: "monospace" }}
    >
      {user ? (
        "Signal API is coming soon..."
      ) : (
        <>
          <div>
            <a style={{ color: "#52e5ff" }} onClick={() => setShowLogin(true)}>
              <i>{"Log in and unlock"}</i>
            </a>
            {" the latest "}
          </div>
          <div>
            <span style={{ color: "lime", fontFamily: "monospace" }}>BUY</span>
            {" and "}
            <span style={{ color: "red", fontFamily: "monospace" }}>SELL</span>
            {" signals."}
          </div>
        </>
      )}
    </span>
  );
  useEffect(() => {
    (async () => {
      // const url = `${getApiUrl()}/preview`;
      const url = `https://api.forcepu.sh/preview`;
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          const dataLen = data.BTC.data.length;
          const latestDate = data.BTC.data[dataLen - 1].Time;
          // This is because there are two data points for each day:
          // HODL and hyperdrive
          const numUnlockedDays = dataLen / 2;
          // proportion of space that lock should take up
          const proposedLockRatio = 1 / 4;
          const numUnlockedParts = 1 / proposedLockRatio - 1;
          const numDaysToAdd = Math.round(numUnlockedDays / numUnlockedParts);

          let lockedDates: Date[] | string[] = getDateRange(
            new Date(latestDate),
            // new Date()
            numDaysToAdd
          ).map((d) => convertShortISO(d.toISOString().slice(0, 10)));

          lockedDates.forEach((Time) => {
            data.BTC.data.push({ Time });
            data.USD.data.push({ Time });
          });

          const numLockedDays = lockedDates.length;
          const totalNumDays = numUnlockedDays + numLockedDays;
          setLockRatio(numUnlockedDays / totalNumDays);
          return data;
        })
        .then((data) => setPreviewData(data))
        .then(() => setLoading(false))
        // .then(() => console.log(chartIsLoading))
        .then(waitForChart);
      // .then(() => console.log(chartIsLoading))
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
    animation,
    // animation: firstLoad
    //   ? {
    //       appear: {
    //         animation: "wave-in",
    //         duration: 0,
    //       },
    //     }
    //   : false,
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
    annotations: [
      {
        animation: false,
        type: "region",
        style: {
          // https://ant.design/docs/spec/colors#Neutral-Color-Palette
          // fill: "#595959",
          fill: "#434343",
          fillOpacity: 1,
          cursor: "not-allowed",
        },
        start: [`${lockRatio * 100}%`, "0%"],
        end: ["100%", "100%"],
        // Log in[blue and clicking will toggle login screen] to unlock the latest BUY[green] and SELL[red] signals.
        // Unlock [blue and clicking will toggle login screen] the latest BUY[green] and SELL[red] signals.
      },
      {
        animation: false,
        type: "text",
        content: user ? unlockIcon : lockIcon,
        position: [`${(lockRatio + (1 - lockRatio) / 2) * 100}%`, "50%"],
        style: {
          fontSize: lockSize,
        },
        offsetX: (lockSize * -1) / 2,
      },
    ],
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
      <Title>Leveraging AutoML to beat BTC</Title>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // padding: "6px 0px 12px 0px",
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
          onChange={(checked) => {
            setToggle(checked);
            setAnimation(defaultAnimation);
            waitForChart();
          }}
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
          <div className={styles.child}>
            {!loading && (
              <Popover
                // zIndex={11}
                // overlayInnerStyle={{
                //   // marginLeft: lockRatio + (1 - lockRatio) / 2 - chartWidth / 2,
                //   // marginBottom: chartHeight * 0.25,
                //   // zIndex: 11,
                //   left: "222px",
                // }}
                // overlayStyle={{
                //   // left: lockRatio + (1 - lockRatio) / 2 - chartWidth / 2,
                //   left: "222px",
                // }}
                // overlayClassName="chartTooltip"
                align={{
                  offset: [
                    // lockRatio +
                    //   (1 - lockRatio) / 2 -
                    //   chartRef?.current?.getChart()?.getChartSize()?.width / 2,
                    // -chartWidth / 2 + (1 - lockRatio) / 2,
                    // chartWidth / 2,
                    // +1 *
                    //   (chartRef?.current?.getChart()?.getChartSize()?.width /
                    //     2),
                    // below works,
                    width <= 700
                      ? 0
                      : chartRef?.current?.getChart()?.getChartSize()?.width /
                          2 -
                        ((1 - lockRatio) *
                          chartRef?.current?.getChart()?.getChartSize()
                            ?.width) /
                          2,
                    // height
                    chartRef?.current?.getChart()?.getChartSize()?.height *
                      -0.375,
                  ],
                  // targetOffset: [
                  //   // placement: bottom
                  //   -1 *
                  //     (chartRef?.current?.getChart()?.getChartSize()?.width /
                  //       2 -
                  //       ((1 - lockRatio) *
                  //         chartRef?.current?.getChart()?.getChartSize()
                  //           ?.width) /
                  //         2),
                  //   // placement: bottomRight
                  //   // 1 *
                  //   //   (chartRef?.current?.getChart()?.getChartSize()?.width /
                  //   //     2),
                  //   chartRef?.current?.getChart()?.getChartSize()?.height *
                  //     0.375,
                  // ],
                }}
                zIndex={1}
                content={popoverContent}
                color="#1f1f1f"
                placement="bottom"
                // placement="bottomRight"
                // visible
                overlayClassName={styles.chartTooltip}
                overlayInnerStyle={{ borderColor: "white", borderWidth: "1px" }}
                onVisibleChange={(visible) => {
                  console.log("visible: ", visible);
                  if (chartIsLoading) {
                    return;
                  }
                  if (visible) {
                    // if (
                    //   !chartRef?.current?.getChart()?.chart?.canvas?.cfg
                    //     ?.animating
                    // ) {
                    setAnimation(false);
                    //   }
                    // } else {
                    //   setAnimation(defaultAnimation);
                  }
                  if (user) {
                    if (visible && unlockIcon === "🔑") {
                      setUnlockIcon("⏳");
                    } else if (!visible && unlockIcon === "⏳") {
                      setUnlockIcon("🔑");
                    }
                  } else {
                    if (visible && lockIcon === "🔒") {
                      setLockIcon("🔓");
                    } else if (!visible && lockIcon === "🔓") {
                      setLockIcon("🔒");
                    }
                  }
                }}
                // visible={true}
              >
                {" "}
                <Line
                  ref={chartRef}
                  // onmouseenter={() => alert("enter mouse")}
                  {...config}
                />
              </Popover>
            )}
          </div>
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
