import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "../Avatar";
import DeletePostModal from "../DeletePostModal";
import ReportPostModal from "./reportPostModal";
import FollowButton from "../FollowButton";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const CardHeader = ({ user, post, follow }) => {
  const auth = useSelector((state) => state.auth);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: "Đã sao chép liên kết bài viết" },
    });
  };

  const generateTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    const tags = [<span> cùng với </span>];

    for (let i = 0; i < Math.min(post.tags.length, 3); i++) {
      const tag = post.tags[i];

      if (i === post.tags.length - 1 && i > 0) {
        tags.push(<span> và </span>);
      }

      tags.push(
        <Link
          to={`/profile/${tag._id}`}
          onClick={() =>
            dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false })
          }
          className="card_header-content-username"
        >
          {tag.username}
        </Link>
      );

      if (i < post.tags.length - 2 && i < 2) {
        tags.push(<span>, </span>);
      }
    }

    if (post.tags.length > 3) {
      tags.push(
        <Link to={"/"} className="card_header-content-username">
          {` và ${post.tags.length - 3} người khác`}
        </Link>
      );
    }

    return tags;
  };

  return (
    <div className="d-flex justify-content-between align-items-center card_header">
      <div className="d-flex align-items-center card_header-content">
        <Avatar src={user.avatar} size="avatar-sm" />
        <div
          style={{
            marginLeft: "12px",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            <div
              style={{
                maxWidth: "330px",
              }}
            >
              <Link
                to={`/profile/${user._id}`}
                onClick={() =>
                  dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false })
                }
                className="card_header-content-username"
              >
                {user.username}
              </Link>
              {post.tags && post.tags.length > 0 && generateTags()}
            </div>
            <span className="material-icons">fiber_manual_record</span>
            <small>{moment(post.createdAt).fromNow()}</small>
          </div>
          {post.location?.name && (
            <Link
              className="card_header-content-location"
              to={`/explore/locations/${post.location.id}/${post.location.name}`}
              onClick={() =>
                dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false })
              }
            >
              {post.location.name}
            </Link>
          )}
        </div>
      </div>

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
              onClick={() => setShowReport(true)}
            >
              <span className="material-icons">report_problem</span>
              <span>Báo cáo</span>
            </div>
            <div className="dropdown-item" onClick={handleCopy}>
              <span className="material-icons">content_copy</span>
              <span>Sao chép liên kết</span>
            </div>
          </div>
        </div>
      </div>
      {showDelete && (
        <DeletePostModal post={post} setShowDelete={setShowDelete} />
      )}
      {showReport && (
        <ReportPostModal postData={post} setShowReport={setShowReport} />
      )}
    </div>
  );
};

export default CardHeader;
