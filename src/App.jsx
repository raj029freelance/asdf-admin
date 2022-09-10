import { Space, Spin } from "antd";
import "antd/dist/antd.min.css";
import ProtectedRouter from "components/HOC/ProtectedRouter";
import RequireAuth from "components/HOC/RequireAuth";
import DashBoardLayout from "components/layout/Layout";
import SubmissionsTable from "components/smart/approveSubmissions";
import CompanyData from "components/smart/companyData/CompanyData";
import EditHomePage from "components/smart/editHomePage/editHomePage";
import FaqPage from "components/smart/faqPage/faqPage";
import LoginForm from "components/smart/loginForm/LoginForm";
import RegisterCompany from "components/smart/registerCompany/RegisterCompany";
import SignUpForm from "components/smart/signupForm/SignUpForm";
import UserQueries from "components/smart/userQueries/UserQueries";
import Analytics from "components/smart/analytics/Analytics";
import ViewBlogs from "components/smart/viewBlogs/viewBlogs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsersFail, getUsersSuccess } from "services/userSlice";
import "./App.scss";
import { useVerifyMeQuery } from "./services/auth";

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
              <Route path="approveSubmissions" element={<SubmissionsTable />} />
              <Route path="analytics" element={<Analytics />} />
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
