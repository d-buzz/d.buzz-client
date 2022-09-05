import React from 'react'
import { default as MatTextField } from '@material-ui/core/TextField'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  root: {
    "& .MuiIconButton-label": {
      color: theme.textArea.color,
    },
    "& .MuiInputLabel-outlined": {
      color: "rgb(136, 153, 166)",
    },
    "& label.Mui-focused": {
      color: theme.textArea.color,
    },
    "& .MuiOutlinedInput-root": {
      color: theme.textArea.color,
      fontSize: 15,
      fontFamily: 'Segoe-Bold',
      "& fieldset": {
        borderColor: "rgb(61, 84, 102)",
      },
      "&:hover fieldset": {
        borderColor: "rgb(61, 84, 102)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.textArea.color,
      },
    },
  },
}))

const TextField = (props) => {
  const { 
    label,
    variant="outlined",
    ...otherProps
  } = props

  const classes = useStyles()
    
  return (
    <MatTextField 
      variant={variant} 
      label={label}
      classes={{root: classes.root }}
      {...otherProps}
    />)
}

export default TextField