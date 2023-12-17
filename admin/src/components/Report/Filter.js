import React, { useMemo } from "react";
import { DateRangePicker } from "rsuite";

function Filter({ filter, setFilter }) {
  const handlePickDate = (value) => {
    if (value === null) {
      setFilter({
        ...filter,
        date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      });
    } else
      setFilter({
        ...filter,
        date: value,
      });
  };

  return (
    <>
      <div className="d-flex align-items-center gap-4">
        <h6 className="mb-0">Bộ lọc</h6>
        <div className="d-flex align-items-center gap-1">
          <p className="mb-0 fs-6" style={{ minWidth: "80px" }}>
            Trạng thái
          </p>
          <select
            className="form-select"
            required
            value={filter.status}
            onChange={(e) =>
              setFilter({
                ...filter,
                status: e.target.value,
              })
            }
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="validated">Đã xác nhận</option>
            <option value="rejected">Đã bác bỏ</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-1">
          <p className="mb-0 fs-6" style={{ minWidth: "80px" }}>
            Ngày báo cáo
          </p>
          <DateRangePicker
            defaultValue={filter.date}
            onChange={handlePickDate}
          />
        </div>
      </div>

      <div className=" d-flex align-items-center gap-4">
        <h6
          className="mb-0"
          style={{
            minWidth: "100px",
          }}
        >
          Sắp xếp theo
        </h6>
        <select
          className="form-select"
          required
          value={filter.sort}
          onChange={(e) =>
            setFilter({
              ...filter,
              sort: e.target.value,
            })
          }
        >
          <option value="default">Mặc định</option>
          <option value="date_newest_to_oldest">
            Ngày báo cáo từ mới nhất đến cũ nhất
          </option>
          <option value="date_oldest_to_newest">
            Ngày báo cáo từ cũ nhất đến mới nhất
          </option>
        </select>
      </div>
    </>
  );
}

export default Filter;
