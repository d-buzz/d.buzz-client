import React, { useState } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { Avatar } from 'components/elements'
import { createUseStyles } from 'react-jss'
import {
  DialogContent,
  DialogContentText,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Badge,
  styled, // Import TextField for the search bar
} from '@material-ui/core'
import { calculateAmount, calculateRepScore } from 'services/helper'

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -20,
    top: 0,
    border: `0px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

const VoteListDialog = (props) => {
  const { onClose, open, upvoteList, pendingPayout, voteRShares } = props
  const classes = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('reward') // Default sort by reward

  const sortOptions = [
    { label: 'Reward', value: 'reward' },
    { label: 'Time', value: 'time' },
    { label: 'Reputation', value: 'reputation' },
    { label: 'Percent', value: 'percent' },
  ]

  // Custom sorting function based on the selected criteria
  const customSort = (a, b) => {
    switch (sortBy) {
    case 'time':
      return new Date(a.time) - new Date(b.time)
    case 'reputation':
      return a.reputation - b.reputation
    case 'percent':
      return a.percent - b.percent
    default: // 'reward' or default case
      return calculateAmount(b.rshares, voteRShares, pendingPayout) - calculateAmount(a.rshares, voteRShares, pendingPayout)
    }
  }

  // Filter and sort the upvoteList based on the search term and selected sorting criteria
  const filteredAndSortedUpvoteList = upvoteList
    .filter(({ voter }) => voter.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort(customSort)

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth={true}
      maxWidth={'xs'}
      scroll={'paper'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle component="h4">
        <b>Votes({filteredAndSortedUpvoteList.length})</b>
      </DialogTitle>
      <DialogContent dividers={true}>
        {/* Search bar */}
        <TextField
          label="Search Voter"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />

        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
        >
          {filteredAndSortedUpvoteList.map(({ voter, percent, rshares, time, reputation }) => (
            <React.Fragment key={voter}>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar author={voter} alt={voter} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<React.Fragment>
                      <a className={classes.upvoteProfileLinks} href={`${window.location.origin}/@${voter}`} rel="noopener noreferrer">{voter}</a>
                      {/* <Badge badgeContent={calculateReputation(reputation)} color="secondary" /> */}
                      <StyledBadge badgeContent={calculateRepScore(reputation)} color="secondary" />
                    </React.Fragment>}
                    secondary={<React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ${calculateAmount(rshares, voteRShares, pendingPayout)} - {percent / 100}%
                      </Typography>
                    </React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </React.Fragment>
          ))}
        </DialogContentText>
      </DialogContent>

      {/* DialogActions with sorting controls */}
      <DialogActions>
        {/* Sort dropdown */}
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="sort-by">Sort By</InputLabel>
          <Select
            native
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
            inputProps={{
              name: 'sort-by',
              id: 'sort-by',
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </DialogActions>
    </Dialog>
  )
}

export default VoteListDialog
