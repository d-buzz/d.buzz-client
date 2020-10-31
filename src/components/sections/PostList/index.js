import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  MarkdownViewer,
  PostTags,
  PostActions,
} from 'components'
import { openUserDialog, saveScrollIndex } from 'store/interface/actions'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useWindowDimensions } from 'services/helper'
import { setPageFrom } from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { isMobile } from 'react-device-detect'
import classNames from 'classnames'

const addHover = (theme) => {
  let style = {
    '&:hover': {
      ...theme.postList.hover,
    },
  }

  if(isMobile) {
    style = {}
  }

  return style
}

const useStyle = createUseStyles(theme => ({
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  title: {
    ...theme.font,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: theme.border.primary,
    '& a': {
      color: 'black',
    },
    ...addHover(theme),
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
  },
  right: {
    height: 'max-content',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
    fontSize: 14,
    '& a': {
      color: theme.font.color,
    },
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
  },
  post: {
    color: '#14171a',
    paddingTop: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  preview: {
    '& a': {
      borderRadius: '10px 10px',
      boxShadow: 'none',
    },
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    },
  },
  paper: {
    pointerEvents: "auto",
    padding: 2,
    '& :after': {
      border: '1px solid red',
    },
  },
  button: {
    width: 85,
    height: 35,
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  spanName: {
    ...theme.font,
  },
  colLeft: {
    paddingRight: 0,
  },
  colRight: {
    paddingLeft: 5,
  },
}))


const PostList = React.memo((props) => {
  const classes = useStyle()
  const {
    searchListMode = false,
    author,
    permlink,
    created,
    body,
    upvotes,
    replyCount,
    payout,
    meta,
    active_votes = [],
    unguardedLinks,
    user = {},
    profileRef = null,
    payoutAt = null,
    highlightTag = null,
    title = null,
    disableProfileLink = false,
    disableUserMenu = false,
    disableUpvote = false,
    openUserDialog,
    saveScrollIndex,
    scrollIndex,
    recomputeRowIndex = () => {},
  } = props

  const { width } = useWindowDimensions()

  const [rightWidth, setRightWidth] = useState({ width: isMobile ? width-90 : 480 })
  const [avatarSize, setAvatarSize] = useState(isMobile ? 45 : 50)
  const [leftWidth, setLeftWidth] = useState({ width: isMobile ? 50 : 60 })
  const [delayHandler, setDelayHandler] = useState(null)
  const popoverAnchor = useRef(null)


  useEffect(() => {
    if(!isMobile) {
      if(width >= 676) {
        setAvatarSize(50)
        setLeftWidth({ width:60 })
        setRightWidth({ width:480 })
      } else {
        setLeftWidth({ width: 50 })
        setAvatarSize(45)
        if(!unguardedLinks) {
          setRightWidth({ width: width-200 })
        } else {
          setRightWidth({ width: width-120 })
        }
      }
    }
    // eslint-disable-next-line
  }, [width])

  let hasUpvoted = false
  const history = useHistory()
  const authorLink = `/@${author}${'?ref='+profileRef}`

  if(user.is_authenticated && !searchListMode) {
    hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
  } else {
    hasUpvoted = false
  }

  const generateLink = (author, permlink) =>  {
    let link = ''

    link += `/@${author}/c/${permlink}`

    return link
  }

  const handleOpenContent = (e) => {
    const { target } = e
    let { href } = target
    const hostname = window.location.hostname

    e.preventDefault()
    if(href && !href.includes(hostname)) {
      window.open(href, '_blank')
    } else {
      if(!href) {
        // setPageFrom(null)
        const link = generateLink(author, permlink)
        saveScrollIndex(scrollIndex)
        // history.entries = []
        // history.index = -1
        history.push(link)
      } else {
        const split = href.split('/')
        href = `/${split[3]}`
        history.push(href)
      }
    }
  }

  const openPopOver = (e) => {
    setDelayHandler(setTimeout(() => {
      openUserDialog(popoverAnchor.current, author)
    }, 500))
  }

  const closePopOver = () => {
    clearTimeout(delayHandler)
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.row}>
          <Row>
            <Col xs="auto" className={classes.colLeft}>
              <div style={leftWidth} className={classes.left} onClick={handleOpenContent}>
                <Avatar height={avatarSize} author={author} />
              </div>
            </Col>
            <Col xs="auto" className={classes.colRight}>
              <div className={classNames('right-content', classes.right)} style={rightWidth}>
                <div className={classes.content}>
                  <label className={classes.name}>
                    {!disableProfileLink && (
                      <Link
                        ref={popoverAnchor}
                        to={authorLink}
                        onMouseEnter={(!disableUserMenu && !isMobile) ? openPopOver : () => {}}
                        onMouseLeave={(!disableUserMenu && !isMobile) ? closePopOver: () => {}}
                        onClick={closePopOver}
                      >
                        {author}
                      </Link>
                    )}
                    {disableProfileLink && (<span className={classes.spanName}>{author}</span>)}
                  </label>
                  <label className={classes.username}>
                    &nbsp;&bull;&nbsp;{moment(`${ !searchListMode ? `${created}Z` : created }`).local().fromNow()}
                  </label>
                  <div onClick={handleOpenContent}>
                    {title && (<h6 className={classes.title}>{title}</h6>)}
                    <MarkdownViewer content={body} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex}/>
                    <PostTags meta={meta} highlightTag={highlightTag} />
                  </div>
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    disableUpvote={disableUpvote}
                    body={body}
                    hasUpvoted={hasUpvoted}
                    author={author}
                    permlink={permlink}
                    voteCount={upvotes}
                    replyCount={replyCount}
                    payout={`${payout}`}
                    recomputeRowIndex={recomputeRowIndex}
                    payoutAt={payoutAt}
                    scrollIndex={scrollIndex}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPageFrom,
    openUserDialog,
    saveScrollIndex,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(PostList)
