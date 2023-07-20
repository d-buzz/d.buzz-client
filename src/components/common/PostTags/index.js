import React from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

const useStyle = createUseStyles({
  tags: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 15px',
    wordBreak: 'break-word !important',
    width: '100%',
    height: 'max-content',
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    '& a': {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
    },
  },
  default: {
    padding: '3px 6px',
    borderRadius: 8,
    background: '#E65768',
    marginRight: 5,
    marginBottom: 5,
    color: '#ffffff !important',
    wordBreak: 'break-word !important',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  },
  highlighted: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    padding: '3px 6px',
    color: '#ffffff !important',
    lineHeight: 1.2,
    fontSize: 20,
  },
})

const PostTags = (props) => {
  const classes = useStyle()
  const { meta, highlightTag } = props
  // const { is_authenticated } = user
  const history = useHistory()

  let tags = []
  try {
    if('tags' in meta) {
      tags = meta.tags
    }
  } catch (e) {  }

  const generateTagsLink = (tag) => {
    let link = ''
    // link += `/tags?q$=${tag}`

    link += `/trending/${tag}`

    return link
  }

  const prevent = (e) => {
    e.preventDefault()
  }

  const onClick = (link) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    history.push(link)
  }

  return (
    <div className={classes.tags} onClick={prevent}>
      <div style={{ width: '95%', wordBreak: 'break-word' }}>
        {Array.isArray(tags) && tags.map((tag, index) => (
          <Link
            key={`${tag}~${index}~${Math.random(0,100)}`}
            to={'#'}
            onClick={onClick(generateTagsLink(tag))}
            className={classNames(classes.default, `${highlightTag}`.toLowerCase() === `${tag}`.toLowerCase() ? classes.highlighted : '')}
          >
            {`#${tag}`}
          </Link>
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(PostTags)
