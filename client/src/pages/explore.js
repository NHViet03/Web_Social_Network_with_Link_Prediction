import React,{useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import GalleryPost from '../components/GalleryPost';


const Explore = () => {
  const {homePosts}=useSelector(state=>state)
  const [posts,setPosts]=useState([]);
  
  useEffect(()=>{
    // Fake API
    setPosts(homePosts.posts);
  },[])

  const renderPosts = ()=>{
    const res=[];
    const numPosts=parseInt(posts.length/3);
    for(let i=0;i<posts.length;i+=numPosts){
      res.push(<GalleryPost key={i} posts={posts.slice(i,i+numPosts)}/>)
    }
    return res;
  }

  return (
    <div className='explore_container'>
      <div className="explore_posts">
        {posts && renderPosts()}
      </div>
    </div>
  )
}

export default Explore
