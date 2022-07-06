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
import { Avatar } from 'components/elements'
import { openCensorshipDialog, setViewImageModal } from 'store/interface/actions'
import {
  PostTags,
  PostActions,
  ReplyList,
  UserDialog,
} from 'components'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { anchorTop, calculateOverhead, calculatePayout, invokeTwitterIntent, sendToBerries } from 'services/helper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { stripHtml } from 'services/helper'
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
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded'
import Renderer from 'components/common/Renderer'
import { IconButton } from '@material-ui/core'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import AddToPocketModal from 'components/modals/AddToPocketModal'
import { checkForCeramicAccount } from 'services/ceramic'
import ViewImageModal from 'components/modals/ViewImageModal'

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
  menuText: {
    fontSize: 13,
  },
  threeDotWrapper: {
    height: '100%',
    width: 'auto',
  },
  icon: {
    ...theme.icon,
    ...theme.font,
  },
  moreIcon: {
    ...theme.font,
    '&:hover': {
      color: '#E61C34 !important',
    },
  },
  iconCursor: {
    cursor: 'pointer',
  },
  iconButton: {
    ...theme.iconButton.hover,
    transition: 'all 250ms',
    '&:hover': {
      background: 'rgba(230, 28, 52, 0.05) !important',
    },
  },
  chip: {
    marginTop: 5,
    marginBottom: 5,
  },
  invalidBuzz: {
    display: 'flex',
    width: '100%',
    height: '80vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E61C34',
    fontWeight: 600,
    fontSize: '1.2em',
    gap: 20,

    '& .errorHint': {
      fontSize:'0.8em',
      opacity: 0.8,
      fontWeight: 400,
    },

    '@media (max-width: 480px)': {
      textAlign: 'center',

      '& .errorIcon': {
        fontSize: '8em !important',
      },
    },

    '& .errorIcon': {
      fontSize: '8em !important',
    },
  },
  menu: {
    '& .MuiPaper-root': {
      background: theme.background.primary,
    },
    '& ul':{
      background: theme.background.primary,
    },
    '& li': {
      fontSize: 18,
      fontWeight: '500 !important',
      background: theme.background.primary,
      color: theme.font.color,

      '&:hover': {
        ...theme.context.view,
      },
    },
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
    viewImageModal,
    setViewImageModal,
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
  const [overhead, setOverhead] = useState(0)
  const [invalidBuzz, setInvalidBuzz] = useState(false)
  const [addToPocketModal, setAddToPocketModal] = useState(false)
  const [selectedAddToPocketBuzz, setSelectedAddToPocketBuzz] = useState(null)


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
    ceramicProfile,
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

  const [ceramicUser, setCeramicUser] = useState(false)
  const [ceramicPost, setCeramicPost] = useState(false)

  useEffect(() => {
    if(checkForCeramicAccount(username)) {
      setCeramicUser(true)
    }
  }, [username])

  useEffect(() => {
    if(checkForCeramicAccount(author || '')) {
      setCeramicPost(true)
    }
  }, [author])

  useEffect(() => {
    const overhead = calculateOverhead(content.body)
    setOverhead(overhead)

    // check for invalid buzz
    if(!content.body && !loadingContent && !loadingReplies){
      setInvalidBuzz(true)
    } else {
      setInvalidBuzz(false)
    }
    // eslint-disable-next-line
  }, [content.body])

  useEffect(() => {
    checkHasUpdateAuthorityRequest(username)
      .then((result) => {
        setHasUpdateAuthority(result)
      })
    // eslint-disable-next-line
  }, [author])

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
    sendToBerries(author, '')
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

  const handleAddToPocket = () => {
    setAddToPocketModal(true)
    setAnchorEl(null)
    setSelectedAddToPocketBuzz(content)
  }
  
  const onHideAddToPocketModal = () => {
    setAddToPocketModal(false)
    setSelectedAddToPocketBuzz(null)
  }

  return (
    <React.Fragment>
      {!loadingContent && author && (
        <React.Fragment>
          <HelmetGenerator content={body.split('\n')[0]} user={author} />
          <div className={classes.wrapper}>
            <br />
            <React.Fragment>
              {depth !== 0 && parent_author !== null && !(content.body.length - overhead > 280) && (
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
                  <Avatar author={author} avatarUrl={ceramicPost ? `https://ipfs.io/ipfs/${ceramicProfile.images?.avatar.replace('ipfs://', '')}` : ''} />
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
                        {!ceramicPost ? author : (ceramicProfile.name || 'Ceramic User')}
                      </p>
                    </Link>

                    <br />
                    <p className={classes.username}>
                      {!created.endsWith('Z') ? moment(`${created}Z`).local().fromNow() : moment(created).local().fromNow()}
                    </p>
                  </div>
                </Col>
                {is_authenticated && (
                  <IconButton className={classes.iconButton} style={{float: 'right', width: 'fit-content', height: 'fit-content', marginRight: 25}} onClick={handleClickMore} size='small'>
                    <MoreHoriz className={classes.moreIcon} />
                  </IconButton>
                )}
              </Row>
              <div onClick={handleClickContent}>
                {isCensored && (
                  <Chip label={censorType} color="secondary" size="small" className={classes.chip} />
                )}
                <Renderer content={originalContent} minifyAssets={false} />
              </div>
              <PostTags meta={meta} />
              {(`${stripHtml(content.body)}`.length - overhead > 280) && (
                <Row>
                  <Col>
                    <div className={classes.context}>
                      <div className={classes.contextWrapper}>
                        <h6 style={{ paddingTop: 5 }}>Content is truncated because it is over 280 characters</h6>
                        <br />
                        <ul>
                          <li>
                            <a target="_blank" without rel="noopener noreferrer" href={`https://blog.d.buzz/#/@${author}/c/${permlink}`}>
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
                  {!created.endsWith('Z') ? moment(`${created}Z`).local().format('LTS • \nLL') : moment(created).local().format('LTS • \nLL')}
                  {app && <React.Fragment> • Posted using <b className={classes.strong}>{app}</b></React.Fragment>}
                </label>
              </div>
            </React.Fragment>
          </div>
          <div className={classes.wrapper}>
            <Row>
              <Col>
                {!ceramicUser && <Tooltip arrow title={<RenderUpvoteList />} placement='top'>
                  <label 
                    className={classes.meta}
                    onClick={handleClickOpenVoteList}
                  >
                    <b className={classes.strong}>{upvotes}</b> Upvotes
                  </label>
                </Tooltip>}
                <label className={classes.meta}><b className={classes.strong}>{replyCount}</b> Replies</label>
              </Col>
            </Row>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={hanldeCloseMore}
              className={classes.menu}
            >
              {!hasUpdateAuthority && (
                <React.Fragment>
                  <MenuItem target='_blank' className={classes.menuText} onClick={handleAddToPocket}>Add to a Pocket</MenuItem>
                  <MenuItem onClick={handleTipClick} target='_blank' className={classes.menuText}>Tip</MenuItem>
                </React.Fragment>
              )}
              {!isAuthor() && user.username === 'dbuzz' && !user.useKeychain && !isCensored && (<MenuItem onClick={handleClickCensorDialog} className={classes.menuText}>Censor Buzz</MenuItem>)}
              {hasUpdateAuthority && (
                <React.Fragment>
                  <MenuItem target='_blank' className={classes.menuText} onClick={handleAddToPocket}>Add to a Pocket</MenuItem>
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

      {invalidBuzz && !loadingContent && !loadingReplies && 
        <div className={classes.invalidBuzz}>
          <ReportProblemRoundedIcon className='errorIcon' />
          <span className='errorTitle'>Hmm...this page doesn’t exist.</span>
          <span className='errorHint'>Try searching for something else.</span>
        </div>}
      <AddToPocketModal show={addToPocketModal} onHide={onHideAddToPocketModal} user={user} author={author} buzz={selectedAddToPocketBuzz}/>
      <ViewImageModal show={viewImageModal} imageUrl={viewImageModal} onHide={() => setViewImageModal(null)}/>
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
  viewImageModal: state.interfaces.get('viewImageModal'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getContentRequest,
    getRepliesRequest,
    clearReplies,
    checkHasUpdateAuthorityRequest,
    openCensorshipDialog,
    clearAppendReply,
    setViewImageModal,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
