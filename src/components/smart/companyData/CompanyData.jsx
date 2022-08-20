import React, { useEffect, useState } from 'react';
import { Card, Space, Button } from 'antd';
import { Table , Modal, Input} from 'antd';
import { Form, Select, Checkbox, TimePicker } from 'antd';
import './CompanyData.scss';
import {
  useAddOrganizationsMutation,
  useDeleteOrganizationMutation,
  useGetPaginatedOrganizationsQuery,
  useEditOrganizationMutation
} from 'services/organization';
import { useFormik } from 'formik';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import * as Yup from 'yup';
import ExcelReader from 'components/presentational/excelReader/ExcelReader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import EditOrganizationForm from './EditCompanyDataModal';

const initialState = {
  CompanyName: '',
  PhoneNumber: '',
  DepartmentYourCalling: 'Customer Service',
  CallBackAvailable: 'NO',
  CallPickedUpByARealPerson: 'NO',
  BestTimeToDail: '111',
  serviceHours: 1,
  serviceDays: 1,
  CallCenterHours: `1 hour and 1 day`
};
const validationSchema = Yup.object().shape({
  CompanyName: Yup.string().required('Company Name required'),
  PhoneNumber: Yup.string().required('Phone Number required'),
  DepartmentYourCalling: Yup.string().required('Enter Department you are calling'),
  BestTimeToDail: Yup.string().required('Best Time to Dail required')
});


const CompanyData = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [addOrganizations] = useAddOrganizationsMutation();
  const { data, isLoading } = useGetPaginatedOrganizationsQuery({ page, limit });
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [editorState, setEditorState] = useState('');
  const [editOrganization] = useEditOrganizationMutation()
  const { role } = useSelector((state) => state.user.user);
  const [isModalVisible, setModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(initialState)
  
  const formik = useFormik({
    enableReinitialize:true,
    initialValues: selectedOrg,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("called")
      const htmlString = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      editOrganization(
        values._id,
        {
        ...values,
        CallCenterHours: `${values.serviceHours}hours , ${values.serviceDays}days`,
        description: htmlString
      })
        .unwrap()
        .then(() => {
          toast.success('Organization details updated Successfully', {
            autoClose: 2000,
            pauseOnHover: false
          });
        })
        .catch((err) => {
          toast.error(`${err}`, {
            autoClose: 2000,
            pauseOnHover: false
          });
        });
    }
  });
  const deleteHandler = (_id) => {
    deleteOrganization({ _id: _id })
      .then(() => {
        toast.success('Organization Succesfully Deleted', {
          pauseOnHover: false,
          autoClose: 2000
        });
      })
      .catch((err) => {
        toast.error('Problem Deleting Organization', {
          autoClose: 2000,
          pauseOnHover: false
        });
      });
  };

  const editHandler = (companyRecord) => {
    setSelectedOrg(companyRecord)
    setModal(true)
  }
  useEffect(() => {
    if (data) {
      setAllOrders(data?.data?.organizations?.docs);
    }
  }, [data]);
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'CompanyName',
      key: 'CompanyName'
    },
    {
      title: 'Company Url',
      dataIndex: 'CompanyUrl',
      key: 'CompanyUrl'
    },
    {
      title: 'Phone Number',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber'
    },
    {
      title: 'CallBack Available',
      dataIndex: 'CallBackAvailable',
      key: 'CallBackAvailable'
    },
    {
      title: 'Call Picked',
      dataIndex: 'CallPickedUpByARealPerson',
      key: 'CallPickedUpByARealPerson'
    },
    {
      title: 'Call-Center Hours',
      dataIndex: 'CallCenterHours',
      key: 'CallCenterHours'
    },
    {
      title: 'Department',
      dataIndex: 'DepartmentYourCalling',
      key: 'DepartmentYourCalling'
    },
    {
      title: 'Action',
      key: 'action',
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
      hidden: role === 'admin' ? false : true
    }
  ].filter((column) => column.hidden !== true);

  const handleChange = (pagination) => {
    setPage(pagination.current);
  };
  return (
    <>
    <Modal visible={isModalVisible} onCancel={()=>{
      setModal(false)
    }}  footer={null}>
      <h2>Edit Company Details</h2>
      <EditOrganizationForm formik={formik} setEditorState={setEditorState} editorState={editorState}/>
    </Modal>
      <div className="ordersWrapper">
        <Card
          title={<div className="title">All Data</div>}
          extra={<ExcelReader addOrganizations={addOrganizations} />}
        >
          <Table
            columns={columns}
            dataSource={allOrders}
            pagination={{
              pageSize: limit,
              total: data?.data?.organizations?.totalDocs,
              showLessItems: true
            }}
            loading={isLoading}
            onChange={handleChange}
          />
        </Card>
      </div>
    </>
  );
};

export default CompanyData;
