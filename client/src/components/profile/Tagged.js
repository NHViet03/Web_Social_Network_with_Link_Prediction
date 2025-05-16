import { useState, useEffect } from "react";
import PostThumb from "../PostThumb";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import loading from "../../images/loading.gif";

const Tagged = ({ auth, dispatch, id }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`/getTaggedPost/${id}`, auth.token);
        setPosts(res.data.data);
        setResult(res.data.result);
      } catch (err) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: err.response.data.msg },
        });
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, [auth.token, dispatch, id]);

  return (
    <>
      {load && <img src={loading} alt="loading" className="mx-auto d-block" />}
      <PostThumb posts={posts} result={result} />
    </>
  );
};

export default Tagged;
