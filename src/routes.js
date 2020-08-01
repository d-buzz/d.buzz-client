import {
  AppFrame,
  Home,
  Trending,
  Profile,
  Content,
  Latest,
  Login,
  AccountPosts,
  AccountReplies,
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
        path: '/ug/@:username/c/:permlink',
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
        path: '/@:username/c/:permlink',
        exact: true,
        component: Content,
      },
      {
        path: '/@:username',
        component: Profile,
        routes: [
          {
            path: '/@:username/',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/@:username/t/0/',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/@:username/t/1/',
            exact: true,
            component: AccountReplies,
          }
        ]
      },
    ]
  },
]

export default routes
