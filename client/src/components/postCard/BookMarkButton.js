import React from "react";

const BookMarkButton = ({ isBookmark, handleBookmark, handleUnBookmark }) => {
  return (
    <>
      {isBookmark ? (
        <span
          className="fa-solid fa-bookmark"
          style={{ color: "var(--primary-color)" }}
          onClick={handleUnBookmark}
        />
      ) : (
        <span className="fa-regular fa-bookmark" onClick={handleBookmark} />
      )}
    </>
  );
};

export default BookMarkButton;
