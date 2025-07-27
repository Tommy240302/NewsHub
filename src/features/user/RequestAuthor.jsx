import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../common/api";
import {
  Upload,
  Button,
  Input,
  Card,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Spin,
  Divider,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { uploadFile, deleteFile } from "../../services/imageKit";
import NotificationModalFactory from "../../components/NotificationModal/NotificationModalFactory";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function FileUploadForm() {
  const [files, setFiles] = useState({
    file1: null,
    file2: null,
  });

  // Store file contents read by FileReader
  const [fileContents, setFileContents] = useState({
    file1: {
      dataURL: null,
      base64: null,
      text: null,
      arrayBuffer: null,
    },
    file2: {
      dataURL: null,
      base64: null,
      text: null,
      arrayBuffer: null,
    },
  });

  const [file1Info, setFile1Info] = useState({
    fileId: null,
    url: null,
  });
  const [file2Info, setFile2Info] = useState({
    fileId: null,
    url: null,
  });

  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typeNotify, setTypeNotify] = useState("info");
  const [modalData, setModalData] = useState({
    message: null,
    description: null,
  });
  const navigate = useNavigate();

  const validateFile = (file) => {
    const maxSize = 1 * 1024 * 1024; // 1MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (file.size > maxSize) {
      return "File size must not exceed 1MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed";
    }

    return null;
  };

  // Enhanced file reading with FileReader
  const readFileContents = (file, fieldName) => {
    // Initialize readers
    const dataURLReader = new FileReader();
    const arrayBufferReader = new FileReader();
    const textReader = new FileReader();

    // Read as Data URL (for images and general preview)
    dataURLReader.onload = (e) => {
      const dataURL = e.target.result;
      const base64 = dataURL.split(",")[1]; // Extract base64 part

      setFileContents((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          dataURL: dataURL,
          base64: base64,
        },
      }));

      console.log(
        `${fieldName} - Data URL:`,
        dataURL.substring(0, 100) + "..."
      );
      console.log(`${fieldName} - Base64:`, base64.substring(0, 100) + "...");
    };
    dataURLReader.readAsDataURL(file);

    // Read as ArrayBuffer (for binary processing)
    arrayBufferReader.onload = (e) => {
      setFileContents((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          arrayBuffer: e.target.result,
        },
      }));
    };
    arrayBufferReader.readAsArrayBuffer(file);

    // Read as text (if it's a text file)
    if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
      textReader.onload = (e) => {
        setFileContents((prev) => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            text: e.target.result,
          },
        }));
      };
      textReader.readAsText(file);
    }

    // Handle errors
    [dataURLReader, arrayBufferReader, textReader].forEach((reader) => {
      reader.onerror = (error) => {
        console.error(`FileReader error for ${fieldName}:`, error);
      };
    });
  };

  const handleFileChange = (fieldName, file) => {
    if (!file) return false;

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      message.error(error);
      return false;
    }

    // Store file
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    setErrors((prev) => ({ ...prev, [fieldName]: null }));

    // Read file contents with FileReader
    readFileContents(file, fieldName);

    message.success(`${file.name} uploaded and processed successfully`);
    return false;
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setFileContents((prev) => ({
      ...prev,
      [fieldName]: {
        dataURL: null,
        base64: null,
        text: null,
        arrayBuffer: null,
      },
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
    message.info("File removed");
  };

  // Get file information including processed contents
  const getCompleteFileInfo = (fieldName) => {
    const file = files[fieldName];
    const contents = fileContents[fieldName];

    if (!file) return null;

    return {
      // Basic file info
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,

      // Processed contents
      dataURL: contents.dataURL,
      base64: contents.base64,
      text: contents.text,
      arrayBuffer: contents.arrayBuffer,

      // Original file object
      file: file,

      // Note: Real file path is NOT available
      realPath: "❌ Not available due to browser security restrictions",
    };
  };

  const getFileIcon = (file) => {
    if (!file)
      return <UploadOutlined style={{ fontSize: "32px", color: "#d9d9d9" }} />;

    if (file.type.startsWith("image/")) {
      return (
        <FileImageOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      );
    } else if (file.type === "application/pdf") {
      return (
        <FileTextOutlined style={{ fontSize: "24px", color: "#f5222d" }} />
      );
    }
    return <FileTextOutlined style={{ fontSize: "24px", color: "#8c8c8c" }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!files.file1 && !files.file2) {
      setErrors((prev) => ({
        ...prev,
        general: "Chưa upload đầy đủ thông tin quan trọng",
      }));
      setModalData({
        message: "Lỗi",
        description: "Hãy đảm bảo bạn đã upload đầy đủ file được yêu cầu",
      });
      setVisible(true);
      setTypeNotify("error");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get complete file information including processed contents
      const file1 = getCompleteFileInfo("file1");
      const file2 = getCompleteFileInfo("file2");
      const uploadFile1Promise = await uploadFile(file1.dataURL, file1.name);
      const uploadFile2Promise = await uploadFile(file2.dataURL, file2.name);
      setFile1Info({
        fileId: uploadFile1Promise.fileId,
        url: uploadFile1Promise.url,
      });
      setFile2Info({
        fileId: uploadFile2Promise.fileId,
        url: uploadFile2Promise.url,
      });

      const requestAuthor = {
        profileUrl: uploadFile1Promise.url,
        sampleArticles: uploadFile2Promise.url,
        reason: reason,
      };

      // Simulate API call
      const response = await userAPI.requestAuthor(requestAuthor);

      // Success feedback
      setModalData({
        message: "Yêu cầu thành công",
        description: "Chúng tôi sẽ xem xét yêu cầu của bạn vui lòng chờ",
      });
      setTypeNotify("success");
      setVisible(true);

      // Reset form
      setFiles({ file1: null, file2: null });
      setFileContents({
        file1: { dataURL: null, base64: null, text: null, arrayBuffer: null },
        file2: { dataURL: null, base64: null, text: null, arrayBuffer: null },
      });
      setDescription("");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/forbidden");
      }
      if (error.response && error.response.status === 400) {
        deleteFile(file1Info.fileId);
        deleteFile(file2Info.fileId);
        setModalData({
          message: "Nhắc nhở",
          description: error.response.data.errorMessage,
        });
        setTypeNotify("info");
        setVisible(true);
      }
    } finally {
      setIsSubmitting(false);
      return;
    }
  };

  const FileUploadArea = ({ fieldName, title }) => {
    const file = files[fieldName];
    const hasError = errors[fieldName];
    const contents = fileContents[fieldName];

    const uploadProps = {
      accept: "image/*,.pdf",
      beforeUpload: (file) => handleFileChange(fieldName, file),
      showUploadList: false,
      multiple: false,
    };

    return (
      <div>
        <Text
          strong
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
            display: "block",
          }}
        >
          {title}
        </Text>

        {file ? (
          <Card
            size="small"
            style={{
              border: hasError ? "2px dashed #ff4d4f" : "2px dashed #52c41a",
              backgroundColor: hasError ? "#fff2f0" : "#f6ffed",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Space>
                {getFileIcon(file)}
                <div>
                  <Text strong style={{ display: "block" }}>
                    {file.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {formatFileSize(file.size)}
                  </Text>
                  {/* Show preview for images */}
                  {file.type.startsWith("image/") && contents.dataURL && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={contents.dataURL}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  )}
                  {/* Show text preview for text files */}
                  {contents.text && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "10px",
                        display: "block",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Content: {contents.text.substring(0, 50)}...
                    </Text>
                  )}
                </div>
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: "16px" }}
                />
              </Space>
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeFile(fieldName)}
              />
            </div>
          </Card>
        ) : (
          <Dragger
            {...uploadProps}
            style={{
              border: hasError ? "2px dashed #ff4d4f" : "2px dashed #d9d9d9",
              backgroundColor: hasError ? "#fff2f0" : "#fafafa",
              borderRadius: "8px",
            }}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              <UploadOutlined
                style={{
                  fontSize: "48px",
                  color: "#d9d9d9",
                  marginBottom: "16px",
                }}
              />
              <div>
                <Text style={{ color: "#1890ff", fontWeight: 600 }}>
                  Click to browse
                </Text>
                <Text style={{ color: "#8c8c8c" }}> or drag and drop</Text>
              </div>
              <Text
                type="secondary"
                style={{ fontSize: "12px", display: "block", marginTop: "8px" }}
              >
                Images (JPEG, PNG, WebP) or PDF files up to 1MB
              </Text>
            </div>
          </Dragger>
        )}

        {hasError && (
          <Alert
            message={errors[fieldName]}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginTop: "8px" }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ marginBottom: "8px", color: "#262626" }}>
            Tham gia trở thành tác giả của trang
          </Title>
          <Paragraph type="secondary">Upload images or PDF files</Paragraph>
        </div>

        <div>
          {/* File Upload Areas */}
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <FileUploadArea fieldName="file1" title="CV*" />
            </Col>
            <Col xs={24} md={12}>
              <FileUploadArea fieldName="file2" title="Bài báo mẫu*" />
            </Col>
          </Row>

          <Divider />

          {/* Description */}
          <div style={{ marginBottom: "16px" }}>
            <Text
              strong
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Lý do bạn muốn tham gia làm tác giả của trang
            </Text>
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nêu lý do..."
              rows={4}
              maxLength={1000}
              showCount
              style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
            />
          </div>

          {/* General Error */}
          {errors.general && (
            <Alert
              message={errors.general}
              type="error"
              showIcon
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: "16px" }}
            />
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              block
              onClick={handleSubmit}
              style={{
                height: "50px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {isSubmitting ? "Đang xử lý.." : "Gửi yêu cầu"}
            </Button>
          </div>
        </div>
      </Card>

      <NotificationModalFactory
        type={typeNotify}
        visible={visible}
        onClose={() => setVisible(false)}
        message={modalData.message}
        description={modalData.description}
      />
    </div>
  );
}
