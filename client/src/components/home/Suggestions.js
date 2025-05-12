import React, { useState, useEffect } from "react";
import UserCard from "../UserCard";
import FollowButton from "../FollowButton";
import Loading from "../Loading";

import { useSelector, useDispatch } from "react-redux";
import { getSuggestedUsers } from "../../redux/actions/suggestAction";

const Suggestions = () => {
  const { auth, developer, suggest } = useSelector((state) => ({
    auth: state.auth,
    developer: state.developer,
    suggest: state.suggest,
  }));

  const dispatch = useDispatch();

  const users = suggest.users;

  const [loading, setLoading] = useState(false);
  const [predictionModel, setPredictionModel] = useState("CN");

  useEffect(() => {
    const fetchData = async () => {
      if (suggest.model === predictionModel) return;

      setLoading(true);

      await dispatch(getSuggestedUsers(auth, predictionModel));

      setLoading(false);
    };

    fetchData();
  }, [auth, predictionModel]);

  const prediction_models = [
    {
      name: "Common Neighbor",
      value: "CN",
    },
    {
      name: "Jaccard",
      value: "JC",
    },
    {
      name: "Adamic-Adar",
      value: "AA",
    },
    {
      name: "Katz Index",
      value: "Katz",
    },
  ];

  const getPredictSentense = (user) => {
    let sentence = "";

    if (user.followers?.length > 0) {
      sentence = "Có ";

      sentence += user.followers[0].username;

      if (user.followers.length > 1) {
        sentence += ", " + user.followers[1].username;
      }

      if (user.followers.length > 2) {
        sentence += " và " + (user.followers.length - 2) + " người khác ";
      }

      sentence += " theo dõi";
    } else if (user.following?.length > 0) {
      sentence = "Đang theo dõi ";

      sentence += user.following[0].username;

      if (user.following.length > 1) {
        sentence += ", " + user.following[1].username;
      }

      if (user.following.length > 2) {
        sentence += " và " + (user.following.length - 2) + " người khác ";
      }
    } else {
      return "Gợi ý cho bạn";
    }

    return sentence.length > 40 ? sentence.slice(0, 40) + "..." : sentence;
  };

  return (
    <div className="col-4 suggestions">
      <UserCard user={auth.user} size="avatar-md" />
      <div className="d-flex justify-content-between align-items-center my-4">
        <h6
          className="mb-0"
          style={{
            flex: 1,
          }}
        >
          Gợi ý cho bạn
        </h6>

        {developer && (
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              data-bs-toggle="dropdown"
              style={{
                border: "1px solid var(--border-color)",
              }}
            >
              Thuật toán:{" "}
              {
                prediction_models.find(
                  (model) => model.value === predictionModel
                ).name
              }
            </button>
            <ul
              className="dropdown-menu"
              style={{
                width: "100%",
              }}
            >
              {prediction_models.map((model) => (
                <li
                  key={model.value}
                  onClick={() => setPredictionModel(model.value)}
                >
                  <a className="dropdown-item" href={`#${model.value}`}>
                    {model.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="suggest-list">
          {users?.map((user, index) => (
            <UserCard
              key={user._id}
              user={{
                _id: user._id,
                username: user.username,
                fullname: getPredictSentense(user),
                avatar: user.avatar,
              }}
            >
              {" "}
              <FollowButton user={user} />
            </UserCard>
          ))}
        </div>
      )}

      <small
        style={{
          display: "block",
          marginTop: "24px",
          color: "#c7c7c7",
        }}
      >
        © 2025 DREAMERS FROM DREAMER TEAM
      </small>
    </div>
  );
};

export default Suggestions;
