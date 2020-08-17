import React from 'react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const useStyle = createUseStyles({
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
  },
  default: {
    marginRight: 5,
    color: '#d32f2f !important',
  },
  highlighted: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    paddingLeft: 2,
    paddingRight: 2,
    paddingBottom: 2,
    color: 'white !important',
  },
})

const PostTags = (props) => {
  const classes = useStyle()
  const { meta, highlightTag } = props

  let tags = []
  try {
    if('tags' in meta) {
      tags = meta.tags
    }
  } catch (e) {  }

  return (
    <div className={classes.tags}>
      {tags.map((tag) => (
        <Link
          key={`${tag}`}
          to={`/tags?q=${tag}`}
          className={classNames(classes.default, `${highlightTag}`.toLowerCase() === `${tag}`.toLowerCase() ? classes.highlighted : '')}
        >
          #{tag}
        </Link>
      ))}
    </div>
  )
}

export default PostTags
