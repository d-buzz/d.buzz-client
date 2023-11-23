import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  // PostTags,
  LoginModal,
  PostActions,
} from 'components'
import {
  openUserDialog,
  saveScrollIndex,
  openMuteDialog,
  openHideBuzzDialog,
  openCensorshipDialog,
} from 'store/interface/actions'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useWindowDimensions } from 'services/helper'
import { setPageFrom } from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { isMobile } from 'react-device-detect'
import classNames from 'classnames'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Chip from '@material-ui/core/Chip'
import { sendToBerries, censorLinks } from 'services/helper'
import Renderer from 'components/common/Renderer'
import AddToPocketModal from 'components/modals/AddToPocketModal'
import { getUserCustomData } from 'services/database/api'
import RemoveFromPocketConfirmModal from 'components/modals/RemoveFromPocketConfirmModal'

const addHover = (theme) => {
  let style = {
    '&:hover': {
      ...theme.postList.hover,
    },
  }

  if(isMobile) {
    style = {}
  }

  return style
}

const useStyle = createUseStyles(theme => ({
  icon: {
    ...theme.icon,
    fontSize: 11,
    float: 'right',
    display: 'inline-block',
  },
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  title: {
    ...theme.font,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: theme.border.primary,
    '& a': {
      color: 'black',
    },
    ...addHover(theme),
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
  },
  right: {
    height: 'max-content',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
    fontSize: 14,
    '& a': {
      color: theme.font.color,
    },
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
      // borderRadius: '15px 15px',
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
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    },
  },
  paper: {
    pointerEvents: "auto",
    padding: 2,
    '& :after': {
      border: '1px solid red',
    },
  },
  button: {
    width: 85,
    height: 35,
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  spanName: {
    ...theme.font,
  },
  colLeft: {
    paddingRight: 0,
  },
  colRight: {
    paddingLeft: 5,
  },
  iconButton: {
    ...theme.iconButton.hover,
    transition: 'all 250ms',
    '&:hover': {
      background: 'rgba(230, 28, 52, 0.05) !important',
    },
  },
  berries: {
    width: 120,
    marginTop: 10,
  },
  moreIcon: {
    ...theme.font,
    '&:hover': {
      color: '#E61C34 !important',
    },
  },
  menuText: {
    fontSize: 13,
  },
  muted: {
    opacity: 0.2,
  },
  chip: {
    background: '#515151 !important',
    color: '#838383 !important',
    marginTop: 5,
    marginBottom: 5,
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
  nsfw: {
    display: 'none',
  },
}))


const PostList = React.memo((props) => {
  const classes = useStyle()
  const {
    searchListMode = false,
    author,
    permlink,
    created,
    body,
    upvotes,
    replyCount,
    // meta,
    active_votes = [],
    unguardedLinks,
    user = {},
    profileRef = null,
    // highlightTag = null,
    title = null,
    disableProfileLink = false,
    disableUserMenu = false,
    // disableUpvote = false,
    openUserDialog,
    saveScrollIndex,
    scrollIndex,
    recomputeRowIndex = () => {},
    displayTitle,
    openMuteDialog,
    opacityUsers,
    disableOpacity,
    openHideBuzzDialog,
    hiddenBuzzes,
    openCensorshipDialog,
    censorList,
    theme,
    upvoteList,
    item,
    loadPockets,
    selectedPocket = {},
    onImageLoad,
  } = props

  let { payout = null, payoutAt = null } = props
  let { max_accepted_payout } = props

  if(max_accepted_payout) {
    max_accepted_payout = max_accepted_payout.replace('HBD', '')
  }

  if(!payoutAt) {
    const { cashout_time } = props
    payoutAt = cashout_time
  }

  if(!payout) {
    const { pending_payout_value, total_payout_value } = props

    if(total_payout_value) {
      payout = total_payout_value
    }

    if(pending_payout_value > total_payout_value) {
      payout = pending_payout_value
    }

    payout = `${payout}`.replace('HBD', '')

    if(!payout) {
      payout = '0.00'
    }
  }

  const { width } = useWindowDimensions()

  const [rightWidth, setRightWidth] = useState({ width: isMobile ? width-90 : 480 })
  const [avatarSize, setAvatarSize] = useState(isMobile ? 45 : 50)
  const [leftWidth, setLeftWidth] = useState({ width: isMobile ? 50 : 60 })
  const [delayHandler, setDelayHandler] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [muted, setMuted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [content, setContent] = useState(body)
  const [isCensored, setIsCensored] = useState(false)
  // eslint-disable-next-line
  const [censorType, setCensorType] = useState(null)
  const popoverAnchor = useRef(null)
  const [addToPocketModal, setAddToPocketModal] = useState(false)
  const [removeFromPocketConfirmModal, setRemoveFromPocketConfirmModal] = useState(false)
  const [selectedAddToPocketBuzz, setSelectedAddToPocketBuzz] = useState(null)
  const [seletedRemoveFromPocketBuzz, setSeletedRemoveFromPocketBuzz] = useState(null)
  const [pockets, setPockets] = useState([])
  const [openLoginModal, setOpenLoginModal] = useState(false)

  const buzzRowRef = useRef(null)

  useEffect(() => {
    if(title) {
      if(title?.endsWith('...') && content && body) {
        // replace ... from title and body and merge them
        setContent(title.replace(/\s\.\.\./, '') + body.replace(/\.\.\.\s/, ''))
      }
    }
  }, [title, content, body])

  useEffect(() => {
    if(anchorEl !== null) {
      getUserCustomData(user.username)
        .then(res => {
          if(res[0].pockets) {
            setPockets([...res[0].pockets])
          } else {
            setPockets([])
          }
        })
    }
    // eslint-disable-next-line
  }, [anchorEl])

  useEffect(() => {
    if(censorList.length !== 0 && author && permlink) {
      const result = censorList.filter((item) => `${item.author}/${item.permlink}` === `${author}/${permlink}`)

      if(result.length !== 0) {
        setIsCensored(true)
        setCensorType(result[0].type)
      }
    }
  }, [censorList, author, permlink])

  useEffect(() => {
    if(!isMobile) {
      if(width >= 676) {
        setAvatarSize(50)
        setLeftWidth({ width:60 })
        setRightWidth({ width:480 })
      } else {
        setLeftWidth({ width: 50 })
        setAvatarSize(45)
        if(!unguardedLinks) {
          setRightWidth({ width: width-200 })
        } else {
          setRightWidth({ width: width-120 })
        }
      }
    }
    // eslint-disable-next-line
  }, [width])

  let hasUpvoted = false
  const history = useHistory()
  const authorLink = !author.did ? `/@${author}${'?from='+profileRef}` : `/@${author.did}${'?from='+profileRef}`

  if(user.is_authenticated && !searchListMode) {
    hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
  } else {
    hasUpvoted = false
  }

  const generateLink = (author, permlink) =>  {
    let link = ''

    const username = author

    link += `/@${username}/${permlink}`

    return link
  }

  const handleOpenContent = (e) => {
    const { target } = e
    let { href } = target
    const hostname = window.location.hostname

    e.preventDefault()
    if(href && !href.includes(hostname)) {
      window.open(href, '_blank')
    } else {
      if(!href) {
        const link = generateLink(author, permlink)
        saveScrollIndex(scrollIndex)
        history.push(link)
      } else {
        const split = href.split('/')
        href = `/${split[3]}`
        history.push(href)
      }
    }
  }

  const openPopOver = (e) => {
    setDelayHandler(setTimeout(() => {
      openUserDialog(popoverAnchor.current, (author))
    }, 500))
  }

  const closePopOver = () => {
    clearTimeout(delayHandler)
  }

  const openMenu = (e) => {
    // if user is authenticated call open anchor el then return
    if (user.is_authenticated) {
      setAnchorEl(e.currentTarget)
      return
    }

    // if user is not authenticated call open modal then return
    setOpenLoginModal(true)
    return    
  }

  // hide login modal
  const hideLoginModal = () => {
    setOpenLoginModal(false)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const muteSuccessCallback = () => {
    setMuted(true)
    recomputeRowIndex(scrollIndex)
  }

  const hideBuzzSuccesCallback = () => {
    setHidden(true)
    recomputeRowIndex(scrollIndex)
  }

  const handleClickMuteDialog = () => {
    openMuteDialog(author, muteSuccessCallback)
    setAnchorEl(null)
  }

  const opacityActivated = opacityUsers.includes(author)

  const handleTipClick = () => {
    sendToBerries(author, theme)
  }

  const isAuthor = () => {
    return user.username && user.username === author
  }

  const handleClickHideBuzzDialog = () => {
    openHideBuzzDialog(author, permlink, hideBuzzSuccesCallback)
    setAnchorEl(null)
  }

  const censorCallBack = () => () => {
    const contentCopy = censorLinks(content)
    setContent(contentCopy)
    recomputeRowIndex(scrollIndex)
  }

  const handleClickCensorDialog = () => {
    openCensorshipDialog(author, permlink, censorCallBack)
    setAnchorEl(null)
  }

  const isAHiddenBuzz = () => {
    const list = hiddenBuzzes.filter( item => item.author === author && item.permlink === permlink )
    return list.length >= 1
  }

  const isNSFWAllowed = () => {
    const isNSFWEnabled = JSON.parse(localStorage.getItem('customUserData'))?.settings?.showNSFWPosts !== 'enabled'
    return isCensored && isNSFWEnabled
  }

  const isMutedUser = () => {
    return opacityUsers.includes(author)
  }

  const handleAddToPocket = () => {
    setAddToPocketModal(true)
    setAnchorEl(null)
    setSelectedAddToPocketBuzz(item)
  }
  
  const onHideAddToPocketModal = () => {
    setAddToPocketModal(false)
    setSelectedAddToPocketBuzz(null)
  }

  const onHideRemoveFromPocketConfirmModal = () => {
    setRemoveFromPocketConfirmModal(false)
    setSeletedRemoveFromPocketBuzz(null)
  }

  const handleRemoveFromPocket = () => {
    setAnchorEl(null)
    setRemoveFromPocketConfirmModal(true)
    setSeletedRemoveFromPocketBuzz(item)
  }

  const getPocket = () => {
    let pocketObject = null

    
    pockets.forEach(pocket => {
      let hasThisBuzz
      
      if(!selectedPocket.id) {
        hasThisBuzz = pocket.pocketBuzzes.find((b) => b.permlink === permlink) !== undefined
      } else {
        hasThisBuzz = pocket.pocketId === selectedPocket.id
      }
      
      if(hasThisBuzz) {
        pocketObject = pocket
      }
    })

    return pocketObject
  }

  // handle dynamic image sizes
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      entries.forEach(() => {
        if(onImageLoad) {
          onImageLoad()
        }
      })
    })

    if (buzzRowRef.current) {
      observer.observe(buzzRowRef.current)
    }

    return () => observer.disconnect()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div ref={buzzRowRef} className={classNames(classes.row, muted || hidden || isMutedUser() || isAHiddenBuzz() ? classes.muted : {}, isNSFWAllowed() ? classes.nsfw: {})}>
          <Row>
            <Col xs="auto" className={classes.colLeft}>
              <div style={leftWidth} className={classes.left} onClick={!isMutedUser() && !isAHiddenBuzz() ? handleOpenContent : null}>
                <Avatar height={avatarSize} author={author} />
              </div>
            </Col>
            <Col xs="auto" className={classes.colRight}>
              <div className={classNames('right-content', classes.right)} style={rightWidth}>
                <div className={classes.content}>
                  <label className={classes.name}>
                    {!disableProfileLink && !isMutedUser() && !isAHiddenBuzz() && (
                      <Link
                        ref={popoverAnchor}
                        to={!muted && !opacityActivated && disableOpacity ? authorLink : '#'}
                        onMouseEnter={(!disableUserMenu && !isMobile && !muted && !opacityActivated && disableOpacity) ? openPopOver : () => {}}
                        onMouseLeave={(!disableUserMenu && !isMobile && !muted && !opacityActivated && disableOpacity) ? closePopOver: () => {}}
                        onClick={!muted && !opacityActivated ? closePopOver : () => {}}
                      >
                        {author}
                      </Link>
                    )}
                    {(disableProfileLink || isMutedUser() || isAHiddenBuzz()) && (<span className={classes.spanName}>{author}</span>)}
                  </label>
                  <label className={classes.username}>
                    &nbsp;&bull;&nbsp;{moment(`${ !searchListMode ? !created?.endsWith('Z') ? `${created}Z` : created : created }`).local().fromNow()}
                  </label>
                  {!muted && !hidden && !opacityActivated && disableOpacity && !isMutedUser() && !isAHiddenBuzz() && (
                    <IconButton onClick={openMenu} className={classes.iconButton} style={{ float: 'right' }} size='small'>
                      <MoreHoriz  className={classes.moreIcon} />
                    </IconButton>
                  )}
                  {!muted && !hidden && !opacityActivated && disableOpacity && !isMutedUser() && !isAHiddenBuzz() && (
                    <div onClick={handleOpenContent}>
                      {displayTitle && title && (<h6 className={classes.title}>{title}</h6>)}
                      <Renderer content={content} minifyAssets={true} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex} onImageLoad={onImageLoad}/>
                      {isCensored && (
                        <Chip label={'#NSFW'} color="#2b2b2b" size="small" className={classes.chip} />
                      )}
                      {/* <PostTags meta={meta} highlightTag={highlightTag} /> */}
                    </div>
                  )}
                </div>
                {!muted && !hidden && !opacityActivated && disableOpacity && !isMutedUser() && !isAHiddenBuzz() && (
                  <div className={classes.actionWrapper}>
                    <PostActions
                      upvoteList={upvoteList}
                      // disableUpvote={disableUpvote}
                      title={title}
                      body={body}
                      hasUpvoted={hasUpvoted}
                      author={author}
                      permlink={permlink}
                      voteCount={upvotes}
                      replyCount={replyCount}
                      payout={`${payout}`}
                      recomputeRowIndex={recomputeRowIndex}
                      payoutAt={payoutAt}
                      scrollIndex={scrollIndex}
                      item = {item}
                      max_accepted_payout={max_accepted_payout}
                    />
                  </div>
                )}
                {user.is_authenticated &&
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                    className={classes.menu}
                  >
                    {<MenuItem onClick={handleAddToPocket} className={classes.menuText}>Add to Pocket</MenuItem>}
                    {(pockets && pockets.find(pocket => pocket.pocketBuzzes.find((b) => b.permlink === permlink) !== undefined) && <MenuItem onClick={handleRemoveFromPocket} className={classes.menuText}>Remove from {selectedPocket.name || getPocket().pocketName}</MenuItem>)}
                    {!isAuthor() && (<MenuItem onClick={handleTipClick} className={classes.menuText}>Tip</MenuItem>)}
                    {!isAuthor() && (<MenuItem onClick={handleClickMuteDialog} className={classes.menuText}>Mute User</MenuItem>)}
                    {!isAuthor() && (<MenuItem onClick={handleClickHideBuzzDialog} className={classes.menuText}>Hide Buzz</MenuItem>)}
                    {!isAuthor() && user.username === 'dbuzz' && !user.useKeychain && !isCensored && (<MenuItem onClick={handleClickCensorDialog} className={classes.menuText}>Censor Buzz</MenuItem>)}
                  </Menu>}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <LoginModal show={openLoginModal} onHide={hideLoginModal} />
      <AddToPocketModal show={addToPocketModal} onHide={onHideAddToPocketModal} user={user} author={author} buzz={selectedAddToPocketBuzz}/>
      <RemoveFromPocketConfirmModal show={removeFromPocketConfirmModal} onHide={onHideRemoveFromPocketConfirmModal} user={user} buzz={seletedRemoveFromPocketBuzz} pocket={getPocket()} loadPockets={loadPockets}/>
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
  opacityUsers: state.auth.get('opacityUsers'),
  hiddenBuzzes: state.auth.get('hiddenBuzzes'),
  censorList: state.auth.get('censorList'),
  theme: state.settings.get('theme'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPageFrom,
    openUserDialog,
    saveScrollIndex,
    openMuteDialog,
    openHideBuzzDialog,
    openCensorshipDialog,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(PostList)
