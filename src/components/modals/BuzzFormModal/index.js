import React, { useState, useEffect } from 'react'
import { Avatar, TextArea, ContainedButton, UploadIcon } from 'components/elements'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import stripHtml from 'string-strip-html'
import CircularProgress from '@material-ui/core/CircularProgress'
import { publishReplyRequest } from 'store/posts/actions'
import { MarkdownViewer } from 'components'
import { HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles({
  modal: {
    width: 630,
    backgroundColor: 'none',
    '& div.modal-content': {
      width: 630,
      borderRadius: '20px 20px !important',
      border: 'none',
    }
  },
  inner: {
    width: '99%',
    minHeight: 250,
    margin: '0 auto !important',
    backgroundColor: 'white'
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
    minHeight: 55,
    width: 'calc(100% - 65px)',
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
    height: 'max-content',
    wordBreak: 'break-all !important',
    paddingBottom: 10,
    '& img': {
      border: '1px solid #ccd6dd',
      borderRadius: '10px 10px',
    },
    '& iframe': {
      border: '1px solid #ccd6dd',
      borderRadius: '10px 10px',
      width: '100% !important',
    },
  }
})

const BuzzFormModal = (props) => {
  const classes = useStyles()
  const {
    show,
    onHide = () => {},
    author,
    permlink,
    title = '',
    user,
    publishReplyRequest,
    replyRef,
    treeHistory,
  } = props

  const { username } = user

  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    setWordCount(Math.floor((content.length/280) * 100))
  }, [content])

  const handleOnChange = (e) => {
    const { target } = e
    const { value } = target
    setContent(value)
  }

  const handleSubmitReply = () => {
    publishReplyRequest(author, permlink, content, replyRef, treeHistory)
  }

  return (
    <React.Fragment>
      <Modal show={show} onHide={onHide} dialogClassName={classes.modal}>
        <div className="container">
          <ModalBody style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ width: 'max-content', display: 'inline-block', verticalAlign: 'top' }}>
              <Avatar author={author} style={{ width: '60', paddingRight: 0, marginRight: 0 }} />
              <div style={{ margin: '0 auto', width: 2, backgroundColor: '#dc354561', height: 60, flexGrow: 1, }} />
              <Avatar author={username} style={{ width: '60', paddingRight: 0, marginRight: 0 }} />
            </div>
            <div style={{ width: 520, display: 'inline-block', marginLeft: 5, paddingLeft: 5, verticalAlign: 'top' }}>
              <p>Replying to <a href={`/@${author}`} className={classes.username}>{`@${author}`}</a></p>
              <div style={{ height: 70, width: 500, }}>
                <p style={{ paddingBottom: 0 }}>{stripHtml(`${title}`)}</p>
              </div>
              <TextArea
                minRows={3}
                maxlength="280"
                label="Buzz your reply"
                value={content}
                onKeyUp={handleOnChange}
                onKeyDown={handleOnChange}
                onChange={handleOnChange}
              />
              <br />
              {
                content.length !== 0 && (
                  <div style={{ width: 520 }} className={classes.previewContainer}>
                    <h6>Reply preview</h6>
                    <MarkdownViewer content={content} minifyAssets={true} onModal={true}/>
                    <hr />
                  </div>
                )
              }
              <div style={{ width: '100%' }}>
                <IconButton size="medium">
                  <UploadIcon />
                </IconButton>
                <ContainedButton
                  label="Reply"
                  style={{ width: 70 }}
                  className={classes.float}
                  onClick={handleSubmitReply}
                />
                <CircularProgress
                  style={{ float: 'right', marginRight: 5, marginTop: 15, }}
                  classes={{
                    circle: classes.circle,
                  }}
                  size={30}
                  value={wordCount}
                  variant="static"
                />
              </div>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    publishReplyRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuzzFormModal)
