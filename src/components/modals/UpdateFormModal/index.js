import React, { useState, useEffect, useRef } from 'react'
import { Avatar, TextArea, ContainedButton, UploadIcon } from 'components/elements'
import Box from '@material-ui/core/Box'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import classNames from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress'
import { uploadFileRequest } from 'store/posts/actions'
import { broadcastNotification, closeReplyModal } from 'store/interface/actions'
import { publishUpdateRequest } from 'store/posts/actions'
import { MarkdownViewer, GiphySearchModal, EmojiPicker } from 'components'
import { Spinner, CloseIcon, GifIcon, EmojiIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { calculateOverhead } from 'services/helper'

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
  characterCounter: {
    position: 'relative',
    width: '30px',
    height: '30px',
    float: 'right',
    marginTop: 15,
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

  const textAreaStyle = { width: '100%' }
  const zeroPadding = { padding: 0 }
  const iconButtonStyle = { marginTop: -5 }
  const inputFile = { display: 'none' }
  const replyButtonStyle = { width: 85 }

  const [counterColor, setCounterColor] = useState('#e53935')
  const CircularProgressStyle = { float: 'right', color: counterColor, transform: content.length >= 260 && 'scale(1.3)' }


  useEffect(() => {
    if(content.length - overhead === 280) {
      setCounterColor('#E0245E')
    } else if(content.length - overhead >= 260) {
      setCounterColor('#FFAD1F')
    } else {
      setCounterColor('#e53935')
    }
    // eslint-disable-next-line
  }, [content])

  useEffect(() => {
    if(body && body !== '') {
      setContent(body)
    }
  }, [body])


  useEffect(() => {
    const overhead = calculateOverhead(content)

    setOverhead(overhead)

    const length = content.length - overhead
    setWordCount(Math.floor((length / 280) * 100))
  }, [content])


  const handleOnChange = (e) => {
    const { target } = e
    const { value } = target
    setContent(value)
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
    uploadFileRequest(files).then((images) => {
      const lastImage = images[images.length-1]
      if(lastImage !== undefined) {
        const contentAppend = `${content} <br /> ${lastImage}`
        setContent(contentAppend)
      }
    })
  }


  const handleClickSubmitUpdate = () => {
    publishUpdateRequest(permlink, content)
      .then((success) => {
        if(success) {
          broadcastNotification('success', `Buzz successfully edited`)
          onSuccess(content)
          onClose()
        } else {
          broadcastNotification('error', `Buzz failed to edited`)
        }
      })
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
      const contentAppend = `${content}${emoticon}`
      setContent(contentAppend)
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
                  {!loading && (
                    <TextArea
                      style={textAreaStyle}
                      minRows={3}
                      maxLength={280 + overhead}
                      label="Buzz your reply"
                      value={content}
                      onKeyUp={handleOnChange}
                      onKeyDown={handleOnChange}
                      onChange={handleOnChange}
                    />
                  )}
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
                      <h6>Reply preview</h6>
                      <MarkdownViewer content={content} minifyAssets={true} onModal={true}/>
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
                      label="Update"
                      style={replyButtonStyle}
                      className={classes.float}
                      onClick={handleClickSubmitUpdate}
                      disabled={loading || `${content}`.trim() === ''}
                    />
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
                      {content.length - overhead >= 260 && <p className={classes.counter}>{280 - content.length + overhead}</p>}
                    </div>
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
