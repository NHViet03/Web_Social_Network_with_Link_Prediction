const valid = ({ fullname, username, email, password, isFacebook }) => {
  const err = {};
  if (!fullname) {
    err.fullname = "Vui lòng nhập tên đầy đủ.";
  } else if (fullname.length > 25) {
    err.fullname = "Tên đầy đủ không được vượt quá 25 ký tự.";
  }

  if (!username) {
    err.username = "Vui lòng nhập tên người dùng.";
  } else if (username.replace(/ /g, "").length > 25) {
    err.username = "Tên người dùng không được vượt quá 25 ký tự.";
  }

  if (!email) {
    err.email = "Vui lòng nhập email.";
  } else if (!validateEmail(email)) {
    err.email = "Email không hợp lệ.";
  }

  if (!isFacebook && !password) {
    err.password = "Vui lòng nhập mật khẩu.";
  } else if (!isFacebook && password.length < 6) {
    err.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

// Validates email address of course.
function validateEmail(email) {
  // eslint-disable-next-line
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default valid;
