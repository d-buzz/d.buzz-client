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
} from 'components/elements'
import { clearIntentBuzz } from 'store/auth/actions'
import { broadcastNotification } from 'store/interface/actions'
import { MarkdownViewer, PayoutDisclaimerModal, GiphySearchModal, EmojiPicker} from 'components'
import { bindActionCreators } from 'redux'
import { uploadFileRequest,  publishPostRequest,  setPageFrom, savePostAsDraft, updateBuzzThreads, publishReplyRequest } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// import { WithContext as ReactTags } from 'react-tag-input'
import { isMobile } from 'react-device-detect'
import FormCheck from 'react-bootstrap/FormCheck'
import { invokeTwitterIntent, calculateOverhead } from 'services/helper'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { setBuzzModalStatus } from 'store/interface/actions'
import { BuzzFormModal } from 'components'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from 'components/elements/Icons/CloseIcon'
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded'

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
    width: '98%',
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
    width: 'calc(100% - 65px)',
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
    paddingTop: 10,
    width: '100%',
    height: 'max-content',
    paddingBottom: 10,
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
    backgroundColor: 'lightgray !important',
  },
  previewTitle: {
    ...theme.preview.title,
  },
  separator: {
    height: 0,
    width: '100%',
    border: theme.border.primary,
  },
  tinyInput: {
    height: 25,
    width: 50,
    marginLeft: 5,
    border: '1px solid lightgray',
    borderRadius: 5,
  },
  payoutLabel: {
    ...theme.font,
    fontSize: 15,
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
    cursor: 'pointer',
    marginLeft: 2,
    marginBottom: 5,
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
    marginTop: 2,
    marginRight: 10,
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
}))

// const KeyCodes = {
//   comma: 188,
//   enter: 13,
// }

// const delimiters = [KeyCodes.comma, KeyCodes.enter]

const tooltips = {
  payout: `This is your max accept payout for THIS buzz. You can set different max payouts for each of your buzz's. If you set you payout to '0', any rewards will be sent to the @null account.`,
}

