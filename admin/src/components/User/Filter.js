import React, { useState, useMemo } from "react";
import { DateRangePicker } from "rsuite";
import formatMoney from "../../utils/formatNumber";

const Filter = ({ filter, setFilter, handleRefresh }) => {
  const [followers, setFollowers] = useState(filter.followers);

  const revenueFilterData = useMemo(
    () => [
      {
        title: "Dưới 1 nghìn",
        value: [0, 1000],
      },
      {
        title: "Từ 1 - 10 nghìn",
        value: [1000, 10000],
      },
      {
        title: "Từ 10 - 20 nghìn",
        value: [10000, 20000],
      },
      {
        title: "Trên 20 nghìn",
        value: [20000, 1000000],
      },
    ],
    []
  );

  const handlePickDate = (value) => {
    if (value === null) {
      setFilter({
        ...filter,
        date: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      });
      handleRefresh();
    } else if (value[0] !== filter.date[0] || value[1] !== filter.date[1]) {
      setFilter({
        ...filter,
        date: value,
      });
      handleRefresh();
    }
  };

  const handleChangeFollowers = (e, from, to) => {
    e.stopPropagation();
    setFollowers([from, to]);
  };

  const handleReset = () => {
    setFollowers([0, 0]);
    setFilter({
      ...filter,
      followers: [0, 0],
    });
  };

  const handleSubmit = () => {
    setFilter({
      ...filter,
      followers: followers,
    });
    handleRefresh();
  };

  return (
    <>
      <div className="d-flex align-items-center gap-4">
        <h6 className="mb-0">Bộ lọc</h6>
        <div className="d-flex align-items-center gap-1">
          <p className="mb-0 fs-6" style={{ minWidth: "80px" }}>
            Ngày tham gia
          </p>
          <DateRangePicker
            defaultValue={filter.date}
            onChange={handlePickDate}
          />
        </div>
        <div className="d-flex align-items-center gap-1">
          <div class="dropdown">
            <button
              className="form-control dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {followers[0] === 0 && followers[1] === 0 ? (
                "Mức theo dõi"
              ) : (
                <span>
                  Từ {formatMoney(followers[0]) + " người"} -{" "}
                  {formatMoney(followers[1]) + " người"}
                </span>
              )}
            </button>

            <div className="box_shadow dropdown-menu">
              <div
                className="p-3"
                style={{
                  width: "530px",
                }}
              >
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  {revenueFilterData.map((item, index) => (
                    <button
                      key={index}
                      className="btn btn_normal"
                      onClick={(e) =>
                        handleChangeFollowers(e, item.value[0], item.value[1])
                      }
                      style={{
                        padding: "8px",
                        fontSize: "14px",
                        borderColor:
                          item.value[0] === followers[0] &&
                          item.value[1] === followers[1]
                            ? "var(--primary-color)"
                            : "",
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
                <p className="mb-2">Hoặc chọn mức theo dõi phù hợp</p>
                <div className="filter_range">
                  <div>
                    <input
                      type="text"
                      placeholder="VD: 1000"
                      className="form-control"
                      onChange={(e) =>
                        handleChangeFollowers(
                          e,
                          e.target.value,
                          filter.followers[1]
                        )
                      }
                    />
                    <span>người</span>
                  </div>
                  <hr />
                  <div>
                    <input
                      type="text"
                      placeholder="VD: 5000"
                      className="form-control"
                      onChange={(e) =>
                        handleChangeFollowers(
                          e,
                          filter.followers[0],
                          e.target.value
                        )
                      }
                    />
                    <span>người</span>
                  </div>
                </div>
                <div className=" mt-3 text-center">
                  <button className="btn btn_normal me-3" onClick={handleReset}>
                    Bỏ chọn
                  </button>
                  <button
                    className="btn btn_normal btn_accept"
                    onClick={handleSubmit}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          <option value="followers_high_to_low">
            Lượt theo dõi từ cao đến thấp
          </option>
          <option value="followers_low_to_high">
            Lượt theo dõi từ thấp đến cao
          </option>
          <option value="username_a_to_z">Tên người dùng: A-Z</option>
          <option value="username_z_to_a">Tên người dùng: Z-A</option>
          <option value="date_newest_to_oldest">
            Ngày tham gia từ mới nhất đến cũ nhất
          </option>
          <option value="date_oldest_to_newest">
            Ngày tham gia từ cũ nhất đến mới nhất
          </option>
        </select>
      </div>
    </>
  );
};

export default Filter;
