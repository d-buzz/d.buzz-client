import React from 'react'
import { createUseStyles } from 'react-jss'
import { PostList, CreateBuzzForm } from 'components'

const useStyles = createUseStyles({
  blue: {
    backgroundColor: 'blue'
  },
  red: {
    backgroundColor: 'red',
    height: '100vh',
  }
})

const Home = (props) => {
  const classes = useStyles()
  
  return (
    <React.Fragment>
      <CreateBuzzForm />
      <PostList />
    </React.Fragment>
  )
}

export default Home
