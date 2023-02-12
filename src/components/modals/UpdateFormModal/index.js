import React, { useState, useEffect, useRef } from 'react'
import { Avatar, TextArea, ContainedButton, UploadIcon } from 'components/elements'
import Box from '@material-ui/core/Box'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import classNames from 'classnames'
import { uploadFileRequest } from 'store/posts/actions'
import { broadcastNotification, closeReplyModal } from 'store/interface/actions'
import { publishUpdateRequest } from 'store/posts/actions'
import { GiphySearchModal, EmojiPicker } from 'components'
import { Spinner, CloseIcon, GifIcon, EmojiIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { calculateOverhead, stripHtml } from 'services/helper'
import Renderer from 'components/common/Renderer'
import { checkForCeramicAccount, updatePostRequest } from 'services/ceramic'

const CircularProgress = React.lazy(() => import('@material-ui/core/CircularProgress'))
const IconButton = React.lazy(() => import('@material-ui/core/IconButton'))

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 630,
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      width: 630,
      borderRadius: '20px 20px !important',
      border: 'none',
      '& div.right-content': {
        width: '98% !important',
      },
    },
    '@media (max-width: 900px)': {
      width: '97% !important',
      '& div.modal-content': {
        margin: '0 auto',
        width: '97% !important',
      },
    },
  },
  inner: {
    width: '99%',
    minHeight: 250,
    margin: '0 auto !important',
    backgroundColor: 'white',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
  },
  link: {
    color: 'black',
    '&:hover': {
      color: 'black',
    },
  },
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 15,
    marginBottom: 10,
  },
  inline: {
    display: 'inline-block !important',
    verticalAlign: 'top !important',
  },
  left: {
    width: 'max-content',
    height: '100%',
  },
  right: {
    width: 'inherit !important',
    verticalAlign: 'top',
    ...theme.font,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
    '&:hover': {
      color: '#657786',
    },
  },
  float: {
    float: 'right',
    marginRight: 10,
    marginTop: 10,
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
    width: '100%',
    height: 'max-content',
    wordBreak: 'break-all !important',
    paddingBottom: 10,
    '& img': {
      borderRadius: '10px 10px',
    },
    '& iframe': {
      borderRadius: '10px 10px',
      width: '100% !important',
    },
  },
  modalBody: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatar: {
    paddingRight: 0,
    marginRight: 0,
  },
  thread: {
    margin: '0 auto',
    width: 2,
    backgroundColor: '#dc354561',
    flex: 1,
    height: '100%',
    flexBasis: 46,
  },
  bodyContainer: {
    minHeight: 70,
    width: 500,
    fontSize: 14,
    wordBreak: 'break-word',
  },
  loadState: {
    width: '100%',
    paddingTop: 10,
  },
  actionLabels: {
    fontFamily: 'Segoe-Bold',
    fontSize: 14,
    color: '#e53935',
    paddingTop: 2,
  },
  break: {
    backgroundColor: theme.border.background,
  },
  actionWrapper: {
    width: '100%',
  },
  // characterCounter: {
  //   position: 'relative',
  //   width: '30px',
  //   height: '30px',
  //   float: 'right',
  //   marginTop: 15,
  //   marginRight: 10,
  // },
  characterCounterBg: {
    position: 'relative',
    marginTop: 2,
    float: 'right',
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
  buzzTextBox: {
    display: 'flex',
    position: 'relative',
    width: '100%',
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
}))

