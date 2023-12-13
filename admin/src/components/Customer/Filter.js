import React,{useMemo} from 'react'
import formatMoney from '../../utils/formatNumber';

const Filter = ({filter,setFilter}) => {
    const revenueFilterData = useMemo(
        () => [
          {
            title: "Dưới 10 triệu",
            value: [0, 10000000],
          },
          {
            title: "Từ 10 - 20 triệu",
            value: [10000000, 20000000],
          },
          {
            title: "Từ 20 - 50 triệu",
            value: [20000000, 50000000],
          },
          {
            title: "Trên 50 triệu",
            value: [50000000, 500000000],
          },
        ],
        []
      );

  return (
    <>
      <div className="d-flex align-items-center gap-4">
        <h6 className="mb-0">Bộ lọc</h6>
        <div className="d-flex align-items-center gap-1">
        <div class="dropdown">
          <button
            className="form-control dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            {filter.revenue[0] === 0 && filter.revenue[1] === 0 ? (
              "Mức doanh thu"
            ) : (
              <span>
                Từ {formatMoney(filter.revenue[0]) + "đ"} -{" "}
                {formatMoney(filter.revenue[1]) + "đ"}
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
                    onClick={() =>
                      setFilter({
                        ...filter,
                        revenue: item.value,
                      })
                    }
                    style={{
                      padding: "8px",
                      borderColor:
                        item.value[0] === filter.revenue[0] &&
                        item.value[1] === filter.revenue[1]
                          ? "var(--primary-color)"
                          : "",
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <p className="mb-2">Hoặc chọn mức doanh thu phù hợp</p>
              <div className="filter_range">
                <div>
                  <input
                    type="text"
                    placeholder="VD: 100000"
                    className="form-control"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        revenue: [e.target.value, filter.revenue[1]],
                      })
                    }
                  />
                  <span>vnđ</span>
                </div>
                <hr />
                <div>
                  <input
                    type="text"
                    placeholder="VD: 50000000"
                    className="form-control"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        revenue: [filter.revenue[0], e.target.value],
                      })
                    }
                  />
                  <span>vnđ</span>
                </div>
              </div>
              <div className=" mt-3 text-center">
                <button
                  className="btn btn_normal btn_accept"
                  onClick={() =>
                    setFilter({
                      ...filter,
                      revenue: [0, 0],
                    })
                  }
                >
                  Bỏ chọn
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
          <option value="revenue_high_to_low">Doanh số từ cao đến thấp</option>
          <option value="revenue_low_to_high">Doanh số từ thấp đến cao</option>
          <option value="name_a_to_z">Tên: A-Z</option>
          <option value="name_z_to_a">Tên: Z-A</option>
        </select>
      </div>
    </>
  )
}

export default Filter
