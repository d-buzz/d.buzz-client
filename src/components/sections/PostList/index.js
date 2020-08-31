import React, { useState, useRef } from 'react'
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

const useStyle = createUseStyles({
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e6ecf0',
    '& a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f5f8fa',
    },
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 60,
  },
  right: {
    height: 'max-content',
    width: 480,
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
    fontSize: 14,
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
})


const PostList = (props) => {
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
    profile = {},
    active_votes = [],
    unguardedLinks,
    user = {},
    profileRef = null,
    payoutAt = null,
    highlightTag = null,
    title = null,
  } = props

  let { disableProfileLink = false, disableUserMenu = false  } = props

  const [open, setOpen] = useState(false)
  const popoverAnchor = useRef(null)


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

  const handleOpenContent = (author, permlink) => (e) => {
    const { target } = e

    let { href } = target

    const hostname = window.location.hostname

    e.preventDefault()

    if(target.className !== 'sc-bdVaJa cjGBmU react_tinylink_card_media') {
      if(href && !href.includes(hostname)) {
        window.open(href, '_blank')
      } else {
        if(!href) {
          history.push(generateLink(author, permlink))
        } else {
          const split = href.split('/')
          href = `/${split[3]}`
          history.push(href)
        }
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
              <div className={classes.left} onClick={handleOpenContent(author, permlink)}>
                <Avatar author={author} />
              </div>
            </Col>
            <Col xs="auto" style={{ paddingLeft: 5 }}>
              <div className={classes.right}>
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
                    {disableProfileLink && (<span>{name ? name : `@${author}`}</span>)}
                  </label>
                  <label className={classes.username}>
                    {`@${author}`} &bull;&nbsp;
                    {moment(`${ !searchListMode ? `${created}Z` : created }`).local().fromNow()}
                  </label>
                  <div onClick={handleOpenContent(author, permlink)}>
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

export default connect(mapStateToProps)(PostList)
