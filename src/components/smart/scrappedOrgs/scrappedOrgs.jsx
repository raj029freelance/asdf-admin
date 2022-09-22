import { Button, Space, Table } from "antd";
import axios from "axios";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAddOrganizationsMutation,
  useDeleteOrganizationMutation,
  useGetPaginatedOrganizationsQuery,
  useEditOrganizationMutation,
  useLazySearchByCompanyNameQuery,
} from "services/organization";
import { useSelector } from "react-redux";
import ConfirmationModal from "../confirmationModal/confirmationModal";

const ExtrernallyAddedOrgs = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [companyToBeDeleted, setCompanyToBeDeleted] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModal] = useState(false);
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const { role } = useSelector((state) => state.user.user);

  const openConfirmationModal = (companyId) => {
    setCompanyToBeDeleted(companyId);
    setConfirmationModal(true);
  };

  const deleteHandler = (_id) => {
    deleteOrganization({ _id: _id })
      .then(() => {
        if (blogsList && blogsList.length > 0) {
          const updatedList = blogsList.filter((result) => result._id !== _id);
          setBlogsList(updatedList);
        }
        toast.success("Organization Succesfully Deleted", {
          pauseOnHover: false,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Problem Deleting Organization", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

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
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              type="danger"
              onClick={() => openConfirmationModal(record?._id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
      hidden: role === "admin" ? false : true,
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
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        handleClose={() => {
          setConfirmationModal(false);
        }}
        handleSubmit={() => {
          if (companyToBeDeleted) {
            setConfirmationModal(false);
            deleteHandler(companyToBeDeleted);
          }
        }}
      />
      <h2>Externally Added Orgs</h2>

      <Table columns={columns} dataSource={blogsList} />
    </>
  );
};

export default ExtrernallyAddedOrgs;
