import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import CardHeader from "./postCard/CardHeader";
import CardBody from "./postCard/CardBody";
import CardFooterDetail from "./postCard/CardFooterDetail";

const PostDetailModal = () => {
  const postDetail = useSelector((state) => state.postDetail);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false });
  };

  return (
    <div className="postDetail_modal">
      <div className="d-flex postDetail_modal-content">
        <div className="col-7">
          <CardBody post={postDetail} />
        </div>
        <div className="col-5 mt-2 px-1 d-flex flex-column">
          <CardHeader user={postDetail.user} />
          <CardFooterDetail post={postDetail} handleClose={handleClose} />
        </div>
        <span className="material-icons postDetail-close" onClick={handleClose}>
          close
        </span>
      </div>
    </div>
  );
};

export default PostDetailModal;
