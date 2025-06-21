import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkImage } from "../../utils/imageUpload"; 
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { updateProfileUsers } from "../../redux/actions/profileAction";
import moment from "moment";
const EditProfile = ({ setOnEdit }) => {
  const initState = {
    fullname: "",
    username: "",
    story: "",
    gender: "",
    birthday: "",
    website: "",
    email: "",
  };
 
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(initState);
  const { fullname, username, story, gender, birthday, website, email } = userData;
  const [avatar, setAvatar] = useState("");
  const { auth, theme } = useSelector((state) => state);
  useEffect(() =>{
    setUserData(auth.user)
  },[auth.user])

  
  const changeAvatar = (e) => {
   
    const file = e.target.files[0];
    const err = checkImage(file);
    if(err) return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
            error: err
        }
    })
    setAvatar(file);
  };
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      const formattedDate = moment(value).format('YYYY-MM-DD');
      setUserData({ ...userData, [name]: formattedDate });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUsers({userData, avatar, auth}))
  }

  return (
    <div className="edit_profile">
      <button
        className="btn btn-danger btn_close"
        onClick={() => setOnEdit(false)}
      >
        Đóng
      </button>
      <form onSubmit={handleSubmit}>
        <div className="info_avatar mb-2">
          <img
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            alt="avatar"
            style={{ filter: theme ? "invert(1)" : "invert(0)"}}
          ></img>
          <span>
            <i className="fa fa-camera"></i>
            <p>Đổi ảnh</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>
        <div className="form_group mb-2">
          <label htmlFor="fullname" className="mb-2">Tên đầy đủ</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {fullname.length}/25
            </small>
          </div>
        </div>
        <div className="form_group mb-2">
          <label htmlFor="username" className="mb-2">Tên người dùng</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={handleInput}
            />
             <small
              className="text-danger position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {username.length}/25
            </small>
          </div>
        </div>
        <div className="form_group mb-2">
          <label htmlFor="story" className="mb-2">Tiểu sử</label>
          <div className="position-relative">
            <textarea
              type="text"
              className="form-control"
              id="story"
              cols="30" rows="4"
              name="story"
              value={story}
              onChange={handleInput}
            />
             <small
              className="text-danger d-block text-right position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(250%)",
              }}
            >
              {story.length}/200
            </small>
          </div>
         
        </div>
        <div className="form_group mb-2">
          <label htmlFor="website" className="mb-2">Website</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="website"
              name="website"
              value={website}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="form_group mb-2">
          <label htmlFor="email" className="mb-2">Email</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="form_group mb-2">
          <label htmlFor="gender" className="mb-2">Giới tính</label>
          <div className="position-relative">
            <label className="form-check-label mx-2">
              <input
                type="radio"
                className="form-check-input mx-2"
                id="male"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={handleInput}
              />
              Nam
            </label>
            <label className="form-check-label mx-2">
              <input
                type="radio"
                className="form-check-input mx-2"
                id="female"
                name="gender"
                value="famale"
                checked={gender === "famale"}
                onChange={handleInput}
              />
              Nữ
            </label>
          </div>
        </div>
        {/* <div className="form_group mb-2">
          <label htmlFor="birthday" className="mb-2">Ngày sinh</label>
          <div className="position-relative">
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={birthday ||''}
              onChange={handleInput}
            />
          </div>
        </div> */}
        <button className="btn btn-info w-100 edit_profile_btn_save mt-2" type="Submit"> Lưu</button>
      </form>
    </div>
  );
};

export default EditProfile;
