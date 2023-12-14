import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment'
import formatUserInfo from "../../utils/formatUserInfo";
import Avatar from "../Avatar";

const CustomerList = ({ users }) => {
  return (
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Tên người dùng <i className="fa-solid fa-sort ms-1" />
          </th>
          <th scope="col">Họ và tên</th>
          <th scope="col">Email</th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Lượt theo dõi <i className="fa-solid fa-sort ms-1" />
          </th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Số bài viết <i className="fa-solid fa-sort ms-1" />
          </th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Ngày tham gia <i className="fa-solid fa-sort ms-1" />
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {users.map((customer, index) => {
          const newData = formatUserInfo(customer);

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="d-flex align-items-center gap-2">
                <Avatar src={newData.avatar} size="avatar-sm" />
                {newData.username}
              </td>
              <td>{newData.fullname}</td>
              <td>{newData.email}</td>
              <td>{newData.followers}</td>
              <td>{newData.posts}</td>
              <td>{moment(newData.createdAt).format('l')}</td>
              <td colSpan="1">
              <div className="d-flex align-items-center gap-3">
                <Link to={`/users/${newData._id}`}>
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
