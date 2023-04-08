import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, notification, Tooltip, Badge, Card, Button, Spin, Alert, Select, Input, Popover, Result, Switch } from "antd";
import { getApiUrl, getDayDiff, get3DCircle, linspace } from "@/utils";
import pageStyles from "@/pages/home/index.module.less";
import layoutStyles from "@/layouts/index.module.less";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountContext } from "../../layouts";
import CUBE from "../../../assets/cube.gif";
import { headerHeight } from "../../layouts";
import overrides from "@/pages/alerts/index.module.less";

import "./index.module.less";

import styled from "styled-components";

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
const spinner = <Spin style={{ width: "100%" }} indicator={antIcon} />;

const AlertsPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, setShowLogin } = useContext(
    AccountContext
  );
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [subjectStatus, setSubjectStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [resultProps, setResultProps] = useState({});
  const [sentMessages, setSentMessages] = useState(new Set());

  const contentStyle = {
    height: `calc(100% - ${headerHeight + 1}px)`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const onSuccess = () => {
    setSubject('');
    setMessage('');
    setResultProps({
      status: 'success',
      title: 'Success!',
      subTitle: 'Your message was sent.',
      extra:
        [
          <Button
            className={layoutStyles.start}
            onClick={() => setResultProps({})}
          >
            Return to contact form
          </Button>
        ]
    });
  }
  const onError = () => {
    setResultProps({
      status: 'error',
      title: 'Failure',
      subTitle: 'Your message was not sent.',
      extra:
        [
          <Button
            className={subStyles.subscribe}
            onClick={() => setResultProps({})}
          >
            Return to contact form
          </Button>
        ]
    });
  }
  const onContact = () => {
    if (!subject) {
      setSubjectStatus('error')
    }
    if (!message) {
      setMessageStatus('error')
    }
    if (!(subject && message)) {
      return;
    }
    setSubjectStatus('')
    setMessageStatus('')
    setContactLoading(true);
    const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
    const url = `${getApiUrl()}/contact`;
    if (sentMessages.has(message)) {
      onSuccess();
      setContactLoading(false);
    } else {
      fetch(url, {
        method: "POST",
        headers: { Authorization: jwtToken },
        body: JSON.stringify({ subject, message }),
      })
        .then((response) => {
          if (response.ok) {
            setSentMessages((prevSet) => new Set(prevSet).add(message))
            onSuccess();
          } else {
            onError();
          }
        })
        .catch(() => onError())
        .finally(() => setContactLoading(false));
    }
  };

  let form = <div style={contentStyle}>
    <Select
      onChange={(dropdown) => {
        if (subjectStatus && dropdown) {
          setSubjectStatus('')
        }
        setSubject(dropdown)
      }}
      style={{
        width: '100%',
        marginBottom: '16px'
      }}
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
      status={subjectStatus}
    >
    </Select>
    <Input.TextArea
      disabled={!account}
      placeholder='Write your message here.'
      style={{
        height: '100%',
        width: '100%',
        resize: 'none',
        marginBottom: '32px'
      }}
      // showCount must be bool or fx
      showCount={Boolean(account)}
      maxLength={2500}
      status={messageStatus}
      onChange={(event) => {
        const newMessage = event.target.value;
        if (messageStatus && newMessage) {
          setMessageStatus('')
        }
        setMessage(event.target.value)
      }}
    />
    <Button
      className={(account && subject && message) && subStyles.subscribe}
      style={{ width: '100%' }}
      disabled={!(account && subject && message)}
      onClick={onContact}
      loading={contactLoading}
    >
      Submit
    </Button>
  </div>;
  if (!(account && loggedIn)) {
    form =
      <Popover
        onClick={() => !loggedIn && setShowLogin(true)}
        title="🔒 Action Needed"
        content={loggedIn ? "Verify your email to send a message." : <Button onClick={() => setShowLogin(true)} className={layoutStyles.start}>Sign in to send a message.</Button>}
        placement="bottom"
        align={{
          targetOffset: ["0%", "50%"],
        }}
      >
        {form}
      </Popover>
  }
  return (
    <>
      <Title>Notifications</Title>
      {/* Use Toggle or Segmented! to turn on or off notifications */}
      {/* red alert if not loggedIn- exact message in keep */}
      {/* yellow alert if subscription not active or not in beta - exact message in keep */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: contentStyle.height
        // alignItems: 'center'
      }}>
        <div
          style={{
            display: 'flex',
            height: '100%'
            // flexDirection: 'column'
            // maxWidth: '600px' 
          }}
          className={overrides.alerts}
        >
          <div className={overrides.column}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '300px' }}>
              <Title level={2} style={{ margin: 0 }}>Email</Title>
              <Switch />
            </div>
            Receive an email when a new signal is detected.
            <br />
            (For manual trading, this is the preferred notification type.)
          </div>
          <div className={overrides.column}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '300px' }}>
              <Title level={2} style={{ margin: 0 }}>Webhook</Title>
              <Switch checked disabled />
            </div>
            Receive a webhook event when a new signal is detected.
            <br />
            (For automated trading, this is the preferred notification type.)
            <div style={{ display: 'flex' }}><Input placeholder="https://api.domain.com/route" /><Button>Save</Button></div>
            <br />
            Sample code:
          </div>
          <div className={overrides.column} style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '300px' }}>
              <Title level={2} style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)' }}>SMS</Title>
              <Switch disabled />
            </div>
            <Input disabled placeholder="+1 (555) 555-5555" />
            Coming soon...
          </div>
        </div>
        bull image on left, bear image on right
        or bull left middle, bear left bottom (both under email in the left col), and webhook stuff in the middle col
        show toasts when alert is saved
        show warning alert on top for those not in beta or not subscribed
        disable input/toggles if not signed in + tooltips + redirect to sign in model
        write sentence about how signals come in between 12:00-12:10 UTC
        Write sentence or question mark hover tooltip about how email is preferred notification for manual traders
        and webhook is preferred notification for automated trading systems
      </div>
    </>
  );
};

AlertsPage.displayName = "Alerts";

export default AlertsPage;
