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
import { MarkdownViewer } from 'components'
import { ReactTinyLink } from 'react-tiny-link'
import moment from 'moment'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import markdownLinkExtractor from 'markdown-link-extractor'


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

const PreviewLastLink = ({ className, content }) => {
  const links  = markdownLinkExtractor(content)
  let isValidUrl = false
  let url = ''

  if(links.length !== 0) {
    for(let index = links.length; index > 0 ; index--) {
      const link = links[index-1]
      if(!link.includes('images.hive.blog')
          && !link.includes('youtu.be') 
          && !link.includes('files.peakd') 
          && !link.includes('youtube.com/watch?v=')
          && !link.match(/\.(jpeg|jpg|gif|png)$/)) {
        url = link
        isValidUrl = true
        break;
      }
    }
  }
  
  return (
    <React.Fragment>
      { 
        isValidUrl ? (
          <div className={className}>
            <ReactTinyLink
              width="95%"
              borderRadius="50px 50px"
              cardSize="small"
              showGraphic={true}
              maxLine={2}
              minLine={1}
              url={url}
            />
          </div>
        ) : ''
      }      
    </React.Fragment>
  )
}


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

const PostTags = ({ className, meta }) => {
  let tags = []
  if('tags' in meta) {
    tags = meta.tags
  }

  return (
    <div className={className}>
      {
        tags.map((tag) => (
          <a href="/" style={{ marginRight: 5 }}>#{ tag }</a> 
        ))
      }
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
              <a href="/thread" style={{ height: 'max-content', textDecoration: 'none' }}>
                <div className={classes.row}>
                  <Row>
                    <Col xs="auto" style={{ paddingRight: 0 }}>
                      <div className={classes.left}>
                        <Avatar author={item.author} />
                        {/* <div style={{ height: '90%', backgroundColor: 'rgb(245, 188, 196)', width: 2, margin: '0 auto', }}>

                        </div> */}
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
                          <PreviewLastLink 
                            className={classes.preview} 
                            content={item.body} 
                          />
                          <PostTags meta={item.json_metadata} className={classes.tags} />
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
                </a>
              </div>
            </React.Fragment>
          ))
        }
    </React.Fragment>
  )
}

export default PostList