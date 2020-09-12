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
import { MarkdownViewer } from 'components'
import { Spinner, CloseIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'

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
    color: '#e53935',
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
}))

const ReplyFormModal = (props) => {
  const classes = useStyles()
  const {
    user,
    loading,
    uploading,
    modalData,
    closeReplyModal,
    broadcastNotification,
    publishReplyRequest,
    uploadFileRequest,
  } = props

  const CircularProgressStyle = { float: 'right', marginRight: 5, marginTop: 15 }

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
  const [replyDone, setReplyDone] = useState(false)

  const textAreaStyle = { width: '100%' }
  const zeroPadding = { padding: 0 }
  const iconButtonStyle = { marginTop: -5 }
  const inputFile = { display: 'none' }
  const replyButtonStyle = { width: 70 }


  useEffect(() => {
    setWordCount(Math.floor((content.length/280) * 100))
  }, [content])

  useEffect(() => {
    if(modalData.hasOwnProperty('open') && typeof modalData === 'object') {
      const { open: modalOpen } = modalData
      setContent('')
      if(modalOpen) {
        const {
          content,
          author,
          permlink,
          replyRef,
          treeHistory,
        } = modalData
        setReplyRef(replyRef)
        setAuthor(author)
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

  const onHide = () => {
    setOpen(false)
    closeReplyModal()
  }

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

  const handleSubmitReply = () => {
    publishReplyRequest(author, permlink, content, replyRef, treeHistory)
      .then(({ success }) => {
        if(success) {
          broadcastNotification('success', `Succesfully replied to @${author}/${permlink}`)
          setReplyDone(true)
        } else {
          broadcastNotification('error', `Failed reply to @${author}/${permlink}`)
        }
      })
  }

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
        keyboard={false}
        show={open && !replyDone}
        onHide={onHide}
        dialogClassName={classes.modal}
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
                  <Avatar author={author} className={classes.avatar}/>
                  <div className={classes.thread} />
                </div>
              </Col>
              <Col style={zeroPadding}>
                <div className={classNames('right-content', classes.right)}>
                  <p>Replying to <a href={`/@${author}`} className={classes.username}>{`@${author}`}</a></p>
                  <div className={classes.previewContainer}>
                    <MarkdownViewer content={body} minifyAssets={true} onModal={true}/>
                  </div>
                </div>
              </Col>
            </Row>
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
                        <label className={classes.actionLabels}>broadcasting your reply to the network, please wait ...</label>&nbsp;
                      </Box>
                    </div>
                  )}
                  {!loading && (
                    <TextArea
                      style={textAreaStyle}
                      minRows={3}
                      maxlength="280"
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
                    <ContainedButton
                      label="Reply"
                      style={replyButtonStyle}
                      className={classes.float}
                      onClick={handleSubmitReply}
                      disabled={loading}
                    />
                    <CircularProgress
                      style={CircularProgressStyle}
                      classes={{
                        circle: classes.circle,
                      }}
                      size={30}
                      value={wordCount}
                      variant="static"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  modalData: state.interfaces.get('replyModalData'),
  loading: pending(state, 'PUBLISH_REPLY_REQUEST'),
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
