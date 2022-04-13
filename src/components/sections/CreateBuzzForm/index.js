import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import { createUseStyles } from 'react-jss'
import {
  TextArea,
  ContainedButton,
  Avatar,
  UploadIcon,
  Spinner,
  GifIcon,
  EmojiIcon,
  TitleIcon,
} from 'components/elements'
import { clearIntentBuzz } from 'store/auth/actions'
import { broadcastNotification } from 'store/interface/actions'
import { PayoutDisclaimerModal, GiphySearchModal, EmojiPicker} from 'components'
import { bindActionCreators } from 'redux'
import { uploadFileRequest, uploadVideoRequest, publishPostRequest,  setPageFrom, savePostAsDraft, updateBuzzThreads, updateBuzzTitle, publishReplyRequest, setContentRedirect } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// import { WithContext as ReactTags } from 'react-tag-input'
import { isMobile } from 'react-device-detect'
import { invokeTwitterIntent, calculateOverhead } from 'services/helper'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { setBuzzModalStatus, setBuzzTitleModalStatus, setDraftsModalStatus, setSaveDraftsModalStatus } from 'store/interface/actions'
import { BuzzFormModal } from 'components'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from 'components/elements/Icons/CloseIcon'
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded'
import Renderer from 'components/common/Renderer'
import Switch from 'components/elements/Switch'
import imageCompression from 'browser-image-compression'
import ImagesContainer from '../ImagesContainer'
import ViewImageModal from 'components/modals/ViewImageModal'
// import BuzzTitleModal from 'components/modals/BuzzTitleModal'
import DraftsIcon from 'components/elements/Icons/DraftsIcon'
import DraftsModal from 'components/modals/DraftsModal'
import SaveDraftModal from 'components/modals/SaveDraftModal'
import VideoUploadIcon from 'components/elements/Icons/VideoUploadIcon'
import { LinearProgress } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { publishPostWithHAS } from 'services/api'
import { hacMsg } from '@mintrawa/hive-auth-client'

