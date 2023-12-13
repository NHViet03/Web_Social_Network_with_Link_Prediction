import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import formatMoney from "../../utils/formatNumber";
import Avatar from "../../components/Avatar";
import Carousel from "../../components/Post/Carousel";
import ModalDeletePost from "../../components/ModalDeletePost";

const fakePosts = {
  _id: "65697a6e8c234125384779fd",
  user: {
    _id: "65697a6e8c234125384779fd",
    username: "anle123",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701768061/DreamerDB/kejzf2gig4h5ycfanwfp.jpg",
    fullname: "Lê Văn An",
    email: "An789@gmail.com",
  },
  notes: "Không có ghi chú",
  content: "Yahooooooo 🤩🤩",
  likes: 1200,
  comments: [
    {
      _id: "65697a6e8c234125384779fd",
      likes: 2,
      user: {
        username: "hv120",
      },
      content: "Bài viết rất hay",
      createdAt: new Date(2021, 5, 4),
    },
    {
      _id: "65697a6e8c234125384779fd",
      likes: 2,
      user: {
        username: "hv120",
      },
      content: "Bài viết rất hay",
      createdAt: new Date(2021, 5, 4),
    },
    {
      _id: "65697a6e8c234125384779fd",
      likes: 2,
      user: {
        username: "hv120",
      },
      content: "Bài viết rất hay",
      createdAt: new Date(2021, 5, 4),
    },
  ],
  images: [
    {
      public_id: "DreamerDB/e3j8ijogzok2n6hgyfgf",

      url: "https://res.cloudinary.com/dswg5in7u/image/upload/v1701411436/DreamerDB/e3j8ijogzok2n6hgyfgf.jpg",
    },
    {
      public_id: "DreamerDB/e3j8ijogzok2n6hgyfgf",

      url: "https://res.cloudinary.com/dswg5in7u/image/upload/v1701411437/DreamerDB/mjpumpfp4v74b1t3gbos.jpg",
    },
  ],
  createdAt: new Date(2021, 5, 4),
};

function PostDetail() {
  const [post, setPost] = useState(fakePosts);
  const [search, setSearch] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const navigate = useNavigate();

  const handleExportPDF = () => {};

  return (
    <div className="mb-4 post_detail">
      <header className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span
            className="mb-0"
            style={{
              opacity: "0.7",
            }}
          >
            Bài viết:{" "}
          </span>
          <span>
            {moment(post.orderDate).format("L")} - {post.user.username}
          </span>
        </div>
        <div className="d-flex gap-3">
          <button
            className="btn btn_normal btn_accept"
            onClick={() => setShowModalDelete(true)}
          >
            <i className="fa-solid fa-delete-left me-1" />
            Xóa bài viết
          </button>
          <div className="dropdown">
            <button
              className=" btn btn_normal "
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>
            <ul className="dropdown-menu">
              <li>
                <div
                  className="dropdown-item fw-medium"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleExportPDF}
                >
                  <i className="fa-solid fa-envelope me-1" />
                  Gửi email tới người dùng
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className=" d-flex align-items-start gap-4 post_detail_body">
        <div className="box_shadow post_detail_comments">
          <h5 className="fw-medium mb-2">Hình ảnh bài viết</h5>
          <div className="mb-4">
            <Carousel images={post.images} id={post._id} />
          </div>
          <div className="mb-2 d-flex align-items-center justify-content-between">
            <h5 className="fw-medium">Bình luận bài viết</h5>

            <div className="d-flex justify-content-between align-items-center table_search">
              <input
                type="text"
                placeholder="Tìm kiếm bình luận..."
                className="form-control me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i class="fa-solid fa-magnifying-glass" />
            </div>
          </div>

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mã bình luận</th>
                <th scope="col">Nội dung</th>
                <th scope="col">Lượt yêu thích</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Thuộc về</th>
                <th scope="col" colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {post.comments.map((comment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{"..." + comment._id.slice(comment._id.length - 4)}</td>
                  <td
                    style={{
                      minWidth: "200px",
                    }}
                  >
                    {comment.content.length > 30
                      ? comment.content.slice(0, 30) + "..."
                      : comment.content}
                  </td>
                  <td>{comment.likes}</td>
                  <td>{moment(comment.createdAt).format("l")}</td>
                  <td>{comment.user.username}</td>
                  <td>
                    <button className="btn btn_table btn_delete">
                      <i className="fa-solid fa-trash me-0 " />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="box_shadow post_detail_user-info">
          <div className="mb-3 pb-3">
            <h6 className="mb-3 fw-medium">Thông tin chủ sở hữu bài viết</h6>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex mb-2">
                  <p
                    style={{
                      minWidth: "120px",
                    }}
                  >
                    Tên người dùng:{" "}
                  </p>
                  <p className="mt-0 fw-medium">{post.user.username}</p>
                </div>
                <div className="d-flex mb-2">
                  <p
                    style={{
                      minWidth: "120px",
                    }}
                  >
                    Họ và tên:{" "}
                  </p>
                  <p className="mt-0 fw-medium">{post.user.fullname}</p>
                </div>
                <div className="d-flex mb-2">
                  <p
                    style={{
                      minWidth: "120px",
                    }}
                  >
                    Email:{" "}
                  </p>
                  <p className="mt-0 fw-medium">{post.user.email}</p>
                </div>
              </div>
              <Avatar src={post.user.avatar} size="avatar-120" />
            </div>
          </div>
          <div className="mb-3 pb-3">
            <h6 className="mb-3 fw-medium">Thông tin bài viết</h6>
            <div className="d-flex mb-2">
              <p
                style={{
                  minWidth: "120px",
                }}
              >
                Lượt yêu thích:{" "}
              </p>
              <p className="mt-0 fw-medium">{post.likes}</p>
            </div>
            <div className="d-flex mb-2">
              <p
                style={{
                  minWidth: "120px",
                }}
              >
                Lượt bình luận:{" "}
              </p>
              <p className="mt-0 fw-medium">{post.comments.length}</p>
            </div>
            <div className="d-flex mb-2">
              <p
                style={{
                  minWidth: "120px",
                }}
              >
                Số lượng hình ảnh:{" "}
              </p>
              <p className="mt-0 fw-medium">{post.images.length}</p>
            </div>
            <div className="d-flex mb-2">
              <p
                style={{
                  minWidth: "120px",
                }}
              >
                Ngày tạo:{" "}
              </p>
              <p className="mt-0 fw-medium">
                {moment(post.createdAt).format("LLL")}
              </p>
            </div>
          </div>
          <div>
            <h6 className="mb-3 fw-medium">Nội dung</h6>
            <textarea className="form-control" readOnly value={post.content} />
          </div>
        </div>
      </div>
      {showModalDelete && (
        <ModalDeletePost post={post} setShowModalDelete={setShowModalDelete} />
      )}
    </div>
  );
}

export default PostDetail;
