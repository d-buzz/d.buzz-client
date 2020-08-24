import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { getContentRequest, getRepliesRequest, clearReplies } from 'store/posts/actions'
import { createUseStyles } from 'react-jss'
import { Avatar } from 'components/elements'
import {
  MarkdownViewer,
  PostTags,
  PostActions,
  ReplyList,
  UserDialog,
} from 'components'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { anchorTop, getProfileMetaData, calculatePayout } from 'services/helper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { ContentSkeleton, ReplylistSkeleton } from 'components'

const useStyles = createUseStyles({
  wrapper: {
    width: '95%',
    margin: '0 auto',
    marginTop: 0,
    borderBottom: '1px solid #e6ecf0',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
  },
  full: {
    width: '100%',
    marginTop: 5,
    borderBottom: '1px solid #e6ecf0',
  },
  inner: {
    width: '95%',
    margin: '0 auto',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
    fontSize: 14,
  },
  username: {
    marginTop: -30,
    color: '#657786',
    paddingBottom: 0,
    fontSize: 14,
  },
  meta: {
    color: 'rgb(101, 119, 134)',
    fontSize: 14,
    marginRight: 15,
  },
  strong: {
    color: 'black !important',
  },
  link: {
    color: 'black',
    fontSize: 14,
    '&:hover': {
      color: 'black',
    },
  },
  contextWrapper: {
    width: '95%',
    height: '100%',
    margin: '0 auto',
    '& a': {
      color: '#d32f2f',
    }
  }
})

const Content = (props) => {
  const {
    getContentRequest,
    getRepliesRequest,
    match,
    content,
    loadingContent,
    loadingReplies,
    clearReplies,
    user = {},
    replies,
  } = props

  const { username, permlink } = match.params
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const popoverAnchor = useRef(null)

  const {
    author,
    body,
    json_metadata,
    created,
    children: replyCount = 0,
    active_votes,
    profile = {},
    cashout_time,
    depth,
    root_author,
    root_title,
    root_permlink,
    parent_author,
    parent_permlink,
  } = content || ''

  let meta = {}
  let app = null
  let upvotes = 0
  let hasUpvoted = false
  let payout_at = cashout_time

  let payout = calculatePayout(content)

  if(!cashout_time) {
    const { payout_at: payday } = content
    payout_at = payday
  }

  if(isNaN(payout)) {
    const { payout: pay } = content
    payout = pay
  }

  const { is_authenticated } = user

  const { name } = getProfileMetaData(profile)

  if(json_metadata) {
    try{
      meta = JSON.parse(json_metadata)
      app = meta.app.split('/')[0]
    } catch(e) {
      if(Object.keys(json_metadata).length !== 0 && json_metadata.constructor === Object) {
        app = json_metadata.app.split('/')[0]

        if(json_metadata.hasOwnProperty('tags')) {
          meta.tags = json_metadata.tags
        }
      }
    }
  }

  if(active_votes) {
    if(active_votes.length > 0) {

      if(active_votes[0].hasOwnProperty('weight')) {
        upvotes = active_votes.filter((vote) => vote.weight >= 0).length
      } else {
        upvotes = active_votes.length
      }

      if(is_authenticated) {
        hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
      }
    }
  }

  useEffect(() => {
    anchorTop()
    clearReplies()
    getContentRequest(username, permlink)
    getRepliesRequest(username, permlink)
  // eslint-disable-next-line
  }, [permlink])


  const generateAuthorLink = () => {
    let link = `/@${author}`
    if(!is_authenticated) {
      link = `/ug${link}`
    }
    return link
  }

  const openPopOver = (e) => {
    setOpen(true)
  }

  const closePopOver = (e) => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      {!loadingContent && (
          <React.Fragment>
            <div className={classes.wrapper}>
              <br />
              <React.Fragment>
                {depth !== 0 && (
                  <Row>
                    <Col>
                      <div
                        style={{
                          height: 120,
                          width: '100%',
                          backgroundColor: '#f5f8fa',
                          paddingBottom: 10,
                          borderRadius: '16px 16px',
                          marginBottom: 20,
                        }}
                      >
                        <div className={classes.contextWrapper}>
                          <h6 style={{ paddingTop: 5, }}>You are viewing a single comment's thread from:</h6>
                          <h5>RE: {root_title}</h5>
                          <ul>
                            <li><Link to={`/@${root_author}/c/${root_permlink}`}>View the full context</Link></li>
                            <li><Link to={`/@${parent_author}/c/${parent_permlink}`}>View the diect parent</Link></li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <Avatar author={author} />
                  </Col>
                  <Col style={{ paddingLeft: 10, }}>
                    <div style={{ marginTop: 2, }}>
                      <Link
                        ref={popoverAnchor}
                        to={generateAuthorLink}
                        className={classes.link}
                        onMouseEnter={openPopOver}
                        onMouseLeave={closePopOver}
                      >
                        <p className={classes.name}>
                          {name ? name : `@${author}`}
                        </p>
                      </Link>
                      <br />
                      <p className={classes.username}>@{author}</p>
                    </div>
                  </Col>
                </Row>
                <MarkdownViewer content={body} minifyAssets={false} />
                <PostTags meta={meta} />
                <div style={{ marginTop: 10 }}>
                  <label className={classes.meta}>
                    {moment(`${created}Z`).local().format('LTS • \nLL')}
                    {app && <React.Fragment> • Posted using <b className={classes.strong}>{app}</b></React.Fragment>}
                  </label>
                </div>
              </React.Fragment>
            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col>
                 <label className={classes.meta}><b className={classes.strong}>{upvotes}</b> Upvotes</label>
                 <label className={classes.meta}><b className={classes.strong}>{replyCount}</b> Replies</label>
                </Col>
              </Row>
            </div>
            <div className={classes.full}>
              <div className={classes.inner}>
                <Row>
                  <Col>
                    <PostActions
                      disableExtraPadding={true}
                      body={body}
                      author={username}
                      permlink={permlink}
                      hasUpvoted={hasUpvoted}
                      hideStats={true}
                      voteCount={upvotes}
                      replyCount={replyCount}
                      payout={payout}
                      payoutAt={payout_at}
                      replyRef="content"
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </React.Fragment>
      )}
      {!loadingReplies && !loadingContent && (
        <ReplyList replies={replies} expectedCount={replyCount} />
      )}
      <ContentSkeleton loading={loadingContent} />
      {replyCount !== 0 && (
        <ReplylistSkeleton loading={loadingReplies || loadingContent} />
      )}
      <br />
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
  loadingContent: pending(state, 'GET_CONTENT_REQUEST'),
  loadingReplies: pending(state, 'GET_REPLIES_REQUEST'),
  replies: state.posts.get('replies'),
  content: state.posts.get('content'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getContentRequest,
    getRepliesRequest,
    clearReplies,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
