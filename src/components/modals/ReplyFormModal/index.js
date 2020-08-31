import React, { useState, useEffect, useRef } from 'react'
import { Avatar, TextArea, ContainedButton, UploadIcon } from 'components/elements'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { publishReplyRequest, uploadFileRequest } from 'store/posts/actions'
import { MarkdownViewer } from 'components'
import { Spinner, CloseIcon } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'

const useStyles = createUseStyles({
  modal: {
    width: 630,
    backgroundColor: 'none',
    '& div.modal-content': {
      width: 630,
      borderRadius: '20px 20px !important',
      border: 'none',
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
    verticalAlign: 'top',
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
    marginRight: 5,
    marginTop: 10,
  },
  circle: {
    strokeLinecap: 'round',
    color: '#e53935',
  },
  previewContainer: {
    width: 520,
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
})

const ReplyFormModal = (props) => {
  const classes = useStyles()
  const {
    show,
    onHide = () => {},
    author,
    permlink,
    body = '',
    user,
    publishReplyRequest,
    replyRef,
    treeHistory,
    loading,
    onReplyDone,
    uploadFileRequest,
    uploading,
  } = props

  const { username } = user
  const inputRef = useRef(null)
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [replyDone, setReplyDone] = useState(false)

  useEffect(() => {
    setWordCount(Math.floor((content.length/280) * 100))
  }, [content])

  const handleOnChange = (e) => {
    const { target } = e
    const { value } = target
    setContent(value)
  }

  const handleFileSelect = () => {
    inputRef.current.click()
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
          onReplyDone({
            message: `Succesfully replied to @${author}/${permlink}`,
            severity: 'success',
          })
          setReplyDone(true)
        } else {
          onReplyDone({
            message: `Failed reply to @${author}/${permlink}`,
            severity: 'error',
          })
        }
      })
  }

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
        keyboard={false}
        show={show && !replyDone}
        onHide={onHide}
        dialogClassName={classes.modal}
      >
        <div className="container">
          <ModalBody className={classes.modalBody}>
            <div style={{ width: '100%'}}>
              <IconButton style={{ marginTop: -5 }} onClick={onHide}>
                <CloseIcon />
              </IconButton>
            </div>
            <hr />
            <Row>
              <Col xs="auto">
                <div className={classes.left}>
                  <Avatar author={author} className={classes.avatar}/>
                  <div className={classes.thread} />
                </div>
              </Col>
              <Col style={{ padding: 0 }}>
                <div className={classes.right}>
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
              <Col style={{ padding: 0 }}>
                <div className={classes.right}>
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
                    <div style={{ width: '100%'}}>
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
                  <div style={{ width: '100%' }}>
                    <input
                      type='file'
                      accept='image/*'
                      ref={inputRef}
                      onChange={handleFileSelectChange}
                      style={{ display: 'none' }}
                    />
                    <IconButton size="medium" onClick={handleFileSelect}>
                      <UploadIcon />
                    </IconButton>
                    <ContainedButton
                      label="Reply"
                      style={{ width: 70 }}
                      className={classes.float}
                      onClick={handleSubmitReply}
                      disabled={loading}
                    />
                    <CircularProgress
                      style={{ float: 'right', marginRight: 5, marginTop: 15 }}
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
  loading: pending(state, 'PUBLISH_REPLY_REQUEST'),
  uploading: pending(state, 'UPLOAD_FILE_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    publishReplyRequest,
    uploadFileRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyFormModal)
