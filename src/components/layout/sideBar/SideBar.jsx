import React from "react";
import PropTypes from "prop-types";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./SideBar.scss";

const { Sider } = Layout;
const Routes = [
  {
    path: "/",
    name: "Register Company",
  },
  {
    path: "/companyFields",
    name: "Company Data",
  },
  {
    path: "/userQueries",
    name: "User Queries",
  },
  {
    path: "/editHomePage",
    name: "Edit Home Page",
  },
  {
    path: "/addblog",
    name: "Add Blog",
  },
  {
    path: "/manageblog",
    name: "Manage Blogs",
  },
];
const SideBar = ({ collapsed }) => {
  const generateLinks = () => {
    const links = Routes.map((route, key) => {
      return (
        <Menu.Item key={`${key}`} icon={<UserOutlined />}>
          <Link to={`${route.path}`}>{route.name}</Link>
        </Menu.Item>
      );
    });
    return links;
  };

  return (
    <Sider
      className="SideBar"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {!collapsed ? (
        <h3 className="logo">SideBar</h3>
      ) : (
        <h3 className="logo">SB</h3>
      )}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["0"]}>
        {generateLinks()}
      </Menu>
    </Sider>
  );
};

SideBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

export default SideBar;
