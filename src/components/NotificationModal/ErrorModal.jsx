import React, { useState } from "react";
import { Modal, Button, Space } from "antd";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

const ErrorModal = ({ visible, onClose, message, description }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={400}
      bodyStyle={{
        padding: "40px 30px",
        textAlign: "center",
        borderRadius: "12px",
      }}
      style={{
        borderRadius: "12px",
      }}
    >
      {/* Custom close button */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{
            color: "#999",
            border: "none",
            boxShadow: "none",
          }}
        />
      </div>

      {/* Error Icon */}
      <div style={{ marginBottom: "24px" }}>
        <CloseCircleOutlined
          style={{
            fontSize: "64px",
            color: "#ff4d4f",
            backgroundColor: "#fff2f0",
            borderRadius: "50%",
            padding: "8px",
          }}
        />
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#262626",
        }}
      >
        {message || "Error"}
      </h2>

      {/* Description */}
      <p
        style={{
          color: "#8c8c8c",
          fontSize: "14px",
          lineHeight: "1.6",
          marginBottom: "32px",
          maxWidth: "300px",
          margin: "0 auto 32px auto",
        }}
      >
        {description || "Successfully accepted!"}
      </p>

      {/* OK Button */}
      <Button
        type="primary"
        size="large"
        onClick={onClose}
        style={{
          backgroundColor: "#1f2937",
          borderColor: "#1f2937",
          borderRadius: "8px",
          height: "48px",
          width: "100%",
          fontWeight: "500",
          fontSize: "16px",
        }}
      >
        OK
      </Button>
    </Modal>
  );
};

export default ErrorModal;
