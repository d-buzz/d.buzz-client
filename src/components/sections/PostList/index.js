import React, { useState, useRef, useEffect } from 'react'
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
import { openUserDialog, saveScrollIndex, openMuteDialog } from 'store/interface/actions'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useWindowDimensions } from 'services/helper'
import { setPageFrom } from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { isMobile } from 'react-device-detect'
import classNames from 'classnames'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { sendToBerries } from 'services/helper'

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
  },
  berries: {
    width: 120,
    marginTop: 10,
  },
  moreIcon: {
    ...theme.font,
  },
  menuText: {
    fontSize: 13,
  },
  muted: {
    opacity: 0.2,
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
    meta,
    active_votes = [],
    unguardedLinks,
    user = {},
    profileRef = null,
    highlightTag = null,
    title = null,
    disableProfileLink = false,
    disableUserMenu = false,
    disableUpvote = false,
    openUserDialog,
    saveScrollIndex,
    scrollIndex,
    recomputeRowIndex = () => {},
    displayTitle,
    openMuteDialog,
    opacityUsers,
    disableOpacity,
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
  const popoverAnchor = useRef(null)


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
  const authorLink = `/@${author}${'?ref='+profileRef}`

  if(user.is_authenticated && !searchListMode) {
    hasUpvoted = active_votes.filter((vote) => vote.voter === user.username).length !== 0
  } else {
    hasUpvoted = false
  }

  const generateLink = (author, permlink) =>  {
    let link = ''

    link += `/@${author}/c/${permlink}`

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
      openUserDialog(popoverAnchor.current, author)
    }, 500))
  }

  const closePopOver = () => {
    clearTimeout(delayHandler)
  }

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const muteSuccessCallback = () => {
    setMuted(true)
    recomputeRowIndex(scrollIndex)
  }

  const handleClickMuteDialog = () => {
    // scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex}
    openMuteDialog(author, muteSuccessCallback)
    setAnchorEl(null)
  }

  const opacityActivated = opacityUsers.includes(author)

  const handleTipClick = () => {
    sendToBerries(author)
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classNames(classes.row, muted || opacityUsers.includes(author) ? classes.muted : {})}>
          <Row>
            <Col xs="auto" className={classes.colLeft}>
              <div style={leftWidth} className={classes.left} onClick={handleOpenContent}>
                <Avatar height={avatarSize} author={author} />
              </div>
            </Col>
            <Col xs="auto" className={classes.colRight}>
              <div className={classNames('right-content', classes.right)} style={rightWidth}>
                <div className={classes.content}>
                  <label className={classes.name}>
                    {!disableProfileLink && (
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
                    {disableProfileLink && (<span className={classes.spanName}>{author}</span>)}
                  </label>
                  <label className={classes.username}>
                    &nbsp;&bull;&nbsp;{moment(`${ !searchListMode ? `${created}Z` : created }`).local().fromNow()}
                  </label>
                  {!muted && !opacityActivated && disableOpacity && (
                    <IconButton onClick={openMenu} style={{ float: 'right' }} size='small'>
                      <ExpandMoreIcon  className={classes.moreIcon} />
                    </IconButton>
                  )}
                  {!muted && !opacityActivated && disableOpacity && (
                    <div onClick={handleOpenContent}>
                      {displayTitle && title && (<h6 className={classes.title}>{title}</h6>)}
                      <MarkdownViewer content={body} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex}/>
                      <PostTags meta={meta} highlightTag={highlightTag} />
                    </div>
                  )}
                  {/* <a href={`https://buymeberri.es/@${author}`} rel='noopener noreferrer' target='_blank'>
                    <img alt='berry-tip-button' className={classes.berries} src='https://buymeberries.com/assets/bmb-4-s.png'/>
                  </a> */}
                </div>
                {!muted && !opacityActivated && disableOpacity && (
                  <div className={classes.actionWrapper}>
                    <PostActions
                      disableUpvote={disableUpvote}
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
                      max_accepted_payout={max_accepted_payout}
                    />
                  </div>
                )}
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                >
                  <MenuItem onClick={handleTipClick} className={classes.menuText}>Tip</MenuItem>
                  {user.username && user.username !== author && (<MenuItem onClick={handleClickMuteDialog} className={classes.menuText}>Mute</MenuItem>)}
                </Menu>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
  opacityUsers: state.auth.get('opacityUsers'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPageFrom,
    openUserDialog,
    saveScrollIndex,
    openMuteDialog,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(PostList)
