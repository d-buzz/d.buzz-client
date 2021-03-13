import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openFollowBlacklistsDialog } from 'store/interface/actions'
import { setAccountFollowedBlacklist } from "store/profile/actions"

const FollowBlacklistsButton = (props) => {
  const { 
    loading=false,
    disabled=false,
    label, 
    username, 
    openFollowBlacklistsDialog,
    setAccountFollowedBlacklist,
    followedBlacklist,
    style,
    successCallback=null,
  } = props

  const { pathname } = useLocation()
  const followBlacklistRoute = (pathname.match(/\/lists\/blacklisted\/followed/g))

  const followUserBlacklist = () => {
    openFollowBlacklistsDialog(username, followBlacklistsSuccessCallback)
  }

  const followBlacklistsSuccessCallback = () => {
    if(successCallback){
      successCallback()
    }else{
      if(followBlacklistRoute){
        const oldList = [...followedBlacklist]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1) 
          setAccountFollowedBlacklist(oldList)
        }
      }
    }
  }

  return (
    <React.Fragment>
      <ContainedButton
        fontSize={14}
        loading={loading}
        disabled={loading || disabled}
        style={style}
        transparent={true}
        label={label}
        onClick={followUserBlacklist}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  followedBlacklist: state.profile.get('followedBlacklist'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openFollowBlacklistsDialog,
    setAccountFollowedBlacklist,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowBlacklistsButton)
