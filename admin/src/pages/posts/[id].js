import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Avatar from "../../components/Avatar";
import Carousel from "../../components/Post/Carousel";
import ModalDeletePost from "../../components/ModalDeletePost";
import ModalSendMail from "../../components/ModalSendMail";

import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { restorePost } from "../../redux/actions/postAction";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [search, setSearch] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalMail, setShowModalMail] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

      const res = await getDataAPI(`admin/post/${id}`, auth.token);
      setPost(res.data.post);

      dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
    };

    getPost();
  }, [auth.token, dispatch, id]);

  const handleRestorePost = async () => {
    await dispatch(restorePost({ post, auth }));
    window.location.reload();
  };

  return (
    <div className="mb-4 post_detail">
      {post && (
        <>
          <header className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <div
                className="btn btn_normal px-3 me-3"
                onClick={() => navigate(-1)}
              >
                <i className="fa-solid fa-arrow-left" />
              </div>
              <span
                className="mb-0"
                style={{
                  opacity: "0.7",
                }}
              >
                Bài viết:{" "}
              </span>
              <span>
                {moment(post.createdAt).format("L")} - {post.user.username}
              </span>
            </div>
            <div className="d-flex gap-3">
              {post.isDeleted ? (
                <button
                  className="btn btn_normal btn_accept"
                  onClick={() => handleRestorePost()}
                >
                  <i className="fa-solid fa-arrow-rotate-left me-1" />
                  Khôi phục bài viết
                </button>
              ) : (
                <button
                  className="btn btn_normal btn_accept"
                  onClick={() => setShowModalDelete(true)}
                >
                  <i className="fa-solid fa-delete-left me-1" />
                  Xóa bài viết
                </button>
              )}

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
                      onClick={() => setShowModalMail(true)}
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
                      <td>
                        {"..." + comment._id.slice(comment._id.length - 4)}
                      </td>
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
                        {/* <button
                          className="btn btn_table btn_delete"
                          style={{
                            minWidth: "40px",
                          }}
                        >
                          <i className="fa-solid fa-trash me-0 " />
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="box_shadow post_detail_user-info">
              <div className="mb-3 pb-3">
                <h6 className="mb-3 fw-medium">
                  Thông tin chủ sở hữu bài viết
                </h6>
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
                <textarea
                  className="form-control"
                  readOnly
                  value={post.content}
                />
              </div>
            </div>
          </div>
          {showModalDelete && (
            <ModalDeletePost
              post={post}
              setShowModalDelete={setShowModalDelete}
            />
          )}
          {showModalMail && (
            <ModalSendMail user={post.user} setShowModal={setShowModalMail} />
          )}
        </>
      )}
    </div>
  );
}

export default PostDetail;
