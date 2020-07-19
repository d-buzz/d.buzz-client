import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  MarkdownViewer,
  PostTags,
  PostActions
} from 'components'
import moment from 'moment'


const useStyle = createUseStyles({
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
})

const countReplies = async (replies = []) => {
  let counter = 0

  replies.forEach((reply) => {
    counter += (reply.children + 1)
  })

  return counter
}

const ReplyList = (props) => {
  let { replies, expectedCount } = props
  replies = replies.filter((reply) => reply.body.length <= 280 )
  const classes = useStyle()
  const [replyCounter, setReplyCounter] = useState(0)

  useEffect(() => {
    countReplies(replies)
      .then((count) => {
        setReplyCounter(count)
      })
  // eslint-disable-next-line
  }, [replies])

  const RenderReplies = ({ reply }) => {
    const {
      author,
      created,
      body,
      parent_author,
      active_votes,
      children: replyCount,
      pending_payout_value: payout,
      meta,
    } = reply

    let { replies } = reply
    replies = replies.filter((reply) => reply.body.length <= 280 )

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
                  <label className={classes.name}>{author}</label>
                  <label className={classes.username}>
                    { `@${author}` } &bull;&nbsp;
                    { moment(created).fromNow() }
                  </label>
                  <p style={{ marginTop: -10 }}>Replying to <a href={`/@${parent_author}`} className={classes.username}>{`@${parent_author}`}</a></p>
                  <MarkdownViewer minifyAssets={false} content={body} />
                  <PostTags meta={meta} />
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    voteCount={active_votes.length}
                    replyCount={replyCount}
                    payout={payout}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {
          replies.length !== 0 && (
            <React.Fragment>
              {
                replies.map((reply) => (
                  <RenderReplies reply={reply} />
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
        expectedCount !== replyCounter && (
          <p style={{ fontSize: 15, width: '98%', margin: '0 auto', marginTop: 5, color: '#d32f2f' }}>
            Some replies were filtered because it exceeds 280 characters
          </p>
        )
      }
      {
        replies.map((reply) => (
          <div className={classes.wrapper}>
            <RenderReplies reply={reply} />
          </div>
        ))
      }
    </React.Fragment>
  )
}

export default ReplyList
