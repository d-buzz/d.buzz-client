import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { Avatar } from 'components/elements'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  votelist: {
    fontSize: 12,
  },
  upvoteWrapper: {
    width: 220, 
    height: '90%', 
    marginTop: -10,
    backgroundColor: theme.background.primary,
  },
  upvoteInnerWrapper: {
    margin: '0 auto',
    width: '85%',
    marginBottom: 10, 
  },
  upvoteListWrapper: {
    width: '100%', 
    marginBottom: 5, 
  },
  upvoteProfileLinks: {
    fontSize: 15, 
    color: '#d32f2f',
    '&:hover': {
      color: '#d32f2f',
    },
  },
  upvoteDialogTitle: {
    backgroundColor: theme.background.primary,
    ...theme.font,
  },
}))

const VoteListDialog = (props) => {
  const { onClose, open, upvoteList } = props
  const classes = useStyles()

  return (   
    <Dialog
      onClose={onClose}
      open={open}
    >
      <DialogTitle component="h4" className={classes.upvoteDialogTitle}>
        <b>Votes({upvoteList.length})</b>
      </DialogTitle>
      <div className={classes.upvoteWrapper}>
        <div className={classes.upvoteInnerWrapper}>
          {upvoteList.map(({ voter }) => (
            <React.Fragment key={voter}>
              <div className={classes.upvoteListWrapper}>
                <Avatar author={voter} height={40} />&nbsp;&nbsp;
                <a className={classes.upvoteProfileLinks} href={`${window.location.origin}/@${voter}`} rel="noopener noreferrer">{voter}</a>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Dialog>
  )
}

export default VoteListDialog
