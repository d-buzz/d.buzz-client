import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  inner: {
    cursor: 'pointer',
    margin: '0 auto',
    '& img': {
      marginTop: 10,
      marginLeft: 15,
      height: 45,
      width: 45,
      objectFit: 'cover',
      border: 'none !important',
    },
  },
  wrapper: {
    cursor: 'pointer',
    width: '100%',
    borderBottom: theme.border.primary,
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
    '&:hover': {
      ...theme.right.list.hover,
    },
  },
  title: {
    color: theme.font.color,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    marginTop: 15,
    marginLeft: 5,
    paddingBottom: 20,
    color: '#657786',
  },
  linkWrapper: {
    textDecoration: 'none',
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
            <img alt="preview-img" src={imagePath} />
            <label className={classes.title}>{title}</label>
            <label className={classes.label}>{label}</label>
          </div>
        </a>
      </div>
    </React.Fragment>
  )
}

export default ListLink