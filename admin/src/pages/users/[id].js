import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import UserCard from "../../components/User/UserCard";
import formatNumber from "../../utils/formatNumber";
import ModalSendMail from "../../components/ModalSendMail";
import Avatar from "../../components/Avatar";
import PostList from "../../components/Post/PostList";
import Filter from "../../components/Post/Filter";

const userData = {
  _id: "1",
  username: "tucute123",
  avatar:
    "https://res.cloudinary.com/dswg5in7u/image/upload/v1701775180/DreamerDB/f4iwxihq1ha27dtdrexe.png",
  fullname: "Trần Văn Tú",
  email: "Tu567@gmail.com",
  followers: 100000,
  likes: 200000,
  posts: [
    {
      _id: "65697a6e8c234125384779fd",
      likes: 1200,
      comments: 60,
      images: [
        {
          public_id: "DreamerDB/e3j8ijogzok2n6hgyfgf",
          url: "https://res.cloudinary.com/dswg5in7u/image/upload/v1701411436/DreamerDB/e3j8ijogzok2n6hgyfgf.jpg",
        },
      ],
      createdAt: new Date(2021, 5, 4),
    },
    {
      _id: "65697a6e8c234125384779ab",
      likes: 1100,
      comments: 40,
      images: [
        {
          public_id: "DreamerDB/e3j8ijogzok2n6hgyfgf",
          url: "https://res.cloudinary.com/dswg5in7u/image/upload/v1701411437/DreamerDB/mjpumpfp4v74b1t3gbos.jpg",
        },
      ],
      createdAt: new Date(2022, 5, 4),
    },
    {
      _id: "65697a6e8c234125384779cd",
      likes: 1000,
      comments: 30,
      images: [
        {
          public_id: "DreamerDB/e3j8ijogzok2n6hgyfgf",
          url: "https://res.cloudinary.com/dswg5in7u/image/upload/v1701411637/DreamerDB/ctj491vbrhilsmfhqk3t.jpg",
        },
      ],
      createdAt: new Date(2023, 5, 4),
    },
  ],
  following: 20,
  createdAt: new Date(2023, 11, 2),
};

function UserDetail() {
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState({
    sort: "default",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUser(userData);
  }, []);

  const navigate = useNavigate();

  const cusCards = useMemo(() => {
    if (!user) return [];

    return [
      {
        title: "Thời gian lập tài khoản",
        value: moment.duration(moment().diff(user.createdAt)).humanize(),
        icon: "fa-solid fa-calendar-week",
      },
      {
        title: "Lượt theo dõi",
        value: formatNumber(user.followers),
        icon: "fa-solid fa-user-plus",
        color: "waiting",
      },
      {
        title: "Luợt yêu thích",
        value: formatNumber(user.likes),
        icon: "fa-solid fa-heart",
        color: "cancel",
      },
      {
        title: "Số bài viết",
        value: user.posts?.length,
        icon: "fa-solid fa-image",
        color: "success",
      },
    ];
  }, [user]);

  useEffect(() => {
    if (!user.posts) return;
    let newPosts = [...user.posts];
    switch (filter.sort) {
      case "likes_high_to_low":
        newPosts.sort((a, b) => b.likes - a.likes);
        break;
      case "likes_low_to_high":
        newPosts.sort((a, b) => a.likes - b.likes);
        break;
      case "date_newest_to_oldest":
        newPosts.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "date_oldest_to_newest":
        newPosts.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default:
        newPosts = [...user.posts];
    }
    setUser({
      ...user,
      posts: newPosts,
    });
  }, [filter.sort]);

  return (
    <div className="user_detail">
      <header className="box_shadow d-flex justify-content-between align-items-center mb-4 bg-white">
        <div className="d-flex align-items-center">
          <Link to="/users" className="btn btn_normal px-3">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h4 className="fw-medium ms-3">
            {user.username} - {user.fullname}
          </h4>
        </div>
        <div className="d-flex gap-3">
          <div className="btn btn_normal">
            {moment(user.createdAt).format("MM/YYYY")} -{" "}
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
        <div className="mb-4 d-flex justify-content-between align-items-center user_cards">
          {cusCards.map((card, index) => (
            <UserCard key={index} card={card} />
          ))}
        </div>
        <div className="mb-4 d-flex flex-wrap user_side">
          <div className="user_side_left">
            <h5
              className="fw-medium mb-3"
              style={{
                height: "38px",
                lineHeight: "38px",
              }}
            >
              Thông tin người dùng
            </h5>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="d-flex mb-2 gap-1">
                  <p>Tên người dùng: </p>
                  <p className="mt-0 fw-medium">{user.username}</p>
                </div>
                <div className="d-flex mb-2 gap-1">
                  <p>Họ và tên: </p>
                  <p className="mt-0 fw-medium">{user.fullname}</p>
                </div>
                <div className="d-flex mb-2 gap-1">
                  <p>Email: </p> <p className="mt-0 fw-medium">{user.email}</p>
                </div>
                <div className="d-flex mb-2 gap-1">
                  <p>Đang theo dõi: </p>
                  <p className="mt-0 fw-medium">{user.following}</p>
                </div>
              </div>
              <Avatar src={user.avatar} size="avatar-lg" border />
            </div>
            <button
              className="btn btn_normal btn_accept w-100"
              onClick={() => setShowModal(true)}
            >
              Gửi Email
            </button>
          </div>
          <div className="user_side_right">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-medium">Danh sách bài viết</h5>
              <Filter filter={filter} setFilter={setFilter} filterSmall />
            </div>
            <div className="user_posts">
              <PostList posts={user.posts || []} postSmall />
            </div>
          </div>
        </div>
      </div>
      {showModal && <ModalSendMail user={user} setShowModal={setShowModal} />}
    </div>
  );
}

export default UserDetail;
