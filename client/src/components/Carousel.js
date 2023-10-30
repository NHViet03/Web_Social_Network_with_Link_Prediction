import React from "react";

const Carousel = ({ images, id }) => {

  const isActive = (index) => {
    return index === 0 ? "active" : "";
  };

  return (
    <div id={`image${id}`} className="carousel slide">
      <div className="carousel-indicators">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={`#image${id}`}
            data-bs-slide-to={index}
            className={`carousel-btn ${isActive(index)}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div key={index} className={`carousel-item ${isActive(index)}`}>
            <img
              src={img.url}
              className="d-block w-100"
              alt="Post"
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon">
          <i className="fa-solid fa-chevron-left"/>
        </span>
        
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon">
          <i className="fa-solid fa-chevron-right"/>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
