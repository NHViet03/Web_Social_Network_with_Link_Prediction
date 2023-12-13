import formatNumber from "./formatNumber";

const formatUserInfo = (data) => {
  let head_email = data.email.split("@")[0];
  let tail_email = data.email.split("@")[1];
  head_email = head_email.slice(0, 3) + head_email.slice(3).replace(/./g, "*");
  const newEmail = head_email + "@" + tail_email;

  return {
    ...data,
    email: newEmail,
    followers: formatNumber(data.followers),
    likes: formatNumber(data.likes),
    posts: formatNumber(data.posts),
  };
};

export default formatUserInfo;
