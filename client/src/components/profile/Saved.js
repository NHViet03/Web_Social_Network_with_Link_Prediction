import React, { useState, useEffect } from 'react';
import PostThumb from '../PostThumb';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes';
import Loading from '../Loading';

const Saved = ({ auth, dispatch }) => {
  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI('getSavePost', auth.token);
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
        setLoad(false);
      } catch (err) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: err.response.data.msg },
        });
        setLoad(false);
      }
    };

    fetchData();
  }, [auth.token, dispatch]);

  return (
    <>
      {load && <Loading />}
      <PostThumb posts={savePosts} result={result} />
    </>
  );
};

export default Saved;
