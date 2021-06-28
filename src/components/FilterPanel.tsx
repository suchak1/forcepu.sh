import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Form, Select, DatePicker } from 'antd';

function FilterPanel() {
  return (
    <Layout.Sider
      theme="light"
      width={300}
      style={{ borderLeft: '1px solid #aeaeae', marginLeft: 24 }}
    >
      <Form layout="vertical">
        <Collapse defaultActiveKey={['access']} ghost>
          <Collapse.Panel header="Access" key="access">
            <Form.Item label="What data" name="what-data">
              <Select defaultValue="*">
                <Select.Option value="*">Anything</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Who attempted" name="who-attempted">
              <Select defaultValue="*">
                <Select.Option value="*">Anyone</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="When attempted" name="when-attempted">
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item label="Request result" name="request-result">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['granted', 'rejected']}
              >
                <Select.Option value="granted">Granted</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Layout.Sider>
  );
}

export default connect(({ filter, loading }) => ({
  filter,
  loading: loading.models.filter,
}))(FilterPanel);
