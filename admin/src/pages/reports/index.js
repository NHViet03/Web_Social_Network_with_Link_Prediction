import React, { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import ExportCSV from "../../components/ExportCSV";
import Filter from "../../components/Report/Filter";
import ReportList from "../../components/Report/ReportList";

import { useSelector, useDispatch } from "react-redux";
import { getReports } from "../../redux/actions/reportAction";
import { REPORTS_TYPES } from "../../redux/actions/reportAction";

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
      if (reportsData.firstLoad) return;

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
  }, [auth, dispatch, filter.date, filter.status, page, reportsData.firstLoad]);

  useEffect(() => {
    setFilter({ ...filter, sort: "default" });
    setReports(reportsData.reports);
  }, [reportsData.reports]);

  useEffect(() => {
    if (reports.length === 0) return;
    let newReports = [...reports];
    switch (filter.sort) {
      case "date_newest_to_oldest":
        newReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date_oldest_to_newest":
        newReports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        newReports = [...reportsData.reports];
    }
    setReports(newReports);
  }, [filter.sort]);

  const customData = useCallback(() => {
    if (reports.length === 0) return [];
    return reports.map((report) => ({
      "Mã báo cáo": report._id,
      "Mã bài viết": report.id,
      "Lý do": report.content,
      "Ngày báo cáo": moment(report.createdAt).format("LLL"),
      "Người báo cáo": report.reporter?.username,
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

  const handleRefresh = () => {
    dispatch({
      type: REPORTS_TYPES.FIRST_LOAD,
      payload: false,
    });
  };

  const handleChangePage = (value) => {
    if(value!==page){
      setPage(value);
      handleRefresh();
    }
  }

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
            <Filter
              filter={filter}
              setFilter={setFilter}
              handleRefresh={handleRefresh}
            />
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
            onClick={()=>handleChangePage(page-1)}
          >
            Trước
          </button>
          {pages.map((id) => (
            <button
              key={id}
              className={`btn btn_page ${id === page ? "active" : ""} `}
              onClick={() => handleChangePage(id)}
            >
              {id}
            </button>
          ))}
          <button
            className="btn btn_page"
            disabled={page >= pages.length && true}
            onClick={() => handleChangePage(page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
