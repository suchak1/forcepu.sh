import React from 'react';
import { Typography, Timeline } from 'antd';
import {
  CheckCircleFilled,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  CloseSquareOutlined,
  CodeOutlined,
  FileTextOutlined,
  MailOutlined,
  PlusCircleFilled,
  StopFilled,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

function styleTimeline({ type }) {
  switch (type) {
    case 'create':
      return { color: 'blue', dot: <PlusCircleFilled /> };
    case 'grant':
      return { color: 'green', dot: <CheckSquareOutlined /> };
    case 'revoke':
      return { color: 'red', dot: <CloseSquareOutlined /> };
    case 'access':
      return { color: 'green', dot: <CheckCircleFilled /> };
    case 'reject':
      return { color: 'red', dot: <CloseCircleFilled /> };
    default:
      return { color: 'grey' };
  }
}

function renderAction({ type, subject }) {
  let text;
  switch (type) {
    case 'create':
      text = <Text strong>created</Text>;
      break;
    case 'grant':
      text = (
        <>
          <Text strong type="warning">
            granted{' '}
          </Text>
          <Text underline>{subject}</Text>
          <Text> access to</Text>
        </>
      );
      break;
    case 'revoke':
      text = (
        <>
          <Text strong type="warning">
            revoked{' '}
          </Text>
          <Text underline>{subject}</Text>
          <Text> access to</Text>
        </>
      );
      break;
    case 'access':
      text = (
        <Text type="success" strong>
          accessed
        </Text>
      );
      break;
    case 'reject':
      text = (
        <Text type="danger" strong>
          couldn't access
        </Text>
      );
      break;
    default:
      text = <Text strong>{type}</Text>;
      break;
  }

  return (
    <>
      <span className="timeline-item-action">{text}</span>&nbsp;
    </>
  );
}

function renderSubject({ type, name }) {
  let icon;
  switch (type) {
    case 'email':
      icon = <MailOutlined />;
      break;
    case 'drive':
      icon = <FileTextOutlined />;
      break;
    case 'sdk':
      icon = <CodeOutlined />;
      break;
  }

  return (
    <>
      <span className="timeline-item-subject">{icon}</span>{' '}
      <span className="timeline-item-subject">{name}</span>
    </>
  );
}

function renderActor(user) {
  return (
    <>
      <UserOutlined />{' '}
      <Text underline className="timeline-item-actor">
        {user}
      </Text>
    </>
  );
}

function renderStreamlet({ id, date, user, action, policy }) {
  return (
    <Timeline.Item key={id} {...styleTimeline(action)}>
      {renderActor(user)} {renderAction(action)} {renderSubject(policy)}
      &nbsp; &nbsp;
      <ClockCircleOutlined /> {date}
    </Timeline.Item>
  );
}

export default function AuditStream({stream = []}) {
  return <Timeline>{stream.map((streamlet) => renderStreamlet(streamlet))}</Timeline>;
}
