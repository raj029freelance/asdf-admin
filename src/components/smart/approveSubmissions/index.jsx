import { Button, Card, Modal, Space, Table } from "antd";
import axios from "axios";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useFormik } from "formik";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import EditOrganizationForm from "../companyData/EditCompanyDataModal";
import ConfirmationModal from "../confirmationModal/confirmationModal";

import "./index.scss";

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

const SubmissionsTable = () => {
  const { role } = useSelector((state) => state.user.user);
  const [submissions, setSubmissions] = useState([]);
  const [isConfirmationModalVisible, setConfirmationModal] = useState(false);
  const [submission, setSubmission] = useState(initialState);
  const [editorState, setEditorState] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState("");

  useEffect(() => {
    getSubmissions();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: submission,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const htmlString = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      const formData = {
        id: values._id,
        data: { ...values, CompanyURL: "", description: htmlString },
      };
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/submissions/approve`,
          formData
        )
        .then(() => {
          getSubmissions();
          setSubmission(initialState);
          setEditModalVisible(false);
          toast.success("Submission Approved", {
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

  const columns = [
    {
      title: "Company Name",
      dataIndex: "CompanyName",
      key: "CompanyName",
    },
    // {
    //   title: "Company Url",
    //   dataIndex: "CompanyUrl",
    //   key: "CompanyUrl",
    // },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      title: "Status",
      dataIndex: "approved",
      key: "approved",
      render: (_, record) => {
        return <p>{record?.approved ? "Approved" : "Pending Approval"}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="danger" onClick={() => openConfirmationModal(record)}>
              Delete
            </Button>
            {
              <Button
                disabled={record?.approved}
                type="primary"
                onClick={() => editHandler(record)}
              >
                Approve
              </Button>
            }
          </Space>
        );
      },
      hidden: role === "admin" ? false : true,
    },
  ].filter((column) => column.hidden !== true);

  const getSubmissions = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/submissions`)
      .then((res) => {
        setSubmissions(res.data.data);
      })
      .catch((err) => {
        toast.error("Problem in fetching submissions!", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      });
  };

  const openConfirmationModal = (record) => {
    setSubmission(record);
    setConfirmationModal(true);
  };

  const deleteHandler = (id) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/submissions/delete/${id}`)
      .then(() => {
        getSubmissions();
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
    setSubmission(record);

    const contentBlock = htmlToDraft(record.description);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }

    setEditModalVisible(true);
  };

  return (
    <>
      <Modal
        visible={isEditModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <h2>Approve Submission</h2>
        <EditOrganizationForm
          formik={formik}
          setEditorState={setEditorState}
          editorState={editorState}
        />
      </Modal>
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        handleClose={() => setConfirmationModal(false)}
        handleSubmit={() => {
          if (submission._id) {
            setConfirmationModal(false);
            deleteHandler(submission._id);
            setSubmission(initialState);
          }
        }}
      />
      <div className="submissionsWrapper">
        <Card title={<div className="title">Submissions</div>}>
          <Table columns={columns} dataSource={submissions} />
        </Card>
      </div>
    </>
  );
};

export default SubmissionsTable;
