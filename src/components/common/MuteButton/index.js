import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { ContainedButton } from 'components/elements'
import { openMuteDialog, setAccountSearchListKeyword } from 'store/interface/actions'
import { setAccountMutedList, setAccountListSearchkey, setMuteListUnfiltered } from "store/profile/actions"
import { setMuteList } from "store/auth/actions"

const MuteButton = (props) => {
  const { 
    loading,
    label, 
    username, 
    openMuteDialog,
    setAccountMutedList,
    mutedList,
    disabled=false,
    style,
    successCallback=null,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
    setMuteList,
    setMuteListUnfiltered,
    mutedListAll,
  } = props

  const { pathname } = useLocation()
  const mutedListRoute = (pathname.match(/\/lists\/muted\/users/g))

  const unmuteUser = () => {
    openMuteDialog(username, muteSuccessCallback)
  }

  const muteSuccessCallback = () => {
    if(successCallback){
      successCallback()
    }else{
      if(mutedListRoute){
        const newData = {
          blacklist_description: "",
          muted_list_description: "",
          name: username,
        }
        const oldList = [...mutedList]
        const index = oldList.findIndex(item => item.name === username)
        if(index !== -1){
          oldList.splice(index,1)
          setAccountMutedList(oldList)
          setMuteList(oldList)
        }else{
          const newList = [newData, ...mutedList]
          setAccountMutedList(newList)
        }

        const oldListAll = [...mutedListAll]
        const index1 = oldListAll.findIndex(item => item.name === username)
        if(index1 !== -1){
          oldListAll.splice(index1,1)
          setMuteListUnfiltered(oldListAll)
        }else{
          const newListAll = [newData, ...mutedListAll]
          setMuteListUnfiltered(newListAll)
        }
        setAccountSearchListKeyword('')
        setAccountListSearchkey('muted','', true)
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
        onClick={unmuteUser}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  mutedList: state.profile.get('mutedList'),
  mutedListAll: state.profile.get('mutedListAll'),
})


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    openMuteDialog,
    setAccountMutedList,
    setAccountSearchListKeyword,
    setAccountListSearchkey,
    setMuteList,
    setMuteListUnfiltered,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)
