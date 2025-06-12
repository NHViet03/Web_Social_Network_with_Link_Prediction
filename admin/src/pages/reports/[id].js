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
import { Pie } from "react-chartjs-2";

function ReportDetail() {
  const [post, setPost] = useState(null);
  const [report, setReport] = useState(null);
  const [search, setSearch] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalMail, setShowModalMail] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Model Predictions",
        data: [],
        backgroundColor: [],
        hoverOffset: 4,
      },
    ],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      try {
        dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

        const res = await getDataAPI(`admin/reports/${id}`, auth.token);
        setPost(res.data.post);
        setReport(res.data.report);
      } catch (err) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            title: "Lỗi",
            type: "error",
            data:
              err.response?.data?.message || "Không thể lấy thông tin bài viết",
          },
        });
      } finally {
        dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
      }
    };
    getPost();
  }, [auth.token, dispatch, id]);

  useEffect(() => {
    if (report && report.predictions) {
      const labels = report.predictions.map((pred) => pred.label);
      const data = report.predictions.map((pred) => pred.probability);
      const backgroundColor = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: "Model Predictions",
            data,
            backgroundColor,
            hoverOffset: 4,
          },
        ],
      });
    }
  }, [report]);

  const descriptonMapping = {
    NotHate: "Không có nội dung thù hận",
    Racist: "Có nội dung phân biệt chủng tộc",
    Sexist: "Có nội dung phân biệt giới tính",
    Homophobe: "Có nội dung phân biệt người đồng tính",
    Religion: "Có nội dung phân biệt tôn giáo",
    OtherHate: "Có nội dung thù hận khác",
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
                Báo cáo bài viết:{" "}
              </span>
              <span>
                {moment(report.createdAt).format("L")} - {report.label}
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
              <h5 className="fw-medium mb-3">Nội dung bài báo cáo</h5>
              <div>
                <div className="mb-2 pb-3">
                  <h6 className="mb-2 fw-medium">Thông tin người báo cáo</h6>
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
                        <p className="mt-0 fw-medium">
                          {report.reporter.username}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          Họ và tên:{" "}
                        </p>
                        <p className="mt-0 fw-medium">
                          {report.reporter.fullname}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2 pb-3">
                  <h6 className="mb-2 fw-medium">
                    Nội dung báo cáo - {report.label}
                  </h6>
                  <textarea
                    className="form-control"
                    readOnly
                    value={report.content}
                    style={{
                      resize: "none",
                    }}
                  />
                </div>
                <div>
                  <h6 className="mb-2 fw-medium">Kết quả mô hình dự đoán</h6>
                  <div className="d-flex justify-content-center align-items-center">
                    <Pie
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Tỷ lệ dự đoán của mô hình",
                          },

                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.label}: ${context.raw.toFixed(
                                  2
                                )}%`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  {/* Custom legend for label types */}
                  {report && report.predictions && (
                    <div className="mt-4">
                      <h6 className="fw-medium mb-2">Chú thích</h6>
                      <ul className="list-unstyled d-flex flex-wrap gap-3">
                        {report.predictions.map((pred, idx) => (
                          <li key={idx} className="d-flex align-items-center">
                            <span
                              style={{
                                display: "inline-block",
                                width: 16,
                                height: 16,
                                backgroundColor:
                                  chartData.datasets[0].backgroundColor[
                                    idx %
                                      chartData.datasets[0].backgroundColor
                                        .length
                                  ],
                                borderRadius: "50%",
                                marginRight: 8,
                                border: "1px solid #ccc",
                              }}
                            ></span>
                            <span>
                              {pred.label} -{" "}
                              {descriptonMapping[pred.label] ||
                                "Không xác định"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="box_shadow post_detail_user-info">
              <div className="mb-3 pb-3">
                <h6 className="mb-3 fw-medium">Hình ảnh bài viết</h6>
                <div className="">
                  <Carousel images={post.images} id={post._id} />
                </div>
              </div>
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

export default ReportDetail;
