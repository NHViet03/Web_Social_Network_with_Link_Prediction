import React from 'react'
import Avatar from '../components/Avatar';

const fakeImage="https://marketplace.canva.com/EAFltIh8PKg/1/0/1600w/canva-cute-anime-cartoon-illustration-girl-avatar-J7nVyTlhTAE.jpg";
const Home = () => {
  return (
    <div className='col-9'>
      Home
      <Avatar src={fakeImage} size='avatar-md' border/>
    </div>
  )
}

export default Home
