import React, { useState, useCallback } from "react";
import SelectImage from "./SelectImage";
import ShowImages from "./ShowImages";
import WriteContent from "./WriteContent";
import SharePost from "./SharePost";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { createPost, updatePost } from "../../redux/actions/postAction";

function AddPostModal() {
  const { auth, addPostModal } = useSelector((state) => ({
    auth: state.auth,
    addPostModal: state.addPostModal,
  }));
  const dispatch = useDispatch();

  const [addStep, setAddStep] = useState(addPostModal.onEdit ? 3 : 1);
  const [post, setPost] = useState(
    addPostModal.onEdit
      ? addPostModal.post
      : {
          content: "",
          images: [],
        }
  );
  const [loading,setLoading]=useState(false);

  const handleClose = () => {
    dispatch({
      type: GLOBAL_TYPES.ADD_POST_MODAL,
      payload: false,
    });
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setAddStep(4);
    await dispatch(createPost({ post, auth }));
    setLoading(false);
  };

  const handleUpdatePost = () => {
    if (post.content === addPostModal.post.content) return handleClose();
    dispatch(updatePost({ post, auth }));
    handleClose();
  };

  const renderComponent = useCallback(() => {
    switch (addStep) {
      case 1:
        return (
          <SelectImage setAddStep={setAddStep} post={post} setPost={setPost} />
        );
      case 2:
        return <ShowImages post={post} />;
      case 3:
        return <WriteContent post={post} setPost={setPost} />;
      case 4:
        return <SharePost loading={loading} />;
      default:
        return <SelectImage post={post} setPost={setPost} />;
    }
  }, [addStep, loading, post]);

  return (
    <div className="addPost_modal">
      <div
        className="addPost_modal_container"
        style={{
          width: addStep === 3 ? "900px" : "550px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center px-3 addPost_modal_header">
          {!addPostModal.onEdit && addStep > 1 && addStep !== 4 && (
            <i
              className="fa-solid fa-arrow-left-long"
              style={{
                fontSize: "24px",
                cursor: "pointer",
              }}
              onClick={() => setAddStep(addStep - 1)}
            />
          )}
          <h6 className="text-center flex-fill">
            {addPostModal.onEdit
              ? "Chỉnh sửa thông tin"
              : addStep === 4
              ? "Đã chia sẻ bài viết"
              : "Tạo bài viết mới"}
          </h6>
          {addPostModal.onEdit ? (
            addStep > 1 &&
            addStep < 4 && (
              <h6
                style={{
                  color: "var(--primary-color)",
                  cursor: "pointer",
                }}
                onClick={handleUpdatePost}
              >
                Xong
              </h6>
            )
          ) : (
            <h6
              style={{
                color: "var(--primary-color)",
                cursor: "pointer",
              }}
              onClick={
                addStep === 3 ? handleCreatePost : () => setAddStep(addStep + 1)
              }
            >
              { addStep === 3 ? "Chia sẻ" : addStep !== 4 && "Tiếp"}
            </h6>
          )}
        </div>
        {renderComponent()}
      </div>
      <span className="material-icons modal-close" onClick={handleClose}>
        close
      </span>
    </div>
  );
}

export default AddPostModal;
