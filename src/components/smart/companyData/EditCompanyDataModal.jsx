import React from "react";
import { Form, Input, Button, Select, Checkbox } from "antd";
import "./EditCompanyModal.scss";
import TextEditor from "../textEditor/TextEditor";

const { Option } = Select;

const EditOrganizationForm = ({ formik, editorState, setEditorState }) => {
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
              checked={formik.values.CallBackAvailable === "YES"}
              onChange={(e) => {
                formik.setFieldValue(
                  "CallBackAvailable",
                  `${!e.target.checked ? "NO" : "YES"}`
                );
              }}
            >
              CallBack Available
            </Checkbox>
            <Checkbox
              checked={formik.values.CallPickedUpByARealPerson === "YES"}
              onChange={(e) =>
                formik.setFieldValue(
                  "CallPickedUpByARealPerson",
                  `${!e.target.checked ? "NO" : "YES"}`
                )
              }
            >
              Call Picked
            </Checkbox>
          </div>
        </div>
        <div className="container1">
          <div className="time-wrapper" style={{ marginTop: 15 }}>
            <span className="label">Best Time to Dail {"  "}</span>
            <Input
              type="text"
              value={formik.values.BestTimeToDail}
              defaultValue={formik.values.BestTimeToDail}
              onChange={(value) =>
                formik.setFieldValue({ field: "BestTimeToDail", value: value })
              }
            />
          </div>
          <div className="time-wrapper" style={{ marginTop: 15 }}>
            <Form.Item label="Call Center Hours">
              <Input
                type="text"
                value={formik.values.CallCenterHours}
                name="CallCenterHours"
                defaultValue={() => {
                  return formik.values.CallCenterHours;
                }}
                onChange={formik.handleChange}
              />
            </Form.Item>
          </div>

          <div className="service-days-wrapper " style={{ marginTop: 15 }}>
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
              style={{ height: "100px" }}
            />
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
