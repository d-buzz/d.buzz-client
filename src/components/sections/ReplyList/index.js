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
} from 'components'
import { broadcastNotification, openCensorshipDialog } from 'store/interface/actions'
import classNames from 'classnames'
import { clearAppendReply, setPageFrom } from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import MuteIcon from '@material-ui/icons/VolumeOff'
import Chip from '@material-ui/core/Chip'
import { Link, useHistory } from 'react-router-dom'
import { calculateOverhead, truncateBody } from 'services/helper'
import stripHtml from 'string-strip-html'
import { censorLinks } from 'services/helper'


const useStyles = createUseStyles(theme => ({
  row: {
    width: '100%',
    paddingTop: 20,
    '&:hover': {
      ...theme.postList.hover,
    },
    cursor: 'pointer',
  },
  wrapper: {
    width: '100%',
    borderBottom: theme.border.primary,
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
    fontSize: 14,
    width: 'max-content',
    color: `${theme.font.color} !important`,
    '& a': {
      ...theme.font,
    },
  },
  note: {
    marginTop: -10,
    fontSize: 14,
    ...theme.font,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
    fontSize: 14,
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
  link: {
    ...theme.font,
    fontSize: 14,
    '&:hover': {
      color: theme.font.color,
      textDecoration: 'underline !important',
    },
  },
  inner: {
    width: '95%',
    margin: '0 auto',
  },
  hideNote: {
    fontSize: 14,
    width: '98%',
    margin: '0 auto',
    marginTop: 10,
    color: '#d32f2f',
    paddingBottom: 10,
    fontFamily: 'Segoe-Bold',
  },
  thread: {
    margin: '0 auto',
    width: 2,
    backgroundColor: '#dc354561',
    height: '100%',
    flexGrow: 1,
  },
  context: {
    minHeight: 95,
    width: '100%',
    ...theme.context.view,
    paddingBottom: 10,
    borderRadius: '16px 16px',
    marginBottom: 20,
    fontFamily: 'Segoe-Bold',
  },
  contextWrapper: {
    width: '95%',
    height: '100%',
    margin: '0 auto',
    '& a': {
      color: '#d32f2f',
    },
    paddingTop: 10,
    paddingBottom: 2,
  },
  muteIcon: {
    ...theme.font,
  },
  muteButton: {
    float: 'right',
  },
  seeMoreRepliesButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 0',
    width: '100%',
    fontFamily: 'Segoe-Bold',
    cursor: 'pointer',

    '&:hover': {
      background: theme.seeMoreReplies.background,
    },

    '& span': {
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
      padding: '8px 25px',
      borderRadius: 8,
      userSelect: 'none',
      ...theme.seeMoreReplies,
    },
  },
}))

const countReplies = async (replies = []) => {
  let counter = 0

  replies.forEach((reply) => {
    counter += (reply.children + 1)
  })

  return counter
}

