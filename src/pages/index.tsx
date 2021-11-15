import React from "react";
import { PageHeader, Typography } from "antd";
import { Line } from "@ant-design/charts";

const { Title, Text } = Typography;

function Page() {
  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  let newData = [];
  data.forEach((datum, idx) => {
    const btc_datum = { ...datum };
    btc_datum.name = "BTC";
    newData.push(btc_datum);
    datum.name = "hyperBTC";
    datum.value = datum.value * idx;
    newData.push(datum);
  });

  console.log(newData);

  const config = {
    data: newData === [] ? data : newData,
    height: 400,
    xField: "year",
    yField: "value",
    seriesField: "name",
    smooth: true,
    colorField: "name",
    color: ({ name }) => {
      if (name === "BTC") {
        return "magenta";
      }
      return "#52e5ff";
    },
    // point: {
    //   size: 5,
    //   shape: "diamond",
    // },
    // label: {
    //   style: {
    //     fill: "#aaa",
    //   },
    // },
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
  };
  return (
    <>
      <Title>Leveraging AutoML to beat BTC</Title>
      <Title level={5} style={{ paddingBottom: 12, marginTop: -12 }}>
        a momentum trading strategy using{" "}
        <a href="https://github.com/suchak1/hyperdrive">
          <i style={{ color: "#52e5ff" }}>hyperdrive</i>
        </a>
      </Title>
      {newData !== [] ? <Line {...config} /> : null}
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
}

Page.displayName = "Page";

export default Page;
