import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import formatNumber from "../../utils/formatNumber";
import Avatar from "../Avatar";

const OrderList = ({ posts, postSmall }) => {
  return (
    <table class="table table-hover">
      <thead>
        <tr>
          {!postSmall && <th scope="col">#</th>}
          <th scope="col">Mã bài viết</th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Lượt yêu thích <i className="fa-solid fa-sort ms-1" />
          </th>
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Lượt bình luận <i className="fa-solid fa-sort ms-1" />
          </th>
          {!postSmall ? (
            <th scope="col">Số lượng hình ảnh</th>
          ) : (
            <th scope="col">Hình ảnh</th>
          )}
          <th
            scope="col"
            style={{
              cursor: "pointer",
            }}
          >
            Ngày đăng <i className="fa-solid fa-sort ms-1" />
          </th>
          {!postSmall && <th scope="col">Thuộc về</th>}
          <th scope="col" colSpan={2}></th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={index}>
            {!postSmall && <td>{index + 1}</td>}
            <td>{"..." + post._id.slice(post._id.length - 8)}</td>
            <td>{formatNumber(post.likes)}</td>
            <td>{formatNumber(post.comments)}</td>
            {!postSmall ? <td>{post.images}</td> : <td>
              <img src={post.images[0].url} alt="Post" style={{
                width:'56px',
                height:'56px',
                borderRadius:'2px',
                objectFit:'cover'
              }}/>
              </td>}
            <td>{moment(post.createdAt).format("l")}</td>
            {!postSmall && (
              <td className="d-flex align-items-center gap-2">
                <Avatar src={post.user.avatar} size="avatar-sm" />
                {post.user.username}
              </td>
            )}
            <td colSpan="1">
              <div className="d-flex align-items-center gap-3">
                <Link to={`/posts/${post._id}`}>
                  <button className="btn btn_table btn_detail">
                    <i className="fa-solid fa-circle-info" />
                    Chi tiết
                  </button>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderList;
