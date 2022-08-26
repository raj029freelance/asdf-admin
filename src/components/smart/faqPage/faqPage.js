import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import "../companyData/CompanyData.scss";
import { toast } from "react-toastify";
import axios from "axios";
import "./faqPage.scss";
import TextEditor from "../textEditor/TextEditor";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const FaqPage = () => {
  const [faqList, setFaqList] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/faq`)
      .then((res) => {
        setFaqList(res.data.data);

        // const pageData = res.data.data.pageData;
        // setFormData(pageData);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const htmlString = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    if (title.length < 3 || htmlString.length < 2) {
      setLoading(false);
      return;
    }

    const formData = {
      title,
      description: htmlString,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/faq/create`, formData)
      .then(() => {
        setLoading(false);
        toast.success("Added successfully", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .catch(() => {
        setLoading(false);
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  return (
    <div className="faqPage-container">
      <h2>Add a new Faq</h2>
      <br />
      <label>Blog Title</label>
      <Input
        type="text"
        className="editpage-input"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Blog Description</label>
      <TextEditor
        editorState={editorState}
        setEditorState={setEditorState}
        style={{ height: "400px" }}
      />
      <br />
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        {loading ? "Posting" : "Post Blog"}
      </Button>
    </div>
  );
};

export default FaqPage;
