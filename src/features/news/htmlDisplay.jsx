import React from "react";

export default function HtmlDisplay({ htmlContent }) {
  // Xóa các style inline như "font-size: 20px;" trong nội dung HTML
  const cleanHtml = htmlContent.replace(/font-size\s*:\s*\d+px;?/gi, "");

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
