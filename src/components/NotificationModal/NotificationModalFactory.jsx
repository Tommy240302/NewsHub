import React from "react";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import InfoModal from "./InfoModal";

const NotificationModalFactory = ({
  type,
  visible,
  onClose,
  message,
  description,
}) => {
  switch (type) {
    case "success":
      return (
        <SuccessModal
          visible={visible}
          onClose={onClose}
          message={message}
          description={description}
        />
      );
    case "error":
      return (
        <ErrorModal
          visible={visible}
          onClose={onClose}
          message={message}
          description={description}
        />
      );
    case "info":
      return (
        <InfoModal
          visible={visible}
          onClose={onClose}
          message={message}
          description={description}
        />
      );
    default:
      return (
        <ErrorModal
          visible={visible}
          onClose={onClose}
          message="ERROR"
          description="TYPE DOES NOT EXIST"
        />
      );
  }
};

export default NotificationModalFactory;
