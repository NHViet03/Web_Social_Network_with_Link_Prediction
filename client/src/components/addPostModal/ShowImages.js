import React from 'react'

function SelectImage({post}) {
  const {images}=post;
  const isActive = (index) => {
    return index === 0 ? "active" : "";
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
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div key={index} className={`carousel-item h-100 ${isActive(index)}`}>
            <img
              src={URL.createObjectURL(img)}
              alt="Post"
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={"#imageSelected"}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon">
          <i className="fa-solid fa-chevron-left"/>
        </span>
        
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={"#imageSelected"}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon">
          <i className="fa-solid fa-chevron-right"/>
        </span>
      </button>
    </div>
  )
}

export default SelectImage
