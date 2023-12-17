import React, { useState, useEffect, useCallback, useMemo } from "react";
import ExportCSV from "../../components/ExportCSV";
import Filter from "../../components/User/Filter";
import UserList from "../../components/User/UserList";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../redux/actions/userAction";

function Customers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    sort: "default",
    followers: [0, 0],
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });
  const [page, setPage] = useState(1);

  const auth = useSelector((state) => state.auth);
  const usersData = useSelector((state) => state.usersData);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsersData = async () => {
      await dispatch(
        getUsers({
          page: page - 1,
          from: filter.date[0],
          to: filter.date[1],
          search,
          f_followers: filter.followers[0],
          t_followers: filter.followers[1],
          auth,
        })
      );
    };

    getUsersData();
  }, [auth, dispatch, filter.date, filter.followers, page]);

  useEffect(() => {
    setUsers(usersData.users);
  }, [usersData.users]);

  useEffect(() => {
    if (users.length === 0) return;
    let newUsers = [...users];
    switch (filter.sort) {
      case "followers_high_to_low":
        newUsers.sort((a, b) => b.followers - a.followers);
        break;
      case "followers_low_to_high":
        newUsers.sort((a, b) => a.followers - b.followers);
        break;
      case "username_z_to_a":
        newUsers.sort((a, b) => b.username.localeCompare(a.username));
        break;
      case "username_a_to_z":
        newUsers.sort((a, b) => -b.username.localeCompare(a.username));
        break;
      case "date_newest_to_oldest":
        newUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date_oldest_to_newest":
        newUsers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        newUsers = [...usersData.users];
    }
    setUsers(newUsers);
  }, [filter.sort]);

  const pages = useMemo(() => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(usersData.totalUsers / 10); i++) {
      pages.push(i);
    }
    return pages;
  }, [usersData.totalUsers]);

  const customExport = useCallback(() => {
    return users.map((user) => ({
      "Mã người dùng": user._id,
      "Tên người dùng": user.username,
      "Họ và tên": user.fullname,
      Email: user.email,
      "Lượt theo dõi": user.followers,
      "Số bài viết": user.posts,
      "Ngày tham gia": moment(user.createdAt).format("l"),
    }));
  }, [users]);

  useEffect(() => {
    if (filter.date !== null) {
      window.location.hash = `?date_from=${moment(filter.date[0]).format(
        "l"
      )}&date_to=${moment(filter.date[1]).format("l")}&f_from=${
        filter.followers[0]
      }&f_to=${filter.followers[1]}&$&page=${page}`;
    } else {
      window.location.hash = `?page=${page}`;
    }
  }, [page, filter.date, filter.followers]);

  const handleSearch = async (e) => {
    e.preventDefault();
    window.location.hash = `?search=${search}&date_from=${moment(
      filter.date[0]
    ).format("l")}&date_to=${moment(filter.date[1]).format("l")}&page=${page}`;
    await dispatch(
      getUsers({ search, from: filter.date[0], to: filter.date[1], auth })
    );
    setPage(1);
  };

  return (
    <div className="mb-3 table">
      <div className="box_shadow mb-3 table_container">
        <div className="mb-3 ">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5>Danh sách Người dùng</h5>
            <div className="d-flex align-items-center gap-4">
              <form
                className="d-flex justify-content-between align-items-center table_search"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="form-control me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i class="fa-solid fa-magnifying-glass" />
              </form>
              <ExportCSV
                csvData={customExport()}
                filename={"danh-sach-nguoi-dung"}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3 ">
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <div className="mb-3">
          <UserList users={users} />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center ">
        <p>
          Hiển thị {usersData.result === 0 ? 0 : 1 + (page - 1) * 10} đến{" "}
          {usersData.result + (page - 1) * 10} trong tổng số{" "}
          {usersData.totalUsers} người dùng
        </p>
        <div className="pagination">
          <button
            className="btn btn_page"
            disabled={page <= 1 && true}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </button>
          {pages.map((id) => (
            <button
              key={id}
              className={`btn btn_page ${id === page ? "active" : ""} `}
              onClick={() => setPage(id)}
            >
              {id}
            </button>
          ))}
          <button
            className="btn btn_page"
            disabled={page >= pages.length && true}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customers;
