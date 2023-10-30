import React from 'react'
import StoryList from './StoryList'
import Posts from './Posts'

const MainContent = () => {
  return (
    <div className="col-8 main-content">
      <StoryList />
      <Posts />
    </div>
  )
}

export default MainContent
