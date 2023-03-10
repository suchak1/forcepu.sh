import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Segmented, Tooltip, Badge, Card, Button, Spin, Alert, Select, Input, Popover } from "antd";
import { getApiUrl, getDayDiff, get3DCircle, linspace } from "@/utils";
import pageStyles from "@/pages/home/index.module.less";
import layoutStyles from "@/layouts/index.module.less";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountContext } from "../../layouts";
import CUBE from "../../../assets/cube.gif";
import { headerHeight } from "../../layouts";

import overrides from "./index.module.less";

import styled from "styled-components";

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
const spinner = <Spin style={{ width: "100%" }} indicator={antIcon} />;

const ContactPage = () => {
  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const { account, setShowLogin } = useContext(
    AccountContext
  );
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [subjectStatus, setSubjectStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState('');

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
    const { idToken } = loggedIn.signInUserSession;
    const url = `${getApiUrl()}/contact`;
    fetch(url, {
      method: "POST",
      headers: { Authorization: idToken.jwtToken },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to send message.');
        }
        return response.json();
      })
      .then((data) => window.location.href = data)
      .catch((err) => console.error(err))
      .finally(() => setContactLoading(false));
  };

  let form = <div style={{
    height: `calc(100% - ${headerHeight + 1}px)`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }}>
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
      className={layoutStyles.start}
      style={{ width: '100%' }}
      disabled={!(account && subject && message)}
      onClick={onContact}
      loading={contactLoading}
    >
      Submit
    </Button>
    {/* add alert or notification on successful and unsuccessful contact message */}
    {/* keep cache of sent messages and don't make new request if same message body */}
    {/* large text area with char count - should be grayed out / disabled if !account 
      with message about how you need to have a verified email 
      submit button - should be grayed out / disabled if !account 
      with message about how you need to have a verified email */}
    {/* div around whole contact form with tooltip/popover if !account */}
    {/* tooltip/popover message should say to login if !loggedIn and to verify otherwise */}
    {/* handle 4xx and 5xx errors according, also handle response.ok green notification */}
    {/* use Result if successful */}
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

      {form}
    </>
  );
};

ContactPage.displayName = "Contact";

export default ContactPage;
