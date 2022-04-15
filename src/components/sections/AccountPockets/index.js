import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { InfiniteList } from 'components'
import { createUseStyles } from 'react-jss'
import Add from '@material-ui/icons/Add'
import { IconButton, Menu, MenuItem, Tab, Tabs } from '@material-ui/core'
import CreatePocketModal from 'components/modals/CreatePocketModal'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import Tooltip from '@material-ui/core/Tooltip'
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded'
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded'
import DeletePocketConfirmModal from 'components/modals/DeletePocketConfirmModal'
import { useHistory } from 'react-router'

const useStyle = createUseStyles(theme => ({
  wrapper: {
    height: '100%',
    '& h6': {
      ...theme.font,
    },
  },
  createAPocket: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: 180,
    color: theme.font.color,

    '& .addPocketIcon': {
      width: 50,
      height: 50,
      padding: 10,
      borderRadius: '50%',
      backgroundColor: '#E61C34',
      color: '#ffffff',
      cursor: 'pointer',
    },

    '& .firstPocketLabel': {
      width: '100%',
      textAlign: 'center',
      color: theme.font.color,
      fontSize: '1.5em',
      fontWeight: 600,
    },
    '& .firstPocketDescription': {
      marginTop: 15,
      width: '100%',
      textAlign: 'center',
      color: theme.font.color,
      fontSize: '0.95em',
      opacity: 0.65,
    },
  },
  pocketIcon: {
    width: 'fit-content',
    padding: '2.5px 2.5px 5px 2.5px',
    background: '#E53935',
    borderRadius: '25px 25px 50px 50px',
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',

    '& .icon': {
      color: '#ffffff',
      fontSize: '3.5em',
    },
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: 180,
    color: theme.font.color,

    '& .noPocketsFoundText': {
      marginTop: 15,
      width: '100%',
      textAlign: 'center',
      color: theme.font.color,
      fontSize: '1.5em',
      fontWeight: 600,
      
      '@media (max-width: 480px)': {
        fontSize: '1.05em',
      },
    },

    '& .noBuzzesFoundText': {
      marginTop: 15,
      width: '100%',
      textAlign: 'center',
      color: 'theme.font.color',
      fontSize: '1.25em',
      fontWeight: 600,
    },
  },
  tabContainer: {
    position: 'relative',
    backgroundColor: `${theme.context.view.backgroundColor} !important`,
    '& .MuiTabs-centered': {
      justifyContent: 'flex-start !important',
    },
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
    '& .MuiTabScrollButton-root': {
      '& .MuiSvgIcon-fontSizeSmall': {
        color: theme.font.color,
        fontSize: '1.5em !important',
        fontWeight: 900,
      },
    },
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      ...theme.font,
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    background: `${theme.context.view.backgroundColor}`,
  },
  moreOptionsButton: {  
    '& .icon': {
      fontSize: 25,
      color: '#E61C34',
      borderRadius: 30,
      border: '2px solid #E61C34',
    },
    '& .iconUp': {
      fontSize: 25,
      color: '#ffffff',
      borderRadius: 30,
      background: '#E61C34',
    },
  },
  pocketsLoadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: 180,
  },
  addNewPocketButton: {
    position: 'absolute !important',
    right: 5,
    top: 0,
    bottom: 0,
    margin: 'auto',
    
    '& .addPocketButton': {
      color: '#e53935',
      fontSize: 25,
    },
  },
  pocketBuzzes: {
    height: '100%',
    minHeight: 350,
    width: '100%',
    color: theme.font.color,
    backgroundColor: theme.context.view.backgroundColor,
    display: 'grid',
    placeItems: 'center',
  },

  menu: {
    '& .MuiPaper-root': {
      background: theme.background.primary,
    },
    '& ul':{
      background: theme.background.primary,
    },
    '& li': {
      fontSize: 18,
      fontWeight: '600 !important',
      background: theme.background.primary,
      color: theme.font.color,

      '&:hover': {
        ...theme.context.view,
      },
    },
  },
}))

