import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Segmented, Tooltip, Badge, Card, Button, Spin, Alert } from "antd";
import { getApiUrl, getDayDiff, get3DCircle, linspace } from "@/utils";
import pageStyles from "@/pages/home/index.module.less";
import layoutStyles from "@/layouts/index.module.less";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountContext } from "../../layouts";
import CUBE from "../../../assets/cube.gif";

import overrides from "./index.module.less";

import styled from "styled-components";

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
const spinner = <Spin style={{ width: "100%" }} indicator={antIcon} />;

const SubscriptionPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, accountLoading, loginLoading, setShowLogin } = useContext(
    AccountContext
  );
  const loading = loginLoading || accountLoading;
  // const account = true;
  const inBeta = loggedIn && account?.permissions?.in_beta;
  const [minInvestment, setMinInvestment] = useState();
  const [price, setPrice] = useState();
  const [priceLoading, setPriceLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const showSuccessAlert = searchParams.get('success')?.toLowerCase() === 'true'
  // const checkoutSessionId = searchParams.get('session_id')

  const onCheckout = () => {
    setCheckoutLoading(true);
    const { idToken } = loggedIn.signInUserSession;
    const url = `${getApiUrl()}/checkout`;
    fetch(url, {
      method: "POST",
      headers: { Authorization: idToken.jwtToken },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch checkout page.');
        }
        return response.json();
      })
      .then((data) => window.location.href = data)
      .catch((err) => console.error(err))
      .finally(() => setCheckoutLoading(false));
  };

  let subscribeButton =
    <Button
      onClick={onCheckout}
      loading={checkoutLoading}
      disabled={!account}
      className={account && overrides.subscribe}>Subscribe
    </Button>;
  if (!account) {
    subscribeButton = <Tooltip
      trigger={["hover", "focus"]}
      title="Verify your email address."
      placement="bottom"
    >
      {subscribeButton}
    </Tooltip>
  }

  useEffect(() => {
    const url = `${getApiUrl({ localOverride: "dev" })}/plans`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      // .then((data) => {
      //   const {
      //     unit_amount,
      //     recurring,
      //   } = data;
      //   const { interval, interval_count } = recurring;
      //   return data;
      // })
      .then((data) => setPrice(data))
      .catch((err) => console.error(err))
      .finally(() => setPriceLoading(false));
  }, []);

  useEffect(() => {
    if (!priceLoading) {
      const url = `${getApiUrl({ localOverride: "prod" })}/preview`;
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          const previewBTC = data.BTC.data;
          const previewUSD = data.USD.data;
          let lastUSD = previewUSD.slice(previewUSD.length - 2);
          lastUSD = lastUSD[0].Name === "HODL" ? lastUSD[0] : lastUSD[1];
          const btcPrice = lastUSD.Bal;
          let first = previewBTC.slice(0, 2);
          first = first[0].Name === "hyperdrive" ? first[0] : first[1];
          const start = first.Time;
          let last = previewBTC.slice(previewBTC.length - 2);
          last = last[0].Name === "hyperdrive" ? last[0] : last[1];
          const end = last.Time;
          const days = getDayDiff(start, end);
          const totalBTCRate = last.Bal - 1;
          const monthlyBTCRate = (totalBTCRate / days) * 30;
          // this should be tied to val in backend / maybe make endpoint that returns backend constant
          const monthlySubUSD = price?.unit_amount / 100;
          const monthlySubBTC = monthlySubUSD / btcPrice;
          // principal * monthly rate >= monthlysubrate
          const minBTCInvestment = (monthlySubBTC / monthlyBTCRate).toPrecision(
            2
          );
          setMinInvestment(minBTCInvestment);
        })
        .catch((err) => console.error(err));
    }
  }, [price, priceLoading]);

  return (
    <>
      {loggedIn && account && showSuccessAlert && (
        <Alert
          message={"Your payment was successful. You have unlocked API access. 🔓"}
          type={"success"}
          showIcon
          closable
          style={{ marginBottom: "12px" }}
        />
      )}
      <Title>Premium Access</Title>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "-12px 0px 12px 0px",
        }}
      >
        <Title level={5} style={{ width: "75%" }}>
          to the algorithm's <span style={{ color: "#52e5ff" }}>BUY</span> and{" "}
          <span style={{ color: "magenta" }}>SELL</span> signals
        </Title>
      </span>
      <div
        className={pageStyles.parent}
        style={{ alignItems: "center", minHeight: "450px" }}
      >
        <div className={pageStyles.child}>
          {/* test if preview endpoint is done loading (for return estimate) */}
          {!minInvestment ? (
            spinner
          ) : (
            <>
              {/* add badge to card "Current Plan" and replace sub button with Manage Subscription (cyan button )=> customer portal */}
              {/* additional cards say Downgrade or Upgrade (magenta btn) and backend uses stripe.Subscription.modify + prorating  */}
              {/* <Badge.Ribbon
                color={'yellow'}
                text={<b>{'Current Plan'}</b>}
              > */}
              <Card style={
                {
                  // minWidth: '400px',
                  maxWidth: '500px'
                }
              }>
                {/* entire card should be centered horizontally on page */}
                {/* cube gif as icon on left, then title */}
                {/* price on right in large font - per month in gray text */}
                {/* then info split into 3 bullet points */}
                {/* - Access to the /signals API  */}
                {/* - up to a week's worth of the latest BUY and SELL signals */}
                {/* - maximum of 5 requests / day */}
                {/* each bullet point should be a green, cyan, or magent checkmark or bullet - whatever looks best */}
                {/* subscribe button centered at bottom in magenta, manage subscription in cyan centered at bottom */}
                {/* eventually $100/month, $85/month for 6 or 12 month subscription */}
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <img height="50px" src={CUBE}></img>
                    <Title style={{ marginBottom: 0, marginLeft: '16px' }} level={3}>{'Signals API'}</Title>
                  </span>
                  <Title style={{ marginBottom: 0 }} level={3}>
                    {/* <> */}
                    <span>{`$${Number(price?.unit_amount / 100).toFixed(2)} `}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.45' }}>{`/ ${price?.recurring?.interval_count > 1 ? `${price?.recurring?.interval_count} ` : ''}${price?.recurring?.interval}${price?.recurring?.interval_count > 1 ? 's' : ''}`}</span>
                    {/* </> */}
                  </Title>
                </span>
                {/* should be level 3-5 */}
                <ul style={
                  {
                    paddingInlineStart: '80px'
                  }
                }>
                  <li>{"access to the "}<span style={{ fontFamily: '"Courier","Courier New",monospace', color: "#52e5ff" }}>
                    /signals
                  </span> API</li>
                  <li>provides up to a week's worth of the latest BUY and SELL signals</li>
                  <li>5 requests / day</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {loggedIn ? subscribeButton : <Button
                    className={layoutStyles.start}
                    onClick={() => setShowLogin(true)}
                  >
                    Sign in to subscribe
                  </Button>}
                </div>
              </Card>
              {/* </Badge.Ribbon> */}
              <div>New signals are produced by 12:05 UTC.</div>
              {minInvestment && (
                <div
                  style={{ marginBottom: "24px" }}
                >{`Minimum recommended investment: ${minInvestment} BTC`}</div>
              )}
              <b>Disclaimer:</b>
              {/* Maybe merge the following disclaimer divs */}
              <div>
                Note that the algorithm's signals <b>DO NOT</b> constitute
                investment advice.
              </div>
              <div>
                {" "}
                Do your own research, make your own judgements, and invest
                responsibly.
              </div>
            </>
          )}
        </div>
        {/* test if has account | if not, then don't render and if signed in, show alert at top,
        if signed in, then test if in beta | if so, show beta view, 
        else test if active subscription | if so, show plan/sub amount, payment method, and option to cancel / manage - should have to open modal and click button or type in phrase to cancel
        else show stripe subscription page*/}
        {/* https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements */}
      </div>
    </>
  );
};

SubscriptionPage.displayName = "Subscription";

export default SubscriptionPage;
