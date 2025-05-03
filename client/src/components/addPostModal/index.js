import React, { useState, useCallback, useEffect } from "react";
import SelectImage from "./SelectImage";
import ShowImages from "./ShowImages";
import EditImages from "./EditImages";
import WriteContent from "./WriteContent";
import SharePost from "./SharePost";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { createPost, updatePost } from "../../redux/actions/postAction";

function AddPostModal() {
  const { auth, addPostModal, socket } = useSelector((state) => ({
    auth: state.auth,
    addPostModal: state.addPostModal,
    socket: state.socket,
  }));
  const dispatch = useDispatch();

  const [addStep, setAddStep] = useState(addPostModal.onEdit ? 4 : 1);
  const [post, setPost] = useState(
    addPostModal.onEdit
      ? addPostModal.post
      : {
          content: "",
          images: [],
          hashtags:[],
          tags:[],
          location:{
            name: "",
            lat: 0,
            lng: 0,
          }
        }
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    dispatch({
      type: GLOBAL_TYPES.ADD_POST_MODAL,
      payload: false,
    });
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setAddStep(5);
    await dispatch(createPost({ post, auth, socket }));
    setLoading(false);
  };

  const handleUpdatePost = () => {
    dispatch(updatePost({ post, auth }));
    handleClose();
  };

  const getTitle = () => {
    if (addPostModal.onEdit) {
      return "Chỉnh sửa bài viết";
    }

    switch (addStep) {
      case 1:
      case 2:
      case 4:
        return "Tạo bài viết mới";
      case 3:
        return "Chỉnh sửa ảnh";
      case 5:
        return "Đã chia sẻ bài viết";
      default:
        return "Tạo bài viết mới";
    }
  };

  const getContainerWidth = () => {
    if (addStep === 3 || addStep === 4) {
      return "900px";
    }

    return "550px";
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
        return (
          <EditImages
            post={post}
            setPost={setPost}
            addStep={addStep}
            setAddStep={setAddStep}
          />
        );
      case 4:
        return <WriteContent post={post} setPost={setPost} />;
      case 5:
        return <SharePost loading={loading} />;
      default:
        return <SelectImage post={post} setPost={setPost} />;
    }
  }, [addStep, loading, post]);

  const handleNextStep = () => {
    const existImage = post.images.some((img) => img.type.includes("image"));

    if (!existImage && addStep === 2) {
      return setAddStep(4);
    }

    setAddStep((pre) => pre + 1);
  };

  const handlePrevStep = () => {
    const existImage = post.images.some((img) => img.type.includes("image"));

    if (!existImage && addStep === 4) {
      return setAddStep(2);
    }

    setAddStep((pre) => pre - 1);
  };

  return (
    <div className="addPost_modal">
      <div
        className="addPost_modal_container"
        style={{
          width: getContainerWidth(),
        }}
      >
        {addStep !== 3 && (
          <div className="d-flex justify-content-between align-items-center px-3 addPost_modal_header">
            {!addPostModal.onEdit && addStep > 1 && addStep !== 5 && (
              <i
                className="fa-solid fa-arrow-left-long"
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={handlePrevStep}
              />
            )}
            <h6 className="text-center flex-fill">{getTitle()}</h6>
            {addPostModal.onEdit ? (
              addStep > 1 &&
              addStep < 5 && (
                <h6
                  style={{
                    color: "var(--primary-color)",
                    cursor: "pointer",
                    position: "absolute",
                    right: "16px",
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
                  position: "absolute",
                  right: "16px",
                }}
                onClick={addStep === 4 ? handleCreatePost : handleNextStep}
              >
                {addStep === 4 ? "Chia sẻ" : addStep !== 4 && "Tiếp"}
              </h6>
            )}
          </div>
        )}
        {renderComponent()}
      </div>
      <span className="material-icons modal-close" onClick={handleClose}>
        close
      </span>
    </div>
  );
}

export default AddPostModal;
