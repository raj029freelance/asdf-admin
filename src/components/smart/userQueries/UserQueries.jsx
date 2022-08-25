import React, { useEffect, useState } from "react";
import { Card, Space, Button, Input } from "antd";
import { Table } from "antd";
import "../companyData/CompanyData.scss";
import {
  useGetUserQueriesQuery,
  useEditUserQueriesMutation,
} from "services/organization";
import { toast } from "react-toastify";
import axios from "axios";

const UserQueries = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [note, setNote] = useState("");
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetUserQueriesQuery();
  const [editUserQueries] = useEditUserQueriesMutation();

  const editHandler = (record) => {
    const newRecord = {};
    for (var key in record) newRecord[key] = record[key];
    newRecord.resolved = true;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/organizations/query/edit/${record._id}`,
        newRecord
      )
      .then(() => {
        getQueries();
        toast.success("Query updated", {
          pauseOnHover: false,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  const handleSubmit = (record) => {
    const newRecord = {};
    for (var key in record) newRecord[key] = record[key];
    newRecord.note = note;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/organizations/query/edit/${record._id}`,
        newRecord
      )
      .then(() => {
        getQueries();
        toast.success("Query updated", {
          pauseOnHover: false,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  useEffect(() => {
    if (data) {
      setAllOrders(data?.queries);
    }
  }, [data]);
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Note (Visible to admin only)",
      dataIndex: "note",
      key: "note",
      render: (_, record) => {
        return (
          <>
            <Input
              type="text"
              name="note"
              onChange={(e) => setNote(e.target.value)}
              defaultValue={record.note}
              style={{ width: "80%" }}
            />
            <Button type="primary" onClick={() => handleSubmit(record)}>
              Update
            </Button>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (!record.resolved) {
          return (
            <Space size="middle">
              <Button type="danger" onClick={() => editHandler(record)}>
                Mark as resolved
              </Button>
            </Space>
          );
        } else {
          return <p>Resolved</p>;
        }
      },
      hidden: false,
    },
  ].filter((column) => column?.hidden !== true);

  const handleChange = (pagination) => {
    setPage(pagination.current);
  };

  const getQueries = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/organizations/query/`)
      .then((res) => {
        setAllOrders(res.data.queries);
      })
      .catch((err) => {
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  return (
    <>
      <div className="ordersWrapper">
        <Card title={<div className="title">All Data</div>}>
          <Table
            columns={columns}
            dataSource={allOrders}
            loading={isLoading}
            onChange={handleChange}
          />
        </Card>
      </div>
    </>
  );
};

export default UserQueries;
