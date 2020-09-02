import React from 'react'

const ThemeProvider = (props) => {
  const { children } = props

  return (
    <React.Fragment>
      <div>
        {children}
      </div>
    </React.Fragment>
  )
}

export default ThemeProvider
