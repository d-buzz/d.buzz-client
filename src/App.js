import React from 'react'
import routes from './routes'
import {
  Switch,
  Route,
} from 'react-router-dom'
import { withRouter } from 'react-router'

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
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </React.Fragment>
  )
}

export default withRouter(App)