import React, { useState, useEffect, useRef } from 'react'
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
  NotificationBox,
  UserDialog,
} from 'components'
import { connect } from 'react-redux'
import moment from 'moment'
import { getAuthorName, calculatePayout } from 'services/helper'
import { Link } from 'react-router-dom'


const useStyles = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    borderBottom: '1px solid #e6ecf0',
    overflow: 'hidden',
    '& a': {
      color: 'black',
    },
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 50,
  },
  right: {
    height: 'max-content',
    width: '98%',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
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
    '& a': {
      color: '#d32f2f',
    },
    '&:after': {
      content: '',
      clear: 'both',
      display: 'table',
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
    }
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
  link: {
    color: 'black !important',
    '&:hover': {
      color: 'black',
      textDecoration: 'underline !important',
    },
  },
})

const countReplies = async (replies = []) => {
  let counter = 0

  replies.forEach((reply) => {
    counter += (reply.children + 1)
  })

  return counter
}

const ReplyList = (props) => {
  let { replies, expectedCount, user, append } = props
  replies = replies.filter((reply) => reply.body.length <= 280 )
  const classes = useStyles()
  const [replyCounter, setReplyCounter] = useState(0)
  const [repliesState, setRepliesState] = useState(replies)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('error')

  const handleSnackBarClose = () => {
    setShowSnackbar(false)
  }

  useEffect(() => {
    countReplies(replies)
      .then((count) => {
        setReplyCounter(count)
      })
  // eslint-disable-next-line
  }, [replies])

  useEffect(() => {
    if(append.hasOwnProperty('refMeta')) {
      const { refMeta, root_author, root_permlink } = append
      const { ref, treeHistory } = refMeta

      if(ref === 'content') {
        setRepliesState([...repliesState, append])
      } else if(ref === 'replies') {
        let tree = treeHistory

        if(`${tree}`.includes('|')) {
          tree = tree.split('|')
        } else {
          tree = [tree]
        }

        const firstIndex = tree[0]
        tree.splice(0, 1)

        let iterableState = [...repliesState]
        const first = iterableState[firstIndex]

        let prefix = 'first'
        let rep = ''

        if(tree.length !== 0 ) {
          tree.forEach((item, index) => {
            rep += `.replies[${item}]`
            if(index === tree.length-1) {
              rep += `.replies = [...${prefix}${rep}.replies, ${JSON.stringify(append)}]`
            }
          })
        } else {
           rep = `.replies = [...${prefix}.replies, ${JSON.stringify(append)}]`
        }

        const combine = `${prefix}${rep}`
        // eslint-disable-next-line
        eval(combine)

        iterableState[firstIndex] = first
        setRepliesState(iterableState)
        setShowSnackbar(true)
        setSeverity('success')
        setMessage(`Succesfully replied to @${root_author}/${root_permlink}`)
      }
    }
  // eslint-disable-next-line
  }, [append])

  const RenderReplies = ({ reply, treeHistory }) => {
    const {
      author,
      created,
      permlink,
      body,
      parent_author,
      active_votes,
      children: replyCount,
      profile = {},
      meta,
      cashout_time,
    } = reply

    const { username, is_authenticated } = user
    const payout = calculatePayout(reply)

    let { replies } = reply
    replies = replies.filter((reply) => reply.body.length <= 280 )

    let profile_json_metadata = null
    let profile_posting_metadata = null

    if(
      'json_metadata' in profile
      && profile.json_metadata.includes('"name":')
      && profile.json_metadata.includes('"profile":')
      ) {
      profile_json_metadata = profile.json_metadata
    }

    if(
      'posting_metadata' in profile
      && profile.posting_metadata.includes('"name":')
      && profile.posting_metadata.includes('"profile":')
      ) {
      profile_posting_metadata = profile.posting_metadata
    }

    let hasUpvoted = false

    let authorLink = `/@${author}`

    if(is_authenticated) {
      hasUpvoted = active_votes.filter((vote) => vote.voter === username).length !== 0
    } else {
      authorLink = `/ug${authorLink}`
    }

    const title = body.substring(0, 100)
    const [open, setOpen] = useState(false)
    const popoverAnchor = useRef(null)

    const openPopOver = (e) => {
      setOpen(true)
    }

    const closePopOver = (e) => {
      setOpen(false)
    }

    return (
      <React.Fragment>
        <div className={classes.row}>
          <Row>
            <Col xs="auto" style={{ paddingRight: 0 }}>
              <div className={classes.left}>
                <Avatar author={author} />
                {
                  replies.length !== 0 && (
                    <div style={{ margin: '0 auto', width: 2, backgroundColor: '#dc354561', height: '100%', flexGrow: 1, }} />
                  )
                }
              </div>
            </Col>
            <Col>
              <div className={classes.right}>
                <div className={classes.content}>
                  <Link
                    ref={popoverAnchor}
                    to={`${authorLink}?ref=replies`}
                    className={classes.link}
                    onMouseEnter={openPopOver}
                    onMouseLeave={closePopOver}
                  >
                    <p className={classes.name}>
                      { profile_json_metadata || profile_posting_metadata ? getAuthorName(profile_json_metadata, profile_posting_metadata) : `@${author}` }
                    </p>
                  </Link>
                  <label className={classes.username}>
                    @{author} &bull;&nbsp;
                    { moment(`${created}Z`).local().fromNow() }
                  </label>
                  <p style={{ marginTop: -10 }}>Replying to <a href={`/@${parent_author}`} className={classes.username}>{`@${parent_author}`}</a></p>
                  <MarkdownViewer minifyAssets={false} content={body} />
                  <PostTags meta={meta} />
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    treeHistory={treeHistory}
                    title={title}
                    hasUpvoted={hasUpvoted}
                    author={author}
                    permlink={permlink}
                    voteCount={active_votes.length}
                    replyCount={replyCount}
                    payout={payout}
                    payoutAt={cashout_time}
                    replyRef="replies"
                  />
                </div>
              </div>
            </Col>
            <UserDialog
              open={open}
              anchorEl={popoverAnchor.current}
              onMouseEnter={openPopOver}
              onMouseLeave={closePopOver}
              profile={profile}
            />
          </Row>
        </div>
        {
          replies.length !== 0 && (
            <React.Fragment>
              {
                replies.map((reply, index) => (
                  <RenderReplies reply={reply} treeHistory={`${treeHistory}|${index}`}/>
                ))
              }
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {
        (expectedCount !== replyCounter) && (
          <center>
            <p style={{ fontSize: 15, width: '98%', margin: '0 auto', marginTop: 10, color: '#d32f2f' }}>
              Some replies may not appear because it exceeds 280 characters
            </p>
          </center>
        )
      }
      {
        repliesState.map((reply, index) => (
          <div className={classes.wrapper}>
            <RenderReplies reply={reply} treeHistory={index} />
          </div>
        ))
      }
      <NotificationBox
        show={showSnackbar}
        message={message}
        severity={severity}
        onClose={handleSnackBarClose}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  append: state.posts.get('appendReply'),
})

export default connect(mapStateToProps)(ReplyList)
