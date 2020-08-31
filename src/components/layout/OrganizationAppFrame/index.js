import React from 'react'
import { renderRoutes } from 'react-router-config'

const OrganizationAppFrame = (props) => {
  const { 
    route,
   } = props

  return (
    <React.Fragment>
      {renderRoutes(route.routes)}
    </React.Fragment>
  )
}

export default OrganizationAppFrame