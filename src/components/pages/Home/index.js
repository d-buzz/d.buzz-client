import React from 'react'
import { PostList, CreateBuzzForm } from 'components'


const Home = (props) => {  
  return (
    <React.Fragment>
      <CreateBuzzForm />
      <PostList />
    </React.Fragment>
  )
}

export default Home
