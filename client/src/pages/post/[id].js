import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import CardHeader from "../../components/postCard/CardHeader";
import CardBody from "../../components/postCard/CardBody";
import CardFooterDetail from "../../components/postCard/CardFooterDetail";
import Loading from '../../components/Loading'

const PostDetail = () => {
  const auth = useSelector((state) => state.auth);
  const [post, setPost] = useState(false);
  const [loading,setLoading]=useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      if (!id) return;
      setLoading(true);
      const res = await getDataAPI(`post/${id}`, auth.token);
      setPost(res.data.post);
      setLoading(false);
    };

    getPost();
  }, [auth.token, id]);

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
            <CardFooterDetail post={post} setPost={setPost} />
          </div>
        </div>
      )}
    </div>
  );
};
export default PostDetail;
