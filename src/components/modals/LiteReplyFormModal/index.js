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
import { publishReplyRequest, uploadFileRequest } from 'store/posts/actions'
import { broadcastNotification, closeReplyModal } from 'store/interface/actions'
import { GiphySearchModal, EmojiPicker } from 'components'
import { Spinner, CloseIcon, GifIcon, EmojiIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import FormCheck from 'react-bootstrap/FormCheck'
import { useHistory } from 'react-router-dom'
import { calculateOverhead, invokeTwitterIntent, shortenDid } from 'services/helper'
import Renderer from 'components/common/Renderer'
import { checkForCeramicAccount, generateHiveCeramicParentId, getBasicProfile, getIpfsLink, replyRequest } from 'services/ceramic'

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
    color: '#E61C34',
    paddingBottom: 0,
    '&:hover': {
      color: '#E61C34',
    },
  },
  usernameStyle: {
    padding: '2px 5px',
    background: 'rgba(255, 235, 238, 0.8)',
    borderRadius: 5,
    
    '& a': {
      textDecoration: 'none',
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
  checkBox: {
    cursor: 'pointer',
  },
  label: {
    fontFamily: 'Segoe-Bold',
    ...theme.font,
    fontSize: 15,
  },
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
}))

const ReplyFormModal = (props) => {
  const classes = useStyles()
  const {
    user,
    uploading,
    modalData,
    closeReplyModal,
    broadcastNotification,
    publishReplyRequest,
    uploadFileRequest,
  } = props

  const history = useHistory()

  const { username } = user
  const inputRef = useRef(null)
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false)
  const [replyRef, setReplyRef] = useState('')
  const [treeHistory, setTreeHistory] = useState(0)
  const [author, setAuthor] = useState('')
  const [permlink, setPermlink] = useState('')
  const [body, setBody] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [overhead, setOverhead] = useState(0)
  const [replyDone, setReplyDone] = useState(false)
  const [buzzToTwitter, setBuzzToTwitter] = useState(false)
  const [openGiphy, setOpenGiphy] = useState(false)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [emojiAnchorEl, setEmojianchorEl] = useState(null)
  const [ceramicAuthor, setCeramicAuthor] = useState(false)
  const [ceramicUser, setCeramicUser] = useState(false)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [replying, setReplying] = useState(false)
  const defaultProfileImage = `${window.location.origin}/ceramic_user_avatar.svg`
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState(ceramicAuthor ? defaultProfileImage : '')
  const [userAvatarUrl, setUserAvatarUrl] = useState(ceramicUser ? defaultProfileImage : '')
  const [loading, setLoading] = useState(false)

  // cursor state
  const [cursorPosition, setCursorPosition] = useState(null)

  const [counterColor, setCounterColor] = useState('#e53935')
  const counterDefaultStyles = { color: "rgba(230, 28, 52, 0.2)", transform: content.length - overhead >= 260 && 'rotate(-85deg) scale(1.3)' }
  const CircularProgressStyle = { ...counterDefaultStyles, float: 'right', color: counterColor }

  const textAreaStyle = { width: '100%' }
  const zeroPadding = { padding: 0 }
  const iconButtonStyle = { marginTop: -5 }
  const inputFile = { display: 'none' }
  const replyButtonStyle = { width: 70 }


  useEffect(() => {
    const overhead = calculateOverhead(content)

    setOverhead(overhead)

    const length = content.length - overhead
    setWordCount(Math.floor((length / 280) * 100))
  }, [content])

  useEffect(() => {
    if(modalData.hasOwnProperty('open') && typeof modalData === 'object') {
      const { open: modalOpen } = modalData
      setContent('')
      setReplyDone(false)
      if(modalOpen) {
        const {
          content,
          author,
          permlink,
          replyRef,
          treeHistory,
        } = modalData

        setReplyRef(replyRef)

        setAuthor(author.did ? author.did : author)
        setPermlink(permlink)
        setBody(content)
        setTreeHistory(treeHistory)
      } else {
        setReplyRef('')
        setAuthor('')
        setPermlink('')
        setBody('')
        setTreeHistory(0)
      }
      setOpen(modalOpen)
    }
  }, [modalData])

  useEffect(() => {
    if(checkForCeramicAccount(username)) {
      setFetchingProfile(true)
      getBasicProfile(username)
        .then((res) => {
          setCeramicUser(res)
          setFetchingProfile(false)
          if(res?.images) {
            setUserAvatarUrl(getIpfsLink(res?.images?.avatar))
          }
        })
    } else {
      setFetchingProfile(false)
    }
  }, [username])
  
  useEffect(() => {
    if(checkForCeramicAccount(author)) {
      setFetchingProfile(true)
      getBasicProfile(author)
        .then((res) => {
          setCeramicAuthor(res)
          setFetchingProfile(false)
          if(res.images) {
            setAuthorAvatarUrl(getIpfsLink(res?.images?.avatar))
          }
        })
    } else {
      setAuthorAvatarUrl('')
      setFetchingProfile(false)
    }
  }, [author])

  const onHide = () => {
    setOpen(false)
    closeReplyModal()
  }

  const handleOnChange = (e) => {
    const { target } = e
    const { value, name } = target
    if(name !== 'buzz-to-twitter') {
      setContent(value)
    } else {
      setBuzzToTwitter(!buzzToTwitter)
    }
  }

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

  const handleSubmitReply = () => {
    if(buzzToTwitter) {
      invokeTwitterIntent(content)
    }

    setReplying(true)

    if(!ceramicUser) {
      publishReplyRequest(author, permlink, content, replyRef, treeHistory)
        .then(({ success, errorMessage }) => {
          if(success) {
            setLoading(false)
            broadcastNotification('success', `Succesfully replied to @${author}/${permlink}`)
            setReplyDone(true)
            closeReplyModal()
            setReplying(false)
          } else {
            setReplying(false)
            setLoading(false)
            broadcastNotification('error', 'There was an error while replying to this buzz.')
          }
        })
    } else {
      generateHiveCeramicParentId(author, permlink)
        .then((parent_id) => {
          replyRequest(parent_id, author, content)
            .then((data) => {
              if(data) {
                broadcastNotification('success', `Succesfully replied to @${author}/${permlink}`)
                setReplyDone(true)
                closeReplyModal()
                setReplying(false)
                setLoading(false)
              } else {
                setReplying(false)
                setLoading(false)
                broadcastNotification('error', 'There was an error while replying to this buzz.')
              }
            })
            .catch((errorMessage) => {
              setLoading(false)
              setReplying(false)
              broadcastNotification('error', errorMessage)
            })
        })
    }
  }

  const handleClickContent = (e) => {
    try {
      const { target } = e
      let { href } = target
      const hostname = window.location.hostname

      e.preventDefault()
      if(href && !href.includes(hostname)) {
        window.open(href, '_blank')
      } else {
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
        show={open && !replyDone}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={false}
      >
        <div className="container">
          <ModalBody className={classes.modalBody}>
            <div className={classes.actionWrapper}>
              <IconButton style={iconButtonStyle} onClick={onHide}>
                <CloseIcon />
              </IconButton>
            </div>
            <hr className={classes.break} />
            <Row>
              <Col xs="auto">
                <div className={classes.left}>
                  {<Avatar author={author} avatarUrl={authorAvatarUrl} className={classes.avatar}/>}
                  <div className={classes.thread} />
                </div>
              </Col>
              <Col style={zeroPadding}>
                <div className={classNames('right-content', classes.right)}>
                  <p>Replying to {!fetchingProfile && <b><a href={`/@${author}`} className={classes.username}>{`@${!checkForCeramicAccount(author) ? author : shortenDid(author)}`}</a></b>}</p>
                  <div className={classes.previewContainer}>
                    <Renderer content={body} minifyAssets={true} onModal={true}/>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="auto">
                <div className={classes.left}>
                  <Avatar author={username} avatarUrl={userAvatarUrl} className={classes.avatar} />
                </div>
              </Col>
              <Col style={zeroPadding}>
                <div className={classNames('right-content', classes.right)}>
                  {loading && replying && (
                    <div className={classes.loadState}>
                      <Box  position="relative" display="inline-flex">
                        <Spinner top={0} size={20} loading={true} />&nbsp;
                        <label className={classes.actionLabels}>broadcasting your reply to the network, please wait ...</label>&nbsp;
                      </Box>
                    </div>
                  )}
                  {!loading && !replying && (
                    <TextArea
                      style={textAreaStyle}
                      minRows={3}
                      maxLength={280 + overhead}
                      label="Buzz your reply"
                      value={content}
                      onKeyUp={e => {
                        handleOnChange(e)
                        setCursorPosition(e.target.selectionStart)
                      }}
                      onKeyDown={e => {
                        handleOnChange(e)
                        setCursorPosition(e.target.selectionStart)
                      }}
                      onChange={handleOnChange}
                      onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    />
                  )}
                  <FormCheck
                    name='buzz-to-twitter'
                    type='checkbox'
                    label='Buzz to Twitter'
                    checked={buzzToTwitter}
                    onChange={handleOnChange}
                    className={classNames(classes.checkBox, classes.label)}
                  />
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
                      <div onClick={handleClickContent}>
                        <Renderer content={content} minifyAssets={true} onModal={true}/>
                      </div>
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
                      loading={loading || replying}
                      label="Reply"
                      style={replyButtonStyle}
                      className={classes.float}
                      onClick={handleSubmitReply}
                      disabled={loading || `${content}`.trim() === '' || replying}
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
                        {content.length - overhead >= 260 && <p className={classes.counter}>{280 - content.length + overhead}</p>}
                      </div>
                    </Box>
                  </div>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </div>
      </Modal>
      <GiphySearchModal show={openGiphy} onHide={closeGiphy} handleAppendContent={handleSelectGif}/>
      <EmojiPicker open={openEmojiPicker} anchorEl={emojiAnchorEl} handleClose={handleCloseEmojiPicker}  handleAppendContent={handleSelectEmoticon}/>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  modalData: state.interfaces.get('replyModalData'),
  uploading: pending(state, 'UPLOAD_FILE_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    publishReplyRequest,
    uploadFileRequest,
    broadcastNotification,
    closeReplyModal,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyFormModal)
