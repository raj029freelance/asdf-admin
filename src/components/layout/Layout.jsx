import React, { useState } from 'react';
import { Layout, Spin, Space } from 'antd';
import { Outlet } from 'react-router-dom';
import TopBar from 'components/layout/topBar/TopBar';
import SideBar from 'components/layout/sideBar/SideBar';
import './Layout.scss';
import RegisterCompany from 'components/smart/registerCompany/RegisterCompany';
const DashBoardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => {
    setCollapsed((prevState) => !prevState);
  };

  return (
    <Layout className="DashBoardLayout">
      <SideBar collapsed={collapsed} />
      <Layout
        className="site-layout"
        style={!collapsed ? { marginLeft: '200px' } : { marginLeft: '80px' }}
      >
        <TopBar toggle={toggle} collapse={collapsed} />
        {!isLoading ? (
          <div className="main-content">
            <Outlet />
          </div>
        ) : (
          <Space
            style={{ height: '100vh', display: 'flex', justifyContent: 'center' }}
            size="middle"
          >
            <Spin size="small" />
            <Spin />
            <Spin size="large" />
          </Space>
        )}
      </Layout>
    </Layout>
  );
};

export default DashBoardLayout;
