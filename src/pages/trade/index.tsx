import { Typography } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl } from "@/utils";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const [portfolio, setPortfolio] = useState({});

  useEffect(() => {
    if (loggedIn) {
      (async () => {
        const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
        const url = `${getApiUrl({ localOverride: "dev" })}/trade`;
        const response = await fetch(url, { method: "GET", headers: { Authorization: jwtToken } });
        const data = await response.json();
        console.log(data);
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
  {/* {Object.keys(portfolio).map(symbol => )} */}
  </>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
