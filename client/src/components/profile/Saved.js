import React, {useState, useEffect} from 'react'
import PostThumb from '../PostThumb';
import NoPost from '../NoPost';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes';

const Saved = ({auth, dispatch}) => {

  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);

  useEffect(() => {
    getDataAPI('getSavePost', auth.token)
    .then(res => {
      setSavePosts(res.data.savePosts)
      setResult(res.data.result)
    })
    .catch(err => {
     dispatch({type: GLOBAL_TYPES.ALERT, 
      payload:  {error: err.response.data.msg}})
    })
  },[])
  return (
    <PostThumb posts={savePosts} result={result}/>
  )
}

export default Saved