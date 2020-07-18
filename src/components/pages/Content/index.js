import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getContentRequest, getRepliesRequest } from 'store/posts/actions'
import { createUseStyles } from 'react-jss'
import { Avatar, HashtagLoader } from 'components/elements'
import { MarkdownViewer, PostTags } from 'components'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'

const useStyles = createUseStyles({
  wrapper: {
    width: '95%',
    margin: '0 auto',
    marginTop: 10,
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
  },
  username: {
    marginTop: -30,
    color: '#657786',
    paddingBottom: 0,
  },
  time: {
    color: 'rgb(101, 119, 134)',
  }
})

const Content = (props) => {
  const { getContentRequest, getRepliesRequest, match, content, loading } = props
  const { username, permlink } = match.params
  const classes = useStyles()

  const { 
    author,
    body,
    json_metadata,
    created,
  } = content || ''
  
  let meta = {}
  
  if(json_metadata) {
    meta = JSON.parse(json_metadata)
  }

  useEffect(() => {
    getContentRequest(username, permlink)
    getRepliesRequest(username, permlink)
  // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        {
          !loading && (
            <React.Fragment>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <Avatar author={author} />
                </Col>
                <Col style={{ paddingLeft: 10, }}>
                  <div style={{ marginTop: 2, }}>
                    <p className={classes.name}>{author}</p> <br />
                    <p className={classes.username}>@{author}</p>
                  </div>
                </Col>
              </Row>
              <MarkdownViewer content={body} minifyAssets={false} />
              <PostTags meta={meta} />
              <div>
                <label className={classes.time}>{ moment(created).format('LTS • \nLL') }</label>
              </div>
            </React.Fragment>
          )
        }
        <HashtagLoader loading={loading} />
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_CONTENT_REQUEST'),
  content: state.posts.get('content'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getContentRequest,
    getRepliesRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)

