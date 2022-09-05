import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  inner: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0 auto',
    padding: 5,
    '& img': {
      height: 45,
      width: 45,
      objectFit: 'contain',
      border: 'none !important',
    },
  },
  wrapper: {
    cursor: 'pointer',
    width: '100%',
    borderBottom: theme.border.primary,
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
    borderRadius: 15,
    marginTop: 2.5,
    marginBottom: 2.5,
    '&:hover': {
      ...theme.right.list.hover,
    },
  },
  titleLabelContainer: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: theme.font.color,
    fontWeight: 'bold',
    fontSize: 14,
    margin: 0,
  },
  label: {
    fontSize: 13,
    color: '#657786',
    margin: 0,
    marginTop: 5,
  },
  linkWrapper: {
    textDecoration: 'none !important',
    color: '#14171a',
    cursor: 'pointer',
    '&:hover': {
      color: '#14171a',
    },
    '& label': {
      cursor: 'pointer',
    },
  },
  followButton: {
    float: 'right',
    marginTop: 15,
    marginRight: 15,
  },
}))


const ListLink = (props) => {
  const classes = useStyles()
  const { title, label, href, imagePath } = props

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes.linkWrapper}>
          <div className={classes.inner}>
            <img alt="preview-img" src={imagePath} loading='lazy'/>
            <span className={classes.titleLabelContainer}>
              <label className={classes.title}>{title}</label>
              <label className={classes.label}>{label}</label>
            </span>
          </div>
        </a>
      </div>
    </React.Fragment>
  )
}

export default ListLink