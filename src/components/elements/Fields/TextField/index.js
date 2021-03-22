import React from 'react'
import { TextField as MatTextField } from '@material-ui/core'

const TextField = (props) => {
  const { variant } = props
    
  return (<MatTextField variant={variant} />)
}

export default TextField