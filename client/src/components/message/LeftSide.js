import React , { useState }from 'react'
export const LeftSide = () => {
    const [search, setSearch] = useState('') 
  return (
    <>
        <div className='message_header' >
            <input type='text'
             value={search} 
             placeholder='Find your friends...' 
            onChange={e=> setSearch(e.target.value)}
            />
        </div>
    </>
  
  )
}
export default LeftSide