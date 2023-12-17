import React, { useState, useEffect, useCallback, useMemo } from "react";
import ExportCSV from "../../components/ExportCSV";
import Filter from "../../components/Report/Filter";
import ReportList from "../../components/Report/ReportList";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { getReports } from "../../redux/actions/reportAction";

function Reports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    sort: "default",
    status: "all",
    date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
  });
  const [page, setPage] = useState(1);

  const auth = useSelector((state) => state.auth);
  const reportsData = useSelector((state) => state.reportsData);
  const dispatch = useDispatch();

  useEffect(() => {
    const getReportsData = async () => {
      await dispatch(
        getReports({
          from: filter.date[0],
          to: filter.date[1],
          search,
          page: page - 1,
          status: filter.status,
          auth,
        })
      );
    };

    getReportsData();
  }, [auth, dispatch, filter.date, filter.status, page]);

  useEffect(() => {
    setFilter({ ...filter, sort: "default" });
    setReports(reportsData.reports);
  }, [reportsData.reports]);

  const customData = useCallback(() => {
    return reports.map((report) => ({
      "Mã báo cáo": report._id,
      "Mã bài viết": report.id,
      "Lý do": report.reason,
      "Chủ bài viết": report.post.user.username,
      "Ngày báo cáo": moment(report.createdAt).format("LLL"),
      "Người báo cáo": report.reporter.username,
    }));
  }, [reports]);

  useEffect(() => {
    if (filter.date !== null) {
      window.location.hash = `?status=${filter.status}&date_from=${moment(
        filter.date[0]
      ).format("l")}&date_to=${moment(filter.date[1]).format(
        "l"
      )}&$&page=${page}`;
    } else {
      window.location.hash = `?page=${page}`;
    }
  }, [page, filter.date, filter.status]);

  const pages = useMemo(() => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(reportsData.totalReports / 10); i++) {
      pages.push(i);
    }
    return pages;
  }, [reportsData.totalReports]);

  const handleSearch = async (e) => {
    e.preventDefault();
    window.location.hash = `?search=${search}&date_from=${moment(
      filter.date[0]
    ).format("l")}&date_to=${moment(filter.date[1]).format("l")}&page=${page}`;
    await dispatch(
      getReports({
        search,
        from: filter.date[0],
        to: filter.date[1],
        status: filter.status,
        auth,
      })
    );
    setPage(1);
  };

  return (
    <div className="mb-3 table">
      <div className="box_shadow mb-3 table_container">
        <div className="mb-3 ">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5>Danh sách Báo cáo</h5>
            <div className="d-flex align-items-center gap-4">
              <form
                className="d-flex justify-content-between align-items-center table_search me-2"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm báo cáo ..."
                  className="form-control me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i class="fa-solid fa-magnifying-glass" />
              </form>
              <ExportCSV
                csvData={customData()}
                filename={"danh-sach-bao-cao"}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3 ">
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <div className="mb-3">
          <ReportList reports={reports} />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center ">
        <p>
          Hiển thị {reportsData.result === 0 ? 0 : 1 + (page - 1) * 10} đến{" "}
          {reportsData.result + (page - 1) * 10} trong tổng số{" "}
          {reportsData.totalReports} báo cáo
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

export default Reports;
