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
  UserDialog,
} from 'components'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getProfileMetaData } from 'services/helper'
import { useHistory } from 'react-router-dom'
import { useWindowDimensions } from 'services/helper'
import { setPageFrom } from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

const useStyle = createUseStyles(theme => ({
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: theme.border.primary,
    '& a': {
      color: 'black',
    },
    '&:hover': {
      ...theme.postList.hover,
    },
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
}))


const PostList = (props) => {
  const classes = useStyle()
  const {
    setPageFrom,
    searchListMode = false,
    author,
    permlink,
    created,
    body,
    upvotes,
    replyCount,
    payout,
    meta,
    profile = {},
    active_votes = [],
    unguardedLinks,
    user = {},
    profileRef = null,
    payoutAt = null,
    highlightTag = null,
    title = null,
  } = props

  const { disableProfileLink = false, disableUserMenu = false  } = props
  const { width } = useWindowDimensions()

  const [open, setOpen] = useState(false)
  const [rightWidth, setRightWidth] = useState(480)
  const [avatarSize, setAvatarSize] = useState(50)
  const [leftWidth, setLeftWidth] = useState(60)
  const popoverAnchor = useRef(null)


  useEffect(() => {
    if(width >= 676) {
      setAvatarSize(50)
      setLeftWidth(60)
      setRightWidth(480)
    } else {
      console.log({ diff: width-200 })
      setLeftWidth(50)
      setAvatarSize(45)
      if(!unguardedLinks) {
        setRightWidth(width-180)
      } else {
        setRightWidth(width-120)
      }
    }
    // eslint-disable-next-line
  }, [width])

  let hasUpvoted = false
  const history = useHistory()
  let authorLink = `/@${author}${'?ref='+profileRef}`

  if(unguardedLinks) {
    authorLink = `ug${authorLink}`
  }

  if(user.is_authenticated && !searchListMode) {
    hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
  } else {
    hasUpvoted = false
  }

  const { name } = getProfileMetaData(profile)

  const generateLink = (author, permlink) =>  {
    let link = ''
    if(unguardedLinks) {
      link = '/ug'
    }

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
        setPageFrom(null)
        const link = generateLink(author, permlink)
        history.push(link)
      } else {
        const split = href.split('/')
        href = `/${split[3]}`
        history.push(href)
      }
    }
  }

  const openPopOver = (e) => {
    setOpen(true)
  }

  const closePopOver = (e) => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.row}>
          <Row>
            <Col xs="auto" style={{ paddingRight: 0 }}>
              <div style={{ width: leftWidth }} className={classes.left} onClick={handleOpenContent}>
                <Avatar height={avatarSize} author={author} />
              </div>
            </Col>
            <Col xs="auto" style={{ paddingLeft: 5 }}>
              <div className={classNames('right-content', classes.right)} style={{ width: rightWidth }}>
                <div className={classes.content}>
                  <label className={classes.name}>
                    {!disableProfileLink && (
                      <Link
                        ref={popoverAnchor}
                        to={authorLink}
                        onMouseEnter={!disableUserMenu ? openPopOver : () => {}}
                        onMouseLeave={!disableUserMenu ? closePopOver : () => {}}
                      >
                        {name ? name : `${author}`}
                      </Link>
                    )}
                    {disableProfileLink && (<span className={classes.spanName}>{name ? name : `@${author}`}</span>)}
                  </label>
                  <label className={classes.username}>
                    {`@${author}`} &bull;&nbsp;
                    {moment(`${ !searchListMode ? `${created}Z` : created }`).local().fromNow()}
                  </label>
                  <div onClick={handleOpenContent}>
                    {title && (<h6>{title}</h6>)}
                    <MarkdownViewer content={body}/>
                    <PostTags meta={meta} highlightTag={highlightTag} />
                  </div>
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    body={body}
                    hasUpvoted={hasUpvoted}
                    author={author}
                    permlink={permlink}
                    voteCount={upvotes}
                    replyCount={replyCount}
                    payout={`${payout}`}
                    payoutAt={payoutAt}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <UserDialog
        open={open}
        anchorEl={popoverAnchor.current}
        onMouseEnter={openPopOver}
        onMouseLeave={closePopOver}
        profile={profile}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPageFrom,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(PostList)
