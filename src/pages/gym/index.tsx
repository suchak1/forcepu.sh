import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { Layout, Typography, Table, Input } from "antd";
import {
  CheckOutlined,
  StopOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FilterPanel from "@/components/FilterPanel";

const { Title, Text } = Typography;
//
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    fixed: "left",
    render(date: string) {
      return format(Date.parse(date), "yyyy-MM-dd");
    },
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Weight",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "Reps",
    dataIndex: "reps",
    key: "reps",
  },
  {
    title: "Exercise",
    dataIndex: "exercise",
    key: "exercise",
  },
  {
    title: "Volume",
    dataIndex: "volume",
    key: "volume",
  },
  // {
  //   title: 'Request result',
  //   dataIndex: 'actionStatus',
  //   key: 'actionStatus',
  //   width: 100,
  //   render(result) {
  //     switch (result) {
  //       case 'granted':
  //         return <><CheckOutlined /> Granted</>
  //       case 'denied':
  //         return <><StopOutlined /> Denied</>
  //       default:
  //         return ''
  //     }
  //   }
  // },
  // Actions
];

function GymPage({ dispatch, gym, loading }) {
  // fetch('/api/exercise_log', { method: 'GET' })
  //   .then(response => response.json())
  //   .then(data => console.log(data));
  return (
    <Layout>
      <Layout.Content style={{ padding: 24 }}>
        <Title>Exercise Log</Title>
        <Input.Search
          size="large"
          prefix={<SearchOutlined />}
          allowClear
          enterButton="Search"
          style={{ marginBottom: 16 }}
        />
        <Text>{gym.total} results</Text>
        <Table
          loading={
            loading && {
              indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
            }
          }
          columns={columns}
          dataSource={gym.list}
          pagination={{ position: ["topRight", "bottomRight"] }}
          // sticky
        />
      </Layout.Content>
      <FilterPanel />
    </Layout>
  );
}

GymPage.displayName = "Gym";

export default connect(({ gym, loading }) => ({
  gym,
  loading: loading.models.gym,
}))(GymPage);
