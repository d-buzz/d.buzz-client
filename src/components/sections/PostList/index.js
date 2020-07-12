import React from 'react'
import Image from 'react-bootstrap/Image'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { 
  CommentIcon,
  IconButton,
  HeartIcon,
  FlagIcon,
} from 'components/elements'

const useStyle = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 20,
  },
  wrapper: {
    width: '100%',
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
    width: 60,
  },
  right: {
    height: 'max-content',
    width: 'calc(100% - 60px)',
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
    }
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  }
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

const PostList = () => {
  const classes = useStyle()
  const profileImage = 'https://images.hive.net.ph/u/postnzt/avatar/small'

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <a href="/thread" style={{ heigt: 'max-content' }}>
          <div className={classes.row}>
              <div className={classNames(classes.inline, classes.left)}>
                <Image 
                  src={profileImage}
                  roundedCircle
                  height={50}
                />
                <div style={{ position: 'relative', width: 10, margin: '0 auto', display: 'block', flexDirection: 'column', height: '100%', backroundColor: 'red' }}></div>
              </div>
              <div className={classNames(classes.inline, classes.right)}>
                <div className={classes.content}>
                  <label className={classes.name}>Jhune Carlo Trogelio</label>
                  <label className={classes.username}>@postnzt &bull; 1h</label>
                  <p className={classes.post}>The only solution to Corona Virus</p>
                  <img src="./sample-post-1.jpeg" alt="post" style={{ width: 'calc(100% - 20px)' }} />
                </div>
                <div className={classes.actionWrapper}>
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classes.inline} 
                    icon={<IconButton icon={<HeartIcon />} />}
                    stat={
                      <label style={{ marginTop: 5, marginLeft: 5, }}>
                        300
                      </label>
                    }
                  />
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classes.inline} 
                    icon={<IconButton icon={<CommentIcon />} />}
                    stat={
                      <label style={{ marginTop: 5, marginLeft: 5, }}>
                        200
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
          </div>
        </a>
      </div>
      <div className={classes.wrapper}>
        <a href="/thread" style={{ heigt: 'max-content' }}>
          <div className={classes.row}>
              <div className={classNames(classes.inline, classes.left)}>
                <Image 
                  src={profileImage}
                  roundedCircle
                  height={50}
                />
                <div style={{ position: 'relative', width: 10, margin: '0 auto', display: 'block', flexDirection: 'column', height: '100%', backroundColor: 'red' }}></div>
              </div>
              <div className={classNames(classes.inline, classes.right)}>
                <div className={classes.content}>
                  <label className={classes.name}>Jhune Carlo Trogelio</label>
                  <label className={classes.username}>@postnzt  &bull; 2h</label>
                  <p className={classes.post}>Kawaiii</p>
                  <img src="./sample-post-2.jpeg" alt="post" style={{ width: 'calc(100% - 20px)' }} />
                </div>
                <div className={classes.actionWrapper}>
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classes.inline} 
                    icon={<IconButton icon={<HeartIcon />} />}
                    stat={
                      <label style={{ marginTop: 5, marginLeft: 5, }}>
                        300
                      </label>
                    }
                  />
                  <ActionWrapper
                    className={classes.actionWrapperSpace}
                    inlineClass={classes.inline} 
                    icon={<IconButton icon={<CommentIcon />} />}
                    stat={
                      <label style={{ marginTop: 5, marginLeft: 5, }}>
                        200
                      </label>
                    }
                  />
                </div>
              </div>
          </div>
        </a>
      </div>
    </React.Fragment>
  )
}

export default PostList