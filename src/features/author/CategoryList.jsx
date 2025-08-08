import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../../common/api';
import { SUCCESS_STATUS, FAIL_STATUS } from '../../common/variable-const';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        const { status, data, errorMessage } = response;

        if (status === SUCCESS_STATUS) {
          setCategories(data);
        } else if (status === FAIL_STATUS) {
          console.error('Lỗi từ API:', errorMessage || 'Không thể lấy dữ liệu');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="category-loading">Đang tải danh sách chuyên mục...</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="category-empty">Không có chuyên mục nào.</div>;
  }

  return (
    <div className="category-container">
      <h2>Danh sách chuyên mục</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            {category.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
