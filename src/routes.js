import {
  Home,
  Trending,
  Profile,
  Content,
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
