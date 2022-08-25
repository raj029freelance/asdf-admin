import React, { useEffect, useState } from "react";
import { Card, Space, Button, Table, Modal } from "antd";
import "./CompanyData.scss";
import {
  useAddOrganizationsMutation,
  useDeleteOrganizationMutation,
  useGetPaginatedOrganizationsQuery,
  useEditOrganizationMutation,
  useLazySearchByCompanyNameQuery,
} from "services/organization";
import { useFormik } from "formik";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import * as Yup from "yup";
import ExcelReader from "components/presentational/excelReader/ExcelReader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import EditOrganizationForm from "./EditCompanyDataModal";
import Search from "antd/lib/input/Search";

import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

const initialState = {
  CompanyName: "",
  PhoneNumber: "",
  DepartmentYourCalling: "Customer Service",
  CallBackAvailable: "NO",
  CallPickedUpByARealPerson: "NO",
  BestTimeToDail: "",
  serviceHours: 1,
  serviceDays: 1,
  CallCenterHours: "24 hours, 7 days",
  description: "",
};
const validationSchema = Yup.object().shape({
  CompanyName: Yup.string().required("Company Name required"),
  PhoneNumber: Yup.string().required("Phone Number required"),
  DepartmentYourCalling: Yup.string().required(
    "Enter Department you are calling"
  ),
  BestTimeToDail: Yup.string().required("Best Time to Dail required"),
  CallCenterHours: Yup.string().required("Call Center Hours is required"),
});

const CompanyData = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [allOrders, setAllOrders] = useState([]);
  const [searchReturnedResults, setSearchReturnedResults] = useState(undefined);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [editorState, setEditorState] = useState("");
  const [isModalVisible, setModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(initialState);

  const [addOrganizations] = useAddOrganizationsMutation();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [editOrganization] = useEditOrganizationMutation();

  const [search, { data: searchResults, isLoading: isSearching }] =
    useLazySearchByCompanyNameQuery();

  const { data, isLoading } = useGetPaginatedOrganizationsQuery({
    page,
    limit,
  });

  const { role } = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!data) return;
    setAllOrders(data?.data?.organizations?.docs);
  }, [data]);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchReturnedResults(undefined);
      return;
    }
    onSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchResults) return;
    if (searchResults.results === 0) {
      setSearchReturnedResults([]);
      return;
    }
    setSearchReturnedResults(searchResults.data.organizations.slice(0, 10));
  }, [searchResults]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selectedOrg,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const htmlString = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      editOrganization({
        _id: values._id,
        data: { ...values, description: htmlString },
      })
        .unwrap()
        .then(() => {
          setModal(false);
          if (searchReturnedResults && searchReturnedResults.length > 0) {
            const newList = searchReturnedResults.map((result) =>
              result._id === values._id
                ? { ...values, description: htmlString }
                : result
            );
            setSearchReturnedResults(newList);
          }

          toast.success("Organization details updated Successfully", {
            autoClose: 2000,
            pauseOnHover: false,
          });
        })
        .catch((err) => {
          toast.error(`${err}`, {
            autoClose: 2000,
            pauseOnHover: false,
          });
        });
    },
  });

  const deleteHandler = (_id) => {
    deleteOrganization({ _id: _id })
      .then(() => {
        if (searchReturnedResults.length > 0) {
          const updatedList = searchReturnedResults.filter(
            (result) => result._id !== _id
          );
          setSearchReturnedResults(updatedList);
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

  const editHandler = (companyRecord) => {
    setSelectedOrg(companyRecord);

    const contentBlock = htmlToDraft(companyRecord.description);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }

    setModal(true);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "CompanyName",
      key: "CompanyName",
    },
    {
      title: "Company Url",
      dataIndex: "CompanyUrl",
      key: "CompanyUrl",
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "CallBack Available",
      dataIndex: "CallBackAvailable",
      key: "CallBackAvailable",
    },
    {
      title: "Call Picked",
      dataIndex: "CallPickedUpByARealPerson",
      key: "CallPickedUpByARealPerson",
    },
    {
      title: "Call-Center Hours",
      dataIndex: "CallCenterHours",
      key: "CallCenterHours",
    },
    {
      title: "Department",
      dataIndex: "DepartmentYourCalling",
      key: "DepartmentYourCalling",
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

  const handleChange = (pagination) => {
    setPage(pagination.current);
  };

  const onSearch = (value) => search({ name: value });

  return (
    <>
      <Modal
        visible={isModalVisible}
        onCancel={() => {
          setModal(false);
        }}
        footer={null}
      >
        <h2>Edit Company Details</h2>
        <EditOrganizationForm
          formik={formik}
          setEditorState={setEditorState}
          editorState={editorState}
        />
      </Modal>
      <div className="ordersWrapper">
        <Card
          title={<div className="title">All Data</div>}
          extra={
            <div className="card-title-wrapper">
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name"
                onSearch={onSearch}
                loading={isSearching}
                style={{
                  width: 360,
                }}
              />
              <ExcelReader addOrganizations={addOrganizations} />
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={
              searchReturnedResults ? searchReturnedResults : allOrders
            }
            pagination={
              !searchResults && {
                pageSize: limit,
                total: data?.data?.organizations?.totalDocs,
                showLessItems: true,
              }
            }
            loading={isSearching || isLoading}
            onChange={handleChange}
          />
        </Card>
      </div>
    </>
  );
};

export default CompanyData;
