function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export const renderOptionSelect = (type, year, month) => {
  let start;
  let end;
  switch (type) {
    case "month":
      start = 1;
      end = 12;
      return [...Array(end - start + 1)].map((_, index) => (
        <option value={index + start} selected={index === 0 ? true : ""}>
          Tháng {index + start}
        </option>
      ));
    case "day":
      start = 1;
      end = getDaysInMonth(year, month);
      return [...Array(end - start + 1)].map((_, index) => (
        <option value={index + start} selected={index === 0 ? true : ""}>
          {index + start}
        </option>
      ));
    case "year":
      start = 1970;
      end =new Date().getFullYear();
      return [...Array(end - start + 1)].map((_, index) => (
        <option value={index + start} selected={index === 0 ? true : ""}>
          {index + start}
        </option>
      ));
    default:
      return [];
  }
};
