import React, {useEffect, useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import {Avatar} from 'components/elements'
import {createUseStyles} from 'react-jss'
import { getActiveVotesRequest } from 'store/posts/actions'
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
  styled,
  InputBase, NativeSelect, Breadcrumbs,
} from '@material-ui/core'
import {calculateAmount, calculatePayout, calculateRepScore} from 'services/helper'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import moment from "moment/moment"
import MenuItem from "@material-ui/core/MenuItem"
import Skeleton from "react-loading-skeleton"

const useStyles = createUseStyles(theme => ({
  votelist: {
    fontSize: 12,
  },
  voteListTheme: {
    ...theme,
  },
  upvoteWrapper: {
    // width: 220,
    // height: '90%',
    // marginTop: -10,
    background: theme.background.primary,
  },
  upvoteInnerWrapper: {
    margin: '0 auto',
    // width: '85%',
    // marginBottom: 10,
  },
  upvoteListWrapper: {
    width: '100%',
    maxWidth: 360,
    borderColor: '#657786',
  },
  upvoteProfileLinks: {
    fontSize: 15,
    color: '#d32f2f',
    '&:hover': {
      color: '#d32f2f',
    },
  },
  upvoteSubTitleList: {
    color: theme.font.color,
    '&:hover': {
      color: theme.font.color,
    },
  },
  upvoteDialogTitle: {
    backgroundColor: theme.background.primary,
    ...theme.font,
  },
  upvoteBgColor: {
    backgroundColor: theme.background.primary,
  },
}))

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))

const StyledBadge = styled(Badge)(({theme}) => ({
  '& .MuiBadge-badge': {
    right: -20,
    // top: 0,
    // border: `1px solid ${theme.palette.background.paper}`,
    // padding: '0 4px',
  },
}))

const VoteListDialog = (props) => {
  const {
    onClose,
    open,
    permlink,
    author,
    getActiveVotesRequest,
    netRshares,
    payout,
  } = props

  const classes = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('reward') // Default sort by reward
  const [upvoteList, setUpvoteList] = useState([])
  const [loading, setLoading] = useState(true)

  const sortOptions = [
    {label: 'Reward', value: 'reward'},
    {label: 'Time', value: 'time'},
    {label: 'Reputation', value: 'reputation'},
    {label: 'Percent', value: 'percent'},
  ]

  useEffect(() => {
    if (open) {
      setLoading(true)
      getActiveVotesRequest(author, permlink)
        .then((response) => {
          setUpvoteList(response)
        })
        .finally(() => {
          setLoading(false)
        })
    }

  }, [open])

  // Custom sorting function based on the selected criteria
  const customSort = (a, b) => {
    switch (sortBy) {
    case 'time':
      return  new Date(b.time) - new Date(a.time)
    case 'reputation':
      return b.reputation - a.reputation
    case 'percent':
      return b.percent - a.percent
    default: // 'reward' or default case
      return calculateAmount(b.rshares, netRshares, payout) - calculateAmount(a.rshares, netRshares, payout)
    }
  }

  // Filter and sort the upvoteList based on the search term and selected sorting criteria
  const filteredAndSortedUpvoteList = upvoteList
    .filter(({voter}) => voter.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <DialogTitle
        component="h4"
        className={classes.upvoteDialogTitle}
      >
        <b>Votes({filteredAndSortedUpvoteList.length})</b>
      </DialogTitle>
      <DialogContent
        dividers={true}
        className={classes.upvoteDialogTitle}
      >
        {/* Search bar */}
        <TextField
          label="Search Voter"
          variant="outlined"
          fullWidth
          color="primary"
          focused
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          sx={{
            borderColor: '#ffffff',
            color: '#fff',
          }}
        />

        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
        >
          {loading ? (
            <React.Fragment>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </React.Fragment>
          ) : (filteredAndSortedUpvoteList.map(({voter, percent, rshares, time, reputation}) => (
            <React.Fragment key={voter}>
              <List className={classes.upvoteDialogTitle}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar author={voter} alt={voter}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<React.Fragment>
                      <a
                        className={classes.upvoteProfileLinks}
                        href={`${window.location.origin}/@${voter}`}
                        rel="noopener noreferrer">
                        {voter}
                      </a>
                      <StyledBadge badgeContent={calculateRepScore(reputation)} color="secondary"/>
                    </React.Fragment>}
                    secondary={<React.Fragment>
                      <Typography
                        // sx={{display: 'inline'}}
                        component="span"
                        className={classes.upvoteDialogTitle}
                        variant="subtitle2"
                      >
                        <Breadcrumbs separator="-" aria-label="breadcrumb" className={classes.upvoteDialogTitle}>
                          <Typography>${calculateAmount(rshares, netRshares, payout)}</Typography>
                          <Typography>{percent / 100}%</Typography>
                          <Typography title={moment(time).local().format('dddd, MMMM D, YYYY h:mm:ss a')}>
                            {!time.endsWith('Z') ? moment(`${time}Z`).local().fromNow() : moment(time).local().fromNow()}
                          </Typography>
                        </Breadcrumbs>
                      </Typography>
                    </React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li"/>
              </List>
            </React.Fragment>
          )))}
        </DialogContentText>
      </DialogContent>

      {/* DialogActions with sorting controls */}
      <DialogActions className={classes.upvoteDialogTitle}>
        {/* Sort dropdown */}
        <FormControl>
          <InputLabel htmlFor="sort-by" className={classes.upvoteSubTitleList}>Sort By</InputLabel>
          <NativeSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
            defaultValue={'reward'}
            inputProps={{
              name: 'sort-by',
              id: 'sort-by',
            }}
            input={<BootstrapInput />}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getActiveVotesRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(VoteListDialog)
