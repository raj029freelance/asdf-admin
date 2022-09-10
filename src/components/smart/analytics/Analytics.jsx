import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

const Analytics = () => {
  const [data, setData] = useState({
    zeroTerms: [],
    topTerms: [],
  });
  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/analytics/get/9-2022`
      );
      //   console.log(res);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      title: "Term",
      dataIndex: "term",
      key: "term",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
  ];
  return (
    <div>
      <div className="top">
        <h2>Most Search Keywords</h2>
        <Table
          columns={columns}
          dataSource={data.topTerms}
          pagination={{ pageSize: 20 }}
        />
        <hr />
        <h2 style={{ marginTop: 20, marginBottom: 20 }}>
          {" "}
          Keywords that returned Zero results
        </h2>
        <Table
          columns={columns}
          dataSource={data.zeroTerms}
          pagination={{ pageSize: 20 }}
        />
      </div>
    </div>
  );
};

export default Analytics;