const useStyles = createUseStyles(theme => ({
  container: {
    width: '100%',
    borderBottom: theme.border.thick,
  },
  containerModal: {
    width: '100%',
    borderTop: theme.border.primary,
  },
  row: {
    width: '95%',
    margin: '0 auto',
    paddingTop: 15,
    marginBottom: 10,
  },
  left: {
    width: 60,
    height: '100%',
  },
  right: {
    minHeight: 55,
    // width: 'calc(100% - 65px)',
    width: '100%',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  float: {
    float: 'right',
    marginRight: 5,
    marginTop: 10,
  },
  root: {
    position: 'relative',
  },
  bottom: {
    color: '#ffebee',
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    position: 'relative',
    strokeLinecap: 'round',
    transition: 'all 350ms',
  },
  circleBg: {
    position: 'relative',
    strokeLinecap: 'round',
  },
  previewContainer: {
    marginTop: 10,
    width: 'calc(100% - 65px)',
    float: 'right',
    height: 'max-content',
    paddingBottom: 10,
    borderTop: `0.5px solid ${theme.font.color}`,
    // borderBottom: `0.5px solid ${theme.font.color}`,
    '& img': {
      border: '1px solid #ccd6dd',
      borderRadius: '16px 16px',
    },
    '& iframe': {
      borderRadius: '16px 16px',
    },
  },
  note: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    color: '#d32f2f',
  },
  actionLabels: {
    fontFamily: 'Segoe-Bold',
    fontSize: 14,
    color: '#e53935',
    paddingTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  previewTitle: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: '600',
    ...theme.preview.title,

    '@media (max-width: 480px)': {
      display: 'none',
    },
  },
  previewTitleMobile: {
    display: 'none',
    gap: '20px',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: '600',
    ...theme.preview.title,

    '@media (max-width: 480px)': {
      display: 'flex',
    },
  },
  separator: {
    height: 0,
    width: '100%',
    border: theme.border.primary,
  },
  tinyInput: {
    padding: '10px 2px',
    height: 20,
    width: 50,
    marginLeft: 5,
    border: '1px solid lightgray',
    borderRadius: 5,
    fontSize: 14,
    color: theme.font.color,
    background: 'transparent',
  },
  payoutLabel: {
    ...theme.font,
    fontSize: 14,
    display: 'inline-block',
  },
  payoutNote: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
    display: 'block',
  },
  checkBox: {
    cursor: 'pointer',
  },
  label: {
    fontFamily: 'Segoe-Bold',
    ...theme.font,
    fontSize: 15,
  },
  icon: {
    ...theme.icon,
    ...theme.font,
    fontSize: '18px !important',
    cursor: 'pointer',
    marginLeft: 2,
    // marginBottom: 5,
  },
  draftPostContainer: {
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    float: 'right',
    opacity: 0.8,
    animation: 'savedAsDraftAnimation 350ms',
    cursor: 'pointer',
    '&:hover':{
      transition: 'all 350ms',
      opacity: 1,
    },
  },
  draftPostLabel: {
    ...theme.font,
    margin: 0,
    marginRight: 5,
    fontSize: '1.2em',
    color: '#e61c34',
    padding: '2px 10px',
    width: 'fit-content',
    border: '1px solid #e61c34',
    borderRadius: '5px',
    userSelect: 'none',
    transition: 'all 350ms',
    '&:hover':{
      background: '#e61c34',
      color: '#ffffff',
    },
  },
  clearDraftIcon: {
    marginBottom: 3,
  },
  characterCounterBg: {
    position: 'relative',
    marginTop: 2,
  },
  characterCounter: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    float: 'right',
    marginBottom: 6,
    // marginRight: 10,
  },
  counter: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: '0.8em',
    marginRight: 12,
    color: '#e61c34',
    width: 'fit-content',
    left: '50%',
    top: '50%',
    transform: 'translate(-52%,-52%)',
    animation: 'counterAnimation 350ms',
  },
  closeBuzzButton: {
    position: 'absolute',
    top: 22,
    right: 2,
    float: 'right',
    animation: 'closeBuzzButtonAnimation 450ms',
    zIndex: 99,
  },
  colDivider: {
    width: 0.5,
    height: 32,
    margin: '0 15px',
    background: '#B9CAD3',
  },
  addThreadIcon: {
    display: 'grid',
    placeItems: 'center',
    width: 35,
    height: 35,
    color: '#e61c34',
    border: '1px solid #e61c34',
    borderRadius: '50%',
    transform: 'translateY(-2px)',
    cursor: 'pointer',
    animation: 'zoomIn 250ms',

    '&:hover': {
      background: 'rgba(230, 28, 52, 0.1)',
    },
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 0',
    animation: 'buzzLoadingContainer 450ms',

    '& .title': {
      fontSize: '1.2em',
      fontWeight: 600,
      marginTop: '10px',
      ...theme.font,
    },

    '& img': {
      height: '100px',
      width: '100px',
      animation: 'buzzLoading infinite 850ms',
      pointerEvents: 'none',
    },
  },
  publishThreadButton: {
    marginTop: 15,
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1.5,
    fontSize: 18,
    color: '#ffffff',
    padding: '8px 25px',
    background: '#E61C34',
    border: 'none',
    borderRadius: 5,
    userSelect: 'none',
    cursor: 'pointer',

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    '&:hover:enabled': {
      background: '#B71C1C',
    },
  },
  imageAlert: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    background: '#FF9800',
    padding: 20,
    borderRadius: 15,
    textAlign: 'center',
    height: 'fit-content',

    '& .heading':{
      fontSize: '1.2em',
      fontWeight: 800,
    },

    '& .content': {
      fontSize: '1em',
    },

    '& .button': {
      marginTop: 50,
      fontSize: '1.2em',
      width: 'fit-content',
      padding: '5px 12px',
      borderRadius: 8,
      background: '#7E4B00',
      color: 'white',
      userSelect: 'none',
      cursor: 'pointer',
    },
  },
  draftsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    
    '& .save_draft_button': {
      float: 'right',
      lineHeight: 1,
      padding: '10px 13px',
      border: '2px solid #e74b5d',
      color: '#e74b5d',
      borderRadius: 35,
      fontSize: '0.8em',
      fontWeight: 700,
      userSelect: 'none',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 250ms',
      margin: '0 15px',
      marginTop: 15,

      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
  buzzOptions: {
    display: 'inline-flex',
    alignItems: 'center',

    '& .title': {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: theme.font.color,
      marginRight: 15,

      '@media (max-width: 480px)': {
        display: 'none',
      },
    },
  },

  buzzToTwitterToggle: {
    display: 'grid',
    placeItems: 'center',
    // width: 165,
    height: 28,
    width: 28,
    background: '#E65768',
    borderRadius: '50%',
    cursor: 'pointer',

    '@media (max-width: 480px)': {
      height: 33,
      width: 33,
    },
    
    '& .icon': {
      paddingLeft: 2,
      width: 18,
      objectFit: 'contain',
      userSelect: 'none',
      pointerEvents: 'none',

      '@media (max-width: 480px)': {
        width: 23,
      },
    },
  },
  titleBox: {
    display: 'flex',
    width: '100%',
    fontSize: '2rem',
    background: theme.background.primary,
    boxShadow: `0 0px 0 ${theme.font.color}`,
    transition: 'border 350ms',
    marginBottom: '15px',
    outlineWidth: 0,
    
    '& .userAvatar': {
      transition: 'all 250ms',
      '&:hover': {
        opacity: 0.8,
        cursor: 'pointer',
      },
    },
    
    '& .titleContainer': {
      display: 'flex',
      width: '100%',
      marginLeft: 10,
      paddingBottom: 5,
      borderBottom: `2px solid ${theme.context.view.backgroundColor}`,
      transition: 'all 250ms',

      '&:focus-within': {
        boxShadow: `0 2px 0 ${theme.font.color}`,
      },

      '& input': {
        background: theme.background.primary,
        border: 'none',
        color: theme.font.color,
        width: '90%',
        paddingRight: 10,
      },
      
      '& span': {
        alignSelf: 'center',
        justifySelf: 'center',
        display: 'grid',
        placeItems: 'center',
        color: theme.font.color,
        width: '10%',
        height: 'fit-content',
        textAlign: 'center',
        fontSize: '1rem',
        borderRadius: 5,
        background: theme.context.view.backgroundColor,
      },
    },
    
  },
  buzzCustomizeOptions: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'calc(100% - 65px)',
    float: 'right',
    margin: '5px 0',
  },
  buzzPublishingOptions: {
    width: 'calc(100% - 65px)',
    float: 'right',
    padding: '10px 0',

    '& .buzzPublishingOptions__r1': {
      width: '100%',
      display: 'inline-flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    '& .buzzPublishingOptions__r2': {
      marginTop: 15,
      width: '100%',
      display: 'inline-flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },

    '@media (max-width: 480px)': {
      margin: '10px 0',
    },
  },
  maxPayoutOption: {
    margin: '0 15px',
    display: 'inline-flex',
    alignItems: 'center',
    textSize: '',
  },
  publishBuzzOption: {
    display: 'inline-flex',
    alignItems: 'center',
    
    '@media (max-width: 480px)': {
      display: 'none',
    },
  },
  publishBuzzOptionMobile: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: '10px 0',
    marginBottom: 15,

    '@media (max-width: 480px)': {
      display: 'flex',
    },
  },
  buzzBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  buzzTextBox: {
    display: 'flex',
    position: 'relative',
    // width: '100%',
    width: props => props.showBuzzTitle ? 'calc(100% - 58px)' : '',
    marginLeft: props => props.showBuzzTitle ? 58 : '',
    transition: 'all 250ms',

    '&:focus-within': {
      background: theme.context.view.backgroundColor,
    },

    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    border: `2px solid ${theme.context.view.backgroundColor}`,
    
    '& .buzzBoxes': {
      width: '100%',

      '& .buzzArea1': {
        '&:after': {
          display: props => props.buzzThreads ? props.buzzThreads[2] ? 'block' : 'none' : 'none',
          position: 'absolute',
          content: '""',
          left: '-15px',
          top: '-10px',
          width: '2px',
          height: '100%',
          margin: '5px 0',
          borderRadius: '50%',
          opacity: 0.5,
        },

        '& .userAvatar': {
          transition: 'all 250ms',
          '&:hover': {
            opacity: 0.8,
            cursor: 'pointer',
          },
        },
      },
            
      '& .buzzArea': {
        position: 'relative',
        display: 'flex',
        width: '100%',
        // border: props => props.buzzThreads ? props.buzzThreads[2] ? '2px solid white' : 'none' : 'none',
        // margin: props => props.buzzThreads ? props.buzzThreads[2] ? 15 : 'none' : 'none',
        
        '&:after': {
          position: 'absolute',
          content: '""',
          left: '-15px',
          top: '-10px',
          width: '2px',
          height: '100%',
          margin: '5px 0',
          borderRadius: '50%',
          background: theme.font.color,
        },

        '& .userAvatar': {
          marginRight: 15,
          maxWidth: 'fit-content',
          transition: 'all 250ms',
          '&:hover': {
            opacity: 0.8,
            cursor: 'pointer',
          },
        },
        
      },

      '& .noMargin': {
        width: '100% !important',
        margin: '0 !important',
      },
    },

    '& .buzz_counter': {
      position: 'absolute',
      bottom: 15,
      right: 0,
      zIndex: 999,
      width: '2%',
    },
  },
  buzzCharCounter: {
    height: '100%',
    padding: 5,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  uploadProgressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: props => props.showBuzzTitle ? 'calc(100% - 58px)' : '100%',
    margin: '10px 0',
    float: 'right',

    '& .progressPercent': {
      fontWeight: 600,
      width: '10%',
      textAlign: 'center',
    },
  },
  linearProgress: {
    width: '90%',
    color: '#E61C34',
    height: 5,
    borderRadius: 5,
    marginRight: 15,
  },
  preparingVideo: {
    margin: '25px auto',
    width: 'fit-content',
    color: theme.font.color,
    fontSize: '1.2em',
    fontWeight: 600,
    textAlign: 'center',
    padding: '5px 25px',
    borderRadius: 50,
    backgroundColor: theme.context.view.backgroundColor,
    animation: 'showFade infinite 1.5s',
  },
}))


