import React, { useEffect, useState } from "react";
import { Card, Space, Button, Input } from "antd";
import "../companyData/CompanyData.scss";
import { toast } from "react-toastify";
import axios from "axios";
import "./editHomePage.scss";

const EditHomePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    faviconURL: "",
    siteLogo: "",
  });
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/pageControl`)
      .then((res) => {
        const pageData = res.data.data.pageData;
        setFormData(pageData);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/pageControl/edit`, formData)
      .then(() => {
        toast.success("Updated successfully", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .catch(() => {
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  return (
    <div>
      <h2>Edit Home Page Data</h2>
      <br />
      <label>Page Title</label>
      <Input
        type="text"
        className="editpage-input"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <label>Page SubTitle</label>
      <Input
        type="text"
        className="editpage-input"
        name="subtitle"
        value={formData.subtitle}
        onChange={handleChange}
      />
      <label>Page Favicon URL</label>
      <Input
        type="text"
        className="editpage-input"
        name="faviconURL"
        onChange={handleChange}
        value={formData.faviconURL}
      />
      <label>Site Logo</label>
      <Input
        type="text"
        className="editpage-input"
        name="siteLogo"
        onChange={handleChange}
        value={formData.siteLogo}
      />
      <Button type="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    </div>
  );
};

export default EditHomePage;
