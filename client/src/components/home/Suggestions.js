import React, { useState, useEffect } from "react";
import UserCard from "../UserCard";
import FollowButton from "../FollowButton";
import Loading from "../Loading";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const { auth, developer } = useSelector((state) => ({
    auth: state.auth,
    developer: state.developer,
  }));
  const [loading, setLoading] = useState(false);
  const [predictionModel, setPredictionModel] = useState("CN");

  useEffect(() => {
    const getLinkPredictionUsers = async () => {
      try {
        // setLoading(true);
        // setUsers([]);
        // const res = await axios.get(
        //   `http://localhost:8000/SuggestionUserBy${predictionModel}${auth.user._id}`
        // );

        // setUsers(res.data.data);
        // setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getLinkPredictionUsers();
  }, [auth.user._id, predictionModel]);

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
      {loading && <Loading />}
      <div className="suggest-list">
        {users &&
          users.map((user, index) => (
            <UserCard key={index} user={user}>
              {" "}
              <FollowButton user={user} />
            </UserCard>
          ))}
      </div>
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
