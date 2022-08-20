import React, { useEffect, useState } from 'react';
import { Card, Space, Button } from 'antd';
import { Table } from 'antd';
import '../companyData/CompanyData.scss';
import { useGetUserQueriesQuery, useDeleteUserMutation } from 'services/organization';
import { toast } from 'react-toastify';

const UserQueries = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetUserQueriesQuery();
  const [deleteOrganization] = useDeleteUserMutation();

  const deleteHandler = (_id) => {
    deleteOrganization({ _id: _id })
      .then(() => {
        toast.success('Query resolved', {
          pauseOnHover: false,
          autoClose: 2000
        });
      })
      .catch((err) => {
        toast.error('Some Problem Occured!', {
          autoClose: 2000,
          pauseOnHover: false
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
      title: 'id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {},
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="danger" onClick={() => deleteHandler(record?._id)}>
              resolved?
            </Button>
          </Space>
        );
      },
      hidden: false
    }
  ].filter((column) => column?.hidden !== true);

  const handleChange = (pagination) => {
    setPage(pagination.current);
  };
  console.log(allOrders, 'all');
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
