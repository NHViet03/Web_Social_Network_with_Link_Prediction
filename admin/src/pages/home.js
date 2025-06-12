import React, { useState, useEffect } from "react";
import CardItem from "../components/Home/CardItem";
import { useSelector, useDispatch } from "react-redux";
import {
  getCardsData,
  getTop5Users,
  get_chart_statistics,
} from "../redux/actions/homeAction";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

import Chart from "chart.js/auto";
import { Tooltip, Legend } from "chart.js";
import BarChart from "../components/Home/BarChart";
import LineChart from "../components/Home/LineChart";
import Users from "../components/Home/Users";

Chart.register(Tooltip, Legend);

const Home = () => {
  const home = useSelector((state) => state.home);
  const auth = useSelector((state) => state.auth);
  const UserStatistic = home.statistic.userStatistic;
  const PostsStatistic = home.statistic.postsStatistic;
  const dispatch = useDispatch();

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
    labels: PostsStatistic.map((item) => "Th " + item.month),
    datasets: [
      {
        label: "Số lượng bài viết ",
        data: PostsStatistic.map((data) => data.num),
        backgroundColor: ["#C43302"],
        borderColor: "#C43302",
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 3,
      },
    ],
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!home.loadCardsData) {
      dispatch(getCardsData({ auth }));
      dispatch(get_chart_statistics({ auth }));
    }
    setCardsData(home.cardsData);
  }, [auth, dispatch, home.cardsData, home.loadCardsData]);

  useEffect(() => {
    window.location.hash = filter.interval;
  }, [filter.interval]);

  const handleChangeInterval = (e) => {
    if (e.target.value !== filter.interval) {
      setFilter({
        ...filter,
        interval: e.target.value,
      });
      dispatch({
        type: GLOBAL_TYPES.LOADING,
        payload: true,
      });
      dispatch(getCardsData({ interval: e.target.value, auth })).then(() => {
        dispatch({
          type: GLOBAL_TYPES.LOADING,
          payload: false,
        });
      });
    }
  };

  useEffect(() => {
    if (!home.loadUsers) {
      dispatch(getTop5Users({ auth }));
    }
    setCardsData(home.cardsData);
  }, [auth, dispatch, home.cardsData, home.loadUsers]);

  useEffect(() => {
    setUsers(home.users);
  }, [home.users]);

  useEffect(() => {
    if (UserStatistic.length > 0) {
      setChartLeftData({
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
    }
  }, [UserStatistic]);
  useEffect(() => {
    if (PostsStatistic.length > 0) {
      setChartRightData({
        labels: PostsStatistic.map((item) => "Th " + item.month),
        datasets: [
          {
            label: "Số lượng bài viết ",
            data: PostsStatistic.map((data) => data.num),
            backgroundColor: ["#C43302"],
            borderColor: "#C43302",
            tension: 0.4,
            pointRadius: 3,
            borderWidth: 3,
          },
        ],
      });
    }
  }, [PostsStatistic]);

  return (
    <div className="home">
      <select
        className="mb-3 form-select home_filter"
        required
        value={filter.interval}
        onChange={handleChangeInterval}
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
