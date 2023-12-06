import React from 'react'
import UserCard from '../UserCard'
import FollowButton from '../FollowButton'
import { useSelector } from 'react-redux'

const Following = ({users, setShowFollowing}) => {
    const {auth} = useSelector(state => state)
  return (
    <div className='follow'>
        <div className='follow_box'>
                <h5>Đang theo dõi</h5>
            <hr/>
           <div className='follow_box_usercard'>
                {
                    users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing}>
                              {  auth.user._id !== user._id && <FollowButton user={user}/>}
                            </UserCard>
                            
                    ))
                }
           </div>
            <i class="fa-solid fa-xmark close" onClick={() => setShowFollowing(false)}></i>
        </div>
    </div>
  )
}

export default Following