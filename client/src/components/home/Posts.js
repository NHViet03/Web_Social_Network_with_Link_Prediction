import React, { useState, useEffect } from "react";
import CardBody from "../postCard/CardBody";
import CardHeader from "../postCard/CardHeader";
import CardFooter from "../postCard/CardFooter";

const fakePosts = [
  { 
    _id: "abc123",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
    images: [
      {
        public_id: "public_id",
        url: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/371537827_283996864603548_6652331480356533403_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF4uCFJcXl-KB-b2r00uFekAG-zzQ-WZ74Ab7PND5Znvo6zkL2pAS3Bws2v-a3UIs2Xxtfv5xryqIOkFYoQBFvE&_nc_ohc=vtCL5ooMyrMAX8LMJGC&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdRQW23gsAakACAwhVP-YItB6xfxKcjybvRytYz8sNSSFg&oe=65670A76",
      },
      {
        public_id: "public_id",
        url: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.15752-9/371487198_699879498427977_5380303991251094446_n.png?_nc_cat=102&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFwoN8JkZBiSC0suVkUTT8XqUJWUfa8nbqpQlZR9ryduq0wqqaeJ8VVg3hQ8nuHon3zAB-2fR-OpeHx9AFQXe-j&_nc_ohc=yRwwLCdZ_MYAX-uEpwS&_nc_ht=scontent.fsgn5-9.fna&oh=03_AdTDVzhIPZiqcxKIvuDLQV46H1rwtZ9ll1xqLF1n9nGcWA&oe=65671E0F",
      },
    ],
    user: {
      username: "xeesoxee",
      fullname: "Han So-hee",
      avatar:
        "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
    },
    likes: ["", "", ""],
    comments: [
      {
        content: "Beautiful Girl",
        user: {
          username: "shinseulkee",
          fullname: "Shin Seul-Ki",
          avatar:
            "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
        },
      },
      {
        content: "Awesome! The most beautiful girl i have ever seen!",
        user: {
          username: "rohyoonseo",
          fullname: "Roh Yoon-seo",
          avatar:
            "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
        },
      },
    ],
  },
  {
    _id: "abc456",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
    images: [
      {
        public_id: "public_id",
        url: "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/396654757_1382238592701116_6867043854719723273_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFX1WLOrH7kiNDsR2-8BbTTiUbqBXEFUr6JRuoFcQVSvuTSpYJ66vxu76jFl9qwBMNZBdoWiYUXQxSpQrC9E2Ar&_nc_ohc=N4L2mtd8ORgAX9zhum6&_nc_ht=scontent.fsgn5-13.fna&oh=03_AdQs91oc2HuhNLxVNxLhfrCbq90NujPNaITF_KtrwOegtQ&oe=65674574",
      },
      {
        public_id: "public_id",
        url: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/371454037_3744204225799006_5465792090985357290_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFQggUwpfAEeFS8EsDrlTdtXtqhXhzO3wle2qFeHM7fCck9NC87WQwzmD_rkI4Kav2prqC4Jt_y_pdzo5-WnNrg&_nc_ohc=4TUB-pvApsIAX97sGLa&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdTpMzzQNXYE0I0c9pJuPDjfGqY9c6QmOzEvQpNvPwzX4A&oe=656724B9",
      },
    ],
    user: {
      username: "rohyoonseo",
      fullname: "Roh Yoon-seo",
      avatar:
        "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
    },
    likes: ["", "", ""],
    comments: [
      {
        content: "Beautiful Girl",
        user: {
          username: "xeesoxee",
          fullname: "Han So-hee",
          avatar:
            "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
        },
      },
      {
        content: "Awesome! The most beautiful girl i have ever seen!",
        user: {
          username: "xeesoxee",
          fullname: "Han So-hee",
          avatar:
            "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
        },
      },
    ],
  },
];

const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fake API
    setPosts(fakePosts);
  }, []);

  return (
    <div className="home-posts">
      {posts &&
        posts.map((post, index) => (
          <div className="mb-3 home-post-item" key="index">
            <CardHeader user={post.user} />
            <CardBody post={post} />
            <CardFooter post={post} />
          </div>
        ))}
    </div>
  );
};

export default Posts;
