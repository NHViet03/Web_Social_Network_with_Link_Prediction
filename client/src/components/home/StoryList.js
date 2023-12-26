import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Avatar from "../Avatar";
import StoryModal from "./StoryModal";

const StoryList = () => {
  const auth = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [isShowStoryModal, setIsShowStoryModal] = useState(false);
  const [storySelected, setStorySelected] = useState(null);
  const [storySelectedList, setStorySelectedList] = useState([]);

  useEffect(() => {
    setStories(auth.user.following);
  }, [auth]);

  const responsive = {
    desktop: {
      breakpoint: { max: 4000, min: 769 },
      items: 8,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 6,
    },
  };

  const CustomRightArrow = useCallback(({ onClick }) => {
    return (
      <span
        onClick={onClick}
        className="story-arrow"
        style={{
          right: "24px",
        }}
      >
        <i className="fa-solid fa-chevron-right" />
      </span>
    );
  }, []);

  const CustomLeftArrow = useCallback(({ onClick }) => {
    return (
      <span
        onClick={onClick}
        className="story-arrow"
        style={{
          left: "24px",
        }}
      >
        <i className="fa-solid fa-chevron-left" />
      </span>
    );
  }, []);

  const handleShowStoryModal = (story) => {
    setIsShowStoryModal(true);
    setStorySelected(story);
    setStorySelectedList([...storySelectedList, story]);
  };

  return (
    <div>
      <Carousel
        slidesToSlide={3}
        responsive={responsive}
        containerClass="story-list"
        itemClass="story-item"
        draggable={false}
        customRightArrow={<CustomRightArrow />}
        customLeftArrow={<CustomLeftArrow />}
        transitionDuration={300}
      >
        {stories &&
          stories.map((story, index) => (
            <div key={index} onClick={() => handleShowStoryModal(story)}>
              <Avatar
                src={story.avatar}
                size={"avatar-md"}
                alt={story.username}
                border={
                  storySelected &&
                  storySelectedList.find((item) => item._id === story._id) !==
                    undefined
                    ? false
                    : true
                }
              />
              <span className="mt-1 text-center d-block">{story.username.length>10 ? story.username.slice(0,10)+'...': story.username}</span>
            </div>
          ))}
      </Carousel>

      {isShowStoryModal && (
        <StoryModal
          setIsShowStoryModal={setIsShowStoryModal}
          story={storySelected}
        />
      )}
    </div>
  );
};

export default StoryList;
