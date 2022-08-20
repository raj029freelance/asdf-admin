import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { useLoginMutation } from 'services/auth';
import './LoginForm.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getUsersFail, getUsersSuccess } from 'services/userSlice';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  useEffect(() => {}, []);
  const onSubmit = async (values) => {
    setisLoading(true);
    login({ email: email, password: password })
      .unwrap()
      .then((resp) => {
        localStorage.setItem('token', resp.token);
        dispatch(getUsersSuccess(resp.user));
        navigate('/');
      })
      .catch((err) => {
        dispatch(getUsersFail());
        toast.error(err?.data?.message, {
          autoClose: 2000,
          pauseOnHover: false
        });
        console.log(err, 'error here');
      })
      .finally(() => {
        setisLoading(false);
      });
    console.log('Entered', values);
  };

  const onFinishFailed = () => {};
  return (
    <Card className="LoginFormcard">
      <h3 className="title">Login Form</h3>
      <Form name="basic" onFinish={onSubmit} onFinishFailed={onFinishFailed} autoComplete="off">
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
          <Input
            size="large"
            type="email"
            placeholder="Enter your email"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <p>
          Do not have an account Yet?
          <Link to="/auth/register">Signup</Link>
        </p>
        <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={!email}>
            {isLoading ? <Spin size="small" /> : 'Login'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;
