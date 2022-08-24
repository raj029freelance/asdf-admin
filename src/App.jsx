import "./App.scss";
import "antd/dist/antd.min.css";
import { Routes, Route } from "react-router-dom";
import { Space, Spin } from "antd";
import DashBoardLayout from "components/layout/Layout";
import LoginForm from "components/smart/loginForm/LoginForm";
import SignUpForm from "components/smart/signupForm/SignUpForm";
import ProtectedRouter from "components/HOC/ProtectedRouter";
import RegisterCompany from "components/smart/registerCompany/RegisterCompany";
import CompanyData from "components/smart/companyData/CompanyData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequireAuth from "components/HOC/RequireAuth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUsersFail, getUsersSuccess } from "services/userSlice";
import { useVerifyMeQuery } from "./services/auth";
import UserQueries from "components/smart/userQueries/UserQueries";
import EditHomePage from "components/smart/editHomePage/editHomePage";
import FaqPage from "components/smart/faqPage/faqPage";
import ViewBlogs from "components/smart/viewBlogs/viewBlogs";

function App() {
  const { data, isLoading } = useVerifyMeQuery(
    {},
    { skip: !localStorage.getItem("token") }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        dispatch(getUsersSuccess(data.user));
      } else {
        dispatch(getUsersFail());
        localStorage.removeItem("token");
      }
    }
  }, [data, isLoading]);
  return (
    <>
      {isLoading ? (
        <Space
          style={{ height: "100vh", display: "flex", justifyContent: "center" }}
          size="middle"
        >
          <Spin size="small" />
          <Spin />
          <Spin size="large" />
        </Space>
      ) : (
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <DashBoardLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<RegisterCompany />} />
              <Route path="companyFields" element={<CompanyData />} />
              <Route path="userQueries" element={<UserQueries />} />
              <Route path="editHomePage" element={<EditHomePage />} />
              <Route path="addblog" element={<FaqPage />} />
              <Route path="manageblog" element={<ViewBlogs />} />
            </Route>
            <Route path="auth" element={<ProtectedRouter />}>
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<SignUpForm />} />
            </Route>
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
