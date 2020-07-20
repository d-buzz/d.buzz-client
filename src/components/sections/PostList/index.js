import React from 'react'
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
import { Link } from 'react-router-dom'
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

const getAuthorName = (profileMeta, postingMeta) => {
  const meta = JSON.parse(profileMeta)
  const posting = JSON.parse(postingMeta)

  try {
    return meta.profile.name
  } catch(e) {
    return posting.profile.name
  }
}

const PostList = (props) => {
  const {
    author,
    permlink,
    created,
    body,
    upvotes,
    replyCount,
    payout,
    meta,
    profile = {},
   } = props

   let json_metadata = null
   let posting_metadata = null

   if(
      'json_metadata' in profile
      && profile.json_metadata.includes('"name":')
      && profile.json_metadata.includes('"profile":')
    ) {
     json_metadata = profile.json_metadata
   }

   if(
     'posting_metadata' in profile
     && profile.posting_metadata.includes('"name":')
     && profile.posting_metadata.includes('"profile":')
    ) {
     posting_metadata = profile.posting_metadata
   }

  const classes = useStyle()

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
      <Link to={`content/@${author}/${permlink}`} style={{ textDecoration: 'none' }}>
        <div className={classes.row}>
          <Row>
            <Col xs="auto" style={{ paddingRight: 0 }}>
              <div className={classes.left}>
                <Avatar author={author} />
              </div>
            </Col>
            <Col>
              <div className={classes.right}>
                <div className={classes.content}>
                  <label className={classes.name}>
                    {json_metadata || posting_metadata ? getAuthorName(json_metadata, posting_metadata) : `@${author}`}
                  </label>
                  <label className={classes.username}>
                    { `@${author}` } &bull;&nbsp;
                    { moment(created).fromNow() }
                  </label>
                  <MarkdownViewer content={body} />
                  <PostTags meta={meta} />
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    voteCount={upvotes}
                    replyCount={replyCount}
                    payout={`${payout} HBD`}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default PostList
