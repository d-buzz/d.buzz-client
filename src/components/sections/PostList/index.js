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
import { connect } from 'react-redux'
import { getProfileMetaData } from 'services/helper'
import { useHistory } from 'react-router-dom'

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


const PostList = (props) => {
  const classes = useStyle()
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
    active_votes = [],
    unguardedLinks,
    user = {},
    title = null,
    disableProfileLink = false,
    profileRef = null,
    payoutAt = null,
   } = props


   let hasUpvoted = false
   const history = useHistory()
   let authorLink = `/@${author}${'?ref='+profileRef}`

   if(unguardedLinks) {
     authorLink = `ug${authorLink}`
   }


   if(user.is_authenticated) {
     hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
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

    if(href.match(/(\/tags\/?q\/=)/)) {
      const split = href.split('/')
      console.log({ split })
      href = `${split[3]}`
    }

    if(href && !href.includes(hostname)) {
      e.preventDefault()
      window.open(href, '_blank')
    } else {
      if(!href.match(/(\/tags\/?q\/=)/)) {
        history.push(generateLink(author, permlink))
      } else {
        history.push(`/${href}`)
      }
    }
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
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
                    {
                      !disableProfileLink && (
                        <Link to={authorLink}>
                          { name ? name : `@${author}`}
                        </Link>
                      )
                    }
                    {
                      disableProfileLink && (<span>{ name ? name : `@${author}`}</span>)
                    }
                  </label>
                  <label className={classes.username}>
                    { `@${author}` } &bull;&nbsp;
                    { moment(`${created}Z`).local().fromNow() }
                  </label>
                  <div onClick={handleOpenContent(author, permlink)}>
                    <MarkdownViewer content={body}/>
                    <PostTags meta={meta} />
                  </div>
                </div>
                <div className={classes.actionWrapper}>
                  <PostActions
                    title={title}
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
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(PostList)
