const formatNumber = (number) => {
  if (number === undefined) return;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default formatNumber;
