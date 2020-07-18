import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyle = createUseStyles({
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f !important',
    },
  },
})

const PostTags = ({ meta }) => {
  const classes = useStyle()

  console.log({ meta })

  let tags = []
  try {
    if('tags' in meta) {
      tags = meta.tags
    }
  } catch (e) { 
    console.log(e)
  }

  return (
    <div className={classes.tags}>
      {
        tags.map((tag) => (
          <a href="/" style={{ marginRight: 5 }}>#{ tag }</a> 
        ))
      }
    </div>
  )
}

export default PostTags