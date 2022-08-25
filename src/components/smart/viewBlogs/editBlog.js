import React, { useEffect, useState } from "react";
import { Card, Space, Button, Input, Modal } from "antd";
import "../companyData/CompanyData.scss";
import { toast } from "react-toastify";
import axios from "axios";
import TextEditor from "../textEditor/TextEditor";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "./style.scss";

const EditBlogModal = ({
  isVisible,
  propTitle,
  propId,
  propDescription,
  editorState,
  setEditorState,
  handleClose,
}) => {
  const [faqList, setFaqList] = useState([]);
  const [title, setTitle] = useState(propTitle);

  const handleSubmit = () => {
    const htmlString = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const formData = {
      title,
      description: htmlString,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/faq/edit/${propId}`, formData)
      .then(() => {
        toast.success("Added successfully", {
          autoClose: 2000,
          pauseOnHover: false,
        });
        handleClose();
      })
      .catch(() => {
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  return (
    <>
      <Modal
        className="editBlog-Modal"
        footer={null}
        visible={isVisible}
        onCancel={() => {
          handleClose();
        }}
      >
        <div className="editBlog-container">
          <h2>Edit Blog</h2>
          <br />
          <label>Blog Title</label>
          <Input
            type="text"
            className="editpage-input"
            name="title"
            value={title}
            defaultValue={propTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Blog Description</label>
          <TextEditor
            editorState={editorState}
            setEditorState={setEditorState}
          />
          <br />
          <Button type="primary" onClick={handleSubmit}>
            Post Blog
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditBlogModal;