const UpdateFormModal = (props) => {
  const classes = useStyles()
  const {
    onSuccess,
    body,
    permlink,
    user,
    loading,
    uploading,
    broadcastNotification,
    publishUpdateRequest,
    open = false,
    onClose,
    uploadFileRequest,
  } = props

  const { username } = user
  const inputRef = useRef(null)
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [openGiphy, setOpenGiphy] = useState(false)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [emojiAnchorEl, setEmojianchorEl] = useState(null)
  const [overhead, setOverhead] = useState(0)
  const [buzzContent, setBuzzContent] = useState('')
  const [buzzContentStripped, setBuzzContentStripped] = useState('')

  const textAreaStyle = { width: '100%', height: 500 }
  const zeroPadding = { padding: 0 }
  const iconButtonStyle = { marginTop: -5 }
  const inputFile = { display: 'none' }
  const replyButtonStyle = { width: 85 }

  const [counterColor, setCounterColor] = useState('#e53935')
  const counterDefaultStyles = { color: "rgba(230, 28, 52, 0.2)", transform: content.length - overhead >= 260 && 'rotate(-85deg) scale(1.3)' }
  const CircularProgressStyle = { ...counterDefaultStyles, float: 'right', color: counterColor }
  // eslint-disable-next-line
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  
  const [updating, setUpdating] = useState(false)

  const [buzzLength, setBuzzLength] = useState(0)
  const [buzzRemainingChars, setBuzzRemaingChars] = useState(0)

  // cursor state
  const [cursorPosition, setCursorPosition] = useState(null)

  useEffect(() => {
    if(body && body !== '') {
      setContent(body)
      setBuzzContent(body)
      setBuzzContentStripped(stripHtml(body))
    }
  }, [body])

  useEffect(() => {
    const length = (buzzContentStripped.length) - overhead

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
  }, [buzzContent])

  useEffect(() => {
    const contentOverhead = calculateOverhead(buzzContentStripped)
    setOverhead(contentOverhead)
    // eslint-disable-next-line
  }, [buzzContent])


  useEffect(() => {
    // update characters length and add images overhead
    const length = (buzzContentStripped.length) - (overhead)
    setWordCount(Math.floor((length / 280) * 100))

    setBuzzLength((buzzContentStripped.length - (overhead)))
    setBuzzRemaingChars(280 - (buzzContentStripped.length - (overhead)))
  // eslint-disable-next-line
  }, [buzzContent, overhead])

  const handleOnChange = (e) => {
    const { target } = e
    const { value } = target
    setContent(value)
    setBuzzContent(value)
    setBuzzContentStripped(stripHtml(value))
    setCursorPosition(e.target.selectionStart)
    // eslint-disable-next-line
  }

  const handleFileSelect = () => {
    const target = document.getElementById('file-upload-reply')

    const touch = new Touch({
      identifier: "124",
      target: target,
    })

    const touchEvent = new TouchEvent("touchstart", {
      touches: [touch],
      view: window,
      cancelable: true,
      bubbles: true,
    })

    target.dispatchEvent(touchEvent)
    target.click()
  }

  const handleFileSelectChange = (event) => {
    const files = event.target.files[0]
    uploadFileRequest(files, setImageUploadProgress).then((images) => {
      const lastImage = images[images.length-1]
      if(lastImage !== undefined) {
        const contentAppend = `${content} <br /> ${lastImage}`
        setContent(contentAppend)
      }
    })
  }


  const handleClickSubmitUpdate = () => {
    // setUpdating(true)
    if(!checkForCeramicAccount(username)) {
      publishUpdateRequest(permlink, buzzContent)
        .then((success) => {
          if(success) {
            broadcastNotification('success', `Buzz successfully edited`)
            setUpdating(false)
            onSuccess(content)
            onClose()
          } else {
            broadcastNotification('error', `Buzz failed to edited`)
          }
        })
    } else {
      updatePostRequest(permlink, content)
        .then((data) => {
          broadcastNotification('success', `Buzz successfully edited`)
          setUpdating(false)
          onSuccess(content)
          onClose()
        }).catch((e) => {
          broadcastNotification('error', `Buzz failed to edited`)
        })
    }
  }

  const closeGiphy = () => {
    setOpenGiphy(false)
  }

  const handleOpenGiphy = () => {
    setOpenGiphy(!openGiphy)
  }

  const handleSelectGif = (gif) => {
    if(gif){
      const contentAppend = `${content} <br /> ${gif}`
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
      const contentAppend = content.slice(0, cursor) + emoticon + content.slice(cursor)
      setContent(contentAppend)

      emoticon.length === 2 && setCursorPosition(cursorPosition+2)
      emoticon.length === 4 && setCursorPosition(cursorPosition+4)
    }
  }

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
        keyboard={false}
        show={open || loading}
        onHide={onClose}
        dialogClassName={classes.modal}
        animation={false}
      >
        <div className="container">
          <ModalBody className={classes.modalBody}>
            <div className={classes.actionWrapper}>
              <IconButton style={iconButtonStyle} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <hr className={classes.break} />
            <Row>
              <Col xs="auto">
                <div className={classes.left}>
                  <Avatar author={username} className={classes.avatar} />
                </div>
              </Col>
              <Col style={zeroPadding}>
                <div className={classNames('right-content', classes.right)}>
                  {loading && (
                    <div className={classes.loadState}>
                      <Box  position="relative" display="inline-flex">
                        <Spinner top={0} size={20} loading={true} />&nbsp;
                        <label className={classes.actionLabels}>broadcasting your update to the network, please wait ...</label>&nbsp;
                      </Box>
                    </div>
                  )}
                  <div className={classes.buzzTextBox}>
                    {!loading && (
                      <TextArea
                        style={textAreaStyle}
                        minRows={2}
                        label="Buzz"
                        value={content}
                        onKeyUp={e => {
                          handleOnChange(e)
                          setCursorPosition(e.target.selectionStart)
                        }}
                        onKeyDown={e => {
                          handleOnChange(e)
                          setCursorPosition(e.target.selectionStart)
                        }}
                        onChange={e => handleOnChange(e)}
                        onPaste={e => handleOnChange(e)}
                        onClick={(e) => {
                          setCursorPosition(e.target.selectionStart)
                        }}
                      />
                    )}
                  </div>
                  {uploading && (
                    <div className={classes.actionWrapper}>
                      <Box  position="relative" display="inline-flex">
                        <Spinner top={0} size={20} loading={uploading} />&nbsp;
                        <label className={classes.actionLabels}>uploading image, please wait ...</label>&nbsp;
                      </Box>
                    </div>
                  )}
                  <br />
                  {content.length !== 0 && (
                    <div className={classes.previewContainer}>
                      <h6>Buzz preview</h6>
                      <Renderer content={content} minifyAssets={true} onModal={true}/>
                      <hr />
                    </div>
                  )}
                  <div className={classes.actionWrapper}>
                    <input
                      id="file-upload-reply"
                      type='file'
                      accept='image/*'
                      ref={inputRef}
                      onChange={handleFileSelectChange}
                      multiple={false}
                      style={inputFile}
                    />
                    <IconButton size="medium" onClick={handleFileSelect}>
                      <UploadIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={handleOpenGiphy}
                    >
                      <GifIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={handleOpenEmojiPicker}
                    >
                      <EmojiIcon />
                    </IconButton>
                    <ContainedButton
                      loading={loading || updating}
                      label="Update"
                      style={replyButtonStyle}
                      className={classes.float}
                      onClick={handleClickSubmitUpdate}
                      disabled={loading || `${content}`.trim() === '' || updating || buzzRemainingChars < 0}
                    />
                    <Box
                      style={{ float: 'right', marginRight: 15, paddingTop: 10}}
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
                          variant="static"
                        />
                        {buzzLength >= 260 && <p className={classes.counter}>{buzzRemainingChars}</p>}
                      </div>
                    </Box>
                  </div>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </div>
      </Modal>
      <EmojiPicker open={openEmojiPicker} anchorEl={emojiAnchorEl} handleClose={handleCloseEmojiPicker}  handleAppendContent={handleSelectEmoticon}/>
      <GiphySearchModal show={openGiphy} onHide={closeGiphy} handleAppendContent={handleSelectGif}/>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  modalData: state.interfaces.get('replyModalData'),
  loading: pending(state, 'PUBLISH_UPDATE_REQUEST'),
  uploading: pending(state, 'UPLOAD_FILE_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    uploadFileRequest,
    broadcastNotification,
    closeReplyModal,
    publishUpdateRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateFormModal)
