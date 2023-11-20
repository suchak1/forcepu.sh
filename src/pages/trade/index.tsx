import { Typography, Table } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl } from "@/utils";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const [portfolio, setPortfolio] = useState({});

  // const dataSource = [
  //   {
  //     key: '1',
  //     name: 'Mike',
  //     age: 32,
  //     address: '10 Downing Street',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //     age: 42,
  //     address: '10 Downing Street',
  //   },
  // ];
  
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];


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




// Goal:
// table w symbols
// number of options (should be done), date (should be done), strike price (should be done), chance of profit (should be done), sell (magenta) and roll (cyan) buttons
// execute (magenta) button executes strategy for all assets
// graph of covered call income over time
// +$20 premium notification after each sell order
// total + for the week, filter sum to include filled orders after start of day Mon


  return (
  <>
  <Table dataSource={dataSource} columns={columns} />
  {/* {Object.keys(portfolio).map(symbol => )} */}
  </>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
