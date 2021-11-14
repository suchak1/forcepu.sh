import React from "react";
import { connect } from "dva";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Layout, Typography, Table, Input } from "antd";
import {
  CheckOutlined,
  StopOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import FilterPanel from "@/components/FilterPanel";
import styles from "./index.less";
// import { GymService } from "./service";

const { Title, Text } = Typography;

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    fixed: "left",
    render(date: string) {
      return format(Date.parse(date), "yyyy-MM-dd");
    },
  },
  {
    title: "Id",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Weight",
    dataIndex: "Weight",
    key: "Weight",
  },
  {
    title: "Reps",
    dataIndex: "Reps",
    key: "Reps",
  },
  {
    title: "Exercise",
    dataIndex: "Exercise",
    key: "Exercise",
  },
  {
    title: "Volume",
    dataIndex: "Volume",
    key: "Volume",
  },
  {
    title: "1RM",
    dataIndex: "1RM",
    key: "1RM",
  },
];

const GymPage = ({ dispatch, gym, _loading }) => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  // const gymService = new GymService();

  useEffect(() => {
    (async () => {
      const url =
        process.env.REACT_APP_ENV === "dev"
          ? "/api/exercise_log"
          : "https://api.forcepu.sh/exercise_log";
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => setLog(data))
        .then(() => setLoading(false));
    })();
  }, []);

  return (
    // <Layout>
    //   <Layout.Content style={{ padding: 24 }}>
    <>
      <Title>Exercise Log</Title>
      <Input.Search
        size="large"
        prefix={<SearchOutlined />}
        allowClear
        enterButton="Search"
        style={{ marginBottom: 16 }}
      />
      <Text>{log.length} results</Text>
      <Table
        loading={
          loading && {
            indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
          }
        }
        columns={columns}
        dataSource={log}
        pagination={{ position: ["topRight", "bottomRight"] }}
        // sticky
      />
    </>
  );
};

GymPage.displayName = "Gym";

export default connect(({ gym, loading }) => ({
  gym,
  loading: loading.models.gym,
}))(GymPage);
