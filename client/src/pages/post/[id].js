import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import CardHeader from "../../components/postCard/CardHeader";
import CardBody from "../../components/postCard/CardBody";
import CardFooterDetail from "../../components/postCard/CardFooterDetail";
import Loading from "../../components/Loading";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { POST_POOL_TYPES } from "../../redux/actions/postAction";

const PostDetail = () => {
  const auth = useSelector((state) => state.auth);
  const postPool = useSelector((state) => state.postPool);
  const [post, setPost] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      if (!id) return;

      // Check if the post is already in the postPool
      const existingPost = postPool.posts.find((item) => item._id === id);
      if (existingPost) {
        setPost(existingPost);
        return;
      }

      setLoading(true);
      try {
        const res = await getDataAPI(`post/${id}`, auth.token);
        dispatch({
          type: POST_POOL_TYPES.CREATE_POST,
          payload: res.data.post,
        });
      } catch (error) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: error.response.data.msg },
        });

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [auth.token, id, postPool]);

  return (
    <div className="postDetail">
      {loading && <Loading />}
      {post && (
        <div className="d-flex postDetail_modal-content">
          <div className="col-6">
            <CardBody post={post} />
          </div>
          <div className="col-6 mt-2 d-flex flex-column">
            <div className="px-2">
              <CardHeader user={post.user} post={post} />
            </div>
            <CardFooterDetail post={post} />
          </div>
        </div>
      )}
    </div>
  );
};
export default PostDetail;