const CreateBuzzForm = (props) => {
  const classes = useStyles()
  const inputRef = useRef(null)
  const [wordCount, setWordCount] = useState(0)
  const [payout, setPayout] = useState(1.000)
  const [buzzToTwitter, setBuzzToTwitter] = useState(false)
  const [openPayoutDisclaimer, setOpenPayoutDisclaimer] = useState(false)
  const [openGiphy, setOpenGiphy] = useState(false)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [emojiAnchorEl, setEmojianchorEl] = useState(null)
  const [overhead, setOverhehad] = useState(0)
  const [open, setOpen] = useState(false)
  const [isThread, setIsThread] = useState(false)
  const [currentBuzz, setCurrentBuzz] = useState(1)
  const [threadCount, setThreadCount] = useState(1)
  const [nextBuzz, setNextBuzz] = useState(0)
  const [publishedBuzzes, setPublishedBuzzes] = useState(0)
  const [buzzData, setBuzzData] = useState(null)
  const [buzzLoading, setBuzzLoading] = useState(false)
  const [buzzing, setBuzzing] = useState(false)

  const location = useLocation()
  const history = useHistory()
  const { pathname } = location
  const isBuzzIntent = pathname.match(/^\/intent\/buzz/)

  const params = queryString.parse(location.search) || ''
  const paramsBuzzText = params.text || ''
  const {
    user,
    uploadFileRequest,
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
    updateBuzzThreads,
    publishReplyRequest,
  } = props

  const {
    text = '',
    url = '',
    hashtags = '',
    origin_app_name = '',
    min_chars = 0,
  } = intentBuzz
  const buzzIntentText = (text || paramsBuzzText)
  const wholeIntent = buzzIntentText ? `${buzzIntentText} ${url}` : ''
  const buzzIntentTags = []
  if (wholeIntent && hashtags) {
    const intentTags = hashtags.split(',')
    if (intentTags) {
      intentTags.forEach((item) => {
        buzzIntentTags.push({ id: item, text: item })
      })
    }
  }

  const [content, setContent] = useState(wholeIntent)
  const [tags, setTags] = useState(buzzIntentTags)

  const [counterColor, setCounterColor] = useState('#e53935')
  const counterDefaultStyles = { color: "rgba(230, 28, 52, 0.2)", transform: content.length >= 260 && 'rotate(-85deg) scale(1.3)' }
  const CircularProgressStyle = { ...counterDefaultStyles, float: 'right', color: counterColor }

  console.log({ tags })

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
      createThread(buzzId, '')
    }
    if(!buzzModalStatus) {
      setBuzzModalStatus(true)
      setOpen(true)
    }
  }

  const onHide = () => {
    setBuzzModalStatus(false)
    setOpen(false)
    if (isBuzzIntent) {
      history.push('/')
    }
  }

  useEffect(() => {
    const overhead = calculateOverhead(content)

    setOverhehad(overhead)

    const length = content.length - overhead
    setWordCount(Math.floor((length / 280) * 100))

    // getting the draft post value from browser storage
    savePostAsDraft(localStorage.getItem('draft_post'))
    setTags(extractAllHashtags(draftPost || content))
  }, [content, draftPost, images, savePostAsDraft])

  useEffect(() => {
    if(content.length === 280) {
      setCounterColor('#E0245E')
    } else if(content.length >= 260) {
      setCounterColor('#FFAD1F')
    } else {
      setCounterColor('#e53935')
    }
  }, [content])

  const closePayoutDisclaimer = () => {
    setOpenPayoutDisclaimer(false)
  }

  // const savePostAsDraftToStorage = (content) => {
  //   localStorage.setItem('draft_post', content)
  // }

  // const clearDraft = () => {
  //   setContent('')
  //   savePostAsDraft('')
  //   savePostAsDraftToStorage('')
  // }

  // dbuzz threads

  const createThread = (count, content) => {
    const buzzData = {}
    buzzData[count] = {id: count, content: content}
    updateBuzzThreads({...buzzThreads, ...buzzData})
  }

  const handleAddBuzz = (buzzId, content) => {
    if(buzzThreads !== null){
      createThread(buzzId, content)
      setThreadCount(buzzId)
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
      // if (e?.clipboardData?.files?.length) {
      //   const fileObject = e.clipboardData.files[0]
      //   uploadFileRequest(fileObject).then((image) => {
      //     const value = image[image.length - 1]
      //     if (value !== undefined) {
      //       const contentAppend = `${buzzThreads[currentBuzz].content} <br /> ![](${value})`
      //       createThread(currentBuzz, contentAppend)
      //       setContent(contentAppend)

      //       // savePostAsDraft(contentAppend)
      //       // savePostAsDraftToStorage(contentAppend)
      //     }
      //   })
      // }
      setContent(value)
    }
    // else if (name === 'max-payout') {
    //   if (!payoutAgreed) {
    //     setOpenPayoutDisclaimer(true)
    //   } else {
    //     if ((value < 0 || `${value}`.trim() === '') && payout !== 0) {
    //       value = 0.00
    //     }
    //     value = value % 1 === 0 ? parseInt(value) : parseFloat(value)
    //     setPayout(value)
    //   }
    // } 
    // else if (name === 'buzz-to-twitter') {
    //   setBuzzToTwitter(!buzzToTwitter)
    // }

    // if(draft === "draftPost"){
    //   // setting the redux state to post content
    //   savePostAsDraft(value)
    //   // storing the state value in the browser storage
    //   savePostAsDraftToStorage(value)
    // }
    setCurrentBuzz(buzzId)
    handleAddBuzz(buzzId, value)
  }

  // const updateCounter = (e) => {
  //   onChange(e, "draftPost")
  //   const countProgress = document.querySelector('.countProgress')
  //   // changing progress color based on content length
  //   if(content.length === 280) {
  //     countProgress.style.color = '#E0245E'
  //   } else if(content.length >= 260) {
  //     countProgress.style.color = '#FFAD1F'
  //   } else {
  //     countProgress.style.color = '#e53935'
  //   }
  // }

  // const handleFileSelect = () => {
  //   const target = document.getElementById('file-upload')
  //   if (isMobile) {
  //     target.addEventListener('click', function () {
  //       const touch = new Touch({
  //         identifier: 'file-upload',
  //         target: target,
  //       })

  //       const touchEvent = new TouchEvent('touchstart', {
  //         touches: [touch],
  //         view: window,
  //         cancelable: true,
  //         bubbles: true,
  //       })

  //       target.dispatchEvent(touchEvent)
  //     })
  //   }
  //   target.click()
  // }

  const handleFileSelectChange = (event) => {
    const files = event.target.files[0]
    uploadFileRequest(files).then((image) => {
      const lastImage = image[image.length - 1]
      if (lastImage !== undefined) {
        const contentAppend = `${buzzThreads[currentBuzz]?.content} <br /> ![](${lastImage})`
        createThread(currentBuzz, contentAppend)
        setContent(contentAppend)
        document.getElementById('file-upload').value = ''

        // set the thread if its the thread
        if(Object.keys(buzzThreads).length > 1){
          setIsThread(true)
          setThreadCount(Object.keys(buzzThreads).length)
        }
        // savePostAsDraft(contentAppend)
        // savePostAsDraftToStorage(contentAppend)
      }
    })
  }

  const resetBuzzForm = () => {
    updateBuzzThreads({1: {id: 1, content: ''}})
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
    if(isThread) {
      setBuzzing(true)
      if(buzzThreads[nextBuzz]?.content !== '') {
        publishReplyRequest(buzzData?.author, buzzData?.permlink, buzzThreads[nextBuzz]?.content, 'list', 0)
          .then(({ success, errorMessage }) => {
            if(success) {
              setPublishedBuzzes(publishedBuzzes+1)
              setNextBuzz(nextBuzz-1)
              broadcastNotification('success', `Succesfully replied to @${buzzData?.author}/${buzzData?.permlink}`)
              setBuzzing(false)
              if(nextBuzz === 2){
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
        setNextBuzz(nextBuzz-1)
        broadcastNotification('success', 'This buzz was skipped because it was empty!')
        setBuzzing(false)
        if(nextBuzz === 2){
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

    if (!checkBuzzWidgetMinCharacters()) {
      broadcastNotification('error',`${origin_app_name} requires to buzz a minimum of ${parseInt(min_chars)} characters.`)
    } else {
      setBuzzLoading(true)
      setBuzzing(true)
      publishPostRequest(buzzThreads[1].content, tags, payout)
        .then((data) => {
          if (data.success) {
            setPageFrom(null)
            const { author, permlink } = data
            // hideModalCallback()
            clearIntentBuzz()
            broadcastNotification('success', 'You successfully published a post')
            setPublishedBuzzes(1)
            setNextBuzz(threadCount)
            setBuzzData({author: author, permlink: permlink})
            setBuzzing(false)

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

  const moveCaretAtEnd = (e) => {
    var temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  const closeGiphy = () => {
    setOpenGiphy(false)
  }

  const handleOpenGiphy = () => {
    setOpenGiphy(!openGiphy)
  }

  const handleSelectGif = (gif) => {
    if (gif) {
      const contentAppend = `${buzzThreads[currentBuzz]?.content} <br /> ${gif}`
      createThread(currentBuzz, contentAppend)
      setContent(contentAppend)
      // savePostAsDraft(contentAppend)
      // savePostAsDraftToStorage(contentAppend)
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
      const contentAppend = `${content}${emoticon}`
      createThread(currentBuzz, contentAppend)
      setContent(contentAppend)
      // savePostAsDraft(contentAppend)
      // savePostAsDraftToStorage(contentAppend)
    }
  }

  const extractAllHashtags = (value) => {
    let hashtags = value.match(/#\w+/g)

    if(hashtags === null)  {
      hashtags = []
    } else {
      hashtags = hashtags.map((item) => item.replace("#", ''))
    }

    return hashtags
  }

  // useEffect(() => {
  //   if(buzzThreads){
  //     // console.log(Object.values(buzzThreads))
  //   }
  // }, [buzzThreads])

  // useEffect(() => {
  //   alert(currentBuzz)
  // }, [currentBuzz])

  useEffect(() => {
    // setup an empty thread on page load
    if(!buzzThreads){
      setIsThread(false)
      createThread(1, '')
      setCurrentBuzz(1)
      setThreadCount(1)
    }

    // clear content when buzz is discarded
    if(buzzThreads){
      if(buzzThreads[1]?.content === ''){
        content && setContent('')
        setCurrentBuzz(1)
        setThreadCount(1)
      }
    }
  // eslint-disable-next-line
  }, [buzzThreads])

  return (
    <div className={containerClass}>
      {!buzzLoading &&
        <div className={classes.row}>
          <div className={classNames(classes.inline, classes.left)}>
            <Avatar author={user.username} />
          </div>
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
            {!publishing && !loading && (
              <span>
                {!buzzThreads && (
                  <TextArea
                    buzzId={1}
                    name='content-area'
                    maxLength={280 + overhead}
                    minRows={minRows}
                    value={content}
                    onKeyDown={e => onChange(e, "draftPost", 1)}
                    onChange={e => onChange(e, "draftPost", 1)}
                    onPaste={e => onChange(e, "draftPost", 1)}
                    autoFocus
                    onFocus={moveCaretAtEnd}
                  />
                )}
                {buzzThreads &&
                Object.values(buzzThreads).map(item => (
                  <span key={item.id} style={{position: 'relative'}}>
                    {item.content === '' && item.id !== 1 && 
                    <IconButton className={classes.closeBuzzButton} onClick={() => handleDeleteBuzz(item.id)}>
                      <CloseIcon />
                    </IconButton>}
                    <TextArea
                      buzzId={item.id}
                      name='content-area'
                      maxLength={280 + overhead}
                      minRows={minRows}
                      value={item.content}
                      onKeyDown={e => onChange(e, "draftPost", item.id)}
                      onChange={e => onChange(e, "draftPost", item.id)}
                      onPaste={e => onChange(e, "draftPost", item.id)}
                      autoFocus
                      onFocus={(e) => {
                        moveCaretAtEnd(e)
                        setContent(item.content)
                        setCurrentBuzz(item.id)
                      }}
                    />
                  </span>
                ))}
              </span>
            )}
            {/* {draftPost && (
              <span className={classes.draftPostContainer} onClick={clearDraft}>
                <p className={classes.draftPostLabel}><ClearIcon size={20} className={classes.clearDraftIcon} /> draft</p>
              </span>
            )} */}
            <br />
            <br />
            <label className={classes.payoutLabel}>Max Payout: </label>
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
            <FormCheck
              name='buzz-to-twitter'
              type='checkbox'
              label='Buzz to Twitter'
              checked={buzzToTwitter}
              onChange={() => setBuzzToTwitter(!buzzToTwitter)}
              className={classNames(classes.checkBox, classes.label)}
            />
            {buzzToTwitter && (
              <label className={classes.payoutNote}>
                Twitter intent will open after you click <b>Buzz</b>
              </label>
            )}
            <br />
            {/* {!publishing && content.length !== 0 && (
              <div style={{ width: '100%', paddingBottom: 5 }}>
                <ReactTags
                  placeholder='Add tags'
                  tags={tags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  delimiters={delimiters}
                  autofocus={false}
                />
              </div>
            )} */}
            {loading && (
              <div style={{ width: '100%', paddingTop: 5 }}>
                <Box position='relative' display='inline-flex'>
                  <Spinner top={-10} size={20} loading={loading} />
                  &nbsp;
                  <label className={classes.actionLabels}>
                    uploading image, please wait ...
                  </label>
                  &nbsp;
                </Box>
              </div>
            )}
            {content.length !== 0 && (
              <div className={classes.previewContainer} onClick={handleClickContent}>
                <h6 className={classes.previewTitle}>Buzz preview</h6>
                <MarkdownViewer content={content} minifyAssets={false} />
                <div className={classes.separator} />
              </div>
            )}
            {!publishing && (
              <React.Fragment>
                <ContainedButton
                  disabled={loading || publishing || content.length === 0}
                  label={buzzThreads ? Object.keys(buzzThreads).length > 1 ? 'Buzz all' : 'Buzz' : 'Buzz'}
                  className={classes.float}
                  onClick={handleClickPublishPost}
                />
                <input
                  id='file-upload'
                  type='file'
                  name='image'
                  accept='image/*'
                  multiple={false}
                  ref={inputRef}
                  onChange={handleFileSelectChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor='file-upload'>
                  <IconButton
                    size='medium'
                    onClick={() => inputRef.current.click()}
                    disabled={(content.length + 88) > 280}
                    classes={{
                      root: classes.root,
                      disabled: classes.disabled,
                    }}
                  >
                    <UploadIcon />
                  </IconButton>
                </label>
                <IconButton size='medium' onClick={handleOpenGiphy}>
                  <GifIcon />
                </IconButton>
                <IconButton size='medium' onClick={handleOpenEmojiPicker}>
                  <EmojiIcon />
                </IconButton>
                {content && 
                <Box
                  style={{ float: 'right', marginRight: 10, paddingTop: 10}}
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
                    {content.length >= 260 && <p className={classes.counter}>{280 - content.length}</p>}
                  </div>
                  <div className={classes.colDivider}> </div>
                  <div className={classes.addThreadIcon}><AddIcon onClick={handleClickBuzz} /></div>
                </Box>}
              </React.Fragment>
            )}
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
      <BuzzFormModal show={open} onHide={onHide} />

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
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      uploadFileRequest,
      publishPostRequest,
      setPageFrom,
      broadcastNotification,
      clearIntentBuzz,
      savePostAsDraft,
      setBuzzModalStatus,
      updateBuzzThreads,
      publishReplyRequest,
    },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBuzzForm)
