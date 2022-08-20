import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './TopBar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersFail } from 'services/userSlice';
const { Header } = Layout;
const TopBar = ({ toggle, collapse }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  return (
    <Header className="site-layout-background">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {collapse ? (
          <MenuUnfoldOutlined className="trigger" onClick={toggle} />
        ) : (
          <MenuFoldOutlined className="trigger" onClick={toggle} />
        )}
      </div>
      <div className="USERLOGO">
        <p className="UserName">{`${user?.username}`} </p>
        <Button
          type="primary"
          onClick={() => {
            localStorage.removeItem('token');
            dispatch(getUsersFail());
          }}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

TopBar.propTypes = {
  collapse: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};
export default TopBar;
