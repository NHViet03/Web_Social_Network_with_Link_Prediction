import React from 'react'

const LikeButton = ({isLike,handleLike,handleUnLike}) => {
  return (
    <>
    {isLike ? (
              <span
                className="fa-solid fa-heart likeBtn"
                style={{ color: "var(--primary-color)" }}
                onClick={handleUnLike}
              />
            ) : (
              <span className="fa-regular fa-heart likeBtn" onClick={handleLike} />
    )}
    </>
  )
}

export default LikeButton
