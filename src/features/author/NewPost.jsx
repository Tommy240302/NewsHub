import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Modal,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  HolderOutlined,
  FileImageOutlined,
  CloseOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import InlineRichTextEditor from "../../components/ui/RichText";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const NewPost = () => {
  const [components, setComponents] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const h1Ref = useRef(null);
  const [title, setTitle] = useState("Tiêu đề");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  const categories = [
    {
      id: 1,
      content: "Công nghệ",
    },
    {
      id: 2,
      content: "Chính trị",
    },
    {
      id: 3,
      content: "Văn hóa",
    },
  ];

  // Handle drag start from component panels
  const handleDragStart = (e, type, data = {}) => {
    setDraggedItem({ type, data });
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag start from middle area (reordering)
  const handleReorderDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drop in middle area
  const handleDrop = (e) => {
    e.preventDefault();

    if (draggedItem) {
      // Adding new component
      const newComponent = {
        id: Date.now(),
        type: draggedItem.type,
        data: draggedItem.data,
      };
      setComponents([...components, newComponent]);
      setDraggedItem(null);
    } else if (draggedIndex !== null) {
      // Reordering existing components
      const newComponents = [...components];
      const draggedComponent = newComponents[draggedIndex];
      newComponents.splice(draggedIndex, 1);
      newComponents.push(draggedComponent);
      setComponents(newComponents);
      setDraggedIndex(null);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drag leave from middle area (remove component)
  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      if (draggedIndex !== null) {
        const newComponents = [...components];
        newComponents.splice(draggedIndex, 1);
        setComponents(newComponents);
        setDraggedIndex(null);
      }
    }
  };

  // Handle drag and drop for image upload area
  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUploadFromFiles(files);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
  };

  // Handle file upload from both drag-drop and file input
  const handleFileUploadFromFiles = (files) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            name: file.name,
            url: event.target.result,
            caption: "",
          };
          setImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    handleFileUploadFromFiles(files);
  };

  // Remove image
  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Update component data
  const updateComponent = (id, newData) => {
    setComponents(
      components.map((comp) =>
        comp.id === id ? { ...comp, data: { ...comp.data, ...newData } } : comp
      )
    );
  };

  // Handle rich text save
  const handleRichTextSave = (componentId, content) => {
    updateComponent(componentId, { content });
  };

  // Preview to HTML
  const handlePreview = () => {
    console.log(components);
    const htmlContent = components
      .map((comp) => {
        switch (comp.type) {
          case "richtext":
            return `<div class="rich-text-content">${
              comp.data.content || ""
            }</div>`;
          case "image":
            return `<div class="image-container">
            <img src="${comp.data.url}" alt="${comp.data.alt || ""}" />
            <p class="caption">${comp.data.caption || ""}</p>
          </div>`;
          default:
            return "";
        }
      })
      .join("\n");

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Preview</title>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .image-container { margin: 10px 0; }
    .caption { font-style: italic; margin-top: 5px; color: #888; }
    .rich-text-content { margin: 10px 0; line-height: 1.5; }
  </style>
</head>
<body>
<h1>${title}</h1>
${htmlContent}
</body>
</html>`;

    setPreviewHTML(fullHTML);
    setIsPreviewVisible(true);
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Row style={{ height: "100%" }}>
        {/* Left Panel - Components */}
        <Col
          span={5}
          style={{
            backgroundColor: "#fff",
            borderLeft: "1px solid #d9d9d9",
            textAlign: "center",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <div style={{ padding: "16px" }}>
            <Title level={4}>Thành phần</Title>

            {/* Rich Text Component */}
            <Card
              size="small"
              style={{
                marginBottom: "16px",
                backgroundColor: "#e6f7ff",
                border: "1px solid #91d5ff",
                cursor: "move",
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, "richtext")}
            >
              <Space>
                <FileTextOutlined />
                <Text strong>Rich Text</Text>
              </Space>
            </Card>

            {/* Image Upload Area */}
            <div style={{ marginBottom: "16px" }}>
              <Text strong style={{ fontSize: "12px", color: "#666" }}>
                Image Panel
              </Text>
              <div
                style={{
                  border: "2px dashed #d9d9d9",
                  borderRadius: "6px",
                  padding: "16px",
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
                onDrop={handleImageDrop}
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
                <UploadOutlined
                  style={{
                    fontSize: "24px",
                    color: "#bfbfbf",
                    marginBottom: "8px",
                  }}
                />
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Drop images here or click to upload
                </div>
              </div>
            </div>

            {/* Image Components */}
            <div>
              <Text strong style={{ fontSize: "12px", color: "#666" }}>
                Uploaded Images
              </Text>
              <div
                style={{
                  maxHeight: "384px",
                  overflowY: "auto",
                  marginTop: "8px",
                }}
              >
                {images.map((image) => (
                  <Card
                    key={image.id}
                    size="small"
                    style={{ marginBottom: "8px", backgroundColor: "#fafafa" }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f6ffed",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #b7eb8f",
                        cursor: "move",
                        position: "relative",
                      }}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, "image", {
                          url: image.url,
                          alt: image.name,
                          caption: image.caption,
                        })
                      }
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        style={{
                          width: "100%",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          marginBottom: "4px",
                        }}
                      />
                      <Space>
                        <FileImageOutlined style={{ fontSize: "12px" }} />
                        <Text
                          ellipsis
                          style={{
                            fontSize: "12px",
                            maxWidth: "100px",
                            flex: 1,
                          }}
                        >
                          {image.name}
                        </Text>
                      </Space>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          minWidth: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: "#ff4d4f",
                          color: "#fff",
                        }}
                        onClick={() => removeImage(image.id)}
                      />
                    </div>
                    <TextArea
                      placeholder="Caption..."
                      value={image.caption}
                      onChange={(e) => {
                        const newImages = images.map((img) =>
                          img.id === image.id
                            ? { ...img, caption: e.target.value }
                            : img
                        );
                        setImages(newImages);
                      }}
                      rows={2}
                      style={{ marginTop: "8px", fontSize: "12px" }}
                    />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Middle Panel - Workspace */}
        <Col span={14} style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #d9d9d9",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Thiết kế bài đăng
            </Title>
            <Text type="secondary">
              Drag components here to build your layout
            </Text>
          </div>
          <div>
            <h1
              ref={h1Ref}
              spellCheck={false}
              contentEditable
              suppressContentEditableWarning
              style={{ border: "1px solid #ccc", padding: "4px" }}
            >
              {title}
            </h1>
          </div>

          <div
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: "#fafafa",
              border: "2px dashed #d9d9d9",
              margin: "16px",
              borderRadius: "6px",
              minHeight: "400px",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {components.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#999",
                }}
              >
                Drop components here
              </div>
            ) : (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {components.map((component, index) => (
                  <Card
                    key={component.id}
                    style={{ backgroundColor: "#fff" }}
                    draggable
                    onDragStart={(e) => handleReorderDragStart(e, index)}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <HolderOutlined
                        style={{
                          marginRight: "8px",
                          marginTop: "4px",
                          color: "#bfbfbf",
                          cursor: "move",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        {component.type === "richtext" && (
                          <InlineRichTextEditor
                            initialContent={component.data.content}
                            onSave={handleRichTextSave}
                            componentId={component.id}
                          />
                        )}
                        {component.type === "image" && (
                          <div>
                            <img
                              src={component.data.url}
                              alt={component.data.alt}
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: "4px",
                              }}
                            />
                            <Input
                              placeholder="Caption..."
                              value={component.data.caption}
                              onChange={(e) =>
                                updateComponent(component.id, {
                                  caption: e.target.value,
                                })
                              }
                              style={{ marginTop: "8px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </div>
        </Col>

        {/* Right Panel - Controls */}
        <Col
          span={5}
          style={{
            backgroundColor: "#fff",
            borderLeft: "1px solid #d9d9d9",
            textAlign: "center",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <div style={{ padding: "16px" }}>
            <Title level={4}>Công cụ</Title>

            {/* Additional File Upload */}
            <div style={{ marginBottom: "24px" }}>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Ảnh hiển thị
              </Text>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                // onClick={() => fileInputRef.current?.click()}
                block
              >
                Upload
              </Button>
            </div>

            {/* Dropdown */}
            <div style={{ marginBottom: "24px" }}>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Chủ đề
              </Text>
              <Select
                defaultValue={categories[0]?.content}
                style={{ width: "100%" }}
              >
                {categories.map((category) => (
                  <Option value={category.id} key={category.id}>
                    {category.content}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Export Button */}
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={handlePreview}
              disabled={components.length === 0}
              block
              style={{ marginBottom: "8px" }}
            >
              Xem trước
            </Button>

            {/* Clear All */}
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setComponents([])}
              disabled={components.length === 0}
              block
              style={{ marginBottom: "8px" }}
            >
              Clear All
            </Button>

            <Button type="primary" disabled={components.length === 0} block>
              {" "}
              Đăng bài
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        title="Xem trước bài viết"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={1200}
        bodyStyle={{ padding: 0 }}
      >
        <iframe
          srcDoc={previewHTML}
          title="HTML Preview"
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      </Modal>
    </div>
  );
};

export default NewPost;
