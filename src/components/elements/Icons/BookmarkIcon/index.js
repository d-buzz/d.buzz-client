import React from 'react'

const BookmarkIcon = ({ height = 20, top = 0, type }) => {
  // return (
  //   <svg height="20" viewBox="0 0 24 24">
  //     <g>
  //       <path strokeWidth="0.3" stroke="rgb(101, 119, 134)" d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
  //     </g>
  //   </svg>
  // )
  return (
    type === 'outline' ?
      <svg height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path style={{ strokeWidth: '0'}} d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" fill="#e61c34"/>
      </svg>
      :
      <svg height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path style={{ strokeWidth: '0'}} d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z" fill="#e61c34"/>
      </svg> 
      
  )
}

export default BookmarkIcon