const ReplyList = (props) => {
  const {
    mutelist,
    expectedCount,
    user,
    append,
    setPageFrom,
    broadcastNotification,
    openCensorshipDialog,
    replies,
    censorList,
  } = props
  const { clearAppendReply } = props
  const classes = useStyles()
  const [replyCounter, setReplyCounter] = useState(0)
  const [repliesState, setRepliesState] = useState(replies)
  const history = useHistory()
  const [overhead, setOverhead] = useState(0)

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

        const iterableState = [...repliesState]
        const first = iterableState[firstIndex]

        const prefix = 'first'
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

        // clear appended reply
        clearAppendReply()

        const combine = `${prefix}${rep}`
        // eslint-disable-next-line
        eval(combine)

        iterableState[firstIndex] = first
        setRepliesState(iterableState)
        broadcastNotification('success', `Succesfully replied to @${root_author}/${root_permlink}`)
      }
    }
  // eslint-disable-next-line
  }, [append])

  const RenderReplies = ({ reply, treeHistory }) => {
    const {
      author,
      created,
      permlink,
      parent_author,
      active_votes,
      children: replyCount,
      meta,
      payout_at,
    } = reply

    let { body } = reply

    let { payout } = reply

    body = truncateBody(body)

    const [content, setContent] = useState(body)
    const [isCensored, setIsCensored] = useState(false)
    const [censorType, setCensorType] = useState(null)

    if(payout === 0) {
      payout = '0.00'
    }

    const { username, is_authenticated } = user

    let { replies } = reply
    replies = replies.filter((reply) => !mutelist.includes(reply.author))

    let hasUpvoted = false

    let authorLink = `/@${author}`

    if(is_authenticated) {
      hasUpvoted = active_votes.filter((vote) => vote.voter === username).length !== 0
    } else {
      authorLink = `/ug${authorLink}`
    }

    const popoverAnchor = useRef(null)

    const generateLink = (author, permlink) =>  {
      let link = ''
      if(!is_authenticated) {
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
      if(!`${href}`.includes('ref=replies')){
        if(href && !href.includes(hostname)) {
          window.open(href, '_blank')
        } else {
          if(!href) {
            setPageFrom(null)
            history.push(generateLink(author, permlink))
          } else {
            const split = `${href}`.split('#')

            if(split.length === 2) {
              href = `${split[1]}`
            }else{
              const split = `${href}`.split('/')
              href = split[3] ? `/${split[3]}` : '/'
            }
            if(href !== '' && href !== undefined){
              history.push(href)
            }
          }
        }
      }
    }

    const isAuthor = () => {
      return user.username && user.username === author
    }

    const applyCensor = () => {
      const contentCopy = censorLinks(content)
      setContent(contentCopy)
    }

    const censorCallBack = () => () => {
      applyCensor()
    }

    const handleClickCensorDialog = () => {
      openCensorshipDialog(author, permlink, censorCallBack)
    }

    useEffect(() => {
      const overhead = calculateOverhead(reply.body)
      setOverhead(overhead)
    }, [reply.body])

    useEffect(() => {
      if(censorList.length !== 0 && author && permlink) {
        const result = censorList.filter((item) => `${item.author}/${item.permlink}` === `${author}/${permlink}`)

        if(result.length !== 0) {
          setIsCensored(true)
          applyCensor()
          setCensorType(result[0].type)
        }
      }
      // eslint-disable-next-line
    }, [censorList, author, permlink])

    return (
      <React.Fragment>
        <div className={classes.row}>
          <div className={classes.inner}>
            <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
              <Col xs="auto" style={{ paddingRight: 0 }} onClick={handleOpenContent}>
                <div className={classes.left}>
                  <Avatar author={author} />
                  {/* {replies.length !== 0 && (
                    <div className={classes.thread} />
                  )} */}
                </div>
              </Col>
              <Col>
                <div className={classes.right}>
                  <div className={classes.content}>
                    <Link
                      ref={popoverAnchor}
                      to={`${authorLink}?ref=replies`}
                      className={classNames(classes.link, classes.name)}
                    >
                      {author}
                    </Link>
                    <label className={classes.username}>
                      &nbsp;&bull;&nbsp;
                      {moment(`${created}Z`).local().fromNow()}
                    </label>
                    {!isAuthor() && !isCensored && user.username === 'dbuzz' && !user.useKeychain && (
                      <IconButton onClick={handleClickCensorDialog} className={classes.muteButton} size='small'>
                        <MuteIcon  className={classes.muteIcon} />
                      </IconButton>
                    )}
                    <p className={classes.note}>Replying to <a href={`/@${parent_author}`} className={classes.username}>{`@${parent_author}`}</a></p>
                    {isCensored && (
                      <Chip label={censorType} color="secondary" size="small" className={classes.chip} />
                    )}
                    <div onClick={handleOpenContent}>
                      <MarkdownViewer minifyAssets={false} content={content} />
                      {`${stripHtml(reply.body)}`.length - overhead > 280 && (
                        <div className={classes.context}>
                          <div className={classes.contextWrapper}>
                            <h6 style={{ paddingTop: 5 }}>Reply is truncated because it is over 280 characters</h6>
                            <a target="_blank" without="true" rel="noopener noreferrer" href={`https://blog.d.buzz/#/@${author}/c/${permlink}`}>View the full reply</a>
                          </div>
                        </div>
                      )}
                      <PostTags meta={meta} />
                    </div>
                  </div>
                  <div className={classes.actionWrapper}>
                    <PostActions
                      treeHistory={treeHistory}
                      body={content}
                      hasUpvoted={hasUpvoted}
                      author={author}
                      permlink={permlink}
                      voteCount={active_votes.length}
                      replyCount={replyCount}
                      payout={payout}
                      payoutAt={payout_at}
                      replyRef="replies"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        {replies.length !== 0 && (
          // <React.Fragment>
          //   {replies.map((reply, index) => (
          //     <RenderReplies key={index} reply={reply} treeHistory={`${treeHistory}|${index}`}/>
          //   ))}
          // </React.Fragment>
          <div className={classes.seeMoreRepliesButton} onClick={handleOpenContent}>
            <span>view more replies on this...</span>
          </div>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {(expectedCount !== replyCounter) && (
        <center>
          <p className={classes.hideNote}>
            Some replies may not appear because it exceeds 280 characters
          </p>
        </center>
      )}
      {repliesState.slice(0).reverse().map((reply, index) => (
        <div key={index} className={classes.wrapper}>
          <RenderReplies reply={reply} treeHistory={index} />
        </div>
      ))}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  append: state.posts.get('appendReply'),
  mutelist: state.auth.get('mutelist'),
  censorList: state.auth.get('censorList'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearAppendReply,
    setPageFrom,
    broadcastNotification,
    openCensorshipDialog,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyList)
