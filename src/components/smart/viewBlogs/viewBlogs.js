import React, { useEffect, useState } from "react";
import { Card, Space, Button, Table, Modal } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import EditBlogModal from "./editBlog";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

const ViewBlogs = () => {
  const { role } = useSelector((state) => state.user.user);
  const [blogsList, setBlogsList] = useState([]);
  const [isVisible, setModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [editorState, setEditorState] = useState("");

  const columns = [
    {
      title: "Blog Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
    },
    {
      title: "Blog Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (_, record) => {
        if (record.description.length > 90) {
          return record.description.slice(0, 90) + "...";
        } else {
          return record.description;
        }
      },
    },
    {
      title: "Action",
      key: "action",

      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="danger" onClick={() => deleteHandler(record?._id)}>
              Delete
            </Button>
            <Button type="primary" onClick={() => editHandler(record)}>
              Edit
            </Button>
          </Space>
        );
      },
      hidden: role === "admin" ? false : true,
    },
  ].filter((column) => column.hidden !== true);

  const getBlogs = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/faq`)
      .then((res) => {
        setBlogsList(res.data.data);
      })
      .catch((err) => {
        toast.error("Some Problem Occured in fetching blogs!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  const deleteHandler = (id) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/faq/delete/${id}`)
      .then(() => {
        getBlogs();
        toast.success("Deleted Successfully!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .catch((err) => {
        toast.error("Deleted Failed!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  const editHandler = (record) => {
    setSelectedRecord(record);
    const contentBlock = htmlToDraft(record.description);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
    setModal(true);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <>
      <EditBlogModal
        isVisible={isVisible}
        propId={selectedRecord._id}
        propTitle={selectedRecord.title}
        propDescription={selectedRecord.description}
        editorState={editorState}
        setEditorState={setEditorState}
        handleClose={() => {
          setModal(false);
        }}
      />
      <h2>Your Blogs</h2>
      <Table columns={columns} dataSource={blogsList} />
    </>
  );
};

export default ViewBlogs;
