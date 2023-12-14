import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ExportCSV from "../../components/ExportCSV";
import Filter from "../../components/User/Filter";
import UserList from "../../components/User/UserList";
import moment from "moment";

const usersData = [
  {
    _id: "1",
    username: "anle123",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701768061/DreamerDB/kejzf2gig4h5ycfanwfp.jpg",
    fullname: "Lê Văn An",
    email: "An789@gmail.com",
    followers: 120000,
    posts: 120,
    createdAt: new Date(2021, 3, 5),
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
    createdAt: new Date(2021, 3, 2),
  },
  {
    _id: "1",
    username: "nhviet03",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1701862207/DreamerDB/tffpbpkhsbeqsyzzivdl.jpg",
    fullname: "Nguyễn Hoàng Việt",
    email: "Viet123@gmail.com",
    followers: 90000,
    posts: 100,
    createdAt: new Date(2021, 3, 8),
  },
  {
    _id: "1",
    username: "huongpham",
    avatar:
      "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png",
    fullname: "Phạm Thị Hương",
    email: "Huong012@gmail.com",
    followers: 80000,
    posts: 20,
    createdAt: new Date(2022, 3, 5),
  },
  {
    _id: "1",
    username: "maitran",
    avatar:
      "https://res.cloudinary.com/dswg5in7u/image/upload/v1702040340/DreamerDB/unwcqgsecqcdoiezs4ca.jpg",
    fullname: "Trần Thị Mai",
    email: "Mai456@gmail.com",
    followers: 80000,
    posts: 30,
    createdAt: new Date(2020, 3, 5),
  },
];

function Customers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    sort: "default",
    followers: [0, 0],
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });
  const [page, setPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < 2; i++) {
      newArr.push(...usersData);
    }
    setUsers(newArr);
  }, []);

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
        newUsers.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "date_oldest_to_newest":
        newUsers.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default:
        let newArr = [];
        for (let i = 0; i < 3; i++) {
          newArr.push(...usersData);
          newUsers = newArr;
        }
    }
    setUsers(newUsers);
  }, [filter.sort]);

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

  return (
    <div className="mb-3 table">
      <div className="box_shadow mb-3 table_container">
        <div className="mb-3 ">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5>Danh sách Người dùng</h5>
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex justify-content-between align-items-center table_search">
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="form-control me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i class="fa-solid fa-magnifying-glass" />
              </div>
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
          Hiển thị {1} đến {10} trong tổng số {50} người dùng
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
