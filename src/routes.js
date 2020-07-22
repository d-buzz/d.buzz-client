import {
  Home,
  Trending,
  Profile,
  Content,
  Latest,
} from 'components'

const routes =  [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/trending',
    exact: true,
    component: Trending,
  },
  {
    path: '/latest',
    exact: true,
    component: Latest,
  },
  {
    path: '/@:username',
    exact: true,
    component: Profile,
  },
  {
    path: '/content/@:username/:permlink',
    exact: true,
    component: Content,
  }
]

export default routes
