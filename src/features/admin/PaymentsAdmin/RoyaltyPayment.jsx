import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Divider,
  Form,
  Modal,
  InputNumber,
  Input,
  Popconfirm,
  Select,
  Tabs,
  Tag,
} from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import apiClient from "../../../api/apiClient";
import NotificationModalFactory from "../../../components/NotificationModal/NotificationModalFactory";

const { Title } = Typography;

const AuthorPaymentTable = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [tariffData, setTariffData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  const [form] = Form.useForm();

  const [paymentHistoryData, setPaymentHistoryData] = useState([]);

  const [transactionsData, setTransactionsData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewTransactionModal, setViewTransactionModal] = useState(false);

  const [createTransactionModal, setCreateTransactionModal] = useState(false);
  const [transactionForm] = Form.useForm();
  const [transactionDataToCreate, setTransactionDataToCreate] = useState([]);

  const [typeNotify, setTypeNotify] = useState("info");
  const [notifyData, setNotifyData] = useState({
    message: "",
    description: "",
  });
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salaryRes, tariffRes] = await Promise.all([
        apiClient.get("/admin/payments/calculate"),
        apiClient.get("/admin/view-tariffs"),
      ]);

      const processedTariff = tariffRes.data
        .map((tariff) => ({
          ...tariff,
          maxView:
            tariff.maxView === null ? Number.MAX_SAFE_INTEGER : tariff.maxView,
        }))
        .sort((a, b) => a.minView - b.minView);

      setTariffData(processedTariff);

      const calculatedSalaryData = salaryRes.data.map((author) => ({
        ...author,
        amount_to_pay: calculatePayment(author.unpaid_views, processedTariff),
      }));

      setSalaryData(calculatedSalaryData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/transactions");
      setTransactionsData(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      cosnole.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/payments/history");
      console.log(response.data);
      const historyArray = Array.isArray(response.data) ? response.data : [];
      setPaymentHistoryData(historyArray);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchTransactions();
    fetchPaymentHistory();
  }, []);
  const calculatePayment = (unpaidViews, tariffs) => {
    if (unpaidViews <= 0) return 0;

    const sortedTariffs = [...tariffs].sort((a, b) => a.minView - b.minView);

    console.log(sortedTariffs);

    for (const tariff of sortedTariffs) {
      if (unpaidViews >= tariff.minView && unpaidViews <= tariff.maxView) {
        return unpaidViews * tariff.pricePerView;
      }
    }

    const highestTier = sortedTariffs[sortedTariffs.length - 1];
    return unpaidViews * highestTier.pricePerView;
  };
  const handleAddTariff = () => {
    setEditingTariff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTariff = (record) => {
    setEditingTariff(record);
    form.setFieldsValue({
      minView: record.minView,
      maxView:
        record.maxView === Number.MAX_SAFE_INTEGER ? null : record.maxView,
      pricePerView: record.pricePerView,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const handleDeleteTariff = async (id) => {
    try {
      await apiClient.delete(`/admin/view-tariffs/${id}`);
      setNotifyData({
        message: "Thành công",
        description: "Xóa thành công",
      });
      setTypeNotify("success");
      setVisible(true);
      fetchData();
    } catch (error) {
      console.error("Error deleting tariff:", error);
      setNotifyData({
        message: "Lỗi",
        description: "Kiểm tra server",
      });
      setTypeNotify("error");
      setVisible(true);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const processedValues = {
        ...values,
        maxView:
          values.maxView === null || values.maxView === undefined
            ? null
            : values.maxView,
      };

      if (editingTariff) {
        await apiClient.put(
          `/admin/view-tariffs/${editingTariff.id}`,
          processedValues
        );
        console.log("Tariff updated successfully");
        setNotifyData({
          message: "Thành công",
          description: "Thay đổi thành công",
        });
        setTypeNotify("success");
        setVisible(true);
      } else {
        await apiClient.post("/admin/view-tariffs", processedValues);
        setNotifyData({
          message: "Thành công",
          description: "Thêm thành công",
        });
        setTypeNotify("success");
        setVisible(true);
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error saving tariff:", error);
      setNotifyData({
        message: "Lỗi",
        description: "Kiểm tra server",
      });
      setTypeNotify("error");
      setVisible(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewTransaction = (record) => {
    setSelectedTransaction(record);
    setViewTransactionModal(true);
  };

  const parseJsonData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return {
        data: parsed,
        isArray: Array.isArray(parsed),
      };
    } catch (error) {
      return null;
    }
  };

  const handleConfirmTransaction = async (transactionId) => {
    try {
      await apiClient.patch(
        `/admin/transactions/${transactionId}?status=COMPLETE`
      );
      console.log("Transaction confirmed successfully");
      fetchTransactions();
      fetchData(); // Refresh salary data
    } catch (error) {
      console.error("Error confirming transaction:", error);
      console.error("Failed to confirm transaction");
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    try {
      await apiClient.patch(
        `/admin/transactions/${transactionId}?status=REJECT`
      );
      console.log("Transaction rejected successfully");
      fetchTransactions();
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      console.error("Failed to reject transaction");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "COMPLETE":
        return "green";
      case "REJECT":
        return "red";
      default:
        return "default";
    }
  };

  // Transaction operations
  const handleCreateTransaction = () => {
    // Filter authors with unpaid amounts
    const authorsWithPayments = salaryData.filter(
      (author) => author.amount_to_pay > 0
    );

    if (authorsWithPayments.length === 0) {
      setNotifyData({
        message: "Lỗi",
        description: "Không có dữ liệu thanh toán",
      });
      setTypeNotify("info");
      setVisible(true);
      return;
    }

    // Create JSON data array from salary data
    const transactionData = authorsWithPayments.map((author) => ({
      userId: author.author_id,
      paymentNumber: author.payment_number,
      amount: author.amount_to_pay,
      viewCurrent: author.unpaid_views,
    }));
    setTransactionDataToCreate(transactionData);
    setCreateTransactionModal(true);
  };

  const handleCreateTransactionSubmit = async () => {
    try {
      const dataToSend = transactionDataToCreate.map(
        ({ authorName, ...rest }) => rest
      );

      // Send to API with jsonData as string
      await apiClient.post("/admin/transactions", {
        jsonData: JSON.stringify(dataToSend), // Convert back to compact string
      });

      setNotifyData({
        message: "Thành công",
        description: "Tạo thành công",
      });
      setTypeNotify("success");
      setVisible(true);
      setCreateTransactionModal(false);
      setTransactionDataToCreate([]);
      fetchTransactions(); // Refresh transactions list
      fetchData(); // Refresh payment data
    } catch (error) {
      console.error("Error creating transaction:", error);
      setNotifyData({
        message: "Thất bại",
        description: "Kiểm tra server",
      });
      setTypeNotify("error");
      setVisible(true);
    }
  };

  const filteredTransactions =
    statusFilter === "ALL"
      ? transactionsData
      : transactionsData.filter((t) => t.status === statusFilter);

  const columns_paymentHistory = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (_, __, index) => index + 1,
    },
    {
      title: "ID Tác giả",
      dataIndex: "authorId",
      key: "authorId",
      width: 100,
    },
    {
      title: "Tên tác giả",
      dataIndex: "authorName",
      key: "authorName",
      width: 180,
    },
    {
      title: "Mã thanh toán",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 120,
    },
    {
      title: "Số tiền đã trả",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (value) => value?.toLocaleString(),
    },
    {
      title: "Lượt xem đã thanh toán",
      dataIndex: "viewPaid",
      key: "viewPaid",
      width: 120,
      align: "center",
      render: (value) => value?.toLocaleString(),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 180,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const columns_salary = [
    {
      title: "ID tác giả",
      dataIndex: "author_id",
      key: "author_id",
      width: 100,
    },
    {
      title: "Tên tác giả",
      dataIndex: "author_name",
      key: "author_name",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "STK VPAY",
      dataIndex: "payment_number",
      key: "payment_number",
      width: 150,
    },
    {
      title: "Tổng lượt xem",
      dataIndex: "total_views",
      key: "total_views",
      align: "center",
      width: 200,
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Lượt xem đã thanh toán",
      dataIndex: "views_already_paid",
      key: "views_already_paid",
      align: "center",
      width: 250,
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Lượt xem chưa thanh toán",
      dataIndex: "unpaid_views",
      key: "unpaid_views",
      align: "center",
      width: 250,
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Số tiền phải thanh toán",
      dataIndex: "amount_to_pay",
      key: "amount_to_pay",
      align: "center",
      width: 200,
      render: (value) => `${value.toLocaleString()} vnd`,
    },
  ];

  const columns_tariff = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Min View",
      dataIndex: "minView",
      key: "minView",
      width: 150,
      render: (value) => value?.toLocaleString(),
    },
    {
      title: "Max View",
      dataIndex: "maxView",
      key: "maxView",
      width: 150,
      render: (value) =>
        value === Number.MAX_SAFE_INTEGER ? "∞" : value?.toLocaleString(),
    },
    {
      title: "Số tiền mỗi lượt xem",
      dataIndex: "pricePerView",
      key: "pricePerView",
      width: 150,
      align: "right",
      render: (value) => value?.toLocaleString(),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTariff(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có muốn sửa tỉ giá này không ?"
            onConfirm={() => handleDeleteTariff(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns_transactions = [
    {
      title: "Mã thanh toán",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Tổng tiền (vnd)",
      dataIndex: "jsonData",
      key: "amount",
      width: 180,
      align: "right",
      render: (jsonData) => {
        const parsed = parseJsonData(jsonData);
        if (!parsed) return "-";
        if (parsed.isArray) {
          const total = parsed.data.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );
          return total.toLocaleString();
        }
        return parsed.data?.amount ? parsed.data.amount.toLocaleString() : "-";
      },
    },
    {
      title: "Tổng lượt xem",
      dataIndex: "jsonData",
      key: "viewCurrent",
      width: 120,
      align: "center",
      render: (jsonData) => {
        const parsed = parseJsonData(jsonData);
        if (!parsed) return "-";
        if (parsed.isArray) {
          const total = parsed.data.reduce(
            (sum, item) => sum + (item.viewCurrent || 0),
            0
          );
          return total.toLocaleString();
        }
        return parsed.data?.viewCurrent?.toLocaleString() || "-";
      },
    },
    {
      title: "Số bản ghi",
      dataIndex: "jsonData",
      key: "itemsCount",
      width: 120,
      align: "center",
      render: (jsonData) => {
        const parsed = parseJsonData(jsonData);
        if (!parsed) return "-";
        if (parsed.isArray) {
          return parsed.data.length;
        }
        return "1";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      width: 180,
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            onClick={() => handleViewTransaction(record)}
          >
            Xem
          </Button>
          {record.status === "PENDING" && (
            <>
              <Popconfirm
                title="Xác nhận đã hoàn thành thanh toán?"
                description="Bạn có muốn hoàn thành thanh toán?"
                onConfirm={() => handleConfirmTransaction(record.id)}
                okText="Có"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  size="small"
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                />
              </Popconfirm>
              <Popconfirm
                title="Hủy thanh toán?"
                description="Bạn có chắc muốn hủy lượt thanh toán này?"
                onConfirm={() => handleRejectTransaction(record.id)}
                okText="Có"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  size="small"
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const exportToExcel = () => {
    const exportData = salaryData
      .filter((row) => row.amount_to_pay != 0)
      .map((row) => ({
        "ID tác giả": row.author_id,
        "Tên tác giả": row.author_name,
        Email: row.email,
        "Số TK VNPAY": row.payment_number,
        "Số tiền chuyển (vnd)": row.amount_to_pay,
      }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `author_payments_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const createTransaction = async () => {};

  const totalAmount = salaryData.reduce(
    (sum, row) => sum + row.amount_to_pay,
    0
  );

  const tabItems = [
    {
      key: "1",
      label: "Thống kê thanh toán",
      children: (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Bảng thống kê số tiền thanh toán
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={exportToExcel}
                size="large"
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
              >
                Xuất Excel
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateTransaction}
                size="large"
                style={{ background: "#0d6ce7ff", borderColor: "#0d6ce7ff" }}
              >
                Tạo thanh toán
              </Button>
            </Space>
          </div>

          <Table
            columns={columns_salary}
            dataSource={salaryData}
            loading={loading}
            pagination={false}
            bordered
            scroll={{ x: 1200 }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: "#fafafa" }}>
                  <Table.Summary.Cell index={0} colSpan={7} align="right">
                    <strong>Tổng phải thanh toán:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7} align="right">
                    <strong style={{ color: "#52c41a", fontSize: "16px" }}>
                      {totalAmount.toLocaleString()} vnd
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <Divider />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                Bảng tỉ giá
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddTariff}
              >
                Thêm tỉ giá
              </Button>
            </div>
            <Table
              columns={columns_tariff}
              dataSource={tariffData}
              loading={loading}
              pagination={false}
              bordered
              scroll={{ x: 800 }}
              rowKey="id"
            />
          </div>
        </Space>
      ),
    },
    {
      key: "2",
      label: "Thanh toán",
      children: (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header with Filter */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Thông tin thanh toán
            </Title>
            <Space>
              <span>Trạng thái:</span>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="ALL">All</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="COMPLETE">Complete</Option>
                <Option value="REJECT">Reject</Option>
              </Select>
            </Space>
          </div>

          {/* Transactions Table */}
          <Table
            columns={columns_transactions}
            dataSource={filteredTransactions}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} transactions`,
            }}
            bordered
            scroll={{ x: "max-content" }}
            rowKey="id"
          />
        </Space>
      ),
    },
    {
      key: "3",
      label: "Lịch sủ thanh toán",
      children: (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Lịch sử thanh toán
            </Title>
          </div>

          {/* Payment History Table */}
          <Table
            columns={columns_paymentHistory}
            dataSource={paymentHistoryData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} payment records`,
            }}
            bordered
            scroll={{ x: "max-content" }}
            rowKey="id"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>
      {/* Add/Edit Modal */}
      <Modal
        title={editingTariff ? "Sửa tỉ giá" : "Thêm tỉ giá"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={500}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="tariffForm">
          <Form.Item
            name="minView"
            label="Min View"
            rules={[
              { required: true, message: "Please input minimum view!" },
              {
                type: "number",
                min: 0,
                message: "Must be greater than or equal to 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter minimum view"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="maxView"
            label="Max View (Để trống nghĩa là không giới hạn)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Must be greater than or equal to 0",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const minView = getFieldValue("minView");
                  if (!value || !minView || value > minView) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Max view must be greater than min view")
                  );
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter maximum view or leave empty"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="pricePerView"
            label="Giá mỗi lượt xem (vnd)"
            rules={[
              { required: true, message: "Please input price per view!" },
              {
                type: "number",
                min: 0,
                message: "Must be greater than or equal to 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter price per view"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter tariff description" />
          </Form.Item>
        </Form>
      </Modal>
      {/* View Transaction Modal */}
      <Modal
        title="Thông tin thanh toán"
        open={viewTransactionModal}
        onCancel={() => setViewTransactionModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewTransactionModal(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedTransaction && (
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <strong>Mã thanh toán:</strong>
                <span>{selectedTransaction.id}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <strong>Status:</strong>
                <Tag color={getStatusColor(selectedTransaction.status)}>
                  {selectedTransaction.status}
                </Tag>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <strong>Ngày tạo:</strong>
                <span>
                  {new Date(selectedTransaction.createDate).toLocaleString()}
                </span>
              </div>

              <Divider style={{ margin: "12px 0" }}>Dữ liệu thanh toán</Divider>

              {(() => {
                const parsed = parseJsonData(selectedTransaction.jsonData);
                if (!parsed) {
                  return (
                    <div
                      style={{
                        padding: "12px",
                        background: "#fff2e8",
                        border: "1px solid #ffbb96",
                        borderRadius: "4px",
                        color: "#d4380d",
                      }}
                    >
                      Invalid JSON data
                    </div>
                  );
                }

                // If jsonData is an array, display as table
                if (parsed.isArray) {
                  const columns = [
                    {
                      title: "ID Người dùng",
                      dataIndex: "userId",
                      key: "userId",
                      width: 100,
                    },
                    {
                      title: "Số tài khoản",
                      dataIndex: "paymentNumber",
                      key: "paymentNumber",
                      width: 150,
                    },
                    {
                      title: "Số tiền (vnd)",
                      dataIndex: "amount",
                      key: "amount",
                      width: 150,
                      align: "right",
                      render: (value) => value?.toLocaleString(),
                    },
                    {
                      title: "Lượt xem",
                      dataIndex: "viewCurrent",
                      key: "viewCurrent",
                      width: 100,
                      align: "center",
                      render: (value) => value?.toLocaleString(),
                    },
                  ];

                  const totalAmount = parsed.data.reduce(
                    (sum, item) => sum + (item.amount || 0),
                    0
                  );
                  const totalViews = parsed.data.reduce(
                    (sum, item) => sum + (item.viewCurrent || 0),
                    0
                  );

                  return (
                    <>
                      <Table
                        columns={columns}
                        dataSource={parsed.data}
                        pagination={false}
                        bordered
                        size="small"
                        rowKey={(record, index) => index}
                        summary={() => (
                          <Table.Summary>
                            <Table.Summary.Row
                              style={{ background: "#fafafa" }}
                            >
                              <Table.Summary.Cell
                                index={0}
                                colSpan={2}
                                align="right"
                              >
                                <strong>Total:</strong>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2} align="right">
                                <strong style={{ color: "#52c41a" }}>
                                  {totalAmount.toLocaleString()} vnd
                                </strong>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3} align="center">
                                <strong>{totalViews.toLocaleString()}</strong>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </Table.Summary>
                        )}
                      />
                    </>
                  );
                }

                // If jsonData is an object, display as key-value pairs
                const jsonData = parsed.data;
                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>User ID:</strong>
                      <span>{jsonData.userId}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>Số tài khoản:</strong>
                      <span>{jsonData.paymentNumber}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>Số tiền:</strong>
                      <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                        {jsonData.amount?.toLocaleString()} vnd
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>Số lượt xem thanh toán:</strong>
                      <span>{jsonData.viewCurrent?.toLocaleString()}</span>
                    </div>
                  </>
                );
              })()}
            </Space>
          </div>
        )}
      </Modal>

      {/* Create Transaction Modal */}
      <Modal
        title="Create New Transaction"
        open={createTransactionModal}
        onOk={handleCreateTransactionSubmit}
        onCancel={() => {
          setCreateTransactionModal(false);
          setTransactionDataToCreate([]);
        }}
        width={900}
        okText="Tạo thanh toán"
        cancelText="Hủy"
      >
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: "4px",
          }}
        >
          <strong>ℹ️ Lưu ý thông tin thanh toán</strong>
          <div style={{ marginTop: "8px", fontSize: "13px" }}>
            Tạo thanh toán cho {transactionDataToCreate.length} tác giả với
            trạng thái chờ thanh toán.
          </div>
        </div>

        <Table
          columns={[
            {
              title: "User ID",
              dataIndex: "userId",
              key: "userId",
              width: 100,
            },
            {
              title: "Số tài khảon",
              dataIndex: "paymentNumber",
              key: "paymentNumber",
              width: 150,
            },
            {
              title: "Số tiền (vnd)",
              dataIndex: "amount",
              key: "amount",
              width: 150,
              align: "right",
              render: (value) => value?.toLocaleString(),
            },
            {
              title: "Lượt xem",
              dataIndex: "viewCurrent",
              key: "viewCurrent",
              width: 120,
              align: "center",
              render: (value) => value?.toLocaleString(),
            },
          ]}
          dataSource={transactionDataToCreate}
          pagination={false}
          bordered
          size="small"
          rowKey="userId"
          scroll={{ y: 400 }}
          summary={() => {
            const totalAmount = transactionDataToCreate.reduce(
              (sum, item) => sum + item.amount,
              0
            );
            const totalViews = transactionDataToCreate.reduce(
              (sum, item) => sum + item.viewCurrent,
              0
            );
            return (
              <Table.Summary>
                <Table.Summary.Row style={{ background: "#fafafa" }}>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <strong>Total:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong style={{ color: "#52c41a", fontSize: "15px" }}>
                      {totalAmount.toLocaleString()} vnd
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">
                    <strong>{totalViews.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
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

export default AuthorPaymentTable;