const AccountsPockets = (props) => {
  const {
    author,
    user,
  } = props

  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [openCreatePocketModal, setOpenCreatePocketModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [pockets, setPockets] = useState([])
  const [selectedPocket, setSelectedPocket] = useState({index: 0})
  const [pocketBuzzes, setPocketBuzzes] = useState([])
  const [openMoreOptions, setOpenMoreOptions] = useState(false)
  const [openDeletePocketModal, setOpenDeletePocketModal] = useState(false)
  const moreOptionsRef = useRef()
  
  const classes = useStyle()
  
  const updatePocketRoute = (id) => {
    if(id) {
      history.push(`/@${author}/t/pockets/${id}/`)
    } else {
      history.push(`/@${author}/t/pockets`)
    }
  }
  
  const loadPockets = (slug) => {
    setLoading(true)
    getUserCustomData(author)
      .then(res => {
        if(res[0]?.pockets?.length > 0) {
          // if has slug thenfind index else the index is 0
          const index = res[0].pockets.findIndex(obj => obj.pocketSlug === slug) >= 0 ? res[0].pockets.findIndex(obj => obj.pocketSlug === slug) : 0

          setUserData(res[0])
          setPockets([...res[0].pockets])
          setSelectedPocket({index, id: res[0].pockets[index].pocketId, name: res[0].pockets[index].pocketName, slug: res[0].pockets[index].pocketSlug})
          setPocketBuzzes(res[0].pockets[index]?.pocketBuzzes.reverse())
          updatePocketRoute(res[0].pockets[index].pocketSlug)
          setLoading(false)
        } else {
          setPockets([])
          setSelectedPocket({index: 0})
          setPocketBuzzes([])
          updatePocketRoute()
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    const pocketSlug = window.location.hash.split('/pockets/')[1]?.replaceAll('/', '')
    if(pocketSlug) {
      loadPockets(pocketSlug)
    } else {
      loadPockets()
    }
    // eslint-disable-next-line
  }, [])

  const handleSelectPocket = (pocket) => {
    loadPockets(pocket.pocketSlug)
  }

  const handleMoreOption = () => {
    setOpenMoreOptions(true)
  }

  const handleAddPocket = () => {
    setOpenMoreOptions(false)
    setOpenCreatePocketModal(true)
  }
  
  const handleDeletePocket = () => {
    setOpenDeletePocketModal(false)
    setLoading(true)

    const pocketsArray = [...pockets]
    const pocketIndex = selectedPocket.index

    if (pocketIndex > -1) {
      pocketsArray.splice(pocketIndex, 1)
    }

	  const customUserData = { username: user.username, userData: [{...userData, pockets: pocketsArray}] }

    updateUserCustomData(customUserData).then(() => {
      loadPockets(selectedPocket.slug)
    })
  }

  const handleOnClickDeletePocket = () => {
    setOpenMoreOptions(false)
    setOpenDeletePocketModal(true)
  }

  const PocketIcon = () => (
    <span className={classes.pocketIcon}><ExpandMoreRoundedIcon className='icon' /></span>
  )

  const PocketLoader = () => (
    <span className={classes.pocketIcon} style={{animation: 'pocketsLoader infinite 1s'}}><ExpandMoreRoundedIcon className='icon' /></span>
  )

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        {!loading ? pockets.length > 0
          ?
          <>
            <div className={classes.tabsContainer}>
              <Tabs
                value={selectedPocket.index}
                indicatorColor="primary"
                textColor="primary"
                centered
                className={classes.tabContainer}
                variant="scrollable"
                scrollButtons="auto"
              >
                {pockets.map((pocket) => (
                  <Tab key={pocket.pocketId} disableTouchRipple className={classes.tabs} label={pocket.pocketName} onClick={() => handleSelectPocket(pocket)} />
                ))}
              </Tabs>
              {author === user.username && <div>
                <Tooltip title="Options" placement='bottom-center' className={classes.moreOptionsButton}>
                  <IconButton onClick={handleMoreOption} ref={moreOptionsRef}>
                    {!openMoreOptions ? <ExpandMoreRoundedIcon className='icon' /> : <KeyboardArrowUpRoundedIcon className='iconUp' />}
                  </IconButton>
                </Tooltip>

                <Menu
                  style={{ zIndex: 3500 }}
                  anchorEl={() => moreOptionsRef.current}
                  open={openMoreOptions}
                  onClose={() => setOpenMoreOptions(false)}
                  className={classes.menu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  {pockets.length < 5 && <MenuItem onClick={handleAddPocket}>Create pocket</MenuItem>}
                  <MenuItem onClick={handleOnClickDeletePocket}>Delete pocket</MenuItem>
                </Menu>
              </div>}
            </div>
            {pocketBuzzes.length > 0 ?
              <InfiniteList loading={loading} items={pocketBuzzes} onScroll={() => {}} loadPockets={loadPockets}/> :
              <div className={classes.notFound}>
                <span className="noBuzzesFoundText">There are no buzzes in this pocket!</span>
              </div>}
          </>
          :
          author === user.username ?
            <div className={classes.createAPocket}>
              <IconButton onClick={() => setOpenCreatePocketModal(true)}>
                <Add className='addPocketIcon'/>
              </IconButton>
              <span className="firstPocketLabel">
                Create your first Pocket
              </span>
              <span className="firstPocketDescription">
                you don't have any pockets, create one to add buzzes
              </span>
            </div> :
            <div className={classes.notFound}>
              <PocketIcon />
              <span className='noPocketsFoundText'>{author} haven't created any pockets yet!</span>
            </div> :
          <div className={classes.pocketsLoadingContainer}>
            <PocketLoader />
          </div>}
      </div>
      <CreatePocketModal show={openCreatePocketModal} onHide={setOpenCreatePocketModal} user={user} pockets={pockets} loadPockets={loadPockets}/>
      <DeletePocketConfirmModal show={openDeletePocketModal} onHide={setOpenDeletePocketModal} pocket={selectedPocket.name} handleDeletePocket={handleDeletePocket} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps, null)(AccountsPockets)
