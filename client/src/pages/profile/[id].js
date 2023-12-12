import React, {useEffect, useState} from 'react'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import { useSelector, useDispatch } from 'react-redux'
import loading from "../../images/loading.gif"
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
import grid from '../../images/grid.png'
import Saved from '../../components/profile/Saved'
const Profile = () => {
  const {profile, auth} = useSelector(state => state)
  const [saveTab, setSaveTab] = useState(false)
  const {id} = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if(profile.ids.every(item => item.id !== id))
    {
      dispatch(getProfileUsers({ users: profile.users, id, auth }));  
    }
    
  }, [id, auth, profile.users, dispatch]);
  return (
    <div className='profile'>
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id}/>
      {
        auth.user._id === id && 
        <div className='profile_tab'>
            <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>

                  <img src={grid} className='grid' alt=''/>
                  <span>Bài viết</span>
            </button>
            <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>
                <i class="fa-regular fa-bookmark profile_saved_icon"></i>
                <span>Đã lưu</span>
            </button>
        </div>
      }
      {
        profile.loading ? 
        <img src={loading} alt="loading" className="d-block mx-auto my-4" /> 
        : <>
        {
          saveTab ? 
          <Saved auth={auth} dispatch={dispatch}/>
          : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id}/>
        }
        </>
      }
       
    </div>
  )
}

export default Profile


