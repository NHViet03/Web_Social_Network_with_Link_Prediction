import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import CusCard from "../../components/Customer/CusCard";
import formatMoney from "../../utils/formatNumber";
import ModalSendMail from "../../components/ModalSendMail";

const cusData = {
  id: "KH01",
  name: "Nguyễn Hoàng Việt",
  email: "vietdota12@gmail.com",
  phone: "0848044777",
  total: 20000000,
  shippingAddress: "Quang Trung, Hà Đông, Hà Nội",
  orders: [
    {
      id: "HD-012",
      quantity: 10,
      totalAmount: 38990000,
      orderDate: new Date(),
      address: "Quang Trung, Hà Đông, Hà Nội",
      userId: "KH01",
      status: "Đã giao hàng",
    },
    {
      id: "HD-013",
      quantity: 7,
      totalAmount: 28990000,
      orderDate: new Date(2023, 5, 4),
      address: "Trần Phú, Hà Đông, Hà Nội",
      userId: "KH01",
      status: "Đang giao hàng",
    },
    {
      id: "HD-013",
      quantity: 15,
      totalAmount: 18990000,
      orderDate: new Date(2023, 3, 1),
      address: "Thủ Đức, Hồ Chí Minh",
      userId: "KH01",
      status: "Đã hủy đơn",
    },
  ],
  orderSuccess: 3,
  orderCancel: 0,
};

function Customer() {
  const [customer, setCustomer] = useState({});
  const [filter, setFilter] = useState({
    sort: "default",
    status: "all",
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCustomer(cusData);
  }, []);

  useEffect(() => {
    if (!customer.orders) return;
    let newOrders = [...customer.orders];
    switch (filter.sort) {
      case "total_high_to_low":
        newOrders.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "total_low_to_high":
        newOrders.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "date_newest_to_oldest":
        newOrders.sort((a, b) => b.orderDate - a.orderDate);
        break;
      case "date_oldest_to_newest":
        newOrders.sort((a, b) => a.orderDate - b.orderDate);
        break;
      default:
        let newArr = [];
        for (let i = 0; i < 3; i++) {
          newArr.push(...cusData.orders);
          newOrders = newArr;
        }
    }
    setCustomer({
      ...customer,
      orders: newOrders,
    });
  }, [filter.sort]);

  const navigate = useNavigate();

  const cusCards = useMemo(() => {
    if (!customer) return [];

    return [
      {
        title: "Doanh thu",
        value: "$ " + formatMoney(customer?.total) + "đ",
        subTitle: "Doanh thu mới trong 365 ngày",
      },
      {
        title: "Tổng đơn hàng",
        value: customer.orders?.length,
        icon: "fa-solid fa-circle",
        color: "waiting",
        subTitle: "Tổng đơn hàng trong 365 ngày",
      },
      {
        title: "Đơn hàng thành công",
        value: customer.orderSuccess,
        icon: "fa-solid fa-circle",
        color: "success",
        subTitle: "Đơn hàng thành công trong 365 ngày",
      },
      {
        title: "Đơn hàng bị hủy",
        value: customer.orderCancel,
        icon: "fa-solid fa-circle",
        color: "cancel",
        subTitle: "Đơn hàng bị hủy trong 365 ngày",
      },
    ];
  }, [customer]);

  return (
    <div className="customer_detail">
      <header className="box_shadow d-flex justify-content-between align-items-center mb-4 bg-white">
        <div className="d-flex align-items-center">
          <Link to="/users" className="btn btn_normal px-3">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h4 className="fw-medium ms-3">{customer.name}</h4>
        </div>
        <div className="d-flex gap-3">
          <div className="btn btn_normal">
            {moment(new Date(2023, 3, 1)).format("MM/YYYY")} -{" "}
            {moment(new Date()).format("MM/YYYY")}
          </div>
          <div className="dropdown">
            <button
              className=" btn btn_normal px-3 "
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>
            <ul className="dropdown-menu">
              <li>
                <div className="dropdown-item fw-medium"></div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="mb-4 bg-white p-4 rounded">
        <div className="mb-4 d-flex justify-content-between align-items-center customer_cards">
          {cusCards.map((card, index) => (
            <CusCard key={index} card={card} />
          ))}
        </div>
        <div className="mb-4 d-flex flex-wrap customer_side">
          <div className="customer_side_left">
            <h5 className="fw-medium mb-3">Thông tin khách hàng</h5>
            <div className="mb-3 fs-6">
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <p>Tên</p>
                  <p className="mt-1 fw-medium">{customer.name}</p>
                </div>
                <i className="fa-solid fa-circle-user fs-2" />
              </div>
              <div className="mb-2">
                <p>Email</p>
                <p className="mt-1 fw-medium">{customer.email}</p>
              </div>
              <div className="mb-2">
                <p>Số điện thoại</p>
                <p className="mt-1 fw-medium">{customer.phone}</p>
              </div>
              <div className="mb-2">
                <p>Địa chỉ giao hàng</p>
                <p className="mt-1 fw-medium">{customer.shippingAddress}</p>
              </div>
            </div>
            <button
              className="btn btn_normal btn_accept w-100"
              onClick={() => setShowModal(true)}
            >
              Gửi Email
            </button>
          </div>
          <div className="customer_side_right">
            <h5 className="fw-medium mb-3">Danh sách đơn hàng</h5>
            <div className="mb-4 d-flex align-items-center justify-content-between">
              {/* <Filter filter={filter} setFilter={setFilter} filterSmall /> */}
            </div>
            <div className="customer_orders">
              {/* <OrderList orders={customer.orders || []} orderSmall /> */}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalSendMail customer={customer} setShowModal={setShowModal} />
      )}
    </div>
  );
}

export default Customer;
