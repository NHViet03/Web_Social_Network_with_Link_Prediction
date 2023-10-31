import React, { useState, useEffect } from "react";
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom";
import Avatar from "../Avatar";

const StoryList = () => {
  const {homePosts}=useSelector(state=>state);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Fake API
    setStories(homePosts.users);
  }, [homePosts]);
  return (
    <div className="story-list">
      {stories &&
        stories.map((story, index) => (
          <Link key={index} className="story-item" to={`/profile/abc`}>
            <Avatar
              src={story.avatar}
              size={"avatar-md"}
              alt={story.username}
              border
            />
            <span className="mt-1">{story.username}</span>
          </Link>
        ))}
    </div>
  );
};

export default StoryList;
