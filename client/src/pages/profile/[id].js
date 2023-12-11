import React, {useEffect} from 'react'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import { useSelector, useDispatch } from 'react-redux'
import loading from "../../images/loading.gif"
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
const Profile = () => {
  const {profile, auth} = useSelector(state => state)
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
        profile.loading ? <img src={loading} alt="loading" className="d-block mx-auto my-4" /> :
        <Posts auth={auth} profile={profile} dispatch={dispatch} id={id}/>
      }
      
    </div>
  )
}

export default Profile


