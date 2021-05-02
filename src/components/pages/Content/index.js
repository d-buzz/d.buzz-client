import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import {
  getContentRequest,
  getRepliesRequest,
  clearReplies,
  clearAppendReply,
} from 'store/posts/actions'
import {
  checkHasUpdateAuthorityRequest,
} from 'store/auth/actions'
import { createUseStyles } from 'react-jss'
import { Avatar, MoreIcon } from 'components/elements'
import { openCensorshipDialog } from 'store/interface/actions'
import {
  MarkdownViewer,
  PostTags,
  PostActions,
  ReplyList,
  UserDialog,
} from 'components'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { anchorTop, calculatePayout, invokeTwitterIntent, sendToBerries } from 'services/helper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import stripHtml from 'string-strip-html'
import {
  ContentSkeleton,
  ReplylistSkeleton,
  HelmetGenerator,
  UpdateFormModal,
  VoteListDialog,
} from 'components'
import Chip from '@material-ui/core/Chip'
import { useHistory } from 'react-router-dom'
import { truncateBody, censorLinks } from 'services/helper'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    width: '95%',
    margin: '0 auto',
    marginTop: 0,
    borderBottom: theme.border.primary,
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
    borderBottom: theme.border.primary,
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
    ...theme.font,
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
    ...theme.font,
  },
  link: {
    color: 'black',
    fontSize: 14,
    '&:hover': {
      color: 'black',
    },
  },
  context: {
    minHeight: 120,
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
  threeDotWrapper: {
    height: '100%',
    width: 'auto',
  },
  icon: {
    ...theme.icon,
    ...theme.font,
  },
  iconCursor: {
    cursor: 'pointer',
  },
  iconButton: {
    ...theme.iconButton.hover,
  },
  chip: {
    marginTop: 5,
    marginBottom: 5,
  },
}))

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
    checkHasUpdateAuthorityRequest,
    openCensorshipDialog,
    censorList = [],
    clearAppendReply,
  } = props

  const { username, permlink } = match.params
  const [anchorEl, setAnchorEl] = useState(null)
  const [originalContent, setOriginalContent] = useState('')
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  const [hasUpdateAuthority, setHasUpdateAuthority] = useState(false)
  const [isCensored, setIsCensored] = useState(false)
  const [censorType, setCensorType] = useState(null)
  const [openVoteList, setOpenVoteList] = useState(false)
  const popoverAnchor = useRef(null)
  const history = useHistory()


  const {
    author,
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
    parent_author = null,
    parent_permlink,
  } = content || ''


  let { body } = content || ''
  body = truncateBody(body || '')

  let {  max_accepted_payout } = content || '0.00'

  max_accepted_payout = `${max_accepted_payout}`.replace('HBD', '')

  let meta = {}
  let app = null
  let upvotes = 0
  let hasUpvoted = false
  let payout_at = cashout_time

  useEffect(() => {
    checkHasUpdateAuthorityRequest(username)
      .then((result) => {
        setHasUpdateAuthority(result)
      })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(censorList.length !== 0 && username && permlink) {
      const result = censorList.filter((item) => `${item.author}/${item.permlink}` === `${username}/${permlink}`)
      if(result.length !== 0) {
        setIsCensored(true)
        setCensorType(result[0].type)
      }
    }
  }, [censorList, username, permlink])

  useEffect(() => {
    if(body !== '' && body) {
      setOriginalContent(body)
    }
  }, [body])

  const handleClickCloseUpdateForm = () => {
    setOpenUpdateForm(false)
  }

  const handleClickOpenUpdateForm = () => {
    setAnchorEl(null)
    setOpenUpdateForm(true)
  }

  const handleClickMore = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const hanldeCloseMore = () => {
    setAnchorEl(null)
  }

  const onUpdateSuccess = (body) => {
    setOriginalContent(body)
  }

  if(!cashout_time) {
    const { payout_at: payday } = content
    payout_at = payday
  }

  let payout = calculatePayout(content)

  if(isNaN(payout)) {
    const { payout: pay } = content
    payout = pay
  }

  const { is_authenticated } = user


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

    if(app === 'dBuzz') {
      app = 'D.Buzz'
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
    clearAppendReply()
    getContentRequest(username, permlink)
      .then(({ children }) => {
        if(children !== 0) {
          getRepliesRequest(username, permlink)
        }
      })
  // eslint-disable-next-line
  }, [permlink])


  const generateAuthorLink = () => {
    const link = `/@${author}`
    return link
  }

  const openPopOver = (e) => {
    setOpen(true)
  }

  const closePopOver = (e) => {
    setOpen(false)
  }

  const generateParentLinks = (author, permlink) => {
    let link = `/@${author}`
    link = `${link}/c/${permlink}`

    return link
  }

  const openTweetBox = () => {
    setAnchorEl(null)
    invokeTwitterIntent(body)
  }

  const handleClickContent = (e) => {
    try {
      const { target } = e
      let { href } = target
      const hostname = window.location.hostname

      e.preventDefault()
      if(href && !href.includes(hostname)) {
        window.open(href, '_blank')
      } else if( href !== undefined) {
        
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
    } catch (e) {}
  }

  const handleTipClick = () => {
    sendToBerries(author)
  }

  const censorCallBack = () => () => {
    const contentCopy = censorLinks(originalContent)
    setOriginalContent(contentCopy)
    setIsCensored(true)
  }

  const handleClickCensorDialog = () => {
    openCensorshipDialog(author, permlink, censorCallBack)
    setAnchorEl(null)
  }

  const isAuthor = () => {
    return user.username && user.username === author
  }

  const RenderUpvoteList = () => {
    let list = active_votes

    if(active_votes.length > 15) {
      list = list.slice(0, 14)
      list.push({ voter: `and ${active_votes.length - 15} more ...`})
    }

    return (
      <React.Fragment>
        {list.map(({ voter }) => (
          <React.Fragment>
            <span className={classes.votelist}>{voter}</span><br />
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }

  const handleClickOpenVoteList = () => {
    setOpenVoteList(true)
  }

  const handleClickOnCloseVoteList = () => {
    setOpenVoteList(false)
  }

  return (
    <React.Fragment>
      {!loadingContent && author && (
        <React.Fragment>
          <HelmetGenerator content={body} user={author} />
          <div className={classes.wrapper}>
            <br />
            <React.Fragment>
              {depth !== 0 && parent_author !== null && !(body.length > 280) && (
                <Row>
                  <Col>
                    <div className={classes.context}>
                      <div className={classes.contextWrapper}>
                        <h6 style={{ paddingTop: 5 }}>You are viewing a single comment's thread from:</h6>
                        <h5>RE: {root_title}</h5>
                        <ul>
                          <li><Link to={generateParentLinks(root_author, root_permlink)}>View the full context</Link></li>
                          <li><Link to={generateParentLinks(parent_author, parent_permlink)}>View the direct parent</Link></li>
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
                <Col style={{ paddingLeft: 10 }}>
                  <div style={{ marginTop: 2 }}>
                    <Link
                      ref={popoverAnchor}
                      to={generateAuthorLink}
                      className={classes.link}
                      onMouseEnter={openPopOver}
                      onMouseLeave={closePopOver}
                    >
                      <p className={classes.name}>
                        {author}
                      </p>
                    </Link>

                    <br />
                    <p className={classes.username}>
                      {moment(`${created}Z`).local().fromNow()}
                    </p>
                  </div>
                </Col>
              </Row>
              <div onClick={handleClickContent}>
                {isCensored && (
                  <Chip label={censorType} color="secondary" size="small" className={classes.chip} />
                )}
                <MarkdownViewer content={originalContent} minifyAssets={false} />
              </div>
              <PostTags meta={meta} />
              {(`${stripHtml(body)}`.length > 280) && (
                <Row>
                  <Col>
                    <div className={classes.context}>
                      <div className={classes.contextWrapper}>
                        <h6 style={{ paddingTop: 5 }}>Content is truncated because it is over 280 characters</h6>
                        <br />
                        <ul>
                          <li>
                            <a target="_blank" without rel="noopener noreferrer" href={`https://hive.blog/@${author}/${permlink}`}>
                              <h6>View the full content</h6>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
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
                <Tooltip arrow title={<RenderUpvoteList />} placement='top'>
                  <label 
                    className={classes.meta}
                    onClick={handleClickOpenVoteList}
                  >
                    <b className={classes.strong}>{upvotes}</b> Upvotes
                  </label>
                </Tooltip>
                <label className={classes.meta}><b className={classes.strong}>{replyCount}</b> Replies</label>
              </Col>
              {is_authenticated && (
                <Col xs="auto">
                  <div className={classNames(classes.threeDotWrapper, classes.icon)} onClick={handleClickMore}>
                    <MoreIcon className={classes.iconCursor} />
                  </div>
                </Col>
              )}
            </Row>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={hanldeCloseMore}
            >
              {!hasUpdateAuthority && (<MenuItem onClick={handleTipClick} target='_blank' className={classes.menuText}>Tip</MenuItem>)}
              {!isAuthor() && user.username === 'dbuzz' && !user.useKeychain && !isCensored && (<MenuItem onClick={handleClickCensorDialog} className={classes.menuText}>Censor Buzz</MenuItem>)}
              {hasUpdateAuthority && (
                <React.Fragment>
                  <MenuItem onClick={handleClickOpenUpdateForm}>Edit</MenuItem>
                  <MenuItem onClick={openTweetBox}>Buzz to Twitter</MenuItem>
                </React.Fragment>
              )}
            </Menu>
            {hasUpdateAuthority && (
              <UpdateFormModal onSuccess={onUpdateSuccess} author={author} permlink={permlink} body={originalContent} open={openUpdateForm} onClose={handleClickCloseUpdateForm} />
            )}
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
                    max_accepted_payout={max_accepted_payout}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </React.Fragment>
      )}
      {!loadingReplies && !loadingContent &&  (
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
      <VoteListDialog 
        open={openVoteList}
        onClose={handleClickOnCloseVoteList}
        upvoteList={active_votes || []}
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
  censorList: state.auth.get('censorList'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getContentRequest,
    getRepliesRequest,
    clearReplies,
    checkHasUpdateAuthorityRequest,
    openCensorshipDialog,
    clearAppendReply,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
