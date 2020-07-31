import {
  AppFrame,
  Home,
  Trending,
  Profile,
  Content,
  Latest,
  Login,
  AccountPosts,
} from 'components'

const routes =  [
  {
    component: AppFrame,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home
      },
      {
        path: '/login',
        exact: true,
        component: Login,
      },
      {
        path: '/ug/@:username/:permlink',
        exact: true,
        component: Content,
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
        routes: [
          {
            path: '/@:username/',
            exact: true,
            component: AccountPosts,
          }
        ]
      },
      {
        path: '/content/@:username/:permlink',
        exact: true,
        component: Content,
      }
    ]
  },
]

export default routes
