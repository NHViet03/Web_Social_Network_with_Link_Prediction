def postEntity(post) -> dict:
    return {
        "_id": str(post["_id"]),
        "user": str(post.get("user")),
        "content": str(post.get("content")),
        "images": post.get("images", []),
    }