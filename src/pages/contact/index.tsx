import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Segmented, Tooltip, Badge, Card, Button, Spin, Alert, Select, Input } from "antd";
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

const ContactPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, accountLoading, loginLoading, setShowLogin } = useContext(
    AccountContext
  );
  const loading = loginLoading || accountLoading;
  // const account = true;
  const inBeta = loggedIn && account?.permissions?.in_beta;
  const [minInvestment, setMinInvestment] = useState();
  const [subject, setSubject] = useState();
  const [priceLoading, setPriceLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  return (
    <>
      {/* modify alert or notification to appear after successful or unsuccessful contact form send */}
      {/* {loggedIn && account && (
        <Alert
          message={"Your payment was successful. You have unlocked API access. 🔓"}
          type={"success"}
          showIcon
          closable
          style={{ marginBottom: "12px" }}
        />
      )} */}
      <Title>Send us a message</Title>

      <div style={{ height: 'calc(100% - 128px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-around', // could do 'space-evenly' too
        }}>
          <Select
            onChange={setSubject}
            style={{ width: '100%' }}
            placeholder='Select a subject'
            disabled={!account}
            options={[
              { value: 'Account' },
              { value: 'API' },
              { value: 'AI Model' },
              { value: 'Subscription' },
              { value: 'General' },
              { value: 'Other' }
            ]}
            status=''
          >
          </Select>
          <Input.TextArea
            disabled={!account}
            placeholder='Write your message here.'
            style={{ height: '100%', width: '100%', resize: 'none' }}
            showCount
            maxLength={2500}
            status=''
          />
          <Button style={{ width: '100%' }}>Submit</Button>
          {/* add 500-2500 char limit for textarea - make request fail if message length === 0 or >maxLength with status='error'  */}
          {/* modify select status prop to be 'error' if submit button is pressed and !subject */}
          {/* add alert or notification on successful and unsuccessful contact message */}
          {/* keep cache of sent messages and don't make new request if same message body */}
          {/* large text area with char count - should be grayed out / disabled if !account 
          with message about how you need to have a verified email 
          submit button - should be grayed out / disabled if !account 
          with message about how you need to have a verified email */}
        </div>
      </div>
    </>
  );
};

ContactPage.displayName = "Contact";

export default ContactPage;
