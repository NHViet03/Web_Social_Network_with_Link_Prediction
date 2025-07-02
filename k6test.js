import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // tăng lên 100 user trong 30s
    { duration: '1m', target: 200 },    // tăng lên 200 user trong 1 phút
    { duration: '1m', target: 400 },    // tăng lên 400 user trong 1 phút
    { duration: '1m', target: 600 },    // tăng lên 600 user
    { duration: '1m', target: 800 },    // tăng lên 800 user
    { duration: '30s', target: 0 },     // giảm về 0 để kết thúc
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],   // cảnh báo nếu 95% request mất >200ms
    http_req_failed: ['rate<0.01'],     // cảnh báo nếu >1% bị lỗi
  },
};

export default function () {
  const res = http.get('http://localhost:5000');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
