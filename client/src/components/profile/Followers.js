import React from 'react'
import UserCard from '../UserCard'
import FollowButton from '../FollowButton'
import { useSelector } from 'react-redux'

const Followers = ({users, setShowFollowers}) => {
    const {auth} = useSelector(state => state)
  return (
    <div className='follow'>
        <div className='follow_box'>
                <h5>Người theo dõi</h5>
            <hr/>
           <div className='follow_box_usercard'>
                {
                    users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowers={setShowFollowers}>
                              {  auth.user._id !== user._id && <FollowButton user={user}/>}
                            </UserCard>
                    ))
                }
           </div>
            <i class="fa-solid fa-xmark close" onClick={() => setShowFollowers(false)}></i>
        </div>
    </div>
  )
}

export default Followers