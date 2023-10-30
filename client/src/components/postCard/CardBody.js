import React from "react";
import Carousel from "../Carousel";

const CardBody = ({ post }) => {
  return (
    <div className="mt-3 card_body">
      {post && <Carousel images={post.images} id={post._id} />}
    </div>
  );
};

export default CardBody;
