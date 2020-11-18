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
} from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import { MarkdownViewer } from 'components'
import { bindActionCreators } from 'redux'
import { uploadFileRequest, publishPostRequest, setPageFrom } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'
import { isMobile } from 'react-device-detect'


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
    strokeLinecap: 'round',
    color: '#e53935',
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
    height: 20,
    width: 80,
    marginLeft: 5,
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
  },
}))

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
  const [payout, setPayout] = useState(1.000)

  const {
    user,
    uploadFileRequest,
    publishPostRequest,
    images,
    loading,
    publishing,
    modal = false,
    hideModalCallback = () => {},
    broadcastNotification,
    setPageFrom,
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
    const { name } = target
    let { value } = target

    if(name === 'content-area') {
      setContent(value)
    } else if(name === 'max-payout') {
      if((value < 0 || `${value}`.trim() === '') && payout !== 0) {
        value = 0.00
      }
      value = value % 1 === 0 ? parseInt(value) : parseFloat(value)
      setPayout(value)
    }
  }

  const handleFileSelect = () => {
    const target = document.getElementById('file-upload')
    if (isMobile) {
      const touch = new Touch({
        identifier: "123",
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
    target.click()
  }

  const handleFileSelectChange = (event) => {
    const files = event.target.files[0]
    uploadFileRequest(files).then((image) => {
      const lastImage = image[image.length-1]
      if(lastImage !== undefined) {
        const contentAppend = `${content} <br /> ${lastImage}`
        setContent(contentAppend)
      }
    })
  }

  const handleClickPublishPost = () => {
    publishPostRequest(content, tags)
      .then((data) => {
        if(data.success) {
          setPageFrom(null)
          const { author, permlink } = data
          hideModalCallback()
          broadcastNotification('success', 'You successfully published a post')
          history.push(`/@${author}/c/${permlink}`)
        } else {
          broadcastNotification('error', 'You failed publishing a post')
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
            <div style={{ width: '100%', paddingTop: 10 }}>
              <Box  position="relative" display="inline-flex">
                <Spinner top={0} size={20} loading={publishing} />&nbsp;
                <label className={classes.actionLabels}>broadcasting your buzz to the network, please wait ...</label>&nbsp;
              </Box>
            </div>
          )}
          {(!publishing && !loading) &&  (<TextArea name='content-area' maxlength="280" minRows={minRows} value={content} onKeyUp={onChange} onKeyDown={onChange} onChange={onChange} />)}
          <label className={classes.payoutLabel}>Max Payout: </label>
          <input name='max-payout' className={classes.tinyInput} type="number" onChange={onChange} value={payout} required min="0" step="any" /> <br />
          <label className={classes.payoutNote}>
            You can now set the max accepted payout of a post
          </label> <br />
          {!publishing && content.length !== 0 && (
            <div style={{ width: '100%', paddingBottom: 5 }}>
              <ReactTags
                placeholder="Add tags"
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
                autofocus={false}
              />
            </div>
          )}
          {loading && (
            <div style={{ width: '100%', paddingTop: 5 }}>
              <Box  position="relative" display="inline-flex">
                <Spinner top={-10} size={20} loading={loading} />&nbsp;
                <label className={classes.actionLabels}>uploading image, please wait ...</label>&nbsp;
              </Box>
            </div>
          )}
          {content.length !== 0 && (
            <div className={classes.previewContainer}>
              <h6 className={classes.previewTitle}>Buzz preview</h6>
              <MarkdownViewer content={content} minifyAssets={false}/>
              <div className={classes.separator} />
            </div>
          )}
          {!publishing && (
            <React.Fragment>
              <ContainedButton
                disabled={loading || publishing || content.length === 0}
                label="Buzz it"
                className={classes.float}
                onClick={handleClickPublishPost}
              />
              <input
                id="file-upload"
                type='file'
                accept='image/*'
                multiple={false}
                ref={inputRef}
                onChange={handleFileSelectChange}
                style={{ display: 'none' }}
              />
              <label for="file-upload">
                <IconButton
                  size="medium"
                  onClick={handleFileSelect}
                  disabled={(content.length + 88) > 280}
                  classes={{
                    root: classes.root,
                    disabled: classes.disabled,
                  }}
                >
                  <UploadIcon />
                </IconButton>
              </label>
              <Box style={{ float: 'right', marginRight: 10, paddingTop: 15 }} position="relative" display="inline-flex">
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
    setPageFrom,
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBuzzForm)
