import React, { useEffect, useState, useRef } from 'react';
import { Modal, Progress } from 'antd';
const UploadModal = ({ isModalVisible, status, close, isLoading }) => {
  const [percent, setPercent] = useState(0);
  const ref = useRef(setInterval(() => setPercent((state) => state + 1), 1000));
  useEffect(() => {
    if(!isLoading) {
        clearInterval(ref.current);
     setPercent(100);
    }
  }, [isLoading]);
  return (
    <Modal visible={isModalVisible} onCancel={close}  footer={null}>
      <Progress
        type="circle"
        status={status}
        percent={percent}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068'
        }}
      />
      <>
      {
          isLoading ?
          <p className='statusText'>Uploading....</p>
          :
          <p className='statusText'>{status === "success" ? "Uploaded Successfully!" : "Failed to Upload File"}</p>
      }
      </>
    </Modal>
  );
};

export default UploadModal;
