import { Button, Input, Modal } from "antd";
import axios from "axios";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useState } from "react";
import { toast } from "react-toastify";
import "../companyData/CompanyData.scss";
import TextEditor from "../textEditor/TextEditor";
import "./style.scss";

const EditBlogModal = ({
  isVisible,
  propTitle,
  propId,
  propDescription,
  editorState,
  setEditorState,
  handleClose,
  getBlogsList,
}) => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(propTitle);

  const handleSubmit = () => {
    const htmlString = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const formData = {
      title,
      description: htmlString,
    };
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/faq/edit/${propId}`, formData)
      .then(() => {
        getBlogsList();
        toast.success("Added successfully", {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some Problem Occured!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setLoading(false);
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
          <Button type="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating" : "Update Blog"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditBlogModal;
