import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserCard from "../UserCard";

const fakeUsers = [
  {
    username: "xeesoxee",
    fullname: "Han So-hee",
    avatar:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
  },
  {
    username: "shinseulkee",
    fullname: "Shin Seul-Ki",
    avatar:
      "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
  },
  {
    username: "rohyoonseo",
    fullname: "Roh Yoon-seo",
    avatar:
      "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
  },
  {
    username: "xeesoxee",
    fullname: "Han So-hee",
    avatar:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
  },
  {
    username: "shinseulkee",
    fullname: "Shin Seul-Ki",
    avatar:
      "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
  },
];
const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    setUsers(fakeUsers);
  }, []);
  return (
    <div className="col-4 suggestions">
      <UserCard
        avatar={auth.avatar}
        username={auth.username}
        fullname={auth.fullname}
        size="avatar-md"
      />
      <h6 className="my-4">Gợi ý cho bạn</h6>
      <div className="suggest-list">
        {users &&
          users.map((user,index)=>(
            <UserCard 
              key={index}
            avatar={user.avatar}
            username={user.username}
            fullname={user.fullname}
            follow
            />
          ))
        }
      </div>
    </div>
  );
};

export default Suggestions;
