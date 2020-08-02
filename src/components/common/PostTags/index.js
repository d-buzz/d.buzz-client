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

  let tags = []
  try {
    if('tags' in meta) {
      tags = meta.tags
    }
  } catch (e) {  }

  return (
    <div className={classes.tags}>
      {
        tags.map((tag) => (
          <a key={`${tag}`} href="/" style={{ marginRight: 5 }}>#{ tag }</a>
        ))
      }
    </div>
  )
}

export default PostTags
