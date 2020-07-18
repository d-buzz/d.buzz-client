import React from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { 
  CommentIcon,
  IconButton,
  HeartIcon,
  FlagIcon,
  Avatar,
  HiveIcon,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MarkdownViewer, PostTags } from 'components'
import { Link } from 'react-router-dom'
import moment from 'moment'


const useStyle = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e6ecf0',
    '& a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f5f8fa',
    },
    cursor: 'pointer',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 50,
  },
  right: {
    height: 'max-content',
    width: '98%',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
  },
  post: {
    color: '#14171a',
    paddingTop: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  preview: {
    '& a': {
      borderRadius: '10px 10px',
      boxShadow: 'none',
    }
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
})


const ActionWrapper = ({ className, inlineClass, icon, stat }) => {
  return (
    <div className={classNames(className, inlineClass)}>
      <div className={inlineClass}>
        { icon }
      </div>
      <div className={inlineClass}>
        { stat }
      </div>
    </div>
  )
}

const PostList = (props) => {
  const { items = [] } = props
  const classes = useStyle()

  return (
    <React.Fragment>
        {
          items.map((item) => (
            <React.Fragment>
              <div className={classes.wrapper}>
              <Link to={`content/@${item.author}/${item.permlink}`} style={{ textDecoration: 'none' }}>
                <div className={classes.row}>
                  <Row>
                    <Col xs="auto" style={{ paddingRight: 0 }}>
                      <div className={classes.left}>
                        <Avatar author={item.author} />
                      </div>
                    </Col>
                    <Col>
                      <div className={classes.right}>
                        <div className={classes.content}>
                          <label className={classes.name}>{item.author}</label>
                          <label className={classes.username}>
                            { `@${item.author}` } &bull;&nbsp; 
                            { moment(item.created).fromNow() }
                          </label>
                          <MarkdownViewer content={item.body} />
                          <PostTags meta={item.json_metadata} />
                        </div>
                        <div className={classes.actionWrapper}>
                          <ActionWrapper
                            className={classes.actionWrapperSpace}
                            inlineClass={classes.inline} 
                            icon={<IconButton icon={<HeartIcon />} />}
                            stat={
                              <label style={{ marginTop: 5, marginLeft: 5, }}>
                                { item.active_votes.length }
                              </label>
                            }
                          />
                          <ActionWrapper
                            className={classes.actionWrapperSpace}
                            inlineClass={classes.inline} 
                            icon={<IconButton icon={<CommentIcon />} />}
                            stat={
                              <label style={{ marginTop: 5, marginLeft: 5, }}>
                                { item.children }
                              </label>
                            }
                          />
                          <ActionWrapper
                            className={classes.actionWrapperSpace}
                            inlineClass={classes.inline} 
                            icon={<IconButton icon={<HiveIcon />} />}
                            stat={
                              <label style={{ marginTop: 5, marginLeft: 5, }}>
                                { item.payout }
                              </label>
                            }
                          />
                          <ActionWrapper
                            className={classes.actionWrapperSpace}
                            inlineClass={classes.inline} 
                            icon={<IconButton icon={<FlagIcon />} />}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                </Link>
              </div>
            </React.Fragment>
          ))
        }
    </React.Fragment>
  )
}

export default PostList