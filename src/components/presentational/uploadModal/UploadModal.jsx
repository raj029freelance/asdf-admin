import React, { useEffect, useState, useRef } from "react";
import { message, Modal, Progress } from "antd";
const UploadModal = ({ isModalVisible, status, error, close, isLoading }) => {
  const [percent, setPercent] = useState(0);
  const ref = useRef(setInterval(() => setPercent((state) => state + 1), 1000));
  useEffect(() => {
    if (!isLoading) {
      clearInterval(ref.current);
      setPercent(100);
    }
  }, [isLoading]);
  return (
    <Modal visible={isModalVisible} onCancel={close} footer={null}>
      <Progress
        type="circle"
        status={status}
        percent={percent}
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068",
        }}
      />
      <>
        {isLoading ? (
          <p className="statusText">Uploading....</p>
        ) : (
          <>
            <p className="statusText">
              {status === "success"
                ? "Uploaded Successfully!"
                : "Failed to Upload File"}
            </p>
            <p>{status !== "success" ? error.data.message : ""}</p>

            {status !== "success"
              ? error.data.orgs.map((org) => {
                  return <p> {org.CompanyName}</p>;
                })
              : null}
          </>
        )}
      </>
    </Modal>
  );
};

export default UploadModal;
