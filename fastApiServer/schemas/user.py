def userEntity(item) -> dict:
    return {
        "_id": str(item["_id"]),
        "fullname": item.get("fullname"),
        "username": item.get("username"),
        "email": item.get("email"),
        "password": item.get("password"),
        "birthday": item.get("birthday"),
        "avatar": item.get("avatar"),
        "role": item.get("role"),
        "gender": item.get("gender"),
        "story": item.get("story"),
        "website": item.get("website"),
        "followers": [str(follower) for follower in item.get("followers", [])],
        "following": [str(following) for following in item.get("following", [])],
        "saved": [str(saved) for saved in item.get("saved", [])],
        "created_at": item.get("created_at"),
        "updated_at": item.get("updated_at"),
    }


def usersEntity(items) -> list:
    return [userEntity(item) for item in items]


def suggestion_entity(item) -> dict:
    return {
        "_id": str(item["_id"]),
        "username": item.get("username"),
        "avatar": item.get("avatar"),
        "followers": [str(follower) for follower in item.get("followers", [])],
        "following": [str(following) for following in item.get("following", [])],
    }
