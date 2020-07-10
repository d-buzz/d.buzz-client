import React from 'react'
import routes from './routes'
import {
  Switch,
  Route,
} from 'react-router-dom'
import { withRouter } from 'react-router'
import { AppFrame } from 'components'

const RouteWithSubRoutes = (route) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}


const App = (props) => {
  return (
    <React.Fragment> 
      <AppFrame>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </AppFrame> 
    </React.Fragment>
  )
}

export default withRouter(App)