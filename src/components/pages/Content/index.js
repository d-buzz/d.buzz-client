import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getContentRequest, getRepliesRequest } from 'store/posts/actions'
import { createUseStyles } from 'react-jss'
import { Avatar } from 'components/elements'
import { MarkdownViewer, PostTags } from 'components'
import { bindActionCreators } from 'redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
})

const Content = (props) => {
  const { getContentRequest, match, content } = props
  const { username, permlink } = match.params
  const classes = useStyles()

  const { 
    author,
    body,
    json_metadata, 
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
        <MarkdownViewer content={body} />
        <PostTags meta={meta} />
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  content: state.posts.get('content'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getContentRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)

