import React, { useState } from 'react';
import OrganizationForm from '../organizationForm/OrganizationForm';
import TextEditor from '../textEditor/TextEditor';
import { useFormik } from 'formik';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import * as Yup from 'yup';
import './registerCompany.scss';
import { useAddOrganizationMutation } from 'services/organization';
import { toast } from 'react-toastify';
import { Button } from 'antd';

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
const RegisterCompany = () => {
  const [editorState, setEditorState] = useState('');
  const [addOrganization] = useAddOrganizationMutation();
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const htmlString = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      addOrganization({
        ...values,
        CallCenterHours: `${values.serviceHours}hours , ${values.serviceDays}days`,
        description: htmlString
      })
        .unwrap()
        .then(() => {
          toast.success('Organization Successfully Added', {
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
  return (
    <div className="registerCompany">
      <h1 className="pageTitle">Register Company</h1>
      <OrganizationForm formik={formik} />
      <TextEditor htmlText={''} editorState={editorState} setEditorState={setEditorState} />
      <Button onClick={formik.handleSubmit} type="primary">
        Register
      </Button>
    </div>
  );
};

export default RegisterCompany;
