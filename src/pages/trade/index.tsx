import { Typography, Table, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl, Toggle } from "@/utils";
import { Pie } from '@ant-design/charts';
import layoutStyles from "@/layouts/index.module.less";
import subStyles from "@/pages/subscription/index.module.less";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  let [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState();
  const [toggle, setToggle] = useState(false);
  const toggleLabels = { OPTIONS: "OPT", STOCKS: "STX" };

  const format = (prefix='', suffix='', mult=1, color=(_: any) => 'inherit', arrow=false) => (toRound: string) => {
    let num = parseFloat(toRound) * mult;
    return (
    <>
      <span style={{color: color(num)}}>{`${prefix}${num % 1 ? num.toFixed(2) : num}${suffix}`}</span>
      <span style={{color: num >= 0 ? 'cyan' : 'magenta'}}>{arrow && (num >= 0 ? ' ▲' : ' ▼') || ''}</span>
    </>);
  }
  
  const createColumn = ({dataName='', displayName='', render=(s: string) => s, sort=false}) => (
    Object.assign({ 
      title: (displayName || dataName).toLowerCase().replace(/(^| )(\w)/g, (s: string) => s.toUpperCase()), 
      dataIndex: dataName, 
      key: dataName, 
      align: 'center',
      render
    }, sort ? {
      defaultSortOrder: dataName === 'expiration' ? 'ascend' : '',
      sorter: (a: { [x: string]: any; }, b: { [x: string]: any; }) => {
        let x = a[dataName];
        let y = b[dataName]
        if (dataName === 'expiration') {
          x = Date.parse(x);
          y = Date.parse(y);
        }
        return x - y;
      }
    } : {}));
  const columns = toggle ? [
    createColumn({dataName: 'symbol'}), 
    createColumn({dataName: 'quantity', render: format()}),
    createColumn({dataName: 'price', render: format('$')}),
    createColumn({dataName: 'percent_change', displayName: 'Delta', 
      render: format(
        '', 
        '%', 
        1, 
        (num) => num >= 0 ? 'cyan' : 'magenta',
        true
      ),
      sort: true,
      }),
    createColumn({dataName: 'percentage', render: format('', '%'), sort: true})
  ] : [
    createColumn({dataName: 'symbol'}), 
    // pass in custom sort obj and make sort null by default in createCol fx
    // use multiple sort and make ascend + multiple: 1
    createColumn({dataName: 'open_contracts', displayName: 'Contracts', sort: true}),
    createColumn({dataName: 'strike', render: format('$')}),
    createColumn({dataName: 'chance', render: format('', '%', 100, (num) => num >= 80 ? 'cyan' : 'magenta'), sort: true}),
    // use multiple sort w multiple: 2
    createColumn({dataName: 'expiration', sort: true}),
    createColumn({displayName: 'Action', render: (holding) => 
      <Button 
        className={holding.open_contracts ? layoutStyles.start : subStyles.subscribe} 
        onClick={
          async () => {
            setLoading(holding.symbol);
            const renderError = () => notification.error({
              duration: 10,
              message: "Failure",
              description: `Failed to execute order for ${holding.symbol}.`,
            });
            try {
              const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
              const url = `${getApiUrl({ localOverride: "dev" })}/trade`;
              const response = await fetch(url, { method: "POST", headers: { Authorization: jwtToken }, body: JSON.stringify({ type: holding.open_contracts ? 'ROLL' : 'SELL', symbols: [holding.symbol] }) });
              const data = await response.json();
              if ('error' in data[holding.symbol]) {
                renderError();
              } else {
                notification.success({
                  duration: 10,
                  message: "Success",
                  description: `Executed order for ${holding.symbol}!`,
                });
                console.log('data', data);
              }
            } catch (e) {
              renderError()
            }
            setLoading();
          }
        }
        loading={loading === holding.symbol}
        disabled={Boolean(loading)}
      >
        {holding.open_contracts ? 'ROLL' : 'SELL'}
      </Button>})
    // add col for sell vs roll
    // add chart for premium income per week
    // include dividend income on chart - area chart
  ]


  useEffect(() => {
    if (loggedIn) {
      (async () => {
        const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
        const url = `${getApiUrl({ localOverride: "dev" })}/trade`;
        const response = await fetch(url, { method: "GET", headers: { Authorization: jwtToken } });
        const data = await response.json();
        setPortfolio(data);
      })();
    }
  }, [loggedIn]);

  const data = portfolio.map(holding => ({type: holding['symbol'], value: Math.round(holding['percentage'] * 100) / 100}))

  const config = {
    appendPadding: 10,
    data,
    theme: 'dark',
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: (content: { type: any; }) => content.type,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'STX',
      },
    },
  };




// Goal:
// table w symbols
// number of options (should be done), date (should be done), strike price (should be done), chance of profit (should be done), sell (magenta) and roll (cyan) buttons
// execute (magenta) button executes strategy for all assets
// graph of covered call income over time
// +$20 premium notification after each sell order
// total + for the week, filter sum to include filled orders after start of day Mon
// include dividend income on chart - area chart



  return (
  <>
    <Title>Portfolio</Title>
    <span style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
      <Toggle
        val={toggle}
        options={[toggleLabels.STOCKS, toggleLabels.OPTIONS]}
        defaultValue={toggleLabels.OPTIONS}
        onChange={(val: string) => setToggle(val === toggleLabels.STOCKS)}
      />
    </span>
    <Table dataSource={toggle ? portfolio : portfolio.filter(holding => parseFloat(holding?.quantity) >= 100)} columns={columns} />
    {toggle && <Pie {...config} />}
  </>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
