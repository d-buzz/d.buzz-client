import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    backgroundColor: theme.background.primary,
    width: '100%',
    height: 125,
    border: theme.border.primary,
    borderRadius: '15px 15px',
    display: 'flex',
    marginBottom: 10,
    '&:hover': {
      backgroundColor: theme.preview.hover.color,
    },
  },
  left: {
    overflow: 'hidden',
    height: '100%',
    width: 130,
    borderRadius: '15px 0px 0px 15px',
    borderRight: theme.border.primary,
    '& img': {
      height: 130,
      width: '100%',
      objectFit: 'cover',
      border: 'none !important',
      borderRadius: '15px 0px 0px 15px !important',
    },
    '& div': {
      marginTop: -10,
    },
  },
  right: {
    height: '100%',
    flex: 1,
    borderRadius: '0px 15px 15px 0px',
    ...theme.font,
    '& div': {
      width: '98%',
      margin: '0 auto',
    },
    '& h6': {
      paddingTop: 5,
    },
    '& p': {
      fontSize: 13,
      paddingBottom: 0,
      marginBottom: 0,
    },
    '& label': {
      fontSize: 12,
      color: '#d32f2f !important',
    },
  },
}))

const LinkPreviewSkeleton = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <div>
            <Skeleton height={150} width={'100%'} />
          </div>
        </div>
        <div className={classes.right}>
          <div>
            <h6><Skeleton height={10} width={50} /></h6>
            <p><Skeleton height={10} width={120} /></p>
            <label><Skeleton height={10} width={20} /></label>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LinkPreviewSkeleton
