import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "../Avatar";
import ModalValidateReport from "../ModalValidateReport";

import { useSelector, useDispatch } from "react-redux";
import {
  validateReport,
  rejectReport,
  deleteReport,
} from "../../redux/actions/reportAction";

const ReportList = ({ reports }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const handleDelete = (report) => {
    dispatch(deleteReport({ report, auth }));
  };

  const status = useMemo(
    () => ({
      pending: "Chờ xử lý",
      validated: "Đã xác nhận",
      rejected: "Đã bác bỏ",
    }),
    []
  );

  return (
    <>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>

            <th scope="col">Mã bài viết</th>
            <th
              scope="col"
              style={{
                minWidth: "200px",
              }}
            >
              Lý do
            </th>
            <th scope="col">Chủ bài viết</th>
            <th
              scope="col"
              style={{
                cursor: "pointer",
              }}
            >
              Ngày báo cáo <i className="fa-solid fa-sort ms-1" />
            </th>
            <th scope="col">Nguời báo cáo</th>
            <th scope="col">Trạng thái</th>
            <th scope="col" colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{"..." + report.id.slice(report.id.length - 4)}</td>
              <td>{report.content}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Avatar src={report.post.user.avatar} size="avatar-sm" />
                  {report.post.user.username}
                </div>
              </td>
              <td>{moment(report.createdAt).format("l")}</td>
              <td>{report.reporter.username}</td>
              <td>
                <div className={`table_state ${report.status}`}>
                  {status[report.status]}
                </div>
              </td>
              <td colSpan="2">
                <div class="dropdown">
                  <button
                    className="form-control dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Hành động
                  </button>

                  <div className="box_shadow dropdown-menu right">
                    {/* {report.status === "pending" && (
                      <>
                        <button
                          className="btn dropdown-item"
                          style={{
                            color: "rgb(14, 115, 58)",
                          }}
                          onClick={() => setModalValidate(report)}
                        >
                          Xác thực <i className="fa-solid fa-check" />
                        </button>
                        <button
                          className="btn dropdown-item"
                          style={{
                            color: "#d70606",
                          }}
                          onClick={() => handleReject(report)}
                        >
                          Bác bỏ <i className="fa-solid fa-xmark" />
                        </button>
                      </>
                    )} */}
                    <button
                      className="btn dropdown-item"
                      style={{
                        color: "var(--primary-color)",
                      }}
                      onClick={() => handleDelete(report)}
                    >
                      Xóa <i className="fa-solid fa-trash" />
                    </button>
                    <Link
                      to={`/reports/${report._id}`}
                      className="dropdown-item"
                    >
                      Xem báo cáo
                      <i className="fa-solid fa-flag"></i>
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReportList;
