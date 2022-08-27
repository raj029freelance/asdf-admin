import React from "react";
import { Button, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./confirmationModal.scss";

const ConfirmationModal = ({ isVisible, handleSubmit, handleClose }) => {
  return (
    <div>
      <Modal
        className="confirmationModal"
        visible={isVisible}
        onCancel={handleClose}
        footer={[
          <Button type="primary" onClick={handleClose}>
            Cancel
          </Button>,
          <Button type="danger" onClick={handleSubmit}>
            Delete
          </Button>,
        ]}
      >
        <FontAwesomeIcon
          icon={faCircleXmark}
          style={{ color: "#e74c3c", fontSize: 40, marginBottom: 10 }}
        />
        <h2>Do you want to delete this record ?</h2>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
