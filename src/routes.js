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
  AccountFollowers,
  AccountFollowing,
  Notification,
  Tags,
  Search,
  SearchPosts,
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
        path: '/notifications',
        exact: true,
        component: Notification,
      },
      {
        path: '/search/posts',
        component: Search,
        routes: [
          {
            path: '/search/posts',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/search/people',
            exact: true,
            component: AccountPosts,
          },
        ]
      },
      {
        path: '/tags',
        component: Tags,
      },
      {
        path: '/@:username/c/:permlink',
        exact: true,
        component: Content,
      },
      {
        path: '/ug/@:username',
        component: Profile,
        routes: [
          {
            path: '/ug/@:username/',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/ug/@:username/t/buzz',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/ug/@:username/t/replies',
            exact: true,
            component: AccountReplies,
          },
          {
            path: '/ug/@:username/t/followers',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/ug/@:username/t/following',
            exact: true,
            component: AccountFollowing,
          }
        ]
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
            path: '/@:username/t/buzz',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/@:username/t/replies',
            exact: true,
            component: AccountReplies,
          },
          {
            path: '/@:username/t/followers',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/@:username/t/following',
            exact: true,
            component: AccountFollowing,
          }
        ]
      },
    ]
  },
]

export default routes
