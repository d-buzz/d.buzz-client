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
} from 'components/elements'
import { VoteListDialog } from 'components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'
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
import { isMobile } from 'react-device-detect'
import { setDefaultVotingWeightRequest } from 'store/settings/actions'
import { FacebookShareButton, FacebookIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon, FacebookMessengerShareButton, FacebookMessengerIcon, TwitterShareButton, TwitterIcon } from 'react-share'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { invokeTwitterIntent } from 'services/helper'

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
    value: 0,
    label: '0',
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
      fontFamily: 'Segoe-Bold',
      marginTop: -5,
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
    color: '#e53935',
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
  const classes = useStyles()
  const {
    author,
    permlink,
    voteCount,
    replyCount,
    payout,
    hideStats = false,
    upvoteRequest,
    hasUpvoted = false,
    user,
    body = null,
    bodyWithNoLinks = body.replace(/<[^>]*>/gi, '').replace(/!([A-Za-z0-9-[():\]/._?&#@]+)/gi, ''),
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

  const FACEBOOK_APP_ID = 236880454857514

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
    } else {
      broadcastNotification('error', 'Voting cannot done with 0% Power!')
    }
  }

  const handleClickReply = () => {
    openReplyModal(author, permlink, body, treeHistory, replyRef)
  }

  const getPayoutDate = (date) => {
    const semantic =  moment(`${date}Z`).local().fromNow()
    return semantic !== '51 years ago' ? semantic : ''
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
  
  return (
    <React.Fragment>
      {!showSlider && (
        <div>
          <Row style={{ width: '100%', ...extraPadding }}>
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
            </Col>
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
            </Col>
            <Col xs={!isMobile ? 4 : 4}>
              <ActionWrapper
                className={classes.actionWrapperSpace}
                inlineClass={classes.inline}
                hideStats={false}
                stat={(
                  <Chip
                    className={classes.chip}
                    size='small'
                    icon={iconDetails}
                    label={(
                      <span className={classes.payout} style={payoutAdditionalStyle}>
                        ${payout > 1 && parseFloat(max_accepted_payout) === 1 ? '1.00' : payout === '0' ? '0.00' : payout !== 0 ? payout : ''}&nbsp;
                        {!payout && !isMobile ? '0.00 in 7 days' : ''}&nbsp;
                        {!payout && isMobile ? '0.00' : ''}&nbsp;
                        {!isMobile && payoutAt && payout ? getPayoutDate(payoutAt) : ''}
                      </span>
                    )}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              />
            </Col>
            <Col xs={!isMobile ? 2 : 2} className={!isMobile ? 'pl-5' : ''} >
              <ActionWrapper
                className={classes.actionWrapperSpace}
                inlineClass={classes.inline}
                hideStats={false}
                stat={(
                  <IconButton onClick={openMenu} size='small'>
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
                        <TwitterIcon size={32} round={true} onClick={() => invokeTwitterIntent(bodyWithNoLinks)} />
                      </TwitterShareButton>
                    </MenuItem>
                    <MenuItem className={classes.menuText}>
                      <FacebookShareButton 
                        url={`https://d.buzz/#/@${author}/c/${permlink}`}
                        quote={bodyWithNoLinks}
                        onClick={() => {
                          setOpenCaret(false)
                        }}
                      >
                        <FacebookIcon size={32} round={true} />
                      </FacebookShareButton>
                    </MenuItem>
                    <MenuItem className={classes.menuText}>
                      <FacebookMessengerShareButton 
                        url={`https://d.buzz/#/@${author}/c/${permlink}`}
                        appId={FACEBOOK_APP_ID}
                        onClick={() => {
                          setOpenCaret(false)
                        }}
                      >
                        <FacebookMessengerIcon size={32} round={true} />
                      </FacebookMessengerShareButton>
                    </MenuItem>
                    <MenuItem>
                      <TelegramShareButton
                        url={' '}
                        title={`${bodyWithNoLinks}\n\nhttps://d.buzz/#/@${author}/c/${permlink}`}
                        onClick={() => {setOpenCaret(false)}}>
                        <TelegramIcon size={32} round={true} />
                      </TelegramShareButton>
                    </MenuItem>
                    <MenuItem>
                      <WhatsappShareButton
                        url={`https://d.buzz/#/@${author}/c/${permlink}`}
                        title={bodyWithNoLinks+'\n\n'}
                        onClick={() => {setOpenCaret(false)}}>
                        <WhatsappIcon size={32} round={true} />
                      </WhatsappShareButton>
                    </MenuItem>
                    <MenuItem>
                      <LinkedinShareButton
                        url={`https://d.buzz/#/@${author}/c/${permlink}`}
                        title={bodyWithNoLinks}
                        summary={bodyWithNoLinks}
                        source={'DBuzz'}
                        onClick={() => {setOpenCaret(false)}}>
                        <LinkedinIcon size={32} round={true} />
                      </LinkedinShareButton>
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
