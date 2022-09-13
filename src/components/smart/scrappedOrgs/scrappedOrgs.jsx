import { Button, Space, Table } from "antd";
import axios from "axios";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ExtrernallyAddedOrgs = () => {
  const [blogsList, setBlogsList] = useState([]);

  const columns = [
    {
      title: "Company Name",
      dataIndex: "CompanyName",
      key: "CompanyName",
      width: "50%",
    },
    {
      title: "CompanyPhone",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      width: "50%",
    },
  ].filter((column) => column.hidden !== true);

  const getExternallyAddedOrgs = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/organizations/externalorgs`)
      .then((res) => {
        setBlogsList(res.data.data);
      })
      .catch((err) => {
        toast.error("Some Problem Occured in fetching orgs!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  useEffect(() => {
    getExternallyAddedOrgs();
  }, []);

  return (
    <>
      <h2>Externally Added Orgs</h2>
      <Table columns={columns} dataSource={blogsList} />
    </>
  );
};

export default ExtrernallyAddedOrgs;
