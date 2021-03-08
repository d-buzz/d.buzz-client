import React, { useEffect, useState } from "react"
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Popover } from '@material-ui/core'
import { connect } from 'react-redux'


const EmojiPicker = (props) => {
  const { 
    open, 
    anchorEl, 
    handleAppendContent,
    handleClose,
    theme,
  } = props

  const { mode } = theme
  const [pickerTheme, setPickerTheme] = useState('light')

  useEffect(() => {
    if(mode === "light"){
      setPickerTheme(mode)
    }else{
      setPickerTheme("dark")
    }
  }, [mode])

  const handleSelectEmoji = (emoji) => {
    if(emoji){
      if(emoji.native){
        handleAppendContent(emoji.native)
      }else{
        handleAppendContent(emoji.colons)
      }
    }
  }

  return (
    <React.Fragment>
      <Popover
        id="emoji-picker"
        open={open} 
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <Picker 
          theme={pickerTheme}
          title='Pick your emoji…' 
          onSelect={handleSelectEmoji}
          emoji=""
          color="#e61c34"
          sheetSize={32}
          autoFocus
        />
      </Popover>
    </React.Fragment>
  )
}


const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps, {})(EmojiPicker)