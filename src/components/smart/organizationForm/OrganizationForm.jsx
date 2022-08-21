import React from "react";
import { Form, Input, Button, Select, Checkbox } from "antd";
import { TimePicker } from "antd";
import "./OrganizationForm.scss";
const { Option } = Select;
const OrganizationForm = ({ formik }) => {
  return (
    <div className="organizationForm">
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
          <Form.Item
            name="department"
            label="Department your calling"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Enter Department you are calling"
              name="DepartmentYourCalling"
              value={formik.values.DepartmentYourCalling}
              onChange={formik.handleChange}
            >
              <Option value="Customer Service">Customer Service</Option>
            </Select>
          </Form.Item>
          <div className="checkbox-wrapper">
            <Checkbox
              onChange={(e) =>
                formik.setFieldValue(
                  "CallBackAvailable",
                  `${e.target.checked ? "YES" : "NO"}`
                )
              }
            >
              CallBack Available
            </Checkbox>
            <Checkbox
              onChange={(e) =>
                formik.setFieldValue(
                  "CallPickedUpByARealPerson",
                  `${e.target.checked ? "YES" : "NO"}`
                )
              }
            >
              Call Picked
            </Checkbox>
          </div>
        </div>
        <div className="container d-flex">
          <div className="time-wrapper">
            <p className="label">Best Time to Dail</p>
            <TimePicker
              use12Hours
              format="h:mm a"
              onChange={(value) =>
                formik.setFieldValue("BestTimeToDail", value.format("h:mm a"))
              }
            />
          </div>
          <div className="time-wrapper d-flex">
            <Form.Item
              label="Service Hours"
              name="hour"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                type="number"
                name="serviceHours"
                value={formik.values.serviceHours}
                onChange={formik.handleChange}
                placeholder="Enter Hour"
                min={1}
                max={24}
              />
            </Form.Item>
            <Form.Item
              label="Service Days"
              name="days"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                type="number"
                name="serviceDays"
                value={formik.values.serviceDays}
                onChange={formik.handleChange}
                placeholder="Enter days"
                min={1}
                max={7}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default OrganizationForm;
