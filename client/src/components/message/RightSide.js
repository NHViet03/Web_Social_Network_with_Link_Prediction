import React from 'react'
import {UserCard} from './UserCard'

const RightSide = () => {
  return (
    <div className='conversation-message_header'>
      <UserCard isInModal />
    </div>
  )
}

export default RightSide