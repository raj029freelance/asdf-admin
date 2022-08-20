/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { useSignUpMutation } from 'services/auth';
import './SignUpForm.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUsersSuccess } from 'services/userSlice';
import { toast } from 'react-toastify';
const checkValidEmail = (email) => {
  // eslint-disable-next-line
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  return validEmailRegex.test(email);
};

const validateSignup = (email, password, cpassword) => {
  const msg = {
    emailmsg: '',
    passmsg: '',
    cpassmsg: ''
  };
  if (email === '') {
    msg.emailmsg = 'EMAIL MANDATORY';
  }
  if (!checkValidEmail(email)) {
    msg.emailmsg = 'EMAIL INVALID';
  }
  if (password.length < 5) {
    msg.passmsg = 'INVALID PASSWORD';
  }
  if (password !== cpassword) {
    msg.cpassmsg = 'INVALID VERIFICATION';
  }
  return msg;
};
const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passErrMsg, setPassErrMsg] = useState('');
  const [cpassErrMsg, setCpassErrMsg] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [signUp] = useSignUpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {}, []);
  const validateForm = () => {
    setEmailErrMsg('');
    setPassErrMsg('');
    setCpassErrMsg('');
    const msg = validateSignup(email, password, cpassword);
    if (msg.emailmsg === 'EMAIL MANDATORY') {
      setEmailErrMsg('Please Enter your Email address');
    }
    if (msg.emailmsg === 'EMAIL INVALID') {
      setEmailErrMsg('Your Email is Invalid');
    }
    if (msg.passmsg === 'INVALID PASSWORD') {
      setPassErrMsg('PASSWORD LENGTH MUST BE GREATER THAN 5');
    }
    if (msg.cpassmsg === 'INVALID VERIFICATION') {
      setCpassErrMsg('PASSWORD DO NOT MATCH');
    }
    if (msg.emailmsg === '' && msg.passmsg === '' && msg.cpassmsg === '') {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setisLoading(true);
      signUp({
        username: `${firstName} ${lastName}`,
        password: password,
        email: email,
        role: 'admin'
      })
        .then((resp) => {
          localStorage.setItem('token', resp?.data?.token);
          dispatch(getUsersSuccess(resp.data.user));
          navigate('/');
        })
        .catch(() => {
          toast.error('Error occured during registeration', {
            autoClose: 2000,
            pauseOnHover: false
          });
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  };

  const onFinishFailed = () => {};
  return (
    <Card className="SignUpFormcard">
      <h3 className="title">Signup Form</h3>
      <Form name="basic" onFinish={onSubmit} onFinishFailed={onFinishFailed} autoComplete="on">
        <div className="container">
          <Form.Item
            name="FirstName"
            rules={[{ required: true, message: 'Please input your UserName!' }]}
          >
            <Input
              size="large"
              type="text"
              placeholder="First Name"
              style={{ width: '100%' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="LastName"
            rules={[{ required: true, message: 'Please input your UserName!' }]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Last Name"
              style={{ width: '100%' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>
        </div>

        <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
          <Input
            size="large"
            type="text"
            placeholder="Enter your email"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <span style={{ color: 'red' }}>{emailErrMsg}</span>
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
        <span style={{ color: 'red' }}>{passErrMsg}</span>
        <Form.Item
          name="confirmPass"
          rules={[{ required: true, message: 'Please input your password again!' }]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password again"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
          />
        </Form.Item>
        <span style={{ color: 'red' }}>{cpassErrMsg}</span>
        <p>
          Already have an account?
          <Link to="/auth/login">Login</Link>
        </p>
        <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!(firstName && lastName && email && password)}
          >
            {!isLoading ? 'Submit' : <Spin size="small" />}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignUpForm;