// const KeyCodes = {
//   comma: 188,
//   enter: 13,
// }

// const delimiters = [KeyCodes.comma, KeyCodes.enter]

const tooltips = {
  payout: `This is your max accept payout for THIS buzz. You can set different max payouts for each of your buzz's. If you set you payout to '0', any rewards will be sent to the @null account.`,
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: '#7D3B4A',
  [`& .MuiLinearProgress-barColorPrimary`]: {
    backgroundColor: '#E74B5D',
  },
}))

const CreateBuzzForm = (props) => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const isBuzzIntent = pathname.match(/^\/intent\/buzz/)

  const {
    user,
    uploadFileRequest,
    uploadVideoRequest,
    publishPostRequest,
    images,
    loading,
    publishing,
    modal = false,
    hideModalCallback = () => { },
    broadcastNotification,
    setPageFrom,
    payoutAgreed,
    intentBuzz,
    clearIntentBuzz,
    draftPost,
    savePostAsDraft,
    buzzModalStatus,
    setBuzzModalStatus,
    buzzThreads,
    buzzTitle,
    updateBuzzThreads,
    updateBuzzTitle,
    publishReplyRequest,
    setContentRedirect,
  } = props

  // states & refs
  const inputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [wordCount, setWordCount] = useState(0)
  const [payout, setPayout] = useState(1.000)
  const [buzzToTwitter, setBuzzToTwitter] = useState(false)
  const [openPayoutDisclaimer, setOpenPayoutDisclaimer] = useState(false)
  const [openGiphy, setOpenGiphy] = useState(false)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [emojiAnchorEl, setEmojianchorEl] = useState(null)
  const [overhead, setOverhead] = useState(0)
  const [open, setOpen] = useState(false)
  // eslint-disable-next-line
  const [compressing, setCompressing] = useState(false) 
  const [showBuzzTitle, setShowBuzzTitle] = useState(true)
  const [openDraftsModal, setOpenDraftsModal] = useState(false)
  const [openSaveDraftsModal, setOpenSaveDraftsModal] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const [videoLimit, setVideoLimit] = useState(false)
  
  
  // buzz states
  const [isThread, setIsThread] = useState(false)
  const [currentBuzz, setCurrentBuzz] = useState(1)
  const [threadCount, setThreadCount] = useState(buzzThreads ? Object.keys(buzzThreads).length : 1)
  const [nextBuzz, setNextBuzz] = useState(0)
  const [publishedBuzzes, setPublishedBuzzes] = useState(0)
  const [buzzData, setBuzzData] = useState(null)
  const [buzzLoading, setBuzzLoading] = useState(false)
  const [buzzing, setBuzzing] = useState(false)
  const [drafts, setDrafts] = useState(JSON.parse(localStorage.getItem('drafts'))?.length >= 1 ? JSON.parse(localStorage.getItem('drafts')) : [])
  const [draftData, setDraftData] = useState(null)
  const [selectedDraft, setSelectedDraft] = useState('')
  
  const {
    text = '',
    url = '',
    hashtags = '',
    origin_app_name = '',
    min_chars = 0,
  } = intentBuzz
  
  const params = queryString.parse(location.search) || ''
  const paramsBuzzText = params.text || ''
  const buzzIntentText = (text || paramsBuzzText)
  const wholeIntent = buzzIntentText ? `${buzzIntentText} ${url}` : ''
  const buzzIntentTags = []
  
  // buzz text box states, ref & style
  const buzzTextBoxRef = useRef(null)
  const [content, setContent] = useState(wholeIntent)
  const [tags, setTags] = useState(buzzIntentTags)
  const [buzzPreview, setBuzzPreview] = useState(true)
  const counterDefaultStyles = { color: "rgba(230, 28, 52, 0.2)", transform: content.length - overhead >= 260 && 'rotate(-85deg) scale(1.3)' }
  const [counterColor, setCounterColor] = useState('#e53935')
  const CircularProgressStyle = { ...counterDefaultStyles, float: 'right', color: counterColor }
  const BuzzToTwitterToggleStyle = { opacity: !buzzToTwitter ? 0.5 : 1 }
  // const [buzzTitle, setBuzzTitle] = useState('')
  const [buzzLength, setBuzzLength] = useState(content.length + buzzTitle.length - overhead)
  const [buzzRemainingChars, setBuzzRemaingChars] = useState(280 - (content.length + buzzTitle.length - overhead))
  const [buzzImages, setBuzzImages] = useState(0)
  const isVideoAttached = content.includes('dbuzz_video')
  
  // cursor state
  const [cursorPosition, setCursorPosition] = useState(null)
  
  // image states
  // eslint-disable-next-line
  const [imageSize, setImageSize] = useState(0)
  const [viewImageUrl, setViewImageUrl] = useState('')
  
  if (wholeIntent && hashtags) {
    const intentTags = hashtags.split(',')
    if (intentTags) {
      intentTags.forEach((item) => {
        buzzIntentTags.push({ id: item, text: item })
      })
    }
  }

  const classes = useStyles({showBuzzTitle, buzzThreads})
  
  let containerClass = classes.container
  let minRows = 2
  
  if (modal) {
    containerClass = classes.containerModal
    minRows = 5
  }

  const handleClickBuzz = () => {
    setContent('')
    const buzzId = buzzThreads ? Object.keys(buzzThreads).length + 1 : 1
    if(buzzThreads[buzzId-1].content !== '' && buzzThreads[1].content !== ''){
      createThread(buzzId, '', [])
      setThreadCount(buzzId)
    }
    if(!buzzModalStatus && !isMobile) {
      setBuzzModalStatus(true)
      setOpen(true)
    }
  }

  const handleBuzzTitleToggle = () => {
    if(showBuzzTitle === false) {
      setShowBuzzTitle(true)
    } else {
      setShowBuzzTitle(false)
    }
  }

  const handleDraftsModalOpen = () => {
    setDraftsModalStatus(true)
    setOpenDraftsModal(true)
  }

  const handleSaveDraftsModalOpen = () => {
    setSaveDraftsModalStatus(true)
    setOpenSaveDraftsModal(true)
    setDraftData({
      content: buzzThreads[1].content,
    })
  }

  const onHide = () => {
    setBuzzModalStatus(false)
    setOpen(false)
    if (isBuzzIntent) {
      history.push('/')
    }
  }

  const OnDraftsModalHide = () => {
    setDraftsModalStatus(false)
    setOpenDraftsModal(false)
  }

  const OnSaveDraftsModalHide = () => {
    setSaveDraftsModalStatus(false)
    setOpenSaveDraftsModal(false)
  }

  useEffect(() => {
    const overhead = calculateOverhead(content)

    setOverhead(overhead)

    const length = (content.length + buzzTitle.length) - overhead
    setWordCount(Math.floor((length / 280) * 100))

    // getting the draft post value from browser storage
    savePostAsDraft(localStorage.getItem('draft_post'))
    buzzThreads && setTags(extractAllHashtags(buzzThreads[1].content))
    // eslint-disable-next-line
  }, [content, buzzTitle, draftPost, images, savePostAsDraft])

  useEffect(() => {
    const length = (content.length + buzzTitle.length) - overhead

    if(length === 280) {
      setCounterColor('#E0245E')
    } else if(length > 280) {
      setCounterColor('transparent')
    } else if(length >= 260) {
      setCounterColor('#FFAD1F')
    } else {
      setCounterColor('#e53935')
    }
    // eslint-disable-next-line
  }, [content, buzzTitle])

  const closePayoutDisclaimer = () => {
    setOpenPayoutDisclaimer(false)
  }

  useEffect(() => {
    setBuzzLength(content.length + buzzTitle.length - overhead)
    setBuzzRemaingChars(280 - (content.length + buzzTitle.length - overhead))
    // eslint-disable-next-line
  }, [content, buzzTitle])

  useEffect(() => {
    if(buzzThreads) {
      setBuzzImages(buzzThreads[currentBuzz]?.images?.length)
    }
    // eslint-disable-next-line
  }, [buzzThreads])

  // dbuzz threads

  const createThread = (count, content, images) => {
    const buzzData = {}

    if(content === 'image'){
      buzzData[count] = {id: count, content: buzzThreads[count]?.content, images: images}
      updateBuzzThreads({...buzzThreads, ...buzzData})
    } else {
      buzzData[count] = {id: count, content: content, images: images}
      updateBuzzThreads({...buzzThreads, ...buzzData})
    }
  }

  const handleUpdateBuzz = (buzzId, content) => {
    if(buzzThreads !== null){
      createThread(buzzId, content, buzzThreads[buzzId]?.images)
      buzzId === 2 && setIsThread(true)
    }
  }

  const handleDeleteBuzz = (buzzId) => {
    delete buzzThreads[buzzId]
    const buzzData = {}
    let count = 0
    // count all buzzes and redefine ids
    Object.values(buzzThreads).map((buzz) => {
      count++
      buzzData[count] = {id: count, content: buzz.content}
      updateBuzzThreads({...buzzData})
      return null
    })
    setContent('')
    setThreadCount(threadCount-1)
    setCurrentBuzz(Object.keys(buzzThreads).length)
    buzzId === 2 && setIsThread(false)
  }

  const handleMaxPayout = (e) => {
    const { target } = e
    let { value } = target

    if (!payoutAgreed) {
      setOpenPayoutDisclaimer(true)
    } else {
      if ((value < 0 || `${value}`.trim() === '') && payout !== 0) {
        value = 0.00
      }
      value = value % 1 === 0 ? parseInt(value) : parseFloat(value)
      setPayout(value)
    }
  }

  const onChange = (e, draft, buzzId) => {
    const { target } = e
    const { name } = target
    const { value } = target

    if (name === 'content-area') {
      setContent(value)
    }
    setCurrentBuzz(buzzId)
    handleUpdateBuzz(buzzId, value)
  }

  const handleFileSelect = () => {
    const target = document.getElementById('file-upload')
    if (isMobile) {
      target.addEventListener('click', function () {
        const touch = new Touch({
          identifier: 'file-upload',
          target: target,
        })

        const touchEvent = new TouchEvent('touchstart', {
          touches: [touch],
          view: window,
          cancelable: true,
          bubbles: true,
        })

        target.dispatchEvent(touchEvent)
      })
    }
    inputRef.current.click()
  }

  const handleImageCompression = async (image) => {
    let compressedFile = null

    setImageUploading(true)
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    }
    try {
      compressedFile = await imageCompression(image, options)
    } catch (error) {
      console.log(error)
    }
    
    return compressedFile !== null && compressedFile
  }

  const handleFileSelectChange = async(event) => {
    const image = event.target.files[0]

    const fileSize = image.size / 1e+6

    setImageSize(Number(fileSize.toFixed(2)))

    setCompressing(true)

    await handleImageCompression(image).then((uri) => {
      setCompressing(false)
      setImageSize(Number((uri.size / 1e+6).toFixed(2)))
      uploadFileRequest(uri, setImageUploadProgress).then((image) => {
        setImageUploading(false)
        const lastImage = image[image.length - 1]
        if (lastImage !== undefined) {
          // const contentAppend = `${buzzThreads[currentBuzz]?.content} <br /> ${lastImage}`
          createThread(currentBuzz, 'image', [...buzzThreads[currentBuzz]?.images, lastImage])
          // setContent(contentAppend)
          document.getElementById('file-upload').value = ''
  
          // set the thread if its the thread
          if(Object.keys(buzzThreads).length > 1){
            setIsThread(true)
            setThreadCount(Object.keys(buzzThreads).length)
          }
          // savePostAsDraft(contentAppend)
          // savePostAsDraftToStorage(contentAppend)
          setImageSize(0)
        }
      }) 
    })


    // if(fileSize < 1){
    // }
    // else {
    //   setImageAlert(true)
    //   setTimeout(() => {
    //     setImageAlert(false)
    //   }, 5000)
    // }
  }

  const resetBuzzForm = () => {
    updateBuzzThreads({1: {id: 1, content: '', images:[]}})
    setContent('')
    setIsThread(false)
    setCurrentBuzz(1)
    setThreadCount(1)
    setNextBuzz(0)
    setPublishedBuzzes(0)
    setBuzzData(null)
    setBuzzLoading(false)
    setBuzzing(false)
  }

  const handlePublishThread = () => {
    const buzzContent = buzzThreads[nextBuzz]?.images?.length >= 1 ? buzzThreads[nextBuzz].content+'\n'+buzzThreads[nextBuzz]?.images.toString().replace(/,/gi, ' &nbsp; ') : buzzThreads[nextBuzz].content

    if(isThread) {
      setBuzzing(true)
      if(buzzThreads[nextBuzz]?.content !== '') {
        publishReplyRequest(buzzData?.author, buzzData?.permlink, buzzContent, 'list', 0)
          .then(({ success, errorMessage }) => {
            if(success) {
              setPublishedBuzzes(publishedBuzzes+1)
              setNextBuzz(nextBuzz+1)
              broadcastNotification('success', `Succesfully replied to @${buzzData?.author}/${buzzData?.permlink}`)
              setBuzzing(false)
              if(nextBuzz === threadCount){
                hideModalCallback()
                history.push(`/@${buzzData?.author}/c/${buzzData?.permlink}`)
                resetBuzzForm()
                setTimeout(() => {
                  window.location.reload(true)
                }, 3000)
              }
            } else {
              broadcastNotification('error', errorMessage)
            }
          })
      } else {
        setPublishedBuzzes(publishedBuzzes+1)
        setNextBuzz(nextBuzz+1)
        broadcastNotification('success', 'This buzz was skipped because it was empty!')
        setBuzzing(false)
        if(nextBuzz === threadCount){
          hideModalCallback()
          history.push(`/@${buzzData?.author}/c/${buzzData?.permlink}`)
          resetBuzzForm()
          setTimeout(() => {
            window.location.reload(true)
          }, 3000)
        }
      }
    }
  }

  const handleClickPublishPost = () => {
    // delete post from draft
    // savePostAsDraft("")
    // savePostAsDraftToStorage("")

    if (buzzToTwitter) {
      invokeTwitterIntent(content)
    }

    // eslint-disable-next-line
    const buzzContentWithTitle = buzzThreads[1]?.images?.length >= 1 ? `## ${buzzTitle} <br/>`+'\n'+buzzThreads[1].content+'\n'+buzzThreads[1]?.images.toString().replace(/,/gi, ' &nbsp; ') : `## ${buzzTitle} <br/>`+'\n'+buzzThreads[1].content
    const buzzContentWithoutTitle = buzzThreads[1]?.images?.length >= 1 ? buzzThreads[1].content+'\n'+buzzThreads[1]?.images.toString().replace(/,/gi, ' &nbsp; ') : buzzThreads[1].content
    const buzzContent = buzzTitle ? buzzContentWithTitle : buzzContentWithoutTitle

    if (!checkBuzzWidgetMinCharacters()) {
      broadcastNotification('error',`${origin_app_name} requires to buzz a minimum of ${parseInt(min_chars)} characters.`)
    } else {
      setBuzzLoading(true)
      setBuzzing(true)

      if(user.useHAS) {
        publishPostWithHAS(user, buzzContent, tags, payout)
          .then((data) => {
            console.log(data)
            setContentRedirect(data.content)

            hacMsg.subscribe(m => {
              if (m.type === 'sign_wait') {
                console.log('%c[HAC Sign wait]', 'color: goldenrod', m.msg? m.msg.uuid : null)
              }
              if (m.type === 'tx_result') {
                console.log('%c[HAC Sign result]', 'color: goldenrod', m.msg? m.msg : null)
                if (m.msg?.status === 'accepted') {
                  const status = m.msg?.status
                  console.log(status)
                  // success
                  const { author, permlink } = data
                  broadcastNotification('success', 'You successfully published a post')
                  setBuzzLoading(false)
                  setBuzzing(false)
                  updateBuzzTitle('')
                  clearIntentBuzz()
                  resetBuzzForm()
                  hideModalCallback()
                  history.push(`/@${author}/c/${permlink}`)
                } else if (m.msg?.status === 'rejected') {
                  const status = m.msg?.status
                  console.log(status)
                  // error
                  broadcastNotification('error', 'Your HiveAuth post transaction is rejected.')
                  setBuzzLoading(false)
                } else if (m.msg?.status === 'error') { 
                  const error = m.msg?.status.error
                  console.log(error)
                  broadcastNotification('error', 'Unknown error occurred, please try again in some time.')
                } 
              }
            })
          })
      } else {
        publishPostRequest(buzzContent, tags, payout)
          .then((data) => {
            if (data.success) {
              setPageFrom(null)
              const { author, permlink } = data
              // hideModalCallback()
              clearIntentBuzz()
              broadcastNotification('success', 'You successfully published a post')
              setPublishedBuzzes(1)
              setNextBuzz(2)
              setBuzzData({author: author, permlink: permlink})
              setBuzzing(false)
              updateBuzzTitle('')
  
              if(!isThread) {
                hideModalCallback()
                resetBuzzForm()
                history.push(`/@${author}/c/${permlink}`)
              }
            } else {
              broadcastNotification('error', data.errorMessage)
              setBuzzLoading(false)
            }
          })
      }
    }
  }

  const checkBuzzWidgetMinCharacters = () => {
    let passed = true
    if (buzzIntentText) {
      const len = content.length
      if (parseInt(min_chars) > 0) {
        if (parseInt(len) < parseInt(min_chars)) {
          passed = false
        }
      }
    }
    return passed
  }

  // const handleDelete = (i) => {
  //   setTags(tags.filter((tag, index) => index !== i))
  // }

  // const handleAddition = (tag) => {
  //   tag.id = tag.id.split(' ').join('')
  //   tag.text = tag.text.split(' ').join('')
  //   tag.text = tag.text.replace('#', '')
  //   setTags([...tags, tag])
  // }

  // const handleDrag = (tag, currPos, newPos) => {
  //   const tagsArray = [...tags]
  //   const newTags = tagsArray.slice()

  //   newTags.splice(currPos, 1)
  //   newTags.splice(newPos, 0, tag)

  //   setTags(newTags)
  // }

  const handleClickContent = (e) => {
    try {
      const { target } = e
      let { href } = target
      const hostname = window.location.hostname

      e.preventDefault()
      if (href && !href.includes(hostname)) {
        window.open(href, '_blank')
      } else {
        const split = `${href}`.split('#')
        if (split.length === 2) {
          href = `${split[1]}`
        } else {
          const split = `${href}`.split('/')
          href = split[3] ? `/${split[3]}` : '/'
        }
        if (href !== '' && href !== undefined) {
          history.push(href)
        }
      }
    } catch (e) {}
  }

  const closeGiphy = () => {
    setOpenGiphy(false)
  }

  const handleOpenGiphy = () => {
    setOpenGiphy(!openGiphy)
  }

  const handleSelectGif = (gif) => {
    if (gif) {
      const contentAppend = `${buzzThreads[currentBuzz]?.content} \n <br /> ${gif}`
      createThread(currentBuzz, contentAppend, buzzThreads[currentBuzz]?.images)
      setContent(contentAppend)
    }
  }

  const handleOpenEmojiPicker = (e) => {
    setOpenEmojiPicker(!openEmojiPicker)
    setEmojianchorEl(e.currentTarget)
  }

  const handleCloseEmojiPicker = () => {
    setOpenEmojiPicker(false)
    setEmojianchorEl(null)
  }

  const handleSelectEmoticon = (emoticon) => {
    if (emoticon) {
      const cursor = cursorPosition
      const contentAppend = buzzThreads[currentBuzz].content.slice(0, cursor) + emoticon + buzzThreads[currentBuzz].content.slice(cursor)
      createThread(currentBuzz, contentAppend, buzzThreads[currentBuzz]?.images)
      setContent(contentAppend)

      emoticon.length === 2 && setCursorPosition(cursorPosition+2)
      emoticon.length === 4 && setCursorPosition(cursorPosition+4)
      // savePostAsDraft(contentAppend)
      // savePostAsDraftToStorage(contentAppend)
    }
  }

  const extractAllHashtags = (value) => {
    let hashtags = value.match(/(?![^()]*\))(?![^[\]]*])#([\w\d!@%^&*)(+=._-]+)/gi)

    if(hashtags === null)  {
      hashtags = []
    } else {
      hashtags = hashtags.map((item) => item.replace("#", ''))
    }

    return hashtags
  }

  useEffect(() => {
    // setup an empty thread on page load
    if(!buzzThreads){
      setIsThread(false)
      createThread(1, '', [])
      setCurrentBuzz(1)
      setThreadCount(1)
    }

    // clear content when buzz is discarded
    if(buzzThreads){
      if(buzzThreads[1]?.content === ''){
        content && setContent('')
        setCurrentBuzz(1)
        setThreadCount(1)
        localStorage.setItem('emptyBuzz', true)
      } else {
        localStorage.setItem('emptyBuzz', false)
      }
    }
  // eslint-disable-next-line
  }, [buzzThreads])

  useEffect(() => {
    if(selectedDraft !== '') {
      handleUpdateBuzz(1, selectedDraft)
    }
  // eslint-disable-next-line
  }, [selectedDraft])

  const checkInDrafts = () => {
    let found = false
    drafts.forEach(draft => {
      if(buzzThreads) {
        if(draft.content === buzzThreads[1]?.content) {
          found = true
        }
      }
    })

    return found
  }

  const handleVideoSelect = () => {
    const target = document.getElementById('video-upload')
    if (isMobile) {
      target.addEventListener('click', function () {
        const touch = new Touch({
          identifier: 'video-upload',
          target: target,
        })

        const touchEvent = new TouchEvent('touchstart', {
          touches: [touch],
          view: window,
          cancelable: true,
          bubbles: true,
        })

        target.dispatchEvent(touchEvent)
      })
    }
    videoInputRef.current.click()
  }

  const handleVideoUpload = (e) => {

    const file = e.target.files[0]
    const video = document.createElement('video')
    video.preload = 'metadata'

    if(file) {
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        var duration = video.duration
        setVideoUploading(true)
  
        // console.log(file);
        
        if(duration <= 60 && file.size <= 150000000) {
          uploadVideoRequest(file, setVideoUploadProgress)
            .then(video => {
              setVideoUploading(false)
              if(video.toString() !== 'Error: Network Error') {
                setVideoLimit(true)
                createThread(currentBuzz, 'image', [...buzzThreads[currentBuzz]?.images, `https://ipfs.io/ipfs/${video}?dbuzz_video`])
              } else {
                broadcastNotification('error', 'Video upload failed, please try re-uploading!')
              }
            })
        } else {
          setVideoUploading(false)
          broadcastNotification('error', 'Video should be 60 seconds or less.')
        }
      }
    
      video.src = URL.createObjectURL(file)
    }
  }

  return (
    <div className={containerClass}>
      {!buzzModalStatus && buzzThreads && buzzThreads[1].content && !isMobile &&
      <div className={classes.draftsContainer}>
        <span className='save_draft_button' onClick={handleSaveDraftsModalOpen} hidden={checkInDrafts()}>save draft</span>
      </div>}
      {!buzzLoading &&
        <div className={classes.row}>
          <div className={classNames(classes.inline, classes.right)}>
            {publishing && (
              <div style={{ width: '100%', paddingTop: 10 }}>
                <Box position='relative' display='inline-flex'>
                  <Spinner top={0} size={20} loading={publishing} />
                  &nbsp;
                  <label className={classes.actionLabels}>
                    broadcasting your buzz to the network, please wait ...
                  </label>
                  &nbsp;
                </Box>
              </div>
            )}
            {!publishing && (
              <span className={classes.buzzBox}>
                {showBuzzTitle &&
                  <div className={classes.titleBox} tabindex={0}>
                    <Avatar author={user.username} className='userAvatar' onClick={() => window.location = `${window.location.origin}/@${user.username}`}/>
                    <span className="titleContainer">
                      <input type='text' maxLength={60} placeholder='Buzz title' value={buzzTitle} onChange={e => updateBuzzTitle(e.target.value)} />
                      {buzzTitle && <span className='counter'>{buzzTitle.length}/60</span>}
                    </span>
                  </div>}
                <div className={classes.buzzTextBox}>
                  <span className='buzzBoxes'>
                    {!buzzThreads && (
                      <TextArea
                        buzzId={1}
                        name='content-area'
                        maxLength={220 + (60 - buzzTitle.length) + overhead}
                        minRows={minRows}
                        value={content}
                        onKeyDown={e => onChange(e, "draftPost", 1)}
                        onChange={e => onChange(e, "draftPost", 1)}
                        onPaste={e => onChange(e, "draftPost", 1)}
                      />
                    )}
                    {buzzThreads &&
                      Object.values(buzzThreads).map(item => (
                        <span key={item.id} style={{position: 'relative', width: '100%'}}>
                          {item.content === '' && item.id !== 1 && 
                            <IconButton className={classes.closeBuzzButton} onClick={() => handleDeleteBuzz(item.id)}>
                              <CloseIcon />
                            </IconButton>}
                          <span className={`buzzArea buzzArea${item.id} ${showBuzzTitle === false ? 'noMargin' : ''}`}>
                            {item.id === 1 && showBuzzTitle === false && <Avatar className='userAvatar' author={user.username} style={{width: showBuzzTitle === false ? 'fit-content' : 'inherit'}} onClick={() => window.location = `${window.location.origin}/@${user.username}`}/>}
                            {item.id !== 1 && <Avatar className='userAvatar' author={user.username} onClick={() => window.location = `${window.location.origin}/@${user.username}`} />}
                            <TextArea
                              ref={buzzTextBoxRef}
                              buzzId={item.id}
                              name='content-area'
                              maxLength={220 + (60 - buzzTitle.length) + overhead}
                              minRows={minRows}
                              value={item.content}
                              onKeyUp={e => {
                                onChange(e, "draftPost", item.id)
                                setCursorPosition(e.target.selectionStart)
                              }}
                              onKeyDown={e => {
                                onChange(e, "draftPost", item.id)
                                setCursorPosition(e.target.selectionStart)
                              }}
                              onChange={e => onChange(e, "draftPost", item.id)}
                              onPaste={e => onChange(e, "draftPost", item.id)}
                              // autoFocus
                              onFocus={(e) => {
                                setContent(item.content)
                                setCurrentBuzz(item.id)
                              }}
                              onClick={(e) => {
                                setCursorPosition(e.target.selectionStart)
                              }}
                            />
                          </span>
                        </span>))}
                  </span>
                  {content && 
                    <div>
                      <Box
                        className={classes.buzzCharCounter}
                        style={{ float: 'right', paddingTop: 10}}
                        position='relative'
                        display='inline-flex'
                      >
                        <div className={classes.characterCounterBg}>
                          <CircularProgress
                            className={classes.circleBg}
                            size={30}
                            value={100}
                            variant='static'
                            style={counterDefaultStyles}
                          />
                        </div>
                        <div className={classes.characterCounter}>
                          <CircularProgress
                            className='countProgressBar'
                            style={CircularProgressStyle}
                            classes={{
                              circle: classes.circle,
                            }}
                            size={30}
                            value={wordCount}
                            variant='static'
                          />
                          {buzzLength >= 260 && <p className={classes.counter}>{buzzRemainingChars}</p>}
                        </div>
                      </Box>
                    </div>}
                </div>
              </span>)}
            {imageUploading && (
              <div style={{ width: '100%', paddingTop: 5 }}>
                <div className={classes.uploadProgressBar}>
                  <BorderLinearProgress className={classes.linearProgress} variant='determinate' value={imageUploadProgress} />
                  <span className='progressPercent' style={{color: 'white'}}>{imageUploadProgress}%</span>
                </div>
              </div>
            )}
            {videoUploading && (
              <div style={{ width: '100%', paddingTop: 5 }}>
                {videoUploadProgress !== 100 ?
                  <div className={classes.uploadProgressBar}>
                    <BorderLinearProgress className={classes.linearProgress} variant='determinate' value={videoUploadProgress} />
                    <span className='progressPercent' style={{color: 'white'}}>{videoUploadProgress}%</span>
                  </div> :
                  <div className={classes.preparingVideo}>Preparing Video</div>}
              </div>
            )}

            {/* IMAGES ROW */}
            {buzzThreads && buzzThreads[currentBuzz]?.images?.length >= 1 && (
              <ImagesContainer buzzId={currentBuzz} buzzImages={buzzThreads[currentBuzz]?.images} viewFullImage={setViewImageUrl} showBuzzTitle={showBuzzTitle} setVideoLimit={setVideoLimit}/>
            )}

            {!publishing && (
              <div className={classes.buzzCustomizeOptions}>
                <span>
                  <input
                    id='file-upload'
                    type='file'
                    name='image'
                    accept='image/*'
                    multiple={false}
                    ref={inputRef}
                    onChange={handleFileSelectChange}
                    hidden
                  />
                  <Tooltip title="Image" placement='top-start'>
                    <IconButton
                      size='medium'
                      onClick={handleFileSelect}
                      disabled={isVideoAttached || imageUploading || videoUploading}
                      classes={{
                        root: classes.root,
                        disabled: classes.disabled,
                      }}
                    >
                      <UploadIcon />
                    </IconButton>
                  </Tooltip>
                  <input
                    id='video-upload'
                    type='file'
                    name='video'
                    accept='video/*'
                    multiple={false}
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    hidden
                  />
                  <Tooltip title="Video" placement='top-start'>
                    <IconButton size='medium' onClick={handleVideoSelect} disabled={isVideoAttached || videoUploading || imageUploading || videoLimit} classes={{ disabled: classes.disabled }}>
                      <VideoUploadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="GIF" placement='top-start'>
                    <IconButton size='medium' onClick={handleOpenGiphy} disabled={isVideoAttached} classes={{ disabled: classes.disabled }}>
                      <GifIcon />
                    </IconButton>
                  </Tooltip>
                  {!isMobile &&
                  <Tooltip title="Emoji" placement='top-start'>
                    <IconButton style={{ backgroundColor: openEmojiPicker ? '#D3D3D3' : ''}} size='medium' onClick={handleOpenEmojiPicker}>
                      <EmojiIcon />
                    </IconButton>
                  </Tooltip>}
                  <Tooltip title="Buzz Title" placement='top-start'>
                    <IconButton style={{ backgroundColor: showBuzzTitle ? '#D3D3D3' : ''}} size='medium' onClick={handleBuzzTitleToggle}>
                      <TitleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Drafts" placement='top-start'>
                    <IconButton size='medium' onClick={handleDraftsModalOpen}>
                      <DraftsIcon />
                    </IconButton>
                  </Tooltip>
                </span>
                {content.length !== 0 &&
                  <span className={classes.previewTitle}>
                    Buzz preview
                    <Switch size={25} state={buzzPreview} onChange={setBuzzPreview} />
                  </span>}
              </div>
            )}
            <div className={classes.buzzPublishingOptions}>
              <span className='buzzPublishingOptions__r1'>
                <div className={classes.buzzOptions}>
                  <span className='title'>ALSO BUZZ TO</span>
                  <span className='titter buzzToToggle'>
                    <div
                      className={classes.buzzToTwitterToggle}
                      style={{...BuzzToTwitterToggleStyle}}
                      onClick={() => setBuzzToTwitter(!buzzToTwitter)}
                    >
                      <img className='icon' src={`${window.location.origin}/twitter-icon.svg`} alt="twitter-icon" />
                      {/* <div className='title'>Buzz to Twitter</div> */}
                    </div>
                  </span>
                </div>
                <div className={classes.maxPayoutOption}>
                  <span className={classes.payoutLabel}>Max Payout: </span>
                  <input
                    name='max-payout'
                    className={classes.tinyInput}
                    type='number'
                    onChange={handleMaxPayout}
                    value={payout}
                    required
                    min='0'
                    step='any'
                  />
                  {!isMobile && (
                    <Tooltip title={tooltips.payout} placement='top'>
                      <HelpIcon classes={{ root: classes.icon }} fontSize='small' />
                    </Tooltip>
                  )}
                </div>
                <div className={classes.publishBuzzOption}>
                  {content && 
                    <div style={{display: 'inline-flex'}}>
                      <div className={classes.addThreadIcon}><AddIcon onClick={handleClickBuzz} /></div>
                      <div className={classes.colDivider}> </div>
                    </div>}
                  <ContainedButton
                    // eslint-disable-next-line
                    disabled={loading || publishing || (content.length === 0 && buzzImages === 0) || buzzRemainingChars < 0}
                    label={buzzThreads ? Object.keys(buzzThreads).length > 1 ? 'Buzz all' : 'Buzz' : 'Buzz'}
                    style={{margin: 0}}
                    onClick={handleClickPublishPost}
                  />
                </div>
              </span>
              <span className='buzzPublishingOptions__r2'>
                {content.length !== 0 && isMobile &&
                  <span className={classes.previewTitleMobile}>
                    Buzz preview
                    <Switch size={25} state={buzzPreview} onChange={setBuzzPreview} />
                  </span>}
              </span>
            </div>
            <div>
              <React.Fragment>
                {content.length !== 0 && buzzPreview && (
                  <div className={classes.previewContainer} onClick={handleClickContent}>
                    <Renderer content={buzzTitle ? `## ${buzzTitle} <br/>\n` + content : content} minifyAssets={false} />
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>
          <div className={classes.publishBuzzOptionMobile}>
            {content && 
              <div style={{display: 'inline-flex'}}>
                <div className={classes.addThreadIcon}><AddIcon onClick={handleClickBuzz} /></div>
                <div className={classes.colDivider}> </div>
              </div>}
            <ContainedButton
              // eslint-disable-next-line
              disabled={loading || publishing || (content.length === 0 && buzzImages === 0) || buzzRemainingChars < 0}
              label={buzzThreads ? Object.keys(buzzThreads).length > 1 ? 'Buzz all' : 'Buzz' : 'Buzz'}
              style={{margin: 0}}
              onClick={handleClickPublishPost}
            />
          </div>
        </div>}
      {buzzLoading &&
        <div className={classes.loadingContainer}>
          <img src={`${window.location.origin}/images/d.buzz-icon-512.png`} alt='buzzLoading'/>
          <span className='title'>Broadcasting your {isThread ? 'thread' : 'buzz'}...</span>
          {/* {isThread && <span>This can take upto 5-10 secs</span>} */}
          {isThread && <button className={classes.publishThreadButton} onClick={handlePublishThread} disabled={buzzing}>Buzz {publishedBuzzes} of {threadCount} <ArrowForwardRoundedIcon style={{marginLeft: 8}}/></button>}
        </div>}
      <EmojiPicker
        open={openEmojiPicker}
        anchorEl={emojiAnchorEl}
        handleClose={handleCloseEmojiPicker}
        handleAppendContent={handleSelectEmoticon}
      />
      <GiphySearchModal
        show={openGiphy}
        onHide={closeGiphy}
        handleAppendContent={handleSelectGif}
      />
      <PayoutDisclaimerModal
        show={openPayoutDisclaimer}
        onHide={closePayoutDisclaimer}
      />
      <BuzzFormModal show={open} onHide={onHide} setContent={setContent} buzzThreads={buzzThreads} />
      <ViewImageModal imageUrl={viewImageUrl} show={viewImageUrl} onHide={setViewImageUrl} />
      <DraftsModal show={openDraftsModal} onHide={OnDraftsModalHide} drafts={drafts} setDrafts={setDrafts} setSelectedDraft={setSelectedDraft} />
      <SaveDraftModal show={openSaveDraftsModal} onHide={OnSaveDraftsModalHide} drafts={drafts} setDrafts={setDrafts} draftData={draftData} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  images: state.posts.get('images'),
  loading: pending(state, 'UPLOAD_FILE_REQUEST'),
  publishing: pending(state, 'PUBLISH_POST_REQUEST'),
  payoutAgreed: state.auth.get('payoutAgreed'),
  intentBuzz: state.auth.get('intentBuzz'),
  draftPost: state.posts.get('draftPost'),
  buzzModalStatus: state.interfaces.get('buzzModalStatus'),
  buzzThreads: state.posts.get('buzzThreads'),
  buzzTitle: state.posts.get('buzzTitle'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      uploadFileRequest,
      uploadVideoRequest,
      publishPostRequest,
      setPageFrom,
      broadcastNotification,
      clearIntentBuzz,
      savePostAsDraft,
      setBuzzModalStatus,
      updateBuzzThreads,
      updateBuzzTitle,
      publishReplyRequest,
      setBuzzTitleModalStatus,
      setDraftsModalStatus,
      setSaveDraftsModalStatus,
      setContentRedirect,
    },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBuzzForm)