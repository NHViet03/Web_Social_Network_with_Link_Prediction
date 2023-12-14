import React, { useState, useEffect } from "react";
import CardItem from "../components/Home/CardItem";

import Chart from "chart.js/auto";
import { Tooltip, Legend } from "chart.js";
import BarChart from "../components/Home/BarChart";
import LineChart from "../components/Home/LineChart";
import Users from "../components/Home/Users";

Chart.register(Tooltip, Legend);

const fakeCardData = [
  {
    title: "Người dùng mới",
    value: 1200,
    percent: "12",
    icon: "fa-solid fa-user-group",
    increase: true,
  },
  {
    title: "Tổng số bài viết mới",
    value: 200,
    percent: "5",
    icon: "fa-solid fa-image",
    increase: true,
  },
  {
    title: "Tổng số lượt yêu thích",
    value: 12400,
    percent: "-3",
    icon: "fa-solid fa-heart",
    increase: false,
  },
  {
    title: "Tổng số báo cáo vi phạm",
    value: 30,
    percent: "-2",
    icon: "fa-solid fa-user-shield",
    increase: false,
  },
];

const UserStatistic = [
  { id: 4, month: "4", num: 250 },
  { id: 5, month: "5", num: 300 },
  { id: 6, month: "6", num: 200 },
  { id: 7, month: "7", num: 400 },
  { id: 8, month: "8", num: 450 },
  { id: 9, month: "9", num: 500 },
  { id: 10, month: "10", num: 450 },
  { id: 11, month: "11", num: 400 },
  { id: 12, month: "12", num: 350 },
];

const PostsStatistic = [
  [
    { id: 4, month: "4", num: 50 },
    { id: 5, month: "5", num: 300 },
    { id: 6, month: "6", num: 320 },
    { id: 7, month: "7", num: 230 },
    { id: 8, month: "8", num: 240 },
    { id: 9, month: "9", num: 200 },
    { id: 10, month: "10", num: 350 },
    { id: 11, month: "11", num: 500 },
    { id: 12, month: "12", num: 600 },
  ],
  [
    { id: 4, month: "4", num: 30 },
    { id: 5, month: "5", num: 100 },
    { id: 6, month: "6", num: 120 },
    { id: 7, month: "7", num: 130 },
    { id: 8, month: "8", num: 100 },
    { id: 9, month: "9", num: 80 },
    { id: 10, month: "10", num: 150 },
    { id: 11, month: "11", num: 200 },
    { id: 12, month: "12", num: 250 },
  ],
];

const usersData = [
  {
    _id: "1",
    username: "anle123",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701768061/DreamerDB/kejzf2gig4h5ycfanwfp.jpg",
    fullname: "Lê Văn An",
    email: "An789@gmail.com",
    followers: 120000,
    likes: 230000,
    posts: 120,
  },
  {
    _id: "1",
    username: "tucute123",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701775180/DreamerDB/f4iwxihq1ha27dtdrexe.png",
    fullname: "Trần Văn Tú",
    email: "Tu567@gmail.com",
    followers: 100000,
    likes: 200000,
    posts: 110,
  },
  {
    _id: "1",
    username: "nhviet03",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701862207/DreamerDB/tffpbpkhsbeqsyzzivdl.jpg",
    fullname: "Nguyễn Hoàng Việt",
    email: "Viet123@gmail.com",
    followers: 90000,
    likes: 230000,
    posts: 100,
  },
  {
    _id: "1",
    username: "huongpham",
    avatar:
      "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png",
    fullname: "Phạm Thị Hương",
    email: "Huong012@gmail.com",
    followers: 80000,
    likes: 230000,
    posts: 20,
  },
  {
    _id: "1",
    username: "maitran",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1702040340/DreamerDB/unwcqgsecqcdoiezs4ca.jpg",
    fullname: "Trần Thị Mai",
    email: "Mai456@gmail.com",
    followers: 80000,
    likes: 21000,
    posts: 30,
  },
];

const Home = () => {
  const [cardsData, setCardsData] = useState([]);
  const [filter, setFilter] = useState({
    interval: "7days",
  });
  const [chartLeftData, setChartLeftData] = useState({
    labels: UserStatistic.map((item) => "Th " + item.month),
    datasets: [
      {
        label: "Người dùng mới ",
        data: UserStatistic.map((data) => data.num),
        backgroundColor: ["#fff"],
        borderRadius: 8,
        barThickness: 8,
      },
    ],
  });
  const [chartRightData, setChartRightData] = useState({
    labels: PostsStatistic[0].map((item) => "Th " + item.month),
    datasets: [
      {
        label: "Số lượng bài viết ",
        data: PostsStatistic[0].map((data) => data.num),
        backgroundColor: ["#C43302"],
        borderColor: "#C43302",
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 3,
      },
      {
        label: "Số lượng bài viết bị vi phạm ",
        data: PostsStatistic[1].map((data) => data.num),
        backgroundColor: ["#252F40"],
        borderColor: "#252F40",
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 3,
      },
    ],
  });
  const [users, setusers] = useState(usersData);

  useEffect(() => {
    setCardsData(fakeCardData);
  }, []);

  return (
    <div className="home">
      <select
        className="mb-3 form-select home_filter"
        required
        value={filter.interval}
        onChange={(e) =>
          setFilter({
            ...filter,
            interval: e.target.value,
          })
        }
      >
        <option value="7days">Trong 7 ngày gần nhất</option>
        <option value="30days">Trong 30 ngày gần nhất</option>
        <option value="365days">Trong năm nay</option>
      </select>
      <div className="mb-5 home_cards">
        {cardsData.map((card, index) => (
          <CardItem key={index} card={card} />
        ))}
      </div>
      <div className="mb-5 home_charts">
        <div className=" box_shadow home_charts_left">
          <BarChart chartData={chartLeftData} />
          <div className="mt-4">
            <h5
              className="mb-0"
              style={{
                fontSize: "18px",
              }}
            >
              Người dùng mới
            </h5>
            <p>
              <span className="fw-medium">{"( +23% )"}</span> so với tháng trước
            </p>
            <div className="mt-3 home_charts_left_cards">
              <div className="home_charts_left_cards_item">
                <div
                  style={{
                    background: "linear-gradient(240deg, #c43302,#c43302e6)",
                  }}
                >
                  <i className="fa-solid fa-user" />
                </div>
                <span>Người dùng</span>
              </div>
              <div className="home_charts_left_cards_item">
                <div
                  style={{
                    background:
                      "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                  }}
                >
                  <i className="fa-solid fa-hand-pointer" />
                </div>
                <span>Lượt truy cập</span>
              </div>
              <div className="home_charts_left_cards_item">
                <div
                  style={{
                    background:
                      "linear-gradient(310deg, rgb(245, 57, 57), rgb(251, 207, 51))",
                  }}
                >
                  <i className="fa-solid fa-image" />
                </div>
                <span>Bài viết</span>
              </div>
              <div className="home_charts_left_cards_item">
                <div
                  style={{
                    background:
                      "linear-gradient(310deg, rgb(234, 6, 6), rgb(255, 102, 124))",
                  }}
                >
                  <i className="fa-solid fa-clock"></i>
                </div>
                <span>Giờ sử dụng</span>
              </div>
            </div>
          </div>
        </div>
        <div className=" box_shadow home_charts_right">
          <h5
            className="mb-3"
            style={{
              fontSize: "18px",
            }}
          >
            Thống kê bài viết
          </h5>

          <LineChart chartData={chartRightData} />
        </div>
      </div>
      <Users users={users} />
    </div>
  );
};

export default Home;
