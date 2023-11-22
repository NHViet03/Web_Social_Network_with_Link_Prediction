import React,{useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import GalleryPost from '../components/GalleryPost';


const Explore = () => {
  const homePosts=useSelector(state=>state.homePosts)
  const [posts,setPosts]=useState([]);
  
  useEffect(()=>{
    // Fake API
    setPosts(homePosts.posts);
  },[homePosts.posts])


  return (
    <div className='explore_container'>
      <GalleryPost posts={posts}/>
    </div>
  )
}

export default Explore
