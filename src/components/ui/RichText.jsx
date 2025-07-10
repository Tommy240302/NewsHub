import React, { useState, useRef } from "react";

export default function InlineRichTextEditor({
  initialContent,
  onSave,
  componentId,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialContent);
  const editorRef = useRef(null);
  const savedContent = useRef(htmlContent);
  const [showMessage, setShowMessage] = useState("");

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleDone = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onSave(componentId, newContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = savedContent.current;
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    savedContent.current = htmlContent;
    setIsEditing(true);
  };

  const formatButtons = [
    {
      key: "bold",
      icon: "B",
      tooltip: "Đậm (Ctrl+B)",
      command: "bold",
      style: { fontWeight: "bold" },
    },
    {
      key: "italic",
      icon: "I",
      tooltip: "Nghiêng (Ctrl+I)",
      command: "italic",
      style: { fontStyle: "italic" },
    },
    {
      key: "underline",
      icon: "U",
      tooltip: "Gạch chân (Ctrl+U)",
      command: "underline",
      style: { textDecoration: "underline" },
    },
    {
      key: "quote",
      icon: "❝",
      tooltip: "Trích dẫn",
      command: "formatBlock",
      value: "<blockquote>",
    },
  ];

  const headingButtons = [
    {
      key: "normal",
      text: "Normal",
      tooltip: "Văn bản thông thường",
      command: "formatBlock",
      value: "<div>",
    },
    {
      key: "h1",
      text: "H1",
      tooltip: "Tiêu đề 1",
      command: "formatBlock",
      value: "<h1>",
    },
    {
      key: "h2",
      text: "H2",
      tooltip: "Tiêu đề 2",
      command: "formatBlock",
      value: "<h2>",
    },
    {
      key: "h3",
      text: "H3",
      tooltip: "Tiêu đề 3",
      command: "formatBlock",
      value: "<h3>",
    },
    {
      key: "h4",
      text: "H4",
      tooltip: "Tiêu đề 4",
      command: "formatBlock",
      value: "<h4>",
    },
    {
      key: "h5",
      text: "H5",
      tooltip: "Tiêu đề 5",
      command: "formatBlock",
      value: "<h5>",
    },
    {
      key: "h6",
      text: "H6",
      tooltip: "Tiêu đề 6",
      command: "formatBlock",
      value: "<h6>",
    },
  ];

  const buttonStyle = {
    padding: "8px 12px",
    margin: "2px",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    minWidth: "32px",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#1890ff",
    color: "white",
    border: "1px solid #1890ff",
    background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
    boxShadow: "0 2px 8px rgba(24,144,255,0.3)",
    fontWeight: "500",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f5f5f5",
    color: "#595959",
  };

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Toast Message */}
      {showMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            backgroundColor: "#52c41a",
            color: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {showMessage}
        </div>
      )}

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        {!isEditing ? (
          <div
            onClick={handleEdit}
            style={{
              minHeight: "120px",
              padding: "16px 20px",
              cursor: "pointer",
              backgroundColor: "#fafafa",
              borderRadius: "6px",
              border: "2px dashed #d9d9d9",
              transition: "all 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.borderColor = "#1890ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fafafa";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#262626",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "12px",
                opacity: 0.6,
                fontSize: "12px",
                color: "#8c8c8c",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ✏️ Click để chỉnh sửa
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            {/* Toolbar */}
            <div
              style={{
                marginBottom: "12px",
                padding: "12px 16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                border: "1px solid #e8e8e8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {/* Format Buttons */}
                <div style={{ display: "flex", marginRight: "8px" }}>
                  {formatButtons.map((btn) => (
                    <button
                      key={btn.key}
                      title={btn.tooltip}
                      onClick={() => handleFormat(btn.command, btn.value)}
                      style={{
                        ...buttonStyle,
                        ...btn.style,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e6f7ff";
                        e.currentTarget.style.borderColor = "#1890ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#d9d9d9";
                      }}
                    >
                      {btn.icon}
                    </button>
                  ))}
                </div>

                {/* Heading Buttons */}
                <div style={{ display: "flex" }}>
                  {headingButtons.map((btn) => (
                    <button
                      key={btn.key}
                      title={btn.tooltip}
                      onClick={() => handleFormat(btn.command, btn.value)}
                      style={{
                        ...buttonStyle,
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e6f7ff";
                        e.currentTarget.style.borderColor = "#1890ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#d9d9d9";
                      }}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                minHeight: "150px",
                padding: "16px 20px",
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fff",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#262626",
                outline: "none",
                transition: "border-color 0.3s ease",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(24,144,255,0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            {/* Action Buttons */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={handleCancel}
                style={cancelButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e6e6e6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleDone}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(24,144,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(24,144,255,0.3)";
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
