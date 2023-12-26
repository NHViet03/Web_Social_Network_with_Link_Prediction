import React from 'react'
import camera from '../images/camera.png'
const NoPost = () => {
  return (
    <div className='text-center no-post'>
        <img src={camera} alt=''/>
        <h2>Không có bài viết nào</h2>
    </div>
  )
}

export default NoPost