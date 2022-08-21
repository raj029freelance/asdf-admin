import React, { useEffect , useState} from 'react';
import { Form, Input, Button, Select, Checkbox } from 'antd';
import { TimePicker } from 'antd';
import './EditCompanyModal.scss';
import { useFormik } from 'formik';
import { useEditOrganizationMutation } from 'services/organization';
import TextEditor from '../textEditor/TextEditor';


const { Option } = Select;

const EditOrganizationForm = ({ formik , editorState, setEditorState}) => {
  const [serviceHoursDefaultState, setServiceHoursDefaultState] = useState(1);
  const [serviceDaysDefaultState, setServiceDaysDefaultState] = useState(1);

  // useEffect(()=>{
  //   if(formik.values.CallCenterHours != undefined) {
  //     console.log(formik.values.CallCenterHours)
  //   const hours= parseInt(formik.values.CallCenterHours.split(',')[0].split('hours')[0])
  //   const days = parseInt(formik.values.CallCenterHours.split(',')[1].split('days')[0])
  //   console.log(hours)
  //   console.log(days)
  //   // setServiceDaysDefaultState(days)
  //   // setServiceHoursDefaultState(hours)
  //   }
  // })

  console.log(formik.values.CallCenterHours)
  // useEffect(()=>{
  //   setEditorState(formik.values.description)
  // },[])
  return (
    <div>
      <Form
        name="basic"
        onFinish={(e) => e.preventDefault()}
        autoComplete="off"
      >
        <div className="container">
          <Form.Item label="Company Name">
            <Input
              size="large"
              type="text"
              name="CompanyName"
              value={formik.values.CompanyName}
              onChange={formik.handleChange}
              placeholder="Company Name"
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input
              size="large"
              type="text"
              name="PhoneNumber"
              value={formik.values.PhoneNumber}
              onChange={formik.handleChange}
              placeholder="Phone Number"
            />
          </Form.Item>
        </div>
        <div className="container">
          <Form.Item name="department" label="Department your calling">
            <Select
              placeholder="Enter Department you are calling"
              name="DepartmentYourCalling"
              value={formik.values.DepartmentYourCalling}
              defaultValue={formik.values.DepartmentYourCalling}
              onChange={formik.handleChange}
            >
              <Option value="Customer Service">Customer Service</Option>
            </Select>
          </Form.Item>
          <div className="checkbox-wrapper">
            <Checkbox
            defaultChecked={formik.values.CallBackAvailable === "YES" ? true : false}
              onChange={(e) => {
                formik.setFieldValue(
                 'CallBackAvailable',
               `${!e.target.checked? 'NO' : 'YES'}`,
                )
                
              }
              }
            >
              CallBack Available
            </Checkbox>
            <Checkbox
            defaultChecked={formik.values.CallPickedUpByARealPerson === "YES" ? true : false}
              onChange={(e) =>
                formik.setFieldValue(
                  'CallPickedUpByARealPerson',
                  `${!e.target.checked? 'NO' : 'YES'}`
                )
              }
            >
              Call Picked
            </Checkbox>
          </div>
        </div>
        <div className="container1">
          <div className="time-wrapper" style={{marginTop:15}}>
            <span className="label" >Best Time to Dail {"  "}</span>
            <Input type="text" 
            value={formik.values.BestTimeToDail}
            defaultValue={formik.values.BestTimeToDail}
            onChange={(value) =>
                formik.setFieldValue({ field: 'BestTimeToDail', value: value})
              }
          />
          </div>
          <div className="time-wrapper" style={{marginTop:15}}>
            <Form.Item label="Call Center Hours">
            <Input type="text" 
            value={formik.values.CallCenterHours}
            name="CallCenterHours"
            defaultValue={()=>{
              console.log(formik.values.CallCenterHours)
              return formik.values.CallCenterHours}}
            onChange={formik.handleChange}

          />
            
            </Form.Item>
          </div>
         
          <div className="service-days-wrapper " style={{marginTop:15}}>
            <TextEditor  htmlText={''} editorState={editorState} setEditorState={setEditorState} style={{height:"100px"}}/>
            <Button onClick={formik.handleSubmit} type="primary">
        Save Changes
      </Button>
            </div>
        </div>
      </Form>
    </div>
  );
};

export default EditOrganizationForm;
