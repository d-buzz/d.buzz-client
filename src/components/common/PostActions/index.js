import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  HeartIcon,
  HiveIcon,
  BurnIcon,
  ContainedButton,
  HeartIconRed,
  Spinner,
  ShareIcon,
  ClipboardIcon,
} from 'components/elements'
import { VoteListDialog } from 'components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Chip from '@material-ui/core/Chip'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { broadcastNotification } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { withStyles } from '@material-ui/core/styles'
import { upvoteRequest } from 'store/posts/actions'
import { openReplyModal } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isMobile, isTablet } from 'react-device-detect'
import { setDefaultVotingWeightRequest } from 'store/settings/actions'
import { FacebookShareButton, FacebookIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon, FacebookMessengerIcon, TwitterShareButton, TwitterIcon } from 'react-share'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { invokeTwitterIntent } from 'services/helper'
import { checkForCeramicAccount } from 'services/ceramic'
import { hasUpvoteService } from 'services/api'
import { getTheme as currentTheme } from 'services/helper'

const PrettoSlider = withStyles({
  root: {
    color: '#e53935',
    height: 5,
    '& .MuiSlider-markLabel': {
      fontSize: 12,
      color: '#d32f2f',
    },
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -5,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider)

const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 70,
    label: '70',
  },
  {
    value: 80,
    label: '80',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: 100,
    label: '100',
  },
]

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
    color: '#536471 !important',
  },
  actionWrapperSpace: {
    paddingRight: 30,
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
    '& span': {
      // fontFamily: 'Segoe-Bold',
      // marginTop: 5,
    },
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

const ActionWrapper = ({ className, inlineClass, icon, stat, hideStats, onClick, disabled = false,  tooltip = null, statOnClick = () => {} }) => {
  return (
    <div className={classNames(className, inlineClass)}>
      <div className={inlineClass} onClick={disabled ? () => {} : onClick}>
        {icon}
      </div>
      {!hideStats && !tooltip && (
        <div style={{ paddingTop: 2 }} className={inlineClass} onClick={statOnClick}>
          {stat}
        </div>
      )}
      {!hideStats  && tooltip && (
        <Tooltip arrow title={tooltip} placement='top'>
          <div style={{ paddingTop: 2 }} className={inlineClass} onClick={statOnClick}>
            {stat}
          </div>
        </Tooltip>
      )}
    </div>
  )
}

const PostActions = (props) => {
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
    type,
    author,
    permlink,
    voteCount,
    replyCount,
    payout,
    hideStats = false,
    upvoteRequest,
    hasUpvoted = false,
    user,
    title,
    body = null,
    bodyWithNoImageLinks = removeImageLinksFromContent((title|| '').replace(/\s\.\.\./, '') + (body || '').replace(/\.\.\.\s/, '')),
    replyRef = 'list',
    treeHistory = 0,
    payoutAt = null,
    disableExtraPadding = false,
    openReplyModal,
    broadcastNotification,
    disableUpvote = false,
    scrollIndex = 0,
    recomputeRowIndex = () => {},
    max_accepted_payout,
    recentUpvotes,
    upvoteList = [],
    setDefaultVotingWeightRequest,
    defaultUpvoteStrength,
  } = props

  const FACEBOOK_APP_ID = 45240581373116

  let payoutAdditionalStyle = {}
  let iconDetails = {}

  if(parseFloat(max_accepted_payout) === 0) {
    payoutAdditionalStyle = { textDecoration: 'line-through' }
    iconDetails = <BurnIcon style={{ paddingLeft: 5 }}/>
  }else{
    iconDetails = <HiveIcon style={{ paddingLeft: 5 }}/>
  }

  const [showSlider, setShowSlider] = useState(false)
  const [vote, setVote] = useState(voteCount)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(hasUpvoted)
  const [openCaret, setOpenCaret] = useState(false)
  const [openVoteList, setOpenVoteList] = useState(false)
  const [whenPayout, setWhenPayout] = useState(null)
  
  const [sliderValue, setSliderValue] = useState(defaultUpvoteStrength)

  const { is_authenticated } = user

  let extraPadding = { paddingTop: 10 }

  if(disableExtraPadding) {
    extraPadding = {}
  }

  useEffect(() => {
    if(recentUpvotes && permlink && recentUpvotes.includes(permlink)) {
      setUpvoted(true)
    }
    // eslint-disable-next-line
  }, [recentUpvotes, permlink])

  useEffect(() => {
    setSliderValue(defaultUpvoteStrength)
  }, [defaultUpvoteStrength])

  const handleClickOpenVoteList = () => {
    setOpenVoteList(true)
  }

  const handleClickCloseVoteList = () => {
    setOpenVoteList(false)
  }


  const handleClickShowSlider = () => {
    setShowSlider(true)
    if(replyRef === 'list') {
      recomputeRowIndex(scrollIndex)
    }
  }

  const handleClickHideSlider = () => {
    setShowSlider(false)
    if(replyRef === 'list') {
      recomputeRowIndex(scrollIndex)
    }
  }

  const handleChange = (e, value) => {
    setDefaultVotingWeightRequest(value)
    setSliderValue(value)
  }

  const handleClickUpvote = () => {
    if(sliderValue > 0) {
      if(replyRef === 'list') {
        recomputeRowIndex(scrollIndex)
      }
      setShowSlider(false)
      setLoading(true)

      if(user.useHAS) {

        hasUpvoteService(author, permlink, sliderValue)

        import('@mintrawa/hive-auth-client').then((HiveAuth) => {
          HiveAuth.hacMsg.subscribe((m) => {
            if(isMobile) {
              broadcastNotification('warning', 'Tap on this link to open Hive Keychain app and confirm the transaction.', 600000, `has://sign_req/${m.msg}`)
            } else {
              broadcastNotification('warning', 'Please open Hive Keychain app on your phone and confirm the transaction.', 600000)
            }
            if (m.type === 'sign_wait') {
              console.log('%c[HAC Sign wait]', 'color: goldenrod', m.msg? m.msg.uuid : null)
            }
            if (m.type === 'tx_result') {
              console.log('%c[HAC Sign result]', 'color: goldenrod', m.msg? m.msg : null)
              if (m.msg?.status === 'accepted') {
                const status = m.msg?.status
                console.log(status)
                setVote(vote + 1)
                setUpvoted(true)
                setLoading(false)
                broadcastNotification('success', `Succesfully upvoted @${author}/${permlink} at ${sliderValue}%`)
              } else if (m.msg?.status === 'error') {
                const error = m.msg?.status.error
                console.log(error)
                setUpvoted(false)
                broadcastNotification('error', error)
                setLoading(false)
              } else if (m.msg?.status === 'rejected') {
                const status = m.msg?.status
                console.log(status)
                setUpvoted(false)
                broadcastNotification('error', 'Your HiveAuth upvote transaction is rejected.')
                setLoading(false)
              } else {
                setUpvoted(false)
                broadcastNotification('error', 'Unknown error occurred, please try again in some time.')
                setLoading(false)
              }
            }
          })
        })

      } else {
        upvoteRequest(author, permlink, sliderValue)
          .then(({ success, errorMessage }) => {
            if(success) {
              setVote(vote + 1)
              setUpvoted(true)
              setLoading(false)
              broadcastNotification('success', `Succesfully upvoted @${author}/${permlink} at ${sliderValue}%`)
            } else {
              setUpvoted(false)
              broadcastNotification('error', errorMessage)
              setLoading(false)
            }
          })
      }

    } else {
      broadcastNotification('error', 'Voting cannot done with 0% Power!')
    }
  }

  const handleClickReply = () => {

    let bodyContent = body

    if(title?.endsWith('...') && body) {
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

  const RenderUpvoteList = () => {
    let list = upvoteList

    if(vote > 15) {
      list = list.slice(0, 14)
      list.push({ voter: `and ${vote - 15} more ...`})
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

  useEffect(() => {
    if(payoutAt !== null) {
      getPayoutDate(payoutAt).then((payoutDate) => {
        setWhenPayout(payoutDate)
      })
    }
  }, [payoutAt])

  const messengerShareLink = `http://www.facebook.com/dialog/send?app_id=${FACEBOOK_APP_ID}4&redirect_uri=${window.location.origin}&link=https://d.buzz/@${author}/${permlink}`
  
  const handleShareToMessenger = () => {
    window.location = messengerShareLink
  }

  return (
    <React.Fragment>
      {!showSlider && (
        <div>
          <Row style={{ width: '100%', ...extraPadding }}>
            {!checkForCeramicAccount(user.username)  && type !== 'CERAMIC' &&
              <Col xs={!isMobile ? 3 : 3}>
                {!loading && upvoted && (
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classes.inline}
                    icon={<IconButton disabled={true} size="small"><HeartIconRed /></IconButton>}
                    hideStats={hideStats}
                    tooltip={vote !== 0? <RenderUpvoteList /> : null}
                    statOnClick={handleClickOpenVoteList}
                    stat={(
                      <label style={{ marginLeft: 5 }}>
                        {vote}
                      </label>
                    )}
                  />
                )}
                {!loading && !upvoted && (
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classNames(classes.inline, classes.icon)}
                    icon={<IconButton classes={{ root: classes.iconButton  }} disabled={!is_authenticated || disableUpvote} size="small"><HeartIcon /></IconButton>}
                    hideStats={hideStats}
                    disabled={!is_authenticated || disableUpvote}
                    onClick={handleClickShowSlider}
                    tooltip={vote !== 0 ? <RenderUpvoteList /> : null}
                    statOnClick={handleClickOpenVoteList}
                    stat={(
                      <label style={{ marginLeft: 5 }}>
                        {vote}
                      </label>
                    )}
                  />
                )}
                {loading && (
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classNames(classes.inline, classes.spinner)}
                    icon={<Spinner top={0} loading={true} size={20} style={{ display: 'inline-block', verticalAlign: 'top' }} />}
                    hideStats={hideStats}
                    onClick={handleClickShowSlider}
                    stat={(
                      <label style={{ marginLeft: 5 }}>
                        {voteCount}
                      </label>
                    )}
                  />
                )}
              </Col>}
            {!checkForCeramicAccount(user.username)  && type !== 'CERAMIC' &&  
              <Col xs={!isMobile ? 'auto' : 3}>
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classNames(classes.inline, classes.icon)}
                  icon={<IconButton classes={{ root: classes.iconButton  }} size="small" disabled={!is_authenticated}><CommentIcon /></IconButton>}
                  hideStats={hideStats}
                  disabled={!is_authenticated}
                  onClick={handleClickReply}
                  stat={(
                    <label style={{ marginLeft: 5 }}>
                      {replyCount}
                    </label>
                  )}
                />
              </Col>}
            {!checkForCeramicAccount(user.username)  && type !== 'CERAMIC' &&
              <Col xs={!isMobile ? 4 : 4}>
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classes.inline}
                  hideStats={false}
                  stat={(
                    <Chip
                      className={classNames(classes.chip, classes.minifyItemsGray)}
                      size='small'
                      icon={iconDetails}
                      label={(
                        <span className={mode === 'light'?classes.payout:classes.payoutWhite} style={payoutAdditionalStyle}>
                          ${payout > 1 && parseFloat(max_accepted_payout) === 1 ? '1.00' : payout === '0' ? '0.00' : payout !== 0 ? payout : ''}&nbsp;
                          {!payout && !isMobile ? '0.00 in 7 days' : ''}&nbsp;
                          {!payout && isMobile ? '0.00' : ''}&nbsp;
                          {!isMobile && whenPayout && payout ? whenPayout : ''}
                        </span>
                      )}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                />
              </Col>}
            <Col xs={!isMobile ? 2 : 2} className={!isMobile ? 'pl-5' : ''} >
              <ActionWrapper
                className={classes.actionWrapperSpace}
                inlineClass={classes.inline}
                hideStats={false}
                stat={(
                  <IconButton className={classNames(classes.minifyItems)} onClick={openMenu} size='small'>
                    <ShareIcon />
                  </IconButton>
                )}
              />
              <Col xs="auto">
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
                        <TwitterIcon size={32} round={true} onClick={() => invokeTwitterIntent(bodyWithNoImageLinks)} />
                      </TwitterShareButton>
                    </MenuItem>
                    <MenuItem className={classes.menuText}>
                      <FacebookShareButton 
                        url={`https://d.buzz/@${author}/${permlink}`}
                        quote={bodyWithNoImageLinks}
                        onClick={() => {
                          setOpenCaret(false)
                        }}
                      >
                        <FacebookIcon size={32} round={true} />
                      </FacebookShareButton>
                    </MenuItem>
                    {(!isMobile && !isTablet) &&
                      <MenuItem className={classes.menuText} onClick={handleShareToMessenger}>
                        <FacebookMessengerIcon size={32} round={true} />
                      </MenuItem>}
                    <MenuItem>
                      <TelegramShareButton
                        url={' '}
                        title={`${bodyWithNoImageLinks}\n\nhttps://d.buzz/@${author}/${permlink}`}
                        onClick={() => {setOpenCaret(false)}}>
                        <TelegramIcon size={32} round={true} />
                      </TelegramShareButton>
                    </MenuItem>
                    <MenuItem>
                      <WhatsappShareButton
                        url={`https://d.buzz/@${author}/${permlink}`}
                        title={bodyWithNoImageLinks+'\n\n'}
                        onClick={() => {setOpenCaret(false)}}>
                        <WhatsappIcon size={32} round={true} />
                      </WhatsappShareButton>
                    </MenuItem>
                    <MenuItem>
                      <LinkedinShareButton
                        url={`https://d.buzz/@${author}/${permlink}`}
                        title={bodyWithNoImageLinks}
                        summary={bodyWithNoImageLinks}
                        source={'DBuzz'}
                        onClick={() => {setOpenCaret(false)}}>
                        <LinkedinIcon size={32} round={true} />
                      </LinkedinShareButton>
                    </MenuItem>
                    <MenuItem style={{display: 'flex', justifyContent: 'center', padding: '8px 0'}} onClick={() => navigator.clipboard.writeText(`${window.location.origin}/@${author}/${permlink}`)}>
                      <ClipboardIcon />
                    </MenuItem>
                  </Menu>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      )}
      {showSlider && (
        <div className={classes.sliderWrapper}>
          <Row>
            <Col xs="auto">
              <ContainedButton onClick={handleClickUpvote} fontSize={14} label={`Upvote (${sliderValue}%)`} className={classes.button} />
            </Col>
            <Col style={{ paddingLeft: 0 }}>
              <ContainedButton
                fontSize={14}
                transparent={true}
                label="Cancel"
                className={classes.button}
                onClick={handleClickHideSlider}
              />
            </Col>
          </Row>
          <div style={{ paddingLeft: 10 }}>
            <PrettoSlider
              min={1}
              marks={marks}
              value={sliderValue}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      <VoteListDialog
        onClose={handleClickCloseVoteList}
        open={openVoteList}
        upvoteList={upvoteList}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  recentUpvotes: state.posts.get('recentUpvotes'),
  defaultUpvoteStrength: state.settings.get('defaultVoteWeight'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    upvoteRequest,
    openReplyModal,
    broadcastNotification,
    setDefaultVotingWeightRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostActions)
