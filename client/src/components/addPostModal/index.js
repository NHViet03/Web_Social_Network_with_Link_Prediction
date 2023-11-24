import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import SelectImage from "./SelectImage";
import ShowImages from "./ShowImages";
import WriteContent from "./WriteContent";
import SharePost from "./SharePost";

function AddPostModal() {
  const [addStep, setAddStep] = useState(1);
  const [post, setPost] = useState({
    content: "",
    images: [],
  });
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({
      type: GLOBAL_TYPES.ADD_POST_MODAL,
      payload: false,
    });
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
        return <SharePost />;
      default:
        return <SelectImage post={post} setPost={setPost} />;
    }
  }, [addStep, post]);

  return (
    <div className="addPost_modal">
      <div
        className="addPost_modal_container"
        style={{
          width: addStep === 3 ? "900px" : "550px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center px-3 addPost_modal_header">
          {addStep > 1 && addStep !== 4 && (
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
            {addStep === 4 ? "Đã chia sẻ bài viết" : "Tạo bài viết mới"}
          </h6>
          {addStep > 1 && addStep < 4 && (
            <h6
              style={{
                color: "var(--primary-color)",
                cursor: "pointer",
              }}
              onClick={() => setAddStep(addStep + 1)}
            >
              {addStep === 3 ? "Chia sẻ" : "Tiếp"}
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
