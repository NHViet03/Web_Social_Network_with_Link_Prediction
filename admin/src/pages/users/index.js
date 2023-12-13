import React,{useState,useEffect,useCallback} from 'react'
import { Link } from 'react-router-dom';
import ExportCSV from '../../components/ExportCSV';
import Filter from '../../components/Customer/Filter';
import CustomerList from '../../components/Customer/CustomerList';

const cusData = [
  {
    id: "KH03",
    name: "Lê Văn An",
    email: "An789@gmail.com",
    phone: "0833333333",
    total: 300000000,
  },
  {
    id: "KH05",
    name: "Trần Văn Tú",
    email: "Tu567@gmail.com",
    phone: "0866666666",
    total: 250000000,
  },
  {
    id: "KH01",
    name: "Nguyễn Hoàng Việt",
    email: "Viet123@gmail.com",
    phone: "0848044777",
    total: 20000000,
  },
  {
    id: "KH04",
    name: "Phạm Thị Hương",
    email: "Huong012@gmail.com",
    phone: "0844444444",
    total: 18000000,
  },
  {
    id: "KH02",
    name: "Trần Thị Mai",
    email: "Mai456@gmail.com",
    phone: "0856789123",
    total: 1500000,
  },
];


function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState({
    search:"",
    revenue:[0,0]
  })
  const [page,setPage]=useState(1);
  const pages = [1, 2, 3, 4, 5];
  
  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < 2; i++) {
      newArr.push(...cusData);
    }
    setCustomers(newArr);
  }, []);


  useEffect(() => {
    if (customers.length === 0) return;
    let newCustomers = [...customers];
    switch (filter.sort) {
      case "revenue_high_to_low":
        newCustomers.sort((a, b) => b.total - a.total);
        break;
      case "revenue_low_to_high":
        newCustomers.sort((a, b) => a.total - b.total);
        break;
      case "name_z_to_a":
        newCustomers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "name_a_to_z":
        newCustomers.sort((a, b) => -b.name.localeCompare(a.name));
        break;
      default:
        let newArr = [];
        for (let i = 0; i < 3; i++) {
          newArr.push(...cusData);
          newCustomers = newArr;
        }
    }
    setCustomers(newCustomers);
  }, [filter.sort]);

  const customExport = useCallback(() => {
    return customers.map((customer) => ({
      "Mã khách hàng": customer.id,
      "Tên khách hàng": customer.name,
      "Email": customer.email,
      "Số điện thoại": customer.phone,
      "Doanh số": customer.total,
    }));
  }, [customers]);

  return (
    <div className="mb-3 table">
    <div className="box_shadow mb-3 table_container">
      <div className="mb-3 ">
        <div className="d-flex justify-content-between align-items-center mb-3 ">
          <h5>Danh sách Khách hàng</h5>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex justify-content-between align-items-center table_search">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                className="form-control me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i class="fa-solid fa-magnifying-glass" />
            </div>
            <Link
              to={{
                pathname: "/customers/add",
              }}
              className="btn btn_table btn_add"
            >
              <i class="fa-solid fa-plus" />
              Thêm KH mới
            </Link>
            <ExportCSV
              csvData={customExport()}
              filename={"danh-sach-khach-hang"}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3 ">
          <Filter filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div className="mb-3">
        <CustomerList customers={customers} />
      </div>
    </div>
    <div className="d-flex justify-content-between align-items-center ">
      <p>
        Hiển thị {1} đến {10} trong tổng số {50} khách hàng
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
  )
}

export default Customers
