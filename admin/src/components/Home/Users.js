import React, { useCallback } from "react";
import ExportCSV from "../ExportCSV";
import formatUserInfo from "../../utils/formatUserInfo";
import Avatar from "../Avatar";

function Users({ users }) {
  const customExport = useCallback(() => {
    return users.map((users) => ({
      "Tên người dùng": users.username,
      "Họ và tên": users.fullname,
      Email: users.email,
      "Lượt theo dõi": users.followers,
      "Lượt yêu thích": users.likes,
      "Số bài viết": users.posts,
    }));
  }, [users]);

  return (
    <div className="mb-5 box_shadow home_users">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 me-2">
            Top 5 người dùng có lượt theo dõi cao nhất
          </h5>

          <i
            class="fa-solid fa-ranking-star ms-2"
            style={{
              fontSize: "28px",
            }}
          />
        </div>
        <div>
          <ExportCSV csvData={customExport()} filename="top5-nguoidung" />
        </div>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Tên người dùng</th>
            <th scope="col">Họ và tên</th>
            <th scope="col">Email</th>
            <th scope="col">Lượt theo dõi</th>
            <th scope="col">Lượt yêu thích</th>
            <th scope="col">Số bài viết</th>
            <th scope="col">Xếp hạng</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const newData = formatUserInfo(user);

            return (
              <tr key={index}>
                <td className="d-flex align-items-center gap-2">
                  <Avatar src={newData.avatar} size="avatar-sm" border />
                  {newData.username}
                </td>
                <td>{newData.fullname}</td>
                <td>{newData.email}</td>
                <td className="fw-medium">{newData.followers}</td>
                <td>{newData.likes}</td>
                <td>{newData.posts}</td>
                <td className={`fs-6 fw-medium`}>
                  Rank#{index + 1}
                  {index < 3 && (
                    <span
                      className="material-icons"
                      style={{
                        transform: "translateY(6px)",
                        fontSize: "32px",
                        color:
                          index === 0
                            ? "#FFD700"
                            : index === 1
                            ? "#C0C0C0"
                            : "#CD7F32",
                      }}
                    >
                      workspace_premium
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
