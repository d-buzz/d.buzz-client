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
import { openCensorshipDialog, setLinkConfirmationModal, setViewImageModal } from 'store/interface/actions'
import {
  LitePostActions,
  LiteReplyList,
  UserDialog,
} from 'components'
import { bindActionCreators } from 'redux'
import { anchorTop, calculateOverhead, invokeTwitterIntent, sendToBerries } from 'services/helper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
import { checkForCeramicAccount, getIpfsLink } from 'services/ceramic'
import ViewImageModal from 'components/modals/ViewImageModal'
import LinkConfirmationModal from 'components/modals/LinkConfirmationModal'
import { Helmet } from 'react-helmet'
import DeleteBuzzModal from 'components/modals/DeleteBuzzModal'
import { SINGLE_POST_QUERY } from 'services/union'
import { useQuery } from '@apollo/client'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    width: '95%',
    margin: '0 auto',
    marginTop: 0,
    borderBottom: theme.border.primary,
    '& img': {
      // borderRadius: '15px 15px',
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
    background: '#515151 !important',
    color: '#838383 !important',
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

const LiteContent = (props) => {
  const {
    match,
    clearReplies,
    user = {},
    checkHasUpdateAuthorityRequest,
    openCensorshipDialog,
    censorList = [],
    clearAppendReply,
    viewImageModal,
    setViewImageModal,
    linkConfirmationModal,
    setLinkConfirmationModal,
  } = props

  const { username, permlink } = match.params
  const [anchorEl, setAnchorEl] = useState(null)
  const [originalContent, setOriginalContent] = useState('')
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  const [hasUpdateAuthority, setHasUpdateAuthority] = useState(false)
  const [isCensored, setIsCensored] = useState(false)
  // eslint-disable-next-line
  const [censorType, setCensorType] = useState(null)
  const [openVoteList, setOpenVoteList] = useState(false)
  const popoverAnchor = useRef(null)
  const history = useHistory()
  const [contentLength, setContentLength] = useState(0)
  const [overhead, setOverhead] = useState(0)
  const [invalidBuzz, setInvalidBuzz] = useState(false)
  const [addToPocketModal, setAddToPocketModal] = useState(false)
  const [selectedAddToPocketBuzz, setSelectedAddToPocketBuzz] = useState(null)
  const [deleteBuzzModal, setDeleteBuzzModal] = useState(false)

  const [postType, setPostType] = useState(undefined)

  const [content, setContent] = useState({})

  const { loading: loadingContent, data: contentData=[] } = useQuery(SINGLE_POST_QUERY, {
    variables: { permalink: permlink, author: username },
  })

  useEffect(() => {

    if(!loadingContent) {
      setPostType(contentData.socialPost?.__typename)
      setContent(contentData.socialPost)

      console.log(contentData.socialPost)
    }

  }, [loadingContent, contentData])

  const {
    author,
    json_metadata,
    created_at: created,
    children: replies = [],
    active_votes,
    profile = {},
    cashout_time,
    depth,
    root_author,
    root_title,
    root_permlink,
    parent_author = null,
    parent_permlink,
    hive_rewards,
    stats,
  } = content || ''

  // useEffect(() => {
  //   console.log(content)
  // }, [content])

  let { body } = content || ''
  const { title } = content || ''
  body = truncateBody(body || '')

  body = body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '').replace('<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>', '')

  let {  max_accepted_payout } = content || '0.00'

  // eslint-disable-next-line
  max_accepted_payout = `${max_accepted_payout}`.replace('HBD', '')

  let meta = {}
  let app = null
  let upvotes = stats?.num_votes || 0
  let payout = hive_rewards?.payout || 0
  let payout_at = hive_rewards?.payoutAt || 0
  let hasUpvoted

  // eslint-disable-next-line
  const [ceramicUser, setCeramicUser] = useState(false)
  const [ceramicPost, setCeramicPost] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if(author?.profile) {
      setAvatarUrl(getIpfsLink(author?.profile?.images?.avatar))
    }
  }, [author])

  useEffect(() => {
    if(title?.endsWith('...') && content && body) {
      // replace ... from title and body and merge them
      // eslint-disable-next-line
      body = title.replace(/\s\.\.\./, '') + body.replace(/\.\.\.\s/, '')
    }
  }, [content, title, body])

  useEffect(() => {
    // if(checkForCeramicAccount(username)) {
    //   setCeramicUser(true)
    // }
  }, [username])

  useEffect(() => {
    if(postType === "CeramicPost") {
      setCeramicPost(true)
    }
    // eslint-disable-next-line
  }, [content])

  useEffect(() => {
    const overhead = calculateOverhead(content?.body)
    setOverhead(overhead)

    // check for invalid buzz
    if(!content?.body && !loadingContent){
      setInvalidBuzz(true)
    } else {
      setInvalidBuzz(false)
    }
    // eslint-disable-next-line
  }, [content])

  useEffect(() => {
    if(overhead && content.body) {
      setContentLength(stripHtml(content.body).length - overhead)
    }
  }, [content, overhead])

  useEffect(() => {
    checkHasUpdateAuthorityRequest(username)
      .then((result) => {
        setHasUpdateAuthority(author === user.username)
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

  if(!cashout_time && content?.payday) {
    const { payout_at: payday } = content
    payout_at = payday
  }

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
        // eslint-disable-next-line
        hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
      }
    }
  }

  useEffect(() => {
    anchorTop()
    clearReplies()
    clearAppendReply()
      
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
    link = `${link}/${permlink}`

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

  // eslint-disable-next-line
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

  // const RenderUpvoteList = () => {
  //   let list = active_votes || []

  //   if(active_votes.length > 15) {
  //     list = list.slice(0, 14)
  //     list.push({ voter: `and ${active_votes.length - 15} more ...`})
  //   }

  //   return (
  //     <React.Fragment>
  //       {list.map(({ voter }) => (
  //         <React.Fragment>
  //           <span className={classes.votelist}>{voter}</span><br />
  //         </React.Fragment>
  //       ))}
  //     </React.Fragment>
  //   )
  // }

  // const handleClickOpenVoteList = () => {
  //   setOpenVoteList(true)
  // }

  const handleClickOnCloseVoteList = () => {
    setOpenVoteList(false)
  }

  // const handleAddToPocket = () => {
  //   setAddToPocketModal(true)
  //   setAnchorEl(null)
  //   setSelectedAddToPocketBuzz(content)
  // }
  
  const onHideAddToPocketModal = () => {
    setAddToPocketModal(false)
    setSelectedAddToPocketBuzz(null)
  }

  const handleClickDeleteBuzz = () => {
    setAnchorEl(null)
    setDeleteBuzzModal(true)
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:title" content={body.split('\n')[0]} />
        <meta property="og:description" content={body} />
        <meta property="og:image" content={body?.match(/(\[\S+)|(\(\S+)|(https?:\/\/.*\.(?:png|jpg|gif|jpeg|webp|bmp))/gi)?.[0]} />
      </Helmet>
      {!loadingContent && author && (
        <React.Fragment>
          <HelmetGenerator content={!ceramicPost ? title?.split('\n')[0] : title} user={author} />
          <div className={classes.wrapper}>
            <br />
            <React.Fragment>
              {depth && depth !== 0 && parent_author !== "" && !(contentLength > 280) && (
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
                  <Avatar  avatarUrl={avatarUrl} />
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
                        {!ceramicPost ? author?.profile?.username : (author?.profile?.name || author?.profile?.did)}
                      </p>
                    </Link>

                    <br />
                    <p className={classes.username}>
                      {!created?.endsWith('Z') ? moment(`${created}Z`).local().fromNow() : moment(created).local().fromNow()}
                    </p>
                  </div>
                </Col>
                {is_authenticated && !checkForCeramicAccount(user.username) && (
                  <IconButton className={classes.iconButton} style={{float: 'right', width: 'fit-content', height: 'fit-content', marginRight: 25}} onClick={handleClickMore} size='small'>
                    <MoreHoriz className={classes.moreIcon} />
                  </IconButton>
                )}
              </Row>
              <div onClick={handleClickContent}>
                <Renderer content={originalContent} minifyAssets={false} />
                {isCensored && (
                  <Chip label={'#NSFW'} color="#2b2b2b" size="small" className={classes.chip} />
                )}
              </div>
              {/* <PostTags meta={meta} /> */}
              {(contentLength > 280) && (
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
                  {!created?.endsWith('Z') ? moment(`${created}Z`).local().format('h:mm A • \nLL') : moment(created).local().format('h:mm A • \nLL')}
                  {app && <React.Fragment> • Posted using <b className={classes.strong}>{app}</b></React.Fragment>}
                </label>
              </div>
            </React.Fragment>
          </div>
          <div className={classes.wrapper}>
            <Row>
              <Col>
                <label 
                  className={classes.meta}
                  // onClick={handleClickOpenVoteList}
                >
                  <b className={classes.strong}>{upvotes}</b> Upvotes
                </label>
                <label className={classes.meta}><b className={classes.strong}>{replies?.length}</b> Replies</label>
              </Col>
            </Row>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={hanldeCloseMore}
              className={classes.menu}
            >
              {/* {!hasUpdateAuthority && (
                <React.Fragment>
                  {!checkForCeramicAccount(user.username) && <MenuItem target='_blank' className={classes.menuText} onClick={handleAddToPocket}>Add to a Pocket</MenuItem>}
                  {!checkForCeramicAccount(user.username) && <MenuItem onClick={handleTipClick} target='_blank' className={classes.menuText}>Tip</MenuItem>}
                </React.Fragment>
              )} */}
              {!isAuthor() && user.username === 'dbuzz' && !user.useKeychain && !isCensored && (<MenuItem onClick={handleClickCensorDialog} className={classes.menuText}>Censor Buzz</MenuItem>)}
              {hasUpdateAuthority && (
                <React.Fragment>
                  {/* {!checkForCeramicAccount(user.username) && <MenuItem target='_blank' className={classes.menuText} onClick={handleAddToPocket}>Add to a Pocket</MenuItem>} */}
                  <MenuItem onClick={handleClickOpenUpdateForm}>Edit</MenuItem>
                  {!ceramicPost && active_votes?.length===0 && replies?.length===0 &&
                    <MenuItem
                      style={{ backgroundColor: '#E61C34' }}
                      onClick={handleClickDeleteBuzz}
                    >
                      <span className='delete-buzz-button'>
                        Delete
                      </span>
                    </MenuItem>}
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
                  <LitePostActions
                    disableExtraPadding={true}
                    title={title}
                    body={body}
                    author={username}
                    permlink={permlink}
                    hideStats={true}
                    replyCount={replies?.length}
                    replyRef="content"
                    payout={`${payout}`}
                    payoutAt={payout_at}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </React.Fragment>
      )}
      {!loadingContent &&  (
        <LiteReplyList replies={replies} expectedCount={replies?.length} postType={postType} />
      )}
      <ContentSkeleton loading={loadingContent} />
      {replies?.length !== 0 && (
        <ReplylistSkeleton loading={loadingContent} />
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

      {invalidBuzz && !loadingContent && 
        <div className={classes.invalidBuzz}>
          <ReportProblemRoundedIcon className='errorIcon' />
          <span className='errorTitle'>Hmm...this page doesn’t exist.</span>
          <span className='errorHint'>Try searching for something else.</span>
        </div>}
      <AddToPocketModal show={addToPocketModal} onHide={onHideAddToPocketModal} user={user} author={author} buzz={selectedAddToPocketBuzz}/>
      <ViewImageModal show={viewImageModal?.selectedImage} value={viewImageModal} onHide={() => setViewImageModal({selectedImage: '', images: []})}/>
      <LinkConfirmationModal link={linkConfirmationModal} onHide={setLinkConfirmationModal} />
      <DeleteBuzzModal show={deleteBuzzModal} onHide={setDeleteBuzzModal} buzzId={`@${username}/${permlink}`} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  censorList: state.auth.get('censorList'),
  viewImageModal: state.interfaces.get('viewImageModal'),
  linkConfirmationModal: state.interfaces.get('linkConfirmationModal'),
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
    setLinkConfirmationModal,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LiteContent)
