import React, { memo } from "react";
import { useState, useEffect } from "react";
import {
  Typography,
  Spin,
  Table,
  Switch,
  Alert,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  Skeleton,
  notification,
} from "antd";
import { G2, Line } from "@ant-design/charts";
import {
  LoadingOutlined,
  CaretDownFilled,
  CaretUpFilled,
  QuestionOutlined,
  IeSquareFilled,
} from "@ant-design/icons";
import styles from "./index.less";
import layoutStyles from "../layouts/index.less";
import "./index.less";
import {
  getApiUrl,
  useLoginLoading,
  getDateRange,
  addDays,
  useAccount,
  signalColors,
  signalEmojis,
} from "@/utils";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
import { AccountContext } from "../layouts";

const HODL = "HODL";
const hyperdrive = "hyperdrive";
const formatBTC = (v: number) => `${Math.round(v * 10) / 10} ₿`;
const formatUSD = (v: number) => {
  if (v < 1e3) {
    return `$ ${v}`;
  } else if (v < 1e6) {
    return `$ ${v / 1e3}k`;
  }
  return `$ ${v / 1e6}M`;
};
const LineChart: React.FC<any> = memo(
  ({ data, formatFx }) => {
    const config = {
      // onReady,
      autoFit: true,
      data,
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
        // Why is this necessary?
        // !inBeta &&
        appear: {
          animation: "wave-in",
          duration: 4000,
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
          formatter: (v: any) => formatFx(v),
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
    return <Line {...config} />;
  },
  (pre, next) => JSON.stringify(pre?.data) === JSON.stringify(next?.data)
);

const Page = () => {
  const { account, accountLoading } = React.useContext(AccountContext);
  const ribbonColors = {
    Sun: "red",
    Mon: "yellow",
    Tue: "blue",
    Wed: "pink",
    Thu: "green",
    Fri: "cyan",
    Sat: "orange",
  };
  const cardHeaderColors = {
    Sun: "#D32029",
    Mon: "#D8BD14",
    Tue: "#177DDC",
    Wed: "#CB2B83",
    Thu: "#49AA19",
    Fri: "#13A8A8",
    Sat: "#D87A16",
  };

  const caretIconSize = 50;
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const [previewData, setPreviewData] = useState({
    BTC: { data: [], stats: [] },
    USD: { data: [], stats: [] },
  });
  const numDaysInAWeek = 7;
  const signalDates = getDateRange(
    addDays(new Date(), -numDaysInAWeek),
    numDaysInAWeek - 1
  );
  const defaultSignals = signalDates.map((date) => ({
    Date: date.toISOString().slice(0, 10),
    Day: date.toDateString().slice(0, 3),
    Signal: "?",
    Asset: "BTC",
  }));
  const [signalData, setSignalData] = useState(defaultSignals);
  const [toggle, setToggle] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  // const [accountLoading, setAccountLoading] = useState(false);
  const [signalLoading, setSignalLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showSignalCard, setShowSignalCard] = useState(false);
  const [signalCardData, setSignalCardData] = useState(defaultSignals[0]);
  const [haveNewSignal, setHaveNewSignal] = useState(false);
  const [quotaReached, setQuotaReached] = useState(false);
  const loading = previewLoading || accountLoading || loginLoading;
  // const [account, setAccount] = useState();
  const inBeta = loggedIn && account?.permissions?.in_beta;

  useEffect(() => {
    // find a way to not load this for in_beta
    // simple if !inBeta or checking accountLoading and loginLoading doesn't work
    const url = `${getApiUrl({ localOverride: "prod" })}/preview`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setPreviewData(data))
      .catch((err) => console.error(err))
      .finally(() => setPreviewLoading(false));
  }, []);

  // useEffect(useAccount(loggedIn, setAccount, setAccountLoading), [loggedIn]);
  useEffect(useLoginLoading(setLoginLoading));

  const fetchSignals = () => {
    setSignalLoading(true);
    const url = `${getApiUrl()}/signals`;
    fetch(url, { method: "GET", headers: { "X-API-Key": account?.api_key } })
      .then((response) => response.json())
      .then((data) => {
        if (!("data" in data)) {
          const { message } = data;
          const pattern = /^(.[^\d]*)(.*)$/;
          const match = message.match(pattern);
          setQuotaReached(true);
          notification.error({
            duration: 10,
            message: "Quota Reached",
            description: (
              <>
                <div>{match[1]}</div>
                <div>{match[2]}</div>
              </>
            ),
          });
          setTimeout(() => {
            setQuotaReached(false);
          }, 10000);
          throw new Error(message);
        }
        return data;
      })
      .then((response) => {
        const { message, data } = response;
        notification.warning({
          duration: 10,
          message: "Quota",
          description: message,
        });
        setSignalData(data);
      })
      .then(() => setHaveNewSignal(true))
      .catch((err) => console.error(err))
      .finally(() => setSignalLoading(false));
  };
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
  // const config = {
  //   autoFit: true,
  //   data: toggle ? previewData.BTC.data : previewData.USD.data,
  //   xField: "Time",
  //   yField: "Bal",
  //   seriesField: "Name",
  //   smooth: true,
  //   colorField: "Name",
  //   color: ({ Name }) => {
  //     if (Name === HODL) {
  //       return "magenta";
  //     }
  //     return "#52e5ff";
  //   },
  //   area: {
  //     style: {
  //       fillOpacity: 0.15,
  //     },
  //   },
  //   animation: {
  //     // Why is this necessary?
  //     // !inBeta &&
  //     appear: {
  //       animation: "wave-in",
  //       duration: 4000,
  //     },
  //   },
  //   xAxis: {
  //     tickCount: 10,
  //     grid: {
  //       line: {
  //         style: {
  //           lineWidth: 0,
  //           strokeOpacity: 0,
  //         },
  //       },
  //     },
  //   },
  //   yAxis: {
  //     label: {
  //       formatter: (v: any) => (toggle ? formatBTC(v) : formatUSD(v)),
  //     },
  //     grid: {
  //       line: {
  //         style: {
  //           lineWidth: 0,
  //           strokeOpacity: 0,
  //         },
  //       },
  //     },
  //   },
  //   point: {
  //     shape: "breath-point",
  //   },
  // };

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

  const betaTitlePrefix = "New Signal:";
  const betaTitle = (
    <div className={styles.content}>
      <div className={styles.betaContainer}>
        <div className={styles.text}>{betaTitlePrefix}</div>
        <div className={styles.list}>
          <div>
            <span style={{ fontSize: "30px" }}>
              <span
                style={{
                  color: haveNewSignal
                    ? signalColors[signalData[signalData.length - 1].Signal]
                    : "lime",
                }}
                className={styles.betaItem}
              >
                &nbsp;
                {haveNewSignal
                  ? signalData[signalData.length - 1].Signal
                  : "BUY"}
              </span>
              {haveNewSignal && (
                <>
                  {signalData[signalData.length - 1].Signal === "BUY" && (
                    <span>&nbsp;</span>
                  )}
                  <span>
                    &nbsp;
                    {signalEmojis[signalData[signalData.length - 1].Signal]}
                  </span>
                </>
              )}
              {!haveNewSignal && <span>&nbsp;&nbsp;&nbsp;?</span>}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0 }}>{betaTitlePrefix}</span>
            <span style={{ fontSize: "30px" }}>
              <span
                style={{
                  color: haveNewSignal
                    ? signalColors[signalData[signalData.length - 1].Signal]
                    : "#F7931A",
                }}
                className={styles.betaItem}
              >
                &nbsp;
                {haveNewSignal
                  ? signalData[signalData.length - 1].Signal
                  : "HODL"}
              </span>
              {haveNewSignal && (
                <>
                  {signalData[signalData.length - 1].Signal === "BUY" && (
                    <span>&nbsp;</span>
                  )}
                  <span>
                    &nbsp;
                    {signalEmojis[signalData[signalData.length - 1].Signal]}
                  </span>
                </>
              )}
              {!haveNewSignal && <span>&nbsp;?</span>}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0 }}>{betaTitlePrefix}</span>
            <span style={{ fontSize: "30px" }}>
              <span
                style={{
                  color: haveNewSignal
                    ? signalColors[signalData[signalData.length - 1].Signal]
                    : "red",
                }}
                className={styles.betaItem}
              >
                &nbsp;
                {haveNewSignal
                  ? signalData[signalData.length - 1].Signal
                  : "SELL"}
              </span>
              {haveNewSignal && (
                <>
                  {signalData[signalData.length - 1].Signal === "BUY" && (
                    <span>&nbsp;</span>
                  )}
                  <span>
                    &nbsp;
                    {signalEmojis[signalData[signalData.length - 1].Signal]}
                  </span>
                </>
              )}
              {!haveNewSignal && <span>&nbsp;?</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <LineChart
      data={toggle ? previewData.BTC.data : previewData.USD.data}
      formatFx={toggle ? formatBTC : formatUSD}
    />
    // <Line {...config} onlyChangeData={true} />

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
