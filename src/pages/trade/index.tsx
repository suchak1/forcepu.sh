import { Typography } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl } from "@/utils";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    (async () => {
      const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
      const url = `${getApiUrl({ localOverride: "dev" })}/trade`;
      const response = await fetch(url, { method: "GET", headers: { Authorization: jwtToken } });
      console.log(response.json());
    })();
  }, []);


  return (<></>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
