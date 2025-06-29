import React, { useMemo } from "react";
import FilerobotImageEditor, { TABS } from "react-filerobot-image-editor";
import { convertBase64ToFile } from "../../utils/imageUpload";

const EditImages = ({ post, setPost, addStep, setAddStep }) => {
  const editorRefs = useMemo(() => {
    return post.images.map(() => React.createRef());
  }, [post.images]);

  const handleNextStep = () => {
    const saveEditedImages = [];

    for (const editorRef of editorRefs) {
      try {
        if (editorRef?.current) {
          const imageData = editorRef?.current()?.imageData;
          const designState = editorRef?.current()?.designState;

          // If no changed image, skip saving
          if (
            designState.filter == null &&
            designState.finetunes.length === 0
          ) {
            saveEditedImages.push(null);
            continue;
          }

          if (imageData?.imageBase64) {
            const file = convertBase64ToFile(
              imageData?.imageBase64,
              imageData?.fullName
            );

            file.url = URL.createObjectURL(file);

            saveEditedImages.push(file);
          }
        } else {
          saveEditedImages.push(null);
        }
      } catch (error) {
        console.error("Error saving image:", error);
        saveEditedImages.push(null);
      }
    }

    setPost((prev) => ({
      ...prev,
      images: prev.images.map((img, id) => {
        return saveEditedImages[id] ? saveEditedImages[id] : img;
      }),
    }));
    setAddStep((pre) => pre + 1);
  };

  const handleNextImage = () => {
    const saveEditedImages = [];

    for (const editorRef of editorRefs) {
      try {
        if (editorRef?.current) {
          const imageData = editorRef?.current()?.imageData;
          const designState = editorRef?.current()?.designState;

          // If no changed image, skip saving
          if (
            designState.filter == null &&
            designState.finetunes.length === 0
          ) {
            saveEditedImages.push(null);
            continue;
          }

          if (imageData?.imageBase64) {
            const file = convertBase64ToFile(
              imageData?.imageBase64,
              imageData?.fullName
            );

            file.url = URL.createObjectURL(file);

            saveEditedImages.push(file);
          }
        } else {
          saveEditedImages.push(null);
        }
      } catch (error) {
        console.error("Error saving image:", error);
        saveEditedImages.push(null);
      }
    }

    setPost((prev) => ({
      ...prev,
      images: prev.images.map((img, id) => {
        return saveEditedImages[id] ? saveEditedImages[id] : img;
      }),
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-3 addPost_modal_header">
        <i
          className="fa-solid fa-arrow-left-long"
          style={{
            fontSize: "24px",
            cursor: "pointer",
          }}
          onClick={() => setAddStep(addStep - 1)}
        />
        <h6 className="text-center flex-fill">Chỉnh sửa hình ảnh</h6>
        <h6
          style={{
            color: "var(--primary-color)",
            cursor: "pointer",
            position: "absolute",
            right: "16px",
          }}
          onClick={handleNextStep}
        >
          Tiếp
        </h6>
      </div>

      <div
        id={"imageSelected"}
        className="carousel slide carousel-fade flex-fill show_images carousel-edit"
      >
        <div className="carousel-inner">
          {post.images.map((img, index) =>
            img.type.includes("video") ? (
              <></>
            ) : (
              <div
                key={index}
                className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
              >
                <FilerobotImageEditor
                  source={img.url}
                  removeSaveButton={true}
                  tabsIds={[TABS.FILTERS, TABS.FINETUNE]}
                  defaultTabId={TABS.FILTERS}
                  defaultSavedImageQuality={1}
                  savingPixelRatio={window.devicePixelRatio * 1.5}
                  resetOnImageSourceChange={true}
                  previewPixelRatio={window.devicePixelRatio * 1.5}
                  useBackendTranslations={false}
                  getCurrentImgDataFnRef={editorRefs[index]}
                />
              </div>
            )
          )}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={"#imageSelected"}
          data-bs-slide="prev"
          onClick={handleNextImage}
          style={{
            top: "30%",
            bottom: "30%",
          }}
        >
          <span className="carousel-control-prev-icon">
            <i className="fa-solid fa-chevron-left" />
          </span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={"#imageSelected"}
          data-bs-slide="next"
          onClick={handleNextImage}
          style={{
            top: "30%",
            bottom: "30%",
          }}
        >
          <span className="carousel-control-next-icon">
            <i className="fa-solid fa-chevron-right" />
          </span>
        </button>
      </div>
    </>
  );
};

export default EditImages;
