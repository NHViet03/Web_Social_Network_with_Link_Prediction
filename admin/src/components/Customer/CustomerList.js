import React from "react";
import { Link } from "react-router-dom";
import formatUserInfo from "../../utils/formatUserInfo";

const CustomerList = ({ customers }) => {
  return (
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Mã khách hàng</th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Họ tên <i className="fa-solid fa-sort ms-1" />
          </th>
          <th scope="col">Email</th>
          <th scope="col">Số điện thoại</th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Doanh số (VNĐ) <i className="fa-solid fa-sort ms-1" />
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) => {
          const newData = formatUserInfo(customer);

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <i className="fa-solid fa-user me-1" />
                {newData.id}
              </td>
              <td>{newData.name}</td>
              <td>{newData.email}</td>
              <td>{newData.phone}</td>
              <td>{newData.total}</td>
              <td colSpan="1">
                <div className="d-flex align-items-center gap-3">
                  <Link to={`/users/${newData.id}`}>
                    <button className="btn btn_table btn_detail">
                      <i className="fa-solid fa-circle-info" />
                      Chi tiết
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CustomerList;
