import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "../Avatar";
import DeletePostModal from "../DeletePostModal";
import FollowButton from "../FollowButton";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const CardHeader = ({ user, post, follow }) => {
  const auth = useSelector((state) => state.auth);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();


  const handleUpdatePost = () => {
    dispatch({
      type: GLOBAL_TYPES.ADD_POST_MODAL,
      payload: {
        post,
        onEdit: true,
      },
    });
  };

  return (
    <div className="d-flex justify-content-between align-items-center card_header">
      <Link
        className="d-flex align-items-center card_header-content"
        to={`/profile/${user._id}`}
        onClick={() =>
          dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false })
        }
      >
        <Avatar src={user.avatar} size="avatar-sm" />
        <h6 className="my-0">{user.username}</h6>
        <span className="material-icons">fiber_manual_record</span>
        <small>{moment(post.createdAt).fromNow()}</small>
      </Link>
      <div className="d-flex align-items-center gap-3">
        {follow && auth.user._id !== user._id && <FollowButton user={user} />}
        <div className="nav-item dropdown">
          <span
            className="material-icons"
            id="morelink"
            data-bs-toggle="dropdown"
            style={{ cursor: "pointer" }}
          >
            more_horiz
          </span>
          <div className="dropdown-menu">
            {auth.user._id === post.user._id && (
              <>
                <div
                  className="dropdown-item"
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => setShowDelete(true)}
                >
                  <span className="material-icons">delete_outline</span>
                  <span>Xóa</span>
                </div>
                <div className="dropdown-item" onClick={handleUpdatePost}>
                  <span className="material-icons">auto_fix_normal</span>
                  <span>Chỉnh sửa</span>
                </div>
              </>
            )}
            <div
              className="dropdown-item"
              style={{ color: "var(--primary-color)" }}
            >
              <span className="material-icons">report_problem</span>
              <span>Báo cáo</span>
            </div>
            <div className="dropdown-item">
              <span className="material-icons">content_copy</span>
              <span>Sao chép liên kết</span>
            </div>
          </div>
        </div>
      </div>
      {showDelete && (
        <DeletePostModal post={post} setShowDelete={setShowDelete} />
      )}
    </div>
  );
};

export default CardHeader;
