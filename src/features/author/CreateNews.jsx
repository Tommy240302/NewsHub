import React, { useState, useRef, useEffect } from "react";
import { authorAPI } from "../../common/api";
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

import { uploadFile } from "../../services/imageKit";
import NotificationModalFactory from "../../components/NotificationModal/NotificationModalFactory";

import { categoryAPI } from "../../common/api";
import { SUCCESS_STATUS, FAIL_STATUS } from "../../common/variable-const";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const CreateNews = () => {
  const [components, setComponents] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);
  const titleRef = useRef(null);
  const summaryRef = useRef(null);
  const [title, setTitle] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  const [summary, setSummary] = useState("Tóm tắt");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visible, setVisible] = useState(false);
  const [typeNotify, setTypeNotify] = useState("info");
  const [notifyData, setNotifyData] = useState({
    message: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const renderOptions = (categories, prefix = "") => {
  return categories.flatMap((category) => [
    <Option key={category.id} value={category.id}>
      {prefix + category.content}
    </Option>,
    ...(category.children && category.children.length > 0
      ? renderOptions(category.children, prefix + "- ")
      : []),
  ]);
};


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        const { status, data, errorMessage } = response;
        if (status === SUCCESS_STATUS) {
          setCategories(data);
          if (data && data.length > 0) setSelectedCategory(data[0].id);
        } else if (status === FAIL_STATUS) {
          console.error("Lỗi từ API:", errorMessage || "Không thể lấy dữ liệu");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle drag start from component panels
  const handleDragStart = (e, type, data = {}) => {
    setDraggedItem({ type, data });
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag start from middle area (reordering) - Only from drag handle
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
    e.target.value = "";
  };

  // Handle main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImage({
          id: Date.now(),
          name: file.name,
          url: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
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

  const fullHTMLGenerate = (htmlContent) => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .main-image-container { margin: 20px 0; text-align: center; }
    .main-image { width: 600px; height: 400px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .image-container { 
      margin: 20px 0; 
      text-align: center; 
      display: block;
    }
    .image-container img { 
      width: 600px; 
      height: 400px; 
      object-fit: cover; 
      border-radius: 8px; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: block;
      margin: 0 auto;
    }
    .caption { 
      font-style: italic; 
      margin-top: 10px; 
      color: #888; 
      font-size: 14px;
      text-align: center;
      display: block;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .rich-text-content { margin: 10px 0; line-height: 1.5; }
    .summary {
     font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
    font-style: italic;
    }
    #title {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #1a237e;
    line-height: 1.3;
}
  </style>
</head>
<body>
<h1 id="title">${title}</h1>
<h4 class="summary">${summary}</h4>
${htmlContent}
</body>
</html>`;
  };

  const handlePublishPost = async () => {
    try {
      setIsSubmitting(true);
      const uploadPromises = [];
      const uploadedImages = [];
      let updatedMainImage = {};

      // Upload main image if exists
      if (mainImage) {
        const mainImagePromise = uploadFile(mainImage.url, mainImage.name).then(
          (response) => {
            updatedMainImage = { uploadedUrl: response.url };
            return response;
          }
        );
        uploadPromises.push(mainImagePromise);
      }

      // Upload component images
      const componentImagePromises = components.map(async (component) => {
        if (component.type === "image") {
          const response = await uploadFile(
            component.data.url,
            component.data.alt || ""
          );
          uploadedImages.push({ uploadedUrl: response.url });
          return response;
        }
        return null;
      });

      uploadPromises.push(...componentImagePromises);

      // Upload all images images from the left panel that are being used
      const usedImageIds = components
        .filter((comp) => comp.type === "image")
        .map((comp) => comp.data.url);

      const unusedImages = images.filter(
        (img) => !usedImageIds.includes(img.url)
      );
      // console.log(`Found ${unusedImages.length} unused images in panel`);

      // Wait for all uploads to complete
      // console.log(`Starting upload of ${uploadPromises.length} images...`);
      const uploadResults = await Promise.all(uploadPromises);

      // console.log("All images uploaded successfully!", uploadResults);

      let imgIndex = 0;

      const htmlContent = components
        .map((comp) => {
          switch (comp.type) {
            case "richtext":
              return `<div class="rich-text-content">${
                comp.data.content || ""
              }</div>`;
            case "image": {
              const url = uploadedImages[imgIndex]?.uploadedUrl || "";
              const alt = comp.data.alt || "";
              const caption = comp.data.caption || "";
              const html = `<div class="image-container">
      <img src="${url}" alt="${alt}" />
      ${caption ? `<p class="caption">${caption}</p>` : ""}
    </div>`;
              imgIndex++;
              return html;
            }
            default:
              return "";
          }
        })
        .join("\n");

      const handleCreate = async () => {
        try {
          // const content = fullHTMLGenerate(htmlContent);
          const mainImageUrl = updatedMainImage?.uploadedUrl || null;
          const news = {
            title: title,
            summary: summary,
            content: htmlContent,
            image: mainImageUrl, // mainImageUrl is set from the main image upload (ảnh hiển thị)
            categoryId: selectedCategory,
          };
          const response = await authorAPI.createnews(news);
          // console.log("Tạo bài viết thành công:", response.data);
          setNotifyData({
            message: "Thành công",
            description: "Bài báo của bạn sẽ được đăng khi được phê duyệt",
          });
          setVisible(true);
          setTypeNotify("success");
          setComponents([]);
          setSummary("");
          setTitle("");
          setMainImage(null);
        } catch (error) {
          console.error("Tạo bài viết thất bại:", error);
          alert("Bạn phải đăng kí trở thành tác giả để có thể đăng tin!");
        } finally {
          setIsSubmitting(false);
        }
      };
      handleCreate();
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.");
    }
  };

  // Preview to HTML
  const handlePreview = () => {
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
            ${
              comp.data.caption
                ? `<p class="caption">${comp.data.caption}</p>`
                : ""
            }
          </div>`;
          default:
            return "";
        }
      })
      .join("\n");

    const fullHTML = fullHTMLGenerate(htmlContent);

    setPreviewHTML(fullHTML);
    setIsPreviewVisible(true);
  };

  return (
    <div
      style={{ height: "100vh", backgroundColor: "#f5f5f5", display: "flex" }}
    >
      {/* Left Panel - Components - Fixed */}
      <div
        style={{
          width: "20%", // Using fixed width instead of Col span
          backgroundColor: "#fff",
          borderRight: "1px solid #d9d9d9",
          textAlign: "center",
          position: "fixed",
          left: 0,
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

          {/* Image Upload Area - Resized */}
          <div style={{ marginBottom: "16px" }}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              Image Panel
            </Text>
            <div
              style={{
                border: "2px dashed #d9d9d9",
                borderRadius: "6px",
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#fafafa",
                marginTop: "8px",
                cursor: "pointer",
                minHeight: "120px", // Increased height
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
                  fontSize: "32px", // Increased icon size
                  color: "#bfbfbf",
                  marginBottom: "12px",
                }}
              />
              <div
                style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}
              >
                Drop images here or click to upload
              </div>
              <div
                style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}
              >
                Images will be displayed as 600px x 400px
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
                        height: "80px", // Increased preview height
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
      </div>

      {/* Middle Panel - Workspace - Scrollable */}
      <div
        style={{
          marginLeft: "20%",
          marginRight: "20%",
          width: "60%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            margin: 16,
          }}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}
          />
          <Input
            placeholder="Nhập tóm tắt bài viết"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ fontStyle: "italic", fontSize: 16 }}
          />
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
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {components.map((component, index) => (
                <Card key={component.id} style={{ backgroundColor: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <div
                      className="drag-handle"
                      style={{
                        marginRight: "8px",
                        marginTop: "4px",
                        cursor: "move",
                        padding: "4px",
                        borderRadius: "4px",
                        minWidth: "24px",
                        minHeight: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      draggable
                      onDragStart={(e) => handleReorderDragStart(e, index)}
                    >
                      <HolderOutlined
                        style={{
                          color: "#bfbfbf",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      {component.type === "richtext" && (
                        <InlineRichTextEditor
                          initialContent={component.data.content}
                          onSave={handleRichTextSave}
                          componentId={component.id}
                        />
                      )}
                      {component.type === "image" && (
                        <div
                          style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <img
                            src={component.data.url}
                            alt={component.data.alt}
                            style={{
                              width: "600px", // Preview size in editor
                              height: "400px", // Maintaining 500:700 ratio
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #d9d9d9",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          />
                          <Input
                            placeholder="Caption..."
                            value={component.data.caption || ""}
                            onChange={(e) =>
                              updateComponent(component.id, {
                                caption: e.target.value,
                              })
                            }
                            style={{
                              width: "600px",
                              marginBottom: "4px",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#999",
                              textAlign: "center",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>
      </div>

      {/* Right Panel - Controls - Fixed */}
      <div
        style={{
          width: "20%", // Using fixed width instead of Col span
          backgroundColor: "#fff",
          borderLeft: "1px solid #d9d9d9",
          textAlign: "center",
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <div style={{ padding: "16px" }}>
          <Title level={4}>Công cụ</Title>

          {/* Main Image Upload */}
          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Ảnh hiển thị
            </Text>

            <input
              type="file"
              ref={mainImageInputRef}
              onChange={handleMainImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            {!mainImage ? (
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => mainImageInputRef.current?.click()}
                block
              >
                Upload ảnh chính
              </Button>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={mainImage.url}
                  alt={mainImage.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                  }}
                  onClick={removeMainImage}
                />
                <Text
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "8px",
                  }}
                >
                  {mainImage.name}
                </Text>
                <Button
                  type="default"
                  size="small"
                  onClick={() => mainImageInputRef.current?.click()}
                  block
                >
                  Thay đổi
                </Button>
              </div>
            )}
          </div>

          {/* Dropdown */}
          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Chủ đề
            </Text>
            <Select
              value={selectedCategory}
              style={{ width: "100%" }}
              onChange={setSelectedCategory}
              loading={loadingCategories}
              placeholder={loadingCategories ? "Đang tải..." : "Chọn chủ đề"}
              disabled={loadingCategories || categories.length === 0}
            >
              {renderOptions(categories)}
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

          <Button
            type="primary"
            disabled={components.length === 0}
            onClick={handlePublishPost}
            loading={isSubmitting}
            block
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng bài"}
          </Button>
        </div>
      </div>

      <Modal
        title="Xem trước bài viết"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        centered
        width={1200}
        bodyStyle={{ padding: 0 }}
      >
        <iframe
          srcDoc={previewHTML}
          title="HTML Preview"
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      </Modal>

      <NotificationModalFactory
        type={typeNotify}
        visible={visible}
        onClose={() => setVisible(false)}
        message={notifyData.message}
        description={notifyData.description}
      />
    </div>
  );
};

export default CreateNews;
