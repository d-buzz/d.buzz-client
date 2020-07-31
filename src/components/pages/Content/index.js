import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getContentRequest, getRepliesRequest, clearReplies } from 'store/posts/actions'
import { createUseStyles } from 'react-jss'
import { Avatar, HashtagLoader } from 'components/elements'
import {
  MarkdownViewer,
  PostTags,
  PostActions,
  ReplyList,
} from 'components'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { anchorTop, getProfileMetaData, calculatePayout } from 'services/helper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'
import { Link } from 'react-router-dom'

const useStyles = createUseStyles({
  wrapper: {
    width: '95%',
    margin: '0 auto',
    marginTop: 5,
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
  },
  username: {
    marginTop: -30,
    color: '#657786',
    paddingBottom: 0,
  },
  meta: {
    color: 'rgb(101, 119, 134)',
    fontSize: 15,
    marginRight: 15,
  },
  strong: {
    color: 'black !important',
  },
  link: {
    color: 'black',
    '&:hover': {
      color: 'black',
    },
  },
})

const Content = (props) => {
  const {
    getContentRequest,
    getRepliesRequest,
    match,
    content,
    loadingContent,
    loadingReplies,
    replies,
    clearReplies,
    user = {},
  } = props

  const { username, permlink } = match.params
  const classes = useStyles()

  const {
    author,
    body,
    json_metadata,
    created,
    children: replyCount = 0,
    active_votes,
    profile = {},
  } = content || ''

  let meta = {}
  let app = null
  let upvotes = 0
  let hasUpvoted = false

  const payout = calculatePayout(content)

  const { name } = getProfileMetaData(profile)

  if(json_metadata) {
    meta = JSON.parse(json_metadata)
    app = meta.app.split('/')[0]
  }

  if(active_votes) {
    upvotes = active_votes.filter((vote) => vote.weight >= 0).length
    if(user.is_authenticated) {
      hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
    }
  }

  useEffect(() => {
    anchorTop()
    clearReplies()
    getContentRequest(username, permlink)
    getRepliesRequest(username, permlink)
  // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      {
        !loadingContent && (
          <React.Fragment>
            <div className={classes.wrapper}>
              <React.Fragment>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <Avatar author={author} />
                  </Col>
                  <Col style={{ paddingLeft: 10, }}>
                    <div style={{ marginTop: 2, }}>
                      <Link to={`/@${author}`} className={classes.link}>
                        <p className={classes.name}>
                          { name ? name : `@${author}` }
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
                    { moment(`${created}Z`).local().format('LTS • \nLL') }
                    { app && <React.Fragment> • Posted using <b className={classes.strong}>{ app }</b></React.Fragment> }
                  </label>
                </div>
              </React.Fragment>
            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col>
                 <label className={classes.meta}><b className={classes.strong}>{ upvotes }</b> Upvotes</label>
                 <label className={classes.meta}><b className={classes.strong}>{ replyCount }</b> Replies</label>
                </Col>
              </Row>
            </div>
            <div className={classes.full}>
              <div className={classes.inner}>
                <Row>
                  <Col>
                    <PostActions
                      author={username}
                      permlink={permlink}
                      hasUpvoted={hasUpvoted}
                      hideStats={true}
                      voteCount={upvotes}
                      replyCount={replyCount}
                      payout={payout}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <ReplyList replies={replies} expectedCount={replyCount} />
          </React.Fragment>
        )
      }
      <HashtagLoader loading={loadingContent || loadingReplies} />
      <br />
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
