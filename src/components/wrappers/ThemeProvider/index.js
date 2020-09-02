import React from 'react'

const ThemeProvider = (props) => {
  const { children } = props

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

export default ThemeProvider
