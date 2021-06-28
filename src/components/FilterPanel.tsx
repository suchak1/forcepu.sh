import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Form, Select, DatePicker } from 'antd';

function FilterPanel() {
  return (
    <Layout.Sider
      width={300}
      style={{ borderLeft: '1px solid #aeaeae', marginLeft: 24 }}
    >
      <Form layout="vertical">
        <Collapse defaultActiveKey={['filter']} ghost>
          <Collapse.Panel header="Filter" key="filter">
            <Form.Item label="Exercise" name="exercise">
              <Select defaultValue="*">
                <Select.Option value="*">Anything</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Volume" name="volume">
              <Select defaultValue="*">
                <Select.Option value="*">Any</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Date Range" name="date-range">
              <DatePicker.RangePicker />
            </Form.Item>
            {/* <Form.Item label="Request result" name="request-result">
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
            </Form.Item> */}
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
