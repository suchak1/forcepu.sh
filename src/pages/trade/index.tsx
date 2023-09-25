import { Typography } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl } from "@/utils";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);

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


  return (<></>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
