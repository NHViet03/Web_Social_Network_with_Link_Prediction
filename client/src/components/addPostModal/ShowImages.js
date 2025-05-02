import React, { useState } from "react";

function SelectImage({ post }) {
  const [images, setImages] = useState(post.images || []);
  const isActive = (index) => {
    return index === 0 ? "active" : "";
  };

  const handleClickVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = e.target;

    if (!video) return;

    video.paused ? video.play() : video.pause();
  };

  const handleSlideItem = (e) => {
    const videos = document.querySelectorAll("video");

    videos.forEach((video) => {
      video.pause();
      video.muted = true;
      video.currentTime = 0;
    });

    setImages((prev) =>
      prev.map((img, index) => {
        if (img.type.includes("video")) {
          img.muted = true;
        }
        return img;
      })
    );
  };

  const handleMutedVideo = (videoId) => {
    const video = document.getElementById("video" + videoId);
    console.log(videoId, video);
    if (video) {
      video.muted = !video.muted;

      setImages((prev) =>
        prev.map((img, index) => {
          if (index === videoId) {
            img.muted = img.muted === undefined ? false : !img.muted;
          }
          return img;
        })
      );
    }
  };

  return (
    <div id={"imageSelected"} className="carousel slide flex-fill show_images">
      <div className="carousel-indicators">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={"#imageSelected"}
            data-bs-slide-to={index}
            className={`carousel-btn ${isActive(index)}`}
            onClick={handleSlideItem}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div key={index} className={`carousel-item h-100 ${isActive(index)}`}>
            {img.type.includes("video") ? (
              <div
                style={{
                  position: "relative",
                }}
              >
                <video
                  id={"video" + index}
                  width="100%"
                  height="556px"
                  onClick={handleClickVideo}
                  loop
                  muted
                >
                  <source src={img.url} type="video/mp4" />
                  Xin lỗi, trình duyệt của bạn không hỗ trợ video này.
                </video>
                <div
                  onClick={() => handleMutedVideo(index)}
                  className="muted-video"
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(38, 38, 38)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    bottom: 24,
                    right: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                  }}
                >
                  {img.muted === false ? (
                    <svg
                      aria-label="Audio is playing"
                      class="x1lliihq x1n2onr6 x9bdzbf"
                      fill="currentColor"
                      height="14"
                      role="img"
                      viewBox="0 0 24 24"
                      width="14"
                    >
                      <title>Audio is playing</title>
                      <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path>
                    </svg>
                  ) : (
                    <svg
                      aria-label="Audio is muted"
                      class="x1lliihq x1n2onr6 x9bdzbf"
                      fill="currentColor"
                      height="14"
                      role="img"
                      viewBox="0 0 48 48"
                      width="14"
                    >
                      <title>Audio is muted</title>
                      <path
                        clip-rule="evenodd"
                        d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>
            ) : (
              <img
                src={img.url ? img.url : URL.createObjectURL(img)}
                alt="Post"
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={"#imageSelected"}
        data-bs-slide="prev"
        onClick={handleSlideItem}
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
        onClick={handleSlideItem}
      >
        <span className="carousel-control-next-icon">
          <i className="fa-solid fa-chevron-right" />
        </span>
      </button>
    </div>
  );
}

export default SelectImage;
