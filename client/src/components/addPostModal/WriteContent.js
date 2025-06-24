import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import ShowImages from "./ShowImages";
import Avatar from "../Avatar";
import UserCard from "../UserCard";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

function WriteContent({ post, setPost }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showEmoji, setShowEmoji] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [showHashtags, setShowHashtags] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showLocations, setShowLocations] = useState(false);

  const defaultTagUsers = useMemo(() => {
    const existUserSet = new Set(post.tags?.map((user) => user._id) || []);

    const newArr = auth.user.followers.filter(
      (user) => !existUserSet.has(user._id)
    );

    auth.user.following.forEach((user) => {
      if (
        !newArr.find((item) => item._id === user._id) &&
        !existUserSet.has(user._id)
      ) {
        newArr.push(user);
      }
    });

    newArr.map((user) => {
      user.image = user.avatar;
      user.title = user.username;
      user.subtitle = user.fullname;
      return user;
    });

    return newArr;
  }, [auth.user.followers, auth.user.following, post.tags]);

  const [tagUsers, setTagUsers] = useState(defaultTagUsers);
  const [showTagUsers, setShowTagUsers] = useState(false);

  const contentRef = useRef();
  const hashtagsRef = useRef();
  const locationsRef = useRef();
  const tagUsersRef = useRef();

  const handleEmojiSelect = (emoji) => {
    setPost({
      ...post,
      content: post.content + emoji.native,
    });
    contentRef.current.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        hashtagsRef.current &&
        !hashtagsRef.current.contains(e.target) &&
        !e.target.classList.contains("list-group-item")
      ) {
        setShowHashtags(false);
        hashtagsRef.current.value =
          post.hashtags?.length > 0
            ? post.hashtags.length + " hashtags đã chọn"
            : "";
      }

      if (
        locationsRef.current &&
        !locationsRef.current.contains(e.target) &&
        !e.target.classList.contains("list-group-item")
      ) {
        setShowLocations(false);
        locationsRef.current.value = post.location?.name || "";
      }

      if (
        tagUsersRef.current &&
        !tagUsersRef.current.contains(e.target) &&
        !e.target.classList.contains("list-group-item")
      ) {
        setShowTagUsers(false);
        tagUsersRef.current.value =
          post.tags?.length > 0 ? post.tags.length + " người đã gắn thẻ" : "";
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Hashtags
  const handleSearchHashtags = async (keyword) => {
    try {
      const data = await fetch(
        `https://hashtag5.p.rapidapi.com/api/v2.1/tag/predict?keyword=${keyword}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "214ae9b6a7mshe2d8b5b63eacda2p179e07jsn24f1f6de4c18",
            "X-RapidAPI-Host": "hashtag5.p.rapidapi.com",
          },
        }
      );

      const result = await data.json();

      setHashtags(result.tags?.slice(0, 20));
    } catch (error) {
      console.error("Error fetching hashtags:", error);
    }
  };

  useEffect(() => {
    hashtagsRef.current.value =
      post.hashtags?.length > 0
        ? post.hashtags.length + " hashtags đã chọn"
        : "";
  }, [post.hashtags]);

  const debounceHandleSearchHashtags = debounce(handleSearchHashtags, 500);

  const handleChangeHashtagsInput = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const value = e.target.value.trim().toLowerCase();
    debounceHandleSearchHashtags(value);
  };

  const handleChooseHashtag = (hashtag) => {
    setShowHashtags(false);

    if (post.hashtags?.includes(hashtag)) {
      return;
    }

    if (post.hashtags?.length > 4) {
      return;
    }

    setPost({
      ...post,
      hashtags: [...(post.hashtags || []), hashtag],
    });
  };

  const handleRemoveHashtag = (hashtag) => {
    setShowHashtags(false);

    if (!post.hashtags.includes(hashtag)) {
      return;
    }

    setPost({
      ...post,
      hashtags: post.hashtags.filter((item) => item !== hashtag),
    });
  };

  // Locations
  const handleSearchLocations = async (keyword) => {
    try {
      const data = await fetch(
        `https://google-map-places.p.rapidapi.com/maps/api/place/queryautocomplete/json?input=${keyword}&radius=1000&language=vi`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "214ae9b6a7mshe2d8b5b63eacda2p179e07jsn24f1f6de4c18",
            "X-RapidAPI-Host": "google-map-places.p.rapidapi.com",
          },
        }
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await data.json();

      setLocations(
        result?.predictions?.map((item) => ({
          name: item?.description,
          id: item?.place_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching hashtags:", error);
    }
  };

  const debounceHandleSearchLocations = debounce(handleSearchLocations, 500);

  const handleChangeLocationsInput = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const value = e.target.value.trim().toLowerCase();
    debounceHandleSearchLocations(value);
  };

  const handleChooseLocation = async (location) => {
    setShowLocations(false);

    if (post.location?.name === location.name) {
      setPost({
        ...post,
        location: {
          id: "",
          name: "",
        },
      });

      return;
    }

    setPost({
      ...post,
      location,
    });
  };

  useEffect(() => {
    locationsRef.current.value = post.location?.name || "";
  }, [post.location.name]);

  // Tag users
  const handleSearchTagUsers = async (keyword) => {
    if (keyword === "" || keyword === undefined) {
      setTagUsers(defaultTagUsers);
      return;
    }

    try {
      const res = await getDataAPI(
        `search?keyword=${keyword}&type=user`,
        auth.token
      );

      const existUserSet = new Set(post.tags?.map((user) => user._id) || []);

      const filteredUsers = res.data.results.filter(
        (user) => !existUserSet.has(user._id) && user._id !== auth.user._id
      );

      // const userMapping = filteredUsers.map((user) => {
      //  return {
      //   _id: user._id,
      //   avatar: user.image,
      //   username: user.title,
      //   fullname: user.subtitle,
      //  }
      // })

      setTagUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching search users:", error);
    }
  };

  const debounceHandleSearchTagUsers = debounce(handleSearchTagUsers, 500);

  const handleChangeTagUsersInput = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const value = e.target.value.trim().toLowerCase();
    debounceHandleSearchTagUsers(value);
  };

  const handleChooseTagUser = (e, user) => {
    if (post.tags.length >= 5 && e.target.checked) {
      e.preventDefault();
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Bạn chỉ có thể gắn thẻ tối đa 5 người",
        },
      });
    }

    if (e.target.checked) {
      setPost({
        ...post,
        tags: [...(post.tags || []), user],
      });

      setTagUsers((prev) => prev.filter((item) => item._id !== user._id));
    } else {
      setPost({
        ...post,
        tags: post.tags.filter((item) => item._id !== user._id),
      });
    }
  };

  useEffect(() => {
    tagUsersRef.current.value =
      post.tags?.length > 0 ? post.tags.length + " người đã gắn thẻ" : "";
  }, [post.tags]);

  return (
    <div className="d-flex justify-content-between">
      <ShowImages post={post} />
      <div className="write_content">
        <div className="d-flex align-items-center mt-3 px-3">
          <Avatar src={auth.user.avatar} size="avatar-xs" />
          <span
            style={{
              fontWeight: 500,
              marginLeft: "12px",
            }}
          >
            {auth.user.username}
          </span>
        </div>
        <textarea
          ref={contentRef}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          value={post.content}
        ></textarea>
        <div className="d-flex px-3 align-items-center justify-content-between">
          <div className="form-emoji">
            <i
              className="fa-regular fa-face-grin"
              onClick={() => setShowEmoji(!showEmoji)}
            />

            {showEmoji && (
              <div className="form-emoji-picker">
                <Picker
                  data={data}
                  previewPosition="none"
                  searchPosition="none"
                  theme="light"
                  set="native"
                  locale="vi"
                  perLine="7"
                  maxFrequentRows={14}
                  emojiSize={28}
                  navPosition="bottom"
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-color)",
            }}
          >
            {post.content.length}/200
          </span>
        </div>

        <div className="advanced-options">
          <div className="input-group option">
            <input
              className="form-control"
              type="text"
              placeholder="Thêm hashtags"
              onFocus={(e) => {
                setShowHashtags(true);
                e.target.value = "";
              }}
              onChange={handleChangeHashtagsInput}
              ref={hashtagsRef}
            />
            <span>#</span>

            <div
              className="dropdown"
              style={{
                display: showHashtags ? "block" : "none",
              }}
            >
              <ul className="list-group">
                <span>Đã chọn</span>
                {post.hashtags?.map((hashtag, index) => (
                  <li
                    key={index}
                    className="list-group-item active"
                    onClick={() => handleRemoveHashtag(hashtag)}
                  >
                    #{hashtag}
                  </li>
                ))}
                <hr />
                {hashtags.map((hashtag, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => handleChooseHashtag(hashtag)}
                  >
                    #{hashtag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Locations */}
          <div className="input-group option">
            <input
              className="form-control"
              type="text"
              placeholder="Thêm vị trí"
              onFocus={(e) => {
                setShowLocations(true);
                e.target.value = "";
              }}
              onChange={handleChangeLocationsInput}
              ref={locationsRef}
            />
            <span>
              <svg
                aria-label="Add location"
                class="x1lliihq x1n2onr6 x1roi4f4"
                fill="currentColor"
                height="18"
                role="img"
                viewBox="0 0 24 24"
                width="18"
              >
                <title>Add location</title>
                <path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z"></path>
              </svg>
            </span>

            <div
              className="dropdown"
              style={{
                display: showLocations ? "block" : "none",
              }}
            >
              <ul className="list-group">
                {locations.map((location, index) => (
                  <li
                    key={location.id}
                    className="list-group-item"
                    onClick={() => handleChooseLocation(location)}
                  >
                    {location.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tag users */}
          <div className="input-group option">
            <input
              className="form-control"
              type="text"
              placeholder="Gắn thẻ"
              onFocus={(e) => {
                setShowTagUsers(true);
                e.target.value = "";
              }}
              ref={tagUsersRef}
              defaultValue={""}
              onChange={handleChangeTagUsersInput}
            />
            <span>
              <svg
                aria-label="Add collaborators"
                class="x1lliihq x1n2onr6 x1roi4f4"
                fill="currentColor"
                height="18"
                role="img"
                viewBox="0 0 24 24"
                width="18"
              >
                <title>Add collaborators</title>
                <path d="M21 10a1 1 0 0 0-1 1v9c0 .932-.643 1.71-1.507 1.931C18.429 19.203 16.199 17 13.455 17H8.55c-2.745 0-4.974 2.204-5.037 4.933A1.999 1.999 0 0 1 2 20V6c0-1.103.897-2 2-2h9a1 1 0 1 0 0-2H4C1.794 2 0 3.794 0 6v14c0 2.206 1.794 4 4 4h14c2.206 0 4-1.794 4-4v-9a1 1 0 0 0-1-1zM8.549 19h4.906a3.05 3.05 0 0 1 3.045 3H5.505a3.05 3.05 0 0 1 3.044-3z"></path>
                <path d="M6.51 11.002c0 2.481 2.02 4.5 4.502 4.5 2.48 0 4.499-2.019 4.499-4.5s-2.019-4.5-4.5-4.5a4.506 4.506 0 0 0-4.5 4.5zm7 0c0 1.378-1.12 2.5-2.498 2.5-1.38 0-2.501-1.122-2.501-2.5s1.122-2.5 2.5-2.5a2.502 2.502 0 0 1 2.5 2.5zM23.001 3.002h-2.004V1a1 1 0 1 0-2 0v2.002H17a1 1 0 1 0 0 2h1.998v2.003a1 1 0 1 0 2 0V5.002h2.004a1 1 0 1 0 0-2z"></path>
              </svg>
            </span>

            <div
              className="dropdown"
              style={{
                display: showTagUsers ? "block" : "none",
                bottom: "100%",
                top: "unset",
              }}
            >
              <ul className="list-group">
                <span>Đã chọn</span>
                {post.tags?.map((user, index) => (
                  <li
                    key={user._id}
                    className="list-group-item list-group-item-tag"
                  >
                    <UserCard
                      user={{
                        _id: user._id,
                        username: user.title,
                        fullname: user.subtitle,
                        avatar: user.image,
                      }}
                      size={"avatar-xs"}
                    />
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={user._id}
                      checked
                      onClick={(e) => handleChooseTagUser(e, user)}
                    />
                  </li>
                ))}
                <hr />
                {tagUsers.map((user, index) => (
                  <li
                    key={user._id}
                    className="list-group-item list-group-item-tag"
                  >
                    <UserCard
                      user={{
                        _id: user._id,
                        username: user.title,
                        fullname: user.subtitle,
                        avatar: user.image,
                      }}
                      size={"avatar-xs"}
                    />
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={user._id}
                      onChange={(e) => handleChooseTagUser(e, user)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteContent;
