import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  HiveIcon,
  BurnIcon,
  ShareIcon,
  ClipboardIcon,
} from 'components/elements'
import { VoteListDialog, LoginSignupModal } from 'components'
import Row from 'react-bootstrap/Row'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import {broadcastNotification} from 'store/interface/actions'
import {createUseStyles} from 'react-jss'
import {openReplyModal} from 'store/interface/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {isMobile, isTablet} from 'react-device-detect'
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookMessengerIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { invokeTwitterIntent } from 'services/helper'
import { getTheme as currentTheme } from 'services/helper'

const useStyles = createUseStyles(theme => ({
  icon: {
    ...theme.icon,
    ...theme.font,
  },
  spinner: {
    ...theme.font,
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: 14,
    ...theme.font,
    color: theme?.stats?.color,
  },
  actionWrapperSpace: {
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
  button: {
    height: 33,
    fontSize: 14,
  },
  chip: {
    border: 'none !important',
    float: 'right !important',
  },
  sliderWrapper: {
    width: '98%',
    paddingRight: 30,
  },
  iconButton: {
    ...theme.iconButton.hover,
  },
  payout: {
    color: '#000',
    // fontSize: 14,
  },
  payoutWhite: {
    color: '#fff',
    fontSize: 14,
  },
  votelist: {
    fontSize: 12,
  },
  upvoteWrapper: {
    width: 220,
    height: '90%',
    marginTop: -10,
    backgroundColor: theme.background.primary,
  },
  upvoteInnerWrapper: {
    margin: '0 auto',
    width: '85%',
    marginBottom: 10,
  },
  upvoteListWrapper: {
    width: '100%',
    marginBottom: 5,
  },
  upvoteProfileLinks: {
    fontSize: 15,
    color: '#d32f2f',
    '&:hover': {
      color: '#d32f2f',
    },
  },
  minifyItems: {
    textAlign: 'left',
    width: "100%",
    marginBottom: 5,
    ...theme.left.sidebar.items.icons,
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
    },
  },
  upvoteDialogTitle: {
    backgroundColor: theme.background.primary,
    ...theme.font,
  },
  shareIcon: {
    padding: 8,
    background: 'red',
  },
  menu: {
    '& .MuiPaper-root': {
      background: theme.background.primary,
    },
    '& ul': {
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

const ActionWrapper = ({
  className,
  inlineClass,
  icon,
  stat,
  hideStats,
  onClick,
  disabled = false,
  tooltip = null,
  statOnClick = () => {
  },
}) => {
  return (
    <div className={classNames(className, inlineClass)}>
      <div className={inlineClass} onClick={disabled ? () => {
      } : onClick}>
        {icon}
      </div>
      {!hideStats && !tooltip && (
        <div style={{paddingTop: 2}} className={inlineClass} onClick={statOnClick}>
          {stat}
        </div>
      )}
      {!hideStats && tooltip && (
        <Tooltip arrow title={tooltip} placement="top">
          <div style={{paddingTop: 2}} className={inlineClass} onClick={statOnClick}>
            {stat}
          </div>
        </Tooltip>
      )}
    </div>
  )
}

const LitePostActions = (props) => {
  const mode = currentTheme() 
  const classes = useStyles()
  const webImagesRegex = /("\S+)|(\[\S+)|(\(\S+)|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp))/gi
  const ipfsImagesRegex = /(\[\S+)|(\(\S+)|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi
  const dbuzzImagesRegex = /(https:\/\/(storageapi\.fleek\.co\/[a-z-]+\/dbuzz-images\/dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))/gi
  const markdownRegex = /#+\s|[*]|\s+&nbsp;+\s|\s+$/gm

  const removeImageLinksFromContent = (content) => {
    return content
      .replace(webImagesRegex, '')
      .replace(ipfsImagesRegex, '')
      .replace(dbuzzImagesRegex, '')
      .replace(markdownRegex, '')
  }

  const {
    // eslint-disable-next-line
    postType,
    author,
    permlink,
    replyCount,
    payout,
    hideStats = false,
    user,
    title,
    body = null,
    bodyWithNoImageLinks = removeImageLinksFromContent((title || '').replace(/\s\.\.\./, '') + (body || '').replace(/\.\.\.\s/, '')),
    replyRef = 'list',
    treeHistory = 0,
    payoutAt = null,
    disableExtraPadding = false,
    openReplyModal,
    max_accepted_payout,
    upvoteList = [],
    // eslint-disable-next-line
    broadcastNotification,
  } = props

  const FACEBOOK_APP_ID = 45240581373116

  let payoutAdditionalStyle = {}
  let iconDetails = {}

  if (parseFloat(max_accepted_payout) === 0) {
    payoutAdditionalStyle = {textDecoration: 'line-through'}
    iconDetails = <BurnIcon style={{paddingLeft: 5}}/>
  } else {
    iconDetails = <HiveIcon style={{paddingLeft: 5}}/>
  }

  const [openCaret, setOpenCaret] = useState(false)
  const [openVoteList, setOpenVoteList] = useState(false)
  const [whenPayout, setWhenPayout] = useState(null)


  const {is_authenticated} = user

  const [openLoginSignupModal, setOpenLoginSignupModal] = useState(false)
  const [messageBasedOn, setMessageBasedOn] = useState('upvote')

  const handleClickOpenLoginSignupModal = () => {
    setOpenLoginSignupModal(true)
  }

  const handleClickCloseLoginSignupModal = () => {
    setOpenLoginSignupModal(false)
  }

  let extraPadding = {paddingTop: 10}

  if (disableExtraPadding) {
    extraPadding = {}
  }

  const handleClickCloseVoteList = () => {
    setOpenVoteList(false)
  }

  const handleClickReply = () => {

    let bodyContent = body

    if (title?.endsWith('...') && body) {
      // replace ... from title and body and merge them
      // eslint-disable-next-line
      bodyContent = title.replace(/\s\.\.\./, '') + body.replace(/\.\.\.\s/, '')
    }


    openReplyModal(author, permlink, bodyContent, treeHistory, replyRef)
  }

  const getPayoutDate = async (date) => {
    let semantic
    await import('moment').then((moment) => {
      semantic = moment.default(`${date}Z`).local().fromNow()
    })
    return !semantic.includes('years ago') ? semantic : ''
  }

  const openMenu = (e) => {
    setOpenCaret(e.currentTarget)
  }

  const closeMenu = () => {
    setOpenCaret(false)
  }

  useEffect(() => {
    if (payoutAt !== null) {
      getPayoutDate(payoutAt).then((payoutDate) => {
        setWhenPayout(payoutDate)
      })
    }
  }, [payoutAt])

  const messengerShareLink = `http://www.facebook.com/dialog/send?app_id=${FACEBOOK_APP_ID}4&redirect_uri=${window.location.origin}&link=https://d.buzz/@${author?.profile?.username}/${permlink}`

  const handleShareToMessenger = () => {
    window.location = messengerShareLink
  }

  return (
    <React.Fragment>
      <div>
        <Row style={{width: '100%', ...extraPadding, display: "flex", justifyContent: "space-between"}}>
          <div>
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classNames(classes.inline, classes.icon)}
              icon={<IconButton classes={{root: classes.iconButton}} size="small"
                disabled={!is_authenticated}><CommentIcon/></IconButton>}
              hideStats={hideStats}
              onClick={() => {
                if(!is_authenticated){
                  setMessageBasedOn('comment')
                  handleClickOpenLoginSignupModal()
                }else{
                  handleClickReply()
                }
              }}
              stat={(
                <label style={{marginLeft: 5}}>
                  {replyCount}
                </label>
              )}
            />
          </div>
          <div>
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              hideStats={false}
              stat={(
                <Chip
                  className={classes.chip}
                  size="small"
                  icon={iconDetails}
                  label={(
                    <span
                      className={mode === 'light' ? classes.payout : classes.payoutWhite}
                      style={payoutAdditionalStyle}
                      title={!payout && !isMobile ? 'in 7 days' : (!isMobile && whenPayout ? whenPayout : '')}
                    >
                      ${payout !== 'null' ? payout > 1 && parseFloat(max_accepted_payout) === 1 ? '1.00' : payout === '0' ? '0.00' : payout !== 0 && payout ? payout : '' : '0.00'}&nbsp;
                      {!payout && !isMobile ? '0.00' : ''}&nbsp;
                      {!payout && isMobile ? '0.00' : ''}
                    </span>
                  )}
                  color="secondary"
                  variant="outlined"
                />
              )}
            />
          </div>
          <div>
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              hideStats={false}
              stat={(
                <IconButton  onClick={openMenu} size='small'>
                  <ShareIcon />
                </IconButton>
              )}
            />
            <div>
              <div className={classNames('right-content', classes.right)}>
                <Menu
                  anchorEl={openCaret}
                  keepMounted
                  open={Boolean(openCaret)}
                  onClose={closeMenu}
                  className={classes.menu}
                >
                  <MenuItem className={classes.menuText}>
                    <TwitterShareButton
                      onClick={() => {
                        setOpenCaret(false)
                      }}
                    >
                      <TwitterIcon size={32} round={true} onClick={() => invokeTwitterIntent(bodyWithNoImageLinks)}/>
                    </TwitterShareButton>
                  </MenuItem>
                  <MenuItem className={classes.menuText}>
                    <FacebookShareButton
                      url={`https://d.buzz/@${author?.profile?.username}/${permlink}`}
                      quote={bodyWithNoImageLinks}
                      onClick={() => {
                        setOpenCaret(false)
                      }}
                    >
                      <FacebookIcon size={32} round={true}/>
                    </FacebookShareButton>
                  </MenuItem>
                  {(!isMobile && !isTablet) &&
                    <MenuItem className={classes.menuText} onClick={handleShareToMessenger}>
                      <FacebookMessengerIcon size={32} round={true}/>
                    </MenuItem>}
                  <MenuItem>
                    <TelegramShareButton
                      url={' '}
                      title={`${bodyWithNoImageLinks}\n\nhttps://d.buzz/@${author?.profile?.username}/${permlink}`}
                      onClick={() => {
                        setOpenCaret(false)
                      }}>
                      <TelegramIcon size={32} round={true}/>
                    </TelegramShareButton>
                  </MenuItem>
                  <MenuItem>
                    <WhatsappShareButton
                      url={`https://d.buzz/@${author?.profile?.username}/${permlink}`}
                      title={bodyWithNoImageLinks + '\n\n'}
                      onClick={() => {
                        setOpenCaret(false)
                      }}>
                      <WhatsappIcon size={32} round={true}/>
                    </WhatsappShareButton>
                  </MenuItem>
                  <MenuItem>
                    <LinkedinShareButton
                      url={`https://d.buzz/@${author?.profile?.username}/${permlink}`}
                      title={bodyWithNoImageLinks}
                      summary={bodyWithNoImageLinks}
                      source={'DBuzz'}
                      onClick={() => {
                        setOpenCaret(false)
                      }}>
                      <LinkedinIcon size={32} round={true}/>
                    </LinkedinShareButton>
                  </MenuItem>
                  <MenuItem style={{display: 'flex', justifyContent: 'center', padding: '8px 0'}}
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/@${author?.profile?.username}/${permlink}`)}>
                    <ClipboardIcon/>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </Row>
      </div>
      <VoteListDialog
        onClose={handleClickCloseVoteList}
        open={openVoteList}
        upvoteList={upvoteList}
      />
      <LoginSignupModal show={openLoginSignupModal} messageBased={messageBasedOn} onHide={handleClickCloseLoginSignupModal} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openReplyModal,
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LitePostActions)
