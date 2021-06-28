import React from 'react';
import { connect } from 'dva';
import {format} from 'date-fns';
import { Layout, Typography, Table, Input } from 'antd';
import { CheckOutlined, StopOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import FilterPanel from '@/components/FilterPanel';

const { Title, Text } = Typography;

const columns = [
  {
    title: 'What data',
    dataIndex: 'dataContext',
    key: 'dataContext',
    width: 100,
  },
  {
    title: 'What happened',
    dataIndex: 'actionType',
    key: 'actionType',
    width: 60,
  },
  {
    title: 'Who attempted',
    dataIndex: 'actionActor',
    key: 'actionActor',
    width: 100,
  },
  {
    title: 'When attempted',
    dataIndex: 'actionOn',
    key: 'actionOn',
    width: 100,
    render(date: string) {
      return format(Date.parse(date), 'yyyy-MM-dd KK:mmaaa OOO')
    }
  },
  {
    title: 'Request result',
    dataIndex: 'actionStatus',
    key: 'actionStatus',
    width: 100,
    render(result) {
      switch (result) {
        case 'granted':
          return <><CheckOutlined /> Granted</>
        case 'denied':
          return <><StopOutlined /> Denied</>
        default:
          return ''
      }
    }
  },
  // Actions
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 65,
    render: () => (<span><a>Investigate</a> | <a>Revoke</a></span>)
  },
]

function AuditPage({ dispatch, audit, loading }) {
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Layout.Content style={{ backgroundColor: 'white', padding: 24 }}>
        <Title>TDF Activity</Title>
        <Input.Search size="large" prefix={<SearchOutlined />} allowClear enterButton="Search" style={{ marginBottom: 16 }} />
        <Text>{audit.total} results</Text>
        <Table
          loading={loading && { indicator: <LoadingOutlined style={{ fontSize: 24 }} spin /> }}
          columns={columns}
          dataSource={audit.list} 
          scroll={{ x: 1500 }}
          pagination={{ position: ['topRight', 'bottomRight'] }}
          // sticky
        />
      </Layout.Content>
      <FilterPanel />
    </Layout>
  );
}

AuditPage.displayName = 'Audit'

export default connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit,
}))(AuditPage)