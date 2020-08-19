import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import {
  TextArea,
  ContainedButton,
  Avatar,
  UploadIcon,
  HashtagLoader,
} from 'components/elements'
import { MarkdownViewer, NotificationBox } from 'components'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import { bindActionCreators } from 'redux'
import { uploadFileRequest, publishPostRequest } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'


const useStyles = createUseStyles({
  container: {
    width: '100%',
    borderBottom: '10px solid #e6ecf0',
  },
  containerModal: {
    width: '100%',
    borderTop: '1px solid #e6ecf0',
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
    strokeLinecap: 'round',
    color: '#e53935',
  },
  previewContainer: {
    width: '100%',
    height: 'max-content',
    paddingBottom: 10,
    '& img': {
      border: '1px solid #ccd6dd',
      borderRadius: '10px 10px',
    },
    '& iframe': {
      border: '1px solid #ccd6dd',
      borderRadius: '10px 10px',
    },
  },
  note: {
    fontSize: 14,
    fontFamily: 'Segoe-Bold',
    color: '#d32f2f',
  }
})

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

const CreateBuzzForm = (props) => {
  const classes = useStyles()
  const inputRef = useRef(null)
  const [wordCount, setWordCount] = useState(0)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [message, setMessage] = useState()
  const [severity, setSeverity] = useState('success')

  const {
    user,
    uploadFileRequest,
    publishPostRequest,
    images,
    loading,
    publishing,
    modal = false,
    hideModalCallback = () => {},
  } = props

  const history = useHistory()
  let containerClass = classes.container
  let minRows = 2

  if(modal) {
    containerClass = classes.containerModal
    minRows = 5
  }

  useEffect(() => {
    setWordCount(Math.floor((content.length/280) * 100))
  }, [content, images])

  const onChange = (e) => {
    const { target } = e
    const { value } = target

    setContent(value)
  }

  const handleSnackBarClose = () => {
    setShowSnackbar(false)
  }

  const handleFileSelect = () => {
    inputRef.current.click()
  }

  const handleFileSelectChange = (event) => {
    const files = event.target.files[0]
    uploadFileRequest(files).then((images) => {
      const lastImage = images[images.length-1]
      const contentAppend = `${content} ${lastImage}`
      setContent(contentAppend)
    })
  }

  const handleClickPublishPost = () => {
    publishPostRequest(content, tags)
      .then((data) => {
        if(data.success) {
          const { author, permlink } = data
          setShowSnackbar(true)
          hideModalCallback()
          setMessage('You successfully published a post')
          history.push(`/@${author}/c/${permlink}`)
        } else {
          setSeverity('error')
          setMessage('You failed publishing a post')
        }
    })
  }

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    tag.id = tag.id.split(" ").join("")
    tag.text = tag.text.split(" ").join("")
    setTags([...tags, tag])
  }

  const handleDrag = (tag, currPos, newPos) => {
    const tagsArray = [...tags]
    const newTags = tagsArray.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    setTags(newTags)
  }

  return (
    <div className={containerClass}>
      <div className={classes.row}>
        <div className={classNames(classes.inline, classes.left)}>
          <Avatar author={user.username} />
        </div>
        <div className={classNames(classes.inline, classes.right)}>
          {publishing && (
            <div style={{ width: '100%', paddingTop: 10, }}>
              <Box  position="relative" display="inline-flex">
                <HashtagLoader top={0} size={20} loading={publishing} />&nbsp;
                <label style={{ marginTop: -3 }}>Broadcasting your buzz to the network, please wait ...</label>&nbsp;
              </Box>
            </div>
          )}
          {!publishing && (<TextArea maxlength="280" minRows={minRows} value={content} onKeyUp={onChange} onKeyDown={onChange} onChange={onChange} />)}
          {tags.length === 0 && (
            <div style={{ width: '100%' }}>
              <label className={classes.note}>Please add atleast 1 tag</label>
            </div>
          )}
          {!publishing &&(
            <div style={{ width: '100%' }}>
              <ReactTags
                placeholder="Add tags"
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
              />
            </div>
          )}
          {loading && (
            <div style={{ width: '100%'}}>
              <Box  position="relative" display="inline-flex">
                <HashtagLoader top={0} size={20} loading={loading} />&nbsp;
                <label style={{ marginTop: -2 }}>Uploading image, please wait ...</label>&nbsp;
              </Box>
            </div>
          )}
          {content.length !== 0 && (
            <div className={classes.previewContainer}>
              <h6>Buzz preview</h6>
              <MarkdownViewer content={content} minifyAssets={false}/>
              <hr />
            </div>
          )}
          {!publishing && (
            <React.Fragment>
              <ContainedButton
                disabled={loading || publishing || content.length === 0 || tags.length === 0}
                label="Buzz it"
                className={classes.float}
                onClick={handleClickPublishPost}
              />
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
              <Box style={{ float: 'right', marginRight: 10, paddingTop: 15, }} position="relative" display="inline-flex">
                <CircularProgress
                  classes={{
                    circle: classes.circle,
                  }}
                  size={30}
                  value={wordCount}
                  variant="static"
                />
              </Box>
            </React.Fragment>
          )}
        </div>
      </div>
      <NotificationBox
        show={showSnackbar}
        message={message}
        severity={severity}
        onClose={handleSnackBarClose}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  images: state.posts.get('images'),
  loading: pending(state, 'UPLOAD_FILE_REQUEST'),
  publishing: pending(state, 'PUBLISH_POST_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    uploadFileRequest,
    publishPostRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBuzzForm)
