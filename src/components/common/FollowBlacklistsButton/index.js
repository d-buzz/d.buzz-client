import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openFollowBlacklistsDialog, setAccountSearchListKeyword } from 'store/interface/actions'
import { setAccountFollowedBlacklist, setAccountListSearchkey, setFollowBlacklistUnfiltered } from "store/profile/actions"

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
    setAccountSearchListKeyword,
    setAccountListSearchkey,
    setFollowBlacklistUnfiltered,
    followedBlacklistAll,

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
        const newData = {
          blacklist_description: "",
          muted_list_description: "",
          name: username,
        }
        const oldList = [...followedBlacklist]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1) 
          setAccountFollowedBlacklist(oldList)
        }else{
          const newList = [newData, ...followedBlacklist]
          setAccountFollowedBlacklist(newList)
        }

        const oldListAll = [...followedBlacklistAll]
        const index1 = oldListAll.findIndex(item => item.name === username)
        if(index1 !== -1){
          oldListAll.splice(index1,1) 
          setFollowBlacklistUnfiltered(oldListAll)
        }else{
          const newList = [newData, ...followedBlacklistAll]
          setFollowBlacklistUnfiltered(newList)
        }
        setAccountSearchListKeyword('')
        setAccountListSearchkey('follow_blacklist','')
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
  followedBlacklistAll: state.profile.get('followedBlacklistAll'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openFollowBlacklistsDialog,
    setAccountFollowedBlacklist,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
    setFollowBlacklistUnfiltered,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowBlacklistsButton)
