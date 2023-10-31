const initialState = {
  posts: [
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
        _id: "abc678",
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
            _id: "abc123",
            username: "xeesoxee",
            fullname: "Han So-hee",
            avatar:
              "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
          },
        },
        {
          content: "Awesome! The most beautiful girl i have ever seen!",
          user: {
            _id: "abc123",
            username: "xeesoxee",
            fullname: "Han So-hee",
            avatar:
              "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
          },
        },
      ],
    },
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
        _id: "abc123",
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
            _id: "abc456",
            username: "shinseulkee",
            fullname: "Shin Seul-Ki",
            avatar:
              "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
          },
        },
        {
          content: "Awesome! The most beautiful girl i have ever seen!",
          user: {
            _id: "abc678",
            username: "rohyoonseo",
            fullname: "Roh Yoon-seo",
            avatar:
              "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
          },
        },
      ],
    },
    {
      _id: "abc100",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/395755699_2648173538680301_8713796829786107740_n.png?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeEq7G6Jq1mRPtPgK7_v-oOKiYfmq5vEkkGJh-arm8SSQQmjrSP_woWS964Pwpq0xX8UWyIvf0FUzGq0pudQBi-Q&_nc_ohc=pp8LocekkK8AX-_t0wm&_nc_ht=scontent.fsgn5-13.fna&oh=03_AdQx8wxFxvRt2lIqZ0ZMSyBL_9k3QUiEbzoH4y7afUnoLw&oe=656895C8",
        },
      ],
      user: {
        _id: "abc678",
        username: "rosalineyuhh",
        fullname: "Rosa Line",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395465307_532495459099163_6143034257415964199_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFcfoE6yIwvbxu7SkRe6Aqqz3ycLNOzlu3PfJws07OW7c75IV2cO9E9iLWj80zbzQvX_OyX4p-sn_N8lcbP4dh8&_nc_ohc=yzbKK_12uF0AX_xse8f&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSpk-zY4au6stUa5CEp4IduEINQfVcvoBkVwXkNfnFKjg&oe=65687E9F",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc101",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/370076153_360491846399444_8434616272380758589_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGCXRUMyPGk_MFPIQEsjFPK0yxellqc6ofTLF6WWpzqhy9QmkNJk3OdwLQsl0WY7p0-zZIVBQELImSQ0oQcuOZH&_nc_ohc=LOP9K7Nxf08AX-hhEQ9&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdRPaVSQ-P4-xH7c4kDTVAoONYVLlzQq7cRWtltEb4gRVQ&oe=6568A4CF",
        },
      ],
      user: {
        _id: "abc678",
        username: "rosalineyuhh",
        fullname: "Rosa Line",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395465307_532495459099163_6143034257415964199_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFcfoE6yIwvbxu7SkRe6Aqqz3ycLNOzlu3PfJws07OW7c75IV2cO9E9iLWj80zbzQvX_OyX4p-sn_N8lcbP4dh8&_nc_ohc=yzbKK_12uF0AX_xse8f&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSpk-zY4au6stUa5CEp4IduEINQfVcvoBkVwXkNfnFKjg&oe=65687E9F",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc102",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-3.fna.fbcdn.net/v/t1.15752-9/395097450_334643322481313_6126665874372981757_n.png?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGewEqaF9NLvR3r9ZTl9p6vl7Vhkoa8VJKXtWGShrxUkuwR6PSyUBXMbBAp4c3rizmoJ4wPHYdD1QtHZMEkE0u5&_nc_ohc=9XQwmQQK4qkAX9JKl5M&_nc_oc=AQk-GvHDGj_5zEC7l64Nj5iFw4uhQe_Z690K3RI84cqafQYJTaAYM0IbGeuiDJsM3R3-eZEh-dZadD7v6iZcNRvS&_nc_ht=scontent.fsgn5-3.fna&oh=03_AdQUOVXaApwAaVPG-mAO0VfEQlFhPsuAvqwh8_CuutBK7A&oe=6568989B",
        },
      ],
      user: {
        _id: "abc678",
        username: "phs1116",
        fullname: "PARK HYUNGSIK",
        avatar:
          "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/394659218_1087699275929146_1726840625700674151_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeEEh8U0eNCfNj9jZso_tcwqSnwg7iJgOTFKfCDuImA5MRoIBO-Ip8bsLDV-d5Qug59T8UfGspJJ0eMfVvvWrpkS&_nc_ohc=kPZeMxIQctUAX-_b5rH&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdS1qhet2-TpajuaYugcBOZ8pViStROqjkAsXAHvJNgvNw&oe=6568A5CB",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc103",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-13.fna.fbcdn.net/v/t1.15752-9/371537324_293705693537245_1102938839439648779_n.png?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFJoaC2etnLfjrGwdZitXO6DZ4N4eNy0D4Nng3h43LQPgFGdn1IMtyQmlor2zisVD8DpT8RKlFd1fr-AFsu-kgR&_nc_ohc=Ts9tghSdTfEAX_pOb-_&_nc_ht=scontent.fsgn5-13.fna&oh=03_AdRqeMNkYtRH83CwMnI0annxv0I18eLNLdDw4Qb5SuDFDA&oe=6568AAC7",
        },
      ],
      user: {
        _id: "abc678",
        username: "bogummy",
        fullname: "PARK BO GUM",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395301626_1274645599916557_3505396367880739948_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHaABJJFY00DTrgJdaCxc2DP0oNOZIQh5s_Sg05khCHm7jSOnRvalGV7mpD3aYZb3zgDcvqz_ixLA4vqnlbUJKz&_nc_ohc=wnRmsQe7KhMAX9Rcv--&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSKz3dtXJolfc4Dh8GdZxAFCW_e2BCVZIOl-O8gCgxHVA&oe=6568A648",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc104",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://bazaarvietnam.vn/wp-content/uploads/2021/05/park-bo-gum-1.jpeg",
        },
      ],
      user: {
        _id: "abc678",
        username: "bogummy",
        fullname: "PARK BO GUM",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395301626_1274645599916557_3505396367880739948_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHaABJJFY00DTrgJdaCxc2DP0oNOZIQh5s_Sg05khCHm7jSOnRvalGV7mpD3aYZb3zgDcvqz_ixLA4vqnlbUJKz&_nc_ohc=wnRmsQe7KhMAX9Rcv--&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSKz3dtXJolfc4Dh8GdZxAFCW_e2BCVZIOl-O8gCgxHVA&oe=6568A648",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc105",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/370208039_653534280101268_8474605251510246355_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHfhUhJ5_NlxbpdHquu11OdLHtX2CGXcyose1fYIZdzKiNzVMZ84FBYQqAQSGigqQydpqXd-pMflxGUcT_wM7ZO&_nc_ohc=hHlnHdZWrHkAX_5QC9S&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdSsCmuzeTTbgbhSgCk8xwyd34M-xs_jg2nE2Eb1Re1EhQ&oe=6568AEE5",
        },
      ],
      user: {
        _id: "abc105",
        username: "lavieenbluu",
        fullname: "Park Gyu-young",
        avatar:
          "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/368591203_718249323495961_8215655904493420963_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF7av1jU9wtBPLnVg54AnFbh0UfhyrkjfuHRR-HKuSN-3EU3Zvcf_qyiDI0U6gGZF16FRYXkMPe2xjhsFsagWyx&_nc_ohc=NymJjJJjDYoAX9NNuQE&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdR5YkeqJLOJCC4n4yUSA-ALVt9_3vELb6cGYO0Pn4O7MA&oe=65688115",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc106",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/394332308_1133349988075151_2735519146490357812_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeE5jxaykyfDY0IdtQsQm9MSG2W0hxDC290bZbSHEMLb3WoiciNfZ31zLFwt2XxC4kLHXzgHp9In9cJbWt4FbtGF&_nc_ohc=K95KN1ZFryIAX8UCJxN&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdTIdWwni_CXcBEZYhWQB4n6ey86Gngi-1m9zP7JoNUvKg&oe=65689408",
        },
      ],
      user: {
        _id: "abc105",
        username: "thv",
        fullname: "V",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/396312643_709463721056013_4572404616959222186_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGLZ6HANuhQdEz8n1sDN-9ohUcHDfNEpOSFRwcN80Sk5NuBZKcEYdth6upfKiXSMirE2q3sfAqQjNPiWYYelvPi&_nc_ohc=3n4Fm1lEUdAAX8XTlwE&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdQSWM-iVEMCRoo1o5LpH2g9AskZ7Cv4_rkd9MDPXqIm6A&oe=6568AEC7",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc107",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/396664869_712916846930169_7085701480738750176_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFX94c2S8Uf7oSFOXNtC2Cmp4mGrqKEBUiniYauooQFSBGYtNdqgsuzl3Z8XSzJ4YfIbXaH0A4Fjpi-vGyPxaEe&_nc_ohc=Nbz83LFiE64AX-CFdfY&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdToHZVyWTOb56T78BOEEC9nTbBOGNuQele0LfWFnS4r0A&oe=6568A90B",
        },
      ],
      user: {
        _id: "abc105",
        username: "thv",
        fullname: "V",
        avatar:
          "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/396312643_709463721056013_4572404616959222186_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGLZ6HANuhQdEz8n1sDN-9ohUcHDfNEpOSFRwcN80Sk5NuBZKcEYdth6upfKiXSMirE2q3sfAqQjNPiWYYelvPi&_nc_ohc=3n4Fm1lEUdAAX8XTlwE&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdQSWM-iVEMCRoo1o5LpH2g9AskZ7Cv4_rkd9MDPXqIm6A&oe=6568AEC7",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc108",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/396664942_1447791906131763_4848986944843358821_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF_hhwcDQ0qqfZwjFbG-5dUvrNe0oSRypS-s17ShJHKlNl_BLOo4A6pRNDfpVP5kIqLevs7eyzUAqddgrAFhT5m&_nc_ohc=aeeMWYmN_MYAX-rAz3y&_nc_ht=scontent.fsgn5-12.fna&oh=03_AdSEAD4GHxIrZn55QpN43RLLkjmuSNGJX47k13ZYtG6yXw&oe=65688895",
        },
      ],
      user: {
        _id: "abc105",
        username: "hihyunwoo",
        fullname: "이현우",
        avatar:
          "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/371461896_1709932952822028_4130076371343332306_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFPQOdI5j1QutUf6Fzasj95INzZLAVViM0g3NksBVWIzU7SqJu85zlgFs_z-QdKJfsy36-lCSmEyy7Ut-N0_LdR&_nc_ohc=NY1irItYTK8AX_R4Oim&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdQvCTFmNkvcdBX8-hTc8zPITiZloeNkw_YVD7VJqzsysQ&oe=6568AD6C",
      },
      likes: ["", "", ""],
      comments: [],
    },
    {
      _id: "abc109",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        {
          public_id: "public_id",
          url: "https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/canvas/2022/04/04/5faa4646-20ad-4b1e-b00e-816f1ff547e6_01f9c460.jpg?itok=hc0pNYcC&v=1649046950",
        },
      ],
      user: {
        _id: "abc105",
        username: "yejinhand",
        fullname: "Son Ye-Jin",
        avatar:
          "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/396697211_205262485926980_571658785852988638_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFSXVawaqJiUqdMTtaWf9C4WqrNaMkxIVRaqs1oyTEhVEEg2xaTPI20Yu-fVm_AVM571uS7q2Ft8sMS_nriJTP4&_nc_ohc=HJUWvVcFjNIAX_IGNkn&_nc_ht=scontent.fsgn5-12.fna&oh=03_AdQj0ZsRzFi1P1lx2VDbgq_yObpHijXetP2azEoh9QRyrA&oe=65689A53",
      },
      likes: ["", "", ""],
      comments: [],
    },
  ],
  users: [
    {
      _id: "abc123",
      username: "xeesoxee",
      fullname: "Han So-hee",
      avatar:
        "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
    },
    {
      _id: "abc678",
      username: "rohyoonseo",
      fullname: "Roh Yoon-seo",
      avatar:
        "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
    },
    {
      _id: "abc678",
      username: "rosalineyuhh",
      fullname: "Rosa Line",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395465307_532495459099163_6143034257415964199_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFcfoE6yIwvbxu7SkRe6Aqqz3ycLNOzlu3PfJws07OW7c75IV2cO9E9iLWj80zbzQvX_OyX4p-sn_N8lcbP4dh8&_nc_ohc=yzbKK_12uF0AX_xse8f&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSpk-zY4au6stUa5CEp4IduEINQfVcvoBkVwXkNfnFKjg&oe=65687E9F",
    },
    {
      _id: "abc678",
      username: "phs1116",
      fullname: "PARK HYUNGSIK",
      avatar:
        "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/394659218_1087699275929146_1726840625700674151_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeEEh8U0eNCfNj9jZso_tcwqSnwg7iJgOTFKfCDuImA5MRoIBO-Ip8bsLDV-d5Qug59T8UfGspJJ0eMfVvvWrpkS&_nc_ohc=kPZeMxIQctUAX-_b5rH&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdS1qhet2-TpajuaYugcBOZ8pViStROqjkAsXAHvJNgvNw&oe=6568A5CB",
    },
    {
      _id: "abc678",
      username: "bogummy",
      fullname: "PARK BO GUM",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395301626_1274645599916557_3505396367880739948_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHaABJJFY00DTrgJdaCxc2DP0oNOZIQh5s_Sg05khCHm7jSOnRvalGV7mpD3aYZb3zgDcvqz_ixLA4vqnlbUJKz&_nc_ohc=wnRmsQe7KhMAX9Rcv--&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSKz3dtXJolfc4Dh8GdZxAFCW_e2BCVZIOl-O8gCgxHVA&oe=6568A648",
    },
    {
      _id: "abc105",
      username: "lavieenbluu",
      fullname: "Park Gyu-young",
      avatar:
        "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/368591203_718249323495961_8215655904493420963_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF7av1jU9wtBPLnVg54AnFbh0UfhyrkjfuHRR-HKuSN-3EU3Zvcf_qyiDI0U6gGZF16FRYXkMPe2xjhsFsagWyx&_nc_ohc=NymJjJJjDYoAX9NNuQE&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdR5YkeqJLOJCC4n4yUSA-ALVt9_3vELb6cGYO0Pn4O7MA&oe=65688115",
    },
    {
      _id: "abc105",
      username: "thv",
      fullname: "V",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/396312643_709463721056013_4572404616959222186_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGLZ6HANuhQdEz8n1sDN-9ohUcHDfNEpOSFRwcN80Sk5NuBZKcEYdth6upfKiXSMirE2q3sfAqQjNPiWYYelvPi&_nc_ohc=3n4Fm1lEUdAAX8XTlwE&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdQSWM-iVEMCRoo1o5LpH2g9AskZ7Cv4_rkd9MDPXqIm6A&oe=6568AEC7",
    },
    {
      _id: "abc105",
      username: "hihyunwoo",
      fullname: "이현우",
      avatar:
        "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/371461896_1709932952822028_4130076371343332306_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFPQOdI5j1QutUf6Fzasj95INzZLAVViM0g3NksBVWIzU7SqJu85zlgFs_z-QdKJfsy36-lCSmEyy7Ut-N0_LdR&_nc_ohc=NY1irItYTK8AX_R4Oim&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdQvCTFmNkvcdBX8-hTc8zPITiZloeNkw_YVD7VJqzsysQ&oe=6568AD6C",
    },
    {
      _id: "abc105",
      username: "yejinhand",
      fullname: "Son Ye-Jin",
      avatar:
        "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/396697211_205262485926980_571658785852988638_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFSXVawaqJiUqdMTtaWf9C4WqrNaMkxIVRaqs1oyTEhVEEg2xaTPI20Yu-fVm_AVM571uS7q2Ft8sMS_nriJTP4&_nc_ohc=HJUWvVcFjNIAX_IGNkn&_nc_ht=scontent.fsgn5-12.fna&oh=03_AdQj0ZsRzFi1P1lx2VDbgq_yObpHijXetP2azEoh9QRyrA&oe=65689A53",
    },
  ],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default postReducer;
