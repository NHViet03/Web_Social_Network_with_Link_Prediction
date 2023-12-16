import React, { useMemo } from "react";
import { DateRangePicker } from "rsuite";

function Filter({ filter, setFilter, filterSmall }) {
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
      {!filterSmall && (
        <div className="d-flex align-items-center gap-4">
          <h6 className="mb-0">Bộ lọc</h6>
          <div className="d-flex align-items-center gap-1">
            <p className="mb-0 fs-6" style={{ minWidth: "80px" }}>
              Ngày đăng
            </p>
            <DateRangePicker
              defaultValue={filter.date}
              onChange={handlePickDate}
            />
          </div>
        </div>
      )}
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
          <option value="likes_high_to_low">Lượt thích từ cao đến thấp</option>
          <option value="likes_low_to_high">Lượt thích từ thấp đến cao</option>
          <option value="date_newest_to_oldest">
            Ngày đăng từ mới nhất đến cũ nhất
          </option>
          <option value="date_oldest_to_newest">
            Ngày đăng từ cũ nhất đến mới nhất
          </option>
        </select>
      </div>
    </>
  );
}

export default Filter;
